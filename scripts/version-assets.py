#!/usr/bin/env python3
import hashlib
import pathlib
import re

root = pathlib.Path(__file__).resolve().parent.parent
pattern = re.compile(r'((?:href|src|content)="(?:https://www\.kylerzook\.com/)?)'
                     r'([\w./-]+\.(?:css|js|svg|png|jpg|webp|gif))(?:\?v=[0-9a-f]+)?"')


def stamp(match):
    prefix, path = match.groups()
    file = root / path
    if not file.is_file():
        return match.group(0)
    digest = hashlib.sha256(file.read_bytes()).hexdigest()[:8]
    return f'{prefix}{path}?v={digest}"'


for page in root.glob("*.html"):
    html = page.read_text()
    updated = pattern.sub(stamp, html)
    if updated != html:
        page.write_text(updated)
