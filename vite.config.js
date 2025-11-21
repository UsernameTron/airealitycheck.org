import { defineConfig } from 'vite';
import { resolve } from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import compression from 'vite-plugin-compression';
import legacy from '@vitejs/plugin-legacy';
import { glob } from 'glob';

// Automatically find all HTML files for multi-page setup
const htmlFiles = glob.sync('**/*.html', {
    ignore: ['node_modules/**', 'dist/**', '_unused/**', '.git/**']
});

// Create input object for Rollup
const input = {};
htmlFiles.forEach(file => {
    const name = file.replace(/\.html$/, '').replace(/\//g, '-');
    input[name] = resolve(__dirname, file);
});

export default defineConfig({
    // Base public path - use './' for relative paths (GitHub Pages compatible)
    base: './',

    // Root directory
    root: './',

    // Build configuration
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,

        // Optimize bundle
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },

        // Code splitting
        rollupOptions: {
            input,
            output: {
                // Keep asset names clean
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split('.');
                    const ext = info[info.length - 1];
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
                        return `assets/images/[name]-[hash][extname]`;
                    } else if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
                        return `assets/fonts/[name]-[hash][extname]`;
                    }
                    return `assets/[name]-[hash][extname]`;
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
            }
        },

        // Asset handling
        assetsInlineLimit: 4096, // 4kb - inline smaller assets

        // Source maps for debugging
        sourcemap: false,

        // Chunk size warnings
        chunkSizeWarningLimit: 1000,
    },

    // Development server
    server: {
        port: 3000,
        open: '/',
        cors: true,

        // HMR configuration
        hmr: {
            overlay: true
        },

        // Watch options
        watch: {
            usePolling: false
        }
    },

    // Preview server (for testing production build)
    preview: {
        port: 8080,
        open: true
    },

    // Plugins
    plugins: [
        // Legacy browser support
        legacy({
            targets: ['defaults', 'not IE 11'],
        }),

        // Image optimization (optional - can be disabled if too slow)
        ViteImageOptimizer({
            png: {
                quality: 80,
            },
            jpeg: {
                quality: 85,
            },
            jpg: {
                quality: 85,
            },
            webp: {
                quality: 90,
            },
            test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
            // Only optimize images in specific directories
            include: /images\/(hero|articles|case-studies|creative|footer)/,
        }),

        // Gzip compression
        compression({
            algorithm: 'gzip',
            ext: '.gz',
            threshold: 10240, // Only compress files > 10kb
        }),

        // Brotli compression
        compression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 10240,
        }),
    ],

    // CSS configuration
    css: {
        devSourcemap: true,
    },

    // Resolve configuration
    resolve: {
        alias: {
            '@styles': resolve(__dirname, './css'),
            '@scripts': resolve(__dirname, './js'),
            '@images': resolve(__dirname, './images'),
            '@components': resolve(__dirname, './components'),
        }
    },

    // Optimization
    optimizeDeps: {
        include: ['gsap', 'motion'],
    },
});
