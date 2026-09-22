"""Import selected, version-pinned SVG assets. No package install or install scripts."""
import base64
import hashlib
import html
import io
import json
import re
import tarfile
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'icons'
PACKAGES = {
    'general': ('lucide-static', '1.47.0', 'sha512-yWIrkdXc688Feq5VjOktsKmV5Ikc7y5Nu3rrdtbr8nWjkJWk8QlnZfVtIak22Af+fNhZ7k4cTJpZo1zmj7X5sA==', 'https://github.com/lucide-icons/lucide', 'ISC + Feather MIT'),
    'brand': ('@lobehub/icons-static-svg', '1.95.0', 'sha512-VSObF66DUVQe0EK3xbIoFcw+Fcia1+bLVFkMsQbmz0zCceMxPmoLImS5VM5SM7zL+/NarZ11/ySNfkekcomIkQ==', 'https://github.com/lobehub/lobe-icons', 'MIT'),
}


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'ExplainerComponentStudio/1.0'}), timeout=60) as response:
        return response.read()


def validate_svg(raw):
    if b'<!ENTITY' in raw or b'<!DOCTYPE' in raw:
        raise ValueError('XML entity not allowed')
    root = ET.fromstring(raw)
    if root.tag.rsplit('}', 1)[-1] != 'svg' or 'viewBox' not in root.attrib:
        raise ValueError('Missing SVG viewBox')
    for node in root.iter():
        tag = node.tag.rsplit('}', 1)[-1]
        if tag.lower() in {'script', 'foreignobject', 'image', 'iframe', 'style', 'animate', 'set'}:
            raise ValueError('Active or external SVG content: ' + tag)
        for key, value in node.attrib.items():
            if key.lower().startswith('on'):
                raise ValueError('Event handler')
            if key.rsplit('}', 1)[-1] == 'href' and not value.startswith('#'):
                raise ValueError('External resource')
            if re.search(r'url\(\s*["\']?(?!#)[^\s]', value, re.I):
                raise ValueError('External CSS resource')
            if key == 'style' and re.search(r'background|@import|expression', value, re.I):
                raise ValueError('Background or active style')
    return root.attrib['viewBox']


def main():
    selections = json.loads((ROOT / 'scripts/icon-selections.json').read_text(encoding='utf-8'))
    packages, licenses, sources = {}, {}, {}
    for kind, (name, version, integrity, project, license_id) in PACKAGES.items():
        meta = json.loads(get(f'https://registry.npmjs.org/{name}/{version}'))
        archive = get(meta['dist']['tarball'])
        actual = 'sha512-' + base64.b64encode(hashlib.sha512(archive).digest()).decode()
        if actual != integrity:
            raise ValueError('Package integrity mismatch: ' + name)
        tf = tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz')
        packages[kind] = {m.name: tf.extractfile(m).read() for m in tf.getmembers() if m.isfile() and (m.name.endswith('.svg') or re.search(r'/LICENSE(?:\.txt|\.md)?$', m.name, re.I))}
        candidates = [v.decode('utf-8') for k, v in packages[kind].items() if re.search(r'/LICENSE(?:\.txt|\.md)?$', k, re.I)]
        license_url = None
        if not candidates and kind == 'brand':
            commit = meta.get('gitHead', '')
            if not re.fullmatch(r'[a-f0-9]{40}', commit):
                raise ValueError('Missing immutable upstream license revision')
            license_url = f'https://raw.githubusercontent.com/lobehub/lobe-icons/{commit}/LICENSE'
            candidates = [get(license_url).decode('utf-8')]
        if not candidates:
            raise ValueError('Missing package license: ' + name)
        licenses[kind] = '\n\n'.join(dict.fromkeys(candidates))
        sources[kind] = {'package': name, 'version': version, 'integrity': integrity, 'tarball': meta['dist']['tarball'], 'project': project, 'license': license_id}
        if license_url:
            sources[kind]['licenseUrl'] = license_url

    rows, files, missing, seen = [], [], [], set()
    for category, selection in selections.items():
        kind = 'brand' if category.startswith('AI') else 'general'
        source = sources[kind]
        for pair in selection.split('|'):
            slug, name = pair.split(':', 1)
            slug = slug.lower()
            if (kind, slug) in seen:
                continue
            seen.add((kind, slug))
            candidates = [('color', slug + '-color'), ('mono', slug), ('wordmark', slug + '-text')] if kind == 'brand' else [('outline', slug)]
            variants = []
            for style, asset in candidates:
                member = f'package/icons/{asset}.svg'
                if member not in packages[kind]:
                    continue
                raw = packages[kind][member]
                try:
                    viewbox = validate_svg(raw)
                except Exception as error:
                    raise ValueError(f'{slug}/{style}: {error}') from error
                src = f'assets/icons/{kind}/{asset}.svg'
                upstream = f'https://unpkg.com/{source["package"]}@{source["version"]}/icons/{asset}.svg'
                notice = f'Source: {upstream}\nProject: {source["project"]}\n\n{licenses[kind]}'
                svg = raw.decode('utf-8').replace('</svg>', '<metadata>' + html.escape(notice) + '</metadata></svg>')
                files.append((src, svg))
                variants.append({'id': style, 'label': {'color': '品牌彩色', 'mono': '单色标记', 'wordmark': '品牌字标', 'outline': '线性图标'}[style], 'src': src, 'viewBox': viewbox, 'sourceUrl': upstream, 'sha256': hashlib.sha256(svg.encode()).hexdigest(), 'upstreamSha256': hashlib.sha256(raw).hexdigest()})
            if not variants:
                missing.append(slug)
                continue
            if kind == 'brand' and slug == 'codex':
                # Upstream color asset is an app tile with a white plate; prefer the transparent mark.
                variants.sort(key=lambda v: v['id'] != 'mono')
                for variant in variants:
                    if variant['id'] == 'color':
                        variant['label'] = '彩色应用图标（含白色底板）'
            rows.append({'id': f'{kind}-{slug}', 'slug': slug, 'name': name, 'kind': kind, 'category': category, 'description': name + (' 公司 模型 产品 AI Logo 标志 人工智能' if kind == 'brand' else ' 通用图标 图形 符号'), 'variants': variants, 'src': variants[0]['src'], 'source': source['project'], 'license': source['license'], 'packageVersion': source['version']})
    if missing:
        raise ValueError('Selected icons not in pinned package: ' + ', '.join(missing))
    for src, content in files:
        path = ROOT / src
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content.encode('utf-8'))
    for kind, notice in licenses.items():
        (OUT / f'LICENSE-{kind}.txt').write_text(notice, encoding='utf-8')
    catalog = {'version': 1, 'packages': sources, 'icons': rows, 'assetCount': len(files)}
    (OUT / 'catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (ROOT / 'icon-data.mjs').write_text('export const iconCatalog=' + json.dumps(catalog, ensure_ascii=False, separators=(',', ':')) + ';\nexport const icons=iconCatalog.icons;\n', encoding='utf-8')
    print(json.dumps({'icons': len(rows), 'general': sum(r['kind'] == 'general' for r in rows), 'brands': sum(r['kind'] == 'brand' for r in rows), 'svgFiles': len(files)}, ensure_ascii=False))


if __name__ == '__main__':
    main()
