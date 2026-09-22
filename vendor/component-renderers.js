var ComponentLibraryRuntime = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // component-renderers-entry.mjs
  var component_renderers_entry_exports = {};
  __export(component_renderers_entry_exports, {
    appearancePresets: () => appearancePresets,
    applyStageAppearance: () => applyStageAppearance,
    assetBaseURL: () => assetBaseURL,
    backgroundStyles: () => backgroundStyles,
    buildEffect: () => buildEffect,
    createPreviewController: () => createPreviewController,
    frameStyles: () => frameStyles,
    mount: () => mount,
    mountNext: () => mountNext,
    normalizeAppearance: () => normalizeAppearance,
    normalizeMediaProps: () => normalizeMediaProps,
    resolveContentVariables: () => resolveContentVariables,
    validateSoundTiming: () => validateSoundTiming
  });

  // animation-style-primitives.mjs
  var tokens = Object.freeze({ ink: "#102b62", blue: "#167bf2", blueDark: "#0055c8", green: "#14866b", orange: "#f6a31a", ice: "#f7fcff", shadow: "#c7e2fa", purple: "#7255ca" });
  var num = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
  var safeColor = (v) => /^#[0-9a-f]{3,8}$/i.test(String(v)) ? String(v) : tokens.blue;
  function banner(x, y, w, label3, color5, h) {
    const c = safeColor(color5), id = h.uid("ani-banner");
    const textColor = c.toLowerCase() === tokens.orange.toLowerCase() ? tokens.ink : "white";
    const fs = Math.min(34, Math.max(18, (w - 34) / Math.max(1, Array.from(String(label3 ?? "")).length)));
    return `<g transform="translate(${num(x)} ${num(y)})" class="ani-banner"><defs><linearGradient id="${h.esc(id)}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".9"/></linearGradient></defs><rect x="4" y="5" width="${num(w)}" height="64" rx="17" fill="${tokens.shadow}"/><rect width="${num(w)}" height="64" rx="17" fill="url(#${h.esc(id)})" stroke="${tokens.ink}" stroke-width="3.5"/><rect x="5" y="5" width="${num(w) - 10}" height="54" rx="13" fill="none" stroke="#93d3ff" stroke-width="2" opacity=".8"/><path d="M17 10H${Math.min(75, w - 22)}M10 20Q10 10 22 10" fill="none" stroke="white" stroke-width="2.8" stroke-linecap="round" opacity=".7"/><text x="${num(w) / 2}" y="43" text-anchor="middle" fill="${textColor}" font-size="${fs}" font-weight="900" letter-spacing="1">${h.esc(label3 ?? "")}</text></g>`;
  }
  function paper(x, y, w, hgt, options = {}, h) {
    const f = Math.min(num(options.fold, 50), w * 0.24, hgt * 0.2), d = num(options.depth, 12);
    const shape = `M18 0H${w - f}L${w} ${f}V${hgt - 18}Q${w} ${hgt} ${w - 18} ${hgt}H18Q0 ${hgt} 0 ${hgt - 18}V18Q0 0 18 0Z`;
    const title = options.title ? banner((w - num(options.titleWidth, w * 0.6)) / 2, 20, num(options.titleWidth, w * 0.6), options.title, options.accent || tokens.blue, h) : "";
    return `<g transform="translate(${num(x)} ${num(y)})" class="ani-paper"><path d="${shape}" transform="translate(${d} ${d})" fill="${tokens.shadow}"/><path d="${shape}" fill="#fcfeff" stroke="${tokens.ink}" stroke-width="4" stroke-linejoin="round"/><path d="M${w - f - 3} 5H${w - f}L${w - 5} ${f + 3}V${hgt - 18}Q${w - 5} ${hgt - 5} ${w - 18} ${hgt - 5}H18Q5 ${hgt - 5} 5 ${hgt - 18}" fill="none" stroke="#d4ecff" stroke-width="5"/><path d="M${w - f} 0V${f - 11}Q${w - f} ${f} ${w - f + 11} ${f}H${w}Z" fill="#e4f3ff" stroke="${tokens.ink}" stroke-width="2.8" stroke-linejoin="round"/><path d="M${w - f + 6} 7L${w - 7} ${f - 5}H${w - f + 11}Q${w - f + 5} ${f - 5} ${w - f + 5} ${f - 12}Z" fill="#f5fbff"/>${title}${options.content || ""}</g>`;
  }
  function icon(kind, x, y, size, h) {
    const t = tokens, s2 = num(size, 80) / 100;
    let art = "";
    if (kind === "people") art = `<ellipse cx="50" cy="88" rx="47" ry="6" fill="${t.shadow}"/><g stroke="${t.ink}" stroke-width="3" stroke-linejoin="round"><circle cx="20" cy="39" r="12" fill="#12c6a0"/><path d="M4 76V68Q4 53 20 53T37 68V76Z" fill="#13bd96"/><circle cx="80" cy="39" r="12" fill="#ffb71b"/><path d="M63 76V68Q63 53 80 53T97 68V76Z" fill="#ffb71b"/><circle cx="50" cy="32" r="16" fill="#25a6fa"/><path d="M26 84V72Q26 50 50 50T75 72V84Z" fill="#249cf6"/></g><path d="M40 23Q48 18 54 23" fill="none" stroke="#8edbff" stroke-width="3" stroke-linecap="round"/>`;
    else if (kind === "documents") art = `<ellipse cx="50" cy="90" rx="46" ry="6" fill="${t.shadow}"/><g transform="rotate(-10 30 52)"><rect x="8" y="13" width="44" height="73" rx="5" fill="white" stroke="${t.ink}" stroke-width="3"/><g fill="${t.blue}"><circle cx="20" cy="34" r="3"/><circle cx="20" cy="48" r="3"/><circle cx="20" cy="62" r="3"/></g><path d="M29 33H42M29 47H42M29 61H39" stroke="${t.blue}" stroke-width="5" stroke-linecap="round"/></g><g transform="rotate(11 71 52)"><rect x="54" y="12" width="39" height="74" rx="5" fill="white" stroke="${t.ink}" stroke-width="3"/><g fill="${t.orange}"><circle cx="64" cy="32" r="3"/><circle cx="64" cy="47" r="3"/><circle cx="64" cy="62" r="3"/></g><path d="M73 32H84M73 47H84M73 62H83" stroke="${t.orange}" stroke-width="4.5" stroke-linecap="round"/></g>`;
    else if (kind === "calendar") art = `<ellipse cx="50" cy="89" rx="47" ry="6" fill="${t.shadow}"/><rect x="4" y="18" width="61" height="67" rx="6" fill="white" stroke="${t.ink}" stroke-width="3"/><path d="M5 37V23Q5 18 10 18H59Q64 18 64 23V37Z" fill="${t.orange}" stroke="${t.ink}" stroke-width="2.5"/><path d="M18 12V25M48 12V25" stroke="${t.ink}" stroke-width="7" stroke-linecap="round"/><path d="M18 12V25M48 12V25" stroke="#afcffa" stroke-width="3" stroke-linecap="round"/><path d="M16 48H52M16 60H52M16 72H42M27 43V77M40 43V77" stroke="${t.blue}" stroke-width="2" opacity=".65"/><circle cx="74" cy="64" r="25" fill="${t.blue}" stroke="${t.ink}" stroke-width="3"/><circle cx="74" cy="64" r="19" fill="white" stroke="#9ed6ff" stroke-width="2"/><path d="M74 49V64L83 73" fill="none" stroke="${t.orange}" stroke-width="3.5" stroke-linecap="round"/><circle cx="74" cy="64" r="3" fill="${t.ink}"/>`;
    else if (kind === "link") art = `<ellipse cx="50" cy="88" rx="37" ry="6" fill="${t.shadow}"/><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M43 60L32 71Q19 82 11 70Q4 60 14 49L29 34Q41 21 54 35" stroke="${t.ink}" stroke-width="14"/><path d="M57 41L68 30Q81 18 90 30Q97 41 86 52L72 67Q60 80 47 66" stroke="${t.ink}" stroke-width="14"/><path d="M43 60L32 71Q19 82 11 70Q4 60 14 49L29 34Q41 21 54 35M57 41L68 30Q81 18 90 30Q97 41 86 52L72 67Q60 80 47 66" stroke="${t.blue}" stroke-width="8"/><path d="M36 61L64 39" stroke="${t.ink}" stroke-width="14"/><path d="M36 61L64 39" stroke="#3ab4ff" stroke-width="8"/><path d="M17 52L31 38M65 59L83 41" stroke="#b9e7ff" stroke-width="2.3"/></g>`;
    else if (kind === "table") art = `<path d="M15 8H65L88 31V91H15Z" fill="white" stroke="${t.ink}" stroke-width="3"/><path d="M65 8V31H88" fill="#d4ecff" stroke="${t.ink}" stroke-width="2.5"/><rect x="25" y="37" width="53" height="42" rx="2" fill="#f5fcfa" stroke="${t.green}" stroke-width="2.5"/><path d="M25 48H78M25 58H78M25 68H78M42 37V79M61 37V79" stroke="${t.green}" stroke-width="2"/><path d="M25 38H77V47H25Z" fill="${t.green}"/>`;
    else if (kind === "check") art = `<circle cx="50" cy="50" r="35" fill="${t.green}" stroke="${t.ink}" stroke-width="3"/><path d="M31 50L44 63L69 36" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    else art = `<path d="M18 8H65L87 31V91H18Z" fill="white" stroke="${t.ink}" stroke-width="3"/><path d="M65 8V31H87" fill="#d4ecff" stroke="${t.ink}" stroke-width="2.5"/><path d="M30 45H73M30 57H73M30 69H65" fill="none" stroke="${t.blue}" stroke-width="5" stroke-linecap="round"/>`;
    return `<g transform="translate(${num(x)} ${num(y)}) scale(${s2})" class="ani-icon ani-icon-${h.esc(kind)}" aria-hidden="true">${art}</g>`;
  }
  function mountains(x, y, w, hgt, h) {
    const id = h.uid("ani-mountain-clip"), sky = h.uid("ani-sky"), lake = h.uid("ani-lake");
    const tree2 = (px, py, scale, color5) => `<g transform="translate(${px} ${py}) scale(${scale})"><path d="M0 0L-21 43H-13L-32 76H-20L-38 111H38L20 76H32L13 43H21Z" fill="${color5}" stroke="#137183" stroke-width="2" stroke-linejoin="round"/><path d="M0 77V121" stroke="#186475" stroke-width="5"/></g>`;
    return `<g transform="translate(${num(x)} ${num(y)})" class="ani-landscape"><defs><clipPath id="${h.esc(id)}"><rect width="${num(w)}" height="${num(hgt)}" rx="8"/></clipPath><linearGradient id="${h.esc(sky)}" x2="0" y2="1"><stop stop-color="#b8e5ff"/><stop offset="1" stop-color="#edfaff"/></linearGradient><linearGradient id="${h.esc(lake)}" x2="0" y2="1"><stop stop-color="#8edaff"/><stop offset="1" stop-color="#38b4e3"/></linearGradient></defs><g clip-path="url(#${h.esc(id)})"><g transform="scale(${num(w) / 1e3} ${num(hgt) / 650})"><rect width="1000" height="650" fill="url(#${h.esc(sky)})"/><circle cx="806" cy="113" r="36" fill="#fff1c9"/><path d="M38 164q13-29 42-20q6-48 48-47q38 0 45 40q28-11 45 27ZM637 108q11-26 35-17q7-40 40-40q35 0 42 39q21-8 34 18ZM829 209q15-36 46-25q10-53 53-51q34 2 41 44q22-6 32 32Z" fill="white" opacity=".95"/><path d="M0 387L117 303L173 348L288 207L419 361L543 152L635 260L691 231L812 357L892 272L1000 356V466H0Z" fill="#aed7f6" stroke="#529ad6" stroke-width="3"/><path d="M157 415L336 245L419 306L613 118L719 243L753 225L916 414Z" fill="#73b8e9" stroke="#367db6" stroke-width="3" stroke-linejoin="round"/><path d="M336 245L283 340L337 318L366 336L347 290L419 306L402 299Z" fill="#f6fdff"/><path d="M613 118L526 235L571 224L582 250L606 209L624 260L650 238L687 269L670 213L719 243Z" fill="#f8fdff"/><path d="M613 118L605 213L626 258L611 301L698 390L714 348L674 298L658 237Z" fill="#4299d5" opacity=".7"/><path d="M0 443Q104 358 189 387Q253 335 338 397Q424 340 509 403Q614 345 724 395Q861 326 1000 420V512H0Z" fill="#4eafc1"/><path d="M0 493Q142 425 247 468Q372 425 473 472Q641 410 783 466Q909 405 1000 450V534H0Z" fill="#2f96a8"/><path d="M0 499Q300 475 505 489Q740 480 1000 498V650H0Z" fill="url(#${h.esc(lake)})"/><path d="M78 510H380L330 521H609L539 536H763L719 548H423L453 565H250L211 577H695L743 589H364L402 605H832" fill="none" stroke="#d3f6ff" stroke-width="5" opacity=".85"/><path d="M613 500L556 591L611 572L640 611L710 550L682 500Z" fill="#c1eaff" opacity=".28"/><path d="M0 481Q43 437 96 456Q151 432 188 471L263 507H0Z" fill="#58b6a2" stroke="#1d7886" stroke-width="3"/><path d="M1000 455Q939 417 915 461Q858 451 836 484L732 521H1000Z" fill="#3faaa0" stroke="#1d7886" stroke-width="3"/>${tree2(37, 342, 1.15, "#168ca0")}${tree2(91, 391, 0.85, "#087b8b")}${tree2(137, 411, 0.64, "#168b85")}${tree2(946, 363, 1.1, "#087e8d")}${tree2(886, 417, 0.74, "#139a96")}<path d="M0 610Q25 560 63 581Q64 541 102 551Q132 554 146 589Q173 570 194 594Q231 579 276 620L336 650H0Z" fill="#319c90" stroke="#176f80" stroke-width="3"/><path d="M1000 573Q956 540 937 589Q889 567 873 611Q826 587 796 619L746 650H1000Z" fill="#218e89" stroke="#176f80" stroke-width="3"/><path d="M38 642L20 614M90 640L112 606M971 631L946 609" stroke="#5dc0a1" stroke-width="10" stroke-linecap="round"/></g></g><rect width="${num(w)}" height="${num(hgt)}" rx="8" fill="none" stroke="#70bbe8" stroke-width="2"/></g>`;
  }
  function gear(x, y, size, h) {
    const teeth = Array.from({ length: 10 }, (_, i) => `<rect x="43" y="4" width="14" height="21" rx="3" transform="rotate(${i * 36} 50 50)" fill="#badcff" stroke="${tokens.ink}" stroke-width="2.5"/>`).join("");
    return `<g transform="translate(${num(x)} ${num(y)}) scale(${num(size, 80) / 100})">${teeth}<circle cx="50" cy="50" r="30" fill="#badcff" stroke="${tokens.ink}" stroke-width="3"/><circle cx="50" cy="50" r="14" fill="white" stroke="${tokens.ink}" stroke-width="3"/></g>`;
  }
  function magnifier(x, y, size, h) {
    return `<g transform="translate(${num(x)} ${num(y)}) scale(${num(size, 100) / 100})"><path d="M65 65L92 92" stroke="${tokens.ink}" stroke-width="18" stroke-linecap="round"/><path d="M66 66L91 91" stroke="${tokens.blue}" stroke-width="11" stroke-linecap="round"/><circle cx="41" cy="41" r="35" fill="#ecf8ff" fill-opacity=".65" stroke="${tokens.ink}" stroke-width="10"/><circle cx="41" cy="41" r="35" fill="none" stroke="${tokens.blue}" stroke-width="5"/><path d="M17 34Q21 16 39 15" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/></g>`;
  }
  function svgScene(content2, h) {
    return `<section class="ani-scene"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" class="ani-canvas">${content2}</svg></section>`;
  }
  var css = `.ani-scene{width:100%;height:100%;position:relative;overflow:hidden;background:#fbfeff;color:${tokens.ink};font-family:ComponentHan,ComponentUI,"Microsoft YaHei",sans-serif}.ani-scene .ani-canvas{display:block;width:100%;height:100%;overflow:hidden}.ani-scene text{font-family:ComponentHan,ComponentUI,"Microsoft YaHei",sans-serif;font-weight:750}.ani-scene [data-ani-focus]{opacity:0}.ani-scene [data-ani-gear]{transform-box:fill-box}.ani-scene .ani-banner text{font-weight:900}`;

  // families/animation-style-analysis.mjs
  var units = (value) => Array.from(String(value ?? "")).reduce((n4, c) => n4 + (/[\u0000-\u00ff]/.test(c) ? 0.54 : 1), 0);
  var fit = (value, max, width, min = 16) => Math.max(min, Math.min(max, width / Math.max(1, units(value))));
  var scoped = (h, prefix) => {
    let n4 = 0;
    return { ...h, uid: (name) => h.uid(`${prefix}-${++n4}-${name}`) };
  };
  var text = (x, y, label3, size, h, extra2 = "") => `<text x="${x}" y="${y}" font-size="${size}" fill="${tokens.ink}" ${extra2}>${h.esc(label3 ?? "")}</text>`;
  var rowState = (r) => r.state || { "\u5DF2\u5B8C\u6210": "complete", "\u5DF2\u53D6\u6D88": "cancelled", "\u5F85\u4ED8\u6B3E": "pending" }[r.status] || r.status;
  var matches = (r, month, matchState = "complete") => rowState(r) === matchState && String(r.completedDate || "").startsWith(month + "-");
  var dateLabel = (v) => /^\d{4}-\d\d-\d\d$/.test(String(v)) ? String(v).slice(5) : String(v || "\u2014");
  function validateRows(rows3) {
    if (!Array.isArray(rows3) || rows3.length !== 5) throw new Error("animation order scenes require exactly five sample rows");
    if (rows3.some((r) => units(r.id) > 6 || units(r.status) > 5)) throw new Error("animation order row text exceeds readable field width");
  }
  function badge(x, y, w, label3, color5, h, height = 36) {
    const fs = Math.min(height * 0.64, fit(label3, 23, w - 14));
    return `<g><rect x="${x + 2}" y="${y + 3}" width="${w}" height="${height}" rx="11" fill="${tokens.shadow}"/><rect data-ani-status-bg x="${x}" y="${y}" width="${w}" height="${height}" rx="11" fill="${color5}" stroke="${tokens.ink}" stroke-width="1.5"/><path d="M${x + 11} ${y + 5}H${x + w - 14}" stroke="white" stroke-opacity=".27" stroke-width="2" stroke-linecap="round"/>${text(x + w / 2, y + height * 0.71, label3, fs, h, 'text-anchor="middle" style="fill:' + (color5 === tokens.orange || color5 === "#9aa3b1" ? tokens.ink : "white") + '"')}</g>`;
  }
  function sourceSheet(h, label3, note) {
    const rows3 = Array.from({ length: 11 }, (_, i) => Array.from({ length: 3 }, (_2, j) => `<rect x="${66 + j * 61}" y="${252 + i * 20}" width="51" height="12" rx="2" fill="${i >= 3 && i <= 7 ? "#aedcff" : "#dce8f2"}"/>`).join("")).join("");
    return `<g data-ani-enter>${paper(45, 218, 225, 296, { fold: 28, depth: 9 }, h)}${banner(63, 183, 186, label3, tokens.green, h)}${rows3}<rect x="59" y="307" width="198" height="103" rx="4" fill="none" stroke="${tokens.blue}" stroke-width="3" stroke-dasharray="7 5"/>${text(157, 548, note, 18, h, 'text-anchor="middle" fill="#55749b"')}</g>`;
  }
  var orderDefaults = {
    "title": "\u8868\u683C\u6807\u9898",
    "subtitle": "\u7B5B\u9009\u6761\u4EF6\u8BF4\u660E",
    "footer": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
    "month": "2026-01",
    "sourceLabel": "\u6765\u6E90\u8868\u683C",
    "headers": [
      "\u7F16\u53F7",
      "\u65E5\u671F A",
      "\u65E5\u671F B",
      "\u72B6\u6001"
    ],
    "rawHeader": "\u521D\u59CB\u7ED3\u679C",
    "finalHeader": "\u7B5B\u9009\u7ED3\u679C",
    "includedLabel": "\u4FDD\u7559",
    "excludedLabel": "\u6392\u9664",
    "rawCountLabel": "\u521D\u59CB\u8BB0\u5F55",
    "finalCountLabel": "\u7B26\u5408\u6761\u4EF6",
    "unit": "\u6761",
    "sampleNote": "\u7ED3\u679C\u8BF4\u660E",
    "rows": [
      {
        "id": "R01",
        "orderDate": "2026-01-01",
        "completedDate": "2026-01-03",
        "status": "\u72B6\u6001 A",
        "state": "complete"
      },
      {
        "id": "R02",
        "orderDate": "2026-01-02",
        "completedDate": "2026-01-04",
        "status": "\u72B6\u6001 A",
        "state": "complete"
      },
      {
        "id": "R03",
        "orderDate": "2026-01-03",
        "completedDate": "2026-01-05",
        "status": "\u72B6\u6001 A",
        "state": "complete"
      },
      {
        "id": "R04",
        "orderDate": "2026-01-04",
        "completedDate": "",
        "status": "\u72B6\u6001 B",
        "state": "cancelled"
      },
      {
        "id": "R05",
        "orderDate": "2026-01-05",
        "completedDate": "",
        "status": "\u72B6\u6001 C",
        "state": "pending"
      }
    ],
    "sourceNote": "\u6765\u6E90\u8BF4\u660E",
    "periodLabel": "\u65F6\u95F4\u8303\u56F4",
    "matchState": "complete"
  };
  function renderOrder(p, helpers2) {
    validateRows(p.rows);
    if (!/^\d{4}-\d{2}$/.test(p.month)) throw new Error("month must use YYYY-MM");
    if (!Array.isArray(p.headers) || p.headers.length !== 4) throw new Error("order headers require four labels");
    const h = scoped(helpers2, "order"), e2 = h.esc;
    const x = 326, y = 180, width = 888, head = 58, rowH = 64, cols = [126, 157, 169, 180, 256];
    const starts = [x];
    cols.forEach((w, i) => starts.push(starts[i] + w));
    const count2 = p.rows.filter((r) => matches(r, p.month, p.matchState)).length;
    const header = p.headers.map((label3, i) => text(starts[i] + cols[i] / 2, y + 38, label3, fit(label3, 26, cols[i] - 16), h, 'text-anchor="middle"')).join("");
    const headLast = `<g data-ani-raw>${text(starts[4] + cols[4] / 2, y + 38, p.rawHeader, 26, h, 'text-anchor="middle"')}</g><g data-ani-final>${text(starts[4] + cols[4] / 2, y + 38, p.finalHeader, 26, h, 'text-anchor="middle"')}</g>`;
    const rows3 = p.rows.map((r, i) => {
      const yy = y + head + i * rowH, ok = matches(r, p.month, p.matchState), statusColor = rowState(r) === "complete" ? tokens.green : rowState(r) === "cancelled" ? "#9aa3b1" : tokens.orange;
      const cells = [r.id, dateLabel(r.orderDate), dateLabel(r.completedDate)].map((v, k) => text(starts[k] + cols[k] / 2, yy + 41, v, 28, h, 'text-anchor="middle"')).join("");
      const raw = `<g data-ani-raw><circle cx="${starts[4] + 57}" cy="${yy + 32}" r="11" fill="${tokens.blue}"/>${text(starts[4] + 86, yy + 41, p.includedLabel, 27, h)}</g>`;
      const final = `<g data-ani-final>${ok ? `<circle cx="${starts[4] + 57}" cy="${yy + 32}" r="11" fill="${tokens.green}"/>` : `<path d="M${starts[4] + 47} ${yy + 32}H${starts[4] + 67}" stroke="#727d8d" stroke-width="4" stroke-linecap="round"/>`}${text(starts[4] + 86, yy + 41, ok ? p.includedLabel : p.excludedLabel, 27, h)}</g>`;
      return `<g ${ok ? "data-ani-filtered" : "data-ani-excluded"}="${e2(r.id)}" data-text-panel="order-${i}" data-panel-bounds="${x} ${yy} ${width} ${rowH}"><rect data-ani-row-bg x="${x + 1}" y="${yy}" width="${width - 2}" height="${rowH}" fill="${i % 2 ? "#f4faff" : "#ffffff"}"/>${cells}${badge(starts[3] + 20, yy + 13, cols[3] - 40, r.status, statusColor, h)}${raw}${final}</g>`;
    }).join("");
    const grid = starts.slice(1, -1).map((xx) => `<path d="M${xx} ${y}V${y + head + 5 * rowH}"/>`).join("") + Array.from({ length: 5 }, (_, i) => `<path d="M${x} ${y + head + i * rowH}H${x + width}"/>`).join("");
    const countGroup = (which, label3, n4) => `<g data-ani-${which}><rect x="380" y="595" width="442" height="62" rx="20" fill="#e6f4ff" stroke="#6eaff6" stroke-width="2.5"/>${text(601, 636, label3 + " " + n4 + " " + p.unit, fit(label3 + " " + n4 + " " + p.unit, 28, 406), h, 'text-anchor="middle"')}</g>`;
    const content2 = `${sourceSheet(h, p.sourceLabel, p.sourceNote)}<path d="M258 307L310 238V516L258 410Z" fill="#cceaff" fill-opacity=".65" stroke="#89bffc" stroke-width="2"/>${paper(309, 139, 920, 437, { fold: 18, depth: 10 }, h)}${banner(337, 65, 440, p.title, tokens.blue, h)}${text(805, 101, p.month + " \xB7 " + p.periodLabel, 23, h)}${text(807, 130, p.subtitle, fit(p.subtitle, 19, 388), h)}<rect x="${x}" y="${y}" width="${width}" height="${head + 5 * rowH}" rx="13" fill="#fff" stroke="${tokens.ink}" stroke-width="3"/><path d="M${x + 13} ${y}H${x + width - 13}Q${x + width} ${y} ${x + width} ${y + 13}V${y + head}H${x}V${y + 13}Q${x} ${y} ${x + 13} ${y}Z" fill="#dceeff"/>${rows3}${header}${headLast}<g stroke="#7b97bf" stroke-width="1.3" fill="none">${grid}</g><rect x="${x}" y="${y}" width="${width}" height="${head + 5 * rowH}" rx="13" fill="none" stroke="${tokens.ink}" stroke-width="2.5"/>${countGroup("raw", p.rawCountLabel, p.rows.length)}${countGroup("final", p.finalCountLabel, count2)}<rect x="855" y="595" width="345" height="62" rx="20" fill="#e9f5ff" stroke="#91bdeb" stroke-width="2.5"/>${text(1027, 636, p.sampleNote, fit(p.sampleNote, 29, 310), h, 'text-anchor="middle"')}<g data-ani-pop>${text(778, 694, p.footer, fit(p.footer, 21, 910), h, 'text-anchor="middle" fill="#55749b"')}</g>`;
    return svgScene(content2, h);
  }
  var compareDefaults = {
    "title": "\u7ED3\u679C\u6807\u9898",
    "subtitle": "\u7ED3\u679C\u8BF4\u660E\u6587\u5B57",
    "footer": "\u603B\u7ED3\u8BF4\u660E\u6587\u5B57",
    "leftTitle": "\u6587\u6863\u6807\u9898",
    "rightTitle": "\u8868\u683C\u6807\u9898",
    "leftSteps": [
      "\u6B65\u9AA4 A",
      "\u6B65\u9AA4 B"
    ],
    "rightSteps": [
      "\u6B65\u9AA4 A",
      "\u6B65\u9AA4 B"
    ],
    "relationLabel": "\u5173\u7CFB\u8BF4\u660E",
    "sampleNote": "\u8865\u5145\u8BF4\u660E",
    "fields": [
      {
        "label": "\u5B57\u6BB5A",
        "text": "\u5185\u5BB9 A",
        "icon": "people"
      },
      {
        "label": "\u5B57\u6BB5B",
        "text": "\u5185\u5BB9 B",
        "icon": "documents"
      },
      {
        "label": "\u5B57\u6BB5C",
        "text": "\u5185\u5BB9 C",
        "icon": "calendar"
      },
      {
        "label": "\u5B57\u6BB5D",
        "text": "\u5185\u5BB9 D",
        "icon": "link"
      }
    ],
    "headers": [
      "\u7F16\u53F7",
      "\u65E5\u671F",
      "\u72B6\u6001",
      "\u7ED3\u679C"
    ],
    "month": "2026-01",
    "rows": [
      {
        "id": "R01",
        "orderDate": "2026-01-01",
        "completedDate": "2026-01-03",
        "status": "\u72B6\u6001 A",
        "state": "complete"
      },
      {
        "id": "R02",
        "orderDate": "2026-01-02",
        "completedDate": "2026-01-04",
        "status": "\u72B6\u6001 A",
        "state": "complete"
      },
      {
        "id": "R03",
        "orderDate": "2026-01-03",
        "completedDate": "2026-01-05",
        "status": "\u72B6\u6001 A",
        "state": "complete"
      },
      {
        "id": "R04",
        "orderDate": "2026-01-04",
        "completedDate": "",
        "status": "\u72B6\u6001 B",
        "state": "cancelled"
      },
      {
        "id": "R05",
        "orderDate": "2026-01-05",
        "completedDate": "",
        "status": "\u72B6\u6001 C",
        "state": "pending"
      }
    ],
    "includedLabel": "\u4FDD\u7559",
    "excludedLabel": "\u6392\u9664",
    "matchState": "complete"
  };
  function renderCompare(p, helpers2) {
    validateRows(p.rows);
    if (!Array.isArray(p.fields) || p.fields.length !== 4 || p.leftSteps?.length !== 2 || p.rightSteps?.length !== 2 || p.headers?.length !== 4) throw new Error("compare requires four fields, four headers and two steps per case");
    const h = scoped(helpers2, "compare");
    const leftFields = p.fields.map((r, i) => {
      const y2 = 131 + i * 57;
      return `<rect x="79" y="${y2}" width="467" height="52" rx="13" fill="#eaf5ff"/>${icon(r.icon, 87, y2 - 2, 53, h)}${text(159, y2 + 34, r.label + "\uFF1A" + r.text, fit(r.label + "\uFF1A" + r.text, 23, 372, 17), h)}`;
    }).join("");
    const x = 712, y = 135, width = 469, header = 39, rowH = 39, colW = [96, 111, 136, 126], starts = [x];
    colW.forEach((w, i) => starts.push(starts[i] + w));
    const hdr = p.headers.map((v, i) => text(starts[i] + colW[i] / 2, y + 27, v, fit(v, 20, colW[i] - 10), h, 'text-anchor="middle"')).join("");
    const rightRows = p.rows.map((r, i) => {
      const yy = y + header + i * rowH, ok = matches(r, p.month, p.matchState);
      return `<rect x="${x + 1}" y="${yy}" width="${width - 2}" height="${rowH}" fill="${i % 2 ? "#f4faff" : "#fff"}"/>${text(starts[0] + 48, yy + 27, r.id, 21, h, 'text-anchor="middle"')}${text(starts[1] + 55.5, yy + 27, dateLabel(r.completedDate), 21, h, 'text-anchor="middle"')}${badge(starts[2] + 13, yy + 5, colW[2] - 26, r.status, rowState(r) === "complete" ? tokens.green : rowState(r) === "cancelled" ? "#9aa3b1" : tokens.orange, h, 28)}${ok ? `<circle cx="${starts[3] + 26}" cy="${yy + 20}" r="7" fill="${tokens.green}"/>` : `<path d="M${starts[3] + 19} ${yy + 20}H${starts[3] + 33}" stroke="#788393" stroke-width="3"/>`}${text(starts[3] + 44, yy + 27, ok ? p.includedLabel : p.excludedLabel, 19, h)}`;
    }).join("");
    const grid = starts.slice(1, -1).map((xx) => `<path d="M${xx} ${y}V${y + header + 5 * rowH}"/>`).join("") + Array.from({ length: 5 }, (_, i) => `<path d="M${x} ${y + header + i * rowH}H${x + width}"/>`).join("");
    const left = `<g data-ani-enter>${paper(61, 88, 505, 305, { fold: 38, depth: 10 }, h)}${banner(143, 48, 332, p.leftTitle, tokens.blue, h)}${leftFields}</g>`;
    const right = `<g data-ani-enter>${paper(694, 88, 505, 305, { fold: 18, depth: 10 }, h)}${banner(770, 48, 350, p.rightTitle, tokens.blue, h)}<rect x="${x}" y="${y}" width="${width}" height="${header + 5 * rowH}" rx="7" fill="#dceeff" stroke="${tokens.ink}" stroke-width="2"/>${rightRows}${hdr}<g fill="none" stroke="#7b97bf" stroke-width="1">${grid}</g><rect x="${x}" y="${y}" width="${width}" height="${header + 5 * rowH}" rx="7" fill="none" stroke="${tokens.ink}" stroke-width="2"/>${text(1180, 387, p.sampleNote, 14, h, 'text-anchor="end" fill="#527094"')}</g>`;
    const steps = `<g data-ani-enter data-ani-compare-steps>${banner(84, 419, 209, p.leftSteps[0], tokens.green, h)}${banner(320, 419, 209, p.leftSteps[1], tokens.orange, h)}</g><g data-ani-enter data-ani-compare-steps>${banner(751, 419, 209, p.rightSteps[0], tokens.green, h)}${banner(987, 419, 209, p.rightSteps[1], tokens.orange, h)}</g>`;
    const links = `<g data-ani-compare-links fill="none" stroke="${tokens.blue}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path data-ani-flow-join d="M188.5 482V488Q188.5 495 195.5 495H306.5"/><path data-ani-flow-join d="M424.5 482V488Q424.5 495 417.5 495H306.5"/><path data-ani-flow-join d="M855.5 482V488Q855.5 495 862.5 495H973.5"/><path data-ani-flow-join d="M1091.5 482V488Q1091.5 495 1084.5 495H973.5"/><path data-ani-flow-trunk d="M306.5 495V500Q306.5 508 314.5 508H507Q515 508 515 516V526"/><path data-ani-flow-trunk d="M973.5 495V500Q973.5 508 965.5 508H773Q765 508 765 516V526"/></g>`;
    const bridge2 = `<g data-ani-flow-bridge fill="none"><path d="M638 625V643" stroke="${tokens.ink}" stroke-width="10"/><path d="M638 625V643" stroke="${tokens.blue}" stroke-width="5"/></g>`;
    const result = `<g data-ani-flow-result><rect x="412" y="530" width="466" height="104" rx="21" fill="${tokens.shadow}"/><rect x="405" y="523" width="466" height="104" rx="21" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="4"/><rect x="411" y="529" width="454" height="92" rx="16" fill="none" stroke="#83cbff" stroke-width="2"/><g data-text-panel="process-title" data-panel-bounds="405 523 466 51">${text(638, 567, p.title, fit(p.title, 40, 404), h, 'text-anchor="middle" style="fill:white"')}</g><rect x="420" y="574" width="435" height="38" rx="13" fill="#ecf9ff"/>${text(638, 601, p.subtitle, fit(p.subtitle, 25, 414), h, 'text-anchor="middle"')}${text(640, 514, p.relationLabel, 23, h, 'text-anchor="middle"')}</g>`;
    const footer2 = `<g data-ani-flow-footer>${banner(266, 641, 748, p.footer, tokens.green, h)}</g>`;
    return svgScene(`${left}${right}<g data-ani-compare-flow>${links}${bridge2}${result}${footer2}</g>${steps}`, h);
  }
  var components = [
    { id: "ani-order-filter", name: "\u52A8\u753B\u98CE \xB7 \u6761\u4EF6\u7B5B\u9009\u8868\u683C", category: "\u52A8\u753B\u98CE", description: "\u7528\u4E94\u6761\u793A\u4F8B\u8BB0\u5F55\u5C55\u793A\u6761\u4EF6\u7B5B\u9009\uFF1B\u663E\u793A\u6807\u7B7E\u4E0E\u7B5B\u9009\u72B6\u6001\u5206\u522B\u914D\u7F6E\uFF0C\u539F\u59CB\u8BB0\u5F55\u4FDD\u7559\u3002", width: 1280, height: 720, defaultEffect: "ani-order-select", defaults: orderDefaults, reference: { basis: "\u7528\u6237 V8 \u7684 S07/S08 \u9759\u6001\u5206\u955C\u4E0E M04 \u4E09\u6001\u677F\uFF0C\u539F\u751F SVG \u53EF\u7F16\u8F91\u91CD\u5EFA\u3002", source: "reports/animation-style/reference-review-v8/REVIEW.md", level: "reference-reconstruction" }, render(p, h) {
      return renderOrder({ ...orderDefaults, ...p }, h);
    } },
    { id: "ani-compare-extract", name: "\u52A8\u753B\u98CE \xB7 \u4E24\u4F8B\u5BF9\u7167\u4E0E\u5F52\u7EB3", category: "\u52A8\u753B\u98CE", description: "\u5E76\u6392\u5448\u73B0\u6587\u6863\u4E0E\u8868\u683C\uFF0C\u5148\u663E\u793A\u6B65\u9AA4\uFF0C\u518D\u7ED8\u5236\u6C47\u805A\u8FDE\u7EBF\uFF0C\u6700\u540E\u663E\u793A\u7ED3\u679C\u4E0E\u603B\u7ED3\u3002", width: 1280, height: 720, defaultEffect: "ani-diagram-build", defaults: compareDefaults, reference: { basis: "\u7528\u6237 V8 \u7684 S10 \u9759\u6001\u5206\u955C\u4E0E M05 \u4E0B\u884C\uFF0C\u539F\u751F SVG \u53EF\u7F16\u8F91\u91CD\u5EFA\u3002", source: "reports/animation-style/reference-review-v8/REVIEW.md", level: "reference-reconstruction" }, render(p, h) {
      return renderCompare({ ...compareDefaults, ...p }, h);
    } }
  ];

  // families/animation-style-atoms-controls.mjs
  var font = "font-family:'Microsoft YaHei','Segoe UI',sans-serif;font-weight:750";
  var units2 = (v) => [...String(v ?? "")].reduce((n4, c) => n4 + (/[\x00-\x7f]/.test(c) ? 0.55 : 1), 0);
  var num2 = (v, name, min, max) => {
    const n4 = Number(v);
    if (!Number.isFinite(n4) || n4 < min || n4 > max) throw Error(`${name} \u5FC5\u987B\u5728 ${min}\u2013${max} \u4E4B\u95F4\u3002`);
    return n4;
  };
  var choice = (v, allowed, name) => {
    if (!allowed.includes(v)) throw Error(`${name} \u652F\u6301 ${allowed.join(" / ")}\u3002`);
    return v;
  };
  var copy = (v, name, max = 80) => {
    const s2 = String(v ?? "");
    if (units2(s2) > max) throw Error(`${name} \u8FC7\u957F\uFF0C\u8BF7\u4F7F\u7528\u7B80\u77ED\u6587\u5B57\u3002`);
    return s2;
  };
  var colors = { blue: tokens.blue, green: tokens.green, orange: tokens.orange, neutral: "#e1eaf3" };
  function geo(p, minW = 80, minH = 38, extraBottom = 12) {
    const x = num2(p.x, "x", 0, 1240), y = num2(p.y, "y", 0, 700), w = num2(p.objectWidth, "objectWidth", minW, 1220), h = num2(p.objectHeight, "objectHeight", minH, 660);
    if (x + w + 12 > 1280 || y + h + extraBottom > 720) throw Error("\u90E8\u4EF6\u53CA\u5176\u6D45\u84DD\u539A\u5EA6\u8D85\u51FA\u9884\u89C8\u753B\u5E03\u3002");
    return { x, y, w, h };
  }
  function text2(h, x, y, value, size, maxWidth, extra2 = "", min = 16) {
    const s2 = copy(value, "\u6587\u5B57"), fs = Math.min(size, maxWidth / Math.max(1, units2(s2)));
    if (fs < min) throw Error("\u6587\u5B57\u5BBD\u5EA6\u4E0D\u8DB3\uFF0C\u8BF7\u52A0\u5BBD\u90E8\u4EF6\u6216\u7F29\u77ED\u6587\u5B57\u3002");
    return `<text x="${x}" y="${y}" font-size="${fs}" fill="${tokens.ink}" ${extra2}>${h.esc(s2)}</text>`;
  }
  var group = (type2, p, content2) => `<g data-atom="${type2}" data-atom-state="${String(p.state || p.mode || "normal")}" data-motion="item" transform="translate(${p.x} ${p.y})" style="${font}" fill="${tokens.ink}">${content2}</g>`;
  var canvas = (content2, name, h) => `<section class="ani-controls-stage"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${h.esc(name)}" style="${font};background:transparent" fill="${tokens.ink}">${content2}</svg></section>`;
  function panel(w, h, fill = "#fff", r = 14, depth = 7) {
    return `<rect x="${depth}" y="${depth + 1}" width="${w}" height="${h}" rx="${r}" fill="${tokens.shadow}"/><rect width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${tokens.ink}" stroke-width="3"/><path d="M7 ${h - r}Q7 ${h - 7} ${r} ${h - 7}H${w - r}Q${w - 7} ${h - 7} ${w - 7} ${h - r}" fill="none" stroke="#d5edff" stroke-width="3"/>`;
  }
  function symbol(kind, cx, cy, size, color5) {
    const s2 = size / 32;
    let d = "";
    if (kind === "check") d = '<path d="M5 16L13 24L27 7"/>';
    else if (kind === "plus") d = '<path d="M16 5V27M5 16H27"/>';
    else if (kind === "arrow") d = '<path d="M5 16H26M18 7L27 16L18 25"/>';
    else if (kind === "error") d = '<path d="M16 5V19M16 26h.01"/>';
    else if (kind === "play") return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${s2})"><path d="M9 5L27 16L9 27Z" fill="${color5}"/></g>`;
    else if (kind === "dot") return `<circle cx="${cx}" cy="${cy}" r="${size * 0.18}" fill="${color5}"/>`;
    else return "";
    return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${s2})" fill="none" stroke="${color5}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
  }
  function lock(cx, cy, size) {
    const s2 = size / 30;
    return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${s2})" fill="none" stroke="#527094" stroke-width="2.5" stroke-linecap="round"><rect x="6" y="13" width="18" height="14" rx="3"/><path d="M10 13V8a5 5 0 0 1 10 0v5"/><path d="M15 19v3"/></g>`;
  }
  var windowDefaults = {
    "x": 175,
    "y": 125,
    "objectWidth": 930,
    "objectHeight": 450,
    "title": "\u7A97\u53E3\u6807\u9898",
    "showControls": true,
    "chromeHeight": 52
  };
  function renderWindowAtom(props, h) {
    const p = { ...windowDefaults, ...props }, g2 = geo(p, 260, 140), ch = num2(p.chromeHeight, "chromeHeight", 36, 84);
    if (ch > g2.h - 50) throw Error("\u7A97\u53E3\u6807\u9898\u680F\u8FC7\u9AD8\u3002");
    const cr = Math.min(7, ch * 0.14), controls3 = p.showControls ? [0, 1, 2].map((i) => `<circle cx="${25 + i * (cr * 3.2)}" cy="${ch / 2}" r="${cr}" fill="#fff" stroke="${tokens.ink}" stroke-width="1.8"/>`).join("") : "";
    const chrome = `<path d="M18 0H${g2.w - 18}Q${g2.w} 0 ${g2.w} 18V${ch}H0V18Q0 0 18 0Z" fill="#66a8f1"/><path d="M1 ${ch}H${g2.w - 1}" stroke="${tokens.ink}" stroke-width="2.2"/>${controls3}${text2(h, g2.w - 22, ch * 0.66, p.title, Math.min(25, ch * 0.46), g2.w - (p.showControls ? 140 : 44), 'text-anchor="end"')}`;
    return group("window", g2, `${panel(g2.w, g2.h)}${chrome}<rect width="${g2.w}" height="${g2.h}" rx="14" fill="none" stroke="${tokens.ink}" stroke-width="3"/>`);
  }
  var tabsDefaults = {
    "x": 220,
    "y": 302,
    "objectWidth": 830,
    "objectHeight": 66,
    "tabs": [
      "\u6807\u7B7E\u9875 A",
      "\u6807\u7B7E\u9875 B",
      "\u6807\u7B7E\u9875 C"
    ],
    "activeTab": 0
  };
  function renderTabsAtom(props, h) {
    const p = { ...tabsDefaults, ...props }, g2 = geo(p, 240, 56);
    if (!Array.isArray(p.tabs) || p.tabs.length < 1 || p.tabs.length > 5) throw Error("\u6807\u7B7E\u680F\u652F\u6301 1\u20135 \u4E2A\u6807\u7B7E\u3002");
    const active = num2(p.activeTab, "activeTab", 0, p.tabs.length - 1);
    if (!Number.isInteger(active)) throw Error("activeTab \u5FC5\u987B\u4E3A\u6574\u6570\u3002");
    const gap = 9, tabW = (g2.w - 18 - gap * (p.tabs.length - 1)) / p.tabs.length;
    const tabs2 = p.tabs.map((value, i) => {
      const xx = 9 + i * (tabW + gap), yy = i === active ? 6 : 13, hh = g2.h - yy - 5, fill = i === active ? "#fff" : "#dceeff";
      return `<g data-atom-tab="${i}"><path d="M${xx} ${g2.h - 5}V${yy + 12}Q${xx} ${yy} ${xx + 12} ${yy}H${xx + tabW - 12}Q${xx + tabW} ${yy} ${xx + tabW} ${yy + 12}V${g2.h - 5}Z" fill="${fill}" stroke="${tokens.ink}" stroke-width="2"/>${text2(h, xx + tabW / 2, yy + hh * 0.62, value, Math.min(26, hh * 0.48), tabW - 26, 'text-anchor="middle"')}</g>`;
    }).join("");
    return group("tabs", g2, `<rect x="5" y="8" width="${g2.w}" height="${g2.h}" rx="12" fill="${tokens.shadow}"/><rect width="${g2.w}" height="${g2.h}" rx="12" fill="#94c6f8" stroke="${tokens.ink}" stroke-width="2.5"/>${tabs2}<path d="M1 ${g2.h - 5}H${g2.w - 1}" stroke="${tokens.ink}" stroke-width="2"/>`);
  }
  var addressDefaults = {
    "x": 230,
    "y": 307,
    "objectWidth": 810,
    "objectHeight": 64,
    "address": "www.example.com/page",
    "showLock": true
  };
  function renderAddressAtom(props, h) {
    const p = { ...addressDefaults, ...props }, g2 = geo(p, 220, 42), isLock = Boolean(p.showLock), left = isLock ? 60 : 24, fs = Math.min(26, g2.h * 0.39);
    return group("address", g2, `${panel(g2.w, g2.h, "#edf7ff", Math.min(17, g2.h * 0.27), 5)}${isLock ? lock(30, g2.h / 2, Math.min(29, g2.h * 0.47)) : ""}${text2(h, left, g2.h / 2 + fs * 0.34, p.address, fs, g2.w - left - 24, 'style="fill:#527094"')}`);
  }
  var buttonDefaults = {
    "x": 467,
    "y": 301,
    "objectWidth": 338,
    "objectHeight": 88,
    "label": "\u64CD\u4F5C\u6309\u94AE",
    "state": "normal",
    "accent": "blue",
    "icon": "play"
  };
  function renderButtonAtom(props, h) {
    const p = { ...buttonDefaults, ...props }, g2 = geo(p, 100, 42);
    choice(p.state, ["normal", "pressed", "disabled"], "state");
    choice(p.accent, Object.keys(colors), "accent");
    choice(p.icon, ["none", "play", "plus", "check", "arrow"], "icon");
    const disabled = p.state === "disabled", pressed = p.state === "pressed", fill = disabled ? "#dce5ef" : colors[p.accent], fg = disabled || p.accent === "orange" || p.accent === "neutral" ? tokens.ink : "#fff", offset = pressed ? 5 : 0, depth = pressed ? 2 : 8, r = Math.min(16, g2.h * 0.2), hasIcon = p.icon !== "none", size = Math.min(34, g2.h * 0.42), label3 = copy(p.label, "\u6309\u94AE\u6587\u5B57", 30), fs = Math.min(34, g2.h * 0.42, (g2.w - (hasIcon ? size + 55 : 34)) / Math.max(1, units2(label3)));
    if (fs < 16) throw Error("\u6309\u94AE\u6587\u5B57\u8FC7\u957F\u3002");
    const textW = units2(label3) * fs, total = textW + (hasIcon ? size + 15 : 0), begin = (g2.w - total) / 2;
    return group("button", { ...g2, state: p.state }, `<rect x="${depth}" y="${depth + offset}" width="${g2.w}" height="${g2.h}" rx="${r}" fill="${disabled ? "#ced9e5" : tokens.shadow}"/><g transform="translate(0 ${offset})"><rect width="${g2.w}" height="${g2.h}" rx="${r}" fill="${fill}" stroke="${tokens.ink}" stroke-width="3"/><rect x="6" y="6" width="${g2.w - 12}" height="${g2.h - 12}" rx="${Math.max(6, r - 4)}" fill="none" stroke="${disabled ? "#f4f8fb" : "#a5d9ff"}" stroke-width="2"/><path d="M17 12H${Math.min(g2.w - 17, 76)}" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="${disabled ? 0.45 : 0.65}"/>${hasIcon ? symbol(p.icon, begin + size / 2, g2.h / 2, size, fg) : ""}${text2(h, begin + (hasIcon ? size + 15 : 0), g2.h / 2 + fs * 0.34, label3, fs, textW + 1, `style="fill:${fg}"`)}</g>`);
  }
  var inputDefaults = {
    "x": 260,
    "y": 298,
    "objectWidth": 750,
    "objectHeight": 78,
    "value": "\u793A\u4F8B\u8F93\u5165\u5185\u5BB9",
    "placeholder": "\u8BF7\u8F93\u5165\u5185\u5BB9",
    "state": "input",
    "errorText": "\u8F93\u5165\u63D0\u793A\u6587\u5B57",
    "showCaret": true
  };
  function renderInputAtom(props, h) {
    const p = { ...inputDefaults, ...props };
    choice(p.state, ["empty", "input", "error"], "state");
    const g2 = geo(p, 220, 50, p.state === "error" ? 53 : 12), error = p.state === "error", empty2 = p.state === "empty", label3 = empty2 ? p.placeholder : p.value, fs = Math.min(29, g2.h * 0.37), right = error ? 58 : 28, fg = empty2 ? "#527094" : tokens.ink, stroke = error ? "#a85b08" : p.state === "input" ? tokens.blue : tokens.ink, s2 = copy(label3, "\u8F93\u5165\u6587\u5B57", 80);
    const fitted = Math.min(fs, (g2.w - 30 - right) / Math.max(1, units2(s2)));
    if (fitted < 18) throw Error("\u8F93\u5165\u6587\u5B57\u592A\u957F\uFF0C\u8BF7\u589E\u52A0\u5BBD\u5EA6\u3002");
    const lineEnd = Math.min(g2.w - right, 25 + units2(s2) * fitted + 5);
    return group("input", { ...g2, state: p.state }, `${panel(g2.w, g2.h, error ? "#fff8ed" : "#fff", 13, 6)}<rect width="${g2.w}" height="${g2.h}" rx="13" fill="none" stroke="${stroke}" stroke-width="${empty2 ? 2.6 : 3.4}"/>${text2(h, 25, g2.h / 2 + fitted * 0.34, s2, fitted, g2.w - 30 - right, `style="fill:${fg}"`, 18)}${p.showCaret && !empty2 && !error ? `<path d="M${lineEnd} ${g2.h * 0.26}V${g2.h * 0.73}" stroke="${tokens.blue}" stroke-width="2.5" stroke-linecap="round"/>` : ""}${error ? `${symbol("error", g2.w - 28, g2.h / 2, 28, "#8b4709")}${text2(h, 6, g2.h + 37, p.errorText, 21, g2.w - 12, 'style="fill:#8b4709"')}` : ""}`);
  }
  var statusDefaults = {
    "x": 495,
    "y": 304,
    "objectWidth": 280,
    "objectHeight": 76,
    "label": "\u5DF2\u5B8C\u6210",
    "state": "success",
    "showIcon": true
  };
  function renderStatusAtom(props, h) {
    const p = { ...statusDefaults, ...props }, g2 = geo(p, 110, 44);
    choice(p.state, ["success", "pending", "error", "neutral", "info"], "state");
    const look = { success: { fill: tokens.green, fg: "#fff", icon: "check" }, pending: { fill: tokens.orange, fg: tokens.ink, icon: "dot" }, error: { fill: "#ffe4c9", fg: tokens.ink, icon: "error" }, neutral: { fill: "#e1eaf3", fg: tokens.ink, icon: "dot" }, info: { fill: tokens.blue, fg: "#fff", icon: "dot" } }[p.state], label3 = copy(p.label, "\u72B6\u6001\u6587\u5B57", 22), size = Math.min(31, g2.h * 0.42), fs = Math.min(30, g2.h * 0.42, (g2.w - (p.showIcon ? size + 44 : 26)) / Math.max(1, units2(label3)));
    if (fs < 17) throw Error("\u72B6\u6001\u6807\u7B7E\u6587\u5B57\u8FC7\u957F\u3002");
    const total = units2(label3) * fs + (p.showIcon ? size + 10 : 0), left = (g2.w - total) / 2;
    return group("status", { ...g2, state: p.state }, `<rect x="5" y="7" width="${g2.w}" height="${g2.h}" rx="${g2.h / 2}" fill="${tokens.shadow}"/><rect width="${g2.w}" height="${g2.h}" rx="${g2.h / 2}" fill="${look.fill}" stroke="${tokens.ink}" stroke-width="2.6"/><path d="M${g2.h * 0.4} 9H${Math.min(g2.w - g2.h * 0.4, g2.h * 0.4 + 52)}" stroke="#fff" stroke-width="2.4" opacity=".5" stroke-linecap="round"/>${p.showIcon ? symbol(look.icon, left + size / 2, g2.h / 2, size, look.fg) : ""}${text2(h, left + (p.showIcon ? size + 10 : 0), g2.h / 2 + fs * 0.34, label3, fs, units2(label3) * fs + 1, `style="fill:${look.fg}"`)}`);
  }
  var checkboxDefaults = {
    "x": 377,
    "y": 304,
    "objectWidth": 526,
    "objectHeight": 76,
    "label": "\u9009\u9879\u540D\u79F0",
    "state": "checked"
  };
  function renderCheckboxAtom(props, h) {
    const p = { ...checkboxDefaults, ...props }, g2 = geo(p, 60, 38);
    choice(p.state, ["unchecked", "checked", "error"], "state");
    const side = Math.min(61, g2.h - 8), yy = (g2.h - side) / 2, checked = p.state === "checked", error = p.state === "error", fill = checked ? tokens.green : error ? "#fff1d9" : "#fff", r = Math.min(13, side * 0.19), label3 = copy(p.label, "\u52FE\u9009\u8BF4\u660E", 50), fontSize = Math.min(30, g2.h * 0.43), textSpace = g2.w - side - 29;
    let labelSvg = "";
    if (label3) {
      if (textSpace < 50) throw Error("\u52FE\u9009\u8BF4\u660E\u9700\u8981\u66F4\u5BBD\u7684\u90E8\u4EF6\u3002");
      labelSvg = text2(h, side + 26, g2.h / 2 + fontSize * 0.34, label3, fontSize, textSpace);
    }
    return group("checkbox", { ...g2, state: p.state }, `<rect x="5" y="${yy + 6}" width="${side}" height="${side}" rx="${r}" fill="${tokens.shadow}"/><rect y="${yy}" width="${side}" height="${side}" rx="${r}" fill="${fill}" stroke="${error ? "#9c600e" : tokens.ink}" stroke-width="3"/>${checked ? symbol("check", side / 2, g2.h / 2, side * 0.7, "#fff") : error ? symbol("error", side / 2, g2.h / 2, side * 0.6, "#915109") : ""}${labelSvg}`);
  }
  var cursorDefaults = {
    "x": 535,
    "y": 234,
    "objectWidth": 185,
    "objectHeight": 235,
    "mode": "pointer",
    "accent": "blue"
  };
  function renderCursorAtom(props, h) {
    const p = { ...cursorDefaults, ...props }, g2 = geo(p, 50, 70);
    choice(p.mode, ["pointer", "click"], "mode");
    choice(p.accent, ["blue", "green", "orange"], "accent");
    const scale = Math.min(g2.w / 200, g2.h / 240), dx = (g2.w - 200 * scale) / 2, dy = (g2.h - 240 * scale) / 2, shape = "M64 64L64 188L97 166L119 212L142 201L120 156L162 151Z";
    const click = p.mode === "click" ? `<circle cx="64" cy="64" r="39" fill="none" stroke="${colors[p.accent]}" stroke-width="4" opacity=".55"/><path d="M64 9V23M9 64H23M24 24L34 34M97 25L107 15" fill="none" stroke="${colors[p.accent]}" stroke-width="6" stroke-linecap="round"/>` : "";
    return group("cursor", { ...g2, mode: p.mode }, `<g transform="translate(${dx} ${dy}) scale(${scale})">${click}<path d="${shape}" transform="translate(7 8)" fill="${tokens.shadow}"/><path d="${shape}" fill="#fff" stroke="${tokens.ink}" stroke-width="4.7" stroke-linejoin="round"/><path d="M71 80V173L96 154L120 199" fill="none" stroke="${colors[p.accent]}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></g>`);
  }
  var reference = { basis: "\u4ECE\u5DF2\u786E\u8BA4\u7684\u84DD\u767D\u63D2\u753B\u98CE\u62C6\u5206\u7684\u72EC\u7ACB\u754C\u9762\u63A7\u5236\u90E8\u4EF6\uFF1B\u4F7F\u7528\u539F\u751F SVG\uFF0C\u72B6\u6001\u901A\u8FC7 props \u660E\u786E\u6307\u5B9A\u3002", source: "references/animation-style/sources.json", level: "designed" };
  var make = (id, name, description, defaults3, render) => ({ id, name, category: "\u52A8\u753B\u98CE \xB7 \u57FA\u7840\u7EC4\u4EF6", description, width: 1280, height: 720, defaultEffect: "none", defaults: defaults3, reference: { ...reference }, render(p, h) {
    return canvas(render({ ...defaults3, ...p }, h), name, h);
  } });
  var components2 = [
    make("ani-atom-window", "\u7A7A\u7A97\u53E3\u5916\u58F3", "\u4EC5\u4FDD\u7559\u7A97\u53E3\u8FB9\u6846\u3001\u6807\u9898\u680F\u548C\u53EF\u9009\u5706\u5F62\u63A7\u4EF6\uFF1B\u6B63\u6587\u533A\u7559\u7A7A\uFF0C\u5BBD\u9AD8\u76F4\u63A5\u91CD\u6392\uFF0C\u4E0D\u62C9\u4F38\u5B57\u6216\u5706\u3002", windowDefaults, renderWindowAtom),
    make("ani-atom-tabs", "\u6807\u7B7E\u680F", "1\u20135 \u4E2A\u6807\u7B7E\u3001\u5F53\u524D\u9009\u4E2D\u7D22\u5F15\u4E0E\u6574\u4F53\u5BBD\u9AD8\u53EF\u7F16\u8F91\uFF0C\u9002\u5408\u62FC\u5230\u7A97\u53E3\u4E0A\u6CBF\u3002", tabsDefaults, renderTabsAtom),
    make("ani-atom-address", "\u5730\u5740\u680F", "\u53EF\u7F16\u8F91\u5730\u5740\u6587\u5B57\u4E0E\u9501\u56FE\u6807\uFF1B\u53EA\u662F\u72EC\u7ACB\u56FE\u5F62\uFF0C\u4E0D\u8BBF\u95EE\u5730\u5740\u3002", addressDefaults, renderAddressAtom),
    make("ani-atom-button", "\u6309\u94AE", "\u5E38\u6001\u3001\u6309\u4E0B\u3001\u7981\u7528\uFF1B\u6309\u94AE\u6587\u5B57\u3001\u989C\u8272\u548C\u539F\u751F\u56FE\u6807\u53EF\u7F16\u8F91\uFF0C\u6309\u4E0B\u6001\u51CF\u5C11\u539A\u5EA6\u3002", buttonDefaults, renderButtonAtom),
    make("ani-atom-input", "\u8F93\u5165\u6846", "\u7A7A\u3001\u8F93\u5165\u3001\u9519\u8BEF\u4E09\u79CD\u72B6\u6001\uFF1B\u5360\u4F4D\u6587\u5B57\u3001\u8F93\u5165\u503C\u3001\u9519\u8BEF\u63D0\u793A\u548C\u9759\u6001\u5149\u6807\u53EF\u7F16\u8F91\u3002", inputDefaults, renderInputAtom),
    make("ani-atom-status", "\u72B6\u6001\u5FBD\u7AE0", "\u5B8C\u6210\u3001\u7B49\u5F85\u3001\u9519\u8BEF\u3001\u4E2D\u6027\u3001\u4FE1\u606F\u4E94\u79CD\u72B6\u6001\uFF1B\u6587\u5B57\u4E0E\u72B6\u6001\u56FE\u6807\u53EF\u72EC\u7ACB\u914D\u7F6E\u3002", statusDefaults, renderStatusAtom),
    make("ani-atom-checkbox", "\u52FE\u9009\u6846", "\u672A\u9009\u3001\u5DF2\u9009\u3001\u9519\u8BEF\u4E09\u79CD\u72B6\u6001\uFF0C\u8BF4\u660E\u6587\u5B57\u53EF\u4E3A\u7A7A\uFF1B\u65B9\u6846\u59CB\u7EC8\u7B49\u5BBD\u7B49\u9AD8\u3002", checkboxDefaults, renderCheckboxAtom),
    make("ani-atom-cursor", "\u5149\u6807", "\u6307\u9488\u4E0E\u70B9\u51FB\u4E24\u79CD\u9759\u6001\u5F62\u6001\uFF1B\u5149\u6807\u3001\u70B9\u51FB\u73AF\u7B49\u6BD4\u7F29\u653E\uFF0C\u4E0D\u62C9\u957F\u5706\u5F62\u6216\u7BAD\u5934\u3002", cursorDefaults, renderCursorAtom)
  ];

  // families/animation-style-atoms-data.mjs
  var tones = { blue: "#e9f4ff", green: "#e8f7f0", orange: "#fff3d9", gray: "#edf0f5" };
  var units3 = (s2) => [...String(s2)].reduce((n4, c) => n4 + (/[\x00-\x7f]/.test(c) ? 0.56 : 1), 0);
  var num3 = (v, min, max, name) => {
    const n4 = Number(v);
    if (!Number.isFinite(n4) || n4 < min || n4 > max) throw Error(`${name} \u9700\u8981\u5728 ${min}\u2013${max} \u4E4B\u95F4\u3002`);
    return n4;
  };
  function geom(p, minW) {
    const x = num3(p.x, 0, 1200, "x"), y = num3(p.y, 0, 650, "y"), w = num3(p.objectWidth, minW, 1220, "objectWidth"), height = num3(p.objectHeight, 80, 480, "objectHeight");
    if (x + w + 10 > 1280 || y + height + 10 > 720) throw Error("\u5BF9\u8C61\u9700\u5728\u753B\u5E03\u8303\u56F4\u5185\u3002");
    return { x, y, w, height };
  }
  function lines(text7, width, size) {
    const out = [];
    let line3 = "";
    for (const c of [...String(text7 ?? "")]) {
      if (units3(line3 + c) * size > width) {
        out.push(line3);
        line3 = "";
      }
      line3 += c;
    }
    if (line3) out.push(line3);
    if (out.length > 2) throw Error("\u5355\u5143\u683C\u6B63\u6587\u6700\u591A\u4E24\u884C\uFF0C\u8BF7\u52A0\u5BBD\u5355\u5143\u683C\u6216\u7F29\u77ED\u5185\u5BB9\u3002");
    return out;
  }
  function content(cell, x, w, height, h) {
    const c = typeof cell === "object" && cell !== null ? cell : { text: cell }, value = String(c.text ?? ""), size = Math.min(30, height * 0.3), ls = lines(value, w - 34, size), tone3 = tones[c.tone] || "#fff";
    return `<g data-atom-cell="true"><rect x="${x}" y="0" width="${w}" height="${height}" fill="${tone3}"/>${ls.map((s2, i) => `<text x="${x + w / 2}" y="${height / 2 + (i - (ls.length - 1) / 2) * size * 1.25 + size * 0.34}" text-anchor="middle" font-size="${size}" fill="${tokens.ink}">${h.esc(s2)}</text>`).join("")}</g>`;
  }
  var outer = (type2, g2, body) => `<g data-atom="${type2}" data-motion="item" transform="translate(${g2.x} ${g2.y})" font-family="Microsoft YaHei,Segoe UI,sans-serif" font-weight="750">${body}</g>`;
  var preview = (body) => `<section class="ani-data-atom"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">${body}</svg></section>`;
  var cellDefaults = {
    "x": 445,
    "y": 275,
    "objectWidth": 390,
    "objectHeight": 160,
    "text": "\u5355\u5143\u683C\u5185\u5BB9",
    "tone": "green",
    "selected": true
  };
  function renderCellAtom(props, h) {
    const p = { ...cellDefaults, ...props }, g2 = geom(p, 180);
    return outer("cell", g2, `<rect x="6" y="7" width="${g2.w}" height="${g2.height}" rx="10" fill="${tokens.shadow}"/>${content(p, 0, g2.w, g2.height, h)}<rect width="${g2.w}" height="${g2.height}" rx="2" fill="none" stroke="${p.selected ? tokens.blue : tokens.ink}" stroke-width="${p.selected ? 4 : 2.5}"/>${p.selected ? `<rect x="${g2.w - 5}" y="${g2.height - 5}" width="10" height="10" rx="2" fill="${tokens.blue}"/>` : ""}`);
  }
  var tableRowDefaults = {
    "x": 180,
    "y": 292,
    "objectWidth": 920,
    "objectHeight": 128,
    "cells": [
      {
        "text": "\u9879\u76EE A"
      },
      {
        "text": "\u5185\u5BB9 A"
      },
      {
        "text": "\u72B6\u6001 A",
        "tone": "green"
      },
      {
        "text": "\u7ED3\u679C A",
        "tone": "blue"
      }
    ],
    "weights": [
      1,
      1.2,
      1.3,
      1.2
    ],
    "selected": false
  };
  function renderTableRowAtom(props, h) {
    const p = { ...tableRowDefaults, ...props }, g2 = geom(p, 360);
    if (!Array.isArray(p.cells) || p.cells.length < 2 || p.cells.length > 6) throw Error("\u8868\u683C\u884C cells \u652F\u6301 2\u20136 \u4E2A\u5355\u5143\u683C\u3002");
    const weights = p.cells.map((_, i) => num3(p.weights?.[i] ?? 1, 0.5, 6, "\u5217\u5BBD\u6BD4\u4F8B")), total = weights.reduce((a2, b2) => a2 + b2, 0);
    let x = 0;
    const cells = p.cells.map((c, i) => {
      const w = g2.w * weights[i] / total;
      if (w < 82) throw Error("\u5355\u5143\u683C\u8FC7\u7A84\uFF0C\u8BF7\u589E\u52A0\u6574\u884C\u5BBD\u5EA6\u3002");
      const markup = content(c, x, w, g2.height, h) + (i ? `<path d="M${x} 0V${g2.height}" stroke="#8ba7ce" stroke-width="1.5"/>` : "");
      x += w;
      return markup;
    }).join("");
    return outer("table-row", g2, `<rect x="6" y="7" width="${g2.w}" height="${g2.height}" rx="9" fill="${tokens.shadow}"/>${cells}<rect width="${g2.w}" height="${g2.height}" fill="none" stroke="${p.selected ? tokens.blue : tokens.ink}" stroke-width="${p.selected ? 4 : 2.5}"/>`);
  }
  var common = { category: "\u52A8\u753B\u98CE \xB7 \u57FA\u7840\u7EC4\u4EF6", width: 1280, height: 720, defaultEffect: "none", reference: { level: "designed", basis: "\u6CBF\u7528\u7528\u6237\u52A8\u753B\u98CE\u53C2\u8003\u7684\u84DD\u767D\u7EB8\u9762\u3001\u6DF1\u84DD\u8F6E\u5ED3\u4E0E\u7EFF\u6A59\u72B6\u6001\u8272\uFF0C\u8FDB\u4E00\u6B65\u62C6\u51FA\u53EF\u62FC\u63A5\u6570\u636E\u90E8\u4EF6\u3002", source: "references/animation-style/sources.json" } };
  var components3 = [
    { ...common, id: "ani-atom-cell", name: "\u52A8\u753B\u90E8\u4EF6 \xB7 \u5355\u5143\u683C", description: "\u4E00\u4E2A\u53EF\u9009\u4E2D\u7684\u5355\u5143\u683C\uFF0C\u6587\u672C\u652F\u6301\u4E24\u884C\uFF0C\u7EFF\u6A59\u72B6\u6001\u8272\u3001\u9009\u62E9\u6846\u548C\u5C3A\u5BF8\u5747\u53EF\u6539\uFF1B\u5BBD\u9AD8\u6539\u53D8\u4E0D\u62C9\u4F38\u6587\u5B57\u3002", defaults: cellDefaults, render: (p, h) => preview(renderCellAtom(p, h)) },
    { ...common, id: "ani-atom-table-row", name: "\u52A8\u753B\u90E8\u4EF6 \xB7 \u8868\u683C\u884C", description: "\u72EC\u7ACB\u7684 2\u20136 \u5217\u8868\u683C\u884C\uFF0C\u9010\u5217\u6587\u5B57\u3001\u5E95\u8272\u3001\u5217\u5BBD\u548C\u9009\u4E2D\u72B6\u6001\u53EF\u6539\uFF0C\u53EF\u62FC\u63A5\u6210\u81EA\u5B9A\u4E49\u8868\u683C\u3002", defaults: tableRowDefaults, render: (p, h) => preview(renderTableRowAtom(p, h)) }
  ];

  // families/animation-style-atoms-diagram.mjs
  var font2 = "font-family:'Microsoft YaHei',Arial,sans-serif;font-weight:750";
  var tones2 = { blue: tokens.blue, green: tokens.green, orange: tokens.orange, ink: tokens.ink };
  var states = ["normal", "active", "complete", "warning"];
  var units4 = (v) => Array.from(String(v ?? "")).reduce((n4, c) => n4 + (/[\u0000-\u00ff]/.test(c) ? 0.55 : 1), 0);
  function number(v, name, min, max) {
    const n4 = Number(v);
    if (!Number.isFinite(n4) || n4 < min || n4 > max) throw new Error(`${name} must be ${min}\u2013${max}`);
    return n4;
  }
  function choice2(v, name, values) {
    if (!values.includes(v)) throw new Error(`${name} must be ${values.join(", ")}`);
    return v;
  }
  function copy2(v, name, max = 100) {
    const value = String(v ?? "");
    if (units4(value) > max) throw new Error(`${name} is too long; shorten it or enlarge the object`);
    return value;
  }
  function geometry(p, minW, minH) {
    const x = number(p.x, "x", 5, 1260), y = number(p.y, "y", 5, 700), w = number(p.objectWidth, "objectWidth", minW, 1250), height = number(p.objectHeight, "objectHeight", minH, 690);
    if (x + w + 12 > 1280 || y + height + 12 > 720) throw new Error("Object, outline and 12 px depth must fit the 1280 \xD7 720 canvas");
    return { x, y, w, height };
  }
  function palette(p) {
    choice2(p.state, "state", states);
    choice2(p.tone, "tone", Object.keys(tones2));
    const tone3 = p.state === "complete" ? "green" : p.state === "warning" ? "orange" : p.tone;
    return { color: tones2[tone3], wash: tone3 === "orange" ? "#fff5df" : tone3 === "green" ? "#eaf8f1" : "#edf7ff" };
  }
  var txt = (x, y, value, size, h, extra2 = "") => `<text x="${x}" y="${y}" font-size="${size}" ${extra2.includes("fill=") ? "" : `fill="${tokens.ink}"`} ${extra2}>${h.esc(value)}</text>`;
  function fit2(value, size, width, min = 18) {
    const result = Math.min(size, width / Math.max(1, units4(value)));
    if (result < min) throw new Error("Text does not fit at a readable size; shorten it or enlarge the object");
    return result;
  }
  function wrap(value, width, size, maxLines) {
    const lines3 = [];
    let line3 = "";
    for (const c of Array.from(value)) {
      if (c === "\n") {
        lines3.push(line3);
        line3 = "";
        continue;
      }
      if (units4(line3 + c) * size > width && line3) {
        let carry = "";
        if (/[，。！？；：、,.!?;:）】》”’]/.test(c)) {
          const chars = Array.from(line3);
          carry = chars.pop() || "";
          line3 = chars.join("");
        }
        if (line3) lines3.push(line3);
        line3 = carry;
      }
      line3 += c;
    }
    if (line3 || !lines3.length) lines3.push(line3);
    if (lines3.length > maxLines) throw new Error("Body has too many lines for this object");
    return lines3;
  }
  function pathFace(d, fill, stroke = tokens.ink) {
    return `<path d="${d}" transform="translate(8 10)" fill="${tokens.shadow}"/><path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="3.5" stroke-linejoin="round"/>`;
  }
  function preview2(group4, label3, h) {
    return `<section class="ani-atom-scene"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${h.esc(label3)}" style="${font2};fill:${tokens.ink};background:transparent">${group4}</svg></section>`;
  }
  var nodeDefaults = {
    "x": 420,
    "y": 237,
    "objectWidth": 430,
    "objectHeight": 232,
    "shape": "decision",
    "label": "\u5224\u65AD\u6761\u4EF6\uFF1F",
    "caption": "\u8282\u70B9\u8BF4\u660E",
    "tone": "blue",
    "state": "active"
  };
  function renderNodeAtom(props, h) {
    const p = { ...nodeDefaults, ...props }, { x, y, w, height } = geometry(p, 190, 108), colors3 = palette(p);
    choice2(p.shape, "shape", ["step", "decision", "terminal"]);
    const label3 = copy2(p.label, "label", 32), caption = copy2(p.caption, "caption", 48), diamond = p.shape === "decision", contentWidth = w * (diamond ? 0.57 : 0.82), labelSize = fit2(label3, Math.min(38, height * 0.23), contentWidth, 19), captionSize = caption ? fit2(caption, Math.min(22, height * 0.13), contentWidth, 17) : 0;
    if (diamond && height < 150 && caption) throw new Error("A decision with a caption requires objectHeight of at least 150");
    let d;
    if (diamond) d = `M${w / 2} 0L${w} ${height / 2}L${w / 2} ${height}L0 ${height / 2}Z`;
    else {
      const r = p.shape === "terminal" ? Math.min(height / 2, w / 2) : 20;
      d = `M${r} 0H${w - r}Q${w} 0 ${w} ${r}V${height - r}Q${w} ${height} ${w - r} ${height}H${r}Q0 ${height} 0 ${height - r}V${r}Q0 0 ${r} 0Z`;
    }
    const mainY = height / 2 + (caption ? -4 : labelSize * 0.34), subY = mainY + captionSize * 1.65;
    const gleam = diamond ? `M${w * 0.23} ${height * 0.37}L${w * 0.5} 9L${w * 0.77} ${height * 0.37}` : `M22 9H${Math.min(w - 26, 156)}`;
    return `<g data-atom="node" data-node-shape="${p.shape}" data-state="${p.state}" transform="translate(${x} ${y})" style="${font2}" data-text-panel="node" data-panel-bounds="${(w - contentWidth) / 2} ${height * 0.25} ${contentWidth} ${height * 0.52}">${pathFace(d, colors3.wash, p.state === "normal" ? tokens.ink : colors3.color)}<path d="${gleam}" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".9"/>${txt(w / 2, mainY, label3, labelSize, h, 'text-anchor="middle"')}${caption ? txt(w / 2, subY, caption, captionSize, h, 'text-anchor="middle" fill="#4e6d91"') : ""}</g>`;
  }
  var calloutDefaults = {
    "x": 375,
    "y": 225,
    "objectWidth": 520,
    "objectHeight": 244,
    "title": "\u6807\u6CE8\u6807\u9898",
    "body": "\u6807\u6CE8\u6B63\u6587\u5185\u5BB9\uFF0C\u53EF\u66FF\u6362\u4E3A\u8865\u5145\u8BF4\u660E\u3002",
    "direction": "bottom",
    "pointerOffset": 0.25,
    "tone": "blue",
    "state": "normal"
  };
  function renderCalloutAtom(props, h) {
    const p = { ...calloutDefaults, ...props }, { x, y, w, height } = geometry(p, 240, 132), colors3 = palette(p);
    choice2(p.direction, "direction", ["none", "top", "right", "bottom", "left"]);
    const pointer = number(p.pointerOffset, "pointerOffset", 0, 1), tail = p.direction === "none" ? 0 : 27, bx = p.direction === "left" ? tail : 0, by = p.direction === "top" ? tail : 0, bw = w - (["left", "right"].includes(p.direction) ? tail : 0), bh = height - (["top", "bottom"].includes(p.direction) ? tail : 0), r = 19;
    const px = bx + 36 + pointer * (bw - 72), py = by + 36 + pointer * (bh - 72);
    let d = `M${bx + r} ${by}`;
    d += p.direction === "top" ? `H${px - 15}L${px} ${by - tail}L${px + 15} ${by}` : "";
    d += `H${bx + bw - r}Q${bx + bw} ${by} ${bx + bw} ${by + r}`;
    d += p.direction === "right" ? `V${py - 15}L${bx + bw + tail} ${py}L${bx + bw} ${py + 15}` : "";
    d += `V${by + bh - r}Q${bx + bw} ${by + bh} ${bx + bw - r} ${by + bh}`;
    d += p.direction === "bottom" ? `H${px + 15}L${px} ${by + bh + tail}L${px - 15} ${by + bh}` : "";
    d += `H${bx + r}Q${bx} ${by + bh} ${bx} ${by + bh - r}`;
    d += p.direction === "left" ? `V${py + 15}L${bx - tail} ${py}L${bx} ${py - 15}` : "";
    d += `V${by + r}Q${bx} ${by} ${bx + r} ${by}Z`;
    const title = copy2(p.title, "title", 26), body = copy2(p.body, "body", 140), titleSize = title ? fit2(title, Math.min(30, bh * 0.21), bw - 52, 19) : 0, preferredBodySize = Math.min(25, Math.max(19, bh * 0.115)), bodyWidth = bw - 56;
    const bodySize = !body.includes("\n") && units4(body) * preferredBodySize <= bodyWidth * 1.12 ? Math.max(19, Math.min(preferredBodySize, bodyWidth / Math.max(1, units4(body)))) : preferredBodySize, lines3 = wrap(body, bodyWidth, bodySize, 4), lineHeight = bodySize * 1.45, bodyTop = by + (title ? titleSize + 46 : 35);
    if (bodyTop + lines3.length * lineHeight > by + bh - 12) throw new Error("Callout body does not fit; enlarge objectHeight or shorten the text");
    return `<g data-atom="callout" data-pointer="${p.direction}" data-state="${p.state}" transform="translate(${x} ${y})" style="${font2}">${pathFace(d, "#fbfeff")}<path d="M${bx + 22} ${by + 14}H${bx + Math.min(bw - 23, 129)}" stroke="${colors3.color}" stroke-width="5" stroke-linecap="round"/><g data-text-panel="callout-body" data-panel-bounds="${bx + 23} ${by + 23} ${bw - 46} ${bh - 40}">${title ? txt(bx + 27, by + titleSize + 26, title, titleSize, h) : ""}${lines3.map((line3, i) => txt(bx + 27, bodyTop + bodySize + i * lineHeight, line3, bodySize, h, 'fill="#42648b"')).join("")}</g></g>`;
  }
  var highlightDefaults = {
    "x": 325,
    "y": 249,
    "objectWidth": 624,
    "objectHeight": 206,
    "shape": "rectangle",
    "label": "\u6807\u6CE8\u6587\u5B57",
    "tone": "orange",
    "state": "active",
    "lineWidth": 6,
    "dashed": false,
    "fillOpacity": 0.055
  };
  function renderHighlightAtom(props, h) {
    const p = { ...highlightDefaults, ...props }, { x, y, w, height } = geometry(p, 90, 54), colors3 = palette(p);
    choice2(p.shape, "shape", ["rectangle", "circle", "underline"]);
    const stroke = number(p.lineWidth, "lineWidth", 2, 12), fillOpacity = number(p.fillOpacity, "fillOpacity", 0, 0.25), label3 = copy2(p.label, "label", 36), dash = p.dashed ? 'stroke-dasharray="15 10"' : "", inset = stroke / 2 + 2;
    let art, labelX = w / 2, labelY = height / 2 + 9, textWidth = w - 44;
    if (p.shape === "circle") {
      const radius = Math.min(w, height) / 2 - inset;
      art = `<circle cx="${w / 2 + 4}" cy="${height / 2 + 5}" r="${radius}" fill="none" stroke="${tokens.shadow}" stroke-width="${stroke + 2}"/><circle data-atom-outline cx="${w / 2}" cy="${height / 2}" r="${radius}" fill="${colors3.color}" fill-opacity="${fillOpacity}" stroke="${colors3.color}" stroke-width="${stroke}" ${dash}/>`;
      textWidth = radius * 1.45;
    } else if (p.shape === "underline") {
      const yy = height - 15;
      art = `<path d="M${inset} ${yy + 5}Q${w / 2} ${yy - 6} ${w - inset} ${yy + 2}" fill="none" stroke="${tokens.shadow}" stroke-width="${stroke + 3}" stroke-linecap="round"/><path data-atom-outline d="M${inset} ${yy}Q${w / 2} ${yy - 11} ${w - inset} ${yy - 3}" fill="none" stroke="${colors3.color}" stroke-width="${stroke}" stroke-linecap="round" ${dash}/>`;
      labelY = height - 34;
    } else art = `<rect x="${inset + 4}" y="${inset + 5}" width="${w - 2 * inset}" height="${height - 2 * inset}" rx="16" fill="none" stroke="${tokens.shadow}" stroke-width="${stroke + 2}"/><rect data-atom-outline x="${inset}" y="${inset}" width="${w - 2 * inset}" height="${height - 2 * inset}" rx="16" fill="${colors3.color}" fill-opacity="${fillOpacity}" stroke="${colors3.color}" stroke-width="${stroke}" ${dash}/>`;
    const size = label3 ? fit2(label3, Math.min(31, height * 0.25), textWidth, 17) : 0;
    return `<g data-atom="highlight" data-highlight-shape="${p.shape}" data-state="${p.state}" transform="translate(${x} ${y})" style="${font2}">${art}${label3 ? txt(labelX, labelY, label3, size, h, 'text-anchor="middle"') : ""}</g>`;
  }
  var progressDefaults = {
    "x": 235,
    "y": 245,
    "objectWidth": 800,
    "objectHeight": 192,
    "title": "\u8FDB\u5EA6\u6807\u9898",
    "value": 60,
    "steps": [
      "\u6B65\u9AA4 A",
      "\u6B65\u9AA4 B",
      "\u6B65\u9AA4 C",
      "\u6B65\u9AA4 D"
    ],
    "tone": "blue",
    "state": "active",
    "showValue": true
  };
  function renderProgressAtom(props, h) {
    const p = { ...progressDefaults, ...props }, { x, y, w, height } = geometry(p, 360, 166), colors3 = palette(p), value = number(p.value, "value", 0, 100), title = copy2(p.title, "title", 42);
    if (!Array.isArray(p.steps) || p.steps.length < 2 || p.steps.length > 6) throw new Error("Progress steps require 2\u20136 labels");
    if (p.state === "complete" && value !== 100) throw new Error("Complete progress requires value 100");
    const labels = p.steps.map((v) => copy2(v, "step label", 14)), titleWidth = w - (p.showValue ? 115 : 20), titleSize = title ? fit2(title, 29, titleWidth, 19) : 0, trackY = 57, trackHeight = 27, trackWidth = w - 6, fillWidth = (trackWidth - 3.4) * value / 100, nodeY = 120, labelY = 155, cellW = (w - 16) / (labels.length - 1), color5 = value === 100 ? tokens.green : colors3.color;
    const activeIndex = Math.min(labels.length - 1, Math.max(0, Math.ceil(value / 100 * (labels.length - 1))));
    const steps = labels.map((label3, i) => {
      const cx = 8 + i * cellW, done = value >= i / (labels.length - 1) * 100, active = i === activeIndex && value < 100, fg = done ? color5 : active ? colors3.color : "#8ca6c5", labelWidth = i === 0 || i === labels.length - 1 ? cellW * 0.78 : cellW * 0.86, labelSize = fit2(label3, 22, labelWidth, 17), anchor = i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle";
      return `<g data-atom-step="${i}" data-step-state="${done ? "complete" : active ? "active" : "pending"}"><circle cx="${cx}" cy="${nodeY}" r="8" fill="${done ? color5 : "white"}" stroke="${fg}" stroke-width="2.5"/>${active ? `<circle cx="${cx}" cy="${nodeY}" r="3.5" fill="${fg}"/>` : ""}${txt(cx, labelY, label3, labelSize, h, `text-anchor="${anchor}" fill="${done || active ? tokens.ink : "#6e87a5"}"`)}</g>`;
    }).join("");
    if (labelY + 10 > height) throw new Error("Progress objectHeight must leave room for step labels");
    return `<g data-atom="progress" data-state="${p.state}" data-value="${value}" transform="translate(${x} ${y})" style="${font2}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}" aria-label="${h.esc(title || "\u8FDB\u5EA6")}">${title ? txt(0, 31, title, titleSize, h) : ""}${p.showValue ? txt(w, 32, value + "%", 32, h, 'text-anchor="end"') : ""}<rect x="4" y="${trackY + 6}" width="${trackWidth}" height="${trackHeight}" rx="13.5" fill="${tokens.shadow}"/><rect x="0" y="${trackY}" width="${trackWidth}" height="${trackHeight}" rx="13.5" fill="#edf5ff" stroke="${tokens.ink}" stroke-width="2.7"/>${value > 0 ? `<rect data-atom-progress-fill x="1.7" y="${trackY + 1.7}" width="${fillWidth}" height="${trackHeight - 3.4}" rx="${Math.min(11.8, Math.max(0, fillWidth / 2))}" fill="${color5}"/>` : ""}<path d="M8 ${nodeY}H${w - 8}" stroke="#b9d3e9" stroke-width="3"/>${steps}</g>`;
  }
  var symbolDefaults = {
    "x": 487,
    "y": 204,
    "objectWidth": 294,
    "objectHeight": 302,
    "kind": "magnifier",
    "label": "\u56FE\u6807\u6807\u7B7E",
    "tone": "blue",
    "state": "normal",
    "rotation": 0
  };
  var symbolKinds = ["magnifier", "pencil", "gear", "link", "check", "document", "documents", "table", "calendar", "people"];
  function renderSymbolAtom(props, h) {
    const p = { ...symbolDefaults, ...props }, { x, y, w, height } = geometry(p, 100, 110), colors3 = palette(p);
    choice2(p.kind, "kind", symbolKinds);
    const label3 = copy2(p.label, "label", 24), rotation = number(p.rotation, "rotation", -180, 180), labelSpace = label3 ? 57 : 14, availableHeight = height - labelSpace - 20, diagonal = Math.abs(Math.cos(rotation * Math.PI / 180)) + Math.abs(Math.sin(rotation * Math.PI / 180)), size = Math.min(w - 35, availableHeight) / Math.max(1, diagonal), cx = w / 2, cy = availableHeight / 2 + 7, sx = cx - size / 2, sy = cy - size / 2;
    let art;
    if (p.kind === "magnifier") art = magnifier(sx, sy, size, h);
    else if (p.kind === "gear") art = gear(sx, sy, size, h);
    else if (p.kind === "pencil") art = `<g transform="translate(${sx} ${sy}) scale(${size / 100})"><path d="M14 87L25 59L73 10Q78 5 84 10L92 18Q97 23 92 29L44 77Z" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="3"/><path d="M73 10L92 29L83 38L64 19Z" fill="${tokens.orange}" stroke="${tokens.ink}" stroke-width="2.5"/><path d="M14 87L25 59L44 77Z" fill="#fff1d5" stroke="${tokens.ink}" stroke-width="3"/><path d="M14 87L20 72L29 81Z" fill="${tokens.ink}"/><path d="M35 59L70 23" stroke="#86caff" stroke-width="5" stroke-linecap="round"/></g>`;
    else art = icon(p.kind, sx, sy, size, h).replace(/<ellipse\b[^>]*\/>/, "");
    const state3 = p.state === "normal" ? "" : `<circle cx="${w - 25}" cy="24" r="13" fill="${colors3.color}" stroke="${tokens.ink}" stroke-width="2"/>${p.state === "complete" ? `<path d="M${w - 32} 24l5 5 9-10" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` : p.state === "warning" ? `${txt(w - 25, 30, "!", 19, h, 'text-anchor="middle"')}` : ""}`;
    return `<g data-atom="symbol" data-symbol-kind="${p.kind}" data-state="${p.state}" transform="translate(${x} ${y})" style="${font2}"><ellipse cx="${cx}" cy="${cy + size * 0.47 + 8}" rx="${size * 0.45}" ry="${Math.max(5, size * 0.055)}" fill="#dbeeff"/><g transform="rotate(${rotation} ${cx} ${cy})">${art}</g>${state3}${label3 ? txt(w / 2, height - 14, label3, fit2(label3, 30, w - 22, 18), h, 'text-anchor="middle"') : ""}</g>`;
  }
  var reference2 = { basis: "\u4F9D\u636E\u5DF2\u786E\u8BA4\u7684\u84DD\u8272\u63D2\u753B\u7EC4\u4EF6\u8BED\u6CD5\u6269\u5C55\u7684\u72EC\u7ACB\u56FE\u89E3\u90E8\u4EF6\uFF1B\u590D\u7528\u85CF\u84DD\u8F6E\u5ED3\u3001\u6D45\u84DD\u539A\u5EA6\u4E0E\u7EFF\u6A59\u5F3A\u8C03\uFF0C\u652F\u6301\u81EA\u7531\u7EC4\u5408\u3002", source: "reports/animation-style/reference-review-v8/REVIEW.md", level: "designed" };
  var make2 = (id, name, description, defaults3, render) => ({ id, name, category: "\u52A8\u753B\u98CE \xB7 \u57FA\u7840\u7EC4\u4EF6", description, width: 1280, height: 720, defaultEffect: "none", defaults: defaults3, reference: { ...reference2 }, render(props, h) {
    return preview2(render({ ...defaults3, ...props }, h), name, h);
  } });
  var components4 = [
    make2("ani-atom-node", "\u6D41\u7A0B\u8282\u70B9", "\u6B65\u9AA4\u77E9\u5F62\u3001\u5224\u65AD\u83F1\u5F62\u3001\u8D77\u6B62\u80F6\u56CA\uFF1B\u53EF\u6539\u6587\u5B57\u3001\u4F4D\u7F6E\u5C3A\u5BF8\u3001\u5F3A\u8C03\u8272\u4E0E\u72B6\u6001\u3002", nodeDefaults, renderNodeAtom),
    make2("ani-atom-callout", "\u6CE8\u91CA\u6C14\u6CE1", "\u56DB\u5411\u6216\u65E0\u6307\u5411\u7684\u6CE8\u91CA\u6C14\u6CE1\uFF0C\u6307\u9488\u4F4D\u7F6E\u3001\u6807\u9898\u3001\u6B63\u6587\u3001\u5927\u5C0F\u53CA\u72B6\u6001\u53EF\u7F16\u8F91\u3002", calloutDefaults, renderCalloutAtom),
    make2("ani-atom-highlight", "\u9AD8\u4EAE\u6846", "\u77E9\u5F62\u3001\u6B63\u5706\u5708\u9009\u4E0E\u4E0B\u5212\u7EBF\uFF1B\u53EF\u8C03\u63CF\u8FB9\u3001\u865A\u7EBF\u3001\u586B\u5145\u900F\u660E\u5EA6\u3001\u6807\u7B7E\u53CA\u4F4D\u7F6E\u5C3A\u5BF8\u3002", highlightDefaults, renderHighlightAtom),
    make2("ani-atom-progress", "\u8FDB\u5EA6\u6761", "0\u2013100\u7684\u7CBE\u786E\u8FDB\u5EA6\uFF0C2\u20136\u4E2A\u6B65\u9AA4\u6807\u7B7E\uFF1B\u4FDD\u7559\u539F\u751F\u6587\u5B57\u4E0E\u5706\u5F62\u6BD4\u4F8B\uFF0C\u53EF\u8C03\u6574\u5C3A\u5BF8\u548C\u72B6\u6001\u3002", progressDefaults, renderProgressAtom),
    make2("ani-atom-symbol", "\u5DE5\u5177\u7B26\u53F7", "\u68C0\u67E5\u653E\u5927\u955C\u3001\u94C5\u7B14\u3001\u9F7F\u8F6E\u3001\u94FE\u63A5\u7B49\u5341\u79CD\u7B26\u53F7\uFF1B\u7B49\u6BD4\u7F29\u653E\uFF0C\u652F\u6301\u6807\u7B7E\u3001\u8F6C\u89D2\u548C\u72B6\u6001\u3002", symbolDefaults, renderSymbolAtom)
  ];

  // families/animation-style-atoms-paper.mjs
  var scope = (h, id) => ({ ...h, uid: (s2) => h.uid(id + "-" + s2) });
  var finite = (value, fallback, min, max) => {
    const n4 = Number(value);
    return Math.min(max, Math.max(min, Number.isFinite(n4) ? n4 : fallback));
  };
  var units5 = (v) => [...String(v ?? "")].reduce((sum, c) => sum + (/[\x00-\x7f]/.test(c) ? 0.55 : 1), 0);
  function label(h, x, y, value, size, width, extra2 = "") {
    const s2 = String(value ?? "");
    if (units5(s2) > 60) throw Error("\u57FA\u7840\u7EC4\u4EF6\u6807\u7B7E\u8FC7\u957F\uFF0C\u8BF7\u4F7F\u7528\u77ED\u8BED\u3002");
    const font5 = Math.min(size, width / Math.max(1, units5(s2)));
    if (font5 < Math.min(size, 16)) throw Error("\u6807\u7B7E\u653E\u4E0D\u4E0B\uFF0C\u8BF7\u7F29\u77ED\u5185\u5BB9\uFF1B\u6587\u5B57\u4E0D\u4F1A\u7EE7\u7EED\u7F29\u5C0F\u6216\u8D8A\u8FC7\u90E8\u4EF6\u8FB9\u754C\u3002");
    return `<text x="${x}" y="${y}" font-size="${font5}" fill="${tokens.ink}" ${extra2}>${h.esc(s2)}</text>`;
  }
  var color = (v) => ["blue", "green", "orange", "purple"].includes(v) ? tokens[v] : tokens.blue;
  function position(p, w, h) {
    const boxW = finite(p.objectWidth, w, 80, 1200), boxH = finite(p.objectHeight, h, 80, 680), scale = Math.min(boxW / w, boxH / h);
    const x = finite(p.x, 0, -1280, 1280) + (boxW - w * scale) / 2, y = finite(p.y, 0, -720, 720) + (boxH - h * scale) / 2;
    return `translate(${x} ${y}) scale(${scale})`;
  }
  var group2 = (type2, p, w, h, content2) => `<g data-atom="${type2}" data-fit="contain" data-motion="item" transform="${position(p, w, h)}" font-family="Microsoft YaHei,Segoe UI,sans-serif" font-weight="750">${content2}</g>`;
  var canvas2 = (content2) => `<section class="ani-atom-stage" style="width:100%;height:100%;background:transparent"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" style="font-family:'Microsoft YaHei','Segoe UI',sans-serif;font-weight:750" fill="${tokens.ink}">${content2}</svg></section>`;
  var fileDefaults = {
    "x": 465,
    "y": 115,
    "objectWidth": 350,
    "objectHeight": 470,
    "name": "\u793A\u4F8B\u6587\u4EF6",
    "meta": "\u6587\u4EF6\u8BF4\u660E",
    "fileType": "image",
    "accent": "blue"
  };
  function fileSymbol(type2, c) {
    if (type2 === "image") return `<rect x="82" y="91" width="150" height="111" rx="13" fill="${c}" stroke="${tokens.ink}" stroke-width="3"/><circle cx="120" cy="124" r="12" fill="#e9f8ff"/><path d="M93 188L132 146L156 168L180 135L219 188Z" fill="#e9f8ff"/>`;
    if (type2 === "table") return `<rect x="79" y="86" width="156" height="122" rx="10" fill="#f0fbf7" stroke="${tokens.ink}" stroke-width="3"/><path d="M81 118H233M81 149H233M81 178H233M128 87V207M184 87V207" fill="none" stroke="${c}" stroke-width="3"/><path d="M89 87H225Q234 87 234 97V117H80V97Q80 87 89 87Z" fill="${c}"/>`;
    if (type2 === "video") return `<rect x="80" y="91" width="156" height="111" rx="13" fill="${c}" stroke="${tokens.ink}" stroke-width="3"/><path d="M138 115L186 147L138 179Z" fill="white"/>`;
    return `<rect x="90" y="83" width="138" height="131" rx="9" fill="#edf7ff" stroke="${tokens.ink}" stroke-width="3"/><path d="M111 111H205M111 135H205M111 159H205M111 184H179" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
  }
  function renderFileAtom(props, h) {
    const p = { ...fileDefaults, ...props }, c = color(p.accent);
    const raw = String(p.name ?? "");
    if (units5(raw) > 60) throw Error("\u6587\u4EF6\u540D\u8FC7\u957F\uFF0C\u8BF7\u4F7F\u7528\u7B80\u77ED\u540D\u79F0\u3002");
    let fitted;
    for (let size = 34; size >= 20; size--) {
      const lines3 = [];
      let line3 = "";
      for (const char of raw) {
        if (char === "\n") {
          lines3.push(line3);
          line3 = "";
          continue;
        }
        if (units5(line3 + char) * size > 247 && line3) {
          lines3.push(line3);
          line3 = "";
        }
        line3 += char;
      }
      if (line3 || !lines3.length) lines3.push(line3);
      if (lines3.length <= 3 && lines3.length * size * 1.22 <= 94) {
        fitted = { lines: lines3, size };
        break;
      }
    }
    if (!fitted) throw Error("\u6587\u4EF6\u540D\u5728\u4E09\u884C\u5185\u653E\u4E0D\u4E0B\uFF0C\u8BF7\u7F29\u77ED\u540D\u79F0\uFF1B\u6700\u5C0F\u5B57\u53F7\u4E3A 20\u3002");
    const single = fitted.lines.length === 1;
    const nameText = fitted.lines.map((line3, i) => `<text x="158" y="${single ? 321 : 288 + fitted.size + i * fitted.size * 1.22}" font-size="${fitted.size}" fill="${tokens.ink}" text-anchor="middle">${h.esc(line3)}</text>`).join("");
    const content2 = `${fileSymbol(p.fileType, c)}<path d="M49 244H263M49 263H238" stroke="#bdd5e9" stroke-width="8" stroke-linecap="round"/><g data-text-panel="file-name" data-panel-bounds="31 282 254 104" aria-label="${h.esc(raw)}">${nameText}</g>${label(h, 158, single ? 363 : 396, p.meta, single ? 21 : 18, 244, 'text-anchor="middle"')}`;
    return group2("file", p, 320, 430, paper(0, 0, 310, 416, { fold: 50, depth: 9, content: content2 }, scope(h, "file")));
  }
  var documentDefaults = {
    "x": 345,
    "y": 58,
    "objectWidth": 590,
    "objectHeight": 600,
    "title": "\u6587\u6863\u6807\u9898",
    "subtitle": "\u6587\u6863\u8BF4\u660E\u6587\u5B57",
    "accent": "blue",
    "rows": [
      {
        "label": "\u5B57\u6BB5 A",
        "text": "\u5185\u5BB9 A",
        "checked": true
      },
      {
        "label": "\u5B57\u6BB5 B",
        "text": "\u5185\u5BB9 B",
        "checked": false
      },
      {
        "label": "\u5B57\u6BB5 C",
        "text": "\u5185\u5BB9 C",
        "checked": false
      },
      {
        "label": "\u5B57\u6BB5 D",
        "text": "\u5185\u5BB9 D",
        "checked": false
      }
    ]
  };
  function renderDocumentAtom(props, h) {
    const p = { ...documentDefaults, ...props };
    if (!Array.isArray(p.rows) || p.rows.length < 1 || p.rows.length > 6) throw Error("\u6587\u6863 rows \u652F\u6301 1\u20136 \u884C\u3002");
    if (units5(p.title) > 15) throw Error("\u6587\u6863\u6807\u9898\u8FC7\u957F\uFF0C\u8BF7\u4F7F\u7528 15 \u4E2A\u6C49\u5B57\u5BBD\u4EE5\u5185\u7684\u77ED\u6807\u9898\u3002");
    const rowH = Math.min(85, 386 / p.rows.length), top = 143;
    const rows3 = p.rows.map((r, i) => {
      const y = top + i * rowH;
      return `<g data-motion="item" data-text-panel="document-row-${i}" data-panel-bounds="29 ${y} 503 ${rowH - 8}"><rect x="29" y="${y}" width="503" height="${rowH - 8}" rx="12" fill="${i % 2 ? "#fff7e8" : "#edf7ff"}" stroke="#bdd3e6" stroke-width="1.4"/>${label(h, 47, y + rowH * 0.54, r.label, 22, 88)}<path d="M143 ${y + 14}V${y + rowH - 22}" stroke="#b7cfe5" stroke-width="1.5"/>${label(h, 158, y + rowH * 0.54, r.text, 24, 323)}${r.checked ? `<circle cx="504" cy="${y + (rowH - 8) / 2}" r="12" fill="${tokens.green}" stroke="${tokens.ink}" stroke-width="1.5"/><path d="M497 ${y + (rowH - 8) / 2}l5 5 9-11" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` : ""}</g>`;
    }).join("");
    const content2 = `${banner(100, 25, 352, p.title, color(p.accent), scope(h, "document-title"))}${label(h, 280, 122, p.subtitle, 23, 467, 'text-anchor="middle"')}${rows3}`;
    return group2("document", p, 580, 590, paper(0, 0, 561, 571, { fold: 43, depth: 10, content: content2 }, scope(h, "document")));
  }
  var folderDefaults = {
    "x": 290,
    "y": 105,
    "objectWidth": 700,
    "objectHeight": 500,
    "name": "\u6587\u4EF6\u5939\u540D\u79F0",
    "subtitle": "\u6587\u4EF6\u5939\u8BF4\u660E",
    "open": true,
    "fileLabels": [
      "\u6587\u4EF6 A",
      "\u6587\u4EF6 B",
      "\u6587\u4EF6 C"
    ],
    "accent": "blue"
  };
  function renderFolderAtom(props, h) {
    const p = { ...folderDefaults, ...props };
    if (!Array.isArray(p.fileLabels) || p.fileLabels.length > 4) throw Error("\u6587\u4EF6\u5939 fileLabels \u652F\u6301 0\u20134 \u9879\u3002");
    const c = color(p.accent);
    const back = `<path d="M58 198Q50 175 78 175H283L316 204H641Q668 204 660 231L604 447H107Z" fill="#82bef0" stroke="${tokens.ink}" stroke-width="4"/>`;
    const files = p.open ? p.fileLabels.map((name, i) => {
      const x = 104 + i * (440 / Math.max(1, p.fileLabels.length)), y = 59 + (i % 2 ? 0 : 18);
      return `<g transform="rotate(${(i - (p.fileLabels.length - 1) / 2) * 5} ${x + 86} ${y + 116})">${paper(x, y, 165, 247, { fold: 31, depth: 7, content: `<rect x="27" y="33" width="43" height="42" rx="7" fill="${c}"/><path d="M39 53H59M49 43V63" stroke="white" stroke-width="3"/>${label(h, 27, 112, name, 25, 115)}<path d="M29 146H135M29 170H128M29 194H109" stroke="#bdd4e7" stroke-width="7" stroke-linecap="round"/>` }, scope(h, "folder-file-" + i))}</g>`;
    }).join("") : "";
    const top = p.open ? 253 : 207;
    const front2 = `<path d="M77 ${top + 12}Q70 ${top - 9} 94 ${top - 9}H276L305 ${top + 9}H637Q662 ${top + 9} 653 ${top + 34}L608 451Q604 469 585 469H126Q109 469 105 451Z" transform="translate(9 10)" fill="${tokens.shadow}"/><path d="M77 ${top + 12}Q70 ${top - 9} 94 ${top - 9}H276L305 ${top + 9}H637Q662 ${top + 9} 653 ${top + 34}L608 451Q604 469 585 469H126Q109 469 105 451Z" fill="#d6edff" stroke="${tokens.ink}" stroke-width="4"/><path d="M111 ${top + 24}H611" stroke="white" stroke-width="5" stroke-linecap="round"/><rect x="166" y="324" width="396" height="93" rx="15" fill="#f8fdff" stroke="#a8cae8" stroke-width="2"/>${label(h, 364, 367, p.name, 33, 358, 'text-anchor="middle"')}${label(h, 364, 397, p.subtitle, 19, 355, 'text-anchor="middle"')}`;
    return group2("folder", p, 720, 490, back + files + front2);
  }
  var common2 = { category: "\u52A8\u753B\u98CE \xB7 \u57FA\u7840\u7EC4\u4EF6", width: 1280, height: 720, defaultEffect: "none", reference: { level: "designed", basis: "\u4ECE\u7528\u6237\u63D0\u4F9B\u7684\u84DD\u8272\u63D2\u753B\u53C2\u8003\u548C\u73B0\u6709\u52A8\u753B\u98CE\u573A\u666F\u7EC6\u62C6\uFF1B\u900F\u660E\u753B\u5E03\u3001\u72EC\u7ACB\u5BF9\u8C61\uFF0C\u53EF\u7F16\u8F91\u4E0E\u7EC4\u5408\u3002", source: "references/animation-style/sources.json" } };
  var components5 = [
    { ...common2, id: "ani-atom-file", name: "\u52A8\u753B\u90E8\u4EF6 \xB7 \u6587\u4EF6", description: "\u5355\u4E2A\u6298\u89D2\u6587\u4EF6\u5BF9\u8C61\uFF0C\u6587\u4EF6\u540D\u6700\u591A\u4E09\u884C\u3001\u4FDD\u6301\u53EF\u8BFB\u5B57\u53F7\uFF1B\u652F\u6301\u6587\u672C\u3001\u56FE\u7247\u3001\u8868\u683C\u6216\u89C6\u9891\u56FE\u6807\u3002\u5BBD\u9AD8\u5B9A\u4E49\u5BB9\u7EB3\u533A\u57DF\uFF0C\u56FE\u5F62\u4E0E\u6587\u5B57\u7B49\u6BD4\u9002\u914D\u3002", defaults: fileDefaults, render: (p, h) => canvas2(renderFileAtom(p, h)) },
    { ...common2, id: "ani-atom-document", name: "\u52A8\u753B\u90E8\u4EF6 \xB7 \u6587\u6863", description: "\u72EC\u7ACB\u6587\u6863\u7EB8\u5F20\uFF0C\u6807\u9898\u3001\u526F\u6807\u9898\u548C 1\u20136 \u884C\u6B63\u6587\u53EF\u6539\uFF0C\u53EF\u9010\u884C\u52FE\u9009\uFF1B\u5BBD\u9AD8\u5B9A\u4E49\u7B49\u6BD4\u5BB9\u7EB3\u533A\u57DF\uFF0C\u6587\u5B57\u4E0E\u52FE\u9009\u5706\u4E0D\u62C9\u4F38\u3002", defaults: documentDefaults, render: (p, h) => canvas2(renderDocumentAtom(p, h)) },
    { ...common2, id: "ani-atom-folder", name: "\u52A8\u753B\u90E8\u4EF6 \xB7 \u6587\u4EF6\u5939", description: "\u72EC\u7ACB\u6587\u4EF6\u5939\uFF0C\u53EF\u5207\u6362\u6253\u5F00/\u5173\u95ED\u3001\u7F16\u8F91\u6587\u4EF6\u6807\u7B7E\u53CA\u540D\u79F0\uFF1B\u900F\u660E\u80CC\u666F\uFF0C\u5BBD\u9AD8\u5B9A\u4E49\u7B49\u6BD4\u5BB9\u7EB3\u533A\u57DF\u3002", defaults: folderDefaults, render: (p, h) => canvas2(renderFolderAtom(p, h)) }
  ];

  // families/animation-style-atoms-paper-parts.mjs
  var font3 = "font-family:'Microsoft YaHei','Segoe UI',sans-serif;font-weight:750";
  var units6 = (s2) => [...String(s2 ?? "")].reduce((n4, c) => n4 + (/[\x00-\x7f]/.test(c) ? 0.55 : 1), 0);
  var scope2 = (h, id) => ({ ...h, uid: (s2) => h.uid(id + "-" + s2) });
  var num4 = (v, name, min, max) => {
    const n4 = Number(v);
    if (!Number.isFinite(n4) || n4 < min || n4 > max) throw Error(`${name} \u9700\u5728 ${min}\u2013${max} \u4E4B\u95F4\u3002`);
    return n4;
  };
  var tone = (v) => {
    if (!["blue", "green", "orange", "purple"].includes(v)) throw Error("accent \u9700\u4E3A blue\u3001green\u3001orange \u6216 purple\u3002");
    return tokens[v];
  };
  var text3 = (h, x, y, value, size, extra2 = "") => `<text x="${x}" y="${y}" font-size="${size}" fill="${tokens.ink}" ${extra2}>${h.esc(String(value ?? ""))}</text>`;
  function geom2(p, minW, minH) {
    return { x: num4(p.x, "x", -1280, 1280), y: num4(p.y, "y", -720, 720), w: num4(p.objectWidth, "objectWidth", minW, 1240), h: num4(p.objectHeight, "objectHeight", minH, 700) };
  }
  var group3 = (type2, g2, content2) => `<g data-atom="${type2}" data-motion="item" transform="translate(${g2.x} ${g2.y})" style="${font3}" fill="${tokens.ink}">${content2}</g>`;
  var canvas3 = (content2) => `<section class="ani-paper-part" style="width:100%;height:100%;background:transparent"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" style="${font3};background:transparent" fill="${tokens.ink}">${content2}</svg></section>`;
  function lines2(value, width, size, maxLines, name = "\u6587\u5B57") {
    const content2 = String(value ?? "");
    if (content2.length > 1200) throw Error(`${name}\u8FC7\u957F\u3002`);
    const result = [];
    for (const paragraph of content2.split("\n")) {
      let line3 = "";
      for (const char of paragraph) {
        if (units6(line3 + char) * size > width && line3) {
          result.push(line3);
          line3 = "";
        }
        line3 += char;
      }
      result.push(line3);
    }
    if (result.length > maxLines) throw Error(`${name}\u8D85\u51FA ${maxLines} \u884C\uFF0C\u8BF7\u589E\u52A0\u5C3A\u5BF8\u6216\u7F29\u77ED\u6587\u5B57\u3002`);
    return result;
  }
  function fit3(value, width, preferred, min, name) {
    const size = Math.min(preferred, width / Math.max(1, units6(value)));
    if (size < min) throw Error(`${name}\u8FC7\u957F\uFF0C\u8BF7\u4F7F\u7528\u77ED\u8BED\u3002`);
    return size;
  }
  var paperDefaults = {
    "x": 400,
    "y": 80,
    "objectWidth": 480,
    "objectHeight": 550,
    "foldSize": 54,
    "foldSide": "right",
    "depth": 10,
    "ruling": "none",
    "lineSpacing": 38
  };
  function renderPaperAtom(props, helpers2) {
    const p = { ...paperDefaults, ...props }, h = scope2(helpers2, "paper-part"), g2 = geom2(p, 160, 140), depth = num4(p.depth, "depth", 0, 18), w = g2.w - depth - 4, height = g2.h - depth - 4;
    const fold = Math.min(num4(p.foldSize, "foldSize", 16, 100), w * 0.24, height * 0.2), spacing = num4(p.lineSpacing, "lineSpacing", 24, 64);
    if (!["right", "left"].includes(p.foldSide) || !["none", "lines", "grid"].includes(p.ruling)) throw Error("foldSide \u4F7F\u7528 left/right\uFF1Bruling \u4F7F\u7528 none/lines/grid\u3002");
    let ruled = "";
    if (p.ruling !== "none") {
      for (let y = fold + 32; y < height - 24; y += spacing) ruled += `M28 ${y}H${w - 28}`;
      if (p.ruling === "grid") for (let x = 28; x <= w - 28; x += spacing) ruled += `M${x} ${fold + 32}V${height - 24}`;
    }
    const shape = paper(2, 2, w, height, { fold, depth, content: ruled ? `<path d="${ruled}" stroke="#b9d6ed" stroke-width="1.6" fill="none"/>` : "" }, h);
    return group3("paper", g2, p.foldSide === "left" ? `<g transform="translate(${g2.w} 0) scale(-1 1)">${shape}</g>` : shape);
  }
  var textDefaults = {
    "x": 180,
    "y": 200,
    "objectWidth": 920,
    "objectHeight": 300,
    "title": "\u4E3B\u6807\u9898",
    "text": "\u6B63\u6587\u7B2C\u4E00\u884C\uFF0C\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u5185\u5BB9\u3002\n\u6B63\u6587\u7B2C\u4E8C\u884C\uFF0C\u53EF\u4EE5\u7EE7\u7EED\u8865\u5145\u8BF4\u660E\u3002",
    "fontSize": 32,
    "titleSize": 44,
    "lineHeight": 1.5,
    "align": "left",
    "variant": "paragraph",
    "accent": "blue"
  };
  function renderTextAtom(props, helpers2) {
    const p = { ...textDefaults, ...props }, h = scope2(helpers2, "text-part"), g2 = geom2(p, 160, 80), fs = num4(p.fontSize, "fontSize", 20, 64), ts = num4(p.titleSize, "titleSize", 24, 76), lh = num4(p.lineHeight, "lineHeight", 1.2, 1.9), accent = tone(p.accent);
    if (!["left", "center", "right"].includes(p.align) || !["paragraph", "bullets"].includes(p.variant)) throw Error("align \u4F7F\u7528 left/center/right\uFF1Bvariant \u4F7F\u7528 paragraph/bullets\u3002");
    if (p.variant === "bullets" && p.align !== "left") throw Error("\u6761\u76EE\u6A21\u5F0F\u8BF7\u4F7F\u7528\u5DE6\u5BF9\u9F50\u3002");
    const inset = p.variant === "bullets" ? 30 : 0, x = p.align === "center" ? g2.w / 2 : p.align === "right" ? g2.w - 4 : 4 + inset, anchor = p.align === "center" ? "middle" : p.align === "right" ? "end" : "start";
    let cursor = 0, content2 = "";
    if (String(p.title ?? "")) {
      const size = fit3(p.title, g2.w - 8, ts, 24, "\u6BB5\u843D\u6807\u9898");
      cursor = size;
      content2 += text3(h, p.align === "left" ? 4 : x, cursor, p.title, size, `text-anchor="${anchor}" font-weight="900"`);
      const length = Math.min(g2.w - 8, units6(p.title) * size), lineX = p.align === "center" ? (g2.w - length) / 2 : p.align === "right" ? g2.w - length - 4 : 4;
      content2 += `<path d="M${lineX} ${cursor + 13}H${lineX + length}" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`;
      cursor += 43;
    }
    const available = g2.h - cursor, maxLines = Math.max(0, Math.floor(available / (fs * lh))), body = String(p.text ?? "") ? lines2(p.text, g2.w - 8 - inset, fs, maxLines, "\u6BB5\u843D\u6B63\u6587") : [];
    if (!body.length && cursor > g2.h + 20) throw Error("\u6587\u672C\u533A\u57DF\u9AD8\u5EA6\u4E0D\u8DB3\uFF0C\u8BF7\u589E\u52A0 objectHeight\u3002");
    body.forEach((line3, i) => {
      const y = cursor + fs + i * fs * lh;
      if (p.variant === "bullets" && line3) content2 += `<circle cx="11" cy="${y - fs * 0.34}" r="4.5" fill="${accent}"/>`;
      content2 += text3(h, x, y, line3, fs, `text-anchor="${anchor}"`);
    });
    return group3("text", g2, content2);
  }
  var documentRowDefaults = {
    "x": 190,
    "y": 276,
    "objectWidth": 900,
    "objectHeight": 144,
    "label": "\u5B57\u6BB5",
    "text": "\u5B57\u6BB5\u5185\u5BB9",
    "status": "complete",
    "accent": "blue",
    "fontSize": 30
  };
  function renderDocumentRowAtom(props, helpers2) {
    const p = { ...documentRowDefaults, ...props }, h = scope2(helpers2, "row-part"), g2 = geom2(p, 340, 88), accent = tone(p.accent), fs = num4(p.fontSize, "fontSize", 22, 42);
    if (!["none", "pending", "complete", "warning"].includes(p.status)) throw Error("status \u4F7F\u7528 none/pending/complete/warning\u3002");
    const statusW = p.status === "none" ? 0 : 57, labelW = Math.min(154, Math.max(86, units6(p.label) * 23 + 32)), labelSize = fit3(p.label, labelW - 24, 25, 18, "\u6761\u76EE\u6807\u7B7E"), bodyX = labelW + 48, bodyW = g2.w - bodyX - statusW - 30;
    if (bodyW < 72) throw Error("\u6761\u76EE\u592A\u7A84\uFF0C\u8BF7\u589E\u52A0 objectWidth\u3002");
    const maxLines = Math.min(3, Math.floor((g2.h - 32) / (fs * 1.3))), body = lines2(p.text, bodyW, fs, maxLines, "\u6761\u76EE\u6B63\u6587"), firstY = (g2.h - body.length * fs * 1.3) / 2 + fs;
    const fill = p.status === "warning" ? "#fff7e8" : p.status === "complete" ? "#effaf5" : "#f3f9ff", pillH = 48, pillY = (g2.h - pillH) / 2, labelFg = p.accent === "orange" ? tokens.ink : "white";
    let content2 = `<rect x="4" y="6" width="${g2.w - 8}" height="${g2.h - 12}" rx="16" fill="${tokens.shadow}"/><rect x="1.5" y="1.5" width="${g2.w - 8}" height="${g2.h - 12}" rx="16" fill="${fill}" stroke="${tokens.ink}" stroke-width="2.5"/><rect x="18" y="${pillY}" width="${labelW}" height="${pillH}" rx="11" fill="${accent}" stroke="${tokens.ink}" stroke-width="1.8"/>${text3(h, 18 + labelW / 2, g2.h / 2 + labelSize * 0.35, p.label, labelSize, `text-anchor="middle" style="fill:${labelFg}"`)}<path d="M${labelW + 33} 25V${g2.h - 29}" stroke="#b7cfe5" stroke-width="1.5"/>`;
    content2 += body.map((line3, i) => text3(h, bodyX, firstY + i * fs * 1.3, line3, fs)).join("");
    const cx = g2.w - 39, cy = g2.h / 2;
    if (p.status === "complete") content2 += `<circle cx="${cx}" cy="${cy}" r="17" fill="${tokens.green}" stroke="${tokens.ink}" stroke-width="2"/><path d="M${cx - 8} ${cy}l6 7 12-14" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (p.status === "pending") content2 += `<circle cx="${cx}" cy="${cy}" r="17" fill="white" stroke="#7899bd" stroke-width="2.3"/>`;
    if (p.status === "warning") content2 += `<path d="M${cx} ${cy - 20}L${cx + 21} ${cy + 17}H${cx - 21}Z" fill="${tokens.orange}" stroke="${tokens.ink}" stroke-width="2" stroke-linejoin="round"/>${text3(h, cx, cy + 11, "!", 26, 'text-anchor="middle" font-weight="900"')}`;
    return group3("document-row", g2, `<g data-text-panel="document-row" data-panel-bounds="2 2 ${g2.w - 8} ${g2.h - 12}">${content2}</g>`);
  }
  var fileStackDefaults = {
    "x": 300,
    "y": 92,
    "objectWidth": 680,
    "objectHeight": 520,
    "files": [
      {
        "name": "\u6587\u4EF6 A",
        "fileType": "text",
        "accent": "blue"
      },
      {
        "name": "\u6587\u4EF6 B",
        "fileType": "image",
        "accent": "purple"
      },
      {
        "name": "\u6587\u4EF6 C",
        "fileType": "table",
        "accent": "green"
      }
    ],
    "meta": "\u6587\u4EF6\u8BF4\u660E",
    "layout": "stack"
  };
  function renderFileStackAtom(props, helpers2) {
    const p = { ...fileStackDefaults, ...props }, g2 = geom2(p, 220, 200);
    if (!Array.isArray(p.files) || p.files.length < 2 || p.files.length > 5) throw Error("\u6587\u4EF6\u5806\u53E0 files \u652F\u6301 2\u20135 \u4E2A\u6587\u4EF6\u3002");
    if (!["stack", "fan"].includes(p.layout)) throw Error("layout \u4F7F\u7528 stack/fan\u3002");
    const scale = Math.min(g2.w / 720, g2.h / 520), dx = (g2.w - 720 * scale) / 2, dy = (g2.h - 520 * scale) / 2, mid = (p.files.length - 1) / 2;
    const layers = p.files.map((file, i) => {
      const front2 = i === p.files.length - 1, delta = i - mid, back = p.files.length - 1 - i, x = p.layout === "fan" ? 210 + delta * 34 : 190 + back * 25, y = p.layout === "fan" ? 64 + Math.abs(delta) * 5 : 72 - back * 17, angle = p.layout === "fan" ? delta * 7 : 0;
      const art = renderFileAtom({ x, y, objectWidth: 300, objectHeight: 403.125, name: front2 ? file.name : "", meta: front2 ? p.meta : "", fileType: file.fileType || "text", accent: file.accent || "blue" }, scope2(helpers2, "stack-" + i));
      return `<g data-stack-layer="${i}" transform="rotate(${angle} ${x + 150} ${y + 201.5625})">${art}</g>`;
    }).join("");
    return group3("file-stack", g2, `<g data-fit="contain" transform="translate(${dx} ${dy}) scale(${scale})">${layers}</g>`);
  }
  var titleLabelDefaults = {
    "x": 330,
    "y": 276,
    "objectWidth": 620,
    "objectHeight": 158,
    "label": "\u6807\u9898\u6587\u5B57",
    "caption": "\u8BF4\u660E\u6587\u5B57",
    "accent": "blue",
    "variant": "filled"
  };
  function renderTitleLabelAtom(props, helpers2) {
    const p = { ...titleLabelDefaults, ...props }, h = scope2(helpers2, "title-part"), g2 = geom2(p, 180, 68), accent = tone(p.accent), hasCaption = Boolean(String(p.caption ?? ""));
    if (!["filled", "outline"].includes(p.variant)) throw Error("variant \u4F7F\u7528 filled/outline\u3002");
    if (hasCaption && g2.h < 120) throw Error("\u5E26\u8BF4\u660E\u7684\u6807\u9898\u724C\u9AD8\u5EA6\u81F3\u5C11\u4E3A 120\u3002");
    const w = g2.w - 10, height = g2.h - (hasCaption ? 49 : 10), size = fit3(p.label, w - 48, 40, 24, "\u6807\u9898\u724C\u6587\u5B57"), captionSize = fit3(p.caption, g2.w - 24, 22, 18, "\u6807\u9898\u724C\u8BF4\u660E"), id = h.uid("fill"), fill = p.variant === "outline" ? "#fcfeff" : `url(#${id})`, fg = p.variant === "outline" || p.accent === "orange" ? tokens.ink : "white";
    let content2 = `<defs><linearGradient id="${h.esc(id)}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${accent}"/><stop offset="1" stop-color="${accent}" stop-opacity=".92"/></linearGradient></defs><rect x="7" y="8" width="${w}" height="${height}" rx="18" fill="${tokens.shadow}"/><rect x="2" y="2" width="${w}" height="${height}" rx="18" fill="${fill}" stroke="${tokens.ink}" stroke-width="3"/><rect x="7" y="7" width="${w - 10}" height="${height - 10}" rx="14" fill="none" stroke="${p.variant === "outline" ? accent : "#a4ddff"}" stroke-width="2"/><path d="M19 12H89M12 23Q12 12 24 12" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>${text3(h, 2 + w / 2, 2 + height / 2 + size * 0.35, p.label, size, `text-anchor="middle" style="fill:${fg}" font-weight="900"`)}`;
    if (hasCaption) content2 += text3(h, g2.w / 2, g2.h - 10, p.caption, captionSize, 'text-anchor="middle"');
    return group3("title-label", g2, content2);
  }
  var common3 = { category: "\u52A8\u753B\u98CE \xB7 \u57FA\u7840\u7EC4\u4EF6", width: 1280, height: 720, defaultEffect: "none", reference: { level: "designed", basis: "\u4ECE\u7528\u6237\u786E\u8BA4\u7684\u6DF1\u84DD\u63CF\u8FB9\u3001\u6298\u89D2\u7EB8\u5F20\u548C\u6D45\u84DD\u539A\u5EA6\u4E2D\u62C6\u51FA\u72EC\u7ACB\u77E2\u91CF\u57FA\u7840\u5BF9\u8C61\uFF1B\u6587\u5B57\u548C\u51E0\u4F55\u5747\u53EF\u7F16\u8F91\u3002", source: "reports/animation-style/reference-review-v8/REVIEW.md" } };
  var make3 = (id, name, description, defaults3, render) => ({ ...common3, id, name, description, defaults: defaults3, render: (p, h) => canvas3(render(p, h)) });
  var components6 = [
    make3("ani-atom-paper", "\u52A8\u753B\u90E8\u4EF6 \xB7 \u7A7A\u767D\u6298\u89D2\u7EB8", "\u72EC\u7ACB\u7EB8\u5F20\u5916\u58F3\uFF1B\u53EF\u5207\u6362\u7A7A\u767D\u3001\u6A2A\u7EBF\u6216\u7F51\u683C\u3001\u5DE6\u53F3\u6298\u89D2\u53CA\u539A\u5EA6\uFF0C\u4E0D\u9644\u5E26\u6574\u573A\u666F\u6216\u56FA\u5B9A\u6587\u6848\u3002", paperDefaults, renderPaperAtom),
    make3("ani-atom-text", "\u52A8\u753B\u90E8\u4EF6 \xB7 \u6587\u672C\u6BB5\u843D", "\u72EC\u7ACB\u6807\u9898\u4E0E\u6B63\u6587\uFF1B\u6309\u5BBD\u5EA6\u81EA\u52A8\u6362\u884C\uFF0C\u652F\u6301\u5BF9\u9F50\u3001\u6761\u76EE\u3001\u5B57\u53F7\u548C\u884C\u8DDD\uFF0C\u8D85\u51FA\u9AD8\u5EA6\u4F1A\u63D0\u793A\u3002", textDefaults, renderTextAtom),
    make3("ani-atom-document-row", "\u52A8\u753B\u90E8\u4EF6 \xB7 \u6587\u6863\u6761\u76EE", "\u4E00\u6761\u72EC\u7ACB\u6807\u7B7E\u4E0E\u6B63\u6587\uFF0C\u652F\u6301\u5B8C\u6210\u3001\u5F85\u529E\u3001\u63D0\u9192\u548C\u65E0\u72B6\u6001\uFF1B\u5BBD\u9AD8\u91CD\u6392\u5E03\u5C40\uFF0C\u6587\u5B57\u56FE\u6807\u4E0D\u62C9\u4F38\u3002", documentRowDefaults, renderDocumentRowAtom),
    make3("ani-atom-file-stack", "\u52A8\u753B\u90E8\u4EF6 \xB7 \u6587\u4EF6\u5806\u53E0", "2\u20135 \u5F20\u6587\u4EF6\u53E0\u653E\u6216\u6247\u5F00\uFF1B\u524D\u666F\u540D\u79F0\u3001\u8BF4\u660E\u548C\u6BCF\u5F20\u6587\u4EF6\u56FE\u6807\u53EF\u66FF\u6362\uFF0C\u6574\u4F53\u4FDD\u6301\u7B49\u6BD4\u3002", fileStackDefaults, renderFileStackAtom),
    make3("ani-atom-title-label", "\u52A8\u753B\u90E8\u4EF6 \xB7 \u6807\u9898\u724C", "\u72EC\u7ACB\u84DD\u7EFF\u6A59\u7D2B\u6807\u9898\u724C\uFF1B\u53EF\u5207\u6362\u586B\u8272\u6216\u63CF\u8FB9\u3001\u66FF\u6362\u6807\u9898\u8BF4\u660E\uFF0C\u6309\u5BBD\u9AD8\u91CD\u6392\u3002", titleLabelDefaults, renderTitleLabelAtom)
  ];

  // content-runtime.mjs
  function normalizeLocalMediaPath(value) {
    const input = String(value || "").replaceAll("\\", "/");
    if (!input) return "";
    if (/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(input) || /[\u0000-\u001f]/.test(input)) throw Error("\u5A92\u4F53\u5FC5\u987B\u4F7F\u7528\u5DE5\u7A0B\u5185\u7684\u76F8\u5BF9\u8DEF\u5F84");
    return input.split("/").map((segment) => {
      let decoded = segment;
      try {
        decoded = decodeURIComponent(segment);
      } catch {
      }
      if (decoded === ".." || decoded === "." || decoded.includes("/") || decoded.includes("\\")) throw Error("\u5A92\u4F53\u8DEF\u5F84\u4E0D\u80FD\u8D8A\u8FC7\u5DE5\u7A0B\u76EE\u5F55");
      return encodeURIComponent(decoded).replaceAll("'", "%27");
    }).join("/");
  }
  function normalizeMediaProps(value, parentKey = "") {
    if (Array.isArray(value)) return value.map((v) => normalizeMediaProps(v, parentKey));
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value).map(([key, item]) => {
      const isMedia = key === "mediaSrc" || key === "imageSrc" || key === "src" && /media/i.test(parentKey);
      return [key, isMedia ? normalizeLocalMediaPath(item) : normalizeMediaProps(item, key)];
    }));
  }
  function resolveContentVariables(defaults3, variables = {}) {
    const merged = { ...defaults3 };
    for (const [key, value] of Object.entries(variables)) if (key in defaults3 && value !== void 0) merged[key] = value;
    if (variables.propsJson) {
      const overrides = typeof variables.propsJson === "string" ? JSON.parse(variables.propsJson) : variables.propsJson;
      if (!overrides || Array.isArray(overrides) || typeof overrides !== "object") throw Error("propsJson \u5FC5\u987B\u662F JSON \u5BF9\u8C61");
      Object.assign(merged, overrides);
    }
    return normalizeMediaProps(merged);
  }
  function rewriteRenderedMediaMarkup(html, mediaBase = "") {
    if (!mediaBase) return html;
    const mediaMarkup = html.replace(/(<(?:img|video|audio|source)\b[^>]*\bsrc=")([^"]*)(")/gi, (_, a2, src, b2) => {
      if (!src || /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(src)) return a2 + src + b2;
      const url = /^[a-z][a-z0-9+.-]*:/i.test(mediaBase) ? new URL(src, mediaBase).href : mediaBase + src;
      return a2 + url.replaceAll("&", "&amp;").replaceAll('"', "&quot;") + b2;
    });
    return rewriteRenderedSvgImageMarkup(mediaMarkup, mediaBase);
  }
  function rewriteRenderedSvgImageMarkup(html, mediaBase = "") {
    if (!mediaBase) return html;
    return html.replace(/<image\b[^>]*>/gi, (tag2) => tag2.replace(/(\s)((?:xlink:)?href)(\s*=\s*)(["'])(.*?)\4/gi, (_, space, name, equals, quote, src) => {
      if (!src || /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(src)) return space + name + equals + quote + src + quote;
      const decoded = src.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&apos;", "'");
      const url = /^[a-z][a-z0-9+.-]*:/i.test(mediaBase) ? new URL(decoded, mediaBase).href : mediaBase + decoded;
      return space + name + equals + quote + url.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&#39;") + quote;
    }));
  }

  // families/animation-style-atoms-ui.mjs
  var font4 = "font-family:'Microsoft YaHei',Arial,sans-serif;font-weight:750";
  var tones3 = { blue: tokens.blue, green: tokens.green, orange: tokens.orange, gray: "#dce4ee", ink: tokens.ink };
  var units7 = (v) => Array.from(String(v ?? "")).reduce((n4, c) => n4 + (/[\u0000-\u00ff]/.test(c) ? 0.55 : 1), 0);
  var number2 = (v, name, min, max) => {
    const n4 = Number(v);
    if (!Number.isFinite(n4) || n4 < min || n4 > max) throw new Error(`${name} must be ${min}\u2013${max}`);
    return n4;
  };
  var copy3 = (v, name, max = 80) => {
    const s2 = String(v ?? "");
    if (units7(s2) > max) throw new Error(`${name} is too long for this object`);
    return s2;
  };
  var scope3 = (h, prefix) => {
    let n4 = 0;
    return { ...h, uid: (s2) => h.uid(`${prefix}-${++n4}-${s2}`) };
  };
  var txt2 = (x, y, label3, size, h, extra2 = "") => `<text x="${x}" y="${y}" ${extra2.includes('fill="') ? "" : `fill="${tokens.ink}"`} font-size="${size}" ${extra2}>${h.esc(label3)}</text>`;
  function geometry2(p, minW, minH) {
    const x = number2(p.x, "x", 0, 1200), y = number2(p.y, "y", 0, 650), w = number2(p.objectWidth, "objectWidth", minW, 1240), height = number2(p.objectHeight, "objectHeight", minH, 680);
    if (x + w + 12 > 1280 || y + height + 12 > 720) throw new Error("Object plus its 12 px depth must fit the preview canvas");
    return { x, y, w, height };
  }
  function wrap2(value, width, fontSize, maxLines = 2) {
    const lines3 = [];
    let line3 = "";
    for (const c of Array.from(String(value ?? ""))) {
      if (units7(line3 + c) * fontSize > width && line3) {
        lines3.push(line3);
        line3 = "";
      }
      line3 += c;
    }
    if (line3) lines3.push(line3);
    if (lines3.length > maxLines) throw new Error("Cell or paragraph exceeds readable layout; widen the object or shorten the copy");
    return lines3;
  }
  function frame(w, height, fill = "#fff", r = 18) {
    return `<rect x="9" y="10" width="${w}" height="${height}" rx="${r}" fill="${tokens.shadow}"/><rect width="${w}" height="${height}" rx="${r}" fill="${fill}" stroke="${tokens.ink}" stroke-width="3.5"/><path d="M5 ${height - r}Q5 ${height - 5} ${r} ${height - 5}H${w - r}Q${w - 5} ${height - 5} ${w - 5} ${height - r}V${r}" fill="none" stroke="#d6edff" stroke-width="4"/>`;
  }
  function preview3(group4, label3, h) {
    return `<section class="ani-atom-scene"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${h.esc(label3)}" style="${font4};fill:${tokens.ink};background:transparent">${group4}</svg></section>`;
  }
  var tableDefaults = {
    "x": 140,
    "y": 152,
    "objectWidth": 990,
    "objectHeight": 416,
    "columns": [
      {
        "key": "id",
        "label": "\u5B57\u6BB5 A",
        "weight": 1
      },
      {
        "key": "date",
        "label": "\u5B57\u6BB5 B",
        "weight": 1.3
      },
      {
        "key": "status",
        "label": "\u5B57\u6BB5 C",
        "weight": 1.3
      },
      {
        "key": "included",
        "label": "\u5B57\u6BB5 D",
        "weight": 1.1
      }
    ],
    "rows": [
      {
        "id": "R01",
        "date": "01-01",
        "status": {
          "label": "\u72B6\u6001 A",
          "tone": "green"
        },
        "included": "\u7ED3\u679C A"
      },
      {
        "id": "R02",
        "date": "01-02",
        "status": {
          "label": "\u72B6\u6001 A",
          "tone": "green"
        },
        "included": "\u7ED3\u679C A"
      },
      {
        "id": "R03",
        "date": "01-03",
        "status": {
          "label": "\u72B6\u6001 A",
          "tone": "green"
        },
        "included": "\u7ED3\u679C A"
      },
      {
        "id": "R04",
        "date": "\u2014",
        "status": {
          "label": "\u72B6\u6001 B",
          "tone": "gray"
        },
        "included": "\u7ED3\u679C B"
      },
      {
        "id": "R05",
        "date": "\u2014",
        "status": {
          "label": "\u72B6\u6001 C",
          "tone": "orange"
        },
        "included": "\u7ED3\u679C B"
      }
    ],
    "headerFill": "#dceeff",
    "striped": true
  };
  function renderTableAtom(props, helpers2) {
    const p = { ...tableDefaults, ...props }, h = scope3(helpers2, "atom-table"), { x, y, w, height } = geometry2(p, 400, 210);
    if (!Array.isArray(p.columns) || p.columns.length < 2 || p.columns.length > 6) throw new Error("table columns require 2\u20136 entries");
    if (!Array.isArray(p.rows) || p.rows.length < 1 || p.rows.length > 8) throw new Error("table rows require 1\u20138 entries");
    if (new Set(p.columns.map((c) => c.key)).size !== p.columns.length) throw new Error("table column keys must be unique");
    const weights = p.columns.map((c, i) => number2(c.weight ?? 1, `column ${i} weight`, 0.5, 6)), sum = weights.reduce((a2, b2) => a2 + b2, 0), colW = weights.map((v) => (w - 24) * v / sum), start = [12];
    colW.forEach((v, i) => start.push(start[i] + v));
    const header = 58, rowH = (height - 26 - header) / p.rows.length;
    if (rowH < 38) throw new Error("table height is too short for these rows");
    const headerFill = /^#[0-9a-f]{6}$/i.test(String(p.headerFill)) ? p.headerFill : "#dceeff";
    const heads = p.columns.map((c, i) => {
      const label3 = copy3(c.label, "column label", 10), size = Math.min(27, (colW[i] - 20) / Math.max(1, units7(label3)));
      if (size < 18) throw new Error("Column heading is too narrow");
      return txt2(start[i] + colW[i] / 2, 12 + header * 0.65, label3, size, h, 'text-anchor="middle"');
    }).join("");
    const rows3 = p.rows.map((row, ri) => {
      const yy = 12 + header + ri * rowH;
      const cells = p.columns.map((column, ci) => {
        const cell = row[column.key] ?? "", obj2 = typeof cell === "object" && cell !== null, label3 = copy3(obj2 ? cell.label : cell, "cell", 50), cx = start[ci] + colW[ci] / 2;
        if (obj2) {
          if (!Object.hasOwn(tones3, cell.tone)) throw new Error("status tone must be blue, green, orange, gray or ink");
          const size2 = Math.min(25, rowH * 0.46, (colW[ci] - 42) / Math.max(1, units7(label3)));
          if (size2 < 18) throw new Error("Status label is too long");
          const bh = Math.min(38, rowH - 13), bw = Math.min(colW[ci] - 30, Math.max(100, units7(label3) * size2 + 27)), color5 = tones3[cell.tone], fg = ["orange", "gray"].includes(cell.tone) ? tokens.ink : "white";
          return `<g data-atom-status="${h.esc(cell.tone)}"><rect x="${cx - bw / 2 + 2}" y="${yy + (rowH - bh) / 2 + 3}" width="${bw}" height="${bh}" rx="11" fill="${tokens.shadow}"/><rect x="${cx - bw / 2}" y="${yy + (rowH - bh) / 2}" width="${bw}" height="${bh}" rx="11" fill="${color5}" stroke="${tokens.ink}" stroke-width="1.5"/>${txt2(cx, yy + rowH / 2 + size2 * 0.35, label3, size2, h, `text-anchor="middle" style="fill:${fg}"`)}</g>`;
        }
        const size = Math.min(27, rowH * 0.43), lines4 = wrap2(label3, colW[ci] - 26, size, 2), lineH = size * 1.18, total = lines4.length * lineH;
        return lines4.map((line3, li) => txt2(cx, yy + (rowH - total) / 2 + size + li * lineH, line3, size, h, 'text-anchor="middle"')).join("");
      }).join("");
      return `<g data-atom-row="${ri}"><rect x="12" y="${yy}" width="${w - 24}" height="${rowH}" fill="${p.striped && ri % 2 ? "#f2f8ff" : "#fff"}"/>${cells}</g>`;
    }).join("");
    const lines3 = start.slice(1, -1).map((xx) => `M${xx} 12V${height - 14}`).join(" ") + Array.from({ length: p.rows.length }, (_, i) => ` M12 ${12 + header + i * rowH}H${w - 12}`).join("");
    return `<g data-atom="table" transform="translate(${x} ${y})" style="${font4}" fill="${tokens.ink}">${frame(w, height)}<rect x="12" y="12" width="${w - 24}" height="${header}" rx="8" fill="${headerFill}"/>${rows3}${heads}<path d="${lines3}" fill="none" stroke="#8ba7ce" stroke-width="1.2"/><rect x="12" y="12" width="${w - 24}" height="${height - 26}" rx="8" fill="none" stroke="${tokens.ink}" stroke-width="2"/></g>`;
  }
  var browserDefaults = {
    "x": 140,
    "y": 96,
    "objectWidth": 990,
    "objectHeight": 518,
    "tabs": [
      "\u6807\u7B7E\u9875 A",
      "\u6807\u7B7E\u9875 B"
    ],
    "activeTab": 0,
    "address": "www.example.com/page",
    "heading": "\u9875\u9762\u6807\u9898",
    "body": [
      "\u6B63\u6587\u7B2C\u4E00\u6BB5\uFF0C\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u5185\u5BB9\u3002",
      "\u6B63\u6587\u7B2C\u4E8C\u6BB5\uFF0C\u652F\u6301\u7EE7\u7EED\u8865\u5145\u8BF4\u660E\u3002"
    ],
    "items": [
      "\u9879\u76EE A",
      "\u9879\u76EE B",
      "\u9879\u76EE C"
    ],
    "imageSrc": "",
    "imageAlt": "\u53EF\u66FF\u6362\u7684\u9875\u9762\u56FE\u7247",
    "imageFit": "contain"
  };
  function mediaPath(v) {
    return normalizeMediaProps({ imageSrc: String(v || "") }).imageSrc;
  }
  function renderBrowserAtom(props, helpers2) {
    const p = { ...browserDefaults, ...props }, h = scope3(helpers2, "atom-browser"), { x, y, w, height } = geometry2(p, 620, 350);
    if (!Array.isArray(p.tabs) || p.tabs.length < 1 || p.tabs.length > 3) throw new Error("browser tabs require 1\u20133 labels");
    const active = number2(p.activeTab, "activeTab", 0, p.tabs.length - 1);
    if (!Number.isInteger(active)) throw new Error("activeTab must be an integer");
    const title = copy3(p.heading, "heading", 24), address = copy3(p.address, "address", 74), imageSrc2 = mediaPath(p.imageSrc), clip2 = h.uid("content-clip");
    const tabWidth = Math.min(218, (w - 166) / p.tabs.length), tabs2 = p.tabs.map((v, i) => {
      const label3 = copy3(v, "tab", 15), xx = 124 + i * tabWidth, fill = i === active ? "#fff" : "#d8ecff", size = Math.min(21, (tabWidth - 43) / Math.max(1, units7(label3)));
      return `<path d="M${xx} 50V22Q${xx} 10 ${xx + 12} 10H${xx + tabWidth - 22}Q${xx + tabWidth - 10} 10 ${xx + tabWidth - 10} 22V50Z" fill="${fill}" stroke="${tokens.ink}" stroke-width="1.7"/>${txt2(xx + 15, 36, label3, size, h)}<path d="M${xx + tabWidth - 32} 23l8 8m-8 0 8-8" stroke="#53759b" stroke-width="1.7"/>`;
    }).join("");
    const chrome = `<path d="M18 0H${w - 18}Q${w} 0 ${w} 18V50H0V18Q0 0 18 0Z" fill="#cae5ff"/><circle cx="27" cy="25" r="7" fill="#ff9565" stroke="${tokens.ink}" stroke-width="1.5"/><circle cx="51" cy="25" r="7" fill="${tokens.orange}" stroke="${tokens.ink}" stroke-width="1.5"/><circle cx="75" cy="25" r="7" fill="#39c09a" stroke="${tokens.ink}" stroke-width="1.5"/>${tabs2}<path d="M0 50H${w}" stroke="${tokens.ink}" stroke-width="2"/><path d="M31 75l-8 8 8 8m29-16 8 8-8 8M89 82a10 10 0 1 1 2 8m-1-8v-7h-7" fill="none" stroke="${tokens.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><rect x="119" y="65" width="${w - 142}" height="36" rx="13" fill="#eef7ff" stroke="#a4bedb" stroke-width="1.5"/><rect x="132" y="78" width="10" height="11" rx="2" fill="none" stroke="#527094" stroke-width="1.8"/><path d="M134 78v-3a3 3 0 0 1 6 0v3" fill="none" stroke="#527094" stroke-width="1.8"/>${txt2(157, 90, address, Math.min(20, (w - 203) / Math.max(1, units7(address))), h, 'fill="#527094"')}<path d="M12 116H${w - 12}" stroke="#bdd6ee" stroke-width="1.5"/>`;
    let body = "";
    if (imageSrc2) {
      if (!["contain", "cover"].includes(p.imageFit)) throw new Error("imageFit must be contain or cover");
      body = `<defs><clipPath id="${h.esc(clip2)}"><rect x="14" y="119" width="${w - 28}" height="${height - 134}" rx="9"/></clipPath></defs><image href="${h.esc(imageSrc2)}" x="14" y="119" width="${w - 28}" height="${height - 134}" preserveAspectRatio="xMidYMid ${p.imageFit === "cover" ? "slice" : "meet"}" clip-path="url(#${h.esc(clip2)})"><title>${h.esc(p.imageAlt)}</title></image>`;
    } else {
      if (!Array.isArray(p.body) || p.body.length > 3 || !Array.isArray(p.items) || p.items.length > 4) throw new Error("browser body supports up to 3 paragraphs and 4 list items");
      const fs = height >= 460 ? 24 : 21, headSize = height >= 460 ? 34 : 29;
      let cursor = 164;
      if (title) {
        body += txt2(37, cursor, title, Math.min(headSize, (w - 76) / Math.max(1, units7(title))), h);
        cursor += 39;
      }
      for (const paragraph of p.body) {
        const lines3 = wrap2(copy3(paragraph, "paragraph", 100), w - 76, fs, 3);
        for (const line3 of lines3) {
          body += txt2(37, cursor, line3, fs, h, 'fill="#466689"');
          cursor += fs * 1.42;
        }
        cursor += 6;
      }
      if (p.items.length) {
        cursor += 4;
        body += `<path d="M37 ${cursor - 5}H${w - 37}" stroke="#c9ddef" stroke-width="1.3"/>`;
        cursor += 30;
      }
      for (const item of p.items) {
        const label3 = copy3(item, "item", 60);
        if (units7(label3) * fs > w - 101) throw new Error("Browser list item is too long");
        body += `<circle cx="45" cy="${cursor - 8}" r="5" fill="${tokens.blue}"/>${txt2(62, cursor, label3, fs, h)}`;
        cursor += fs * 1.62;
      }
      if (cursor > height - 9) throw new Error("Browser content does not fit; enlarge objectHeight or shorten the copy");
    }
    return `<g data-atom="browser" transform="translate(${x} ${y})" style="${font4}" fill="${tokens.ink}">${frame(w, height)}${chrome}${body}<rect width="${w}" height="${height}" rx="18" fill="none" stroke="${tokens.ink}" stroke-width="3.5"/></g>`;
  }
  var connectorDefaults = {
    "kind": "curve",
    "start": {
      "x": 270,
      "y": 448
    },
    "end": {
      "x": 1e3,
      "y": 278
    },
    "controlPoints": [
      {
        "x": 500,
        "y": 448
      },
      {
        "x": 770,
        "y": 278
      }
    ],
    "waypoints": [],
    "arrowStart": false,
    "arrowEnd": true,
    "tone": "blue",
    "lineWidth": 8,
    "cornerRadius": 28,
    "dashed": false,
    "label": "\u8FDE\u63A5\u8BF4\u660E",
    "labelX": 635,
    "labelY": 307
  };
  var point = (p, name) => ({ x: number2(p?.x, name + ".x", 16, 1264), y: number2(p?.y, name + ".y", 16, 704) });
  var direction = (a2, b2) => {
    const d = Math.hypot(b2.x - a2.x, b2.y - a2.y);
    if (d < 0.1) throw new Error("Connector segments must have distinct points");
    return { x: (b2.x - a2.x) / d, y: (b2.y - a2.y) / d, length: d };
  };
  var shifted = (p, v, length) => ({ x: p.x + v.x * length, y: p.y + v.y * length });
  function elbowPath(points, radius) {
    let d = `M${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1], curr = points[i], next = points[i + 1], vin = direction(curr, prev), vout = direction(curr, next), r = Math.min(radius, vin.length / 2, vout.length / 2), a2 = shifted(curr, vin, r), b2 = shifted(curr, vout, r);
      d += `L${a2.x} ${a2.y}Q${curr.x} ${curr.y} ${b2.x} ${b2.y}`;
    }
    const end = points.at(-1);
    return d + `L${end.x} ${end.y}`;
  }
  function renderConnectorAtom(props, helpers2) {
    const p = { ...connectorDefaults, ...props }, h = scope3(helpers2, "atom-connector");
    if (!["straight", "curve", "elbow"].includes(p.kind)) throw new Error("connector kind must be straight, curve or elbow");
    if (!Object.hasOwn(tones3, p.tone)) throw new Error("Unsupported connector tone");
    const start = point(p.start, "start"), end = point(p.end, "end"), stroke = number2(p.lineWidth, "lineWidth", 3, 14), radius = number2(p.cornerRadius, "cornerRadius", 0, 80), headLength = 22 + stroke, half = 10 + stroke * 0.45;
    let first, last, c1, c2, points;
    if (p.kind === "curve") {
      if (!Array.isArray(p.controlPoints) || p.controlPoints.length !== 2) throw new Error("curve requires two control points");
      [c1, c2] = p.controlPoints.map((v, i) => point(v, "controlPoints[" + i + "]"));
      first = direction(start, c1);
      last = direction(c2, end);
    } else if (p.kind === "elbow") {
      if (!Array.isArray(p.waypoints) || p.waypoints.length > 6) throw new Error("elbow supports at most six waypoints");
      points = [start, ...p.waypoints.length ? p.waypoints.map((v, i) => point(v, "waypoints[" + i + "]")) : [{ x: (start.x + end.x) / 2, y: start.y }, { x: (start.x + end.x) / 2, y: end.y }], end].filter((v, i, all) => i === 0 || Math.hypot(v.x - all[i - 1].x, v.y - all[i - 1].y) > 0.1);
      if (points.length < 2) throw new Error("Connector endpoints must differ");
      first = direction(points[0], points[1]);
      last = direction(points.at(-2), end);
    } else {
      first = last = direction(start, end);
    }
    if (p.arrowStart && first.length < headLength + 6 || p.arrowEnd && last.length < headLength + 6) throw new Error("End segment is too short for its arrowhead");
    if ((p.kind === "straight" || points?.length === 2) && Math.hypot(end.x - start.x, end.y - start.y) < (p.arrowStart ? headLength : 0) + (p.arrowEnd ? headLength : 0) + 8) throw new Error("Connector is too short for both arrowheads");
    const a2 = p.arrowStart ? shifted(start, first, headLength - 1) : start, b2 = p.arrowEnd ? shifted(end, last, -headLength + 1) : end;
    let d;
    if (p.kind === "curve") {
      if (p.arrowStart) c1 = shifted(c1, first, headLength - 1);
      if (p.arrowEnd) c2 = shifted(c2, last, -headLength + 1);
      d = `M${a2.x} ${a2.y}C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b2.x} ${b2.y}`;
    } else if (p.kind === "elbow") {
      points[0] = a2;
      points[points.length - 1] = b2;
      d = elbowPath(points, radius);
    } else d = `M${a2.x} ${a2.y}L${b2.x} ${b2.y}`;
    const color5 = tones3[p.tone], dash = p.dashed ? 'stroke-dasharray="14 11"' : "";
    const arrow5 = (tip, dir, back) => {
      const base2 = shifted(tip, dir, back * headLength), nx = -dir.y * half, ny = dir.x * half;
      return `<path data-atom-arrow d="M${tip.x} ${tip.y}L${base2.x + nx} ${base2.y + ny}L${base2.x - nx} ${base2.y - ny}Z" fill="${color5}" stroke="${tokens.ink}" stroke-width="2.2" stroke-linejoin="round"/>`;
    };
    let label3 = "";
    const labelText = copy3(p.label, "connector label", 22);
    if (labelText) {
      const lx = number2(p.labelX, "labelX", 30, 1250), ly = number2(p.labelY, "labelY", 30, 690), lw = units7(labelText) * 25 + 34;
      if (lx - lw / 2 < 4 || lx + lw / 2 > 1276) throw new Error("Connector label leaves preview canvas");
      label3 = `<g data-atom-label><rect x="${lx - lw / 2 + 3}" y="${ly - 28 + 4}" width="${lw}" height="43" rx="14" fill="${tokens.shadow}"/><rect x="${lx - lw / 2}" y="${ly - 28}" width="${lw}" height="43" rx="14" fill="#f3faff" stroke="${tokens.ink}" stroke-width="2"/>${txt2(lx, ly + 2, labelText, 25, h, 'text-anchor="middle"')}</g>`;
    }
    return `<g data-atom="connector" style="${font4}" fill="${tokens.ink}"><path d="${d}" fill="none" stroke="${tokens.ink}" stroke-width="${stroke + 3}" stroke-linecap="round" stroke-linejoin="round" ${dash}/><path data-motion="line" data-atom-line d="${d}" fill="none" stroke="${color5}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" ${dash}/>${p.arrowStart ? arrow5(start, first, 1) : ""}${p.arrowEnd ? arrow5(end, last, -1) : ""}${label3}</g>`;
  }
  var reference3 = { basis: "\u4ECE\u7528\u6237\u5DF2\u786E\u8BA4\u7684\u52A8\u753B\u98CE\u9020\u578B\u4E2D\u62C6\u51FA\u7684\u53EF\u72EC\u7ACB\u7EC4\u5408\u5BF9\u8C61\uFF1B\u539F\u751F SVG\uFF0C\u53EF\u7F16\u8F91\u6B63\u6587\u548C\u51E0\u4F55\u3002", source: "reports/animation-style/reference-review-v8/REVIEW.md", level: "designed" };
  var make4 = (id, name, description, defaults3, render) => ({ id, name, category: "\u52A8\u753B\u98CE \xB7 \u57FA\u7840\u7EC4\u4EF6", description, width: 1280, height: 720, defaultEffect: "none", defaults: defaults3, reference: { ...reference3 }, render(p, h) {
    return preview3(render({ ...defaults3, ...p }, h), name, h);
  } });
  var components7 = [
    make4("ani-atom-table", "\u72EC\u7ACB\u8868\u683C", "2\u20136\u5217\u30011\u20138\u884C\uFF1B\u5217\u5BBD\u6309weight\u5206\u914D\uFF0C\u5355\u5143\u683C\u53EF\u7528\u6587\u5B57\u6216{label,tone}\u72B6\u6001\uFF1B\u53EF\u8C03\u6574\u4F4D\u7F6E\u4E0E\u5BF9\u8C61\u5C3A\u5BF8\u3002", tableDefaults, renderTableAtom),
    make4("ani-atom-browser", "\u72EC\u7ACB\u6D4F\u89C8\u5668\u6846", "1\u20133\u4E2A\u6807\u7B7E\u9875\u3001\u5730\u5740\u3001\u6B63\u6587\u548C\u5217\u8868\u53EF\u7F16\u8F91\uFF1BimageSrc\u4F7F\u7528\u5DE5\u7A0B\u6839\u76EE\u5F55\u4E0B\u7684\u76F8\u5BF9\u56FE\u7247\u8DEF\u5F84\uFF0Ccontain/cover\u51B3\u5B9A\u9002\u914D\uFF0C\u4E0D\u652F\u6301\u5916\u94FE\u6216\u4E0A\u7EA7\u76EE\u5F55\u3002", browserDefaults, renderBrowserAtom),
    make4("ani-atom-connector", "\u72EC\u7ACB\u8FDE\u7EBF", "\u76F4\u7EBF\u3001\u66F2\u7EBF\u6216\u6298\u7EBF\uFF1B\u914D\u7F6E\u7AEF\u70B9\u3001\u63A7\u5236\u70B9\u3001\u7BAD\u5934\u3001\u7EBF\u5BBD\u3001\u989C\u8272\u53CA\u6807\u7B7E\uFF0C\u4E0D\u7ED1\u5B9A\u7279\u5B9A\u6E90/\u76EE\u6807\u5BF9\u8C61\u3002", connectorDefaults, renderConnectorAtom)
  ];

  // semantic-primitives.mjs
  var esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var en = (...values) => ({ type: "string", enum: values });
  var number3 = (minimum, maximum) => ({ type: "number", minimum, maximum });
  var color2 = { type: "string", pattern: "^#[0-9a-fA-F]{6}$" };
  var arrowStyles = [
    { id: "solid", name: "\u5B9E\u5FC3\u76F4\u6307\u7BAD\u5934", geometry: "straight", tail: [46, 120], head: [440, 120] },
    { id: "open", name: "\u5F00\u653E\u7EBF\u5934\u7BAD\u5934", geometry: "straight", tail: [46, 120], head: [440, 120] },
    { id: "double-line", name: "\u53CC\u8F68\u7EBF\u7BAD\u5934", geometry: "straight", tail: [46, 120], head: [440, 120] },
    { id: "curve", name: "\u5E73\u6ED1\u5F27\u7EBF\u7BAD\u5934", geometry: "curve", tail: [46, 178], head: [440, 64] },
    { id: "elbow", name: "\u76F4\u89D2\u6298\u7EBF\u7BAD\u5934", geometry: "elbow", tail: [46, 182], head: [440, 64] },
    { id: "dashed", name: "\u865A\u7EBF\u8FDB\u7A0B\u7BAD\u5934", geometry: "straight", tail: [46, 120], head: [440, 120] },
    { id: "handdrawn", name: "\u624B\u7ED8\u53CC\u7B14\u7BAD\u5934", geometry: "straight", tail: [46, 124], head: [440, 120] },
    { id: "ribbon", name: "\u71D5\u5C3E\u5E26\u72B6\u7BAD\u5934", geometry: "straight", tail: [46, 120], head: [440, 120] },
    { id: "block3d", name: "\u7ACB\u4F53\u5757\u72B6\u7BAD\u5934", geometry: "straight", tail: [46, 120], head: [440, 120] },
    { id: "return", name: "\u56DE\u8F6C\u7ED5\u884C\u7BAD\u5934", geometry: "return", tail: [46, 180], head: [440, 64] },
    { id: "chevrons", name: "\u8FDE\u7EED\u4EBA\u5B57\u7BAD\u5934", geometry: "straight", tail: [46, 120], head: [440, 120] },
    { id: "tapered", name: "\u6E10\u5BBD\u6954\u5F62\u7BAD\u5934", geometry: "straight", tail: [46, 120], head: [440, 120] },
    { id: "swallowtail", name: "\u7A7AV\u53E3\u71D5\u5C3E\u7BAD\u5934", geometry: "straight", tail: [46, 120], head: [440, 120] }
  ];
  var labelVariants = [
    { id: "heading-underline", name: "\u6807\u9898\u4E0B\u5212\u7EBF", roles: ["heading"] },
    { id: "object-tab", name: "\u5BF9\u8C61\u9875\u7B7E", roles: ["object"] },
    { id: "action-ribbon", name: "\u52A8\u4F5C\u98D8\u5E26", roles: ["action"] },
    { id: "conclusion-bracket", name: "\u7ED3\u8BBA\u89D2\u62EC\u6846", roles: ["conclusion"] },
    { id: "conclusion-card", name: "\u7ED3\u8BBA\u53E0\u5C42\u5361", roles: ["conclusion"] },
    { id: "caution-notched", name: "\u6CE8\u610F\u5207\u89D2\u6846", roles: ["caution"] },
    { id: "question-speech", name: "\u7591\u95EE\u5BF9\u8BDD\u6846", roles: ["question"] },
    { id: "note-outline", name: "\u6CE8\u89E3\u65B9\u7EBF\u6846", roles: ["note"] }
  ];
  var semanticRules = {
    "direction-arrow": { style: en(...arrowStyles.map((x) => x.id)), direction: en("right", "left", "up", "down"), color: color2, outlineColor: color2, secondaryColor: color2, strokeWidth: number3(2, 14), headSize: number3(8, 50), tailDepth: number3(6, 60), scale: number3(0.5, 1), flipBend: { type: "boolean" }, boxWidth: number3(48, 1280), boxHeight: number3(20, 720) },
    "semantic-label": { variant: en(...labelVariants.map((x) => x.id)), text: { type: "string", maxLength: 32 }, lines: { type: "array", minItems: 0, maxItems: 2, items: { type: "string", maxLength: 24 } }, color: color2, background: color2, borderColor: color2, fontSize: number3(18, 46), fontWeight: { type: "integer", minimum: 400, maximum: 900 }, strokeWidth: number3(1, 8), align: en("left", "center"), direction: en("right", "left"), scale: number3(0.5, 1), boxWidth: number3(64, 1280), boxHeight: number3(36, 720) }
  };
  var arrowDefaults = { style: "solid", direction: "right", color: "#0879ff", outlineColor: "#10275f", secondaryColor: "#b5deff", strokeWidth: 8, headSize: 34, tailDepth: 20, scale: 1, flipBend: false, boxWidth: 480, boxHeight: 240 };
  var labelDefaults = { variant: "heading-underline", text: "\u53EF\u7F16\u8F91\u6807\u9898", lines: [], color: "#10275f", background: "#e8f5ff", borderColor: "#0879ff", fontSize: 34, fontWeight: 700, strokeWidth: 3, align: "center", direction: "right", scale: 1, boxWidth: 600, boxHeight: 180 };
  var g = (name, body) => `<g data-kit-node="${name}" data-motion="line">${body}</g>`;
  function arrowGeometry(p) {
    const vertical = ["up", "down"].includes(p.direction), W = vertical ? p.boxHeight : p.boxWidth, H = vertical ? p.boxWidth : p.boxHeight, w = p.strokeWidth, h = p.headSize, m = Math.max(w + 2, Math.min(W * 0.09, 18)), x0 = m, x1 = W - m;
    if (x1 - x0 < h * 1.35 + 12 || H < 2 * h + w + 4) throw Error("direction-arrow: viewport too small for headSize/strokeWidth; enlarge the layer or reduce these explicit sizes");
    if (p.style === "swallowtail" && p.tailDepth > x1 - h * 1.35 - x0 - 8) throw Error("direction-arrow: tailDepth leaves no readable shaft; reduce it or enlarge the viewport");
    const turn = { right: "", left: `translate(${p.boxWidth} 0) scale(-1 1)`, up: `translate(0 ${p.boxHeight}) rotate(-90)`, down: `translate(${p.boxWidth} 0) rotate(90)` }[p.direction];
    return { W, H, w, h, x0, x1, cy: H / 2, top: h + w / 2 + 2, bottom: H - h - w / 2 - 2, turn };
  }
  function arrow(p) {
    const { W, H, w, h, x0, x1, cy, top, bottom, turn } = arrowGeometry(p), c = esc(p.color), o = esc(p.outlineColor), s2 = esc(p.secondaryColor), end = x1 - h * 1.35, span = x1 - x0;
    const line3 = (d, dash = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash ? ' stroke-dasharray="' + dash + '"' : ""}/>`;
    const area = (d, fill = c, stroke = o) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(1.5, w / 3)}" stroke-linejoin="round"/>`;
    const head = (y) => g("arrowhead", area(`M${x1} ${y}L${end} ${y - h}L${end} ${y + h}Z`));
    let body = "";
    if (p.style === "solid") body = g("shaft", area(`M${x0} ${cy - w}H${end}V${cy + w}H${x0}Z`)) + head(cy);
    if (p.style === "open") body = g("shaft", line3(`M${x0} ${cy}H${x1}`)) + g("arrowhead", line3(`M${end} ${cy - h}L${x1} ${cy}L${end} ${cy + h}`));
    if (p.style === "double-line") body = g("shaft", line3(`M${x0} ${cy - w * 1.25}H${end}M${x0} ${cy + w * 1.25}H${end}`)) + head(cy);
    if (p.style === "dashed") body = g("shaft", line3(`M${x0} ${cy}H${end}`, `${w * 2.2} ${w * 1.4}`)) + head(cy);
    if (p.style === "curve") body = g("shaft", line3(`M${x0} ${bottom}C${x0 + span * 0.45} ${bottom} ${x0 + span * 0.35} ${top} ${end} ${top}`)) + head(top);
    if (p.style === "elbow") body = g("shaft", line3(`M${x0} ${bottom}H${x0 + span * 0.43}V${top}H${end}`)) + head(top);
    if (p.style === "return") body = g("shaft", line3(`M${x0} ${bottom}H${x0 + span * 0.66}Q${x0 + span * 0.83} ${bottom} ${x0 + span * 0.83} ${cy}Q${x0 + span * 0.83} ${cy - 10} ${x0 + span * 0.6} ${cy - 10}H${x0 + span * 0.23}Q${x0 + span * 0.13} ${cy - 10} ${x0 + span * 0.13} ${top + 8}Q${x0 + span * 0.13} ${top} ${x0 + span * 0.3} ${top}H${end}`)) + head(top);
    if (p.style === "handdrawn") body = g("shaft", line3(`M${x0} ${cy + 3}Q${x0 + span * 0.2} ${cy - 9} ${x0 + span * 0.4} ${cy + 2}T${end} ${cy}`) + `<path d="M${x0 + 4} ${cy + 11}Q${x0 + span * 0.4} ${cy + 5} ${end - 4} ${cy + 11}" fill="none" stroke="${c}" stroke-width="${Math.max(2, w * 0.28)}" opacity=".6"/>`) + g("arrowhead", line3(`M${end} ${cy - h}Q${x1 - 10} ${cy - 12} ${x1} ${cy}Q${x1 - 10} ${cy + 12} ${end} ${cy + h}`));
    if (p.style === "ribbon") body = g("ribbon", area(`M${x0} ${cy - h * 0.62}H${end}V${cy - h}L${x1} ${cy}L${end} ${cy + h}V${cy + h * 0.62}H${x0}L${x0 + h * 0.55} ${cy}Z`)) + g("fold", area(`M${x0} ${cy + h * 0.62}L${x0 + h * 0.55} ${cy}L${x0 + h * 1.1} ${cy + h * 0.62}Z`, s2, "none"));
    if (p.style === "swallowtail") {
      body = g("arrowhead", area(`M${x0} ${cy - h * 0.62}H${end}V${cy - h}L${x1} ${cy}L${end} ${cy + h}V${cy + h * 0.62}H${x0}L${x0 + p.tailDepth} ${cy}Z`));
    }
    if (p.style === "block3d") {
      const d = `M${x0} ${cy - h * 0.52}H${end}V${cy - h}L${x1} ${cy}L${end} ${cy + h}V${cy + h * 0.52}H${x0}Z`, depth = Math.min(10, (H - 2 * h - w) / 2);
      body = g("depth", `<g transform="translate(-${depth * 0.5} ${depth})">${area(d, o, o)}</g>`) + g("arrowhead", area(d)) + g("bevel", `<path d="M${x0 + 6} ${cy - h * 0.52 + 6}H${end - 6}V${cy - h + 8}" fill="none" stroke="${s2}" stroke-width="${Math.max(2, w * 0.5)}"/>`);
    }
    if (p.style === "chevrons") body = g("shaft", line3(`M${x0} ${cy}H${x0 + span * 0.18}`)) + [0.36, 0.68, 1].map((f, i) => {
      const x = x0 + span * f, hw = Math.min(h * 1.35, span * 0.27);
      return g(i === 2 ? "arrowhead" : "chevron-" + i, area(`M${x - hw} ${cy - h}L${x} ${cy}L${x - hw} ${cy + h}L${x - hw * 0.72} ${cy}Z`, i === 2 ? c : s2));
    }).join("");
    if (p.style === "tapered") body = g("shaft", area(`M${x0} ${cy}L${end} ${cy - h * 0.64}V${cy - h}L${x1} ${cy}L${end} ${cy + h}V${cy + h * 0.64}Z`)) + g("highlight", `<path d="M${x0 + span * 0.17} ${cy - 2}L${end - 8} ${cy - h * 0.38}" stroke="${s2}" stroke-width="${Math.max(2, w * 0.35)}" fill="none"/>`);
    return `<g data-kit-node="arrow" data-arrow-style="${p.style}" data-direction="${p.direction}" transform="translate(${p.boxWidth / 2} ${p.boxHeight / 2}) scale(${p.scale}) translate(${-p.boxWidth / 2} ${-p.boxHeight / 2})"><g transform="${turn}"><g transform="${p.flipBend ? `translate(0 ${H}) scale(1 -1)` : ""}">${body}</g></g></g>`;
  }
  function fitLines(p, width) {
    const units10 = (t) => [...t].reduce((n4, c) => n4 + (/[\u0000-\u00ff]/.test(c) ? 0.56 : 1), 0);
    if (p.lines.length) {
      if (p.lines.some((l) => units10(l) * p.fontSize > width)) throw Error("semantic-label: explicit line exceeds available width; shorten it or lower fontSize");
      return p.lines;
    }
    const result = [];
    let current = "";
    for (const ch of p.text) {
      if (ch === "\n") {
        result.push(current);
        current = "";
        continue;
      }
      if (current && units10(current + ch) * p.fontSize > width) {
        result.push(current);
        current = "";
      }
      current += ch;
    }
    result.push(current);
    if (result.length > 2) throw Error("semantic-label: text exceeds two lines; shorten it or lower fontSize");
    return result;
  }
  function label2(p, h) {
    const c = esc(p.color), bg = esc(p.background), bc = esc(p.borderColor), w = p.strokeWidth;
    const shape = (d, fill = bg, stroke = bc) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`;
    const box2 = (x, y, width, height, fill = bg) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="${bc}" stroke-width="${w}"/>`;
    let decor = "", left = 42, right = 558, centerY = 86;
    if (p.variant === "heading-underline") decor = g("underline", shape("M34 145H566", "none") + shape("M34 137H153V150H34Z", bc, bc));
    if (p.variant === "object-tab") {
      decor = g("tab", shape("M28 41H58L80 20H223L245 41H571V151H28Z") + shape("M28 41H571", "none"));
      left = 49;
      right = 551;
      centerY = 96;
    }
    if (p.variant === "action-ribbon") {
      decor = g("ribbon", shape(p.direction === "right" ? "M27 31H530L574 89L530 147H27L56 89Z" : "M573 31H70L26 89L70 147H573L544 89Z"));
      left = 76;
      right = 524;
      centerY = 89;
    }
    if (p.variant === "conclusion-bracket") decor = g("brackets", shape("M83 25H27V150H83M517 25H573V150H517", "none") + shape("M42 39H558V137H42Z", bg, "none"));
    if (p.variant === "conclusion-card") {
      decor = g("depth", box2(36, 36, 546, 128, "#c1ddf3")) + g("card", box2(22, 23, 546, 128)) + g("rule", shape("M40 38H550", "none"));
      left = 47;
      right = 544;
      centerY = 88;
    }
    if (p.variant === "caution-notched") {
      decor = g("notched", shape("M48 22H553L576 45V132L553 155H26V45Z")) + g("warning", shape("M74 54L100 105H48Z", bc, bc) + `<path d="M74 69V85M74 94V97" stroke="${bg}" stroke-width="5"/>`);
      left = 119;
      right = 548;
      centerY = 88;
    }
    if (p.variant === "question-speech") {
      decor = g("speech", shape(p.direction === "right" ? "M28 22H573V139H507L533 169L467 139H28Z" : "M28 22H573V139H132L68 169L94 139H28Z"));
      left = 51;
      right = 550;
      centerY = 80;
    }
    if (p.variant === "note-outline") {
      decor = g("frame", box2(29, 24, 544, 129)) + g("accent", shape("M29 24H41V153H29Z", bc, bc));
      left = 65;
      right = 548;
      centerY = 88;
    }
    const sx = p.boxWidth / 600, sy = p.boxHeight / 180;
    left *= sx;
    right *= sx;
    centerY *= sy;
    const lines3 = fitLines(p, right - left), lineHeight = p.fontSize * 1.15, startY = centerY - (lines3.length - 1) * lineHeight / 2 + p.fontSize * 0.34;
    if (lines3.length * lineHeight > p.boxHeight * 0.76) throw Error("semantic-label: viewport height too small for fontSize and line count");
    const text7 = lines3.map((line3, i) => `<text data-kit-node="text-line-${i}" x="${p.align === "left" ? left : (left + right) / 2}" y="${startY + i * lineHeight}" text-anchor="${p.align === "left" ? "start" : "middle"}" fill="${c}" font-size="${p.fontSize}" style="font-weight:${p.fontWeight}">${h?.esc ? h.esc(line3) : esc(line3)}</text>`).join("");
    decor = decor.replaceAll("<path ", '<path vector-effect="non-scaling-stroke" ').replaceAll("<rect ", '<rect vector-effect="non-scaling-stroke" ');
    return `<g data-kit-node="label" data-label-variant="${p.variant}" transform="translate(${p.boxWidth / 2} ${p.boxHeight / 2}) scale(${p.scale}) translate(${-p.boxWidth / 2} ${-p.boxHeight / 2})"><g transform="scale(${sx} ${sy})">${decor}</g>${text7}</g>`;
  }
  var semanticParts = [
    { key: "direction-arrow", name: "\u53EF\u8C03\u65B9\u5411\u7BAD\u5934", width: 480, height: 240, defaults: arrowDefaults, description: "13\u79CD\u771F\u5B9E\u7BAD\u5934\u5F62\u6001\uFF1B\u660E\u786E\u5934\u90E8\u4E0E\u5C3E\u7AEF\u3002\u65B9\u5411right/left/up/down\u3002strokeWidth2\u201314\uFF0CheadSize8\u201350\uFF0Cscale0.5\u20131\u3002swallowtail\u7684tailDepth6\u201360\u4E3A\u5B9E\u9645\u50CF\u7D20\u7A7AV\u53E3\u6DF1\u5EA6\uFF1B\u539F12\u79CD\u5916\u89C2\u4FDD\u6301\u3002arrowAnchors\u8FD4\u56DE\u7CBE\u786E\u7AEF\u70B9\u3002\u4E0D\u662F\u5173\u8054\u62EC\u7EBF\u3002", draw: arrow },
    { key: "semantic-label", name: "\u8BED\u4E49\u6587\u5B57\u6807\u6CE8\u6846", width: 600, height: 180, defaults: labelDefaults, description: "8\u79CD\u6807\u9898/\u5BF9\u8C61/\u52A8\u4F5C/\u7ED3\u8BBA/\u6CE8\u610F/\u7591\u95EE/\u6CE8\u89E3\u5F62\u6001\u3002text\u226432\u5B57\uFF0C\u6700\u591A2\u884C\uFF1Blines\u53EF\u660E\u786E\u6700\u591A2\u884C\u6BCF\u884C\u226424\u3002\u5B57\u53F718\u201346\u4E14\u4E0D\u81EA\u52A8\u7F29\u5B57\uFF0C\u8FC7\u957F\u62A5\u9519\u3002\u540C\u8BED\u4E49\u5168\u7247\u51BB\u7ED3variant\u3002", draw: label2 }
  ];

  // transfer-kit-primitives.mjs
  var C = { ink: "#10275f", blue: "#0879ff", light: "#dff2ff", edge: "#86c6ff", shadow: "#b4dafe", mint: "#009e7a", orange: "#ff8709", gray: "#bbc9d5" };
  var kitCSS = '.ani-kit text{font-family:ComponentHan,ComponentUI,"Microsoft YaHei",sans-serif;font-weight:700}.ani-kit [data-kit-node]{transform-box:fill-box;transform-origin:center}.ani-kit path,.ani-kit rect,.ani-kit circle,.ani-kit ellipse{stroke-linecap:round;stroke-linejoin:round}';
  var safe = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var esc2 = (h, v) => h?.esc ? h.esc(v) : safe(v);
  var num5 = (v, d = 0) => Number.isFinite(Number(v)) ? Number(v) : d;
  var bounded = (v, a2, b2, d = a2) => Math.min(b2, Math.max(a2, num5(v, d)));
  var node = (name, s2, attrs = "") => `<g data-kit-node="${name}" ${attrs}>${s2}</g>`;
  var path = (d, fill = C.light, stroke = C.ink, sw = 3) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  var rect = (x, y, w, ht, r, fill, stroke = "none", sw = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${ht}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  var txt3 = (h, x, y, text7, size = 28, max = 420, fill = C.ink, anchor = "start") => {
    const value = String(text7 ?? "");
    const chars = Array.from(value).reduce((n4, c) => n4 + (/[\u0000-\u00ff]/.test(c) ? 0.57 : 1), 0);
    const actual = Math.min(size, max / Math.max(chars, 1));
    if (actual < size * 0.69) throw new Error(`Transfer kit text exceeds readable width: ${value}`);
    return `<text x="${x}" y="${y}" font-size="${actual}" fill="${fill}" text-anchor="${anchor}" data-kit-node="text">${esc2(h, value)}</text>`;
  };
  var defs = (h, key, colors3) => {
    const id = esc2(h, h?.uid ? h.uid("kit-" + key) : "kit-" + key);
    return { id, fill: `url(#${id})`, html: `<defs><linearGradient id="${id}" x1="0" y1="0" x2=".7" y2="1">${colors3.map((v, i) => `<stop offset="${i / (colors3.length - 1)}" stop-color="${v}"/>`).join("")}</linearGradient></defs>` };
  };
  var grad = (h, key, colors3, fn) => {
    const g2 = defs(h, key, colors3);
    return g2.html + fn(g2.fill);
  };
  var part = (key, name, width, height, defaults3, description, draw) => ({ key, name, width, height, defaults: defaults3, description, draw });
  var controls = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">${["#ff5953", "#ffd438", "#08c9a3"].map((c, i) => `<circle cx="${i * 31}" cy="0" r="10" fill="${c}" stroke="${C.ink}" stroke-width="1.7"/><circle cx="${i * 31 - 3}" cy="-4" r="3" fill="white" opacity=".6"/>`).join("")}</g>`;
  var product = (kind, h) => {
    if (kind === "shoe") return grad(h, "shoe", ["#ecfaff", "#a2d9ff", "#308ce0"], (g2) => node(
      "product",
      node("rear-shoe", path("M43 55L65 35Q74 31 79 44L87 58L103 67Q113 72 111 86Q103 99 76 103L42 94Q31 88 33 78Z", g2, C.ink, 2.4) + path("M34 83Q53 94 76 91L109 80L110 89Q85 111 45 101Q31 98 31 90Z", "#fff", C.ink, 2.2) + path("M64 40L75 46L80 61", "none", "#1972ba", 4) + path("M58 53L75 61M53 59L70 67M47 66L64 74", "none", "#fff", 3)) + node("front-shoe", path("M72 57L91 43Q97 42 100 50L109 75Q119 79 124 86L126 106Q103 128 40 125Q24 124 21 117L22 103Q22 96 36 91L59 76Z", g2, C.ink, 2.8) + path("M22 108Q40 117 65 112L103 101L125 95L126 106Q112 128 46 132Q22 131 20 120Z", "#fff", C.ink, 2.6) + path("M73 62L87 70L94 82L61 102L37 106", "none", "#076abe", 5) + path("M66 70L86 79M59 77L79 86M51 83L72 93", "none", "#fff", 3.5) + path("M103 74L111 86L103 91L94 82Z", "#0877cb", C.ink, 1.5) + path("M26 120Q66 127 114 111", "none", "#9dcee9", 2))
    ));
    if (kind === "chair") return grad(h, "chair", ["#b4e2ff", "#70b7ec", "#3288cf"], (g2) => node(
      "product",
      node("legs", path("M43 96L33 143H39L54 100M90 97L99 143H105L101 93M65 99L65 137H71L74 98M113 88L123 130H128L123 87", "#bd783d", "#714c34", 2.2)) + node("back", path("M60 14Q59 7 70 7L108 9Q119 10 118 22L109 87L66 96L49 71Z", g2, C.ink, 2.4) + path("M70 15L105 17Q110 17 109 27L102 72", "none", "#d9f1ff", 3)) + node("seat", path("M42 66Q46 61 57 63L93 72L113 70L111 91Q100 111 57 110L31 101Q25 97 27 88L32 74Z", g2, C.ink, 2.5) + path("M34 87Q65 99 93 90L109 81", "none", "#c4eaff", 4) + path("M29 96Q61 116 101 101", "none", "#2b7dbb", 3))
    ));
    if (kind === "plant") return grad(h, "pot", ["#fff", "#f4f5f5", "#cedae2"], (g2) => node(
      "product",
      node("stems", path("M73 104V32M73 88L43 55M74 81L101 42M70 92L106 73", "none", "#3c7a2b", 3.3)) + node("leaves", path("M72 79C46 58 58 21 70 12C89 32 88 62 72 79Z", "#72b644", "#255c30", 2.1) + path("M64 88C34 83 25 55 23 39C48 41 67 60 64 88Z", "#5aa03c", "#255c30", 2.1) + path("M80 84C80 53 101 29 115 26C120 53 105 75 80 84Z", "#83bd4d", "#255c30", 2.1) + path("M72 103C41 102 23 81 20 69C45 65 65 80 72 103Z", "#4f9636", "#255c30", 2.1) + path("M78 100C89 81 108 68 128 72C120 92 99 106 78 100Z", "#5ca83b", "#255c30", 2.1) + path("M70 25L72 70M32 50L57 77M105 40L87 71", "none", "#a7d175", 1.5)) + node("pot", `<ellipse cx="73" cy="104" rx="28" ry="9" fill="#795739" stroke="${C.ink}" stroke-width="2"/>` + path("M43 103L50 143Q72 151 94 143L102 103Q76 115 43 103Z", g2, C.ink, 2.4) + path("M50 109L57 139", "none", "white", 3) + path("M43 103Q72 115 102 103", "none", "#a3b7c9", 2))
    ));
    if (kind === "lamp") return grad(h, "lamp", ["#fff27b", "#ffb42b", "#f78a10"], (g2) => node("product", path("M46 23Q48 17 55 17H84Q91 17 93 25L113 78Q115 87 106 88H35Q25 87 29 78Z", g2, "#903600", 3) + path("M64 88H78V125H93Q101 125 101 137H42Q42 125 51 125H64Z", g2, "#903600", 3) + path("M51 26H82", "none", "#fff9c4", 5)));
    if (kind === "bag") return grad(h, "bag", ["#6ee9bf", "#05b49f", "#008577"], (g2) => node("product", path("M48 56V42C48 8 92 8 92 42V56H84V42C84 21 56 21 56 42V56Z", g2, C.ink, 3) + path("M36 55Q29 55 28 67L20 126Q19 139 33 140H109Q122 139 120 126L112 66Q111 55 103 55Z", g2, C.ink, 3) + path("M38 59L34 125Q34 133 25 136M100 61L111 130", "none", "#007567", 3) + path("M48 66L50 77", "none", C.ink, 4)));
    return grad(h, "cup", ["#59c7ff", "#1688ff", "#005acb"], (g2) => node("product", path("M93 56C129 48 128 103 96 106L95 94C113 92 114 66 94 70Z", g2, C.ink, 3) + path("M33 40C34 23 99 23 100 40V119C99 151 34 151 33 119Z", g2, C.ink, 3) + `<ellipse cx="66.5" cy="40" rx="33.5" ry="12" fill="#0658b5" stroke="${C.ink}" stroke-width="3"/><path d="M40 39Q65 27 93 38" fill="none" stroke="#8bdcff" stroke-width="3"/>` + path("M43 60V102", "none", "#8bdcff", 6)));
  };
  var parts = [
    part("truck-body", "\u655E\u5F00\u8D27\u8F66\u8F66\u53A2", 600, 390, { open: true, label: "", showChassis: true }, "\u539F\u751F600\xD7390\uFF1B\u655E\u53E3\u3001\u5E95\u677F\u3001\u7ACB\u67F1\u72EC\u7ACB\u3002label\u226412\u5B57\uFF1B\u4E0D\u542B\u7EB8\u7BB1\u548C\u8F6E\u5B50\u3002", (p, h) => {
      const g2 = defs(h, "body", ["#f8fdff", "#97d6ff", "#2789d9"]);
      return g2.html + node("chassis", p.showChassis ? path("M28 308H590V355H53Q30 354 28 335Z", "#06457f") + rect(89, 348, 475, 23, 6, "#3478b2", C.ink, 3) + rect(334, 324, 115, 37, 9, "#2c8eda", C.ink, 3) + path("M365 326V359M419 326V359", "none", "#0e568f", 2) : "") + node("rear-panel", path("M24 80L171 20L181 307L25 317Z", "#effaff") + path("M37 89L157 42M42 128L157 99M42 176L157 153M42 225L157 209M42 274L157 265", "none", "#a6dfff", 7)) + node("inside", path("M180 39L579 65L578 309L180 308Z", "#1d6caf") + path("M194 71L446 91L446 281L194 289Z", "#267dc3") + path("M446 91L566 65V287L446 281Z", "#4d9fe3") + path("M194 289L446 281L566 287L570 310L184 311Z", "#83c4f2") + path("M203 121L439 137M203 167L439 177M203 219L439 225M458 118L554 98M458 171L553 156M458 226L552 215", "none", "#4e9cd8", 5)) + node("frame", path("M172 20L582 46Q593 46 593 60V311Q593 326 579 325L171 326Q159 326 159 313V38Q159 23 172 20Z", g2.fill) + path("M189 47L572 66V301H189Z", p.open ? "#246fae" : g2.fill, C.ink, 2) + (p.open ? path("M197 66L444 86V284L197 289Z", "#3485c8") + path("M444 86L565 66V291L444 284Z", "#66a9e4") + path("M197 289L444 284L565 291L566 303H197Z", "#9fd7fa") + path("M203 118L434 130M203 170L434 179M203 221L434 227M456 121L553 102M456 173L553 159M456 226L553 214", "none", "#2c76b4", 5) : "") + path("M175 31L180 310M189 48L574 64", "none", "#bfeaff", 5)) + node("rail", rect(168, 309, 421, 15, 5, "#c9eeff", C.ink, 2) + rect(252, 350, 328, 17, 3, "#347ab7", C.ink, 2)) + txt3(h, 375, 190, p.label, 28, 310);
    }),
    part("truck-cab", "\u84DD\u767D\u8D27\u8F66\u9A7E\u9A76\u5BA4", 300, 390, { facing: "right" }, "\u539F\u751F300\xD7390\uFF1B\u8F66\u7A97\u3001\u53CD\u5149\u3001\u540E\u89C6\u955C\u3001\u4FDD\u9669\u6760\u72EC\u7ACB\uFF0C\u4E0D\u542B\u8F66\u8F6E\u3002", (p, h) => grad(h, "cab", ["#ffffff", "#e8f8ff", "#7ac4f4"], (g2) => {
      const body = node("roof", path("M14 56C89 52 126 71 151 121L28 128Z", g2)) + node("cab-body", path("M21 115L171 120Q198 121 213 154L258 249Q270 267 270 313V353H23Z", g2) + path("M25 130H123Q151 130 163 155L212 257V339H28Z", "#faffff", C.ink, 3) + path("M28 328H107Q147 279 195 317L213 356H28Z", "#0871c0", C.ink, 3)) + node("side-window", path("M48 144H104Q118 144 124 159L148 221Q152 236 138 237L111 218L47 210Q39 207 39 195V154Q39 145 48 144Z", "#087bcc", C.ink, 3) + path("M54 194L100 151M82 209L119 169", "none", "#35b5ff", 10) + path("M106 217L125 193Q139 191 145 221", "none", "#075696", 6)) + node("windscreen", path("M137 143L179 146Q192 148 199 167L240 248L173 231Z", "#50bff0", C.ink, 3) + path("M170 153L160 184M194 170L183 207", "none", "#cdf6ff", 8) + path("M169 229L237 244", "none", "#02538a", 6)) + node("mirror", path("M220 174L232 173L237 206L224 211Z", "#0b4673") + path("M229 208L230 232H205", "none", C.ink, 3)) + node("details", rect(42, 254, 27, 16, 4, "#075894", C.ink, 2) + rect(202, 275, 55, 32, 5, "#003c71", C.ink, 3) + path("M210 290H247", "none", "#77c6f4", 5) + rect(166, 263, 18, 38, 4, "#ffbc24", C.ink, 2) + rect(187, 267, 17, 36, 4, "#f2fcff", C.ink, 2) + rect(8, 350, 273, 26, 5, "#8ccff4", C.ink, 3) + rect(209, 353, 40, 18, 3, "#f3fdff", C.ink, 2) + path("M34 236L95 243", "none", "#d2efff", 5));
      return p.facing === "left" ? `<g transform="translate(300 0) scale(-1 1)">${body}</g>` : body;
    })),
    part("wheel", "\u8D27\u8F66\u8F6E\u80CE", 120, 120, { rotation: 0 }, "\u539F\u751F120\xD7120\uFF1B\u65CB\u8F6C\u4EC5\u63A7\u5236\u8F6E\u6BC2\u7EC4\uFF1B\u65E0\u6587\u5B57\u3002", (p, h) => `<g transform="rotate(${num5(p.rotation)} 60 60)">${node("tire", `<circle cx="60" cy="60" r="56" fill="#092c56" stroke="${C.ink}" stroke-width="4"/><circle cx="60" cy="60" r="44" fill="#164577" stroke="#2163a0" stroke-width="5"/>`)}${node("hub", `<circle cx="60" cy="60" r="31" fill="#acd8f6" stroke="#061d4d" stroke-width="3"/><circle cx="60" cy="60" r="13" fill="#245b8c" stroke="#08234e" stroke-width="3"/>` + Array.from({ length: 6 }, (_, i) => {
      const a2 = i * Math.PI / 3;
      return `<circle cx="${60 + 22 * Math.cos(a2)}" cy="${60 + 22 * Math.sin(a2)}" r="4" fill="#245c91"/>`;
    }).join(""))}</g>`),
    part("cargo-box", "\u6709\u4F53\u79EF\u7684\u5C01\u88C5\u7EB8\u7BB1", 160, 130, { label: "", stamp: true }, "\u539F\u751F160\xD7130\uFF1B\u6B63\u9762\u3001\u4FA7\u9762\u3001\u80F6\u5E26\u53EF\u72EC\u7ACB\u663E\u9690\uFF1Blabel\u22646\u5B57\u3002", (p, h) => grad(h, "cargo", ["#ffe0a1", "#e7aa5c", "#c58440"], (g2) => node("box", path("M9 24L36 13L151 22V117L125 127L9 114Z", g2) + path("M9 24L125 31V127L9 114Z", g2) + path("M125 31L151 22V117L125 127Z", "#ce924d") + path("M9 24L36 13L151 22L125 31Z", "#ffd699") + path("M65 19L84 21V57L74 51L65 55Z", "#fff0c9", "#edc992", 1) + rect(22, 38, 25, 17, 1, "#fff3d8") + path("M26 43H43M26 48H41", "none", "#d8b687", 1.6)) + node("stamp", p.stamp ? rect(101, 96, 16, 19, 1, "none", "#644721", 1.3) + path("M104 109V100M102 102L104 100L106 102M113 109V100M111 102L113 100L115 102", "none", "#644721", 1.4) : "") + txt3(h, 66, 87, p.label, 17, 89, C.ink, "middle"))),
    part("ground-shadow", "\u692D\u5706\u5730\u9762\u6295\u5F71", 600, 70, { opacity: 0.55, color: "#a9d6fc" }, "\u539F\u751F600\xD770\uFF1Bopacity 0\u20131\uFF1B\u4E0D\u542B\u5BF9\u8C61\u3002", (p) => `<ellipse cx="300" cy="35" rx="295" ry="30" fill="${safe(p.color)}" opacity="${bounded(p.opacity, 0, 1, 0.55)}"/>`),
    part("photo-card", "\u5546\u54C1\u7167\u7247\u5361\u7247", 180, 200, { kind: "cup", label: "", shadow: true }, "\u539F\u751F180\xD7200\uFF1Bkind cup/lamp/bag/shoe/chair/plant\uFF1Blabel\u22648\u5B57\u3002\u5546\u54C1\u59CB\u7EC8\u5728\u7167\u7247\u8FB9\u6846\u5185\u3002", (p, h) => grad(h, "photo", ["#fbfeff", "#e5f5ff", "#c6e7fd"], (g2) => node("shadow", p.shadow ? rect(17, 21, 158, 176, 13, "#bbdffa") : "") + node("photo-frame", rect(3, 3, 158, 176, 13, "#fff", C.edge, 2.6) + rect(13, 15, 137, 153, 9, g2)) + `<g data-kit-node="photo-product" transform="translate(18 21) scale(.94)">${product(p.kind, h)}</g>` + txt3(h, 81, 195, p.label, 17, 152, C.ink, "middle"))),
    part("window-shell", "\u84DD\u6807\u9898\u680F\u8F6F\u4EF6\u7A97\u53E3", 760, 560, { title: "\u5E94\u7528\u7A97\u53E3", controls: true, caption: "", brandSrc: "" }, "\u539F\u751F760\xD7560\uFF1B\u4E0D\u542B\u5185\u5C42\u56FE\u6216\u6B63\u6587\uFF1Btitle\u226416\u5B57\uFF0Ccaption\u22649\u5B57\u3002", (p, h) => grad(h, "window", ["#ffffff", "#effaff", "#d6edff"], (g2) => node("shadow", `<ellipse cx="386" cy="544" rx="367" ry="16" fill="#b9ddfc"/>`) + node("shell", rect(6, 7, 742, 535, 24, g2, C.ink, 3.5) + rect(11, 12, 732, 525, 20, "none", "#83caff", 3)) + grad(h, "bar", ["#39baff", "#007aff", "#0065ef"], (b2) => node("titlebar", path("M31 8H724Q749 8 749 32V74H7V32Q7 8 31 8Z", b2, C.ink, 3) + path("M20 20H726", "none", "#a2e9ff", 3))) + (p.controls ? node("window-controls", controls(43, 41) + path("M600 40H615M649 30H665V47H649ZM704 30L721 47M721 30L704 47", "none", "white", 3)) : "") + txt3(h, p.brandSrc ? 207 : 167, 53, p.title, 32, p.brandSrc ? 370 : 418, "white") + (p.brandSrc ? `<image href="${esc2(h, p.brandSrc)}" x="156" y="15" width="40" height="40"/>` : "") + (p.caption ? node("caption", rect(584, 89, 143, 36, 10, "#f7fdff", C.edge, 1.5) + txt3(h, 655, 114, p.caption, 20, 125, C.ink, "middle")) : ""))),
    part("buffer-area", "\u865A\u7EBF\u4E34\u65F6\u533A", 680, 370, { title: "\u4E34\u65F6\u533A\u57DF", labelWidth: 270, showLabel: true }, "\u539F\u751F680\xD7370\uFF1B\u53EA\u542B\u865A\u7EBF\u56F4\u5408\u4E0E\u6807\u7B7E\uFF1Btitle\u226414\u5B57\u3002", (p, h) => node("boundary", rect(5, 27, 670, 337, 21, "#f4fbff", "#0787ff", 2.6).replace("/>", ' stroke-dasharray="10 7"/>')) + (p.showLabel ? grad(h, "bufferlabel", ["#38aeff", "#0077fa"], (g2) => node("label", rect(340 - num5(p.labelWidth, 270) / 2, 2, num5(p.labelWidth, 270), 49, 24, g2) + txt3(h, 340, 36, p.title, 28, num5(p.labelWidth, 270) - 26, "white", "middle"))) : "")),
    part("chat-shell", "\u53EF\u586B\u6D88\u606F\u7684\u804A\u5929\u7A97\u53E3", 660, 640, { title: "\u667A\u80FD\u52A9\u624B", brandSrc: "", inputPlaceholder: "\u8F93\u5165\u6D88\u606F\u2026", showControls: true, caption: "\u60C5\u5883\u793A\u610F" }, "\u539F\u751F660\xD7640\uFF1B\u4E0D\u542B\u6D88\u606F\uFF0C\u6D88\u606F\u533A\u57DFx32 y165 w596 h370\uFF1Btitle\u226410\u5B57\uFF0Cinput\u226424\u5B57\u3002", (p, h) => grad(h, "chat", ["#ffffff", "#f2faff", "#ddf0ff"], (g2) => node("shadow", `<ellipse cx="334" cy="622" rx="319" ry="16" fill="#bfdefa"/>`) + node("shell", rect(5, 5, 646, 614, 23, g2, C.ink, 3.5) + rect(11, 11, 634, 602, 18, "none", "#72bffd", 2.5)) + grad(h, "chatbar", ["#35baff", "#087dff", "#0870ef"], (g3) => node("titlebar", path("M29 6H626Q651 6 651 31V59H5V31Q5 6 29 6Z", g3, C.ink, 3))) + (p.showControls ? node("controls", controls(34, 33, 0.83)) : "") + node("brand", `<circle cx="77" cy="111" r="42" fill="#e6f4ff" stroke="#8ac8fc" stroke-width="1.5"/>` + (p.brandSrc ? `<image href="${esc2(h, p.brandSrc)}" x="36" y="70" width="82" height="82" preserveAspectRatio="xMidYMid meet"/>` : path("M61 95H93V124H81L72 132V124H61Z", "#8fcdf8", C.ink, 2)) + txt3(h, 141, 126, p.title, 37, 435)) + node("input", rect(28, 551, 595, 50, 13, "white", "#a6d2ff", 2) + txt3(h, 48, 585, p.inputPlaceholder, 23, 504, "#9baab9")) + txt3(h, 609, 533, p.caption, 16, 190, "#87a8d1", "end"))),
    part("chat-message", "\u5355\u6761\u89D2\u8272\u6D88\u606F\u6C14\u6CE1", 500, 150, { role: "user", text: "\u53EF\u7F16\u8F91\u6D88\u606F", lines: [], tone: "blue", showAvatar: false, brandSrc: "" }, "\u539F\u751F500\xD7150\uFF1Brole user/assistant\uFF1Btext\u226420\u5B57\u6216lines\u6700\u591A3\u884C\u6BCF\u884C20\u5B57\u3002", (p, h) => {
      const user = p.role === "user", x = p.showAvatar ? 74 : 8, w = p.showAvatar ? 414 : 480, bg = p.tone === "orange" ? "#ffe9c1" : p.tone === "mint" ? "#d4f3eb" : user ? "#acd5ff" : "#deefff";
      const lines3 = Array.isArray(p.lines) && p.lines.length ? p.lines.slice(0, 3) : [p.text];
      const height = 58 + (lines3.length - 1) * 34;
      return node("bubble", rect(x, 6, w, height, 18, bg) + path(user ? `M${x + w - 24} ${height - 5}L${x + w + 5} ${height + 16}L${x + w - 3} ${height - 16}Z` : `M${x + 26} ${height - 6}L${x - 8} ${height + 16}L${x + 3} ${height - 20}Z`, bg, "none")) + (p.showAvatar ? node("avatar", `<circle cx="33" cy="45" r="30" fill="#e6f5ff" stroke="#91c9f4"/>` + (p.brandSrc ? `<image href="${esc2(h, p.brandSrc)}" x="5" y="16" width="56" height="58"/>` : "")) : "") + node("message", lines3.map((line3, i) => txt3(h, x + 20, 42 + i * 34, line3, 25, w - 40)).join(""));
    }),
    part("cargo-stack", "\u53EF\u62C6\u5206\u7EB8\u7BB1\u7EC4", 460, 290, { count: 6, label: "", stamp: true }, "\u539F\u751F460\xD7290\uFF1Bcount1\u20136\uFF0C\u6BCF\u7BB1\u72EC\u7ACBdata-kit-node\uFF1B\u4E0D\u542B\u5730\u57AB\u3002", (p, h) => {
      const positions = [[138, 0, 154], [54, 77, 154], [224, 77, 154], [9, 161, 153], [157, 161, 153], [304, 161, 153]];
      return positions.slice(0, bounded(p.count, 1, 6, 6)).map(([x, y, w], i) => node("cargo-" + i, partAt("cargo-box", { label: p.label, stamp: p.stamp }, h, { x, y, width: w, height: w * 130 / 160 }), 'data-motion="item"')).join("");
    }),
    part("warehouse", "\u4ED3\u5E93\u4E0E\u5378\u8D27\u53E3", 850, 490, { title: "\u76EE\u7684\u5730", showSideWing: true, doorOpen: false }, "\u539F\u751F850\xD7490\uFF1Btitle\u22649\u5B57\u3002\u5377\u5E18\u95E8\u3001\u4FA7\u95E8\u3001\u7FFC\u697C\u72EC\u7ACB\u3002", (p, h) => grad(h, "warehouse", ["#fcfdff", "#e9f3fc", "#d3e7f9"], (g2) => node("main", path("M20 115L368 32L729 102V449H20Z", g2, "#4f9beb", 2) + path("M20 115L368 32V451H20Z", g2, "#a2c8ed", 1) + path("M368 32L729 102V449H368Z", g2, "#a2c8ed", 1) + path("M19 111L368 27L741 97V114L368 46L19 132Z", "#65b5f3", "#1466b3", 3) + path("M61 141V447M137 119V447M214 99V447M292 80V447M445 63V447M519 79V447M594 96V447M671 109V447", "none", "#c2dbef", 1.5)) + node("sign", rect(257, 82, 241, 61, 7, "#d2edff", "#2379c6", 2) + rect(263, 88, 229, 49, 4, "white", "#78bcf1", 2) + txt3(h, 378, 125, p.title, 32, 215, C.ink, "middle")) + node("loading-door", rect(210, 181, 286, 267, 3, "#ecf8ff", "#80b4e5", 2) + rect(225, 196, 255, 252, 0, p.doorOpen ? "#4077a4" : "#67aae3", "#2369aa", 3) + (p.doorOpen ? "" : Array.from({ length: 9 }, (_, i) => path(`M228 ${222 + i * 25}H478`, "none", "#5299d4", 2)).join(""))) + node("side-door", rect(545, 261, 90, 187, 2, "#eaf7ff", "#93b9e6", 2) + rect(554, 270, 72, 178, 1, "#147de0", "#275f9a", 2) + rect(571, 292, 40, 52, 0, "#50a9f0", "#2667b7", 2) + path("M612 361V378", "none", C.ink, 3)) + node("light", rect(342, 158, 45, 13, 3, "#fff4c6", C.ink, 3)) + (p.showSideWing ? node("side-wing", path("M730 155H846V448H730Z", "#e8f3fc", "#74abdf", 2) + path("M730 150H846V164H730Z", "#6ab5f0", "#1b74c8", 2) + rect(744, 239, 91, 59, 0, "white", "#7eb8ec", 2) + rect(751, 247, 77, 43, 0, "#70c3f2", "#236cbe", 2) + path("M777 247V290M804 247V290", "none", "#3488cf", 2)) : "") + node("bollard", rect(652, 385, 13, 62, 4, "#ffcb41", "#1a5c98", 2) + path("M653 402H664M653 425H664", "none", "#3176b4", 8)))),
    part("folder-shell", "\u5E26\u906E\u6321\u524D\u6CBF\u7684\u6587\u4EF6\u5939", 360, 310, { tone: "blue", layer: "both", label: "" }, "\u539F\u751F360\xD7310\uFF1Blayer back/front/both\u53EF\u5939\u5165\u7167\u7247\uFF1Btone blue/gold/mint\uFF1Blabel\u226410\u5B57\u3002", (p, h) => {
      const tones5 = { blue: ["#88ddff", "#178aff", "#63c4f8"], gold: ["#ffe799", "#ffbc23", "#ffdc6a"], mint: ["#adf3e3", "#38c3ad", "#72decd"] }, colors3 = tones5[p.tone] || tones5.blue;
      return grad(h, "folder-" + p.tone, colors3, (g2) => (p.layer !== "front" ? node("back", path("M24 51Q22 33 42 29L144 11Q162 9 166 26L176 63L309 49Q330 47 333 68L347 257L52 291Z", g2) + path("M35 52Q34 42 48 40L139 23", "none", "#e4fbff", 5)) : "") + (p.layer !== "back" ? node("front", path("M51 168L324 139Q348 137 342 162L320 270Q317 286 294 288L55 304Q33 305 39 282L62 186Z", g2, C.ink, 4) + path("M53 285L76 185L326 155", "none", "#dcf9ff", 5) + path("M84 183L306 159L144 282L56 289Z", "white", "none", 0).replace('fill="white"', 'fill="white" opacity=".10"')) : "") + txt3(h, 189, 251, p.label, 25, 221, C.ink, "middle"));
    }),
    part("photo-stack", "\u4FDD\u6301\u5546\u54C1\u8EAB\u4EFD\u7684\u7167\u7247\u7EC4", 380, 230, { kinds: ["cup", "lamp", "bag"], count: 3, spread: 95, labels: [], tilt: true }, "\u539F\u751F380\xD7230\uFF1Bcount1\u20133\uFF0Ckinds cup/lamp/bag/shoe/chair/plant\uFF1B\u6BCF\u5F20\u53EF\u5355\u72EC\u52A8\u753B\u3002", (p, h) => Array.from({ length: bounded(p.count, 1, 3, 3) }, (_, i) => {
      const a2 = p.tilt ? [-8, 3, 9][i] : 0;
      return node("photo-" + i, `<g transform="translate(${i * num5(p.spread, 95) + 13} ${i === 1 ? 3 : 16}) rotate(${a2} 85 98)">${partAt("photo-card", { kind: p.kinds?.[i] || "cup", label: p.labels?.[i] || "", instanceKey: String(i) }, h, { width: 166, height: 185 })}</g>`, 'data-motion="item"');
    }).join("")),
    part("notice-paper", "\u53EF\u586B\u5B57\u6BB5\u7684\u6298\u89D2\u901A\u77E5", 470, 540, { title: "\u901A\u77E5\u6807\u9898", subtitle: "", foldTone: "gold", showShadow: true }, "\u539F\u751F470\xD7540\uFF1Btitle\u226414\u5B57\uFF0Csubtitle\u226418\u5B57\uFF1B\u5185\u90E8\u6B63\u6587\u533A\u57DFx38 y170 w389 h320\u3002", (p, h) => grad(h, "paper", ["#fff", "#fcfeff", "#e8f6ff"], (g2) => node("shadow", p.showShadow ? `<ellipse cx="238" cy="524" rx="226" ry="14" fill="#cce8ff"/>` : "") + node("sheet", path("M21 27L388 8L454 77V507Q454 523 437 523H24Q8 523 9 506L13 47Q13 29 21 27Z", g2, C.ink, 3.6) + path("M27 37L379 19", "none", "white", 4)) + node("fold", path("M388 9V65Q388 78 402 77L452 77Z", p.foldTone === "blue" ? "#91d5ff" : "#ffe095", C.ink, 3) + path("M395 23V65L438 68", "none", "#fff8dc", 4)) + node("heading", txt3(h, 236, 136, p.title, 39, 395, "#ff620c", "middle") + txt3(h, 236, 171, p.subtitle, 24, 375, C.ink, "middle")))),
    part("notice-field", "\u6807\u7B7E\u4E0E\u672C\u6B21\u4E8B\u5B9E\u5B57\u6BB5", 400, 86, { label: "\u5B57\u6BB5", value: "", tone: "blue", lineCount: 2 }, "\u539F\u751F400\xD786\uFF1Blabel\u22646\u5B57\uFF0Cvalue\u226412\u5B57\uFF1B\u7A7A\u503C\u75281\u20133\u7070\u8272\u884C\u3002", (p, h) => {
      const c = { blue: "#087cff", orange: "#ff850a", mint: "#009976" }[p.tone] || "#087cff";
      return node("label", rect(3, 6, 140, 70, 15, c) + txt3(h, 73, 51, p.label, 29, 124, "white", "middle")) + node("value", p.value ? txt3(h, 163, 49, p.value, 23, 230) : Array.from({ length: bounded(p.lineCount, 1, 3, 2) }, (_, i) => rect(164, 15 + i * 22, i ? 184 : 226, 13, 6, C.gray)).join(""));
    }),
    part("attachment-card", "\u62A5\u9519\u6216\u4EE3\u7801\u9644\u4EF6\u5361", 280, 135, { title: "\u9644\u4EF6", kind: "document", lineCount: 3 }, "\u539F\u751F280\xD7135\uFF1Bkind document/code/error/image\uFF1Btitle\u22648\u5B57\uFF0C\u7070\u884C0\u20133\u3002", (p, h) => node("card", rect(4, 4, 270, 124, 15, "white", "#9dccff", 2)) + node("file", path("M29 27H68L86 46V105H29Z", "#e5f4ff", "#8ac1f2", 2) + path("M68 27V46H86", "none", "#8ac1f2", 2) + (p.kind === "code" ? path("M47 56L35 69L47 81M70 56L82 69L70 81M63 53L54 86", "none", "#185adb", 3.8) : p.kind === "image" ? path("M37 85L48 67L58 77L66 59L78 85Z", "#087cfc", "none") : path("M39 57H60M39 69H73M39 81H62", "none", "#8eacd3", 4)) + (p.kind === "error" ? `<circle cx="77" cy="94" r="15" fill="#ff6923" stroke="white" stroke-width="2"/>` + path("M77 84V96M77 102V103", "none", "white", 3) : "")) + node("details", txt3(h, 104, 46, p.title, 26, 158) + Array.from({ length: bounded(p.lineCount, 0, 3, 3) }, (_, i) => rect(105, 62 + i * 18, i === 2 ? 103 : 146, 10, 5, C.gray)).join(""))),
    part("reply-lines", "\u53EF\u9010\u884C\u63ED\u793A\u7684\u5360\u4F4D\u56DE\u590D", 450, 120, { count: 4, color: "#becbd6", lengths: [1, 0.87, 0.95, 0.7], lineHeight: 13, gap: 17 }, "\u539F\u751F450\xD7120\uFF1Bcount0\u20134\uFF0Clengths\u4E3A0\u20131\uFF1B\u6BCF\u884C\u72EC\u7ACBdata-kit-node\u3002", (p) => Array.from({ length: bounded(p.count, 0, 4, 4) }, (_, i) => node("line-" + i, rect(5, 7 + i * (num5(p.lineHeight, 13) + num5(p.gap, 17)), 435 * bounded(p.lengths?.[i], 0.08, 1, 1), bounded(p.lineHeight, 3, 18, 13), 7, safe(p.color)), 'data-motion="line"')).join("")),
    part("send-icon", "\u4E00\u4F53\u7EB8\u98DE\u673A\u53D1\u9001\u56FE\u6807", 64, 64, { tone: "blue" }, "\u539F\u751F64\xD764\uFF1B\u4E0D\u542B\u6309\u94AE\u80CC\u666F\u3002", (p) => node("plane", path("M6 26L57 8L41 58L28 37L6 26Z", p.tone === "mint" ? C.mint : C.blue, "none") + path("M28 37L47 19", "none", "#ceecff", 2.6))),
    part("checklist-row", "\u4E0D\u9884\u8BBE\u7ED3\u679C\u7684\u68C0\u67E5\u884C", 470, 74, { text: "\u5F85\u68C0\u67E5\u9879\u76EE", state: "unchecked", highlight: false }, "\u539F\u751F470\xD774\uFF1Bstate unchecked/checked/failed\uFF1B\u9ED8\u8BA4\u7A7A\u6846\uFF1Btext\u226420\u5B57\u3002", (p, h) => node("row", rect(1, 1, 466, 71, 12, p.highlight ? "#fff0cf" : "#f7fcff", p.highlight ? "#ffb443" : "#d0e7f9", 1.4)) + node("checkbox", rect(16, 19, 32, 32, 5, "white", "#3669a3", 2.2) + (p.state === "checked" ? path("M23 34L31 42L43 27", "none", "#009e79", 3.5) : p.state === "failed" ? path("M24 27L41 44M41 27L24 44", "none", "#ed6d27", 3.5) : "")) + txt3(h, 65, 46, p.text, 27, 383)),
    part("magnifier", "\u53EF\u79FB\u52A8\u7684\u653E\u5927\u955C", 180, 190, { glassOpacity: 0.2 }, "\u539F\u751F180\xD7190\uFF1B\u955C\u7247\u4E0E\u624B\u67C4\u5206\u79BB\uFF1B\u53EA\u4F5C\u68C0\u67E5\u6307\u793A\uFF0C\u65E0\u865A\u6784\u653E\u5927\u7ED3\u679C\u3002", (p) => node("handle", path("M113 120L158 161Q170 177 156 184Q148 188 141 179L98 134Z", "#0878cb", C.ink, 3) + path("M122 133L153 163", "none", "#59bfff", 6)) + node("lens", `<circle cx="71" cy="73" r="62" fill="#329bec" stroke="${C.ink}" stroke-width="3"/><circle cx="71" cy="73" r="48" fill="#e2f6ff" fill-opacity="${bounded(p.glassOpacity, 0, 1, 0.2)}" stroke="#a4defc" stroke-width="7"/>` + path("M40 43Q55 27 76 29", "none", "white", 6))),
    part("brace", "\u65E0\u7BAD\u5C16\u7684\u6BD4\u8F83\u62EC\u7EBF", 85, 320, { side: "left", color: "#087cff", weight: 6 }, "\u539F\u751F85\xD7320\uFF1Bside left/right\uFF1B\u4EC5\u6BD4\u8F83\u5BF9\u5E94\uFF0C\u4E0D\u8868\u793A\u4F20\u8F93\u3002", (p) => `<g transform="${p.side === "right" ? "translate(85 0) scale(-1 1)" : ""}">${node("relation", path("M16 7C64 7 40 125 58 146Q65 159 77 160Q65 162 58 176C40 195 65 313 16 313", "none", safe(p.color), bounded(p.weight, 1, 10, 6)), 'data-motion="line"')}</g>`),
    part("flow-arrow", "\u5934\u6746\u4E00\u4F53\u7684\u77ED\u64CD\u4F5C\u7BAD", 220, 66, { direction: "right", tone: "blue", curved: false }, "\u539F\u751F220\xD766\uFF1Bdirection right/left\uFF1B\u64CD\u4F5C\u7BAD\u5934\u4E0E\u6746\u540C\u4E00\u8DEF\u5F84\uFF0C\u9000\u51FA\u65E0\u6B8B\u6746\u3002", (p) => {
      const color5 = p.tone === "mint" ? C.mint : p.tone === "orange" ? C.orange : C.blue;
      return `<g transform="${p.direction === "left" ? "translate(220 0) scale(-1 1)" : ""}">${node("arrow", p.curved ? path("M5 14C83 9 109 18 161 35L172 12L213 52L160 64L164 47C116 33 72 22 6 31Z", color5, "none") : path("M6 23H166V5L213 33L166 61V43H6Z", color5, "none"), 'data-motion="line"')}</g>`;
    }),
    part("status-pill", "\u4FE1\u606F\u6216\u8B66\u544A\u5706\u89D2\u72B6\u6001\u6761", 440, 86, { text: "\u72B6\u6001\u8BF4\u660E", tone: "blue", icon: "none" }, "\u539F\u751F440\xD786\uFF1Btone blue/mint/orange/light\uFF1Btext\u226418\u5B57\uFF1Bicon none/warning\u3002", (p, h) => {
      const colors3 = { blue: ["#36afff", "#057bfc"], mint: ["#20c3a1", "#008d73"], orange: ["#ffa438", "#ff671a"], light: ["#ebf9ff", "#bfe4ff"] }[p.tone] || ["#36afff", "#057bfc"];
      return grad(h, "pill-" + p.tone, colors3, (g2) => node("pill", rect(3, 5, 430, 74, 37, g2)) + (p.icon === "warning" ? node("icon", `<circle cx="47" cy="42" r="26" fill="white"/>` + path("M47 27V44M47 54V56", "none", "#fb671c", 5)) : "") + txt3(h, p.icon === "warning" ? 254 : 219, 57, p.text, 34, p.icon === "warning" ? 330 : 397, p.tone === "light" ? C.ink : "white", "middle"));
    }),
    part("title", "\u53EF\u7F16\u8F91\u77E5\u8BC6\u6807\u9898", 720, 130, { text: "\u77E5\u8BC6\u6807\u9898", subtitle: "", tone: "blue", align: "center" }, "\u539F\u751F720\xD7130\uFF1Btext\u226416\u5B57\uFF0Csubtitle\u226432\u5B57\uFF1B\u8D85\u8FC7\u5EFA\u8BAE\u5B57\u6570\u81EA\u52A8\u7F29\u5B57\u3002", (p, h) => {
      const a2 = p.align === "left" ? "start" : "middle", x = a2 === "start" ? 8 : 360;
      return node("heading", txt3(h, x, 66, p.text, 58, 700, p.tone === "orange" ? "#ff710b" : C.ink, a2)) + node("subtitle", txt3(h, x, 111, p.subtitle, 28, 700, C.ink, a2));
    }),
    part("question-bubble", "\u6A59\u8272\u63D0\u95EE\u6C14\u6CE1", 610, 280, { lines: ["\u9700\u8981\u601D\u8003\u7684\u95EE\u9898\uFF1F"], tone: "orange" }, "\u539F\u751F610\xD7280\uFF1Blines1\u20133\u884C\uFF0C\u6BCF\u884C\u226417\u5B57\u3002", (p, h) => grad(h, "question", ["#fff8df", "#ffebbe", "#ffd28a"], (g2) => node("bubble", path("M37 9H571Q601 9 601 41V211Q601 242 569 242H269L208 274L221 242H38Q8 242 8 211V41Q8 9 37 9Z", g2, p.tone === "blue" ? C.blue : "#ffa630", 3)) + node("question", (p.lines || []).slice(0, 3).map((t, i) => txt3(h, 305, 82 + i * 59, t, 46, 552, C.ink, "middle")).join("")))),
    part("brand-badge", "\u5B98\u65B9\u5C0F\u56FE\u6807\u4E0E\u53EF\u7F16\u8F91\u540D\u79F0", 370, 95, { title: "\u667A\u80FD\u52A9\u624B", brandSrc: "", neutralMark: "chat" }, "\u539F\u751F370\xD795\uFF1BbrandSrc\u53EF\u9009\u51C6\u786E\u5B98\u65B9\u539F\u4EF6\uFF1B\u9ED8\u8BA4\u4E2D\u6027\u56FE\u6807\uFF1Btitle\u226410\u5B57\u3002", (p, h) => node("badge", rect(3, 3, 362, 87, 16, "#f5fbff", "#82bcf1", 2)) + node("brand", p.brandSrc ? `<image href="${esc2(h, p.brandSrc)}" x="14" y="10" width="72" height="72" preserveAspectRatio="xMidYMid meet"/>` : `<circle cx="49" cy="46" r="33" fill="#d5edff"/>` + path("M31 30H68V58H49L39 67V58H31Z", "#8ac7f4", C.ink, 2)) + txt3(h, 103, 59, p.title, 35, 242)),
    part("code-lines", "\u975E\u6267\u884C\u6027\u4EE3\u7801\u5360\u4F4D\u884C", 480, 190, { count: 6, highlightLine: -1, tone: "blue" }, "\u539F\u751F480\xD7190\uFF1Bcount0\u20136\uFF0ChighlightLine -1\u62160\u20135\uFF1B\u4EC5\u62BD\u8C61\u884C\uFF0C\u4E0D\u5192\u5145\u53EF\u6267\u884C\u4EE3\u7801\u3002", (p) => Array.from({ length: bounded(p.count, 0, 6, 6) }, (_, i) => node("line-" + i, rect(7, 8 + i * 29, 20, 10, 4, "#c5d3df") + rect(42 + [0, 20, 40, 20, 40, 0][i], 8 + i * 29, [320, 266, 303, 242, 279, 194][i], 12, 6, i === num5(p.highlightLine, -1) ? p.tone === "orange" ? "#ffab42" : "#479ffc" : "#b7c9d8"), 'data-motion="line"')).join("")),
    part("destination-pad", "\u5378\u8D27\u533A\u57DF\u5730\u57AB", 600, 130, { label: "" }, "\u539F\u751F600\xD7130\uFF1B\u4E0D\u542B\u7BB1\u5B50\uFF1Blabel\u226416\u5B57\u3002", (p, h) => node("pad", path("M87 12H493L590 116H9Z", "#f6fbff", "#5ba5ed", 4) + path("M106 25H479L558 98H48Z", "#f6fbff", "#d1e3f2", 3)) + txt3(h, 300, 82, p.label, 29, 410, C.ink, "middle")),
    part("focus-ring", "\u53EF\u9000\u573A\u7684\u5C40\u90E8\u5F3A\u8C03\u6846", 400, 180, { tone: "orange", dashed: false }, "\u539F\u751F400\xD7180\uFF1B\u53EA\u7A81\u51FA\u5C40\u90E8\uFF0C\u4E0D\u6539\u53D8\u5BF9\u8C61\u72B6\u6001\u3002", (p) => node("focus", rect(5, 5, 390, 170, 21, "none", p.tone === "blue" ? C.blue : "#ffa127", 5).replace("/>", p.dashed ? ' stroke-dasharray="11 8"/>' : "/>"), 'data-motion="highlight"')),
    part("truck", "\u655E\u53A2\u6574\u8F66\uFF08\u542B\u8D27\u7269\u4E0E\u6295\u5F71\uFF09", 870, 486, { cargoCount: 5, shadowOpacity: 0.55, shadowScale: 1, shadowOffsetY: 0 }, "\u539F\u751F870\xD7486\uFF1B\u6574\u8F66\u3001\u4E09\u8F6E\u3001\u5730\u9762\u6295\u5F71\u53CA\u5E38\u89C4\u8D27\u7269\u662F\u540C\u4E00\u5BF9\u8C61\u3002cargoCount 0\u20135\uFF1B\u79FB\u52A8\u548C\u7F29\u653E\u6574\u8F66\u65F6\u6295\u5F71\u540C\u6B65\uFF1B\u4EC5\u5378\u8D27\u52A8\u4F5C\u53E6\u7528\u72EC\u7ACB\u8D27\u7269\u3002", (p, h) => {
      const shadowCenterX = 435, shadowCenterY = 386 + 35 * 850 / 600;
      const shadow = node("shadow", `<g transform="translate(${shadowCenterX} ${shadowCenterY + p.shadowOffsetY}) scale(${p.shadowScale}) translate(${-shadowCenterX} ${-shadowCenterY})">${partAt("ground-shadow", { opacity: p.shadowOpacity }, h, { x: 10, y: 386, width: 850, height: 100 })}</g>`);
      const vehicle = node("vehicle", partAt("truck-body", {}, h, { x: 0, y: 0, width: 600, height: 390 }) + partAt("truck-cab", {}, h, { x: 570, y: 0, width: 300, height: 390 }) + node("cargo", [[204, 211], [330, 211], [453, 211], [262, 120], [387, 120]].slice(0, p.cargoCount).map(([x, y], i) => node("cargo-" + i, partAt("cargo-box", { instanceKey: "cargo-" + i }, h, { x, y, width: 119, height: 99 }))).join("")) + node("wheels", [[75, 315], [204, 321], [701, 316]].map(([x, y], i) => node("wheel-" + i, partAt("wheel", { instanceKey: "wheel-" + i }, h, { x, y, width: 98, height: 98 }))).join("")));
      return shadow + vehicle;
    })
  ];
  for (const def of parts) if (["truck-body", "truck-cab", "wheel", "ground-shadow"].includes(def.key)) {
    def.hidden = true;
    def.compatibilityOnly = true;
    def.description = "\u65E7\u7248\u517C\u5BB9\uFF1A" + def.description + " \u65B0\u5236\u4F5C\u8BF7\u4F7F\u7528truck\u6574\u8F66\uFF08\u542B\u6295\u5F71\uFF09\uFF0C\u4E0D\u624B\u5DE5\u62FC\u88C5\u8F66\u8F86\u3002";
  }
  var str = (maxLength) => ({ type: "string", maxLength });
  var enumeration = (...values) => ({ type: "string", enum: values });
  var integer = (minimum, maximum) => ({ type: "integer", minimum, maximum });
  var number4 = (minimum, maximum) => ({ type: "number", minimum, maximum });
  var bool = { type: "boolean" };
  var color3 = { type: "string", pattern: "^#[0-9a-fA-F]{6}$" };
  var array = (items, minItems, maxItems) => ({ type: "array", items, minItems, maxItems });
  var imageSrc = { type: "string", maxLength: 512, description: "Optional local official logo path; no javascript:, data:, external network URL or SVG markup." };
  var partRules = {
    ...semanticRules,
    truck: { cargoCount: integer(0, 5), shadowOpacity: number4(0, 1), shadowScale: number4(0.5, 1.04), shadowOffsetY: number4(-30, 6) },
    "truck-body": { open: bool, label: str(12), showChassis: bool },
    "truck-cab": { facing: enumeration("left", "right") },
    wheel: { rotation: number4(-36e3, 36e3) },
    "cargo-box": { label: str(6), stamp: bool },
    "ground-shadow": { opacity: number4(0, 1), color: color3 },
    "photo-card": { kind: enumeration("cup", "lamp", "bag", "shoe", "chair", "plant"), label: str(8), shadow: bool },
    "window-shell": { title: str(16), controls: bool, caption: str(9), brandSrc: imageSrc },
    "buffer-area": { title: str(14), labelWidth: number4(200, 600), showLabel: bool },
    "chat-shell": { title: str(10), brandSrc: imageSrc, inputPlaceholder: str(24), showControls: bool, caption: str(16) },
    "chat-message": { role: enumeration("user", "assistant"), text: str(20), lines: array(str(20), 0, 3), tone: enumeration("blue", "mint", "orange"), showAvatar: bool, brandSrc: imageSrc },
    "cargo-stack": { count: integer(1, 6), label: str(6), stamp: bool },
    warehouse: { title: str(9), showSideWing: bool, doorOpen: bool },
    "folder-shell": { tone: enumeration("blue", "gold", "mint"), layer: enumeration("back", "front", "both"), label: str(10) },
    "photo-stack": { kinds: array(enumeration("cup", "lamp", "bag", "shoe", "chair", "plant"), 1, 3), count: integer(1, 3), spread: number4(60, 96), labels: array(str(8), 0, 3), tilt: bool },
    "notice-paper": { title: str(14), subtitle: str(18), foldTone: enumeration("gold", "blue"), showShadow: bool },
    "notice-field": { label: str(6), value: str(12), tone: enumeration("blue", "orange", "mint"), lineCount: integer(1, 3) },
    "attachment-card": { title: str(8), kind: enumeration("document", "code", "error", "image"), lineCount: integer(0, 3) },
    "reply-lines": { count: integer(0, 4), color: color3, lengths: array(number4(0.08, 1), 0, 4), lineHeight: number4(3, 18), gap: number4(0, 17) },
    "send-icon": { tone: enumeration("blue", "mint") },
    "checklist-row": { text: str(20), state: enumeration("unchecked", "checked", "failed"), highlight: bool },
    magnifier: { glassOpacity: number4(0, 1) },
    brace: { side: enumeration("left", "right"), color: color3, weight: number4(1, 10) },
    "flow-arrow": { direction: enumeration("right", "left"), tone: enumeration("blue", "mint", "orange"), curved: bool },
    "status-pill": { text: str(18), tone: enumeration("blue", "mint", "orange", "light"), icon: enumeration("none", "warning") },
    title: { text: str(16), subtitle: str(32), tone: enumeration("blue", "orange"), align: enumeration("left", "center") },
    "question-bubble": { lines: array(str(17), 1, 3), tone: enumeration("blue", "orange") },
    "brand-badge": { title: str(10), brandSrc: imageSrc, neutralMark: enumeration("chat") },
    "code-lines": { count: integer(0, 6), highlightLine: integer(-1, 5), tone: enumeration("blue", "orange") },
    "destination-pad": { label: str(16) },
    "focus-ring": { tone: enumeration("blue", "orange"), dashed: bool }
  };
  function validateValue(v, r, label3) {
    if (r.type === "array") {
      if (!Array.isArray(v)) throw Error(label3 + ": expected array");
      if (v.length < r.minItems || v.length > r.maxItems) throw Error(label3 + `: requires ${r.minItems}\u2013${r.maxItems} items`);
      v.forEach((x, i) => validateValue(x, r.items, `${label3}[${i}]`));
      return;
    }
    if (r.type === "integer" || r.type === "number") {
      if (typeof v !== "number" || !Number.isFinite(v) || r.type === "integer" && !Number.isInteger(v)) throw Error(label3 + ": expected finite " + r.type);
      if (v < r.minimum || v > r.maximum) throw Error(label3 + `: must be in [${r.minimum}, ${r.maximum}]`);
      return;
    }
    if (typeof v !== r.type) throw Error(label3 + ": expected " + r.type);
    if (r.enum && !r.enum.includes(v)) throw Error(label3 + ": allowed " + r.enum.join(", "));
    if (r.maxLength !== void 0 && Array.from(v).length > r.maxLength) throw Error(label3 + `: maximum ${r.maxLength} characters`);
    if (r.pattern && !new RegExp(r.pattern).test(v)) throw Error(label3 + ": invalid format");
    if (label3.endsWith(".brandSrc") && v && (/^(?:https?:|data:|javascript:|\/\/)/i.test(v) || /[<>"']/.test(v))) throw Error(label3 + ": use a frozen local official image path");
  }
  function validatePart(key, p) {
    const rules = partRules[key];
    for (const [name, v] of Object.entries(p)) {
      if (name === "instanceKey") {
        validateValue(v, str(80), key + ".instanceKey");
        continue;
      }
      if (!rules[name]) throw Error(key + "." + name + ": unknown property");
      validateValue(v, rules[name], key + "." + name);
    }
    if (key === "photo-stack" && p.kinds.length < p.count) throw Error(key + ".kinds: provide an explicit product identity for each photo");
    if (key === "reply-lines" && p.lengths.length < p.count) throw Error(key + ".lengths: provide one length per line");
    if (key === "reply-lines" && p.count > 0 && 7 + (p.count - 1) * (p.lineHeight + p.gap) + p.lineHeight > 120) throw Error(key + ": lines exceed native height");
  }
  parts.push(...semanticParts);
  for (const def of parts) {
    const rawDraw = def.draw;
    def.draw = (props = {}, h = {}) => {
      const p = { ...def.defaults, ...props };
      validatePart(def.key, p);
      return rawDraw(p, h);
    };
  }
  function drawPart(key, props = {}, h = {}) {
    const def = parts.find((p2) => p2.key === key);
    if (!def) throw new Error("Unknown transfer kit part: " + key);
    const p = { ...def.defaults, ...props };
    return `<g class="ani-kit" data-kit-part="${safe(key)}" data-motion="item">${def.draw(p, h)}</g>`;
  }
  function partAt(key, props = {}, h = {}, options = {}) {
    const def = parts.find((p) => p.key === key);
    if (!def) throw new Error("Unknown transfer kit part: " + key);
    const { x = 0, y = 0, width = def.width, height = def.height, opacity = 1 } = options;
    for (const [name, v] of Object.entries({ x, y })) if (typeof v !== "number" || !Number.isFinite(v)) throw Error("partAt." + name + ": expected finite number");
    for (const [name, v] of Object.entries({ width, height })) if (typeof v !== "number" || !Number.isFinite(v) || v <= 0 || v > 16384) throw Error("partAt." + name + ": expected positive size \u226416384");
    validateValue(opacity, number4(0, 1), "partAt.opacity");
    if (key === "direction-arrow" || key === "semantic-label") {
      const scoped4 = { ...h, uid: (s2) => h.uid ? h.uid(`${key}-${x}-${y}-${s2}`) : `${key}-${x}-${y}-${s2}` };
      return `<g data-kit-placement="${safe(key)}" transform="translate(${x} ${y})" opacity="${opacity}">${drawPart(key, { ...props, boxWidth: width, boxHeight: height }, scoped4)}</g>`;
    }
    const scale = Math.min(width / def.width, height / def.height);
    const suffix = [key, x, y, width, height, props.instanceKey || ""].join("-");
    const scoped3 = { ...h, uid: (s2) => h.uid ? h.uid(`${suffix}-${s2}`) : `${suffix}-${s2}` };
    return `<g data-kit-placement="${safe(key)}" transform="translate(${num5(x)} ${num5(y)}) scale(${scale})" opacity="${bounded(opacity, 0, 1, 1)}">${drawPart(key, props, scoped3)}</g>`;
  }

  // component-style.mjs
  var styleDefaults = { palette: { accent: "", ink: "", surface: "", mint: "", orange: "" }, fontScale: 1, fontFamily: "original", strokeScale: 1, shadowOpacity: 1, shadowBlur: 0, opacity: 1 };
  var color4 = { type: "string", pattern: "^(|#[0-9a-fA-F]{6})$" };
  var styleSchema = { type: "object", additionalProperties: false, properties: { palette: { type: "object", additionalProperties: false, properties: Object.fromEntries(Object.keys(styleDefaults.palette).map((k) => [k, color4])) }, fontScale: { type: "number", minimum: 0.8, maximum: 1.25 }, fontFamily: { type: "string", enum: ["original", "Microsoft YaHei", "Segoe UI", "SimHei"] }, strokeScale: { type: "number", minimum: 0.5, maximum: 2 }, shadowOpacity: { type: "number", minimum: 0, maximum: 1 }, shadowBlur: { type: "number", minimum: 0, maximum: 12 }, opacity: { type: "number", minimum: 0, maximum: 1 } }, description: "Instance style. Palette keeps source luminance/highlights, font sizes scale without moving anchors, stroke weight scales, shadow only targets declared shadow nodes. Verify text fit after increasing fonts." };
  function resolveStyle(base2 = {}, local2 = {}) {
    function check(p, s2, path2) {
      if (!p || typeof p !== "object" || Array.isArray(p)) throw Error(path2 + " must be an object");
      for (const [k, v] of Object.entries(p)) {
        const rule = s2.properties[k];
        if (!rule) throw Error(path2 + "." + k + " is not supported");
        if (rule.type === "object") {
          check(v, rule, path2 + "." + k);
          continue;
        }
        if (typeof v !== rule.type || rule.type === "number" && (!Number.isFinite(v) || v < rule.minimum || v > rule.maximum) || rule.enum && !rule.enum.includes(v) || rule.pattern && !new RegExp(rule.pattern).test(v)) throw Error(path2 + "." + k + " is outside the supported style contract");
      }
    }
    check(base2, styleSchema, "style");
    check(local2, styleSchema, "layer.style");
    return { ...styleDefaults, ...base2, ...local2, palette: { ...styleDefaults.palette, ...base2.palette, ...local2.palette } };
  }
  function hsl(hex) {
    const rgb2 = hex.slice(1).match(/../g).map((v) => parseInt(v, 16) / 255), max = Math.max(...rgb2), min = Math.min(...rgb2), d = max - min, l = (max + min) / 2;
    let h = 0, s2 = 0;
    if (d) {
      s2 = d / (1 - Math.abs(2 * l - 1));
      h = max === rgb2[0] ? ((rgb2[1] - rgb2[2]) / d + 6) % 6 : max === rgb2[1] ? (rgb2[2] - rgb2[0]) / d + 2 : (rgb2[0] - rgb2[1]) / d + 4;
      h *= 60;
    }
    return { h, s: s2, l };
  }
  function rgb({ h, s: s2, l }) {
    const a2 = s2 * Math.min(l, 1 - l), f = (n4) => {
      const k = (n4 + h / 30) % 12;
      return Math.round(255 * (l - a2 * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, "0");
    };
    return "#" + f(0) + f(8) + f(4);
  }
  function recolor(hex, p) {
    const c = hsl(hex);
    if (c.s < 0.12) return hex;
    const key = c.h >= 180 && c.h <= 255 ? c.l < 0.26 ? "ink" : c.l > 0.87 ? "surface" : "accent" : c.h >= 15 && c.h <= 65 ? "orange" : c.h > 65 && c.h < 180 ? "mint" : null;
    if (!key || !p[key]) return hex;
    const t = hsl(p[key]);
    return rgb({ h: t.h, s: t.s, l: Math.max(0.05, Math.min(0.98, c.l + (t.l - 0.5) * 0.35)) });
  }
  function styleMarkup(markup, input, h) {
    const s2 = resolveStyle(input);
    let out = markup.replace(/\b(fill|stroke|stop-color)="(#[0-9a-fA-F]{6})"/g, (_, a2, c) => `${a2}="${recolor(c, s2.palette)}"`);
    if (s2.fontScale !== 1) out = out.replace(/font-size="([\d.]+)"/g, (_, n4) => `font-size="${(Number(n4) * s2.fontScale).toFixed(3)}"`);
    if (s2.fontFamily !== "original") out = out.replace(/<text\b/g, `<text style="font-family:'${s2.fontFamily}',sans-serif"`);
    if (s2.strokeScale !== 1) out = out.replace(/stroke-width="([\d.]+)"/g, (_, n4) => `stroke-width="${(Number(n4) * s2.strokeScale).toFixed(3)}"`);
    const id = h.uid("style-shadow");
    out = out.replace(/<g data-kit-node="shadow"/g, `<g opacity="${s2.shadowOpacity}"${s2.shadowBlur ? ` filter="url(#${id})"` : ""} data-kit-node="shadow"`);
    return `${s2.shadowBlur ? `<defs><filter id="${id}" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="${s2.shadowBlur}"/></filter></defs>` : ""}<g data-kit-style="instance" opacity="${s2.opacity}">${out}</g>`;
  }

  // transfer-kit-layout.mjs
  var kitReference = { basis: "\u7528\u6237\u63D0\u4F9B\u768423\u5F20\u72EC\u7ACB\u9AD8\u6E05\u72B6\u6001\u56FE\uFF0C\u6309\u5BF9\u8C61\u62C6\u89E3\u91CD\u5EFA\uFF1B\u975E\u6574\u56FE\u8D34\u7247\uFF0C\u975E\u9010\u50CF\u7D20\u63CF\u6479\u3002", source: "references/transfer-hd/manifest.json", level: "designed" };
  var layer = (id, part2, x, y, width, height, props = {}, motion = {}) => ({ id, part: part2, x, y, width, height, props, enter: 0, exit: 8, fade: 0.18, fromX: 0, fromY: 0, steps: [], ...motion });
  var finite2 = (v, name, min, max) => {
    if (typeof v !== "number" || !Number.isFinite(v) || v < min || v > max) throw Error(`${name} must be in [${min}, ${max}]`);
  };
  function validateLayers(layers) {
    if (!Array.isArray(layers) || !layers.length || layers.length > 160) throw Error("layers requires 1\u2013160 independent parts");
    const ids = /* @__PURE__ */ new Set();
    for (const [i, l] of layers.entries()) {
      const at2 = `layers[${i}]`;
      if (!/^[a-z][a-z0-9-]*$/.test(l.id) || ids.has(l.id)) throw Error(at2 + ".id must be unique lowercase identifier");
      ids.add(l.id);
      const p = parts.find((p2) => p2.key === l.part);
      if (!p) throw Error(at2 + ".part is unknown: " + l.part);
      for (const k of ["x", "y"]) finite2(l[k], at2 + "." + k, -1280, 1280);
      finite2(l.width, at2 + ".width", 1, 1280);
      finite2(l.height, at2 + ".height", 1, 720);
      if (l.x < 0 || l.y < 0 || l.x + l.width > 1280.01 || l.y + l.height > 720.01) throw Error(at2 + " final placement must fit 1280\xD7720");
      finite2(l.enter, at2 + ".enter", 0, 7.8);
      finite2(l.exit, at2 + ".exit", 0.1, 8);
      finite2(l.fade, at2 + ".fade", 0, 0.8);
      if (l.enter + l.fade >= l.exit) throw Error(at2 + " exit must follow complete entry");
      finite2(l.fromX, at2 + ".fromX", -1280, 1280);
      finite2(l.fromY, at2 + ".fromY", -720, 720);
      if (!l.props || typeof l.props !== "object" || Array.isArray(l.props)) throw Error(at2 + ".props must be an object");
      resolveStyle({}, l.style || {});
      for (const key of Object.keys(l.props)) if (!(key in p.defaults)) throw Error(at2 + ".props." + key + " is not supported by " + l.part);
      if (!Array.isArray(l.steps) || l.steps.length > 12) throw Error(at2 + ".steps must contain 0\u201312 motion segments");
      let previous = l.enter + l.fade;
      for (const [j, s2] of l.steps.entries()) {
        finite2(s2.at, at2 + `.steps[${j}].at`, 0, 8);
        finite2(s2.duration, at2 + ".duration", 0.01, 8);
        finite2(s2.x, at2 + ".x", -1280, 1280);
        finite2(s2.y, at2 + ".y", -720, 720);
        if (!["none", "sine.inOut", "power2.inOut", "power2.out"].includes(s2.ease)) throw Error(at2 + ".steps ease unsupported");
        if (s2.at < previous - 1e-4 || s2.at + s2.duration > l.exit - 1e-4) throw Error(at2 + ".steps must be ordered, nonoverlapping, and end before exit");
        previous = s2.at + s2.duration;
      }
    }
  }
  function renderKit(p, h) {
    validateLayers(p.layers);
    const style = resolveStyle(p.style || {});
    return `<section class="ani-kit" data-hd-kit="layout" style="width:1280px;height:720px"><svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" role="img" aria-label="${h.esc(p.label)}">${p.background === "transparent" ? "" : `<rect width="1280" height="720" fill="${h.esc(p.background)}"/>`}${p.layers.map((l) => {
      const scope5 = { ...h, uid: (k) => h.uid(l.id + "-" + k) };
      return `<g data-kit-instance="${h.esc(l.id)}" data-kit-motion="${h.esc(JSON.stringify({ enter: l.enter, exit: l.exit, fade: l.fade, fromX: l.fromX, fromY: l.fromY, steps: l.steps }))}">${styleMarkup(partAt(l.part, l.props, scope5, l), resolveStyle(style, l.style || {}), scope5)}</g>`;
    }).join("")}</svg></section>`;
  }
  var layoutCSS = kitCSS + "\n.ani-kit{position:relative;overflow:hidden}.ani-kit>svg{display:block;overflow:hidden}";
  function makeKit(id, name, description, layers, { layerType = "scene-template", intentIds = ["process"], effect = "ani-hd-parts", sourceStates = [] } = {}) {
    return { id, name, description, category: layerType === "primitive" ? "\u52A8\u753B\u98CE \xB7 \u9AD8\u6E05\u72EC\u7ACB\u90E8\u4EF6" : layerType === "module" ? "\u52A8\u753B\u98CE \xB7 \u9AD8\u6E05\u7EC4\u5408\u6A21\u5757" : "\u52A8\u753B\u98CE \xB7 \u9AD8\u6E05\u7D20\u6750\u590D\u523B", width: 1280, height: 720, defaultEffect: effect, layerType, intentIds, sourceStates, reference: kitReference, defaults: { label: name, background: layerType === "primitive" ? "transparent" : "#f8fcff", style: structuredClone(styleDefaults), layers }, render: renderKit };
  }

  // transfer-kit-recipes.mjs
  var place = (items, prefix, x, y, s2 = 1) => items.map((l) => ({ ...structuredClone(l), id: prefix + "-" + l.id, x: x + l.x * s2, y: y + l.y * s2, width: l.width * s2, height: l.height * s2, fromX: l.fromX * s2, fromY: l.fromY * s2, steps: l.steps.map((a2) => ({ ...a2, x: a2.x * s2, y: a2.y * s2 })) }));
  function truck(loaded = true) {
    return [layer("vehicle", "truck", 0, 0, 870, 486, { cargoCount: loaded ? 5 : 0 })];
  }
  var modules = [makeKit("ani-module-hd-truck", "\u9AD8\u6E05\u655E\u53A2\u6574\u8F66\uFF08\u542B\u6295\u5F71\uFF09", "\u6574\u8F66\u3001\u4E09\u8F6E\u3001\u6295\u5F71\u548C\u5E38\u89C4\u8D27\u7269\u7ED1\u5B9A\u4E3A\u4E00\u4E2A\u8F66\u8F86\u5BF9\u8C61\uFF1B\u6574\u4F53\u79FB\u52A8\u7F29\u653E\u3002\u53EA\u6709\u5378\u8D27\u52A8\u4F5C\u5C06\u8D27\u7269\u72EC\u7ACB\u3002", place(truck(), "truck", 130, 130, 0.98), { layerType: "module", intentIds: ["transport", "batch"] })];
  var pill = (id, text7, x, y, w = 280, tone3 = "light", motion = {}) => layer(id, "status-pill", x, y, w, w * 86 / 440, { text: text7, tone: tone3 }, motion);
  var heading = (id, text7, x = 280, y = 35, w = 720) => layer(id, "title", x, y, w, w * 130 / 720, { text: text7 });
  function folder(name = "\u6E90\u6587\u4EF6", tone3 = "blue", filled = true) {
    return [
      layer("back", "folder-shell", 0, 0, 360, 310, { tone: tone3, layer: "back" }),
      ...filled ? ["cup", "lamp", "bag"].map((kind, i) => layer("photo-" + i, "photo-card", 34 + i * 83, 15 + i * 13, 148, 164, { kind })) : [],
      layer("front", "folder-shell", 0, 0, 360, 310, { tone: tone3, layer: "front", label: name })
    ];
  }
  function notice(title = "\u4E8B\u9879\u901A\u77E5", fields2 = true) {
    return [
      layer("paper", "notice-paper", 0, 0, 470, 540, { title }),
      ...fields2 ? ["\u539F\u56E0", "\u5F71\u54CD", "\u5904\u7406\u529E\u6CD5"].map((label3, i) => layer("field-" + i, "notice-field", 38, 180 + i * 102, 392, 84, { label: label3, tone: ["blue", "orange", "mint"][i] })) : [layer("draft", "reply-lines", 48, 183, 369, 98), layer("draft-tail", "reply-lines", 48, 328, 338, 90, { count: 3 })]
    ];
  }
  function program(count2 = 0, warning = false) {
    return [
      layer("shell", "window-shell", 0, 0, 760, 560, { title: "\u56FE\u7247\u5904\u7406", caption: "\u60C5\u5883\u793A\u610F" }),
      layer("buffer", "buffer-area", 47, 110, 666, 362, { title: "\u5185\u5B58 \xB7 \u4E34\u65F6\u533A" }),
      ...Array.from({ length: count2 }, (_, i) => layer("working-" + i, "photo-card", 90 + i % 4 * 139 + (i > 3 ? 22 : 0), 165 + Math.floor(i / 4) * 102, 137, 153, { kind: ["cup", "lamp", "bag"][i % 3] })),
      pill("status", warning ? "\u5185\u5B58\u4E0D\u8DB3" : count2 ? "\u5F53\u524D\u6279\u6B21" : "\u51C6\u5907\u8BFB\u5165", warning ? 202 : 246, 466, warning ? 360 : 270, warning ? "orange" : "light")
    ];
  }
  function chat(messages2 = [{ role: "user", text: "\u8BF7\u5E2E\u6211\u8BF4\u660E\u95EE\u9898" }, { role: "assistant", text: "\u5148\u660E\u786E\u60C5\u51B5\u548C\u539F\u56E0" }], title = "\u667A\u80FD\u52A9\u624B") {
    return [layer("shell", "chat-shell", 0, 0, 660, 640, { title }), ...messages2.map((m, i) => layer("message-" + i, "chat-message", m.role === "user" ? 126 : 34, 168 + i * 115, 490, 147, m)), layer("send", "send-icon", 583, 557, 45, 45)];
  }
  function checklist() {
    return [layer("paper", "notice-paper", 0, 0, 470, 540, { title: "\u5F85\u6838\u5BF9" }), ...["\u662F\u5426\u4ECD\u7136\u62A5\u9519\uFF1F", "\u7ED3\u679C\u662F\u5426\u7B26\u5408\u8981\u6C42\uFF1F", "\u662F\u5426\u5B58\u5728\u9057\u6F0F\uFF1F"].map((text7, i) => layer("check-" + i, "checklist-row", 34, 176 + i * 102, 399, 63, { text: text7, state: "unchecked" }))];
  }
  function productGallery() {
    return [layer("shell", "window-shell", 0, 0, 760, 560, { title: "\u7A0B\u5E8F\u793A\u610F", caption: "\u60C5\u5883\u793A\u610F" }), ...["\u76EE\u5F55", "\u56FE\u50CF", "\u8BBE\u7F6E"].map((text7, i) => pill("nav-" + i, text7, 24, 120 + i * 75, 121, i === 0 ? "blue" : "light")), ...["cup", "lamp", "bag", "shoe", "chair", "plant"].map((kind, i) => layer("product-" + i, "photo-card", 178 + i % 3 * 121, 137 + Math.floor(i / 3) * 168, 106, 118, { kind })), layer("properties", "reply-lines", 568, 152, 157, 70, { count: 4 }), layer("properties-more", "reply-lines", 568, 274, 157, 70, { count: 3 })];
  }
  var registerModule = (key, name, description, layers, intentIds) => modules.push(makeKit("ani-module-hd-" + key, name, description, layers, { layerType: "module", intentIds }));
  registerModule("photo-folder", "\u9AD8\u6E05\u7167\u7247\u6587\u4EF6\u5939", "\u524D\u540E\u4E24\u5C42\u6587\u4EF6\u5939\u5939\u4F4F\u72EC\u7ACB\u7167\u7247\uFF1B\u539F\u56FE\u4E0D\u4F1A\u88AB\u5DE5\u4F5C\u526F\u672C\u66FF\u4EE3\u3002", place(folder(), "folder", 412, 145, 1.28), ["folder", "file"]);
  registerModule("notice-fields", "\u9AD8\u6E05\u901A\u77E5\u5B57\u6BB5\u7EC4", "\u7EB8\u9875\u3001\u6807\u9898\u3001\u4E09\u6761\u5B57\u6BB5\u5206\u79BB\uFF1B\u6539\u53D8\u4E8B\u5B9E\u65F6\u4E0D\u590D\u5236\u6574\u4E2A\u65E7\u901A\u77E5\u3002", place(notice(), "notice", 405, 80, 1), ["paper", "reuse"]);
  registerModule("processing-window", "\u9AD8\u6E05\u5904\u7406\u7A97\u53E3", "\u5916\u58F3\u3001\u865A\u7EBF\u6682\u5B58\u533A\u3001\u6BCF\u5F20\u7167\u7247\u548C\u72B6\u6001\u6761\u5206\u522B\u914D\u7F6E\u3002", place(program(3), "program", 245, 70, 1), ["memory", "batch"]);
  registerModule("chat", "\u9AD8\u6E05\u804A\u5929\u6D88\u606F\u7EC4", "\u6D88\u606F\u5206\u89D2\u8272\u5DE6\u53F3\u5B9A\u4F4D\uFF1B\u5916\u58F3\u3001\u6C14\u6CE1\u3001\u53D1\u9001\u56FE\u6807\u5F7C\u6B64\u72EC\u7ACB\u3002", place(chat(), "chat", 330, 32, 1), ["messages", "input"]);
  registerModule("checklist", "\u9AD8\u6E05\u5F85\u6838\u68C0\u67E5\u5355", "\u9ED8\u8BA4\u5747\u672A\u52FE\u9009\uFF0C\u9010\u9879\u7ED3\u679C\u9700\u8981\u771F\u5B9E\u9A8C\u8BC1\u540E\u8BBE\u7F6E\u3002", place(checklist(), "checks", 410, 70, 1), ["verify", "checkbox"]);
  registerModule("warehouse", "\u9AD8\u6E05\u5378\u8D27\u76EE\u7684\u5730", "\u4ED3\u5E93\u3001\u5730\u57AB\u3001\u843D\u5730\u7BB1\u7EC4\u5206\u5C42\uFF0C\u5378\u8D27\u7ED3\u679C\u53EF\u4EE5\u72EC\u7ACB\u4FDD\u7559\u3002", [layer("warehouse", "warehouse", 235, 50, 850, 490), layer("pad", "destination-pad", 380, 526, 600, 130), layer("cargo", "cargo-stack", 460, 325, 460, 290)], ["warehouse", "transport"]);
  registerModule("attachments", "\u9AD8\u6E05\u62A5\u9519\u4EE3\u7801\u9644\u4EF6\u7EC4", "\u62A5\u9519\u3001\u4EE3\u7801\u4E24\u5361\u4E0E\u89E3\u91CA\u6587\u672C\u5206\u79BB\uFF1B\u4E0D\u4F1A\u663E\u793A\u865A\u6784\u4FEE\u590D\u6210\u529F\u3002", [layer("error", "attachment-card", 255, 210, 350, 169, { title: "\u62A5\u9519\u4FE1\u606F", kind: "error" }), layer("code", "attachment-card", 650, 210, 350, 169, { title: "\u76F8\u5173\u4EE3\u7801", kind: "code" }), layer("response", "chat-message", 310, 420, 660, 198, { role: "assistant", text: "\u5148\u7406\u89E3\u539F\u56E0\uFF0C\u518D\u51B3\u5B9A\u5982\u4F55\u4FEE\u6539" })], ["messages", "code"]);
  registerModule("comparison", "\u9AD8\u6E05\u5173\u7CFB\u62EC\u7EBF\u7EC4", "\u4E24\u5BF9\u8C61\u901A\u8FC7\u65E0\u7BAD\u5934\u62EC\u7EBF\u5EFA\u7ACB\u5173\u7CFB\uFF0C\u6807\u7B7E\u53EF\u66FF\u6362\uFF0C\u4E0D\u8868\u8FBE\u6570\u636E\u6D41\u3002", [...place(notice("\u5DF2\u6709\u60C5\u5883"), "left", 60, 150, 0.72), layer("left-brace", "brace", 430, 205, 54, 240), pill("relation", "\u501F\u7528\u601D\u8DEF", 486, 285, 305), layer("right-brace", "brace", 800, 205, 54, 240, { side: "right" }), ...place(notice("\u65B0\u60C5\u5883"), "right", 865, 150, 0.72)], ["relation", "reuse"]);
  registerModule("product-gallery", "\u9AD8\u6E05\u5546\u54C1\u56FE\u5E93\u7A97\u53E3", "\u516D\u5F20\u72EC\u7ACB\u5546\u54C1\u7167\u7247\u3001\u5BFC\u822A\u53CA\u5C5E\u6027\u884C\u5206\u79BB\uFF1B\u4E0D\u662F\u5185\u5B58\u5904\u7406\u754C\u9762\u3002", place(productGallery(), "gallery", 260, 75, 1), ["window", "file"]);
  var recipes = [];
  var scene = (code, key, name, layers, intentIds = ["process"]) => recipes.push(makeKit("ani-transfer-hd-" + key, name, "\u9AD8\u6E05\u7D20\u6750 " + code + " \u7684\u53EF\u7F16\u8F91\u5BF9\u8C61\u91CD\u5EFA\uFF1B\u6240\u6709\u6587\u5B57\u3001\u56FE\u5F62\u3001\u5750\u6807\u548C\u5355\u4EF6\u65F6\u5E8F\u5747\u53EF\u66FF\u6362\u3002", layers, { sourceStates: [code], intentIds }));
  scene("S01A", "experience", "\u65E7\u7ECF\u9A8C\uFF1A\u88C5\u8D27\u8D27\u8F66", place(truck(), "truck", 160, 155, 1), ["transport"]);
  scene("S01B", "experience-problem", "\u65E7\u7ECF\u9A8C\u4E0E\u65B0\u60C5\u5883", [heading("title", "\u8FC1\u79FB", 460, 52, 350), pill("method", "\u501F\u7528\u65B9\u6CD5", 500, 160, 260), ...place(truck(), "truck", 40, 285, 0.6), layer("brace", "brace", 604, 300, 60, 250), ...place(program(3), "program", 710, 285, 0.68)], ["relation", "reuse"]);
  var noticeChat = (fields2) => [...place(notice("\u4E8B\u9879\u901A\u77E5", fields2), "notice", 170, 102, 0.88), ...place(chat([{ role: "user", text: fields2 ? "\u8865\u9F50\u539F\u56E0\u3001\u5F71\u54CD\u3001\u5904\u7406\u529E\u6CD5" : "\u8868\u8FBE\u518D\u5BA2\u6C14\u4E00\u70B9" }]), "chat", 645, 58, 0.9), ...place(notice("\u4E8B\u9879\u901A\u77E5", fields2), "reply-notice", 691, 325, 0.31)];
  scene("S02A", "notice-draft", "\u901A\u77E5\uFF1A\u4EC5\u8C03\u6574\u63AA\u8F9E", noticeChat(false), ["messages", "paper"]);
  scene("S02B", "notice-complete", "\u901A\u77E5\uFF1A\u8865\u9F50\u4E09\u9879\u4FE1\u606F", noticeChat(true), ["paper", "reuse"]);
  scene("S03", "notice-reuse", "\u6362\u4E8B\u5B9E\uFF0C\u501F\u601D\u8DEF", [...place(notice("\u5DF2\u6709\u4E8B\u9879\u901A\u77E5"), "left", 105, 114, 0.9), ...place(notice("\u65B0\u7684\u4E8B\u9879\u901A\u77E5"), "right", 773, 114, 0.9), pill("near", "\u8FD1\u8FC1\u79FB", 530, 135, 210), ...["\u539F\u56E0", "\u5F71\u54CD", "\u5904\u7406\u529E\u6CD5"].map((t, i) => pill("field-" + i, t, 553, 242 + i * 92, 163, ["blue", "orange", "mint"][i])), layer("brace", "brace", 728, 225, 40, 285), pill("conclusion", "\u6362\u4E8B\u5B9E\uFF0C\u501F\u601D\u8DEF", 410, 611, 460)], ["reuse", "paper"]);
  var processing = (count2 = 0, saved = false, warning = false) => [...place(folder("\u539F\u56FE", "blue", true), "source", 30, 318, 0.65), ...place(program(count2, warning), "program", 302, 113, 0.88), ...place(folder("\u7ED3\u679C", "gold", saved), "output", 1030, 318, 0.62)];
  scene("S04A", "before-read", "\u5904\u7406\u524D\uFF1A\u539F\u56FE\u4E0E\u7A7A\u6682\u5B58\u533A", processing(), ["memory", "file"]);
  scene("S04B", "capacity", "\u56FE\u7247\u62E5\u6324\u4E0E\u5185\u5B58\u4E0D\u8DB3", processing(8, false, true), ["memory"]);
  scene("S05", "error-explanation", "\u89E3\u91CA\u539F\u56E0\uFF0C\u4FDD\u7559\u62A5\u9519", [...place(folder("\u539F\u56FE"), "source", 14, 433, 0.38), ...place(program(8, true), "program", 137, 200, 0.74), ...place(chat([{ role: "user", text: "\u8FD9\u91CC\u62A5\u9519\u4E86\u2026" }, { role: "assistant", lines: ["\u4E00\u6B21\u8BFB\u5165\u592A\u591A\u56FE\u7247", "\u5185\u5B58\u662F\u4E34\u65F6\u653E\u6570\u636E\u7684\u5730\u65B9\u3002"] }]), "chat", 750, 73, 0.77), layer("error-attachment", "attachment-card", 792, 270, 175, 85, { title: "\u62A5\u9519", kind: "error" }), layer("code-attachment", "attachment-card", 985, 270, 175, 85, { title: "\u76F8\u5173\u4EE3\u7801", kind: "code" })], ["messages", "memory"]);
  var delivery = (loaded) => [layer("warehouse", "warehouse", 500, 110, 770, 444), layer("pad", "destination-pad", 718, 496, 520, 113), ...place(truck(loaded), "truck", 28, 217, 0.77), ...!loaded ? [layer("unloaded", "cargo-stack", 844, 331, 345, 218)] : []];
  scene("S06A", "truck-loaded", "\u5378\u8D27\u524D\uFF1A\u672C\u8D9F\u5F85\u5378", delivery(true), ["transport", "warehouse"]);
  scene("S06B", "truck-empty", "\u5378\u8CA8\u540E\uFF1A\u7A7A\u53A2\u4E0E\u4FDD\u7559\u8D27\u7269", delivery(false), ["transport", "batch"]);
  scene("S07A", "batch-read", "\u5C0F\u6279\u5DF2\u8BFB\u5165", processing(3), ["batch", "memory"]);
  scene("S07B", "batch-saved", "\u5904\u7406\u7ED3\u679C\u5DF2\u4FDD\u5B58", processing(3, true), ["batch", "save"]);
  scene("S07C", "batch-released", "\u91CA\u653E\u4E34\u65F6\u526F\u672C\uFF0C\u4FDD\u7559\u7ED3\u679C", processing(0, true), ["batch", "memory", "save"]);
  scene("S07D", "batch-next", "\u4FDD\u7559\u7ED3\u679C\uFF0C\u8BFB\u53D6\u4E0B\u4E00\u6279", processing(3, true).map((l) => l.id.startsWith("program-working-") ? { ...l, props: { kind: ["bag", "cup", "lamp"][Number(l.id.at(-1))] } } : l), ["batch", "memory"]);
  scene("S08", "near-far", "\u8FD1\u8FC1\u79FB\u4E0E\u8FDC\u8FC1\u79FB\u90FD\u6709\u7528", [
    ...place(notice("\u5DF2\u6709\u901A\u77E5"), "near-left", 195, 30, 0.4),
    ...place(notice("\u65B0\u901A\u77E5"), "near-right", 892, 30, 0.4),
    pill("near", "\u8FD1\u8FC1\u79FB", 492, 51, 290),
    pill("near-note", "\u540C\u7C7B\u95EE\u9898\uFF0C\u501F\u7528\u601D\u8DEF", 437, 146, 400),
    layer("brace-a", "brace", 409, 49, 35, 185),
    layer("brace-b", "brace", 842, 49, 35, 185, { side: "right" }),
    ...place(truck(), "far-left", 54, 382, 0.45),
    ...place(program(3), "far-right", 831, 344, 0.49),
    pill("far", "\u8FDC\u8FC1\u79FB", 495, 346, 284, "orange"),
    pill("far-note", "\u4E0D\u540C\u573A\u666F\uFF0C\u501F\u7528\u5173\u7CFB", 437, 456, 400),
    layer("brace-c", "brace", 437, 358, 42, 197),
    layer("brace-d", "brace", 800, 358, 42, 197, { side: "right" }),
    pill("conclusion", "\u80FD\u89E3\u51B3\u95EE\u9898\uFF0C\u4E24\u79CD\u90FD\u6709\u7528", 393, 613, 494)
  ], ["compare", "relation", "reuse"]);
  var analogy = (answer) => [...place(truck(), "truck", 10, 275, 0.68), pill("truck-note", "\u5206\u6279\u3001\u505A\u5B8C\u3001\u817E\u4F4D\u7F6E", 106, 592, 415), layer("brace", "brace", 621, 266, 55, 264), ...place(chat([{ role: "assistant", text: "\u4E00\u6B21\u8BFB\u5165\u592A\u591A\u56FE\u7247" }, { role: "user", text: "\u80FD\u4E0D\u80FD\u4E5F\u5206\u51E0\u6279\uFF1F" }]), "chat", 720, 80, 0.8), ...answer ? [pill("answer", "\u80FD\u63D0\u51FA\u65B9\u5411", 862, 486, 325)] : []];
  scene("S09A", "ask-direction", "\u5148\u63D0\u51FA\u95EE\u9898\uFF0C\u6682\u4E0D\u5BA3\u544A\u7B54\u6848", analogy(false), ["relation", "messages"]);
  scene("S09", "propose-direction", "\u4ECE\u65E7\u7ECF\u9A8C\u63D0\u51FA\u5206\u6279\u65B9\u5411", analogy(true), ["relation", "batch"]);
  scene("S10A", "check-cause", "\u5148\u6838\u539F\u56E0\uFF0C\u518D\u4FEE\u6539", [
    ...place(folder("\u539F\u56FE\u4FDD\u7559"), "source", 18, 425, 0.5),
    ...place(notice("\u5148\u6838\u5BF9\u539F\u56E0", false), "cause", 208, 192, 0.68),
    layer("magnifier", "magnifier", 390, 384, 180, 190),
    pill("warning", "\u5148\u786E\u8BA4\u539F\u56E0", 260, 579, 327, "orange"),
    layer("editor", "window-shell", 637, 95, 580, 427, { title: "\u4EE3\u7801\u52A9\u624B" }),
    layer("code", "code-lines", 688, 218, 470, 186),
    layer("proposal", "notice-paper", 991, 377, 259, 298, { title: "\u6309\u601D\u8DEF\u4FEE\u6539" }),
    ...["\u68C0\u67E5\u539F\u56E0", "\u4FEE\u6539\u526F\u672C", "\u6838\u5BF9\u7ED3\u679C"].map((text7, i) => layer("step-" + i, "checklist-row", 1014, 481 + i * 43, 214, 34, { text: text7 }))
  ], ["verify", "code"]);
  scene("S10B", "copy-verify", "\u4FDD\u7559\u539F\u56FE\uFF0C\u526F\u672C\u8BD5\u9A8C", [
    ...place(folder("\u539F\u56FE\u4FDD\u7559"), "original", 33, 350, 0.65),
    ...place(folder("\u8BD5\u9A8C\u526F\u672C", "mint"), "copy", 330, 350, 0.65),
    layer("editor", "window-shell", 628, 141, 363, 389, { title: "\u4EE3\u7801\u52A9\u624B" }),
    layer("code", "code-lines", 661, 222, 301, 119),
    ...["cup", "lamp", "bag"].map((kind, i) => layer("preview-" + i, "photo-card", 669 + i * 93, 361, 83, 93, { kind })),
    ...place(checklist(), "checks", 1004, 168, 0.53)
  ], ["copy", "verify"]);
  scene("S11", "two-purposes", "\u4EA4\u4ED8\u4E0E\u5B66\u4E60\uFF1A\u4E24\u4E2A\u76EE\u7684", [
    pill("delivery-label", "\u5C3D\u5FEB\u4EA4\u4ED8", 209, 29, 310, "blue"),
    pill("learning-label", "\u5B66\u4F1A\u65B9\u6CD5", 775, 29, 310, "orange"),
    ...place(chat([{ role: "user", text: "\u8BF7\u76F4\u63A5\u5E2E\u6211\u5904\u7406" }, { role: "assistant", text: "\u4F9D\u636E\u63D0\u4F9B\u7684\u8D44\u6599\u5904\u7406" }]), "deliver", 93, 119, 0.8),
    ...place(chat([{ role: "user", text: "\u4E3A\u4EC0\u4E48\u8FD9\u6837\u505A\uFF1F" }, { role: "user", text: "\u4E0B\u6B21\u4EC0\u4E48\u65F6\u5019\u7528\uFF1F" }, { role: "assistant", text: "\u7406\u89E3\u65B9\u6CD5\u4E0E\u9002\u7528\u6761\u4EF6" }]), "learn", 688, 119, 0.8),
    layer("lens", "magnifier", 1050, 461, 100, 106),
    pill("conclusion", "\u4E24\u79CD\u76EE\u7684\u90FD\u5408\u7406", 434, 617, 420)
  ], ["compare", "clarify"]);
  scene("S12", "experience-to-action", "\u628A\u7ECF\u9A8C\u8F6C\u4E3A\u5177\u4F53\u505A\u6CD5", [
    ...place(truck(), "truck", 37, 70, 0.49),
    layer("brace", "brace", 578, 311, 51, 273),
    ...place(notice("\u53EF\u501F\u7528", false), "reuse", 53, 435, 0.43),
    ...place(notice("\u9700\u8C03\u6574", false), "adjust", 310, 435, 0.43),
    ...place(chat([{ role: "user", text: "\u5361\u5728\u54EA\u4E00\u6B65\uFF1F" }, { role: "user", text: "\u54EA\u4E00\u6B65\u80FD\u501F\u7528\uFF1F\u54EA\u91CC\u5F97\u6539\uFF1F" }, { role: "assistant", text: "\u628A\u60F3\u6CD5\u6539\u5199\u6210\u5177\u4F53\u505A\u6CD5" }]), "chat", 711, 64, 0.85)
  ], ["reuse", "clarify", "process"]);
  scene("S13", "question-outro", "\u7B54\u6848\u4E4B\u5916\u7684\u601D\u8003", [
    ...place(chat([{ role: "assistant", text: "" }, { role: "assistant", text: "" }, { role: "assistant", text: "" }]), "chat", 203, 91, 0.8),
    ...[0, 1, 2].map((i) => layer("reply-" + i, "reply-lines", 269, 255 + i * 91, 356, 83, { count: 3 })),
    layer("question", "question-bubble", 817, 233, 427, 196, { lines: ["\u8BE5\u6362\u7684\uFF0C", "\u53EA\u6709\u7B54\u6848\u5417\uFF1F"] })
  ], ["outro", "messages"]);
  scene("S14", "next-topic", "\u4E0B\u671F\u4E3B\u9898\u9884\u544A", [
    pill("next", "\u4E0B\u671F", 506, 99, 260, "blue"),
    heading("topic", "\u4E0B\u4E00\u4E3B\u9898", 196, 208, 888),
    ...place(truck(), "truck", 315, 430, 0.33),
    ...place(program(3), "program", 718, 426, 0.37)
  ], ["outro"]);
  var unload = delivery(false).filter((l) => l.id !== "unloaded");
  unload.push(...place([[204, 211], [330, 211], [453, 211], [262, 120], [387, 120]].map(([x, y], i) => layer("box-" + i, "cargo-box", x, y, 119, 99)), "truck", 28, 217, 0.77));
  for (const l of unload.filter((l2) => l2.id.includes("-box-"))) {
    const i = Number(l.id.at(-1)), dx = 850 + i % 3 * 75 - l.x, dy = 565 - l.y;
    l.steps = [{ at: 1.1 + i * 0.15, duration: 0.65, x: 0, y: dy, ease: "power2.inOut" }, { at: 1.9 + i * 0.15, duration: 1.1, x: dx, y: dy, ease: "power2.inOut" }, { at: 3.2 + i * 0.15, duration: 0.65, x: dx, y: 452 - Math.floor(i / 3) * 73 - l.y, ease: "power2.inOut" }];
  }
  unload.push(layer("unload-arrow", "flow-arrow", 688, 655, 170, 51, { tone: "orange", curved: true }, { enter: 1.15, exit: 4.55 }), pill("empty-note", "\u5378\u4E0B\u672C\u6279\uFF0C\u817E\u51FA\u4F4D\u7F6E", 394, 613, 489, "light", { enter: 4.8 }));
  scene("S06A\u2192S06B", "unload-motion", "\u52A8\u6001\uFF1A\u7ED5\u8F66\u5378\u8D27\uFF0C\u8D27\u7269\u4FDD\u7559", unload, ["transport", "batch"]);
  var cycle = processing(0, false, false).filter((l) => l.id !== "program-status");
  for (let i = 0; i < 3; i++) {
    cycle.push(layer("batch-" + i, "photo-card", 381 + i * 123, 257, 120, 133, { kind: ["cup", "lamp", "bag"][i] }, { enter: 0.5 + i * 0.14, exit: 4.95, fromX: -210, fromY: 95 }));
    cycle.push(layer("saved-" + i, "photo-card", 1054 + i * 52, 328 + i * 9, 89, 99, { kind: ["cup", "lamp", "bag"][i] }, { enter: 2.9 + i * 0.15, fromX: -190, fromY: -25 }));
    cycle.push(layer("next-" + i, "photo-card", 381 + i * 123, 257, 120, 133, { kind: ["bag", "cup", "lamp"][i] }, { enter: 5.5 + i * 0.14, fromX: -210, fromY: 95 }));
  }
  var front = cycle.find((l) => l.id === "output-front");
  cycle.splice(cycle.indexOf(front), 1);
  cycle.push(front);
  cycle.push(layer("read-arrow", "flow-arrow", 219, 365, 102, 31, {}, { enter: 0.4, exit: 1.55 }), layer("save-arrow", "flow-arrow", 962, 361, 87, 27, { tone: "mint" }, { enter: 2.75, exit: 3.6 }), layer("next-arrow", "flow-arrow", 219, 365, 102, 31, {}, { enter: 5.4, exit: 6.5 }), pill("read-label", "\u8BFB\u53D6\u5C0F\u6279", 460, 556, 345, "light", { enter: 0.3, exit: 2.4 }), pill("save-label", "\u5904\u7406\u540E\u4FDD\u5B58", 460, 556, 345, "mint", { enter: 2.45, exit: 4.3 }), pill("clear-label", "\u91CA\u653E\u4E34\u65F6\u526F\u672C", 460, 556, 345, "light", { enter: 4.4, exit: 5.35 }), pill("next-label", "\u8BFB\u53D6\u4E0B\u4E00\u6279", 460, 556, 345, "light", { enter: 5.4 }));
  scene("S07A\u2192S07D", "batch-motion", "\u52A8\u6001\uFF1A\u8BFB\u53D6\u3001\u4FDD\u5B58\u3001\u91CA\u653E\u3001\u4E0B\u4E00\u6279", cycle, ["batch", "memory", "save"]);
  var fields = noticeChat(true);
  for (const l of fields) {
    if (l.id.includes("field-")) l.enter = 1 + Number(l.id.at(-1)) * 1.3;
  }
  scene("S02A\u2192S02B", "field-motion", "\u52A8\u6001\uFF1A\u901A\u77E5\u4E09\u5B57\u6BB5\u9010\u9879\u8865\u9F50", fields, ["paper", "reuse"]);
  var doubao = "references/transfer-hd/03-\u5B98\u65B9\u56FE\u6807/\u8C46\u5305-\u5B98\u65B9\u539F\u4EF6.png";
  var codex = "references/transfer-hd/03-\u5B98\u65B9\u56FE\u6807/Codex-\u5B98\u65B9\u539F\u4EF6.png";
  for (const c of recipes) for (const l of c.defaults.layers) {
    if (l.part === "chat-shell") l.props = { ...l.props, title: "\u8C46\u5305", brandSrc: doubao };
    if (l.id === "editor") l.props = { ...l.props, title: "Codex", brandSrc: codex };
  }
  var errorScene = recipes.find((c) => c.id === "ani-transfer-hd-error-explanation");
  Object.assign(errorScene.defaults.layers.find((l) => l.id === "chat-message-1"), { y: 371 });
  var copyScene = recipes.find((c) => c.id === "ani-transfer-hd-copy-verify");
  for (const l of copyScene.defaults.layers) {
    if (l.id === "code") {
      l.y = 211;
      l.width = 295;
      l.height = 117;
    }
    if (l.id.startsWith("preview-")) {
      l.y = 316;
      l.width = 74;
      l.height = 83;
    }
  }
  recipes.find((c) => c.id === "ani-transfer-hd-next-topic").defaults.layers.find((l) => l.id === "topic").props.text = "\u8BA4\u77E5\u7075\u6D3B\u6027";
  for (const [key, prefix, x, y, s2] of [["experience-problem", "program", 710, 285, 0.68], ["near-far", "far-right", 831, 344, 0.49], ["next-topic", "program", 718, 426, 0.37]]) {
    const c = recipes.find((c2) => c2.id === "ani-transfer-hd-" + key);
    c.defaults.layers = c.defaults.layers.filter((l) => !l.id.startsWith(prefix + "-"));
    c.defaults.layers.push(...place(productGallery(), prefix, x, y, s2));
  }
  for (const c of recipes) for (const l of c.defaults.layers) {
    if (l.part === "notice-paper" && ["\u4E8B\u9879\u901A\u77E5", "\u5DF2\u6709\u4E8B\u9879\u901A\u77E5", "\u5DF2\u6709\u901A\u77E5"].includes(l.props.title)) l.props.title = "\u53D1\u8D27\u5EF6\u8BEF\u901A\u77E5";
    if (l.part === "notice-paper" && ["\u65B0\u7684\u4E8B\u9879\u901A\u77E5", "\u65B0\u901A\u77E5"].includes(l.props.title)) l.props.title = "\u7F3A\u8D27\u901A\u77E5";
    if (["ani-transfer-hd-notice-complete", "ani-transfer-hd-field-motion"].includes(c.id) && l.part === "notice-field") l.props.value = { "\u539F\u56E0": "\u4E3A\u4EC0\u4E48\u665A\u4E86", "\u5F71\u54CD": "\u4F1A\u803D\u8BEF\u4EC0\u4E48", "\u5904\u7406\u529E\u6CD5": "\u63A5\u4E0B\u6765\u600E\u4E48\u529E" }[l.props.label];
  }
  var empty = recipes.find((c) => c.id === "ani-transfer-hd-truck-empty");
  empty.defaults.layers = empty.defaults.layers.filter((l) => l.id !== "unloaded");
  empty.defaults.layers.push(...unload.filter((l) => l.id.includes("-box-")).map((l) => {
    const end = l.steps.at(-1);
    return { ...structuredClone(l), id: "unloaded-" + l.id.at(-1), x: l.x + end.x, y: l.y + end.y, steps: [] };
  }));
  for (const c of [...modules, ...recipes]) if (/notice|field-motion/.test(c.id)) c.intentIds = ["noticeWriting", ...c.intentIds];
  for (const [key, text7, tone3] of [["batch-read", "\u5C0F\u6279\u5DF2\u8BFB\u5165", "light"], ["batch-saved", "\u5904\u7406\u7ED3\u679C\u5DF2\u4FDD\u5B58", "mint"], ["batch-released", "\u5DF2\u91CA\u653E\u4E34\u65F6\u5360\u7528", "light"], ["batch-next", "\u4E0B\u4E00\u5C0F\u6279\u8BFB\u5165", "light"]]) {
    const state3 = recipes.find((c) => c.id === "ani-transfer-hd-" + key);
    state3.defaults.layers.find((l) => l.id === "program-status").props = { text: text7, tone: tone3 };
  }
  var reuseScene = recipes.find((c) => c.id === "ani-transfer-hd-notice-reuse");
  for (const l of reuseScene.defaults.layers) {
    if (/^field-/.test(l.id)) {
      l.x = 532;
      l.width = 210;
      l.height = 42;
    }
    if (l.id === "brace") {
      l.x = 724;
      l.width = 69;
      l.height = 275;
    }
  }
  for (const c of recipes) {
    if (c.defaults.layers.some((l) => l.id === "source-front") && c.defaults.layers.some((l) => l.id === "output-front")) {
      for (const l of c.defaults.layers) if (["source-front", "output-front"].includes(l.id)) l.props.label = "";
      c.defaults.layers.push(pill("source-title", "\u539F\u56FE", 42, 267, 205), pill("output-title", "\u7ED3\u679C", 1044, 267, 205));
    }
    if (c.id === "ani-transfer-hd-question-outro") {
      for (const l of c.defaults.layers) if (l.part === "chat-message") l.props.lines = ["", ""];
    }
  }
  var findScene = (key) => recipes.find((c) => c.id === "ani-transfer-hd-" + key).defaults.layers;
  Object.assign(findScene("experience-problem").find((l) => l.id === "title"), { x: 280, y: 76, width: 720, height: 130 });
  findScene("notice-draft").find((l) => l.id === "chat-message-0").props.text = "\u5BA2\u6C14\u70B9";
  findScene("notice-complete").find((l) => l.id === "chat-message-0").props.text = "\u539F\u56E0\u3001\u5F71\u54CD\u3001\u5904\u7406\u529E\u6CD5";
  findScene("field-motion").find((l) => l.id === "chat-message-0").props.text = "\u539F\u56E0\u3001\u5F71\u54CD\u3001\u5904\u7406\u529E\u6CD5";
  findScene("check-cause").find((l) => l.id === "cause-paper").props.title = "\u4E00\u6B21\u8BFB\u5165\u592A\u591A\uFF1F";
  for (const l of findScene("copy-verify")) if (l.part === "checklist-row") l.props.text = ["\u8FD8\u62A5\u9519\u5417\uFF1F", "\u5C3A\u5BF8\u5BF9\u5417\uFF1F", "\u6709\u6CA1\u6709\u6F0F\u56FE\uFF1F"][Number(l.id.at(-1))];
  findScene("two-purposes").find((l) => l.id === "delivery-label").props.text = "\u6025\u7740\u4EA4\u6D3B";
  findScene("two-purposes").find((l) => l.id === "learning-label").props.text = "\u60F3\u5B66\u4F1A";
  findScene("experience-to-action").find((l) => l.id === "chat-message-2").props.text = "\u8FD9\u6B21\u5177\u4F53\u600E\u4E48\u505A\uFF1A";
  for (const l of findScene("batch-motion")) if (["read-label", "save-label", "clear-label", "next-label"].includes(l.id)) l.y = 623;

  // families/animation-style-hd-kit.mjs
  var purposes = { "truck-body": ["transport"], "truck-cab": ["transport"], wheel: ["transport"], "cargo-box": ["transport", "collection"], "cargo-stack": ["transport", "collection"], warehouse: ["warehouse", "transport"], "ground-shadow": ["annotation"], "photo-card": ["file"], "photo-stack": ["file", "collection"], "window-shell": ["window"], "buffer-area": ["memory"], "chat-shell": ["messages", "window"], "chat-message": ["messages"], "notice-paper": ["noticeWriting", "paper"], "notice-field": ["noticeWriting", "reuse", "paper"], "folder-shell": ["folder"], "attachment-card": ["messages", "file"], "reply-lines": ["messages", "text"], "send-icon": ["messages", "symbol"], "checklist-row": ["verify", "checkbox"], magnifier: ["detail", "verify"], "flow-arrow": ["connector"], brace: ["relation", "connector"], "status-pill": ["status"], title: ["text"], "question-bubble": ["clarify", "annotation"], "brand-badge": ["symbol"], "code-lines": ["code"], "destination-pad": ["warehouse", "transport"], "focus-ring": ["highlight"] };
  purposes.truck = ["transport", "batch"];
  purposes["direction-arrow"] = ["direction", "connector"];
  purposes["semantic-label"] = ["semanticLabel", "text"];
  var components8 = [...parts.map((p) => {
    const s2 = Math.min(850 / p.width, 490 / p.height, 1.6), w = p.width * s2, h = p.height * s2;
    const component2 = makeKit("ani-atom-hd-" + p.key, "\u9AD8\u6E05 \xB7 " + p.name, p.description, [layer("part", p.key, (1280 - w) / 2, (720 - h) / 2, w, h, p.defaults)], { layerType: "primitive", intentIds: purposes[p.key] || ["annotation"], effect: "none" });
    if (p.hidden) component2.hidden = true;
    if (p.compatibilityOnly) component2.compatibilityOnly = true;
    return component2;
  }), ...modules, ...recipes];
  for (const spec of arrowStyles) {
    const p = semanticParts.find((p2) => p2.key === "direction-arrow");
    components8.push(makeKit("ani-atom-hd-arrow-" + spec.id, spec.name, `\u6307\u5411\u7EC4\u4EF6\uFF1B${spec.geometry}\u8DEF\u5F84\uFF1B\u5934\u90E8\u6E05\u6670\u3002\u989C\u8272\u3001\u56DB\u5411\u3001\u7EBF\u5BBD\u3001\u5934\u90E8\u50CF\u7D20\u548C\u5B9E\u4F8B\u5C3A\u5BF8\u53EF\u8C03\uFF1B\u4E0E\u5173\u8054\u62EC\u7EBF\u7528\u9014\u4E0D\u540C\u3002`, [layer("arrow", "direction-arrow", 310, 200, 660, 300, { ...p.defaults, style: spec.id })], { layerType: "primitive", intentIds: ["direction", "connector"], effect: "none" }));
  }
  for (const spec of labelVariants) {
    const p = semanticParts.find((p2) => p2.key === "semantic-label");
    components8.push(makeKit("ani-atom-hd-label-" + spec.id, spec.name, `\u8BED\u4E49\u6807\u6CE8\uFF1B\u9002\u7528${spec.roles.join("/")}\u3002\u540C\u4E00\u8BED\u4E49\u7B49\u7EA7\u5728\u6574\u7247\u51BB\u7ED3\u540C\u6B3E\uFF1B\u5B57\u53F7\u4F7F\u7528\u5B9E\u4F8B\u50CF\u7D20\uFF0C\u4E0D\u968F\u539F\u751F600\xD7180\u6BD4\u4F8B\u7F29\u5C0F\u3002`, [layer("label", "semantic-label", 240, 260, 800, 180, { ...p.defaults, variant: spec.id, text: spec.name, fontSize: 40 })], { layerType: "primitive", intentIds: ["semanticLabel", "text", "annotation"], effect: "none" }));
  }

  // families/animation-style-learning.mjs
  var scope4 = (h, key) => ({ ...h, uid: (s2) => h.uid(key + "-" + s2) });
  var units8 = (s2) => Array.from(String(s2 ?? "")).reduce((n4, c) => n4 + (/[\u0000-\u00ff]/.test(c) ? 0.55 : 1), 0);
  function text4(x, y, value, size, width, h, extra2 = "") {
    const u = units8(value), font5 = Math.min(size, width / Math.max(1, u));
    if (font5 < Math.min(17, size * 0.7)) throw new Error("\u52A8\u753B\u98CE\uFF1A\u6587\u5B57\u8D85\u51FA\u53EF\u8BFB\u8303\u56F4\uFF0C\u8BF7\u7F29\u77ED\uFF1A" + String(value).slice(0, 22));
    return `<text x="${x}" y="${y}" font-size="${font5}" ${/\bfill=/.test(extra2) ? "" : `fill="${tokens.ink}"`} ${extra2}>${h.esc(value)}</text>`;
  }
  var line = (d, color5 = tokens.green, width = 4) => `<path data-ani-link d="${d}" fill="none" stroke="${color5}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  var node2 = (x, y, color5 = tokens.green) => `<circle cx="${x}" cy="${y}" r="8" fill="white" stroke="${color5}" stroke-width="4"/>`;
  var enter = (html) => `<g data-ani-enter>${html}</g>`;
  var pop = (html) => `<g data-ani-pop>${html}</g>`;
  function heading2(p, h) {
    return `${text4(62, 77, p.title, 47, 1138, h)}<path d="M65 97H176" stroke="#6bbfc9" stroke-width="7" stroke-linecap="round"/>${p.subtitle ? text4(64, 125, p.subtitle, 19, 1120, h, 'fill="#547699"') : ""}`;
  }
  function footer(p, h) {
    return p.footer ? text4(640, 694, p.footer, 20, 1120, h, 'text-anchor="middle" fill="#4b7498"') : "";
  }
  function shell(x, y, w, ht, label3, h) {
    const titleH = 42;
    return `<g transform="translate(${x} ${y})"><rect x="11" y="13" width="${w}" height="${ht}" rx="16" fill="${tokens.shadow}"/><rect width="${w}" height="${ht}" rx="16" fill="#fcfeff" stroke="${tokens.ink}" stroke-width="3"/><path d="M16 0H${w - 16}Q${w} 0 ${w} 16V${titleH}H0V16Q0 0 16 0Z" fill="#57a4f5" stroke="${tokens.ink}" stroke-width="3"/>${[23, 47, 71].map((cx) => `<circle cx="${cx}" cy="21" r="6" fill="white" stroke="${tokens.ink}" stroke-width="1.8"/>`).join("")}<g data-text-panel="window-title" data-panel-bounds="0 0 ${w} ${titleH}">${text4(w - 22, 29, label3, 21, w - 126, h, 'text-anchor="end"')}</g><path d="M6 ${ht - 23}V${ht - 15}Q6 ${ht - 6} 16 ${ht - 6}H${w - 18}" stroke="#e1f1ff" stroke-width="5" fill="none"/></g>`;
  }
  function miniWindow(x, y, w, ht, p, h) {
    const left = w * 0.43, pad2 = 16, bodyY = y + 56, bodyH = ht - 75;
    const imgW = w - left - 32;
    return `${shell(x, y, w, ht, p.windowLabel || p.toolLabel || "\u5DE5\u5177\u793A\u610F", h)}<rect x="${x + pad2}" y="${bodyY}" width="${left - 25}" height="${bodyH - 49}" rx="10" fill="#f9fcff" stroke="#bdd4ed" stroke-width="1.6"/>${[0, 1, 2].map((i) => `<path d="M${x + pad2 + 14} ${bodyY + 27 + i * 20}H${x + pad2 + left - 55 - i % 2 * 35}" stroke="#b8cbdf" stroke-width="7" stroke-linecap="round"/>`).join("")}<rect x="${x + left - 88}" y="${y + ht - 48}" width="69" height="27" rx="6" fill="${tokens.blue}"/>${mountains(x + left, y + 57, imgW, bodyH - 4, scope4(h, "landscape"))}${text4(x + left + 12, bodyY + 27, p.previewLabel || "AI \u5B66\u4E60", 22, imgW - 24, h)}`;
  }
  function symbol2(kind, x, y, size, h) {
    if (kind === "check") return magnifier(x, y, size, h);
    if (kind === "document") return icon("document", x, y, size, h);
    const s2 = size / 100;
    let art;
    if (kind === "pencil") art = `<path d="M15 81L27 55L73 9Q78 4 84 10L91 17Q96 22 91 28L45 75Z" fill="#4499f5" stroke="${tokens.ink}" stroke-width="3"/><path d="M73 9L91 28L82 37L64 18Z" fill="${tokens.orange}" stroke="${tokens.ink}" stroke-width="2.5"/><path d="M15 81L27 55L45 75Z" fill="#fff0ce" stroke="${tokens.ink}" stroke-width="3"/><path d="M15 81L21 66L31 77Z" fill="${tokens.ink}"/><path d="M35 54L67 22" stroke="#a8dfff" stroke-width="5"/>`;
    else if (kind === "palette") art = `<path d="M49 13C22 11 3 28 6 49C8 70 33 82 49 76C69 69 61 59 72 57C104 53 100 22 75 15C65 11 55 12 49 13Z" fill="white" stroke="${tokens.ink}" stroke-width="3"/><circle cx="30" cy="34" r="9" fill="${tokens.blue}"/><circle cx="55" cy="28" r="9" fill="${tokens.orange}"/><circle cx="23" cy="54" r="9" fill="#239aac"/><circle cx="51" cy="61" r="6" fill="#d6effb" stroke="${tokens.ink}" stroke-width="2"/>`;
    else if (kind === "ruler") art = `<g transform="rotate(-43 50 50)"><rect x="6" y="30" width="88" height="39" rx="6" fill="#bfe5ff" stroke="${tokens.ink}" stroke-width="3"/><path d="M23 31V47M38 31V41M53 31V47M68 31V41M83 31V47" stroke="${tokens.ink}" stroke-width="3"/><circle cx="20" cy="58" r="3" fill="${tokens.ink}"/></g>`;
    else if (kind === "layout") art = `<rect x="5" y="14" width="89" height="69" rx="5" fill="white" stroke="${tokens.ink}" stroke-width="3"/><rect x="14" y="24" width="37" height="25" rx="2" fill="${tokens.blue}"/><path d="M59 28H84M59 39H80M15 59H49M15 69H44" stroke="#adc6e2" stroke-width="5" stroke-linecap="round"/><rect x="58" y="54" width="26" height="20" rx="2" fill="#a4dfff"/>`;
    else art = `<rect x="7" y="9" width="85" height="81" rx="12" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="3"/><circle cx="30" cy="31" r="9" fill="white"/><path d="M15 77L43 45L59 63L72 49L87 77Z" fill="white"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s2})">${art}</g>`;
  }
  function document2(x, y, w, ht, label3, kind, h) {
    return paper(x, y, w, ht, { fold: 28, depth: 8, content: `${symbol2(kind, w / 2 - 29, 18, 58, h)}${text4(w / 2, ht - 19, label3, 23, w - 16, h, 'text-anchor="middle"')}` }, h);
  }
  var create = (id, name, description, defaults3, ref3, render) => ({ id, name: "\u52A8\u753B\u98CE \xB7 " + name, category: "\u52A8\u753B\u98CE", description, width: 1280, height: 720, defaultEffect: "ani-diagram-build", defaults: defaults3, reference: { basis: "\u7528\u6237\u63D0\u4F9B\u7684\u9759\u5E27\u53C2\u8003 " + ref3 + "\uFF1B\u539F\u751F SVG \u51E0\u4F55\u91CD\u5EFA\uFF0C\u8FD0\u52A8\u4E3A\u65B0\u7F16\u6392\uFF0C\u4E0D\u79F0 1:1 \u6216\u9010\u5E27\u590D\u523B\u3002", source: "reports/animation-style/reference-review-wechat/" + ref3, level: "designed" }, render(props, h) {
    return render({ ...defaults3, ...props }, h);
  } });
  var components9 = [
    create("ani-tool-workbench", "\u8F93\u5165\u3001\u68C0\u67E5\u4E0E\u4FEE\u6539", "\u5B8C\u6574\u5DE5\u5177\u7A97\u53E3\u642D\u914D\u8981\u6C42\u7EB8\u3001\u96EA\u5C71\u9884\u89C8\u4E0E\u68C0\u67E5\u653E\u5927\u955C\uFF0C\u8868\u8FBE\u5148\u8F93\u5165\u3001\u518D\u68C0\u67E5\u3001\u518D\u4FEE\u6539\u7684\u5DE5\u4F5C\u8FC7\u7A0B\u3002", {
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "toolLabel": "\u7A97\u53E3\u6807\u9898",
      "requestLabel": "\u8F93\u5165",
      "request": "\u8F93\u5165\u5185\u5BB9",
      "tags": [
        "\u6807\u7B7E A",
        "\u6807\u7B7E B"
      ],
      "revisionLabel": "\u4FEE\u6539",
      "revision": "\u4FEE\u6539\u5185\u5BB9",
      "action": "\u751F\u6210",
      "previewLabel": "\u9884\u89C8\u6807\u9898",
      "footer": "\u9875\u811A\u8BF4\u660E\u6587\u5B57"
    }, "07_\u8F93\u5165\u68C0\u67E5\u518D\u4FEE\u6539.png", (p, h) => {
      if (!Array.isArray(p.tags) || p.tags.length !== 2) throw new Error("\u5DE5\u4F5C\u53F0 tags \u9700\u8981\u4E24\u4E2A\u6807\u7B7E");
      const win = `${shell(222, 156, 866, 468, p.toolLabel, scope4(h, "window"))}<rect x="240" y="213" width="269" height="388" rx="13" fill="white" stroke="#c1d9f2" stroke-width="2"/><rect x="528" y="213" width="541" height="388" rx="13" fill="white" stroke="#c1d9f2" stroke-width="2"/>${text4(260, 253, p.requestLabel, 25, 220, h)}<rect x="259" y="269" width="230" height="57" rx="11" fill="#fff" stroke="${tokens.ink}" stroke-width="2"/>${text4(275, 306, p.request, 25, 200, h)}${p.tags.map((v, i) => `<rect x="${258 + i * 121}" y="346" width="110" height="49" rx="22" fill="#e7f5ff" stroke="#9bc9ee" stroke-width="1.6"/>${text4(313 + i * 121, 377, v, 21, 94, h, 'text-anchor="middle"')}`).join("")}${text4(261, 441, p.revisionLabel, 25, 220, h)}<rect x="259" y="456" width="230" height="56" rx="11" fill="white" stroke="${tokens.ink}" stroke-width="2"/>${text4(275, 491, p.revision, 25, 200, h)}<rect x="259" y="533" width="230" height="51" rx="11" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="2.5"/>${text4(374, 568, p.action, 29, 198, h, 'text-anchor="middle" fill="white"')}${mountains(545, 232, 507, 350, scope4(h, "hero"))}`;
      const paperArt = paper(48, 266, 156, 243, { fold: 31, content: `${symbol2("image", 39, 31, 79, h)}<path d="M24 145H126M24 165H119M24 185H105" stroke="#bbcee1" stroke-width="9" stroke-linecap="round"/>` }, scope4(h, "request-paper"));
      return svgScene(`${heading2(p, h)}${line("M116 546V587Q116 606 136 606H220")}${line("M1088 493H1168Q1195 493 1195 518V558", tokens.green, 3.5)}${enter(`<g transform="rotate(-8 128 387)">${paperArt}</g>`)}${enter(gear(1096, 206, 128, h))}${enter(win)}${enter(`<rect x="569" y="263" width="169" height="49" rx="7" fill="white" stroke="${tokens.orange}" stroke-width="3"/>${text4(653, 296, p.previewLabel, 26, 147, h, 'text-anchor="middle"')}`)}${pop(`${magnifier(729, 256, 137, h)}<path d="M731 255l-6-17M745 256l12-12M754 271l18-1" stroke="${tokens.orange}" stroke-width="5" stroke-linecap="round"/>`)}${node2(116, 546)}${node2(1195, 558)}${footer(p, h)}`, h);
    }),
    create("ani-file-collection", "\u6587\u4EF6\u5939\u4E0E\u7A97\u53E3\u5BF9\u7167", "\u6587\u4EF6\u5361\u7247\u3001\u6587\u4EF6\u5939\u4E0E\u6D4F\u89C8\u5668\u7A97\u53E3\u5E76\u6392\u5C55\u793A\uFF1B\u6587\u4EF6\u540D\u79F0\u3001\u6807\u7B7E\u4E0E\u8BF4\u660E\u5747\u53EF\u66FF\u6362\u3002", {
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "files": [
        "\u6587\u4EF6 A",
        "\u6587\u4EF6 B",
        "\u6587\u4EF6 C"
      ],
      "folderLabel": "\u6587\u4EF6\u5939\u540D\u79F0",
      "windowLabel": "\u7A97\u53E3\u6807\u9898",
      "previewLabel": "\u9884\u89C8\u6807\u9898",
      "result": "\u2260",
      "footer": "\u9875\u811A\u8BF4\u660E\u6587\u5B57"
    }, "02_\u6536\u85CF\u4E0D\u7B49\u4E8E\u4F1A.png", (p, h) => {
      if (!Array.isArray(p.files) || p.files.length !== 3) throw new Error("\u6536\u85CF\u7EC4\u4EF6 files \u9700\u8981\u4E09\u9879");
      const files = p.files.map((v, i) => enter(`<g transform="rotate(${[-9, 0, 8][i]} ${160 + i * 125} 343)">${paper(84 + i * 131, 245 - i * 7, 162, 233, { fold: 32, content: `<rect x="25" y="38" width="47" height="42" rx="7" fill="${tokens.blue}"/><path d="M43 49L58 59L43 69Z" fill="white"/>${text4(83, 68, v, 24, 66, h)}<path d="M26 112H134M26 137H132M26 162H120" stroke="#b7cee3" stroke-width="8" stroke-linecap="round"/>` }, scope4(h, "file-" + i))}</g>`)).join("");
      const folder3 = `<ellipse cx="323" cy="622" rx="255" ry="24" fill="#e2f1ff"/><path d="M82 423Q76 404 96 399H266L289 421H541Q563 421 556 447L519 610H119Z" fill="#8ac7f5" stroke="${tokens.ink}" stroke-width="3"/><path d="M80 456Q74 433 98 433H242L260 451H527Q547 451 542 474L518 612Q516 624 501 624H118Q101 624 98 608Z" fill="#d6edff" stroke="${tokens.ink}" stroke-width="3.3"/><path d="M114 479H499" stroke="white" stroke-width="4" opacity=".85"/><rect x="132" y="496" width="295" height="74" rx="12" fill="#f7fcff" stroke="#adceea" stroke-width="1.7"/>${text4(154, 541, p.folderLabel, 29, 256, h)}`;
      return svgScene(`${heading2(p, h)}${files}${enter(folder3)}${enter(miniWindow(726, 259, 478, 350, p, scope4(h, "demo")))}${enter(gear(1123, 547, 107, h))}${pop(text4(627, 479, p.result, 112, 135, h, 'text-anchor="middle" fill="#b56a00"'))}${footer(p, h)}`, h);
    }),
    create("ani-method-transfer", "\u7A97\u53E3\u4E0E\u90E8\u4EF6\u7EC4\u5408", "\u6D4F\u89C8\u5668\u3001\u6587\u4EF6\u5361\u7247\u4E0E\u5BB9\u5668\u901A\u8FC7\u8FDE\u7EBF\u7EC4\u5408\uFF1B\u6B65\u9AA4\u3001\u5BB9\u5668\u6807\u9898\u548C\u65B0\u589E\u9879\u5206\u522B\u53EF\u7F16\u8F91\u3002", {
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "windowLabel": "\u7A97\u53E3\u6807\u9898",
      "previewLabel": "\u9884\u89C8\u6807\u9898",
      "steps": [
        "\u6B65\u9AA4 A",
        "\u6B65\u9AA4 B",
        "\u6B65\u9AA4 C"
      ],
      "trayTitle": "\u5BB9\u5668\u6807\u9898",
      "newLabel": "\u65B0\u589E\u9879",
      "footer": "\u9875\u811A\u8BF4\u660E\u6587\u5B57"
    }, "12_\u719F\u6089\u90E8\u5206\u4E0E\u65B0\u5DEE\u5F02.png", (p, h) => {
      if (!Array.isArray(p.steps) || p.steps.length !== 3) throw new Error("\u590D\u7528\u6258\u76D8 steps \u9700\u8981\u4E09\u9879");
      const methods = p.steps.map((v, i) => enter(`<g data-method-card="${i}">${document2(64 + i * 165, 474, 126, 154, v, ["image", "check", "pencil"][i], scope4(h, "source-" + i))}</g>`)).join("");
      const lid = paper(652, 158, 539, 217, { fold: 43, depth: 11, content: `${symbol2("image", 34, 43, 91, h)}${text4(151, 95, p.trayTitle, 37, 338, h)}<path d="M153 122H461M153 145H421M153 166H365" stroke="#becfe0" stroke-width="9" stroke-linecap="round"/>` }, scope4(h, "lid"));
      const tray = `<path d="M649 401H1184L1220 611Q1227 634 1202 641H645Q620 639 618 620Z" fill="#bcd9f6" stroke="${tokens.ink}" stroke-width="3"/><path d="M654 393H1181L1210 599Q1214 617 1195 619H645Q628 618 632 600Z" fill="#f8fdff" stroke="${tokens.ink}" stroke-width="3"/><path d="M674 416H997L1020 590H652Z" fill="#e5f8f7" stroke="#149daf" stroke-width="3"/><path d="M1068 416H1156L1186 590H1043Z" fill="#fff2d7" stroke="#df8b10" stroke-width="3"/>`;
      const slots = p.steps.map((v, i) => enter(`<g transform="translate(${669 + i * 112} 437)"><rect x="4" y="5" width="98" height="140" rx="8" fill="#acdae6"/><rect width="98" height="140" rx="8" fill="white" stroke="#61b8c3" stroke-width="2"/>${symbol2(["document", "check", "pencil"][i], 22, 19, 57, h)}${text4(49, 116, v, 24, 86, h, 'text-anchor="middle"')}</g>`)).join("");
      const connection = (id, d, x, y) => `<g data-ani-link data-ani-connection="${id}"><path d="${d}" fill="none" stroke="${tokens.green}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${node2(x, y)}</g>`;
      const connections = connection("requirements-check", "M190 551H229", 210, 551) + connection("check-revision", "M355 551H394", 375, 551) + connection("revision-tray", "M520 551H555Q584 551 584 519V478Q584 449 614 449H646", 615, 449);
      return svgScene(`${heading2(p, h)}${connections}${enter(miniWindow(61, 163, 486, 270, p, scope4(h, "known-window")))}${methods}${enter(lid)}${enter(`<g data-method-tray>${tray}</g>`)}${slots}${pop(`<rect x="1056" y="443" width="98" height="88" rx="8" fill="#fffaf0" stroke="#f4a126" stroke-width="2.5" stroke-dasharray="7 5"/>${text4(1111, 575, p.newLabel, 27, 107, h, 'text-anchor="middle"')}`)}${footer(p, h)}`, h);
    }),
    create("ani-knowledge-network", "\u6587\u6863\u4E0E\u7A97\u53E3\u8FDE\u7EBF", "\u6587\u4EF6\u3001\u9884\u89C8\u7A97\u53E3\u4E0E\u6587\u6863\u901A\u8FC7\u8FDE\u7EBF\u7EC4\u6210\u56FE\u89E3\uFF1B\u5B57\u6BB5\u3001\u6B65\u9AA4\u3001\u8F93\u51FA\u548C\u6CE8\u91CA\u53EF\u7F16\u8F91\u3002", {
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "previewLabel": "\u9884\u89C8\u6807\u9898",
      "requirementsTitle": "\u6587\u6863\u6807\u9898",
      "fields": [
        "\u5B57\u6BB5 A",
        "\u5B57\u6BB5 B",
        "\u5B57\u6BB5 C"
      ],
      "steps": [
        "\u6B65\u9AA4 A",
        "\u6B65\u9AA4 B"
      ],
      "outputTitle": "\u8F93\u51FA\u6807\u9898",
      "resultLabel": "\u7ED3\u679C\u6807\u7B7E",
      "questionTitle": "\u95EE\u9898\u6807\u9898",
      "question": "\u95EE\u9898\u5185\u5BB9\uFF1F",
      "footer": "\u9875\u811A\u8BF4\u660E\u6587\u5B57"
    }, "16_\u628A\u65B0\u65E7\u8FDE\u8D77\u6765.png", (p, h) => {
      if (!Array.isArray(p.fields) || p.fields.length !== 3 || !Array.isArray(p.steps) || p.steps.length !== 2) throw new Error("\u77E5\u8BC6\u7F51\u7EDC\u9700\u8981\u4E09\u4E2A fields \u548C\u4E24\u4E2A steps");
      const docs = [0, 1, 2].reverse().map((i) => enter(paper(75 + i * 63, 204 - i * 24, 115, 150, { fold: 25, depth: 7, content: `${icon(["document", "table", "document"][i], 24, 16, 54, h)}<path d="M21 95H87M21 115H73" stroke="#b3ccdf" stroke-width="6" stroke-linecap="round"/>` }, scope4(h, "knowledge-" + i)))).join("");
      const center = `<rect x="458" y="181" width="358" height="272" rx="12" fill="${tokens.shadow}"/><rect x="449" y="171" width="358" height="272" rx="12" fill="#fcfeff" stroke="${tokens.ink}" stroke-width="3"/><path d="M461 171H795Q807 171 807 183V228H449V183Q449 171 461 171Z" fill="#dfedff" stroke="${tokens.ink}" stroke-width="3"/>${text4(474, 211, p.requirementsTitle, 29, 305, h)}${p.fields.map((v, i) => `<rect x="469" y="${243 + i * 60}" width="315" height="50" rx="8" fill="${i === 2 ? "#dcf7f4" : "white"}" stroke="${i === 2 ? "#37adbc" : "#afcfea"}" stroke-width="1.7"/>${symbol2(["document", "palette", "ruler"][i], 479, 248 + i * 60, 39, h)}<path d="M530 ${245 + i * 60}V${291 + i * 60}" stroke="#a3d1e4"/>${text4(548, 278 + i * 60, v, 27, 205, h)}`).join("")}`;
      const steps = p.steps.map((v, i) => enter(`<rect x="${455 + i * 185}" y="497" width="165" height="70" rx="11" fill="${tokens.shadow}"/><rect x="${448 + i * 185}" y="490" width="165" height="70" rx="11" fill="white" stroke="${tokens.ink}" stroke-width="2.4"/>${symbol2(i ? "pencil" : "check", 462 + i * 185, 501, 43, h)}${text4(528 + i * 185, 533, v, 25, 78, h)}`)).join("");
      const result = paper(962, 156, 243, 328, { fold: 39, depth: 11, content: `${text4(25, 56, p.outputTitle, 30, 195, h)}<rect x="53" y="81" width="141" height="218" rx="4" fill="none" stroke="#7ca2c5" stroke-width="2" stroke-dasharray="6 5"/>${mountains(64, 91, 119, 197, scope4(h, "portrait"))}` }, scope4(h, "result-paper"));
      return svgScene(`${heading2(p, h)}${line("M313 277H368V365H449", "#6590b7", 2.4)}${line("M355 542H390V365H449", "#6590b7", 2.4)}${line("M628 442V469H529V490M628 469H714V490M529 560V588H630V606M714 560V588H630", "#6590b7", 2.4)}${line("M784 388H962", tokens.green, 4)}${docs}${enter(`${mountains(70, 430, 288, 207, scope4(h, "old-image"))}${text4(86, 466, p.previewLabel, 26, 245, h)}`)}${enter(center)}${steps}${enter(`<rect x="513" y="608" width="236" height="51" rx="12" fill="#edf7ff" stroke="${tokens.ink}" stroke-width="2.3"/>${symbol2("image", 527, 617, 34, h)}${text4(579, 643, p.resultLabel, 26, 155, h)}`)}${pop(result)}${pop(`<rect x="930" y="527" width="285" height="123" rx="13" fill="#fff6e7" stroke="${tokens.orange}" stroke-width="1.6"/>${text4(952, 564, p.questionTitle, 25, 244, h)}<circle cx="963" cy="605" r="20" fill="white" stroke="${tokens.orange}" stroke-width="2.5" stroke-dasharray="6 4"/>${text4(993, 615, p.question, 25, 197, h)}`)}${node2(784, 388)}${node2(962, 388)}${footer(p, h)}`, h);
    }),
    create("ani-capability-tiles", "\u56FE\u6807\u5361\u7247\u7EC4", "\u516D\u5757\u5E26\u56FE\u6807\u7684\u5361\u7247\u4E0E\u9884\u89C8\u7A97\u53E3\u5E76\u7F6E\uFF1B\u5361\u7247\u6807\u7B7E\u3001\u7A97\u53E3\u6807\u9898\u548C\u7ED3\u679C\u6587\u5B57\u53EF\u7F16\u8F91\u3002", {
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "tiles": [
        "\u6807\u7B7E A",
        "\u6807\u7B7E B",
        "\u6807\u7B7E C",
        "\u6807\u7B7E D",
        "\u6807\u7B7E E",
        "\u6807\u7B7E F"
      ],
      "windowLabel": "\u7A97\u53E3\u6807\u9898",
      "previewLabel": "\u9884\u89C8\u6807\u9898",
      "result": "\u7ED3\u679C\u8BF4\u660E",
      "footer": "\u9875\u811A\u8BF4\u660E\u6587\u5B57"
    }, "10_\u6563\u843D\u7684\u77E5\u8BC6\u7816.png", (p, h) => {
      if (!Array.isArray(p.tiles) || p.tiles.length !== 6) throw new Error("\u77E5\u8BC6\u7816 tiles \u9700\u8981\u516D\u9879");
      const pos = [[81, 235, -8], [321, 251, 7], [557, 223, -9], [169, 458, 7], [445, 471, -8], [747, 456, -10]], kinds = ["document", "palette", "ruler", "layout", "check", "pencil"];
      const tiles = p.tiles.map((label3, i) => {
        const [x, y, r] = pos[i];
        return enter(`<g transform="rotate(${r} ${x + 96} ${y + 91})"><rect x="${x + 9}" y="${y + 13}" width="190" height="172" rx="15" fill="${tokens.shadow}"/><rect x="${x}" y="${y + 6}" width="190" height="172" rx="15" fill="#aed3f4" stroke="${tokens.ink}" stroke-width="2.7"/><rect x="${x}" y="${y}" width="190" height="167" rx="15" fill="#f2faff" stroke="${tokens.ink}" stroke-width="2.7"/><path d="M${x + 8} ${y + 26}V${y + 16}Q${x + 8} ${y + 8} ${x + 19} ${y + 8}H${x + 169}" fill="none" stroke="white" stroke-width="3"/>${symbol2(kinds[i], x + 53, y + 19, 86, h)}${text4(x + 95, y + 143, label3, 28, 165, h, 'text-anchor="middle"')}</g>`);
      }).join("");
      return svgScene(`${heading2(p, h)}${enter(miniWindow(836, 156, 366, 282, p, scope4(h, "tiles-window")))}${tiles}${pop(`<path d="M976 508L998 490M997 524H1023M960 490L967 466" stroke="${tokens.orange}" stroke-width="5" stroke-linecap="round"/>${text4(1098, 569, p.result, 27, 214, h, 'text-anchor="middle"')}`)}${footer(p, h)}`, h);
    })
  ];

  // families/animation-style-objects.mjs
  var context = (h, id) => ({ ...h, uid: (s2) => h.uid(id + "-" + s2) });
  var units9 = (s2) => Array.from(String(s2 ?? "")).reduce((n4, c) => n4 + (c.charCodeAt(0) < 256 ? 0.55 : 1), 0);
  var text5 = (h, x, y, value, size = 24, width = 600, extra2 = "") => {
    const font5 = Math.min(size, width / Math.max(1, units9(value)));
    if (font5 < 14) throw Error("\u6587\u5B57\u8FC7\u957F\uFF0C\u8BF7\u7F29\u77ED\u5F53\u524D\u6587\u6848\u540E\u518D\u5E94\u7528\u3002");
    return `<text x="${x}" y="${y}" font-size="${font5}" fill="${tokens.ink}" ${extra2}>${h.esc(value)}</text>`;
  };
  var arrow2 = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 13H31V0L57 24L31 48V35H0Z" fill="${tokens.green}" stroke="${tokens.ink}" stroke-width="3.5" stroke-linejoin="round"/><path d="M4 18H34V11" stroke="#70ceb3" stroke-width="3" fill="none"/></g>`;
  function processing2(p, h) {
    if (p.inputs.length !== 3 || p.outputs.length !== 3) throw Error("\u5904\u7406\u88C5\u7F6E\u793A\u4F8B\u9700\u8981\u4E09\u9879\u8F93\u5165\u548C\u4E09\u9879\u7ED3\u679C\u3002");
    const colors3 = [tokens.green, tokens.purple, tokens.orange];
    const input = p.inputs.map((item, i) => `<g data-ani-enter>${paper(50 + i * 94, 268 + i % 2 * 16, 116, 158, { fold: 24, depth: 7 }, context(h, "in" + i))}${icon(item.icon || "document", 72 + i * 94, 315 + i % 2 * 16, 61, context(h, "input-icon" + i))}${text5(h, 108 + i * 94, 305 + i % 2 * 16, item.label, 21, 94, 'text-anchor="middle"')}</g>`).join("");
    const slots = colors3.map((color5, i) => `<g><path d="M${477 + i * 91} 256L${492 + i * 91} 234H${548 + i * 91}L${533 + i * 91} 256Z" fill="${color5}" stroke="${tokens.ink}" stroke-width="3"/><path d="M${491 + i * 91} 246H${531 + i * 91}" stroke="#ffffff" stroke-width="3" opacity=".5"/><rect x="${477 + i * 91}" y="288" width="81" height="217" rx="8" fill="${color5}" fill-opacity=".15"/><rect x="${492 + i * 91}" y="291" width="10" height="90" rx="5" fill="#c8dcf0" stroke="${tokens.ink}" stroke-width="2"/><rect x="${483 + i * 91}" y="360" width="29" height="18" rx="4" fill="#658ab6" stroke="${tokens.ink}" stroke-width="2"/><rect x="${473 + i * 91}" y="459" width="88" height="41" rx="8" fill="#456486" stroke="${tokens.ink}" stroke-width="3"/><rect x="${481 + i * 91}" y="465" width="71" height="22" rx="10" fill="#abc9e4" stroke="${tokens.ink}" stroke-width="2"/><circle cx="${492 + i * 91}" cy="476" r="6" fill="white" stroke="${tokens.ink}" stroke-width="2"/><circle cx="${541 + i * 91}" cy="476" r="6" fill="white" stroke="${tokens.ink}" stroke-width="2"/><g data-ani-gear>${gear(488 + i * 91, 387, 53, context(h, "gear" + i))}</g></g>`).join("");
    const outputs = p.outputs.map((item, i) => `<g data-ani-pop><g transform="translate(0 ${i * 89})"><rect x="934" y="302" width="267" height="75" rx="12" fill="white" stroke="#97b5d6" stroke-width="2"/>${icon(item.icon || "document", 947, 311, 55, context(h, "output-icon" + i))}${text5(h, 1012, 347, item.label, 22, 143)}<circle cx="1173" cy="339" r="13" fill="${tokens.green}" stroke="${tokens.ink}" stroke-width="2"/><path d="M1166 339L1171 345L1180 333" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/></g></g>`).join("");
    return svgScene(`${banner(357, 39, 566, p.title, tokens.blue, context(h, "title"))}${text5(h, 640, 143, p.subtitle, 24, 1050, 'text-anchor="middle"')}<ellipse cx="642" cy="578" rx="240" ry="22" fill="#dceffd"/>${input}${banner(78, 201, 211, p.inputTitle, tokens.green, context(h, "input-label"))}${arrow2(355, 340)}<g data-ani-enter><path d="M436 259L466 217H757L799 254V533L773 562H452L425 530V280Z" fill="#dcf0ff" stroke="${tokens.ink}" stroke-width="4"/><path d="M773 262L799 254V533L773 562Z" fill="#5ca8f6" stroke="${tokens.ink}" stroke-width="3"/><path d="M437 259L466 217H757L773 262Z" fill="white" stroke="${tokens.ink}" stroke-width="3"/><rect x="448" y="275" width="307" height="239" rx="15" fill="#f5fbff" stroke="${tokens.ink}" stroke-width="3"/>${slots}<circle cx="475" cy="538" r="10" fill="${tokens.green}" stroke="${tokens.ink}" stroke-width="2"/><circle cx="503" cy="538" r="10" fill="white" stroke="${tokens.ink}" stroke-width="2"/><circle cx="531" cy="538" r="10" fill="white" stroke="${tokens.ink}" stroke-width="2"/><path d="M613 533H738M613 541H738M613 549H738" stroke="#6a93bb" stroke-width="3" stroke-linecap="round"/><path d="M447 562V571H473V562M728 562V571H754V562" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="3"/></g>${banner(521, 175, 202, p.processTitle, tokens.blue, context(h, "process-label"))}<g data-ani-travel>${icon("document", 477, 246, 53, context(h, "travel"))}</g>${arrow2(824, 340)}<g><rect x="922" y="282" width="299" height="292" rx="18" fill="#c7e2fa"/><rect x="914" y="274" width="299" height="292" rx="18" fill="white" stroke="#102b62" stroke-width="4"/><path d="M1207 289V549Q1207 560 1196 560H932" fill="none" stroke="#d4ecff" stroke-width="5"/>${outputs}</g>${banner(953, 202, 217, p.outputTitle, tokens.blue, context(h, "result-label"))}<g data-ani-pop>${text5(h, 640, 651, p.footer, 26, 1060, 'text-anchor="middle"')}</g>`, h);
  }
  function question(p, h) {
    const cards = p.examples;
    if (!Array.isArray(cards) || cards.length !== 2) throw Error("\u7ED3\u5C3E\u793A\u4F8B\u9700\u8981\u4E24\u4E2A\u5BF9\u8C61\u3002");
    const examples = cards.map((c, i) => {
      const x = i ? 739 : 248, w = i ? 296 : 260;
      const lines3 = (c.lines || []).slice(0, 3);
      return `<g data-ani-enter>${paper(x, 414, w, 181, { fold: 34, depth: 8 }, context(h, "example" + i))}${banner(x + 25, 426, w - 62, c.title, i ? tokens.green : tokens.blue, context(h, "example-title" + i))}${lines3.map((s2, j) => `${icon(i ? "table" : "document", x + 17, 488 + j * 30, 26, context(h, "mini" + i + j))}${text5(h, x + 54, 509 + j * 30, s2, 16, w - 71)}`).join("")}</g>`;
    }).join("");
    return svgScene(`<g data-ani-enter><path d="M178 67H1065L1102 96V316L1069 350H178Q153 350 153 324V94Q153 67 178 67Z" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="4"/><path d="M1069 82L1102 96V316L1069 350Z" fill="#0560c7" stroke="${tokens.ink}" stroke-width="3"/><rect x="169" y="81" width="895" height="248" rx="34" fill="#fbfeff" stroke="${tokens.ink}" stroke-width="4"/><path d="M185 122Q185 97 211 96H1018" fill="none" stroke="#cae6ff" stroke-width="5" stroke-linecap="round"/>${text5(h, 615, 178, p.title, 56, 775, 'text-anchor="middle" font-weight="900"')}${text5(h, 615, 255, p.subtitle, 56, 775, 'text-anchor="middle" font-weight="900"')}<path d="M123 67L111 43M146 51L142 23M107 91L82 81" stroke="${tokens.ink}" stroke-width="13" stroke-linecap="round"/><path d="M123 67L111 43M146 51L142 23M107 91L82 81" stroke="${tokens.orange}" stroke-width="7" stroke-linecap="round"/></g><g data-ani-pop><text x="1050" y="361" font-size="138" font-weight="900" fill="#b56a00" stroke="${tokens.ink}" stroke-width="3" transform="rotate(13 1050 315)">?</text></g>${examples}<path data-ani-link d="M523 497C570 497 566 464 604 464M678 464C716 464 696 497 722 497" stroke="${tokens.green}" stroke-width="4" fill="none" stroke-linecap="round"/><g data-ani-pop><path d="M620 458L637 484M637 453L621 489" stroke="${tokens.orange}" stroke-width="5" stroke-linecap="round"/>${banner(428, 620, 424, p.footer, tokens.blue, context(h, "footer"))}</g>`, h);
  }
  var common4 = { category: "\u52A8\u753B\u98CE", width: 1280, height: 720, reference: { level: "designed", basis: "\u6309\u7528\u6237\u63D0\u4F9B\u7684 V8 \u539F\u751F\u56FE\u89E3\u6BCD\u7248\u91CD\u5EFA SVG \u51E0\u4F55\u3002\u4FDD\u6301\u5BF9\u8C61\u7ED3\u6784\u4E0E\u72B6\u6001\u8BED\u4E49\uFF0C\u5177\u4F53\u8865\u95F4\u4E3A\u672C\u6B21\u8BBE\u8BA1\uFF1B\u4E0D\u662F\u5B9E\u9645\u8F6F\u4EF6\u622A\u56FE\u3002", source: "references/animation-style/sources.json" } };
  var components10 = [
    { ...common4, id: "ani-processing-machine", name: "\u52A8\u753B\u98CE \xB7 \u8F93\u5165\u5904\u7406\u88C5\u7F6E", description: "\u6587\u4EF6\u9001\u5165\u4E09\u901A\u9053\u88C5\u7F6E\uFF0C\u5185\u90E8\u5904\u7406\u540E\u751F\u6210\u5BF9\u5E94\u7ED3\u679C\uFF1B\u8F93\u5165\u3001\u5904\u7406\u6807\u7B7E\u548C\u8F93\u51FA\u5185\u5BB9\u53EF\u66FF\u6362\u3002", defaultEffect: "ani-machine-process", defaults: {
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "inputTitle": "\u8F93\u5165",
      "processTitle": "\u5904\u7406",
      "outputTitle": "\u8F93\u51FA",
      "inputs": [
        {
          "label": "\u8F93\u5165 A",
          "icon": "document"
        },
        {
          "label": "\u8F93\u5165 B",
          "icon": "documents"
        },
        {
          "label": "\u8F93\u5165 C",
          "icon": "table"
        }
      ],
      "outputs": [
        {
          "label": "\u8F93\u51FA A",
          "icon": "document"
        },
        {
          "label": "\u8F93\u51FA B",
          "icon": "documents"
        },
        {
          "label": "\u8F93\u51FA C",
          "icon": "table"
        }
      ],
      "footer": "\u9875\u811A\u8BF4\u660E\u6587\u5B57"
    }, render: processing2 },
    { ...common4, id: "ani-question-outro", name: "\u52A8\u753B\u98CE \xB7 \u95EE\u9898\u4E0E\u9884\u544A", description: "\u4FDD\u7559\u4E24\u4E2A\u6848\u4F8B\u5BF9\u8C61\uFF0C\u5C06\u5F53\u524D\u95EE\u9898\u5F15\u5411\u4E0B\u4E00\u671F\uFF1B\u5927\u5B57\u95EE\u9898\u724C\u3001\u6A59\u8272\u95EE\u53F7\u548C\u9884\u544A\u6807\u7B7E\u4F9D\u6B21\u51FA\u73B0\u3002", defaultEffect: "ani-diagram-build", defaults: {
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "footer": "\u9875\u811A\u8BF4\u660E\u6587\u5B57",
      "examples": [
        {
          "title": "\u9762\u677F A",
          "lines": [
            "\u8BF4\u660E\u5185\u5BB9 A",
            "\u8BF4\u660E\u5185\u5BB9 B",
            "\u8BF4\u660E\u5185\u5BB9 C"
          ]
        },
        {
          "title": "\u9762\u677F B",
          "lines": [
            "\u8BF4\u660E\u5185\u5BB9 A",
            "\u8BF4\u660E\u5185\u5BB9 B",
            "\u8BF4\u660E\u5185\u5BB9 C"
          ]
        }
      ]
    }, render: question }
  ];

  // transfer-primitives.mjs
  var scoped2 = (h, key) => ({ ...h, uid: (s2) => h.uid(key + "-" + s2) });
  function number5(value, min, max, name = "value") {
    const n4 = Number(value);
    if (!Number.isFinite(n4) || n4 < min || n4 > max) throw Error(`${name}: expected ${min}\u2013${max}`);
    return n4;
  }
  function count(value, min, max, name = "count") {
    const n4 = number5(value, min, max, name);
    if (!Number.isInteger(n4)) throw Error(name + ": expected integer");
    return n4;
  }
  function text6(x, y, value, size, width, h, extra2 = "") {
    const copy4 = String(value ?? ""), units10 = Array.from(copy4).reduce((n4, c) => n4 + (c.charCodeAt(0) < 128 ? 0.55 : 1), 0), font5 = Math.min(size, width / Math.max(units10, 1));
    if (font5 < Math.min(19, size * 0.8)) throw Error("\u6587\u5B57\u8FC7\u957F\uFF0C\u8BF7\u7F29\u77ED\u5185\u5BB9\u6216\u589E\u5927\u90E8\u4EF6\u5C3A\u5BF8");
    return `<text x="${x}" y="${y}" font-size="${font5}" fill="${tokens.ink}" ${extra2}>${h.esc(copy4)}</text>`;
  }
  var at = (x, y, html, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">${html}</g>`;
  function panel2(w, h, color5 = "white", rx = 16) {
    return `<rect x="8" y="10" width="${w}" height="${h}" rx="${rx}" fill="${tokens.shadow}"/><rect width="${w}" height="${h}" rx="${rx}" fill="${color5}" stroke="${tokens.ink}" stroke-width="3"/><path d="M18 9H${Math.min(w - 20, 112)}" stroke="#e5f4ff" stroke-width="3" stroke-linecap="round"/>`;
  }
  function badge2(x, y, w, label3, h, tone3 = "blue") {
    const color5 = tokens[tone3] || tokens.blue;
    return at(x, y, `<rect x="4" y="5" width="${w}" height="44" rx="16" fill="${tokens.shadow}"/><rect width="${w}" height="44" rx="16" fill="${color5}" stroke="${tokens.ink}" stroke-width="2.5"/>${text6(w / 2, 30, label3, 25, w - 24, h, `text-anchor="middle" style="fill:${tone3 === "orange" ? tokens.ink : "white"}"`)}`);
  }
  function cargo({ label: label3 = "", tone: tone3 = "orange" } = {}, h) {
    const fill = tone3 === "blue" ? "#bbdeff" : tone3 === "green" ? "#bdebdc" : "#ffce85";
    return `<path d="M6 24L67 8L108 28V95L46 112L6 92Z" fill="${fill}" stroke="${tokens.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M6 24L46 43L108 28M46 43V112M38 15L77 34V57L61 61V38L23 20" fill="none" stroke="${tokens.ink}" stroke-width="2.5"/><path d="M55 78L93 68V83L55 94Z" fill="#fff9ee"/>${label3 ? text6(74, 85, label3, 13, 36, h, 'text-anchor="middle"') : ""}`;
  }
  function truck2({ load = 3, label: label3 = "" } = {}, h) {
    count(load, 0, 4, "load");
    return `<ellipse cx="175" cy="215" rx="169" ry="14" fill="#d7edfa"/><path d="M18 183V37L174 13L195 28V184Z" fill="white" stroke="${tokens.ink}" stroke-width="4" stroke-linejoin="round"/><path d="M174 13V182L195 184V28Z" fill="#9ad6ff" stroke="${tokens.ink}" stroke-width="3"/><path d="M34 48L157 30V166L34 178Z" fill="#e6f4ff" stroke="#88bde9" stroke-width="2"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M43 ${61 + i * 22}L149 ${45 + i * 22}" stroke="#afd7fa" stroke-width="7"/>`).join("")}<path d="M195 184V68L276 73L314 130V190H194Z" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="4" stroke-linejoin="round"/><path d="M210 81H270L294 127H212Z" fill="#e9faff" stroke="${tokens.ink}" stroke-width="3"/><path d="M249 82V126M275 145H290" stroke="${tokens.ink}" stroke-width="3"/><path d="M209 142H241V177H209Z" fill="#bce7ff"/><path d="M305 157H321V178H306" fill="#fff3c5" stroke="${tokens.ink}" stroke-width="3"/><path d="M15 183H325V197H15Z" fill="#69bae9" stroke="${tokens.ink}" stroke-width="3"/>${[68, 164, 271].map((x) => `<circle cx="${x}" cy="197" r="24" fill="#426c97" stroke="${tokens.ink}" stroke-width="4"/><circle cx="${x}" cy="197" r="12" fill="#cbeafe" stroke="${tokens.ink}" stroke-width="2.5"/>`).join("")}<g data-tr-cargo>${Array.from({ length: load }, (_, i) => at(36 + i % 3 * 43, 120 - Math.floor(i / 3) * 43, cargo({}, scoped2(h, "load" + i)), 0.46)).join("")}</g>${label3 ? text6(105, 105, label3, 22, 125, h, 'text-anchor="middle"') : ""}`;
  }
  function warehouse({ title = "\u573A\u6240\u540D\u79F0", open = true, stock = 3 } = {}, h) {
    count(stock, 0, 6, "stock");
    return `<path d="M11 43L210 43L240 66V246H11Z" fill="#eef6ff" stroke="${tokens.ink}" stroke-width="3"/><path d="M210 43V245H240V66Z" fill="#cfdef3" stroke="${tokens.ink}" stroke-width="2"/><rect x="35" y="100" width="153" height="146" fill="#2d5682" stroke="${tokens.ink}" stroke-width="3"/>${open ? Array.from({ length: stock }, (_, i) => at(40 + i % 3 * 44, 188 - Math.floor(i / 3) * 46, cargo({}, scoped2(h, "stock" + i)), 0.45)).join("") : `<rect x="38" y="104" width="147" height="139" fill="#c6e1f9"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M39 ${119 + i * 26}H184" stroke="#75a8d6" stroke-width="3"/>`).join("")}`}<path d="M3 21H214L241 43H11Z" fill="white" stroke="${tokens.ink}" stroke-width="3" stroke-linejoin="round"/>${text6(110, 79, title, 24, 177, h, 'text-anchor="middle"')}<path d="M0 250H256" stroke="#bddbf0" stroke-width="7" stroke-linecap="round"/>`;
  }
  function resource({ kind = "image", label: label3 = "" } = {}, h) {
    if (!["image", "cup", "lamp", "bag"].includes(kind)) throw Error("Unknown resource kind");
    let art;
    if (kind === "image") art = `<rect x="19" y="16" width="63" height="71" rx="7" fill="white" stroke="${tokens.ink}" stroke-width="2.6"/><rect x="27" y="25" width="47" height="52" rx="5" fill="${tokens.blue}"/><circle cx="41" cy="39" r="7" fill="#ffcf6e"/><path d="M29 69L45 49L57 62L65 53L74 69Z" fill="white"/>`;
    if (kind === "cup") art = `<path d="M25 26H65V65Q65 85 45 85Q25 85 25 65Z" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="3"/><path d="M65 33H77C93 34 89 60 66 61" fill="none" stroke="${tokens.ink}" stroke-width="5"/><ellipse cx="45" cy="26" rx="20" ry="7" fill="#73c2ff" stroke="${tokens.ink}" stroke-width="3"/>`;
    if (kind === "lamp") art = `<path d="M30 19H67L79 57H18Z" fill="#ffc573" stroke="${tokens.ink}" stroke-width="3"/><path d="M49 57V82" stroke="${tokens.ink}" stroke-width="5"/><path d="M31 85Q49 73 67 85V90H31Z" fill="${tokens.orange}" stroke="${tokens.ink}" stroke-width="3"/>`;
    if (kind === "bag") art = `<path d="M23 35H73L79 86H17Z" fill="#83d6c9" stroke="${tokens.ink}" stroke-width="3"/><path d="M34 41V26Q49 7 63 26V41" fill="none" stroke="${tokens.ink}" stroke-width="4"/><path d="M31 46V79" stroke="#c3f6ed" stroke-width="4"/>`;
    return `<rect x="1" y="1" width="98" height="${label3 ? 128 : 98}" rx="13" fill="#edf8ff" stroke="#6aaae2" stroke-width="2"/>${art}${label3 ? text6(50, 119, label3, 17, 85, h, 'text-anchor="middle"') : ""}`;
  }
  function buffer({ title = "\u533A\u57DF\u6807\u9898", capacity = 6, occupied = 3, kinds = ["image"], state: state3 = "normal" } = {}, h) {
    count(capacity, 1, 8, "capacity");
    count(occupied, 0, capacity, "occupied");
    if (!Array.isArray(kinds) || !kinds.length) throw Error("kinds requires an item");
    if (!["normal", "warning", "released"].includes(state3)) throw Error("Invalid buffer state");
    const cols = capacity > 4 ? 3 : 2, rows3 = Math.ceil(capacity / cols), w = cols * 108 + 28, height = rows3 * 108 + 88;
    return `<g data-buffer-capacity="${capacity}" data-buffer-occupied="${occupied}">${panel2(w, height, "#f5fcff")}${badge2(20, 15, w - 40, title, h)}${Array.from({ length: capacity }, (_, i) => {
      const x = 18 + i % cols * 108, y = 78 + Math.floor(i / cols) * 108;
      return at(x, y, `<rect width="94" height="94" rx="12" fill="#e4f2ff" stroke="#8bbceb" stroke-width="2"/>${i < occupied ? `<g data-tr-slot="${i}">${resource({ kind: kinds[i % kinds.length] }, scoped2(h, "item" + i))}</g>` : ""}`, 0.9);
    }).join("")}${state3 === "warning" ? `<rect x="4" y="4" width="${w - 8}" height="${height - 8}" rx="14" fill="none" stroke="#ee8526" stroke-width="5"/>` : ""}</g>`;
  }
  function bridge({ label: label3 = "\u5173\u7CFB\u6807\u7B7E", direction: direction2 = "down", width = 320 } = {}, h) {
    number5(width, 160, 1e3, "width");
    if (!["down", "up"].includes(direction2)) throw Error("Invalid bracket direction");
    const y = direction2 === "down" ? 57 : 6, end = direction2 === "down" ? 79 : 0;
    return `<path data-motion="line" d="M5 ${end}V${y}Q5 ${y - 12} 17 ${y - 12}H${width - 17}Q${width - 5} ${y - 12} ${width - 5} ${y}V${end}" fill="none" stroke="${tokens.blue}" stroke-width="4" stroke-linecap="round"/>${text6(width / 2, 33, label3, 26, width - 38, h, 'text-anchor="middle"')}`;
  }
  function documentCard({ title = "\u6587\u6863\u6807\u9898", labels = ["\u5B57\u6BB5 A", "\u5B57\u6BB5 B", "\u5B57\u6BB5 C"], values = ["\u5185\u5BB9 A", "\u5185\u5BB9 B", "\u5185\u5BB9 C"] } = {}, h) {
    if (labels.length !== 3 || values.length !== 3) throw Error("Document needs three fields");
    return `${panel2(270, 300)}${badge2(18, 15, 234, title, h)}${labels.map((v, i) => at(16, 84 + i * 66, `${badge2(0, 0, 83, v, h, i === 0 ? "blue" : i === 1 ? "orange" : "green")}${text6(99, 29, values[i], 21, 145, h)}`)).join("")}`;
  }
  function windowCard({ title = "\u7A97\u53E3\u6807\u9898", lines: lines3 = ["\u5185\u5BB9 A", "\u5185\u5BB9 B", "\u5185\u5BB9 C"] } = {}, h) {
    if (!Array.isArray(lines3) || lines3.length > 4) throw Error("Window allows 0\u20134 lines");
    return `${panel2(294, 276)}<path d="M16 0H278Q294 0 294 16V43H0V16Q0 0 16 0Z" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="3"/>${[20, 37, 54].map((x, i) => `<circle cx="${x}" cy="21" r="4" fill="${["#ffac40", "#75dfc1", "#c2e7ff"][i]}"/>`).join("")}${text6(280, 29, title, 20, 208, h, 'text-anchor="end" style="fill:white"')}${lines3.map((line3, i) => `${text6(22, 90 + i * 44, line3, 22, 250, h)}<path d="M22 ${101 + i * 44}H267" stroke="#d4e7f6" stroke-width="2"/>`).join("")}`;
  }

  // families/animation-style-transfer-atoms.mjs
  var definitions = [
    ["truck", "\u8FD0\u8F93\u8D27\u8F66", { load: 3, label: "\u5BF9\u8C61\u540D\u79F0" }, truck2, 340, 235],
    ["cargo", "\u8D27\u7BB1", { label: "", tone: "orange" }, cargo, 118, 120],
    ["warehouse", "\u4ED3\u5E93\u4E0E\u7AD9\u70B9", { title: "\u573A\u6240\u540D\u79F0", open: true, stock: 4 }, warehouse, 265, 260],
    ["buffer", "\u5BB9\u91CF\u4E0E\u6682\u5B58\u69FD", { title: "\u533A\u57DF\u6807\u9898", capacity: 6, occupied: 3, kinds: ["cup", "lamp", "bag"], state: "normal" }, buffer, 365, 320],
    ["resource", "\u8D44\u6E90\u7269\u4EF6", { kind: "image", label: "\u7D20\u6750\u540D\u79F0" }, resource, 110, 140],
    ["relation-bridge", "\u5173\u7CFB\u62EC\u7EBF", { label: "\u5173\u7CFB\u6807\u7B7E", direction: "down", width: 420 }, bridge, 430, 100]
  ];
  var components11 = definitions.map(([key, name, base2, draw, w, h]) => ({ id: "ani-atom-" + key, name: "\u52A8\u753B\u98CE \xB7 " + name, category: "\u52A8\u753B\u98CE \xB7 \u57FA\u7840\u7EC4\u4EF6", description: "\u539F\u751F SVG \u72EC\u7ACB\u90E8\u4EF6\uFF0C\u53EF\u66FF\u6362\u5185\u5BB9\u3001\u72B6\u6001\u3001\u4F4D\u7F6E\u4E0E\u7B49\u6BD4\u5C3A\u5BF8\u3002", width: 1280, height: 720, defaults: { ...base2, x: 360, y: 160, objectWidth: 540, objectHeight: 380 }, reference: { level: "designed", source: "references/transfer/sources.json", basis: "\u7528\u6237\u8FC1\u79FB\u9759\u6001\u72B6\u6001\u56FE\uFF1B\u539F\u751F\u51E0\u4F55\u91CD\u5EFA\uFF0C\u975E\u622A\u56FE\u90E8\u4EF6\u3002" }, render(props, helpers2) {
    const p = { ...this.defaults, ...props }, x = number5(p.x, 0, 1270, "x"), y = number5(p.y, 0, 710, "y"), ow = number5(p.objectWidth, 100, 1240, "objectWidth"), oh = number5(p.objectHeight, 80, 690, "objectHeight");
    if (x + ow > 1270 || y + oh > 710) throw Error("\u90E8\u4EF6\u8D85\u51FA\u753B\u5E03");
    const width = key === "buffer" ? p.capacity > 4 ? 352 : 244 : key === "relation-bridge" ? p.width + 10 : w, height = key === "buffer" ? Math.ceil(p.capacity / (p.capacity > 4 ? 3 : 2)) * 108 + 100 : h, scale = Math.min(ow / width, oh / height);
    return `<section class="ani-atom-scene"><svg xmlns="http://www.w3.org/2000/svg" class="ani-transfer-canvas" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${helpers2.esc(name)}">${at(x + (ow - width * scale) / 2, y + (oh - height * scale) / 2, draw(p, helpers2), scale)}</svg></section>`;
  } }));

  // families/animation-style-transfer-scenes.mjs
  var cue = (start, html, end = null, move = null) => `<g data-tr-cue="${start}"${end === null ? "" : ` data-tr-until="${end}"`}${move ? ` data-tr-dx="${move[0]}" data-tr-dy="${move[1]}" data-tr-travel="${move[2]}"` : ""} style="opacity:${end === null ? 1 : 0}">${html}</g>`;
  var link = (atTime, d) => `<path data-tr-draw="${atTime}" d="${d}" fill="none" stroke="${tokens.blue}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
  var folder2 = (x, y, title, files, h) => renderFolderAtom({ x, y, objectWidth: 240, objectHeight: 242, name: title, subtitle: "", open: true, fileLabels: files }, h);
  function board(p, h, key, body) {
    return `<section class="ani-transfer-scene"><svg xmlns="http://www.w3.org/2000/svg" class="ani-transfer-canvas" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${h.esc(p.title)}" data-transfer-kind="${key}">${text6(64, 76, p.title, 42, 1152, h)}<path d="M66 97H186" stroke="#81c9b0" stroke-width="6" stroke-linecap="round"/>${text6(65, 132, p.subtitle, 22, 1140, h)}${body}${text6(640, 678, p.footer, 23, 1150, h, 'text-anchor="middle"')}</svg></section>`;
  }
  var common5 = { title: "\u4E3B\u6807\u9898", subtitle: "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57", footer: "\u7ED3\u8BBA\u4E0E\u8865\u5145\u8BF4\u660E" };
  function list(p, key, length) {
    if (!Array.isArray(p[key]) || p[key].length !== length) throw Error(key + ": requires " + length + " items");
  }
  var make5 = (key, name, description, defaults3, draw) => ({ id: "ani-transfer-" + key, name: "\u52A8\u753B\u98CE \xB7 " + name, category: "\u52A8\u753B\u98CE \xB7 \u8FC1\u79FB\u6A21\u677F", description, width: 1280, height: 720, defaultEffect: "ani-transfer-" + key, defaults: { ...common5, ...defaults3 }, reference: { level: "designed", source: "references/transfer/sources.json", basis: "\u7528\u6237\u8FC1\u79FB\u7D20\u6750\u603B\u89C8\u4E0E M01\u2013M09 \u72B6\u6001\u56FE\uFF1B\u53EF\u7F16\u8F91 SVG\uFF0C\u52A8\u4F5C\u65F6\u5E8F\u4E3A\u672C\u5E93\u65B0\u7F16\u6392\u3002" }, render(props, h) {
    const p = { ...this.defaults, ...props };
    return board(p, h, key, draw(p, h));
  } });
  var components12 = [
    make5("purpose-fork", "\u4E0D\u540C\u76EE\u6807\u4E0E\u53CC\u8DEF\u5F84\u9009\u62E9", "\u540C\u4E00\u5165\u53E3\u5206\u51FA\u4E24\u4E2A\u76EE\u6807\uFF0C\u5404\u81EA\u5C55\u793A\u63D0\u95EE\u3001\u505A\u6CD5\u548C\u4EA7\u7269\uFF1B\u4E0D\u628A\u5176\u4E2D\u4E00\u6761\u9ED8\u8BA4\u5224\u4E3A\u66F4\u4F18\u3002", {
      entryLabel: "\u5171\u540C\u5165\u53E3",
      leftTitle: "\u76EE\u6807 A",
      rightTitle: "\u76EE\u6807 B",
      leftLines: ["\u63D0\u95EE\u65B9\u5F0F A", "\u5904\u7406\u65B9\u5F0F A", "\u4EA7\u7269\u8BF4\u660E A"],
      rightLines: ["\u63D0\u95EE\u65B9\u5F0F B", "\u5904\u7406\u65B9\u5F0F B", "\u4EA7\u7269\u8BF4\u660E B"],
      leftResult: "\u7ED3\u679C A",
      rightResult: "\u7ED3\u679C B"
    }, (p, h) => cue(0.2, badge2(440, 178, 400, p.entryLabel, h)) + link(0.9, "M640 230V255H285V277M640 255H995V277") + cue(1.5, at(145, 282, windowCard({ title: p.leftTitle, lines: p.leftLines }, h))) + cue(1.5, at(845, 282, windowCard({ title: p.rightTitle, lines: p.rightLines }, h))) + cue(4.4, badge2(145, 584, 294, p.leftResult, h, "blue")) + cue(4.4, badge2(845, 584, 294, p.rightResult, h, "green"))),
    make5("context-bridge", "\u7ECF\u9A8C\u4E0E\u65B0\u573A\u666F\u5173\u8054", "\u5148\u51FA\u73B0\u5DF2\u6709\u5BF9\u8C61\uFF0C\u518D\u5F15\u5165\u65B0\u573A\u666F\uFF0C\u5173\u7CFB\u62EC\u7EBF\u6700\u540E\u5EFA\u7ACB\uFF1B\u7528\u4E8E\u5F00\u573A\u4E0E\u7ED3\u5C3E\u56DE\u6536\u3002", {
      leftLabel: "\u5BF9\u8C61 A",
      rightLabel: "\u5BF9\u8C61 B",
      relation: "\u5173\u8054\u540D\u79F0",
      summary: "\u5171\u540C\u70B9\u6216\u53EF\u501F\u7528\u7684\u5173\u7CFB",
      windowLines: ["\u573A\u666F\u5185\u5BB9 A", "\u573A\u666F\u5185\u5BB9 B", "\u573A\u666F\u5185\u5BB9 C"]
    }, (p, h) => cue(0.4, at(145, 245, truck2({ load: 3, label: p.leftLabel }, h))) + cue(1.65, at(815, 220, windowCard({ title: p.rightLabel, lines: p.windowLines }, h))) + link(2.8, "M485 310H550V235H730V310H805") + cue(3.6, text6(640, 210, p.relation, 30, 320, h, 'text-anchor="middle"')) + cue(4.7, badge2(295, 550, 690, p.summary, h, "green"))),
    make5("field-reuse", "\u5B57\u6BB5\u4FDD\u7559\u4E0E\u5185\u5BB9\u66FF\u6362", "\u4FDD\u7559\u4E24\u4E2A\u6587\u6863\u7684\u5171\u540C\u5B57\u6BB5\uFF0C\u9010\u9879\u66FF\u6362\u503C\uFF0C\u5EFA\u7ACB\u5BF9\u5E94\u5173\u7CFB\u3002", {
      sourceTitle: "\u6587\u6863 A",
      targetTitle: "\u6587\u6863 B",
      labels: ["\u5B57\u6BB5 A", "\u5B57\u6BB5 B", "\u5B57\u6BB5 C"],
      sourceValues: ["\u539F\u5185\u5BB9 A", "\u539F\u5185\u5BB9 B", "\u539F\u5185\u5BB9 C"],
      targetValues: ["\u65B0\u5185\u5BB9 A", "\u65B0\u5185\u5BB9 B", "\u65B0\u5185\u5BB9 C"],
      relation: "\u4FDD\u7559\u5171\u540C\u7ED3\u6784"
    }, (p, h) => {
      list(p, "labels", 3);
      list(p, "sourceValues", 3);
      list(p, "targetValues", 3);
      return cue(0.3, at(95, 213, documentCard({ title: p.sourceTitle, labels: p.labels, values: p.sourceValues }, h))) + cue(0.3, at(915, 213, documentCard({ title: p.targetTitle, labels: p.labels, values: ["\u2014", "\u2014", "\u2014"] }, h)), 2.85) + [0, 1, 2].map((i) => cue(2.85 + i * 0.75, at(915, 213, documentCard({ title: p.targetTitle, labels: p.labels, values: p.targetValues.map((value, k) => k <= i ? value : "\u2014") }, h)), i === 2 ? null : 3.6 + i * 0.75)).join("") + p.labels.map((label3, i) => cue(2 + i * 0.75, badge2(490, 250 + i * 78, 300, label3, h, i === 0 ? "blue" : i === 1 ? "orange" : "green")) + link(2.3 + i * 0.75, `M378 ${319 + i * 66}H420V${272 + i * 78}H476M808 ${272 + i * 78}H862V${319 + i * 66}H899`)).join("") + cue(5, badge2(435, 555, 410, p.relation, h, "green"));
    }),
    make5("capacity-limit", "\u5BB9\u91CF\u586B\u6EE1\u4E0E\u6EA2\u51FA\u63D0\u793A", "\u8D44\u6E90\u9010\u6279\u5360\u636E\u5BB9\u91CF\u69FD\uFF0C\u989D\u5916\u8D44\u6E90\u7559\u5728\u5916\u90E8\uFF0C\u9519\u8BEF\u63D0\u793A\u968F\u540E\u51FA\u73B0\u3002", {
      sourceLabel: "\u8F93\u5165\u96C6\u5408",
      bufferLabel: "\u6682\u5B58\u533A\u57DF",
      itemLabels: ["\u8D44\u6E90 A", "\u8D44\u6E90 B", "\u8D44\u6E90 C"],
      warning: "\u5BB9\u91CF\u63D0\u793A",
      explanation: "\u95EE\u9898\u539F\u56E0\u8BF4\u660E",
      kinds: ["cup", "lamp", "bag"]
    }, (p, h) => {
      list(p, "itemLabels", 3);
      list(p, "kinds", 3);
      return folder2(80, 250, p.sourceLabel, p.itemLabels, scoped2(h, "source")) + at(470, 195, buffer({ title: p.bufferLabel, occupied: 0 }, scoped2(h, "empty"))) + cue(1, at(488, 273, resource({ kind: p.kinds[0] }, h), 0.9)) + cue(1.4, at(596, 273, resource({ kind: p.kinds[1] }, h), 0.9)) + cue(1.8, at(704, 273, resource({ kind: p.kinds[2] }, h), 0.9)) + cue(2.3, at(488, 381, resource({ kind: p.kinds[0] }, h), 0.9)) + cue(2.6, at(596, 381, resource({ kind: p.kinds[1] }, h), 0.9)) + cue(2.9, at(704, 381, resource({ kind: p.kinds[2] }, h), 0.9)) + cue(3.2, at(931, 270, resource({ kind: p.kinds[0] }, h), 1.15)) + cue(3.8, badge2(885, 455, 280, p.warning, h, "orange")) + cue(4.5, badge2(395, 555, 490, p.explanation, h, "green")) + link(0.5, "M332 340H443");
    }),
    make5("batch-delivery", "\u88C5\u8F7D\u3001\u8FD0\u8F93\u3001\u5378\u8D27\u4E0E\u8FD4\u7A0B", "\u4ED3\u5E93\u4E0E\u76EE\u7684\u5730\u56FA\u5B9A\uFF0C\u8D27\u8F66\u8FD0\u9001\u4E00\u6279\u3001\u5378\u8D27\u3001\u7A7A\u8F66\u8FD4\u56DE\u518D\u88C5\u4E0B\u4E00\u6279\u3002", {
      sourceTitle: "\u8D77\u70B9\u540D\u79F0",
      targetTitle: "\u7EC8\u70B9\u540D\u79F0",
      vehicleLabel: "\u8FD0\u8F93\u5BF9\u8C61",
      phaseLabels: ["\u88C5\u8F7D\u4E00\u6279", "\u5230\u8FBE\u5378\u8F7D", "\u7A7A\u8F7D\u8FD4\u56DE", "\u51C6\u5907\u4E0B\u4E00\u6279"]
    }, (p, h) => {
      list(p, "phaseLabels", 4);
      return at(54, 178, warehouse({ title: p.sourceTitle, stock: 0 }, h), 0.85) + at(958, 178, warehouse({ title: p.targetTitle, stock: 0 }, h), 0.85) + `<path d="M102 548H1178" stroke="#cae3f7" stroke-width="9" stroke-linecap="round"/>` + cue(0.1, [0, 1, 2, 3].map((i) => at(83 + i % 2 * 59, 278 + Math.floor(i / 2) * 51, cargo({}, h), 0.5)).join(""), 0.65) + cue(0.7, [0, 1].map((i) => at(83 + i * 59, 329, cargo({}, h), 0.5)).join(""), 5.7) + cue(0.7, at(254, 340, truck2({ load: 2, label: p.vehicleLabel }, h), 0.82), 3.1, [410, 0, 1.7]) + cue(3.1, at(664, 340, truck2({ load: 0, label: p.vehicleLabel }, h), 0.82), 5.7, [-410, 0, 2]) + cue(3.25, at(1004, 323, cargo({}, h), 0.56)) + cue(3.45, at(1059, 323, cargo({}, h), 0.56)) + cue(5.8, at(254, 340, truck2({ load: 2, label: p.vehicleLabel }, h), 0.82)) + p.phaseLabels.map((label3, i) => cue([0.2, 2.7, 3.8, 5.8][i], badge2(405, 594, 470, label3, h, i === 2 ? "green" : "blue"), i === 3 ? null : [2.65, 3.75, 5.75][i])).join("");
    }),
    make5("batch-cycle", "\u8BFB\u53D6\u3001\u4FDD\u5B58\u3001\u91CA\u653E\u4E0E\u518D\u8BFB\u53D6", "\u8F93\u5165\u548C\u5DF2\u4FDD\u5B58\u7ED3\u679C\u4E00\u76F4\u4FDD\u7559\uFF1B\u6682\u5B58\u533A\u5904\u7406\u3001\u91CA\u653E\u540E\u518D\u8BFB\u4E0B\u4E00\u6279\u3002", {
      sourceLabel: "\u8F93\u5165\u96C6\u5408",
      outputLabel: "\u8F93\u51FA\u96C6\u5408",
      bufferLabel: "\u6682\u5B58\u533A\u57DF",
      itemLabels: ["\u6587\u4EF6 A", "\u6587\u4EF6 B", "\u6587\u4EF6 C"],
      phaseLabels: ["\u8BFB\u53D6\u7B2C\u4E00\u6279", "\u5904\u7406\u5E76\u4FDD\u5B58", "\u91CA\u653E\u6682\u5B58\u5360\u7528", "\u8BFB\u53D6\u4E0B\u4E00\u6279"],
      savedLabel: "\u5DF2\u4FDD\u5B58\u7684\u7ED3\u679C"
    }, (p, h) => {
      list(p, "itemLabels", 3);
      list(p, "phaseLabels", 4);
      return folder2(62, 250, p.sourceLabel, p.itemLabels, scoped2(h, "input")) + folder2(960, 250, p.outputLabel, [], scoped2(h, "output")) + at(470, 195, buffer({ title: p.bufferLabel, occupied: 0 }, scoped2(h, "buffer"))) + cue(0.8, at(488, 273, resource({ kind: "image" }, h), 0.9), 4.05) + cue(1.1, at(596, 273, resource({ kind: "image" }, h), 0.9), 4.05) + cue(2.45, at(993, 280, resource({ kind: "image" }, h), 0.63)) + cue(2.8, at(1060, 280, resource({ kind: "image" }, h), 0.63)) + link(0.35, "M317 344H441") + link(1.65, "M839 344H931") + cue(3.1, text6(1080, 526, p.savedLabel, 23, 245, h, 'text-anchor="middle"')) + cue(5.05, at(488, 273, resource({ kind: "cup" }, h), 0.9)) + cue(5.4, at(596, 273, resource({ kind: "bag" }, h), 0.9)) + p.phaseLabels.map((label3, i) => cue([0.3, 1.7, 4.1, 5][i], badge2(380, 578, 520, label3, h, i === 2 ? "green" : "blue"), i === 3 ? null : [1.65, 4.05, 4.95][i])).join("");
    }),
    make5("relationship-map", "\u8DE8\u5BF9\u8C61\u63D0\u53D6\u5171\u540C\u6B65\u9AA4", "\u4E24\u7C7B\u5BF9\u8C61\u4FDD\u7559\u5404\u81EA\u8EAB\u4EFD\uFF0C\u4E2D\u95F4\u5BF9\u9F50\u5171\u540C\u5173\u7CFB\uFF1B\u8FDE\u7EBF\u4E0D\u628A\u7269\u4EF6\u642C\u8FDB\u53E6\u4E00\u4E2A\u9886\u57DF\u3002", {
      leftLabel: "\u60C5\u5883 A",
      rightLabel: "\u60C5\u5883 B",
      windowLines: ["\u6B65\u9AA4\u5185\u5BB9 A", "\u6B65\u9AA4\u5185\u5BB9 B", "\u6B65\u9AA4\u5185\u5BB9 C"],
      steps: ["\u5171\u540C\u6B65\u9AA4 A", "\u5171\u540C\u6B65\u9AA4 B", "\u5171\u540C\u6B65\u9AA4 C"],
      conclusion: "\u53EF\u590D\u7528\u5173\u7CFB\u8BF4\u660E"
    }, (p, h) => {
      list(p, "steps", 3);
      return cue(0.4, at(75, 272, truck2({ load: 3, label: p.leftLabel }, h), 0.83)) + cue(1.1, at(908, 245, windowCard({ title: p.rightLabel, lines: p.windowLines }, h), 0.9)) + p.steps.map((label3, i) => link(2 + i * 0.65, `M378 ${312 + i * 70}H450M830 ${312 + i * 70}H893`) + cue(2.5 + i * 0.65, badge2(465, 290 + i * 70, 350, label3, h, i === 2 ? "green" : "blue"))).join("") + cue(4.85, badge2(315, 567, 650, p.conclusion, h, "green"));
    }),
    make5("copy-verify", "\u539F\u4EF6\u4FDD\u7559\u4E0E\u526F\u672C\u6838\u9A8C", "\u4FDD\u7559\u539F\u4EF6\uFF0C\u5C55\u793A\u64CD\u4F5C\u7A97\u53E3\u4E0E\u8BD5\u9A8C\u526F\u672C\uFF0C\u7136\u540E\u6309\u914D\u7F6E\u9010\u9879\u6838\u9A8C\uFF1B\u4E0D\u81EA\u52A8\u628A\u672A\u68C0\u67E5\u9879\u52FE\u4E3A\u901A\u8FC7\u3002", {
      sourceLabel: "\u539F\u4EF6\u96C6\u5408",
      copyLabel: "\u8BD5\u9A8C\u526F\u672C",
      sourceFiles: ["\u539F\u4EF6 A", "\u539F\u4EF6 B"],
      copyFiles: ["\u526F\u672C A", "\u526F\u672C B"],
      windowTitle: "\u5904\u7406\u7A97\u53E3",
      windowLines: ["\u64CD\u4F5C\u6B65\u9AA4 A", "\u64CD\u4F5C\u6B65\u9AA4 B", "\u64CD\u4F5C\u6B65\u9AA4 C"],
      checks: ["\u68C0\u67E5\u9879\u76EE A", "\u68C0\u67E5\u9879\u76EE B", "\u68C0\u67E5\u9879\u76EE C"],
      checkResults: [true, false, true],
      resultLabel: "\u6838\u9A8C\u7ED3\u679C\u8BF4\u660E"
    }, (p, h) => {
      list(p, "checks", 3);
      list(p, "checkResults", 3);
      if (!p.checkResults.every((v) => typeof v === "boolean")) throw Error("checkResults must be boolean");
      return folder2(40, 235, p.sourceLabel, p.sourceFiles, scoped2(h, "source")) + cue(0.5, at(335, 210, windowCard({ title: p.windowTitle, lines: p.windowLines }, h), 0.85)) + cue(1.5, folder2(644, 235, p.copyLabel, p.copyFiles, scoped2(h, "copy"))) + link(1, "M292 334H325") + link(2, "M606 334H634") + at(941, 218, `${panel2(280, 292)}${p.checks.map((label3, i) => `<rect x="19" y="${31 + i * 81}" width="29" height="29" rx="5" fill="white" stroke="${tokens.ink}" stroke-width="2.5"/>${text6(62, 54 + i * 81, label3, 22, 198, h)}${cue(2.8 + i * 0.72, p.checkResults[i] ? `<path d="M24 ${45 + i * 81}L32 ${52 + i * 81}L44 ${35 + i * 81}" fill="none" stroke="${tokens.green}" stroke-width="4"/>` : `<path d="M25 ${38 + i * 81}L42 ${54 + i * 81}M42 ${38 + i * 81}L25 ${54 + i * 81}" fill="none" stroke="#cb6816" stroke-width="3.5"/>`)}`).join("")}`) + cue(5.1, badge2(365, 574, 550, p.resultLabel, h, p.checkResults.every(Boolean) ? "green" : "orange"));
    }),
    make5("guided-steps", "\u6F84\u6E05\u3001\u501F\u7528\u4E0E\u884C\u52A8\u6B65\u9AA4", "\u4ECE\u95EE\u9898\u7A97\u53E3\u8FDB\u5165\u53EF\u501F\u7528\u7684\u65B9\u6CD5\uFF0C\u518D\u843D\u6210\u5177\u4F53\u884C\u52A8\u6E05\u5355\uFF1B\u7528\u4E8E\u5B66\u4E60\u8DEF\u7EBF\u548C\u7ED3\u5C3E\u63D0\u793A\u3002", {
      questionTitle: "\u95EE\u9898\u6807\u9898",
      questionLines: ["\u5F53\u524D\u95EE\u9898\u63CF\u8FF0", "\u5DF2\u6709\u6761\u4EF6\u8BF4\u660E", "\u9700\u8981\u6F84\u6E05\u7684\u90E8\u5206"],
      methodLabel: "\u5DF2\u6709\u65B9\u6CD5",
      adaptation: "\u9700\u8981\u8C03\u6574\u7684\u90E8\u5206",
      actionTitle: "\u884C\u52A8\u6E05\u5355",
      actions: ["\u884C\u52A8\u6B65\u9AA4 A", "\u884C\u52A8\u6B65\u9AA4 B", "\u884C\u52A8\u6B65\u9AA4 C"],
      phaseLabels: ["\u660E\u786E\u95EE\u9898", "\u501F\u7528\u5E76\u8C03\u6574", "\u5F62\u6210\u5177\u4F53\u505A\u6CD5"]
    }, (p, h) => {
      list(p, "actions", 3);
      list(p, "phaseLabels", 3);
      return cue(0.4, at(64, 210, windowCard({ title: p.questionTitle, lines: p.questionLines }, h))) + cue(1.9, at(467, 289, truck2({ label: p.methodLabel, load: 2 }, h), 0.88)) + cue(2.7, badge2(466, 219, 303, p.adaptation, h, "orange")) + cue(3.7, at(920, 210, windowCard({ title: p.actionTitle, lines: p.actions }, h))) + link(1.3, "M377 347H446") + link(3.1, "M803 347H899") + p.phaseLabels.map((label3, i) => cue([1, 2.9, 4.4][i], badge2([70, 470, 920][i], 551, 290, label3, h, i === 2 ? "green" : "blue"))).join("");
    })
  ];

  // families/animation-style.mjs
  var defaults = {
    "title": "\u6587\u6863\u6807\u9898",
    "subtitle": "\u6587\u6863\u8BF4\u660E",
    "rows": [
      {
        "label": "\u5B57\u6BB5A",
        "text": "\u5B57\u6BB5\u5185\u5BB9 A",
        "icon": "people"
      },
      {
        "label": "\u5B57\u6BB5B",
        "text": "\u5B57\u6BB5\u5185\u5BB9 B",
        "icon": "documents"
      },
      {
        "label": "\u5B57\u6BB5C",
        "text": "\u5B57\u6BB5\u5185\u5BB9 C",
        "icon": "calendar"
      },
      {
        "label": "\u5B57\u6BB5D",
        "text": "\u5B57\u6BB5\u5185\u5BB9 D",
        "icon": "link"
      }
    ],
    "footnote": "\u8865\u5145\u8BF4\u660E\u6587\u5B57"
  };
  var charUnits = (s2) => Array.from(String(s2 ?? "")).reduce((sum, c) => sum + (/[\u0000-\u00ff]/.test(c) ? 0.54 : 1), 0);
  function renderNotice(p, h) {
    if (!Array.isArray(p.rows) || p.rows.length !== 4) throw new Error("ani-notice-check requires exactly four rows");
    const e2 = h.esc, t = tokens;
    const paperX = 205, paperY = 30, paperW = 870, paperH = 639;
    const rows3 = p.rows.map((r, i) => {
      const y = 142 + i * 112, c = i % 2 ? t.orange : t.green, fill = i % 2 ? "#fffbf2" : "#f0fbf7";
      const body = String(r.text ?? ""), label3 = String(r.label ?? ""), font5 = Math.max(22, Math.min(29, 475 / Math.max(1, charUnits(body)))), labelColor = i % 2 ? t.ink : "white";
      if (charUnits(body) > 21.5 || charUnits(label3) > 4) throw new Error("ani-notice-check: row copy exceeds readable field width");
      return `<g data-ani-row="${i}" data-text-panel="row-${i}" data-panel-bounds="232 ${y} 816 104"><rect x="232" y="${y}" width="816" height="104" rx="16" fill="${fill}" stroke="#829bc3" stroke-width="1.8"/><path d="M252 ${y}H342Q362 ${y} 362 ${y + 18}V${y + 23}Q362 ${y + 37} 343 ${y + 37}H232V${y + 20}Q232 ${y} 252 ${y}Z" fill="${c}" stroke="${t.ink}" stroke-width="2.2"/><path d="M242 ${y + 7}Q245 ${y + 5} 254 ${y + 5}H339" fill="none" stroke="white" stroke-width="2" opacity=".35"/><text x="296" y="${y + 27}" text-anchor="middle" font-size="25" font-weight="900" fill="${labelColor}">${e2(label3)}</text>${icon(r.icon || "document", 264, y + 28, 76, h)}<path d="M385 ${y + 30}V${y + 84}" stroke="#aac6db" stroke-width="1.8"/><text x="415" y="${y + 65}" font-size="${font5}" fill="${t.ink}">${e2(body)}</text><g transform="translate(1003 ${y + 55})"><circle r="19" fill="white" stroke="#91acc4" stroke-width="2.2"/><g data-ani-check="${i}"><circle r="19" fill="${t.green}" stroke="${t.ink}" stroke-width="2.3"/><path d="M-9 0L-2 8L10-7" fill="none" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M-11-9Q-5-14 2-14" stroke="#7bdbb5" stroke-width="2" fill="none" stroke-linecap="round"/></g></g><rect data-ani-focus="${i}" x="230" y="${y - 2}" width="820" height="108" rx="18" fill="none" stroke="${t.blue}" stroke-width="4"/></g>`;
    }).join("");
    const titleW = Math.min(650, Math.max(450, charUnits(p.title) * 48 + 40));
    const title = banner(640 - titleW / 2, 49, titleW, p.title, t.blue, h);
    const subtitle = String(p.subtitle ?? "");
    const sub = subtitle ? `<text x="${paperX + paperW - 94}" y="131" text-anchor="end" font-size="16" fill="#527094">${e2(subtitle)}</text>` : "";
    const foot = String(p.footnote ?? "");
    if (charUnits(foot) > 47) throw new Error("ani-notice-check: footnote exceeds readable width");
    return svgScene(`${paper(paperX, paperY, paperW, paperH, { fold: 58, depth: 12 }, h)}${title}${sub}${rows3}<g data-ani-result data-text-panel="result" data-panel-bounds="220 612 840 44"><path d="M440 643H840" stroke="#dcf0ff" stroke-width="16" stroke-linecap="round"/><text x="640" y="647" text-anchor="middle" font-size="${Math.min(21, 790 / Math.max(1, charUnits(foot)))}" fill="#496d9e">${e2(foot)}</text></g>`, h);
  }
  var components13 = [{
    id: "ani-notice-check",
    name: "\u52A8\u753B\u98CE \xB7 \u6587\u6863\u9010\u9879\u6838\u5BF9",
    category: "\u52A8\u753B\u98CE",
    description: "\u6839\u636E V8 \u901A\u77E5\u6BCD\u7248\u590D\u523B\u6298\u89D2\u7EB8\u5F20\u3001\u6DF1\u84DD\u63CF\u8FB9\u3001\u94B4\u84DD\u6807\u9898\u724C\u4E0E\u56DB\u884C\u5F69\u8272\u56FE\u6807\uFF0C\u9010\u9879\u6838\u5BF9\u540E\u4FDD\u7559\u68C0\u67E5\u7ED3\u679C\u3002\u5168\u90E8\u56FE\u5F62\u4E0E\u6587\u5B57\u53EF\u7F16\u8F91\u3002",
    width: 1280,
    height: 720,
    defaultEffect: "ani-notice-verify",
    defaults,
    reference: { basis: "\u7528\u6237\u63D0\u4F9B\u7684 V8 \u5206\u955C\u4E0E\u52A8\u753B\u7D20\u6750\u5305\uFF1A\u901A\u77E5-\u72EC\u7ACB\u6BCD\u7248.png\u3001S05.png\u3001M03.png \u4E0A\u884C\u3002SVG \u51E0\u4F55\u91CD\u5EFA\uFF1B\u52A8\u6001\u987A\u5E8F\u53C2\u8003\u9759\u6001\u52A8\u4F5C\u677F\uFF0C\u672A\u5BA3\u79F0\u9010\u5E27\u590D\u523B\u3002", source: "reports/animation-style/reference-review-v8/REVIEW.md", level: "reference-reconstruction" },
    render(props, h) {
      return renderNotice({ ...defaults, ...props }, h);
    }
  }];

  // apple-ui.mjs
  var array2 = (v, n4 = 20) => Array.isArray(v) ? v.slice(0, n4) : [];
  var extra = { airdrop: "M12 2a10 10 0 0 1 8 16M4 18A10 10 0 0 1 12 2M12 6a6 6 0 0 1 4.8 9.6M7.2 15.6A6 6 0 0 1 12 6M12 10a2 2 0 1 1 0 4m0 2-5 6h10Z", bluetooth: "M12 2v20l7-6L6 6m0 12L19 8Z", moon: "M19 16A9 9 0 0 1 8 5a9 9 0 1 0 11 11Z", sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0", airplane: "m2 12 8 2v7l3-3v-4l8 1v-3l-8-4V3l-3-2v7Z", share: "M12 16V2m-4 4 4-4 4 4M7 9H3v12h18V9h-4", columns: "M3 4h18v16H3ZM9 4v16M15 4v16", music: "M10 18V4l10-2v14M10 8l10-2M10 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0m10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0", camera: "M3 7h4l2-3h6l2 3h4v14H3ZM16 14a4 4 0 1 1-8 0 4 4 0 0 1 8 0", flash: "M9 3h6l-1 4 3 3v4H7v-4l3-3ZM9 14h6v8H9Z", rotate: "M20 7V3m0 4h-4M20 7A8 8 0 1 0 21 13M10 10h5v7h-5ZM11 10V8a1.5 1.5 0 0 1 3 0v2", sliders: "M4 7h16M4 17h16M8 4v6M16 14v6" };
  function ai(h, name, size = 18) {
    if (name === "folder") return `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M2 6q0-2 2-2h6l2 2h8q2 0 2 2v12H2Z" fill="#75c4ee" stroke="#4daae0" stroke-width=".6"/><path d="M2 8h20v12H2Z" fill="#9bd9f6"/></svg>`;
    return extra[name] ? `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="${extra[name]}"/></svg>` : h.icon(name, size);
  }
  var lights = () => '<span class="ap-lights"><i></i><i></i><i></i></span>';
  function appIcon(h, name, size = 34) {
    const color5 = { finder: "#53b9f5", safari: "#178ddd", notes: "#e9b924", calendar: "#ee594b", mail: "#2c9bf1", terminal: "#242529", settings: "#8e949c", preview: "#72a3d7", messages: "#49c863", files: "#3b9ded", photos: "#d877ac" }[name] || "#aab4c0";
    let content2;
    if (name === "finder") content2 = '<svg width="100%" height="100%" viewBox="0 0 40 40"><path fill="#aee1ff" d="M20 1h14q5 0 5 5v28q0 5-5 5H20Z"/><path d="M12 13v4m15-4v4M11 25q9 8 18-1M22 2l-3 20h5v16" fill="none" stroke="#244c7c" stroke-width="1.4"/></svg>';
    else if (name === "safari") content2 = '<svg viewBox="0 0 40 40" width="100%" height="100%"><circle cx="20" cy="20" r="16" fill="#ecf8ff"/><circle cx="20" cy="20" r="14" fill="#44acef"/><path d="m27 10-4 13-13 7 6-14Z" fill="#fff"/><path d="m27 10-11 6 7 7Z" fill="#ee6a61"/></svg>';
    else if (name === "calendar") content2 = '<span class="ap-icon-calendar"><small>\u4E5D\u6708</small><b>17</b></span>';
    else content2 = ai(h, { notes: "file", mail: "mail", terminal: "terminal", settings: "settings", preview: "image", messages: "more", files: "folder" }[name] || "grid", Math.round(size * 0.66));
    return `<span class="ap-appicon" style="width:${size}px;height:${size}px;background:${color5}">${content2}</span>`;
  }
  function menuBar(h, app = "\u8BBF\u8FBE") {
    const menus = app === "Safari" ? ["\u6587\u4EF6", "\u7F16\u8F91", "\u663E\u793A", "\u5386\u53F2\u8BB0\u5F55", "\u4E66\u7B7E", "\u7A97\u53E3", "\u5E2E\u52A9"] : app === "\u8BBF\u8FBE" ? ["\u6587\u4EF6", "\u7F16\u8F91", "\u663E\u793A", "\u524D\u5F80", "\u7A97\u53E3", "\u5E2E\u52A9"] : ["\u6587\u4EF6", "\u7F16\u8F91", "\u663E\u793A", "\u7A97\u53E3", "\u5E2E\u52A9"];
    return `<div class="ap-menubar"><svg class="ap-apple" width="13" height="17" viewBox="0 0 20 24" fill="currentColor"><path d="M13 1c.2 2-1.5 4-3.3 4.2C9.4 3.5 11.1 1.3 13 1ZM16.9 17.2c-.8 1.8-2.2 4.4-3.8 4.4-1.3 0-1.9-.8-3.2-.8s-2.1.8-3.2.8C4.9 21.6 1.9 17.1 1.9 12.8c0-3.6 2.2-5.7 4.6-5.7 1.3 0 2.5.9 3.4.9s2.5-.9 3.8-.9c1.6 0 2.9.8 3.6 1.8-3.2 1.8-2.5 6.6.6 7.5Z"/></svg><strong>${h.esc(app)}</strong>${menus.map((x) => `<span>${x}</span>`).join("")}<i></i>${ai(h, "battery", 17)}${ai(h, "wifi", 15)}${ai(h, "search", 14)}${ai(h, "sliders", 15)}<span>9\u670817\u65E5 \u5468\u56DB 09:41</span></div>`;
  }
  function desktop(h, body, app = "\u8BBF\u8FBE", wall = false) {
    return `<section class="ap-desktop ${wall ? "ap-wall" : ""}">${menuBar(h, app)}${body}</section>`;
  }
  function window(h, title, body, opts = {}) {
    return `<div class="ap-window ${opts.cls || ""}" style="${opts.style || ""}"><div class="ap-toolbar">${lights()}${opts.toolbar || `<b>${h.esc(title)}</b><span class="ap-spacer"></span>${ai(h, "search", 17)}`}</div>${body}</div>`;
  }
  function sidebar(h, active = "\u6587\u7A3F", items = ["\u9694\u7A7A\u6295\u9001", "\u6700\u8FD1\u4F7F\u7528", "\u5E94\u7528\u7A0B\u5E8F", "\u4E0B\u8F7D", "\u6587\u7A3F", "\u684C\u9762", "iCloud \u4E91\u76D8"]) {
    return `<aside class="ap-sidebar"><label>\u4E2A\u4EBA\u6536\u85CF</label>${items.map((x, i) => `<div data-motion="item" class="${x === active ? "is-selected" : ""}">${ai(h, ["airdrop", "clock", "grid", "download", "file", "monitor", "folder"][i % 7], 16)}<span>${h.esc(x)}</span></div>`).join("")}<label>\u6807\u7B7E</label>${["\u5DE5\u4F5C", "\u4E2A\u4EBA", "\u5F85\u5904\u7406"].map((x, i) => `<div><i class="ap-tag-dot" style="background:${["#ec655c", "#efb535", "#66bda5"][i]}"></i>${x}</div>`).join("")}</aside>`;
  }
  var table = (h, headers, rows3, selected = 1) => `<div class="ap-table"><div class="ap-tr ap-th">${headers.map((x) => `<span>${h.esc(x)}</span>`).join("")}</div>${array2(rows3, 14).map((r, i) => `<div class="ap-tr ${i === selected ? "is-selected" : ""}" data-motion="item">${r.map((x, j) => `<span>${j === 0 ? ai(h, String(x).includes(".") ? "file" : "folder", 16) : ""}${h.esc(x)}</span>`).join("")}</div>`).join("")}</div>`;
  function component(id, name, description, defaults3, render, mobile = false) {
    return { id, name, description, category: mobile ? "Apple \xB7 iPhone / iPad" : "Apple \xB7 macOS", width: 1280, height: 800, defaults: defaults3, reference: { level: "documented", basis: mobile ? "iOS 18 / iPadOS 18 \u5B98\u65B9\u624B\u518C\u7684\u7ED3\u6784\u53C2\u7167\uFF1BWindows \u5B57\u4F53\u56DE\u9000\uFF0C\u672A\u5BA3\u79F0\u771F\u673A\u9010\u50CF\u7D20\u4E00\u81F4\u3002" : "macOS Sequoia 15 \u5B98\u65B9\u624B\u518C\u7684\u7ED3\u6784\u53C2\u7167\uFF1BWindows \u5B57\u4F53\u56DE\u9000\uFF0C\u672A\u5BA3\u79F0\u771F\u673A\u9010\u50CF\u7D20\u4E00\u81F4\u3002", source: mobile ? "https://support.apple.com/zh-cn/guide/iphone/iph59095ec58/18.0/ios/18.0" : "https://support.apple.com/zh-cn/guide/mac-help/mchl83c9e8b8/15.0/mac/15.0" }, render };
  }
  var commonCSS = `
.ap-desktop{width:1280px;height:800px;position:relative;overflow:hidden;background:#f7f8fa;font-family:Arial,ComponentHan,sans-serif;font-size:13px;color:#26272a}.ap-wall{background:radial-gradient(ellipse at 14% 2%,#eec8ae 0,transparent 48%),radial-gradient(ellipse at 78% 65%,#88b0d6,transparent 65%),linear-gradient(140deg,#b9bdce,#bbcfdc 60%,#9cb9ba)}.ap-menubar{height:27px;background:#ffffffb8;display:flex;align-items:center;gap:22px;padding:0 18px;color:#222;font-size:12px}.ap-menubar>i{flex:1}.ap-menubar strong{font-size:13px}.ap-apple{font-size:14px;line-height:1}.ap-window{position:absolute;left:90px;top:82px;width:1100px;height:632px;background:white;border:1px solid #bfc1c6;border-radius:11px;box-shadow:0 23px 55px #1e2f4424,0 3px 10px #1c304914;overflow:hidden}.ap-toolbar{height:53px;display:flex;align-items:center;gap:19px;padding:0 19px;background:linear-gradient(#fafafa,#f2f2f2);border-bottom:1px solid #dedfe2}.ap-toolbar>b{font-size:14px}.ap-lights{display:flex;gap:8px;align-items:center;margin-right:15px;flex-shrink:0}.ap-lights i{width:12px;height:12px;border:1px solid #0000000c;border-radius:50%;background:#ff5f57}.ap-lights i:nth-child(2){background:#febc2e}.ap-lights i:nth-child(3){background:#28c840}.ap-spacer{flex:1}.ap-sidebar{width:190px;flex-shrink:0;background:#f0f0f2;min-height:100%;padding:17px 11px;border-right:1px solid #dfdfe2}.ap-sidebar label{font-size:11px;font-weight:bold;color:#7e7e86;padding:8px 8px;display:block;margin-top:7px}.ap-sidebar>div{height:31px;border-radius:6px;display:flex;align-items:center;gap:9px;padding:0 10px;font-size:13px}.ap-sidebar svg{color:#1686de}.ap-sidebar .is-selected{background:#dcdce1}.ap-tag-dot{width:9px;height:9px;border-radius:50%;margin:0 3px}.ap-split{display:flex;height:calc(100% - 53px)}.ap-main{flex:1;min-width:0;position:relative;background:#fff}.ap-table{font-size:12px}.ap-tr{display:grid;grid-template-columns:2.5fr 1.6fr 1.2fr .9fr;min-height:29px;padding:0 15px;align-items:center}.ap-tr:nth-child(2n+1){background:#f4f5f7}.ap-tr>span{display:flex;align-items:center;gap:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 8px}.ap-tr>span>svg{color:#42a5db}.ap-th{background:#fff!important;border-bottom:1px solid #dedfe2;color:#72767d;height:30px;font-size:11px}.ap-tr.is-selected{background:#176dd5!important;color:#fff}.ap-tr.is-selected svg{color:#fff}.ap-bottom{position:absolute;bottom:0;left:0;right:0;height:27px;border-top:1px solid #e0e2e6;text-align:center;color:#767b83;font-size:11px;padding-top:6px;background:#fafafa}.ap-search{display:flex;align-items:center;gap:6px;background:#e8e8ec;color:#7f8189;border-radius:6px;height:27px;padding:0 10px;font-size:12px}.ap-appicon{border-radius:8px;box-shadow:inset 0 0 0 1px #00000009,0 1px 2px #00000015;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;color:white;vertical-align:middle}.ap-icon-calendar{background:#fff;color:#222;display:flex;align-items:center;flex-direction:column;width:100%;height:100%}.ap-icon-calendar small{font-size:8px;background:#ed6556;color:#fff;width:100%;text-align:center;padding:2px}.ap-icon-calendar b{font-size:20px}.ap-button{display:inline-flex;align-items:center;justify-content:center;padding:4px 17px;border:1px solid #ceced2;border-radius:5px;background:linear-gradient(#fff,#f0f0f1);box-shadow:0 1px 2px #0000000a;font-size:12px;min-height:25px}.ap-button.primary{background:linear-gradient(#4998f7,#1671df);border-color:#367dcc;color:#fff}.ap-tiny{font-size:11px;color:#7f8490}.ap-native-row{display:flex;align-items:center;gap:11px;min-height:40px;padding:8px 12px;border-bottom:1px solid #e5e5e8}.ap-native-row>b{font-size:13px}.ap-native-row>span:last-child{margin-left:auto;color:#888}.ap-switch{display:inline-block;width:32px;height:19px;background:#34c759;border-radius:20px;padding:2px;flex-shrink:0}.ap-switch:after{content:'';display:block;width:15px;height:15px;background:#fff;border-radius:50%;margin-left:13px;box-shadow:0 1px 2px #0002}.ap-switch.off{background:#d3d3d7}.ap-switch.off:after{margin-left:0}.ap-scroll{overflow:hidden}
`;

  // families/apple-macos-extra.mjs
  var components14 = [
    component("mac-calendar", "macOS \xB7 \u65E5\u5386", "\u6708\u89C6\u56FE\u3001\u65E5\u5386\u5206\u7EC4\u548C\u4E8B\u4EF6\u5361\u7247\uFF0C\u4E8B\u4EF6\u4F4D\u7F6E\u7531\u65E5\u671F\u914D\u7F6E\u3002", {
      "title": "2026\u5E749\u6708",
      "firstWeekday": 2,
      "days": 30,
      "today": 17,
      "events": [
        {
          "day": 8,
          "title": "\u65E5\u7A0B A",
          "color": "#3484e8"
        },
        {
          "day": 17,
          "title": "\u65E5\u7A0B B",
          "color": "#ed6556"
        },
        {
          "day": 21,
          "title": "\u65E5\u7A0B C",
          "color": "#6caf9e"
        },
        {
          "day": 25,
          "title": "\u65E5\u7A0B D",
          "color": "#956dcc"
        }
      ]
    }, (p, h) => desktop(h, window(h, "\u65E5\u5386", `<div class="ap-split"><aside class="ap-calendar-side"><div class="ap-search">${ai(h, "search", 13)} \u641C\u7D22</div><label>iCloud</label>${["\u5DE5\u4F5C", "\u4E2A\u4EBA", "\u5BB6\u5EAD", "\u751F\u65E5"].map((x, i) => `<p><i style="background:${["#3484e8", "#ed6556", "#6caf9e", "#956dcc"][i]}">\u2713</i>${x}</p>`).join("")}<label>\u5176\u4ED6</label><p><i style="background:#999">\u2713</i>\u4E2D\u56FD\u8282\u5047\u65E5</p></aside><main class="ap-calendar-main"><h1>${h.esc(p.title)}</h1><div class="ap-weeknames">${["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D"].map((x) => `<span>${x}</span>`).join("")}</div><div class="ap-month-grid">${Array.from({ length: 35 }, (_, i) => {
      const d = i - Number(p.firstWeekday) + 1;
      return `<div class="${d < 1 || d > p.days ? "empty" : ""}" data-motion="item"><b class="${d === p.today ? "today" : ""}">${d >= 1 && d <= p.days ? d : ""}</b>${array2(p.events).filter((x) => Number(x.day) === d).map((x) => `<p style="--event:${/^#[0-9a-f]{6}$/i.test(x.color) ? x.color : "#3484e8"}">${h.esc(x.title)}</p>`).join("")}</div>`;
    }).join("")}</div></main></div>`, { toolbar: `${ai(h, "panel")}${ai(h, "plus")}<span class="ap-spacer"></span><div class="ap-segments">\u65E5\u3000\u3000\u5468\u3000\u3000<b>\u6708</b>\u3000\u3000\u5E74</div><span class="ap-spacer"></span>${ai(h, "chevron-left")}<span class="ap-button">\u4ECA\u5929</span>${ai(h, "chevron-right")}` }), "\u65E5\u5386")),
    component("mac-mail", "macOS \xB7 \u90AE\u4EF6", "\u90AE\u7BB1\u3001\u90AE\u4EF6\u5217\u8868\u548C\u6B63\u6587\u4E09\u680F\uFF0C\u53EF\u914D\u7F6E\u53D1\u4EF6\u4EBA\u3001\u4E3B\u9898\u4E0E\u6B63\u6587\u3002", {
      "subject": "\u90AE\u4EF6\u4E3B\u9898",
      "sender": "\u53D1\u4EF6\u4EBA",
      "email": "sender@example.com",
      "to": "\u6536\u4EF6\u4EBA",
      "date": "2026\u5E749\u670817\u65E5 09:20",
      "messages": [
        [
          "\u53D1\u4EF6\u4EBA A",
          "\u90AE\u4EF6\u4E3B\u9898 A",
          "\u90AE\u4EF6\u6458\u8981 A",
          "09:20"
        ],
        [
          "\u53D1\u4EF6\u4EBA B",
          "\u90AE\u4EF6\u4E3B\u9898 B",
          "\u90AE\u4EF6\u6458\u8981 B",
          "\u6628\u5929"
        ],
        [
          "\u53D1\u4EF6\u4EBA C",
          "\u90AE\u4EF6\u4E3B\u9898 C",
          "\u90AE\u4EF6\u6458\u8981 C",
          "\u661F\u671F\u4E8C"
        ]
      ],
      "paragraphs": [
        "\u6536\u4EF6\u4EBA\uFF0C\u4F60\u597D\uFF1A",
        "\u6B63\u6587\u7B2C\u4E00\u6BB5\uFF0C\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u5185\u5BB9\u3002",
        "\u6B63\u6587\u7B2C\u4E8C\u6BB5\uFF0C\u652F\u6301\u7EE7\u7EED\u8865\u5145\u8BF4\u660E\u3002",
        "1. \u8981\u70B9\u5185\u5BB9 A",
        "2. \u8981\u70B9\u5185\u5BB9 B",
        "3. \u8981\u70B9\u5185\u5BB9 C"
      ],
      "senderInitial": "\u53D1"
    }, (p, h) => desktop(h, window(h, "\u90AE\u4EF6", `<div class="ap-split">${sidebar(h, "\u6536\u4EF6\u7BB1", ["\u6240\u6709\u6536\u4EF6\u7BB1", "\u6536\u4EF6\u7BB1", "\u5DF2\u53D1\u9001", "\u8349\u7A3F", "\u5F52\u6863", "\u5E9F\u7EB8\u7BD3"])}<div class="ap-mail-list">${array2(p.messages, 8).map((m, i) => `<article class="${i === 0 ? "active" : ""}" data-motion="item"><small>${h.esc(m[3])}</small><b>${h.esc(m[0])}</b><strong>${h.esc(m[1])}</strong><p>${h.esc(m[2])}</p></article>`).join("")}</div><article class="ap-mail-message"><header><span class="ap-avatar">${h.esc(p.senderInitial)}</span><div><h1>${h.esc(p.subject)}</h1><p><b>${h.esc(p.sender)}</b> &lt;${h.esc(p.email)}&gt;</p><small>\u6536\u4EF6\u4EBA\uFF1A${h.esc(p.to)}</small></div><time>${h.esc(p.date)}</time></header>${array2(p.paragraphs).map((x) => `<p>${h.esc(x)}</p>`).join("")}</article></div>`, { toolbar: `${ai(h, "panel")}${ai(h, "mail")}${ai(h, "edit")}<span class="ap-spacer"></span>${ai(h, "trash")}${ai(h, "folder")}${ai(h, "undo")}${ai(h, "share")}<span class="ap-search">${ai(h, "search", 14)} \u641C\u7D22</span>` }), "\u90AE\u4EF6")),
    component("mac-preview", "macOS \xB7 \u9884\u89C8 PDF", "\u539F\u751F\u7F29\u7565\u56FE\u4FA7\u680F\u3001\u9875\u6570\u3001\u7F29\u653E\u5DE5\u5177\u4E0E\u53EF\u66FF\u6362\u6587\u6863\u9875\u3002", {
      "filename": "\u793A\u4F8B\u6587\u6863.pdf",
      "page": 2,
      "pages": 6,
      "title": "\u6587\u6863\u6807\u9898",
      "subtitle": "\u7AE0\u8282 / 02",
      "paragraphs": [
        "\u6B63\u6587\u7B2C\u4E00\u6BB5\uFF0C\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u5185\u5BB9\u3002",
        "\u6B63\u6587\u7B2C\u4E8C\u6BB5\uFF0C\u652F\u6301\u7EE7\u7EED\u8865\u5145\u8BF4\u660E\u3002"
      ],
      "steps": [
        "\u6B65\u9AA4 A",
        "\u6B65\u9AA4 B",
        "\u6B65\u9AA4 C"
      ],
      "thumbnailTitles": [
        "\u9875\u9762 A",
        "\u9875\u9762 B",
        "\u9875\u9762 C",
        "\u9875\u9762 D",
        "\u9875\u9762 E",
        "\u9875\u9762 F"
      ],
      "documentFooter": "\u9875\u811A\u8BF4\u660E"
    }, (p, h) => desktop(h, window(h, p.filename, `<div class="ap-split"><aside class="ap-pdf-thumbs">${Array.from({ length: Math.min(7, Number(p.pages)) }, (_, i) => `<div class="${i + 1 === p.page ? "active" : ""}" data-motion="item"><article><b>${h.esc(p.thumbnailTitles?.[i] || "\u9875\u9762 " + (i + 1))}</b><hr><p></p><p></p><p></p><i></i></article><small>${i + 1}</small></div>`).join("")}</aside><main class="ap-pdf-canvas"><article class="ap-paper" data-motion="focus"><small>${h.esc(p.subtitle)}</small><h1>${h.esc(p.title)}</h1>${array2(p.paragraphs).map((x) => `<p>${h.esc(x)}</p>`).join("")}<div class="ap-paper-steps">${array2(p.steps, 4).map((x, i) => `<section data-motion="item"><b>0${i + 1}</b><h3>${h.esc(x)}</h3></section>`).join("")}</div><footer>${h.esc(p.documentFooter)}<span>${h.esc(p.page)}</span></footer></article></main></div>`, { toolbar: `${ai(h, "panel")}<b>${h.esc(p.filename)}</b><span class="ap-tiny">\u7B2C ${h.esc(p.page)} \u9875\uFF0C\u5171 ${h.esc(p.pages)} \u9875</span><span class="ap-spacer"></span>${ai(h, "minus")}${ai(h, "plus")}${ai(h, "share")}${ai(h, "edit")}${ai(h, "search")}` }), "\u9884\u89C8")),
    component("mac-activity-monitor", "macOS \xB7 \u6D3B\u52A8\u76D1\u89C6\u5668", "\u8FDB\u7A0B\u5217\u8868\u548C\u5E95\u90E8 CPU \u56FE\u8868\uFF0C\u6570\u636E\u53EF\u66FF\u6362\uFF0C\u4E0D\u7ED1\u5B9A\u771F\u5B9E\u8BBE\u5907\u8BFB\u6570\u3002", {
      "tab": "CPU",
      "system": 5.6,
      "user": 12.8,
      "idle": 81.6,
      "rows": [
        [
          "Process-A",
          "8.3",
          "00:22.10",
          "16",
          "7",
          "28210"
        ],
        [
          "Process-B",
          "6.1",
          "02:14.82",
          "19",
          "4",
          "391"
        ],
        [
          "Process-C",
          "4.8",
          "01:02.37",
          "28",
          "8",
          "12110"
        ],
        [
          "Process-D",
          "3.5",
          "00:45.12",
          "22",
          "6",
          "30418"
        ],
        [
          "Process-E",
          "0.3",
          "00:09.16",
          "5",
          "2",
          "422"
        ],
        [
          "Process-F",
          "0.2",
          "05:02.42",
          "181",
          "0",
          "0"
        ]
      ]
    }, (p, h) => desktop(h, window(h, "\u6D3B\u52A8\u76D1\u89C6\u5668", `<div class="ap-activity"><div class="ap-process-table"><div class="ap-process-row head">${["\u8FDB\u7A0B\u540D\u79F0", "% CPU", "CPU \u65F6\u95F4", "\u7EBF\u7A0B", "\u5524\u9192\u6B21\u6570", "PID"].map((x) => `<span>${x}</span>`).join("")}</div>${array2(p.rows, 15).map((r, i) => `<div class="ap-process-row ${!i ? "active" : ""}" data-motion="item">${r.map((x) => `<span>${h.esc(x)}</span>`).join("")}</div>`).join("")}</div><footer><div><p><i class="red"></i>\u7CFB\u7EDF\uFF1A<b>${h.esc(p.system)}%</b></p><p><i class="blue"></i>\u7528\u6237\uFF1A<b>${h.esc(p.user)}%</b></p><p>\u95F2\u7F6E\uFF1A<b>${h.esc(p.idle)}%</b></p></div><section><small>CPU \u8D1F\u8F7D</small><svg viewBox="0 0 230 80"><path d="M0 73 12 69 24 70 36 40 48 66 60 62 72 67 84 34 96 65 108 64 120 46 132 60 144 28 156 63 168 52 180 56 192 38 204 61 216 65 230 53V80H0Z" fill="#6cafeb"/><path data-motion="line" d="M0 74 12 72 24 73 36 66 48 74 60 70 72 74 84 62 96 73 108 71 120 68 132 73 144 59 156 73 168 69 180 73 192 64 204 72 216 73 230 69" fill="none" stroke="#de6f75" stroke-width="2"/></svg></section><div><p>\u7EBF\u7A0B\uFF1A<b>1,402</b></p><p>\u8FDB\u7A0B\uFF1A<b>${array2(p.rows).length}</b></p><small>\u793A\u4F8B\u6570\u636E</small></div></footer></div>`, { toolbar: `${ai(h, "x")}${ai(h, "info")}<span class="ap-spacer"></span><div class="ap-segments"><b>${h.esc(p.tab)}</b>\u3000\u5185\u5B58\u3000\u80FD\u8017\u3000\u78C1\u76D8\u3000\u7F51\u7EDC</div><span class="ap-spacer"></span><span class="ap-search">${ai(h, "search", 14)} \u641C\u7D22</span>` }), "\u6D3B\u52A8\u76D1\u89C6\u5668")),
    component("mac-file-dialog", "macOS \xB7 \u4FDD\u5B58\u5BF9\u8BDD\u6846", "\u4FDD\u5B58\u540D\u79F0\u3001\u4F4D\u7F6E\u3001\u6587\u4EF6\u5217\u8868\u548C\u786E\u8BA4\u64CD\u4F5C\uFF0C\u53EF\u7528\u4E8E\u5BFC\u51FA\u6B65\u9AA4\u6F14\u793A\u3002", {
      "title": "\u4FDD\u5B58\u6587\u6863",
      "filename": "\u793A\u4F8B\u6587\u6863.pdf",
      "folder": "\u6587\u7A3F",
      "format": "PDF",
      "files": [
        [
          "\u793A\u4F8B\u6587\u6863.md",
          "\u4ECA\u5929 09:12",
          "Markdown \u6587\u7A3F",
          "16 KB"
        ],
        [
          "\u793A\u4F8B\u6570\u636E.csv",
          "\u6628\u5929 18:20",
          "CSV \u6587\u7A3F",
          "8 KB"
        ],
        [
          "\u793A\u4F8B\u56FE\u7247.png",
          "\u6628\u5929 16:40",
          "PNG \u56FE\u50CF",
          "2.4 MB"
        ],
        [
          "\u793A\u4F8B\u6587\u6863.pdf",
          "\u6628\u5929 14:08",
          "PDF \u6587\u7A3F",
          "1.2 MB"
        ]
      ],
      "button": "\u5B58\u50A8",
      "documentTitle": "\u6587\u6863\u6807\u9898",
      "documentBody": "\u6B63\u6587\u5185\u5BB9\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u6587\u5B57\u3002"
    }, (p, h) => desktop(h, `<div class="ap-dialog-backdrop">${window(h, p.documentTitle, `<div class="ap-document-ghost"><h1>${h.esc(p.documentTitle)}</h1><p>${h.esc(p.documentBody)}</p></div>`)}</div><div class="ap-save-sheet"><header>${h.esc(p.title)}</header><div class="ap-save-fields"><label>\u5B58\u50A8\u4E3A\uFF1A<span data-motion="focus">${h.esc(p.filename)}</span></label><label>\u6807\u7B7E\uFF1A<span class="empty">\u6DFB\u52A0\u6807\u7B7E\u2026</span></label><label>\u4F4D\u7F6E\uFF1A<b>${ai(h, "folder", 15)} ${h.esc(p.folder)}\u3000\u2304</b></label></div><div class="ap-save-files">${sidebar(h, p.folder)}<div class="ap-main">${table(h, ["\u540D\u79F0", "\u4FEE\u6539\u65E5\u671F", "\u79CD\u7C7B", "\u5927\u5C0F"], p.files, -1)}</div></div><footer><label>\u683C\u5F0F\uFF1A<span class="ap-button">${h.esc(p.format)}\u3000\u2304</span></label><span class="ap-spacer"></span><button class="ap-button">\u53D6\u6D88</button><button class="ap-button primary" data-motion="focus">${h.esc(p.button)}</button></footer></div>`, "\u9884\u89C8")),
    component("mac-alert", "macOS \xB7 \u6743\u9650\u63D0\u793A", "\u5C45\u4E2D\u7684\u7CFB\u7EDF\u8B66\u544A\u4E0E\u7EB5\u5411\u64CD\u4F5C\u6309\u94AE\uFF0C\u6807\u9898\u3001\u8BF4\u660E\u548C\u9009\u9879\u72EC\u7ACB\u914D\u7F6E\u3002", {
      "app": "\u793A\u4F8B\u5E94\u7528",
      "title": "\u786E\u8BA4\u64CD\u4F5C",
      "message": "\u63D0\u793A\u5185\u5BB9\u3002\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u8BF4\u660E\u7684\u64CD\u4F5C\u4E0E\u5F71\u54CD\u3002",
      "primary": "\u786E\u8BA4",
      "secondary": "\u53D6\u6D88"
    }, (p, h) => desktop(h, `<div class="ap-alert"><div class="ap-alert-icon">${appIcon(h, "settings", 60)}</div><h1>${h.esc(p.title)}</h1><p>${h.esc(p.message)}</p><button data-motion="focus" class="ap-alert-primary">${h.esc(p.primary)}</button><button>${h.esc(p.secondary)}</button></div>`, p.app, true)),
    component("mac-context-menu", "macOS \xB7 \u53F3\u952E\u83DC\u5355", "macOS \u7A84\u884C\u8DDD\u83DC\u5355\u3001\u5206\u9694\u7EBF\u3001\u5FEB\u6377\u952E\u4E0E\u7EA7\u8054\u5B50\u83DC\u5355\u3002", {
      "filename": "\u793A\u4F8B\u6587\u6863.md",
      "items": [
        [
          "\u6253\u5F00",
          "\u2318O"
        ],
        [
          "\u6253\u5F00\u65B9\u5F0F",
          "\u203A"
        ],
        [
          "\u79FB\u5230\u5E9F\u7EB8\u7BD3",
          "\u2318\u232B"
        ],
        [
          "---",
          ""
        ],
        [
          "\u663E\u793A\u7B80\u4ECB",
          "\u2318I"
        ],
        [
          "\u91CD\u65B0\u547D\u540D",
          ""
        ],
        [
          "\u590D\u5236",
          "\u2318D"
        ],
        [
          "\u5236\u4F5C\u66FF\u8EAB",
          ""
        ],
        [
          "\u5FEB\u901F\u67E5\u770B",
          "\u7A7A\u683C"
        ],
        [
          "---",
          ""
        ],
        [
          "\u5171\u4EAB",
          "\u203A"
        ],
        [
          "\u62F7\u8D1D\u201C\u793A\u4F8B\u6587\u6863.md\u201D",
          "\u2318C"
        ]
      ],
      "selected": 1,
      "submenu": [
        "\u6587\u672C\u7F16\u8F91\uFF08\u9ED8\u8BA4\uFF09",
        "Visual Studio Code",
        "\u5907\u5FD8\u5F55",
        "\u5176\u4ED6\u2026"
      ],
      "files": [
        [
          "\u793A\u4F8B\u6587\u6863.md",
          "\u4ECA\u5929 09:12",
          "Markdown \u6587\u7A3F",
          "16 KB"
        ],
        [
          "\u793A\u4F8B\u6570\u636E.csv",
          "\u6628\u5929 18:20",
          "CSV \u6587\u7A3F",
          "8 KB"
        ],
        [
          "\u793A\u4F8B\u56FE\u7247.png",
          "\u6628\u5929 16:40",
          "PNG \u56FE\u50CF",
          "2.4 MB"
        ],
        [
          "\u793A\u4F8B\u6587\u6863.pdf",
          "\u6628\u5929 14:08",
          "PDF \u6587\u7A3F",
          "1.2 MB"
        ]
      ]
    }, (p, h) => desktop(h, `${window(h, "\u6587\u7A3F", `<div class="ap-split">${sidebar(h)}<div class="ap-main">${table(h, ["\u540D\u79F0", "\u4FEE\u6539\u65E5\u671F", "\u79CD\u7C7B", "\u5927\u5C0F"], p.files.map((r, i) => i ? r : [p.filename, ...r.slice(1)]), 0)}</div></div>`)}<div class="ap-context"><div class="ap-context-main">${array2(p.items, 18).map((x, i) => x[0] === "---" ? "<hr>" : `<div class="${i === p.selected ? "active" : ""}" data-motion="item"><span>${h.esc(x[0])}</span><small>${h.esc(x[1])}</small></div>`).join("")}</div><div class="ap-context-sub">${array2(p.submenu, 7).map((x) => `<div>${h.esc(x)}</div>`).join("")}</div></div>`)),
    component("mac-dock", "macOS \xB7 \u7A0B\u5E8F\u575E", "\u684C\u9762\u5E95\u90E8\u73BB\u7483\u5E95\u677F\u3001\u5E94\u7528\u56FE\u6807\u3001\u8FD0\u884C\u6307\u793A\u548C\u60AC\u505C\u63D0\u793A\u3002", {
      "apps": [
        [
          "finder",
          "\u8BBF\u8FBE"
        ],
        [
          "safari",
          "Safari"
        ],
        [
          "mail",
          "\u90AE\u4EF6"
        ],
        [
          "calendar",
          "\u65E5\u5386"
        ],
        [
          "notes",
          "\u5907\u5FD8\u5F55"
        ],
        [
          "messages",
          "\u4FE1\u606F"
        ],
        [
          "settings",
          "\u7CFB\u7EDF\u8BBE\u7F6E"
        ],
        [
          "terminal",
          "\u7EC8\u7AEF"
        ]
      ],
      "selected": 1,
      "desktopFiles": [
        "\u793A\u4F8B\u6587\u4EF6\u5939",
        "\u793A\u4F8B\u8D44\u6599",
        "\u793A\u4F8B\u6587\u6863.pdf"
      ]
    }, (p, h) => desktop(h, `<div class="ap-desktop-files">${array2(p.desktopFiles, 5).map((x, i) => `<div data-motion="item">${ai(h, i === 2 ? "file" : "folder", 56)}<p>${h.esc(x)}</p></div>`).join("")}</div><div class="ap-dock">${array2(p.apps, 12).map((x, i) => `<div class="ap-dock-item ${i === p.selected ? "active" : ""}" data-motion="item" data-app="${h.esc(x[0])}">${i === p.selected ? `<span class="ap-dock-tip">${h.esc(x[1])}</span>` : ""}${appIcon(h, x[0], 58)}<i></i></div>`).join("")}<b class="ap-dock-separator"></b><div class="ap-dock-item">${appIcon(h, "files", 58)}</div><div class="ap-dock-trash">${ai(h, "trash", 40)}</div></div>`, "\u8BBF\u8FBE", true))
  ];

  // families/apple-macos.mjs
  var noteDefault = {
    "title": "\u7B14\u8BB0\u6807\u9898",
    "folder": "\u793A\u4F8B\u6587\u4EF6\u5939",
    "date": "2026\u5E749\u670817\u65E5 09:41",
    "notes": [
      "\u7B14\u8BB0\u6807\u9898 A",
      "\u7B14\u8BB0\u6807\u9898 B",
      "\u7B14\u8BB0\u6807\u9898 C",
      "\u7B14\u8BB0\u6807\u9898 D"
    ],
    "paragraphs": [
      "\u6B63\u6587\u7B2C\u4E00\u6BB5\uFF0C\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u5185\u5BB9\u3002",
      "\u6B63\u6587\u7B2C\u4E8C\u6BB5\uFF0C\u652F\u6301\u7EE7\u7EED\u8865\u5145\u8BF4\u660E\u3002"
    ],
    "checklist": [
      "\u5F85\u529E\u4E8B\u9879 A",
      "\u5F85\u529E\u4E8B\u9879 B",
      "\u5F85\u529E\u4E8B\u9879 C",
      "\u5F85\u529E\u4E8B\u9879 D"
    ],
    "noteSummaries": [
      "\u7B14\u8BB0\u6458\u8981 A",
      "\u7B14\u8BB0\u6458\u8981 B",
      "\u7B14\u8BB0\u6458\u8981 C",
      "\u7B14\u8BB0\u6458\u8981 D"
    ],
    "checklistTitle": "\u68C0\u67E5\u9879"
  };
  var notesBody = (p, h) => `<aside class="ap-note-list">${array2(p.notes).map((x, i) => `<article class="${i === 0 ? "active" : ""}" data-motion="item"><b>${h.esc(x)}</b><p>09:41 <span>${h.esc(p.noteSummaries?.[i] || "\u7B14\u8BB0\u6458\u8981")}</span></p><small>\u25B1 ${h.esc(p.folder)}</small></article>`).join("")}</aside><div class="ap-note-page"><small>${h.esc(p.date)}</small><h1>${h.esc(p.title)}</h1>${array2(p.paragraphs).map((x) => `<p>${h.esc(x)}</p>`).join("")}<h2>${h.esc(p.checklistTitle)}</h2>${array2(p.checklist).map((x, i) => `<div class="ap-note-check" data-motion="item"><i class="${i < 2 ? "done" : ""}">${i < 2 ? "\u2713" : ""}</i>${h.esc(x)}</div>`).join("")}</div>`;
  var components15 = [
    component("mac-finder", "macOS \xB7 \u8BBF\u8FBE", "\u539F\u751F\u4FA7\u680F\u3001\u5DE5\u5177\u680F\u4E0E\u6587\u4EF6\u5217\u8868\uFF0C\u53EF\u66FF\u6362\u76EE\u5F55\u3001\u6587\u4EF6\u548C\u9009\u62E9\u72B6\u6001\u3002", {
      "title": "\u6587\u7A3F",
      "path": "iCloud \u4E91\u76D8 \u203A \u6587\u7A3F \u203A \u793A\u4F8B\u6587\u4EF6\u5939",
      "files": [
        [
          "\u793A\u4F8B\u6587\u4EF6\u5939",
          "\u4ECA\u5929 09:30",
          "\u6587\u4EF6\u5939",
          "\u2014"
        ],
        [
          "\u793A\u4F8B\u6587\u6863.md",
          "\u4ECA\u5929 09:12",
          "Markdown \u6587\u7A3F",
          "16 KB"
        ],
        [
          "\u793A\u4F8B\u6570\u636E.csv",
          "\u6628\u5929 18:20",
          "CSV \u6587\u7A3F",
          "8 KB"
        ],
        [
          "\u793A\u4F8B\u56FE\u7247.png",
          "\u6628\u5929 16:40",
          "PNG \u56FE\u50CF",
          "2.4 MB"
        ],
        [
          "\u793A\u4F8B\u89C6\u9891.mov",
          "\u6628\u5929 15:06",
          "QuickTime \u5F71\u7247",
          "86 MB"
        ],
        [
          "\u793A\u4F8B\u97F3\u9891.wav",
          "9\u670815\u65E5 11:24",
          "WAV \u97F3\u9891",
          "24 MB"
        ],
        [
          "README.md",
          "9\u670814\u65E5 14:08",
          "Markdown \u6587\u7A3F",
          "4 KB"
        ]
      ],
      "selected": 1
    }, (p, h) => desktop(h, window(h, p.title, `<div class="ap-split">${sidebar(h, p.title)}<div class="ap-main">${table(h, ["\u540D\u79F0", "\u4FEE\u6539\u65E5\u671F", "\u79CD\u7C7B", "\u5927\u5C0F"], array2(p.files), p.selected)}<div class="ap-bottom">${h.esc(p.path)}\u3000 \xB7\u3000${p.files.length} \u4E2A\u9879\u76EE</div></div></div>`, { toolbar: `${ai(h, "chevron-left")}${ai(h, "chevron-right")}<b>${h.esc(p.title)}</b><span class="ap-spacer"></span>${ai(h, "grid")}${ai(h, "list")}${ai(h, "columns")}${ai(h, "share")}${ai(h, "more")}<span class="ap-search">${ai(h, "search", 14)} \u641C\u7D22</span>` }))),
    component("mac-safari", "macOS \xB7 Safari \u6D4F\u89C8\u5668", "macOS \u7684\u72EC\u7ACB\u5DE5\u5177\u680F\u3001\u5730\u5740\u680F\u4E0E\u6807\u7B7E\u9875\uFF0C\u7F51\u9875\u6B63\u6587\u53EF\u7F16\u8F91\u3002", {
      "title": "\u9875\u9762\u6807\u9898",
      "url": "www.example.com",
      "tabs": [
        "\u6807\u7B7E\u9875 A",
        "\u6807\u7B7E\u9875 B"
      ],
      "heading": "\u9875\u9762\u4E3B\u6807\u9898",
      "intro": "\u9875\u9762\u7B80\u4ECB\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u8BF4\u660E\u3002",
      "sections": [
        {
          "title": "\u7AE0\u8282\u6807\u9898 A",
          "detail": "\u7AE0\u8282\u8BF4\u660E A"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 B",
          "detail": "\u7AE0\u8282\u8BF4\u660E B"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 C",
          "detail": "\u7AE0\u8282\u8BF4\u660E C"
        }
      ],
      "brand": "\u793A\u4F8B\u7AD9\u70B9",
      "navigation": [
        "\u680F\u76EE A",
        "\u680F\u76EE B",
        "\u680F\u76EE C"
      ],
      "actionLabel": "\u64CD\u4F5C\u6309\u94AE",
      "sidebarTitle": "\u5BFC\u822A\u6807\u9898",
      "sidebarItems": [
        "\u9875\u9762 A",
        "\u9875\u9762 B",
        "\u9875\u9762 C",
        "\u9875\u9762 D"
      ],
      "eyebrow": "\u680F\u76EE / \u9875\u9762",
      "commands": [
        "node example.js",
        "node example.js --preview"
      ]
    }, (p, h) => desktop(h, window(h, p.title, `<div class="ap-safari-tabs">${array2(p.tabs, 5).map((x, i) => `<div class="${!i ? "active" : ""}">${h.esc(i === 0 ? p.title : x)}<span>\xD7</span></div>`).join("")}</div><div class="ap-safari-page"><nav><b>${h.esc(p.brand)}</b><span>${array2(p.navigation, 3).map(h.esc).join("\u3000")}</span><button>${h.esc(p.actionLabel)}</button></nav><div class="ap-site-body"><aside>${h.esc(p.sidebarTitle)}${array2(p.sidebarItems, 4).map((x, i) => i ? `<span>${h.esc(x)}</span>` : `<b>${h.esc(x)}</b>`).join("")}</aside><article><small>${h.esc(p.eyebrow)}</small><h1>${h.esc(p.heading)}</h1><p>${h.esc(p.intro)}</p>${array2(p.sections, 4).map((x) => `<section data-motion="item"><h2>${h.esc(x.title)}</h2><p>${h.esc(x.detail)}</p></section>`).join("")}<div class="ap-site-code" data-motion="focus">${array2(p.commands, 2).map(h.esc).join("<br>")}</div></article></div></div>`, { toolbar: `${ai(h, "panel")}${ai(h, "chevron-left")}${ai(h, "chevron-right")}<div class="ap-safari-address">${ai(h, "lock", 12)} ${h.esc(p.url)}<span>${ai(h, "refresh", 13)}</span></div>${ai(h, "share")}${ai(h, "plus")}${ai(h, "copy")}` }), "Safari")),
    component("mac-terminal", "macOS \xB7 \u7EC8\u7AEF", "\u4FDD\u7559 macOS \u7A97\u53E3\u5F62\u5236\u4E0E shell \u63D0\u793A\u7B26\uFF0C\u53EF\u66FF\u6362\u547D\u4EE4\u4E0E\u8F93\u51FA\u3002", {
      "title": "example-project \u2014 zsh \u2014 100\xD728",
      "user": "user@MacBook-Pro",
      "folder": "example-project",
      "command": "node example.js",
      "lines": [
        "\u793A\u4F8B\u8F93\u51FA A",
        "\u793A\u4F8B\u8F93\u51FA B",
        "",
        "\u2713 \u6B65\u9AA4 A \u5DF2\u5B8C\u6210",
        "\u2713 \u6B65\u9AA4 B \u5DF2\u5B8C\u6210",
        "",
        "\u5904\u7406\u5B8C\u6210\u3002"
      ]
    }, (p, h) => desktop(h, window(h, p.title, `<div class="ap-terminal"><div>Last login: Thu Sep 17 09:38:24 on ttys001</div><div><span>${h.esc(p.user)}</span> ${h.esc(p.folder)} % <b data-motion="type">${h.esc(p.command)}</b></div>${array2(p.lines, 18).map((x) => `<div data-output-line>${h.esc(x) || "&nbsp;"}</div>`).join("")}<div>${h.esc(p.user)} ${h.esc(p.folder)} % <i></i></div></div>`, { cls: "ap-terminal-window" }), "\u7EC8\u7AEF")),
    component("mac-system-settings", "macOS \xB7 \u7CFB\u7EDF\u8BBE\u7F6E", "\u8BBE\u7F6E\u4FA7\u680F\u3001\u5206\u7EC4\u9762\u677F\u3001\u5F00\u5173\u548C\u8BE6\u60C5\u884C\uFF0C\u53EF\u7528\u4E8E\u6559\u7A0B\u5B9A\u4F4D\u3002", {
      "title": "\u901A\u7528",
      "account": "\u793A\u4F8B\u7528\u6237",
      "subtitle": "Apple \u8D26\u6237",
      "rows": [
        [
          "\u5173\u4E8E\u672C\u673A",
          "MacBook Pro"
        ],
        [
          "\u8F6F\u4EF6\u66F4\u65B0",
          "\u5DF2\u662F\u6700\u65B0"
        ],
        [
          "\u50A8\u5B58\u7A7A\u95F4",
          "128 GB \u53EF\u7528"
        ],
        [
          "\u9694\u7A7A\u6295\u9001\u4E0E\u63A5\u529B",
          ""
        ],
        [
          "\u767B\u5F55\u9879\u4E0E\u6269\u5C55",
          ""
        ],
        [
          "\u8BED\u8A00\u4E0E\u5730\u533A",
          "\u7B80\u4F53\u4E2D\u6587"
        ],
        [
          "\u65E5\u671F\u4E0E\u65F6\u95F4",
          "\u81EA\u52A8\u8BBE\u7F6E"
        ],
        [
          "\u5171\u4EAB",
          "\u5173\u95ED"
        ]
      ],
      "accountInitial": "\u7528"
    }, (p, h) => desktop(h, window(h, p.title, `<div class="ap-split"><aside class="ap-settings-sidebar"><div class="ap-search">${ai(h, "search", 13)} \u641C\u7D22</div><div class="ap-account"><b>${h.esc(p.accountInitial)}</b><div><strong>${h.esc(p.account)}</strong><small>${h.esc(p.subtitle)}</small></div></div>${["Wi-Fi", "\u84DD\u7259", "\u7F51\u7EDC", "\u901A\u77E5", "\u58F0\u97F3", "\u4E13\u6CE8\u6A21\u5F0F", "\u5C4F\u5E55\u4F7F\u7528\u65F6\u95F4", "\u901A\u7528", "\u8F85\u52A9\u529F\u80FD", "\u5916\u89C2", "\u63A7\u5236\u4E2D\u5FC3", "\u684C\u9762\u4E0E\u7A0B\u5E8F\u575E", "\u663E\u793A\u5668", "\u5899\u7EB8", "\u9690\u79C1\u4E0E\u5B89\u5168\u6027"].map((x, i) => `<div class="ap-setting-nav ${x === p.title ? "active" : ""}" data-motion="item"><i style="background:${["#248cef", "#258cf1", "#278ce8", "#ef514a", "#e7638c", "#7767c9", "#5856d6", "#9095a0"][i % 8]}">${ai(h, ["wifi", "bluetooth", "globe", "bell", "volume", "moon", "clock", "settings"][i % 8], 14)}</i>${x}</div>`).join("")}</aside><div class="ap-settings-main"><h2>${h.esc(p.title)}</h2><div class="ap-settings-hero">${appIcon(h, "settings", 54)}<b>${h.esc(p.title)}</b><p>\u7BA1\u7406\u8BBE\u5907\u7684\u6574\u4F53\u8BBE\u7F6E\u548C\u504F\u597D\u3002</p></div><div class="ap-setting-group">${array2(p.rows, 10).map((x, i) => `<div data-motion="focus" class="ap-native-row">${ai(h, ["info", "refresh", "folder", "airdrop", "grid", "globe", "clock", "share"][i], 18)}<b>${h.esc(x[0])}</b><span>${h.esc(x[1])}\u3000\u203A</span></div>`).join("")}</div></div></div>`, { style: "left:211px;top:56px;width:858px;height:700px", toolbar: `<span class="ap-spacer"></span>${ai(h, "chevron-left")}${ai(h, "chevron-right")}<span class="ap-spacer"></span>` }), "\u7CFB\u7EDF\u8BBE\u7F6E")),
    component("mac-spotlight", "macOS \xB7 \u805A\u7126\u641C\u7D22", "\u72EC\u7ACB\u641C\u7D22\u6D6E\u5C42\u3001\u5206\u7C7B\u7ED3\u679C\u548C\u9884\u89C8\uFF0C\u53EF\u66FF\u6362\u641C\u7D22\u8BCD\u4E0E\u5339\u914D\u9879\u3002", {
      "query": "\u793A\u4F8B",
      "results": [
        {
          "name": "\u793A\u4F8B\u6587\u4EF6\u5939",
          "detail": "\u6587\u7A3F / \u6587\u4EF6\u5939",
          "kind": "folder"
        },
        {
          "name": "\u793A\u4F8B\u6587\u6863.md",
          "detail": "\u4ECA\u5929 09:12 \xB7 Markdown \u6587\u7A3F",
          "kind": "file"
        },
        {
          "name": "\u793A\u4F8B\u6587\u6863.pdf",
          "detail": "\u6628\u5929 18:22 \xB7 PDF \u6587\u7A3F",
          "kind": "file"
        },
        {
          "name": "\u793A\u4F8B",
          "detail": "\u5728\u7F51\u9875\u4E2D\u641C\u7D22",
          "kind": "globe"
        }
      ]
    }, (p, h) => desktop(h, `<div class="ap-spotlight"><div class="ap-spot-search">${ai(h, "search", 28)}<span data-motion="type">${h.esc(p.query)}</span></div><div class="ap-spot-body"><div><label>\u6700\u4F73\u5339\u914D</label>${array2(p.results, 7).map((r, i) => `<article class="${i === 0 ? "active" : ""}" data-motion="item">${ai(h, r.kind, 28)}<div><b>${h.esc(r.name)}</b><small>${h.esc(r.detail)}</small></div>${i === 0 ? "<span>\u21B5</span>" : ""}</article>`).join("")}</div><aside>${appIcon(h, "files", 76)}<h2>${h.esc(p.results[0]?.name)}</h2><p>\u6587\u4EF6\u5939</p><hr><small>\u4F4D\u7F6E\u3000iCloud \u4E91\u76D8 / \u6587\u7A3F</small><small>\u4FEE\u6539\u3000\u4ECA\u5929 09:30</small><small>\u5927\u5C0F\u30008 \u4E2A\u9879\u76EE</small></aside></div><footer>\u6309\u56DE\u8F66\u952E\u6253\u5F00\u3000 \xB7\u3000\u6309\u4F4F \u2318 \u67E5\u770B\u4F4D\u7F6E</footer></div>`, "\u8BBF\u8FBE", true)),
    component("mac-control-center", "macOS \xB7 \u63A7\u5236\u4E2D\u5FC3", "\u6309\u5B98\u65B9\u5206\u7EC4\u7EC4\u7EC7\u7F51\u7EDC\u3001\u4E13\u6CE8\u3001\u663E\u793A\u548C\u58F0\u97F3\u63A7\u5236\u3002", {
      "wifi": "Example Wi-Fi",
      "bluetooth": "\u5DF2\u6253\u5F00",
      "airdrop": "\u4EC5\u9650\u8054\u7CFB\u4EBA",
      "focus": "\u4E13\u6CE8\u6A21\u5F0F",
      "brightness": 65,
      "volume": 42,
      "track": "\u672A\u5728\u64AD\u653E"
    }, (p, h) => desktop(h, `<div class="ap-control"><div class="ap-control-grid"><section class="ap-connect">${[["wifi", "Wi-Fi", p.wifi], ["bluetooth", "\u84DD\u7259", p.bluetooth], ["airdrop", "\u9694\u7A7A\u6295\u9001", p.airdrop]].map((x) => `<div data-motion="item"><i>${ai(h, x[0], 19)}</i><span><b>${h.esc(x[1])}</b><small>${h.esc(x[2])}</small></span></div>`).join("")}</section><section class="ap-focus" data-motion="focus">${ai(h, "moon", 24)}<b>${h.esc(p.focus)}</b></section><section class="ap-control-small">${ai(h, "panel", 24)}<span>\u53F0\u524D\u8C03\u5EA6</span></section><section class="ap-control-small">${ai(h, "copy", 24)}<span>\u5C4F\u5E55\u955C\u50CF</span></section></div>${[["\u663E\u793A\u5668", "sun", p.brightness], ["\u58F0\u97F3", "volume", p.volume]].map((x) => `<section class="ap-control-slider" data-motion="focus"><b>${x[0]}</b><div><i style="width:${Math.max(0, Math.min(100, Number(x[2])))}%"></i><span>${ai(h, x[1], 15)}</span></div></section>`).join("")}<section class="ap-control-playing">${appIcon(h, "notes", 37)}<b>${h.esc(p.track)}</b>${ai(h, "play", 17)}</section></div>`, "\u8BBF\u8FBE", true)),
    component("mac-notification-center", "macOS \xB7 \u901A\u77E5\u4E0E\u5C0F\u7EC4\u4EF6", "\u53F3\u4FA7\u901A\u77E5\u548C\u65E5\u5386\u5C0F\u7EC4\u4EF6\uFF0C\u6309\u771F\u5B9E\u684C\u9762\u9762\u677F\u5BC6\u5EA6\u7EC4\u7EC7\u3002", {
      "date": "9\u670817\u65E5 \u661F\u671F\u56DB",
      "events": [
        {
          "app": "\u65E5\u5386",
          "title": "\u65E5\u7A0B\u6807\u9898",
          "body": "\u4ECA\u5929 10:00\u201310:30",
          "time": "9\u5206\u949F\u524D"
        },
        {
          "app": "\u63D0\u9192\u4E8B\u9879",
          "title": "\u63D0\u9192\u6807\u9898",
          "body": "\u63D0\u9192\u6B63\u6587\u5185\u5BB9\u3002",
          "time": "24\u5206\u949F\u524D"
        },
        {
          "app": "\u4FE1\u606F",
          "title": "\u8054\u7CFB\u4EBA",
          "body": "\u6D88\u606F\u6B63\u6587\u5185\u5BB9\u3002",
          "time": "1\u5C0F\u65F6\u524D"
        }
      ],
      "weekday": "\u661F\u671F\u56DB",
      "day": 17,
      "agendaSummary": "\u65E5\u7A0B\u6458\u8981",
      "nextEventTitle": "\u65E5\u7A0B\u6807\u9898",
      "nextEventTime": "10:00\u201310:30",
      "calendarLabel": "\u793A\u4F8B\u65E5\u5386"
    }, (p, h) => desktop(h, `<div class="ap-notifications"><header>${h.esc(p.date)}</header><div class="ap-widget-pair"><section><small>${h.esc(p.weekday)}</small><b>${h.esc(p.day)}</b><p>${h.esc(p.agendaSummary)}</p></section><section><small>\u4E0B\u4E00\u9879\u65E5\u7A0B</small><h3>${h.esc(p.nextEventTitle)}</h3><p>${h.esc(p.nextEventTime)}</p><i>${h.esc(p.calendarLabel)}</i></section></div>${array2(p.events, 5).map((x, i) => `<article class="ap-notification" data-motion="item">${appIcon(h, ["calendar", "notes", "messages"][i % 3], 30)}<div><small>${h.esc(x.app)}<span>${h.esc(x.time)}</span></small><b>${h.esc(x.title)}</b><p>${h.esc(x.body)}</p></div></article>`).join("")}<div class="ap-notification-edit">\u7F16\u8F91\u5C0F\u7EC4\u4EF6</div></div>`, "\u8BBF\u8FBE", true)),
    component("mac-notes", "macOS \xB7 \u5907\u5FD8\u5F55", "\u6587\u4EF6\u5939\u3001\u7B14\u8BB0\u5217\u8868\u4E0E\u6B63\u6587\u4E09\u680F\uFF0C\u652F\u6301\u6E05\u5355\u548C\u6BB5\u843D\u66FF\u6362\u3002", noteDefault, (p, h) => desktop(h, window(h, "\u5907\u5FD8\u5F55", `<div class="ap-split">${sidebar(h, p.folder, ["\u6240\u6709 iCloud", "\u5907\u5FD8\u5F55", "\u5DE5\u4F5C", "\u4E2A\u4EBA", "\u6700\u8FD1\u5220\u9664"])}${notesBody(p, h)}</div>`, { toolbar: `${ai(h, "panel")}${ai(h, "trash")}<span class="ap-spacer"></span>${ai(h, "edit")}${ai(h, "check-circle")}<b>Aa</b>${ai(h, "grid")}${ai(h, "share")}${ai(h, "search")}` }), "\u5907\u5FD8\u5F55"))
  ];
  var css2 = commonCSS + `
.ap-safari-address{height:29px;border:1px solid #d5d5d9;background:#e9e9ed;border-radius:7px;display:flex;align-items:center;justify-content:center;gap:5px;width:560px;margin:auto;color:#555;font-size:12px;position:relative}.ap-safari-address>span{position:absolute;right:9px}.ap-safari-tabs{display:flex;height:32px;background:#eaeaec;border-bottom:1px solid #d9d9dc}.ap-safari-tabs>div{flex:1;display:flex;align-items:center;justify-content:center;position:relative;border-right:1px solid #d2d2d5;font-size:12px;color:#676a72}.ap-safari-tabs .active{background:#fff;color:#252931}.ap-safari-tabs span{position:absolute;left:15px}.ap-safari-page nav{height:62px;border-bottom:1px solid #e6e9ed;display:flex;align-items:center;gap:45px;padding:0 36px;font-size:12px}.ap-safari-page nav>b{font-size:18px}.ap-safari-page nav>button{margin-left:auto;background:#2563eb;color:#fff;border:0;border-radius:5px;padding:7px 12px}.ap-site-body{display:flex;padding:28px 36px;gap:48px}.ap-site-body>aside{width:150px;display:flex;flex-direction:column;font-size:11px;color:#7c8493;gap:18px}.ap-site-body>aside b{color:#2563eb;background:#eef4fd;padding:8px;margin-left:-8px;border-radius:4px;font-size:12px}.ap-site-body>article{flex:1}.ap-site-body small{font-size:10px;color:#8a92a1}.ap-site-body h1{font-size:28px;margin:13px 0 15px;letter-spacing:-.5px}.ap-site-body p{font-size:13px;line-height:1.9;color:#555f71}.ap-site-body h2{font-size:17px;margin:23px 0 7px}.ap-site-code{background:#f6f7f9;border:1px solid #e6e9ef;border-radius:5px;margin-top:19px;padding:13px;font:12px/1.7 ComponentMono,monospace;color:#315282}.ap-terminal{background:#fff;padding:17px 20px;font:14px/1.55 ComponentMono,monospace;height:100%;color:#26292c}.ap-terminal>div{min-height:22px}.ap-terminal b{font-weight:400}.ap-terminal i{display:inline-block;width:8px;height:17px;background:#444;vertical-align:middle}.ap-terminal-window{height:560px;top:111px}.ap-terminal-window .ap-toolbar{height:29px;padding:0 13px;gap:8px;justify-content:center}.ap-terminal-window .ap-toolbar>b{font-size:12px}.ap-terminal-window .ap-lights{position:absolute;left:13px}.ap-terminal-window .ap-toolbar>svg{display:none}.ap-settings-sidebar{width:225px;background:#eeeef0;border-right:1px solid #d6d6da;padding:13px 9px}.ap-settings-sidebar .ap-search{margin:0 4px 15px;border:1px solid #d5d5da;background:#e8e8ed}.ap-account{display:flex;gap:10px;align-items:center;margin:10px 6px 20px}.ap-account>b{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:#a8adb5;color:white;font-size:19px}.ap-account strong{font-size:14px}.ap-account small{font-size:11px;display:block;color:#74767c;margin-top:5px}.ap-setting-nav{height:33px;display:flex;align-items:center;gap:8px;padding:0 8px;border-radius:5px;font-size:12px}.ap-setting-nav i{width:21px;height:21px;display:grid;place-items:center;border-radius:5px;color:white}.ap-setting-nav.active{background:#337bd1;color:white}.ap-settings-main{padding:18px 22px;flex:1;background:#f8f8fa}.ap-settings-main>h2{font-size:16px}.ap-settings-hero{display:flex;align-items:center;flex-direction:column;margin:18px 0 22px;gap:10px}.ap-settings-hero>b{font-size:18px}.ap-settings-hero>p{font-size:12px;color:#6e747f}.ap-setting-group{background:#fff;border:1px solid #dddde2;border-radius:8px;overflow:hidden}.ap-setting-group .ap-native-row{height:44px}.ap-setting-group .ap-native-row>b{font-weight:400}.ap-setting-group .ap-native-row:last-child{border:0}.ap-spotlight{position:absolute;left:290px;top:152px;width:700px;background:#f5f6f7e8;border:1px solid #ffffffb0;border-radius:12px;box-shadow:0 30px 80px #19283d4a;overflow:hidden}.ap-spot-search{height:76px;display:flex;align-items:center;gap:18px;padding:0 24px;font-size:27px;border-bottom:1px solid #cdd2d9;color:#555d6b}.ap-spot-search>span{color:#262c35}.ap-spot-body{display:grid;grid-template-columns:360px 1fr;min-height:330px;padding:12px}.ap-spot-body label{font-size:11px;color:#737985;display:block;padding:7px 10px}.ap-spot-body article{display:flex;align-items:center;gap:13px;padding:13px 11px;border-radius:7px;margin-bottom:3px}.ap-spot-body article>svg{color:#328bdb}.ap-spot-body article b{font-size:13px}.ap-spot-body article small{display:block;font-size:11px;opacity:.6;margin-top:5px}.ap-spot-body article.active{background:#2b79d3;color:white}.ap-spot-body article.active>svg{color:white}.ap-spot-body article>span{margin-left:auto}.ap-spot-body>aside{border-left:1px solid #d4d7dd;text-align:center;padding:25px 15px}.ap-spot-body>aside h2{font-size:18px;margin:16px 0 9px}.ap-spot-body>aside p{font-size:12px;color:#7a818d}.ap-spot-body>aside hr{border:0;border-top:1px solid #d9dce2;margin:25px 10px 16px}.ap-spot-body>aside small{display:block;font-size:11px;text-align:left;margin:11px}.ap-spotlight footer{border-top:1px solid #d6d9df;padding:11px 20px;font-size:10px;color:#7c8493}.ap-control{position:absolute;right:24px;top:39px;width:334px;border:1px solid #fff9;padding:11px;border-radius:17px;background:#e4eaf1b8;backdrop-filter:blur(30px);box-shadow:0 14px 35px #17344c42}.ap-control section{background:#ffffff76;border:1px solid #ffffff37;border-radius:10px;box-shadow:0 2px 5px #17344c0d}.ap-control-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}.ap-connect{grid-column:span 2;grid-row:span 2;padding:8px}.ap-connect>div{display:flex;gap:8px;align-items:center;margin:4px 0 11px}.ap-connect>div:last-child{margin-bottom:3px}.ap-connect i{width:29px;height:29px;border-radius:50%;background:#0789ff;color:white;display:grid;place-items:center}.ap-connect b{font-size:12px}.ap-connect small{display:block;font-size:10px;color:#5d687c;margin-top:2px}.ap-focus{grid-column:span 2;display:flex;align-items:center;gap:10px;padding:13px 11px}.ap-focus>b{font-size:12px}.ap-control-small{padding:13px 4px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;font-size:10px}.ap-control-slider{padding:12px;margin-top:10px}.ap-control-slider>b{font-size:12px}.ap-control-slider>div{height:22px;border-radius:15px;background:#aebcd280;position:relative;margin-top:9px;overflow:hidden;border:1px solid #7286a02f}.ap-control-slider i{position:absolute;left:0;top:0;height:100%;background:#ffffffec;border-radius:15px}.ap-control-slider i:after{content:'';position:absolute;right:0;top:0;width:21px;height:21px;border-radius:50%;background:white;box-shadow:0 1px 4px #0003}.ap-control-slider span{position:absolute;left:5px;top:2px;color:#8a99ae}.ap-control-playing{display:flex;align-items:center;gap:12px;padding:12px;margin-top:10px}.ap-control-playing b{font-size:12px;flex:1}.ap-notifications{position:absolute;right:18px;top:51px;width:350px}.ap-notifications>header{font-size:19px;color:white;text-shadow:0 1px 3px #1e385e66;margin:0 0 17px 6px}.ap-widget-pair{display:flex;gap:12px;margin-bottom:16px}.ap-widget-pair>section{flex:1;background:#fffffff0;border-radius:16px;padding:17px;height:156px;box-shadow:0 6px 15px #183c6614}.ap-widget-pair small{font-size:11px;color:#e05850}.ap-widget-pair b{display:block;font-size:51px;font-weight:400;margin:3px 0}.ap-widget-pair p{font-size:11px;color:#838993}.ap-widget-pair h3{font-size:15px;margin:19px 0 11px}.ap-widget-pair i{display:block;font-size:10px;color:#dd635a;margin-top:10px;font-style:normal}.ap-notification{display:flex;gap:11px;background:#eef2f6e8;border:1px solid #fff6;border-radius:15px;padding:17px 14px;margin-bottom:12px;box-shadow:0 7px 21px #2646671e}.ap-notification>div{flex:1;min-width:0}.ap-notification small{font-size:10px;color:#6c7481;display:block;margin-bottom:6px}.ap-notification small span{float:right}.ap-notification b{font-size:13px}.ap-notification p{font-size:12px;line-height:1.6;margin-top:5px}.ap-notification-edit{width:100px;margin:23px auto;background:#e4e8eec0;border-radius:20px;padding:8px;text-align:center;font-size:11px}.ap-note-list{width:248px;background:#fbfbfc;border-right:1px solid #e5e5e7;padding:9px 8px;flex-shrink:0}.ap-note-list article{padding:15px 16px;border-radius:6px;border-bottom:1px solid #ececee;margin-bottom:3px}.ap-note-list article.active{background:#f8dfa0;border:0}.ap-note-list b{font-size:13px}.ap-note-list p{font-size:11px;margin:7px 0;color:#4e5057;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ap-note-list p span{color:#919196}.ap-note-list small{font-size:10px;color:#737477}.ap-note-page{flex:1;padding:17px 34px;overflow:hidden}.ap-note-page>small{display:block;text-align:center;font-size:11px;color:#8d8f94;margin-bottom:27px}.ap-note-page h1{font-size:26px;margin:10px 0 22px}.ap-note-page p{font-size:14px;line-height:1.9;margin-bottom:17px}.ap-note-page h2{font-size:19px;margin:30px 0 18px}.ap-note-check{font-size:14px;display:flex;align-items:center;gap:11px;margin:14px 0}.ap-note-check i{width:19px;height:19px;border:1.7px solid #d0a630;border-radius:50%;font-style:normal;color:white;display:grid;place-items:center;font-size:12px}.ap-note-check i.done{background:#d0a630}
`;

  // families/apple-mobile.mjs
  var phone = (p, h, body, cls2 = "") => `<section class="am-stage"><div class="am-phone"><div class="am-screen ${cls2}"><div class="am-status"><b>${h.esc(p.time || "9:41")}</b><span><svg width="15" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx=".7"/><rect x="4.5" y="5" width="3" height="7" rx=".7"/><rect x="9" y="2" width="3" height="10" rx=".7"/><rect x="13.5" width="3" height="12" rx=".7"/></svg>${ai(h, "wifi", 15)}<i class="am-battery"></i></span></div><div class="am-island"></div>${body}<div class="am-home"></div></div></div></section>`;
  var nav = (h, title, left = "\u8FD4\u56DE", right = "") => `<nav class="am-nav"><span>${ai(h, "chevron-left", 22)}${h.esc(left)}</span><b>${h.esc(title)}</b><span>${h.esc(right)}</span></nav>`;
  var iosRow = (h, x, i) => `<div class="am-row" data-motion="item"><i style="background:${["#168cff", "#1998ee", "#777e8b", "#ed5a58", "#b156cf", "#615ce4"][i % 6]}">${ai(h, x.icon || ["wifi", "bluetooth", "settings", "bell", "moon", "clock"][i % 6], 17)}</i><b>${h.esc(x.label)}</b><span>${x.toggle !== void 0 ? `<i class="am-switch ${x.toggle ? "" : "off"}" data-motion="focus"></i>` : h.esc(x.value || "") + (x.arrow === false ? "" : "\u3000\u203A")}</span></div>`;
  var paragraphs = (h, p) => array2(p).map((x) => `<p>${h.esc(x)}</p>`).join("");
  var pad = (h, body) => `<section class="am-stage"><div class="am-ipad"><div class="am-pad-screen"><header class="am-pad-status">9:41\u30009\u670817\u65E5 \u661F\u671F\u56DB<span>\u25CF \u25CF \u25CF</span><i>${ai(h, "wifi", 14)}\u300085% ${ai(h, "battery", 21)}</i></header>${body}<div class="am-home"></div></div></div></section>`;
  var components16 = [
    component("ios-settings", "iPhone \xB7 \u8BBE\u7F6E", "iOS 18 \u8BBE\u7F6E\u9996\u9875\u3001\u8D26\u6237\u5361\u7247\u3001\u641C\u7D22\u548C\u5206\u7EC4\u5217\u8868\u3002", {
      "title": "\u8BBE\u7F6E",
      "account": "\u793A\u4F8B\u7528\u6237",
      "accountSubtitle": "Apple \u8D26\u6237\u3001iCloud \u7B49",
      "groups": [
        [
          {
            "label": "\u98DE\u884C\u6A21\u5F0F",
            "icon": "airplane",
            "toggle": false
          },
          {
            "label": "\u65E0\u7EBF\u5C40\u57DF\u7F51",
            "icon": "wifi",
            "value": "Example Wi-Fi"
          },
          {
            "label": "\u84DD\u7259",
            "icon": "bluetooth",
            "value": "\u6253\u5F00"
          },
          {
            "label": "\u8702\u7A9D\u7F51\u7EDC",
            "icon": "phone"
          }
        ],
        [
          {
            "label": "\u901A\u7528",
            "icon": "settings"
          },
          {
            "label": "\u8F85\u52A9\u529F\u80FD",
            "icon": "info"
          },
          {
            "label": "\u76F8\u673A",
            "icon": "camera"
          },
          {
            "label": "\u63A7\u5236\u4E2D\u5FC3",
            "icon": "sliders"
          }
        ],
        [
          {
            "label": "\u663E\u793A\u4E0E\u4EAE\u5EA6",
            "icon": "sun"
          },
          {
            "label": "\u5899\u7EB8",
            "icon": "image"
          }
        ]
      ],
      "accountInitial": "\u7528"
    }, (p, h) => phone(p, h, `<div class="am-settings"><h1>${h.esc(p.title)}</h1><div class="am-search">${ai(h, "search", 16)} \u641C\u7D22 ${ai(h, "mic", 16)}</div><div class="am-account"><b>${h.esc(p.accountInitial)}</b><div><strong>${h.esc(p.account)}</strong><small>${h.esc(p.accountSubtitle)}</small></div><span>\u203A</span></div>${array2(p.groups, 4).map((g2) => `<section class="am-group">${array2(g2, 6).map((x, i) => iosRow(h, x, i)).join("")}</section>`).join("")}</div>`, "am-settings-screen"), true),
    component("ios-messages", "iPhone \xB7 \u4FE1\u606F", "\u8054\u7CFB\u4EBA\u680F\u3001\u6536\u53D1\u6C14\u6CE1\u3001\u53D1\u9001\u72B6\u6001\u548C\u8F93\u5165\u680F\uFF0C\u9002\u5408\u6F14\u793A\u6C9F\u901A\u6D41\u7A0B\u3002", {
      "name": "\u8054\u7CFB\u4EBA",
      "initial": "\u8054",
      "date": "\u4ECA\u5929 09:41",
      "messages": [
        {
          "from": "them",
          "text": "\u63A5\u6536\u6D88\u606F A\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u5185\u5BB9\u3002"
        },
        {
          "from": "me",
          "text": "\u53D1\u9001\u6D88\u606F B\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u5185\u5BB9\u3002"
        },
        {
          "from": "me",
          "text": "\u53D1\u9001\u6D88\u606F C\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u5185\u5BB9\u3002"
        },
        {
          "from": "them",
          "text": "\u63A5\u6536\u6D88\u606F D\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u5185\u5BB9\u3002"
        },
        {
          "from": "me",
          "text": "\u53D1\u9001\u6D88\u606F E\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u5185\u5BB9\u3002"
        }
      ],
      "draft": "",
      "status": "\u5DF2\u9001\u8FBE"
    }, (p, h) => phone(p, h, `<div class="am-message-head"><span>${ai(h, "chevron-left", 27)}</span><div><i>${h.esc(p.initial)}</i><b>${h.esc(p.name)} \u203A</b></div>${ai(h, "video", 24)}</div><div class="am-messages"><small>${h.esc(p.date)}</small>${array2(p.messages, 8).map((x) => `<article class="${x.from === "me" ? "me" : "them"}" data-motion="item">${h.esc(x.text)}</article>`).join("")}<em>${h.esc(p.status)}</em></div><footer class="am-message-compose">${ai(h, "plus", 27)}<div>${h.esc(p.draft || "iMessage \u4FE1\u606F")}${ai(h, "mic", 17)}</div></footer>`), true),
    component("ios-safari", "iPhone \xB7 Safari \u6D4F\u89C8\u5668", "\u5E95\u90E8\u5730\u5740\u680F\u548C\u6D4F\u89C8\u5668\u64CD\u4F5C\u6761\uFF1B\u652F\u6301\u66FF\u6362\u7F51\u9875\u6B63\u6587\u3002", {
      "url": "www.example.com",
      "brand": "\u793A\u4F8B\u7AD9\u70B9",
      "title": "\u9875\u9762\u4E3B\u6807\u9898",
      "intro": "\u9875\u9762\u7B80\u4ECB\u6587\u5B57\u3002",
      "sections": [
        {
          "title": "\u7AE0\u8282\u6807\u9898 A",
          "detail": "\u7AE0\u8282\u8BF4\u660E A"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 B",
          "detail": "\u7AE0\u8282\u8BF4\u660E B"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 C",
          "detail": "\u7AE0\u8282\u8BF4\u660E C"
        }
      ],
      "eyebrow": "\u680F\u76EE / \u9875\u9762"
    }, (p, h) => phone(p, h, `<div class="am-safari-site"><header><b>${h.esc(p.brand)}</b>${ai(h, "menu", 21)}</header><small>${h.esc(p.eyebrow)}</small><h1>${h.esc(p.title)}</h1><p>${h.esc(p.intro)}</p>${array2(p.sections, 4).map((s2, i) => `<section data-motion="item"><b>0${i + 1}</b><h2>${h.esc(s2.title)}</h2><p>${h.esc(s2.detail)}</p></section>`).join("")}</div><footer class="am-safari-bottom"><div class="am-safari-url">aA <span>${ai(h, "lock", 11)} ${h.esc(p.url)}</span>${ai(h, "refresh", 18)}</div><nav>${ai(h, "chevron-left", 23)}${ai(h, "chevron-right", 23)}${ai(h, "share", 23)}${ai(h, "file", 23)}${ai(h, "copy", 23)}</nav></footer>`), true),
    component("ios-notes", "iPhone \xB7 \u5907\u5FD8\u5F55", "\u539F\u751F\u5BFC\u822A\u3001\u65E5\u671F\u3001\u6807\u9898\u3001\u6BB5\u843D\u4E0E\u5706\u5F62\u6E05\u5355\u3002", {
      "folder": "\u793A\u4F8B\u6587\u4EF6\u5939",
      "title": "\u7B14\u8BB0\u6807\u9898",
      "date": "2026\u5E749\u670817\u65E5 09:41",
      "paragraphs": [
        "\u6B63\u6587\u7B2C\u4E00\u6BB5\uFF0C\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u5185\u5BB9\u3002",
        "\u6B63\u6587\u7B2C\u4E8C\u6BB5\uFF0C\u652F\u6301\u7EE7\u7EED\u8865\u5145\u8BF4\u660E\u3002"
      ],
      "checklist": [
        {
          "text": "\u5F85\u529E\u4E8B\u9879 A",
          "done": true
        },
        {
          "text": "\u5F85\u529E\u4E8B\u9879 B",
          "done": true
        },
        {
          "text": "\u5F85\u529E\u4E8B\u9879 C",
          "done": false
        },
        {
          "text": "\u5F85\u529E\u4E8B\u9879 D",
          "done": false
        },
        {
          "text": "\u5F85\u529E\u4E8B\u9879 E",
          "done": false
        }
      ]
    }, (p, h) => phone(p, h, `${nav(h, "", p.folder, "\u2022\u2022\u2022")}<article class="am-note"><time>${h.esc(p.date)}</time><h1>${h.esc(p.title)}</h1>${paragraphs(h, p.paragraphs)}${array2(p.checklist, 8).map((x) => `<div class="am-check" data-motion="item"><i class="${x.done ? "done" : ""}">${x.done ? "\u2713" : ""}</i>${h.esc(x.text)}</div>`).join("")}</article><footer class="am-note-tools">${ai(h, "check-circle", 23)}${ai(h, "camera", 23)}${ai(h, "edit", 23)}${ai(h, "grid", 23)}</footer>`, "am-note-screen"), true),
    component("ios-control-center", "iPhone \xB7 \u63A7\u5236\u4E2D\u5FC3", "iOS 18 \u63A7\u4EF6\u5206\u7EC4\u3001\u5927\u6ED1\u5757\u3001\u64AD\u653E\u5361\u7247\u4E0E\u5706\u5F62\u5FEB\u6377\u64CD\u4F5C\u3002", {
      "network": "Example Wi-Fi",
      "track": "\u672A\u5728\u64AD\u653E",
      "focus": "\u4E13\u6CE8\u6A21\u5F0F",
      "brightness": 67,
      "volume": 41
    }, (p, h) => phone(p, h, `<div class="am-control-top">${ai(h, "plus", 25)}<span>\u25EF</span></div><div class="am-control-grid"><section class="am-connect"><i class="flight">${ai(h, "airplane", 23)}</i><i class="cell">${ai(h, "phone", 23)}</i><i class="wifi">${ai(h, "wifi", 23)}</i><i class="bluetooth">${ai(h, "bluetooth", 23)}</i></section><section class="am-player"><b>${h.esc(p.track)}</b><div>\u25C0\u25C0 ${ai(h, "play", 27)} \u25B6\u25B6</div><small>${h.esc(p.network)}</small></section><i class="am-control-circle">${ai(h, "rotate", 25)}</i><i class="am-control-circle">${ai(h, "copy", 25)}</i><section class="am-vertical-slider" data-motion="focus"><i style="height:${Math.max(0, Math.min(100, Number(p.brightness)))}%"></i><b>${ai(h, "sun", 29)}</b></section><section class="am-vertical-slider" data-motion="focus"><i style="height:${Math.max(0, Math.min(100, Number(p.volume)))}%"></i><b>${ai(h, "volume", 29)}</b></section><section class="am-control-focus">${ai(h, "moon", 24)}<b>${h.esc(p.focus)}</b><span>\u203A</span></section>${["flash", "clock", "camera", "phone", "mic", "sun", "battery", "settings"].map((x) => `<i class="am-control-circle" data-motion="item">${ai(h, x, 26)}</i>`).join("")}</div>`, "am-control-screen"), true),
    component("ios-share-sheet", "iPhone \xB7 \u5206\u4EAB\u9762\u677F", "\u5185\u5BB9\u6458\u8981\u3001\u5EFA\u8BAE\u8054\u7CFB\u4EBA\u3001\u5E94\u7528\u6A2A\u6392\u548C\u7CFB\u7EDF\u64CD\u4F5C\u5217\u8868\u3002", {
      "title": "\u793A\u4F8B\u6587\u6863.pdf",
      "detail": "PDF \u6587\u7A3F \xB7 1.2 MB",
      "people": [
        "\u8054\u7CFB\u4EBA A",
        "\u8054\u7CFB\u4EBA B",
        "\u8054\u7CFB\u4EBA C"
      ],
      "apps": [
        [
          "airdrop",
          "\u9694\u7A7A\u6295\u9001"
        ],
        [
          "messages",
          "\u4FE1\u606F"
        ],
        [
          "mail",
          "\u90AE\u4EF6"
        ],
        [
          "notes",
          "\u5907\u5FD8\u5F55"
        ]
      ],
      "actions": [
        "\u62F7\u8D1D",
        "\u6DFB\u52A0\u5230\u9605\u8BFB\u5217\u8868",
        "\u5B58\u50A8\u5230\u201C\u6587\u4EF6\u201D",
        "\u6253\u5370",
        "\u6807\u8BB0"
      ],
      "documentTitle": "\u6587\u6863\u6807\u9898",
      "documentBody": "\u6B63\u6587\u5185\u5BB9\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u6587\u5B57\u3002"
    }, (p, h) => phone(p, h, `<div class="am-share-context"><h2>${h.esc(p.documentTitle)}</h2><p>${h.esc(p.documentBody)}</p></div><div class="am-share-sheet"><div class="am-grabber"></div><header>${appIcon(h, "preview", 42)}<div><b>${h.esc(p.title)}</b><small>${h.esc(p.detail)}</small></div><i>\xD7</i></header><div class="am-share-people">${array2(p.people, 4).map((x, i) => `<div data-motion="item"><b style="background:${["#82a6c7", "#b0a3c8", "#99b9ac"][i % 3]}">${h.esc(x[0])}</b><small>${h.esc(x)}</small></div>`).join("")}</div><div class="am-share-apps">${array2(p.apps, 4).map((x) => `<div>${x[0] === "airdrop" ? `<i>${ai(h, "airdrop", 33)}</i>` : appIcon(h, x[0], 49)}<small>${h.esc(x[1])}</small></div>`).join("")}</div><section class="am-group">${array2(p.actions, 6).map((x, i) => `<div class="am-share-action" data-motion="item">${h.esc(x)}${ai(h, ["copy", "file", "folder", "download", "edit"][i % 5], 20)}</div>`).join("")}</section></div>`, "am-share-screen"), true),
    component("ipad-split-view", "iPad \xB7 \u5206\u5C4F\u5DE5\u4F5C\u53F0", "iPadOS 18 \u5206\u5C4F Safari \u4E0E\u5907\u5FD8\u5F55\uFF0C\u4FDD\u7559\u5206\u9694\u6761\u548C\u5404\u81EA\u5DE5\u5177\u680F\u3002", {
      "url": "www.example.com",
      "webTitle": "\u9875\u9762\u4E3B\u6807\u9898",
      "webIntro": "\u9875\u9762\u7B80\u4ECB\u6587\u5B57\u3002",
      "sections": [
        [
          "\u7AE0\u8282 A",
          "\u7AE0\u8282\u8BF4\u660E A"
        ],
        [
          "\u7AE0\u8282 B",
          "\u7AE0\u8282\u8BF4\u660E B"
        ],
        [
          "\u7AE0\u8282 C",
          "\u7AE0\u8282\u8BF4\u660E C"
        ]
      ],
      "noteTitle": "\u7B14\u8BB0\u6807\u9898",
      "notes": [
        "\u7B14\u8BB0\u5185\u5BB9 A",
        "\u7B14\u8BB0\u5185\u5BB9 B",
        "\u7B14\u8BB0\u5185\u5BB9 C"
      ],
      "webEyebrow": "\u680F\u76EE / \u9875\u9762",
      "noteDate": "2026\u5E741\u67085\u65E5 09:41",
      "checklist": [
        "\u5F85\u529E\u5185\u5BB9 A",
        "\u5F85\u529E\u5185\u5BB9 B"
      ]
    }, (p, h) => pad(h, `<div class="am-pad-split"><section class="am-pad-browser"><div class="am-pad-multi">\u2022\u2022\u2022</div><nav>${ai(h, "panel")}${ai(h, "chevron-left")}${ai(h, "chevron-right")}<span>${ai(h, "lock", 12)} ${h.esc(p.url)}</span>${ai(h, "share")}${ai(h, "plus")}</nav><article><small>${h.esc(p.webEyebrow)}</small><h1>${h.esc(p.webTitle)}</h1><p>${h.esc(p.webIntro)}</p>${array2(p.sections, 5).map((s2, i) => `<section data-motion="item"><b>0${i + 1}</b><h2>${h.esc(s2[0])}</h2><p>${h.esc(s2[1])}</p></section>`).join("")}</article></section><div class="am-pad-divider"><i></i></div><section class="am-pad-note"><div class="am-pad-multi">\u2022\u2022\u2022</div><nav>${ai(h, "panel")}<span></span>${ai(h, "share")}${ai(h, "edit")}</nav><article><small>${h.esc(p.noteDate)}</small><h1>${h.esc(p.noteTitle)}</h1>${array2(p.notes, 7).map((x) => `<p data-motion="item">${h.esc(x)}</p>`).join("")}${array2(p.checklist, 2).map((x) => `<div class="am-pad-note-check">\u25CB\u3000${h.esc(x)}</div>`).join("")}</article></section></div>`), true),
    component("ipad-files", "iPad \xB7 \u6587\u4EF6 App", "iPad \u539F\u751F\u4FA7\u680F\u3001\u6D4F\u89C8\u5BFC\u822A\u3001\u6587\u4EF6\u7F29\u7565\u56FE\u4E0E\u9009\u62E9\u6A21\u5F0F\u3002", {
      "folder": "\u793A\u4F8B\u6587\u4EF6\u5939",
      "location": "iCloud \u4E91\u76D8",
      "files": [
        {
          "name": "\u6587\u4EF6\u5939 A",
          "type": "folder",
          "detail": "4 \u4E2A\u9879\u76EE"
        },
        {
          "name": "\u6587\u4EF6\u5939 B",
          "type": "folder",
          "detail": "8 \u4E2A\u9879\u76EE"
        },
        {
          "name": "\u793A\u4F8B\u6587\u6863.pdf",
          "type": "file",
          "detail": "1.2 MB"
        },
        {
          "name": "\u793A\u4F8B\u6570\u636E.csv",
          "type": "file",
          "detail": "8 KB"
        },
        {
          "name": "\u6587\u4EF6\u5939 C",
          "type": "folder",
          "detail": "6 \u4E2A\u9879\u76EE"
        },
        {
          "name": "\u793A\u4F8B\u97F3\u9891.wav",
          "type": "music",
          "detail": "24 MB"
        },
        {
          "name": "README.md",
          "type": "file",
          "detail": "4 KB"
        },
        {
          "name": "\u793A\u4F8B\u89C6\u9891.mov",
          "type": "video",
          "detail": "86 MB"
        }
      ],
      "favoriteLabel": "\u793A\u4F8B\u6587\u4EF6\u5939"
    }, (p, h) => pad(h, `<div class="am-files"><aside><h1>\u6D4F\u89C8</h1><label>\u4F4D\u7F6E</label>${["\u6211\u7684 iPad", "iCloud \u4E91\u76D8", "\u4E0B\u8F7D", "\u6700\u8FD1\u5220\u9664"].map((x, i) => `<p class="${x === p.location ? "active" : ""}">${ai(h, ["phone", "folder", "download", "trash"][i], 21)}${x}</p>`).join("")}<label>\u4E2A\u4EBA\u6536\u85CF</label><p>${ai(h, "folder", 21)} ${h.esc(p.favoriteLabel)}</p><label>\u6807\u7B7E</label>${["\u5DE5\u4F5C", "\u4E2A\u4EBA", "\u5F85\u5904\u7406"].map((x, i) => `<p><i style="background:${["#e56962", "#edb749", "#82baa7"][i]}"></i>${x}</p>`).join("")}</aside><main><nav><span>${ai(h, "chevron-left", 21)} ${h.esc(p.location)}</span><b>${h.esc(p.folder)}</b><span>\u9009\u62E9\u3000\u2022\u2022\u2022</span></nav><div class="am-search">${ai(h, "search", 15)} \u641C\u7D22</div><div class="am-file-controls">\u6309\u540D\u79F0\u3000\u2304<span>${ai(h, "grid", 19)}</span></div><div class="am-files-grid">${array2(p.files, 12).map((f) => `<div data-motion="item"><i class="${f.type === "folder" ? "folder" : "document"}">${ai(h, f.type, 57)}</i><b>${h.esc(f.name)}</b><small>${h.esc(f.detail)}</small></div>`).join("")}</div><footer>${array2(p.files).length} \u4E2A\u9879\u76EE</footer></main></div>`), true)
  ];

  // families/broll-graphics.mjs
  var reference4 = {
    basis: "\u539F\u521B\u684C\u9762\u7269\u4EF6\u63D2\u955C\uFF0C\u7EB8\u5F20\u3001\u4FBF\u7B7E\u548C\u7F16\u8F91\u75D5\u8FF9\u5747\u7531\u539F\u751F HTML/CSS/SVG \u7ED8\u5236\uFF1B\u4E0D\u662F\u8F6F\u4EF6\u622A\u56FE\u6216\u5B9E\u9645\u4E1A\u52A1\u8BB0\u5F55\u3002",
    source: "reports/broll-graphics-notes.md",
    level: "designed"
  };
  var list2 = (value, limit) => Array.isArray(value) ? value.slice(0, limit).filter((x) => x && typeof x === "object") : [];
  var textList = (value, limit) => Array.isArray(value) ? value.slice(0, limit) : [];
  var tones4 = ["blue", "mint", "cream", "coral"];
  var tone2 = (value, i = 0) => tones4.includes(value) ? value : tones4[i % tones4.length];
  var tick = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 12 5 5L20 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var corner = '<i class="brg-corner" aria-hidden="true"></i>';
  var pencil = '<div class="brg-pencil" aria-hidden="true"><i></i><b></b></div>';
  var clip = '<span class="brg-clip" aria-hidden="true"></span>';
  var create2 = (id, name, description, defaults3, render) => ({
    id,
    name,
    category: "B-roll \xB7 \u52A8\u753B\u63D2\u955C",
    description,
    width: 1280,
    height: 800,
    defaults: defaults3,
    defaultEffect: id + "-motion",
    reference: { ...reference4 },
    render(props, helpers2) {
      return render({ ...defaults3, ...props }, helpers2);
    }
  });
  var desk = (id, content2) => '<section class="brg-desk brg-' + id + '"><div class="brg-light" aria-hidden="true"></div>' + content2 + "</section>";
  var components17 = [
    create2("broll-brief-desk", "\u684C\u9762\u6587\u6863\u4E0E\u4FBF\u7B7E", "\u4FEF\u62CD\u7EB8\u5F20\u4E0E\u56DB\u5F20\u4FBF\u7B7E\uFF0C\u628A\u6A21\u7CCA\u4EFB\u52A1\u8865\u6210\u5BF9\u8C61\u3001\u4EFB\u52A1\u3001\u65F6\u95F4\u548C\u5165\u53E3\uFF1B\u6240\u6709\u6B63\u6587\u53EF\u7F16\u8F91\u3002", {
      "documentLabel": "\u6587\u6863 / 01",
      "title": "\u6587\u6863\u6807\u9898",
      "originalLabel": "\u5185\u5BB9\u6807\u7B7E",
      "original": "\u6B63\u6587\u5185\u5BB9\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u6587\u5B57\u3002",
      "marginNote": "\u6279\u6CE8\u5185\u5BB9",
      "checklistLabel": "\u68C0\u67E5\u9879\u6807\u9898",
      "checklist": [
        "\u68C0\u67E5\u9879 A",
        "\u68C0\u67E5\u9879 B",
        "\u68C0\u67E5\u9879 C",
        "\u68C0\u67E5\u9879 D"
      ],
      "documentNote": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "notes": [
        {
          "label": "\u5B57\u6BB5 A",
          "value": "\u5185\u5BB9 A",
          "detail": "\u8BF4\u660E\u6587\u5B57 A",
          "tone": "blue"
        },
        {
          "label": "\u5B57\u6BB5 B",
          "value": "\u5185\u5BB9 B",
          "detail": "\u8BF4\u660E\u6587\u5B57 B",
          "tone": "mint"
        },
        {
          "label": "\u5B57\u6BB5 C",
          "value": "\u5185\u5BB9 C",
          "detail": "\u8BF4\u660E\u6587\u5B57 C",
          "tone": "cream"
        },
        {
          "label": "\u5B57\u6BB5 D",
          "value": "\u5185\u5BB9 D",
          "detail": "\u8BF4\u660E\u6587\u5B57 D",
          "tone": "blue"
        }
      ]
    }, (p, h) => {
      const e2 = h.esc;
      return desk("brief", '<div class="brg-brief-paper-wrap" data-motion="item" data-broll-part="paper"><article class="brg-paper brg-brief-paper">' + clip + '<div class="brg-paper-meta">' + e2(p.documentLabel) + "</div><h2>" + e2(p.title) + '</h2><div class="brg-original"><small>' + e2(p.originalLabel) + "</small><p>" + e2(p.original) + '</p><svg class="brg-underline" viewBox="0 0 430 24" aria-hidden="true"><path data-motion="line" d="M6 10Q144 2 422 11M40 18Q241 7 382 17" fill="none" stroke="#d98371" stroke-width="2.2" stroke-linecap="round"/></svg></div><div class="brg-margin-note" data-motion="emphasis" data-broll-part="mark">' + e2(p.marginNote) + '</div><div class="brg-checklist-title">' + e2(p.checklistLabel) + '</div><div class="brg-paper-checks">' + textList(p.checklist, 4).map((x) => '<div><span data-motion="reveal" data-broll-part="tick">' + tick + "</span><p>" + e2(x) + "</p></div>").join("") + '</div><p class="brg-document-note">' + e2(p.documentNote) + "</p>" + corner + '</article></div><div class="brg-notes-grid">' + list2(p.notes, 4).map((x, i) => '<div class="brg-note-wrap brg-note-slot-' + i + '" data-motion="item" data-broll-part="note"><article class="brg-sticky brg-tone-' + tone2(x.tone, i) + '"><i class="brg-tape" aria-hidden="true"></i><div class="brg-sticky-top"><span>' + e2(x.label) + "</span><small>" + String(i + 1).padStart(2, "0") + "</small></div><strong>" + e2(x.value) + "</strong><p>" + e2(x.detail) + "</p></article></div>").join("") + "</div>" + pencil + '<div class="brg-paperclip" aria-hidden="true"></div>');
    }),
    create2("broll-message-pile", "\u6D88\u606F\u4E0E\u7ED3\u679C\u5361\u7247", "\u62BD\u8C61\u6D88\u606F\u7EB8\u6761\u5806\u79EF\u5728\u684C\u4E0A\uFF0C\u95EE\u9898\u6807\u7B7E\u4E0E\u53F3\u4FA7\u660E\u786E\u901A\u77E5\u5F62\u6210\u5BF9\u7167\uFF1B\u4E0D\u4EFF\u5192\u4EFB\u4F55\u8F6F\u4EF6\u754C\u9762\u3002", {
      "trayLabel": "\u6D88\u606F\u5217\u8868",
      "clearLabel": "\u6574\u7406\u7ED3\u679C",
      "clearTitle": "\u7ED3\u679C\u6807\u9898",
      "messages": [
        {
          "author": "\u53D1\u9001\u4EBA A",
          "text": "\u6D88\u606F\u5185\u5BB9 A",
          "question": "\u6279\u6CE8 A",
          "tone": "blue"
        },
        {
          "author": "\u53D1\u9001\u4EBA B",
          "text": "\u6D88\u606F\u5185\u5BB9 B",
          "question": "\u6279\u6CE8 B",
          "tone": "cream"
        },
        {
          "author": "\u53D1\u9001\u4EBA C",
          "text": "\u6D88\u606F\u5185\u5BB9 C",
          "question": "\u6279\u6CE8 C",
          "tone": "coral"
        }
      ],
      "fields": [
        {
          "label": "\u5B57\u6BB5 A",
          "value": "\u5185\u5BB9 A"
        },
        {
          "label": "\u5B57\u6BB5 B",
          "value": "\u5185\u5BB9 B"
        },
        {
          "label": "\u5B57\u6BB5 C",
          "value": "\u5185\u5BB9 C"
        },
        {
          "label": "\u5B57\u6BB5 D",
          "value": "\u5185\u5BB9 D"
        }
      ],
      "resultNote": "\u7ED3\u679C\u8BF4\u660E\u6587\u5B57",
      "indexLabel": "\u680F\u76EE / 02"
    }, (p, h) => {
      const e2 = h.esc;
      return desk("messages", '<div class="brg-message-backboard"><div class="brg-tray-label">' + e2(p.trayLabel) + '</div><div class="brg-grid-paper" aria-hidden="true"></div></div><div class="brg-message-pile">' + list2(p.messages, 3).map((x, i) => '<div class="brg-message-wrap brg-message-slot-' + i + '" data-motion="item" data-broll-part="message"><article class="brg-message-slip brg-tone-' + tone2(x.tone, i) + '"><div class="brg-slip-meta"><span>' + e2(x.author) + "</span><small>" + String(i + 1).padStart(2, "0") + "</small></div><p>" + e2(x.text) + '</p><span class="brg-question" data-motion="emphasis" data-broll-part="mark">' + e2(x.question) + "</span></article></div>").join("") + '</div><svg class="brg-sort-arrow" viewBox="0 0 146 130" aria-hidden="true"><path data-motion="line" d="M9 94C59 90 48 24 121 31M104 14l20 17-19 18" fill="none" stroke="#8b9f91" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 8"/></svg><div class="brg-clear-paper-wrap" data-motion="reveal" data-broll-part="paper"><article class="brg-paper brg-clear-paper"><div class="brg-green-tab">' + e2(p.clearLabel) + '</div><div class="brg-paper-meta">' + e2(p.indexLabel) + "</div><h2>" + e2(p.clearTitle) + '</h2><div class="brg-clear-fields">' + list2(p.fields, 4).map((x) => '<div data-motion="item"><span>' + e2(x.label) + "</span><strong>" + e2(x.value) + '</strong><i data-motion="reveal" data-broll-part="tick">' + tick + "</i></div>").join("") + '</div><p class="brg-clear-note">' + e2(p.resultNote) + "</p>" + corner + '</article></div><div class="brg-message-clip brg-paperclip" aria-hidden="true"></div>');
    }),
    create2("broll-revision-stack", "\u6587\u6863\u7248\u672C\u53E0\u5C42", "\u4E09\u7248\u7A3F\u7EB8\u548C\u84DD\u8272\u6807\u6CE8\u5448\u73B0\u9010\u6B21\u4FEE\u8BA2\uFF0C\u6700\u65B0\u4E00\u9875\u5F62\u6210\u53EF\u6838\u5BF9\u6E05\u5355\uFF1B\u7248\u672C\u3001\u7F3A\u53E3\u3001\u6B63\u6587\u5747\u53EF\u66FF\u6362\u3002", {
      "earlier": [
        {
          "version": "v1",
          "label": "\u7248\u672C\u8BF4\u660E A",
          "title": "\u6587\u6863\u6807\u9898 A",
          "lines": [
            "\u6B63\u6587\u5185\u5BB9 A",
            "\u6B63\u6587\u5185\u5BB9 B"
          ],
          "gap": "\u4FEE\u6539\u6807\u8BB0",
          "note": "\u6279\u6CE8\u5185\u5BB9"
        },
        {
          "version": "v2",
          "label": "\u7248\u672C\u8BF4\u660E B",
          "title": "\u6587\u6863\u6807\u9898 B",
          "lines": [
            "\u6B63\u6587\u5185\u5BB9 A",
            "\u6B63\u6587\u5185\u5BB9 B"
          ],
          "gap": "\u4FEE\u6539\u6807\u8BB0",
          "note": "\u6279\u6CE8\u5185\u5BB9"
        }
      ],
      "latestVersion": "v3",
      "latestLabel": "\u7248\u672C\u8BF4\u660E C",
      "latestTitle": "\u6587\u6863\u6807\u9898 C",
      "checks": [
        {
          "label": "\u5B57\u6BB5 A",
          "value": "\u5185\u5BB9 A"
        },
        {
          "label": "\u5B57\u6BB5 B",
          "value": "\u5185\u5BB9 B"
        },
        {
          "label": "\u5B57\u6BB5 C",
          "value": "\u5185\u5BB9 C"
        },
        {
          "label": "\u5B57\u6BB5 D",
          "value": "\u5185\u5BB9 D"
        }
      ],
      "stamp": "\u5DF2\u6838\u5BF9",
      "bottomNote": "\u8865\u5145\u8BF4\u660E\u6587\u5B57"
    }, (p, h) => {
      const e2 = h.esc;
      return desk("revisions", '<div class="brg-revision-shadow" aria-hidden="true"></div>' + list2(p.earlier, 2).map((x, i) => '<div class="brg-revision-wrap brg-old-revision brg-revision-' + i + '" data-motion="item" data-broll-part="paper"><article class="brg-paper brg-revision-paper"><div class="brg-version">' + e2(x.version) + "</div><small>" + e2(x.label) + "</small><h2>" + e2(x.title) + '</h2><div class="brg-draft-lines">' + textList(x.lines, 3).map((line3) => "<p>" + e2(line3) + "</p>").join("") + '</div><div class="brg-red-gap" data-motion="emphasis" data-broll-part="mark"><span>' + e2(x.gap) + '</span><svg viewBox="0 0 260 63" aria-hidden="true"><path data-motion="line" d="M243 17C198-1 38-3 15 26S78 60 162 55 259 36 244 20C220 8 190 4 169 7" fill="none" stroke="#cb8271" stroke-width="2.1" stroke-linecap="round"/></svg></div><p class="brg-red-note">' + e2(x.note) + '</p><div class="brg-ruled-filler" aria-hidden="true"></div>' + corner + "</article></div>").join("") + '<div class="brg-revision-wrap brg-latest-revision" data-motion="reveal" data-broll-part="paper"><article class="brg-paper brg-revision-paper"><div class="brg-version brg-version-final">' + e2(p.latestVersion) + "</div><small>" + e2(p.latestLabel) + "</small><h2>" + e2(p.latestTitle) + '</h2><div class="brg-revision-checks">' + list2(p.checks, 4).map((x) => '<div><span data-motion="reveal" data-broll-part="tick">' + tick + "</span><p><small>" + e2(x.label) + "</small><strong>" + e2(x.value) + "</strong></p></div>").join("") + '</div><span class="brg-stamp" data-motion="emphasis" data-broll-part="mark">' + e2(p.stamp) + "</span>" + corner + '</article></div><div class="brg-revision-bottom" data-motion="reveal">' + e2(p.bottomNote) + '</div><div class="brg-red-pencil">' + pencil + "</div>");
    })
  ];

  // families/broll-media.mjs
  var reference5 = { level: "designed", basis: "\u539F\u521B B-roll \u7F16\u6392\uFF1B\u793A\u4F8B\u7167\u7247\u4E0E\u89C6\u9891\u4E3A\u8BB8\u53EF\u660E\u786E\u7684\u7D20\u6750\uFF0C\u6765\u6E90\u89C1 assets/broll/CREDITS.md\u3002\u4E0D\u662F\u672C\u671F\u771F\u5B9E\u5DE5\u4F5C\u8BB0\u5F55\u3002", source: "assets/broll/CREDITS.md" };
  var clamp = (v, min, max, d) => Number.isFinite(Number(v)) ? Math.min(max, Math.max(min, Number(v))) : d;
  var array3 = (v, max = 5) => Array.isArray(v) ? v.slice(0, max) : [];
  function local(value) {
    const path2 = String(value || "").replaceAll("\\", "/");
    if (!path2 || /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(path2) || /[\u0000-\u001f]/.test(path2)) throw Error("B-roll \u7D20\u6750\u5FC5\u987B\u4F7F\u7528\u5DE5\u7A0B\u5185\u76F8\u5BF9\u8DEF\u5F84");
    for (const part2 of path2.split("/")) {
      let decoded = part2;
      try {
        decoded = decodeURIComponent(part2);
      } catch {
      }
      if (decoded === ".." || decoded === "." || decoded.includes("/") || decoded.includes("\\")) throw Error("B-roll \u7D20\u6750\u8DEF\u5F84\u4E0D\u5F97\u8D8A\u8FC7\u5DE5\u7A0B\u76EE\u5F55");
    }
    return path2;
  }
  function media(m, h, suffix = "media") {
    const src = h.esc(local(m.src || m.mediaSrc)), x = clamp(m.x, 0, 100, 50), y = clamp(m.y, 0, 100, 50), style = `object-position:${x}% ${y}%`, label3 = h.esc(m.alt || "\u53EF\u66FF\u6362 B-roll \u7D20\u6750");
    return m.type === "video" ? `<video id="${h.uid(suffix)}" class="brm-asset" src="${src}" muted playsinline preload="auto" data-media-start="${clamp(m.mediaStart, 0, 86400, 0)}" data-volume="0" aria-label="${label3}" style="${style}"></video>` : `<img class="brm-asset" src="${src}" alt="${label3}" style="${style}">`;
  }
  function tag(text7, h) {
    return text7 ? `<span class="brm-tag">${h.esc(text7)}</span>` : "";
  }
  var components18 = [
    {
      id: "broll-cutaway",
      name: "B-roll \xB7 \u5B9E\u666F\u5207\u955C",
      category: "B-roll \xB7 \u771F\u5B9E\u7D20\u6750",
      description: "\u53EF\u6362\u7D20\u6750\u7684\u5168\u5C4F\u5207\u955C\u6846\u67B6\u3002\u56FE\u7247\u3001\u89C6\u9891\u3001\u5B57\u5E55\u4E0E\u53D6\u666F\u5747\u7531\u672C\u671F\u5185\u5BB9\u51B3\u5B9A\uFF1B\u529E\u516C\u753B\u9762\u4EC5\u4E3A\u6F14\u793A\uFF0C\u4E0D\u9650\u5B9A\u9898\u6750\u3002",
      width: 1280,
      height: 800,
      reference: reference5,
      defaults: {
        "eyebrow": "\u680F\u76EE / 01",
        "title": "\u4E3B\u6807\u9898",
        "caption": "\u5B57\u5E55\u8BF4\u660E\u6587\u5B57",
        "mediaSrc": "assets/broll/office.mp4",
        "mediaType": "video",
        "mediaAlt": "\u529E\u516C\u684C\u524D\u4F7F\u7528\u952E\u76D8\u7684\u5B9E\u62CD\u7D20\u6750",
        "mediaX": 50,
        "mediaY": 50,
        "mediaStart": 0,
        "showCaption": true,
        "tag": "\u793A\u4F8B\u6807\u7B7E"
      },
      render(props, h) {
        const p = { ...this.defaults, ...props };
        return `<section class="brm-scene brm-cutaway"><div class="brm-shot-window"><div class="brm-shot-motion" data-broll-part="camera" data-motion="focus">${media({ src: p.mediaSrc, type: p.mediaType, alt: p.mediaAlt, x: p.mediaX, y: p.mediaY, mediaStart: p.mediaStart }, h)}</div></div><div class="brm-cutaway-top"><span>${h.esc(p.eyebrow)}</span>${tag(p.tag, h)}</div>${p.showCaption ? `<div class="brm-caption" data-broll-part="caption" data-motion="reveal"><div class="brm-rule"></div><h2>${h.esc(p.title)}</h2><p>${h.esc(p.caption)}</p></div>` : ""}</section>`;
      }
    },
    {
      id: "broll-sequence",
      name: "B-roll \xB7 \u4E09\u955C\u5934\u7EC4\u63A5",
      category: "B-roll \xB7 \u771F\u5B9E\u7D20\u6750",
      description: "\u4E09\u4E2A\u53EF\u72EC\u7ACB\u6362\u56FE\u6216\u89C6\u9891\u7684\u5E76\u6392\u7D20\u6750\u69FD\u3002\u53EA\u56FA\u5B9A\u5E03\u5C40\u4E0E\u52A8\u6548\uFF0C\u4E0D\u9650\u5B9A\u7D20\u6750\u9898\u6750\uFF1B\u7528\u4E8E\u8FC7\u7A0B\u3001\u5BF9\u7167\u4E0E\u5F52\u7EB3\u3002",
      width: 1280,
      height: 800,
      reference: reference5,
      defaults: {
        "eyebrow": "\u680F\u76EE / 02",
        "title": "\u4E3B\u6807\u9898",
        "caption": "\u5B57\u5E55\u8BF4\u660E\u6587\u5B57",
        "media": [
          {
            "src": "assets/broll/planning.jpg",
            "type": "image",
            "alt": "\u7EB8\u4E0A\u8BB0\u5F55\u8BA1\u5212",
            "label": "\u753B\u9762 A",
            "detail": "\u753B\u9762\u8BF4\u660E A",
            "x": 50,
            "y": 50
          },
          {
            "src": "assets/broll/keyboard.jpg",
            "type": "image",
            "alt": "\u952E\u76D8\u64CD\u4F5C",
            "label": "\u753B\u9762 B",
            "detail": "\u753B\u9762\u8BF4\u660E B",
            "x": 50,
            "y": 50
          },
          {
            "src": "assets/broll/teamwork.jpg",
            "type": "image",
            "alt": "\u56E2\u961F\u534F\u4F5C\u8BA8\u8BBA",
            "label": "\u753B\u9762 C",
            "detail": "\u753B\u9762\u8BF4\u660E C",
            "x": 50,
            "y": 50
          }
        ]
      },
      render(props, h) {
        const p = { ...this.defaults, ...props }, shots = array3(p.media, 3);
        if (shots.length !== 3) throw Error("\u4E09\u955C\u5934\u7EC4\u63A5\u9700\u8981\u4E09\u4E2A media \u7D20\u6750");
        return `<section class="brm-scene brm-sequence"><header class="brm-editorial-head"><span>${h.esc(p.eyebrow)}</span><span>01 \u2014 03</span></header><div class="brm-three">${shots.map((m, i) => `<figure class="brm-frame" data-broll-part="shot" data-motion="item"><div class="brm-panel-media"><div class="brm-shot-motion" data-broll-part="camera">${media(m, h, "shot-" + i)}</div></div><figcaption><span class="brm-shot-no">0${i + 1}</span><div><strong>${h.esc(m.label)}</strong><p>${h.esc(m.detail)}</p></div></figcaption></figure>`).join("")}</div><footer class="brm-sequence-footer"><h2>${h.esc(p.title)}</h2><p>${h.esc(p.caption)}</p></footer></section>`;
      }
    },
    {
      id: "broll-detail",
      name: "B-roll \xB7 \u7D20\u6750\u5C40\u90E8\u805A\u7126",
      category: "B-roll \xB7 \u771F\u5B9E\u7D20\u6750",
      description: "\u7167\u7247\u7559\u5728\u4E3B\u753B\u9762\uFF0C\u6807\u8BB0\u4E00\u4E2A\u89C2\u5BDF\u533A\u57DF\u5E76\u914D\u4E09\u6761\u7B80\u77ED\u65C1\u767D\u63D0\u793A\u3002\u805A\u7126\u6846\u4F4D\u7F6E\u53EF\u8C03\uFF1B\u6807\u6CE8\u4E0D\u5192\u5145\u7167\u7247\u4E2D\u771F\u5B9E\u6587\u5B57\u3002",
      width: 1280,
      height: 800,
      reference: reference5,
      defaults: {
        "eyebrow": "\u680F\u76EE / 03",
        "title": "\u4E3B\u6807\u9898",
        "mediaSrc": "assets/broll/planning.jpg",
        "mediaType": "image",
        "mediaAlt": "\u5DE5\u4F5C\u8BA1\u5212\u4E0E\u7B14\u8BB0\u7684\u5B9E\u62CD\u7D20\u6750",
        "mediaX": 50,
        "mediaY": 50,
        "focusX": 70,
        "focusY": 56,
        "focusWidth": 31,
        "focusHeight": 47,
        "focusLabel": "\u5C40\u90E8\u6807\u6CE8",
        "notes": [
          {
            "label": "\u8981\u70B9 A",
            "text": "\u8981\u70B9\u5185\u5BB9 A"
          },
          {
            "label": "\u8981\u70B9 B",
            "text": "\u8981\u70B9\u5185\u5BB9 B"
          },
          {
            "label": "\u8981\u70B9 C",
            "text": "\u8981\u70B9\u5185\u5BB9 C"
          }
        ],
        "footer": "\u9875\u811A\u8BF4\u660E\u6587\u5B57"
      },
      render(props, h) {
        const p = { ...this.defaults, ...props }, w = clamp(p.focusWidth, 10, 75, 30), ht = clamp(p.focusHeight, 10, 65, 30), x = clamp(p.focusX, w / 2, 100 - w / 2, 45), y = clamp(p.focusY, ht / 2, 100 - ht / 2, 48);
        return `<section class="brm-scene brm-detail"><header class="brm-editorial-head"><span>${h.esc(p.eyebrow)}</span><span>DETAIL / 01</span></header><div class="brm-detail-layout"><div class="brm-detail-image"><div class="brm-shot-motion" data-broll-part="camera">${media({ src: p.mediaSrc, type: p.mediaType, alt: p.mediaAlt, x: p.mediaX, y: p.mediaY, mediaStart: p.mediaStart }, h)}</div><div class="brm-focus-box" data-broll-part="focus" data-motion="focus" style="left:${x - w / 2}%;top:${y - ht / 2}%;width:${w}%;height:${ht}%"><i></i><i></i><i></i><i></i></div><div class="brm-focus-label" data-broll-part="caption">${h.esc(p.focusLabel)}</div></div><aside class="brm-observation"><h2>${h.esc(p.title)}</h2>${array3(p.notes, 3).map((n4, i) => `<div class="brm-note" data-broll-part="note" data-motion="item"><span>0${i + 1} / ${h.esc(n4.label)}</span><p>${h.esc(n4.text)}</p></div>`).join("")}<small>${h.esc(p.footer)}</small></aside></div></section>`;
      }
    }
  ];

  // broll-workflow-primitives.mjs
  var workflowLayouts = Object.freeze({
    scan: { sourceSide: ["left", "right"], resultLayout: ["rows", "cards"] },
    search: { sourceSide: ["left", "right"] },
    voice: { sourceSide: ["left", "right"], resultLayout: ["rows", "cards"] }
  });
  function workflowChoice(value, allowed, path2) {
    if (!allowed.includes(value)) throw Error(`${path2}: expected ${allowed.join(" | ")}`);
    return value;
  }
  function workflowItems(value, path2, min, max) {
    if (!Array.isArray(value) || value.length < min || value.length > max) throw Error(`${path2}: requires ${min}\u2013${max} items; content is never silently truncated`);
    return value;
  }
  function workflowColumns(kind, props, { source: source2, result, connector = "" }) {
    const layout = workflowLayouts[kind];
    if (!layout) throw Error("Unknown workflow layout: " + kind);
    const side = workflowChoice(props.sourceSide ?? "left", layout.sourceSide, "sourceSide");
    const resultLayout = layout.resultLayout ? workflowChoice(props.resultLayout ?? "rows", layout.resultLayout, "resultLayout") : "rows";
    return `<div class="brw-body brw-${kind}" data-workflow-layout="${kind}" data-source-side="${side}" data-result-layout="${resultLayout}">${source2}${connector}${result}</div>`;
  }
  function workflowResultItems(items, { kind, layout = "rows" }, h) {
    workflowChoice(kind, ["fields", "transcript"], "result kind");
    workflowChoice(layout, ["rows", "cards"], "resultLayout");
    return items.map((item) => kind === "fields" ? `<div class="brw-field" data-motion="item" data-broll-part="result"><span>${h.esc(item.label)}</span><strong>${h.esc(item.value)}</strong></div>` : `<div class="brw-transcript-line" data-motion="item" data-broll-part="transcript"><span>${h.esc(item.time)}</span><p>${h.esc(item.text)}</p></div>`).join("");
  }
  var workflowLayoutCSS = `
[data-workflow-layout][data-source-side="right"]>[data-workflow-slot="source"]{grid-column:2;grid-row:1}
[data-workflow-layout][data-source-side="right"]>[data-workflow-slot="result"]{grid-column:1;grid-row:1}
.brw-scan[data-source-side="right"]>[data-workflow-slot="source"]{grid-column:3}
.brw-scan[data-source-side="right"]>.brw-transfer{grid-column:2;grid-row:1}
.brw-scan[data-source-side="right"]>.brw-transfer svg{transform:rotate(180deg)}
.brw-search[data-source-side="right"]{grid-template-columns:1fr 620px}
.brw-voice[data-source-side="right"]{grid-template-columns:1fr 520px}
.brw-search[data-source-side="right"]>.brw-excerpt{border-left:0;border-right:3px solid #81c9b0;padding:8px 32px 8px 0}
.brw-scan[data-result-layout="cards"] .brw-result{padding:0;border:0;box-shadow:none;background:transparent;min-height:0}
.brw-scan[data-result-layout="cards"] .brw-field{background:white;border:1px solid #dce4ee;border-left:3px solid #81c9b0;padding:17px 22px;box-shadow:0 8px 18px #20365508}
.brw-voice[data-result-layout="cards"] .brw-transcript-line{display:block;border:1px solid #dce4ee;border-radius:10px;padding:14px 20px;margin-top:12px;background:#f7faff;box-shadow:0 5px 16px #20365505}
.brw-voice[data-result-layout="cards"] .brw-transcript-line>span{display:block;padding:0;margin-bottom:5px}
.brw-voice[data-result-layout="cards"] .brw-transcript-line p{font-size:20px;line-height:1.55}
`;

  // families/broll-workflows.mjs
  var rows = (value, max = 4) => Array.isArray(value) ? value.slice(0, max) : [];
  var number6 = (value, fallback, min, max) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback;
  var create3 = (id, name, description, defaults3, render) => ({
    id,
    name,
    category: "B-roll \xB7 \u52A8\u753B\u63D2\u955C",
    description,
    width: 1280,
    height: 800,
    defaultEffect: id + "-motion",
    defaults: defaults3,
    reference: { basis: "\u539F\u521B\u62BD\u8C61\u5DE5\u4F5C\u573A\u666F\uFF1B\u6240\u6709\u6587\u5B57\u53EF\u66FF\u6362\uFF0C\u52A8\u753B\u4EC5\u6F14\u793A\u64CD\u4F5C\u8FC7\u7A0B\uFF0C\u4E0D\u4EE3\u8868\u771F\u5B9E\u8F6F\u4EF6\u7ED3\u679C\u3002", source: "BROLL_WORKFLOWS_GUIDE.md", level: "designed" },
    render(props, h) {
      const p = { ...defaults3, ...props };
      return `<section class="brw-scene"><header class="brw-heading"><span>${h.esc(p.eyebrow)}</span><h2>${h.esc(p.title)}</h2><p>${h.esc(p.subtitle)}</p></header>${render(p, h)}<footer class="brw-footer">${h.esc(p.footer)}</footer></section>`;
    }
  });
  var common6 = { eyebrow: "\u5DE5\u4F5C\u8FC7\u7A0B / \u793A\u610F", subtitle: "\u66FF\u6362\u4E3A\u672C\u671F\u9700\u8981\u8BF4\u660E\u7684\u52A8\u4F5C\u4E0E\u5185\u5BB9", footer: "\u52A8\u753B\u793A\u610F \xB7 \u5185\u5BB9\u53EF\u7F16\u8F91" };
  var components19 = [
    create3("broll-document-scan", "\u6587\u6863\u626B\u63CF\u4E0E\u5B57\u6BB5\u63D0\u53D6", "\u626B\u63CF\u7EBF\u8BFB\u8FC7\u539F\u7A3F\uFF0C\u6587\u5B57\u9010\u9879\u843D\u5165\u53F3\u4FA7\u7ED3\u679C\uFF1B\u7528\u4E8E\u8BC6\u522B\u3001\u6458\u5F55\u4E0E\u7ED3\u6784\u5316\u8FC7\u7A0B\u3002", {
      ...common6,
      title: "\u6587\u6863\u626B\u63CF\u4E0E\u5B57\u6BB5\u63D0\u53D6",
      sourceSide: "left",
      resultLayout: "rows",
      documentLabel: "\u8F93\u5165\u6587\u6863",
      documentTitle: "\u539F\u59CB\u5185\u5BB9\u6807\u9898",
      lines: ["\u539F\u59CB\u5185\u5BB9\u7B2C\u4E00\u884C", "\u539F\u59CB\u5185\u5BB9\u7B2C\u4E8C\u884C", "\u539F\u59CB\u5185\u5BB9\u7B2C\u4E09\u884C", "\u539F\u59CB\u5185\u5BB9\u7B2C\u56DB\u884C"],
      resultLabel: "\u63D0\u53D6\u7ED3\u679C",
      fields: [{ label: "\u5B57\u6BB5 A", value: "\u63D0\u53D6\u5185\u5BB9 A" }, { label: "\u5B57\u6BB5 B", value: "\u63D0\u53D6\u5185\u5BB9 B" }, { label: "\u5B57\u6BB5 C", value: "\u63D0\u53D6\u5185\u5BB9 C" }],
      status: "\u7B49\u5F85\u6838\u5BF9"
    }, (p, h) => workflowColumns("scan", p, {
      source: `<article class="brw-sheet" data-workflow-slot="source" data-broll-part="source"><small>${h.esc(p.documentLabel)}</small><h3>${h.esc(p.documentTitle)}</h3><div class="brw-lines">${workflowItems(p.lines, "lines", 1, 4).map((x) => `<p>${h.esc(x)}</p>`).join("")}</div><div class="brw-scan-beam" data-broll-part="scanner"></div></article>`,
      connector: `<div class="brw-transfer" data-broll-part="link">${h.icon("arrow-right", 42)}</div>`,
      result: `<article class="brw-result" data-workflow-slot="result"><small>${h.esc(p.resultLabel)}</small>${workflowResultItems(workflowItems(p.fields, "fields", 1, 3), { kind: "fields", layout: p.resultLayout }, h)}<div class="brw-status" data-broll-part="done">${h.icon("check", 20)} ${h.esc(p.status)}</div></article>`
    })),
    create3("broll-search-focus", "\u68C0\u7D22\u4E0E\u7ED3\u679C\u5B9A\u4F4D", "\u68C0\u7D22\u8BCD\u5C55\u5F00\uFF0C\u5149\u6807\u9009\u4E2D\u4E00\u6761\u7ED3\u679C\uFF0C\u518D\u5C55\u5F00\u5BF9\u5E94\u6458\u5F55\uFF1B\u9002\u5408\u67E5\u627E\u8D44\u6599\u4E0E\u5B9A\u4F4D\u8BC1\u636E\u3002", {
      ...common6,
      title: "\u68C0\u7D22\u4E0E\u7ED3\u679C\u5B9A\u4F4D",
      sourceSide: "left",
      query: "\u68C0\u7D22\u5173\u952E\u8BCD",
      selected: 1,
      results: [{ title: "\u8D44\u6599\u6807\u9898 A", source: "\u6765\u6E90\u6807\u7B7E A" }, { title: "\u8D44\u6599\u6807\u9898 B", source: "\u6765\u6E90\u6807\u7B7E B" }, { title: "\u8D44\u6599\u6807\u9898 C", source: "\u6765\u6E90\u6807\u7B7E C" }],
      excerptLabel: "\u9009\u4E2D\u5185\u5BB9",
      excerptTitle: "\u6458\u5F55\u6807\u9898",
      excerpt: "\u66FF\u6362\u4E3A\u4E0E\u672C\u671F\u8BB2\u89E3\u76F8\u5173\u7684\u6458\u5F55\u5185\u5BB9\u3002",
      sourceNote: "\u586B\u5199\u771F\u5B9E\u6765\u6E90\u4E0E\u65E5\u671F"
    }, (p, h) => {
      const items = workflowItems(p.results, "results", 1, 3), selected = p.selected;
      if (!Number.isInteger(selected) || selected < 0 || selected >= items.length) throw Error(`selected: expected an integer in 0\u2013${items.length - 1}`);
      return workflowColumns("search", p, {
        source: `<div class="brw-search-list" data-workflow-slot="source"><div class="brw-query">${h.icon("search", 26)}<strong data-broll-part="query">${h.esc(p.query)}</strong></div>${items.map((x, i) => `<article class="brw-search-row" data-motion="item" data-broll-part="hit"><div><h3>${h.esc(x.title)}</h3><small>${h.esc(x.source)}</small></div>${i === selected ? '<i class="brw-selection" data-broll-part="selection"></i>' : ""}</article>`).join("")}<div class="brw-pointer" style="top:${118 + selected * 98}px" data-broll-part="pointer">${h.icon("arrow-up", 32)}</div></div>`,
        result: `<article class="brw-excerpt" data-workflow-slot="result" data-broll-part="excerpt"><span class="brw-icon-disc">${h.icon("file", 32)}</span><small>${h.esc(p.excerptLabel)}</small><h3>${h.esc(p.excerptTitle)}</h3><p>${h.esc(p.excerpt)}</p><div class="brw-source-note">${h.esc(p.sourceNote)}</div></article>`
      });
    }),
    create3("broll-calendar-pin", "\u65E5\u5386\u6392\u671F\u4E0E\u843D\u70B9", "\u65E5\u5386\u7FFB\u5165\u3001\u65E5\u671F\u9501\u5B9A\u3001\u4EFB\u52A1\u6761\u843D\u4F4D\uFF1B\u9002\u5408\u622A\u6B62\u65E5\u671F\u3001\u9884\u7EA6\u4E0E\u8BA1\u5212\u5B89\u6392\u7684\u63D2\u955C\u3002", {
      ...common6,
      title: "\u65E5\u5386\u6392\u671F\u4E0E\u843D\u70B9",
      calendarLabel: "\u56DB\u5468\u6392\u671F\u793A\u610F",
      weekdays: ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"],
      selectedDay: 18,
      eventLabel: "\u5B89\u6392\u4E8B\u9879",
      eventTitle: "\u4EFB\u52A1\u540D\u79F0",
      dateLabel: "\u586B\u5199\u5B9E\u9645\u65E5\u671F",
      timeLabel: "\u586B\u5199\u8D77\u6B62\u65F6\u95F4",
      note: "\u8865\u5145\u5B89\u6392\u8BF4\u660E",
      status: "\u8BA1\u5212\u5DF2\u843D\u4F4D"
    }, (p, h) => `<div class="brw-body brw-calendar"><article class="brw-calendar-board" data-broll-part="calendar"><div class="brw-calendar-title">${h.icon("calendar", 28)}<strong>${h.esc(p.calendarLabel)}</strong></div><div class="brw-weekdays">${rows(p.weekdays, 7).map((x) => `<span>${h.esc(x)}</span>`).join("")}</div><div class="brw-days">${Array.from({ length: 28 }, (_, i) => `<div class="brw-day">${i + 1}${i + 1 === Math.round(number6(p.selectedDay, 18, 1, 28)) ? '<i data-broll-part="date"></i>' : ""}</div>`).join("")}</div></article><article class="brw-event" data-broll-part="event"><small>${h.esc(p.eventLabel)}</small><h3>${h.esc(p.eventTitle)}</h3><strong>${h.esc(p.dateLabel)}</strong><div class="brw-time-chip" data-broll-part="time">${h.icon("clock", 20)}${h.esc(p.timeLabel)}</div><p>${h.esc(p.note)}</p><div class="brw-status" data-broll-part="done">${h.icon("check", 20)}${h.esc(p.status)}</div></article></div>`),
    create3("broll-folder-sort", "\u6587\u4EF6\u5206\u7C7B\u4E0E\u5F52\u6863", "\u4E09\u5F20\u6587\u4EF6\u5206\u522B\u6ED1\u5165\u5BF9\u5E94\u76EE\u5F55\uFF0C\u5F52\u6863\u6807\u7B7E\u4F9D\u6B21\u843D\u4E0B\uFF1B\u9002\u5408\u7D20\u6750\u6574\u7406\u3001\u77E5\u8BC6\u5206\u7C7B\u4E0E\u5F52\u6863\u3002", {
      ...common6,
      title: "\u6587\u4EF6\u5206\u7C7B\u4E0E\u5F52\u6863",
      groups: [{ file: "\u6587\u4EF6 A", detail: "\u6587\u4EF6\u5185\u5BB9\u6458\u8981 A", folder: "\u5206\u7C7B\u76EE\u5F55 A", status: "\u5F52\u6863\u6807\u7B7E A" }, { file: "\u6587\u4EF6 B", detail: "\u6587\u4EF6\u5185\u5BB9\u6458\u8981 B", folder: "\u5206\u7C7B\u76EE\u5F55 B", status: "\u5F52\u6863\u6807\u7B7E B" }, { file: "\u6587\u4EF6 C", detail: "\u6587\u4EF6\u5185\u5BB9\u6458\u8981 C", folder: "\u5206\u7C7B\u76EE\u5F55 C", status: "\u5F52\u6863\u6807\u7B7E C" }]
    }, (p, h) => `<div class="brw-body brw-archive">${rows(p.groups, 3).map((x, i) => `<div class="brw-archive-slot"><article class="brw-archive-paper" data-motion="item" data-broll-part="file">${h.icon("file", 30)}<h3>${h.esc(x.file)}</h3><p>${h.esc(x.detail)}</p><div class="brw-paper-lines"><i></i><i></i><i></i></div></article><div class="brw-folder ${i === 1 ? "brw-mint" : ""}"><i></i>${h.icon("folder", 26)}<strong>${h.esc(x.folder)}</strong></div><div class="brw-archive-status" data-broll-part="tag">${h.icon("check", 18)}${h.esc(x.status)}</div></div>`).join("")}</div>`),
    create3("broll-edit-timeline", "\u526A\u8F91\u8F68\u9053\u4E0E\u64AD\u653E\u5934", "\u56FE\u50CF\u3001\u8BB2\u89E3\u548C\u58F0\u97F3\u8F68\u9053\u6309\u6B21\u5E8F\u94FA\u5F00\uFF0C\u64AD\u653E\u5934\u7A7F\u8FC7\u7EC4\u5408\uFF1B\u9002\u5408\u89E3\u91CA\u6DF7\u526A\u4E0E\u591A\u8F68\u534F\u4F5C\u3002", {
      ...common6,
      title: "\u526A\u8F91\u8F68\u9053\u4E0E\u64AD\u653E\u5934",
      ruler: ["\u8D77\u70B9", "\u8282\u70B9 A", "\u8282\u70B9 B", "\u8282\u70B9 C", "\u7EC8\u70B9"],
      tracks: [{ label: "\u753B\u9762\u8F68\u9053", clips: [{ label: "\u753B\u9762 A", start: 0, end: 0.3 }, { label: "\u753B\u9762 B", start: 0.32, end: 0.64 }, { label: "\u753B\u9762 C", start: 0.66, end: 1 }] }, { label: "\u8BB2\u89E3\u8F68\u9053", clips: [{ label: "\u8BB2\u89E3\u6BB5\u843D A", start: 0.04, end: 0.46 }, { label: "\u8BB2\u89E3\u6BB5\u843D B", start: 0.49, end: 0.96 }] }, { label: "\u58F0\u97F3\u8F68\u9053", clips: [{ label: "\u97F3\u4E50\u6216\u73AF\u5883\u58F0", start: 0, end: 1 }] }],
      note: "\u793A\u610F\u8F68\u9053 \xB7 \u4E0D\u5305\u542B\u771F\u5B9E\u5A92\u4F53"
    }, (p, h) => `<div class="brw-body brw-edit"><div class="brw-ruler">${rows(p.ruler, 5).map((x) => `<span>${h.esc(x)}</span>`).join("")}</div><div class="brw-tracks">${rows(p.tracks, 3).map((track, i) => `<div class="brw-track"><div class="brw-track-name">${h.icon(["video", "mic", "volume"][i], 22)}<strong>${h.esc(track.label)}</strong></div><div class="brw-track-bed">${rows(track.clips, 5).map((x) => {
      const a2 = number6(x.start, 0, 0, 0.95), b2 = number6(x.end, 1, a2 + 0.04, 1);
      return `<div class="brw-edit-clip brw-track-tone-${i}" style="left:${a2 * 100}%;width:${(b2 - a2) * 100}%" data-motion="item" data-broll-part="clip"><span>${h.esc(x.label)}</span><div class="brw-clip-texture"></div></div>`;
    }).join("")}</div></div>`).join("")}<div class="brw-playhead" data-broll-part="playhead"><i></i></div></div><p class="brw-edit-note">${h.esc(p.note)}</p></div>`),
    create3("broll-voice-transcript", "\u8BED\u97F3\u6CE2\u5F62\u4E0E\u6587\u5B57\u843D\u7A3F", "\u6CE2\u5F62\u6E38\u6807\u626B\u8FC7\u5F55\u97F3\u793A\u610F\uFF0C\u8F6C\u5199\u6BB5\u843D\u9010\u6761\u51FA\u73B0\uFF1B\u9002\u5408\u914D\u97F3\u3001\u91C7\u8BBF\u6574\u7406\u4E0E\u5B57\u5E55\u5236\u4F5C\u3002", {
      ...common6,
      title: "\u8BED\u97F3\u6CE2\u5F62\u4E0E\u6587\u5B57\u843D\u7A3F",
      sourceSide: "left",
      resultLayout: "rows",
      audioLabel: "\u97F3\u9891\u5185\u5BB9\u793A\u610F",
      audioTitle: "\u5F55\u97F3\u7247\u6BB5\u6807\u9898",
      transcriptLabel: "\u6587\u5B57\u7A3F",
      segments: [{ time: "00:00", text: "\u7B2C\u4E00\u6BB5\u8F6C\u5199\u5185\u5BB9" }, { time: "00:02", text: "\u7B2C\u4E8C\u6BB5\u8F6C\u5199\u5185\u5BB9" }, { time: "00:04", text: "\u7B2C\u4E09\u6BB5\u8F6C\u5199\u5185\u5BB9" }],
      status: "\u6587\u5B57\u5F85\u6821\u5BF9",
      footer: "\u6CE2\u5F62\u4E0E\u65F6\u7801\u4E3A\u793A\u610F \xB7 \u672C\u7EC4\u4EF6\u4E0D\u751F\u6210\u6216\u64AD\u653E\u4EBA\u58F0"
    }, (p, h) => workflowColumns("voice", p, {
      source: `<article class="brw-audio-card" data-workflow-slot="source" data-broll-part="audio"><span class="brw-icon-disc">${h.icon("mic", 40)}</span><small>${h.esc(p.audioLabel)}</small><h3>${h.esc(p.audioTitle)}</h3><div class="brw-waveform">${Array.from({ length: 43 }, (_, i) => `<i style="height:${[22, 38, 68, 46, 90, 58, 34, 76, 100, 42, 62][i % 11]}px" data-broll-part="wave"></i>`).join("")}<div class="brw-wave-cursor" data-broll-part="cursor"></div></div></article>`,
      result: `<article class="brw-transcript" data-workflow-slot="result"><small>${h.esc(p.transcriptLabel)}</small>${workflowResultItems(workflowItems(p.segments, "segments", 1, 3), { kind: "transcript", layout: p.resultLayout }, h)}<div class="brw-status" data-broll-part="done">${h.esc(p.status)}</div></article>`
    })),
    create3("broll-focus-timer", "\u4E13\u6CE8\u8BA1\u65F6\u4E0E\u5B8C\u6210", "\u73AF\u5F62\u8BA1\u65F6\u63A8\u8FDB\uFF0C\u4EFB\u52A1\u9010\u9879\u843D\u5B9E\uFF0C\u7ED3\u675F\u6807\u8BB0\u66FF\u6362\u8D77\u59CB\u65F6\u95F4\uFF1B\u9002\u5408\u7B49\u5F85\u3001\u4E13\u6CE8\u4E0E\u5DE5\u4F5C\u9636\u6BB5\u5B8C\u6210\u3002", {
      ...common6,
      title: "\u4E13\u6CE8\u8BA1\u65F6\u4E0E\u5B8C\u6210",
      timerLabel: "\u4E13\u6CE8\u65F6\u6BB5",
      startLabel: "25:00",
      endLabel: "00:00",
      taskLabel: "\u672C\u8F6E\u4EFB\u52A1",
      tasks: ["\u5904\u7406\u4EFB\u52A1 A", "\u5904\u7406\u4EFB\u52A1 B", "\u6838\u5BF9\u7ED3\u679C"],
      status: "\u672C\u8F6E\u5B8C\u6210",
      footer: "\u65F6\u95F4\u538B\u7F29\u793A\u610F \xB7 \u65F6\u957F\u4E0E\u4EFB\u52A1\u540D\u79F0\u5747\u53EF\u66FF\u6362"
    }, (p, h) => `<div class="brw-body brw-focus"><div class="brw-timer" data-broll-part="timer"><svg viewBox="0 0 360 360" aria-hidden="true"><circle cx="180" cy="180" r="156" fill="none" stroke="#edf2f8" stroke-width="12"/><circle cx="180" cy="180" r="156" fill="none" stroke="#2563eb" stroke-width="12" stroke-linecap="round" pathLength="100" stroke-dasharray="100" transform="rotate(-90 180 180)" data-broll-part="arc"/></svg><div class="brw-time-face"><small>${h.esc(p.timerLabel)}</small><div class="brw-time-digits"><strong data-broll-part="start-time">${h.esc(p.startLabel)}</strong><strong data-broll-part="end-time">${h.esc(p.endLabel)}</strong></div><span data-broll-part="done">${h.esc(p.status)}</span></div></div><article class="brw-focus-tasks"><small>${h.esc(p.taskLabel)}</small>${rows(p.tasks, 3).map((x) => `<div class="brw-focus-task"><i data-broll-part="tick">${h.icon("check", 22)}</i><strong data-motion="item" data-broll-part="task">${h.esc(x)}</strong></div>`).join("")}</article></div>`)
  ];
  var css3 = `
.brw-scene{position:relative;width:1280px;height:800px;background:#fff;color:#1f2329;padding:48px 64px;overflow:hidden}
.brw-heading{height:146px}.brw-heading>span{font-size:13px;letter-spacing:2px;color:#2563eb}.brw-heading h2{font-size:34px;line-height:1.3;margin-top:12px;max-width:1120px;overflow-wrap:anywhere}.brw-heading p{font-size:17px;color:#657389;margin-top:12px;max-width:1120px;overflow-wrap:anywhere}
.brw-body{position:relative;height:480px}.brw-footer{position:absolute;bottom:30px;left:64px;right:64px;font-size:13px;color:#657389;line-height:1.6;overflow-wrap:anywhere}
.brw-scene small{font-size:13px;color:#64748b;letter-spacing:1px}.brw-scene h3{font-size:26px;line-height:1.45;overflow-wrap:anywhere}.brw-scene p,.brw-scene strong,.brw-scene span{overflow-wrap:anywhere}.brw-scene strong{line-height:1.5}
.brw-sheet,.brw-result{background:white;border:1px solid #dce4ee;border-radius:16px;padding:30px;box-shadow:0 12px 30px #20365508}
.brw-search{display:grid;grid-template-columns:620px 1fr;gap:54px;align-items:center}.brw-search-list{position:relative}.brw-query{height:70px;border:2px solid #2563eb;border-radius:12px;display:flex;align-items:center;gap:18px;padding:0 24px;color:#2563eb;margin-bottom:22px}.brw-query strong{font-size:21px;color:#1f2329}.brw-search-row{position:relative;height:86px;margin:12px 0;padding:13px 22px;border:1px solid #e0e6ef;border-radius:10px}.brw-search-row h3{font-size:21px;line-height:1.5}.brw-search-row small{font-size:12px}.brw-selection{position:absolute;inset:-1px;border:2px solid #2563eb;border-radius:10px;box-shadow:0 0 0 5px #2563eb0a}.brw-pointer{position:absolute;right:22px;color:#2563eb;transform:rotate(-28deg)}.brw-excerpt{border-left:3px solid #81c9b0;padding:8px 0 8px 32px}.brw-icon-disc{display:flex;align-items:center;justify-content:center;width:66px;height:66px;border-radius:50%;background:#eff5ff;color:#2563eb;margin-bottom:24px}.brw-excerpt h3{margin-top:12px}.brw-excerpt p{font-size:22px;line-height:1.85;margin-top:18px}.brw-source-note{margin-top:28px;font-size:13px;color:#657389;line-height:1.6;overflow-wrap:anywhere}
.brw-calendar{display:grid;grid-template-columns:644px 1fr;gap:60px;align-items:center}.brw-calendar-board{height:456px;border:1px solid #dce4ee;border-radius:16px;padding:24px;box-shadow:0 12px 30px #20365508}.brw-calendar-title{display:flex;align-items:center;gap:14px;color:#2563eb;font-size:21px}.brw-weekdays,.brw-days{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;text-align:center}.brw-weekdays{margin:26px 0 10px;color:#778397;font-size:13px}.brw-day{position:relative;height:61px;display:flex;align-items:center;justify-content:center;font-size:23px;background:#f7f9fc;border-radius:8px}.brw-day i{position:absolute;inset:0;border:3px solid #2563eb;border-radius:8px;background:#2563eb0b}.brw-event h3{font-size:30px;margin:16px 0 26px}.brw-event>strong{font-size:22px;color:#2563eb}.brw-time-chip{display:flex;align-items:center;gap:12px;background:#eff8f4;border-radius:8px;padding:14px 16px;margin:22px 0;font-size:18px;color:#21715d}.brw-event>p{font-size:19px;line-height:1.8}
.brw-archive{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:48px;padding:0 16px}.brw-archive-slot{position:relative;height:470px;padding:0 24px}.brw-archive-paper{position:absolute;top:96px;left:36px;right:36px;height:244px;border:1px solid #d3deef;border-radius:9px;background:white;padding:24px;box-shadow:0 8px 24px #2036550a;color:#2563eb}.brw-archive-paper h3{font-size:22px;margin-top:12px;color:#1f2329}.brw-archive-paper p{font-size:14px;color:#657389;line-height:1.6;margin-top:10px}.brw-paper-lines i{display:block;height:3px;background:#e5eaf1;margin-top:12px}.brw-paper-lines i:last-child{width:60%}.brw-folder{position:absolute;top:276px;left:0;right:0;height:128px;background:#e9f1ff;border:1px solid #bad0fa;border-radius:0 14px 14px 14px;padding:35px 24px;display:flex;align-items:center;gap:12px;color:#2563eb}.brw-folder>i{position:absolute;top:-19px;left:-1px;width:104px;height:19px;background:#e9f1ff;border:1px solid #bad0fa;border-bottom:0;border-radius:8px 12px 0 0}.brw-folder strong{font-size:21px}.brw-folder.brw-mint,.brw-folder.brw-mint>i{background:#ebf8f2;border-color:#afd9ca;color:#21715d}.brw-archive-status{position:absolute;top:427px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:8px;font-size:14px;color:#64748b}
.brw-edit{padding:14px 0}.brw-ruler{margin-left:174px;display:flex;justify-content:space-between;padding:0 12px 22px;color:#778397;font-size:13px}.brw-tracks{position:relative}.brw-track{display:grid;grid-template-columns:154px 1fr;gap:20px;height:108px;padding:12px 0}.brw-track-name{display:flex;align-items:center;gap:12px;color:#657389}.brw-track-name strong{font-size:17px}.brw-track-bed{position:relative;border-radius:9px;background:repeating-linear-gradient(90deg,#f5f7fb 0,#f5f7fb calc(25% - 1px),#dce4ee 25%);height:84px}.brw-edit-clip{position:absolute;top:4px;height:76px;border-radius:7px;background:#e7efff;border:1px solid #b9cff8;padding:12px 14px;overflow:hidden;color:#245ac0}.brw-edit-clip>span{display:block;font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.brw-track-tone-1{background:#e9f7f0;border-color:#b2dacb;color:#21715d}.brw-track-tone-2{background:#f0edff;border-color:#d3cdf4;color:#6a579a}.brw-clip-texture{height:14px;margin-top:7px;opacity:.2;background:repeating-linear-gradient(90deg,currentColor 0,currentColor 2px,transparent 2px,transparent 6px)}.brw-playhead{position:absolute;top:0;bottom:0;left:174px;width:2px;background:#2563eb}.brw-playhead>i{position:absolute;top:-8px;left:-5px;width:12px;height:13px;background:#2563eb;clip-path:polygon(0 0,100% 0,100% 55%,50% 100%,0 55%)}.brw-edit-note{margin:28px 0 0 174px;font-size:14px;color:#657389}
.brw-voice{display:grid;grid-template-columns:520px 1fr;gap:66px;align-items:center}.brw-audio-card{border:1px solid #dce4ee;border-radius:16px;padding:30px;height:414px}.brw-audio-card h3{margin-top:12px}.brw-waveform{position:relative;height:120px;display:flex;align-items:center;justify-content:space-between;margin-top:26px;overflow:hidden}.brw-waveform>i{display:block;width:5px;flex-shrink:0;border-radius:3px;background:#81c9b0}.brw-wave-cursor{position:absolute;top:0;bottom:0;left:0;width:2px;background:#2563eb}.brw-transcript-line{padding:20px 0;border-bottom:1px solid #e3e9f1;display:grid;grid-template-columns:56px 1fr;gap:18px;align-items:start}.brw-transcript-line>span{font-size:13px;color:#2563eb;padding-top:5px;font-variant-numeric:tabular-nums}.brw-transcript-line p{font-size:21px;line-height:1.7}
.brw-focus{display:grid;grid-template-columns:520px 1fr;gap:60px;align-items:center}.brw-timer{position:relative;width:388px;height:388px;margin:auto}.brw-timer>svg{width:388px;height:388px}.brw-time-face{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:22px}.brw-time-face>small{font-size:16px}.brw-time-face>span{font-size:16px;color:#21715d}.brw-time-digits{position:relative;width:260px;height:82px}.brw-time-digits strong{position:absolute;inset:0;text-align:center;font-size:58px;letter-spacing:2px;font-variant-numeric:tabular-nums}.brw-focus-tasks>small{display:block;margin-bottom:25px}.brw-focus-task{display:flex;gap:18px;align-items:center;min-height:85px;border-bottom:1px solid #e5ebf2}.brw-focus-task>i{width:36px;height:36px;border-radius:50%;background:#e8f6ef;color:#21715d;display:flex;align-items:center;justify-content:center;flex-shrink:0}.brw-focus-task strong{font-size:22px}
.brw-scan{display:grid;grid-template-columns:1fr 96px 1fr;align-items:center}.brw-sheet{height:456px;position:relative;overflow:hidden}.brw-sheet h3{margin-top:20px}.brw-lines{margin-top:26px}.brw-lines p{padding:14px 0;border-bottom:1px solid #e8edf5;font-size:19px;line-height:1.5}.brw-scan-beam{position:absolute;left:16px;right:16px;top:16px;height:44px;border-bottom:3px solid #2563eb;background:linear-gradient(transparent,#2563eb18);box-shadow:0 5px 14px #2563eb0d}.brw-transfer{color:#2563eb;text-align:center}.brw-result{min-height:412px}.brw-field{display:flex;flex-direction:column;gap:6px;padding:15px 18px;margin-top:16px;border-radius:8px;background:#f3f7ff;border-left:3px solid #81c9b0}.brw-field span{font-size:13px;color:#64748b}.brw-field strong{font-size:20px}.brw-status{display:flex;align-items:center;gap:8px;color:#21715d;margin-top:20px;font-size:15px}
.brw-weekdays,.brw-ruler{color:#657389}
${workflowLayoutCSS}
`;

  // families/codex-workflow.mjs
  var array4 = (value) => Array.isArray(value) ? value : [];
  var object = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
  var state = (value) => ["idle", "queued", "running", "complete", "error"].includes(value) ? value : "complete";
  var number7 = (value, fallback, min, max) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Number(value))) : fallback;
  var icon2 = (h, name, size = 16) => h.icon(name, size);
  function attachments(items, h, where) {
    return array4(items).length ? `<div class="cxw-attachments" data-part="${where}-attachments">${array4(items).map((entry, index) => {
      const item = typeof entry === "string" ? { name: entry } : object(entry);
      return `<div class="cxw-attachment" data-attachment-id="${h.esc(item.id || `${where}-${index}`)}" data-motion="item">${icon2(h, "file", 19)}<span><b>${h.esc(item.name || "\u6587\u4EF6")}</b>${item.detail ? `<small>${h.esc(item.detail)}</small>` : ""}</span></div>`;
    }).join("")}</div>` : "";
  }
  function teachingTable(value, h) {
    const p = object(value), columns = array4(p.columns), rows3 = array4(p.rows);
    const selected = new Set(array4(p.selectedIds).map(String)), included = new Set(array4(p.includedIds).map(String));
    return `<section class="cxw-table-result" data-part="teaching-table" data-state="${h.esc(state(p.state))}">
    <div class="cxw-table-heading"><strong>${h.esc(p.title || "\u8868\u683C\u6807\u9898")}</strong><span>${h.esc(p.badge || "\u6559\u5B66\u6570\u636E")}</span></div>
    ${p.note ? `<p class="cxw-table-note">${h.esc(p.note)}</p>` : ""}
    <div class="cxw-table-viewport"><table><thead><tr>${columns.map((c) => `<th scope="col" data-field="${h.esc(c.key)}">${h.esc(c.label || c.key)}</th>`).join("")}</tr></thead><tbody>${rows3.map((row, index) => {
      const id = String(row.id ?? row.orderId ?? index), isIncluded = included.has(id), isSelected = selected.has(id);
      return `<tr data-row-id="${h.esc(id)}" data-included="${isIncluded}" data-selected="${isSelected}" class="${isSelected ? "cxw-row-selected" : ""}" data-motion="item">${columns.map((c) => `<td data-field="${h.esc(c.key)}" data-motion="highlight">${h.esc(row[c.key] ?? "\u2014")}</td>`).join("")}</tr>`;
    }).join("")}</tbody></table></div>
    ${p.summary ? `<div class="cxw-table-summary" data-part="table-summary">${h.esc(p.summary)}</div>` : ""}
    <small class="cxw-table-disclosure">${h.esc(p.disclosure || "\u53EF\u7F16\u8F91\u6559\u5B66\u5185\u5BB9\uFF1B\u4E0D\u662F Codex \u4E13\u7528\u7EDF\u8BA1\u754C\u9762")}</small>
  </section>`;
  }
  function toolEvents(events, h) {
    return array4(events).map((value, index) => {
      const e2 = object(value), s2 = state(e2.state || e2.status), kind = e2.kind === "file" ? "file" : "command";
      return `<div class="cxw-tool-event cxw-tool-${kind}" data-tool-id="${h.esc(e2.id || `event-${index}`)}" data-state="${h.esc(s2)}" data-motion="item">
      <div class="cxw-tool-icon">${icon2(h, kind === "file" ? "file" : "terminal", 18)}</div>
      <div class="cxw-tool-copy"><div>${h.esc(e2.label || e2.summary || (kind === "file" ? "\u5DF2\u751F\u6210\u6587\u4EF6" : "\u5DF2\u8FD0\u884C\u547D\u4EE4"))}</div>${e2.command ? `<code>${h.esc(e2.command)}</code>` : ""}${e2.detail ? `<small>${h.esc(e2.detail)}</small>` : ""}</div>
      ${e2.action ? `<span class="cxw-tool-action">${h.esc(e2.action)}${icon2(h, "chevron-right", 12)}</span>` : icon2(h, "chevron-down", 12)}
    </div>`;
    }).join("");
  }
  function message(value, index, h) {
    const m = object(value), role = m.role === "user" ? "user" : "assistant", id = m.id || `message-${index}`, s2 = state(m.state);
    const paragraphs2 = Array.isArray(m.text) ? m.text : [m.text || ""];
    return `<article class="cxw-message cxw-${role}" data-message-id="${h.esc(id)}" data-role="${role}" data-state="${h.esc(s2)}" data-motion="item">
    ${role === "assistant" && m.elapsed ? `<div class="cxw-elapsed" data-part="elapsed">${h.esc(m.elapsed)}${icon2(h, "chevron-right", 12)}</div>` : ""}
    <div class="cxw-message-content">${attachments(m.attachments, h, `message-${index}`)}<div class="cxw-message-text" data-part="message-text" data-motion="reveal">${paragraphs2.map((t) => `<p>${h.esc(t)}</p>`).join("")}</div>
      ${array4(m.bullets).length ? `<ul class="cxw-message-list">${m.bullets.map((t) => `<li data-motion="highlight">${h.esc(t)}</li>`).join("")}</ul>` : ""}
      ${toolEvents(m.toolEvents, h)}
      ${m.result ? teachingTable(m.result, h) : ""}
      ${role === "assistant" && m.actions !== false ? `<div class="cxw-answer-actions" data-part="answer-actions">${icon2(h, "copy", 15)}${icon2(h, "more", 17)}</div>` : ""}
    </div>
  </article>`;
  }
  function composer(value, h) {
    const c = object(value), running = c.running === true;
    return `<div class="cxw-composer-zone" data-part="composer-zone"><div class="cxw-composer" data-part="composer" data-state="${running ? "running" : "idle"}" data-motion="focus">
    ${attachments(c.attachments, h, "composer")}
    <div class="cxw-editor ${c.draft ? "cxw-has-draft" : ""}" data-part="draft" data-motion="type">${h.esc(c.draft || c.placeholder || "\u968F\u5FC3\u8F93\u5165")}</div>
    <div class="cxw-composer-footer"><div class="cxw-composer-start"><span class="cxw-square-icon" data-part="add-file">${icon2(h, "plus", 18)}</span><span class="cxw-permission">${icon2(h, "shield", 15)}${h.esc(c.permission || "\u5B8C\u5168\u8BBF\u95EE")}</span></div>
    <div class="cxw-composer-end"><span class="cxw-context"></span><span class="cxw-model">${h.esc(c.model || "GPT-6 Astra")}<span class="cxw-effort">${h.esc(c.effort || "Ultra")}</span>${icon2(h, "chevron-down", 11)}</span><span class="cxw-square-icon">${icon2(h, "mic", 17)}</span><span class="cxw-send" data-part="send" data-state="${running ? "stop" : "send"}" data-motion="focus">${running ? '<span class="cxw-stop"></span>' : icon2(h, "arrow-up", 17)}</span></div></div>
  </div></div>`;
  }
  function sidebar2(value, h) {
    const p = object(value);
    return `<aside class="cxw-sidebar" data-part="sidebar"><div class="cxw-sidebar-top">${icon2(h, "panel", 18)}${icon2(h, "edit", 18)}</div>
    <div class="cxw-sidebar-new">${icon2(h, "plus", 17)}<span>${h.esc(p.newLabel || "\u65B0\u4EFB\u52A1")}</span></div>
    <div class="cxw-sidebar-label">${h.esc(p.sectionLabel || "\u4EFB\u52A1")}</div>
    <nav>${array4(p.items).map((entry, index) => {
      const item = typeof entry === "string" ? { label: entry } : object(entry);
      return `<div class="cxw-sidebar-item ${item.active ? "cxw-sidebar-active" : ""}" data-sidebar-id="${h.esc(item.id || `sidebar-${index}`)}">${icon2(h, item.icon || "folder", 15)}<span>${h.esc(item.label || "\u4EFB\u52A1")}</span></div>`;
    }).join("")}</nav>
    <div class="cxw-sidebar-bottom">${icon2(h, "settings", 17)}<span>${h.esc(p.footer || "\u6F14\u793A\u5DE5\u4F5C\u533A")}</span></div>
  </aside>`;
  }
  function panel3(value, h) {
    const p = object(value);
    return `<aside class="cxw-preview-panel" data-part="preview-panel"><header><span>${icon2(h, p.kind === "table" ? "grid" : "file", 15)}${h.esc(p.title || "\u6587\u4EF6\u9884\u89C8")}</span><span>${icon2(h, "more", 17)}${icon2(h, "x", 15)}</span></header><div class="cxw-panel-body" data-motion="scroll">${p.kind === "table" ? teachingTable(p.table, h) : `<div class="cxw-document">${p.heading ? `<h3>${h.esc(p.heading)}</h3>` : ""}${array4(p.paragraphs).map((t) => `<p>${h.esc(t)}</p>`).join("")}${p.code ? `<pre>${h.esc(p.code)}</pre>` : ""}</div>`}</div></aside>`;
  }
  var defaults2 = {
    "title": "\u4EFB\u52A1\u6807\u9898",
    "project": "\u793A\u4F8B\u9879\u76EE",
    "disclosure": "\u754C\u9762\u590D\u523B \xB7 \u6848\u4F8B\u6F14\u793A",
    "showSidebar": true,
    "sidebar": {
      "sectionLabel": "\u4EFB\u52A1",
      "items": [
        {
          "id": "example-task",
          "label": "\u4EFB\u52A1\u6807\u9898",
          "active": true
        }
      ],
      "footer": "\u793A\u4F8B\u5DE5\u4F5C\u533A"
    },
    "messages": [
      {
        "id": "request",
        "role": "user",
        "text": "\u7528\u6237\u6D88\u606F\u5185\u5BB9\u3002\u53EF\u66FF\u6362\u8F93\u5165\u8981\u6C42\u548C\u9644\u4EF6\u3002",
        "attachments": [
          {
            "name": "example.csv",
            "detail": "\u793A\u4F8B\u9644\u4EF6 \xB7 5 \u6761\u8BB0\u5F55"
          }
        ]
      },
      {
        "id": "response",
        "role": "assistant",
        "elapsed": "\u7528\u65F6 10\u79D2",
        "text": "\u56DE\u590D\u5185\u5BB9\u3002\u8FD9\u91CC\u5C55\u793A\u6D88\u606F\u6B63\u6587\u4E0E\u5DE5\u5177\u6267\u884C\u72B6\u6001\u3002",
        "toolEvents": [
          {
            "id": "read-file",
            "kind": "file",
            "state": "complete",
            "label": "\u5DF2\u8BFB\u53D6 example.csv",
            "detail": "\u5DE5\u5177\u6267\u884C\u8BF4\u660E"
          }
        ]
      }
    ],
    "toolEvents": [],
    "composer": {
      "draft": "",
      "placeholder": "\u968F\u5FC3\u8F93\u5165",
      "permission": "\u5B8C\u5168\u8BBF\u95EE",
      "model": "GPT-6 Astra",
      "effort": "Ultra",
      "running": false,
      "attachments": []
    },
    "panel": null,
    "panelWidth": 400
  };
  var components20 = [{
    id: "codex-workflow",
    name: "Codex \u591A\u8F6E\u5DE5\u4F5C\u533A",
    category: "Codex",
    width: 1280,
    height: 800,
    description: "\u4F9D\u636E\u672C\u673A\u754C\u9762\u89C2\u5BDF\u91CD\u5EFA\u7684\u53EF\u7F16\u8F91\u591A\u8F6E\u5DE5\u4F5C\u533A\uFF1B\u652F\u6301\u9644\u4EF6\u3001\u8FD0\u884C\u8BB0\u5F55\u3001\u5E95\u90E8\u8F93\u5165\u533A\u53CA\u53EF\u9009\u6559\u5B66\u6587\u4EF6\u9884\u89C8\u3002",
    reference: { basis: "\u4EE5 2026-09-18 \u672C\u673A Codex \u754C\u9762\u89C2\u5BDF\u4E3A\u539F\u578B\uFF1B\u6CBF\u7528\u63A7\u4EF6\u5F62\u72B6\uFF0C\u6B63\u6587 18px\uFF0C\u5185\u5BB9\u533A\u4E0E\u8F93\u5165\u533A\u7EDF\u4E00\u5BBD\u5EA6\uFF0C\u4FA7\u680F\u53CA\u6587\u4EF6\u9884\u89C8\u6309\u53EF\u8BFB\u6027\u8C03\u6574\u3002\u5168\u5DE5\u4F5C\u533A\u672A\u9010\u50CF\u7D20\u9A8C\u6536\u3002", source: "../component-reference/high-fidelity/references/codex-current-window.png", level: "documented" },
    defaults: defaults2,
    render(props, h) {
      const incoming = object(props), p = { ...defaults2, ...incoming, sidebar: { ...defaults2.sidebar, ...object(incoming.sidebar) }, composer: { ...defaults2.composer, ...object(incoming.composer) } };
      const hasPanel = Boolean(p.panel && typeof p.panel === "object"), panelWidth = number7(p.panelWidth, 400, 320, 520);
      return `<section class="cxw-workspace ${p.showSidebar ? "" : "cxw-no-sidebar"} ${hasPanel ? "cxw-has-panel" : ""}" style="--cxw-panel-width:${panelWidth}px" data-part="workspace" data-state="${p.composer.running ? "running" : "idle"}">
      ${p.showSidebar ? sidebar2(p.sidebar, h) : ""}<div class="cxw-main"><header class="cxw-header"><div class="cxw-heading">${icon2(h, "folder", 17)}${p.project ? `<span class="cxw-project">${h.esc(p.project)}</span><span class="cxw-heading-divider">/</span>` : ""}<strong>${h.esc(p.title)}</strong></div><div class="cxw-header-actions">${icon2(h, "more", 18)}<span>${icon2(h, "upload", 15)}\u5206\u4EAB</span>${icon2(h, "panel", 17)}</div></header>
      <div class="cxw-body"><div class="cxw-thread"><div class="cxw-conversation-viewport" data-part="conversation-viewport"><div class="cxw-conversation" data-part="conversation" data-motion="scroll">${array4(p.messages).map((m, i) => message(m, i, h)).join("")}${toolEvents(p.toolEvents, h)}</div></div>${composer(p.composer, h)}<div class="cxw-disclosure" data-part="disclosure">${h.esc(p.disclosure || "\u754C\u9762\u590D\u523B \xB7 \u6848\u4F8B\u6F14\u793A")}</div></div>${hasPanel ? panel3(p.panel, h) : ""}</div></div>
    </section>`;
    }
  }];

  // families/codex.mjs
  var native = { basis: "\u4EE5 Windows Codex 26.915.3509.0 \u672C\u673A\u622A\u56FE\u4E0E\u5B89\u88C5\u5305 UI token \u4E3A\u539F\u578B\uFF1B\u7EC4\u4EF6\u6B63\u6587\u8C03\u81F3 18px\uFF0C\u6309\u9884\u89C8\u53EF\u8BFB\u6027\u4F18\u5316\u5185\u5BB9\u5BBD\u5EA6\u548C\u8F93\u5165\u533A\uFF0C\u4E0D\u4F5C\u4E3A\u9010\u50CF\u7D20\u622A\u56FE\u3002", source: "../component-reference/high-fidelity/references/codex-current-window.png", level: "documented" };
  function composer2(p, h) {
    return `<div class="cx-composer" data-motion="focus"><div class="cx-editor ${p.draft ? "cx-has-draft" : ""}" data-motion="type">${h.esc(p.draft || p.placeholder || "\u968F\u5FC3\u8F93\u5165")}</div><div class="cx-composer-footer"><div class="cx-composer-start"><span class="cx-square-icon">${h.icon("plus", 18)}</span><span class="cx-permission">${h.icon("shield", 15)}${h.esc(p.permission || "\u5B8C\u5168\u8BBF\u95EE")}</span></div><div class="cx-composer-end"><span class="cx-context"></span><span class="cx-model">${h.esc(p.model || "GPT-6 Astra")} <span class="cx-effort">${h.esc(p.effort || "Ultra")}</span>${h.icon("chevron-down", 11)}</span><span class="cx-square-icon">${h.icon("mic", 17)}</span><span class="cx-send">${p.running ? '<span class="cx-stop"></span>' : h.icon("arrow-up", 17)}</span></div></div></div>`;
  }
  function toolCard(p, h) {
    return `<div class="cx-tool-card" data-motion="item"><div class="cx-file-icon">${h.icon("file", 23)}<span>+</span></div><div class="cx-file-copy"><div>${h.esc(p.verb || "\u5DF2\u7F16\u8F91")} ${h.esc(p.file || "App.tsx")}</div><div class="cx-diff-stat"><span>+${h.esc(p.added ?? 18)}</span><span>-${h.esc(p.removed ?? 4)}</span></div></div><div class="cx-tool-actions"><span>${h.esc(p.undoLabel || "\u64A4\u9500")}${h.icon("undo", 14)}</span><button>${h.esc(p.reviewLabel || "\u5BA1\u6838")}</button></div></div>`;
  }
  var components21 = [
    { id: "codex-chat", name: "Codex \u5BF9\u8BDD\u7A97\u53E3", category: "Codex", description: "\u6309\u672C\u673A Codex \u91CD\u5EFA\u7684\u9ED1\u8272\u7528\u6237\u6D88\u606F\u3001\u65E0\u6C14\u6CE1\u56DE\u590D\u3001\u6267\u884C\u8BB0\u5F55\u548C\u5E95\u90E8\u8F93\u5165\u680F\u3002", width: 1280, height: 800, reference: native, defaults: {
      "title": "\u4EFB\u52A1\u6807\u9898",
      "userMessage": "\u7528\u6237\u6D88\u606F\u5185\u5BB9\u3002\u53EF\u586B\u5199\u4EFB\u52A1\u3001\u8865\u5145\u4FE1\u606F\u4E0E\u9884\u671F\u7ED3\u679C\u3002",
      "status": "\u5DF2\u5904\u7406 10\u79D2",
      "reply": "\u56DE\u590D\u5185\u5BB9\u3002\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u56DE\u7B54\u3002",
      "details": [
        "\u56DE\u590D\u8981\u70B9 A",
        "\u56DE\u590D\u8981\u70B9 B"
      ],
      "command": "node example.js",
      "commandResult": "\u793A\u4F8B\u8F93\u51FA",
      "file": "src/example.ts",
      "added": 8,
      "removed": 2,
      "placeholder": "\u968F\u5FC3\u8F93\u5165",
      "draft": "",
      "model": "GPT-6 Astra",
      "effort": "Ultra",
      "permission": "\u5B8C\u5168\u8BBF\u95EE",
      "running": false
    }, render(p, h) {
      return `<section class="cx-thread"><header class="cx-thread-header"><div>${h.icon("folder", 18)}<span>${h.esc(p.title)}</span></div><div class="cx-header-controls">${h.icon("more", 19)}<span>${h.icon("upload", 15)} \u5206\u4EAB</span>${h.icon("panel", 17)}</div></header><div class="cx-conversation-viewport" data-part="viewport"><div class="cx-conversation" data-part="message-list" data-motion="scroll"><div class="cx-user-row"><div class="cx-user-bubble" data-motion="item">${h.esc(p.userMessage)}</div></div><div class="cx-status">${h.esc(p.status)}</div><div class="cx-assistant" data-motion="item"><p>${h.esc(p.reply)}</p><ul>${p.details.map((t) => `<li>${h.esc(t)}</li>`).join("")}</ul></div><div class="cx-execution" data-motion="item">${h.icon("terminal", 14)}<span>\u5DF2\u8FD0\u884C ${h.esc(p.command)}</span>${h.icon("chevron-down", 12)}</div><div class="cx-test-note">${h.icon("check", 15)}${h.esc(p.commandResult)}</div>${toolCard(p, h)}<div class="cx-answer-tools">${h.icon("copy", 15)}${h.icon("more", 17)}</div></div></div><div class="cx-fixed-composer">${composer2(p, h)}</div></section>`;
    } },
    { id: "codex-composer", name: "Codex \u8F93\u5165\u6846", category: "Codex", description: "\u72EC\u7ACB\u590D\u7528\u7684\u8F93\u5165\u533A\u3001\u6743\u9650\u6807\u7B7E\u3001\u6A21\u578B\u9009\u62E9\u5668\u3001\u9EA6\u514B\u98CE\u548C\u53D1\u9001/\u505C\u6B62\u6309\u94AE\u3002", width: 800, height: 160, reference: native, defaults: {
      "placeholder": "\u968F\u5FC3\u8F93\u5165",
      "draft": "",
      "permission": "\u5B8C\u5168\u8BBF\u95EE",
      "model": "GPT-6 Astra",
      "effort": "Ultra",
      "running": true
    }, render(p, h) {
      return `<section class="cx-composer-island">${composer2(p, h)}</section>`;
    } },
    { id: "codex-tool-result", name: "Codex \u6587\u4EF6\u4FEE\u6539\u5361", category: "Codex", description: "\u6587\u4EF6\u540D\u3001\u589E\u5220\u884C\u7EDF\u8BA1\u3001\u64A4\u9500\u4E0E\u5BA1\u6838\u5165\u53E3\uFF1B\u53EF\u63A5\u5728\u4EFB\u610F\u8BB2\u89E3\u753B\u9762\u4E2D\u3002", width: 800, height: 200, reference: native, defaults: {
      "verb": "\u5DF2\u7F16\u8F91",
      "file": "\u793A\u4F8B\u6587\u4EF6.md",
      "added": 8,
      "removed": 2,
      "undoLabel": "\u64A4\u9500",
      "reviewLabel": "\u5BA1\u6838"
    }, render(p, h) {
      return `<section class="cx-tool-island">${toolCard(p, h)}</section>`;
    } },
    { id: "codex-plan", name: "Codex \u6267\u884C\u8BA1\u5212", category: "Codex", description: "\u6309 Codex \u5B57\u4F53\u5C42\u7EA7\u4E0E\u7070\u8272\u8FB9\u754C\u7EC4\u7EC7\u7684\u53EF\u7F16\u8F91\u8BA1\u5212\u6E05\u5355\u3002", width: 800, height: 420, reference: { ...native, level: "documented", basis: "Codex \u672C\u673A\u6392\u7248 token \u4E0E\u4EFB\u52A1\u72B6\u6001\u7ED3\u6784\uFF1B\u8BA1\u5212\u4E13\u7528\u72B6\u6001\u5C1A\u672A\u9010\u50CF\u7D20\u6BD4\u5BF9" }, defaults: {
      "title": "\u66F4\u65B0\u8BA1\u5212",
      "summary": "\u8BA1\u5212\u8BF4\u660E\u6587\u5B57",
      "steps": [
        {
          "text": "\u6B65\u9AA4 A",
          "state": "done"
        },
        {
          "text": "\u6B65\u9AA4 B",
          "state": "active"
        },
        {
          "text": "\u6B65\u9AA4 C",
          "state": "pending"
        }
      ],
      "footer": "2 / 3 \xB7 \u6B63\u5728\u5904\u7406"
    }, render(p, h) {
      return `<section class="cx-plan-island"><div class="cx-plan"><header>${h.icon("list", 18)}<strong>${h.esc(p.title)}</strong><span>${h.icon("chevron-down", 14)}</span></header><p>${h.esc(p.summary)}</p><div class="cx-plan-steps">${p.steps.map((s2) => `<div class="cx-plan-step cx-plan-${h.esc(s2.state)}" data-motion="item"><span class="cx-plan-state">${s2.state === "done" ? h.icon("check", 15) : s2.state === "active" ? "<i></i>" : ""}</span><span>${h.esc(s2.text)}</span></div>`).join("")}</div><footer>${h.esc(p.footer)}</footer></div></section>`;
    } }
  ];

  // families/developer.mjs
  var vscodeRef = "https://code.visualstudio.com/docs/editing/getting-started/userinterface";
  var themeRef = "https://code.visualstudio.com/docs/configure/themes";
  var documented = (basis, source2) => ({ basis, source: source2, level: "documented" });
  var designed = (basis) => ({ basis, source: "\u539F\u521B\u4E13\u4E1A\u8F6F\u4EF6\u754C\u9762\uFF1B\u4E0D\u5BF9\u5E94\u4EFB\u4F55\u5355\u4E00\u4EA7\u54C1\u7684\u50CF\u7D20\u7EA7\u622A\u56FE\u3002", level: "designed" });
  var arr = (v) => Array.isArray(v) ? v : [];
  var n = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
  var cls = (v, options, fallback = "") => options.includes(v) ? v : fallback;
  var cfg = (component2, props) => ({ ...component2.defaults, ...props });
  function controls2(h) {
    return `<div class="dev-win-controls"><span>${h.icon("minus", 16)}</span><span>${h.icon("maximize", 14)}</span><span>${h.icon("x", 16)}</span></div>`;
  }
  function titlebar(p, h, brand = "Visual Studio Code") {
    return `<div class="dev-titlebar"><span class="dev-app-symbol">${h.icon("code", 19)}</span><div class="dev-menus"><span>\u6587\u4EF6</span><span>\u7F16\u8F91</span><span>\u9009\u62E9</span><span>\u67E5\u770B</span><span>\u8F6C\u5230</span><span>\u8FD0\u884C</span><span>\u7EC8\u7AEF</span><span>\u5E2E\u52A9</span></div><div class="dev-command-center">${h.icon("search", 14)}<span>${h.esc(p.project || p.title || brand)}</span></div>${controls2(h)}</div>`;
  }
  function activity(h, active = "file") {
    return `<nav class="dev-activity">${["file", "search", "git-branch", "play", "grid"].map((i) => `<div class="${active === i ? "dev-activity-active" : ""}">${h.icon(i, 25)}</div>`).join("")}<div class="dev-activity-bottom">${h.icon("settings", 25)}</div></nav>`;
  }
  function status(p, h) {
    return `<div class="dev-status"><span>${h.icon("git-branch", 14)} ${h.esc(p.branch || "main")}</span><span>${h.icon("refresh", 13)}</span><span>${h.icon("x", 12)} 0</span><span>${h.icon("info", 12)} 0</span><span class="dev-status-spacer"></span><span>${h.esc(p.position || "\u884C 10\uFF0C\u5217 3")}</span><span>\u7A7A\u683C: 2</span><span>UTF-8</span><span>CRLF</span><span>${h.esc(p.language || "TypeScript")}</span><span>${h.icon("check", 13)} Prettier</span></div>`;
  }
  function tabs(items, h) {
    return `<div class="dev-tabs">${items.map((t, i) => `<div class="dev-tab ${i === 0 ? "dev-tab-active" : ""}"><span class="dev-filetype">${h.esc(t.kind || "TS")}</span><span>${h.esc(t.name || t)}</span>${i === 0 ? h.icon("x", 14) : ""}</div>`).join("")}<span class="dev-tabs-tail">${h.icon("more", 18)}</span></div>`;
  }
  function crumbs(values, h) {
    return `<div class="dev-crumbs">${values.map((v) => `<span>${h.esc(v)}</span>`).join(h.icon("chevron-right", 13))}</div>`;
  }
  function syntax(line3, h) {
    const source2 = String(line3 ?? "");
    const re = /(\/\/.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`|\b(?:import|from|export|const|let|function|async|await|return|if|else|throw|new|type|interface|true|false|null|undefined|extends|for|of)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][A-Za-z0-9_$]*(?=\s*[:(]))/g;
    let out = "", last = 0;
    for (const match of source2.matchAll(re)) {
      out += h.esc(source2.slice(last, match.index));
      const token = match[0], after = source2.slice(match.index + token.length).trimStart();
      const c = token.startsWith("//") ? "comment" : /^['"`]/.test(token) ? after.startsWith(":") ? "property" : "string" : /^\d/.test(token) ? "number" : after.startsWith(":") ? "property" : after.startsWith("(") && !["if", "for"].includes(token) ? "function" : "keyword";
      out += `<span class="dev-token-${c}">${h.esc(token)}</span>`;
      last = match.index + token.length;
    }
    return out + h.esc(source2.slice(last));
  }
  function codeLines(lines3, h, opts = {}) {
    return `<div class="dev-code-lines ${opts.compact ? "dev-code-compact" : ""}">${arr(lines3).map((line3, i) => {
      const o = typeof line3 === "string" ? { text: line3 } : line3;
      return `<div class="dev-code-line ${cls(o.state, ["add", "remove", "selected"])} ${opts.highlight === i + 1 ? "dev-code-highlight" : ""}" data-motion="${opts.motion === "highlight" ? "highlight" : "line"}"><span class="dev-line-number">${h.esc(o.number === void 0 ? i + 1 : o.number)}</span><span class="dev-line-sign">${o.state === "add" ? "+" : o.state === "remove" ? "\u2212" : ""}</span><code${opts.highlight === i + 1 ? ' data-motion="focus"' : ""}>${syntax(o.text, h)}</code></div>`;
    }).join("")}</div>`;
  }
  function tree(items, h, active = "") {
    return arr(items).map((item) => `<div class="dev-tree-row ${item.name === active ? "dev-tree-selected" : ""}" style="padding-left:${14 + Math.max(0, Math.min(8, n(item.depth))) * 16}px" data-motion="item"><span class="dev-tree-chevron">${item.kind === "folder" ? h.icon(item.open === false ? "chevron-right" : "chevron-down", 14) : ""}</span><span class="dev-tree-file ${item.kind === "folder" ? "dev-tree-folder" : ""}">${h.icon(item.kind === "folder" ? "folder" : "file", 16)}</span><span>${h.esc(item.name)}</span>${item.badge ? `<span class="dev-tree-badge">${h.esc(item.badge)}</span>` : ""}</div>`).join("");
  }
  function miniMap(lines3, h) {
    return `<div class="dev-minimap" aria-hidden="true"><div class="dev-minimap-view"></div>${arr(lines3).map((x, i) => `<span style="width:${Math.min(92, Math.max(9, String(typeof x === "string" ? x : x.text).length) * 1.6)}%;margin-left:${/^[ ]{2}/.test(typeof x === "string" ? x : x.text) ? 8 : 0}px;background:${i % 5 === 0 ? "#579a52" : i % 3 === 0 ? "#ae6655" : "#7395af"}"></span>`).join("")}</div>`;
  }
  function shell2(p, h, body, { sidebar: sidebar5 = "", active = "file" } = {}) {
    return `<article class="dev-stage"><div class="dev-window dev-vscode">${titlebar(p, h)}<div class="dev-workbench">${activity(h, active)}${sidebar5 ? `<aside class="dev-sidebar">${sidebar5}</aside>` : ""}<main class="dev-editor">${body}</main></div>${status(p, h)}</div></article>`;
  }
  function simpleHead(p, h, label3) {
    return `<div class="dev-tool-title"><span>${h.icon(p.appIcon || "code", 18)}<b>${h.esc(p.appName || label3)}</b><span class="dev-tool-divider"></span>${h.esc(p.workspace || "\u793A\u4F8B\u9879\u76EE")}</span><div>${h.icon("search", 16)}${h.icon("settings", 16)}${controls2(h)}</div></div>`;
  }
  var components22 = [
    {
      id: "terminal-session",
      name: "Windows Terminal \u4F1A\u8BDD",
      category: "\u5F00\u53D1\u4E0E\u6570\u636E",
      width: 1280,
      height: 800,
      description: "Windows \u6807\u7B7E\u680F\u4E0E\u7A97\u53E3\u6309\u94AE\u3001PowerShell \u63D0\u793A\u7B26\u3001\u5206\u7EA7\u65E5\u5FD7\u53CA\u53EF\u9010\u884C\u63ED\u793A\u7684\u8F93\u51FA\u3002\u547D\u4EE4\u4EC5\u7528\u4E8E\u52A8\u753B\u5C55\u793A\uFF0C\u4E0D\u4F1A\u6267\u884C\u3002",
      reference: documented("Windows Terminal \u7684\u6807\u7B7E\u3001\u52A0\u53F7\u3001\u4E0B\u62C9\u4E0E\u53F3\u4FA7\u7A97\u53E3\u6309\u94AE\u4F9D\u5FAE\u8F6F\u5B98\u65B9\u754C\u9762\u5F62\u5236\uFF1B\u7EC8\u7AEF\u6B63\u6587\u4E3A\u81EA\u5B9A\u4E49\u9AD8\u5BF9\u6BD4\u914D\u8272\uFF0C\u672A\u505A\u540C\u5C3A\u5BF8\u622A\u56FE\u9A8C\u6536\u3002", "https://learn.microsoft.com/en-us/windows/terminal/customize-settings/appearance"),
      defaults: {
        "title": "PowerShell",
        "path": "D:\\example-project",
        "greeting": "PowerShell",
        "command": "node example.js",
        "lines": [
          {
            "text": "\u793A\u4F8B\u8F93\u51FA A",
            "tone": "normal"
          },
          {
            "text": "\u793A\u4F8B\u8F93\u51FA B",
            "tone": "muted"
          },
          {
            "text": "",
            "tone": "muted"
          },
          {
            "text": "\u2713 \u6B65\u9AA4 A \u5DF2\u5B8C\u6210",
            "tone": "success"
          },
          {
            "text": "\u2713 \u6B65\u9AA4 B \u5DF2\u5B8C\u6210",
            "tone": "success"
          },
          {
            "text": "",
            "tone": "muted"
          },
          {
            "text": "\u5904\u7406\u5B8C\u6210\u3002",
            "tone": "normal"
          }
        ],
        "nextCommand": "node verify.js"
      },
      render(props, h) {
        const p = cfg(this, props);
        return `<article class="dev-stage"><div class="dev-window dev-terminal"><div class="dev-terminal-title"><div class="dev-terminal-tab">${h.icon("terminal", 18)}<span>${h.esc(p.title)}</span>${h.icon("x", 14)}</div><span class="dev-terminal-new">${h.icon("plus", 17)}${h.icon("chevron-down", 13)}</span>${controls2(h)}</div><div class="dev-terminal-body"><div class="dev-terminal-greeting">${h.esc(p.greeting)}</div><div class="dev-command-row"><span class="dev-prompt">PS ${h.esc(p.path)}&gt;</span> <span data-motion="type">${h.esc(p.command)}</span></div><div class="dev-terminal-output">${arr(p.lines).map((l) => `<div class="dev-log-${cls(l.tone, ["muted", "success", "error", "link", "normal"], "normal")}" data-motion="line" data-output-line>${h.esc(l.text) || "&#160;"}</div>`).join("")}</div><div class="dev-command-row dev-terminal-last" data-output-line><span class="dev-prompt">PS ${h.esc(p.path)}&gt;</span> <span>${h.esc(p.nextCommand)}</span><span class="dev-terminal-caret" data-motion="cursor"></span></div></div></div></article>`;
      }
    },
    {
      id: "code-editor",
      name: "VS Code Light+ \u7F16\u8F91\u5668",
      category: "\u5F00\u53D1\u4E0E\u6570\u636E",
      width: 1280,
      height: 800,
      description: "\u5B8C\u6574\u6D3B\u52A8\u680F\u3001\u8D44\u6E90\u7BA1\u7406\u5668\u3001\u6587\u4EF6\u9875\u7B7E\u3001\u9762\u5305\u5C51\u3001\u884C\u53F7\u3001\u4EE3\u7801\u7F29\u7565\u56FE\u548C\u84DD\u8272\u72B6\u6001\u680F\u3002\u4EE3\u7801\u7531\u53EF\u7F16\u8F91\u6587\u672C\u751F\u6210\u8BED\u6CD5\u914D\u8272\u3002",
      reference: documented("VS Code Windows \u5E03\u5C40\u53CA Light+ \u914D\u8272\u7ED3\u6784\u3002\u56FE\u6807\u4E3A\u7EDF\u4E00\u77E2\u91CF\u8FD1\u4F3C\uFF0C\u672A\u4E0E\u7279\u5B9A\u7248\u672C\u505A\u50CF\u7D20\u5DEE\u5F02\u9A8C\u6536\u3002", [vscodeRef, themeRef]),
      defaults: {
        "project": "example-project",
        "filename": "example.ts",
        "branch": "main*",
        "language": "TypeScript",
        "position": "\u884C 10\uFF0C\u5217 3",
        "files": [
          {
            "name": "EXAMPLE-PROJECT",
            "kind": "folder",
            "depth": 0
          },
          {
            "name": "src",
            "kind": "folder",
            "depth": 1
          },
          {
            "name": "example.ts",
            "depth": 2,
            "badge": "M"
          },
          {
            "name": "helper.ts",
            "depth": 2
          },
          {
            "name": "tests",
            "kind": "folder",
            "depth": 1,
            "open": false
          },
          {
            "name": "package.json",
            "depth": 1
          },
          {
            "name": "README.md",
            "depth": 1
          }
        ],
        "code": [
          "import { formatValue } from './helper';",
          "",
          "// \u793A\u4F8B\u4EE3\u7801\uFF1A\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u903B\u8F91",
          "export const example = {",
          "  title: '\u793A\u4F8B\u6807\u9898',",
          "  enabled: true,",
          "  items: [",
          "    { id: 1, value: 10 },",
          "    { id: 2, value: 20 },",
          "  ],",
          "};",
          "",
          "const result = formatValue(example.title);",
          "console.log(result);"
        ],
        "highlightLine": 10,
        "secondaryTab": "helper.ts",
        "symbol": "example"
      },
      render(props, h) {
        const p = cfg(this, props);
        return shell2(p, h, `${tabs([{ name: p.filename, kind: "TS" }, { name: p.secondaryTab, kind: "TS" }], h)}${crumbs(["src", p.filename, p.symbol], h)}<div class="dev-source-area" data-motion="scroll">${codeLines(p.code, h, { highlight: n(p.highlightLine), motion: "highlight" })}${miniMap(p.code, h)}</div><div class="dev-panel-tabs"><b>\u95EE\u9898</b><span>\u8F93\u51FA</span><span>\u8C03\u8BD5\u63A7\u5236\u53F0</span><span>\u7EC8\u7AEF</span><span>\u7AEF\u53E3</span></div><div class="dev-panel-message">\u5DE5\u4F5C\u533A\u4E2D\u5C1A\u672A\u68C0\u6D4B\u5230\u4EFB\u4F55\u95EE\u9898\u3002</div>`, { sidebar: `<div class="dev-sidebar-heading">\u8D44\u6E90\u7BA1\u7406\u5668 ${h.icon("more", 17)}</div><div class="dev-tree-group">${h.icon("chevron-down", 13)} \u6253\u5F00\u7684\u7F16\u8F91\u5668</div><div class="dev-open-file">${h.icon("x", 13)} <span class="dev-filetype">TS</span> ${h.esc(p.filename)}</div>${tree(p.files, h, p.filename)}<div class="dev-sidebar-bottom">${h.icon("chevron-right", 13)} \u5927\u7EB2</div>` });
      }
    },
    {
      id: "code-diff",
      name: "VS Code \u53CC\u680F\u4EE3\u7801\u5DEE\u5F02",
      category: "\u5F00\u53D1\u4E0E\u6570\u636E",
      width: 1280,
      height: 800,
      description: "\u540C\u4E00\u6587\u4EF6\u7684\u5DE6\u53F3\u7248\u672C\u3001\u5220\u9664\u4E0E\u65B0\u589E\u6574\u884C\u80CC\u666F\u3001\u884C\u53F7\u548C\u4FEE\u6539\u5217\u8868\uFF1B\u9002\u5408\u89E3\u91CA\u4FEE\u590D\u524D\u540E\u53D8\u5316\u3002",
      reference: documented("\u4F9D\u636E VS Code \u5B98\u65B9 Diff editor \u7684\u53CC\u680F\u5E03\u5C40\u4E0E Source Control \u7ED3\u6784\uFF0C\u914D\u8272\u9009\u7528 Light+\uFF1B\u672A\u5B8C\u6210\u5BF9\u5E94\u7248\u672C\u622A\u56FE\u6BD4\u5BF9\u3002", "https://code.visualstudio.com/docs/sourcecontrol/overview"),
      defaults: {
        "project": "example-project",
        "filename": "example.ts",
        "branch": "feature/example*",
        "language": "TypeScript",
        "position": "2 \u9879\u66F4\u6539",
        "beforeLabel": "example.ts \xB7 HEAD",
        "afterLabel": "example.ts \xB7 \u5DE5\u4F5C\u533A",
        "before": [
          "export const example = {",
          {
            "text": "  title: '\u539F\u59CB\u6807\u9898',",
            "state": "remove"
          },
          {
            "text": "  count: 10,",
            "state": "remove"
          },
          "  enabled: true,",
          "};"
        ],
        "after": [
          "export const example = {",
          {
            "text": "  title: '\u66F4\u65B0\u6807\u9898',",
            "state": "add"
          },
          {
            "text": "  count: 20,",
            "state": "add"
          },
          "  enabled: true,",
          "};"
        ]
      },
      render(props, h) {
        const p = cfg(this, props);
        return shell2(p, h, `${tabs([{ name: p.filename, kind: "TS" }], h)}<div class="dev-diff-heading"><span>${h.esc(p.beforeLabel)}</span><span>${h.esc(p.afterLabel)}<i>\u5DF2\u4FEE\u6539</i></span></div><div class="dev-diff-body"><div>${codeLines(p.before, h, { compact: true })}</div><div>${codeLines(p.after, h, { compact: true })}</div></div><div class="dev-diff-caption">${h.icon("info", 15)} \u5DE6\u4FA7\uFF1A\u539F\u59CB\u6587\u4EF6<span></span>\u53F3\u4FA7\uFF1A\u5F53\u524D\u5DE5\u4F5C\u533A</div>`, { active: "git-branch", sidebar: `<div class="dev-sidebar-heading">\u6E90\u4EE3\u7801\u7BA1\u7406 ${h.icon("more", 17)}</div><div class="dev-scm-input">\u6D88\u606F\uFF08Ctrl+Enter \u63D0\u4EA4\uFF09</div><div class="dev-scm-button">${h.icon("check", 15)} \u63D0\u4EA4</div><div class="dev-tree-group">${h.icon("chevron-down", 13)} \u66F4\u6539 <span>1</span></div><div class="dev-tree-row dev-tree-selected"><span class="dev-filetype">TS</span>${h.esc(p.filename)}<span class="dev-tree-badge">M</span></div>` });
      }
    },
    {
      id: "file-tree",
      name: "\u9879\u76EE\u6587\u4EF6\u4E0E\u76EE\u5F55\u6811",
      category: "\u5F00\u53D1\u4E0E\u6570\u636E",
      width: 1280,
      height: 800,
      description: "\u53EF\u5C55\u5F00\u5C42\u7EA7\u7684\u8D44\u6E90\u7BA1\u7406\u5668\u4E0E\u9009\u4E2D\u6587\u4EF6\u9884\u89C8\uFF1B\u6BCF\u4E2A\u6587\u4EF6\u7684\u6DF1\u5EA6\u3001\u7C7B\u578B\u548C\u4FEE\u6539\u72B6\u6001\u72EC\u7ACB\u914D\u7F6E\u3002",
      reference: documented("\u53C2\u8003 VS Code Explorer\u3001\u6253\u5F00\u7F16\u8F91\u5668\u4E0E Breadcrumbs \u5B98\u65B9\u754C\u9762\u3002\u6587\u4EF6\u6570\u636E\u4E0E\u53F3\u4FA7\u5185\u5BB9\u53EF\u66FF\u6362\u3002", vscodeRef),
      defaults: {
        "project": "example-project",
        "filename": "example.json",
        "language": "JSON",
        "position": "\u884C 3\uFF0C\u5217 3",
        "branch": "main",
        "files": [
          {
            "name": "EXAMPLE-PROJECT",
            "kind": "folder",
            "depth": 0
          },
          {
            "name": "assets",
            "kind": "folder",
            "depth": 1
          },
          {
            "name": "example.png",
            "depth": 2
          },
          {
            "name": "src",
            "kind": "folder",
            "depth": 1
          },
          {
            "name": "example.ts",
            "depth": 2
          },
          {
            "name": "example.json",
            "depth": 1,
            "badge": "M"
          },
          {
            "name": "package.json",
            "depth": 1
          },
          {
            "name": "README.md",
            "depth": 1
          }
        ],
        "code": [
          "{",
          '  "title": "\u793A\u4F8B\u6807\u9898",',
          '  "enabled": true,',
          '  "items": [',
          '    { "id": 1, "label": "\u9879\u76EE A", "value": 10 },',
          '    { "id": 2, "label": "\u9879\u76EE B", "value": 20 }',
          "  ]",
          "}"
        ]
      },
      render(props, h) {
        const p = cfg(this, props);
        return shell2(p, h, `${tabs([{ name: p.filename, kind: "{}" }], h)}${crumbs([p.project, p.filename], h)}<div class="dev-source-area">${codeLines(p.code, h)}${miniMap(p.code, h)}</div>`, { sidebar: `<div class="dev-sidebar-heading">\u8D44\u6E90\u7BA1\u7406\u5668 ${h.icon("more", 17)}</div>${tree(p.files, h, p.filename)}<div class="dev-sidebar-bottom">${h.icon("chevron-right", 13)} \u65F6\u95F4\u7EBF</div>` });
      }
    },
    {
      id: "http-request",
      name: "API \u8BF7\u6C42\u4E0E\u54CD\u5E94\u8C03\u8BD5\u5668",
      category: "\u5F00\u53D1\u4E0E\u6570\u636E",
      width: 1280,
      height: 800,
      description: "\u539F\u521B API \u5BA2\u6237\u7AEF\u754C\u9762\uFF0C\u5305\u542B\u8BF7\u6C42\u5217\u8868\u3001\u5730\u5740\u680F\u3001\u53C2\u6570\u8868\u3001\u54CD\u5E94\u72B6\u6001\u4E0E JSON \u6B63\u6587\u3002\u4E0D\u4F1A\u53D1\u9001\u7F51\u7EDC\u8BF7\u6C42\u3002",
      reference: designed("\u6309\u5E38\u89C1 API \u5BA2\u6237\u7AEF\u4FE1\u606F\u7ED3\u6784\u539F\u521B\uFF1AHTTP \u65B9\u6CD5\u3001\u8BF7\u6C42\u53C2\u6570\u3001\u54CD\u5E94\u72B6\u6001\u4E0E\u683C\u5F0F\u5316 JSON\u3002\u4E0D\u662F Postman \u622A\u56FE\u590D\u523B\u3002"),
      defaults: {
        "appName": "API \u5DE5\u4F5C\u53F0",
        "workspace": "\u793A\u4F8B\u5DE5\u4F5C\u533A",
        "appIcon": "globe",
        "requestName": "\u793A\u4F8B\u8BF7\u6C42 A",
        "method": "GET",
        "url": "https://api.example.com/v1/items",
        "status": "200 OK",
        "latency": "128 ms",
        "responseSize": "1.24 KB",
        "requests": [
          {
            "method": "GET",
            "name": "\u793A\u4F8B\u8BF7\u6C42 A"
          },
          {
            "method": "GET",
            "name": "\u793A\u4F8B\u8BF7\u6C42 B"
          },
          {
            "method": "POST",
            "name": "\u793A\u4F8B\u8BF7\u6C42 C"
          },
          {
            "method": "GET",
            "name": "\u793A\u4F8B\u8BF7\u6C42 D"
          }
        ],
        "params": [
          {
            "key": "category",
            "value": "example",
            "description": "\u53C2\u6570\u8BF4\u660E A"
          },
          {
            "key": "limit",
            "value": "2",
            "description": "\u53C2\u6570\u8BF4\u660E B"
          }
        ],
        "response": [
          "{",
          '  "success": true,',
          '  "data": [',
          '    { "id": 1, "label": "\u9879\u76EE A" },',
          '    { "id": 2, "label": "\u9879\u76EE B" }',
          "  ],",
          '  "total": 2',
          "}"
        ],
        "collectionTitle": "\u8BF7\u6C42\u5206\u7EC4"
      },
      render(props, h) {
        const p = cfg(this, props);
        return `<article class="dev-stage"><div class="dev-window dev-tool">${simpleHead(p, h, "API \u5DE5\u4F5C\u53F0")}<div class="dev-tool-body"><aside class="dev-http-sidebar"><div class="dev-sidebar-heading">\u96C6\u5408 ${h.icon("plus", 17)}</div><div class="dev-tree-group">${h.icon("chevron-down", 14)} ${h.esc(p.collectionTitle)}</div>${arr(p.requests).map((r, i) => `<div class="dev-http-request ${i === 0 ? "dev-http-selected" : ""}"><b class="${r.method === "POST" ? "dev-http-post" : ""}">${h.esc(r.method)}</b><span>${h.esc(r.name)}</span></div>`).join("")}</aside><main class="dev-http-main"><div class="dev-http-breadcrumb">\u96C6\u5408 ${h.icon("chevron-right", 14)} ${h.esc(p.collectionTitle)} ${h.icon("chevron-right", 14)} ${h.esc(p.requestName)}<span>${h.icon("more", 18)}</span></div><div class="dev-http-url" data-motion="focus"><b>${h.esc(p.method)} ${h.icon("chevron-down", 13)}</b><span>${h.esc(p.url)}</span><div>\u53D1\u9001 ${h.icon("chevron-down", 14)}</div></div><div class="dev-tool-tabs"><b>\u53C2\u6570 <i>${arr(p.params).length}</i></b><span>\u8EAB\u4EFD\u9A8C\u8BC1</span><span>\u8BF7\u6C42\u5934 <i>2</i></span><span>\u8BF7\u6C42\u4F53</span><span>\u8BBE\u7F6E</span></div><div class="dev-http-params-title">\u67E5\u8BE2\u53C2\u6570</div><div class="dev-params-table"><div class="dev-param-row dev-param-head"><span></span><span>KEY</span><span>VALUE</span><span>DESCRIPTION</span></div>${arr(p.params).map((r) => `<div class="dev-param-row" data-motion="item"><span class="dev-checkbox-checked">${h.icon("check", 12)}</span><code>${h.esc(r.key)}</code><code>${h.esc(r.value)}</code><span>${h.esc(r.description)}</span></div>`).join("")}<div class="dev-param-row dev-param-empty"><span class="dev-checkbox"></span><span>\u952E</span><span>\u503C</span><span>\u63CF\u8FF0</span></div></div><div class="dev-response-head"><b>\u54CD\u5E94</b><span class="dev-http-status" data-motion="highlight">${h.esc(p.status)}</span><span>${h.esc(p.latency)}</span><span>${h.esc(p.responseSize)}</span></div><div class="dev-tool-tabs dev-response-tabs"><b>\u6B63\u6587</b><span>Cookies</span><span>\u54CD\u5E94\u5934</span><span class="dev-flex-fill"></span><span>JSON ${h.icon("chevron-down", 12)}</span>${h.icon("copy", 15)}</div><div class="dev-response-code">${codeLines(p.response, h, { compact: true })}</div></main></div><div class="dev-tool-status">${h.icon("check-circle", 14)} \u672C\u5730\u793A\u4F8B\u6570\u636E<span>\u8BF7\u6C42\u672A\u5B9E\u9645\u53D1\u9001</span></div></div></article>`;
      }
    },
    {
      id: "json-inspector",
      name: "JSON \u5BF9\u8C61\u68C0\u67E5\u5668",
      category: "\u5F00\u53D1\u4E0E\u6570\u636E",
      width: 1280,
      height: 800,
      description: "\u539F\u521B\u6570\u636E\u68C0\u67E5\u9762\u677F\uFF0C\u53EF\u5C55\u793A\u5D4C\u5957\u5BF9\u8C61\u3001\u6570\u636E\u7C7B\u578B\u3001\u8DEF\u5F84\u4E0E\u5B57\u6BB5\u8BE6\u60C5\u3002\u9002\u5408\u8BB2\u89E3 API \u6570\u636E\u6216\u914D\u7F6E\u7ED3\u6784\u3002",
      reference: designed("\u539F\u521B JSON Inspector\uFF0C\u4F7F\u7528\u5F00\u53D1\u8005\u5DE5\u5177\u7684\u5C55\u5F00\u6811\u548C\u7C7B\u578B\u4FE1\u606F\u7EA6\u5B9A\uFF1B\u4E0D\u58F0\u79F0\u5BF9\u5E94 Chrome DevTools \u6216\u7279\u5B9A\u8F6F\u4EF6\u622A\u56FE\u3002"),
      defaults: {
        "appName": "\u6570\u636E\u68C0\u67E5\u5668",
        "workspace": "response.json",
        "appIcon": "code",
        "title": "\u793A\u4F8B\u6570\u636E",
        "path": "$.data[0].value",
        "selected": "value",
        "fields": [
          {
            "key": "response",
            "value": "Object",
            "type": "object",
            "depth": 0
          },
          {
            "key": "success",
            "value": "true",
            "type": "boolean",
            "depth": 1
          },
          {
            "key": "data",
            "value": "Array(2)",
            "type": "array",
            "depth": 1
          },
          {
            "key": "0",
            "value": "Object",
            "type": "object",
            "depth": 2
          },
          {
            "key": "id",
            "value": "1",
            "type": "number",
            "depth": 3
          },
          {
            "key": "label",
            "value": '"\u9879\u76EE A"',
            "type": "string",
            "depth": 3
          },
          {
            "key": "value",
            "value": "10",
            "type": "number",
            "depth": 3
          },
          {
            "key": "enabled",
            "value": "true",
            "type": "boolean",
            "depth": 3
          },
          {
            "key": "1",
            "value": "Object",
            "type": "object",
            "depth": 2
          },
          {
            "key": "total",
            "value": "2",
            "type": "number",
            "depth": 1
          }
        ],
        "detail": {
          "key": "value",
          "type": "number",
          "value": "10",
          "description": "\u5B57\u6BB5\u8BF4\u660E\u6587\u5B57",
          "constraint": "\u5927\u4E8E 0 \u7684\u6709\u9650\u6570\u503C",
          "location": "data \u2192 0 \u2192 value"
        }
      },
      render(props, h) {
        const p = cfg(this, props);
        const d = p.detail || {};
        return `<article class="dev-stage"><div class="dev-window dev-tool">${simpleHead(p, h, "\u6570\u636E\u68C0\u67E5\u5668")}<div class="dev-json-toolbar"><b>${h.esc(p.title)}</b><div>${h.icon("search", 15)} \u641C\u7D22\u952E\u6216\u503C</div><span>${h.icon("copy", 16)} ${h.icon("download", 16)}</span></div><div class="dev-tool-tabs"><b>\u6811\u89C6\u56FE</b><span>\u539F\u59CB\u6570\u636E</span><span>\u7ED3\u6784\u6821\u9A8C</span></div><div class="dev-json-body"><div class="dev-json-tree"><div class="dev-json-columns"><span>\u5C5E\u6027</span><span>\u503C</span><span>\u7C7B\u578B</span></div>${arr(p.fields).map((f) => `<div class="dev-json-row ${f.key === p.selected ? "dev-json-selected" : ""}" data-motion="item"><div style="padding-left:${12 + Math.max(0, Math.min(7, n(f.depth))) * 20}px"><span>${["object", "array"].includes(f.type) ? h.icon("chevron-down", 13) : ""}</span><code>${h.esc(f.key)}</code></div><code class="dev-json-${cls(f.type, ["number", "string", "boolean", "object", "array"], "object")}">${h.esc(f.value)}</code><small>${h.esc(f.type)}</small></div>`).join("")}</div><aside class="dev-json-detail"><div class="dev-sidebar-heading">\u5C5E\u6027\u8BE6\u60C5 ${h.icon("more", 16)}</div><h2>${h.esc(d.key)}</h2><span class="dev-type-badge">${h.esc(d.type)}</span><dl><dt>\u5F53\u524D\u503C</dt><dd class="dev-json-value" data-motion="counter">${h.esc(d.value)}</dd><dt>\u8BF4\u660E</dt><dd>${h.esc(d.description)}</dd><dt>\u7EA6\u675F</dt><dd>${h.esc(d.constraint)}</dd><dt>\u4F4D\u7F6E</dt><dd class="dev-mono">${h.esc(d.location)}</dd></dl></aside></div><div class="dev-tool-status">${h.icon("check-circle", 14)} JSON \u683C\u5F0F\u6709\u6548<span class="dev-mono">${h.esc(p.path)}</span></div></div></article>`;
      }
    },
    {
      id: "markdown-document",
      name: "Markdown \u7F16\u8F91\u4E0E\u9884\u89C8",
      category: "\u5F00\u53D1\u4E0E\u6570\u636E",
      width: 1280,
      height: 800,
      description: "VS Code \u98CE\u683C Markdown \u53CC\u680F\uFF0C\u5DE6\u4FA7\u53EF\u7F16\u8F91\u6E90\u6587\u672C\uFF0C\u53F3\u4FA7\u6807\u9898\u3001\u4EFB\u52A1\u5217\u8868\u3001\u5F15\u7528\u548C\u4EE3\u7801\u5757\u3002",
      reference: documented("VS Code Markdown \u5B98\u65B9\u9884\u89C8\u5E03\u5C40\uFF1B\u6E32\u67D3\u91C7\u7528\u53EF\u7F16\u8F91\u7ED3\u6784\u5316\u6570\u636E\uFF0C\u4E0D\u6267\u884C\u5D4C\u5165 HTML\u3002", "https://code.visualstudio.com/docs/languages/markdown"),
      defaults: {
        "project": "example-project",
        "filename": "README.md",
        "branch": "main",
        "language": "Markdown",
        "position": "\u884C 8\uFF0C\u5217 1",
        "title": "\u6587\u6863\u6807\u9898",
        "intro": "\u6587\u6863\u7B80\u4ECB\u3002\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u8BF4\u660E\u3002",
        "sectionTitle": "\u7AE0\u8282\u6807\u9898",
        "tasks": [
          {
            "text": "\u5F85\u529E\u4E8B\u9879 A",
            "done": true
          },
          {
            "text": "\u5F85\u529E\u4E8B\u9879 B",
            "done": true
          },
          {
            "text": "\u5F85\u529E\u4E8B\u9879 C",
            "done": false
          },
          {
            "text": "\u5F85\u529E\u4E8B\u9879 D",
            "done": false
          }
        ],
        "note": "\u63D0\u793A\u5185\u5BB9\uFF0C\u53EF\u66FF\u6362\u4E3A\u8865\u5145\u8BF4\u660E\u3002",
        "command": "node example.js\nnode verify.js",
        "sections": [
          {
            "title": "\u7AE0\u8282\u6807\u9898 A",
            "text": "\u6B63\u6587\u7B2C\u4E00\u6BB5\uFF0C\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u5185\u5BB9\u3002"
          },
          {
            "title": "\u7AE0\u8282\u6807\u9898 B",
            "text": "\u6B63\u6587\u7B2C\u4E8C\u6BB5\uFF0C\u652F\u6301\u7EE7\u7EED\u8865\u5145\u8BF4\u660E\u3002"
          }
        ],
        "source": [
          "# \u6587\u6863\u6807\u9898",
          "",
          "\u6587\u6863\u7B80\u4ECB\u3002\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u8BF4\u660E\u3002",
          "",
          "## \u7AE0\u8282\u6807\u9898",
          "",
          "- [x] \u5F85\u529E\u4E8B\u9879 A",
          "- [x] \u5F85\u529E\u4E8B\u9879 B",
          "- [ ] \u5F85\u529E\u4E8B\u9879 C",
          "- [ ] \u5F85\u529E\u4E8B\u9879 D",
          "",
          "> \u63D0\u793A\u5185\u5BB9\uFF0C\u53EF\u66FF\u6362\u4E3A\u8865\u5145\u8BF4\u660E\u3002",
          "",
          "```shell",
          "node example.js",
          "node verify.js",
          "```"
        ]
      },
      render(props, h) {
        const p = cfg(this, props);
        return shell2(p, h, `<div class="dev-markdown-split"><section>${tabs([{ name: p.filename, kind: "M\u2193" }], h)}${crumbs([p.project, p.filename], h)}${codeLines(p.source, h, { compact: true })}</section><section>${tabs([{ name: `\u9884\u89C8 ${p.filename}`, kind: "M\u2193" }], h)}<div class="dev-markdown-scroll-viewport"><div class="dev-markdown-preview" data-motion="scroll"><h1 data-motion="reveal">${h.esc(p.title)}</h1><p>${h.esc(p.intro)}</p><h2>${h.esc(p.sectionTitle)}</h2><ul>${arr(p.tasks).map((t) => `<li data-motion="item"><span class="${t.done ? "dev-checkbox-checked" : "dev-checkbox"}">${t.done ? h.icon("check", 12) : ""}</span>${h.esc(t.text)}</li>`).join("")}</ul><blockquote>${h.esc(p.note)}</blockquote><pre>${h.esc(p.command)}</pre>${arr(p.sections).map((s2) => `<h2>${h.esc(s2.title)}</h2><p>${h.esc(s2.text)}</p>`).join("")}</div></div></section></div>`);
      }
    },
    {
      id: "git-history",
      name: "Git \u5206\u652F\u4E0E\u63D0\u4EA4\u8BB0\u5F55",
      category: "\u5F00\u53D1\u4E0E\u6570\u636E",
      width: 1280,
      height: 800,
      description: "\u63D0\u4EA4\u5217\u8868\u3001\u5206\u652F\u56FE\u7EBF\u3001\u7248\u672C\u6807\u8BB0\u548C\u9009\u4E2D\u63D0\u4EA4\u8BE6\u60C5\uFF0C\u9002\u5408\u89E3\u91CA\u7248\u672C\u8FED\u4EE3\u548C\u529F\u80FD\u5206\u652F\u3002",
      reference: documented("\u53C2\u7167 VS Code Source Control Graph \u7684\u63D0\u4EA4\u5217\u8868\u4E0E\u5206\u652F\u7ED3\u6784\uFF1B\u8BE6\u60C5\u9762\u677F\u4E3A\u8BB2\u89E3\u7528\u9014\u8C03\u6574\uFF0C\u5C1A\u672A\u505A\u540C\u5C3A\u5BF8\u622A\u56FE\u5BF9\u6807\u3002", "https://code.visualstudio.com/docs/sourcecontrol/history"),
      defaults: {
        "project": "example-project",
        "branch": "main",
        "language": "Git",
        "position": "\u5DE5\u4F5C\u533A\u5E72\u51C0",
        "commits": [
          {
            "message": "\u63D0\u4EA4\u8BF4\u660E A",
            "hash": "e7a4c19",
            "author": "\u793A\u4F8B\u7528\u6237",
            "time": "10 \u5206\u949F\u524D",
            "branch": "main",
            "lane": 0
          },
          {
            "message": "\u63D0\u4EA4\u8BF4\u660E B",
            "hash": "cf821d0",
            "author": "\u793A\u4F8B\u7528\u6237",
            "time": "32 \u5206\u949F\u524D",
            "branch": "feature/example",
            "lane": 1
          },
          {
            "message": "\u63D0\u4EA4\u8BF4\u660E C",
            "hash": "c92e517",
            "author": "\u793A\u4F8B\u7528\u6237",
            "time": "1 \u5C0F\u65F6\u524D",
            "lane": 0
          },
          {
            "message": "\u63D0\u4EA4\u8BF4\u660E D",
            "hash": "85a46bf",
            "author": "\u793A\u4F8B\u7528\u6237",
            "time": "2 \u5C0F\u65F6\u524D",
            "lane": 1
          },
          {
            "message": "\u63D0\u4EA4\u8BF4\u660E E",
            "hash": "7db821a",
            "author": "\u793A\u4F8B\u7528\u6237",
            "time": "\u6628\u5929",
            "lane": 0
          },
          {
            "message": "\u63D0\u4EA4\u8BF4\u660E F",
            "hash": "096bcfe",
            "author": "\u793A\u4F8B\u7528\u6237",
            "time": "\u6628\u5929",
            "lane": 0
          }
        ],
        "selectedHash": "e7a4c19",
        "changedFiles": [
          {
            "name": "src/example.ts",
            "add": 8,
            "remove": 2
          },
          {
            "name": "tests/example.test.ts",
            "add": 4,
            "remove": 1
          },
          {
            "name": "example.json",
            "add": 2,
            "remove": 0
          }
        ],
        "detail": "\u5F53\u524D\u63D0\u4EA4\u7684\u53D8\u66F4\u8BF4\u660E\u3002"
      },
      render(props, h) {
        const p = cfg(this, props);
        const selected = arr(p.commits).find((c) => c.hash === p.selectedHash) || arr(p.commits)[0] || {};
        return shell2(p, h, `${tabs([{ name: "\u6E90\u4EE3\u7801\u7BA1\u7406\u56FE", kind: "\u2442" }], h)}<div class="dev-git-toolbar">${h.icon("git-branch", 16)} ${h.esc(p.branch)} ${h.icon("chevron-down", 13)}<span></span>${h.icon("refresh", 16)} ${h.icon("more", 18)}</div><div class="dev-git-columns"><span>\u56FE</span><span>\u63D0\u4EA4\u6D88\u606F</span><span>\u4F5C\u8005</span><span>\u65F6\u95F4</span><span>\u63D0\u4EA4</span></div><div class="dev-git-list">${arr(p.commits).map((c) => `<div class="dev-git-row ${c.hash === p.selectedHash ? "dev-git-selected" : ""}" data-motion="item"><span class="dev-git-graph"><i class="dev-git-rail"></i>${n(c.lane) === 1 ? '<i class="dev-git-branchline"></i>' : ""}<b class="${n(c.lane) === 1 ? "dev-git-node-side" : ""}"></b></span><span>${c.branch ? `<i class="dev-git-label">${h.icon("git-branch", 12)} ${h.esc(c.branch)}</i>` : ""}${h.esc(c.message)}</span><span>${h.esc(c.author)}</span><span>${h.esc(c.time)}</span><code>${h.esc(c.hash)}</code></div>`).join("")}</div><div class="dev-git-detail"><div><h2>${h.esc(selected.message)}</h2><p>${h.esc(selected.author)} <span>\u63D0\u4EA4\u4E8E ${h.esc(selected.time)} \xB7 ${h.esc(selected.hash)}</span></p><div class="dev-git-description">${h.esc(p.detail)}</div></div><div class="dev-git-files">${arr(p.changedFiles).map((f) => `<div>${h.icon("file", 14)}<code>${h.esc(f.name)}</code><b>+${h.esc(f.add)}</b><i>\u2212${h.esc(f.remove)}</i></div>`).join("")}</div></div>`, { active: "git-branch" });
      }
    },
    {
      id: "test-results",
      name: "\u81EA\u52A8\u5316\u6D4B\u8BD5\u7ED3\u679C",
      category: "\u5F00\u53D1\u4E0E\u6570\u636E",
      width: 1280,
      height: 800,
      description: "\u539F\u521B\u6D4B\u8BD5\u5DE5\u4F5C\u53F0\uFF0C\u5C55\u793A\u5957\u4EF6\u3001\u9010\u6761\u7ED3\u679C\u3001\u8017\u65F6\u4E0E\u63A7\u5236\u53F0\u8F93\u51FA\uFF0C\u53EF\u914D\u7F6E\u6210\u529F\u3001\u5931\u8D25\u548C\u8DF3\u8FC7\u72B6\u6001\u3002",
      reference: designed("\u539F\u521B\u684C\u9762\u6D4B\u8BD5\u5DE5\u4F5C\u53F0\uFF1B\u91C7\u7528\u6D4B\u8BD5\u8FD0\u884C\u5668\u901A\u7528\u7684\u5957\u4EF6\u6811\u3001\u7ED3\u679C\u3001\u8017\u65F6\u4E0E\u65AD\u8A00\u4FE1\u606F\u5E03\u5C40\uFF0C\u4E0D\u5192\u5145\u67D0\u4E2A\u6D4B\u8BD5\u4EA7\u54C1\u3002"),
      defaults: {
        "appName": "\u6D4B\u8BD5\u5DE5\u4F5C\u53F0",
        "workspace": "example-project",
        "appIcon": "check-circle",
        "suite": "tests / example.test.ts",
        "duration": "2.41 s",
        "tests": [
          {
            "name": "\u6D4B\u8BD5\u7528\u4F8B A",
            "status": "passed",
            "time": "142 ms"
          },
          {
            "name": "\u6D4B\u8BD5\u7528\u4F8B B",
            "status": "passed",
            "time": "388 ms"
          },
          {
            "name": "\u6D4B\u8BD5\u7528\u4F8B C",
            "status": "passed",
            "time": "96 ms"
          },
          {
            "name": "\u6D4B\u8BD5\u7528\u4F8B D",
            "status": "passed",
            "time": "421 ms"
          },
          {
            "name": "\u6D4B\u8BD5\u7528\u4F8B E",
            "status": "passed",
            "time": "532 ms"
          },
          {
            "name": "\u6D4B\u8BD5\u7528\u4F8B F",
            "status": "passed",
            "time": "108 ms"
          }
        ],
        "output": [
          "RUN  tests/example.test.ts",
          "",
          "\u2713 \u6D4B\u8BD5\u7528\u4F8B A",
          "\u2713 \u6D4B\u8BD5\u7528\u4F8B B",
          "\u2713 \u6D4B\u8BD5\u7528\u4F8B C",
          "\u2713 \u6D4B\u8BD5\u7528\u4F8B D",
          "\u2713 \u6D4B\u8BD5\u7528\u4F8B E",
          "\u2713 \u6D4B\u8BD5\u7528\u4F8B F",
          "",
          "Test Files  1 passed (1)",
          "     Tests  6 passed (6)",
          "  Duration  2.41s"
        ],
        "runLabel": "\u672C\u6B21\u8FD0\u884C"
      },
      render(props, h) {
        const p = cfg(this, props);
        const tests = arr(p.tests), passed = tests.filter((t) => t.status === "passed").length, failed = tests.filter((t) => t.status === "failed").length;
        return `<article class="dev-stage"><div class="dev-window dev-tool">${simpleHead(p, h, "\u6D4B\u8BD5\u5DE5\u4F5C\u53F0")}<div class="dev-test-toolbar"><b>${h.esc(p.runLabel)}</b><span>${h.icon("play", 14)} \u91CD\u65B0\u8FD0\u884C</span><span>${h.icon("refresh", 14)} \u81EA\u52A8\u76D1\u6D4B</span><i></i><span>${h.icon("search", 14)} \u7B5B\u9009\u7ED3\u679C</span></div><div class="dev-test-summary"><div class="dev-test-ring ${failed ? "dev-test-ring-failed" : ""}">${h.icon(failed ? "x" : "check", 24)}</div><div><h2>${!tests.length ? "\u6682\u65E0\u6D4B\u8BD5\u7ED3\u679C" : failed ? "\u5B58\u5728\u5931\u8D25\u7528\u4F8B" : passed === tests.length ? "\u5168\u90E8\u6D4B\u8BD5\u901A\u8FC7" : "\u6D4B\u8BD5\u5B8C\u6210"}</h2><p>${tests.length} \u4E2A\u6D4B\u8BD5 \xB7 ${h.esc(p.duration)}</p></div><div class="dev-test-stat"><b>${passed}</b><span>\u901A\u8FC7</span></div><div class="dev-test-stat ${failed ? "dev-test-error" : ""}"><b>${failed}</b><span>\u5931\u8D25</span></div><div class="dev-test-stat"><b>${tests.filter((t) => t.status === "skipped").length}</b><span>\u8DF3\u8FC7</span></div></div><div class="dev-test-progress"><span style="width:${tests.length ? passed / tests.length * 100 : 0}%" data-motion="bar"></span></div><div class="dev-test-body"><section class="dev-test-results"><div class="dev-test-suite">${h.icon("chevron-down", 15)}${h.icon("file", 16)}<b>${h.esc(p.suite)}</b></div>${tests.map((t) => `<div class="dev-test-case" data-motion="item"><span class="dev-test-icon ${t.status === "failed" ? "dev-test-error" : ""}">${h.icon(t.status === "failed" ? "x" : t.status === "skipped" ? "minus" : "check-circle", 17)}</span><span>${h.esc(t.name)}</span><code>${h.esc(t.time)}</code></div>`).join("")}</section><section class="dev-test-console"><div>\u63A7\u5236\u53F0\u8F93\u51FA ${h.icon("copy", 15)}</div><pre>${arr(p.output).map((l) => `<span data-motion="line">${h.esc(l) || "&#160;"}</span>`).join("")}</pre></section></div><div class="dev-tool-status">${h.icon("info", 14)} \u53EF\u66FF\u6362\u7684\u6D4B\u8BD5\u7ED3\u679C\u793A\u4F8B<span>\u672A\u5728\u7EC4\u4EF6\u4E2D\u6267\u884C\u6D4B\u8BD5</span></div></div></article>`;
      }
    },
    {
      id: "data-table",
      name: "\u6570\u636E\u5E93\u8868\u683C\u4E0E\u8BB0\u5F55\u8BE6\u60C5",
      category: "\u5F00\u53D1\u4E0E\u6570\u636E",
      width: 1280,
      height: 800,
      description: "\u539F\u521B\u6570\u636E\u7BA1\u7406\u5668\uFF0C\u5305\u542B\u6570\u636E\u5E93\u5BFC\u822A\u3001\u5B57\u6BB5\u7C7B\u578B\u3001\u9009\u4E2D\u5355\u5143\u683C\u3001\u72B6\u6001\u6807\u7B7E\u3001\u8BB0\u5F55\u8BE6\u60C5\u4E0E\u5206\u9875\u3002",
      reference: designed("\u539F\u521B\u6570\u636E\u5E93\u5BA2\u6237\u7AEF\u754C\u9762\uFF1B\u4EE5\u771F\u5B9E\u6570\u636E\u8868\u7684\u5B57\u6BB5\u3001\u4E3B\u952E\u3001\u7C7B\u578B\u3001\u72B6\u6001\u4E0E\u5206\u9875\u6784\u6210\uFF0C\u4E0D\u5BF9\u5E94\u7279\u5B9A\u5546\u7528\u4EA7\u54C1\u3002"),
      defaults: {
        "appName": "\u6570\u636E\u5DE5\u4F5C\u53F0",
        "workspace": "example.db",
        "appIcon": "grid",
        "table": "items",
        "tables": [
          "items",
          "groups",
          "events",
          "settings"
        ],
        "columns": [
          {
            "key": "id",
            "label": "\u7F16\u53F7",
            "type": "integer"
          },
          {
            "key": "title",
            "label": "\u5B57\u6BB5 A",
            "type": "text"
          },
          {
            "key": "component",
            "label": "\u5B57\u6BB5 B",
            "type": "text"
          },
          {
            "key": "duration",
            "label": "\u6570\u503C",
            "type": "real"
          },
          {
            "key": "status",
            "label": "\u72B6\u6001",
            "type": "text"
          }
        ],
        "rows": [
          {
            "id": 1,
            "title": "\u9879\u76EE A",
            "component": "\u5185\u5BB9 A",
            "duration": 5,
            "status": "\u5B8C\u6210"
          },
          {
            "id": 2,
            "title": "\u9879\u76EE B",
            "component": "\u5185\u5BB9 B",
            "duration": 12.5,
            "status": "\u5B8C\u6210"
          },
          {
            "id": 3,
            "title": "\u9879\u76EE C",
            "component": "\u5185\u5BB9 C",
            "duration": 8,
            "status": "\u5B8C\u6210"
          },
          {
            "id": 4,
            "title": "\u9879\u76EE D",
            "component": "\u5185\u5BB9 D",
            "duration": 10,
            "status": "\u7F16\u8F91\u4E2D"
          },
          {
            "id": 5,
            "title": "\u9879\u76EE E",
            "component": "\u5185\u5BB9 E",
            "duration": 14,
            "status": "\u5F85\u5904\u7406"
          },
          {
            "id": 6,
            "title": "\u9879\u76EE F",
            "component": "\u5185\u5BB9 F",
            "duration": 8.5,
            "status": "\u5F85\u5904\u7406"
          },
          {
            "id": 7,
            "title": "\u9879\u76EE G",
            "component": "\u5185\u5BB9 G",
            "duration": 6,
            "status": "\u5F85\u5904\u7406"
          }
        ],
        "selectedId": 4,
        "filter": 'status != "\u5DF2\u5F52\u6863"',
        "recordTitle": "\u5F53\u524D\u8BB0\u5F55",
        "footer": "7 \u6761\u8BB0\u5F55 \xB7 5 \u4E2A\u5B57\u6BB5"
      },
      render(props, h) {
        const p = cfg(this, props);
        const row = arr(p.rows).find((r) => String(r.id) === String(p.selectedId)) || arr(p.rows)[0] || {};
        return `<article class="dev-stage"><div class="dev-window dev-tool">${simpleHead(p, h, "\u6570\u636E\u5DE5\u4F5C\u53F0")}<div class="dev-data-body"><aside class="dev-data-sidebar"><div class="dev-sidebar-heading">\u6570\u636E\u5E93 ${h.icon("plus", 16)}</div><div class="dev-tree-group">${h.icon("chevron-down", 13)} main</div>${arr(p.tables).map((t) => `<div class="dev-tree-row ${t === p.table ? "dev-tree-selected" : ""}">${h.icon("grid", 16)}${h.esc(t)}</div>`).join("")}</aside><main class="dev-data-main"><div class="dev-data-toolbar"><b>${h.icon("grid", 16)} ${h.esc(p.table)}</b><span>\u6570\u636E</span><span>\u7ED3\u6784</span><i></i>${h.icon("plus", 16)} \u6DFB\u52A0\u8BB0\u5F55 ${h.icon("refresh", 16)}</div><div class="dev-data-filter">${h.icon("search", 15)}<code>${h.esc(p.filter)}</code><span>\u7B5B\u9009 ${h.icon("chevron-down", 13)}</span></div><div class="dev-data-content"><div class="dev-data-grid"><table><thead><tr><th class="dev-data-rowno">#</th>${arr(p.columns).map((c) => `<th>${h.esc(c.label)}<small>${h.esc(c.type)}</small></th>`).join("")}</tr></thead><tbody>${arr(p.rows).map((r, i) => `<tr class="${String(r.id) === String(p.selectedId) ? "dev-data-selected" : ""}" data-motion="item"><td>${i + 1}</td>${arr(p.columns).map((c) => `<td>${c.key === "status" ? `<span class="dev-record-status ${r[c.key] === "\u5B8C\u6210" ? "dev-record-done" : r[c.key] === "\u7F16\u8F91\u4E2D" ? "dev-record-active" : ""}">${h.esc(r[c.key])}</span>` : h.esc(r[c.key])}</td>`).join("")}</tr>`).join("")}</tbody></table><div class="dev-data-filler"></div></div><aside class="dev-record-detail"><div>${h.esc(p.recordTitle)} ${h.icon("more", 15)}</div><h3>#${h.esc(row.id)}</h3>${arr(p.columns).map((c) => `<dl><dt>${h.esc(c.label)} <small>${h.esc(c.type)}</small></dt><dd>${h.esc(row[c.key])}</dd></dl>`).join("")}</aside></div><div class="dev-data-pager">${h.esc(p.footer)}<span>1\u2013${arr(p.rows).length} / ${arr(p.rows).length} ${h.icon("chevron-right", 14)}</span></div></main></div><div class="dev-tool-status">${h.icon("lock", 13)} \u53EA\u8BFB\u9884\u89C8<span>main.${h.esc(p.table)}</span></div></div></article>`;
      }
    }
  ];

  // families/doubao-chat.mjs
  var arr2 = (value) => Array.isArray(value) ? value : [];
  var str2 = (value) => String(value ?? "");
  var source = (value) => {
    const text7 = str2(value).trim().replaceAll("\\", "/");
    if (!text7 || /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(text7) || /[\u0000-\u001f]/.test(text7)) return "";
    return text7.split("/").every((part2) => {
      let decoded = part2;
      try {
        decoded = decodeURIComponent(part2);
      } catch {
      }
      return decoded !== "." && decoded !== ".." && !/[\\/]/.test(decoded);
    }) ? text7 : "";
  };
  function chatIcon(size = 18) {
    return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-6 3V6a2 2 0 0 1 2-2Z"/><path d="M7 9h10M7 13h7"/></svg>`;
  }
  function thumb(down = false) {
    return `<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"${down ? ' style="transform:rotate(180deg)"' : ""}><path d="M7 10v11H3V10ZM7 10l5-7c2 0 3 1 2 4l-1 3h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 2H7"/></svg>`;
  }
  function sidebar3(p, h) {
    return `<aside class="dbchat-sidebar"><div class="dbchat-brand"><strong>${h.esc(p.brand)}</strong><span>${h.icon("search", 18)}</span></div><nav class="dbchat-nav">${arr2(p.navigation).map((item, index) => `<div class="dbchat-nav-row${item.active ? " dbchat-nav-active" : ""}" data-nav-index="${index}"><span class="dbchat-nav-icon">${item.icon === "chat" ? chatIcon(17) : h.icon(item.icon || "file", 17)}</span><span>${h.esc(item.label)}</span></div>`).join("")}</nav><div class="dbchat-sidebar-section"><div class="dbchat-section-label">${h.esc(p.pinnedLabel)}</div><div class="dbchat-nav-row">${chatIcon(17)}<span>${h.esc(p.pinnedTitle)}</span></div></div><div class="dbchat-sidebar-section"><div class="dbchat-section-label">${h.esc(p.projectsLabel)}</div><div class="dbchat-nav-row dbchat-muted">${h.icon("plus", 17)}<span>${h.esc(p.newProjectLabel)}</span></div></div><div class="dbchat-sidebar-section"><div class="dbchat-section-label">${h.esc(p.recentLabel)}</div>${arr2(p.recentTasks).map((item) => `<div class="dbchat-recent-task${item.active ? " dbchat-nav-active" : ""}">${h.esc(typeof item === "string" ? item : item.title)}</div>`).join("")}</div><div class="dbchat-account"><span class="dbchat-avatar" aria-hidden="true"><i></i></span><div class="dbchat-account-text"><span>${h.esc(p.accountLabel)} ${h.icon("chevron-right", 10)}</span><small>${h.esc(p.planLabel)}</small></div><span class="dbchat-settings">${h.icon("settings", 18)}</span></div></aside>`;
  }
  function answerActions(h) {
    return `<div class="dbchat-answer-actions" data-part="answer-actions" aria-hidden="true">${h.icon("copy", 15)}${h.icon("volume", 16)}${thumb()}${thumb(true)}${h.icon("git-branch", 15)}${h.icon("refresh", 15)}${h.icon("more", 16)}</div>`;
  }
  function message2(m, index, h) {
    const role = m.role === "user" ? "user" : "assistant";
    const paragraphs2 = Array.isArray(m.paragraphs) ? m.paragraphs : m.text ? [m.text] : [];
    const state3 = ["idle", "draft", "running", "complete"].includes(m.state) ? m.state : "complete";
    return `<article class="dbchat-message dbchat-message-${role}" data-message-id="${h.esc(m.id || `message-${index + 1}`)}" data-message-index="${index}" data-state="${state3}" data-motion="item"${m.visible === false ? " hidden" : ""}><div class="dbchat-message-body" data-part="message-text" data-motion="reveal">${m.heading ? `<h3>${h.esc(m.heading)}</h3>` : ""}${paragraphs2.map((text7, i) => `<p data-paragraph-index="${i}" data-motion="line">${h.esc(text7)}</p>`).join("")}${arr2(m.bullets).length ? `<ul>${m.bullets.map((text7) => `<li data-motion="line">${h.esc(text7)}</li>`).join("")}</ul>` : ""}${arr2(m.fields).length ? `<dl>${m.fields.map((field, i) => `<div data-field-index="${i}" data-motion="line"><dt>${h.esc(field.label)}</dt><dd>${h.esc(field.value)}</dd></div>`).join("")}</dl>` : ""}${m.linkLabel ? `<div class="dbchat-demo-link" data-motion="highlight">${h.icon("link", 14)}<span>${h.esc(m.linkLabel)}</span><small>${h.esc(m.linkNote || "\u6F14\u793A\u5360\u4F4D")}</small></div>` : ""}</div>${role === "assistant" && m.actions ? answerActions(h) : ""}</article>`;
  }
  function composer3(p, h) {
    const c = { ...p, ...p.composer };
    const draft = str2(c.draft), running = Boolean(c.running), tools2 = arr2(c.tools);
    const requestedLimit = Number(c.maxTools), limit = Number.isFinite(requestedLimit) ? Math.max(0, Math.min(5, requestedLimit)) : 3;
    return `<div class="dbchat-composer${draft ? " dbchat-has-draft" : ""}${c.focused ? " dbchat-focused" : ""}" data-part="composer" data-state="${running ? "running" : draft ? "draft" : "idle"}" data-motion="focus"><div class="dbchat-editor" data-part="draft" data-motion="type" data-draft="${h.esc(draft)}">${h.esc(draft || c.placeholder)}</div><div class="dbchat-composer-footer"><div class="dbchat-composer-tools"><span class="dbchat-plus">${h.icon("plus", 19)}</span><span class="dbchat-mode">${chatIcon(16)}${h.esc(c.modeLabel)}${h.icon("chevron-down", 10)}</span>${tools2.slice(0, limit).map((tool2, i) => `<span class="dbchat-tool" data-tool-index="${i}">${h.icon(tool2.icon || "file", 15)}<span>${h.esc(typeof tool2 === "string" ? tool2 : tool2.label)}</span></span>`).join("")}${tools2.length > limit ? `<span class="dbchat-more-tools">${h.icon("more", 18)}</span>` : ""}</div><div class="dbchat-composer-right"><span class="dbchat-model">${h.esc(c.modelLabel)}<span>${h.esc(c.speedLabel)}</span>${h.icon("chevron-right", 10)}</span><span class="dbchat-send${running ? " dbchat-stop" : draft ? " dbchat-send-ready" : " dbchat-send-mic"}" data-part="send" data-state="${running ? "stop" : draft ? "send" : "mic"}" data-motion="cursor">${running ? "<i></i>" : draft ? h.icon("arrow-up", 18) : h.icon("mic", 18)}</span></div></div></div>`;
  }
  function home(p, h) {
    const logo = source(p.logoSrc);
    return `<div class="dbchat-home" data-part="home" data-motion="reveal">${p.showHomeLogo && logo ? `<img class="dbchat-home-logo" src="${h.esc(logo)}" alt="${h.esc(p.brand)}">` : ""}<h2>${h.esc(p.homeTitle)}</h2><div class="dbchat-home-switch"><span class="dbchat-switch-active">${chatIcon(16)}${h.esc(p.conversationModeLabel)}</span><span>${h.icon("monitor", 16)}${h.esc(p.workModeLabel)}</span></div></div>`;
  }
  var components23 = [{
    id: "doubao-chat",
    name: "\u8C46\u5305 \xB7 \u666E\u901A\u5BF9\u8BDD",
    category: "\u8C46\u5305",
    description: "\u4F9D\u636E\u8C46\u5305\u516C\u5F00\u804A\u5929\u9875\u9762\u7684\u666E\u901A\u5BF9\u8BDD\u6A21\u5F0F\u590D\u523B\uFF1A\u7070\u8272\u53F3\u4FA7\u7528\u6237\u6D88\u606F\u3001\u65E0\u6C14\u6CE1\u52A9\u624B\u6B63\u6587\u3001\u5E95\u90E8\u5BF9\u8BDD\u8F93\u5165\u533A\uFF1B\u591A\u8F6E\u5185\u5BB9\u548C\u72B6\u6001\u5747\u53EF\u7F16\u8F91\u3002",
    width: 1280,
    height: 800,
    reference: { basis: "2026-09-18 \u901A\u8FC7\u6D4F\u89C8\u5668\u89C2\u5BDF www.doubao.com/chat/ \u666E\u901A\u5BF9\u8BDD\u6A21\u5F0F\uFF0C1920\xD7910\uFF1B\u672C\u7EC4\u4EF6\u6309 1280\xD7800 \u9002\u914D\u3002\u684C\u9762 app \u622A\u56FE\u56E0\u81EA\u52A8\u5316\u8EAB\u4EFD\u6821\u9A8C\u5F02\u5E38\u672A\u6210\u529F\uFF0C\u4E0D\u5BA3\u79F0\u684C\u9762\u9010\u50CF\u7D20\u5BF9\u9F50\u3002", source: "https://www.doubao.com/chat/\uFF1Breports/doubao-chat-notes.md", level: "documented" },
    defaults: {
      "brand": "\u8C46\u5305",
      "logoSrc": "assets/brands/doubao.png",
      "showHomeLogo": false,
      "title": "\u5BF9\u8BDD\u6807\u9898",
      "notice": "AI \u751F\u6210\u53EF\u80FD\u6709\u8BEF\uFF0C\u8BF7\u6838\u5B9E",
      "simulationLabel": "\u754C\u9762\u590D\u523B \xB7 \u6848\u4F8B\u6F14\u793A",
      "showSidebar": true,
      "showHome": false,
      "homeTitle": "\u6709\u4EC0\u4E48\u6211\u80FD\u5E2E\u4F60\u7684\u5417\uFF1F",
      "conversationModeLabel": "\u5BF9\u8BDD",
      "workModeLabel": "\u5DE5\u4F5C",
      "navigation": [
        {
          "label": "\u65B0\u5DE5\u4F5C\u4EFB\u52A1",
          "icon": "edit"
        },
        {
          "label": "\u65B0\u5BF9\u8BDD",
          "icon": "chat"
        },
        {
          "label": "\u5B9A\u65F6\u4EFB\u52A1",
          "icon": "clock"
        },
        {
          "label": "\u63D2\u4EF6\xB7\u6280\u80FD\xB7\u4F19\u4F34",
          "icon": "grid"
        },
        {
          "label": "\u4E91\u76D8",
          "icon": "folder"
        },
        {
          "label": "API \u670D\u52A1",
          "icon": "code"
        },
        {
          "label": "\u66F4\u591A",
          "icon": "more"
        }
      ],
      "pinnedLabel": "\u7F6E\u9876",
      "pinnedTitle": "\u793A\u4F8B\u5BF9\u8BDD",
      "projectsLabel": "\u9879\u76EE",
      "newProjectLabel": "\u521B\u5EFA\u9879\u76EE",
      "recentLabel": "\u6700\u8FD1",
      "recentTasks": [],
      "accountLabel": "\u7528\u6237",
      "planLabel": "\u6807\u51C6\u5957\u9910",
      "messages": [
        {
          "id": "request-vague",
          "role": "user",
          "text": "\u7528\u6237\u6D88\u606F\u5185\u5BB9\u3002\u53EF\u66FF\u6362\u4E3A\u4F60\u7684\u8F93\u5165\u3002"
        },
        {
          "id": "reply-vague",
          "role": "assistant",
          "heading": "\u56DE\u590D\u6807\u9898",
          "text": "\u56DE\u590D\u6B63\u6587\u5185\u5BB9\u3002\u652F\u6301\u6BB5\u843D\u3001\u8981\u70B9\u4E0E\u540E\u7EED\u8865\u5145\u3002",
          "actions": true
        }
      ],
      "suggestions": [
        "\u540E\u7EED\u95EE\u9898 A",
        "\u540E\u7EED\u95EE\u9898 B"
      ],
      "draft": "",
      "running": false,
      "focused": false,
      "placeholder": "\u53D1\u6D88\u606F\u6216\u6309\u4F4F\u7A7A\u683C\u8BF4\u8BDD...",
      "modeLabel": "\u5BF9\u8BDD",
      "modelLabel": "\u8C46\u5305",
      "speedLabel": "\u5FEB\u901F",
      "maxTools": 3,
      "tools": [
        {
          "label": "\u5F55\u97F3\u8F6C\u5199",
          "icon": "mic"
        },
        {
          "label": "\u56FE\u50CF\u751F\u6210",
          "icon": "image"
        },
        {
          "label": "PPT \u751F\u6210",
          "icon": "file"
        },
        {
          "label": "\u5E2E\u6211\u5199\u4F5C",
          "icon": "edit"
        },
        {
          "label": "\u89C6\u9891\u751F\u6210",
          "icon": "video"
        },
        {
          "label": "AI \u64AD\u5BA2",
          "icon": "volume"
        }
      ],
      "workingLabel": "\u6B63\u5728\u751F\u6210",
      "composer": {}
    },
    render(props, h) {
      const p = { ...this.defaults, ...props }, c = { ...p, ...p.composer }, running = Boolean(c.running);
      const requestedHeight = Number(c.height ?? p.composerHeight), draft = str2(c.draft);
      const lines3 = draft.split(/\r?\n/).reduce((sum, line3) => sum + Math.max(1, Math.ceil(line3.length / 40)), 0);
      const height = Number.isFinite(requestedHeight) && requestedHeight > 0 ? Math.max(120, Math.min(240, requestedHeight)) : Math.min(240, Math.max(120, lines3 * 28 + 72));
      const messages2 = arr2(p.messages), isHome = p.showHome && !messages2.length;
      return `<section class="dbchat-app${p.showSidebar === false ? " dbchat-no-sidebar" : ""}" data-simulation="true" data-state="${running ? "running" : draft ? "draft" : "idle"}" style="--dbchat-composer-height:${height}px">${p.showSidebar === false ? "" : sidebar3(p, h)}<main class="dbchat-main"><header class="dbchat-header"><div class="dbchat-header-left">${h.icon("panel", 18)}${isHome ? "" : h.icon("edit", 17)}</div>${isHome ? "" : `<div class="dbchat-thread-title"><strong>${h.esc(p.title)}</strong><small>${h.esc(p.notice)}</small></div>`}<div class="dbchat-header-right">${h.icon("volume", 17)}${h.icon("more", 18)}</div></header><div class="dbchat-simulation" data-part="disclosure">${h.esc(p.disclosure || p.simulationLabel || "\u754C\u9762\u590D\u523B \xB7 \u6848\u4F8B\u6F14\u793A")}</div><div class="dbchat-conversation" data-part="conversation"><div class="dbchat-viewport" data-part="viewport"><div class="dbchat-messages" data-part="message-list" data-motion="scroll">${isHome ? home(p, h) : messages2.map((m, i) => message2(m, i, h)).join("")}${running ? `<div class="dbchat-working" data-part="status" data-state="running" data-motion="reveal"><span>${h.esc(p.workingLabel)}</span><i>\xB7\xB7\xB7</i></div>` : ""}${!isHome && !running && arr2(p.suggestions).length ? `<div class="dbchat-suggestions" data-part="suggestions">${p.suggestions.map((text7, index) => `<span data-suggestion-index="${index}" data-motion="item">${h.esc(text7)}${h.icon("arrow-right", 13)}</span>`).join("")}</div>` : ""}</div></div></div><div class="dbchat-composer-anchor">${composer3(p, h)}</div></main></section>`;
    }
  }];

  // families/doubao-work.mjs
  var list3 = (value) => Array.isArray(value) ? value : [];
  var str3 = (value) => String(value ?? "");
  var safeLocalSource = (value) => {
    const source2 = str3(value).trim();
    return source2 && !/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(source2) ? source2 : "";
  };
  var state2 = (value) => ["idle", "draft", "running", "complete"].includes(value) ? value : "idle";
  function windowControls(h) {
    return `<div class="dbw-window-controls" aria-hidden="true"><span>${h.icon("minus", 14)}</span><span>${h.icon("maximize", 12)}</span><span>${h.icon("x", 15)}</span></div>`;
  }
  function sidebar4(p, h) {
    const source2 = safeLocalSource(p.logoSrc);
    const navigation = list3(p.navigation);
    return `<aside class="dbw-sidebar">
    <div class="dbw-brand">${source2 ? `<img src="${h.esc(source2)}" alt="" class="dbw-brand-logo">` : ""}<strong>${h.esc(p.brand)}</strong><span>${h.esc(p.brandSuffix)}</span><span class="dbw-search">${h.icon("search", 17)}</span></div>
    <nav class="dbw-navigation">${navigation.map((item, index) => `<div class="dbw-nav-row${item.active ? " dbw-selected" : ""}" data-nav-index="${index}"><span class="dbw-nav-icon">${h.icon(item.icon || "file", 18)}</span><span>${h.esc(item.label)}</span></div>`).join("")}</nav>
    <div class="dbw-sidebar-section"><div class="dbw-section-label">${h.esc(p.pinnedLabel)}</div><div class="dbw-nav-row">${h.icon("list", 17)}<span>${h.esc(p.pinnedTitle)}</span></div></div>
    <div class="dbw-sidebar-section"><div class="dbw-section-label">${h.esc(p.projectsLabel)}</div><div class="dbw-nav-row dbw-muted">${h.icon("plus", 18)}<span>${h.esc(p.newProjectLabel)}</span></div></div>
    <div class="dbw-sidebar-section"><div class="dbw-section-label">${h.esc(p.recentLabel)}</div>${list3(p.recentTasks).map((item) => `<div class="dbw-recent-task${item.active ? " dbw-selected" : ""}">${h.esc(typeof item === "string" ? item : item.title)}</div>`).join("")}</div>
    <div class="dbw-account"><span class="dbw-avatar" aria-hidden="true"><i></i></span><div><div class="dbw-account-name">${h.esc(p.accountLabel)}${h.icon("chevron-right", 12)}</div><div class="dbw-plan">${h.esc(p.planLabel)}</div></div></div>
  </aside>`;
  }
  function message3(message4, index, h) {
    const role = message4.role === "user" ? "user" : "assistant";
    const messageState = state2(message4.state || "complete");
    const paragraphs2 = Array.isArray(message4.paragraphs) ? message4.paragraphs : message4.text ? [message4.text] : [];
    const fields2 = list3(message4.fields);
    const bullets = list3(message4.bullets);
    return `<article class="dbw-message dbw-message-${role}" data-message-id="${h.esc(message4.id || `message-${index + 1}`)}" data-message-index="${index}" data-state="${messageState}" data-motion="item"${message4.visible === false ? " hidden" : ""}>
    ${role === "assistant" && message4.status ? `<div class="dbw-message-status" data-motion="reveal">${h.esc(message4.status)}${messageState === "running" ? '<span class="dbw-static-dots">\xB7\xB7\xB7</span>' : ""}</div>` : ""}
    <div class="dbw-message-body" data-motion="reveal" data-part="message-text">
      ${message4.heading ? `<h3>${h.esc(message4.heading)}</h3>` : ""}
      ${paragraphs2.map((paragraph, paragraphIndex) => `<p data-motion="line" data-paragraph-index="${paragraphIndex}">${h.esc(paragraph)}</p>`).join("")}
      ${fields2.length ? `<dl class="dbw-message-fields">${fields2.map((field, fieldIndex) => `<div data-motion="line" data-field-index="${fieldIndex}"><dt>${h.esc(field.label)}</dt><dd>${h.esc(field.value)}</dd></div>`).join("")}</dl>` : ""}
      ${bullets.length ? `<ul>${bullets.map((item) => `<li data-motion="line">${h.esc(item)}</li>`).join("")}</ul>` : ""}
      ${message4.linkLabel ? `<div class="dbw-demo-link" data-motion="highlight">${h.icon("link", 15)}<span>${h.esc(message4.linkLabel)}</span><small>${h.esc(message4.linkNote || "\u6F14\u793A\u5360\u4F4D")}</small></div>` : ""}
    </div>
    ${role === "assistant" && message4.actions ? `<div class="dbw-answer-actions" aria-hidden="true">${h.icon("copy", 14)}${h.icon("refresh", 14)}${h.icon("more", 16)}</div>` : ""}
  </article>`;
  }
  function composer4(p, h) {
    const c = { ...p, ...p.composer || {} };
    const running = Boolean(c.running);
    const hasDraft = Boolean(str3(c.draft));
    return `<div class="dbw-composer${hasDraft ? " dbw-has-draft" : ""}${c.focused ? " dbw-composer-focused" : ""}" data-state="${running ? "running" : hasDraft ? "draft" : "idle"}" data-part="composer" data-motion="focus">
    <div class="dbw-editor" data-part="draft" data-motion="type" data-draft="${h.esc(c.draft || "")}">${h.esc(hasDraft ? c.draft : c.placeholder)}</div>
    <div class="dbw-composer-footer"><div class="dbw-composer-left"><span class="dbw-plus">${h.icon("plus", 19)}</span><span class="dbw-local-chip">${h.icon("monitor", 15)}${h.esc(c.environmentLabel)}</span><span class="dbw-composer-menu">${h.icon("folder", 15)}${h.esc(c.projectLabel)}${h.icon("chevron-right", 10)}</span><span class="dbw-composer-menu dbw-permission">${h.icon("info", 15)}${h.esc(c.permissionLabel)}${h.icon("chevron-right", 10)}</span><span class="dbw-composer-overflow">${h.icon("more", 18)}</span></div><div class="dbw-composer-right"><span class="dbw-model">${h.esc(c.modeLabel)}<span>${h.esc(c.effortLabel)}</span>${h.icon("chevron-right", 10)}</span><span class="dbw-send ${running ? "dbw-send-stop" : hasDraft ? "dbw-send-ready" : "dbw-send-mic"}" data-part="send" data-motion="cursor" data-state="${running ? "stop" : hasDraft ? "send" : "mic"}">${running ? "<i></i>" : hasDraft ? h.icon("arrow-up", 17) : h.icon("mic", 17)}</span></div></div>
  </div>`;
  }
  function summaryPanel(p, h) {
    const panel5 = p.summary || {};
    return `<aside class="dbw-summary" data-motion="reveal"><header><span>${h.esc(panel5.title || p.summaryTitle)}</span>${h.icon("panel", 16)}</header><div class="dbw-summary-body"><div class="dbw-summary-section"><div class="dbw-summary-section-heading"><span>${h.esc(panel5.artifactsLabel || p.artifactsLabel)}</span>${h.icon("plus", 15)}</div>${list3(panel5.artifacts).map((item) => `<div class="dbw-summary-file" data-motion="item">${h.icon("file", 16)}<span>${h.esc(typeof item === "string" ? item : item.name)}</span></div>`).join("")}</div><div class="dbw-summary-section"><div class="dbw-summary-section-heading"><span>${h.esc(panel5.skillsLabel || p.skillsLabel)}</span>${h.icon("chevron-right", 12)}</div></div><div class="dbw-summary-section"><div class="dbw-summary-section-heading"><span>${h.esc(panel5.filesLabel || p.filesLabel)}</span>${h.icon("chevron-right", 12)}</div>${list3(panel5.files).map((item) => `<div class="dbw-summary-file" data-motion="item">${h.icon("file", 16)}<span>${h.esc(typeof item === "string" ? item : item.name)}</span></div>`).join("")}</div></div></aside>`;
  }
  var components24 = [{
    id: "doubao-workflow",
    name: "\u8C46\u5305\u5DE5\u4F5C \xB7 \u591A\u8F6E\u5BF9\u8BDD",
    category: "\u8C46\u5305\u5DE5\u4F5C",
    description: "\u6309\u684C\u9762\u8C46\u5305\u5DE5\u4F5C\u7684\u4FA7\u680F\u3001\u7070\u8272\u7528\u6237\u6D88\u606F\u3001\u65E0\u6C14\u6CE1\u6B63\u6587\u3001\u8F93\u5165\u680F\u53CA\u5BF9\u8BDD\u6458\u8981\u7ED3\u6784\u5236\u4F5C\u7684\u53EF\u7F16\u8F91\u6559\u5B66\u6A21\u62DF\u3002",
    width: 1280,
    height: 800,
    reference: {
      basis: "\u4EE5 2026-09-18 \u672C\u673A Windows \u8C46\u5305\u5DE5\u4F5C\u754C\u9762\u89C2\u5BDF\u4E3A\u539F\u578B\uFF1B\u7EC4\u4EF6\u4E3A 1280\xD7800\uFF0C\u4FA7\u680F\u53CA\u6458\u8981\u5404 240px\u3001\u6B63\u6587 18px\uFF0C\u6309\u9884\u89C8\u53EF\u8BFB\u6027\u8C03\u6574\u6392\u7248\uFF0C\u672A\u505A\u5168\u72B6\u6001\u9010\u50CF\u7D20\u9A8C\u6536\u3002",
      source: "\u672C\u673A DoubaoWork.ChatApp \u5B9E\u9645\u754C\u9762\u89C2\u5BDF\uFF1Breports/doubao-work-notes.md",
      level: "documented"
    },
    defaults: {
      "title": "\u4EFB\u52A1\u6807\u9898",
      "notice": "AI \u751F\u6210\u53EF\u80FD\u6709\u8BEF\uFF0C\u8BF7\u6838\u5B9E",
      "simulationLabel": "\u754C\u9762\u590D\u523B \xB7 \u6848\u4F8B\u6F14\u793A",
      "brand": "\u8C46\u5305",
      "brandSuffix": "\u5DE5\u4F5C",
      "logoSrc": "",
      "navigation": [
        {
          "label": "\u65B0\u5DE5\u4F5C\u4EFB\u52A1",
          "icon": "edit"
        },
        {
          "label": "\u5B9A\u65F6\u4EFB\u52A1",
          "icon": "clock"
        },
        {
          "label": "\u63D2\u4EF6\xB7\u6280\u80FD\xB7\u4F19\u4F34",
          "icon": "grid"
        },
        {
          "label": "\u4E91\u76D8",
          "icon": "folder"
        },
        {
          "label": "\u624B\u673A\u9065\u63A7\u7535\u8111",
          "icon": "phone"
        }
      ],
      "pinnedLabel": "\u7F6E\u9876",
      "pinnedTitle": "\u793A\u4F8B\u5BF9\u8BDD",
      "projectsLabel": "\u9879\u76EE",
      "newProjectLabel": "\u65B0\u5EFA\u9879\u76EE",
      "recentLabel": "\u6700\u8FD1",
      "recentTasks": [],
      "accountLabel": "\u7528\u6237",
      "planLabel": "\u6807\u51C6\u5957\u9910",
      "showSidebar": true,
      "showSummary": true,
      "summaryTitle": "\u5BF9\u8BDD\u6458\u8981",
      "artifactsLabel": "\u5BF9\u8BDD\u4EA7\u7269",
      "skillsLabel": "\u6280\u80FD",
      "filesLabel": "\u6700\u8FD1\u6587\u4EF6",
      "summary": {
        "artifacts": [],
        "files": []
      },
      "messages": [
        {
          "id": "request-vague",
          "role": "user",
          "text": "\u7528\u6237\u6D88\u606F A\uFF1A\u586B\u5199\u521D\u59CB\u8981\u6C42\u3002"
        },
        {
          "id": "reply-vague",
          "role": "assistant",
          "text": "\u56DE\u590D\u5185\u5BB9 A\uFF1A\u5C55\u793A\u521D\u6B65\u7ED3\u679C\u3002"
        },
        {
          "id": "request-clear",
          "role": "user",
          "text": "\u7528\u6237\u6D88\u606F B\uFF1A\u586B\u5199\u8865\u5145\u8981\u6C42\u3002",
          "linkLabel": "\u793A\u4F8B\u94FE\u63A5",
          "linkNote": "\u793A\u4F8B\u5165\u53E3"
        },
        {
          "id": "reply-clear",
          "role": "assistant",
          "heading": "\u56DE\u590D\u6807\u9898",
          "text": "\u56DE\u590D\u5185\u5BB9 B\uFF1A\u5C55\u793A\u66F4\u65B0\u540E\u7684\u7ED3\u679C\u3002",
          "linkLabel": "\u793A\u4F8B\u94FE\u63A5",
          "linkNote": "\u793A\u4F8B\u5165\u53E3",
          "actions": true
        }
      ],
      "draft": "",
      "running": false,
      "focused": false,
      "placeholder": "\u53D1\u6D88\u606F\u6216\u521B\u5EFA\u4EFB\u52A1... / \u4F7F\u7528\u6280\u80FD @ \u6DFB\u52A0\u8D44\u6599",
      "environmentLabel": "\u672C\u5730\u7535\u8111",
      "projectLabel": "\u9879\u76EE",
      "permissionLabel": "\u5168\u90E8\u5141\u8BB8",
      "modeLabel": "\u81EA\u52A8",
      "effortLabel": "\u9AD8",
      "workingLabel": "\u6B63\u5728\u5904\u7406\u4EFB\u52A1",
      "homeTitle": "\u4ECA\u5929\u6709\u4EC0\u4E48\u5DE5\u4F5C\u8981\u5904\u7406\uFF1F",
      "showHome": false
    },
    render(props, h) {
      const p = { ...this.defaults, ...props };
      const running = Boolean(p.composer?.running ?? p.running);
      const draft = str3(p.composer?.draft ?? p.draft);
      const requestedHeight = Number(p.composer?.height ?? p.composerHeight);
      const lines3 = draft.split(/\r?\n/).reduce((sum, line3) => sum + Math.max(1, Math.ceil(line3.length / 36)), 0);
      const composerHeight = Number.isFinite(requestedHeight) && requestedHeight > 0 ? Math.max(124, Math.min(244, requestedHeight)) : Math.min(244, Math.max(p.composer?.expanded ? 160 : 124, lines3 * 28 + 76));
      const messages2 = list3(p.messages);
      return `<section class="dbw-app${p.showSidebar === false ? " dbw-no-sidebar" : ""}${p.showSummary === false ? " dbw-no-summary" : ""}" data-state="${running ? "running" : "idle"}" data-simulation="true" style="--dbw-composer-height:${composerHeight}px">
      <div class="dbw-titlebar"><div class="dbw-simulation-label">${h.esc(p.simulationLabel || "\u754C\u9762\u590D\u523B \xB7 \u6848\u4F8B\u6F14\u793A")}</div>${windowControls(h)}</div>
      <div class="dbw-workbench">${p.showSidebar === false ? "" : sidebar4(p, h)}<main class="dbw-main"><header class="dbw-main-header"><span class="dbw-header-start">${h.icon("panel", 18)}${h.icon("edit", 17)}</span><div class="dbw-thread-title"><strong>${h.esc(p.title)}</strong><small>${h.esc(p.notice)}</small></div><span class="dbw-header-end">${h.icon("more", 18)}</span></header>
      <div class="dbw-conversation" data-part="viewport"><div class="dbw-messages" data-part="message-list" data-motion="scroll">${p.showHome && !messages2.length ? `<div class="dbw-home"><h2>${h.esc(p.homeTitle)}</h2></div>` : messages2.map((item, index) => message3(item, index, h)).join("")}${running ? `<div class="dbw-working" data-part="status" data-state="running" data-motion="reveal">${h.esc(p.workingLabel)}<span class="dbw-static-dots">\xB7\xB7\xB7</span></div>` : ""}</div></div><div class="dbw-composer-anchor">${composer4(p, h)}</div></main>${p.showSummary === false ? "" : summaryPanel(p, h)}</div>
    </section>`;
    }
  }];

  // families/education-expanded.mjs
  var colors2 = ["#2563eb", "#5b8def", "#81c9b0", "#f0b35c", "#9b8bd1", "#87a1b9"];
  var list4 = (v, min = 1, max = 12) => {
    if (!Array.isArray(v) || v.length < min || v.length > max) throw Error(`\u9700\u8981 ${min}\u2013${max} \u9879\u6570\u636E`);
    return v;
  };
  var number8 = (v) => {
    const n4 = Number(v);
    if (!Number.isFinite(n4) || n4 < 0) throw Error("\u6570\u503C\u5FC5\u987B\u662F\u6709\u9650\u7684\u975E\u8D1F\u6570");
    return n4;
  };
  var svg = (body, view = "0 0 1120 460") => `<svg class="edx-svg" viewBox="${view}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  var txt4 = (h, x, y, text7, size = 20, anchor = "middle", color5 = "#243247") => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${color5}">${h.esc(text7)}</text>`;
  var line2 = (x1, y1, x2, y2, cls2 = "") => `<path ${cls2} d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="#b6c9e7" stroke-width="2"/>`;
  var node3 = (h, x, y, w, label3, detail = "", fill = "#eff5ff") => `<g data-motion="item"><rect x="${x - w / 2}" y="${y - 33}" width="${w}" height="66" rx="14" fill="${fill}" stroke="#bed1ef"/>${txt4(h, x, y - 2, label3, 21)}${txt4(h, x, y + 23, detail, 14, "middle", "#60748c")}</g>`;
  function shell3(p, h, body, cls2 = "") {
    return `<section class="edx-scene ${cls2}"><header><div><span class="edx-eyebrow">${h.esc(p.eyebrow)}</span><h1>${h.esc(p.title)}</h1><p>${h.esc(p.subtitle)}</p></div><b>${h.esc(p.badge)}</b></header><main>${body}</main><footer><span>${h.esc(p.note)}</span><b>EXPLAIN / ${h.esc(p.code)}</b></footer></section>`;
  }
  function make6(id, name, description, defaults3, render) {
    return { id, name, description, category: "\u539F\u521B\u8BB2\u89E3\u56FE\u5F62", width: 1280, height: 800, reference: { level: "designed", basis: "\u539F\u521B\u53EF\u7F16\u8F91\u4FE1\u606F\u56FE\uFF1B\u793A\u4F8B\u6570\u636E\u7528\u4E8E\u8BB2\u89E3\uFF0C\u4E0D\u4EE3\u8868\u4EA7\u54C1\u5B9E\u6D4B\u3002", source: "\u672C\u5DE5\u7A0B\u539F\u521B SVG / HTML" }, defaults: { eyebrow: "EXPLAIN / \u7ED3\u6784\u4E0E\u6570\u636E", title: name, subtitle: description, badge: "\u793A\u4F8B\u6570\u636E", note: "\u66FF\u6362\u5185\u5BB9\u540E\uFF0C\u56FE\u5F62\u4E0E\u6570\u503C\u4E00\u8D77\u66F4\u65B0\u3002", code: id.toUpperCase(), ...defaults3 }, render(p, h) {
      return render(p, h);
    } };
  }
  var components25 = [
    make6("donut-chart", "\u73AF\u5F62\u5360\u6BD4\u56FE", "\u628A\u6574\u4F53\u62C6\u6210\u51E0\u90E8\u5206\uFF0C\u540C\u65F6\u4FDD\u7559\u6570\u91CF\u4E0E\u767E\u5206\u6BD4\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "items": [
        {
          "label": "\u7C7B\u522B A",
          "value": 42
        },
        {
          "label": "\u7C7B\u522B B",
          "value": 28
        },
        {
          "label": "\u7C7B\u522B C",
          "value": 20
        },
        {
          "label": "\u7C7B\u522B D",
          "value": 10
        }
      ],
      "unit": "\u5355\u4F4D"
    }, (p, h) => {
      const a2 = list4(p.items, 2, 6), sum = a2.reduce((s2, x) => s2 + number8(x.value), 0);
      if (!sum) throw Error("\u5360\u6BD4\u603B\u6570\u4E0D\u80FD\u4E3A\u96F6");
      let offset = 0;
      const ring = a2.map((x, i) => {
        const fraction = x.value / sum, v = `<circle data-motion="segment" cx="290" cy="225" r="150" fill="none" stroke="${colors2[i]}" stroke-width="52" stroke-dasharray="${fraction * 942.4778} 942.4778" stroke-dashoffset="${-offset * 942.4778}" transform="rotate(-90 290 225)"/>`;
        offset += fraction;
        return v;
      }).join("");
      return shell3(p, h, svg(ring + txt4(h, 290, 224, sum, 52) + txt4(h, 290, 262, p.unit, 18, "middle", "#60748c") + a2.map((x, i) => `<g data-motion="item"><rect x="605" y="${88 + i * 83}" width="14" height="14" rx="4" fill="${colors2[i]}"/>${txt4(h, 640, 103 + i * 83, x.label, 23, "start")}${txt4(h, 1010, 103 + i * 83, `${x.value} \xB7 ${(x.value / sum * 100).toFixed(0)}%`, 22, "end")}</g>`).join("")));
    }),
    make6("scatter-plot", "\u6563\u70B9\u5173\u7CFB\u56FE", "\u7528\u4E8C\u7EF4\u5750\u6807\u540C\u65F6\u6BD4\u8F83\u4E24\u4E2A\u53D8\u91CF\uFF0C\u4FDD\u7559\u6BCF\u4E2A\u5BF9\u8C61\u7684\u4F4D\u7F6E\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "xLabel": "\u6A2A\u8F74\u540D\u79F0",
      "yLabel": "\u7EB5\u8F74\u540D\u79F0",
      "xMax": 10,
      "yMax": 100,
      "points": [
        {
          "label": "A",
          "x": 2,
          "y": 34
        },
        {
          "label": "B",
          "x": 3.5,
          "y": 48
        },
        {
          "label": "C",
          "x": 5,
          "y": 63
        },
        {
          "label": "D",
          "x": 6.7,
          "y": 79
        },
        {
          "label": "E",
          "x": 8.6,
          "y": 87
        }
      ]
    }, (p, h) => {
      const a2 = list4(p.points, 2, 12), xm = number8(p.xMax), ym = number8(p.yMax);
      if (!xm || !ym || a2.some((x) => number8(x.x) > xm || number8(x.y) > ym)) throw Error("\u70B9\u5750\u6807\u5FC5\u987B\u5728\u6B63\u6570\u5750\u6807\u4E0A\u9650\u5185");
      let grid = "";
      for (let i = 0; i <= 5; i++) grid += line2(100, 370 - i * 62, 1020, 370 - i * 62) + txt4(h, 78, 377 - i * 62, ym * i / 5, 15, "end") + txt4(h, 100 + i * 184, 404, xm * i / 5, 15);
      return shell3(p, h, svg(grid + txt4(h, 560, 448, p.xLabel, 18) + txt4(h, 102, 34, p.yLabel, 18, "start") + a2.map((x, i) => `<g data-motion="point"><circle cx="${100 + x.x / xm * 920}" cy="${370 - x.y / ym * 310}" r="12" fill="${colors2[i % 6]}" opacity=".85"/>${txt4(h, 100 + x.x / xm * 920, 349 - x.y / ym * 310, x.label, 17)}</g>`).join("")));
    }),
    make6("heatmap", "\u5F3A\u5EA6\u70ED\u529B\u56FE", "\u7528\u7EDF\u4E00\u8272\u9636\u5B9A\u4F4D\u9AD8\u4F4E\u503C\uFF0C\u9002\u5408\u6BD4\u8F83\u65F6\u95F4\u6BB5\u548C\u7C7B\u522B\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "columns": [
        "\u5217 A",
        "\u5217 B",
        "\u5217 C",
        "\u5217 D",
        "\u5217 E"
      ],
      "rows": [
        {
          "label": "\u884C A",
          "values": [
            8,
            6,
            3,
            2,
            1
          ]
        },
        {
          "label": "\u884C B",
          "values": [
            2,
            7,
            8,
            4,
            2
          ]
        },
        {
          "label": "\u884C C",
          "values": [
            1,
            3,
            6,
            9,
            7
          ]
        },
        {
          "label": "\u884C D",
          "values": [
            0,
            1,
            2,
            4,
            8
          ]
        }
      ],
      "max": 10
    }, (p, h) => {
      const cols = list4(p.columns, 2, 7), rows3 = list4(p.rows, 2, 5), max = number8(p.max);
      if (!max) throw Error("max \u5FC5\u987B\u5927\u4E8E\u96F6");
      const w = 880 / cols.length, ht = 300 / rows3.length;
      return shell3(p, h, svg(cols.map((x, i) => txt4(h, 195 + (i + 0.5) * w, 48, x, 18)).join("") + rows3.map((r, j) => {
        if (list4(r.values).length !== cols.length) throw Error("\u6BCF\u884C\u6570\u503C\u9700\u4E0E\u5217\u6570\u4E00\u81F4");
        return txt4(h, 156, 85 + (j + 0.5) * ht, r.label, 20, "end") + r.values.map((v, i) => {
          const z = number8(v) / max;
          if (z > 1) throw Error("\u6570\u503C\u4E0D\u80FD\u8D85\u8FC7 max");
          return `<g data-motion="cell"><rect x="${197 + i * w}" y="${64 + j * ht}" width="${w - 7}" height="${ht - 7}" rx="7" fill="rgb(${Math.round(239 - 202 * z)},${Math.round(245 - 146 * z)},${Math.round(255 - 20 * z)})"/>${txt4(h, 195 + (i + 0.5) * w, 62 + (j + 0.6) * ht, v, 22, "middle", z > 0.6 ? "#fff" : "#24456c")}</g>`;
        }).join("");
      }).join("") + Array.from({ length: 10 }, (_, i) => `<rect x="${400 + i * 30}" y="404" width="30" height="13" fill="rgb(${239 - i * 20},${245 - i * 14},${255 - i * 2})"/>`).join("") + txt4(h, 360, 417, "\u4F4E", 16) + txt4(h, 738, 417, "\u9AD8", 16)));
    }),
    make6("funnel-chart", "\u8F6C\u5316\u6F0F\u6597\u56FE", "\u6309\u9636\u6BB5\u5BBD\u5EA6\u5C55\u793A\u6570\u91CF\u9012\u51CF\uFF0C\u8BFB\u51FA\u6BCF\u4E00\u6B65\u7684\u8F6C\u5316\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "stages": [
        {
          "label": "\u9636\u6BB5 A",
          "value": 120
        },
        {
          "label": "\u9636\u6BB5 B",
          "value": 84
        },
        {
          "label": "\u9636\u6BB5 C",
          "value": 48
        },
        {
          "label": "\u9636\u6BB5 D",
          "value": 30
        }
      ],
      "unit": "\u5355\u4F4D"
    }, (p, h) => {
      const a2 = list4(p.stages, 2, 5), max = number8(a2[0].value);
      if (!max || a2.some((x, i) => number8(x.value) > (i ? a2[i - 1].value : max))) throw Error("\u6F0F\u6597\u6570\u503C\u987B\u6309\u975E\u589E\u987A\u5E8F\u6392\u5217");
      return shell3(p, h, svg(a2.map((x, i) => {
        const width = 640 * x.value / max, x0 = 425 - width / 2, y = 30 + i * 96;
        return `<g data-motion="item"><rect data-motion="bar" x="${x0}" y="${y}" width="${width}" height="72" rx="12" fill="${colors2[i]}"/>${txt4(h, 425, y + 45, `${x.label}  ${x.value}`, 23, "middle", "#fff")}${txt4(h, 880, y + 45, `${(x.value / max * 100).toFixed(0)}%`, 28)}${i ? txt4(h, 1030, y + 44, `\u4E0A\u6B65 ${(x.value / a2[i - 1].value * 100).toFixed(0)}%`, 16) : ""}</g>`;
      }).join("")));
    }),
    make6("radar-chart", "\u591A\u7EF4\u96F7\u8FBE\u56FE", "\u5728\u76F8\u540C\u91CF\u5C3A\u4E0A\u6BD4\u8F83\u591A\u4E2A\u80FD\u529B\u7EF4\u5EA6\uFF0C\u8F6E\u5ED3\u4E0E\u5206\u503C\u5BF9\u5E94\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "max": 100,
      "axes": [
        "\u7EF4\u5EA6 A",
        "\u7EF4\u5EA6 B",
        "\u7EF4\u5EA6 C",
        "\u7EF4\u5EA6 D",
        "\u7EF4\u5EA6 E"
      ],
      "values": [
        90,
        70,
        94,
        82,
        68
      ],
      "caption": "\u7CFB\u5217 A"
    }, (p, h) => {
      const a2 = list4(p.axes, 3, 7);
      if (list4(p.values).length !== a2.length) throw Error("axes \u4E0E values \u957F\u5EA6\u4E0D\u4E00\u81F4");
      const max = number8(p.max);
      if (!max || p.values.some((x) => number8(x) > max)) throw Error("\u8BC4\u5206\u8D85\u51FA\u91CF\u5C3A");
      const point3 = (i, r) => [470 + Math.sin(i / a2.length * Math.PI * 2) * r, 230 - Math.cos(i / a2.length * Math.PI * 2) * r];
      return shell3(p, h, svg([0.25, 0.5, 0.75, 1].map((v) => `<polygon points="${a2.map((_, i) => point3(i, 175 * v).join(",")).join(" ")}" fill="none" stroke="#d5e0ef"/>`).join("") + a2.map((x, i) => {
        const [x1, y1] = point3(i, 175), [x2, y2] = point3(i, 211);
        return line2(470, 230, x1, y1) + txt4(h, x2, y2, x, 19);
      }).join("") + `<polygon data-motion="radar" points="${p.values.map((v, i) => point3(i, 175 * v / max).join(",")).join(" ")}" fill="#2563eb25" stroke="#2563eb" stroke-width="3"/>` + p.values.map((v, i) => {
        const [x, y] = point3(i, 175 * v / max);
        return `<circle data-motion="point" cx="${x}" cy="${y}" r="5" fill="#2563eb"/>`;
      }).join("") + txt4(h, 955, 130, p.caption, 22) + a2.map((x, i) => txt4(h, 955, 178 + i * 41, `${x}  ${p.values[i]}`, 19)).join("")));
    }),
    make6("pyramid-diagram", "\u5C42\u7EA7\u91D1\u5B57\u5854", "\u7528\u5C42\u7EA7\u5173\u7CFB\u89E3\u91CA\u4ECE\u57FA\u7840\u5230\u5E94\u7528\u7684\u7EC4\u7EC7\u65B9\u5F0F\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "layers": [
        {
          "label": "\u5C42\u7EA7 A",
          "detail": "\u5C42\u7EA7\u8BF4\u660E A"
        },
        {
          "label": "\u5C42\u7EA7 B",
          "detail": "\u5C42\u7EA7\u8BF4\u660E B"
        },
        {
          "label": "\u5C42\u7EA7 C",
          "detail": "\u5C42\u7EA7\u8BF4\u660E C"
        },
        {
          "label": "\u5C42\u7EA7 D",
          "detail": "\u5C42\u7EA7\u8BF4\u660E D"
        }
      ]
    }, (p, h) => {
      const a2 = list4(p.layers, 3, 5), top = 25, step = 390 / a2.length;
      return shell3(p, h, svg(a2.map((x, i) => {
        const wt = 30 + i * 140, wb = 30 + (i + 1) * 140, y = top + i * step;
        return `<g data-motion="item"><path d="M${400 - wt / 2} ${y}H${400 + wt / 2}L${400 + wb / 2} ${y + step - 6}H${400 - wb / 2}Z" fill="${colors2[i]}"/>${line2(400 + wb / 2 + 15, y + step / 2, 820, y + step / 2)}${txt4(h, 850, y + step / 2 - 5, x.label, 23, "start")}${txt4(h, 850, y + step / 2 + 23, x.detail, 16, "start", "#667b94")}</g>`;
      }).join("")));
    }),
    make6("venn-diagram", "\u4EA4\u96C6\u5173\u7CFB\u56FE", "\u7528\u4E24\u4E2A\u96C6\u5408\u53CA\u5171\u540C\u533A\u57DF\u89E3\u91CA\u6982\u5FF5\u4E4B\u95F4\u7684\u5173\u7CFB\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "left": "\u96C6\u5408 A",
      "right": "\u96C6\u5408 B",
      "overlap": "\u4EA4\u96C6",
      "leftDetail": "\u96C6\u5408\u8BF4\u660E A",
      "rightDetail": "\u96C6\u5408\u8BF4\u660E B"
    }, (p, h) => shell3(p, h, svg(`<g data-motion="item"><circle cx="425" cy="218" r="166" fill="#2563eb17" stroke="#6a98e9" stroke-width="2"/>${txt4(h, 339, 205, p.left, 30)}${txt4(h, 339, 246, p.leftDetail, 16)}</g><g data-motion="item"><circle cx="683" cy="218" r="166" fill="#81c9b030" stroke="#63b99c" stroke-width="2"/>${txt4(h, 769, 205, p.right, 30)}${txt4(h, 769, 246, p.rightDetail, 16)}</g><g data-motion="focus"><rect x="477" y="193" width="154" height="54" rx="27" fill="#fff" stroke="#b8cce5"/>${txt4(h, 554, 227, p.overlap, 23)}</g>`))),
    make6("mind-map", "\u653E\u5C04\u601D\u7EF4\u5BFC\u56FE", "\u56F4\u7ED5\u4E00\u4E2A\u4E3B\u9898\u5C55\u5F00\u5206\u652F\uFF0C\u9002\u5408\u9009\u9898\u62C6\u89E3\u548C\u77E5\u8BC6\u7EC4\u7EC7\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "center": "\u4E2D\u5FC3\u4E3B\u9898",
      "branches": [
        {
          "title": "\u7AE0\u8282\u6807\u9898 A",
          "detail": "\u7AE0\u8282\u8BF4\u660E A"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 B",
          "detail": "\u7AE0\u8282\u8BF4\u660E B"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 C",
          "detail": "\u7AE0\u8282\u8BF4\u660E C"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 D",
          "detail": "\u7AE0\u8282\u8BF4\u660E D"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 E",
          "detail": "\u7AE0\u8282\u8BF4\u660E E"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 F",
          "detail": "\u7AE0\u8282\u8BF4\u660E F"
        }
      ],
      "centerCaption": "\u4E2D\u5FC3\u8BF4\u660E"
    }, (p, h) => {
      const a2 = list4(p.branches, 3, 6), coords = [[240, 66], [860, 66], [103, 230], [997, 230], [240, 397], [860, 397]];
      return shell3(p, h, svg(a2.map((x, i) => {
        const [x1, y] = coords[i];
        return `<path data-motion="line" d="M560 230Q${x1} 230 ${x1} ${y}" fill="none" stroke="#9dbbec" stroke-width="3"/>`;
      }).join("") + node3(h, 560, 230, 230, p.center, p.centerCaption, "#dceaff") + a2.map((x, i) => node3(h, ...coords[i], 218, x.title, x.detail, i % 2 ? "#eff8f4" : "#f1f5fc")).join("")));
    }),
    make6("cycle-diagram", "\u5FAA\u73AF\u53CD\u9988\u56FE", "\u628A\u6267\u884C\u3001\u89C2\u5BDF\u4E0E\u4FEE\u6B63\u8FDE\u63A5\u6210\u53EF\u91CD\u590D\u7684\u5FAA\u73AF\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "center": "\u4E2D\u5FC3\u4E3B\u9898",
      "steps": [
        {
          "title": "\u7AE0\u8282\u6807\u9898 A",
          "detail": "\u7AE0\u8282\u8BF4\u660E A"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 B",
          "detail": "\u7AE0\u8282\u8BF4\u660E B"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 C",
          "detail": "\u7AE0\u8282\u8BF4\u660E C"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 D",
          "detail": "\u7AE0\u8282\u8BF4\u660E D"
        }
      ]
    }, (p, h) => {
      const a2 = list4(p.steps, 4, 4), pos = [[560, 58], [900, 228], [560, 403], [220, 228]], mark = h.uid("cycle-arrow");
      return shell3(p, h, svg(`<defs><marker id="${mark}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 7 4 0 8" fill="#719ddd"/></marker></defs>` + ["M650 75Q810 70 880 174", "M884 279Q805 395 665 396", "M459 396Q300 389 235 284", "M230 176Q300 66 455 70"].map((d) => `<path data-motion="line" d="${d}" fill="none" stroke="#719ddd" stroke-width="3" marker-end="url(#${mark})"/>`).join("") + txt4(h, 560, 238, p.center, 32) + a2.map((x, i) => node3(h, ...pos[i], 230, x.title, x.detail)).join("")));
    }),
    make6("decision-tree", "\u51B3\u7B56\u6811", "\u628A\u6761\u4EF6\u3001\u5206\u652F\u4E0E\u7ED3\u679C\u5206\u5F00\uFF0C\u9002\u5408\u89E3\u91CA\u9009\u62E9\u903B\u8F91\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "question": "\u5224\u65AD\u6761\u4EF6 A\uFF1F",
      "yes": "\u7ED3\u679C A",
      "no": "\u5224\u65AD\u6761\u4EF6 B\uFF1F",
      "yes2": "\u7ED3\u679C B",
      "no2": "\u7ED3\u679C C",
      "yesLabel": "\u662F",
      "noLabel": "\u5426",
      "yesDetail": "\u7ED3\u679C\u8BF4\u660E A"
    }, (p, h) => shell3(p, h, svg(`<path data-motion="line" d="M560 94V151H277V220M560 151H837V220M837 286V342H652V388M837 342H1010V388" fill="none" stroke="#88aadd" stroke-width="3"/>` + node3(h, 560, 62, 324, p.question) + node3(h, 277, 252, 232, p.yes, p.yesDetail, "#eaf7f0") + node3(h, 837, 252, 310, p.no) + node3(h, 652, 416, 225, p.yes2) + node3(h, 1010, 416, 211, p.no2) + txt4(h, 300, 142, p.yesLabel, 18) + txt4(h, 810, 142, p.noLabel, 18) + txt4(h, 675, 334, p.yesLabel, 18) + txt4(h, 998, 334, p.noLabel, 18)))),
    make6("architecture-map", "\u7CFB\u7EDF\u67B6\u6784\u56FE", "\u5C06\u5165\u53E3\u3001\u670D\u52A1\u4E0E\u5B58\u50A8\u5206\u5C42\uFF0C\u8FDE\u7EBF\u8868\u8FBE\u6570\u636E\u6D41\u5411\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "layers": [
        {
          "name": "\u5C42\u7EA7 A",
          "items": [
            "\u8282\u70B9 A",
            "\u8282\u70B9 B",
            "\u8282\u70B9 C"
          ]
        },
        {
          "name": "\u5C42\u7EA7 B",
          "items": [
            "\u8282\u70B9 A",
            "\u8282\u70B9 B",
            "\u8282\u70B9 C"
          ]
        },
        {
          "name": "\u5C42\u7EA7 C",
          "items": [
            "\u8282\u70B9 A",
            "\u8282\u70B9 B",
            "\u8282\u70B9 C"
          ]
        }
      ]
    }, (p, h) => {
      const a2 = list4(p.layers, 3, 3);
      return shell3(p, h, svg(a2.map((r, j) => `<rect x="95" y="${24 + j * 142}" width="1010" height="111" rx="14" fill="${j === 1 ? "#f1f6ff" : "#f6f8fb"}"/>${txt4(h, 64, 88 + j * 142, r.name, 19)}${list4(r.items, 3, 3).map((x, i) => node3(h, 290 + i * 330, 78 + j * 142, 253, x, "", j === 1 ? "#e2edff" : "#fff")).join("")}`).join("") + [0, 1].map((j) => [290, 620, 950].map((x) => `<path data-motion="line" d="M${x} ${111 + j * 142}v76" stroke="#94afda" stroke-width="2" stroke-dasharray="5 5"/>`).join("")).join("")));
    }),
    make6("swimlane-flow", "\u804C\u8D23\u6CF3\u9053\u56FE", "\u6309\u89D2\u8272\u6392\u5217\u52A8\u4F5C\uFF0C\u7A81\u51FA\u4EA4\u63A5\u70B9\u4E0E\u8D23\u4EFB\u8FB9\u754C\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "lanes": [
        {
          "name": "\u89D2\u8272 A",
          "tasks": [
            {
              "title": "\u4EFB\u52A1 A",
              "column": 0
            },
            {
              "title": "\u4EFB\u52A1 B",
              "column": 1
            }
          ]
        },
        {
          "name": "\u89D2\u8272 B",
          "tasks": [
            {
              "title": "\u4EFB\u52A1 C",
              "column": 2
            },
            {
              "title": "\u4EFB\u52A1 D",
              "column": 3
            }
          ]
        },
        {
          "name": "\u89D2\u8272 C",
          "tasks": [
            {
              "title": "\u4EFB\u52A1 E",
              "column": 4
            }
          ]
        }
      ]
    }, (p, h) => {
      const a2 = list4(p.lanes, 3, 3), xs = [231, 425, 619, 813, 1007], route = a2.flatMap((r, j) => r.tasks.map((t) => ({ x: xs[t.column], y: 94 + j * 135, column: t.column }))).sort((a3, b2) => a3.column - b2.column);
      if (new Set(route.map((t) => t.column)).size !== route.length) throw Error("\u6BCF\u4E2A\u6B65\u9AA4\u8BF7\u4F7F\u7528\u4E00\u4E2A\u4E0D\u540C\u7684 column");
      const links = route.slice(1).map((b2, i) => {
        const a3 = route[i], mx = (a3.x + b2.x) / 2;
        return `M${a3.x + 82} ${a3.y}H${mx}V${b2.y}H${b2.x - 82}`;
      }).join("");
      return shell3(p, h, svg(a2.map((r, j) => `<rect x="0" y="${30 + j * 135}" width="1120" height="127" rx="10" fill="${j % 2 ? "#f7f9fc" : "#edf3fa"}"/>${txt4(h, 61, 103 + j * 135, r.name, 23)}${list4(r.tasks, 1, 5).map((t) => {
        if (!Number.isInteger(t.column) || t.column < 0 || t.column > 4) throw Error("column \u8303\u56F4 0\u20134");
        return node3(h, xs[t.column], 94 + j * 135, 164, t.title);
      }).join("")}`).join("") + `<path data-motion="line" d="${links}" fill="none" stroke="#79a1dc" stroke-width="3"/>`));
    }),
    make6("kanban-board", "\u4EFB\u52A1\u770B\u677F", "\u8BA9\u4EFB\u52A1\u6309\u72B6\u6001\u5206\u7EC4\uFF0C\u7528\u5361\u7247\u4F4D\u7F6E\u89E3\u91CA\u5DE5\u4F5C\u6D41\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "columns": [
        {
          "name": "\u5F85\u5F00\u59CB",
          "tasks": [
            {
              "title": "\u4EFB\u52A1 A",
              "tag": "\u6807\u7B7E A",
              "reference": "\u9879\u76EE A / 01",
              "period": "\u65F6\u95F4\u6807\u7B7E",
              "assignee": "\u7528"
            },
            {
              "title": "\u4EFB\u52A1 B",
              "tag": "\u6807\u7B7E A",
              "reference": "\u9879\u76EE A / 02",
              "period": "\u65F6\u95F4\u6807\u7B7E",
              "assignee": "\u7528"
            }
          ]
        },
        {
          "name": "\u8FDB\u884C\u4E2D",
          "tasks": [
            {
              "title": "\u4EFB\u52A1 C",
              "tag": "\u6807\u7B7E B",
              "reference": "\u9879\u76EE B / 01",
              "period": "\u65F6\u95F4\u6807\u7B7E",
              "assignee": "\u7528"
            },
            {
              "title": "\u4EFB\u52A1 D",
              "tag": "\u6807\u7B7E B",
              "reference": "\u9879\u76EE B / 02",
              "period": "\u65F6\u95F4\u6807\u7B7E",
              "assignee": "\u7528"
            }
          ]
        },
        {
          "name": "\u5DF2\u5B8C\u6210",
          "tasks": [
            {
              "title": "\u4EFB\u52A1 E",
              "tag": "\u6807\u7B7E C",
              "reference": "\u9879\u76EE C / 01",
              "period": "\u65F6\u95F4\u6807\u7B7E",
              "assignee": "\u7528"
            }
          ]
        }
      ]
    }, (p, h) => shell3(p, h, `<div class="edx-board">${list4(p.columns, 3, 3).map((c, i) => `<section><h2><i style="background:${colors2[i]}"></i>${h.esc(c.name)}<small>${c.tasks.length}</small></h2>${list4(c.tasks, 1, 4).map((t, j) => `<article data-motion="item"><span class="edx-task-tag">${h.esc(t.tag)}</span><h3>${h.esc(t.title)}</h3><p>${h.esc(t.reference)}</p><div class="edx-task-bottom"><span>\u25F7 ${h.esc(t.period)}</span><b>${h.esc(t.assignee)}</b></div></article>`).join("")}</section>`).join("")}</div>`)),
    make6("roadmap", "\u9879\u76EE\u8DEF\u7EBF\u56FE", "\u901A\u8FC7\u65F6\u95F4\u533A\u95F4\u5C55\u793A\u5E76\u884C\u4EFB\u52A1\uFF0C\u9002\u5408\u5236\u4F5C\u8BA1\u5212\u548C\u91CC\u7A0B\u7891\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "weeks": [
        "\u9636\u6BB5 A",
        "\u9636\u6BB5 B",
        "\u9636\u6BB5 C",
        "\u9636\u6BB5 D"
      ],
      "tasks": [
        {
          "label": "\u4EFB\u52A1 A",
          "start": 0,
          "end": 1.5
        },
        {
          "label": "\u4EFB\u52A1 B",
          "start": 1,
          "end": 2.7
        },
        {
          "label": "\u4EFB\u52A1 C",
          "start": 1.8,
          "end": 3.5
        },
        {
          "label": "\u4EFB\u52A1 D",
          "start": 3,
          "end": 4
        }
      ],
      "unit": "\u5355\u4F4D"
    }, (p, h) => {
      const a2 = list4(p.tasks, 2, 5), weeks = list4(p.weeks, 4, 4);
      return shell3(p, h, svg(weeks.map((w, i) => txt4(h, 275 + i * 230, 38, w, 19) + line2(160 + i * 230, 59, 160 + i * 230, 426)).join("") + line2(1080, 59, 1080, 426) + a2.map((x, i) => {
        if (number8(x.start) >= number8(x.end) || x.end > 4) throw Error("\u4EFB\u52A1\u533A\u95F4\u987B\u5728 0\u20134 \u5185");
        return txt4(h, 135, 115 + i * 84, x.label, 18, "end") + `<g data-motion="item"><rect data-motion="bar" x="${160 + x.start * 230}" y="${82 + i * 84}" width="${(x.end - x.start) * 230}" height="50" rx="9" fill="${colors2[i]}"/>${txt4(h, 170 + x.start * 230, 114 + i * 84, `${Number((x.end - x.start).toFixed(2))} ${p.unit}`, 18, "start", "#fff")}</g>`;
      }).join("")));
    }),
    make6("formula-breakdown", "\u516C\u5F0F\u62C6\u89E3", "\u9010\u9879\u89E3\u91CA\u516C\u5F0F\u7684\u8F93\u5165\u4E0E\u542B\u4E49\uFF0C\u518D\u7ED9\u51FA\u4E00\u6B21\u6F14\u7B97\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "terms": [
        {
          "symbol": "\u53D8\u91CF A",
          "meaning": "\u53D8\u91CF\u8BF4\u660E A",
          "value": "3"
        },
        {
          "symbol": "\u53D8\u91CF B",
          "meaning": "\u53D8\u91CF\u8BF4\u660E B",
          "value": "4"
        },
        {
          "symbol": "\u7ED3\u679C",
          "meaning": "\u7ED3\u679C\u8BF4\u660E",
          "value": "12"
        }
      ],
      "operators": [
        "\xD7",
        "="
      ]
    }, (p, h) => {
      const a2 = list4(p.terms, 3, 3);
      return shell3(p, h, `<div class="edx-formula">${a2.map((x, i) => `<article data-motion="item"><b data-motion="emphasis">${h.esc(x.symbol)}</b><div class="edx-formula-rule"></div><p>${h.esc(x.meaning)}</p><strong data-motion="focus">${h.esc(x.value)}</strong></article>${i < 2 ? `<span>${h.esc(p.operators[i])}</span>` : ""}`).join("")}</div>`);
    }),
    make6("spectrum-scale", "\u8FDE\u7EED\u5C3A\u5EA6\u56FE", "\u5728\u8FDE\u7EED\u8303\u56F4\u4E0A\u5B9A\u4F4D\u591A\u4E2A\u5BF9\u8C61\uFF0C\u907F\u514D\u975E\u9ED1\u5373\u767D\u7684\u5206\u7C7B\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "left": "\u8303\u56F4\u8D77\u70B9",
      "right": "\u8303\u56F4\u7EC8\u70B9",
      "markers": [
        {
          "label": "\u9879\u76EE A",
          "value": 15
        },
        {
          "label": "\u9879\u76EE B",
          "value": 42
        },
        {
          "label": "\u9879\u76EE C",
          "value": 70
        },
        {
          "label": "\u9879\u76EE D",
          "value": 91
        }
      ]
    }, (p, h) => {
      const a2 = list4(p.markers, 2, 6);
      return shell3(p, h, svg(`<defs><linearGradient id="${h.uid("spectrum")}"><stop stop-color="#dce8fb"/><stop offset=".5" stop-color="#709bea"/><stop offset="1" stop-color="#81c9b0"/></linearGradient></defs><rect x="75" y="219" width="970" height="38" rx="19" fill="url(#${h.uid("spectrum")})"/>` + a2.map((x, i) => {
        const v = number8(x.value);
        if (v > 100) throw Error("value \u987B\u5728 0\u2013100");
        const xx = 75 + v / 100 * 970, top = i % 2 === 0;
        return `<g data-motion="point">${line2(xx, top ? 152 : 257, xx, top ? 219 : 326)}<circle cx="${xx}" cy="238" r="10" fill="#fff" stroke="#386dbc" stroke-width="3"/>${txt4(h, xx, top ? 133 : 356, x.label, 20)}${txt4(h, xx, top ? 104 : 388, v, 18, "middle", "#6c80a0")}</g>`;
      }).join("") + txt4(h, 75, 437, p.left, 19, "start") + txt4(h, 1045, 437, p.right, 19, "end")));
    }),
    make6("process-steps", "\u6A2A\u5411\u6B65\u9AA4\u8BF4\u660E", "\u7ED9\u6BCF\u4E00\u6B65\u5206\u914D\u7F16\u53F7\u3001\u52A8\u4F5C\u4E0E\u7ED3\u679C\uFF0C\u9002\u5408\u64CD\u4F5C\u6559\u5B66\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "steps": [
        {
          "title": "\u6B65\u9AA4 A",
          "detail": "\u6B65\u9AA4\u8BF4\u660E A",
          "result": "\u7ED3\u679C A"
        },
        {
          "title": "\u6B65\u9AA4 B",
          "detail": "\u6B65\u9AA4\u8BF4\u660E B",
          "result": "\u7ED3\u679C B"
        },
        {
          "title": "\u6B65\u9AA4 C",
          "detail": "\u6B65\u9AA4\u8BF4\u660E C",
          "result": "\u7ED3\u679C C"
        },
        {
          "title": "\u6B65\u9AA4 D",
          "detail": "\u6B65\u9AA4\u8BF4\u660E D",
          "result": "\u7ED3\u679C D"
        }
      ]
    }, (p, h) => shell3(p, h, `<div class="edx-steps">${list4(p.steps, 3, 5).map((x, i) => `<article data-motion="item"><b class="edx-step-number">${String(i + 1).padStart(2, "0")}</b><h2>${h.esc(x.title)}</h2><p>${h.esc(x.detail)}</p><div class="edx-step-result" data-motion="focus">${h.esc(x.result)}</div>${i < p.steps.length - 1 ? '<span class="edx-step-arrow">\u2192</span>' : ""}</article>`).join("")}</div>`)),
    make6("lecture-stage", "\u52A8\u6001\u8BFE\u4EF6\u8BB2\u89E3\u821E\u53F0", "\u771F\u5B9E PPT\u3001\u5F55\u5C4F\u6216\u539F\u751F\u56FE\u89E3\u7684\u7EDF\u4E00\u821E\u53F0\uFF0C\u80CC\u666F\u4E0E\u4E3B\u4F53\u5206\u522B\u8FD0\u52A8\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "code": "EXAMPLE",
      "media": {
        "kind": "image",
        "src": "",
        "fit": "contain"
      },
      "chapter": "01 / \u7AE0\u8282\u6807\u9898",
      "sections": [
        {
          "title": "\u7AE0\u8282\u6807\u9898 A",
          "detail": "\u7AE0\u8282\u8BF4\u660E A"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 B",
          "detail": "\u7AE0\u8282\u8BF4\u660E B"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 C",
          "detail": "\u7AE0\u8282\u8BF4\u660E C"
        }
      ],
      "caption": "\u753B\u9762\u8BF4\u660E\u6587\u5B57"
    }, (p, h) => {
      const m = p.media || {};
      if (m.src && (/^(?:[a-z]+:|\/\/)/i.test(m.src) || m.src.includes(".."))) throw Error("\u7D20\u6750\u987B\u4F7F\u7528\u672C\u5730\u76F8\u5BF9\u8DEF\u5F84");
      const body = m.src ? m.kind === "video" ? `<video id="${h.uid("lecture-media")}" src="${h.esc(m.src)}" muted playsinline style="object-fit:${m.fit === "cover" ? "cover" : "contain"}"></video>` : `<img src="${h.esc(m.src)}" alt="\u8BFE\u4EF6\u7D20\u6750" style="object-fit:${m.fit === "cover" ? "cover" : "contain"}">` : `<div class="edx-lesson-native"><span>${h.esc(p.chapter)}</span><h1>${h.esc(p.title)}</h1><p>${h.esc(p.subtitle)}</p><div>${list4(p.sections, 2, 4).map((x, i) => `<article data-motion="item"><b>${String(i + 1).padStart(2, "0")}</b><h2>${h.esc(x.title)}</h2><p>${h.esc(x.detail)}</p></article>`).join("")}</div></div>`;
      return `<section class="edx-lecture"><div class="edx-ambient" data-motion="background"></div><div class="edx-lesson-shell" data-motion="focus"><i class="edx-corner edx-corner-a"></i><i class="edx-corner edx-corner-b"></i><div class="edx-lesson-media">${body}</div></div><div class="edx-lesson-caption">${h.esc(p.caption)}</div></section>`;
    })
  ];

  // families/education.mjs
  var ref = {
    basis: "\u539F\u521B\u79D1\u666E\u8BB2\u89E3\u7EC4\u4EF6\uFF0C\u6309\u6210\u7247\u53EF\u8BFB\u6027\u548C\u6570\u636E\u51C6\u786E\u6027\u9A8C\u6536\uFF1B\u4E0D\u662F\u8F6F\u4EF6\u622A\u56FE\u3002",
    source: "component-reference/high-fidelity/\u8D28\u91CF\u6807\u51C6.md",
    level: "designed"
  };
  var arr3 = (value, limit = 8) => Array.isArray(value) ? value.slice(0, limit) : [];
  var n2 = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  var clamp2 = (value, low, high) => Math.min(high, Math.max(low, n2(value)));
  var fmt = (value) => Number.isInteger(n2(value)) ? String(n2(value)) : n2(value).toFixed(1);
  var localMedia = (value) => {
    const path2 = String(value || "");
    if (/^(?:[a-z]+:|\/\/)/i.test(path2) || path2.includes("..") || /[\u0000-\u001f]/.test(path2)) throw new Error("mediaSrc must be a local relative media path");
    return path2;
  };
  var tick2 = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4.5 10 3.4 3.4 7.6-7.1" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var arrow4 = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function shell4(p, h, body, extra2 = "") {
    const e2 = h.esc;
    return '<section class="edu-scene ' + extra2 + '"><header class="edu-header"><div><div class="edu-eyebrow">' + e2(p.eyebrow) + "</div><h1>" + e2(p.title) + "</h1><p>" + e2(p.subtitle) + '</p></div><span class="edu-edition">' + e2(p.badge) + '</span></header><main class="edu-body">' + body + '</main><footer class="edu-footer"><span>' + e2(p.footer) + '</span><span class="edu-footer-mark"><i></i>' + e2(p.series) + "</span></footer></section>";
  }
  var base = {
    eyebrow: "\u53EF\u590D\u7528\u8BB2\u89E3\u7EC4\u4EF6",
    title: "",
    subtitle: "",
    badge: "\u793A\u4F8B\u5185\u5BB9",
    footer: "\u9875\u811A\u8BF4\u660E",
    series: "EXPLAIN / 01"
  };
  function validate(id, p) {
    const nonNegative = (value) => Number.isFinite(Number(value)) && Number(value) >= 0;
    const counts = { flowchart: ["nodes", 5, 5], "layer-stack": ["layers", 3, 3], "event-timeline": ["events", 2, 5], "comparison-matrix": ["columns", 2, 3], "metric-dashboard": ["metrics", 3, 3], "annotation-callout": ["fields", 3, 3] };
    if (counts[id]) {
      const [key, min, max] = counts[id];
      if (!Array.isArray(p[key]) || p[key].length < min || p[key].length > max) throw new Error(id + ": " + key + " requires " + min + "\u2013" + max + " items");
    }
    if (id === "bar-chart" || id === "line-chart") {
      if (!Array.isArray(p.values) || p.values.length < 2 || p.values.length > (id === "bar-chart" ? 6 : 10)) throw new Error(id + ": unsupported number of data points");
      if (p.values.some((x) => !nonNegative(x.value))) throw new Error(id + ": values must be finite non-negative numbers");
      if (!nonNegative(p.max) || Number(p.max) === 0) throw new Error(id + ": max must be positive");
      if (id === "line-chart" && !nonNegative(p.target)) throw new Error(id + ": target must be non-negative");
    }
    if (id === "metric-dashboard" && (!Array.isArray(p.progress) || p.progress.length < 2 || p.progress.length > 8 || p.progress.some((x) => !nonNegative(x) || Number(x) > 100))) throw new Error("metric-dashboard: progress requires 2\u20138 percentages between 0 and 100");
    if (id === "annotation-callout" && (!Array.isArray(p.callouts) || p.callouts.length !== 3)) throw new Error("annotation-callout: exactly 3 callouts are required");
    if (id === "annotation-callout") {
      const tooLong = (value, max) => Array.from(String(value || "")).length > max;
      if (tooLong(p.subjectTitle, 18) || tooLong(p.subjectSubtitle, 26) || p.fields.some((x) => tooLong(x.label, 3) || tooLong(x.value, 18)) || p.callouts.some((x) => tooLong(x.title, 9) || tooLong(x.detail, 16))) throw new Error("annotation-callout: text exceeds the measured anchor layout; shorten the copy or adjust the layout");
    }
  }
  var create4 = (id, name, description, defaults3, render) => ({
    id,
    name,
    category: "\u539F\u521B\u8BB2\u89E3\u56FE\u5F62",
    description,
    width: 1280,
    height: 800,
    defaults: { ...base, ...defaults3 },
    reference: { ...ref },
    render(props, helpers2) {
      const p = { ...base, ...defaults3, ...props };
      validate(id, p);
      return render(p, helpers2);
    }
  });
  var components26 = [
    create4("before-after", "\u524D\u540E\u5BF9\u6BD4", "\u5728\u540C\u4E00\u7EC4\u4EFB\u52A1\u4E2D\u5BF9\u7167\u4E24\u79CD\u7EC4\u7EC7\u65B9\u5F0F\uFF1B\u4E24\u4FA7\u6587\u6848\u3001\u72B6\u6001\u548C\u7ED3\u8BBA\u5747\u53EF\u7F16\u8F91\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "footer": "\u9875\u811A\u8BF4\u660E",
      "series": "\u793A\u4F8B\u7CFB\u5217",
      "beforeLabel": "\u72B6\u6001 A",
      "beforeNote": "\u72B6\u6001\u8BF4\u660E A",
      "afterLabel": "\u72B6\u6001 B",
      "afterNote": "\u72B6\u6001\u8BF4\u660E B",
      "tasks": [
        {
          "title": "\u4EFB\u52A1 A",
          "detail": "\u4EFB\u52A1\u8BF4\u660E A",
          "state": "done"
        },
        {
          "title": "\u4EFB\u52A1 B",
          "detail": "\u4EFB\u52A1\u8BF4\u660E B",
          "state": "active"
        },
        {
          "title": "\u4EFB\u52A1 C",
          "detail": "\u4EFB\u52A1\u8BF4\u660E C",
          "state": "todo"
        }
      ],
      "columns": [
        {
          "state": "todo",
          "label": "\u5F85\u5F00\u59CB"
        },
        {
          "state": "active",
          "label": "\u8FDB\u884C\u4E2D"
        },
        {
          "state": "done",
          "label": "\u5DF2\u5B8C\u6210"
        }
      ],
      "resultLabel": "\u7ED3\u679C\u8BF4\u660E",
      "result": "\u7ED3\u679C\u5185\u5BB9\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u7ED3\u8BBA\u3002"
    }, (p, h) => {
      const e2 = h.esc;
      const tasks = arr3(p.tasks, 6);
      const columns = arr3(p.columns, 3);
      const before = tasks.map((x, i) => '<div class="edu-task-row" data-motion="item"><span class="edu-task-index">' + String(i + 1).padStart(2, "0") + "</span><div><strong>" + e2(x.title) + "</strong><p>" + e2(x.detail) + '</p></div><span class="edu-task-dot"></span></div>').join("");
      const after = columns.map((c) => '<div class="edu-kanban-column"><div class="edu-kanban-label"><i class="edu-state-' + e2(c.state) + '"></i>' + e2(c.label) + "<span>" + tasks.filter((t) => t.state === c.state).length + "</span></div>" + tasks.filter((t) => t.state === c.state).map((t) => '<div class="edu-kanban-task" data-motion="item"><strong>' + e2(t.title) + "</strong><p>" + e2(t.detail) + '</p><div class="edu-mini-progress"><i class="edu-state-' + e2(c.state) + '"></i></div></div>').join("") + "</div>").join("");
      return shell4(p, h, '<div class="edu-compare-layout"><section class="edu-panel edu-before"><div class="edu-panel-heading"><span class="edu-pill">' + e2(p.beforeLabel) + "</span><p>" + e2(p.beforeNote) + '</p></div><div class="edu-task-list">' + before + '</div></section><div class="edu-compare-arrow">' + arrow4 + '</div><section class="edu-panel edu-after" data-motion="reveal"><div class="edu-panel-heading"><span class="edu-pill edu-pill-blue">' + e2(p.afterLabel) + "</span><p>" + e2(p.afterNote) + '</p></div><div class="edu-kanban">' + after + '</div></section></div><div class="edu-takeaway"><span>' + e2(p.resultLabel) + "</span><strong>" + e2(p.result) + "</strong></div>");
    }),
    create4("flowchart", "\u6D41\u7A0B\u4E0E\u539F\u7406\u56FE", "\u53EF\u7F16\u8F91\u7684\u4E94\u8282\u70B9\u5206\u652F\u6D41\u7A0B\uFF0C\u8282\u70B9\u4E0E SVG \u8FDE\u7EBF\u72EC\u7ACB\uFF0C\u53EF\u6309\u987A\u5E8F\u70B9\u4EAE\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "footer": "\u9875\u811A\u8BF4\u660E",
      "series": "\u793A\u4F8B\u7CFB\u5217",
      "nodes": [
        {
          "label": "\u8282\u70B9 A",
          "detail": "\u8282\u70B9\u8BF4\u660E A",
          "tag": "01"
        },
        {
          "label": "\u8282\u70B9 B",
          "detail": "\u8282\u70B9\u8BF4\u660E B",
          "tag": "02"
        },
        {
          "label": "\u8282\u70B9 C",
          "detail": "\u8282\u70B9\u8BF4\u660E C",
          "tag": "03"
        },
        {
          "label": "\u8282\u70B9 D",
          "detail": "\u8282\u70B9\u8BF4\u660E D",
          "tag": "04"
        },
        {
          "label": "\u8282\u70B9 E",
          "detail": "\u8282\u70B9\u8BF4\u660E E",
          "tag": "05"
        }
      ],
      "branchLabels": [
        "\u6761\u4EF6 A",
        "\u6761\u4EF6 B"
      ],
      "noteTitle": "\u8865\u5145\u6807\u9898",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57"
    }, (p, h) => {
      const e2 = h.esc;
      const nodes = arr3(p.nodes, 5);
      const marker = h.uid("flow-arrow");
      const positions = [{ x: 0, y: 158 }, { x: 286, y: 158 }, { x: 572, y: 158 }, { x: 906, y: 42 }, { x: 906, y: 278 }];
      const lines3 = '<svg class="edu-flow-lines" viewBox="0 0 1164 460" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="' + e2(marker) + '" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1 1 6 4 1 7" fill="none" stroke="#2563eb" stroke-width="1.5"/></marker></defs><path data-motion="line" d="M238 225H282" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#' + e2(marker) + ')"/><path data-motion="line" d="M524 225H568" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#' + e2(marker) + ')"/><path data-motion="line" d="M810 225H850V109H902" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#' + e2(marker) + ')"/><path data-motion="line" d="M850 225V345H902" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#' + e2(marker) + ')"/><circle cx="850" cy="225" r="5" fill="#2563eb"/></svg>';
      const cards = nodes.map((x, i) => '<div class="edu-flow-node ' + (i === 2 ? "edu-flow-node-active" : i === 3 ? "edu-flow-node-done" : "") + '" style="left:' + positions[i].x + "px;top:" + positions[i].y + 'px" data-motion="item"><span>' + e2(x.tag) + "</span><strong>" + e2(x.label) + "</strong><p>" + e2(x.detail) + "</p></div>").join("");
      return shell4(p, h, '<div class="edu-flow-stage">' + lines3 + cards + '<span class="edu-flow-label edu-flow-label-top">' + e2(arr3(p.branchLabels, 2)[0] || "") + '</span><span class="edu-flow-label edu-flow-label-bottom">' + e2(arr3(p.branchLabels, 2)[1] || "") + '</span></div><div class="edu-note"><strong>' + e2(p.noteTitle) + "</strong><span>" + e2(p.note) + "</span></div>");
    }),
    create4("layer-stack", "\u5206\u5C42\u7ED3\u6784\u56FE", "\u7528\u7EDF\u4E00\u7B49\u8DDD\u51E0\u4F55\u548C\u72EC\u7ACB\u5F15\u7EBF\u89E3\u91CA\u4E09\u5C42\u7ED3\u6784\uFF1B\u5C42\u540D\u3001\u8BF4\u660E\u548C\u8981\u70B9\u53EF\u66FF\u6362\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "footer": "\u9875\u811A\u8BF4\u660E",
      "series": "\u793A\u4F8B\u7CFB\u5217",
      "layers": [
        {
          "title": "\u5C42\u7EA7 A",
          "label": "\u5C42\u7EA7\u6807\u7B7E A",
          "detail": "\u5C42\u7EA7\u8BF4\u660E\u6587\u5B57\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u89E3\u91CA\u7684\u5185\u5BB9\u3002",
          "index": "L1"
        },
        {
          "title": "\u5C42\u7EA7 B",
          "label": "\u5C42\u7EA7\u6807\u7B7E B",
          "detail": "\u5C42\u7EA7\u8BF4\u660E\u6587\u5B57\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u89E3\u91CA\u7684\u5185\u5BB9\u3002",
          "index": "L2"
        },
        {
          "title": "\u5C42\u7EA7 C",
          "label": "\u5C42\u7EA7\u6807\u7B7E C",
          "detail": "\u5C42\u7EA7\u8BF4\u660E\u6587\u5B57\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u89E3\u91CA\u7684\u5185\u5BB9\u3002",
          "index": "L3"
        }
      ],
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57"
    }, (p, h) => {
      const e2 = h.esc;
      const layers = arr3(p.layers, 3);
      const slabs = layers.map((x, i) => {
        const y = 25 + i * 146;
        const fill = ["#f5f8fe", "#e2edff", "#d9f0e8"][i], side = ["#e6ebf3", "#bad1f9", "#acd8c8"][i];
        return '<g data-motion="item"><path d="M75 ' + (y + 88) + " 325 " + y + " 560 " + (y + 91) + " 309 " + (y + 182) + 'Z" fill="' + fill + '" stroke="#bdd0e4" stroke-width="1.4"/><path d="M75 ' + (y + 88) + "V" + (y + 111) + "L309 " + (y + 205) + "V" + (y + 182) + 'Z" fill="' + side + '" stroke="#bdd0e4" stroke-width="1.4"/><path d="M309 ' + (y + 182) + " 560 " + (y + 91) + "V" + (y + 114) + "L309 " + (y + 205) + 'Z" fill="' + side + '" stroke="#bdd0e4" stroke-width="1.4"/><text x="318" y="' + (y + 103) + '" text-anchor="middle" fill="#1f2329" font-size="30" font-weight="650">' + e2(x.title) + "</text></g>";
      }).reverse().join("");
      const leaders = layers.map((x, i) => '<g><path data-motion="line" d="M560 ' + (116 + i * 146) + 'H613" fill="none" stroke="#8ba8cb" stroke-width="1.5"/><circle cx="560" cy="' + (116 + i * 146) + '" r="4" fill="#2563eb"/><text x="586" y="' + (105 + i * 146) + '" fill="#71849d" font-size="14">' + e2(x.index) + "</text></g>").join("");
      return shell4(p, h, '<div class="edu-layers-layout"><svg class="edu-layer-art" viewBox="0 0 640 525" role="img" aria-label="' + e2(p.title) + '">' + slabs + leaders + '</svg><div class="edu-layer-descriptions">' + layers.map((x, i) => '<article data-motion="item"><span class="edu-layer-number">' + e2(x.index) + "</span><div><h2>" + e2(x.label) + "</h2><p>" + e2(x.detail) + "</p></div></article>").join("") + '<p class="edu-fine-note">' + e2(p.note) + "</p></div></div>");
    }),
    create4("bar-chart", "\u67F1\u5F62\u6570\u636E\u56FE", "\u6309\u771F\u5B9E\u6570\u636E\u6620\u5C04\u9AD8\u5EA6\uFF0C\u652F\u6301\u53EF\u7F16\u8F91\u7C7B\u76EE\u3001\u6570\u503C\u3001\u8303\u56F4\u548C\u5355\u4F4D\uFF1B\u9ED8\u8BA4\u7528\u793A\u4F8B\u65F6\u957F\u6BD4\u8F83\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "footer": "\u9875\u811A\u8BF4\u660E",
      "series": "\u793A\u4F8B\u7CFB\u5217",
      "chartTitle": "\u56FE\u8868\u6807\u9898",
      "unit": "\u5355\u4F4D",
      "max": 60,
      "values": [
        {
          "label": "\u7C7B\u522B A",
          "value": 28
        },
        {
          "label": "\u7C7B\u522B B",
          "value": 46
        },
        {
          "label": "\u7C7B\u522B C",
          "value": 54
        },
        {
          "label": "\u7C7B\u522B D",
          "value": 34
        }
      ],
      "highlight": 2,
      "noteLabel": "\u8865\u5145\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57",
      "source": "\u6570\u636E\u6765\u6E90\u8BF4\u660E"
    }, (p, h) => {
      const e2 = h.esc;
      const values = arr3(p.values, 6);
      const max = Math.max(1, n2(p.max, 100), ...values.map((x) => n2(x.value)));
      const left = 64, top = 58, bottom = 356, width = 1030, slot = width / Math.max(1, values.length), barWidth = Math.min(114, slot * 0.52);
      const grid = Array.from({ length: 5 }, (_, i) => {
        const y = bottom - (bottom - top) * i / 4;
        return '<line x1="' + left + '" y1="' + y + '" x2="1110" y2="' + y + '" stroke="#e7ecf3"/><text x="44" y="' + (y + 6) + '" text-anchor="end" font-size="18" fill="#687387">' + e2(fmt(max * i / 4)) + "</text>";
      }).join("");
      const bars = values.map((x, i) => {
        const height = (bottom - top) * clamp2(x.value, 0, max) / max;
        const cx = left + slot * (i + 0.5);
        return '<g><rect data-motion="bar" x="' + (cx - barWidth / 2) + '" y="' + (bottom - height) + '" width="' + barWidth + '" height="' + height + '" rx="7" fill="' + (i === n2(p.highlight) ? "#2563eb" : "#bfd5f8") + '"/><text data-motion="counter" x="' + cx + '" y="' + (bottom - height - 13) + '" text-anchor="middle" font-size="26" font-weight="650" fill="#1f2329">' + e2(fmt(x.value)) + '</text><text x="' + cx + '" y="397" text-anchor="middle" font-size="21" fill="#455064">' + e2(x.label) + "</text></g>";
      }).join("");
      return shell4(p, h, '<section class="edu-chart-panel"><div class="edu-chart-heading"><h2>' + e2(p.chartTitle) + "</h2><span>" + e2(p.unit) + '</span></div><svg class="edu-bar-svg" viewBox="0 0 1164 426" role="img" aria-label="' + e2(p.chartTitle) + '">' + grid + bars + '</svg><div class="edu-chart-source">' + e2(p.source) + '</div></section><div class="edu-takeaway edu-takeaway-compact"><span>' + e2(p.noteLabel) + "</span><strong>" + e2(p.note) + "</strong></div>");
    }),
    create4("line-chart", "\u8D8B\u52BF\u6298\u7EBF\u56FE", "\u53EF\u7F16\u8F91\u8D8B\u52BF\u3001\u76EE\u6807\u7EBF\u4E0E\u9009\u4E2D\u70B9\uFF1B\u6570\u503C\u51B3\u5B9A\u5750\u6807\uFF0C\u6298\u7EBF\u4E0E\u9762\u79EF\u4F7F\u7528\u539F\u751F SVG\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "footer": "\u9875\u811A\u8BF4\u660E",
      "series": "\u793A\u4F8B\u7CFB\u5217",
      "chartTitle": "\u56FE\u8868\u6807\u9898",
      "unit": "\u5355\u4F4D",
      "max": 40,
      "target": 30,
      "targetLabel": "\u53C2\u8003\u503C",
      "values": [
        {
          "label": "\u9636\u6BB5 A",
          "value": 12
        },
        {
          "label": "\u9636\u6BB5 B",
          "value": 17
        },
        {
          "label": "\u9636\u6BB5 C",
          "value": 15
        },
        {
          "label": "\u9636\u6BB5 D",
          "value": 24
        },
        {
          "label": "\u9636\u6BB5 E",
          "value": 29
        },
        {
          "label": "\u9636\u6BB5 F",
          "value": 34
        }
      ],
      "selected": 4,
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57"
    }, (p, h) => {
      const e2 = h.esc;
      const values = arr3(p.values, 10);
      const max = Math.max(1, n2(p.max, 40), n2(p.target), ...values.map((x) => n2(x.value)));
      const left = 64, right = 1095, top = 60, bottom = 370;
      const points = values.map((x, i) => ({ x: left + (right - left) * i / Math.max(1, values.length - 1), y: bottom - (bottom - top) * clamp2(x.value, 0, max) / max, ...x }));
      const line3 = points.map((x, i) => (i ? "L" : "M") + x.x + " " + x.y).join(" ");
      const area = points.length ? line3 + "L" + points.at(-1).x + " " + bottom + "L" + points[0].x + " " + bottom + "Z" : "";
      const grad2 = h.uid("trend-fill");
      const targetY = bottom - (bottom - top) * clamp2(p.target, 0, max) / max;
      const grid = Array.from({ length: 5 }, (_, i) => {
        const y = bottom - (bottom - top) * i / 4;
        return '<line x1="' + left + '" y1="' + y + '" x2="' + right + '" y2="' + y + '" stroke="#e6ecf3"/><text x="44" y="' + (y + 6) + '" font-size="18" text-anchor="end" fill="#687387">' + e2(fmt(max * i / 4)) + "</text>";
      }).join("");
      const chosen = points[clamp2(p.selected, 0, Math.max(0, points.length - 1))];
      const chip = chosen ? '<g data-motion="focus"><rect x="' + clamp2(chosen.x - 82, 64, 931) + '" y="' + Math.max(4, chosen.y - 66) + '" width="164" height="43" rx="8" fill="#1f2329"/><text x="' + (clamp2(chosen.x - 82, 64, 931) + 82) + '" y="' + Math.max(31, chosen.y - 39) + '" text-anchor="middle" fill="white" font-size="20">' + e2(chosen.label) + " \xB7 " + e2(fmt(chosen.value)) + " " + e2(p.unit) + "</text></g>" : "";
      return shell4(p, h, '<section class="edu-chart-panel"><div class="edu-chart-heading"><h2>' + e2(p.chartTitle) + "</h2><span>" + e2(p.unit) + '</span></div><svg class="edu-line-svg" viewBox="0 0 1164 442" role="img" aria-label="' + e2(p.chartTitle) + '"><defs><linearGradient id="' + e2(grad2) + '" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#2563eb" stop-opacity=".18"/><stop offset="1" stop-color="#2563eb" stop-opacity=".01"/></linearGradient></defs>' + grid + '<line x1="' + left + '" y1="' + targetY + '" x2="' + right + '" y2="' + targetY + '" stroke="#4c9d83" stroke-width="1.7" stroke-dasharray="6 6"/><text x="' + (left + 16) + '" y="' + (targetY - 12) + '" text-anchor="start" font-size="18" fill="#28735d">' + e2(p.targetLabel) + " " + e2(fmt(p.target)) + '</text><path d="' + area + '" fill="url(#' + e2(grad2) + ')"/><path data-motion="line" d="' + line3 + '" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' + points.map((x) => '<circle cx="' + x.x + '" cy="' + x.y + '" r="5.5" fill="white" stroke="#2563eb" stroke-width="3"/><text x="' + x.x + '" y="415" text-anchor="middle" font-size="20" fill="#455064">' + e2(x.label) + "</text>").join("") + chip + '</svg><div class="edu-chart-source">' + e2(p.note) + "</div></section>");
    }),
    create4("comparison-matrix", "\u65B9\u6848\u6BD4\u8F83\u77E9\u9635", "\u6309\u7EDF\u4E00\u7EF4\u5EA6\u6BD4\u8F83\u4E09\u79CD\u65B9\u6848\uFF0C\u4F7F\u7528\u6587\u5B57\u800C\u975E\u4E3B\u89C2\u6253\u5206\uFF1B\u5217\u3001\u884C\u4E0E\u63A8\u8350\u8BF4\u660E\u53EF\u7F16\u8F91\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "footer": "\u9875\u811A\u8BF4\u660E",
      "series": "\u793A\u4F8B\u7CFB\u5217",
      "columns": [
        {
          "name": "\u9879\u76EE A",
          "tag": "\u6807\u7B7E A"
        },
        {
          "name": "\u9879\u76EE B",
          "tag": "\u6807\u7B7E B"
        },
        {
          "name": "\u9879\u76EE C",
          "tag": "\u6807\u7B7E C"
        }
      ],
      "rows": [
        {
          "criterion": "\u6BD4\u8F83\u9879 A",
          "values": [
            "\u5185\u5BB9 A",
            "\u5185\u5BB9 B",
            "\u5185\u5BB9 C"
          ]
        },
        {
          "criterion": "\u6BD4\u8F83\u9879 B",
          "values": [
            "\u5185\u5BB9 A",
            "\u5185\u5BB9 B",
            "\u5185\u5BB9 C"
          ]
        },
        {
          "criterion": "\u6BD4\u8F83\u9879 C",
          "values": [
            "\u5185\u5BB9 A",
            "\u5185\u5BB9 B",
            "\u5185\u5BB9 C"
          ]
        },
        {
          "criterion": "\u6BD4\u8F83\u9879 D",
          "values": [
            "\u5185\u5BB9 A",
            "\u5185\u5BB9 B",
            "\u5185\u5BB9 C"
          ]
        }
      ],
      "noteLabel": "\u8865\u5145\u6807\u7B7E",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57"
    }, (p, h) => {
      const e2 = h.esc;
      const columns = arr3(p.columns, 3), rows3 = arr3(p.rows, 5);
      return shell4(p, h, '<div class="edu-matrix-panel"><table class="edu-matrix"><thead><tr><th></th>' + columns.map((c) => "<th><strong>" + e2(c.name) + "</strong><span>" + e2(c.tag) + "</span></th>").join("") + "</tr></thead><tbody>" + rows3.map((r) => '<tr data-motion="item"><th>' + e2(r.criterion) + "</th>" + columns.map((_, i) => "<td>" + e2(arr3(r.values, 3)[i] || "") + "</td>").join("") + "</tr>").join("") + '</tbody></table></div><div class="edu-takeaway"><span>' + e2(p.noteLabel) + "</span><strong>" + e2(p.note) + "</strong></div>");
    }),
    create4("event-timeline", "\u4E8B\u4EF6\u65F6\u95F4\u7EBF", "\u4E94\u4E2A\u9636\u6BB5\u6CBF\u6C34\u5E73\u65F6\u95F4\u8F74\u5C55\u793A\uFF0C\u533A\u5206\u5DF2\u5B8C\u6210\u3001\u5F53\u524D\u548C\u5F85\u5F00\u59CB\uFF1B\u652F\u6301\u66FF\u6362\u65F6\u95F4\u3001\u5185\u5BB9\u548C\u72B6\u6001\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "footer": "\u9875\u811A\u8BF4\u660E",
      "series": "\u793A\u4F8B\u7CFB\u5217",
      "events": [
        {
          "time": "09:00",
          "title": "\u4E8B\u4EF6 A",
          "detail": "\u4E8B\u4EF6\u8BF4\u660E A",
          "status": "done"
        },
        {
          "time": "10:00",
          "title": "\u4E8B\u4EF6 B",
          "detail": "\u4E8B\u4EF6\u8BF4\u660E B",
          "status": "done"
        },
        {
          "time": "13:00",
          "title": "\u4E8B\u4EF6 C",
          "detail": "\u4E8B\u4EF6\u8BF4\u660E C",
          "status": "active"
        },
        {
          "time": "15:00",
          "title": "\u4E8B\u4EF6 D",
          "detail": "\u4E8B\u4EF6\u8BF4\u660E D",
          "status": "todo"
        },
        {
          "time": "17:00",
          "title": "\u4E8B\u4EF6 E",
          "detail": "\u4E8B\u4EF6\u8BF4\u660E E",
          "status": "todo"
        }
      ],
      "activeLabel": "\u5F53\u524D\u9636\u6BB5",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57"
    }, (p, h) => {
      const e2 = h.esc;
      const events = arr3(p.events, 5);
      return shell4(p, h, '<div class="edu-event-track"><div class="edu-event-baseline" data-motion="line"></div>' + events.map((x, i) => '<article class="edu-event edu-event-' + e2(x.status) + '" style="left:' + i * 100 / Math.max(1, events.length - 1) + '%" data-motion="item"><div class="edu-event-time">' + e2(x.time) + '</div><div class="edu-event-node">' + (x.status === "done" ? tick2 : "<i></i>") + '</div><div class="edu-event-card"><span class="edu-event-number">' + String(i + 1).padStart(2, "0") + "</span><h2>" + e2(x.title) + "</h2><p>" + e2(x.detail) + "</p>" + (x.status === "active" ? '<span class="edu-event-active">' + e2(p.activeLabel) + "</span>" : "") + "</div></article>").join("") + '</div><div class="edu-timeline-note">' + e2(p.note) + "</div>");
    }),
    create4("metric-dashboard", "\u5173\u952E\u6307\u6807\u9762\u677F", "\u4EE5\u4E09\u4E2A\u6307\u6807\u3001\u8FDB\u5EA6\u548C\u9A8C\u6536\u6E05\u5355\u590D\u76D8\u5236\u4F5C\u72B6\u6001\uFF1B\u793A\u4F8B\u6570\u636E\u3001\u5355\u4F4D\u4E0E\u8BF4\u660E\u53EF\u7F16\u8F91\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "footer": "\u9875\u811A\u8BF4\u660E",
      "series": "\u793A\u4F8B\u7CFB\u5217",
      "metrics": [
        {
          "label": "\u6307\u6807 A",
          "value": "8",
          "unit": "/ 10",
          "detail": "\u6307\u6807\u8BF4\u660E A",
          "progress": 0.8
        },
        {
          "label": "\u6307\u6807 B",
          "value": "24",
          "unit": "/ 24",
          "detail": "\u6307\u6807\u8BF4\u660E B",
          "progress": 1
        },
        {
          "label": "\u6307\u6807 C",
          "value": "6",
          "unit": "/ 8",
          "detail": "\u6307\u6807\u8BF4\u660E C",
          "progress": 0.75
        }
      ],
      "progressTitle": "\u8D8B\u52BF\u6807\u9898",
      "progress": [
        32,
        46,
        59,
        68,
        80
      ],
      "progressLabels": [
        "\u9636\u6BB5 A",
        "\u9636\u6BB5 B",
        "\u9636\u6BB5 C",
        "\u9636\u6BB5 D",
        "\u9636\u6BB5 E"
      ],
      "checklistTitle": "\u68C0\u67E5\u9879",
      "checks": [
        {
          "label": "\u68C0\u67E5\u9879 A",
          "done": true
        },
        {
          "label": "\u68C0\u67E5\u9879 B",
          "done": true
        },
        {
          "label": "\u68C0\u67E5\u9879 C",
          "done": false
        },
        {
          "label": "\u68C0\u67E5\u9879 D",
          "done": false
        }
      ],
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57"
    }, (p, h) => {
      const e2 = h.esc;
      const metrics = arr3(p.metrics, 3), progress = arr3(p.progress, 8), labels = arr3(p.progressLabels, 8);
      const pts = progress.map((v, i) => 25 + i * 500 / Math.max(1, progress.length - 1) + "," + (195 - clamp2(v, 0, 100) * 1.5)).join(" ");
      return shell4(p, h, '<div class="edu-metric-grid">' + metrics.map((x) => '<article class="edu-metric-card" data-motion="item"><div class="edu-metric-label">' + e2(x.label) + '</div><div class="edu-metric-value"><strong data-motion="counter">' + e2(x.value) + "</strong><span>" + e2(x.unit) + '</span></div><div class="edu-metric-progress"><i data-motion="bar" style="width:' + clamp2(x.progress, 0, 1) * 100 + '%"></i></div><p>' + e2(x.detail) + "</p></article>").join("") + '</div><div class="edu-dashboard-bottom"><section class="edu-progress-panel"><h2>' + e2(p.progressTitle) + '</h2><svg viewBox="0 0 550 235" role="img" aria-label="' + e2(p.progressTitle) + '"><path d="M25 45H525M25 120H525M25 195H525" fill="none" stroke="#e9edf4"/><polyline points="' + pts + '" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" data-motion="line"/>' + progress.map((v, i) => {
        const x = 25 + i * 500 / Math.max(1, progress.length - 1), y = 195 - clamp2(v, 0, 100) * 1.5;
        return '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#2563eb"/><text x="' + x + '" y="' + (y - 13) + '" text-anchor="middle" font-size="18" fill="#1f2329">' + e2(fmt(v)) + '%</text><text x="' + x + '" y="227" text-anchor="middle" font-size="16" fill="#687387">' + e2(labels[i] || "") + "</text>";
      }).join("") + '</svg></section><section class="edu-check-panel"><h2>' + e2(p.checklistTitle) + "</h2>" + arr3(p.checks, 5).map((x) => '<div class="edu-check-item" data-motion="item"><span class="' + (x.done ? "edu-check-done" : "edu-check-pending") + '">' + (x.done ? tick2 : "") + "</span><strong>" + e2(x.label) + "</strong></div>").join("") + '</section></div><div class="edu-dashboard-note">' + e2(p.note) + "</div>");
    }),
    create4("definition-card", "\u6982\u5FF5\u89E3\u91CA\u5361", "\u7528\u5B9A\u4E49\u3001\u4E09\u4E2A\u5173\u952E\u8981\u7D20\u548C\u5177\u4F53\u4F8B\u5B50\u8BB2\u6E05\u4E00\u4E2A\u540D\u8BCD\uFF0C\u907F\u514D\u53EA\u5806\u6807\u9898\u548C\u6807\u7B7E\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "footer": "\u9875\u811A\u8BF4\u660E",
      "series": "\u793A\u4F8B\u7CFB\u5217",
      "term": "\u6982\u5FF5\u540D\u79F0",
      "english": "TERM",
      "definition": "\u6982\u5FF5\u8BF4\u660E\u6587\u5B57\u3002\u66FF\u6362\u4E3A\u9700\u8981\u89E3\u91CA\u7684\u5B9A\u4E49\u3002",
      "factors": [
        {
          "label": "\u8981\u70B9 A",
          "detail": "\u8981\u70B9\u8BF4\u660E A"
        },
        {
          "label": "\u8981\u70B9 B",
          "detail": "\u8981\u70B9\u8BF4\u660E B"
        },
        {
          "label": "\u8981\u70B9 C",
          "detail": "\u8981\u70B9\u8BF4\u660E C"
        }
      ],
      "exampleLabel": "\u793A\u4F8B\u6807\u7B7E",
      "exampleTitle": "\u793A\u4F8B\u6807\u9898",
      "example": "\u793A\u4F8B\u6B63\u6587\u5185\u5BB9\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u6587\u5B57\u3002",
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57"
    }, (p, h) => {
      const e2 = h.esc;
      return shell4(p, h, '<div class="edu-definition-layout"><section class="edu-definition-main"><span class="edu-definition-en">' + e2(p.english) + '</span><h2 data-motion="emphasis">' + e2(p.term) + '</h2><p class="edu-definition-sentence" data-motion="reveal">' + e2(p.definition) + '</p><div class="edu-factor-list">' + arr3(p.factors, 3).map((x, i) => '<div data-motion="item"><span>' + String(i + 1).padStart(2, "0") + "</span><strong>" + e2(x.label) + "</strong><p>" + e2(x.detail) + "</p></div>").join("") + '</div></section><aside class="edu-example-panel"><span class="edu-pill edu-pill-mint">' + e2(p.exampleLabel) + "</span><h2>" + e2(p.exampleTitle) + '</h2><blockquote data-motion="type">' + e2(p.example) + '</blockquote><div class="edu-example-note">' + tick2 + "<p>" + e2(p.note) + "</p></div></aside></div>");
    }),
    create4("chapter-summary", "\u7AE0\u8282\u4E0E\u603B\u7ED3\u9875", "\u7AE0\u8282\u7F16\u53F7\u3001\u6838\u5FC3\u7ED3\u8BBA\u3001\u4E09\u9879\u603B\u7ED3\u4E0E\u4E0B\u4E00\u6B65\u7EC4\u6210\u5B8C\u6574\u6536\u675F\u753B\u9762\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "footer": "\u9875\u811A\u8BF4\u660E",
      "series": "\u793A\u4F8B\u7CFB\u5217",
      "number": "01",
      "chapterLabel": "\u7AE0\u8282\u540D\u79F0",
      "headline": "\u7AE0\u8282\u4E3B\u6807\u9898",
      "points": [
        {
          "title": "\u7AE0\u8282\u6807\u9898 A",
          "detail": "\u7AE0\u8282\u8BF4\u660E A"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 B",
          "detail": "\u7AE0\u8282\u8BF4\u660E B"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 C",
          "detail": "\u7AE0\u8282\u8BF4\u660E C"
        }
      ],
      "nextLabel": "\u4E0B\u4E00\u6B65",
      "next": "\u4E0B\u4E00\u7AE0\u8282\u8BF4\u660E"
    }, (p, h) => {
      const e2 = h.esc;
      return shell4(p, h, '<div class="edu-chapter-layout"><div class="edu-chapter-index"><span data-motion="counter">' + e2(p.number) + "</span><div>" + e2(p.chapterLabel) + '</div><i></i></div><div class="edu-chapter-content"><h2>' + e2(p.headline) + "</h2>" + arr3(p.points, 3).map((x) => '<article data-motion="item"><span>' + tick2 + "</span><div><h3>" + e2(x.title) + "</h3><p>" + e2(x.detail) + "</p></div></article>").join("") + '</div></div><div class="edu-next-strip" data-motion="reveal"><span>' + e2(p.nextLabel) + "</span><strong>" + e2(p.next) + "</strong>" + arrow4 + "</div>");
    }),
    create4("media-stage", "\u56FE\u7247\u4E0E\u89C6\u9891\u5C55\u793A\u53F0", "\u5A92\u4F53\u69FD\u4F4D\u4FDD\u7559\u539F\u59CB\u6BD4\u4F8B\uFF0C\u53F3\u4FA7\u8BF4\u660E\u4E0E\u7AE0\u8282\u6807\u7B7E\u53EF\u66F4\u6362\uFF1B\u9ED8\u8BA4\u793A\u4F8B\u4E3A\u539F\u751F SVG \u4FE1\u606F\u793A\u610F\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "footer": "\u9875\u811A\u8BF4\u660E",
      "series": "\u793A\u4F8B\u7CFB\u5217",
      "mediaSrc": "",
      "mediaKind": "image",
      "mediaAlt": "\u53EF\u66FF\u6362\u7684\u793A\u4F8B\u7D20\u6750",
      "mediaLabel": "\u7D20\u6750\u6807\u7B7E",
      "diagramNodes": [
        {
          "title": "\u7AE0\u8282\u6807\u9898 A",
          "detail": "\u7AE0\u8282\u8BF4\u660E A"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 B",
          "detail": "\u7AE0\u8282\u8BF4\u660E B"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 C",
          "detail": "\u7AE0\u8282\u8BF4\u660E C"
        }
      ],
      "noteTitle": "\u8BF4\u660E\u6807\u9898",
      "notes": [
        {
          "label": "\u6807\u6CE8 A",
          "detail": "\u6807\u6CE8\u8BF4\u660E A"
        },
        {
          "label": "\u6807\u6CE8 B",
          "detail": "\u6807\u6CE8\u8BF4\u660E B"
        },
        {
          "label": "\u6807\u6CE8 C",
          "detail": "\u6807\u6CE8\u8BF4\u660E C"
        }
      ],
      "caption": "\u7D20\u6750\u8BF4\u660E\u6587\u5B57"
    }, (p, h) => {
      const e2 = h.esc;
      const src = localMedia(p.mediaSrc);
      const marker = h.uid("media-arrow");
      let media3 = "";
      if (src) media3 = p.mediaKind === "video" ? '<video class="edu-media-element" id="' + e2(h.uid("video")) + '" src="' + e2(src) + '" muted playsinline preload="metadata"></video>' : '<img class="edu-media-element" src="' + e2(src) + '" alt="' + e2(p.mediaAlt) + '"/>';
      else {
        const nodes = arr3(p.diagramNodes, 3);
        media3 = '<svg class="edu-media-diagram" viewBox="0 0 760 428" role="img" aria-label="' + e2(p.mediaAlt) + '"><defs><marker id="' + e2(marker) + '" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="m1 1 4.5 2.5L1 6" fill="none" stroke="#2563eb" stroke-width="1.4"/></marker></defs><path d="M70 68H690M70 360H690" stroke="#e5edf7"/><path data-motion="line" d="M232 211H293" stroke="#2563eb" stroke-width="2.4" marker-end="url(#' + e2(marker) + ')"/><path data-motion="line" d="M465 211H526" fill="none" stroke="#2563eb" stroke-width="2.4" marker-end="url(#' + e2(marker) + ')"/>' + nodes.map((x, i) => {
          const cx = 147 + i * 233;
          return '<g data-motion="item"><rect x="' + (cx - 84) + '" y="125" width="168" height="174" rx="18" fill="' + (i === 2 ? "#e3f3eb" : i === 1 ? "#edf3ff" : "#ffffff") + '" stroke="' + (i === 1 ? "#93b8f7" : "#d9e4ef") + '" stroke-width="1.6"/><rect x="' + (cx - 17) + '" y="151" width="34" height="34" rx="9" fill="' + (i === 2 ? "#81c9b0" : "#2563eb") + '"/><path d="M' + (cx - 7) + ' 161h14m-14 7h14m-14 7h9" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="' + cx + '" y="229" text-anchor="middle" font-size="30" font-weight="650" fill="#1f2329">' + e2(x.title) + '</text><text x="' + cx + '" y="266" text-anchor="middle" font-size="20" fill="#5f6875">' + e2(x.detail) + "</text></g>";
        }).join("") + "</svg>";
      }
      return shell4(p, h, '<div class="edu-media-layout"><div class="edu-media-main"><div class="edu-media-canvas">' + media3 + '</div><div class="edu-media-caption"><span class="edu-pill">' + e2(p.mediaLabel) + "</span><p>" + e2(p.caption) + '</p></div></div><aside class="edu-media-notes"><h2>' + e2(p.noteTitle) + "</h2>" + arr3(p.notes, 3).map((x, i) => '<article data-motion="item"><span>' + String(i + 1).padStart(2, "0") + "</span><div><h3>" + e2(x.label) + "</h3><p>" + e2(x.detail) + "</p></div></article>").join("") + "</aside></div>");
    }),
    create4("annotation-callout", "\u7BAD\u5934\u4E0E\u8BF4\u660E\u6807\u6CE8", "\u4E09\u4E2A\u7CBE\u786E\u951A\u70B9\u8FDE\u63A5\u793A\u610F\u4E3B\u4F53\u4E0E\u8BF4\u660E\u5361\uFF1B\u8BF4\u660E\u3001\u76EE\u6807\u6807\u7B7E\u548C\u5173\u7CFB\u5747\u53EF\u66FF\u6362\u3002", {
      "eyebrow": "\u680F\u76EE / 01",
      "title": "\u4E3B\u6807\u9898",
      "subtitle": "\u526F\u6807\u9898\u4E0E\u8BF4\u660E\u6587\u5B57",
      "badge": "\u793A\u4F8B\u6807\u7B7E",
      "footer": "\u9875\u811A\u8BF4\u660E",
      "series": "\u793A\u4F8B\u7CFB\u5217",
      "subjectTitle": "\u4E3B\u4F53\u6807\u9898",
      "subjectSubtitle": "\u4E3B\u4F53\u8BF4\u660E",
      "fields": [
        {
          "label": "\u5B57\u6BB5A",
          "value": "\u5185\u5BB9 A"
        },
        {
          "label": "\u5B57\u6BB5B",
          "value": "\u5185\u5BB9 B"
        },
        {
          "label": "\u5B57\u6BB5C",
          "value": "\u5185\u5BB9 C"
        }
      ],
      "callouts": [
        {
          "title": "\u7AE0\u8282\u6807\u9898 A",
          "detail": "\u7AE0\u8282\u8BF4\u660E A"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 B",
          "detail": "\u7AE0\u8282\u8BF4\u660E B"
        },
        {
          "title": "\u7AE0\u8282\u6807\u9898 C",
          "detail": "\u7AE0\u8282\u8BF4\u660E C"
        }
      ],
      "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57"
    }, (p, h) => {
      const e2 = h.esc;
      const marker = h.uid("callout-arrow");
      return shell4(p, h, '<div class="edu-callout-stage"><section class="edu-callout-subject"><div class="edu-callout-subject-head"><span>' + e2(p.subjectSubtitle) + "</span><h2>" + e2(p.subjectTitle) + "</h2></div>" + arr3(p.fields, 3).map((x, i) => '<div class="edu-callout-field" data-motion="highlight"><span>' + e2(x.label) + "</span><strong>" + e2(x.value) + "</strong><i></i></div>").join("") + '</section><svg class="edu-callout-lines" viewBox="0 0 1164 470" aria-hidden="true"><defs><marker id="' + e2(marker) + '" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M1 1 5 4 1 7" fill="none" stroke="#2563eb" stroke-width="1.5"/></marker></defs><path data-motion="line" d="M772 90C668 90 687 203 579 203" fill="none" stroke="#2563eb" stroke-width="2.2" marker-end="url(#' + e2(marker) + ')"/><path data-motion="line" d="M772 278C690 278 665 289 579 289" fill="none" stroke="#2563eb" stroke-width="2.2" marker-end="url(#' + e2(marker) + ')"/><path data-motion="line" d="M772 439C681 439 678 375 579 375" fill="none" stroke="#2563eb" stroke-width="2.2" marker-end="url(#' + e2(marker) + ')"/></svg><div class="edu-callout-notes">' + arr3(p.callouts, 3).map((x, i) => '<article style="top:' + [37, 225, 386][i] + 'px" data-motion="item"><span>' + String(i + 1).padStart(2, "0") + "</span><div><h3>" + e2(x.title) + "</h3><p>" + e2(x.detail) + "</p></div></article>").join("") + '</div></div><div class="edu-timeline-note">' + e2(p.note) + "</div>");
    })
  ];
  var css4 = String.raw`
  .edu-scene{box-sizing:border-box;width:100%;height:100%;padding:44px 58px 24px;background:#fff;color:#1f2329;font-family:"Segoe UI","Microsoft YaHei",sans-serif;display:flex;flex-direction:column;overflow:hidden}
  .edu-scene *{box-sizing:border-box}.edu-scene h1,.edu-scene h2,.edu-scene h3,.edu-scene p{margin:0}.edu-scene svg text{font-family:"Segoe UI","Microsoft YaHei",sans-serif}
  .edu-header{display:flex;align-items:flex-start;justify-content:space-between;gap:26px;height:137px;flex:none}.edu-eyebrow{font-size:15px;letter-spacing:1.3px;font-weight:650;color:#2563eb;margin-bottom:11px}.edu-header h1{font-size:36px;line-height:1.3;letter-spacing:-.8px;font-weight:670}.edu-header p{font-size:19px;line-height:1.5;color:#687387;margin-top:9px}.edu-edition{font-size:15px;color:#5f6f86;border:1px solid #dbe3ed;border-radius:6px;padding:7px 11px;white-space:nowrap;margin-top:4px}
  .edu-body{flex:1;min-height:0;position:relative;display:flex;flex-direction:column}.edu-footer{height:31px;flex:none;margin-top:17px;border-top:1px solid #e8edf3;padding-top:13px;display:flex;justify-content:space-between;font-size:12px;color:#8992a0}.edu-footer-mark{font-size:11px;letter-spacing:1.5px;display:flex;gap:8px;align-items:center}.edu-footer-mark i{width:6px;height:6px;border-radius:50%;background:#81c9b0}
  .edu-panel{border:1px solid #dfe5ee;border-radius:14px;background:#fff}.edu-panel-heading{padding:24px 23px;border-bottom:1px solid #e9eef4}.edu-panel-heading p{font-size:17px;color:#687387;margin-top:13px}.edu-pill{display:inline-flex;padding:6px 11px;border-radius:5px;font-size:15px;font-weight:600;color:#5d6878;background:#f0f3f7;white-space:nowrap}.edu-pill-blue{color:#2563eb;background:#eaf1ff}.edu-pill-mint{color:#28735d;background:#e2f2eb}
  .edu-compare-layout{display:grid;grid-template-columns:1fr 52px 1.13fr;align-items:stretch;height:420px}.edu-compare-arrow{display:grid;place-items:center;color:#2563eb}.edu-compare-arrow svg{width:27px;height:27px}.edu-before{background:#fbfcfe}.edu-after{border-color:#b7cdf3;box-shadow:0 9px 28px #18365906}.edu-task-list{padding:8px 23px}.edu-task-row{display:flex;align-items:center;gap:17px;padding:20px 0;border-bottom:1px solid #e5eaf1}.edu-task-row:last-child{border-bottom:0}.edu-task-index{font-size:15px;color:#8793a5}.edu-task-row strong{font-size:20px;font-weight:600}.edu-task-row p{font-size:15px;color:#7a8595;margin-top:6px}.edu-task-dot{margin-left:auto;width:5px;height:5px;background:#bcc5d1;border-radius:50%;box-shadow:7px 0 #bcc5d1,14px 0 #bcc5d1}
  .edu-kanban{padding:22px 18px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px}.edu-kanban-label{display:flex;align-items:center;gap:6px;font-size:15px;font-weight:600;margin-bottom:13px;white-space:nowrap}.edu-kanban-label>i{width:7px;height:7px;border-radius:50%}.edu-kanban-label>span{margin-left:auto;color:#98a2b0;font-size:13px}.edu-kanban-task{border:1px solid #e3e9f1;border-radius:8px;padding:15px 12px;min-height:159px;background:#fff}.edu-kanban-task strong{font-size:18px;line-height:1.5;font-weight:600;display:block}.edu-kanban-task p{font-size:14px;line-height:1.65;color:#7d8796;margin-top:10px}.edu-mini-progress{height:4px;border-radius:4px;background:#edf1f6;margin-top:15px}.edu-mini-progress i{display:block;height:4px;width:56%;border-radius:4px}.edu-state-done{background:#81c9b0!important}.edu-state-active{background:#2563eb!important}.edu-state-todo{background:#c8d0dc!important}.edu-mini-progress .edu-state-done{width:100%}.edu-mini-progress .edu-state-todo{width:15%}
  .edu-takeaway{display:flex;align-items:center;gap:22px;border-top:1px solid #e4eaf2;margin-top:25px;padding:21px 0;font-size:19px;line-height:1.6}.edu-takeaway>span{font-size:14px;color:#2563eb;font-weight:650;border-left:3px solid #2563eb;padding-left:10px;white-space:nowrap}.edu-takeaway strong{font-weight:550}.edu-takeaway-compact{margin-top:10px;padding:12px 0}.edu-note{display:flex;gap:20px;align-items:center;border:1px solid #dbe6f4;background:#f7faff;border-radius:8px;padding:17px 21px;font-size:18px}.edu-note strong{color:#2563eb;font-size:17px;white-space:nowrap}.edu-note span{color:#5c687a}
  .edu-flow-stage{width:1164px;height:460px;position:relative;flex:none}.edu-flow-lines{position:absolute;inset:0;width:100%;height:100%}.edu-flow-node{position:absolute;width:238px;height:134px;padding:20px 23px;background:white;border:1px solid #d9e2ec;border-radius:10px;box-shadow:0 6px 18px #163b6805}.edu-flow-node>span{font-size:13px;font-weight:650;letter-spacing:1px;color:#95a0b0;position:absolute;right:18px;top:17px}.edu-flow-node>strong{font-size:25px;font-weight:650;display:block;margin-top:10px}.edu-flow-node>p{font-size:18px;color:#687387;margin-top:12px}.edu-flow-node-active{background:#f2f7ff;border-color:#7ea8ee}.edu-flow-node-active>strong{color:#2563eb}.edu-flow-node-done{background:#eff8f4;border-color:#add9c9}.edu-flow-label{position:absolute;background:white;font-size:14px;color:#5b7398;padding:4px 8px;left:809px}.edu-flow-label-top{top:125px}.edu-flow-label-bottom{top:302px}
  .edu-layers-layout{display:grid;grid-template-columns:620px 1fr;gap:34px;align-items:center;height:100%}.edu-layer-art{width:620px;height:525px;overflow:visible}.edu-layer-descriptions{padding:14px 0}.edu-layer-descriptions article{display:flex;gap:19px;padding:20px 0;border-bottom:1px solid #e4eaf2}.edu-layer-number{font-size:14px;color:#2563eb;font-weight:650;border:1px solid #c9dafa;border-radius:5px;width:35px;height:29px;display:grid;place-items:center;margin-top:4px;flex:none}.edu-layer-descriptions h2{font-size:25px;font-weight:650}.edu-layer-descriptions p{font-size:18px;line-height:1.75;color:#687387;margin-top:9px}.edu-layer-descriptions .edu-fine-note{font-size:14px;line-height:1.6;margin-top:19px;color:#8290a2}
  .edu-chart-panel{border:1px solid #dfe6ef;border-radius:13px;overflow:hidden;background:#fff;flex:none}.edu-chart-heading{display:flex;justify-content:space-between;align-items:center;padding:23px 28px 0}.edu-chart-heading h2{font-size:23px;font-weight:620}.edu-chart-heading>span{font-size:16px;color:#7b8798}.edu-bar-svg{display:block;width:100%;height:405px}.edu-line-svg{display:block;width:100%;height:440px}.edu-chart-source{font-size:14px;color:#7d8999;padding:0 28px 18px}
  .edu-matrix-panel{border:1px solid #dce5ef;border-radius:13px;overflow:hidden}.edu-matrix{border-collapse:collapse;width:100%;table-layout:fixed}.edu-matrix th,.edu-matrix td{border-bottom:1px solid #e5ebf3;text-align:left;padding:23px 24px;vertical-align:middle}.edu-matrix thead{background:#f6f9fd}.edu-matrix thead th:first-child{width:170px}.edu-matrix thead th{height:112px;border-right:1px solid #e5ebf3}.edu-matrix thead strong{font-size:25px;color:#1f2329;font-weight:650;display:block}.edu-matrix thead span{font-size:15px;font-weight:400;color:#687387;display:block;margin-top:9px}.edu-matrix tbody th{font-size:18px;color:#5d6b80;background:#fcfdff;font-weight:550}.edu-matrix tbody td{font-size:18px;color:#263449;line-height:1.5;border-right:1px solid #e5ebf3}.edu-matrix tbody tr:last-child th,.edu-matrix tbody tr:last-child td{border-bottom:0}.edu-matrix th:last-child,.edu-matrix td:last-child{border-right:0}
  .edu-event-track{height:445px;position:relative;margin:36px 105px 0}.edu-event-baseline{position:absolute;left:0;right:0;top:79.5px;height:2px;background:#cfddf0}.edu-event{position:absolute;top:0;width:205px;margin-left:-102.5px;text-align:center}.edu-event-time{font-size:23px;font-weight:650;color:#6f7e92;height:32px;line-height:32px;margin-bottom:36px}.edu-event-node{width:23px;height:23px;background:#fff;border:2px solid #d3ddea;border-radius:50%;margin:0 auto;display:grid;place-items:center;position:relative;z-index:1}.edu-event-node svg{width:17px;height:17px;color:#28735d}.edu-event-done .edu-event-node{background:#dff2e9;border-color:#81c9b0}.edu-event-active .edu-event-node{border-color:#2563eb;box-shadow:0 0 0 7px #edf3ff}.edu-event-active .edu-event-node i{width:9px;height:9px;border-radius:50%;background:#2563eb}.edu-event-card{margin-top:31px;border:1px solid #e0e7f0;border-radius:11px;min-height:204px;padding:19px 16px;text-align:left;background:#fff}.edu-event-number{font-size:14px;letter-spacing:1px;color:#9aa5b4}.edu-event-card h2{font-size:23px;margin-top:15px;font-weight:650}.edu-event-card p{font-size:17px;color:#6c788a;line-height:1.65;margin-top:10px}.edu-event-active .edu-event-card{border-color:#9abaf0;background:#f7faff}.edu-event-active .edu-event-time,.edu-event-active .edu-event-card h2{color:#2563eb}.edu-event-active{font-size:14px;color:#2563eb}.edu-event-card .edu-event-active{display:inline-block;background:#e8f0ff;padding:4px 8px;border-radius:4px;margin-top:13px}.edu-timeline-note{font-size:17px;color:#768497;border-top:1px solid #e5ebf3;padding-top:19px;margin-top:auto}
  .edu-metric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:19px}.edu-metric-card{padding:21px 25px;border:1px solid #dfe7f1;border-radius:12px}.edu-metric-label{font-size:19px;color:#59697e}.edu-metric-value{display:flex;align-items:baseline;gap:12px;margin-top:10px}.edu-metric-value strong{font-size:49px;letter-spacing:-1.5px;font-weight:630;color:#1f2329}.edu-metric-value span{font-size:23px;color:#91a0b2}.edu-metric-progress{height:5px;border-radius:5px;background:#edf1f7;margin-top:13px;overflow:hidden}.edu-metric-progress i{display:block;height:100%;background:#2563eb;border-radius:5px}.edu-metric-card:nth-child(2) .edu-metric-progress i{background:#81c9b0}.edu-metric-card p{font-size:15px;color:#8290a2;margin-top:12px}.edu-dashboard-bottom{display:grid;grid-template-columns:1.4fr 1fr;gap:22px;margin-top:22px}.edu-progress-panel,.edu-check-panel{border:1px solid #dfe7f1;border-radius:12px;padding:21px 25px}.edu-progress-panel h2,.edu-check-panel h2{font-size:22px;font-weight:620}.edu-progress-panel svg{height:227px;width:100%;display:block;margin-top:2px}.edu-check-item{display:flex;gap:15px;align-items:center;margin-top:22px}.edu-check-item>span{width:23px;height:23px;border-radius:50%;flex:none;display:grid;place-items:center}.edu-check-done{background:#dff2e9;color:#28735d}.edu-check-pending{border:1.5px solid #c5cfdd}.edu-check-item svg{width:18px;height:18px}.edu-check-item strong{font-size:18px;font-weight:500}.edu-dashboard-note{font-size:13px;color:#8290a2;margin-top:10px}
  .edu-definition-layout{display:grid;grid-template-columns:1.12fr 1fr;gap:35px;height:100%;padding-top:13px}.edu-definition-main{padding:23px 27px 25px 5px}.edu-definition-en{font-size:15px;color:#91a0b3;letter-spacing:3px}.edu-definition-main h2{width:max-content;max-width:100%;font-size:59px;line-height:1.25;letter-spacing:-2px;margin-top:15px;font-weight:650;color:#2563eb}.edu-definition-sentence{font-size:29px;line-height:1.65;color:#253146;margin-top:23px!important;max-width:510px}.edu-factor-list{display:flex;gap:17px;margin-top:38px}.edu-factor-list>div{flex:1;min-width:0;border-top:2px solid #dce7f8;padding-top:14px}.edu-factor-list span{font-size:13px;color:#93a4bb}.edu-factor-list strong{font-size:20px;display:block;margin-top:13px;font-weight:650}.edu-factor-list p{font-size:15px;color:#7a879a;line-height:1.7;margin-top:8px}.edu-example-panel{background:#f7faff;border:1px solid #dbe6f4;border-radius:15px;padding:33px 33px;align-self:center}.edu-example-panel h2{font-size:28px;font-weight:650;margin-top:25px}.edu-example-panel blockquote{font-size:25px;line-height:1.9;letter-spacing:.2px;color:#3c4c63;margin:20px 0 28px;padding:0}.edu-example-note{display:flex;align-items:flex-start;gap:12px;border-top:1px solid #dae5f3;padding-top:20px}.edu-example-note svg{width:25px;height:25px;flex:none;color:#28735d}.edu-example-note p{font-size:17px;line-height:1.65;color:#5d7a70}
  .edu-chapter-layout{display:grid;grid-template-columns:326px 1fr;gap:57px;flex:1;align-items:center}.edu-chapter-index{border-right:1px solid #dbe4f0;position:relative;align-self:stretch;display:flex;flex-direction:column;justify-content:center;padding-bottom:26px}.edu-chapter-index>span{font-size:170px;line-height:1;color:#2563eb;font-weight:600;letter-spacing:-11px}.edu-chapter-index>div{font-size:27px;font-weight:550;margin-top:26px;color:#567095}.edu-chapter-index>i{width:51px;height:5px;background:#81c9b0;border-radius:4px;margin-top:25px}.edu-chapter-content h2{font-size:32px;font-weight:650;margin-bottom:26px}.edu-chapter-content article{display:flex;gap:21px;margin-top:24px}.edu-chapter-content article>span{width:34px;height:34px;border-radius:50%;background:#e1f3ea;color:#28735d;display:grid;place-items:center;flex:none;margin-top:3px}.edu-chapter-content article svg{width:25px;height:25px}.edu-chapter-content h3{font-size:24px;font-weight:620}.edu-chapter-content p{font-size:19px;color:#7a8798;line-height:1.7;margin-top:7px}.edu-next-strip{display:flex;align-items:center;gap:20px;padding:22px 26px;background:#f2f7ff;border:1px solid #d6e4fa;border-radius:9px;color:#2563eb;margin-top:23px}.edu-next-strip span{font-size:15px;white-space:nowrap;font-weight:600}.edu-next-strip strong{font-size:22px;font-weight:600;flex:1}.edu-next-strip svg{width:25px;height:25px}
  .edu-media-layout{display:grid;grid-template-columns:772px 1fr;gap:30px;align-items:start;padding-top:16px}.edu-media-canvas{aspect-ratio:16/9;width:100%;border-radius:12px;overflow:hidden;border:1px solid #dce5f0;background:#f8fbff;display:grid;place-items:center}.edu-media-element{display:block;max-width:100%;max-height:100%;width:100%;height:100%;object-fit:contain}.edu-media-diagram{display:block;width:100%;height:100%}.edu-media-caption{padding:21px 0 0;display:flex;gap:15px;align-items:flex-start}.edu-media-caption p{font-size:16px;color:#6f7f94;line-height:1.75}.edu-media-notes{padding:6px 0}.edu-media-notes h2{font-size:25px;font-weight:630;margin-bottom:27px}.edu-media-notes article{display:flex;gap:14px;margin-bottom:27px;padding-bottom:25px;border-bottom:1px solid #e1e8f1}.edu-media-notes article:last-child{border-bottom:0}.edu-media-notes article>span{font-size:13px;font-weight:650;color:#2563eb;background:#edf3ff;width:27px;height:27px;border-radius:5px;display:grid;place-items:center;flex:none;margin-top:2px}.edu-media-notes h3{font-size:20px;font-weight:600}.edu-media-notes p{font-size:16px;color:#7a879a;line-height:1.75;margin-top:9px}
  .edu-callout-stage{position:relative;height:480px;width:1164px}.edu-callout-subject{position:absolute;left:28px;top:37px;width:578px;background:#fbfcfe;border:1px solid #d9e2ee;border-radius:13px;padding:25px 26px}.edu-callout-subject-head{height:87px;padding:0 0 21px;border-bottom:1px solid #e4eaf2}.edu-callout-subject-head>span{font-size:14px;color:#91a0b3}.edu-callout-subject h2{font-size:27px;margin-top:10px;font-weight:650}.edu-callout-field{display:flex;align-items:center;gap:17px;border:1px solid #dce6f4;border-radius:7px;background:#fff;height:66px;padding:15px 18px;margin-top:20px;position:relative}.edu-callout-field>span{font-size:15px;color:#2563eb;background:#edf3ff;padding:5px 8px;border-radius:4px;white-space:nowrap}.edu-callout-field>strong{font-size:21px;font-weight:550;letter-spacing:-.3px}.edu-callout-field>i{display:none}.edu-callout-lines{position:absolute;inset:0;width:1164px;height:470px;overflow:visible;pointer-events:none}.edu-callout-notes{position:absolute;left:772px;top:0;width:363px}.edu-callout-notes article{position:absolute;left:0;right:0;border:1px solid #cdddf5;border-radius:9px;padding:19px 20px;display:flex;align-items:flex-start;gap:15px;background:#fff}.edu-callout-notes article>span{font-size:13px;color:#2563eb;background:#edf3ff;padding:5px 6px;border-radius:4px;margin-top:1px}.edu-callout-notes h3{font-size:23px;font-weight:620;color:#2563eb}.edu-callout-notes p{font-size:17px;color:#708097;line-height:1.6;margin-top:7px}
`;

  // mixed-media-layouts.mjs
  var mediaPresentations = Object.freeze([
    { id: "pip", name: "\u753B\u4E2D\u753B", panels: 1, purpose: "\u4E3B\u753B\u9762\u6301\u7EED\u64AD\u653E\uFF0C\u8F85\u52A9\u753B\u9762\u8FDB\u5165\u540E\u505C\u7559\uFF0C\u9002\u5408\u6F14\u793A\u4E0E\u8865\u5145\u8BC1\u636E\u3002" },
    { id: "compare", name: "\u53CC\u753B\u9762\u5BF9\u7167", panels: 1, purpose: "\u4E24\u4E2A\u753B\u9762\u5E76\u5217\uFF0C\u5148\u5EFA\u7ACB\u5DE6\u4FA7\u518D\u63ED\u793A\u53F3\u4FA7\uFF0C\u9002\u5408\u5E76\u884C\u64CD\u4F5C\u6216\u65B9\u6848\u5BF9\u7167\u3002" },
    { id: "wipe", name: "\u64E6\u9664\u5BF9\u6BD4", panels: 1, purpose: "\u540C\u4E00\u89C6\u53E3\u6ED1\u52A8\u63ED\u793A\u7B2C\u4E8C\u7D20\u6750\uFF1B\u771F\u5B9E\u524D\u540E\u5BF9\u6BD4\u9700\u63D0\u4F9B\u914D\u51C6\u7D20\u6750\u3002" },
    { id: "triptych", name: "\u4E09\u8054\u753B", panels: 2, purpose: "\u4E09\u4E2A\u7D20\u6750\u9519\u65F6\u8FDB\u5165\u540E\u540C\u65F6\u505C\u7559\uFF0C\u9002\u5408\u4E09\u4E2A\u7EC6\u8282\u6216\u540C\u4E3B\u9898\u591A\u89C6\u89D2\u3002" },
    { id: "collage", name: "\u9519\u843D\u62FC\u8D34", panels: 2, purpose: "\u4E3B\u56FE\u4FDD\u6301\u4E3B\u4F53\uFF0C\u4E24\u4E2A\u8865\u5145\u753B\u9762\u9519\u843D\u53E0\u653E\uFF0C\u9002\u5408\u7D20\u6750\u7EFC\u8FF0\u3002" },
    { id: "focus", name: "\u5C40\u90E8\u653E\u5927\u7A97", panels: 0, purpose: "\u4FDD\u7559\u540C\u6E90\u5168\u8C8C\u4E0E\u653E\u5927\u7A97\uFF0C\u84DD\u6846\u6807\u660E\u5B9E\u9645\u653E\u5927\u533A\u57DF\uFF1B\u624B\u5DE5\u7126\u70B9\uFF0C\u4E0D\u81EA\u52A8\u8DDF\u8E2A\u3002" }
  ]);
  var box = (x, y, w, h, extra2 = {}) => ({ x, y, width: w, height: h, ...extra2 });
  function presentationBoxes(layout, width = 1280, height = 720) {
    const layouts = {
      pip: [box(40, 112, 1200, 500), box(828, 362, 380, 214, { delay: 0.18 })],
      compare: [box(40, 132, 588, 444), box(652, 132, 588, 444, { delay: 0.14 })],
      wipe: [box(40, 112, 1200, 500), box(40, 112, 1200, 500)],
      triptych: [box(40, 132, 384, 444), box(448, 132, 384, 444, { delay: 0.13 }), box(856, 132, 384, 444, { delay: 0.26 })],
      collage: [box(88, 148, 730, 418, { rotation: -2 }), box(828, 132, 356, 212, { rotation: 3, delay: 0.16 }), box(798, 370, 390, 220, { rotation: -2, delay: 0.3 })],
      focus: [box(40, 132, 770, 444), box(842, 238, 398, 260, { delay: 0.2 })]
    };
    if (!layouts[layout]) throw Error("Unknown media layout: " + layout);
    return layouts[layout].map((b2) => ({ ...b2, x: b2.x * width / 1280, y: b2.y * height / 720, width: b2.width * width / 1280, height: b2.height * height / 720 }));
  }
  function presentationSources(shot2) {
    return shot2.layout === "focus" ? [
      { ...shot2, fit: "contain", camera: [{ at: 0, x: 0.5, y: 0.5, zoom: 1 }, { at: 1, x: 0.5, y: 0.5, zoom: 1 }] },
      { ...shot2, fit: "cover", maxZoom: shot2.focus.zoom, camera: [{ at: 0, ...shot2.focus }, { at: 1, ...shot2.focus }], regions: [], panelLabel: shot2.focus.label ?? "\u5C40\u90E8\u7EC6\u8282" }
    ] : [shot2, ...shot2.mediaPanels];
  }
  function renderPresentation(shot2, index, h, renderWorld) {
    const boxes = presentationBoxes(shot2.layout), sources = presentationSources(shot2);
    return `<div class="mm-layout mm-layout-${shot2.layout}" style="--mm-wipe:0">${sources.map((s2, j) => {
      const b2 = boxes[j];
      return `<div class="mm-pane" data-mm-pane="${j}" style="left:${b2.x}px;top:${b2.y}px;width:${b2.width}px;height:${b2.height}px;${shot2.layout === "wipe" && j === 1 ? "clip-path:inset(0 calc((100 - var(--mm-wipe)) * 1%) 0 0);" : ""}"><div class="mm-pane-crop">${renderWorld(s2, index * 4 + j)}</div>${s2.panelLabel ? `<span class="mm-pane-label">${h.esc(s2.panelLabel)}</span>` : ""}</div>`;
    }).join("")}${shot2.layout === "wipe" ? '<div class="mm-wipe-track"><div class="mm-wipe-divider"></div></div>' : ""}</div>`;
  }
  var presentationCSS = `
.mm-layout{position:absolute;inset:0;background:#fff}
.mm-pane{position:absolute;transform-origin:50% 50%;border-radius:10px;box-shadow:0 0 0 1px #dce4ee,0 10px 28px #182b4417;background:#edf2f7}
.mm-pane-crop{position:absolute;inset:0;overflow:hidden;border-radius:inherit}
.mm-pane-label{position:absolute;left:12px;bottom:12px;padding:7px 12px;background:#fff;border:1px solid #dce4ee;border-radius:6px;font-size:18px;line-height:1.35;color:#1749ad;max-width:calc(100% - 24px);overflow-wrap:anywhere}
.mm-layout-pip .mm-pane[data-mm-pane="1"]{box-shadow:0 0 0 4px #fff,0 0 0 5px #81c9b0,0 8px 24px #182b4433}
.mm-layout-wipe .mm-pane{border-radius:0;box-shadow:none}
.mm-layout-wipe .mm-pane[data-mm-pane="0"] .mm-pane-label{left:auto;right:12px}
.mm-wipe-track{position:absolute;left:40px;top:112px;width:1200px;height:500px;pointer-events:none}
.mm-wipe-divider{position:absolute;left:calc(var(--mm-wipe) * 1%);top:0;bottom:0;width:3px;background:#fff;box-shadow:0 0 0 1px #2563eb;transform:translateX(-50%);opacity:0}
.mm-wipe-divider::after{content:'\u2194';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;color:#2563eb;border:2px solid #2563eb;border-radius:50%;width:34px;height:34px;display:grid;place-items:center;font-size:22px}
.mm-focus-region{position:absolute;border:4px solid #2563eb;box-shadow:0 0 0 2px white;pointer-events:none;opacity:0}
.mm-layout-focus .mm-pane[data-mm-pane="1"]{box-shadow:0 0 0 3px #2563eb,0 8px 28px #182b4417}
`;
  function buildPresentation(timeline, wrapper, shot2, strength, cameraPose2) {
    const boxes = presentationBoxes(shot2.layout), sources = presentationSources(shot2);
    const move = Math.min(0.65, shot2.seconds * 0.15), factor = strength === "still" ? 0 : strength === "light" ? 0.6 : strength === "emphasis" ? 1.3 : 1;
    sources.forEach((source2, j) => {
      const pane = wrapper.querySelector(`[data-mm-pane="${j}"]`), world = pane.querySelector(".mm-world"), b2 = boxes[j];
      const frames = source2.camera, poses = frames.map((f) => cameraPose2(b2, source2, strength === "still" ? frames[0] : f, shot2.layout === "focus" ? "standard" : strength));
      timeline.set(world, { ...poses[0], transformOrigin: "0 0" }, 0);
      timeline.set(pane, { rotation: b2.rotation ?? 0 }, 0);
      if (shot2.layout !== "focus") for (let k = 1; k < frames.length; k++) timeline.fromTo(world, poses[k - 1], { ...poses[k], duration: (frames[k].at - frames[k - 1].at) * shot2.seconds * (strength === "emphasis" ? 0.78 : 1), ease: frames[k].ease, immediateRender: false, lazy: false }, shot2.at + frames[k - 1].at * shot2.seconds);
      if (b2.delay) {
        timeline.set(pane, { opacity: 0, y: 22 * factor, scale: shot2.layout === "pip" ? 0.94 : 1 }, 0);
        timeline.fromTo(pane, { opacity: 0, y: 22 * factor, scale: shot2.layout === "pip" ? 0.94 : 1 }, { opacity: 1, y: 0, scale: 1, duration: move, ease: "power3.out", immediateRender: false }, shot2.at + b2.delay * shot2.seconds);
      }
      source2.regions.forEach((r, k) => {
        const node4 = pane.querySelector(`[data-mm-region="${k}"]`), at2 = shot2.at + r.start * shot2.seconds, end = shot2.at + r.end * shot2.seconds, fade = Math.min(0.18, (end - at2) / 3);
        timeline.fromTo(node4, { opacity: 0 }, { opacity: 1, duration: fade, immediateRender: false }, at2);
        timeline.to(node4, { opacity: 0, duration: fade }, end - fade);
      });
    });
    if (shot2.layout === "wipe") {
      const layout = wrapper.querySelector(".mm-layout"), at2 = shot2.at + shot2.wipeAt * shot2.seconds;
      timeline.set(layout, { "--mm-wipe": 0 }, 0);
      timeline.fromTo(layout, { "--mm-wipe": 0 }, { "--mm-wipe": shot2.wipeRest * 100, duration: Math.min(1.1, shot2.seconds * 0.28), ease: "sine.inOut", immediateRender: false }, at2);
      timeline.fromTo(wrapper.querySelector(".mm-wipe-divider"), { opacity: 0 }, { opacity: 1, duration: Math.min(0.18, move), immediateRender: false }, at2);
    }
    if (shot2.layout === "focus") {
      const pose = cameraPose2(boxes[1], sources[1], sources[1].camera[0], "standard");
      const left = Math.max(0, -pose.x / pose.scale), top = Math.max(0, -pose.y / pose.scale), right = Math.min(shot2.width, (boxes[1].width - pose.x) / pose.scale), bottom = Math.min(shot2.height, (boxes[1].height - pose.y) / pose.scale);
      const region2 = wrapper.ownerDocument.createElement("div");
      region2.className = "mm-focus-region";
      region2.style.cssText = `left:${left}px;top:${top}px;width:${right - left}px;height:${bottom - top}px`;
      wrapper.querySelector('[data-mm-pane="0"] .mm-world').append(region2);
      timeline.fromTo(region2, { opacity: 0 }, { opacity: 1, duration: move, immediateRender: false }, shot2.at + boxes[1].delay * shot2.seconds);
    }
  }

  // mixed-media-motion.mjs
  var motionStrengths = Object.freeze({ still: 0, light: 0.6, standard: 1, emphasis: 1.3 });
  var mixedMediaEffect = { id: "media-sequence-motion", name: "\u6DF7\u526A \xB7 \u53D6\u666F\u4E0E\u7126\u70B9\u4EA4\u63A5", component: "mixed-media-sequence", exclusive: "mixed-media-sequence", category: "\u6DF7\u526A\u955C\u5934", description: "\u56FE\u7247\u3001\u5F55\u5C4F\u3001\u89C6\u9891\u6309\u65F6\u95F4\u7EC4\u63A5\uFF1B\u6E90\u5750\u6807\u805A\u7126\u548C\u6807\u6CE8\u3001\u9605\u8BFB\u505C\u7559\u3001\u5168\u5C4F/\u5206\u5C4F\u4EA4\u63A5\u3002\u53EF\u8C03\u5F3A\u5EA6\u4E0E\u65F6\u957F\uFF0C\u771F\u5B9E\u89C6\u9891\u4FDD\u6301\u539F\u901F\u3002", selector: ".mm-sequence", duration: 8, previewTime: 5.8, silent: true, cueHints: [], mediaClock: "source" };
  var finite3 = (v, name, min, max) => {
    if (typeof v !== "number" || !Number.isFinite(v) || v < min || v > max) throw Error(`${name} must be in [${min}, ${max}]`);
    return v;
  };
  var clamp3 = (v, min, max) => Math.min(max, Math.max(min, v));
  function cameraPose(view, source2, frame2, strength = "standard") {
    if (!(strength in motionStrengths)) throw Error("Unknown motion strength: " + strength);
    const base2 = (source2.fit === "contain" ? Math.min : Math.max)(view.width / source2.width, view.height / source2.height);
    const zoom = clamp3(1 + (frame2.zoom - 1) * motionStrengths[strength], 1, source2.maxZoom ?? 3);
    const scale = base2 * zoom, width = source2.width * scale, height = source2.height * scale;
    const x = view.width / 2 - source2.width * frame2.x * scale, y = view.height / 2 - source2.height * frame2.y * scale;
    return {
      x: width <= view.width ? (view.width - width) / 2 : clamp3(x, view.width - width, 0),
      y: height <= view.height ? (view.height - height) / 2 : clamp3(y, view.height - height, 0),
      scale
    };
  }
  function normalizeMediaSequence(props, duration = 8) {
    finite3(duration, "duration", 0.1, 600);
    const strength = props.strength ?? "standard";
    if (!(strength in motionStrengths)) throw Error("Unknown motion strength: " + strength);
    const source2 = normalizeMediaProps(props).media;
    if (!Array.isArray(source2) || source2.length < 1 || source2.length > 12) throw Error("media requires 1\u201312 shots");
    const shots = source2.map((m, i) => {
      if (!["image", "video"].includes(m.type)) throw Error("media.type must be image or video");
      if (typeof m.src !== "string" || !m.src || /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(m.src) || m.src.split(/[\\/]/).includes("..")) throw Error("Use local project-relative media.src");
      const width = finite3(m.width, "media.width", 1, 32e3), height = finite3(m.height, "media.height", 1, 32e3);
      const start = finite3(m.start, "shot.start", 0, 1), end = finite3(m.end, "shot.end", 0, 1);
      if (end <= start) throw Error("shot.end must be after start");
      const fit4 = m.fit ?? "cover";
      if (!["contain", "cover"].includes(fit4)) throw Error("fit must be contain or cover");
      const offset = finite3(m.sourceStart ?? 0, "sourceStart", 0, 86400);
      const seconds = (end - start) * duration;
      if (m.type === "video" && m.sourceDuration !== void 0 && offset + seconds > finite3(m.sourceDuration, "sourceDuration", 0.01, 86400) + 1e-3) throw Error(`Shot ${i + 1} exceeds source video; trim the shot or provide longer media`);
      const maxZoom = finite3(m.maxZoom ?? 2.4, "maxZoom", 1, 4);
      const camera = (m.camera ?? [{ at: 0, x: 0.5, y: 0.5, zoom: 1 }, { at: 1, x: 0.5, y: 0.5, zoom: 1 }]).map((f) => ({
        at: finite3(f.at, "camera.at", 0, 1),
        x: finite3(f.x, "camera.x", 0, 1),
        y: finite3(f.y, "camera.y", 0, 1),
        zoom: finite3(f.zoom, "camera.zoom", 1, 4),
        ease: f.ease ?? "power2.inOut"
      }));
      if (camera.length < 2 || camera[0].at !== 0 || camera.at(-1).at !== 1) throw Error("camera must begin at 0 and end at 1");
      for (let j = 1; j < camera.length; j++) if (camera[j].at <= camera[j - 1].at) throw Error("Camera keyframes must be ordered");
      const regions = (m.regions ?? []).map((r) => {
        if (r.kind && !["frame", "spotlight", "arrow"].includes(r.kind)) throw Error("Unknown annotation kind");
        const result = { ...r, x: finite3(r.x, "region.x", 0, 1), y: finite3(r.y, "region.y", 0, 1), width: finite3(r.width, "region.width", 1e-3, 1), height: finite3(r.height, "region.height", 1e-3, 1), start: finite3(r.start ?? 0, "region.start", 0, 1), end: finite3(r.end ?? 1, "region.end", 0, 1) };
        if (result.x + result.width > 1.000001 || result.y + result.height > 1.000001 || result.end <= result.start) throw Error("Region must fit source and have a positive time range");
        return result;
      });
      const transition = m.transition ?? (i ? "dissolve" : "cut");
      if (!["cut", "dissolve", "push"].includes(transition)) throw Error("Unknown media transition");
      const transitionSeconds = transition === "cut" ? 0 : Math.min(finite3(m.transitionSeconds ?? 0.4, "transitionSeconds", 0.05, 2), seconds * 0.2);
      const splitAt = m.splitAt === void 0 ? null : finite3(m.splitAt, "splitAt", 0, 0.9);
      const layout = m.layout ?? "full", recipe = mediaPresentations.find((p) => p.id === layout);
      if (layout !== "full" && !recipe) throw Error("Unknown media layout: " + layout);
      if (layout !== "full" && (splitAt !== null || m.splitFrom)) throw Error("Presentation layouts cannot also use explanation split");
      const panels = m.mediaPanels ?? [];
      if (!Array.isArray(panels) || panels.length !== (recipe?.panels ?? 0)) throw Error(`${layout} requires ${recipe?.panels ?? 0} mediaPanels`);
      if (panels.some((p) => p.layout || p.mediaPanels || p.splitAt !== void 0 || p.splitFrom)) throw Error("Nested presentation layouts are not supported");
      const mediaPanels = panels.map((p) => normalizeMediaSequence({ strength, media: [{ ...p, start: 0, end: 1, transition: "cut" }] }, seconds).shots[0]);
      const focus = layout === "focus" ? { x: finite3(m.focus?.x ?? 0.5, "focus.x", 0, 1), y: finite3(m.focus?.y ?? 0.5, "focus.y", 0, 1), zoom: Math.min(maxZoom, finite3(m.focus?.zoom ?? 2, "focus.zoom", 1, 4)), label: m.focus?.label ?? "\u5C40\u90E8\u7EC6\u8282" } : null;
      const wipeAt = finite3(m.wipeAt ?? 0.2, "wipeAt", 0, 0.6), wipeRest = finite3(m.wipeRest ?? 0.5, "wipeRest", 0.05, 0.95);
      if (m.notes !== void 0 && (!Array.isArray(m.notes) || m.notes.length > 4)) throw Error("notes supports up to 4 short lines");
      return {
        ...m,
        width,
        height,
        start,
        end,
        fit: fit4,
        sourceStart: offset,
        maxZoom,
        camera,
        regions,
        transition,
        transitionSeconds,
        splitAt,
        layout,
        mediaPanels,
        focus,
        wipeAt,
        wipeRest,
        at: start * duration,
        until: end * duration,
        seconds
      };
    });
    if (shots[0].start !== 0 || shots.at(-1).end !== 1) throw Error("Shots must cover the entire scene");
    for (let i = 1; i < shots.length; i++) if (Math.abs(shots[i].start - shots[i - 1].end) > 1e-6) throw Error("Shots must be contiguous; transition overlaps are managed automatically");
    for (let i = 0; i < shots.length; i++) {
      const shot2 = shots[i], extra2 = shots[i + 1]?.transitionSeconds ?? 0;
      shot2.mediaDuration = shot2.seconds + extra2;
      if (shot2.type === "video" && shot2.sourceDuration !== void 0 && shot2.sourceStart + shot2.mediaDuration > shot2.sourceDuration + 1e-3) throw Error(`Shot ${i + 1} lacks transition handles`);
      for (const panel5 of shot2.mediaPanels) {
        Object.assign(panel5, { at: shot2.at, until: shot2.until, mediaDuration: shot2.mediaDuration });
        if (panel5.type === "video" && panel5.sourceDuration !== void 0 && panel5.sourceStart + panel5.mediaDuration > panel5.sourceDuration + 1e-3) throw Error(`Shot ${i + 1} panel lacks transition handles`);
      }
    }
    return { duration, strength, shots };
  }
  function renderMediaSequence(props, h) {
    const { shots } = normalizeMediaSequence(props, props.previewDuration ?? 8);
    const renderWorld = (s2, id) => {
      const asset = s2.type === "video" ? `<video id="${h.uid("media-" + id)}" class="mm-asset clip" src="${h.esc(s2.src)}" muted playsinline preload="auto" data-start="${s2.at}" data-duration="${s2.mediaDuration}" data-track-index="${id}" data-media-start="${s2.sourceStart}" data-volume="0" aria-label="${h.esc(s2.alt ?? "\u89C6\u9891\u7D20\u6750")}"></video>` : `<img class="mm-asset" src="${h.esc(s2.src)}" alt="${h.esc(s2.alt ?? "\u56FE\u7247\u7D20\u6750")}">`;
      return `<div class="mm-world" data-layout-allow-overflow style="width:${s2.width}px;height:${s2.height}px">${asset}${s2.regions.map((r, j) => `<div class="mm-region mm-region-${r.kind ?? "frame"}" data-mm-region="${j}" style="left:${r.x * s2.width}px;top:${r.y * s2.height}px;width:${r.width * s2.width}px;height:${r.height * s2.height}px;opacity:0"><span>${h.esc(r.label ?? "")}</span></div>`).join("")}</div>`;
    };
    return `<section class="mm-sequence" data-mm-config="${h.esc(JSON.stringify(props))}">${shots.map((s2, i) => {
      if (s2.layout !== "full") return `<article class="mm-shot" data-mm-shot="${i}" style="z-index:${i + 1};opacity:${i ? 0 : 1}">${renderPresentation(s2, i, h, renderWorld)}<header class="mm-heading"><span>${h.esc(s2.label ?? "")}</span><h2>${h.esc(s2.title ?? "")}</h2></header>${s2.caption ? `<footer class="mm-caption"><p>${h.esc(s2.caption)}</p></footer>` : ""}</article>`;
      const sourceStyle = `width:${s2.width}px;height:${s2.height}px`;
      const asset = s2.type === "video" ? `<video id="${h.uid("media-" + i * 4)}" class="mm-asset clip" src="${h.esc(s2.src)}" muted playsinline preload="auto" data-start="${s2.at}" data-duration="${s2.mediaDuration}" data-track-index="${i * 4}" data-media-start="${s2.sourceStart}" data-volume="0" aria-label="${h.esc(s2.alt ?? "\u89C6\u9891\u7D20\u6750")}"></video>` : `<img class="mm-asset" src="${h.esc(s2.src)}" alt="${h.esc(s2.alt ?? "\u56FE\u7247\u7D20\u6750")}">`;
      return `<article class="mm-shot" data-mm-shot="${i}" style="z-index:${i + 1};opacity:${i ? 0 : 1}"><div class="mm-handoff"><div class="mm-viewport"><div class="mm-world" data-layout-allow-overflow style="${sourceStyle}">${asset}${s2.regions.map((r, j) => `<div class="mm-region mm-region-${r.kind ?? "frame"}" data-mm-region="${j}" style="left:${r.x * s2.width}px;top:${r.y * s2.height}px;width:${r.width * s2.width}px;height:${r.height * s2.height}px;opacity:0"><span>${h.esc(r.label ?? "")}</span></div>`).join("")}</div></div><aside class="mm-explanation"><span class="mm-kicker">${h.esc(s2.noteLabel ?? "\u8981\u70B9")}</span><h2>${h.esc(s2.noteTitle ?? s2.title ?? "")}</h2>${(s2.notes ?? []).map((n4) => `<p class="mm-note">${h.esc(n4)}</p>`).join("")}</aside></div><header class="mm-heading"><span>${h.esc(s2.label ?? "")}</span><h2>${h.esc(s2.title ?? "")}</h2></header>${s2.caption ? `<footer class="mm-caption"><p>${h.esc(s2.caption)}</p></footer>` : ""}</article>`;
    }).join("")}</section>`;
  }
  var mediaSequenceCSS = `
.mm-sequence,.mm-sequence *{box-sizing:border-box}
.mm-sequence{position:absolute;inset:0;overflow:hidden;background:#fff;color:#1f2329;font-family:ComponentUI,ComponentHan,sans-serif}
.mm-shot,.mm-handoff{position:absolute;inset:0;overflow:hidden;background:#fff}
.mm-viewport{position:absolute;inset:0;overflow:hidden;background:#edf2f7;transform-origin:0 0}
.mm-world{position:absolute;left:0;top:0;transform-origin:0 0}
.mm-asset{display:block;width:100%;height:100%;object-fit:fill}
.mm-region{position:absolute;border:3px solid #2563eb;border-radius:6px;box-shadow:0 0 0 1px #ffffff;pointer-events:none}
.mm-region span{position:absolute;left:6px;top:6px;font-size:19px;line-height:1.3;white-space:nowrap;padding:5px 9px;border-radius:5px;background:#fff;color:#1749ad}
.mm-region-spotlight{box-shadow:0 0 0 32000px #142f6759}
.mm-region-arrow::after{content:'';position:absolute;left:8px;top:50%;width:35px;height:20px;background:#2563eb;clip-path:polygon(0 30%,60% 30%,60% 0,100% 50%,60% 100%,60% 70%,0 70%)}
.mm-heading{position:absolute;left:44px;right:44px;top:30px;display:flex;align-items:center;justify-content:space-between;gap:20px;pointer-events:none}
.mm-heading span,.mm-heading h2{margin:0;padding:8px 13px;background:#fff;border-radius:7px;border:1px solid #dce4ee;font-size:17px;line-height:1.4;color:#1749ad;font-weight:600}
.mm-heading h2{color:#1f2329;font-size:20px;max-width:60%}
.mm-heading span:empty,.mm-heading h2:empty{display:none}
.mm-caption{position:absolute;left:64px;right:64px;bottom:28px;display:flex;justify-content:center;pointer-events:none}
.mm-caption p{margin:0;background:#fff;color:#1f2329;border:1px solid #dce4ee;border-radius:8px;padding:12px 22px;font-size:25px;line-height:1.45;text-align:center;max-width:100%;box-shadow:0 4px 16px #182b4410}
.mm-explanation{position:absolute;left:64%;right:4%;top:20%;bottom:20%;display:flex;flex-direction:column;justify-content:center;gap:22px;opacity:0}
.mm-kicker{color:#1749ad;font-size:17px;font-weight:600;letter-spacing:1px}
.mm-explanation h2{font-size:35px;line-height:1.4;margin:0;overflow-wrap:anywhere}
.mm-note{margin:0;border-left:4px solid #81c9b0;padding:8px 0 8px 18px;font-size:23px;line-height:1.5;overflow-wrap:anywhere}
` + presentationCSS;
  function buildMediaSequence(gsap, root, { duration = 8, strength: override } = {}) {
    const stage = root.querySelector(".mm-sequence");
    if (!stage) throw Error("media-sequence-motion requires a media-sequence component");
    const props = JSON.parse(stage.dataset.mmConfig), model = normalizeMediaSequence({ ...props, ...override ? { strength: override } : {} }, duration);
    const width = Number(root.dataset.width) || 1280, height = Number(root.dataset.height) || 720;
    const timeline = gsap.timeline({ paused: true });
    model.shots.forEach((shot2, i) => {
      const wrapper = stage.querySelector(`[data-mm-shot="${i}"]`), handoff = wrapper.querySelector(".mm-handoff"), view = wrapper.querySelector(".mm-viewport"), world = wrapper.querySelector(".mm-world");
      const poses = shot2.camera.map((frame2) => cameraPose({ width, height }, shot2, model.strength === "still" ? shot2.camera[0] : frame2, model.strength));
      if (i < model.shots.length - 1) {
        const next = model.shots[i + 1];
        timeline.set(wrapper, { autoAlpha: 0 }, shot2.until + next.transitionSeconds);
        if (next.transitionSeconds) timeline.set(wrapper.querySelectorAll(".mm-heading,.mm-caption"), { autoAlpha: 0 }, shot2.until);
      }
      if (shot2.layout !== "full") buildPresentation(timeline, wrapper, shot2, model.strength, cameraPose);
      else {
        timeline.set(world, { ...poses[0], transformOrigin: "0 0" }, 0);
        for (let j = 1; j < shot2.camera.length; j++) {
          const previous = shot2.camera[j - 1], current = shot2.camera[j];
          timeline.fromTo(world, poses[j - 1], { ...poses[j], duration: (current.at - previous.at) * shot2.seconds * (model.strength === "emphasis" ? 0.78 : 1), ease: current.ease, immediateRender: false, lazy: false }, shot2.at + previous.at * shot2.seconds);
        }
      }
      if (i === 0) timeline.set(wrapper, { opacity: 1 }, 0);
      else if (shot2.transition === "cut") timeline.set(wrapper, { opacity: 1 }, shot2.at);
      else if (shot2.transition === "dissolve") timeline.fromTo(wrapper, { opacity: 0 }, { opacity: 1, duration: shot2.transitionSeconds, ease: "sine.inOut", immediateRender: false }, shot2.at);
      else {
        timeline.set(wrapper, { opacity: 1 }, shot2.at);
        timeline.fromTo(wrapper, { x: width }, { x: 0, duration: shot2.transitionSeconds, ease: "power2.inOut", immediateRender: false }, shot2.at);
      }
      const media3 = shot2.layout === "full" ? wrapper.querySelector("video") : null;
      if (media3) {
        media3.classList.add("clip");
        media3.dataset.start = String(shot2.at);
        media3.dataset.duration = String(shot2.mediaDuration);
        media3.dataset.mediaStart = String(shot2.sourceStart);
        media3.dataset.trackIndex = String(i * 4);
      }
      if (shot2.layout === "full") shot2.regions.forEach((region2, j) => {
        const node4 = wrapper.querySelector(`[data-mm-region="${j}"]`), at2 = shot2.at + region2.start * shot2.seconds, end = shot2.at + region2.end * shot2.seconds;
        const fade = Math.min(0.18, (end - at2) / 3);
        timeline.fromTo(node4, { opacity: 0 }, { opacity: 1, duration: fade, immediateRender: false }, at2);
        timeline.to(node4, { opacity: 0, duration: fade }, end - fade);
      });
      if (shot2.splitAt !== null) {
        const at2 = shot2.at + shot2.splitAt * shot2.seconds, move = Math.min(0.8, shot2.seconds * (1 - shot2.splitAt) * 0.35), panel5 = wrapper.querySelector(".mm-explanation");
        const full = { scale: 1, x: 0, y: 0 }, split = { scale: 0.57, x: width * 0.04, y: height * 0.215 };
        timeline.fromTo(view, shot2.splitFrom ? split : full, { ...shot2.splitFrom ? full : split, duration: move, ease: "power2.inOut", immediateRender: false }, at2);
        if (shot2.splitFrom) timeline.set(view, split, 0);
        timeline.fromTo(panel5, { opacity: shot2.splitFrom ? 1 : 0, x: shot2.splitFrom ? 0 : 24 }, { opacity: shot2.splitFrom ? 0 : 1, x: shot2.splitFrom ? 24 : 0, duration: move * 0.2, ease: "power2.out", immediateRender: false }, at2 + (shot2.splitFrom ? 0 : move * 0.8));
        if (shot2.splitFrom) timeline.set(panel5, { opacity: 1, x: 0 }, 0);
        const notes = panel5.querySelectorAll(".mm-note");
        if (notes.length && !shot2.splitFrom) timeline.fromTo(notes, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: Math.min(0.32, move), stagger: Math.min(0.22, (shot2.until - at2 - move) / Math.max(1, notes.length)), immediateRender: false }, at2 + move);
      }
      timeline.addLabel("shot-" + (i + 1), shot2.at);
    });
    timeline.to({ t: 0 }, { t: duration, duration, ease: "none" }, 0);
    root.dataset.effectId = "media-sequence-motion";
    root.dataset.effectTargets = String(model.shots.length);
    root.__mediaSequenceModel = model;
    return timeline;
  }

  // families/mixed-media.mjs
  var components27 = [{
    id: "mixed-media-sequence",
    name: "\u6DF7\u526A \xB7 \u987A\u5E8F\u955C\u5934\u7EC4",
    category: "B-roll \xB7 \u771F\u5B9E\u7D20\u6750",
    description: "\u56FE\u7247\u3001\u5F55\u5C4F\u3001\u89C6\u9891\u6309\u539F\u901F\u6DF7\u526A\u3002\u652F\u6301\u753B\u4E2D\u753B\u3001\u53CC\u753B\u9762\u5BF9\u7167\u3001\u64E6\u9664\u5BF9\u6BD4\u3001\u4E09\u8054\u753B\u3001\u9519\u843D\u62FC\u8D34\u3001\u5C40\u90E8\u653E\u5927\u7A97\uFF0C\u4EE5\u53CA\u53D6\u666F\u3001\u6807\u6CE8\u3001\u5168\u5C4F/\u5206\u5C4F\u4E0EA/B\u4EA4\u63A5\u3002",
    width: 1280,
    height: 720,
    defaultEffect: "media-sequence-motion",
    reference: { level: "designed", basis: "\u539F\u521B\u6E90\u5750\u6807\u955C\u5934\u7F16\u6392\uFF1B\u793A\u4F8B\u4E3A\u8BB8\u53EF\u7D20\u6750\uFF0C\u4E0D\u80FD\u4F5C\u4E3A\u672C\u671F\u64CD\u4F5C\u8BC1\u636E\u3002\u8BE6\u89C1 MIXED_MEDIA_GUIDE.md\u3002", source: "assets/broll/CREDITS.md" },
    defaults: { strength: "emphasis", previewDuration: 8, media: [
      { type: "image", src: "assets/broll/planning.jpg", width: 1920, height: 1280, start: 0, end: 0.5, fit: "cover", maxZoom: 1.6, label: "\u753B\u9762 A", title: "\u5168\u8C8C \u2192 \u91CD\u70B9", camera: [{ at: 0, x: 0.5, y: 0.5, zoom: 1 }, { at: 0.16, x: 0.5, y: 0.5, zoom: 1 }, { at: 0.62, x: 0.65, y: 0.55, zoom: 1.38 }, { at: 1, x: 0.65, y: 0.55, zoom: 1.38 }], regions: [{ x: 0.61, y: 0.34, width: 0.2, height: 0.42, start: 0.64, end: 0.97, label: "\u89C2\u5BDF\u533A\u57DF" }] },
      { type: "image", src: "assets/broll/keyboard.jpg", width: 1920, height: 1440, start: 0.5, end: 1, fit: "cover", maxZoom: 1.6, label: "\u753B\u9762 B", title: "\u5168\u5C4F \u2192 \u7D20\u6750\u4E0E\u89E3\u91CA", transition: "push", transitionSeconds: 0.42, splitAt: 0.4, noteTitle: "\u8F85\u52A9\u8BF4\u660E", notes: ["\u8981\u70B9 A", "\u8981\u70B9 B"], camera: [{ at: 0, x: 0.5, y: 0.5, zoom: 1.15 }, { at: 0.3, x: 0.5, y: 0.5, zoom: 1 }, { at: 1, x: 0.5, y: 0.5, zoom: 1 }] }
    ] },
    render(props, h) {
      return renderMediaSequence({ ...this.defaults, ...props }, h);
    }
  }];

  // families/systems.mjs
  var ref2 = (basis, source2) => ({ basis, source: source2, level: "documented" });
  var arr4 = (v) => Array.isArray(v) ? v : [];
  var num6 = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
  var safeSrc = (v) => {
    const s2 = String(v || "");
    if (/^(?:[a-z]+:|\/\/)/i.test(s2) || s2.includes("..")) return "";
    return s2;
  };
  var nativePaths = {
    cut: "M6 3l12 18M18 3 6 21M8 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0m14 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
    paste: "M9 4H5v17h14V4h-4M9 2h6v5H9Z",
    rename: "M3 5h6m-3 0v14m-3 0h6M11 7h10v10H11",
    share: "M14 4h7v7m0-7-11 11M10 5H4v15h15v-6",
    tune: "M4 7h16M4 17h16M10 4v6M15 14v6",
    "vertical-more": "M12 5h.01M12 12h.01M12 19h.01",
    pin: "m7 3 10 0-1 6 3 3H5l3-3ZM12 12v9"
  };
  var cn = (h, name, size = 18) => nativePaths[name] ? `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${nativePaths[name]}"/></svg>` : h.icon(name, size);
  var winButtons = (h) => `<div class="os-window-buttons"><span>${cn(h, "minus", 12)}</span><span>${cn(h, "maximize", 12)}</span><span>${cn(h, "x", 14)}</span></div>`;
  var tool = (h, name, label3 = "") => `<span class="os-tool">${cn(h, name, 17)}${label3 ? `<span>${h.esc(label3)}</span>` : ""}</span>`;
  var fileIcon = (h, kind = "file", size = 18) => `<span class="os-file-icon os-kind-${["folder", "image", "video", "code", "file"].includes(kind) ? kind : "file"}">${cn(h, kind, size)}</span>`;
  var status2 = (p, h) => `<div class="os-ios-status"><b>${h.esc(p.time)}</b><span class="os-island" aria-hidden="true"></span><span class="os-ios-status-right"><svg viewBox="0 0 20 14" width="18" height="14" fill="currentColor" aria-hidden="true"><rect x="0" y="9" width="3" height="5" rx="1"/><rect x="5" y="6" width="3" height="8" rx="1"/><rect x="10" y="3" width="3" height="11" rx="1"/><rect x="15" width="3" height="14" rx="1"/></svg>${cn(h, "wifi", 17)}<span class="os-ios-battery"><i style="width:${Math.max(0, Math.min(100, num6(p.battery, 100)))}%"></i></span></span></div>`;
  var media2 = (p, h, fallback, klass = "") => {
    const src = safeSrc(p.media?.src);
    const kind = p.media?.kind;
    if (src && kind === "image") return `<img class="os-replace-media ${klass}" src="${h.esc(src)}" alt="${h.esc(p.media.alt || "")}" style="object-fit:${p.media.fit === "cover" ? "cover" : "contain"}">`;
    if (src && kind === "video") return `<video id="${h.uid("media")}" class="os-replace-media ${klass}" src="${h.esc(src)}" muted playsinline preload="auto" style="object-fit:${p.media.fit === "cover" ? "cover" : "contain"}"></video>`;
    return fallback;
  };
  function winNav(p, h) {
    return `<aside class="os-win-nav">${arr4(p.locations).map((x, i) => `<div data-motion="item" class="os-win-nav-item ${x.label === p.activeLocation ? "os-selected" : ""}"><span class="os-nav-chevron">${i > 5 ? cn(h, "chevron-right", 12) : ""}</span>${fileIcon(h, x.icon, 17)}<span>${h.esc(x.label)}</span>${i > 0 && i < 6 ? `<span class="os-pin">${cn(h, "pin", 11)}</span>` : ""}</div>`).join("")}</aside>`;
  }
  function breadcrumbs(p, h) {
    return `<div class="os-address-row">${tool(h, "chevron-left")}${tool(h, "chevron-right")}${tool(h, "arrow-up")}${tool(h, "refresh")}<div class="os-win-address">${cn(h, "folder", 17)}${arr4(p.path).map((x) => `<span>${h.esc(x)}</span>${cn(h, "chevron-right", 12)}`).join("")}<span class="os-flex"></span>${cn(h, "chevron-down", 13)}</div><div class="os-win-search"><span>${h.esc(p.search)}</span>${cn(h, "search", 16)}</div></div>`;
  }
  function winRows(p, h) {
    return `<div class="os-files-table"><div class="os-file-row os-table-head">${arr4(p.columns).map((x) => `<span>${h.esc(x)}</span>`).join("")}</div><div class="os-files-body" data-motion="scroll">${arr4(p.files).map((x, i) => `<div data-motion="item" class="os-file-row ${i === num6(p.selected, -1) ? "os-row-selected" : ""}"><span>${fileIcon(h, x.kind, 18)}<span>${h.esc(x.name)}</span></span><span>${h.esc(x.date)}</span><span>${h.esc(x.type)}</span><span>${h.esc(x.size)}</span></div>`).join("")}</div></div>`;
  }
  function phoneFolderSvg(h, index) {
    const back = h.uid(`phone-folder-back-${index}`), front2 = h.uid(`phone-folder-front-${index}`);
    return `<svg class="os-phone-folder-icon" viewBox="0 0 104 80" width="104" height="80" aria-hidden="true"><defs><linearGradient id="${back}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#54baf1"/><stop offset="1" stop-color="#319cde"/></linearGradient><linearGradient id="${front2}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#98d9f9"/><stop offset=".12" stop-color="#85d1f6"/><stop offset="1" stop-color="#63bef0"/></linearGradient></defs><path d="M6 14.5C6 10.9 8.9 8 12.5 8H35.8C37.8 8 39.1 8.7 40.5 10.1L46.1 15.7C47.3 16.9 48.7 17.5 50.6 17.5H91.5C95.1 17.5 98 20.4 98 24V67.5C98 71.1 95.1 74 91.5 74H12.5C8.9 74 6 71.1 6 67.5Z" fill="url(#${back})"/><path d="M9 26H95V65.5C95 69.1 93.1 71 89.5 71H14.5C10.9 71 9 69.1 9 65.5Z" fill="#d3eefc"/><path d="M6 30C6 26.7 8.7 24 12 24H92C95.3 24 98 26.7 98 30V68C98 71.3 95.3 74 92 74H12C8.7 74 6 71.3 6 68Z" fill="url(#${front2})"/><path d="M6.5 30C6.5 26.9 8.9 24.5 12 24.5H92C95.1 24.5 97.5 26.9 97.5 30" fill="none" stroke="#bfeafa" stroke-width=".8"/><path d="M12 73.5H92" stroke="#46a8df" stroke-opacity=".25"/></svg>`;
  }
  function phoneTabIcon(h, name, active) {
    if (name === "refresh" || name === "clock") return `<svg viewBox="0 0 28 28" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" aria-hidden="true"><circle cx="14" cy="14" r="10.6"/><path d="M14 7.3v7.2l4.7 2.8"/></svg>`;
    if (name === "link" || name === "people") return `<svg viewBox="0 0 32 28" width="29" height="26" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8.8" r="4.4"/><path d="M3.2 23v-1.6c0-4.2 3.5-7.3 8.8-7.3s8.8 3.1 8.8 7.3V23Z"/><path d="M22 4.8a4.1 4.1 0 0 1 0 8.1m2.1 2.3c3.2.8 5 3 5 6.1V23h-4.6"/></svg>`;
    if (name === "folder") return `<svg viewBox="0 0 30 28" width="28" height="26" fill="${active ? "currentColor" : "none"}" stroke="currentColor" stroke-width="${active ? ".4" : "1.65"}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7.2A2.2 2.2 0 0 1 5.2 5H12l3.2 3.2h9.6a2.2 2.2 0 0 1 2.2 2.2v11.4a2.2 2.2 0 0 1-2.2 2.2H5.2A2.2 2.2 0 0 1 3 21.8Z"/>${active ? "" : '<path d="M3.7 10.2h22.6"/>'}</svg>`;
    return cn(h, name, 25);
  }
  function phoneMoreIcon() {
    return '<svg viewBox="0 0 26 26" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="13" cy="13" r="10"/><g fill="currentColor" stroke="none"><circle cx="8" cy="13" r="1.3"/><circle cx="13" cy="13" r="1.3"/><circle cx="18" cy="13" r="1.3"/></g></svg>';
  }
  function iosFiles(p, h, tablet = false) {
    return `<div class="os-ios-files ${tablet ? "os-ipad-files" : ""}">${tablet ? `<aside class="os-ipad-sidebar"><div class="os-ios-side-head">${cn(h, "menu", 19)}${cn(h, "more", 19)}</div><h2>${h.esc(p.appTitle)}</h2><div class="os-ios-search">${cn(h, "search", 17)}${h.esc(p.search)}</div>${arr4(p.sidebar).map((x, i) => `<div class="os-ios-sidebar-item ${i === num6(p.selectedSidebar) ? "os-ios-selected" : ""}" data-motion="item">${cn(h, x.icon, 21)}<span>${h.esc(x.label)}</span></div>`).join("")}<h4>${h.esc(p.tagsTitle)}</h4>${arr4(p.tags).map((x) => `<div class="os-ios-tag"><i style="background:${/^#[0-9a-f]{6}$/i.test(x.color) ? x.color : "#7d7d7d"}"></i>${h.esc(x.label)}</div>`).join("")}</aside>` : ""}<div class="os-ios-files-main"><div class="os-ios-nav">${tablet ? cn(h, "chevron-left", 21) : `<span>${cn(h, "chevron-left", 22)}${h.esc(p.backLabel)}</span>`}<b>${tablet ? h.esc(p.folderTitle) : ""}</b><span>${tablet ? cn(h, "more", 22) : phoneMoreIcon()}</span></div>${tablet ? "" : `<h2>${h.esc(p.folderTitle)}</h2><div class="os-ios-search">${cn(h, "search", 17)}${h.esc(p.search)}</div>`}<div class="os-ios-sort"><span>${h.esc(p.sortLabel)}</span>${cn(h, "chevron-down", 12)}<span class="os-flex"></span>${cn(h, "grid", 18)}</div><div class="os-ios-filegrid">${arr4(p.folders).map((x, index) => `<div data-motion="item" class="os-ios-gridfile">${tablet ? `<svg viewBox="0 0 104 78" width="104" height="78" aria-hidden="true"><path d="M3 12Q3 6 9 6H39L48 16H94Q101 16 101 23V65Q101 72 94 72H9Q3 72 3 65Z" fill="#55bdf8"/><path d="M3 25Q3 19 9 19H95Q101 19 101 25V66Q101 72 95 72H9Q3 72 3 66Z" fill="#77c9f9"/><path d="M4 25Q4 20 9 20H95Q100 20 100 25" fill="none" stroke="#a9e2ff"/></svg>` : phoneFolderSvg(h, index)}<span>${h.esc(x.name)}</span><small>${h.esc(x.count)}</small></div>`).join("")}</div><div class="os-ios-filecount">${h.esc(p.itemCount)}</div></div>${tablet ? "" : `<div class="os-ios-tabs">${arr4(p.tabs).map((x, i) => `<div class="${i === num6(p.activeTab) ? "os-ios-tab-active" : ""}">${phoneTabIcon(h, x.icon, i === num6(p.activeTab))}<small>${h.esc(x.label)}</small></div>`).join("")}</div>`}</div>`;
  }
  var components28 = [
    {
      id: "chrome-browser",
      name: "Chrome \u6D4F\u89C8\u5668 \xB7 Windows",
      category: "\u7CFB\u7EDF\u4E0E\u8BBE\u5907",
      width: 1280,
      height: 800,
      description: "Windows Chrome \u539F\u751F\u6807\u7B7E\u680F\u3001\u5730\u5740\u680F\u548C\u4E66\u7B7E\u680F\uFF1B\u7F51\u9875\u533A\u53EF\u66FF\u6362\u56FE\u7247\u3001\u89C6\u9891\u6216\u7ED3\u6784\u5316 HTML \u5185\u5BB9\u3002",
      reference: ref2("Google Chrome \u5B98\u65B9\u754C\u9762\u4E0E\u684C\u9762\u6807\u7B7E\u7BA1\u7406\u6587\u6863\uFF1BWindows \u6C34\u5E73\u6807\u7B7E\u680F\uFF0C\u672A\u505A\u540C\u5C3A\u5BF8\u50CF\u7D20\u6BD4\u8F83\u3002", "https://www.google.com/chrome/"),
      defaults: {
        "tabs": [
          {
            "title": "\u6807\u7B7E\u9875 A",
            "active": true
          },
          {
            "title": "\u6807\u7B7E\u9875 B",
            "active": false
          }
        ],
        "url": "www.example.com/page",
        "profile": "U",
        "bookmarks": [
          "\u4E66\u7B7E A",
          "\u4E66\u7B7E B",
          "\u4E66\u7B7E C"
        ],
        "media": {
          "kind": "demo",
          "src": "",
          "fit": "contain",
          "alt": ""
        },
        "brand": "\u793A\u4F8B\u7AD9\u70B9",
        "actionButton": "\u64CD\u4F5C\u6309\u94AE",
        "nav": [
          "\u680F\u76EE A",
          "\u680F\u76EE B",
          "\u680F\u76EE C",
          "\u680F\u76EE D"
        ],
        "section": "\u680F\u76EE\u6807\u9898",
        "title": "\u9875\u9762\u4E3B\u6807\u9898",
        "intro": "\u9875\u9762\u7B80\u4ECB\u3002\u53EF\u66FF\u6362\u6807\u9898\u3001\u6B63\u6587\u548C\u5217\u8868\u5185\u5BB9\u3002",
        "sidebar": [
          "\u5BFC\u822A\u9879 A",
          "\u5BFC\u822A\u9879 B",
          "\u5BFC\u822A\u9879 C",
          "\u5BFC\u822A\u9879 D",
          "\u5BFC\u822A\u9879 E"
        ],
        "activePage": 0,
        "eyebrow": "\u680F\u76EE / \u5F53\u524D\u9875\u9762",
        "steps": [
          {
            "title": "\u5185\u5BB9\u6807\u9898 A",
            "body": "\u6B63\u6587\u7B2C\u4E00\u6BB5\uFF0C\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u5185\u5BB9\u3002"
          },
          {
            "title": "\u5185\u5BB9\u6807\u9898 B",
            "body": "\u6B63\u6587\u7B2C\u4E8C\u6BB5\uFF0C\u652F\u6301\u7EE7\u7EED\u8865\u5145\u8BF4\u660E\u3002"
          }
        ],
        "code": "node example.js",
        "tocTitle": "\u672C\u9875\u5185\u5BB9",
        "toc": [
          "\u76EE\u5F55\u9879 A",
          "\u76EE\u5F55\u9879 B",
          "\u76EE\u5F55\u9879 C"
        ],
        "button": "\u4E0B\u4E00\u6B65"
      },
      render(p, h) {
        return `<div class="os-stage"><div class="os-window os-chrome" data-motion="reveal"><div class="os-chrome-tabs"><span class="os-tab-search">${cn(h, "chevron-down", 15)}</span>${arr4(p.tabs).map((t) => `<div class="os-chrome-tab ${t.active ? "os-chrome-tab-active" : ""}"><span class="os-favicon">${cn(h, "file", 13)}</span><span>${h.esc(t.title)}</span>${cn(h, "x", 13)}</div>`).join("")}<span class="os-new-tab">${cn(h, "plus", 17)}</span><span class="os-flex"></span>${winButtons(h)}</div><div class="os-chrome-toolbar">${tool(h, "chevron-left")}${tool(h, "chevron-right")}${tool(h, "refresh")}<div class="os-omnibox">${cn(h, "tune", 15)}<span>${h.esc(p.url)}</span><span class="os-flex"></span><span class="os-bookmark-star">\u2606</span></div>${tool(h, "download")}<span class="os-profile">${h.esc(p.profile)}</span>${tool(h, "vertical-more")}</div><div class="os-bookmarks">${arr4(p.bookmarks).map((x) => `<span>${cn(h, "folder", 14)}${h.esc(x)}</span>`).join("")}</div><div class="os-web-viewport">${media2(p, h, `<div class="os-docsite"><header><strong>${h.esc(p.brand)}</strong><nav>${arr4(p.nav).map((x) => `<span>${h.esc(x)}</span>`).join("")}</nav><button type="button" class="os-doc-action" data-motion="focus">${h.esc(p.actionButton)}</button>${cn(h, "search", 18)}</header><div class="os-doc-body"><aside><b>${h.esc(p.section)}</b>${arr4(p.sidebar).map((x, i) => `<span class="${i === num6(p.activePage) ? "os-doc-active" : ""}">${h.esc(x)}</span>`).join("")}</aside><article data-motion="scroll"><div class="os-doc-eyebrow">${h.esc(p.eyebrow)}</div><h1>${h.esc(p.title)}</h1><p>${h.esc(p.intro)}</p>${arr4(p.steps).map((x, i) => `<section data-motion="item"><h2>${h.esc(x.title)}</h2><p>${h.esc(x.body)}</p>${i === 0 ? `<pre data-motion="type">${h.esc(p.code)}</pre>` : ""}</section>`).join("")}<div class="os-doc-next">${h.esc(p.button)}${cn(h, "arrow-right", 16)}</div></article><div class="os-doc-toc"><b>${h.esc(p.tocTitle)}</b>${arr4(p.toc).map((x) => `<span>${h.esc(x)}</span>`).join("")}</div></div></div>`)}</div></div></div>`;
      }
    },
    {
      id: "iphone-screen",
      name: "iPhone 15 Pro \xB7 \u5C4F\u5E55\u5BB9\u5668",
      category: "\u7CFB\u7EDF\u4E0E\u8BBE\u5907",
      width: 1280,
      height: 800,
      description: "iPhone 15 Pro \u5916\u58F3\u3001\u7075\u52A8\u5C9B\u3001\u72B6\u6001\u680F\u4E0E\u5E95\u90E8\u5B89\u5168\u533A\uFF1B\u9ED8\u8BA4\u662F\u53EF\u7F16\u8F91\u7684 iOS 18 \u6587\u4EF6\u6D4F\u89C8\u793A\u4F8B\u3002",
      reference: ref2("iPhone 15 Pro \u5B98\u65B9\u5C4F\u5E55\u77E9\u5F62 1179\xD72556\uFF08393\xD7852 \u903B\u8F91\u5750\u6807\uFF09\uFF1B\u6587\u4EF6\u6D4F\u89C8\u4E0E\u5E95\u680F\u4F9D\u636E Apple iOS 18 \u7528\u6237\u624B\u518C\u3002\u56FE\u6807\u4E3A\u53EF\u7F16\u8F91 SVG \u8FD1\u4F3C\uFF0CWindows \u5B57\u4F53\u56DE\u9000\uFF0C\u672A\u8FDB\u884C\u50CF\u7D20\u7EA7\u6BD4\u8F83\u3002", "https://support.apple.com/en-ie/guide/iphone/iphe4bff8827/18.0/ios/18.0"),
      defaults: {
        "time": "9:41",
        "battery": 100,
        "media": {
          "kind": "demo",
          "src": "",
          "fit": "cover",
          "alt": ""
        },
        "appTitle": "\u6587\u4EF6",
        "folderTitle": "\u793A\u4F8B\u6587\u4EF6\u5939",
        "backLabel": "\u6D4F\u89C8",
        "search": "\u641C\u7D22",
        "sortLabel": "\u540D\u79F0",
        "itemCount": "6 \u4E2A\u9879\u76EE",
        "folders": [
          {
            "name": "\u6587\u4EF6\u5939 A",
            "count": "12 \u9879"
          },
          {
            "name": "\u6587\u4EF6\u5939 B",
            "count": "8 \u9879"
          },
          {
            "name": "\u6587\u4EF6\u5939 C",
            "count": "5 \u9879"
          },
          {
            "name": "\u6587\u4EF6\u5939 D",
            "count": "16 \u9879"
          },
          {
            "name": "\u6587\u4EF6\u5939 E",
            "count": "10 \u9879"
          },
          {
            "name": "\u6587\u4EF6\u5939 F",
            "count": "3 \u9879"
          }
        ],
        "tabs": [
          {
            "label": "\u6700\u8FD1\u9879\u76EE",
            "icon": "refresh"
          },
          {
            "label": "\u5171\u4EAB",
            "icon": "link"
          },
          {
            "label": "\u6D4F\u89C8",
            "icon": "folder"
          }
        ],
        "activeTab": 2
      },
      render(p, h) {
        return `<div class="os-stage os-device-stage"><div class="os-iphone" data-motion="reveal"><i class="os-phone-side os-phone-left-a"></i><i class="os-phone-side os-phone-left-b"></i><i class="os-phone-side os-phone-left-c"></i><i class="os-phone-side os-phone-right"></i><div class="os-phone-screen"><div class="os-phone-logical">${status2(p, h)}<div class="os-phone-content">${media2(p, h, iosFiles(p, h))}</div><div class="os-home-indicator"></div></div></div></div></div>`;
      }
    },
    {
      id: "ipad-screen",
      name: "iPad Pro \xB7 \u6A2A\u5C4F\u5DE5\u4F5C\u533A",
      category: "\u7CFB\u7EDF\u4E0E\u8BBE\u5907",
      width: 1280,
      height: 800,
      description: "4:3 \u5E73\u677F\u5C55\u793A\u5BB9\u5668\uFF0C\u652F\u6301\u771F\u5B9E\u5F55\u5C4F\u66FF\u6362\uFF0C\u9ED8\u8BA4\u6587\u4EF6\u5E94\u7528\u542B\u4FA7\u680F\u3001\u6587\u4EF6\u7F51\u683C\u4E0E\u72B6\u6001\u680F\u3002",
      reference: ref2("iPad Pro 12.9 \u82F1\u5BF8\u7B2C\u516D\u4EE3\u5B98\u65B9\u5C4F\u5E55 2732\xD72048\u3002\u8BBE\u5907\u4EE5\u6B63\u9762\u5E73\u89C6\u8868\u73B0\uFF0C\u9ED8\u8BA4\u6587\u4EF6\u754C\u9762\u4EE5 iPadOS 18 \u7ED3\u6784\u4E3A\u53C2\u8003\uFF1BWindows \u9884\u89C8\u4F7F\u7528\u672C\u673A\u5B57\u4F53\u56DE\u9000\u3002", "https://support.apple.com/en-ie/111841"),
      defaults: {
        "time": "9:41",
        "date": "9\u670817\u65E5 \u661F\u671F\u56DB",
        "battery": 100,
        "media": {
          "kind": "demo",
          "src": "",
          "fit": "contain",
          "alt": ""
        },
        "appTitle": "\u6587\u4EF6",
        "folderTitle": "\u793A\u4F8B\u6587\u4EF6\u5939",
        "search": "\u641C\u7D22",
        "sortLabel": "\u540D\u79F0",
        "itemCount": "8 \u4E2A\u9879\u76EE",
        "sidebar": [
          {
            "label": "\u6700\u8FD1\u9879\u76EE",
            "icon": "refresh"
          },
          {
            "label": "\u5171\u4EAB",
            "icon": "link"
          },
          {
            "label": "iCloud \u4E91\u76D8",
            "icon": "folder"
          },
          {
            "label": "\u6211\u7684 iPad",
            "icon": "monitor"
          },
          {
            "label": "\u6700\u8FD1\u5220\u9664",
            "icon": "trash"
          }
        ],
        "selectedSidebar": 2,
        "tagsTitle": "\u6807\u7B7E",
        "tags": [
          {
            "label": "\u91CD\u8981",
            "color": "#ff453a"
          },
          {
            "label": "\u5DE5\u4F5C",
            "color": "#0a84ff"
          },
          {
            "label": "\u5DF2\u5B8C\u6210",
            "color": "#30b15a"
          }
        ],
        "folders": [
          {
            "name": "\u6587\u4EF6\u5939 A",
            "count": "24 \u9879"
          },
          {
            "name": "\u6587\u4EF6\u5939 B",
            "count": "18 \u9879"
          },
          {
            "name": "\u6587\u4EF6\u5939 C",
            "count": "8 \u9879"
          },
          {
            "name": "\u6587\u4EF6\u5939 D",
            "count": "5 \u9879"
          },
          {
            "name": "\u6587\u4EF6\u5939 E",
            "count": "36 \u9879"
          },
          {
            "name": "\u6587\u4EF6\u5939 F",
            "count": "12 \u9879"
          },
          {
            "name": "\u6587\u4EF6\u5939 G",
            "count": "4 \u9879"
          },
          {
            "name": "\u6587\u4EF6\u5939 H",
            "count": "3 \u9879"
          }
        ]
      },
      render(p, h) {
        return `<div class="os-stage os-device-stage"><div class="os-ipad" data-motion="reveal"><i class="os-ipad-camera"></i><div class="os-ipad-screen"><div class="os-ipad-logical"><div class="os-ipad-status"><span>${h.esc(p.time)}\u3000${h.esc(p.date)}</span><span>${cn(h, "wifi", 15)} ${h.esc(p.battery)}% <span class="os-ios-battery"><i style="width:${Math.max(0, Math.min(100, num6(p.battery, 100)))}%"></i></span></span></div><div class="os-ipad-content">${media2(p, h, iosFiles(p, h, true))}</div><div class="os-home-indicator"></div></div></div></div></div>`;
      }
    },
    {
      id: "windows-file-dialog",
      name: "Windows 11 \xB7 \u6587\u4EF6\u9009\u62E9",
      category: "\u7CFB\u7EDF\u4E0E\u8BBE\u5907",
      width: 1280,
      height: 800,
      description: "\u539F\u751F\u6253\u5F00\u6587\u4EF6\u5BF9\u8BDD\u6846\u7ED3\u6784\uFF1A\u8DEF\u5F84\u3001\u641C\u7D22\u3001\u5BFC\u822A\u6811\u3001\u8BE6\u7EC6\u4FE1\u606F\u5217\u8868\u3001\u6587\u4EF6\u540D\u548C\u6587\u4EF6\u7C7B\u578B\u3002",
      reference: ref2("Windows \u6587\u4EF6\u9009\u62E9\u5668\u4E0E Win32 \u5BF9\u8BDD\u6846\u5E03\u5C40\u89C4\u8303\u3002\u7ECF\u5178\u6587\u4EF6\u9009\u62E9\u5668\u4FDD\u7559\u5E95\u90E8\u6587\u4EF6\u540D/\u7C7B\u578B\u548C\u53F3\u4FA7\u6309\u94AE\uFF1B\u672A\u540C\u5C3A\u5BF8\u5B9E\u6D4B\u3002", "https://learn.microsoft.com/en-us/windows/uwp/files/quickstart-using-file-and-folder-pickers"),
      defaults: {
        "title": "\u6253\u5F00",
        "path": [
          "\u6B64\u7535\u8111",
          "\u672C\u5730\u78C1\u76D8 (D:)",
          "\u793A\u4F8B\u6587\u4EF6\u5939"
        ],
        "search": "\u641C\u7D22 \u793A\u4F8B\u6587\u4EF6\u5939",
        "locations": [
          {
            "label": "\u4E3B\u6587\u4EF6\u5939",
            "icon": "home"
          },
          {
            "label": "\u684C\u9762",
            "icon": "monitor"
          },
          {
            "label": "\u4E0B\u8F7D",
            "icon": "download"
          },
          {
            "label": "\u6587\u6863",
            "icon": "file"
          },
          {
            "label": "\u56FE\u7247",
            "icon": "image"
          },
          {
            "label": "\u89C6\u9891",
            "icon": "video"
          },
          {
            "label": "\u6B64\u7535\u8111",
            "icon": "monitor"
          },
          {
            "label": "\u672C\u5730\u78C1\u76D8 (D:)",
            "icon": "monitor"
          }
        ],
        "activeLocation": "\u89C6\u9891",
        "columns": [
          "\u540D\u79F0",
          "\u4FEE\u6539\u65E5\u671F",
          "\u7C7B\u578B",
          "\u5927\u5C0F"
        ],
        "files": [
          {
            "name": "folder-a",
            "kind": "folder",
            "date": "2026/9/17  10:24",
            "type": "\u6587\u4EF6\u5939",
            "size": ""
          },
          {
            "name": "folder-b",
            "kind": "folder",
            "date": "2026/9/17  10:26",
            "type": "\u6587\u4EF6\u5939",
            "size": ""
          },
          {
            "name": "folder-c",
            "kind": "folder",
            "date": "2026/9/17  11:08",
            "type": "\u6587\u4EF6\u5939",
            "size": ""
          },
          {
            "name": "example.json",
            "kind": "code",
            "date": "2026/9/17  11:02",
            "type": "JSON \u6587\u4EF6",
            "size": "8 KB"
          },
          {
            "name": "example.html",
            "kind": "code",
            "date": "2026/9/17  11:04",
            "type": "HTML \u6587\u6863",
            "size": "24 KB"
          },
          {
            "name": "example.md",
            "kind": "file",
            "date": "2026/9/17  10:45",
            "type": "MD \u6587\u4EF6",
            "size": "3 KB"
          },
          {
            "name": "example.mp4",
            "kind": "video",
            "date": "2026/9/17  11:08",
            "type": "MP4 \u89C6\u9891",
            "size": "12,840 KB"
          }
        ],
        "selected": 6,
        "organize": "\u7EC4\u7EC7",
        "newFolder": "\u65B0\u5EFA\u6587\u4EF6\u5939",
        "fileNameLabel": "\u6587\u4EF6\u540D(N):",
        "fileName": "example.mp4",
        "typeLabel": "\u6587\u4EF6\u7C7B\u578B(T):",
        "fileType": "\u89C6\u9891\u6587\u4EF6 (*.mp4;*.mov)",
        "open": "\u6253\u5F00(O)",
        "cancel": "\u53D6\u6D88"
      },
      render(p, h) {
        return `<div class="os-stage"><div class="os-window os-file-dialog" data-motion="reveal"><div class="os-simple-title"><span>${cn(h, "folder", 15)}${h.esc(p.title)}</span><span>${cn(h, "x", 14)}</span></div>${breadcrumbs(p, h)}<div class="os-dialog-command"><span>${h.esc(p.organize)} ${cn(h, "chevron-down", 12)}</span><span>${h.esc(p.newFolder)}</span><span class="os-flex"></span>${cn(h, "list", 17)}${cn(h, "chevron-down", 12)}<span class="os-circle-help">?</span></div><div class="os-file-content">${winNav(p, h)}${winRows(p, h)}</div><div class="os-dialog-bottom"><div class="os-picker-fields"><label>${h.esc(p.fileNameLabel)}</label><div class="os-input os-focused" data-motion="focus">${h.esc(p.fileName)}${cn(h, "chevron-down", 12)}</div><label>${h.esc(p.typeLabel)}</label><div class="os-input">${h.esc(p.fileType)}${cn(h, "chevron-down", 12)}</div></div><div class="os-picker-actions"><div class="os-button os-picker-open">${h.esc(p.open)}<span>${cn(h, "chevron-down", 12)}</span></div><div class="os-button">${h.esc(p.cancel)}</div></div></div></div></div>`;
      }
    },
    {
      id: "file-explorer",
      name: "Windows 11 \xB7 \u6587\u4EF6\u8D44\u6E90\u7BA1\u7406\u5668",
      category: "\u7CFB\u7EDF\u4E0E\u8BBE\u5907",
      width: 1280,
      height: 800,
      description: "Windows 11 \u6807\u7B7E\u3001\u5BFC\u822A\u3001\u547D\u4EE4\u680F\u3001\u5DE6\u4FA7\u76EE\u5F55\u4E0E\u6587\u4EF6\u8BE6\u7EC6\u5217\u8868\uFF0C\u72EC\u7ACB\u53C2\u6570\u9A71\u52A8\u3002",
      reference: ref2("Microsoft \u5B98\u65B9 Windows 11 File Explorer \u622A\u56FE\u53CA\u5E03\u5C40\uFF1B\u975E Windows 10 Ribbon \u4E0E macOS \u6DF7\u5408\u3002", "https://support.microsoft.com/en-us/windows/experience/fileexplorer/file-explorer-in-windows"),
      defaults: {
        "title": "\u793A\u4F8B\u6587\u4EF6\u5939",
        "path": [
          "\u6B64\u7535\u8111",
          "\u672C\u5730\u78C1\u76D8 (D:)",
          "\u793A\u4F8B\u6587\u4EF6\u5939"
        ],
        "search": "\u641C\u7D22 \u793A\u4F8B\u6587\u4EF6\u5939",
        "locations": [
          {
            "label": "\u4E3B\u6587\u4EF6\u5939",
            "icon": "home"
          },
          {
            "label": "\u684C\u9762",
            "icon": "monitor"
          },
          {
            "label": "\u4E0B\u8F7D",
            "icon": "download"
          },
          {
            "label": "\u6587\u6863",
            "icon": "file"
          },
          {
            "label": "\u56FE\u7247",
            "icon": "image"
          },
          {
            "label": "\u89C6\u9891",
            "icon": "video"
          },
          {
            "label": "\u6B64\u7535\u8111",
            "icon": "monitor"
          },
          {
            "label": "\u672C\u5730\u78C1\u76D8 (D:)",
            "icon": "monitor"
          }
        ],
        "activeLocation": "\u89C6\u9891",
        "columns": [
          "\u540D\u79F0",
          "\u4FEE\u6539\u65E5\u671F",
          "\u7C7B\u578B",
          "\u5927\u5C0F"
        ],
        "files": [
          {
            "name": "folder-a",
            "kind": "folder",
            "date": "2026/9/17  10:24",
            "type": "\u6587\u4EF6\u5939",
            "size": ""
          },
          {
            "name": "folder-b",
            "kind": "folder",
            "date": "2026/9/17  10:26",
            "type": "\u6587\u4EF6\u5939",
            "size": ""
          },
          {
            "name": "folder-c",
            "kind": "folder",
            "date": "2026/9/17  11:08",
            "type": "\u6587\u4EF6\u5939",
            "size": ""
          },
          {
            "name": "example.json",
            "kind": "code",
            "date": "2026/9/17  11:02",
            "type": "JSON \u6587\u4EF6",
            "size": "8 KB"
          },
          {
            "name": "example.html",
            "kind": "code",
            "date": "2026/9/17  11:04",
            "type": "HTML \u6587\u6863",
            "size": "24 KB"
          },
          {
            "name": "example.md",
            "kind": "file",
            "date": "2026/9/17  10:45",
            "type": "MD \u6587\u4EF6",
            "size": "3 KB"
          },
          {
            "name": "example.mp4",
            "kind": "video",
            "date": "2026/9/17  11:08",
            "type": "MP4 \u89C6\u9891",
            "size": "12,840 KB"
          }
        ],
        "selected": 3,
        "commands": [
          {
            "icon": "plus",
            "label": "\u65B0\u5EFA"
          },
          {
            "icon": "copy",
            "label": ""
          },
          {
            "icon": "link",
            "label": ""
          },
          {
            "icon": "trash",
            "label": ""
          },
          {
            "icon": "list",
            "label": "\u6392\u5E8F"
          },
          {
            "icon": "grid",
            "label": "\u67E5\u770B"
          }
        ],
        "status": "7 \u4E2A\u9879\u76EE\u3000|\u3000\u9009\u4E2D 1 \u4E2A\u9879\u76EE\u30008.00 KB"
      },
      render(p, h) {
        return `<div class="os-stage"><div class="os-window os-explorer" data-motion="reveal"><div class="os-explorer-tabs"><div class="os-explorer-tab">${fileIcon(h, "folder", 17)}<span>${h.esc(p.title)}</span>${cn(h, "x", 12)}</div>${tool(h, "plus")}<span class="os-flex"></span>${winButtons(h)}</div>${breadcrumbs(p, h)}<div class="os-explorer-command">${arr4(p.commands).map((x) => tool(h, x.icon, x.label)).join("")}${tool(h, "more")}</div><div class="os-file-content">${winNav(p, h)}${winRows(p, h)}</div><div class="os-file-status"><span>${h.esc(p.status)}</span><span>${cn(h, "list", 16)}${cn(h, "grid", 16)}</span></div></div></div>`;
      }
    },
    {
      id: "settings-panel",
      name: "Windows 11 \xB7 \u7CFB\u7EDF\u8BBE\u7F6E",
      category: "\u7CFB\u7EDF\u4E0E\u8BBE\u5907",
      width: 1280,
      height: 800,
      description: "Windows 11 \u8BBE\u7F6E\u5E94\u7528\uFF0C\u5B8C\u6574\u8D26\u6237\u680F\u3001\u8BBE\u7F6E\u5BFC\u822A\u3001\u663E\u793A\u8BBE\u7F6E\u4E0E\u539F\u751F\u5F00\u5173/\u4E0B\u62C9\u63A7\u4EF6\u3002",
      reference: ref2("Microsoft \u663E\u793A\u8BBE\u7F6E\u64CD\u4F5C\u8DEF\u5F84\u4E0E Fluent \u63A7\u4EF6\u89C4\u8303\uFF0C\u793A\u4F8B\u9009\u62E9\u5185\u7F6E\u663E\u793A\u5668\u4EE5\u6B63\u786E\u5448\u73B0\u4EAE\u5EA6\u63A7\u5236\u3002", "https://support.microsoft.com/en-us/windows/hardware/display-graphics/change-display-brightness-and-color-in-windows"),
      defaults: {
        "title": "\u8BBE\u7F6E",
        "user": "\u793A\u4F8B\u7528\u6237",
        "email": "user@example.com",
        "initial": "U",
        "search": "\u67E5\u627E\u8BBE\u7F6E",
        "nav": [
          "\u4E3B\u9875",
          "\u7CFB\u7EDF",
          "\u84DD\u7259\u548C\u5176\u4ED6\u8BBE\u5907",
          "\u7F51\u7EDC\u548C Internet",
          "\u4E2A\u6027\u5316",
          "\u5E94\u7528",
          "\u8D26\u6237",
          "\u65F6\u95F4\u548C\u8BED\u8A00",
          "\u6E38\u620F",
          "\u8F85\u52A9\u529F\u80FD",
          "\u9690\u79C1\u548C\u5B89\u5168\u6027",
          "Windows \u66F4\u65B0"
        ],
        "selectedNav": 1,
        "breadcrumb": "\u7CFB\u7EDF",
        "pageTitle": "\u5C4F\u5E55",
        "displayNumber": "1",
        "displayNote": "\u5185\u7F6E\u663E\u793A\u5668",
        "sectionTitle": "\u4EAE\u5EA6\u548C\u989C\u8272",
        "brightness": 72,
        "brightnessLabel": "\u4EAE\u5EA6",
        "brightnessHelp": "\u8C03\u6574\u5185\u7F6E\u663E\u793A\u5668\u7684\u4EAE\u5EA6",
        "nightTitle": "\u591C\u95F4\u6A21\u5F0F",
        "nightHelp": "\u4F7F\u7528\u6696\u8272\u8BA9\u773C\u775B\u66F4\u8212\u9002",
        "nightOn": false,
        "onLabel": "\u5F00",
        "offLabel": "\u5173",
        "hdrTitle": "HDR",
        "hdrHelp": "\u89C6\u9891\u3001\u6E38\u620F\u548C\u5E94\u7528\u4E2D\u7684\u9AD8\u52A8\u6001\u8303\u56F4",
        "layoutTitle": "\u7F29\u653E\u548C\u5E03\u5C40",
        "scaleTitle": "\u7F29\u653E",
        "scaleHelp": "\u66F4\u6539\u6587\u672C\u3001\u5E94\u7528\u548C\u5176\u4ED6\u9879\u76EE\u7684\u5927\u5C0F",
        "scaleValue": "150% (\u63A8\u8350)",
        "resolutionTitle": "\u663E\u793A\u5668\u5206\u8FA8\u7387",
        "resolutionValue": "2560 \xD7 1600 (\u63A8\u8350)",
        "orientationTitle": "\u663E\u793A\u65B9\u5411",
        "orientationValue": "\u6A2A\u5411"
      },
      render(p, h) {
        return `<div class="os-stage"><div class="os-window os-settings" data-motion="reveal"><div class="os-settings-title">${cn(h, "chevron-left", 16)}<span>${h.esc(p.title)}</span><span class="os-flex"></span>${winButtons(h)}</div><div class="os-settings-layout"><aside class="os-settings-nav"><div class="os-account"><span>${h.esc(p.initial)}</span><div><b>${h.esc(p.user)}</b><small>${h.esc(p.email)}</small></div></div><div class="os-settings-search">${h.esc(p.search)}${cn(h, "search", 15)}</div>${arr4(p.nav).map((x, i) => `<div class="${i === num6(p.selectedNav) ? "os-setting-selected" : ""}" data-motion="item">${cn(h, ["home", "monitor", "phone", "globe", "image", "grid", "file", "calendar", "play", "check-circle", "lock", "refresh"][i] || "settings", 19)}${h.esc(x)}</div>`).join("")}</aside><main class="os-settings-main"><h1><span>${h.esc(p.breadcrumb)}</span>${cn(h, "chevron-right", 23)}${h.esc(p.pageTitle)}</h1><div class="os-display-preview"><div>${h.esc(p.displayNumber)}</div><span>${h.esc(p.displayNote)}</span></div><h2>${h.esc(p.sectionTitle)}</h2><div class="os-setting-row" data-motion="item">${cn(h, "monitor", 21)}<div><b>${h.esc(p.brightnessLabel)}</b><small>${h.esc(p.brightnessHelp)}</small></div><div class="os-slider" style="--os-value:${Math.max(0, Math.min(100, num6(p.brightness, 70)))}%"><i data-motion="bar"></i><em></em></div>${cn(h, "chevron-down", 13)}</div><div class="os-setting-row" data-motion="item">${cn(h, "monitor", 21)}<div><b>${h.esc(p.nightTitle)}</b><small>${h.esc(p.nightHelp)}</small></div><span class="os-flex"></span><span>${h.esc(p.nightOn ? p.onLabel : p.offLabel)}</span><span class="os-toggle ${p.nightOn ? "os-toggle-on" : ""}"><i></i></span>${cn(h, "chevron-right", 13)}</div><div class="os-setting-row" data-motion="item">${cn(h, "video", 21)}<div><b>${h.esc(p.hdrTitle)}</b><small>${h.esc(p.hdrHelp)}</small></div><span class="os-flex"></span>${cn(h, "chevron-right", 13)}</div><h2>${h.esc(p.layoutTitle)}</h2>${[[p.scaleTitle, p.scaleHelp, p.scaleValue], [p.resolutionTitle, "", p.resolutionValue], [p.orientationTitle, "", p.orientationValue]].map((x, i) => `<div class="os-setting-row" data-motion="item">${cn(h, i === 0 ? "search" : "monitor", 21)}<div><b>${h.esc(x[0])}</b>${x[1] ? `<small>${h.esc(x[1])}</small>` : ""}</div><span class="os-flex"></span><div class="os-select" ${i === 2 ? 'data-motion="focus"' : ""}>${h.esc(x[2])}${cn(h, "chevron-down", 13)}</div></div>`).join("")}</main></div></div></div>`;
      }
    },
    {
      id: "command-palette",
      name: "Windows Terminal \xB7 \u547D\u4EE4\u9762\u677F",
      category: "\u7CFB\u7EDF\u4E0E\u8BBE\u5907",
      width: 1280,
      height: 800,
      description: "Windows Terminal \u7684\u7F6E\u9876\u547D\u4EE4\u641C\u7D22\u3001\u7B5B\u9009\u5217\u8868\u4E0E\u5FEB\u6377\u952E\u63D0\u793A\uFF0C\u652F\u6301\u7F16\u8F91\u547D\u4EE4\u3001\u9009\u4E2D\u9879\u53CA\u5E95\u5C42\u7EC8\u7AEF\u3002",
      reference: ref2("Windows Terminal \u5B98\u65B9 command palette \u6587\u6863\u548C\u5D4C\u5957\u547D\u4EE4\u622A\u56FE\uFF0C\u91C7\u7528 WinUI \u6DF1\u8272\u9762\u677F\u3002", "https://learn.microsoft.com/en-us/windows/terminal/command-palette"),
      defaults: {
        "title": "PowerShell",
        "terminalLines": [
          "PowerShell",
          "PS D:\\example-project> Get-ChildItem",
          "",
          "    Directory: D:\\example-project",
          "",
          "Mode                 LastWriteTime         Length Name",
          "----                 -------------         ------ ----",
          "d----          2026/1/1      09:00                folder-a",
          "d----          2026/1/1      09:00                folder-b",
          "-a---          2026/1/1      09:00           1024 example.json",
          "",
          "PS D:\\example-project>"
        ],
        "query": "> \u65B0\u5EFA",
        "heading": "\u547D\u4EE4",
        "commands": [
          {
            "icon": "plus",
            "label": "\u65B0\u5EFA\u6807\u7B7E\u9875",
            "detail": "\u4F7F\u7528\u9ED8\u8BA4\u914D\u7F6E\u6587\u4EF6",
            "shortcut": "Ctrl+Shift+T"
          },
          {
            "icon": "terminal",
            "label": "\u65B0\u5EFA\u6807\u7B7E\u9875\u2026",
            "detail": "\u9009\u62E9\u914D\u7F6E\u6587\u4EF6",
            "shortcut": "\u203A"
          },
          {
            "icon": "monitor",
            "label": "\u65B0\u5EFA\u7A97\u53E3",
            "detail": "\u6253\u5F00\u65B0\u7684\u7EC8\u7AEF\u7A97\u53E3",
            "shortcut": "Ctrl+Shift+N"
          },
          {
            "icon": "terminal",
            "label": "\u65B0\u5EFA PowerShell \u6807\u7B7E\u9875",
            "detail": "PowerShell",
            "shortcut": ""
          },
          {
            "icon": "terminal",
            "label": "\u65B0\u5EFA\u547D\u4EE4\u63D0\u793A\u7B26\u6807\u7B7E\u9875",
            "detail": "Command Prompt",
            "shortcut": ""
          }
        ],
        "selected": 0,
        "hint": "\u6309 Enter \u8FD0\u884C\u547D\u4EE4",
        "dismiss": "Esc \u5173\u95ED"
      },
      render(p, h) {
        return `<div class="os-stage"><div class="os-window os-terminal-window"><div class="os-terminal-tabs"><div>${cn(h, "terminal", 16)}${h.esc(p.title)}${cn(h, "x", 12)}</div>${tool(h, "plus")}${tool(h, "chevron-down")}<span class="os-flex"></span>${winButtons(h)}</div><pre class="os-terminal-content">${h.esc(arr4(p.terminalLines).join("\n"))}</pre><div class="os-palette" data-motion="reveal"><div class="os-palette-input"><span data-motion="type">${h.esc(p.query)}</span><i class="os-text-caret" data-motion="cursor"></i></div><div class="os-palette-heading">${h.esc(p.heading)}</div>${arr4(p.commands).map((x, i) => `<div class="os-palette-command ${i === num6(p.selected) ? "os-palette-active" : ""}" data-motion="item">${cn(h, x.icon, 20)}<div><b>${h.esc(x.label)}</b><small>${h.esc(x.detail)}</small></div><kbd>${h.esc(x.shortcut)}</kbd></div>`).join("")}<div class="os-palette-footer"><span>${h.esc(p.hint)}</span><span>${h.esc(p.dismiss)}</span></div></div></div></div>`;
      }
    },
    {
      id: "notification-stack",
      name: "Windows 11 \xB7 \u901A\u77E5\u4E2D\u5FC3",
      category: "\u7CFB\u7EDF\u4E0E\u8BBE\u5907",
      width: 1280,
      height: 800,
      description: "\u53F3\u4FA7\u539F\u751F\u901A\u77E5\u4E2D\u5FC3\uFF0C\u5305\u62EC\u6309\u5E94\u7528\u5206\u7EC4\u7684\u901A\u77E5\u3001\u65F6\u95F4\u3001\u64CD\u4F5C\u6309\u94AE\u3001\u65E5\u671F\u548C\u65E5\u5386\u3002",
      reference: ref2("Microsoft Windows 11 \u901A\u77E5\u4E2D\u5FC3\u5B98\u65B9\u622A\u56FE\u4E0E\u901A\u77E5\u7BA1\u7406\u6587\u6863\uFF1B\u5185\u5BB9\u4E3A\u53EF\u7F16\u8F91\u6F14\u793A\u3002", "https://support.microsoft.com/en-us/windows/experience/notifications-and-do-not-disturb-in-windows"),
      defaults: {
        "title": "\u901A\u77E5",
        "clear": "\u5168\u90E8\u6E05\u9664",
        "date": "9\u670817\u65E5\uFF0C\u661F\u671F\u56DB",
        "month": "2026\u5E749\u6708",
        "weekdayLabels": [
          "\u4E00",
          "\u4E8C",
          "\u4E09",
          "\u56DB",
          "\u4E94",
          "\u516D",
          "\u65E5"
        ],
        "monthStartOffset": 1,
        "monthDays": 30,
        "selectedDay": 17,
        "notifications": [
          {
            "app": "\u793A\u4F8B\u5E94\u7528",
            "icon": "info",
            "time": "\u73B0\u5728",
            "title": "\u901A\u77E5\u6807\u9898 A",
            "body": "\u901A\u77E5\u6B63\u6587\u5185\u5BB9\uFF0C\u53EF\u66FF\u6362\u4E3A\u9700\u8981\u5C55\u793A\u7684\u4FE1\u606F\u3002",
            "actions": [
              "\u67E5\u770B"
            ]
          },
          {
            "app": "\u6587\u4EF6\u8D44\u6E90\u7BA1\u7406\u5668",
            "icon": "folder",
            "time": "5 \u5206\u949F\u524D",
            "title": "\u901A\u77E5\u6807\u9898 B",
            "body": "\u8865\u5145\u901A\u77E5\u8BF4\u660E\u3002",
            "actions": []
          },
          {
            "app": "\u65E5\u5386",
            "icon": "calendar",
            "time": "12 \u5206\u949F\u524D",
            "title": "\u65E5\u7A0B\u6807\u9898",
            "body": "\u4ECA\u5929 14:00 \u2014 14:30",
            "actions": [
              "\u7A0D\u540E\u63D0\u9192",
              "\u5173\u95ED"
            ]
          }
        ],
        "focus": "\u4E13\u6CE8",
        "focusTime": "30 \u5206\u949F"
      },
      render(p, h) {
        const count2 = Math.max(28, Math.min(31, num6(p.monthDays, 30)));
        const offset = Math.max(0, Math.min(6, num6(p.monthStartOffset, 0)));
        return `<div class="os-stage os-notification-stage"><div class="os-notification-shell" data-motion="reveal"><section class="os-notification-panel"><header><b>${h.esc(p.title)}</b><span class="os-button">${h.esc(p.clear)}</span></header>${arr4(p.notifications).map((x) => `<article class="os-notification" data-motion="item"><div class="os-notification-source">${fileIcon(h, x.icon, 17)}<span>${h.esc(x.app)}</span><small>${h.esc(x.time)}</small>${cn(h, "more", 16)}${cn(h, "x", 13)}</div><h3>${h.esc(x.title)}</h3><p>${h.esc(x.body)}</p>${arr4(x.actions).length ? `<div class="os-notification-actions">${x.actions.map((a2) => `<span class="os-button">${h.esc(a2)}</span>`).join("")}</div>` : ""}</article>`).join("")}</section><section class="os-calendar-panel"><header><b>${h.esc(p.date)}</b>${cn(h, "chevron-down", 15)}</header><div class="os-month-label"><b>${h.esc(p.month)}</b><span>${cn(h, "chevron-left", 16)}${cn(h, "chevron-right", 16)}</span></div><div class="os-calendar-grid">${arr4(p.weekdayLabels).map((x) => `<span class="os-weekday">${h.esc(x)}</span>`).join("")}${Array.from({ length: offset }, () => "<span></span>").join("")}${Array.from({ length: count2 }, (_, i) => `<span class="${i + 1 === num6(p.selectedDay) ? "os-day-selected" : ""}">${i + 1}</span>`).join("")}</div><footer><span>${h.esc(p.focusTime)}</span><span class="os-button">${cn(h, "play", 14)}${h.esc(p.focus)}</span></footer></section></div></div>`;
      }
    },
    {
      id: "context-menu",
      name: "Windows 11 \xB7 \u53F3\u952E\u83DC\u5355",
      category: "\u7CFB\u7EDF\u4E0E\u8BBE\u5907",
      width: 1280,
      height: 800,
      description: "\u6587\u4EF6\u53F3\u952E\u83DC\u5355\u542B\u5E38\u7528\u64CD\u4F5C\u3001\u5206\u7EC4\u5206\u9694\u7EBF\u3001\u5FEB\u6377\u952E\u3001\u60AC\u505C\u884C\u4E0E\u4E8C\u7EA7\u6253\u5F00\u65B9\u5F0F\u83DC\u5355\u3002",
      reference: ref2("Microsoft File Explorer \u5B98\u65B9\u53F3\u952E\u83DC\u5355\u622A\u56FE\uFF1B\u9876\u90E8\u5E38\u7528\u56FE\u6807\u4E0E\u5E95\u90E8\u201C\u663E\u793A\u66F4\u591A\u9009\u9879\u201D\u7ED3\u6784\u3002", "https://support.microsoft.com/en-us/windows/media/file-explorer-context-menu-png.png"),
      defaults: {
        "filename": "\u793A\u4F8B\u6587\u6863.md",
        "filetype": "Markdown \u6587\u6863",
        "topActions": [
          {
            "icon": "copy",
            "label": "\u590D\u5236"
          },
          {
            "icon": "link",
            "label": "\u91CD\u547D\u540D"
          },
          {
            "icon": "upload",
            "label": "\u5171\u4EAB"
          },
          {
            "icon": "trash",
            "label": "\u5220\u9664"
          }
        ],
        "items": [
          {
            "icon": "file",
            "label": "\u6253\u5F00",
            "shortcut": "Enter"
          },
          {
            "icon": "code",
            "label": "\u6253\u5F00\u65B9\u5F0F",
            "submenu": true
          },
          {
            "separator": true
          },
          {
            "icon": "link",
            "label": "\u590D\u5236\u6587\u4EF6\u5730\u5740",
            "shortcut": "Ctrl+Shift+C"
          },
          {
            "icon": "folder",
            "label": "\u538B\u7F29\u4E3A ZIP \u6587\u4EF6"
          },
          {
            "icon": "check-circle",
            "label": "\u6DFB\u52A0\u5230\u6536\u85CF\u5939"
          },
          {
            "separator": true
          },
          {
            "icon": "info",
            "label": "\u5C5E\u6027",
            "shortcut": "Alt+Enter"
          },
          {
            "separator": true
          },
          {
            "icon": "more",
            "label": "\u663E\u793A\u66F4\u591A\u9009\u9879",
            "shortcut": "Shift+F10"
          }
        ],
        "selected": 1,
        "submenu": [
          {
            "icon": "code",
            "label": "Visual Studio Code"
          },
          {
            "icon": "file",
            "label": "\u8BB0\u4E8B\u672C"
          },
          {
            "icon": "globe",
            "label": "Google Chrome"
          },
          {
            "separator": true
          },
          {
            "icon": "search",
            "label": "\u9009\u62E9\u5176\u4ED6\u5E94\u7528"
          }
        ],
        "selectedSub": 0
      },
      render(p, h) {
        return `<div class="os-stage"><div class="os-context-scene"><div class="os-context-file">${fileIcon(h, "file", 48)}<div><b>${h.esc(p.filename)}</b><small>${h.esc(p.filetype)}</small></div></div><div class="os-context-menu" data-motion="reveal"><div class="os-context-actions">${arr4(p.topActions).map((x) => `<span>${cn(h, x.icon, 18)}<small>${h.esc(x.label)}</small></span>`).join("")}</div>${arr4(p.items).map((x, i) => x.separator ? '<div class="os-menu-separator"></div>' : `<div class="os-menu-row ${i === num6(p.selected) ? "os-menu-hover" : ""}" data-motion="item">${cn(h, x.icon, 17)}<span>${h.esc(x.label)}</span><kbd>${h.esc(x.shortcut || "")}</kbd>${x.submenu ? cn(h, "chevron-right", 12) : ""}</div>`).join("")}</div><div class="os-context-submenu" data-motion="reveal">${arr4(p.submenu).map((x, i) => x.separator ? '<div class="os-menu-separator"></div>' : `<div class="os-menu-row ${i === num6(p.selectedSub) ? "os-menu-hover" : ""}" data-motion="item">${cn(h, x.icon, 18)}<span>${h.esc(x.label)}</span></div>`).join("")}</div></div></div>`;
      }
    },
    {
      id: "form-panel",
      name: "WinUI \xB7 \u9879\u76EE\u521B\u5EFA\u8868\u5355",
      category: "\u7CFB\u7EDF\u4E0E\u8BBE\u5907",
      width: 1280,
      height: 800,
      description: "\u53EF\u590D\u7528 WinUI \u8868\u5355\u9875\u9762\uFF0C\u5305\u542B\u6587\u672C\u3001\u76EE\u5F55\u3001\u4E0B\u62C9\u6846\u3001\u9009\u62E9\u63A7\u4EF6\u3001\u6821\u9A8C\u63D0\u793A\u548C\u63D0\u4EA4\u533A\u3002",
      reference: ref2("\u6309 Microsoft WinUI Forms \u6807\u7B7E\u4F4D\u7F6E\u3001type ramp \u4E0E\u539F\u751F\u8F93\u5165\u63A7\u4EF6\u8BBE\u8BA1\u7684\u539F\u521B\u793A\u4F8B\u5E94\u7528\u9875\u9762\u3002", "https://learn.microsoft.com/en-us/windows/apps/design/controls/forms"),
      defaults: {
        "appTitle": "\u793A\u4F8B\u5E94\u7528",
        "title": "\u8868\u5355\u6807\u9898",
        "description": "\u8868\u5355\u8BF4\u660E\u6587\u5B57\u3002\u586B\u5199\u4E0B\u65B9\u5B57\u6BB5\u540E\u63D0\u4EA4\u3002",
        "nav": [
          {
            "icon": "home",
            "label": "\u4E3B\u9875"
          },
          {
            "icon": "folder",
            "label": "\u9879\u76EE"
          },
          {
            "icon": "settings",
            "label": "\u8BBE\u7F6E"
          }
        ],
        "activeNav": 1,
        "fields": [
          {
            "label": "\u5B57\u6BB5\u540D\u79F0 A",
            "value": "\u793A\u4F8B\u5185\u5BB9",
            "kind": "text",
            "help": "\u5B57\u6BB5\u8BF4\u660E",
            "focused": true
          },
          {
            "label": "\u4FDD\u5B58\u4F4D\u7F6E",
            "value": "D:\\example-project",
            "kind": "folder",
            "help": ""
          },
          {
            "label": "\u9009\u9879\u540D\u79F0 A",
            "value": "\u9009\u9879 A",
            "kind": "select",
            "help": ""
          },
          {
            "label": "\u9009\u9879\u540D\u79F0 B",
            "value": "\u9009\u9879 B",
            "kind": "select",
            "help": ""
          }
        ],
        "optionsTitle": "\u9009\u9879\u8BBE\u7F6E",
        "options": [
          {
            "label": "\u53EF\u9009\u9879 A",
            "checked": true
          },
          {
            "label": "\u53EF\u9009\u9879 B",
            "checked": true
          },
          {
            "label": "\u53EF\u9009\u9879 C",
            "checked": false
          }
        ],
        "note": "\u8865\u5145\u8BF4\u660E\u6587\u5B57\u3002",
        "cancel": "\u53D6\u6D88",
        "submit": "\u63D0\u4EA4"
      },
      render(p, h) {
        return `<div class="os-stage"><div class="os-window os-form-window" data-motion="reveal"><div class="os-settings-title">${cn(h, "video", 17)}<span>${h.esc(p.appTitle)}</span><span class="os-flex"></span>${winButtons(h)}</div><div class="os-form-layout"><aside>${arr4(p.nav).map((x, i) => `<div class="${i === num6(p.activeNav) ? "os-setting-selected" : ""}">${cn(h, x.icon, 19)}${h.esc(x.label)}</div>`).join("")}</aside><main><h1>${h.esc(p.title)}</h1><p>${h.esc(p.description)}</p><div class="os-form-fields">${arr4(p.fields).map((x) => `<div class="os-form-field" data-motion="item"><label>${h.esc(x.label)}</label><div class="os-input ${x.focused ? "os-focused" : ""}"><span data-motion="${x.focused ? "type" : "reveal"}">${h.esc(x.value)}</span>${x.kind === "select" ? cn(h, "chevron-down", 13) : x.kind === "folder" ? cn(h, "folder", 17) : ""}</div>${x.help ? `<small>${h.esc(x.help)}</small>` : ""}</div>`).join("")}</div><h2>${h.esc(p.optionsTitle)}</h2><div class="os-form-options">${arr4(p.options).map((x) => `<div data-motion="item"><span class="os-checkbox ${x.checked ? "os-checkbox-checked" : ""}">${x.checked ? cn(h, "check", 14) : ""}</span>${h.esc(x.label)}</div>`).join("")}</div><div class="os-form-note">${cn(h, "info", 17)}${h.esc(p.note)}</div><footer><div class="os-button">${h.esc(p.cancel)}</div><div class="os-button os-primary">${h.esc(p.submit)}</div></footer></main></div></div></div>`;
      }
    }
  ];

  // shared.mjs
  var esc3 = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var paths = {
    menu: "M4 6h16M4 12h16M4 18h16",
    "chevron-down": "m6 9 6 6 6-6",
    "chevron-right": "m9 6 6 6-6 6",
    "chevron-left": "m15 6-6 6 6 6",
    plus: "M12 5v14M5 12h14",
    x: "m6 6 12 12M18 6 6 18",
    check: "m5 12 4 4L19 6",
    search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    folder: "M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3Z",
    file: "M5 3h9l5 5v13H5ZM14 3v6h5",
    "arrow-up": "m5 12 7-7 7 7M12 5v15",
    "arrow-right": "M4 12h16m-7-7 7 7-7 7",
    settings: "m9 3-.7 3-2.7 1-2.6-.8-1 3 2.2 2v2L2 15l1 3 3-.6 2.3 1L9 21h6l.7-2.7 2.7-1 2.6.7 1-3-2.2-2v-2L22 9l-1-3-3 .7-2.3-1L15 3ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
    copy: "M8 8h12v12H8ZM16 8V4H4v12h4",
    refresh: "M20 7V3m0 4h-4M20 7A8 8 0 1 0 21 13",
    more: "M5 12h.01M12 12h.01M19 12h.01",
    terminal: "m5 7 5 5-5 5M13 17h6",
    code: "m8 5-6 7 6 7m8-14 6 7-6 7m-3-16-2 18",
    minus: "M5 12h14",
    maximize: "M5 5h14v14H5Z",
    globe: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3c5 4 5 14 0 18M12 3c-5 4-5 14 0 18",
    lock: "M5 10h14v11H5ZM8 10V7a4 4 0 0 1 8 0v3",
    home: "m3 10 9-7 9 7v11h-7v-7h-4v7H3Z",
    image: "M3 3h18v18H3Zm0 15 6-6 4 4 4-5 4 5M9 8h.01",
    video: "M3 6h13v12H3Zm13 4 5-3v10l-5-3",
    link: "m10 13 4-4M8 15l-2 2a4 4 0 0 1-5-5l5-5a4 4 0 0 1 5 0m2 2 2-2a4 4 0 0 1 5 5l-5 5a4 4 0 0 1-5 0",
    "check-circle": "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0m-13 0 3 3 5-6",
    bell: "M5 17h14l-2-4V8A5 5 0 0 0 7 8v5ZM10 20h4",
    info: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 11v6M12 7h.01",
    download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
    upload: "M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5",
    play: "m7 4 13 8-13 8Z",
    pause: "M8 5v14M16 5v14",
    trash: "M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7",
    grid: "M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z",
    list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
    mail: "M3 5h18v14H3Zm0 1 9 7 9-7",
    calendar: "M3 5h18v16H3ZM7 2v6M17 2v6M3 11h18",
    phone: "M7 2h10v20H7ZM11 18h2",
    wifi: "M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-10 4a5 5 0 0 1 6 0M12 20h.01",
    battery: "M2 6h18v12H2ZM22 10v4",
    monitor: "M3 3h18v14H3ZM8 21h8M12 17v4",
    "git-branch": "M6 3v12a5 5 0 0 0 10 0V9M4 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0m10 4a2 2 0 1 0 4 0 2 2 0 0 0-4 0",
    "git-commit": "M2 12h6m8 0h6M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    mic: "M9 3a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0Zm-3 8a6 6 0 0 0 12 0M12 17v4M8 21h8",
    shield: "m12 2 8 3v6c0 5-8 11-8 11S4 16 4 11V5ZM12 7v6M12 16h.01",
    panel: "M3 4h18v16H3ZM9 4v16",
    edit: "m4 16 12-12 4 4L8 20H4ZM13 7l4 4",
    undo: "M3 10h10a7 7 0 0 1 0 14M3 10l5-5M3 10l5 5",
    volume: "M3 9h4l5-4v14l-5-4H3ZM16 8a6 6 0 0 1 0 8",
    clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 6v6l4 2"
  };
  function icon3(name, size = 18) {
    const path2 = paths[name] ?? paths.file;
    return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="${path2}"/></svg>`;
  }
  function helpers(id) {
    return { esc: esc3, icon: icon3, uid: (s2) => `${id}-${String(s2).replace(/[^a-z0-9_-]/gi, "-")}` };
  }

  // sound-runtime.mjs
  function createPreviewController(tl, audio, options = {}) {
    const duration = Number(options.duration || 8);
    let enabled = options.enabled !== false, gain = Math.max(0, Math.min(1, Number(options.gain ?? 0.65))), active = false, pending = false, token = 0, lastError = "";
    let destroyed = false;
    const candidates = options.media ?? audio?.parentElement?.querySelectorAll("video") ?? [];
    const videos = Array.from(candidates?.tagName ? [candidates] : candidates).filter((media3) => media3?.tagName?.toLowerCase() === "video");
    const mediaStates = videos.map((media3) => ({ media: media3, pending: false, token: 0, lastError: "" }));
    const numeric = (value, fallback) => value === void 0 || value === null || value === "" || !Number.isFinite(Number(value)) ? fallback : Number(value);
    function mediaPosition(media3) {
      const start = numeric(media3.dataset.start, 0), span = Math.max(0, numeric(media3.dataset.duration, duration - start));
      const offset = Math.max(0, numeric(media3.dataset.mediaStart, 0)), elapsed = Math.max(0, tl.time() - start);
      const limit = Number.isFinite(media3.duration) ? Math.max(0, media3.duration - 1e-3) : Infinity;
      return { time: Math.min(limit, offset + Math.min(elapsed, Math.max(0, span - 1e-3))), playing: active && !destroyed && tl.time() >= start && tl.time() < start + span && offset + elapsed < limit };
    }
    function alignMedia(state3, force = false) {
      const media3 = state3.media, position2 = mediaPosition(media3);
      if (media3.readyState > 0 && Math.abs(media3.currentTime - position2.time) > (force ? 1e-3 : 0.18)) try {
        media3.currentTime = position2.time;
      } catch {
      }
    }
    function stopMedia(state3) {
      state3.token++;
      state3.pending = false;
      state3.media.pause();
    }
    async function startMedia(state3) {
      const media3 = state3.media;
      if (!mediaPosition(media3).playing || state3.pending || !media3.paused || media3.readyState === 0) return;
      const request = ++state3.token;
      state3.pending = true;
      alignMedia(state3, true);
      try {
        await media3.play();
        if (request !== state3.token || !mediaPosition(media3).playing) {
          if (!mediaPosition(media3).playing) media3.pause();
          return;
        }
        state3.lastError = "";
      } catch (e2) {
        if (request === state3.token) state3.lastError = e2.message || "\u89C6\u9891\u64AD\u653E\u5931\u8D25";
      } finally {
        if (request === state3.token) state3.pending = false;
      }
    }
    function syncMedia(force = false) {
      for (const state3 of mediaStates) {
        const shouldPlay = mediaPosition(state3.media).playing;
        if (!shouldPlay && (state3.pending || !state3.media.paused)) stopMedia(state3);
        alignMedia(state3, force || !shouldPlay);
        if (shouldPlay) void startMedia(state3);
      }
    }
    for (const state3 of mediaStates) {
      state3.media.muted = true;
      state3.media.defaultMuted = true;
      state3.media.loop = false;
      state3.media.autoplay = false;
      state3.media.pause();
      state3.loaded = () => {
        if (!destroyed) {
          alignMedia(state3, true);
          if (active) void startMedia(state3);
        }
      };
      state3.media.addEventListener("loadedmetadata", state3.loaded);
      state3.media.addEventListener("loadeddata", state3.loaded);
    }
    const stopAudio = () => {
      token++;
      pending = false;
      audio?.pause();
    };
    const audioTime = () => Math.max(0, Math.min(Number.isFinite(audio?.duration) ? Math.max(0, audio.duration - 1e-3) : duration, tl.time()));
    const align = () => {
      if (!audio) return;
      try {
        if (audio.readyState > 0) audio.currentTime = audioTime();
      } catch {
      }
    };
    const applyGain = () => {
      if (audio) {
        audio.volume = gain;
        audio.muted = !enabled || gain === 0;
      }
    };
    async function startAudio() {
      if (!audio || !active || !enabled || gain === 0 || pending || !audio.paused) return;
      const request = ++token;
      pending = true;
      align();
      try {
        await audio.play();
        if (request !== token || !active || !enabled) {
          if (!active || !enabled) audio.pause();
          return;
        }
        lastError = "";
        align();
      } catch (e2) {
        if (request === token) {
          lastError = e2.message || "\u58F0\u97F3\u64AD\u653E\u5931\u8D25";
          active = false;
          tl.pause();
          syncMedia(true);
        }
      } finally {
        if (request === token) pending = false;
      }
    }
    function sync() {
      syncMedia();
      if (!active || !enabled || gain === 0) {
        if (audio && !audio.paused) audio.pause();
        return;
      }
      if (tl.time() >= duration - 1e-3) {
        active = false;
        stopAudio();
        syncMedia(true);
        return;
      }
      if (audio?.paused && !pending) void startAudio();
      else if (audio?.readyState > 0 && Math.abs(audio.currentTime - audioTime()) > 0.18) align();
    }
    const loaded = () => {
      align();
      if (active) void startAudio();
    };
    audio?.addEventListener("loadedmetadata", loaded);
    applyGain();
    tl.eventCallback("onUpdate", sync);
    tl.eventCallback("onComplete", () => {
      active = false;
      stopAudio();
      syncMedia(true);
    });
    const api = {
      seek(t) {
        if (destroyed) return;
        active = false;
        stopAudio();
        for (const state3 of mediaStates) stopMedia(state3);
        tl.pause().seek(Math.max(0, Math.min(duration, Number(t) || 0)), false);
        align();
        syncMedia(true);
      },
      async play() {
        if (destroyed) return;
        if (tl.time() >= duration - 0.01) api.seek(0);
        active = true;
        lastError = "";
        syncMedia(true);
        tl.play();
        await startAudio();
      },
      pause() {
        active = false;
        stopAudio();
        for (const state3 of mediaStates) stopMedia(state3);
        tl.pause();
        align();
        syncMedia(true);
      },
      async restart() {
        api.seek(0);
        await api.play();
      },
      time: () => tl.time(),
      duration,
      setSoundEnabled(value) {
        enabled = Boolean(value);
        applyGain();
        if (!enabled) stopAudio();
        else if (active) void startAudio();
      },
      setSoundGain(value) {
        gain = Math.max(0, Math.min(1, Number(value) || 0));
        applyGain();
        if (gain === 0) stopAudio();
        else if (active) void startAudio();
      },
      audioState: () => ({ paused: audio?.paused ?? true, currentTime: audio?.currentTime ?? 0, muted: audio?.muted ?? true, volume: gain, enabled, active, pending, readyState: audio?.readyState ?? 0, lastError, activeSources: active && audio && !audio.paused ? 1 : 0 }),
      mediaState: () => mediaStates.map((state3) => ({ paused: state3.media.paused, currentTime: state3.media.currentTime, muted: state3.media.muted, loop: state3.media.loop, pending: state3.pending, readyState: state3.media.readyState, lastError: state3.lastError, targetTime: mediaPosition(state3.media).time })),
      destroy() {
        api.pause();
        destroyed = true;
        tl.eventCallback("onUpdate", null);
        tl.eventCallback("onComplete", null);
        audio?.removeEventListener("loadedmetadata", loaded);
        for (const state3 of mediaStates) {
          state3.media.removeEventListener("loadedmetadata", state3.loaded);
          state3.media.removeEventListener("loadeddata", state3.loaded);
        }
      }
    };
    syncMedia(true);
    return api;
  }
  function validateSoundTiming(effect, options = {}, enabled = true) {
    if (enabled && effect !== "none" && (options.transitionAt !== void 0 && Number(options.transitionAt) !== 2.1 || options.transitionDuration !== void 0 && Number(options.transitionDuration) !== 0.66))
      throw new Error("\u914D\u5957\u8F6C\u573A\u58F0\u97F3\u4F7F\u7528 2.1 \u79D2\u8D77\u70B9\u548C 0.66 \u79D2\u8282\u594F\uFF1B\u81EA\u5B9A\u4E49\u65F6\u95F4\u65F6\u8BF7\u91CD\u65B0\u914D\u8F68\u6216\u5173\u95ED\u914D\u5957\u58F0\u97F3\u3002");
    if (enabled && effect !== "none" && options.duration !== void 0 && Number(options.duration) !== 8)
      throw new Error("\u914D\u5957\u97F3\u6548\u4F7F\u75288\u79D2\u9ED8\u8BA4\u65F6\u95F4\u8F74\uFF1B\u66F4\u6539\u5185\u90E8\u65F6\u957F\u8BF7\u91CD\u65B0\u914D\u8F68\uFF0C\u6216\u8BBE\u7F6E soundEnabled=false\u3002");
    if (enabled && effect !== "none" && options.start !== void 0 && Math.abs(Number(options.start) - 0.6) > 1e-4)
      throw new Error("\u914D\u5957\u97F3\u6548\u4F7F\u7528\u9ED8\u8BA4\u52A8\u753B\u8D77\u70B9 0.6 \u79D2\u3002\u79FB\u52A8\u6574\u6BB5\u8BF7\u8C03\u6574\u7236\u955C\u5934 data-start\uFF1B\u66F4\u6539\u5185\u90E8\u8282\u594F\u8BF7\u91CD\u65B0\u914D\u8F68\uFF0C\u6216\u8BBE\u7F6E soundEnabled=false\u3002");
  }

  // motion-expanded.mjs
  var rows2 = [
    ["scale-settle", "\u8F7B\u7F29\u653E\u843D\u4F4D", "\u5165\u573A", "mac-finder", ".motion-wrap", "\u7531\u5C0F\u5E45\u7F29\u653E\u4E0E\u67D4\u548C\u8FC7\u51B2\u843D\u4F4D\u3002"],
    ["curtain-open", "\u53CC\u4FA7\u5E18\u5E55\u5F00\u573A", "\u5165\u573A", "chapter-summary", ".motion-wrap", "\u5185\u5BB9\u4ECE\u4E2D\u7EBF\u5411\u4E24\u4FA7\u5C55\u5F00\u3002"],
    ["blur-resolve", "\u7531\u865A\u5230\u5B9E", "\u5165\u573A", "definition-card", ".motion-wrap", "\u77ED\u6682\u6563\u7126\u540E\u6536\u655B\u5230\u539F\u59CB\u6E05\u6670\u753B\u9762\u3002"],
    ["mask-rise", "\u7A97\u53E3\u88C1\u5207\u5165\u573A", "\u5165\u573A", "mac-safari", ".motion-wrap", "\u7A97\u53E3\u5148\u5728\u4E0B\u65B9\u906E\u7F69\u4E2D\u62AC\u8D77\uFF0C\u518D\u5B8C\u6574\u663E\u73B0\u3002"],
    ["cards-deal", "\u5361\u7247\u53D1\u724C", "\u5165\u573A", "kanban-board", ".edx-board article", "\u5361\u7247\u5E26\u5C11\u91CF\u89D2\u5EA6\u9010\u5F20\u5C55\u5F00\u5E76\u5F52\u4F4D\u3002"],
    ["center-stagger", "\u7531\u4E2D\u592E\u5C55\u5F00", "\u5165\u573A", "mind-map", '[data-motion="item"]', "\u4ECE\u4E2D\u592E\u6982\u5FF5\u5411\u5916\u5C55\u5F00\u5206\u652F\u8282\u70B9\u3002"],
    ["border-assemble", "\u8FB9\u6846\u6784\u5EFA\u5F00\u573A", "\u5165\u573A", "lecture-stage", ".edx-lesson-shell", "\u5148\u5EFA\u7ACB\u8BFE\u4EF6\u821E\u53F0\u8FB9\u754C\uFF0C\u518D\u5448\u73B0\u6B63\u6587\u3002"],
    ["toggle-switch", "\u5F00\u5173\u5207\u6362", "\u64CD\u4F5C", "ios-settings", ".am-switch", "\u6ED1\u5757\u79FB\u52A8\u3001\u5E95\u8272\u6539\u53D8\uFF0C\u72B6\u6001\u4FDD\u6301\u5230\u7ED3\u675F\u3002"],
    ["drag-drop", "\u4EFB\u52A1\u62D6\u653E", "\u64CD\u4F5C", "kanban-board", ".edx-board article", "\u63D0\u8D77\u4E00\u5F20\u4EFB\u52A1\u5361\uFF0C\u6CBF\u5F27\u7EBF\u79FB\u5230\u76EE\u6807\u5217\u7A7A\u4F4D\u3002"],
    ["text-select", "\u62D6\u9009\u6587\u672C", "\u64CD\u4F5C", "mac-terminal", '[data-motion="type"]', "\u5149\u6807\u4ECE\u6587\u5B57\u8D77\u70B9\u5212\u8FC7\uFF0C\u7559\u4E0B\u9009\u4E2D\u6587\u5B57\u3002"],
    ["slider-drag", "\u6ED1\u5757\u8C03\u8282", "\u64CD\u4F5C", "mac-control-center", ".ap-control-slider i", "\u6ED1\u5757\u4ECE\u4F4E\u503C\u79FB\u52A8\u5230\u914D\u7F6E\u7684\u76EE\u6807\u503C\u3002"],
    ["dashed-frame", "\u865A\u7EBF\u8FB9\u6846\u7ED8\u5236", "\u6807\u6CE8", "lecture-stage", ".edx-lesson-shell", "\u865A\u7EBF\u8F6E\u5ED3\u9010\u6BB5\u5C55\u5F00\u540E\u4FDD\u6301\uFF0C\u4E0D\u6301\u7EED\u62A2\u593A\u6CE8\u610F\u3002"],
    ["corner-brackets", "\u56DB\u89D2\u5B9A\u4F4D", "\u6807\u6CE8", "settings-panel", '[data-motion="focus"]', "\u56DB\u89D2\u77ED\u7EBF\u9760\u62E2\u76EE\u6807\uFF0C\u4FDD\u7559\u4E2D\u5FC3\u5185\u5BB9\u65E0\u906E\u6321\u3002"],
    ["callout-pin", "\u5F15\u7EBF\u6807\u6CE8", "\u6807\u6CE8", "annotation-callout", '[data-motion="highlight"]', "\u5148\u6807\u8BB0\u76EE\u6807\uFF0C\u518D\u6CBF\u771F\u5B9E\u951A\u70B9\u751F\u957F\u5F15\u7EBF\u5E76\u63ED\u793A\u6CE8\u91CA\u3002"],
    ["number-tags", "\u7F16\u53F7\u6807\u8BB0", "\u6807\u6CE8", "process-steps", '[data-motion="item"]', "\u6309\u987A\u5E8F\u6302\u4E0A\u7F16\u53F7\uFF0C\u9002\u5408\u64CD\u4F5C\u6B65\u9AA4\u5B9A\u4F4D\u3002"],
    ["branch-reveal", "\u6761\u4EF6\u5206\u652F\u5C55\u5F00", "\u8BB2\u89E3", "decision-tree", '[data-motion="line"]', "\u95EE\u9898\u3001\u5206\u652F\u8FDE\u7EBF\u3001\u7ED3\u679C\u8282\u70B9\u4F9D\u6B21\u51FA\u73B0\u3002"],
    ["orbit-steps", "\u5FAA\u73AF\u8DEF\u5F84\u884C\u8FDB", "\u8BB2\u89E3", "cycle-diagram", '[data-motion="item"]', "\u5C0F\u578B\u8FDB\u5EA6\u70B9\u6CBF\u56DB\u4E2A\u9636\u6BB5\u884C\u8FDB\uFF0C\u5F3A\u8C03\u5FAA\u73AF\u65B9\u5411\u3002"],
    ["compare-sweep", "\u5BF9\u6BD4\u626B\u63CF\u7EBF", "\u8BB2\u89E3", "before-after", '[data-motion="reveal"]', "\u4E00\u6839\u626B\u63CF\u7EBF\u5E26\u51FA\u6539\u8FDB\u7ED3\u679C\uFF0C\u539F\u59CB\u5BF9\u7167\u4FDD\u6301\u3002"],
    ["equation-build", "\u516C\u5F0F\u9010\u9879\u7EC4\u5408", "\u8BB2\u89E3", "formula-breakdown", ".edx-formula article", "\u8F93\u5165\u3001\u8FD0\u7B97\u7B26\u3001\u7ED3\u679C\u6309\u6570\u5B66\u5173\u7CFB\u4F9D\u6B21\u5448\u73B0\u3002"],
    ["pyramid-build", "\u5C42\u7EA7\u4ECE\u57FA\u7840\u6784\u5EFA", "\u8BB2\u89E3", "pyramid-diagram", '[data-motion="item"]', "\u4ECE\u5E95\u5C42\u5411\u4E0A\u6784\u5EFA\u91D1\u5B57\u5854\u53CA\u8BF4\u660E\u3002"],
    ["mindmap-expand", "\u601D\u7EF4\u5BFC\u56FE\u6269\u6563", "\u8BB2\u89E3", "mind-map", '[data-motion="item"]', "\u4E3B\u6982\u5FF5\u7A33\u5B9A\uFF0C\u7EBF\u6761\u548C\u5206\u652F\u4ECE\u5185\u5411\u5916\u663E\u73B0\u3002"],
    ["step-track", "\u6B65\u9AA4\u72B6\u6001\u63A8\u8FDB", "\u8BB2\u89E3", "process-steps", ".edx-steps article", "\u8BFB\u5B8C\u5F53\u524D\u6B65\u9AA4\u540E\u8F6C\u79FB\u5F3A\u8C03\uFF0C\u5E76\u9010\u6B65\u63ED\u793A\u7ED3\u679C\u3002"],
    ["pan-scan", "\u6A2A\u5411\u9605\u8BFB\u955C\u5934", "\u955C\u5934", "code-editor", ".motion-wrap", "\u8F7B\u5FAE\u653E\u5927\u540E\u6A2A\u5411\u626B\u63CF\uFF0C\u9002\u5408\u5BBD\u754C\u9762\u7684\u9605\u8BFB\u3002"],
    ["dolly-out", "\u62C9\u8FDC\u5EFA\u7ACB\u5168\u5C40", "\u955C\u5934", "architecture-map", ".motion-wrap", "\u4ECE\u5C40\u90E8\u7EC6\u8282\u62C9\u8FDC\uFF0C\u5C55\u793A\u5B8C\u6574\u7ED3\u6784\u3002"],
    ["focus-return", "\u63A8\u8FD1\u540E\u56DE\u5230\u5168\u666F", "\u955C\u5934", "mac-system-settings", '[data-motion="focus"]', "\u56F4\u7ED5\u4E00\u4E2A\u63A7\u4EF6\u63A8\u8FD1\u505C\u7559\uFF0C\u518D\u56DE\u5230\u5B8C\u6574\u7A97\u53E3\u3002"],
    ["focus-hop-camera", "\u4E24\u5904\u91CD\u70B9\u5207\u6362", "\u955C\u5934", "formula-breakdown", '[data-motion="focus"]', "\u955C\u5934\u5728\u4E24\u4E2A\u76EE\u6807\u95F4\u5E73\u6ED1\u79FB\u4F4D\uFF0C\u907F\u514D\u7A81\u5140\u8DF3\u5207\u3002"],
    ["tilt-settle", "\u8F7B\u900F\u89C6\u6276\u6B63", "\u955C\u5934", "mac-finder", ".motion-wrap", "\u7A97\u53E3\u5E26\u5FAE\u5C0F\u900F\u89C6\u8FDB\u5165\uFF0C\u8FC5\u901F\u56DE\u5230\u53EF\u8BFB\u6B63\u89C6\u56FE\u3002"],
    ["parallax-depth", "\u524D\u540E\u5C42\u89C6\u5DEE", "\u955C\u5934", "layer-stack", '[data-motion="item"]', "\u4E0D\u540C\u5C42\u4EE5\u4E0D\u540C\u4F4D\u79FB\u901F\u5EA6\u63ED\u793A\u6DF1\u5EA6\u5173\u7CFB\u3002"],
    ["frame-push", "\u6846\u5185\u7F13\u6162\u63A8\u8FDB", "\u955C\u5934", "lecture-stage", ".edx-lesson-media", "\u53EA\u63A8\u8FDB\u8BFE\u4EF6\u7D20\u6750\uFF0C\u8FB9\u6846\u4E0E\u80CC\u666F\u4FDD\u6301\u7A33\u5B9A\u3002"],
    ["dolly-diagonal", "\u659C\u5411\u7F13\u6162\u53D6\u666F", "\u955C\u5934", "media-stage", ".edu-media-canvas > *", "\u5728\u7D20\u6750\u6846\u5185\u6CBF\u5BF9\u89D2\u7EBF\u8F7B\u63A8\uFF0C\u6807\u9898\u4E0D\u53C2\u4E0E\u79FB\u52A8\u3002"],
    ["donut-draw", "\u73AF\u5F62\u6BD4\u4F8B\u7ED8\u5236", "\u6570\u636E", "donut-chart", '[data-motion="segment"]', "\u5404\u6BB5\u6CBF\u5706\u5468\u63ED\u793A\uFF0C\u6700\u7EC8\u89D2\u5EA6\u4FDD\u6301\u539F\u59CB\u5360\u6BD4\u3002"],
    ["scatter-pop", "\u6563\u70B9\u843D\u4F4D", "\u6570\u636E", "scatter-plot", '[data-motion="point"]', "\u6570\u636E\u70B9\u6309\u987A\u5E8F\u843D\u5728\u771F\u5B9E\u5750\u6807\u3002"],
    ["heatmap-scan", "\u70ED\u529B\u6570\u636E\u626B\u63CF", "\u6570\u636E", "heatmap", '[data-motion="cell"]', "\u4ECE\u5DE6\u4E0A\u5230\u53F3\u4E0B\u5448\u73B0\u5355\u5143\u683C\u8272\u9636\u3002"],
    ["funnel-reveal", "\u6F0F\u6597\u9010\u5C42\u8F6C\u5316", "\u6570\u636E", "funnel-chart", '[data-motion="item"]', "\u5404\u5C42\u6309\u8F6C\u5316\u987A\u5E8F\u5C55\u5F00\uFF0C\u4FDD\u7559\u5C42\u7EA7\u6570\u503C\u3002"],
    ["radar-expand", "\u96F7\u8FBE\u8F6E\u5ED3\u5EFA\u7ACB", "\u6570\u636E", "radar-chart", '[data-motion="radar"]', "\u7EF4\u5EA6\u8F6E\u5ED3\u4ECE\u4E2D\u5FC3\u5411\u914D\u7F6E\u5206\u503C\u5C55\u5F00\u3002"],
    ["chart-bars-cascade", "\u65F6\u95F4\u533A\u95F4\u5C55\u5F00", "\u6570\u636E", "roadmap", '[data-motion="bar"]', "\u65F6\u95F4\u533A\u95F4\u4ECE\u5404\u81EA\u8D77\u70B9\u6C34\u5E73\u5C55\u5F00\u3002"],
    ["fade-out", "\u67D4\u548C\u6DE1\u51FA", "\u9000\u573A", "codex-chat", ".motion-wrap", "\u4FDD\u7559\u9605\u8BFB\u65F6\u95F4\u540E\u6E10\u9690\u3002"],
    ["slide-out-left", "\u5411\u5DE6\u6ED1\u51FA", "\u9000\u573A", "mac-finder", ".motion-wrap", "\u754C\u9762\u6CBF\u6C34\u5E73\u65B9\u5411\u79BB\u5F00\u753B\u9762\u3002"],
    ["lift-away", "\u5411\u4E0A\u79BB\u573A", "\u9000\u573A", "chapter-summary", ".motion-wrap", "\u5185\u5BB9\u5148\u8F7B\u63D0\uFF0C\u518D\u5411\u4E0A\u9000\u51FA\u3002"],
    ["shrink-center", "\u7F29\u5411\u4E2D\u5FC3", "\u9000\u573A", "mac-alert", ".motion-wrap", "\u56F4\u7ED5\u4E2D\u5FC3\u6536\u7F29\u5E76\u6D88\u9690\u3002"],
    ["iris-close", "\u5706\u5F62\u6536\u5E55", "\u9000\u573A", "definition-card", ".motion-wrap", "\u5706\u5F62\u906E\u7F69\u5411\u4E2D\u5FC3\u6536\u62E2\u3002"],
    ["mask-retract", "\u4ECE\u53F3\u5411\u5DE6\u6536\u56DE", "\u9000\u573A", "chrome-browser", ".motion-wrap", "\u7528\u88C1\u5207\u8FB9\u754C\u6536\u56DE\u7A97\u53E3\u3002"],
    ["stagger-out", "\u5185\u5BB9\u4F9D\u6B21\u79BB\u573A", "\u9000\u573A", "kanban-board", '[data-motion="item"]', "\u5361\u7247\u6309\u9605\u8BFB\u987A\u5E8F\u9010\u5F20\u6DE1\u51FA\u79FB\u8D70\u3002"],
    ["blur-out", "\u6563\u7126\u79BB\u573A", "\u9000\u573A", "mac-safari", ".motion-wrap", "\u753B\u9762\u77ED\u6682\u6563\u7126\u5E76\u6D88\u9690\u3002"],
    ["split-away", "\u5DE6\u53F3\u5206\u79BB\u9000\u573A", "\u9000\u573A", "chapter-summary", ".motion-wrap", "\u5185\u5BB9\u5206\u6210\u4E24\u534A\u5411\u4E24\u4FA7\u79BB\u5F00\u3002"],
    ["success-toast", "\u64CD\u4F5C\u6210\u529F\u63D0\u793A", "\u53CD\u9988", "mac-finder", ".motion-wrap", "\u9876\u90E8\u77ED\u901A\u77E5\u8FDB\u5165\u3001\u505C\u7559\u5E76\u9000\u51FA\u3002"],
    ["save-pulse", "\u4FDD\u5B58\u72B6\u6001\u8109\u51B2", "\u53CD\u9988", "mac-notes", ".motion-wrap", "\u5C40\u90E8\u72B6\u6001\u5FBD\u8BB0\u8F7B\u70B9\u4EAE\uFF0C\u663E\u793A\u5DF2\u4FDD\u5B58\u3002"],
    ["copy-confirm", "\u590D\u5236\u786E\u8BA4", "\u53CD\u9988", "code-editor", '[data-motion="focus"]', "\u5728\u76EE\u6807\u65C1\u51FA\u73B0\u5DF2\u590D\u5236\u6807\u7B7E\uFF0C\u518D\u6536\u8D77\u3002"],
    ["loading-resolve", "\u7B49\u5F85\u5230\u5B8C\u6210", "\u53CD\u9988", "mac-file-dialog", ".motion-wrap", "\u6709\u9650\u7684\u7B49\u5F85\u65CB\u8F6C\u540E\u53D8\u4E3A\u5B8C\u6210\u52FE\u3002"],
    ["warning-breathe", "\u6CE8\u610F\u4E8B\u9879\u63D0\u793A", "\u53CD\u9988", "settings-panel", '[data-motion="focus"]', "\u76EE\u6807\u8FB9\u7F18\u505A\u4E24\u6B21\u8F7B\u5FAE\u63D0\u793A\u540E\u4FDD\u6301\u3002"],
    ["notification-ping", "\u901A\u77E5\u63D0\u793A\u5708", "\u53CD\u9988", "mac-notification-center", ".ap-notification", "\u65B0\u901A\u77E5\u65C1\u7684\u5C0F\u578B\u63D0\u793A\u5708\u6269\u6563\u540E\u6D88\u5931\u3002"],
    ["soft-confetti", "\u514B\u5236\u7684\u5B8C\u6210\u7C92\u5B50", "\u53CD\u9988", "chapter-summary", ".motion-wrap", "\u5C11\u91CF\u84DD\u8272\u4E0E\u8584\u8377\u8272\u7EB8\u7247\u77ED\u6682\u6563\u5F00\u3002"],
    ["curve-ribbon", "\u4E09\u5C42\u5F27\u5E26\u8F6C\u573A", "\u8F6C\u573A", "lecture-stage", ".motion-wrap", "\u5F27\u5F62\u524D\u7F18\u5206\u4E09\u5C42\u8D8A\u8FC7\u753B\u9762\uFF0C\u5728\u906E\u6EE1\u65F6\u5207\u6362\u5185\u5BB9\u3002"],
    ["diagonal-ribbon", "\u659C\u5411\u5706\u89D2\u5E26\u8F6C\u573A", "\u8F6C\u573A", "lecture-stage", ".motion-wrap", "\u4E09\u5C42\u659C\u5411\u5706\u89D2\u906E\u5E45\u63A5\u529B\uFF0C\u63A5\u7EED\u540E\u4FDD\u6301\u65B0\u753B\u9762\u3002"],
    ["shared-slide", "\u540C\u573A\u6A2A\u79FB\u4EA4\u63A5", "\u8F6C\u573A", "lecture-stage", ".motion-wrap", "\u76F8\u90BB\u5185\u5BB9\u6CBF\u540C\u4E00\u80CC\u666F\u6ED1\u52A8\u4EA4\u63A5\u3002"],
    ["soft-dissolve", "\u67D4\u7126\u4EA4\u53E0", "\u8F6C\u573A", "lecture-stage", ".motion-wrap", "\u65E7\u753B\u9762\u8F7B\u5FAE\u6563\u7126\uFF0C\u65B0\u753B\u9762\u540C\u6B65\u6E05\u6670\u663E\u73B0\u3002"],
    ["zoom-through", "\u63A8\u8FD1\u7A7F\u8D8A", "\u8F6C\u573A", "lecture-stage", ".motion-wrap", "\u4EE5\u8FDE\u7EED\u7F29\u653E\u548C\u77ED\u4EA4\u53E0\u5B8C\u6210\u5185\u5BB9\u63A5\u7EED\u3002"],
    ["card-lift", "\u5361\u7247\u62AC\u8D77\u6362\u9875", "\u8F6C\u573A", "lecture-stage", ".motion-wrap", "\u65E7\u5185\u5BB9\u5982\u7EB8\u5361\u79BB\u5F00\uFF0C\u65B0\u5185\u5BB9\u5728\u4E0B\u5C42\u663E\u9732\u3002"],
    ["blinds-swap", "\u5206\u680F\u63A5\u529B\u6362\u9875", "\u8F6C\u573A", "lecture-stage", ".motion-wrap", "\u516D\u6761\u906E\u7F69\u4F9D\u6B21\u63ED\u5F00\u65B0\u5185\u5BB9\uFF0C\u4FDD\u7559\u65B9\u5411\u8282\u594F\u3002"],
    ["liquid-sweep", "\u67D4\u66F2\u7EBF\u626B\u8FC7", "\u8F6C\u573A", "lecture-stage", ".motion-wrap", "\u67D4\u548C\u66F2\u7EBF\u524D\u7F18\u6A2A\u8D8A\u4E24\u5E45\u753B\u9762\uFF0C\u9002\u5408\u7AE0\u8282\u5F3A\u8C03\u3002"],
    ["grid-drift", "\u7EC6\u7F51\u683C\u7F13\u79FB", "\u80CC\u666F", "lecture-stage", '[data-motion="background"]', "\u4E8C\u7EF4\u7EC6\u7F51\u683C\u7F13\u6162\u5E73\u79FB\uFF1B\u6B63\u6587\u548C\u8FB9\u6846\u7A33\u5B9A\u3002"],
    ["perspective-scroll", "\u900F\u89C6\u7F51\u683C\u6EDA\u52A8", "\u80CC\u666F", "lecture-stage", '[data-motion="background"]', "\u56FA\u5B9A\u900F\u89C6\u7EB5\u7EBF\uFF0C\u6A2A\u5411\u7F51\u683C\u7EBF\u7531\u4E0B\u5411\u4E0A\u5FAA\u73AF\uFF0C\u94FA\u6EE1\u80CC\u666F\u3002"],
    ["dot-drift", "\u7EC6\u70B9\u9635\u6F02\u79FB", "\u80CC\u666F", "lecture-stage", '[data-motion="background"]', "\u6DE1\u84DD\u8272\u70B9\u9635\u4EE5\u5300\u901F\u5BF9\u89D2\u7EBF\u79FB\u52A8\u3002"],
    ["orb-parallax", "\u8FB9\u89D2\u5706\u5F62\u89C6\u5DEE", "\u80CC\u666F", "lecture-stage", '[data-motion="background"]', "\u8FB9\u89D2\u5706\u5F62\u4EE5\u4E0D\u540C\u901F\u5EA6\u7F13\u79FB\uFF0C\u907F\u5F00\u6B63\u6587\u3002"],
    ["contour-flow", "\u7B49\u9AD8\u66F2\u7EBF\u6D41\u52A8", "\u80CC\u666F", "lecture-stage", '[data-motion="background"]', "\u4F4E\u5BF9\u6BD4\u66F2\u7EBF\u7F13\u7F13\u6D41\u8FC7\u7A7A\u767D\u533A\u3002"],
    ["diagonal-hatch", "\u659C\u7EB9\u80CC\u666F\u6ED1\u52A8", "\u80CC\u666F", "lecture-stage", '[data-motion="background"]', "\u7EC6\u659C\u7EBF\u4EE5\u4F4E\u901F\u79FB\u52A8\uFF0C\u7ED9\u7559\u767D\u589E\u52A0\u65B9\u5411\u611F\u3002"],
    ["ring-orbit", "\u73AF\u5F62\u8F68\u9053\u6F02\u79FB", "\u80CC\u666F", "lecture-stage", '[data-motion="background"]', "\u8FB9\u89D2\u7EC6\u5706\u73AF\u4F4E\u901F\u65CB\u8F6C\uFF0C\u4FDD\u6301\u6B63\u6587\u7A33\u5B9A\u3002"],
    ["blueprint-pan", "\u84DD\u56FE\u5750\u6807\u5E73\u79FB", "\u80CC\u666F", "lecture-stage", '[data-motion="background"]', "\u5927\u5C0F\u7F51\u683C\u4E0E\u5341\u5B57\u5750\u6807\u5171\u540C\u7F13\u79FB\u3002"],
    ["wave-bands", "\u67D4\u548C\u6CE2\u5E26\u6D41\u52A8", "\u80CC\u666F", "lecture-stage", '[data-motion="background"]', "\u84DD\u8272\u4E0E\u8584\u8377\u8272\u534A\u900F\u660E\u6CE2\u5E26\u5728\u8FB9\u7F18\u6D41\u8FC7\u3002"],
    ["ambient-breath", "\u6DE1\u8272\u5149\u6655\u547C\u5438", "\u80CC\u666F", "lecture-stage", '[data-motion="background"]', "\u5927\u8303\u56F4\u6DE1\u8272\u5149\u6655\u7F13\u6162\u6536\u653E\uFF0C\u4FDD\u7559\u767D\u8272\u57FA\u5E95\u3002"]
  ];
  var cuesFor = (id, category) => {
    if (category === "\u80CC\u666F") return [];
    if (category === "\u8F6C\u573A") return [{ sound: "whoosh", at: 2.1, gain: 0.24, duration: 0.7 }];
    if (category === "\u9000\u573A") return [{ sound: "whoosh-short", at: 3.3, gain: 0.22, duration: 0.6 }];
    if (category === "\u53CD\u9988") return [{ sound: id === "warning-breathe" ? "ping" : id === "loading-resolve" ? "chime" : "notification", at: id === "loading-resolve" ? 2.35 : 0.7, gain: 0.2 }];
    if (id === "drag-drop") return [{ sound: "click", at: 0.65, gain: 0.2 }, { sound: "pop", at: 1.9, gain: 0.15 }];
    if (category === "\u64CD\u4F5C") return id === "text-select" ? [{ sound: "click-soft", at: 0.6, gain: 0.2 }, { sound: "click", at: 1.65, gain: 0.22 }] : [{ sound: "click", at: 0.65, gain: 0.2 }, { sound: "pop", at: 1.6, gain: 0.15 }];
    if (category === "\u6570\u636E") return [{ sound: "riser", at: 0.6, gain: 0.16, duration: 1.5 }, { sound: "ping", at: 2.3, gain: 0.18 }];
    if (category === "\u955C\u5934") return [{ sound: "whoosh", at: 0.6, gain: 0.1, duration: 1.15 }];
    return [{ sound: category === "\u6807\u6CE8" ? "ping" : "whoosh-short", at: 0.6, gain: 0.19, duration: 0.55 }];
  };
  var expandedEffects = rows2.map(([id, name, category, component2, selector, description]) => ({ id, name, category, component: component2, selector, description, duration: 8, previewTime: category === "\u8F6C\u573A" ? 2.28 : category === "\u9000\u573A" ? 3.6 : category === "\u80CC\u666F" ? 3.5 : 1.4, cueHints: cuesFor(id, category), silent: category === "\u80CC\u666F" }));
  function extendMotion(gsap, root, id, options, tl) {
    const wrap3 = root.querySelector(".motion-wrap") || root, start = Number(options.start ?? 0.6), W = root.clientWidth, H = root.clientHeight;
    const choose = (s2) => [...root.querySelectorAll(options.selector || s2)];
    const box2 = (e2) => {
      const a2 = e2.getBoundingClientRect(), b2 = root.getBoundingClientRect();
      return { x: a2.x - b2.x, y: a2.y - b2.y, w: a2.width, h: a2.height };
    };
    const make7 = (css5, html = "", parent = root) => {
      const e2 = document.createElement("div");
      e2.dataset.generatedEffect = id;
      e2.style.cssText = css5;
      e2.innerHTML = html;
      parent.append(e2);
      return e2;
    };
    const overlay = () => {
      const e2 = make7("position:absolute;inset:0;z-index:900;pointer-events:none");
      e2.className = "fx-layer";
      return e2;
    };
    const frame2 = (b2, color5 = "#2563eb") => make7(`position:absolute;left:${b2.x - 6}px;top:${b2.y - 6}px;width:${b2.w + 12}px;height:${b2.h + 12}px;border:2px solid ${color5};border-radius:8px;transform-origin:0 0`, "", overlay());
    const items = (s2 = '[data-motion="item"]') => {
      const a2 = choose(s2);
      return a2.length ? a2 : [wrap3];
    };
    const draw = (el, at2, duration = 0.8) => {
      if (el.getTotalLength) {
        const length = el.getTotalLength();
        tl.fromTo(el, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration, ease: "power2.inOut" }, at2);
      }
    };
    let targets = [];
    if (id === "scale-settle") {
      targets = [wrap3];
      tl.fromTo(wrap3, { scale: 0.93, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.85, ease: "back.out(1.1)" }, start);
    }
    if (id === "curtain-open") {
      targets = [wrap3];
      tl.fromTo(wrap3, { clipPath: "inset(0 50% 0 50%)" }, { clipPath: "inset(0 0% 0 0%)", duration: 1.15, ease: "power3.inOut" }, start);
    }
    if (id === "blur-resolve") {
      targets = [wrap3];
      tl.fromTo(wrap3, { opacity: 0, filter: "blur(12px)", scale: 1.025 }, { opacity: 1, filter: "blur(0px)", scale: 1, duration: 1, ease: "power2.out" }, start);
    }
    if (id === "mask-rise") {
      targets = [wrap3];
      tl.fromTo(wrap3, { clipPath: "inset(74% 6% 6% 6% round 14px)", y: 35 }, { clipPath: "inset(0% 0% 0% 0% round 0px)", y: 0, duration: 1, ease: "power3.out" }, start);
    }
    if (id === "cards-deal") {
      targets = items(".edx-board article");
      targets.forEach((e2, i) => tl.fromTo(e2, { x: -45, y: 40, rotation: -6, opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.65, ease: "power3.out" }, start + i * 0.13));
    }
    if (id === "center-stagger") {
      targets = items();
      targets.forEach((e2, i) => {
        const b2 = box2(e2);
        tl.fromTo(e2, { x: (W / 2 - b2.x - b2.w / 2) * 0.38, y: (H / 2 - b2.y - b2.h / 2) * 0.38, scale: 0.75, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.75, ease: "power3.out" }, start + i * 0.12);
      });
      const lines3 = choose('[data-motion="line"]');
      tl.fromTo(lines3, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.12 }, start + 0.65);
    }
    if (id === "border-assemble") {
      targets = items(".edx-lesson-shell");
      const b2 = box2(targets[0]), l = overlay();
      const s2 = make7(`position:absolute;left:${b2.x}px;top:${b2.y}px;width:${b2.w}px;height:${b2.h}px`, `<svg width="100%" height="100%" viewBox="0 0 ${b2.w} ${b2.h}"><rect x="2" y="2" width="${b2.w - 4}" height="${b2.h - 4}" rx="25" fill="none" stroke="#2563eb" stroke-width="2"/></svg>`, l);
      draw(s2.querySelector("rect"), start, 0.9);
      tl.fromTo(targets, { opacity: 0 }, { opacity: 1, duration: 0.5 }, start + 0.55);
      tl.to(s2, { opacity: 0, duration: 0.3 }, start + 1.1);
    }
    if (id === "toggle-switch") {
      targets = items(".am-switch").slice(0, 1);
      const e2 = targets[0];
      e2.style.setProperty("--knob-x", "0px");
      e2.classList.add("fx-toggle");
      const style = document.createElement("style");
      style.textContent = ".fx-toggle:after{margin-left:0!important;transform:translateX(var(--knob-x))}";
      root.append(style);
      tl.fromTo(e2, { backgroundColor: "#e5e5ea", "--knob-x": "0px" }, { backgroundColor: "#34c759", "--knob-x": "17px", duration: 0.3, ease: "power2.inOut" }, start);
    }
    if (id === "drag-drop") {
      targets = items(".edx-board article").slice(0, 1);
      const e2 = targets[0], b2 = box2(e2), cols = choose(".edx-board>section"), from = e2.closest("section"), last = cols.at(-1), r = box2(last), destCards = [...last.querySelectorAll("article")];
      if (from === last || destCards.length > 1) throw Error("\u4EFB\u52A1\u62D6\u653E\u9700\u8981\u6E90\u5217\u4E0E\u76EE\u6807\u5217\u4E0D\u540C\uFF0C\u4E14\u76EE\u6807\u5217\u6700\u591A\u5DF2\u6709\u4E00\u5F20\u5361");
      const lastCard = destCards.at(-1), destY = lastCard ? box2(lastCard).y + box2(lastCard).h + 14 : box2(last.querySelector("h2")).y + box2(last.querySelector("h2")).h + 20, dx = r.x + 19 - b2.x, dy = destY - b2.y;
      gsap.set(e2, { zIndex: 20, position: "relative" });
      tl.to(e2, { scale: 1.03, boxShadow: "0 15px 28px #20426a30", rotation: -2, duration: 0.2 }, start);
      tl.to(e2, { x: dx * 0.5, y: Math.min(0, dy) - 45, rotation: 1, duration: 0.55, ease: "power2.in" }, start + 0.2);
      tl.to(e2, { x: dx, y: dy, rotation: 0, duration: 0.55, ease: "power2.out" }, start + 0.75);
      tl.to(e2, { scale: 1, boxShadow: "0 3px 9px #19365705", duration: 0.22 }, start + 1.3);
      const remaining = [...from.querySelectorAll("article")].filter((x) => x !== e2);
      tl.to(remaining, { y: -b2.h - 14, duration: 0.35, ease: "power2.inOut" }, start + 0.65);
      tl.set(from.querySelector("small"), { textContent: String(remaining.length) }, start + 1.3);
      tl.set(last.querySelector("small"), { textContent: String(destCards.length + 1) }, start + 1.3);
    }
    if (id === "text-select") {
      targets = items('[data-motion="type"]').slice(0, 1);
      const b2 = box2(targets[0]), l = overlay(), m = make7(`position:absolute;left:${b2.x}px;top:${b2.y}px;width:${b2.w}px;height:${b2.h}px;background:#2776d63d;transform-origin:left center`, "", l), cursor = make7(`position:absolute;left:${b2.x}px;top:${b2.y - 2}px;height:${b2.h + 4}px;width:1px;background:#265aa0`, "", l);
      tl.fromTo(m, { scaleX: 0 }, { scaleX: 1, duration: 1.05, ease: "none" }, start);
      tl.fromTo(cursor, { x: 0, opacity: 0 }, { x: b2.w, opacity: 1, duration: 1.05, ease: "none" }, start);
      tl.to(cursor, { opacity: 0, duration: 0.1 }, start + 1.08);
    }
    if (id === "slider-drag") {
      targets = items(".ap-control-slider i").slice(0, 1);
      targets.forEach((e2) => {
        const width = e2.style.width || "65%";
        tl.fromTo(e2, { width: "12%" }, { width, duration: 1.05, ease: "power2.inOut" }, start);
      });
    }
    if (id === "dashed-frame") {
      targets = items(".edx-lesson-shell");
      const b2 = box2(targets[0]), l = overlay();
      const f = make7(`position:absolute;left:${b2.x}px;top:${b2.y}px;width:${b2.w}px;height:${b2.h}px;border:3px dashed #2563eb;border-radius:25px`, "", l);
      tl.fromTo(f, { clipPath: "inset(0 100% 0 0)", opacity: 0 }, { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1.15, ease: "power2.inOut" }, start);
    }
    if (id === "corner-brackets") {
      targets = items('[data-motion="focus"]').slice(0, 1);
      const b2 = box2(targets[0]), l = overlay();
      [[b2.x - 7, b2.y - 7, 1, 1], [b2.x + b2.w - 15, b2.y - 7, -1, 1], [b2.x - 7, b2.y + b2.h - 15, 1, -1], [b2.x + b2.w - 15, b2.y + b2.h - 15, -1, -1]].forEach(([x, y, sx, sy], i) => {
        const e2 = make7(`position:absolute;left:${x}px;top:${y}px;width:22px;height:22px;border-${sy > 0 ? "top" : "bottom"}:3px solid #2563eb;border-${sx > 0 ? "left" : "right"}:3px solid #2563eb`, "", l);
        tl.fromTo(e2, { x: -sx * 15, y: -sy * 15, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, start + i * 0.055);
      });
    }
    if (id === "callout-pin") {
      targets = items('[data-motion="highlight"]').slice(0, 1);
      const field = targets[0], path2 = root.querySelector('.edu-callout-lines [data-motion="line"]'), note = root.querySelector(".edu-callout-notes article"), pin = field.querySelector("i");
      if (!path2 || !note || !pin) throw Error("\u5F15\u7EBF\u6807\u6CE8\u9700\u8981 annotation-callout \u7684\u771F\u5B9E\u951A\u70B9\u3001\u5F15\u7EBF\u548C\u8BF4\u660E\u5361");
      const length = path2.getTotalLength();
      tl.fromTo(path2, { strokeDasharray: length, strokeDashoffset: -length, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.75, ease: "power2.inOut" }, start + 0.2);
      tl.fromTo(pin, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(1.4)" }, start);
      tl.fromTo(note, { x: 12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, start + 0.75);
      if (options.label) note.querySelector("h3").textContent = options.label;
    }
    if (id === "number-tags") {
      targets = items().slice(0, 7);
      const l = overlay();
      targets.forEach((e2, i) => {
        const b2 = box2(e2), tag2 = make7(`position:absolute;left:${Math.max(8, b2.x - 11)}px;top:${Math.max(8, b2.y - 13)}px;width:29px;height:29px;border-radius:50%;background:#2563eb;border:2px solid #fff;color:white;display:grid;place-items:center;font:14px ComponentMono`, String(i + 1), l);
        tl.fromTo(tag2, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.38, ease: "back.out(1.4)" }, start + i * 0.42);
      });
    }
    if (id === "branch-reveal" || id === "mindmap-expand") {
      const lines3 = choose('[data-motion="line"]'), nodes = items();
      targets = [...lines3, ...nodes];
      lines3.forEach((e2, i) => draw(e2, start + 0.3 + i * 0.15, 1.05));
      nodes.forEach((e2, i) => tl.fromTo(e2, { opacity: 0, scale: id === "mindmap-expand" ? 0.92 : 1, transformOrigin: "center center" }, { opacity: 1, scale: 1, duration: 0.4 }, start + (i === 0 ? 0 : 0.75 + i * 0.2)));
      if (id === "branch-reveal") tl.fromTo(choose(".edx-svg > text"), { opacity: 0 }, { opacity: 1, duration: 0.35, stagger: 0.16 }, start + 0.8);
    }
    if (id === "orbit-steps") {
      targets = items();
      const svg3 = root.querySelector(".edx-svg"), lines3 = choose('[data-motion="line"]'), NS = "http://www.w3.org/2000/svg";
      const path2 = document.createElementNS(NS, "path");
      path2.setAttribute("d", lines3.map((p, i) => p.getAttribute("d").replace(/^M/, i ? "L" : "M")).join(" ") + "Z");
      path2.setAttribute("fill", "none");
      path2.setAttribute("stroke", "none");
      svg3.insertBefore(path2, svg3.querySelector('[data-motion="item"]'));
      const dot = document.createElementNS(NS, "circle");
      dot.setAttribute("r", "6");
      dot.setAttribute("fill", "#2563eb");
      svg3.insertBefore(dot, svg3.querySelector('[data-motion="item"]'));
      const length = path2.getTotalLength(), state3 = { progress: 0 }, move = () => {
        const p = path2.getPointAtLength(state3.progress * length);
        dot.setAttribute("cx", p.x);
        dot.setAttribute("cy", p.y);
      };
      move();
      gsap.set(dot, { opacity: 0 });
      tl.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.2 }, start);
      tl.fromTo(state3, { progress: 0 }, { progress: 1, duration: 4.8, ease: "none", onUpdate: move }, start);
    }
    if (id === "compare-sweep") {
      targets = items('[data-motion="reveal"]');
      const b2 = box2(targets[0]), l = overlay(), line3 = make7(`position:absolute;left:${b2.x}px;top:${b2.y}px;width:3px;height:${b2.h}px;background:#2563eb;box-shadow:0 0 10px #2563eb30`, "", l);
      tl.fromTo(targets, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 2.4, ease: "power2.inOut" }, start);
      tl.fromTo(line3, { x: 0, opacity: 0 }, { x: b2.w, opacity: 1, duration: 2.4, ease: "power2.inOut" }, start);
      tl.to(line3, { opacity: 0, duration: 0.2 }, start + 2.4);
    }
    if (id === "equation-build") {
      targets = items(".edx-formula article");
      targets.forEach((e2, i) => tl.fromTo(e2, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, start + i * 0.85));
      choose(".edx-formula>span").forEach((e2, i) => tl.fromTo(e2, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35 }, start + 0.55 + i * 0.85));
    }
    if (id === "pyramid-build") {
      targets = items().reverse();
      tl.fromTo(targets, { y: 22, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.42, duration: 0.55, ease: "power2.out" }, start);
    }
    if (id === "step-track") {
      targets = items(".edx-steps article");
      targets.forEach((e2, i) => {
        tl.to(e2, { borderColor: "#2563eb", backgroundColor: "#eaf2ff", duration: 0.25 }, start + i * 1.2);
        if (i < targets.length - 1) tl.to(e2, { borderColor: "#dae6f4", backgroundColor: "#f5f8fd", duration: 0.25 }, start + (i + 1) * 1.2);
        const r = e2.querySelector(".edx-step-result");
        if (r) tl.fromTo(r, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, start + i * 1.2 + 0.45);
      });
    }
    const focus = (e2, scale) => {
      const b2 = box2(e2);
      return { scale, x: (W / 2 - b2.x - b2.w / 2) * scale, y: (H / 2 - b2.y - b2.h / 2) * scale };
    };
    if (id === "pan-scan") {
      targets = [wrap3];
      tl.fromTo(wrap3, { scale: 1.12, x: 60 }, { scale: 1.12, x: -60, duration: 5.3, ease: "sine.inOut" }, start);
    }
    if (id === "dolly-out") {
      targets = [wrap3];
      tl.fromTo(wrap3, { scale: 1.42, x: 0, y: 60 }, { scale: 1, x: 0, y: 0, duration: 1.8, ease: "power3.inOut" }, start);
    }
    if (id === "focus-return" || id === "focus-hop-camera") {
      targets = items('[data-motion="focus"]');
      const a2 = focus(targets[0], 1.25);
      tl.to(wrap3, { ...a2, duration: 1.15, ease: "power3.inOut" }, start);
      if (id === "focus-return") tl.to(wrap3, { scale: 1, x: 0, y: 0, duration: 1.2, ease: "power3.inOut" }, 4.5);
      else tl.to(wrap3, { ...focus(targets.at(-1), 1.25), duration: 1.3, ease: "power3.inOut" }, 3.3);
    }
    if (id === "tilt-settle") {
      targets = [wrap3];
      tl.fromTo(wrap3, { rotationY: -7, rotationX: 3, scale: 0.96, transformPerspective: 1300 }, { rotationY: 0, rotationX: 0, scale: 1, duration: 1.35, ease: "power3.out" }, start);
    }
    if (id === "parallax-depth") {
      targets = items();
      targets.forEach((e2, i) => tl.fromTo(e2, { x: (i % 3 - 1) * 30, y: (i % 3 - 1) * 12 }, { x: -(i % 3 - 1) * 30, y: -(i % 3 - 1) * 12, duration: 5.6, ease: "sine.inOut" }, start));
    }
    if (id === "frame-push") {
      targets = items(".edx-lesson-media");
      tl.fromTo(targets, { scale: 1 }, { scale: 1.075, duration: 6.6, ease: "sine.inOut", transformOrigin: "center center" }, start);
    }
    if (id === "dolly-diagonal") {
      targets = items(".edu-media-canvas > *");
      tl.fromTo(targets, { scale: 1.14, x: -22, y: 16 }, { scale: 1.22, x: 22, y: -16, duration: 6, ease: "sine.inOut", transformOrigin: "center center" }, start);
    }
    if (id === "donut-draw") {
      targets = items('[data-motion="segment"]');
      targets.forEach((e2, i) => {
        const original = e2.getAttribute("stroke-dasharray"), len = Number(original.split(" ")[0]);
        tl.fromTo(e2, { strokeDasharray: `0 ${942.4778}` }, { strokeDasharray: `${len} ${942.4778}`, duration: 1.15, ease: "power2.out" }, start + i * 0.35);
      });
    }
    if (id === "scatter-pop") {
      targets = items('[data-motion="point"]');
      tl.fromTo(targets, { scale: 0, opacity: 0, transformOrigin: "center center" }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.12, ease: "back.out(1.4)" }, start);
    }
    if (id === "heatmap-scan") {
      targets = items('[data-motion="cell"]');
      tl.fromTo(targets, { opacity: 0.07 }, { opacity: 1, duration: 0.3, stagger: 0.05, ease: "sine.out" }, start);
    }
    if (id === "funnel-reveal") {
      targets = items();
      tl.fromTo(targets, { clipPath: "inset(0 50% 0 50%)", opacity: 0 }, { clipPath: "inset(0 0% 0 0%)", opacity: 1, duration: 0.65, stagger: 0.42, ease: "power2.inOut" }, start);
    }
    if (id === "radar-expand") {
      targets = items('[data-motion="radar"]');
      targets.forEach((e2) => {
        const end = e2.getAttribute("points"), zero = end.trim().split(/\s+/).map(() => "470,230").join(" ");
        tl.fromTo(e2, { attr: { points: zero } }, { attr: { points: end }, duration: 1.65, ease: "power2.out" }, start);
      });
      const points = choose('[data-motion="point"]');
      tl.fromTo(points, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.06 }, start + 1.4);
    }
    if (id === "chart-bars-cascade") {
      targets = items('[data-motion="bar"]');
      tl.fromTo(targets, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1, stagger: 0.35, ease: "power2.out" }, start);
    }
    const exits = ["fade-out", "slide-out-left", "lift-away", "shrink-center", "iris-close", "mask-retract", "stagger-out", "blur-out", "split-away"];
    if (exits.includes(id)) {
      const at2 = start + 2.7;
      targets = [wrap3];
      if (id === "fade-out") tl.to(wrap3, { opacity: 0, duration: 0.85 }, at2);
      if (id === "slide-out-left") {
        wrap3.style.willChange = "transform, opacity";
        tl.to(wrap3, { x: -W, opacity: 0.3, duration: 0.8, ease: "power3.in" }, at2);
      }
      if (id === "lift-away") tl.to(wrap3, { y: -H, scale: 0.97, duration: 0.85, ease: "power3.in" }, at2);
      if (id === "shrink-center") tl.to(wrap3, { scale: 0.65, opacity: 0, duration: 0.7, ease: "power3.in" }, at2);
      if (id === "iris-close") tl.fromTo(wrap3, { clipPath: "circle(75% at 50% 50%)" }, { clipPath: "circle(0% at 50% 50%)", duration: 0.85, ease: "power3.inOut" }, at2);
      if (id === "mask-retract") tl.fromTo(wrap3, { clipPath: "inset(0 0% 0 0)" }, { clipPath: "inset(0 100% 0 0)", duration: 0.8, ease: "power3.inOut" }, at2);
      if (id === "stagger-out") {
        targets = items();
        tl.to(targets, { opacity: 0, y: -20, duration: 0.4, stagger: 0.14, ease: "power2.in" }, at2);
      }
      if (id === "blur-out") {
        gsap.set(wrap3, { filter: "blur(0px)" });
        tl.to(wrap3, { filter: "blur(12px)", opacity: 0, scale: 1.03, duration: 0.8, ease: "power2.in" }, at2);
      }
      if (id === "split-away") {
        const clone2 = wrap3.cloneNode(true);
        clone2.querySelectorAll("[id]").forEach((e2) => e2.removeAttribute("id"));
        clone2.style.cssText = "position:absolute;inset:0;pointer-events:none";
        wrap3.parentNode.append(clone2);
        tl.set(wrap3, { clipPath: "inset(0 50% 0 0)" }, 0);
        tl.set(clone2, { clipPath: "inset(0 0 0 50%)" }, 0);
        tl.to(wrap3, { x: -W * 0.55, opacity: 0, duration: 0.8, ease: "power3.in" }, at2);
        tl.to(clone2, { x: W * 0.55, opacity: 0, duration: 0.8, ease: "power3.in" }, at2);
        targets.push(clone2);
      }
    }
    if (["success-toast", "save-pulse", "copy-confirm", "loading-resolve", "warning-breathe", "notification-ping", "soft-confetti"].includes(id)) {
      targets = items('[data-motion="focus"]').slice(0, 1);
      const l = overlay();
      if (id === "success-toast" || id === "save-pulse") {
        const save = id === "save-pulse", t = make7(`position:absolute;left:${save ? W - 236 : W / 2 - 120}px;top:${save ? 94 : 38}px;background:${save ? "#edf8f2" : "#fff"};border:1px solid #c7e2d6;border-radius:10px;padding:13px 18px;box-shadow:0 6px 20px #1f423718;color:#326c53;font-size:15px`, "", l);
        t.textContent = "\u2713\u3000" + (options.label || (save ? "\u5DF2\u4FDD\u5B58" : "\u64CD\u4F5C\u5DF2\u5B8C\u6210"));
        tl.fromTo(t, { opacity: 0, y: -12, scale: save ? 0.9 : 1 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }, start);
        if (save) tl.to(t, { scale: 1.035, duration: 0.22, repeat: 1, yoyo: true }, start + 0.4);
        else tl.to(t, { opacity: 0, y: -8, duration: 0.35 }, start + 2.6);
      }
      if (id === "copy-confirm") {
        const b2 = box2(targets[0]), tag2 = make7(`position:absolute;left:${Math.min(W - 145, b2.x + b2.w - 110)}px;top:${Math.max(12, b2.y - 39)}px;border-radius:7px;padding:8px 13px;background:#25364f;color:white;font-size:14px`, "\u2713 \u5DF2\u590D\u5236", l);
        tl.fromTo(tag2, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 }, start);
        tl.to(tag2, { opacity: 0, y: -4, duration: 0.3 }, start + 2);
      }
      if (id === "loading-resolve") {
        const t = make7(`position:absolute;left:${W / 2 - 95}px;top:${H / 2 - 32}px;width:190px;height:64px;border:1px solid #d7e3f3;border-radius:12px;background:white;box-shadow:0 10px 25px #24426622;display:flex;align-items:center;gap:14px;padding:17px;color:#356194;font-size:14px`, '<i style="width:23px;height:23px;border:2px solid #dce9fa;border-top-color:#2563eb;border-radius:50%"></i><span>\u6B63\u5728\u5904\u7406\u2026</span><b style="position:absolute;left:18px;color:#438967;opacity:0">\u2713</b>', l);
        tl.fromTo(t, { opacity: 0 }, { opacity: 1, duration: 0.2 }, start);
        tl.to(t.querySelector("i"), { rotation: 540, duration: 1.55, ease: "none" }, start);
        tl.to(t.querySelector("i"), { opacity: 0, duration: 0.1 }, start + 1.65);
        tl.to(t.querySelector("b"), { opacity: 1, duration: 0.15 }, start + 1.65);
        tl.set(t.querySelector("span"), { textContent: "\u5904\u7406\u5B8C\u6210" }, start + 1.65);
        tl.to(t, { opacity: 0, duration: 0.35 }, start + 3.4);
      }
      if (id === "warning-breathe") {
        const b2 = box2(targets[0]), f = frame2(b2, "#6686c5");
        tl.fromTo(f, { opacity: 0 }, { opacity: 1, duration: 0.3 }, start);
        tl.to(f, { scaleX: 1.02, scaleY: 1.04, opacity: 0.45, duration: 0.5, repeat: 3, yoyo: true, ease: "sine.inOut" }, start + 0.3);
      }
      if (id === "notification-ping") {
        targets = items(".ap-notification").slice(0, 1);
        const b2 = box2(targets[0]);
        for (let i = 0; i < 2; i++) {
          const e2 = make7(`position:absolute;left:${b2.x - 7}px;top:${b2.y + 9}px;width:15px;height:15px;border:2px solid #4c92d5;border-radius:50%`, "", l);
          tl.fromTo(e2, { scale: 0, opacity: 0 }, { scale: 2.7, opacity: 0.8, duration: 0.35 }, start + i * 0.2);
          tl.to(e2, { scale: 4, opacity: 0, duration: 0.6 }, start + 0.35 + i * 0.2);
        }
      }
      if (id === "soft-confetti") {
        for (let i = 0; i < 16; i++) {
          const e2 = make7(`position:absolute;left:${W * 0.5}px;top:${H * 0.34}px;width:${i % 2 ? 5 : 7}px;height:${i % 2 ? 12 : 7}px;border-radius:2px;background:${i % 2 ? "#81c9b0" : "#4980df"}`, "", l), a2 = i / 16 * Math.PI * 2;
          tl.fromTo(e2, { x: 0, y: 0, rotation: 0, opacity: 0 }, { x: Math.cos(a2) * 180, y: Math.sin(a2) * 105, rotation: i * 33, opacity: 0.8, duration: 0.65, ease: "power3.out" }, start);
          tl.to(e2, { y: Math.sin(a2) * 105 + 120, rotation: i * 33 + 90, opacity: 0, duration: 1.2, ease: "power2.in" }, start + 0.65);
        }
      }
    }
    const transitions = ["iris-reveal", "wipe-transition", "curve-ribbon", "diagonal-ribbon", "shared-slide", "soft-dissolve", "zoom-through", "card-lift", "blinds-swap", "liquid-sweep"];
    if (transitions.includes(id)) {
      const next = root.querySelector(".motion-next");
      if (!next) throw Error("\u8F6C\u573A\u9700\u8981 A/B \u4E24\u5E45\u5185\u5BB9\uFF0C\u8BF7\u901A\u8FC7 mountNext \u88C5\u914D");
      targets = [wrap3, next];
      const at2 = Number(options.transitionAt ?? 2.1), duration = Number(options.transitionDuration ?? 0.66);
      if (at2 < 0 || duration < 0.35 || at2 + duration > 7.8) throw Error("\u8F6C\u573A\u65F6\u70B9\u6216\u957F\u5EA6\u8D85\u51FA\u516B\u79D2\u6A21\u677F\u8303\u56F4");
      tl.set(next, { opacity: 0 }, 0);
      root.dataset.transitionStart = String(at2);
      root.dataset.transitionEnd = String(at2 + duration);
      root.dataset.transitionCut = String(at2 + duration * 0.5);
      if (id === "iris-reveal") {
        tl.set(next, { opacity: 1, clipPath: "circle(0% at 50% 50%)" }, at2);
        tl.to(next, { clipPath: "circle(75% at 50% 50%)", duration, ease: "power3.inOut" }, at2);
        tl.set(wrap3, { opacity: 0 }, at2 + duration);
      }
      if (id === "shared-slide") {
        const oldParts = [...wrap3.querySelectorAll(".edx-lesson-shell,.edx-lesson-caption")], nextBg = next.querySelector(".edx-ambient"), nextStage = next.querySelector(".edx-lecture");
        if (nextBg) nextBg.style.opacity = "0";
        if (nextStage) nextStage.style.background = "transparent";
        tl.set(next, { opacity: 1, x: W }, at2);
        tl.to(oldParts.length ? oldParts : wrap3, { x: -W, duration, ease: "power3.inOut" }, at2);
        tl.to(next, { x: 0, duration, ease: "power3.inOut" }, at2);
      }
      if (id === "soft-dissolve") {
        tl.to(wrap3, { opacity: 0, filter: "blur(5px)", duration, ease: "sine.inOut" }, at2);
        tl.fromTo(next, { opacity: 0, filter: "blur(5px)" }, { opacity: 1, filter: "blur(0px)", duration, ease: "sine.inOut" }, at2);
      }
      if (id === "zoom-through") {
        tl.to(wrap3, { scale: 1.28, opacity: 0, duration, ease: "power2.in" }, at2);
        tl.fromTo(next, { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration, ease: "power2.out" }, at2);
      }
      if (id === "card-lift") {
        tl.set(wrap3, { zIndex: 3, position: "relative" }, 0);
        tl.set(next, { opacity: 1, zIndex: 2 }, at2);
        tl.to(wrap3, { y: -H * 1.2, rotation: -5, scale: 0.97, duration, ease: "power3.in" }, at2);
        tl.fromTo(next, { scale: 0.97 }, { scale: 1, duration, ease: "power3.out" }, at2);
      }
      if (id === "blinds-swap") {
        const key = (root.closest("[data-composition-src]")?.id || root.dataset.compositionId || "gallery") + "-blind-mask";
        const defs2 = make7("position:absolute;width:0;height:0;overflow:hidden", `<svg width="0" height="0"><defs><clipPath id="${key}" clipPathUnits="userSpaceOnUse">${Array.from({ length: 6 }, (_, i) => `<rect x="${i * W / 6}" y="0" width="${W / 6 + 0.5}" height="0"/>`).join("")}</clipPath></defs></svg>`);
        tl.set(next, { opacity: 1, clipPath: `url(#${key})` }, at2);
        [...defs2.querySelectorAll("rect")].forEach((r, i) => tl.fromTo(r, { attr: { height: 0 } }, { attr: { height: H }, duration: duration * 0.68, ease: "power3.inOut" }, at2 + i * duration * 0.064));
        tl.set(next, { clipPath: "none" }, at2 + duration);
        tl.set(wrap3, { opacity: 0 }, at2 + duration);
      }
      if (["wipe-transition", "curve-ribbon", "diagonal-ribbon", "liquid-sweep"].includes(id)) {
        const l = overlay(), colors3 = ["#d9e8ff", "#81c9b0", "#2563eb"], stagger = duration * 0.05, enter2 = duration * 0.4, cut = at2 + enter2 + 2 * stagger;
        l.dataset.effectSpace = "canvas";
        root.dataset.transitionCut = String(cut);
        tl.set(next, { opacity: 1 }, cut);
        tl.set(wrap3, { opacity: 0 }, cut);
        colors3.forEach((color5, i) => {
          let e2;
          if (id === "curve-ribbon" || id === "liquid-sweep") {
            const k = id === "curve-ribbon" ? W * 0.19 : W * 0.12, shape = id === "curve-ribbon" ? `M0 0H${W + k}Q${W - k} ${H * 0.5} ${W + k} ${H}H0Z` : `M0 0H${W + k}C${W - k} ${H * 0.24} ${W + 2 * k} ${H * 0.7} ${W + k} ${H}H0Z`;
            e2 = make7(`position:absolute;inset:0;width:${W + k * 2}px;height:${H}px`, `<svg width="100%" height="100%" viewBox="0 0 ${W + k * 2} ${H}"><path d="${shape}" fill="${color5}"/></svg>`, l);
            tl.fromTo(e2, { x: -W - k * 2 }, { x: 0, duration: enter2, ease: "power2.inOut" }, at2 + i * stagger);
            tl.to(e2, { x: W + k * 2, duration: enter2 * 0.85, ease: "power2.inOut" }, cut + 0.025 + i * stagger);
          } else {
            const diagonal = id === "diagonal-ribbon", off = W * (diagonal ? 1.65 : 1.06);
            e2 = make7(`position:absolute;left:-${W * (diagonal ? 0.15 : 0.01)}px;top:-${H * (diagonal ? 0.35 : 0.05)}px;width:${W * (diagonal ? 1.3 : 1.02)}px;height:${H * (diagonal ? 1.7 : 1.1)}px;border-radius:${diagonal ? "130" : "0"}px;background:${color5}`, "", l);
            tl.fromTo(e2, { x: -off, rotation: diagonal ? -17 : 0 }, { x: 0, duration: enter2, ease: "power2.inOut" }, at2 + i * stagger);
            tl.to(e2, { x: off, duration: enter2 * 0.85, ease: "power2.inOut" }, cut + 0.025 + i * stagger);
          }
        });
        tl.fromTo(next, { x: -12 }, { x: 0, duration: 0.28, ease: "power3.out" }, cut);
        root.dataset.transitionEnd = String(cut + 0.025 + 2 * stagger + enter2 * 0.85);
      }
    }
    if (["grid-drift", "perspective-scroll", "dot-drift", "orb-parallax", "contour-flow", "diagonal-hatch", "ring-orbit", "blueprint-pan", "wave-bands", "ambient-breath"].includes(id)) {
      const backgrounds = choose('[data-motion="background"]');
      if (!backgrounds.length) throw Error('\u80CC\u666F\u52A8\u753B\u9700\u8981 data-motion="background" \u56FE\u5C42');
      targets = backgrounds;
      for (const bg of backgrounds) {
        bg.style.background = "none";
        bg.style.overflow = "hidden";
        const inner = make7("position:absolute;inset:-120px;pointer-events:none", "", bg);
        const d = Number(options.duration || 8);
        if (id === "grid-drift" || id === "dot-drift" || id === "diagonal-hatch" || id === "blueprint-pan") {
          inner.style.backgroundImage = id === "dot-drift" ? "radial-gradient(#7a9dcd66 1.25px,transparent 1.5px)" : id === "diagonal-hatch" ? "repeating-linear-gradient(120deg,transparent 0 40px,#88a8d02d 40px 41px,transparent 41px 80px)" : id === "blueprint-pan" ? "linear-gradient(#93b1d530 1px,transparent 1px),linear-gradient(90deg,#93b1d530 1px,transparent 1px),linear-gradient(#769dd644 1px,transparent 1px),linear-gradient(90deg,#769dd644 1px,transparent 1px)" : "linear-gradient(#93b1d544 1px,transparent 1px),linear-gradient(90deg,#93b1d544 1px,transparent 1px)";
          inner.style.backgroundSize = id === "dot-drift" ? "24px 24px" : id === "diagonal-hatch" ? "auto" : id === "blueprint-pan" ? "24px 24px,24px 24px,120px 120px,120px 120px" : "54px 54px";
          tl.fromTo(inner, { x: 0, y: 0 }, { x: id === "diagonal-hatch" ? 72 : 54, y: id === "blueprint-pan" ? -48 : 54, duration: d, ease: "none" }, 0);
        }
        if (id === "perspective-scroll") {
          inner.style.cssText = "position:absolute;inset:0;overflow:hidden;background:linear-gradient(#fff,#f8fbff)";
          inner.dataset.gridProjection = "fixed";
          const ns = "http://www.w3.org/2000/svg", svg3 = document.createElementNS(ns, "svg");
          svg3.setAttribute("viewBox", `0 0 ${W} ${H}`);
          svg3.setAttribute("width", "100%");
          svg3.setAttribute("height", "100%");
          svg3.setAttribute("aria-hidden", "true");
          svg3.style.overflow = "hidden";
          inner.append(svg3);
          const cx = W / 2, vanishY = -H * 0.98, spacing = W * 0.132, depth = 6, phase = 0.72, speed = 1.5, pad2 = 8;
          const line3 = (x1, y1, x2, y2, kind) => {
            const e2 = document.createElementNS(ns, "line");
            for (const [k, v] of Object.entries({ x1, y1, x2, y2, stroke: "#9cb8df", "stroke-width": 1.25, "stroke-opacity": 0.48 })) e2.setAttribute(k, String(v));
            e2.dataset.gridLine = kind;
            svg3.append(e2);
            return e2;
          };
          for (let i = -8; i <= 8; i++) {
            const x = cx + i * spacing;
            line3(x, 0, cx + (x - cx) * (H - vanishY) / -vanishY, H, "longitude");
          }
          const project = (q) => vanishY + (H - vanishY) / (1 + q / depth);
          const depthAt = (y) => depth * ((H - vanishY) / (y - vanishY) - 1), near = depthAt(H + pad2), far = depthAt(-pad2);
          for (let i = -Math.ceil(speed * d) - 2; i <= Math.ceil(far); i++) {
            const initial = i + phase, enter2 = Math.max(0, (near - initial) / speed), leave = Math.min(d, (far - initial) / speed);
            if (leave <= enter2) continue;
            const q0 = initial + speed * enter2, q1 = initial + speed * leave, y0 = project(q0), y1 = project(q1), row = line3(0, 0, W, 0, "row");
            row.dataset.gridIndex = String(i);
            tl.fromTo(row, { y: y0 }, { y: y1, duration: leave - enter2, ease: (p) => (y0 - project(q0 + (q1 - q0) * p)) / (y0 - y1) }, enter2);
          }
        }
        if (id === "orb-parallax" || id === "ambient-breath") {
          [["#c5ddff", -120, -105, 370], ["#b4e2d1", W - 200, H - 200, 420], ["#e4edff", W - 260, -180, 250]].forEach(([color5, x, y, size], i) => {
            const e2 = make7(`position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:50%;background:${color5};opacity:${id === "ambient-breath" ? 0.37 : 0.46};filter:${id === "ambient-breath" ? "blur(40px)" : "none"}`, "", bg);
            tl.fromTo(e2, { x: 0, y: 0, scale: 1 }, { x: i % 2 ? -26 : 28, y: i % 2 ? -24 : 20, scale: id === "ambient-breath" ? 1.22 : 1.03, duration: d, ease: "sine.inOut" }, 0);
          });
        }
        if (id === "contour-flow" || id === "wave-bands") {
          const wave = id === "wave-bands";
          inner.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 ${W + 240} ${H + 240}" preserveAspectRatio="none">${Array.from({ length: wave ? 4 : 14 }, (_, i) => `<path d="M-100 ${80 + i * (wave ? 180 : 78)}C380 ${-140 + i * (wave ? 160 : 71)} 970 ${370 + i * (wave ? 120 : 62)} ${W + 360} ${130 + i * (wave ? 170 : 67)}" fill="none" stroke="${i % 2 ? "#81c9b0" : "#7ca5de"}" stroke-width="${wave ? 70 : 1.4}" opacity="${wave ? 0.11 : 0.25}"/>`).join("")}</svg>`;
          tl.fromTo(inner, { x: -40, y: -20 }, { x: 45, y: 30, duration: d, ease: "sine.inOut" }, 0);
        }
        if (id === "ring-orbit") {
          [[15, 5, 430], [W - 125, H - 60, 520]].forEach(([x, y, size], j) => {
            const e2 = make7(`position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;border:1px solid #7aa2d94a`, "", bg);
            [0.7, 0.85].forEach((s2) => make7(`position:absolute;inset:${(1 - s2) * 50}%;border-radius:50%;border:1px dashed #82b8a860`, "", e2));
            make7(`position:absolute;left:50%;top:-4px;width:8px;height:8px;border-radius:50%;background:#81b0dc`, "", e2);
            tl.fromTo(e2, { rotation: 0 }, { rotation: j ? -48 : 42, duration: d, ease: "none" }, 0);
          });
        }
      }
    }
    return targets;
  }

  // animation-style-motion.mjs
  var animationStyleEffects = [
    {
      id: "ani-notice-verify",
      name: "\u6587\u6863\u9010\u9879\u6838\u5BF9",
      component: "ani-notice-check",
      description: "\u4ECE\u5B8C\u6574\u6587\u6863\u5F00\u59CB\uFF0C\u9010\u884C\u805A\u7126\u5E76\u7559\u4E0B\u68C0\u67E5\u52FE\uFF0C\u6700\u540E\u663E\u793A\u6838\u5BF9\u7ED3\u679C\u3002",
      category: "\u52A8\u753B\u98CE",
      selector: "[data-ani-row]",
      duration: 8,
      previewTime: 6.5,
      cueHints: [],
      silent: true
    }
  ];
  var pendingAnimationStyleEffects = [
    {
      id: "ani-diagram-build",
      name: "\u56FE\u89E3\u9010\u6B65\u5EFA\u7ACB",
      component: "ani-tool-workbench",
      description: "\u4F9D\u6B21\u5EFA\u7ACB\u4E3B\u8981\u5BF9\u8C61\uFF0C\u7ED8\u51FA\u8054\u7CFB\uFF0C\u518D\u5448\u73B0\u7ED3\u679C\u5E76\u505C\u7559\u3002",
      category: "\u52A8\u753B\u98CE",
      selector: "[data-ani-enter]",
      duration: 8,
      previewTime: 6.5,
      cueHints: [],
      silent: true
    },
    {
      id: "ani-order-select",
      name: "\u8868\u683C\u6761\u4EF6\u7B5B\u9009",
      component: "ani-order-filter",
      description: "\u5148\u4FDD\u7559\u5B8C\u6574\u793A\u4F8B\u8868\u683C\uFF0C\u964D\u4F4E\u4E0D\u7B26\u5408\u6761\u4EF6\u7684\u884C\uFF0C\u518D\u663E\u793A\u7B5B\u9009\u7ED3\u679C\u3002",
      category: "\u52A8\u753B\u98CE",
      selector: "[data-ani-excluded]",
      duration: 8,
      previewTime: 6.5,
      cueHints: [],
      silent: true
    },
    {
      id: "ani-machine-process",
      name: "\u6750\u6599\u52A0\u5DE5\u8FC7\u7A0B",
      component: "ani-processing-machine",
      description: "\u6750\u6599\u8FDB\u5165\u5904\u7406\u88C5\u7F6E\uFF0C\u9F7F\u8F6E\u6709\u9650\u65CB\u8F6C\u4E24\u5708\uFF0C\u968F\u540E\u5C55\u793A\u7ED3\u679C\u3002",
      category: "\u52A8\u753B\u98CE",
      selector: "[data-ani-gear]",
      duration: 8,
      previewTime: 6.5,
      cueHints: [],
      silent: true
    }
  ];
  function compareFlow(flow, tl, at2) {
    const joins = [...flow.querySelectorAll("[data-ani-flow-join]")];
    const trunks = [...flow.querySelectorAll("[data-ani-flow-trunk]")];
    const bridge2 = [...flow.querySelectorAll("[data-ani-flow-bridge] path")];
    const result = flow.querySelector("[data-ani-flow-result]");
    const footer2 = flow.querySelector("[data-ani-flow-footer]");
    const draw = (paths2, start, duration) => paths2.forEach((path2) => {
      const length = path2.getTotalLength();
      path2.style.strokeDasharray = String(length);
      path2.style.strokeDashoffset = String(length);
      path2.style.opacity = "0";
      tl.set(path2, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 }, 0);
      tl.set(path2, { opacity: 1 }, start);
      tl.fromTo(path2, { strokeDashoffset: length }, {
        strokeDashoffset: 0,
        duration,
        ease: "none",
        autoRound: false,
        immediateRender: false
      }, start);
    });
    draw(joins, at2, 0.45);
    draw(trunks, at2 + 0.45, 0.7);
    tl.fromTo(result, { opacity: 0 }, {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out"
    }, at2 + 1.15);
    draw(bridge2, at2 + 1.55, 0.25);
    tl.fromTo(footer2, { opacity: 0 }, {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out"
    }, at2 + 1.8);
    return [...joins, ...trunks, ...bridge2, result, footer2];
  }
  function diagramBuild(root, options, tl) {
    const enter2 = [...root.querySelectorAll("[data-ani-enter]")];
    const links = [...root.querySelectorAll("[data-ani-link]")];
    const result = [...root.querySelectorAll("[data-ani-pop]")];
    const start = Number(options.start ?? 0.6);
    const gap = Math.min(0.3, 2.1 / Math.max(1, enter2.length - 1));
    if (enter2.length) tl.fromTo(enter2, { y: 18, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: gap,
      ease: "power2.out"
    }, start);
    const flow = root.querySelector("[data-ani-compare-flow]");
    if (flow) {
      const labelsReady = start + Math.max(0, enter2.length - 1) * gap + 0.5;
      return [...enter2, ...compareFlow(flow, tl, labelsReady + 0.35)];
    }
    const linksAt = start + Math.max(0, enter2.length - 1) * gap + 0.4;
    links.forEach((node4, index) => {
      const at2 = linksAt + index * Math.min(0.2, 1.2 / Math.max(1, links.length - 1));
      const length = typeof node4.getTotalLength === "function" ? node4.getTotalLength() : 0;
      if (length > 0) tl.fromTo(node4, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 }, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 0.65,
        ease: "power2.inOut"
      }, at2);
      else tl.fromTo(node4, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "sine.out" }, at2);
    });
    const resultAt = Math.max(4.8, linksAt + 1.5);
    const movingResults = result.filter((node4) => !node4.hasAttribute("data-ani-stationary"));
    if (movingResults.length) tl.fromTo(movingResults, { y: 10, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.45,
      stagger: 0.12,
      ease: "power2.out"
    }, resultAt);
    result.filter((node4) => node4.hasAttribute("data-ani-stationary")).forEach((node4) => {
      tl.fromTo(node4, { opacity: 0 }, {
        opacity: 1,
        duration: 0.45,
        ease: "power2.out"
      }, resultAt + result.indexOf(node4) * 0.12);
    });
    return [...enter2, ...links, ...result];
  }
  function orderSelect(gsap, root, options, tl) {
    const excluded = [...root.querySelectorAll("[data-ani-excluded]")];
    const excludedBackgrounds = excluded.flatMap((row) => [...row.querySelectorAll("[data-ani-row-bg], [data-ani-status-bg]")]);
    const matched = [...root.querySelectorAll("[data-ani-filtered]")];
    const raw = [...root.querySelectorAll("[data-ani-raw]")];
    const final = [...root.querySelectorAll("[data-ani-final]")];
    const result = [...root.querySelectorAll("[data-ani-pop]")];
    const start = Number(options.start ?? 0.6);
    if (final.length || result.length) {
      gsap.set([...final, ...result], { opacity: 0 });
      tl.set([...final, ...result], { opacity: 0 }, 0);
    }
    if (matched.length) tl.set(matched, { opacity: 1 }, 0);
    if (excluded.length) {
      gsap.set(excluded, { opacity: 1 });
      tl.set(excluded, { opacity: 1 }, 0);
      excluded.forEach((row, index) => {
        [...row.querySelectorAll("[data-ani-row-bg], [data-ani-status-bg]")].forEach((node4) => {
          const originalFill = node4.getAttribute("fill") || "#ffffff";
          const finalFill = node4.hasAttribute("data-ani-status-bg") ? "#e2e8f0" : "#f4f6f8";
          tl.fromTo(node4, { fill: originalFill }, {
            fill: finalFill,
            duration: 0.5,
            ease: "sine.inOut"
          }, start + 1 + index * 0.45);
        });
      });
    }
    if (raw.length) tl.fromTo(raw, { opacity: 1 }, {
      opacity: 0,
      duration: 0.3,
      ease: "sine.inOut"
    }, start + 2.5);
    if (final.length) tl.fromTo(final, { opacity: 0 }, {
      opacity: 1,
      duration: 0.4,
      ease: "sine.out",
      immediateRender: false
    }, start + 2.8);
    if (result.length) tl.fromTo(result, { opacity: 0 }, {
      opacity: 1,
      duration: 0.4,
      ease: "sine.out",
      immediateRender: false
    }, start + 3.7);
    return [...excluded, ...excludedBackgrounds, ...raw, ...final, ...result];
  }
  function machineProcess(root, options, tl) {
    const travel = [...root.querySelectorAll("[data-ani-travel]")];
    const gears = [...root.querySelectorAll("[data-ani-gear]")];
    const result = [...root.querySelectorAll("[data-ani-pop]")];
    const start = Number(options.start ?? 0.6);
    const distance = Number(options.travelDistance ?? 180);
    if (travel.length) {
      tl.fromTo(travel, { x: -distance, opacity: 0 }, {
        x: 0,
        opacity: 1,
        duration: 1.35,
        stagger: 0.2,
        ease: "power2.inOut"
      }, start);
      tl.fromTo(travel, { opacity: 1 }, {
        opacity: 0,
        duration: 0.25,
        stagger: 0.2,
        ease: "sine.in",
        immediateRender: false
      }, start + 1.45);
    }
    if (gears.length) tl.fromTo(gears, { rotation: 0, transformOrigin: "50% 50%" }, {
      rotation: 720,
      duration: 2.8,
      ease: "sine.inOut"
    }, start + 0.65);
    if (result.length) tl.fromTo(result, { y: 12, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.18,
      ease: "power2.out"
    }, start + 3.6);
    return [...travel, ...gears, ...result];
  }
  function extendAnimationStyleMotion(gsap, root, id, options, tl) {
    if (id === "ani-diagram-build") return diagramBuild(root, options, tl);
    if (id === "ani-order-select") return orderSelect(gsap, root, options, tl);
    if (id === "ani-machine-process") return machineProcess(root, options, tl);
    if (id !== "ani-notice-verify") return [];
    const rows3 = [...root.querySelectorAll("[data-ani-row]")];
    const focus = [...root.querySelectorAll("[data-ani-focus]")];
    const checks = [...root.querySelectorAll("[data-ani-check]")];
    const results = [...root.querySelectorAll("[data-ani-result]")];
    const total = Number(options.duration || 8);
    const start = Number(options.start ?? 0.6);
    const count2 = Math.max(rows3.length, focus.length, checks.length, 1);
    const step = Math.min(1.18, Math.max(0.42, (total - start - 2) / count2));
    const targets = [...focus, ...checks, ...results];
    if (targets.length) {
      gsap.set(targets, { opacity: 0 });
      tl.set(targets, { opacity: 0 }, 0);
    }
    focus.forEach((node4, index) => {
      const at2 = start + index * step;
      tl.fromTo(node4, { opacity: 0 }, {
        opacity: 1,
        duration: 0.16,
        ease: "sine.out",
        immediateRender: false
      }, at2);
      tl.fromTo(node4, { opacity: 1 }, {
        opacity: 0,
        duration: 0.2,
        ease: "sine.inOut",
        immediateRender: false
      }, at2 + step - 0.22);
    });
    checks.forEach((node4, index) => {
      tl.fromTo(node4, { opacity: 0 }, {
        opacity: 1,
        duration: 0.24,
        ease: "sine.out",
        immediateRender: false
      }, start + index * step + Math.min(0.48, step * 0.45));
    });
    if (results.length) tl.fromTo(results, { opacity: 0 }, {
      opacity: 1,
      duration: 0.4,
      ease: "sine.out",
      immediateRender: false
    }, start + count2 * step + 0.25);
    return targets;
  }

  // transfer-motion.mjs
  var names = {
    "purpose-fork": "\u5171\u540C\u5165\u53E3\u4E0E\u53CC\u8DEF\u5F84\u5C55\u5F00",
    "context-bridge": "\u5BF9\u8C61\u51FA\u73B0\u4E0E\u5173\u7CFB\u5EFA\u7ACB",
    "field-reuse": "\u5171\u540C\u5B57\u6BB5\u9010\u9879\u5BF9\u5E94",
    "capacity-limit": "\u69FD\u4F4D\u586B\u6EE1\u4E0E\u5BB9\u91CF\u63D0\u793A",
    "batch-delivery": "\u8F7D\u8D27\u5230\u8FBE\u4E0E\u7A7A\u8F66\u8FD4\u7A0B",
    "batch-cycle": "\u8BFB\u53D6\u4FDD\u5B58\u91CA\u653E\u5FAA\u73AF",
    "relationship-map": "\u8DE8\u5BF9\u8C61\u5173\u7CFB\u63D0\u53D6",
    "copy-verify": "\u526F\u672C\u4E0E\u9010\u9879\u6838\u9A8C",
    "guided-steps": "\u95EE\u9898\u5230\u884C\u52A8\u5C55\u5F00"
  };
  var transferEffects = Object.entries(names).map(([key, name]) => ({ id: "ani-transfer-" + key, name, component: "ani-transfer-" + key, description: "\u6309\u72B6\u6001\u987A\u5E8F\u5C55\u5F00\u5E76\u4FDD\u7559\u6700\u7EC8\u7ED3\u679C\uFF0C\u53EF\u6B63\u53CD\u5411\u62D6\u52A8\uFF1B\u672C\u914D\u65B9\u4F7F\u7528\u9759\u97F3\u8F68\u3002", category: "\u52A8\u753B\u98CE", selector: `[data-transfer-kind="${key}"]`, duration: 8, previewTime: 7.4, cueHints: [], silent: true }));
  function extendTransferMotion(gsap, root, id, options, tl) {
    if (!transferEffects.some((e2) => e2.id === id)) return [];
    const scene2 = root.querySelector('[data-transfer-kind="' + id.replace("ani-transfer-", "") + '"]');
    if (!scene2) return [];
    const scale = Number(options.duration || 8) / 8, offset = Number(options.start ?? 0.6) - 0.6, when = (v) => Math.max(0, Number(v) * scale + offset), targets = [...scene2.querySelectorAll("[data-tr-cue], [data-tr-draw]")];
    for (const el of targets) {
      if (el.hasAttribute("data-tr-draw")) {
        const length = el.getTotalLength();
        gsap.set(el, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
        tl.fromTo(el, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.45 * scale, ease: "none", immediateRender: false, lazy: false }, when(el.dataset.trDraw));
      } else {
        const at2 = when(el.dataset.trCue);
        gsap.set(el, { opacity: 0 });
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.22 * scale, ease: "sine.out", immediateRender: false, lazy: false }, at2);
        if (el.hasAttribute("data-tr-until")) tl.fromTo(el, { opacity: 1 }, { opacity: 0, duration: 0.12 * scale, ease: "none", immediateRender: false, lazy: false }, when(el.dataset.trUntil) - 0.12 * scale);
        if (el.hasAttribute("data-tr-dx")) {
          gsap.set(el, { x: 0, y: 0 });
          tl.fromTo(el, { x: 0, y: 0 }, { x: Number(el.dataset.trDx), y: Number(el.dataset.trDy), duration: Number(el.dataset.trTravel) * scale, ease: "power2.inOut", immediateRender: false, lazy: false }, at2 + 0.25 * scale);
        }
      }
    }
    return targets;
  }

  // broll-workflow-motion.mjs
  var definitions2 = [
    ["broll-document-scan", "\u626B\u63CF\u63D0\u53D6", "\u626B\u63CF\u7EBF\u63A8\u8FDB\u540E\u9010\u9879\u843D\u4E0B\u5B57\u6BB5"],
    ["broll-search-focus", "\u68C0\u7D22\u5B9A\u4F4D", "\u68C0\u7D22\u8BCD\u5C55\u5F00\uFF0C\u9009\u4E2D\u7ED3\u679C\u540E\u5C55\u5F00\u6458\u5F55"],
    ["broll-calendar-pin", "\u6392\u671F\u843D\u4F4D", "\u65E5\u5386\u7FFB\u5165\uFF0C\u9501\u5B9A\u65E5\u671F\u540E\u653E\u4E0B\u5B89\u6392"],
    ["broll-folder-sort", "\u5206\u7C7B\u5F52\u6863", "\u4E09\u5F20\u6587\u4EF6\u9519\u5CF0\u5F52\u5165\u5BF9\u5E94\u76EE\u5F55"],
    ["broll-edit-timeline", "\u526A\u8F91\u7EC4\u88C5", "\u9010\u8F68\u94FA\u5F00\u7247\u6BB5\uFF0C\u64AD\u653E\u5934\u5300\u901F\u626B\u8FC7"],
    ["broll-voice-transcript", "\u8BED\u97F3\u843D\u7A3F", "\u6CE2\u5F62\u6E38\u6807\u626B\u8FC7\uFF0C\u4E09\u6BB5\u6587\u5B57\u4F9D\u6B21\u843D\u7A3F"],
    ["broll-focus-timer", "\u4E13\u6CE8\u5B8C\u6210", "\u73AF\u5F62\u8FDB\u5EA6\u63A8\u8FDB\uFF0C\u4EFB\u52A1\u843D\u5B9E\u540E\u5207\u6362\u7ED3\u675F\u65F6\u95F4"]
  ];
  var workflowRecipeOptions = Object.freeze({
    "broll-document-scan-motion": ["standard", "guided"],
    "broll-search-focus-motion": ["standard", "guided"],
    "broll-voice-transcript-motion": ["standard", "guided"]
  });
  var workflowActionCues = Object.freeze({
    "broll-document-scan-motion": { source: 0.15, scan: 0.75, link: 1.35, result1: 1.65, result2: 2.35, result3: 3.05, done: 4.15 },
    "broll-search-focus-motion": { query: 0.2, results: 1.2, pointer: 2.1, selection: 2.8, excerpt: 3.2 },
    "broll-voice-transcript-motion": { source: 0.15, waveform: 0.55, cursor: 0.75, result1: 1.3, result2: 2.4, result3: 3.5, done: 4.9 }
  });
  var recipeInfo = {
    standard: { id: "standard", name: "\u9010\u9879\u843D\u4F4D", description: "\u5BF9\u8C61\u8FDB\u5165\u540E\u9010\u9879\u6ED1\u5165\u7ED3\u679C\uFF0C\u4FDD\u7559\u6E90\u5185\u5BB9\u4E0E\u64CD\u4F5C\u987A\u5E8F\u3002", motionFamily: "staggered-placement" },
    guided: { id: "guided", name: "\u9605\u8BFB\u5F15\u5BFC", description: "\u6E90\u5185\u5BB9\u56FA\u5B9A\uFF0C\u6CBF\u9605\u8BFB\u65B9\u5411\u906E\u7F69\u63ED\u793A\u7ED3\u679C\uFF1B\u68C0\u7D22\u4F7F\u7528\u6846\u9009\uFF0C\u8BED\u97F3\u6CE2\u5F62\u9010\u6BB5\u663E\u9732\u3002", motionFamily: "directional-reveal" }
  };
  var workflowEffects = definitions2.map(([component2, name, description]) => ({
    id: component2 + "-motion",
    component: component2,
    exclusive: component2,
    name: "\u63D2\u955C \xB7 " + name,
    description,
    category: "\u63D2\u955C\u52A8\u4F5C",
    selector: "[data-broll-part]",
    duration: 8,
    previewTime: 5.8,
    silent: true,
    cueHints: [],
    recipes: (workflowRecipeOptions[component2 + "-motion"] || ["standard"]).map((id) => recipeInfo[id]),
    optionsSchema: { properties: { recipe: { type: "string", enum: workflowRecipeOptions[component2 + "-motion"] || ["standard"], default: "standard" } } },
    motionOwnership: { scope: "[data-broll-part]", properties: ["transform", "opacity", "clipPath", "strokeDashoffset"], camera: "parent-wrapper-only", rule: "One recipe controls the internal objects. Do not apply a second effect to the same parts." }
  }));
  function buildWorkflowMotion(gsap, root, id, { duration = 8, recipe = "standard" } = {}) {
    const effect = workflowEffects.find((e2) => e2.id === id);
    if (!effect) throw Error("Unknown B-roll motion: " + id);
    if (!Number.isFinite(duration) || duration <= 0) throw Error("B-roll duration must be positive");
    if (!effect.recipes.some((r) => r.id === recipe)) throw Error(`${id} recipe: expected ${effect.recipes.map((r) => r.id).join(" | ")}`);
    gsap.config({ force3D: false });
    const tl = gsap.timeline({ paused: true }), part2 = (name) => [...root.querySelectorAll(`[data-broll-part="${name}"]`)];
    const guided = recipe === "guided", direction2 = root.querySelector("[data-source-side]")?.dataset.sourceSide || "left";
    const enter2 = (name, at2, stagger = 0.3) => {
      const nodes = part2(name);
      if (!nodes.length) return;
      if (guided && ["result", "excerpt", "transcript"].includes(name)) tl.fromTo(nodes, { opacity: 0, clipPath: direction2 === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }, { opacity: 1, clipPath: "inset(0 0% 0 0%)", duration: 0.5, stagger, ease: "power2.inOut" }, at2);
      else if (guided) tl.fromTo(nodes, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger, ease: "sine.out" }, at2);
      else tl.fromTo(nodes, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger, ease: "power3.out" }, at2);
    };
    if (effect.component === "broll-document-scan") {
      enter2("source", 0.15);
      const travel = Math.max(0, (part2("source")[0]?.offsetHeight || 456) - (part2("scanner")[0]?.offsetHeight || 44) - 62);
      tl.fromTo(part2("scanner"), { y: 0, opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.75).to(part2("scanner"), { y: travel, duration: 2.7, ease: "none" }, 0.9).to(part2("scanner"), { opacity: 0, duration: 0.3 }, 3.6);
      enter2("link", 1.35);
      enter2("result", 1.65, 0.7);
      enter2("done", 4.15);
    } else if (effect.component === "broll-search-focus") {
      if (guided) tl.fromTo(part2("query"), { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "sine.out" }, 0.2);
      else tl.fromTo(part2("query"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "steps(12)" }, 0.2);
      enter2("hit", 1.2, 0.22);
      if (guided) {
        tl.set(part2("pointer"), { opacity: 0 }, 0);
        tl.fromTo(part2("selection"), { opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.35, ease: "power2.inOut" }, 2.8);
      } else {
        tl.fromTo(part2("pointer"), { x: 50, y: 64, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.7, ease: "power2.inOut" }, 2.1);
        tl.fromTo(part2("selection"), { opacity: 0, scale: 1.035 }, { opacity: 1, scale: 1, duration: 0.35 }, 2.8);
      }
      enter2("excerpt", 3.2);
    } else if (effect.component === "broll-calendar-pin") {
      tl.fromTo(part2("calendar"), { rotationX: -18, y: 25, opacity: 0, transformPerspective: 1e3 }, { rotationX: 0, y: 0, opacity: 1, duration: 0.75, ease: "power3.out" }, 0.15);
      tl.fromTo(part2("date"), { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, 1.25);
      enter2("event", 2.1);
      enter2("time", 2.65);
      enter2("done", 3.6);
    } else if (effect.component === "broll-folder-sort") {
      tl.fromTo(part2("file"), { y: -82, rotation: -7, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.9, stagger: 0.8, ease: "power3.out" }, 0.25);
      enter2("tag", 1.3, 0.8);
    } else if (effect.component === "broll-edit-timeline") {
      tl.fromTo(part2("clip"), { scaleX: 0, transformOrigin: "left center", opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.5, stagger: 0.24, ease: "power2.out" }, 0.2);
      const width = root.querySelector(".brw-track-bed")?.clientWidth || 978;
      tl.fromTo(part2("playhead"), { x: 0, opacity: 0 }, { opacity: 1, duration: 0.15 }, 2.1).to(part2("playhead"), { x: width - 2, duration: 3.7, ease: "none" }, 2.25);
    } else if (effect.component === "broll-voice-transcript") {
      enter2("audio", 0.15);
      if (guided) tl.fromTo(part2("wave"), { opacity: 0.16 }, { opacity: 1, duration: 0.24, stagger: 0.065, ease: "none" }, 0.55);
      else tl.fromTo(part2("wave"), { scaleY: 0.2, transformOrigin: "center" }, { scaleY: 1, duration: 0.5, stagger: 0.025, ease: "sine.out" }, 0.55);
      const width = root.querySelector(".brw-waveform")?.clientWidth || 458;
      tl.fromTo(part2("cursor"), { x: 0 }, { x: width - 2, duration: 4.15, ease: "none" }, 0.75);
      enter2("transcript", 1.3, 1.1);
      enter2("done", 4.9);
    } else if (effect.component === "broll-focus-timer") {
      enter2("timer", 0.15);
      enter2("task", 0.35, 0.2);
      tl.fromTo(part2("arc"), { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 4.1, ease: "none" }, 0.75);
      tl.fromTo(part2("tick"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 1.15, ease: "back.out(1.3)" }, 1.45);
      tl.fromTo(part2("start-time"), { opacity: 1, y: 0 }, { opacity: 0, y: -12, duration: 0.25 }, 4.8);
      tl.fromTo(part2("end-time"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 4.95);
      enter2("done", 5.15);
    }
    tl.to({ t: 0 }, { t: 8, duration: 8, ease: "none" }, 0);
    root.dataset.effectId = id;
    root.dataset.effectRecipe = recipe;
    root.dataset.effectTargets = String(root.querySelectorAll("[data-broll-part]").length);
    if (duration === 8) return tl;
    return gsap.timeline({ paused: true }).fromTo(tl, { time: 0 }, { time: 8, duration, ease: "none", immediateRender: false, lazy: false });
  }

  // broll-motion.mjs
  var brollGraphicEffects = [
    ["broll-brief-desk", "\u4FBF\u7B7E\u843D\u4F4D"],
    ["broll-message-pile", "\u6D88\u606F\u6574\u7406"],
    ["broll-revision-stack", "\u7248\u672C\u53E0\u653E"]
  ].map(([component2, name]) => ({
    id: component2 + "-motion",
    component: component2,
    exclusive: component2,
    name: "\u63D2\u955C \xB7 " + name,
    category: "\u63D2\u955C\u52A8\u4F5C",
    description: "\u73B0\u6709 B-roll \u4E13\u5C5E\u52A8\u4F5C\uFF0C\u6309\u5185\u5BB9\u987A\u5E8F\u5C55\u793A\u3002",
    selector: "[data-broll-part]",
    duration: 8,
    previewTime: 5.8,
    silent: true,
    cueHints: []
  }));
  function buildBrollMotion(gsap, root, id, { duration = 6 } = {}) {
    gsap.config({ force3D: false });
    const tl = gsap.timeline({ paused: true }), q = (s2) => [...root.querySelectorAll(s2)], part2 = (n4) => q(`[data-broll-part="${n4}"]`);
    if (id === "broll-brief-desk" || id === "broll-revision-stack") q("[data-broll-part]").forEach((node4) => {
      node4.style.willChange = "transform,opacity";
    });
    const enter2 = (nodes, at2 = 0.3, stagger = 0.24) => {
      if (nodes.length) tl.fromTo(nodes, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger, ease: "power3.out" }, at2);
    };
    if (id === "broll-cutaway") {
      tl.fromTo(part2("camera"), { scale: 1 }, { scale: 1.045, duration, ease: "none" }, 0);
      enter2(part2("caption"), 0.45);
    } else if (id === "broll-sequence") {
      enter2(part2("shot"), 0.15, 0.45);
      tl.fromTo(part2("camera"), { scale: 1.065, x: -7 }, { scale: 1.065, x: 7, duration: 5.5, ease: "sine.inOut" }, 0.3);
    } else if (id === "broll-detail") {
      tl.fromTo(part2("camera"), { scale: 1 }, { scale: 1.025, duration: 5.8, ease: "sine.inOut" }, 0);
      tl.fromTo(part2("focus"), { opacity: 0, scale: 1.14 }, { opacity: 1, scale: 1, duration: 0.75, ease: "power3.out" }, 0.55);
      enter2(part2("note"), 1.15, 0.5);
      enter2(part2("caption"), 0.7);
    } else if (id === "broll-brief-desk") {
      enter2(part2("paper"), 0.1);
      enter2(part2("note"), 0.65, 0.47);
      enter2(part2("tick"), 3, 0.2);
    } else if (id === "broll-message-pile") {
      const nodes = part2("message");
      if (nodes.length) tl.fromTo(nodes, { x: 95, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.53, ease: "power3.out" }, 0.18);
      enter2(part2("paper"), 2.55);
      enter2(part2("note"), 3.1, 0.25);
      enter2(part2("tick"), 4, 0.2);
    } else if (id === "broll-revision-stack") {
      enter2(part2("paper"), 0.2, 0.66);
      enter2(part2("note"), 2.25, 0.24);
      enter2(part2("tick"), 3.3, 0.2);
    }
    const marks = part2("mark");
    if (marks.length) tl.fromTo(marks, { opacity: 0 }, { opacity: 1, duration: 0.45, stagger: 0.18, ease: "sine.out" }, 2.5);
    root.dataset.effectId = id + "-motion";
    root.dataset.effectTargets = String(q("[data-broll-part]").length);
    tl.to({ hold: 0 }, { hold: 1, duration, ease: "none" }, 0);
    return tl;
  }

  // transfer-kit-motion.mjs
  var kitEffects = [{ id: "ani-hd-parts", name: "\u9AD8\u6E05\u90E8\u4EF6\u5206\u5C42\u52A8\u4F5C", component: "ani-module-hd-truck", category: "\u52A8\u753B\u98CE", selector: '[data-hd-kit="layout"]', duration: 8, previewTime: 7.4, silent: true, description: "\u6309\u6BCF\u4E2A layers \u5BF9\u8C61\u7684 enter/exit\u3001\u8D77\u70B9\u548C\u5206\u6BB5\u8DEF\u5F84\u72EC\u7ACB\u7F16\u6392\uFF1B\u53EF\u6B63\u53CD\u62D6\u52A8\uFF0C\u4E0D\u64AD\u653E\u6574\u5F20\u53C2\u8003\u56FE\u3002" }];
  function buildKitMotion(gsap, root, options = {}) {
    const tl = gsap.timeline({ paused: true }), scale = (options.duration ?? 8) / 8;
    for (const el of root.querySelectorAll("[data-kit-motion]")) {
      const m = JSON.parse(el.dataset.kitMotion), start = { opacity: m.enter === 0 ? 1 : 0, x: m.fromX, y: m.fromY };
      gsap.set(el, start);
      tl.fromTo(el, start, { opacity: 1, x: 0, y: 0, duration: Math.max(m.fade, 1e-3) * scale, ease: "power2.out", immediateRender: false, lazy: false }, m.enter * scale);
      let x = 0, y = 0;
      for (const s2 of m.steps) {
        tl.fromTo(el, { x, y }, { x: s2.x, y: s2.y, duration: s2.duration * scale, ease: s2.ease, immediateRender: false, lazy: false }, s2.at * scale);
        x = s2.x;
        y = s2.y;
      }
      if (m.exit < 8) tl.fromTo(el, { opacity: 1 }, { opacity: 0, duration: Math.max(m.fade, 1e-3) * scale, ease: "none", immediateRender: false, lazy: false }, (m.exit - m.fade) * scale);
    }
    tl.to({}, { duration: 1e-3 }, 8 * scale - 1e-3);
    return tl;
  }

  // animations.mjs
  var legacyEffects = [
    { id: "fade-in", name: "\u6DE1\u5165\u5448\u73B0", component: "codex-chat", description: "\u6574\u5757\u754C\u9762\u7531\u900F\u660E\u5230\u6E05\u6670\uFF0C\u4FDD\u7559\u771F\u5B9E\u7248\u5F0F\u3002", selector: ".motion-wrap", duration: 8 },
    { id: "slide-in", name: "\u7A97\u53E3\u6ED1\u5165", component: "chrome-browser", description: "\u7A97\u53E3\u4ECE\u4E0B\u65B9\u8FDB\u5165\u5E76\u8F7B\u5FAE\u7F29\u653E\u843D\u4F4D\u3002", selector: ".motion-wrap", duration: 8 },
    { id: "stagger", name: "\u6B65\u9AA4\u4F9D\u6B21\u51FA\u73B0", component: "flowchart", description: "\u6309\u7167\u5185\u5BB9\u987A\u5E8F\u9519\u5CF0\u5165\u573A\uFF0C\u9002\u7528\u4E8E\u6D41\u7A0B\u3001\u5361\u7247\u548C\u6E05\u5355\u3002", selector: '[data-motion="item"]', duration: 8 },
    { id: "typewriter", name: "\u9010\u5B57\u8F93\u5165", component: "terminal-session", description: "\u5728\u56FA\u5B9A 1.2 \u79D2\u8282\u594F\u5185\u9010\u5B57\u5C55\u5F00\u547D\u4EE4\u6216\u6587\u5B57\uFF0C\u66FF\u6362\u5185\u5BB9\u540E\u786E\u8BA4\u97F3\u6548\u4ECD\u7136\u5BF9\u9F50\u3002", selector: '[data-motion="type"]', duration: 8 },
    { id: "line-highlight", name: "\u9010\u884C\u805A\u7126", component: "code-editor", description: "\u4F9D\u6B21\u7A81\u51FA\u4EE3\u7801\u6216\u5217\u8868\u884C\uFF0C\u524D\u540E\u72B6\u6001\u53EF\u51C6\u786E\u56DE\u653E\u3002", selector: '[data-motion="highlight"]', duration: 8 },
    { id: "draw-path", name: "\u8FDE\u7EBF\u751F\u957F", component: "flowchart", description: "SVG \u8FDE\u7EBF\u6309\u8DEF\u5F84\u957F\u5EA6\u7ED8\u5236\uFF0C\u4FDD\u6301\u7BAD\u5934\u4E0E\u8282\u70B9\u5BF9\u5E94\u3002", selector: '[data-motion="line"]', duration: 8 },
    { id: "click-ripple", name: "\u5149\u6807\u70B9\u51FB", component: "chrome-browser", description: "\u5149\u6807\u79FB\u52A8\u5230\u9009\u5B9A\u63A7\u4EF6\uFF0C\u70B9\u51FB\u65F6\u51FA\u73B0\u4E24\u5C42\u77ED\u6CE2\u7EB9\u3002", selector: '[data-motion="focus"]', duration: 8 },
    { id: "zoom-focus", name: "\u955C\u5934\u63A8\u8FD1", component: "code-editor", description: "\u56F4\u7ED5\u9009\u5B9A\u533A\u57DF\u63A8\u8FD1\u5E76\u505C\u7559\uFF0C\u9002\u5408\u8BB2\u89E3\u771F\u5B9E\u5C0F\u5B57\u53F7\u754C\u9762\u3002", selector: '[data-motion="focus"]', duration: 8 },
    { id: "spotlight", name: "\u5C40\u90E8\u805A\u5149", component: "settings-panel", description: "\u4FDD\u7559\u76EE\u6807\u539F\u8C8C\uFF0C\u906E\u7F69\u964D\u4F4E\u5468\u56F4\u4FE1\u606F\u7684\u4EAE\u5EA6\u3002", selector: '[data-motion="focus"]', duration: 8 },
    { id: "split-reveal", name: "\u524D\u540E\u63ED\u793A", component: "before-after", description: "\u906E\u7F69\u6A2A\u5411\u6253\u5F00\u4FEE\u6539\u540E\u7684\u753B\u9762\uFF0C\u7528\u4E8E\u524D\u540E\u6548\u679C\u5BF9\u6BD4\u3002", selector: '[data-motion="reveal"]', duration: 8 },
    { id: "progress-fill", name: "\u6570\u503C\u8FDB\u5EA6\u589E\u957F", component: "bar-chart", description: "\u67F1\u5F62\u6216\u8FDB\u5EA6\u6761\u4ECE\u96F6\u589E\u957F\u5230\u51C6\u786E\u6570\u503C\u3002", selector: '[data-motion="bar"]', duration: 8 },
    { id: "count-up", name: "\u6570\u5B57\u9012\u589E", component: "metric-dashboard", description: "\u4ECE\u96F6\u589E\u957F\u5230\u914D\u7F6E\u6570\u5B57\uFF0C\u4FDD\u7559\u5355\u4F4D\u4E0E\u5C0F\u6570\u7CBE\u5EA6\u3002", selector: '[data-motion="counter"]', duration: 8 },
    { id: "scroll-panel", name: "\u5185\u5BB9\u6EDA\u52A8", component: "markdown-document", description: "\u5728\u56FA\u5B9A\u53EF\u89C6\u7A97\u53E3\u5185\u5E73\u6ED1\u6EDA\u52A8\u957F\u6587\u6863\u3002", selector: '[data-motion="scroll"]', duration: 8 },
    { id: "word-emphasis", name: "\u5173\u952E\u8BCD\u5212\u7EBF", component: "definition-card", description: "\u84DD\u8272\u4E0B\u5212\u7EBF\u6309\u8BB2\u89E3\u987A\u5E8F\u7ED8\u5236\uFF0C\u539F\u6587\u5B57\u4E0D\u53D1\u751F\u53D8\u5F62\u3002", selector: '[data-motion="emphasis"]', duration: 8 },
    { id: "window-exit", name: "\u7A97\u53E3\u6536\u8D77", component: "chrome-browser", description: "\u754C\u9762\u5148\u4FDD\u6301\u53EF\u8BFB\uFF0C\u518D\u5411\u53F3\u4E0B\u89D2\u4EFB\u52A1\u4F4D\u6536\u8D77\uFF0C\u9002\u5408\u6BB5\u843D\u7ED3\u675F\u3002", selector: ".motion-wrap", duration: 8 },
    { id: "modal-pop", name: "\u547D\u4EE4\u9762\u677F\u5F39\u51FA", component: "command-palette", description: "\u4FDD\u7559\u80CC\u540E\u5E94\u7528\uFF0C\u547D\u4EE4\u9762\u677F\u4ECE\u6309\u952E\u89E6\u53D1\u4F4D\u7F6E\u77ED\u4FC3\u5C55\u5F00\u5E76\u7A33\u5B9A\u3002", selector: ".os-palette", duration: 8 },
    { id: "toast-enter", name: "\u901A\u77E5\u9001\u8FBE", component: "notification-stack", description: "\u901A\u77E5\u5355\u72EC\u4ECE\u53F3\u4FA7\u5230\u8FBE\uFF0C\u6309\u6D88\u606F\u65F6\u95F4\u95F4\u9694\u9519\u5CF0\u843D\u4F4D\u3002", selector: ".os-notification", duration: 8 },
    { id: "menu-unfold", name: "\u7EA7\u8054\u83DC\u5355\u5C55\u5F00", component: "context-menu", description: "\u4E3B\u83DC\u5355\u5148\u5C55\u5F00\uFF0C\u518D\u4ECE\u88AB\u9009\u6761\u76EE\u6C34\u5E73\u5C55\u5F00\u5B50\u83DC\u5355\u3002", selector: ".os-context-menu,.os-context-submenu", duration: 8 },
    { id: "focus-ring", name: "\u76EE\u6807\u63CF\u8FB9", component: "settings-panel", description: "\u6CBF\u771F\u5B9E\u63A7\u4EF6\u8FB9\u7F18\u753B\u51FA\u84DD\u8272\u8F6E\u5ED3\uFF0C\u6E05\u695A\u6807\u51FA\u64CD\u4F5C\u76EE\u6807\u3002", selector: '[data-motion="focus"]', duration: 8 },
    { id: "marker-sweep", name: "\u8367\u5149\u7B14\u626B\u8BFB", component: "definition-card", description: "\u8584\u8377\u8272\u6807\u8BB0\u6CBF\u5173\u952E\u6587\u5B57\u626B\u8FC7\uFF0C\u6587\u5B57\u548C\u6392\u7248\u4FDD\u6301\u7A33\u5B9A\u3002", selector: '[data-motion="emphasis"]', duration: 8 },
    { id: "focus-hop", name: "\u7126\u70B9\u5DE1\u6E38", component: "annotation-callout", description: "\u540C\u4E00\u4E2A\u84DD\u8272\u9009\u6846\u8FDE\u7EED\u79FB\u5230\u4E09\u4E2A\u5185\u5BB9\u533A\u57DF\uFF0C\u9002\u5408\u9010\u9879\u8BB2\u89E3\u3002", selector: '[data-motion="highlight"]', duration: 8 },
    { id: "check-complete", name: "\u4EFB\u52A1\u5B8C\u6210", component: "test-results", description: "\u8FDB\u5EA6\u5148\u586B\u6EE1\uFF0C\u518D\u63CF\u51FA\u5B8C\u6210\u52FE\u548C\u7ED3\u679C\u6458\u8981\uFF0C\u5448\u73B0\u660E\u786E\u7684\u72B6\u6001\u53D8\u5316\u3002", selector: ".dev-test-ring", duration: 8 },
    { id: "row-reveal", name: "\u8868\u683C\u8F7D\u5165", component: "data-table", description: "\u8868\u5934\u4FDD\u6301\u56FA\u5B9A\uFF0C\u6570\u636E\u884C\u4ECE\u5DE6\u5230\u53F3\u5FEB\u901F\u663E\u73B0\uFF0C\u5C3E\u90E8\u518D\u663E\u793A\u9009\u4E2D\u8BB0\u5F55\u3002", selector: ".dev-data-grid tbody tr", duration: 8 },
    { id: "chart-trace", name: "\u8D8B\u52BF\u8FFD\u8E2A\u8BFB\u6570", component: "line-chart", description: "\u5728\u5DF2\u6709\u66F2\u7EBF\u4E0A\u79FB\u52A8\u8DDF\u8E2A\u70B9\u4E0E\u7AD6\u5411\u53C2\u8003\u7EBF\uFF0C\u9010\u6BB5\u89E3\u91CA\u53D8\u5316\u3002", selector: '.edu-line-svg [data-motion="line"]', duration: 8 },
    { id: "card-stack", name: "\u7ED3\u6784\u5206\u5C42\u5C55\u5F00", component: "layer-stack", description: "\u91CD\u53E0\u7684\u4E09\u5C42\u7ED3\u6784\u6CBF\u7EB5\u5411\u5206\u5F00\uFF0C\u540C\u65F6\u663E\u73B0\u5BF9\u5E94\u8BF4\u660E\u3002", selector: '.edu-layer-art g[data-motion="item"]', duration: 8 },
    { id: "media-pan", name: "\u7D20\u6750\u7F13\u6162\u5E73\u79FB", component: "media-stage", description: "\u53EA\u5728\u7D20\u6750\u6846\u5185\u90E8\u8FDB\u884C\u8F7B\u5FAE\u63A8\u79FB\uFF0C\u6807\u9898\u548C\u6CE8\u91CA\u4FDD\u6301\u56FA\u5B9A\u3002", selector: ".edu-media-canvas > *", duration: 8 },
    { id: "iris-reveal", name: "\u5706\u5F62\u5F00\u5E55", component: "chapter-summary", description: "\u5706\u5F62\u906E\u7F69\u4ECE\u4E2D\u5FC3\u6253\u5F00\u5230\u5168\u753B\u9762\uFF0C\u9002\u5408\u7AE0\u8282\u5F00\u573A\u3002", selector: ".motion-wrap", duration: 8 },
    { id: "wipe-transition", name: "\u84DD\u8272\u906E\u5E45\u8F6C\u573A", component: "before-after", description: "\u84DD\u8272\u906E\u5E45\u76D6\u4F4F\u753B\u9762\u540E\u5411\u53F3\u79FB\u5F00\uFF0C\u53EF\u5728\u76D6\u6EE1\u7684\u65F6\u95F4\u70B9\u5207\u6362\u7D20\u6750\u3002", selector: ".motion-wrap", duration: 8 },
    { id: "stamp-confirm", name: "\u786E\u8BA4\u5370\u8BB0", component: "chapter-summary", description: "\u5728\u7AE0\u8282\u7ED3\u5C3E\u653E\u4E0B\u5C0F\u578B\u8584\u8377\u5B8C\u6210\u7AE0\uFF0C\u7559\u51FA\u6B63\u6587\u9605\u8BFB\u533A\u57DF\u3002", selector: ".edu-next-strip", duration: 8 },
    { id: "error-shake", name: "\u8F93\u5165\u7EA0\u9519\u63D0\u793A", component: "form-panel", description: "\u53EA\u8BA9\u5F53\u524D\u8F93\u5165\u6846\u77ED\u6682\u5DE6\u53F3\u8F7B\u9707\u5E76\u51FA\u73B0\u8FB9\u6846\u63D0\u793A\uFF0C\u968F\u540E\u6062\u590D\u7A33\u5B9A\u3002", selector: ".os-form-field .os-focused", duration: 8 }
  ].map((effect) => ({ ...effect, ...{
    "fade-in": { category: "\u5165\u573A", previewTime: 1.5, cueHints: [{ sound: "whoosh-short", at: 0.6, gain: 0.24 }] },
    "slide-in": { category: "\u5165\u573A", previewTime: 1.5, cueHints: [{ sound: "whoosh-short", at: 0.6, gain: 0.35 }, { sound: "pop", at: 1.32, gain: 0.2 }] },
    "stagger": { category: "\u5165\u573A", previewTime: 2.2, cueHints: [{ sound: "pop", at: 0.6, gain: 0.2 }, { sound: "pop", at: 0.96, gain: 0.22 }, { sound: "pop", at: 1.32, gain: 0.24 }, { sound: "pop", at: 1.68, gain: 0.26 }, { sound: "pop", at: 2.04, gain: 0.24 }] },
    "typewriter": { category: "\u64CD\u4F5C", previewTime: 2.2, cueHints: [{ sound: "typing", at: 0.6, gain: 0.28, duration: 1.079 }, { sound: "typing", at: 1.679, gain: 0.28, duration: 0.121 }, { sound: "key-press", at: 1.8, gain: 0.3 }] },
    "line-highlight": { category: "\u6807\u6CE8", previewTime: 3.2, cueHints: [{ sound: "click-soft", at: 0.6, gain: 0.28 }, { sound: "click-soft", at: 1.68, gain: 0.28 }, { sound: "click-soft", at: 2.76, gain: 0.28 }, { sound: "click-soft", at: 3.84, gain: 0.28 }, { sound: "click-soft", at: 4.92, gain: 0.28 }] },
    "draw-path": { category: "\u8BB2\u89E3", previewTime: 1.6, cueHints: [{ sound: "whoosh-short", at: 0.6, gain: 0.22 }, { sound: "whoosh-short", at: 1.08, gain: 0.22 }] },
    "click-ripple": { category: "\u64CD\u4F5C", previewTime: 1.9, cueHints: [{ sound: "click", at: 1.65, gain: 0.48 }] },
    "zoom-focus": { category: "\u955C\u5934", previewTime: 2, cueHints: [{ sound: "whoosh", at: 0.6, gain: 0.3, duration: 1.2 }] },
    "spotlight": { category: "\u6807\u6CE8", previewTime: 1.8, cueHints: [{ sound: "ping", at: 0.65, gain: 0.24 }] },
    "split-reveal": { category: "\u8BB2\u89E3", previewTime: 1.8, cueHints: [{ sound: "whoosh", at: 0.6, gain: 0.32, duration: 1.3 }] },
    "progress-fill": { category: "\u6570\u636E", previewTime: 1.5, cueHints: [{ sound: "riser", at: 0.6, gain: 0.25, duration: 1.4 }, { sound: "ping", at: 2.1, gain: 0.28 }] },
    "count-up": { category: "\u6570\u636E", previewTime: 1.4, cueHints: [{ sound: "riser", at: 0.6, gain: 0.23, duration: 1.7 }, { sound: "chime", at: 2.6, gain: 0.25 }] },
    "scroll-panel": { category: "\u64CD\u4F5C", previewTime: 3, cueHints: [{ sound: "whoosh", at: 0.6, gain: 0.15, duration: 1.2 }] },
    "word-emphasis": { category: "\u6807\u6CE8", previewTime: 1.5, cueHints: [{ sound: "whoosh-short", at: 0.6, gain: 0.25 }] },
    "window-exit": { category: "\u9000\u573A", previewTime: 3.85, cueHints: [{ sound: "whoosh", at: 3.35, gain: 0.32, duration: 0.8 }] },
    "modal-pop": { category: "\u64CD\u4F5C", previewTime: 1.1, cueHints: [{ sound: "key-press", at: 0.6, gain: 0.28 }, { sound: "pop", at: 0.67, gain: 0.32 }] },
    "toast-enter": { category: "\u64CD\u4F5C", previewTime: 2.25, cueHints: [{ sound: "notification", at: 0.6, gain: 0.3 }, { sound: "pop", at: 1.35, gain: 0.25 }, { sound: "pop", at: 2.1, gain: 0.25 }] },
    "menu-unfold": { category: "\u64CD\u4F5C", previewTime: 1.8, cueHints: [{ sound: "click", at: 0.6, gain: 0.32 }, { sound: "click-soft", at: 1.5, gain: 0.26 }] },
    "focus-ring": { category: "\u6807\u6CE8", previewTime: 1.4, cueHints: [{ sound: "ping", at: 0.6, gain: 0.27 }] },
    "marker-sweep": { category: "\u6807\u6CE8", previewTime: 1.3, cueHints: [{ sound: "whoosh-short", at: 0.6, gain: 0.23, duration: 0.55 }] },
    "focus-hop": { category: "\u6807\u6CE8", previewTime: 2.3, cueHints: [{ sound: "click-soft", at: 0.6, gain: 0.24 }, { sound: "click-soft", at: 2, gain: 0.24 }, { sound: "click-soft", at: 3.4, gain: 0.24 }] },
    "check-complete": { category: "\u53CD\u9988", previewTime: 2.1, cueHints: [{ sound: "riser", at: 0.6, gain: 0.2, duration: 0.9 }, { sound: "chime", at: 2.08, gain: 0.32 }] },
    "row-reveal": { category: "\u6570\u636E", previewTime: 1.5, cueHints: [{ sound: "typing", at: 0.6, gain: 0.16, duration: 0.65 }, { sound: "click-soft", at: 1.4, gain: 0.25 }] },
    "chart-trace": { category: "\u6570\u636E", previewTime: 2.3, cueHints: [{ sound: "riser", at: 0.6, gain: 0.18, duration: 1.4 }, { sound: "ping", at: 4, gain: 0.25 }] },
    "card-stack": { category: "\u8BB2\u89E3", previewTime: 1.65, cueHints: [{ sound: "whoosh", at: 0.6, gain: 0.3, duration: 1.2 }, { sound: "pop", at: 1.7, gain: 0.22 }] },
    "media-pan": { category: "\u955C\u5934", previewTime: 3.2, cueHints: [{ sound: "whoosh", at: 0.6, gain: 0.13, duration: 1.2 }] },
    "iris-reveal": { category: "\u8F6C\u573A", previewTime: 1.15, cueHints: [{ sound: "whoosh", at: 0.6, gain: 0.35, duration: 1.1 }] },
    "wipe-transition": { category: "\u8F6C\u573A", previewTime: 1.75, cueHints: [{ sound: "whoosh-short", at: 0.6, gain: 0.32 }, { sound: "whoosh", at: 1.48, gain: 0.32, duration: 0.7 }] },
    "stamp-confirm": { category: "\u53CD\u9988", previewTime: 1.4, cueHints: [{ sound: "pop", at: 1, gain: 0.38 }, { sound: "chime", at: 1.1, gain: 0.27 }] },
    "error-shake": { category: "\u53CD\u9988", previewTime: 0.95, cueHints: [{ sound: "error", at: 0.6, gain: 0.29 }] }
  }[effect.id] }));
  var effects = [...legacyEffects.map((e2) => e2.category === "\u8F6C\u573A" ? { ...e2, component: "lecture-stage", previewTime: 2.28, cueHints: [{ sound: "whoosh", at: 2.1, gain: 0.24, duration: 0.7 }], name: e2.id === "wipe-transition" ? "\u4E09\u5C42\u77ED\u906E\u5E45\u8F6C\u573A" : "\u5706\u5F62\u753B\u9762\u4EA4\u63A5", description: e2.id === "wipe-transition" ? "\u6D45\u84DD\u3001\u8584\u8377\u4E0E\u84DD\u8272\u77ED\u906E\u5E45\u63A5\u529B\uFF1B\u5B8C\u5168\u906E\u6321\u65F6\u5207\u6362\u5230\u72EC\u7ACB\u7684\u65B0\u753B\u9762\u3002" : "\u5706\u5F62\u906E\u7F69\u4ECE\u4E0A\u4E00\u5E45\u5185\u5BB9\u4E2D\u63ED\u5F00\u4E0B\u4E00\u5E45\u5185\u5BB9\u3002" } : e2), ...expandedEffects, ...animationStyleEffects, ...pendingAnimationStyleEffects, ...transferEffects, ...kitEffects, mixedMediaEffect, ...workflowEffects, ...brollGraphicEffects];
  function buildEffect(gsap, root, id, options = {}) {
    if (id === "ani-hd-parts") return buildKitMotion(gsap, root, options);
    if (workflowEffects.some((e2) => e2.id === id)) return buildWorkflowMotion(gsap, root, id, options);
    const broll = brollGraphicEffects.find((e2) => e2.id === id);
    if (broll) return buildBrollMotion(gsap, root, broll.component, { duration: options.duration ?? 8 });
    if (id === "media-sequence-motion") return buildMediaSequence(gsap, root, options);
    gsap.config({ force3D: false });
    const tl = gsap.timeline({ paused: true });
    const wrap3 = root.querySelector(".motion-wrap") || root;
    gsap.set(wrap3, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
    const total = Number(options.duration || 8), start = Number(options.start ?? 0.6);
    const choose = (selector, fallback) => {
      let n4 = [...root.querySelectorAll(options.selector || selector)];
      if (!n4.length && fallback) n4 = [...root.querySelectorAll(fallback)];
      return n4;
    };
    const rect2 = (el) => {
      const a2 = el.getBoundingClientRect(), b2 = root.getBoundingClientRect();
      return { x: a2.x - b2.x, y: a2.y - b2.y, w: a2.width, h: a2.height };
    };
    const layer2 = () => {
      const e2 = document.createElement("div");
      e2.className = "fx-layer";
      e2.dataset.generatedEffect = id;
      root.appendChild(e2);
      return e2;
    };
    let targets = [];
    if (options.background && options.background !== id) {
      targets = extendMotion(gsap, root, options.background, options, tl);
    }
    if (id === "none") {
      root.dataset.effectTargets = String(targets.length);
      root.dataset.effectId = "none";
      const hold = { t: 0 };
      tl.to(hold, { t: total, duration: total, ease: "none" }, 0);
      return tl;
    }
    if (id === "fade-in") {
      targets = [wrap3];
      tl.fromTo(wrap3, { opacity: 0 }, { opacity: 1, duration: 0.85, ease: "sine.out" }, start);
    }
    if (id === "slide-in") {
      targets = [wrap3];
      tl.fromTo(wrap3, { opacity: 0, y: 44, scale: 0.975 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }, start);
    }
    if (id === "stagger") {
      targets = choose('[data-motion="item"]', "li");
      if (!targets.length) targets = [...wrap3.children];
      tl.fromTo(targets, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.52, stagger: 0.36, ease: "power3.out" }, start);
      const links = [...root.querySelectorAll('[data-motion="line"]')];
      if (links.length) tl.fromTo(links, { opacity: 0 }, { opacity: 1, duration: 0.25, stagger: 0.36 }, start + 0.48);
      const details = [...root.querySelectorAll(".edu-flow-lines circle,.edu-flow-label")];
      if (details.length) tl.fromTo(details, { opacity: 0 }, { opacity: 1, duration: 0.3 }, start + 1.25);
    }
    if (id === "typewriter") {
      targets = choose('[data-motion="type"]', "pre");
      let commandsEnd = start;
      for (const [row, el] of targets.entries()) {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const texts = [];
        while (walker.nextNode()) texts.push(walker.currentNode);
        const chars = [];
        for (const node4 of texts) {
          const f = document.createDocumentFragment();
          for (const c of Array.from(node4.textContent)) {
            const span = document.createElement("span");
            span.textContent = c;
            span.dataset.fxChar = "";
            f.appendChild(span);
            chars.push(span);
          }
          node4.replaceWith(f);
        }
        const typingDuration = 1.2, characterFade = 0.025, stagger = chars.length > 1 ? (typingDuration - characterFade) / (chars.length - 1) : 0, at2 = start + row * 0.58;
        if (chars.length) tl.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: characterFade, stagger, ease: "none" }, at2);
        commandsEnd = Math.max(commandsEnd, Number((at2 + typingDuration).toFixed(6)));
      }
      const output = [...root.querySelectorAll("[data-output-line]")];
      if (output.length) tl.fromTo(output, { opacity: 0 }, { opacity: 1, duration: 0.04, stagger: 0.13, ease: "none" }, commandsEnd + 0.2);
      root.dataset.typingStart = String(start);
      root.dataset.typingEnd = String(commandsEnd);
    }
    if (id === "line-highlight") {
      targets = choose('[data-motion="highlight"]', "pre>div").filter((el) => el.textContent.replace(/^\s*\d+\s*/, "").trim());
      if (!targets.length) targets = choose('[data-motion="item"]', "li");
      targets.slice(0, 5).forEach((el, i) => {
        tl.fromTo(el, { backgroundColor: "#2563eb00" }, { backgroundColor: "#dceaff", duration: 0.22, ease: "sine.out" }, start + i * 1.08);
        if (i < Math.min(5, targets.length) - 1) tl.to(el, { backgroundColor: "#eef5ff", duration: 0.25 }, start + (i + 1) * 1.08);
      });
    }
    if (id === "draw-path") {
      targets = choose('[data-motion="line"]', "svg path");
      targets = targets.filter((e2) => e2.getBoundingClientRect().width > 18 || e2.getBoundingClientRect().height > 18);
      targets.forEach((el, i) => {
        if (typeof el.getTotalLength === "function") {
          const marker = el.getAttribute("marker-end");
          if (marker) {
            gsap.set(el, { attr: { "marker-end": "none" } });
            tl.set(el, { attr: { "marker-end": marker } }, start + i * 0.24 + 0.94);
          }
          const length = el.getTotalLength();
          tl.fromTo(el, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.95, ease: "power2.inOut" }, start + i * 0.24);
        } else {
          tl.fromTo(el, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1, ease: "power2.inOut" }, start + i * 0.24);
        }
      });
    }
    if (id === "click-ripple") {
      targets = choose('[data-motion="focus"]', "button");
      const target = targets[0] || wrap3, b2 = rect2(target);
      const x = b2.x + b2.w * 0.6, y = b2.y + b2.h * 0.54;
      const l = layer2();
      const cursor = document.createElement("div");
      cursor.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:27px;height:35px;filter:drop-shadow(0 2px 2px #0003)`;
      cursor.innerHTML = '<svg width="27" height="35" viewBox="0 0 27 35"><path d="M3 2v26l6-6 5 11 5-2-5-10 9-1Z" fill="#101010" stroke="white" stroke-width="1.6"/></svg>';
      l.appendChild(cursor);
      tl.fromTo(cursor, { x: -110, y: 50, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1, ease: "power3.inOut" }, start);
      for (let i = 0; i < 2; i++) {
        const ring = document.createElement("div");
        ring.className = "fx-ring";
        ring.style.left = x - 27 + "px";
        ring.style.top = y - 27 + "px";
        l.appendChild(ring);
        tl.fromTo(ring, { scale: 0.25, opacity: 0 }, { scale: 1.55 + i * 0.2, opacity: 0.85, duration: 0.2, ease: "sine.out" }, start + 1.05 + i * 0.16);
        tl.to(ring, { scale: 2.2 + i * 0.2, opacity: 0, duration: 0.6, ease: "power2.out" }, start + 1.25 + i * 0.16);
      }
      tl.to(cursor, { scale: 0.88, duration: 0.1, repeat: 1, yoyo: true, ease: "power2.inOut" }, start + 1.04);
    }
    if (id === "zoom-focus") {
      targets = choose('[data-motion="focus"]', "pre");
      const b2 = rect2(targets[0] || wrap3), rb = rect2(root);
      const factor = Number(options.scale || 1.32);
      const x = (rb.w / 2 - (b2.x + b2.w / 2)) * (factor - 1), y = (rb.h / 2 - (b2.y + b2.h / 2)) * (factor - 1);
      tl.to(wrap3, { scale: factor, x, y, duration: 1.2, ease: "power3.inOut" }, start);
    }
    if (id === "spotlight") {
      targets = choose('[data-motion="focus"]', "input");
      const b2 = rect2(targets[0] || wrap3), rb = rect2(root);
      const x = Math.max(0, b2.x - 7), y = Math.max(0, b2.y - 7), w = Math.min(rb.w - x, b2.w + 14), h = Math.min(rb.h - y, b2.h + 14);
      const l = layer2();
      l.innerHTML = `<svg class="fx-spotlight" viewBox="0 0 ${rb.w} ${rb.h}"><path fill="#182534" fill-rule="evenodd" d="M0 0H${rb.w}V${rb.h}H0ZM${x} ${y}V${y + h}H${x + w}V${y}Z"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="none" stroke="#2563eb" stroke-width="2"/></svg>`;
      tl.fromTo(l, { opacity: 0 }, { opacity: 0.62, duration: 0.65, ease: "sine.inOut" }, start);
    }
    if (id === "split-reveal") {
      targets = choose('[data-motion="reveal"]');
      if (!targets.length) targets = [wrap3];
      tl.fromTo(targets, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 2.3, ease: "power2.inOut" }, start);
    }
    if (id === "progress-fill") {
      targets = choose('[data-motion="bar"]');
      targets.forEach((el, i) => {
        const horizontal = el.dataset.orientation === "horizontal";
        tl.fromTo(el, horizontal ? { scaleX: 0, transformOrigin: "left center" } : { scaleY: 0, transformOrigin: "center bottom" }, horizontal ? { scaleX: 1, duration: 1.3, ease: "power2.out" } : { scaleY: 1, duration: 1.3, ease: "power2.out" }, start + i * 0.2);
      });
    }
    if (id === "count-up") {
      targets = choose('[data-motion="counter"]');
      targets.forEach((el, i) => {
        const original = el.textContent, match = original.match(/-?[\d,]+(?:\.\d+)?/);
        if (!match) return;
        const number9 = Number(match[0].replaceAll(",", "")), decimals = (match[0].split(".")[1] || "").length, state3 = { n: 0 };
        const update = () => {
          let formatted = state3.n.toFixed(decimals);
          if (match[0].includes(",")) {
            const parts3 = formatted.split(".");
            parts3[0] = parts3[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            formatted = parts3.join(".");
          }
          el.textContent = original.replace(match[0], formatted);
        };
        tl.fromTo(state3, { n: 0 }, { n: number9, duration: 1.7, ease: "power2.out", onUpdate: update }, start + i * 0.14);
      });
    }
    if (id === "scroll-panel") {
      targets = choose('[data-motion="scroll"]', "article");
      targets.forEach((el) => {
        const available = el.parentElement.clientHeight;
        const distance = Math.min(Math.max(0, el.scrollHeight - available), Number(options.distance ?? Infinity));
        tl.to(el, { y: -distance, duration: 3.6, ease: "power2.inOut" }, start);
      });
    }
    if (id === "word-emphasis") {
      targets = choose('[data-motion="emphasis"]', "strong");
      const l = layer2();
      targets.slice(0, 5).forEach((el, i) => {
        const b2 = rect2(el), line3 = document.createElement("div");
        line3.className = "fx-underline";
        line3.style.cssText = `left:${b2.x}px;top:${b2.y + b2.h + 4}px;width:${b2.w}px`;
        l.appendChild(line3);
        tl.fromTo(line3, { scaleX: 0 }, { scaleX: 1, duration: 0.65, ease: "power2.out" }, start + i * 0.85);
      });
    }
    if (id === "window-exit") {
      targets = [wrap3];
      const b2 = rect2(root);
      tl.fromTo(wrap3, { x: 0, y: 0, scale: 1, opacity: 1 }, { x: b2.w * 0.28, y: b2.h * 0.3, scale: 0.7, opacity: 0, duration: 0.78, ease: "power3.in", transformOrigin: "right bottom" }, start + 2.75);
    }
    if (id === "modal-pop") {
      targets = choose(".os-palette", '[data-motion="reveal"]');
      if (!targets.length) targets = [wrap3];
      tl.fromTo(targets[0], { scale: 0.94, y: -12, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.32, ease: "back.out(1.12)", transformOrigin: "center top" }, start + 0.07);
    }
    if (id === "toast-enter") {
      targets = choose(".os-notification", '[data-motion="item"]');
      if (!targets.length) targets = [wrap3];
      tl.fromTo(targets, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.44, stagger: 0.75, ease: "power3.out" }, start);
    }
    if (id === "menu-unfold") {
      targets = choose(".os-context-menu,.os-context-submenu", '[data-motion="reveal"]');
      if (!targets.length) targets = [wrap3];
      targets.slice(0, 2).forEach((el, i) => {
        tl.fromTo(el, { clipPath: i ? "inset(0 100% 0 0 round 8px)" : "inset(0 0 100% 0 round 8px)", opacity: 0 }, { clipPath: "inset(0 0 0 0 round 8px)", opacity: 1, duration: 0.28, ease: "power2.out" }, start + i * 0.9);
      });
    }
    if (id === "focus-ring") {
      targets = choose('[data-motion="focus"]', "button,.os-input");
      if (!targets.length) targets = [wrap3];
      const b2 = rect2(targets[0]), l = layer2(), pad2 = 6, w = b2.w + pad2 * 2, h = b2.h + pad2 * 2;
      l.innerHTML = `<svg style="position:absolute;left:${b2.x - pad2}px;top:${b2.y - pad2}px;overflow:visible" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect x="1.5" y="1.5" width="${Math.max(1, w - 3)}" height="${Math.max(1, h - 3)}" rx="7" fill="none" stroke="#2563eb" stroke-width="2.5"/></svg>`;
      const path2 = l.querySelector("rect"), length = path2.getTotalLength();
      tl.fromTo(path2, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, start);
    }
    if (id === "marker-sweep") {
      targets = choose('[data-motion="emphasis"]', "strong");
      if (!targets.length) targets = [wrap3];
      const l = layer2();
      targets.slice(0, 4).forEach((el, i) => {
        const b2 = rect2(el), mark = document.createElement("div");
        mark.style.cssText = `position:absolute;left:${b2.x - 3}px;top:${b2.y + b2.h * 0.44}px;width:${b2.w + 6}px;height:${Math.max(7, b2.h * 0.55)}px;background:#81c9b057;border-radius:3px;transform-origin:left center;mix-blend-mode:multiply`;
        l.appendChild(mark);
        tl.fromTo(mark, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, start + i * 0.85);
      });
    }
    if (id === "focus-hop") {
      targets = choose('[data-motion="highlight"]', '[data-motion="item"]');
      if (!targets.length) targets = [wrap3];
      targets = targets.slice(0, 3);
      const boxes = targets.map((el) => rect2(el)), b2 = boxes[0], l = layer2(), frame2 = document.createElement("div");
      frame2.style.cssText = `position:absolute;left:${b2.x - 6}px;top:${b2.y - 6}px;width:${b2.w + 12}px;height:${b2.h + 12}px;border:2px solid #2563eb;border-radius:6px;background:#2563eb08;transform-origin:left top`;
      l.appendChild(frame2);
      tl.fromTo(frame2, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "sine.out" }, start);
      boxes.slice(1).forEach((next, i) => {
        tl.to(frame2, { x: next.x - b2.x, y: next.y - b2.y, scaleX: (next.w + 12) / (b2.w + 12), scaleY: (next.h + 12) / (b2.h + 12), duration: 0.42, ease: "power3.inOut" }, start + (i + 1) * 1.4);
      });
    }
    if (id === "check-complete") {
      targets = choose(".dev-test-ring", ".edu-check-done");
      if (!targets.length) targets = [wrap3];
      const progress = [...root.querySelectorAll(".dev-test-progress > span")];
      if (progress.length) tl.fromTo(progress, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, start);
      const summary = root.querySelector(".dev-test-summary"), icons = targets.flatMap((el) => [...el.querySelectorAll("path")]);
      if (summary) tl.fromTo(summary, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "sine.out" }, start + 0.95);
      tl.fromTo(targets, { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.4)" }, start + 0.95);
      icons.forEach((path2) => {
        const length = path2.getTotalLength();
        tl.fromTo(path2, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, start + 1.08);
      });
    }
    if (id === "row-reveal") {
      targets = choose(".dev-data-grid tbody tr", "tbody tr");
      if (!targets.length) targets = choose('[data-motion="item"]', "li");
      if (!targets.length) targets = [wrap3];
      const gap = Math.min(0.08, 0.5 / Math.max(1, targets.length - 1));
      tl.fromTo(targets, { clipPath: "inset(0 100% 0 0)", opacity: 0 }, { clipPath: "inset(0 0 0 0)", opacity: 1, duration: 0.3, stagger: gap, ease: "power2.out" }, start);
      const detail = root.querySelector(".dev-record-detail");
      if (detail) tl.fromTo(detail, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "sine.out" }, start + 0.8);
    }
    if (id === "chart-trace") {
      targets = choose('.edu-line-svg [data-motion="line"]', 'svg [data-motion="line"]');
      targets = targets.filter((el) => typeof el.getTotalLength === "function");
      const path2 = targets[0];
      if (path2) {
        const length = path2.getTotalLength(), matrix = path2.getScreenCTM(), rb = root.getBoundingClientRect(), pathRect = rect2(path2), points = Array.from({ length: 65 }, (_, i) => {
          const p = path2.getPointAtLength(length * i / 64);
          return { x: matrix.a * p.x + matrix.c * p.y + matrix.e - rb.x, y: matrix.b * p.x + matrix.d * p.y + matrix.f - rb.y };
        });
        const l = layer2(), needle = document.createElement("div"), dot = document.createElement("div");
        needle.style.cssText = `position:absolute;left:0;top:${pathRect.y - 14}px;width:1px;height:${pathRect.h + 30}px;background:#2563eb66`;
        dot.style.cssText = "position:absolute;left:-6px;top:-6px;width:12px;height:12px;border:3px solid #2563eb;background:white;border-radius:50%;box-shadow:0 0 0 5px #2563eb15";
        l.append(needle, dot);
        tl.fromTo([needle, dot], { opacity: 0 }, { opacity: 1, duration: 0.12 }, start);
        tl.set(dot, { x: points[0].x, y: points[0].y }, 0);
        tl.set(needle, { x: points[0].x }, 0);
        tl.to(dot, { keyframes: points.slice(1).map((p) => ({ x: p.x, y: p.y, duration: 3.4 / 64, ease: "none" })), ease: "none" }, start);
        tl.to(needle, { keyframes: points.slice(1).map((p) => ({ x: p.x, duration: 3.4 / 64, ease: "none" })), ease: "none" }, start);
        const tooltip = root.querySelector('.edu-line-svg [data-motion="focus"]');
        if (tooltip) tl.fromTo(tooltip, { opacity: 0 }, { opacity: 1, duration: 0.3 }, start + 3.4);
      }
    }
    if (id === "card-stack") {
      targets = choose('.edu-layer-art g[data-motion="item"]', '[data-motion="item"]');
      if (!targets.length) targets = [wrap3];
      const boxes = targets.map((el) => rect2(el)), middle = boxes.reduce((sum, b2) => sum + b2.y + b2.h / 2, 0) / boxes.length;
      targets.forEach((el, i) => {
        const b2 = boxes[i];
        tl.fromTo(el, { y: middle - b2.y - b2.h / 2, opacity: i === targets.length - 1 ? 1 : 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.inOut" }, start);
      });
      const text7 = [...root.querySelectorAll(".edu-layer-descriptions article")], lines3 = [...root.querySelectorAll('.edu-layer-art [data-motion="line"]')];
      if (text7.length) tl.fromTo(text7, { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.12, ease: "power2.out" }, start + 0.85);
      if (lines3.length) tl.fromTo(lines3, { opacity: 0 }, { opacity: 1, duration: 0.35 }, start + 0.85);
    }
    if (id === "media-pan") {
      targets = choose(".edu-media-canvas > *", "img,video");
      if (!targets.length) targets = [wrap3];
      tl.fromTo(targets, { scale: 1.12, x: -20, y: -4 }, { scale: 1.12, x: 20, y: 4, duration: 4.8, ease: "sine.inOut", transformOrigin: "center center" }, start);
    }
    if (id === "stamp-confirm") {
      targets = choose(".edu-next-strip", '[data-motion="reveal"]');
      if (!targets.length) targets = [wrap3];
      const b2 = rect2(targets[0]), l = layer2(), stamp = document.createElement("div");
      const x = Math.max(14, b2.x + b2.w - 92), y = Math.max(14, b2.y - 66);
      stamp.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:60px;height:60px;border:2px solid #5fa58b;border-radius:50%;background:#eef8f3;display:grid;place-items:center;color:#28735d`;
      stamp.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      l.appendChild(stamp);
      tl.fromTo(stamp, { opacity: 0, scale: 1.9, rotation: -16 }, { opacity: 1, scale: 1, rotation: -6, duration: 0.4, ease: "power3.in" }, start);
      tl.to(stamp, { scale: 1.06, rotation: -4, duration: 0.12, ease: "power2.out" }, start + 0.4);
      tl.to(stamp, { scale: 1, rotation: -6, duration: 0.18, ease: "sine.out" }, start + 0.52);
    }
    if (id === "error-shake") {
      targets = choose(".os-form-field .os-focused", '.os-input,[data-motion="focus"]');
      if (!targets.length) targets = [wrap3];
      targets = targets.slice(0, 1);
      const color5 = getComputedStyle(targets[0]).borderColor;
      tl.to(targets, { keyframes: [{ x: -7, duration: 0.08 }, { x: 6, duration: 0.08 }, { x: -4, duration: 0.08 }, { x: 3, duration: 0.08 }, { x: 0, duration: 0.13 }], ease: "none" }, start);
      tl.fromTo(targets, { borderColor: color5 }, { borderColor: "#be5260", duration: 0.15, ease: "sine.out" }, start);
      tl.to(targets, { borderColor: color5, duration: 0.35, ease: "sine.inOut" }, start + 1.1);
    }
    const extended = extendMotion(gsap, root, id, options, tl);
    if (extended.length) targets = extended;
    const animationStyleTargets = extendAnimationStyleMotion(gsap, root, id, options, tl);
    if (animationStyleTargets.length) targets = animationStyleTargets;
    const transferTargets = extendTransferMotion(gsap, root, id, options, tl);
    if (transferTargets.length) targets = transferTargets;
    root.dataset.effectTargets = String(targets.length);
    root.dataset.effectId = id;
    const clock = { t: 0 };
    tl.to(clock, { t: total, duration: total, ease: "none" }, 0);
    return tl;
  }

  // stage-appearance.mjs
  var frameStyles = [
    { id: "none", name: "\u4E0D\u52A0\u5916\u6846", description: "\u4FDD\u7559\u7EC4\u4EF6\u81EA\u8EAB\u7684\u8FB9\u6846\u3002" },
    { id: "thin-blue", name: "\u7EC6\u84DD\u7EBF\u6846", description: "\u8F7B\u91CF\u84DD\u8272\u8F6E\u5ED3\u4E0E\u5C0F\u5706\u89D2\u3002" },
    { id: "dashed-round", name: "\u865A\u7EBF\u5706\u89D2\u6846", description: "\u4E0E\u53C2\u8003\u8BB2\u89E3\u821E\u53F0\u4E00\u81F4\u7684\u865A\u7EBF\u8FB9\u754C\u3002" },
    { id: "double-line", name: "\u53CC\u5C42\u7EC6\u7EBF\u6846", description: "\u5916\u84DD\u5185\u8584\u8377\u7684\u4E24\u5C42\u8F6E\u5ED3\u3002" },
    { id: "software-window", name: "\u8F6F\u4EF6\u7A97\u53E3\u58F3", description: "\u72EC\u7ACB\u6807\u9898\u680F\uFF0C\u5185\u5BB9\u533A\u4E3A\u6807\u9898\u680F\u9884\u7559\u7A7A\u95F4\u3002" },
    { id: "folded-paper", name: "\u6298\u89D2\u7EB8\u5F20\u6846", description: "\u53F3\u4E0A\u6298\u89D2\u4E0E\u6D45\u84DD\u7EB8\u5F20\u6295\u5F71\u3002" },
    { id: "animation-outline", name: "\u52A8\u753B\u7C97\u63CF\u8FB9", description: "\u6DF1\u84DD\u8F6E\u5ED3\u4E0E\u6D45\u84DD\u504F\u79FB\u5E95\u677F\u3002" },
    { id: "shadow-card", name: "\u67D4\u548C\u9634\u5F71\u5361", description: "\u767D\u8272\u5706\u89D2\u5361\u7247\u4E0E\u67D4\u548C\u843D\u5F71\u3002" }
  ];
  var backgroundStyles = [
    { id: "original", name: "\u7EC4\u4EF6\u539F\u80CC\u666F", description: "\u4FDD\u7559\u7EC4\u4EF6\u539F\u672C\u7684\u80CC\u666F\u3002" },
    { id: "grid", name: "\u6D45\u84DD\u65B9\u683C", description: "\u5747\u5300\u7EC6\u7EBF\u7F51\u683C\u3002" },
    { id: "dots", name: "\u84DD\u8272\u70B9\u9635", description: "\u758F\u6717\u70B9\u9635\u4E0E\u767D\u8272\u5E95\u3002" },
    { id: "perspective-grid", name: "\u900F\u89C6\u7F51\u683C", description: "\u5411\u753B\u9762\u4E0A\u65B9\u6536\u675F\u7684\u900F\u89C6\u7EBF\u3002" },
    { id: "mint-corners", name: "\u8584\u8377\u89D2\u9970", description: "\u51B0\u84DD\u4E0E\u8584\u8377\u7EFF\u7684\u4E24\u7AEF\u5706\u5F27\u3002" },
    { id: "paper", name: "\u7EB8\u5F20\u7EC6\u7EB9", description: "\u4F4E\u5BF9\u6BD4\u7EB8\u9762\u7EC6\u7EBF\u3002" },
    { id: "blue-waves", name: "\u6D45\u84DD\u6CE2\u7EB9", description: "\u753B\u9762\u4E24\u4FA7\u8212\u5C55\u7684\u84DD\u8272\u66F2\u7EBF\u3002" },
    { id: "blueprint", name: "\u6D45\u8272\u84DD\u56FE", description: "\u4E3B\u6B21\u7F51\u683C\u548C\u514B\u5236\u7684\u5750\u6807\u523B\u5EA6\u3002" },
    { id: "soft-halo", name: "\u67D4\u548C\u5149\u6655", description: "\u51B0\u84DD\u4E0E\u8584\u8377\u7EFF\u7684\u67D4\u548C\u6E10\u53D8\u3002" }
  ];
  var appearancePresets = [
    { id: "original", name: "\u6062\u590D\u539F\u6837", frame: "none", background: "original" },
    { id: "reference", name: "\u53C2\u8003\u8BB2\u89E3\u821E\u53F0", frame: "dashed-round", background: "perspective-grid" },
    { id: "clean-grid", name: "\u6E05\u723D\u7F51\u683C", frame: "thin-blue", background: "grid" },
    { id: "mint-card", name: "\u8584\u8377\u53CC\u6846", frame: "double-line", background: "mint-corners" },
    { id: "software-demo", name: "\u8F6F\u4EF6\u6F14\u793A", frame: "software-window", background: "dots" },
    { id: "paper-notes", name: "\u7EB8\u9762\u7B14\u8BB0", frame: "folded-paper", background: "paper" },
    { id: "animation-board", name: "\u52A8\u753B\u56FE\u89E3\u677F", frame: "animation-outline", background: "blueprint" },
    { id: "soft-explainer", name: "\u67D4\u548C\u8BB2\u89E3\u5361", frame: "shadow-card", background: "blue-waves" }
  ];
  var frameIds = new Set(frameStyles.map((v) => v.id));
  var backgroundIds = new Set(backgroundStyles.map((v) => v.id));
  function normalizeAppearance(value) {
    const input = value && typeof value === "object" ? value : {};
    return {
      frame: frameIds.has(input.frame) ? input.frame : "none",
      background: backgroundIds.has(input.background) ? input.background : "original"
    };
  }
  var stageAppearanceCSS = `
[data-appearance-stage]{position:absolute;inset:0;isolation:isolate;pointer-events:none;overflow:visible}
[data-appearance-stage]>.sap-background{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
[data-appearance-stage]>.sap-background>svg{position:absolute;inset:0;width:100%;height:100%;display:block}
[data-appearance-stage]>[data-appearance-content]{position:absolute;z-index:2;transform-origin:0 0;overflow:visible;pointer-events:auto}
[data-appearance-stage]>.sap-frame-back,[data-appearance-stage]>.sap-frame-front{position:absolute;pointer-events:none;box-sizing:border-box}
[data-appearance-stage]>.sap-frame-back{z-index:1;background:#fff}
[data-appearance-stage]>.sap-frame-front{z-index:3;background:transparent}
[data-appearance-stage] .sap-frame-front>svg,[data-appearance-stage] .sap-frame-back>svg{width:100%;height:100%;display:block;overflow:visible}
[data-appearance-stage] .sap-window-bar{position:absolute;left:0;right:0;top:0;height:var(--sap-bar);border-bottom:1px solid #cbdcf1;background:#edf4ff;border-radius:var(--sap-radius) var(--sap-radius) 0 0;display:flex;align-items:center;padding:0 var(--sap-window-padding);gap:var(--sap-dot)}
[data-appearance-stage] .sap-window-bar i{display:block;width:var(--sap-dot);height:var(--sap-dot);border:1px solid #7193c0;border-radius:50%;background:#fff}
[data-appearance-stage] .sap-window-bar span{position:absolute;left:50%;top:50%;width:70px;height:var(--sap-handle);border-radius:3px;background:#c4d8ee;transform:translate(-50%,-50%)}
[data-appearance-stage]>.sap-background[data-appearance-background="grid"]{background-color:#f6faff;background-image:linear-gradient(#cadcf080 1px,transparent 1px),linear-gradient(90deg,#cadcf080 1px,transparent 1px);background-size:48px 48px}
[data-appearance-stage]>.sap-background[data-appearance-background="dots"]{background-color:#f9fcff;background-image:radial-gradient(#94b6d7 1.15px,transparent 1.4px);background-size:25px 25px;background-position:12px 12px}
[data-appearance-stage]>.sap-background[data-appearance-background="perspective-grid"]{background:linear-gradient(#fff,#f4f9ff)}
[data-appearance-stage]>.sap-background[data-appearance-background="mint-corners"]{background:radial-gradient(ellipse at 0 0,#dcecff 0 23%,transparent 23.2%),radial-gradient(ellipse at 100% 100%,#d5eee5 0 25%,transparent 25.2%),#fafffd}
[data-appearance-stage]>.sap-background[data-appearance-background="paper"]{background-color:#fafcfb;background-image:repeating-linear-gradient(0deg,transparent 0 3px,#b8c9d512 3px 4px),repeating-linear-gradient(93deg,transparent 0 7px,#b8c9d50c 7px 8px)}
[data-appearance-stage]>.sap-background[data-appearance-background="blue-waves"]{background:linear-gradient(120deg,#f8fcff,#f0f8ff)}
[data-appearance-stage]>.sap-background[data-appearance-background="blueprint"]{background-color:#edf5ff;background-image:linear-gradient(#adc9e959 1px,transparent 1px),linear-gradient(90deg,#adc9e959 1px,transparent 1px),linear-gradient(#8db1d780 1px,transparent 1px),linear-gradient(90deg,#8db1d780 1px,transparent 1px);background-size:20px 20px,20px 20px,100px 100px,100px 100px}
[data-appearance-stage]>.sap-background[data-appearance-background="soft-halo"]{background:radial-gradient(ellipse at 10% 10%,#dbeaff 0,transparent 56%),radial-gradient(ellipse at 90% 95%,#d8eee6 0,transparent 53%),#fbfdff}
.sap-active[data-appearance-frame]:not([data-appearance-frame="none"]) [data-appearance-content] .edx-lesson-shell{inset:0 0 65px;border:0;border-radius:0;box-shadow:none}
.sap-active[data-appearance-frame]:not([data-appearance-frame="none"]) [data-appearance-content] .edx-corner{display:none}
.sap-active[data-appearance-background]:not([data-appearance-background="original"]) [data-appearance-content] .edx-ambient{visibility:hidden}
.sap-active[data-appearance-background]:not([data-appearance-background="original"]) [data-appearance-content] .edx-lecture{background:transparent}
`;
  var applied = /* @__PURE__ */ new WeakMap();
  function removeAppearance(root) {
    const prior = applied.get(root);
    if (!prior) return;
    for (const { node: node4, anchor } of prior.nodes) {
      if (anchor.parentNode === root) {
        root.insertBefore(node4, anchor);
        anchor.remove();
      }
    }
    prior.stage.remove();
    root.classList.remove("sap-active");
    applied.delete(root);
  }
  function ensureCSS(doc) {
    if (doc.querySelector("style[data-stage-appearance-style]")) return;
    const style = doc.createElement("style");
    style.dataset.stageAppearanceStyle = "";
    style.textContent = stageAppearanceCSS;
    (doc.head || doc.documentElement).append(style);
  }
  function svg2(markup, w, h) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" aria-hidden="true">${markup}</svg>`;
  }
  function backgroundMarkup(id, w, h) {
    if (id === "perspective-grid") {
      const vertical = Array.from({ length: 13 }, (_, i) => {
        const bottom = (i - 1) * w / 10, top = w / 2 + (bottom - w / 2) * 0.4;
        return `<path d="M${top} 0L${bottom} ${h}"/>`;
      }).join("");
      const horizontal = [0.035, 0.12, 0.23, 0.37, 0.55, 0.77, 0.97].map((y) => `<path d="M0 ${h * y}H${w}"/>`).join("");
      return svg2(`<g fill="none" stroke="#afcaed" stroke-width="1" opacity=".72">${vertical}${horizontal}</g>`, w, h);
    }
    if (id === "blue-waves") {
      const paths2 = Array.from({ length: 7 }, (_, i) => {
        const shift = i * 16;
        return `<path d="M${-w * 0.2 + shift} ${-h * 0.15}C${w * 0.18 + shift} ${h * 0.22} ${-w * 0.16 + shift} ${h * 0.7} ${w * 0.3 + shift} ${h * 1.1}"/><path d="M${w * 0.73 + shift} ${-h * 0.1}C${w * 1.16 + shift} ${h * 0.35} ${w * 0.7 + shift} ${h * 0.58} ${w * 1.1 + shift} ${h * 1.08}"/>`;
      }).join("");
      return svg2(`<g fill="none" stroke="#bad3ef" stroke-width="1.6" opacity=".65">${paths2}</g>`, w, h);
    }
    if (id === "blueprint") {
      const ticks = Array.from({ length: Math.floor(w / 100) }, (_, i) => `<path d="M${i * 100} 0V9M${i * 100} ${h}v-9"/>`).join("") + Array.from({ length: Math.floor(h / 100) }, (_, i) => `<path d="M0 ${i * 100}h9M${w} ${i * 100}h-9"/>`).join("");
      return svg2(`<g fill="none" stroke="#709bc7" stroke-width="1.5" opacity=".6">${ticks}</g>`, w, h);
    }
    return "";
  }
  function decorateFrame(back, front2, id, w, h, radius) {
    const size = `border-radius:${radius}px;`;
    back.style.cssText += size;
    front2.style.cssText += size;
    if (id === "thin-blue") front2.style.cssText += "border:1.5px solid #6d9ade;";
    if (id === "dashed-round") {
      front2.style.cssText += "border:1.7px dashed #6696e2;";
      back.style.cssText += "box-shadow:0 10px 25px #214b8210;";
    }
    if (id === "double-line") {
      front2.style.cssText += "border:1.7px solid #6d9ade;";
      front2.innerHTML = `<div style="position:absolute;inset:7px;border:1px solid #a7d5c4;border-radius:${Math.max(2, radius - 5)}px"></div>`;
    }
    if (id === "software-window") {
      front2.style.cssText += "border:1.7px solid #7295c3;";
      back.style.cssText += "box-shadow:0 var(--sap-shadow-step) 0 #dceafb;";
      front2.innerHTML = '<div class="sap-window-bar"><i></i><i></i><i></i><span></span></div>';
    }
    if (id === "folded-paper") {
      const fold = Math.min(31, w * 0.055, h * 0.08);
      const step = Math.min(7, h * 0.012), outline = `M1 1H${w - fold}L${w - 1} ${fold}V${h - 1}H1Z`;
      back.style.cssText += "background:transparent;border-radius:2px;";
      back.innerHTML = svg2(`<path d="${outline}" fill="#d8e8f8" transform="translate(${step} ${step})"/><path d="${outline}" fill="#fff"/>`, w, h);
      front2.innerHTML = svg2(`<path d="M1 1H${w - fold}L${w - 1} ${fold}V${h - 1}H1Z" fill="none" stroke="#7597c5" stroke-width="1.8"/><path d="M${w - fold} 1V${fold}H${w - 1}" fill="#e4efff" stroke="#7597c5" stroke-width="1.8" stroke-linejoin="round"/>`, w, h);
    }
    if (id === "animation-outline") {
      front2.style.cssText += "border:3px solid #16376d;";
      back.style.cssText += "box-shadow:var(--sap-shadow-step) var(--sap-shadow-step) 0 #c8e2fc;";
      front2.innerHTML = `<div style="position:absolute;inset:5px;border:1px solid #d0e5fb;border-radius:${Math.max(2, radius - 6)}px"></div>`;
    }
    if (id === "shadow-card") {
      front2.style.cssText += "border:1px solid #e2ebf5;";
      back.style.cssText += "box-shadow:0 10px 25px #183b6621;";
    }
  }
  function applyStageAppearance(root, value, options = {}) {
    const appearance = normalizeAppearance(value);
    if (!root?.ownerDocument) return appearance;
    removeAppearance(root);
    root.dataset.appearanceFrame = appearance.frame;
    root.dataset.appearanceBackground = appearance.background;
    if (appearance.frame === "none" && appearance.background === "original") return appearance;
    const nodes = [...root.children].filter((node4) => node4.matches(".component-stage") || node4.matches(".fx-layer") && node4.dataset.effectSpace !== "canvas");
    if (!nodes.some((node4) => node4.matches(".component-stage"))) return appearance;
    const positive = (value2, fallback) => Number.isFinite(Number(value2)) && Number(value2) > 0 ? Number(value2) : fallback;
    const w = positive(options.width, positive(root.dataset.width, root.clientWidth || 1280));
    const h = positive(options.height, positive(root.dataset.height, root.clientHeight || 720));
    const small = Math.min(w, h);
    const isWindow = appearance.frame === "software-window";
    const padding = Math.min(isWindow ? 32 : 36, Math.max(4, small * (isWindow ? 0.04 : 0.05)));
    const edge = Math.min(isWindow ? 18 : 32, Math.max(3, small * (isWindow ? 0.025 : 0.044)));
    const bar = isWindow ? Math.min(28, Math.max(5, small * 0.032)) : 0;
    const scale = Math.min((w - padding * 2) / w, (h - padding * 2 - bar) / h);
    const x = (w - w * scale) / 2, y = bar + (h - bar - h * scale) / 2;
    const doc = root.ownerDocument;
    ensureCSS(doc);
    const stage = doc.createElement("div");
    stage.dataset.appearanceStage = "";
    stage.style.setProperty("--sap-bar", bar + "px");
    stage.style.setProperty("--sap-radius", Math.min(22, small * 0.03) + "px");
    stage.style.setProperty("--sap-dot", Math.min(7, Math.max(2, bar * 0.24)) + "px");
    stage.style.setProperty("--sap-handle", Math.min(4, Math.max(1, bar * 0.14)) + "px");
    stage.style.setProperty("--sap-window-padding", Math.min(16, Math.max(5, small * 0.025)) + "px");
    stage.style.setProperty("--sap-shadow-step", Math.min(8, small * 0.012) + "px");
    const background = doc.createElement("div");
    background.className = "sap-background";
    background.dataset.appearanceBackground = appearance.background;
    background.setAttribute("aria-hidden", "true");
    background.innerHTML = backgroundMarkup(appearance.background, w, h);
    stage.append(background);
    if (appearance.frame !== "none") {
      const back = doc.createElement("div"), front2 = doc.createElement("div");
      back.className = "sap-frame-back";
      front2.className = "sap-frame-front";
      for (const el of [back, front2]) {
        el.dataset.appearanceFrameLayer = appearance.frame;
        el.style.cssText = `left:${edge}px;top:${edge}px;width:${w - edge * 2}px;height:${h - edge * 2}px;`;
        el.setAttribute("aria-hidden", "true");
      }
      decorateFrame(back, front2, appearance.frame, w - edge * 2, h - edge * 2, Math.min(22, small * 0.03));
      stage.append(back, front2);
    }
    const content2 = doc.createElement("div");
    content2.dataset.appearanceContent = "";
    content2.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:scale(${scale});`;
    stage.append(content2);
    const saved = nodes.map((node4) => {
      const anchor = doc.createComment("stage appearance slot");
      root.insertBefore(anchor, node4);
      content2.append(node4);
      return { node: node4, anchor };
    });
    root.append(stage);
    root.classList.add("sap-active");
    applied.set(root, { stage, nodes: saved });
    return appearance;
  }

  // component-props-overrides.mjs
  var propsRules = {};
  var add = (ids, source2, entries) => {
    for (const id of ids.split(" ")) {
      const target = propsRules[id] ??= [];
      for (const [path2, rule] of Object.entries(entries)) target.push({ path: path2, ...rule, "x-evidence": { kind: "renderer", source: source2 } });
    }
  };
  var a = (min, max) => ({ type: "array", ...min === void 0 ? {} : { minItems: min }, ...max === void 0 ? {} : { maxItems: max } });
  var n3 = (min, max, integer2 = false) => ({ type: integer2 ? "integer" : "number", ...min === void 0 ? {} : { minimum: min }, ...max === void 0 ? {} : { maximum: max }, "x-numericString": true });
  var e = (...values) => ({ type: "string", enum: values });
  var s = { type: "string" };
  var b = { type: "boolean" };
  var obj = (properties) => ({ type: "object", properties, additionalProperties: true });
  var list5 = (items) => ({ type: "array", items });
  var union = (...anyOf) => ({ anyOf });
  var textOrNumber = union(s, { type: "number" });
  var point2 = obj({ x: n3(0, 1), y: n3(0, 1) });
  add("ani-order-filter ani-compare-extract", "families/animation-style-analysis.mjs:11", { rows: a(5, 5), headers: a(4, 4), month: { type: "string", pattern: "^\\d{4}-\\d{2}$" } });
  add("ani-compare-extract", "families/animation-style-analysis.mjs:192", { fields: a(4, 4), leftSteps: a(2, 2), rightSteps: a(2, 2) });
  add("ani-notice-check", "families/animation-style.mjs:32", { rows: a(4, 4) });
  add("ani-tool-workbench", "families/animation-style-learning.mjs:57", { tags: a(2, 2) });
  add("ani-file-collection", "families/animation-style-learning.mjs:76", { files: a(3, 3) });
  add("ani-method-transfer", "families/animation-style-learning.mjs:95", { steps: a(3, 3) });
  add("ani-knowledge-network", "families/animation-style-learning.mjs:126", { fields: a(3, 3), steps: a(2, 2) });
  add("ani-capability-tiles", "families/animation-style-learning.mjs:149", { tiles: a(6, 6) });
  add("ani-processing-machine", "families/animation-style-objects.mjs:11", { inputs: a(3, 3), outputs: a(3, 3) });
  add("ani-question-outro", "families/animation-style-objects.mjs:20", { examples: a(2, 2), "examples.*.lines": a(0, 3) });
  var control = "families/animation-style-atoms-controls.mjs";
  var controlSizes = { window: [260, 140], tabs: [240, 56], address: [220, 42], button: [100, 42], input: [220, 50], status: [110, 44], checkbox: [60, 38], cursor: [50, 70] };
  for (const [id, [w, h]] of Object.entries(controlSizes)) add("ani-atom-" + id, control, { x: n3(0, 1240), y: n3(0, 700), objectWidth: n3(w, 1220), objectHeight: n3(h, 660) });
  add("ani-atom-window", control, { chromeHeight: n3(36, 84) });
  add("ani-atom-tabs", control, { tabs: a(1, 5), activeTab: n3(0, 4, true) });
  add("ani-atom-button", control, { state: e("normal", "pressed", "disabled"), accent: e("blue", "green", "orange", "neutral"), icon: e("none", "play", "plus", "check", "arrow") });
  add("ani-atom-input", control, { state: e("empty", "input", "error") });
  add("ani-atom-status", control, { state: e("success", "pending", "error", "neutral", "info") });
  add("ani-atom-checkbox", control, { state: e("unchecked", "checked", "error") });
  add("ani-atom-cursor", control, { mode: e("pointer", "click"), accent: e("blue", "green", "orange") });
  add("ani-atom-cell ani-atom-table-row", "families/animation-style-atoms-data.mjs:5", { x: n3(0, 1200), y: n3(0, 650), objectHeight: n3(80, 480) });
  add("ani-atom-cell", "families/animation-style-atoms-data.mjs:9", { objectWidth: n3(140, 1220), tone: e("blue", "green", "orange", "gray", "white") });
  add("ani-atom-table-row", "families/animation-style-atoms-data.mjs:54", { objectWidth: n3(360, 1220), cells: { ...a(2, 6), items: union(s, obj({ text: textOrNumber, tone: e("blue", "green", "orange", "gray", "white") })) }, weights: { ...a(0, 6), items: n3(0.5, 6) } });
  var diagram = "families/animation-style-atoms-diagram.mjs";
  for (const [id, w, h] of [["node", 190, 108], ["callout", 240, 132], ["highlight", 90, 54], ["progress", 360, 166], ["symbol", 100, 110]]) add("ani-atom-" + id, diagram, { x: n3(5, 1260), y: n3(5, 700), objectWidth: n3(w, 1250), objectHeight: n3(h, 690), tone: e("blue", "green", "orange", "ink"), state: e("normal", "active", "complete", "warning") });
  add("ani-atom-node", diagram, { shape: e("step", "decision", "terminal") });
  add("ani-atom-callout", diagram, { direction: e("none", "top", "right", "bottom", "left"), pointerOffset: n3(0, 1) });
  add("ani-atom-highlight", diagram, { shape: e("rectangle", "circle", "underline"), lineWidth: n3(2, 12), fillOpacity: n3(0, 0.25) });
  add("ani-atom-progress", diagram, { value: n3(0, 100), steps: a(2, 6) });
  add("ani-atom-symbol", diagram, { kind: e("magnifier", "pencil", "gear", "link", "check", "document", "documents", "table", "calendar", "people"), rotation: n3(-180, 180) });
  var paper2 = "families/animation-style-atoms-paper.mjs";
  add("ani-atom-file ani-atom-document ani-atom-folder", paper2, { objectWidth: n3(80, 1200), objectHeight: n3(80, 680), accent: e("blue", "green", "orange", "purple") });
  add("ani-atom-file", paper2, { fileType: e("image", "table", "text") });
  add("ani-atom-document", paper2, { rows: a(1, 6) });
  add("ani-atom-folder", paper2, { fileLabels: a(0, 4) });
  var parts2 = "families/animation-style-atoms-paper-parts.mjs";
  add("ani-atom-paper ani-atom-text ani-atom-document-row ani-atom-file-stack ani-atom-title-label", parts2, { x: n3(-1280, 1280), y: n3(-720, 720), objectWidth: n3(80, 1240), objectHeight: n3(80, 700) });
  add("ani-atom-paper", parts2, { objectWidth: n3(160, 1240), objectHeight: n3(140, 700), depth: n3(0, 18), foldSize: n3(16, 100), lineSpacing: n3(24, 64), foldSide: e("left", "right"), ruling: e("none", "lines", "grid") });
  add("ani-atom-text", parts2, { objectWidth: n3(160, 1240), fontSize: n3(20, 64), titleSize: n3(24, 76), lineHeight: n3(1.2, 1.9), align: e("left", "center", "right"), variant: e("paragraph", "bullets"), accent: e("blue", "green", "orange", "purple") });
  add("ani-atom-document-row", parts2, { objectWidth: n3(340, 1240), objectHeight: n3(88, 700), fontSize: n3(22, 42), status: e("none", "pending", "complete", "warning"), accent: e("blue", "green", "orange", "purple") });
  add("ani-atom-file-stack", parts2, { files: a(2, 5), layout: e("stack", "fan"), "files.*.fileType": e("image", "table", "text"), "files.*.accent": e("blue", "green", "orange", "purple") });
  add("ani-atom-title-label", parts2, { variant: e("filled", "outline"), accent: e("blue", "green", "orange", "purple") });
  var ui = "families/animation-style-atoms-ui.mjs";
  add("ani-atom-table ani-atom-browser", ui, { x: n3(0, 1200), y: n3(0, 650), objectWidth: n3(100, 1240), objectHeight: n3(100, 680) });
  add("ani-atom-table", ui, { columns: a(2, 6), "columns.*.weight": n3(0.5, 6), rows: { ...a(1, 8), items: { type: "object", properties: {}, additionalProperties: union(textOrNumber, obj({ label: s, tone: e("blue", "green", "orange", "gray", "ink") })) } } });
  add("ani-atom-browser", ui, { tabs: a(1, 3), activeTab: n3(0, 2, true), body: a(0, 3), items: a(0, 4), imageFit: e("contain", "cover") });
  add("ani-atom-connector", ui, { kind: e("straight", "curve", "elbow"), tone: e("blue", "green", "orange", "gray", "ink"), lineWidth: n3(3, 14), cornerRadius: n3(0, 80), controlPoints: { ...a(2, 2), items: obj({ x: n3(8, 1272), y: n3(8, 712) }) }, waypoints: { ...a(0, 6), items: obj({ x: n3(8, 1272), y: n3(8, 712) }) }, labelX: n3(30, 1250), labelY: n3(30, 690) });
  var transfer = "transfer-primitives.mjs";
  add("ani-atom-truck ani-atom-cargo ani-atom-warehouse ani-atom-buffer ani-atom-resource ani-atom-relation-bridge", "families/animation-style-transfer-atoms.mjs:11", { x: n3(0, 1270), y: n3(0, 710), objectWidth: n3(100, 1240), objectHeight: n3(80, 690) });
  add("ani-atom-truck", transfer, { load: n3(0, 4, true) });
  add("ani-atom-cargo", transfer, { tone: e("blue", "green", "orange") });
  add("ani-atom-warehouse", transfer, { stock: n3(0, 6, true) });
  add("ani-atom-buffer", transfer, { capacity: n3(1, 8, true), occupied: n3(0, 8, true), kinds: { ...a(1), items: e("image", "cup", "lamp", "bag") }, state: e("normal", "warning", "released") });
  add("ani-atom-resource", transfer, { kind: e("image", "cup", "lamp", "bag") });
  add("ani-atom-relation-bridge", transfer, { width: n3(160, 1e3), direction: e("down", "up") });
  add("ani-transfer-purpose-fork", transfer, { leftLines: a(0, 4), rightLines: a(0, 4) });
  add("ani-transfer-context-bridge ani-transfer-relationship-map ani-transfer-copy-verify", transfer, { windowLines: a(0, 4) });
  add("ani-transfer-field-reuse", transfer, { labels: a(3, 3), sourceValues: a(3, 3), targetValues: a(3, 3) });
  add("ani-transfer-capacity-limit", "families/animation-style-transfer-scenes.mjs", { itemLabels: a(3, 3), kinds: { ...a(3, 3), items: e("image", "cup", "lamp", "bag") } });
  add("ani-transfer-batch-delivery ani-transfer-batch-cycle", "families/animation-style-transfer-scenes.mjs", { phaseLabels: a(4, 4) });
  add("ani-transfer-batch-cycle", "families/animation-style-transfer-scenes.mjs", { itemLabels: a(3, 3) });
  add("ani-transfer-relationship-map", "families/animation-style-transfer-scenes.mjs", { steps: a(3, 3) });
  add("ani-transfer-copy-verify", "families/animation-style-transfer-scenes.mjs", { sourceFiles: a(0, 4), copyFiles: a(0, 4), checks: a(3, 3), checkResults: a(3, 3) });
  add("ani-transfer-guided-steps", "families/animation-style-transfer-scenes.mjs", { questionLines: a(0, 4), actions: a(3, 3), phaseLabels: a(3, 3) });
  var brg = "families/broll-graphics.mjs";
  add("broll-brief-desk", brg, { checklist: a(0, 4), notes: a(0, 4) });
  add("broll-message-pile", brg, { messages: a(0, 3), fields: a(0, 4) });
  add("broll-revision-stack", brg, { earlier: a(0, 2), "earlier.*.lines": a(0, 3), checks: a(0, 4) });
  var brm = "families/broll-media.mjs";
  add("broll-cutaway broll-detail", brm, { mediaType: e("image", "video"), mediaX: n3(0, 100), mediaY: n3(0, 100), mediaStart: n3(0, 86400) });
  add("broll-sequence", brm, { media: a(3, 3), "media.*.type": e("image", "video"), "media.*.x": n3(0, 100), "media.*.y": n3(0, 100), "media.*.mediaStart": n3(0, 86400) });
  add("broll-detail", brm, { notes: a(0, 3), focusWidth: n3(10, 75), focusHeight: n3(10, 65), focusX: n3(0, 100), focusY: n3(0, 100) });
  var brw = "families/broll-workflows.mjs";
  add("broll-document-scan", brw, { lines: a(0, 4), fields: a(0, 3) });
  add("broll-search-focus", brw, { results: a(1, 3), selected: n3(0, 2, true) });
  add("broll-calendar-pin", brw, { weekdays: a(7, 7), selectedDay: n3(1, 28, true) });
  add("broll-folder-sort", brw, { groups: a(0, 3) });
  add("broll-edit-timeline", brw, { ruler: a(0, 5), tracks: a(0, 3), "tracks.*.clips": a(0, 5), "tracks.*.clips.*.start": n3(0, 0.95), "tracks.*.clips.*.end": n3(0.04, 1) });
  add("broll-voice-transcript", brw, { segments: a(0, 3) });
  add("broll-focus-timer", brw, { tasks: a(0, 3) });
  add("broll-document-scan broll-search-focus broll-voice-transcript", brw, { sourceSide: e("left", "right") });
  add("broll-document-scan broll-voice-transcript", brw, { resultLayout: e("rows", "cards") });
  var apple = "apple-ui.mjs:2,11";
  var appleLimits = {
    "mac-finder": { files: 14 },
    "mac-safari": { tabs: 5, navigation: 3, sidebarItems: 4, sections: 4, commands: 2 },
    "mac-terminal": { lines: 18 },
    "mac-system-settings": { rows: 10 },
    "mac-spotlight": { results: 7 },
    "mac-notification-center": { events: 5 },
    "mac-notes": { notes: 20, noteSummaries: 20, paragraphs: 20, checklist: 20 },
    "mac-calendar": { events: 20 },
    "mac-mail": { messages: 8, paragraphs: 20 },
    "mac-preview": { paragraphs: 20, steps: 4 },
    "mac-activity-monitor": { rows: 14 },
    "mac-file-dialog": { files: 14 },
    "mac-context-menu": { items: 18, submenu: 7, files: 14 },
    "mac-dock": { desktopFiles: 5, apps: 12 },
    "ios-settings": { groups: 4, "groups.*.rows": 20 },
    "ios-messages": { messages: 8 },
    "ios-safari": { sections: 4 },
    "ios-notes": { paragraphs: 20, checklist: 8 },
    "ios-share-sheet": { people: 4, apps: 4, actions: 6 },
    "ipad-split-view": { sections: 5, notes: 7, paragraphs: 20, checklist: 2 },
    "ipad-files": { files: 12 }
  };
  for (const [id, limits] of Object.entries(appleLimits)) add(id, apple, Object.fromEntries(Object.entries(limits).map(([path2, max]) => [path2, a(0, max)])));
  add("mac-control-center ios-control-center", "families/apple-macos.mjs / apple-mobile.mjs", { brightness: n3(0, 100), volume: n3(0, 100) });
  add("mac-calendar", "families/apple-macos-extra.mjs:30", { days: n3(28, 31, true), firstWeekday: n3(0, 6, true), today: n3(1, 31, true), "events.*.day": n3(1, 31, true) });
  add("mac-preview", "families/apple-macos-extra.mjs:91", { page: n3(1, void 0, true), pages: n3(1, void 0, true) });
  var edu = "families/education.mjs";
  add("before-after", edu, { tasks: a(0, 6), columns: a(0, 3) });
  add("flowchart", edu, { nodes: a(5, 5), branchLabels: a(0, 2) });
  add("layer-stack", edu, { layers: a(3, 3) });
  add("bar-chart", edu, { values: a(2, 6), "values.*.value": n3(0), max: { ...n3(0), exclusiveMinimum: 0 }, highlight: n3(0, 5, true) });
  add("line-chart", edu, { values: a(2, 10), "values.*.value": n3(0), max: { ...n3(0), exclusiveMinimum: 0 }, target: n3(0), selected: n3(0, 9, true) });
  add("comparison-matrix", edu, { columns: a(2, 3), rows: a(0, 5), "rows.*.values": a(0, 3) });
  add("event-timeline", edu, { events: a(2, 5), "events.*.status": e("done", "active", "todo") });
  add("metric-dashboard", edu, { metrics: a(3, 3), "metrics.*.progress": n3(0, 1), progress: { ...a(2, 8), items: n3(0, 100) }, progressLabels: a(0, 8), checks: a(0, 5) });
  add("definition-card", edu, { factors: a(0, 3) });
  add("chapter-summary", edu, { points: a(0, 3) });
  add("media-stage", edu, { diagramNodes: a(0, 3), notes: a(0, 3), mediaKind: e("image", "video") });
  add("annotation-callout", edu, { fields: a(3, 3), callouts: a(3, 3), subjectTitle: { maxLength: 18 }, subjectSubtitle: { maxLength: 26 }, "fields.*.label": { maxLength: 3 }, "fields.*.value": { maxLength: 18 }, "callouts.*.title": { maxLength: 9 }, "callouts.*.detail": { maxLength: 16 } });
  var edx = "families/education-expanded.mjs";
  add("donut-chart", edx, { items: a(2, 6), "items.*.value": n3(0) });
  add("scatter-plot", edx, { points: a(2, 12), xMax: { ...n3(0), exclusiveMinimum: 0 }, yMax: { ...n3(0), exclusiveMinimum: 0 }, "points.*.x": n3(0), "points.*.y": n3(0) });
  add("heatmap", edx, { columns: a(2, 7), rows: a(2, 5), "rows.*.values": { ...a(2, 7), items: n3(0) }, max: { ...n3(0), exclusiveMinimum: 0 } });
  add("funnel-chart", edx, { stages: a(2, 5), "stages.*.value": n3(0) });
  add("radar-chart", edx, { axes: a(3, 7), values: { ...a(3, 7), items: n3(0) }, max: { ...n3(0), exclusiveMinimum: 0 } });
  add("pyramid-diagram", edx, { layers: a(3, 5) });
  add("mind-map", edx, { branches: a(3, 6) });
  add("cycle-diagram", edx, { steps: a(4, 4) });
  add("architecture-map", edx, { layers: a(3, 3), "layers.*.items": a(3, 3) });
  add("swimlane-flow", edx, { lanes: a(3, 3), "lanes.*.tasks": a(1, 5), "lanes.*.tasks.*.column": n3(0, 4, true) });
  add("kanban-board", edx, { columns: a(3, 3), "columns.*.tasks": a(1, 4) });
  add("roadmap", edx, { tasks: a(2, 5), weeks: a(4, 4), "tasks.*.start": n3(0, 4), "tasks.*.end": n3(0, 4) });
  add("formula-breakdown", edx, { terms: a(3, 3), operators: a(2, 2) });
  add("spectrum-scale", edx, { markers: a(2, 6), "markers.*.value": n3(0, 100) });
  add("process-steps", edx, { steps: a(3, 5) });
  add("lecture-stage", edx, { "media.kind": e("image", "video"), "media.fit": e("contain", "cover") });
  var messages = obj({ id: s, role: e("user", "assistant"), state: e("idle", "draft", "running", "complete"), text: s, paragraphs: list5(s), heading: s, bullets: list5(s), fields: list5(obj({ label: s, value: textOrNumber })), visible: b, actions: b, linkLabel: s, linkNote: s, status: s });
  var tools = list5(union(s, obj({ icon: s, label: s })));
  add("doubao-chat doubao-workflow", "families/doubao-chat.mjs / doubao-work.mjs", { "messages": list5(messages), recentTasks: list5(union(s, obj({ title: s, active: b }))), navigation: list5(obj({ label: s, icon: s, active: b })) });
  add("doubao-chat", "families/doubao-chat.mjs:34", { "composer.maxTools": n3(0, 5, true), "composer.tools": tools });
  var attachment = union(s, obj({ id: s, name: s, detail: s }));
  var toolEvent = obj({ id: s, state: e("idle", "queued", "running", "complete", "error"), status: e("idle", "queued", "running", "complete", "error"), kind: e("file", "command"), label: s, summary: s, command: s, detail: s, action: s });
  var table2 = obj({ title: s, badge: s, note: s, state: e("idle", "queued", "running", "complete", "error"), columns: list5(obj({ key: s, label: s })), rows: list5({ type: "object", properties: {}, additionalProperties: textOrNumber }), selectedIds: list5(textOrNumber), includedIds: list5(textOrNumber), summary: s, disclosure: s });
  add("codex-workflow", "families/codex-workflow.mjs", {
    panelWidth: n3(320, 520),
    messages: list5(obj({ id: s, role: e("user", "assistant"), state: e("idle", "queued", "running", "complete", "error"), text: union(s, list5(s)), elapsed: s, attachments: list5(attachment), bullets: list5(s), toolEvents: list5(toolEvent), result: table2, actions: b })),
    toolEvents: list5(toolEvent),
    panel: union({ type: "null" }, obj({ kind: e("table", "document"), title: s, heading: s, paragraphs: list5(s), code: s, table: table2 })),
    "composer.attachments": list5(attachment),
    "sidebar.items": list5(union(s, obj({ id: s, label: s, icon: s, active: b })))
  });
  add("doubao-workflow", "families/doubao-work.mjs:59", { "panel.artifacts": list5(union(s, obj({ name: s }))), "panel.files": list5(union(s, obj({ name: s }))) });
  add("data-table", "families/developer.mjs:683", { rows: list5({ type: "object", properties: {}, additionalProperties: textOrNumber }) });
  add("iphone-screen ipad-screen", "families/systems.mjs:20", { battery: n3(0, 100) });
  add("chrome-browser iphone-screen ipad-screen", "families/systems.mjs:22", { "media.kind": e("demo", "image", "video"), "media.fit": e("contain", "cover") });
  add("settings-panel", "families/systems.mjs:583", { brightness: n3(0, 100) });
  add("notification-stack", "families/systems.mjs:700", { monthDays: n3(28, 31, true), monthStartOffset: n3(0, 6, true), selectedDay: n3(1, 31, true), weekdayLabels: a(7, 7) });
  var strictNum = (min, max) => ({ type: "number", minimum: min, maximum: max });
  var region = obj({ x: strictNum(0, 1), y: strictNum(0, 1), width: strictNum(1e-3, 1), height: strictNum(1e-3, 1), start: strictNum(0, 1), end: strictNum(0, 1), kind: e("frame", "spotlight", "arrow"), label: s });
  region.required = ["x", "y", "width", "height"];
  var keyframe = obj({ at: strictNum(0, 1), x: strictNum(0, 1), y: strictNum(0, 1), zoom: strictNum(1, 4), ease: s });
  keyframe.required = ["at", "x", "y", "zoom"];
  var mediaProperties = { type: e("image", "video"), src: { type: "string", minLength: 1 }, alt: s, width: strictNum(1, 32e3), height: strictNum(1, 32e3), fit: e("contain", "cover"), maxZoom: strictNum(1, 4), sourceStart: strictNum(0, 86400), sourceDuration: strictNum(0.01, 86400), label: s, title: s, caption: s, camera: { type: "array", minItems: 2, items: keyframe }, regions: list5(region) };
  var panel4 = obj(mediaProperties);
  panel4.required = ["type", "src", "width", "height"];
  var shot = obj({ ...mediaProperties, start: strictNum(0, 1), end: strictNum(0, 1), transition: e("cut", "dissolve", "push"), transitionSeconds: strictNum(0.05, 2), splitAt: strictNum(0, 0.9), splitFrom: b, noteLabel: s, noteTitle: s, notes: { ...a(0, 4), items: s }, layout: e("full", "pip", "compare", "wipe", "triptych", "collage", "focus"), mediaPanels: list5(panel4), focus: obj({ ...point2.properties, zoom: strictNum(1, 4), label: s }), wipeAt: strictNum(0, 0.6), wipeRest: strictNum(0.05, 0.95) });
  shot.required = ["type", "src", "width", "height", "start", "end"];
  add("mixed-media-sequence", "mixed-media-motion.mjs:24", { strength: e("still", "light", "standard", "emphasis"), previewDuration: strictNum(0.1, 600), media: { ...a(1, 12), items: shot } });
  var schemaConditions = {
    "ani-atom-browser": [{ when: "imageSrc is non-empty", hidden: ["heading", "body", "items"], reason: "imageSrc replaces the native page body" }],
    "ani-atom-folder": [{ when: "open is false", hidden: ["fileLabels"], reason: "closed folders conceal files" }],
    "ani-atom-input": [{ when: "state is empty", hidden: ["value", "errorText"], reason: "placeholder is displayed" }, { when: "state is input", hidden: ["placeholder", "errorText"], reason: "value is displayed" }],
    "ani-atom-connector": [{ when: "kind is straight", hidden: ["controlPoints", "waypoints"], reason: "straight connectors use endpoints only" }, { when: "kind is curve", hidden: ["waypoints"], reason: "curve uses two controlPoints" }, { when: "kind is elbow", hidden: ["controlPoints"], reason: "elbow uses waypoints" }],
    "media-stage": [{ when: "mediaSrc is non-empty", hidden: ["diagramNodes"], reason: "media replaces the native diagram" }],
    "lecture-stage": [{ when: "media.src is non-empty", hidden: ["sections", "chapter"], reason: "media replaces the native slide" }],
    "mixed-media-sequence": [{ when: "media[].layout is focus", hidden: ["media[].camera"], reason: "focus layout uses focus coordinates" }, { when: "media[].splitAt is absent", hidden: ["media[].notes", "media[].noteTitle", "media[].noteLabel"], reason: "explanation panel is not opened" }]
  };

  // component-props.mjs
  var clone = (value) => structuredClone(value);
  var isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  var type = (value) => value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
  var same = (a2, b2) => JSON.stringify(a2) === JSON.stringify(b2);
  function infer(values) {
    const groups = /* @__PURE__ */ new Map();
    for (const value of values) {
      const t2 = type(value);
      if (!groups.has(t2)) groups.set(t2, []);
      groups.get(t2).push(value);
    }
    if (!groups.size) return { "x-evidence": { kind: "open", reason: "No default item; renderer-specific optional schema may extend this." } };
    if (groups.size > 1) return { anyOf: [...groups.values()].map(infer), "x-evidence": { kind: "defaults-structure" } };
    const [[t, samples]] = groups;
    const schema = { type: t, "x-evidence": { kind: "defaults-structure" } };
    if (t === "object") {
      schema.properties = {};
      schema.additionalProperties = true;
      for (const key of new Set(samples.flatMap(Object.keys))) schema.properties[key] = infer(samples.filter((x) => Object.hasOwn(x, key)).map((x) => x[key]));
    } else if (t === "array") schema.items = infer(samples.flat());
    return schema;
  }
  function ruleAt(root, path2, rule) {
    const parts3 = path2.split(".");
    let cursor = root;
    for (const key2 of parts3.slice(0, -1)) {
      if (key2 === "*") {
        cursor.type = "array";
        cursor.items ??= {};
        cursor = cursor.items;
      } else {
        cursor.type = "object";
        cursor.properties ??= {};
        cursor.properties[key2] ??= {};
        cursor = cursor.properties[key2];
      }
    }
    const last = parts3.at(-1), container = last === "*" ? cursor : cursor.properties ??= {}, key = last === "*" ? "items" : last;
    const previous = container[key] || {};
    container[key] = { ...previous, ...clone(rule) };
    if (rule.anyOf) delete container[key].type;
    if (rule.type) delete container[key].anyOf;
  }
  function addDefaults(schema, value) {
    schema.default = clone(value);
    if (isObject(value) && schema.properties) {
      for (const [key, v] of Object.entries(value)) if (schema.properties[key]) addDefaults(schema.properties[key], v);
    }
  }
  function getPropsSchema(component2) {
    if (!component2 || typeof component2.id !== "string" || !isObject(component2.defaults)) throw Error("getPropsSchema requires a component with id and defaults");
    const schema = infer([component2.defaults]);
    if (component2.id.includes("-hd-")) {
      const number9 = (min, max) => ({ type: "number", minimum: min, maximum: max });
      schema.properties.layers = { type: "array", minItems: 1, maxItems: 160, items: { anyOf: parts.map((part2) => ({ type: "object", required: ["id", "part", "x", "y", "width", "height", "props", "enter", "exit", "fade", "fromX", "fromY", "steps"], additionalProperties: false, properties: { id: { type: "string", pattern: "^[a-z][a-z0-9-]*$" }, part: { type: "string", enum: [part2.key] }, x: number9(0, 1280), y: number9(0, 720), width: number9(1, 1280), height: number9(1, 720), props: { ...infer([part2.defaults]), description: part2.description }, enter: number9(0, 7.8), exit: number9(0.1, 8), fade: number9(0, 0.8), fromX: number9(-1280, 1280), fromY: number9(-720, 720), steps: { type: "array", maxItems: 12, items: { type: "object", required: ["at", "duration", "x", "y", "ease"], additionalProperties: false, properties: { at: number9(0, 8), duration: number9(0.01, 8), x: number9(-1280, 1280), y: number9(-720, 720), ease: { type: "string", enum: ["none", "sine.inOut", "power2.inOut", "power2.out"] } } } } } })) }, description: "Ordered SVG layers. Each part is independent. Timeline is native 0\u20138 seconds; timing.duration retimes it. props supports ONLY the selected part fields. Placement remains separate from motion; list order is paint order." };
    }
    if (component2.id.includes("-hd-")) {
      schema.properties.style = clone(styleSchema);
      for (const variant of schema.properties.layers.items.anyOf) {
        const key = variant.properties.part.enum[0];
        Object.assign(variant.properties.props.properties, clone(partRules[key] || {}));
        variant.properties.style = clone(styleSchema);
      }
    }
    for (const { path: path2, ...rule } of propsRules[component2.id] || []) ruleAt(schema, path2, rule);
    schema.properties.transitionNext = { type: "object", properties: { component: { type: "string" }, props: { type: "object", additionalProperties: true, "x-openKeys": true } }, required: ["component"], additionalProperties: true, "x-evidence": { kind: "runtime", source: "component-runtime.mjs / export-director-scene.mjs" }, description: "Explicit second scene for a transition; its props are validated against that component separately." };
    addDefaults(schema, component2.defaults);
    return { $schema: "https://json-schema.org/draft/2020-12/schema", ...schema, title: component2.id + " props", "x-merge": "Shallow merge component defaults with supplied props; nested objects and arrays replace the whole field.", "x-unknownProperties": "warn", "x-conditions": clone(schemaConditions[component2.id] || []), "x-rendererValidation": true, "x-validationNote": "Structure is inferred from all default examples; explicit bounds and enums cite renderer evidence. Geometry/text fit and remaining semantic checks also run the actual renderer. No inferred array maxima or invented string limits." };
  }
  function walk(schema, value, path2, errors, warnings, { strictUnknown = false } = {}) {
    const issue = (code, message4) => errors.push({ path: path2, code, message: message4 });
    if (schema.anyOf) {
      const alternatives = schema.anyOf.map((s2) => {
        const e2 = [], w = [];
        walk(s2, value, path2, e2, w, { strictUnknown });
        return { e: e2, w };
      });
      const match = alternatives.find((x) => !x.e.length);
      if (match) warnings.push(...match.w);
      else issue("type", "Value does not match any supported shape (" + schema.anyOf.map((s2) => s2.type || "union").join(", ") + ")");
      return;
    }
    const actual = type(value), expected = schema.type;
    const numeric = (expected === "number" || expected === "integer") && schema["x-numericString"] && actual === "string" && value.trim() !== "" && Number.isFinite(Number(value));
    if (expected && (expected === "integer" ? actual !== "number" && !numeric || !Number.isInteger(Number(value)) : actual !== expected && !numeric)) {
      issue("type", `Expected ${expected}, received ${actual}`);
      return;
    }
    if (numeric) warnings.push({ path: path2, code: "numeric-string", message: "Legacy numeric string accepted; use a JSON number for new configurations." });
    if (schema.enum && !schema.enum.some((x) => same(x, value))) issue("enum", "Use one of: " + schema.enum.map(String).join(", "));
    if (actual === "number" || numeric) {
      const number9 = Number(value);
      if (!Number.isFinite(number9)) issue("finite", "Number must be finite");
      if (schema.minimum !== void 0 && number9 < schema.minimum) issue("minimum", `Must be >= ${schema.minimum}`);
      if (schema.maximum !== void 0 && number9 > schema.maximum) issue("maximum", `Must be <= ${schema.maximum}`);
      if (schema.exclusiveMinimum !== void 0 && number9 <= schema.exclusiveMinimum) issue("exclusiveMinimum", `Must be > ${schema.exclusiveMinimum}`);
    }
    if (actual === "string") {
      const count2 = [...value].length;
      if (schema.minLength !== void 0 && count2 < schema.minLength) issue("minLength", `Requires at least ${schema.minLength} characters`);
      if (schema.maxLength !== void 0 && count2 > schema.maxLength) issue("maxLength", `Supports at most ${schema.maxLength} characters`);
      if (schema.pattern && !new RegExp(schema.pattern).test(value)) issue("pattern", "Must match " + schema.pattern);
    }
    if (actual === "array") {
      if (schema.minItems !== void 0 && value.length < schema.minItems) issue("minItems", `Requires at least ${schema.minItems} items; received ${value.length}`);
      if (schema.maxItems !== void 0 && value.length > schema.maxItems) issue("maxItems", `Supports at most ${schema.maxItems} items; received ${value.length}. Split the content or choose another layout; nothing will be truncated.`);
      if (schema.items) value.forEach((item, i) => walk(schema.items, item, `${path2}[${i}]`, errors, warnings, { strictUnknown }));
    }
    if (actual === "object") {
      for (const key of schema.required || []) if (!Object.hasOwn(value, key)) errors.push({ path: path2 + "." + key, code: "required", message: "Required field is missing" });
      for (const [key, v] of Object.entries(value)) {
        const child = schema.properties?.[key];
        if (child) walk(child, v, path2 + "." + key, errors, warnings, { strictUnknown });
        else if (isObject(schema.additionalProperties)) walk(schema.additionalProperties, v, path2 + "." + key, errors, warnings, { strictUnknown });
        else if (!schema["x-openKeys"]) {
          const issue2 = { path: path2 + "." + key, code: "unknown-field", message: "This field is not declared by the component. Verify its renderer support; it may have no visible effect." };
          (strictUnknown ? errors : warnings).push(issue2);
        }
      }
    }
  }
  function semanticChecks(component2, p, errors, warnings) {
    const id = component2.id, fail = (path2, message4) => errors.push({ path: "props." + path2, code: "relationship", message: message4 });
    const warn = (path2, message4) => warnings.push({ path: "props." + path2, code: "inactive-field", message: message4 });
    const changed = (path2) => {
      const get = (obj2) => path2.split(".").reduce((x, k) => x?.[k], obj2);
      return get(p) !== void 0 && !same(get(p), get(component2.defaults));
    };
    const hidden = (path2, why) => {
      if (changed(path2)) warn(path2, why);
    };
    const index = (key, items, { allowNone = false } = {}) => {
      if (Array.isArray(items) && p[key] !== void 0) {
        const v = Number(p[key]);
        if (!Number.isInteger(v) || v < (allowNone ? -1 : 0) || v >= items.length) fail(key, `Index must address an existing item${allowNone ? " or use -1 for none" : ""}; received ${p[key]}, count ${items.length}`);
      }
    };
    const sameLength = (key, other) => {
      if (Array.isArray(p[key]) && Array.isArray(p[other]) && p[key].length !== p[other].length) fail(key, `Length must equal ${other} (${p[other].length})`);
    };
    if (["ani-atom-tabs", "ani-atom-browser", "iphone-screen"].includes(id)) index("activeTab", p.tabs);
    if (id === "ipad-screen") index("selectedSidebar", p.sidebar, { allowNone: true });
    if (id === "settings-panel") index("selectedNav", p.nav, { allowNone: true });
    if (id === "chrome-browser") index("activePage", p.sidebar, { allowNone: true });
    if (id === "form-panel") index("activeNav", p.nav, { allowNone: true });
    if (["windows-file-dialog", "file-explorer"].includes(id)) index("selected", p.files, { allowNone: true });
    if (id === "command-palette") index("selected", p.commands, { allowNone: true });
    if (id === "context-menu") {
      index("selected", p.items, { allowNone: true });
      index("selectedSub", p.submenu, { allowNone: true });
    }
    if (id === "mac-context-menu") index("selected", p.items, { allowNone: true });
    if (id === "mac-dock") index("selected", p.apps, { allowNone: true });
    if (id === "broll-search-focus") index("selected", p.results);
    if (id === "bar-chart") index("highlight", p.values, { allowNone: true });
    if (id === "line-chart") index("selected", p.values, { allowNone: true });
    if (id === "ani-atom-buffer" && Number(p.occupied) > Number(p.capacity)) fail("occupied", "Must not exceed capacity");
    if (id === "ani-atom-table-row" && Array.isArray(p.weights) && p.weights.length > p.cells?.length) fail("weights", "Extra weights would be ignored; provide at most one per cell");
    if (id === "ani-atom-progress" && p.state === "complete" && Number(p.value) !== 100) fail("value", "Complete progress requires value 100");
    if (id === "ani-atom-text" && p.variant === "bullets" && p.align !== "left") fail("align", "Bullet text requires left alignment");
    if (id === "ani-atom-browser" && p.imageSrc) for (const key of ["heading", "body", "items"]) hidden(key, "imageSrc replaces the page body; this field is currently hidden.");
    if (id === "ani-atom-folder" && !p.open) hidden("fileLabels", "The closed folder conceals its files.");
    if (id === "ani-atom-input") for (const key of p.state === "empty" ? ["value", "errorText"] : p.state === "input" ? ["placeholder", "errorText"] : ["placeholder"]) hidden(key, "This field is hidden by input state " + p.state + ".");
    if (id === "ani-atom-connector") for (const key of p.kind === "straight" ? ["controlPoints", "waypoints"] : p.kind === "curve" ? ["waypoints"] : ["controlPoints"]) hidden(key, "This field does not control a " + p.kind + " connector.");
    if (id === "media-stage" && p.mediaSrc) hidden("diagramNodes", "The media source replaces the native diagram.");
    if (id === "lecture-stage" && p.media?.src) for (const key of ["chapter", "sections"]) hidden(key, "The media source replaces native slide content.");
    if (["chrome-browser", "iphone-screen", "ipad-screen"].includes(id) && p.media?.src && p.media.kind === "demo") fail("media.kind", "media.src is ignored with kind=demo; choose image or video.");
    if (id === "mac-calendar") {
      if (Number(p.days) + Number(p.firstWeekday) > 35) fail("firstWeekday", "This template has 35 cells; choose a layout supporting six weeks for this month.");
      if (Number(p.today) > Number(p.days)) fail("today", "Must be a day within this month");
      for (const [i, event] of (p.events || []).entries()) if (Number(event.day) > Number(p.days)) fail(`events[${i}].day`, "Must be a day within this month");
    }
    if (id === "mac-preview") {
      if (Number(p.page) > Number(p.pages)) fail("page", "Must not exceed pages");
      if (Number(p.pages) > 7) warnings.push({ path: "props.pages", code: "partial-preview", message: "Only the first seven page thumbnails are shown; the current page label remains editable." });
    }
    if (id === "notification-stack" && Number(p.selectedDay) > Number(p.monthDays)) fail("selectedDay", "Must be within monthDays");
    if (id === "broll-detail") for (const [axis, size] of [["X", "Width"], ["Y", "Height"]]) {
      const v = Number(p["focus" + axis]), half = Number(p["focus" + size]) / 2;
      if (v < half || v > 100 - half) fail("focus" + axis, "Focus rectangle must fit inside the source; move its center or reduce its size.");
    }
    if (id === "broll-edit-timeline") {
      for (const [ti, track] of (p.tracks || []).entries()) for (const [ci, clip2] of (track.clips || []).entries()) if (Number(clip2.end) - Number(clip2.start) < 0.04 - 1e-9) fail(`tracks[${ti}].clips[${ci}].end`, "Clip must span at least 0.04 of the track; increase end or reduce start.");
    }
    if (id === "comparison-matrix") {
      for (const [i, row] of (p.rows || []).entries()) if (row.values?.length !== p.columns?.length) fail(`rows[${i}].values`, "Each row must have exactly one value per column");
    }
    if (id === "metric-dashboard") sameLength("progressLabels", "progress");
    if (id === "radar-chart") sameLength("values", "axes");
    if (id === "roadmap") {
      for (const [i, t] of (p.tasks || []).entries()) if (Number(t.end) <= Number(t.start)) fail(`tasks[${i}].end`, "End must be after start");
    }
    const tableChecks = (table3, path2) => {
      if (!table3 || !Array.isArray(table3.columns) || !Array.isArray(table3.rows)) return;
      const keys = table3.columns.map((c) => c.key);
      if (new Set(keys).size !== keys.length) fail(path2 + "columns", "Column keys must be unique");
      for (const [i, row] of table3.rows.entries()) for (const key of Object.keys(row)) if (!keys.includes(key) && !["id", "orderId"].includes(key)) warnings.push({ path: "props." + path2 + `rows[${i}].` + key, code: "inactive-field", message: "No column displays this row field." });
    };
    if (id === "ani-atom-table" || id === "data-table") tableChecks(p, "");
    if (id === "codex-workflow") {
      if (!p.showSidebar) hidden("sidebar", "showSidebar is false.");
      for (const [i, m] of (p.messages || []).entries()) if (m.result) tableChecks(m.result, `messages[${i}].result.`);
      if (p.panel?.kind === "table") tableChecks(p.panel.table, "panel.table.");
    }
    if (["doubao-chat", "doubao-workflow"].includes(id)) {
      for (const [i, m] of (p.messages || []).entries()) if (m.visible === false) warnings.push({ path: `props.messages[${i}]`, code: "inactive-field", message: "visible=false hides this entire message." });
      if (id === "doubao-chat" && (p.composer?.tools?.length || 0) > Number(p.composer?.maxTools ?? 3)) warnings.push({ path: "props.composer.tools", code: "partial-preview", message: "Only maxTools items are shown; remaining tools appear as an overflow menu indicator." });
    }
    if (id === "mixed-media-sequence") for (const [i, m] of (p.media || []).entries()) {
      if (m.layout === "focus" && m.camera) warn(`media[${i}].camera`, "focus layout uses focus coordinates, not camera keyframes.");
      if (m.splitAt === void 0 && (m.notes?.length || m.noteTitle || m.noteLabel)) warn(`media[${i}].notes`, "No splitAt is configured, so the explanation text is hidden.");
      if (m.splitFrom && m.splitAt === void 0) fail(`media[${i}].splitFrom`, "splitFrom requires splitAt");
    }
  }
  function validateComponentProps(component2, props, { partial = false, render = true, strictUnknown = false } = {}) {
    const errors = [], warnings = [];
    if (!isObject(props)) return { ok: false, errors: [{ path: "props", code: "type", message: "props must be a JSON object" }], warnings };
    const resolved = partial ? { ...clone(component2.defaults), ...clone(props) } : props;
    walk(getPropsSchema(component2), resolved, "props", errors, warnings, { strictUnknown });
    if (!errors.length) {
      try {
        semanticChecks(component2, resolved, errors, warnings);
      } catch (error) {
        errors.push({ path: "props", code: "relationship", message: error.message });
      }
    }
    if (!errors.length && render) try {
      component2.render(normalizeMediaProps(resolved), helpers("props-validation"));
    } catch (error) {
      errors.push({ path: "props", code: "renderer", message: error.message });
    }
    return { ok: errors.length === 0, errors, warnings };
  }
  function assertComponentProps(component2, props, options = {}) {
    const result = validateComponentProps(component2, props, options);
    if (!result.ok) {
      const error = new Error(component2.id + ": " + result.errors.map((e2) => `${e2.path}: ${e2.message}`).join("; "));
      error.code = "INVALID_COMPONENT_PROPS";
      error.errors = result.errors;
      error.warnings = result.warnings;
      throw error;
    }
    return props;
  }

  // effect-contracts.mjs
  function markupMatches(markup, selector) {
    const root = { tag: "div", attrs: { class: "motion-wrap" }, parent: null, children: [] }, nodes = [root], stack = [root];
    const voids = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
    for (const token of markup.matchAll(/<!--[\s\S]*?-->|<\/?([a-z][\w:-]*)\b([^>]*?)>/gi)) {
      if (!token[1]) continue;
      const tag2 = token[1].toLowerCase();
      if (token[0].startsWith("</")) {
        for (let i = stack.length - 1; i > 0; i--) if (stack[i].tag === tag2) {
          stack.length = i;
          break;
        }
        continue;
      }
      const attrs = {};
      for (const a2 of token[2].matchAll(/([^\s=/'"<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s'"=<>`]+)))?/g)) attrs[a2[1]] = a2[2] ?? a2[3] ?? a2[4] ?? "";
      const node4 = { tag: tag2, attrs, parent: stack.at(-1), children: [] };
      node4.parent.children.push(node4);
      nodes.push(node4);
      if (!voids.has(tag2) && !token[0].endsWith("/>")) stack.push(node4);
    }
    const atom = (node4, s2) => {
      if (!node4) return false;
      const tag2 = /^(\*|[a-z][\w-]*)/i.exec(s2);
      if (tag2) {
        if (tag2[1] !== "*" && node4.tag !== tag2[1].toLowerCase()) return false;
        s2 = s2.slice(tag2[0].length);
      }
      while (s2) {
        let m;
        if (m = /^\.([\w-]+)/.exec(s2)) {
          if (!(node4.attrs.class || "").split(/\s+/).includes(m[1])) return false;
        } else if (m = /^#([\w-]+)/.exec(s2)) {
          if (node4.attrs.id !== m[1]) return false;
        } else if (m = /^\[([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\]]+)))?\]/.exec(s2)) {
          if (!(m[1] in node4.attrs)) return false;
          const v = m[2] ?? m[3] ?? m[4];
          if (v !== void 0 && node4.attrs[m[1]] !== v) return false;
        } else return false;
        s2 = s2.slice(m[0].length);
      }
      return true;
    };
    return String(selector || "").split(",").some((branch) => {
      const tokens2 = branch.trim().replace(/\s*>\s*/g, " > ").split(/\s+/).filter(Boolean);
      const match = (node4, i) => {
        if (i < 0) return true;
        if (!atom(node4, tokens2[i])) return false;
        if (i === 0) return true;
        if (tokens2[i - 1] === ">") return match(node4.parent, i - 2);
        for (let p = node4.parent; p; p = p.parent) if (match(p, i - 1)) return true;
        return false;
      };
      return tokens2.length > 0 && nodes.some((node4) => match(node4, tokens2.length - 1));
    });
  }
  var familyAliases = {
    "slide-in": "slide",
    "slide-out-left": "slide",
    "shared-slide": "slide",
    "zoom-focus": "zoom",
    "zoom-out-reveal": "zoom",
    "zoom-through": "zoom",
    "micro-dolly": "zoom",
    "frame-push": "zoom",
    "fade-in": "fade",
    "fade-out": "fade",
    "soft-dissolve": "dissolve",
    "wipe-transition": "wipe",
    "curve-ribbon": "wipe",
    "diagonal-ribbon": "wipe",
    "liquid-sweep": "wipe"
  };
  function describeEffect(effect) {
    if (!effect || effect.id === "none") return { role: "still", family: "still", controls: [], optionsSchema: { type: "object", properties: {}, additionalProperties: false }, requiresNextScene: false };
    const role = effect.category === "\u80CC\u666F" ? "background" : effect.category === "\u8F6C\u573A" ? "transition" : effect.exclusive || effect.id.startsWith("ani-") ? "internal" : effect.selector === ".motion-wrap" ? "wrapper" : "target";
    const properties = {};
    if (!["internal"].includes(role) && effect.id !== "media-sequence-motion") properties.background = { type: "string", description: "\u80CC\u666F\u6548\u679C ID\uFF1B\u4EC5\u4F5C\u7528\u4E8E\u58F0\u660E background \u76EE\u6807\u7684\u7EC4\u4EF6" };
    if (!effect.exclusive && !effect.id.startsWith("ani-")) properties.selector = { type: "string", description: "\u663E\u5F0F\u76EE\u6807\uFF1B\u5FC5\u987B\u5339\u914D\u5B9E\u9645\u5185\u5BB9\uFF0C\u4E0D\u80FD\u8986\u76D6\u6DF7\u526A\u5A92\u4F53\u4E16\u754C" };
    if (effect.id === "zoom-focus") properties.scale = { type: "number", minimum: 1, maximum: 3, default: 1.32 };
    if (effect.id === "scroll-panel") properties.distance = { type: "number", minimum: 0 };
    if (effect.id === "ani-machine-process") properties.travelDistance = { type: "number", description: "\u8F93\u5165\u6750\u6599\u5230\u5904\u7406\u88C5\u7F6E\u7684\u79FB\u52A8\u8DDD\u79BB\uFF1B\u4EC5\u5728\u7EC4\u4EF6\u5E03\u5C40\u4ECD\u4FDD\u7559\u771F\u5B9E\u76EE\u6807\u65F6\u8C03\u6574" };
    if (["callout-pin", "success-toast", "save-pulse"].includes(effect.id)) properties.label = { type: "string", description: "\u66FF\u6362\u53CD\u9988\u6216\u6807\u6CE8\u6587\u5B57\uFF1B\u4E0D\u6539\u53D8\u52A8\u4F5C\u951A\u70B9" };
    if (role === "transition") properties.nextScene = { type: "object", required: ["component"], properties: { component: { type: "string" }, props: { type: "object" } }, additionalProperties: false };
    Object.assign(properties, effect.optionsSchema?.properties || {});
    return {
      role,
      family: familyAliases[effect.id] || effect.motionFamily || effect.id,
      controls: role === "background" ? ["background"] : effect.id === "media-sequence-motion" ? ["source-camera", "source-annotations", "media-viewports"] : role === "wrapper" || role === "transition" ? ["motion-wrap"] : ["component-targets"],
      excludes: effect.id === "media-sequence-motion" ? ["another camera on .mm-world"] : role === "internal" ? ["another timeline controlling the same component targets"] : [],
      replacesDefault: true,
      requiresNextScene: role === "transition",
      optionsSchema: { type: "object", properties, additionalProperties: false },
      timing: effect.id === "media-sequence-motion" ? "source-clock" : "native-8s-retime",
      silent: effect.silent === true,
      soundCues: effect.soundCues || effect.cueHints || []
    };
  }
  function effectCompatibility(component2, effect, props = component2.defaults, { selector } = {}) {
    const id = effect?.id || "none", contract = describeEffect(effect), warnings = [];
    const reject = (reason) => ({ compatible: false, reason, warnings, ...contract });
    if (component2.id === "mixed-media-sequence" && id !== "media-sequence-motion") return reject("\u6DF7\u526A\u7EC4\u4EF6\u5FC5\u987B\u4FDD\u6301\u6E90\u65F6\u949F\uFF1B\u9759\u6B62\u53D6\u666F\u4F7F\u7528 props.strength=still");
    if (effect?.exclusive && effect.exclusive !== component2.id) return reject("\u4E13\u5C5E\u6548\u679C\u4EC5\u9002\u7528\u4E8E " + effect.exclusive);
    if (id !== "none") {
      let markup;
      try {
        markup = component2.render(props, helpers("contract-probe"));
      } catch (e2) {
        return reject("\u5185\u5BB9\u4E0D\u80FD\u6E32\u67D3\uFF1A" + e2.message);
      }
      if (!markupMatches(markup, selector || effect.selector)) return reject("\u5F53\u524D\u5185\u5BB9\u6CA1\u6709\u6548\u679C\u76EE\u6807 " + (selector || effect.selector));
    }
    if (component2.defaultEffect && component2.defaultEffect !== "none" && id !== component2.defaultEffect) warnings.push("\u6B64\u9009\u62E9\u66FF\u6362\u9ED8\u8BA4\u5185\u90E8\u52A8\u4F5C\uFF1B\u4E0D\u4F1A\u53E0\u52A0\u9ED8\u8BA4\u52A8\u4F5C\u3002\u6838\u5BF9\u8BB2\u89E3\u6B65\u9AA4\uFF0C\u9759\u6001\u5185\u5BB9\u53EF\u80FD\u76F4\u63A5\u663E\u793A\u7EC8\u6001\u3002");
    return { compatible: true, reason: id === "none" ? "\u9759\u6001\u9605\u8BFB" : effect?.exclusive ? "\u7EC4\u4EF6\u4E13\u5C5E\u52A8\u4F5C" : contract.role === "transition" ? "\u76EE\u6807\u5B58\u5728\uFF1B\u8FD8\u9700\u663E\u5F0F\u63D0\u4F9B\u4E0B\u4E00\u753B\u9762" : "\u5F53\u524D\u5185\u5BB9\u542B\u5B9E\u9645\u76EE\u6807", warnings, ...contract };
  }

  // component-renderers-entry.mjs
  var components29 = [...components, ...components2, ...components3, ...components4, ...components6, ...components5, ...components7, ...components8, ...components9, ...components10, ...components11, ...components12, ...components13, ...components14, ...components15, ...components16, ...components17, ...components18, ...components19, ...components20, ...components21, ...components22, ...components23, ...components24, ...components25, ...components26, ...components27, ...components28];
  function mountNext(root, id, props, instance, effect, options = {}, mediaBase = assetBaseURL) {
    const current = components29.find((c) => c.id === id), definition = effects.find((e2) => e2.id === effect) || { id: effect };
    const compatible = effectCompatibility(current, definition, props, { selector: options.selector });
    if (!compatible.compatible) throw Error(compatible.reason);
    root.querySelector(".motion-next")?.remove();
    if (!effects.some((e2) => e2.id === effect && e2.category === "\u8F6C\u573A")) return;
    const next = options.nextScene || props.transitionNext || (effect === "shared-slide" ? { component: "lecture-stage", props: { title: "\u4E0B\u4E00\u573A\u666F\u6807\u9898", subtitle: "\u4E0B\u4E00\u573A\u666F\u8BF4\u660E", chapter: "\u7AE0\u8282 / 02" } } : { component: "chapter-summary", props: { title: "\u4E0B\u4E00\u573A\u666F\u6807\u9898", subtitle: "\u4E0B\u4E00\u573A\u666F\u8BF4\u660E" } });
    const target = components29.find((c) => c.id === next.component);
    if (!target) throw Error("\u4E0B\u4E00\u5E45\u753B\u9762\u7684\u7EC4\u4EF6\u4E0D\u5B58\u5728\uFF1A" + next.component);
    assertComponentProps(target, { ...target.defaults, ...next.props }, { render: true });
    const node4 = document.createElement("div");
    node4.className = "motion-next";
    node4.dataset.scene = "B";
    node4.style.cssText = "position:absolute;inset:0;width:100%;height:100%;opacity:0";
    node4.innerHTML = rewriteRenderedMediaMarkup(target.render(normalizeMediaProps({ ...target.defaults, ...next.props }), helpers(instance + "-next")), mediaBase);
    root.querySelector(".component-stage").append(node4);
    root.querySelector(".motion-wrap").dataset.scene = "A";
    const at2 = Number(options.transitionAt ?? 2.1), duration = Number(options.transitionDuration ?? 0.66), covered = ["wipe-transition", "curve-ribbon", "diagonal-ribbon", "liquid-sweep"].includes(effect), nextStart = at2 + (covered ? duration * 0.5 : 0);
    node4.querySelectorAll("video,audio").forEach((media3, index) => {
      media3.id = instance + "-next-media-" + index;
      media3.classList.add("clip");
      media3.dataset.start = String(nextStart);
      media3.dataset.duration = String(Number(root.dataset.duration || 8) - nextStart);
      media3.dataset.trackIndex = "1";
    });
    root.querySelector(".motion-wrap").querySelectorAll("video,audio").forEach((media3) => media3.dataset.duration = String(at2 + duration));
  }
  var assetBaseURL = new URL("../", document.currentScript?.src || new URL("vendor/component-renderers.js", document.baseURI).href).href;
  function mount(root, id, props, instance, mediaBase = assetBaseURL) {
    const component2 = components29.find((c) => c.id === id);
    if (!component2) throw Error("Unknown component " + id);
    assertComponentProps(component2, { ...component2.defaults, ...props }, { render: true });
    const html = component2.render(normalizeMediaProps({ ...component2.defaults, ...props, ...id === "mixed-media-sequence" ? { previewDuration: Number(root.dataset.duration || 8) } : {} }), helpers(instance));
    root.querySelector(".motion-wrap").innerHTML = rewriteRenderedMediaMarkup(html, mediaBase);
    root.querySelectorAll("video,audio:not([data-component-sfx])").forEach((media3, index) => {
      if (!media3.id) media3.id = instance + "-media-" + index;
      media3.classList.add("clip");
      if (id !== "mixed-media-sequence") {
        media3.setAttribute("data-start", "0");
        media3.setAttribute("data-duration", root.getAttribute("data-duration") || "8");
        media3.setAttribute("data-track-index", "0");
      }
    });
    return root;
  }
  return __toCommonJS(component_renderers_entry_exports);
})();
