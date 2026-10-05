#!/usr/bin/env python3
"""Stamp local asset URLs in index.html with a content hash (?v=xxxxxxxx).

Browsers cache CSS/JS/images aggressively and GitHub Pages doesn't let us set
cache headers, so each reference carries a hash of the file it points to.
When a file changes, its URL changes, and returning visitors fetch the new one.
"""
import hashlib
import pathlib
import re

root = pathlib.Path(__file__).resolve().parent.parent
page = root / "index.html"
html = page.read_text()

pattern = re.compile(r'((?:href|src|content)="(?:https://www\.kylerzook\.com/)?)'
                     r'([\w./-]+\.(?:css|js|svg|png))(?:\?v=[0-9a-f]+)?"')

def stamp(match):
    prefix, path = match.groups()
    file = root / path
    if not file.is_file():
        return match.group(0)
    digest = hashlib.sha256(file.read_bytes()).hexdigest()[:8]
    return f'{prefix}{path}?v={digest}"'

updated = pattern.sub(stamp, html)
if updated != html:
    page.write_text(updated)
