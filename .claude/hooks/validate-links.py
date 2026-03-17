#!/usr/bin/env python3
"""PostToolUse hook: validates internal links in edited HTML files.

Reads hook input from stdin, checks if the edited file is HTML,
then scans all href/src attributes for broken internal references.
Exit code 2 = block (broken links found), 0 = pass.
"""
import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlparse, unquote

def get_edited_file(hook_input):
    """Extract the file path from Write or Edit tool input."""
    tool_input = hook_input.get("tool_input", {})
    return tool_input.get("file_path", "")

def find_internal_refs(html_content):
    """Extract all href and src values that look like internal paths."""
    refs = []
    # Match href="..." and src="..." (not http/https/mailto/tel/javascript/#)
    pattern = r'(?:href|src)\s*=\s*["\']([^"\']+)["\']'
    for match in re.finditer(pattern, html_content, re.IGNORECASE):
        url = match.group(1).strip()
        # Skip external URLs, anchors, data URIs, template vars
        if any(url.startswith(p) for p in (
            "http://", "https://", "mailto:", "tel:", "javascript:",
            "#", "data:", "{{", "${", "//"
        )):
            continue
        # Strip query string and fragment
        url = url.split("?")[0].split("#")[0]
        if url:
            refs.append(url)
    return refs

def resolve_path(ref, html_file_dir, project_root):
    """Resolve a relative reference to an absolute filesystem path."""
    ref = unquote(ref)
    if ref.startswith("/"):
        # Root-relative
        return project_root / ref.lstrip("/")
    else:
        # Relative to the HTML file's directory
        return (html_file_dir / ref).resolve()

def main():
    hook_input = json.load(sys.stdin)
    file_path = get_edited_file(hook_input)

    if not file_path or not file_path.endswith(".html"):
        sys.exit(0)

    file_path = Path(file_path)
    if not file_path.exists():
        sys.exit(0)

    # Determine project root from CLAUDE_PROJECT_DIR or file location
    project_root = Path(os.environ.get(
        "CLAUDE_PROJECT_DIR",
        str(file_path.parent)
    ))

    html_content = file_path.read_text(encoding="utf-8", errors="ignore")
    refs = find_internal_refs(html_content)

    broken = []
    for ref in refs:
        resolved = resolve_path(ref, file_path.parent, project_root)
        # Check file exists, or directory with index.html
        if not resolved.exists():
            if not (resolved / "index.html").exists():
                broken.append(ref)

    if broken:
        msg = f"Broken internal links in {file_path.name}:\n"
        for link in broken:
            msg += f"  - {link}\n"
        msg += "Fix these links before pushing."
        print(msg, file=sys.stderr)
        sys.exit(2)

    sys.exit(0)

if __name__ == "__main__":
    main()
