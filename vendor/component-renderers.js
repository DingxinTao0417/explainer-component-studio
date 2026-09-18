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
  function banner(x, y, w, label2, color2, h) {
    const c = safeColor(color2), id = h.uid("ani-banner");
    const textColor = c.toLowerCase() === tokens.orange.toLowerCase() ? tokens.ink : "white";
    const fs = Math.min(34, Math.max(18, (w - 34) / Math.max(1, Array.from(String(label2 ?? "")).length)));
    return `<g transform="translate(${num(x)} ${num(y)})" class="ani-banner"><defs><linearGradient id="${h.esc(id)}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".9"/></linearGradient></defs><rect x="4" y="5" width="${num(w)}" height="64" rx="17" fill="${tokens.shadow}"/><rect width="${num(w)}" height="64" rx="17" fill="url(#${h.esc(id)})" stroke="${tokens.ink}" stroke-width="3.5"/><rect x="5" y="5" width="${num(w) - 10}" height="54" rx="13" fill="none" stroke="#93d3ff" stroke-width="2" opacity=".8"/><path d="M17 10H${Math.min(75, w - 22)}M10 20Q10 10 22 10" fill="none" stroke="white" stroke-width="2.8" stroke-linecap="round" opacity=".7"/><text x="${num(w) / 2}" y="43" text-anchor="middle" fill="${textColor}" font-size="${fs}" font-weight="900" letter-spacing="1">${h.esc(label2 ?? "")}</text></g>`;
  }
  function paper(x, y, w, hgt, options = {}, h) {
    const f = Math.min(num(options.fold, 50), w * 0.24, hgt * 0.2), d = num(options.depth, 12);
    const shape = `M18 0H${w - f}L${w} ${f}V${hgt - 18}Q${w} ${hgt} ${w - 18} ${hgt}H18Q0 ${hgt} 0 ${hgt - 18}V18Q0 0 18 0Z`;
    const title = options.title ? banner((w - num(options.titleWidth, w * 0.6)) / 2, 20, num(options.titleWidth, w * 0.6), options.title, options.accent || tokens.blue, h) : "";
    return `<g transform="translate(${num(x)} ${num(y)})" class="ani-paper"><path d="${shape}" transform="translate(${d} ${d})" fill="${tokens.shadow}"/><path d="${shape}" fill="#fcfeff" stroke="${tokens.ink}" stroke-width="4" stroke-linejoin="round"/><path d="M${w - f - 3} 5H${w - f}L${w - 5} ${f + 3}V${hgt - 18}Q${w - 5} ${hgt - 5} ${w - 18} ${hgt - 5}H18Q5 ${hgt - 5} 5 ${hgt - 18}" fill="none" stroke="#d4ecff" stroke-width="5"/><path d="M${w - f} 0V${f - 11}Q${w - f} ${f} ${w - f + 11} ${f}H${w}Z" fill="#e4f3ff" stroke="${tokens.ink}" stroke-width="2.8" stroke-linejoin="round"/><path d="M${w - f + 6} 7L${w - 7} ${f - 5}H${w - f + 11}Q${w - f + 5} ${f - 5} ${w - f + 5} ${f - 12}Z" fill="#f5fbff"/>${title}${options.content || ""}</g>`;
  }
  function icon(kind, x, y, size, h) {
    const t = tokens, s = num(size, 80) / 100;
    let art = "";
    if (kind === "people") art = `<ellipse cx="50" cy="88" rx="47" ry="6" fill="${t.shadow}"/><g stroke="${t.ink}" stroke-width="3" stroke-linejoin="round"><circle cx="20" cy="39" r="12" fill="#12c6a0"/><path d="M4 76V68Q4 53 20 53T37 68V76Z" fill="#13bd96"/><circle cx="80" cy="39" r="12" fill="#ffb71b"/><path d="M63 76V68Q63 53 80 53T97 68V76Z" fill="#ffb71b"/><circle cx="50" cy="32" r="16" fill="#25a6fa"/><path d="M26 84V72Q26 50 50 50T75 72V84Z" fill="#249cf6"/></g><path d="M40 23Q48 18 54 23" fill="none" stroke="#8edbff" stroke-width="3" stroke-linecap="round"/>`;
    else if (kind === "documents") art = `<ellipse cx="50" cy="90" rx="46" ry="6" fill="${t.shadow}"/><g transform="rotate(-10 30 52)"><rect x="8" y="13" width="44" height="73" rx="5" fill="white" stroke="${t.ink}" stroke-width="3"/><g fill="${t.blue}"><circle cx="20" cy="34" r="3"/><circle cx="20" cy="48" r="3"/><circle cx="20" cy="62" r="3"/></g><path d="M29 33H42M29 47H42M29 61H39" stroke="${t.blue}" stroke-width="5" stroke-linecap="round"/></g><g transform="rotate(11 71 52)"><rect x="54" y="12" width="39" height="74" rx="5" fill="white" stroke="${t.ink}" stroke-width="3"/><g fill="${t.orange}"><circle cx="64" cy="32" r="3"/><circle cx="64" cy="47" r="3"/><circle cx="64" cy="62" r="3"/></g><path d="M73 32H84M73 47H84M73 62H83" stroke="${t.orange}" stroke-width="4.5" stroke-linecap="round"/></g>`;
    else if (kind === "calendar") art = `<ellipse cx="50" cy="89" rx="47" ry="6" fill="${t.shadow}"/><rect x="4" y="18" width="61" height="67" rx="6" fill="white" stroke="${t.ink}" stroke-width="3"/><path d="M5 37V23Q5 18 10 18H59Q64 18 64 23V37Z" fill="${t.orange}" stroke="${t.ink}" stroke-width="2.5"/><path d="M18 12V25M48 12V25" stroke="${t.ink}" stroke-width="7" stroke-linecap="round"/><path d="M18 12V25M48 12V25" stroke="#afcffa" stroke-width="3" stroke-linecap="round"/><path d="M16 48H52M16 60H52M16 72H42M27 43V77M40 43V77" stroke="${t.blue}" stroke-width="2" opacity=".65"/><circle cx="74" cy="64" r="25" fill="${t.blue}" stroke="${t.ink}" stroke-width="3"/><circle cx="74" cy="64" r="19" fill="white" stroke="#9ed6ff" stroke-width="2"/><path d="M74 49V64L83 73" fill="none" stroke="${t.orange}" stroke-width="3.5" stroke-linecap="round"/><circle cx="74" cy="64" r="3" fill="${t.ink}"/>`;
    else if (kind === "link") art = `<ellipse cx="50" cy="88" rx="37" ry="6" fill="${t.shadow}"/><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M43 60L32 71Q19 82 11 70Q4 60 14 49L29 34Q41 21 54 35" stroke="${t.ink}" stroke-width="14"/><path d="M57 41L68 30Q81 18 90 30Q97 41 86 52L72 67Q60 80 47 66" stroke="${t.ink}" stroke-width="14"/><path d="M43 60L32 71Q19 82 11 70Q4 60 14 49L29 34Q41 21 54 35M57 41L68 30Q81 18 90 30Q97 41 86 52L72 67Q60 80 47 66" stroke="${t.blue}" stroke-width="8"/><path d="M36 61L64 39" stroke="${t.ink}" stroke-width="14"/><path d="M36 61L64 39" stroke="#3ab4ff" stroke-width="8"/><path d="M17 52L31 38M65 59L83 41" stroke="#b9e7ff" stroke-width="2.3"/></g>`;
    else if (kind === "table") art = `<path d="M15 8H65L88 31V91H15Z" fill="white" stroke="${t.ink}" stroke-width="3"/><path d="M65 8V31H88" fill="#d4ecff" stroke="${t.ink}" stroke-width="2.5"/><rect x="25" y="37" width="53" height="42" rx="2" fill="#f5fcfa" stroke="${t.green}" stroke-width="2.5"/><path d="M25 48H78M25 58H78M25 68H78M42 37V79M61 37V79" stroke="${t.green}" stroke-width="2"/><path d="M25 38H77V47H25Z" fill="${t.green}"/>`;
    else if (kind === "check") art = `<circle cx="50" cy="50" r="35" fill="${t.green}" stroke="${t.ink}" stroke-width="3"/><path d="M31 50L44 63L69 36" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    else art = `<path d="M18 8H65L87 31V91H18Z" fill="white" stroke="${t.ink}" stroke-width="3"/><path d="M65 8V31H87" fill="#d4ecff" stroke="${t.ink}" stroke-width="2.5"/><path d="M30 45H73M30 57H73M30 69H65" fill="none" stroke="${t.blue}" stroke-width="5" stroke-linecap="round"/>`;
    return `<g transform="translate(${num(x)} ${num(y)}) scale(${s})" class="ani-icon ani-icon-${h.esc(kind)}" aria-hidden="true">${art}</g>`;
  }
  function mountains(x, y, w, hgt, h) {
    const id = h.uid("ani-mountain-clip"), sky = h.uid("ani-sky"), lake = h.uid("ani-lake");
    const tree2 = (px, py, scale, color2) => `<g transform="translate(${px} ${py}) scale(${scale})"><path d="M0 0L-21 43H-13L-32 76H-20L-38 111H38L20 76H32L13 43H21Z" fill="${color2}" stroke="#137183" stroke-width="2" stroke-linejoin="round"/><path d="M0 77V121" stroke="#186475" stroke-width="5"/></g>`;
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
  var units = (value) => Array.from(String(value ?? "")).reduce((n3, c) => n3 + (/[\u0000-\u00ff]/.test(c) ? 0.54 : 1), 0);
  var fit = (value, max, width, min = 16) => Math.max(min, Math.min(max, width / Math.max(1, units(value))));
  var scoped = (h, prefix) => {
    let n3 = 0;
    return { ...h, uid: (name) => h.uid(`${prefix}-${++n3}-${name}`) };
  };
  var text = (x, y, label2, size, h, extra2 = "") => `<text x="${x}" y="${y}" font-size="${size}" fill="${tokens.ink}" ${extra2}>${h.esc(label2 ?? "")}</text>`;
  var initialRows = [
    { id: "A01", orderDate: "2026-09-01", completedDate: "2026-09-03", status: "\u5DF2\u5B8C\u6210" },
    { id: "A02", orderDate: "2026-09-02", completedDate: "2026-09-05", status: "\u5DF2\u5B8C\u6210" },
    { id: "A03", orderDate: "2026-09-04", completedDate: "2026-09-08", status: "\u5DF2\u5B8C\u6210" },
    { id: "A04", orderDate: "2026-09-06", completedDate: "", status: "\u5DF2\u53D6\u6D88" },
    { id: "A05", orderDate: "2026-09-10", completedDate: "", status: "\u5F85\u4ED8\u6B3E" }
  ];
  var matches = (r, month) => r.status === "\u5DF2\u5B8C\u6210" && String(r.completedDate || "").startsWith(month + "-");
  var dateLabel = (v) => /^\d{4}-\d\d-\d\d$/.test(String(v)) ? String(v).slice(5) : String(v || "\u2014");
  function validateRows(rows2) {
    if (!Array.isArray(rows2) || rows2.length !== 5) throw new Error("animation order scenes require exactly five sample rows");
    if (rows2.some((r) => units(r.id) > 6 || units(r.status) > 5)) throw new Error("animation order row text exceeds readable field width");
  }
  function badge(x, y, w, label2, color2, h, height = 36) {
    const fs = Math.min(height * 0.64, fit(label2, 23, w - 14));
    return `<g><rect x="${x + 2}" y="${y + 3}" width="${w}" height="${height}" rx="11" fill="${tokens.shadow}"/><rect data-ani-status-bg x="${x}" y="${y}" width="${w}" height="${height}" rx="11" fill="${color2}" stroke="${tokens.ink}" stroke-width="1.5"/><path d="M${x + 11} ${y + 5}H${x + w - 14}" stroke="white" stroke-opacity=".27" stroke-width="2" stroke-linecap="round"/>${text(x + w / 2, y + height * 0.71, label2, fs, h, 'text-anchor="middle" style="fill:' + (color2 === tokens.orange || color2 === "#9aa3b1" ? tokens.ink : "white") + '"')}</g>`;
  }
  function sourceSheet(h, label2) {
    const rows2 = Array.from({ length: 11 }, (_, i) => Array.from({ length: 3 }, (_2, j) => `<rect x="${66 + j * 61}" y="${252 + i * 20}" width="51" height="12" rx="2" fill="${i >= 3 && i <= 7 ? "#aedcff" : "#dce8f2"}"/>`).join("")).join("");
    return `<g data-ani-enter>${paper(45, 218, 225, 296, { fold: 28, depth: 9 }, h)}${banner(63, 183, 186, label2, tokens.green, h)}${rows2}<rect x="59" y="307" width="198" height="103" rx="4" fill="none" stroke="${tokens.blue}" stroke-width="3" stroke-dasharray="7 5"/>${text(157, 548, "\u539F\u59CB\u8BB0\u5F55\u4FDD\u7559", 18, h, 'text-anchor="middle" fill="#55749b"')}</g>`;
  }
  var orderDefaults = {
    title: "\u622A\u53D6 5 \u6761\u793A\u610F",
    subtitle: "\u5B8C\u6210\u65E5\u671F\u5728\u672C\u6708\uFF0C\u4E14\u72B6\u6001\u4E3A\u5DF2\u5B8C\u6210",
    footer: "\u53EA\u6539\u53D8\u8BA1\u5165\u8303\u56F4\uFF0C\u539F\u59CB\u4E94\u6761\u8BB0\u5F55\u4ECD\u7136\u4FDD\u7559\u3002",
    month: "2026-09",
    sourceLabel: "\u539F\u59CB\u8868\u683C",
    headers: ["\u8BA2\u5355\u53F7", "\u4E0B\u5355\u65E5\u671F", "\u5B8C\u6210\u65E5\u671F", "\u72B6\u6001"],
    rawHeader: "\u521D\u6B21\u8BA1\u5165",
    finalHeader: "\u4FEE\u6B63\u540E\u8BA1\u5165",
    includedLabel: "\u8BA1\u5165",
    excludedLabel: "\u4E0D\u8BA1\u5165",
    rawCountLabel: "\u672C\u5C40\u90E8\u521D\u6B21\u8BA1\u5165",
    finalCountLabel: "\u672C\u5C40\u90E8\u7B26\u5408",
    unit: "\u6761",
    sampleNote: "\u4E0D\u662F\u6708\u5EA6\u603B\u6570",
    rows: initialRows
  };
  function renderOrder(p, helpers2) {
    validateRows(p.rows);
    if (!/^\d{4}-\d{2}$/.test(p.month)) throw new Error("month must use YYYY-MM");
    if (!Array.isArray(p.headers) || p.headers.length !== 4) throw new Error("order headers require four labels");
    const h = scoped(helpers2, "order"), e = h.esc;
    const x = 326, y = 180, width = 888, head = 58, rowH = 64, cols = [126, 157, 169, 180, 256];
    const starts = [x];
    cols.forEach((w, i) => starts.push(starts[i] + w));
    const count = p.rows.filter((r) => matches(r, p.month)).length;
    const header = p.headers.map((label2, i) => text(starts[i] + cols[i] / 2, y + 38, label2, fit(label2, 26, cols[i] - 16), h, 'text-anchor="middle"')).join("");
    const headLast = `<g data-ani-raw>${text(starts[4] + cols[4] / 2, y + 38, p.rawHeader, 26, h, 'text-anchor="middle"')}</g><g data-ani-final>${text(starts[4] + cols[4] / 2, y + 38, p.finalHeader, 26, h, 'text-anchor="middle"')}</g>`;
    const rows2 = p.rows.map((r, i) => {
      const yy = y + head + i * rowH, ok = matches(r, p.month), statusColor = r.status === "\u5DF2\u5B8C\u6210" ? tokens.green : r.status === "\u5DF2\u53D6\u6D88" ? "#9aa3b1" : tokens.orange;
      const cells = [r.id, dateLabel(r.orderDate), dateLabel(r.completedDate)].map((v, k) => text(starts[k] + cols[k] / 2, yy + 41, v, 28, h, 'text-anchor="middle"')).join("");
      const raw = `<g data-ani-raw><circle cx="${starts[4] + 57}" cy="${yy + 32}" r="11" fill="${tokens.blue}"/>${text(starts[4] + 86, yy + 41, p.includedLabel, 27, h)}</g>`;
      const final = `<g data-ani-final>${ok ? `<circle cx="${starts[4] + 57}" cy="${yy + 32}" r="11" fill="${tokens.green}"/>` : `<path d="M${starts[4] + 47} ${yy + 32}H${starts[4] + 67}" stroke="#727d8d" stroke-width="4" stroke-linecap="round"/>`}${text(starts[4] + 86, yy + 41, ok ? p.includedLabel : p.excludedLabel, 27, h)}</g>`;
      return `<g ${ok ? "data-ani-filtered" : "data-ani-excluded"}="${e(r.id)}" data-text-panel="order-${i}" data-panel-bounds="${x} ${yy} ${width} ${rowH}"><rect data-ani-row-bg x="${x + 1}" y="${yy}" width="${width - 2}" height="${rowH}" fill="${i % 2 ? "#f4faff" : "#ffffff"}"/>${cells}${badge(starts[3] + 20, yy + 13, cols[3] - 40, r.status, statusColor, h)}${raw}${final}</g>`;
    }).join("");
    const grid = starts.slice(1, -1).map((xx) => `<path d="M${xx} ${y}V${y + head + 5 * rowH}"/>`).join("") + Array.from({ length: 5 }, (_, i) => `<path d="M${x} ${y + head + i * rowH}H${x + width}"/>`).join("");
    const countGroup = (which, label2, n3) => `<g data-ani-${which}><rect x="380" y="595" width="442" height="62" rx="20" fill="#e6f4ff" stroke="#6eaff6" stroke-width="2.5"/>${text(601, 636, label2 + " " + n3 + " " + p.unit, fit(label2 + " " + n3 + " " + p.unit, 28, 406), h, 'text-anchor="middle"')}</g>`;
    const content2 = `${sourceSheet(h, p.sourceLabel)}<path d="M258 307L310 238V516L258 410Z" fill="#cceaff" fill-opacity=".65" stroke="#89bffc" stroke-width="2"/>${paper(309, 139, 920, 437, { fold: 18, depth: 10 }, h)}${banner(337, 65, 440, p.title, tokens.blue, h)}${text(805, 101, p.month + " \xB7 \u539F\u8868\u5C40\u90E8", 23, h)}${text(807, 130, p.subtitle, fit(p.subtitle, 19, 388), h)}<rect x="${x}" y="${y}" width="${width}" height="${head + 5 * rowH}" rx="13" fill="#fff" stroke="${tokens.ink}" stroke-width="3"/><path d="M${x + 13} ${y}H${x + width - 13}Q${x + width} ${y} ${x + width} ${y + 13}V${y + head}H${x}V${y + 13}Q${x} ${y} ${x + 13} ${y}Z" fill="#dceeff"/>${rows2}${header}${headLast}<g stroke="#7b97bf" stroke-width="1.3" fill="none">${grid}</g><rect x="${x}" y="${y}" width="${width}" height="${head + 5 * rowH}" rx="13" fill="none" stroke="${tokens.ink}" stroke-width="2.5"/>${countGroup("raw", p.rawCountLabel, p.rows.length)}${countGroup("final", p.finalCountLabel, count)}<rect x="855" y="595" width="345" height="62" rx="20" fill="#e9f5ff" stroke="#91bdeb" stroke-width="2.5"/>${text(1027, 636, p.sampleNote, fit(p.sampleNote, 29, 310), h, 'text-anchor="middle"')}<g data-ani-pop>${text(778, 694, p.footer, fit(p.footer, 21, 910), h, 'text-anchor="middle" fill="#55749b"')}</g>`;
    return svgScene(content2, h);
  }
  var compareDefaults = {
    title: "\u56FE\u5F0F\u5F52\u7EB3",
    subtitle: "\u4ECE\u4E0D\u540C\u4F8B\u5B50\uFF0C\u627E\u5171\u540C\u601D\u8DEF",
    footer: "\u672C\u4F8B\u529E\u6CD5\uFF1A\u8865\u6E05\u8981\u6C42\uFF0C\u518D\u68C0\u67E5",
    leftTitle: "\u672C\u5468\u8FDB\u5EA6\u901A\u77E5",
    rightTitle: "\u622A\u53D6 5 \u6761\u793A\u610F",
    leftSteps: ["\u8865\u6E05\u8981\u6C42", "\u5BF9\u7167\u68C0\u67E5"],
    rightSteps: ["\u8865\u6E05\u8981\u6C42", "\u5BF9\u7167\u68C0\u67E5"],
    relationLabel: "\u6BD4\u8F83\u4E0E\u63D0\u70BC",
    sampleNote: "\u6837\u672C\u4E0D\u662F\u6708\u5EA6\u603B\u6570",
    fields: [{ label: "\u5BF9\u8C61", text: "\u5404\u7EC4\u8D1F\u8D23\u4EBA", icon: "people" }, { label: "\u5185\u5BB9", text: "\u672C\u5468\u5DF2\u5B8C\u6210\u3001\u672A\u5B8C\u6210\u4E8B\u9879", icon: "documents" }, { label: "\u622A\u6B62", text: "\u5468\u4E94 17:00 \u524D", icon: "calendar" }, { label: "\u586B\u5199", text: "\u5171\u4EAB\u8868\u683C", icon: "link" }],
    headers: ["\u8BA2\u5355\u53F7", "\u5B8C\u6210\u65E5\u671F", "\u72B6\u6001", "\u8BA1\u5165"],
    month: "2026-09",
    rows: initialRows
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
      const yy = y + header + i * rowH, ok = matches(r, p.month);
      return `<rect x="${x + 1}" y="${yy}" width="${width - 2}" height="${rowH}" fill="${i % 2 ? "#f4faff" : "#fff"}"/>${text(starts[0] + 48, yy + 27, r.id, 21, h, 'text-anchor="middle"')}${text(starts[1] + 55.5, yy + 27, dateLabel(r.completedDate), 21, h, 'text-anchor="middle"')}${badge(starts[2] + 13, yy + 5, colW[2] - 26, r.status, r.status === "\u5DF2\u5B8C\u6210" ? tokens.green : r.status === "\u5DF2\u53D6\u6D88" ? "#9aa3b1" : tokens.orange, h, 28)}${ok ? `<circle cx="${starts[3] + 26}" cy="${yy + 20}" r="7" fill="${tokens.green}"/>` : `<path d="M${starts[3] + 19} ${yy + 20}H${starts[3] + 33}" stroke="#788393" stroke-width="3"/>`}${text(starts[3] + 44, yy + 27, ok ? "\u8BA1\u5165" : "\u4E0D\u8BA1\u5165", 19, h)}`;
    }).join("");
    const grid = starts.slice(1, -1).map((xx) => `<path d="M${xx} ${y}V${y + header + 5 * rowH}"/>`).join("") + Array.from({ length: 5 }, (_, i) => `<path d="M${x} ${y + header + i * rowH}H${x + width}"/>`).join("");
    const left = `<g data-ani-enter>${paper(61, 88, 505, 305, { fold: 38, depth: 10 }, h)}${banner(143, 48, 332, p.leftTitle, tokens.blue, h)}${leftFields}</g>`;
    const right = `<g data-ani-enter>${paper(694, 88, 505, 305, { fold: 18, depth: 10 }, h)}${banner(770, 48, 350, p.rightTitle, tokens.blue, h)}<rect x="${x}" y="${y}" width="${width}" height="${header + 5 * rowH}" rx="7" fill="#dceeff" stroke="${tokens.ink}" stroke-width="2"/>${rightRows}${hdr}<g fill="none" stroke="#7b97bf" stroke-width="1">${grid}</g><rect x="${x}" y="${y}" width="${width}" height="${header + 5 * rowH}" rx="7" fill="none" stroke="${tokens.ink}" stroke-width="2"/>${text(1180, 387, p.sampleNote, 14, h, 'text-anchor="end" fill="#527094"')}</g>`;
    const steps = `<g data-ani-enter data-ani-compare-steps>${banner(84, 419, 209, p.leftSteps[0], tokens.green, h)}${banner(320, 419, 209, p.leftSteps[1], tokens.orange, h)}</g><g data-ani-enter data-ani-compare-steps>${banner(751, 419, 209, p.rightSteps[0], tokens.green, h)}${banner(987, 419, 209, p.rightSteps[1], tokens.orange, h)}</g>`;
    const links = `<g data-ani-compare-links fill="none" stroke="${tokens.blue}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path data-ani-flow-join d="M188.5 482V488Q188.5 495 195.5 495H306.5"/><path data-ani-flow-join d="M424.5 482V488Q424.5 495 417.5 495H306.5"/><path data-ani-flow-join d="M855.5 482V488Q855.5 495 862.5 495H973.5"/><path data-ani-flow-join d="M1091.5 482V488Q1091.5 495 1084.5 495H973.5"/><path data-ani-flow-trunk d="M306.5 495V500Q306.5 508 314.5 508H507Q515 508 515 516V526"/><path data-ani-flow-trunk d="M973.5 495V500Q973.5 508 965.5 508H773Q765 508 765 516V526"/></g>`;
    const bridge = `<g data-ani-flow-bridge fill="none"><path d="M638 625V643" stroke="${tokens.ink}" stroke-width="10"/><path d="M638 625V643" stroke="${tokens.blue}" stroke-width="5"/></g>`;
    const result = `<g data-ani-flow-result><rect x="412" y="530" width="466" height="104" rx="21" fill="${tokens.shadow}"/><rect x="405" y="523" width="466" height="104" rx="21" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="4"/><rect x="411" y="529" width="454" height="92" rx="16" fill="none" stroke="#83cbff" stroke-width="2"/><g data-text-panel="process-title" data-panel-bounds="405 523 466 51">${text(638, 567, p.title, fit(p.title, 40, 404), h, 'text-anchor="middle" style="fill:white"')}</g><rect x="420" y="574" width="435" height="38" rx="13" fill="#ecf9ff"/>${text(638, 601, p.subtitle, fit(p.subtitle, 25, 414), h, 'text-anchor="middle"')}${text(640, 514, p.relationLabel, 23, h, 'text-anchor="middle"')}</g>`;
    const footer2 = `<g data-ani-flow-footer>${banner(266, 641, 748, p.footer, tokens.green, h)}</g>`;
    return svgScene(`${left}${right}<g data-ani-compare-flow>${links}${bridge}${result}${footer2}</g>${steps}`, h);
  }
  var components = [
    { id: "ani-order-filter", name: "\u52A8\u753B\u98CE \xB7 \u8BA2\u5355\u6761\u4EF6\u7B5B\u9009", category: "\u52A8\u753B\u98CE", description: "\u4ECE\u4E94\u6761\u5C40\u90E8\u8BB0\u5F55\u5C55\u793A\u7B5B\u9009\u53E3\u5F84\uFF1A\u5148\u8BA1\u5165\u4E94\u6761\uFF0C\u6309\u5B8C\u6210\u65E5\u671F\u4E0E\u72B6\u6001\u6539\u4E3A\u4E09\u6761\u3002\u53D6\u6D88\u53CA\u672A\u4ED8\u8BB0\u5F55\u7559\u5728\u539F\u4F4D\uFF0C\u6837\u672C\u4E0E\u6708\u5EA6\u603B\u6570\u660E\u786E\u533A\u5206\u3002", width: 1280, height: 720, defaultEffect: "ani-order-select", defaults: orderDefaults, reference: { basis: "\u7528\u6237 V8 \u7684 S07/S08 \u9759\u6001\u5206\u955C\u4E0E M04 \u4E09\u6001\u677F\uFF0C\u539F\u751F SVG \u53EF\u7F16\u8F91\u91CD\u5EFA\u3002", source: "reports/animation-style/reference-review-v8/REVIEW.md", level: "reference-reconstruction" }, render(p, h) {
      return renderOrder({ ...orderDefaults, ...p }, h);
    } },
    { id: "ani-compare-extract", name: "\u52A8\u753B\u98CE \xB7 \u4E24\u4F8B\u5BF9\u7167\u4E0E\u5F52\u7EB3", category: "\u52A8\u753B\u98CE", description: "\u4FDD\u7559\u901A\u77E5\u4E0E\u8BA2\u5355\u7684\u4E0D\u540C\u7ED3\u6784\uFF0C\u5BF9\u9F50\u4E24\u8FB9\u76F8\u540C\u7684\u6B65\u9AA4\uFF0C\u518D\u6C47\u805A\u5230\u56FE\u5F0F\u5F52\u7EB3\u4E0E\u672C\u4F8B\u529E\u6CD5\u3002", width: 1280, height: 720, defaultEffect: "ani-diagram-build", defaults: compareDefaults, reference: { basis: "\u7528\u6237 V8 \u7684 S10 \u9759\u6001\u5206\u955C\u4E0E M05 \u4E0B\u884C\uFF0C\u539F\u751F SVG \u53EF\u7F16\u8F91\u91CD\u5EFA\u3002", source: "reports/animation-style/reference-review-v8/REVIEW.md", level: "reference-reconstruction" }, render(p, h) {
      return renderCompare({ ...compareDefaults, ...p }, h);
    } }
  ];

  // families/animation-style-atoms-controls.mjs
  var font = "font-family:'Microsoft YaHei','Segoe UI',sans-serif;font-weight:750";
  var units2 = (v) => [...String(v ?? "")].reduce((n3, c) => n3 + (/[\x00-\x7f]/.test(c) ? 0.55 : 1), 0);
  var num2 = (v, name, min, max) => {
    const n3 = Number(v);
    if (!Number.isFinite(n3) || n3 < min || n3 > max) throw Error(`${name} \u5FC5\u987B\u5728 ${min}\u2013${max} \u4E4B\u95F4\u3002`);
    return n3;
  };
  var choice = (v, allowed, name) => {
    if (!allowed.includes(v)) throw Error(`${name} \u652F\u6301 ${allowed.join(" / ")}\u3002`);
    return v;
  };
  var copy = (v, name, max = 80) => {
    const s = String(v ?? "");
    if (units2(s) > max) throw Error(`${name} \u8FC7\u957F\uFF0C\u8BF7\u4F7F\u7528\u7B80\u77ED\u6587\u5B57\u3002`);
    return s;
  };
  var colors = { blue: tokens.blue, green: tokens.green, orange: tokens.orange, neutral: "#e1eaf3" };
  function geo(p, minW = 80, minH = 38, extraBottom = 12) {
    const x = num2(p.x, "x", 0, 1240), y = num2(p.y, "y", 0, 700), w = num2(p.objectWidth, "objectWidth", minW, 1220), h = num2(p.objectHeight, "objectHeight", minH, 660);
    if (x + w + 12 > 1280 || y + h + extraBottom > 720) throw Error("\u90E8\u4EF6\u53CA\u5176\u6D45\u84DD\u539A\u5EA6\u8D85\u51FA\u9884\u89C8\u753B\u5E03\u3002");
    return { x, y, w, h };
  }
  function text2(h, x, y, value, size, maxWidth, extra2 = "", min = 16) {
    const s = copy(value, "\u6587\u5B57"), fs = Math.min(size, maxWidth / Math.max(1, units2(s)));
    if (fs < min) throw Error("\u6587\u5B57\u5BBD\u5EA6\u4E0D\u8DB3\uFF0C\u8BF7\u52A0\u5BBD\u90E8\u4EF6\u6216\u7F29\u77ED\u6587\u5B57\u3002");
    return `<text x="${x}" y="${y}" font-size="${fs}" fill="${tokens.ink}" ${extra2}>${h.esc(s)}</text>`;
  }
  var group = (type, p, content2) => `<g data-atom="${type}" data-atom-state="${String(p.state || p.mode || "normal")}" data-motion="item" transform="translate(${p.x} ${p.y})" style="${font}" fill="${tokens.ink}">${content2}</g>`;
  var canvas = (content2, name, h) => `<section class="ani-controls-stage"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${h.esc(name)}" style="${font};background:transparent" fill="${tokens.ink}">${content2}</svg></section>`;
  function panel(w, h, fill = "#fff", r = 14, depth = 7) {
    return `<rect x="${depth}" y="${depth + 1}" width="${w}" height="${h}" rx="${r}" fill="${tokens.shadow}"/><rect width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${tokens.ink}" stroke-width="3"/><path d="M7 ${h - r}Q7 ${h - 7} ${r} ${h - 7}H${w - r}Q${w - 7} ${h - 7} ${w - 7} ${h - r}" fill="none" stroke="#d5edff" stroke-width="3"/>`;
  }
  function symbol(kind, cx, cy, size, color2) {
    const s = size / 32;
    let d = "";
    if (kind === "check") d = '<path d="M5 16L13 24L27 7"/>';
    else if (kind === "plus") d = '<path d="M16 5V27M5 16H27"/>';
    else if (kind === "arrow") d = '<path d="M5 16H26M18 7L27 16L18 25"/>';
    else if (kind === "error") d = '<path d="M16 5V19M16 26h.01"/>';
    else if (kind === "play") return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${s})"><path d="M9 5L27 16L9 27Z" fill="${color2}"/></g>`;
    else if (kind === "dot") return `<circle cx="${cx}" cy="${cy}" r="${size * 0.18}" fill="${color2}"/>`;
    else return "";
    return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${s})" fill="none" stroke="${color2}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
  }
  function lock(cx, cy, size) {
    const s = size / 30;
    return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${s})" fill="none" stroke="#527094" stroke-width="2.5" stroke-linecap="round"><rect x="6" y="13" width="18" height="14" rx="3"/><path d="M10 13V8a5 5 0 0 1 10 0v5"/><path d="M15 19v3"/></g>`;
  }
  var windowDefaults = { x: 175, y: 125, objectWidth: 930, objectHeight: 450, title: "\u5DE5\u4F5C\u7A97\u53E3", showControls: true, chromeHeight: 52 };
  function renderWindowAtom(props, h) {
    const p = { ...windowDefaults, ...props }, g = geo(p, 260, 140), ch = num2(p.chromeHeight, "chromeHeight", 36, 84);
    if (ch > g.h - 50) throw Error("\u7A97\u53E3\u6807\u9898\u680F\u8FC7\u9AD8\u3002");
    const cr = Math.min(7, ch * 0.14), controls2 = p.showControls ? [0, 1, 2].map((i) => `<circle cx="${25 + i * (cr * 3.2)}" cy="${ch / 2}" r="${cr}" fill="#fff" stroke="${tokens.ink}" stroke-width="1.8"/>`).join("") : "";
    const chrome = `<path d="M18 0H${g.w - 18}Q${g.w} 0 ${g.w} 18V${ch}H0V18Q0 0 18 0Z" fill="#66a8f1"/><path d="M1 ${ch}H${g.w - 1}" stroke="${tokens.ink}" stroke-width="2.2"/>${controls2}${text2(h, g.w - 22, ch * 0.66, p.title, Math.min(25, ch * 0.46), g.w - (p.showControls ? 140 : 44), 'text-anchor="end"')}`;
    return group("window", g, `${panel(g.w, g.h)}${chrome}<rect width="${g.w}" height="${g.h}" rx="14" fill="none" stroke="${tokens.ink}" stroke-width="3"/>`);
  }
  var tabsDefaults = { x: 220, y: 302, objectWidth: 830, objectHeight: 66, tabs: ["\u9879\u76EE\u8D44\u6599", "\u5DE5\u4F5C\u8BB0\u5F55", "\u53C2\u8003\u7D20\u6750"], activeTab: 0 };
  function renderTabsAtom(props, h) {
    const p = { ...tabsDefaults, ...props }, g = geo(p, 240, 56);
    if (!Array.isArray(p.tabs) || p.tabs.length < 1 || p.tabs.length > 5) throw Error("\u6807\u7B7E\u680F\u652F\u6301 1\u20135 \u4E2A\u6807\u7B7E\u3002");
    const active = num2(p.activeTab, "activeTab", 0, p.tabs.length - 1);
    if (!Number.isInteger(active)) throw Error("activeTab \u5FC5\u987B\u4E3A\u6574\u6570\u3002");
    const gap = 9, tabW = (g.w - 18 - gap * (p.tabs.length - 1)) / p.tabs.length;
    const tabs2 = p.tabs.map((value, i) => {
      const xx = 9 + i * (tabW + gap), yy = i === active ? 6 : 13, hh = g.h - yy - 5, fill = i === active ? "#fff" : "#dceeff";
      return `<g data-atom-tab="${i}"><path d="M${xx} ${g.h - 5}V${yy + 12}Q${xx} ${yy} ${xx + 12} ${yy}H${xx + tabW - 12}Q${xx + tabW} ${yy} ${xx + tabW} ${yy + 12}V${g.h - 5}Z" fill="${fill}" stroke="${tokens.ink}" stroke-width="2"/>${text2(h, xx + tabW / 2, yy + hh * 0.62, value, Math.min(26, hh * 0.48), tabW - 26, 'text-anchor="middle"')}</g>`;
    }).join("");
    return group("tabs", g, `<rect x="5" y="8" width="${g.w}" height="${g.h}" rx="12" fill="${tokens.shadow}"/><rect width="${g.w}" height="${g.h}" rx="12" fill="#94c6f8" stroke="${tokens.ink}" stroke-width="2.5"/>${tabs2}<path d="M1 ${g.h - 5}H${g.w - 1}" stroke="${tokens.ink}" stroke-width="2"/>`);
  }
  var addressDefaults = { x: 230, y: 307, objectWidth: 810, objectHeight: 64, address: "workspace.example / project", showLock: true };
  function renderAddressAtom(props, h) {
    const p = { ...addressDefaults, ...props }, g = geo(p, 220, 42), isLock = Boolean(p.showLock), left = isLock ? 60 : 24, fs = Math.min(26, g.h * 0.39);
    return group("address", g, `${panel(g.w, g.h, "#edf7ff", Math.min(17, g.h * 0.27), 5)}${isLock ? lock(30, g.h / 2, Math.min(29, g.h * 0.47)) : ""}${text2(h, left, g.h / 2 + fs * 0.34, p.address, fs, g.w - left - 24, 'style="fill:#527094"')}`);
  }
  var buttonDefaults = { x: 467, y: 301, objectWidth: 338, objectHeight: 88, label: "\u5F00\u59CB\u5904\u7406", state: "normal", accent: "blue", icon: "play" };
  function renderButtonAtom(props, h) {
    const p = { ...buttonDefaults, ...props }, g = geo(p, 100, 42);
    choice(p.state, ["normal", "pressed", "disabled"], "state");
    choice(p.accent, Object.keys(colors), "accent");
    choice(p.icon, ["none", "play", "plus", "check", "arrow"], "icon");
    const disabled = p.state === "disabled", pressed = p.state === "pressed", fill = disabled ? "#dce5ef" : colors[p.accent], fg = disabled || p.accent === "orange" || p.accent === "neutral" ? tokens.ink : "#fff", offset = pressed ? 5 : 0, depth = pressed ? 2 : 8, r = Math.min(16, g.h * 0.2), hasIcon = p.icon !== "none", size = Math.min(34, g.h * 0.42), label2 = copy(p.label, "\u6309\u94AE\u6587\u5B57", 30), fs = Math.min(34, g.h * 0.42, (g.w - (hasIcon ? size + 55 : 34)) / Math.max(1, units2(label2)));
    if (fs < 16) throw Error("\u6309\u94AE\u6587\u5B57\u8FC7\u957F\u3002");
    const textW = units2(label2) * fs, total = textW + (hasIcon ? size + 15 : 0), begin = (g.w - total) / 2;
    return group("button", { ...g, state: p.state }, `<rect x="${depth}" y="${depth + offset}" width="${g.w}" height="${g.h}" rx="${r}" fill="${disabled ? "#ced9e5" : tokens.shadow}"/><g transform="translate(0 ${offset})"><rect width="${g.w}" height="${g.h}" rx="${r}" fill="${fill}" stroke="${tokens.ink}" stroke-width="3"/><rect x="6" y="6" width="${g.w - 12}" height="${g.h - 12}" rx="${Math.max(6, r - 4)}" fill="none" stroke="${disabled ? "#f4f8fb" : "#a5d9ff"}" stroke-width="2"/><path d="M17 12H${Math.min(g.w - 17, 76)}" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="${disabled ? 0.45 : 0.65}"/>${hasIcon ? symbol(p.icon, begin + size / 2, g.h / 2, size, fg) : ""}${text2(h, begin + (hasIcon ? size + 15 : 0), g.h / 2 + fs * 0.34, label2, fs, textW + 1, `style="fill:${fg}"`)}</g>`);
  }
  var inputDefaults = { x: 260, y: 298, objectWidth: 750, objectHeight: 78, value: "\u628A\u6807\u9898\u7F29\u77ED\u5230 12 \u4E2A\u5B57", placeholder: "\u8F93\u5165\u4F60\u7684\u8981\u6C42", state: "input", errorText: "\u8BF7\u8865\u5145\u5177\u4F53\u8981\u6C42", showCaret: true };
  function renderInputAtom(props, h) {
    const p = { ...inputDefaults, ...props };
    choice(p.state, ["empty", "input", "error"], "state");
    const g = geo(p, 220, 50, p.state === "error" ? 53 : 12), error = p.state === "error", empty = p.state === "empty", label2 = empty ? p.placeholder : p.value, fs = Math.min(29, g.h * 0.37), right = error ? 58 : 28, fg = empty ? "#527094" : tokens.ink, stroke = error ? "#a85b08" : p.state === "input" ? tokens.blue : tokens.ink, s = copy(label2, "\u8F93\u5165\u6587\u5B57", 80);
    const fitted = Math.min(fs, (g.w - 30 - right) / Math.max(1, units2(s)));
    if (fitted < 18) throw Error("\u8F93\u5165\u6587\u5B57\u592A\u957F\uFF0C\u8BF7\u589E\u52A0\u5BBD\u5EA6\u3002");
    const lineEnd = Math.min(g.w - right, 25 + units2(s) * fitted + 5);
    return group("input", { ...g, state: p.state }, `${panel(g.w, g.h, error ? "#fff8ed" : "#fff", 13, 6)}<rect width="${g.w}" height="${g.h}" rx="13" fill="none" stroke="${stroke}" stroke-width="${empty ? 2.6 : 3.4}"/>${text2(h, 25, g.h / 2 + fitted * 0.34, s, fitted, g.w - 30 - right, `style="fill:${fg}"`, 18)}${p.showCaret && !empty && !error ? `<path d="M${lineEnd} ${g.h * 0.26}V${g.h * 0.73}" stroke="${tokens.blue}" stroke-width="2.5" stroke-linecap="round"/>` : ""}${error ? `${symbol("error", g.w - 28, g.h / 2, 28, "#8b4709")}${text2(h, 6, g.h + 37, p.errorText, 21, g.w - 12, 'style="fill:#8b4709"')}` : ""}`);
  }
  var statusDefaults = { x: 495, y: 304, objectWidth: 280, objectHeight: 76, label: "\u5DF2\u5B8C\u6210", state: "success", showIcon: true };
  function renderStatusAtom(props, h) {
    const p = { ...statusDefaults, ...props }, g = geo(p, 110, 44);
    choice(p.state, ["success", "pending", "error", "neutral", "info"], "state");
    const look = { success: { fill: tokens.green, fg: "#fff", icon: "check" }, pending: { fill: tokens.orange, fg: tokens.ink, icon: "dot" }, error: { fill: "#ffe4c9", fg: tokens.ink, icon: "error" }, neutral: { fill: "#e1eaf3", fg: tokens.ink, icon: "dot" }, info: { fill: tokens.blue, fg: "#fff", icon: "dot" } }[p.state], label2 = copy(p.label, "\u72B6\u6001\u6587\u5B57", 22), size = Math.min(31, g.h * 0.42), fs = Math.min(30, g.h * 0.42, (g.w - (p.showIcon ? size + 44 : 26)) / Math.max(1, units2(label2)));
    if (fs < 17) throw Error("\u72B6\u6001\u6807\u7B7E\u6587\u5B57\u8FC7\u957F\u3002");
    const total = units2(label2) * fs + (p.showIcon ? size + 10 : 0), left = (g.w - total) / 2;
    return group("status", { ...g, state: p.state }, `<rect x="5" y="7" width="${g.w}" height="${g.h}" rx="${g.h / 2}" fill="${tokens.shadow}"/><rect width="${g.w}" height="${g.h}" rx="${g.h / 2}" fill="${look.fill}" stroke="${tokens.ink}" stroke-width="2.6"/><path d="M${g.h * 0.4} 9H${Math.min(g.w - g.h * 0.4, g.h * 0.4 + 52)}" stroke="#fff" stroke-width="2.4" opacity=".5" stroke-linecap="round"/>${p.showIcon ? symbol(look.icon, left + size / 2, g.h / 2, size, look.fg) : ""}${text2(h, left + (p.showIcon ? size + 10 : 0), g.h / 2 + fs * 0.34, label2, fs, units2(label2) * fs + 1, `style="fill:${look.fg}"`)}`);
  }
  var checkboxDefaults = { x: 377, y: 304, objectWidth: 526, objectHeight: 76, label: "\u5DF2\u5BF9\u7167\u8981\u6C42\u68C0\u67E5", state: "checked" };
  function renderCheckboxAtom(props, h) {
    const p = { ...checkboxDefaults, ...props }, g = geo(p, 60, 38);
    choice(p.state, ["unchecked", "checked", "error"], "state");
    const side = Math.min(61, g.h - 8), yy = (g.h - side) / 2, checked = p.state === "checked", error = p.state === "error", fill = checked ? tokens.green : error ? "#fff1d9" : "#fff", r = Math.min(13, side * 0.19), label2 = copy(p.label, "\u52FE\u9009\u8BF4\u660E", 50), fontSize = Math.min(30, g.h * 0.43), textSpace = g.w - side - 29;
    let labelSvg = "";
    if (label2) {
      if (textSpace < 50) throw Error("\u52FE\u9009\u8BF4\u660E\u9700\u8981\u66F4\u5BBD\u7684\u90E8\u4EF6\u3002");
      labelSvg = text2(h, side + 26, g.h / 2 + fontSize * 0.34, label2, fontSize, textSpace);
    }
    return group("checkbox", { ...g, state: p.state }, `<rect x="5" y="${yy + 6}" width="${side}" height="${side}" rx="${r}" fill="${tokens.shadow}"/><rect y="${yy}" width="${side}" height="${side}" rx="${r}" fill="${fill}" stroke="${error ? "#9c600e" : tokens.ink}" stroke-width="3"/>${checked ? symbol("check", side / 2, g.h / 2, side * 0.7, "#fff") : error ? symbol("error", side / 2, g.h / 2, side * 0.6, "#915109") : ""}${labelSvg}`);
  }
  var cursorDefaults = { x: 535, y: 234, objectWidth: 185, objectHeight: 235, mode: "pointer", accent: "blue" };
  function renderCursorAtom(props, h) {
    const p = { ...cursorDefaults, ...props }, g = geo(p, 50, 70);
    choice(p.mode, ["pointer", "click"], "mode");
    choice(p.accent, ["blue", "green", "orange"], "accent");
    const scale = Math.min(g.w / 200, g.h / 240), dx = (g.w - 200 * scale) / 2, dy = (g.h - 240 * scale) / 2, shape = "M64 64L64 188L97 166L119 212L142 201L120 156L162 151Z";
    const click = p.mode === "click" ? `<circle cx="64" cy="64" r="39" fill="none" stroke="${colors[p.accent]}" stroke-width="4" opacity=".55"/><path d="M64 9V23M9 64H23M24 24L34 34M97 25L107 15" fill="none" stroke="${colors[p.accent]}" stroke-width="6" stroke-linecap="round"/>` : "";
    return group("cursor", { ...g, mode: p.mode }, `<g transform="translate(${dx} ${dy}) scale(${scale})">${click}<path d="${shape}" transform="translate(7 8)" fill="${tokens.shadow}"/><path d="${shape}" fill="#fff" stroke="${tokens.ink}" stroke-width="4.7" stroke-linejoin="round"/><path d="M71 80V173L96 154L120 199" fill="none" stroke="${colors[p.accent]}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></g>`);
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
  var units3 = (s) => [...String(s)].reduce((n3, c) => n3 + (/[\x00-\x7f]/.test(c) ? 0.56 : 1), 0);
  var num3 = (v, min, max, name) => {
    const n3 = Number(v);
    if (!Number.isFinite(n3) || n3 < min || n3 > max) throw Error(`${name} \u9700\u8981\u5728 ${min}\u2013${max} \u4E4B\u95F4\u3002`);
    return n3;
  };
  function geom(p, minW) {
    const x = num3(p.x, 0, 1200, "x"), y = num3(p.y, 0, 650, "y"), w = num3(p.objectWidth, minW, 1220, "objectWidth"), height = num3(p.objectHeight, 80, 480, "objectHeight");
    if (x + w + 10 > 1280 || y + height + 10 > 720) throw Error("\u5BF9\u8C61\u9700\u5728\u753B\u5E03\u8303\u56F4\u5185\u3002");
    return { x, y, w, height };
  }
  function lines(text6, width, size) {
    const out = [];
    let line3 = "";
    for (const c of [...String(text6 ?? "")]) {
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
    return `<g data-atom-cell="true"><rect x="${x}" y="0" width="${w}" height="${height}" fill="${tone3}"/>${ls.map((s, i) => `<text x="${x + w / 2}" y="${height / 2 + (i - (ls.length - 1) / 2) * size * 1.25 + size * 0.34}" text-anchor="middle" font-size="${size}" fill="${tokens.ink}">${h.esc(s)}</text>`).join("")}</g>`;
  }
  var outer = (type, g, body) => `<g data-atom="${type}" data-motion="item" transform="translate(${g.x} ${g.y})" font-family="Microsoft YaHei,Segoe UI,sans-serif" font-weight="750">${body}</g>`;
  var preview = (body) => `<section class="ani-data-atom"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">${body}</svg></section>`;
  var cellDefaults = { x: 445, y: 275, objectWidth: 390, objectHeight: 160, text: "\u672C\u6708\u5DF2\u5B8C\u6210", tone: "green", selected: true };
  function renderCellAtom(props, h) {
    const p = { ...cellDefaults, ...props }, g = geom(p, 180);
    return outer("cell", g, `<rect x="6" y="7" width="${g.w}" height="${g.height}" rx="10" fill="${tokens.shadow}"/>${content(p, 0, g.w, g.height, h)}<rect width="${g.w}" height="${g.height}" rx="2" fill="none" stroke="${p.selected ? tokens.blue : tokens.ink}" stroke-width="${p.selected ? 4 : 2.5}"/>${p.selected ? `<rect x="${g.w - 5}" y="${g.height - 5}" width="10" height="10" rx="2" fill="${tokens.blue}"/>` : ""}`);
  }
  var tableRowDefaults = { x: 180, y: 292, objectWidth: 920, objectHeight: 128, cells: [{ text: "A01" }, { text: "09-03" }, { text: "\u5DF2\u5B8C\u6210", tone: "green" }, { text: "\u8BA1\u5165", tone: "blue" }], weights: [1, 1.2, 1.3, 1.2], selected: false };
  function renderTableRowAtom(props, h) {
    const p = { ...tableRowDefaults, ...props }, g = geom(p, 360);
    if (!Array.isArray(p.cells) || p.cells.length < 2 || p.cells.length > 6) throw Error("\u8868\u683C\u884C cells \u652F\u6301 2\u20136 \u4E2A\u5355\u5143\u683C\u3002");
    const weights = p.cells.map((_, i) => num3(p.weights?.[i] ?? 1, 0.5, 6, "\u5217\u5BBD\u6BD4\u4F8B")), total = weights.reduce((a, b) => a + b, 0);
    let x = 0;
    const cells = p.cells.map((c, i) => {
      const w = g.w * weights[i] / total;
      if (w < 82) throw Error("\u5355\u5143\u683C\u8FC7\u7A84\uFF0C\u8BF7\u589E\u52A0\u6574\u884C\u5BBD\u5EA6\u3002");
      const markup = content(c, x, w, g.height, h) + (i ? `<path d="M${x} 0V${g.height}" stroke="#8ba7ce" stroke-width="1.5"/>` : "");
      x += w;
      return markup;
    }).join("");
    return outer("table-row", g, `<rect x="6" y="7" width="${g.w}" height="${g.height}" rx="9" fill="${tokens.shadow}"/>${cells}<rect width="${g.w}" height="${g.height}" fill="none" stroke="${p.selected ? tokens.blue : tokens.ink}" stroke-width="${p.selected ? 4 : 2.5}"/>`);
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
  var units4 = (v) => Array.from(String(v ?? "")).reduce((n3, c) => n3 + (/[\u0000-\u00ff]/.test(c) ? 0.55 : 1), 0);
  function number(v, name, min, max) {
    const n3 = Number(v);
    if (!Number.isFinite(n3) || n3 < min || n3 > max) throw new Error(`${name} must be ${min}\u2013${max}`);
    return n3;
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
  function preview2(group4, label2, h) {
    return `<section class="ani-atom-scene"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${h.esc(label2)}" style="${font2};fill:${tokens.ink};background:transparent">${group4}</svg></section>`;
  }
  var nodeDefaults = { x: 420, y: 237, objectWidth: 430, objectHeight: 232, shape: "decision", label: "\u7B26\u5408\u8981\u6C42\uFF1F", caption: "\u6309\u6807\u51C6\u9010\u9879\u5224\u65AD", tone: "blue", state: "active" };
  function renderNodeAtom(props, h) {
    const p = { ...nodeDefaults, ...props }, { x, y, w, height } = geometry(p, 190, 108), colors3 = palette(p);
    choice2(p.shape, "shape", ["step", "decision", "terminal"]);
    const label2 = copy2(p.label, "label", 32), caption = copy2(p.caption, "caption", 48), diamond = p.shape === "decision", contentWidth = w * (diamond ? 0.57 : 0.82), labelSize = fit2(label2, Math.min(38, height * 0.23), contentWidth, 19), captionSize = caption ? fit2(caption, Math.min(22, height * 0.13), contentWidth, 17) : 0;
    if (diamond && height < 150 && caption) throw new Error("A decision with a caption requires objectHeight of at least 150");
    let d;
    if (diamond) d = `M${w / 2} 0L${w} ${height / 2}L${w / 2} ${height}L0 ${height / 2}Z`;
    else {
      const r = p.shape === "terminal" ? Math.min(height / 2, w / 2) : 20;
      d = `M${r} 0H${w - r}Q${w} 0 ${w} ${r}V${height - r}Q${w} ${height} ${w - r} ${height}H${r}Q0 ${height} 0 ${height - r}V${r}Q0 0 ${r} 0Z`;
    }
    const mainY = height / 2 + (caption ? -4 : labelSize * 0.34), subY = mainY + captionSize * 1.65;
    const gleam = diamond ? `M${w * 0.23} ${height * 0.37}L${w * 0.5} 9L${w * 0.77} ${height * 0.37}` : `M22 9H${Math.min(w - 26, 156)}`;
    return `<g data-atom="node" data-node-shape="${p.shape}" data-state="${p.state}" transform="translate(${x} ${y})" style="${font2}" data-text-panel="node" data-panel-bounds="${(w - contentWidth) / 2} ${height * 0.25} ${contentWidth} ${height * 0.52}">${pathFace(d, colors3.wash, p.state === "normal" ? tokens.ink : colors3.color)}<path d="${gleam}" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".9"/>${txt(w / 2, mainY, label2, labelSize, h, 'text-anchor="middle"')}${caption ? txt(w / 2, subY, caption, captionSize, h, 'text-anchor="middle" fill="#4e6d91"') : ""}</g>`;
  }
  var calloutDefaults = { x: 375, y: 225, objectWidth: 520, objectHeight: 244, title: "\u6838\u5BF9\u8FD9\u4E00\u70B9", body: "\u8981\u6C42\u5199\u6E05\u695A\u540E\uFF0C\u518D\u7528\u7ED3\u679C\u9010\u9879\u6838\u5BF9\u3002", direction: "bottom", pointerOffset: 0.25, tone: "blue", state: "normal" };
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
  var highlightDefaults = { x: 325, y: 249, objectWidth: 624, objectHeight: 206, shape: "rectangle", label: "\u91CD\u70B9\u68C0\u67E5", tone: "orange", state: "active", lineWidth: 6, dashed: false, fillOpacity: 0.055 };
  function renderHighlightAtom(props, h) {
    const p = { ...highlightDefaults, ...props }, { x, y, w, height } = geometry(p, 90, 54), colors3 = palette(p);
    choice2(p.shape, "shape", ["rectangle", "circle", "underline"]);
    const stroke = number(p.lineWidth, "lineWidth", 2, 12), fillOpacity = number(p.fillOpacity, "fillOpacity", 0, 0.25), label2 = copy2(p.label, "label", 36), dash = p.dashed ? 'stroke-dasharray="15 10"' : "", inset = stroke / 2 + 2;
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
    const size = label2 ? fit2(label2, Math.min(31, height * 0.25), textWidth, 17) : 0;
    return `<g data-atom="highlight" data-highlight-shape="${p.shape}" data-state="${p.state}" transform="translate(${x} ${y})" style="${font2}">${art}${label2 ? txt(labelX, labelY, label2, size, h, 'text-anchor="middle"') : ""}</g>`;
  }
  var progressDefaults = { x: 235, y: 245, objectWidth: 800, objectHeight: 192, title: "\u5B8C\u6210\u8FDB\u5EA6", value: 60, steps: ["\u51C6\u5907", "\u6267\u884C", "\u68C0\u67E5", "\u5B8C\u6210"], tone: "blue", state: "active", showValue: true };
  function renderProgressAtom(props, h) {
    const p = { ...progressDefaults, ...props }, { x, y, w, height } = geometry(p, 360, 166), colors3 = palette(p), value = number(p.value, "value", 0, 100), title = copy2(p.title, "title", 42);
    if (!Array.isArray(p.steps) || p.steps.length < 2 || p.steps.length > 6) throw new Error("Progress steps require 2\u20136 labels");
    if (p.state === "complete" && value !== 100) throw new Error("Complete progress requires value 100");
    const labels = p.steps.map((v) => copy2(v, "step label", 14)), titleWidth = w - (p.showValue ? 115 : 20), titleSize = title ? fit2(title, 29, titleWidth, 19) : 0, trackY = 57, trackHeight = 27, trackWidth = w - 6, fillWidth = (trackWidth - 3.4) * value / 100, nodeY = 120, labelY = 155, cellW = (w - 16) / (labels.length - 1), color2 = value === 100 ? tokens.green : colors3.color;
    const activeIndex = Math.min(labels.length - 1, Math.max(0, Math.ceil(value / 100 * (labels.length - 1))));
    const steps = labels.map((label2, i) => {
      const cx = 8 + i * cellW, done = value >= i / (labels.length - 1) * 100, active = i === activeIndex && value < 100, fg = done ? color2 : active ? colors3.color : "#8ca6c5", labelWidth = i === 0 || i === labels.length - 1 ? cellW * 0.78 : cellW * 0.86, labelSize = fit2(label2, 22, labelWidth, 17), anchor = i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle";
      return `<g data-atom-step="${i}" data-step-state="${done ? "complete" : active ? "active" : "pending"}"><circle cx="${cx}" cy="${nodeY}" r="8" fill="${done ? color2 : "white"}" stroke="${fg}" stroke-width="2.5"/>${active ? `<circle cx="${cx}" cy="${nodeY}" r="3.5" fill="${fg}"/>` : ""}${txt(cx, labelY, label2, labelSize, h, `text-anchor="${anchor}" fill="${done || active ? tokens.ink : "#6e87a5"}"`)}</g>`;
    }).join("");
    if (labelY + 10 > height) throw new Error("Progress objectHeight must leave room for step labels");
    return `<g data-atom="progress" data-state="${p.state}" data-value="${value}" transform="translate(${x} ${y})" style="${font2}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}" aria-label="${h.esc(title || "\u8FDB\u5EA6")}">${title ? txt(0, 31, title, titleSize, h) : ""}${p.showValue ? txt(w, 32, value + "%", 32, h, 'text-anchor="end"') : ""}<rect x="4" y="${trackY + 6}" width="${trackWidth}" height="${trackHeight}" rx="13.5" fill="${tokens.shadow}"/><rect x="0" y="${trackY}" width="${trackWidth}" height="${trackHeight}" rx="13.5" fill="#edf5ff" stroke="${tokens.ink}" stroke-width="2.7"/>${value > 0 ? `<rect data-atom-progress-fill x="1.7" y="${trackY + 1.7}" width="${fillWidth}" height="${trackHeight - 3.4}" rx="${Math.min(11.8, Math.max(0, fillWidth / 2))}" fill="${color2}"/>` : ""}<path d="M8 ${nodeY}H${w - 8}" stroke="#b9d3e9" stroke-width="3"/>${steps}</g>`;
  }
  var symbolDefaults = { x: 487, y: 204, objectWidth: 294, objectHeight: 302, kind: "magnifier", label: "\u68C0\u67E5", tone: "blue", state: "normal", rotation: 0 };
  var symbolKinds = ["magnifier", "pencil", "gear", "link", "check", "document", "documents", "table", "calendar", "people"];
  function renderSymbolAtom(props, h) {
    const p = { ...symbolDefaults, ...props }, { x, y, w, height } = geometry(p, 100, 110), colors3 = palette(p);
    choice2(p.kind, "kind", symbolKinds);
    const label2 = copy2(p.label, "label", 24), rotation = number(p.rotation, "rotation", -180, 180), labelSpace = label2 ? 57 : 14, availableHeight = height - labelSpace - 20, diagonal = Math.abs(Math.cos(rotation * Math.PI / 180)) + Math.abs(Math.sin(rotation * Math.PI / 180)), size = Math.min(w - 35, availableHeight) / Math.max(1, diagonal), cx = w / 2, cy = availableHeight / 2 + 7, sx = cx - size / 2, sy = cy - size / 2;
    let art;
    if (p.kind === "magnifier") art = magnifier(sx, sy, size, h);
    else if (p.kind === "gear") art = gear(sx, sy, size, h);
    else if (p.kind === "pencil") art = `<g transform="translate(${sx} ${sy}) scale(${size / 100})"><path d="M14 87L25 59L73 10Q78 5 84 10L92 18Q97 23 92 29L44 77Z" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="3"/><path d="M73 10L92 29L83 38L64 19Z" fill="${tokens.orange}" stroke="${tokens.ink}" stroke-width="2.5"/><path d="M14 87L25 59L44 77Z" fill="#fff1d5" stroke="${tokens.ink}" stroke-width="3"/><path d="M14 87L20 72L29 81Z" fill="${tokens.ink}"/><path d="M35 59L70 23" stroke="#86caff" stroke-width="5" stroke-linecap="round"/></g>`;
    else art = icon(p.kind, sx, sy, size, h).replace(/<ellipse\b[^>]*\/>/, "");
    const state3 = p.state === "normal" ? "" : `<circle cx="${w - 25}" cy="24" r="13" fill="${colors3.color}" stroke="${tokens.ink}" stroke-width="2"/>${p.state === "complete" ? `<path d="M${w - 32} 24l5 5 9-10" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` : p.state === "warning" ? `${txt(w - 25, 30, "!", 19, h, 'text-anchor="middle"')}` : ""}`;
    return `<g data-atom="symbol" data-symbol-kind="${p.kind}" data-state="${p.state}" transform="translate(${x} ${y})" style="${font2}"><ellipse cx="${cx}" cy="${cy + size * 0.47 + 8}" rx="${size * 0.45}" ry="${Math.max(5, size * 0.055)}" fill="#dbeeff"/><g transform="rotate(${rotation} ${cx} ${cy})">${art}</g>${state3}${label2 ? txt(w / 2, height - 14, label2, fit2(label2, 30, w - 22, 18), h, 'text-anchor="middle"') : ""}</g>`;
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
  var scope = (h, id) => ({ ...h, uid: (s) => h.uid(id + "-" + s) });
  var finite = (value, fallback, min, max) => {
    const n3 = Number(value);
    return Math.min(max, Math.max(min, Number.isFinite(n3) ? n3 : fallback));
  };
  var units5 = (v) => [...String(v ?? "")].reduce((sum, c) => sum + (/[\x00-\x7f]/.test(c) ? 0.55 : 1), 0);
  function label(h, x, y, value, size, width, extra2 = "") {
    const s = String(value ?? "");
    if (units5(s) > 60) throw Error("\u57FA\u7840\u7EC4\u4EF6\u6807\u7B7E\u8FC7\u957F\uFF0C\u8BF7\u4F7F\u7528\u77ED\u8BED\u3002");
    const font5 = Math.min(size, width / Math.max(1, units5(s)));
    if (font5 < Math.min(size, 16)) throw Error("\u6807\u7B7E\u653E\u4E0D\u4E0B\uFF0C\u8BF7\u7F29\u77ED\u5185\u5BB9\uFF1B\u6587\u5B57\u4E0D\u4F1A\u7EE7\u7EED\u7F29\u5C0F\u6216\u8D8A\u8FC7\u90E8\u4EF6\u8FB9\u754C\u3002");
    return `<text x="${x}" y="${y}" font-size="${font5}" fill="${tokens.ink}" ${extra2}>${h.esc(s)}</text>`;
  }
  var color = (v) => ["blue", "green", "orange", "purple"].includes(v) ? tokens[v] : tokens.blue;
  function position(p, w, h) {
    const boxW = finite(p.objectWidth, w, 80, 1200), boxH = finite(p.objectHeight, h, 80, 680), scale = Math.min(boxW / w, boxH / h);
    const x = finite(p.x, 0, -1280, 1280) + (boxW - w * scale) / 2, y = finite(p.y, 0, -720, 720) + (boxH - h * scale) / 2;
    return `translate(${x} ${y}) scale(${scale})`;
  }
  var group2 = (type, p, w, h, content2) => `<g data-atom="${type}" data-fit="contain" data-motion="item" transform="${position(p, w, h)}" font-family="Microsoft YaHei,Segoe UI,sans-serif" font-weight="750">${content2}</g>`;
  var canvas2 = (content2) => `<section class="ani-atom-stage" style="width:100%;height:100%;background:transparent"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" style="font-family:'Microsoft YaHei','Segoe UI',sans-serif;font-weight:750" fill="${tokens.ink}">${content2}</svg></section>`;
  var fileDefaults = { x: 465, y: 115, objectWidth: 350, objectHeight: 470, name: "\u9879\u76EE\u8D44\u6599", meta: "\u53EF\u7F16\u8F91\u6587\u4EF6", fileType: "image", accent: "blue" };
  function fileSymbol(type, c) {
    if (type === "image") return `<rect x="82" y="91" width="150" height="111" rx="13" fill="${c}" stroke="${tokens.ink}" stroke-width="3"/><circle cx="120" cy="124" r="12" fill="#e9f8ff"/><path d="M93 188L132 146L156 168L180 135L219 188Z" fill="#e9f8ff"/>`;
    if (type === "table") return `<rect x="79" y="86" width="156" height="122" rx="10" fill="#f0fbf7" stroke="${tokens.ink}" stroke-width="3"/><path d="M81 118H233M81 149H233M81 178H233M128 87V207M184 87V207" fill="none" stroke="${c}" stroke-width="3"/><path d="M89 87H225Q234 87 234 97V117H80V97Q80 87 89 87Z" fill="${c}"/>`;
    if (type === "video") return `<rect x="80" y="91" width="156" height="111" rx="13" fill="${c}" stroke="${tokens.ink}" stroke-width="3"/><path d="M138 115L186 147L138 179Z" fill="white"/>`;
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
  var documentDefaults = { x: 345, y: 58, objectWidth: 590, objectHeight: 600, title: "\u9879\u76EE\u8BF4\u660E", subtitle: "\u628A\u9700\u8981\u505A\u7684\u4E8B\u5199\u6E05\u695A", accent: "blue", rows: [{ label: "\u5BF9\u8C61", text: "\u5404\u7EC4\u8D1F\u8D23\u4EBA", checked: true }, { label: "\u4EFB\u52A1", text: "\u586B\u5199\u672C\u5468\u5B8C\u6210\u4E0E\u5F85\u529E\u4E8B\u9879", checked: false }, { label: "\u65F6\u95F4", text: "\u5468\u4E94 17:00 \u524D", checked: false }, { label: "\u5165\u53E3", text: "\u5171\u4EAB\u8868\u683C", checked: false }] };
  function renderDocumentAtom(props, h) {
    const p = { ...documentDefaults, ...props };
    if (!Array.isArray(p.rows) || p.rows.length < 1 || p.rows.length > 6) throw Error("\u6587\u6863 rows \u652F\u6301 1\u20136 \u884C\u3002");
    if (units5(p.title) > 15) throw Error("\u6587\u6863\u6807\u9898\u8FC7\u957F\uFF0C\u8BF7\u4F7F\u7528 15 \u4E2A\u6C49\u5B57\u5BBD\u4EE5\u5185\u7684\u77ED\u6807\u9898\u3002");
    const rowH = Math.min(85, 386 / p.rows.length), top = 143;
    const rows2 = p.rows.map((r, i) => {
      const y = top + i * rowH;
      return `<g data-motion="item" data-text-panel="document-row-${i}" data-panel-bounds="29 ${y} 503 ${rowH - 8}"><rect x="29" y="${y}" width="503" height="${rowH - 8}" rx="12" fill="${i % 2 ? "#fff7e8" : "#edf7ff"}" stroke="#bdd3e6" stroke-width="1.4"/>${label(h, 47, y + rowH * 0.54, r.label, 22, 88)}<path d="M143 ${y + 14}V${y + rowH - 22}" stroke="#b7cfe5" stroke-width="1.5"/>${label(h, 158, y + rowH * 0.54, r.text, 24, 323)}${r.checked ? `<circle cx="504" cy="${y + (rowH - 8) / 2}" r="12" fill="${tokens.green}" stroke="${tokens.ink}" stroke-width="1.5"/><path d="M497 ${y + (rowH - 8) / 2}l5 5 9-11" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` : ""}</g>`;
    }).join("");
    const content2 = `${banner(100, 25, 352, p.title, color(p.accent), scope(h, "document-title"))}${label(h, 280, 122, p.subtitle, 23, 467, 'text-anchor="middle"')}${rows2}`;
    return group2("document", p, 580, 590, paper(0, 0, 561, 571, { fold: 43, depth: 10, content: content2 }, scope(h, "document")));
  }
  var folderDefaults = { x: 290, y: 105, objectWidth: 700, objectHeight: 500, name: "\u9879\u76EE\u8D44\u6599", subtitle: "\u6587\u4EF6\u96C6\u4E2D\u5728\u4E00\u8D77", open: true, fileLabels: ["\u9700\u6C42", "\u7D20\u6750", "\u7ED3\u679C"], accent: "blue" };
  function renderFolderAtom(props, h) {
    const p = { ...folderDefaults, ...props };
    if (!Array.isArray(p.fileLabels) || p.fileLabels.length > 4) throw Error("\u6587\u4EF6\u5939 fileLabels \u652F\u6301 0\u20134 \u9879\u3002");
    const c = color(p.accent);
    const back = `<path d="M58 198Q50 175 78 175H283L316 204H641Q668 204 660 231L604 447H107Z" fill="#82bef0" stroke="${tokens.ink}" stroke-width="4"/>`;
    const files2 = p.open ? p.fileLabels.map((name, i) => {
      const x = 104 + i * (440 / Math.max(1, p.fileLabels.length)), y = 59 + (i % 2 ? 0 : 18);
      return `<g transform="rotate(${(i - (p.fileLabels.length - 1) / 2) * 5} ${x + 86} ${y + 116})">${paper(x, y, 165, 247, { fold: 31, depth: 7, content: `<rect x="27" y="33" width="43" height="42" rx="7" fill="${c}"/><path d="M39 53H59M49 43V63" stroke="white" stroke-width="3"/>${label(h, 27, 112, name, 25, 115)}<path d="M29 146H135M29 170H128M29 194H109" stroke="#bdd4e7" stroke-width="7" stroke-linecap="round"/>` }, scope(h, "folder-file-" + i))}</g>`;
    }).join("") : "";
    const top = p.open ? 253 : 207;
    const front = `<path d="M77 ${top + 12}Q70 ${top - 9} 94 ${top - 9}H276L305 ${top + 9}H637Q662 ${top + 9} 653 ${top + 34}L608 451Q604 469 585 469H126Q109 469 105 451Z" transform="translate(9 10)" fill="${tokens.shadow}"/><path d="M77 ${top + 12}Q70 ${top - 9} 94 ${top - 9}H276L305 ${top + 9}H637Q662 ${top + 9} 653 ${top + 34}L608 451Q604 469 585 469H126Q109 469 105 451Z" fill="#d6edff" stroke="${tokens.ink}" stroke-width="4"/><path d="M111 ${top + 24}H611" stroke="white" stroke-width="5" stroke-linecap="round"/><rect x="166" y="324" width="396" height="93" rx="15" fill="#f8fdff" stroke="#a8cae8" stroke-width="2"/>${label(h, 364, 367, p.name, 33, 358, 'text-anchor="middle"')}${label(h, 364, 397, p.subtitle, 19, 355, 'text-anchor="middle"')}`;
    return group2("folder", p, 720, 490, back + files2 + front);
  }
  var common2 = { category: "\u52A8\u753B\u98CE \xB7 \u57FA\u7840\u7EC4\u4EF6", width: 1280, height: 720, defaultEffect: "none", reference: { level: "designed", basis: "\u4ECE\u7528\u6237\u63D0\u4F9B\u7684\u84DD\u8272\u63D2\u753B\u53C2\u8003\u548C\u73B0\u6709\u52A8\u753B\u98CE\u573A\u666F\u7EC6\u62C6\uFF1B\u900F\u660E\u753B\u5E03\u3001\u72EC\u7ACB\u5BF9\u8C61\uFF0C\u53EF\u7F16\u8F91\u4E0E\u7EC4\u5408\u3002", source: "references/animation-style/sources.json" } };
  var components5 = [
    { ...common2, id: "ani-atom-file", name: "\u52A8\u753B\u90E8\u4EF6 \xB7 \u6587\u4EF6", description: "\u5355\u4E2A\u6298\u89D2\u6587\u4EF6\u5BF9\u8C61\uFF0C\u6587\u4EF6\u540D\u6700\u591A\u4E09\u884C\u3001\u4FDD\u6301\u53EF\u8BFB\u5B57\u53F7\uFF1B\u652F\u6301\u6587\u672C\u3001\u56FE\u7247\u3001\u8868\u683C\u6216\u89C6\u9891\u56FE\u6807\u3002\u5BBD\u9AD8\u5B9A\u4E49\u5BB9\u7EB3\u533A\u57DF\uFF0C\u56FE\u5F62\u4E0E\u6587\u5B57\u7B49\u6BD4\u9002\u914D\u3002", defaults: fileDefaults, render: (p, h) => canvas2(renderFileAtom(p, h)) },
    { ...common2, id: "ani-atom-document", name: "\u52A8\u753B\u90E8\u4EF6 \xB7 \u6587\u6863", description: "\u72EC\u7ACB\u6587\u6863\u7EB8\u5F20\uFF0C\u6807\u9898\u3001\u526F\u6807\u9898\u548C 1\u20136 \u884C\u6B63\u6587\u53EF\u6539\uFF0C\u53EF\u9010\u884C\u52FE\u9009\uFF1B\u5BBD\u9AD8\u5B9A\u4E49\u7B49\u6BD4\u5BB9\u7EB3\u533A\u57DF\uFF0C\u6587\u5B57\u4E0E\u52FE\u9009\u5706\u4E0D\u62C9\u4F38\u3002", defaults: documentDefaults, render: (p, h) => canvas2(renderDocumentAtom(p, h)) },
    { ...common2, id: "ani-atom-folder", name: "\u52A8\u753B\u90E8\u4EF6 \xB7 \u6587\u4EF6\u5939", description: "\u72EC\u7ACB\u6587\u4EF6\u5939\uFF0C\u53EF\u5207\u6362\u6253\u5F00/\u5173\u95ED\u3001\u7F16\u8F91\u6587\u4EF6\u6807\u7B7E\u53CA\u540D\u79F0\uFF1B\u900F\u660E\u80CC\u666F\uFF0C\u5BBD\u9AD8\u5B9A\u4E49\u7B49\u6BD4\u5BB9\u7EB3\u533A\u57DF\u3002", defaults: folderDefaults, render: (p, h) => canvas2(renderFolderAtom(p, h)) }
  ];

  // families/animation-style-atoms-paper-parts.mjs
  var font3 = "font-family:'Microsoft YaHei','Segoe UI',sans-serif;font-weight:750";
  var units6 = (s) => [...String(s ?? "")].reduce((n3, c) => n3 + (/[\x00-\x7f]/.test(c) ? 0.55 : 1), 0);
  var scope2 = (h, id) => ({ ...h, uid: (s) => h.uid(id + "-" + s) });
  var num4 = (v, name, min, max) => {
    const n3 = Number(v);
    if (!Number.isFinite(n3) || n3 < min || n3 > max) throw Error(`${name} \u9700\u5728 ${min}\u2013${max} \u4E4B\u95F4\u3002`);
    return n3;
  };
  var tone = (v) => {
    if (!["blue", "green", "orange", "purple"].includes(v)) throw Error("accent \u9700\u4E3A blue\u3001green\u3001orange \u6216 purple\u3002");
    return tokens[v];
  };
  var text3 = (h, x, y, value, size, extra2 = "") => `<text x="${x}" y="${y}" font-size="${size}" fill="${tokens.ink}" ${extra2}>${h.esc(String(value ?? ""))}</text>`;
  function geom2(p, minW, minH) {
    return { x: num4(p.x, "x", -1280, 1280), y: num4(p.y, "y", -720, 720), w: num4(p.objectWidth, "objectWidth", minW, 1240), h: num4(p.objectHeight, "objectHeight", minH, 700) };
  }
  var group3 = (type, g, content2) => `<g data-atom="${type}" data-motion="item" transform="translate(${g.x} ${g.y})" style="${font3}" fill="${tokens.ink}">${content2}</g>`;
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
  var paperDefaults = { x: 400, y: 80, objectWidth: 480, objectHeight: 550, foldSize: 54, foldSide: "right", depth: 10, ruling: "none", lineSpacing: 38 };
  function renderPaperAtom(props, helpers2) {
    const p = { ...paperDefaults, ...props }, h = scope2(helpers2, "paper-part"), g = geom2(p, 160, 140), depth = num4(p.depth, "depth", 0, 18), w = g.w - depth - 4, height = g.h - depth - 4;
    const fold = Math.min(num4(p.foldSize, "foldSize", 16, 100), w * 0.24, height * 0.2), spacing = num4(p.lineSpacing, "lineSpacing", 24, 64);
    if (!["right", "left"].includes(p.foldSide) || !["none", "lines", "grid"].includes(p.ruling)) throw Error("foldSide \u4F7F\u7528 left/right\uFF1Bruling \u4F7F\u7528 none/lines/grid\u3002");
    let ruled = "";
    if (p.ruling !== "none") {
      for (let y = fold + 32; y < height - 24; y += spacing) ruled += `M28 ${y}H${w - 28}`;
      if (p.ruling === "grid") for (let x = 28; x <= w - 28; x += spacing) ruled += `M${x} ${fold + 32}V${height - 24}`;
    }
    const shape = paper(2, 2, w, height, { fold, depth, content: ruled ? `<path d="${ruled}" stroke="#b9d6ed" stroke-width="1.6" fill="none"/>` : "" }, h);
    return group3("paper", g, p.foldSide === "left" ? `<g transform="translate(${g.w} 0) scale(-1 1)">${shape}</g>` : shape);
  }
  var textDefaults = { x: 180, y: 200, objectWidth: 920, objectHeight: 300, title: "\u5148\u628A\u8981\u6C42\u8BF4\u6E05\u695A", text: "\u8C01\u6765\u505A\u3001\u505A\u4EC0\u4E48\u3001\u4EC0\u4E48\u65F6\u5019\u5B8C\u6210\u3002\n\u5B8C\u6210\u540E\uFF0C\u62FF\u7ED3\u679C\u5BF9\u7167\u8FD9\u4E9B\u8981\u6C42\u518D\u68C0\u67E5\u3002", fontSize: 32, titleSize: 44, lineHeight: 1.5, align: "left", variant: "paragraph", accent: "blue" };
  function renderTextAtom(props, helpers2) {
    const p = { ...textDefaults, ...props }, h = scope2(helpers2, "text-part"), g = geom2(p, 160, 80), fs = num4(p.fontSize, "fontSize", 20, 64), ts = num4(p.titleSize, "titleSize", 24, 76), lh = num4(p.lineHeight, "lineHeight", 1.2, 1.9), accent = tone(p.accent);
    if (!["left", "center", "right"].includes(p.align) || !["paragraph", "bullets"].includes(p.variant)) throw Error("align \u4F7F\u7528 left/center/right\uFF1Bvariant \u4F7F\u7528 paragraph/bullets\u3002");
    if (p.variant === "bullets" && p.align !== "left") throw Error("\u6761\u76EE\u6A21\u5F0F\u8BF7\u4F7F\u7528\u5DE6\u5BF9\u9F50\u3002");
    const inset = p.variant === "bullets" ? 30 : 0, x = p.align === "center" ? g.w / 2 : p.align === "right" ? g.w - 4 : 4 + inset, anchor = p.align === "center" ? "middle" : p.align === "right" ? "end" : "start";
    let cursor = 0, content2 = "";
    if (String(p.title ?? "")) {
      const size = fit3(p.title, g.w - 8, ts, 24, "\u6BB5\u843D\u6807\u9898");
      cursor = size;
      content2 += text3(h, p.align === "left" ? 4 : x, cursor, p.title, size, `text-anchor="${anchor}" font-weight="900"`);
      const length = Math.min(g.w - 8, units6(p.title) * size), lineX = p.align === "center" ? (g.w - length) / 2 : p.align === "right" ? g.w - length - 4 : 4;
      content2 += `<path d="M${lineX} ${cursor + 13}H${lineX + length}" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`;
      cursor += 43;
    }
    const available = g.h - cursor, maxLines = Math.max(0, Math.floor(available / (fs * lh))), body = String(p.text ?? "") ? lines2(p.text, g.w - 8 - inset, fs, maxLines, "\u6BB5\u843D\u6B63\u6587") : [];
    if (!body.length && cursor > g.h + 20) throw Error("\u6587\u672C\u533A\u57DF\u9AD8\u5EA6\u4E0D\u8DB3\uFF0C\u8BF7\u589E\u52A0 objectHeight\u3002");
    body.forEach((line3, i) => {
      const y = cursor + fs + i * fs * lh;
      if (p.variant === "bullets" && line3) content2 += `<circle cx="11" cy="${y - fs * 0.34}" r="4.5" fill="${accent}"/>`;
      content2 += text3(h, x, y, line3, fs, `text-anchor="${anchor}"`);
    });
    return group3("text", g, content2);
  }
  var documentRowDefaults = { x: 190, y: 276, objectWidth: 900, objectHeight: 144, label: "\u4EFB\u52A1", text: "\u586B\u5199\u672C\u5468\u5B8C\u6210\u4E0E\u5F85\u529E\u4E8B\u9879", status: "complete", accent: "blue", fontSize: 30 };
  function renderDocumentRowAtom(props, helpers2) {
    const p = { ...documentRowDefaults, ...props }, h = scope2(helpers2, "row-part"), g = geom2(p, 340, 88), accent = tone(p.accent), fs = num4(p.fontSize, "fontSize", 22, 42);
    if (!["none", "pending", "complete", "warning"].includes(p.status)) throw Error("status \u4F7F\u7528 none/pending/complete/warning\u3002");
    const statusW = p.status === "none" ? 0 : 57, labelW = Math.min(154, Math.max(86, units6(p.label) * 23 + 32)), labelSize = fit3(p.label, labelW - 24, 25, 18, "\u6761\u76EE\u6807\u7B7E"), bodyX = labelW + 48, bodyW = g.w - bodyX - statusW - 30;
    if (bodyW < 72) throw Error("\u6761\u76EE\u592A\u7A84\uFF0C\u8BF7\u589E\u52A0 objectWidth\u3002");
    const maxLines = Math.min(3, Math.floor((g.h - 32) / (fs * 1.3))), body = lines2(p.text, bodyW, fs, maxLines, "\u6761\u76EE\u6B63\u6587"), firstY = (g.h - body.length * fs * 1.3) / 2 + fs;
    const fill = p.status === "warning" ? "#fff7e8" : p.status === "complete" ? "#effaf5" : "#f3f9ff", pillH = 48, pillY = (g.h - pillH) / 2, labelFg = p.accent === "orange" ? tokens.ink : "white";
    let content2 = `<rect x="4" y="6" width="${g.w - 8}" height="${g.h - 12}" rx="16" fill="${tokens.shadow}"/><rect x="1.5" y="1.5" width="${g.w - 8}" height="${g.h - 12}" rx="16" fill="${fill}" stroke="${tokens.ink}" stroke-width="2.5"/><rect x="18" y="${pillY}" width="${labelW}" height="${pillH}" rx="11" fill="${accent}" stroke="${tokens.ink}" stroke-width="1.8"/>${text3(h, 18 + labelW / 2, g.h / 2 + labelSize * 0.35, p.label, labelSize, `text-anchor="middle" style="fill:${labelFg}"`)}<path d="M${labelW + 33} 25V${g.h - 29}" stroke="#b7cfe5" stroke-width="1.5"/>`;
    content2 += body.map((line3, i) => text3(h, bodyX, firstY + i * fs * 1.3, line3, fs)).join("");
    const cx = g.w - 39, cy = g.h / 2;
    if (p.status === "complete") content2 += `<circle cx="${cx}" cy="${cy}" r="17" fill="${tokens.green}" stroke="${tokens.ink}" stroke-width="2"/><path d="M${cx - 8} ${cy}l6 7 12-14" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (p.status === "pending") content2 += `<circle cx="${cx}" cy="${cy}" r="17" fill="white" stroke="#7899bd" stroke-width="2.3"/>`;
    if (p.status === "warning") content2 += `<path d="M${cx} ${cy - 20}L${cx + 21} ${cy + 17}H${cx - 21}Z" fill="${tokens.orange}" stroke="${tokens.ink}" stroke-width="2" stroke-linejoin="round"/>${text3(h, cx, cy + 11, "!", 26, 'text-anchor="middle" font-weight="900"')}`;
    return group3("document-row", g, `<g data-text-panel="document-row" data-panel-bounds="2 2 ${g.w - 8} ${g.h - 12}">${content2}</g>`);
  }
  var fileStackDefaults = { x: 300, y: 92, objectWidth: 680, objectHeight: 520, files: [{ name: "\u9700\u6C42\u8BF4\u660E", fileType: "text", accent: "blue" }, { name: "\u53C2\u8003\u7D20\u6750", fileType: "image", accent: "purple" }, { name: "\u7ED3\u679C\u8BB0\u5F55", fileType: "table", accent: "green" }], meta: "\u6574\u7406\u540E\u7684\u8D44\u6599", layout: "stack" };
  function renderFileStackAtom(props, helpers2) {
    const p = { ...fileStackDefaults, ...props }, g = geom2(p, 220, 200);
    if (!Array.isArray(p.files) || p.files.length < 2 || p.files.length > 5) throw Error("\u6587\u4EF6\u5806\u53E0 files \u652F\u6301 2\u20135 \u4E2A\u6587\u4EF6\u3002");
    if (!["stack", "fan"].includes(p.layout)) throw Error("layout \u4F7F\u7528 stack/fan\u3002");
    const scale = Math.min(g.w / 720, g.h / 520), dx = (g.w - 720 * scale) / 2, dy = (g.h - 520 * scale) / 2, mid = (p.files.length - 1) / 2;
    const layers = p.files.map((file, i) => {
      const front = i === p.files.length - 1, delta = i - mid, back = p.files.length - 1 - i, x = p.layout === "fan" ? 210 + delta * 34 : 190 + back * 25, y = p.layout === "fan" ? 64 + Math.abs(delta) * 5 : 72 - back * 17, angle = p.layout === "fan" ? delta * 7 : 0;
      const art = renderFileAtom({ x, y, objectWidth: 300, objectHeight: 403.125, name: front ? file.name : "", meta: front ? p.meta : "", fileType: file.fileType || "text", accent: file.accent || "blue" }, scope2(helpers2, "stack-" + i));
      return `<g data-stack-layer="${i}" transform="rotate(${angle} ${x + 150} ${y + 201.5625})">${art}</g>`;
    }).join("");
    return group3("file-stack", g, `<g data-fit="contain" transform="translate(${dx} ${dy}) scale(${scale})">${layers}</g>`);
  }
  var titleLabelDefaults = { x: 330, y: 276, objectWidth: 620, objectHeight: 158, label: "\u5148\u8865\u6E05\u8981\u6C42", caption: "\u5B8C\u6210\u540E\uFF0C\u518D\u6309\u8981\u6C42\u68C0\u67E5", accent: "blue", variant: "filled" };
  function renderTitleLabelAtom(props, helpers2) {
    const p = { ...titleLabelDefaults, ...props }, h = scope2(helpers2, "title-part"), g = geom2(p, 180, 68), accent = tone(p.accent), hasCaption = Boolean(String(p.caption ?? ""));
    if (!["filled", "outline"].includes(p.variant)) throw Error("variant \u4F7F\u7528 filled/outline\u3002");
    if (hasCaption && g.h < 120) throw Error("\u5E26\u8BF4\u660E\u7684\u6807\u9898\u724C\u9AD8\u5EA6\u81F3\u5C11\u4E3A 120\u3002");
    const w = g.w - 10, height = g.h - (hasCaption ? 49 : 10), size = fit3(p.label, w - 48, 40, 24, "\u6807\u9898\u724C\u6587\u5B57"), captionSize = fit3(p.caption, g.w - 24, 22, 18, "\u6807\u9898\u724C\u8BF4\u660E"), id = h.uid("fill"), fill = p.variant === "outline" ? "#fcfeff" : `url(#${id})`, fg = p.variant === "outline" || p.accent === "orange" ? tokens.ink : "white";
    let content2 = `<defs><linearGradient id="${h.esc(id)}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${accent}"/><stop offset="1" stop-color="${accent}" stop-opacity=".92"/></linearGradient></defs><rect x="7" y="8" width="${w}" height="${height}" rx="18" fill="${tokens.shadow}"/><rect x="2" y="2" width="${w}" height="${height}" rx="18" fill="${fill}" stroke="${tokens.ink}" stroke-width="3"/><rect x="7" y="7" width="${w - 10}" height="${height - 10}" rx="14" fill="none" stroke="${p.variant === "outline" ? accent : "#a4ddff"}" stroke-width="2"/><path d="M19 12H89M12 23Q12 12 24 12" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>${text3(h, 2 + w / 2, 2 + height / 2 + size * 0.35, p.label, size, `text-anchor="middle" style="fill:${fg}" font-weight="900"`)}`;
    if (hasCaption) content2 += text3(h, g.w / 2, g.h - 10, p.caption, captionSize, 'text-anchor="middle"');
    return group3("title-label", g, content2);
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
    const mediaMarkup = html.replace(/(<(?:img|video|audio|source)\b[^>]*\bsrc=")([^"]*)(")/gi, (_, a, src, b) => {
      if (!src || /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(src)) return a + src + b;
      const url = /^[a-z][a-z0-9+.-]*:/i.test(mediaBase) ? new URL(src, mediaBase).href : mediaBase + src;
      return a + url.replaceAll("&", "&amp;").replaceAll('"', "&quot;") + b;
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
  var units7 = (v) => Array.from(String(v ?? "")).reduce((n3, c) => n3 + (/[\u0000-\u00ff]/.test(c) ? 0.55 : 1), 0);
  var number2 = (v, name, min, max) => {
    const n3 = Number(v);
    if (!Number.isFinite(n3) || n3 < min || n3 > max) throw new Error(`${name} must be ${min}\u2013${max}`);
    return n3;
  };
  var copy3 = (v, name, max = 80) => {
    const s = String(v ?? "");
    if (units7(s) > max) throw new Error(`${name} is too long for this object`);
    return s;
  };
  var scope3 = (h, prefix) => {
    let n3 = 0;
    return { ...h, uid: (s) => h.uid(`${prefix}-${++n3}-${s}`) };
  };
  var txt2 = (x, y, label2, size, h, extra2 = "") => `<text x="${x}" y="${y}" ${extra2.includes('fill="') ? "" : `fill="${tokens.ink}"`} font-size="${size}" ${extra2}>${h.esc(label2)}</text>`;
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
  function preview3(group4, label2, h) {
    return `<section class="ani-atom-scene"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${h.esc(label2)}" style="${font4};fill:${tokens.ink};background:transparent">${group4}</svg></section>`;
  }
  var tableDefaults = {
    x: 140,
    y: 152,
    objectWidth: 990,
    objectHeight: 416,
    columns: [{ key: "id", label: "\u8BA2\u5355\u53F7", weight: 1 }, { key: "date", label: "\u5B8C\u6210\u65E5\u671F", weight: 1.3 }, { key: "status", label: "\u72B6\u6001", weight: 1.3 }, { key: "included", label: "\u662F\u5426\u8BA1\u5165", weight: 1.1 }],
    rows: [
      { id: "A01", date: "09-03", status: { label: "\u5DF2\u5B8C\u6210", tone: "green" }, included: "\u8BA1\u5165" },
      { id: "A02", date: "09-05", status: { label: "\u5DF2\u5B8C\u6210", tone: "green" }, included: "\u8BA1\u5165" },
      { id: "A03", date: "09-08", status: { label: "\u5DF2\u5B8C\u6210", tone: "green" }, included: "\u8BA1\u5165" },
      { id: "A04", date: "\u2014", status: { label: "\u5DF2\u53D6\u6D88", tone: "gray" }, included: "\u4E0D\u8BA1\u5165" },
      { id: "A05", date: "\u2014", status: { label: "\u5F85\u4ED8\u6B3E", tone: "orange" }, included: "\u4E0D\u8BA1\u5165" }
    ],
    headerFill: "#dceeff",
    striped: true
  };
  function renderTableAtom(props, helpers2) {
    const p = { ...tableDefaults, ...props }, h = scope3(helpers2, "atom-table"), { x, y, w, height } = geometry2(p, 400, 210);
    if (!Array.isArray(p.columns) || p.columns.length < 2 || p.columns.length > 6) throw new Error("table columns require 2\u20136 entries");
    if (!Array.isArray(p.rows) || p.rows.length < 1 || p.rows.length > 8) throw new Error("table rows require 1\u20138 entries");
    if (new Set(p.columns.map((c) => c.key)).size !== p.columns.length) throw new Error("table column keys must be unique");
    const weights = p.columns.map((c, i) => number2(c.weight ?? 1, `column ${i} weight`, 0.5, 6)), sum = weights.reduce((a, b) => a + b, 0), colW = weights.map((v) => (w - 24) * v / sum), start = [12];
    colW.forEach((v, i) => start.push(start[i] + v));
    const header = 58, rowH = (height - 26 - header) / p.rows.length;
    if (rowH < 38) throw new Error("table height is too short for these rows");
    const headerFill = /^#[0-9a-f]{6}$/i.test(String(p.headerFill)) ? p.headerFill : "#dceeff";
    const heads = p.columns.map((c, i) => {
      const label2 = copy3(c.label, "column label", 10), size = Math.min(27, (colW[i] - 20) / Math.max(1, units7(label2)));
      if (size < 18) throw new Error("Column heading is too narrow");
      return txt2(start[i] + colW[i] / 2, 12 + header * 0.65, label2, size, h, 'text-anchor="middle"');
    }).join("");
    const rows2 = p.rows.map((row, ri) => {
      const yy = 12 + header + ri * rowH;
      const cells = p.columns.map((column, ci) => {
        const cell = row[column.key] ?? "", obj = typeof cell === "object" && cell !== null, label2 = copy3(obj ? cell.label : cell, "cell", 50), cx = start[ci] + colW[ci] / 2;
        if (obj) {
          if (!Object.hasOwn(tones3, cell.tone)) throw new Error("status tone must be blue, green, orange, gray or ink");
          const size2 = Math.min(25, rowH * 0.46, (colW[ci] - 42) / Math.max(1, units7(label2)));
          if (size2 < 18) throw new Error("Status label is too long");
          const bh = Math.min(38, rowH - 13), bw = Math.min(colW[ci] - 30, Math.max(100, units7(label2) * size2 + 27)), color2 = tones3[cell.tone], fg = ["orange", "gray"].includes(cell.tone) ? tokens.ink : "white";
          return `<g data-atom-status="${h.esc(cell.tone)}"><rect x="${cx - bw / 2 + 2}" y="${yy + (rowH - bh) / 2 + 3}" width="${bw}" height="${bh}" rx="11" fill="${tokens.shadow}"/><rect x="${cx - bw / 2}" y="${yy + (rowH - bh) / 2}" width="${bw}" height="${bh}" rx="11" fill="${color2}" stroke="${tokens.ink}" stroke-width="1.5"/>${txt2(cx, yy + rowH / 2 + size2 * 0.35, label2, size2, h, `text-anchor="middle" style="fill:${fg}"`)}</g>`;
        }
        const size = Math.min(27, rowH * 0.43), lines4 = wrap2(label2, colW[ci] - 26, size, 2), lineH = size * 1.18, total = lines4.length * lineH;
        return lines4.map((line3, li) => txt2(cx, yy + (rowH - total) / 2 + size + li * lineH, line3, size, h, 'text-anchor="middle"')).join("");
      }).join("");
      return `<g data-atom-row="${ri}"><rect x="12" y="${yy}" width="${w - 24}" height="${rowH}" fill="${p.striped && ri % 2 ? "#f2f8ff" : "#fff"}"/>${cells}</g>`;
    }).join("");
    const lines3 = start.slice(1, -1).map((xx) => `M${xx} 12V${height - 14}`).join(" ") + Array.from({ length: p.rows.length }, (_, i) => ` M12 ${12 + header + i * rowH}H${w - 12}`).join("");
    return `<g data-atom="table" transform="translate(${x} ${y})" style="${font4}" fill="${tokens.ink}">${frame(w, height)}<rect x="12" y="12" width="${w - 24}" height="${header}" rx="8" fill="${headerFill}"/>${rows2}${heads}<path d="${lines3}" fill="none" stroke="#8ba7ce" stroke-width="1.2"/><rect x="12" y="12" width="${w - 24}" height="${height - 26}" rx="8" fill="none" stroke="${tokens.ink}" stroke-width="2"/></g>`;
  }
  var browserDefaults = {
    x: 140,
    y: 96,
    objectWidth: 990,
    objectHeight: 518,
    tabs: ["\u9879\u76EE\u8D44\u6599", "\u5DE5\u4F5C\u8BB0\u5F55"],
    activeTab: 0,
    address: "workspace.example / project",
    heading: "\u9879\u76EE\u8D44\u6599",
    body: ["\u9700\u6C42\u8BF4\u660E\u4E0E\u53C2\u8003\u6750\u6599\u653E\u5728\u540C\u4E00\u4E2A\u5DE5\u4F5C\u533A\u3002", "\u5148\u786E\u8BA4\u76EE\u6807\uFF0C\u518D\u9010\u9879\u67E5\u770B\u5DF2\u6709\u7684\u4FE1\u606F\u3002"],
    items: ["\u9700\u6C42\u8BF4\u660E", "\u53C2\u8003\u6750\u6599", "\u9A8C\u6536\u6807\u51C6"],
    imageSrc: "",
    imageAlt: "\u53EF\u66FF\u6362\u7684\u9875\u9762\u56FE\u7247",
    imageFit: "contain"
  };
  function mediaPath(v) {
    return normalizeMediaProps({ imageSrc: String(v || "") }).imageSrc;
  }
  function renderBrowserAtom(props, helpers2) {
    const p = { ...browserDefaults, ...props }, h = scope3(helpers2, "atom-browser"), { x, y, w, height } = geometry2(p, 620, 350);
    if (!Array.isArray(p.tabs) || p.tabs.length < 1 || p.tabs.length > 3) throw new Error("browser tabs require 1\u20133 labels");
    const active = number2(p.activeTab, "activeTab", 0, p.tabs.length - 1);
    if (!Number.isInteger(active)) throw new Error("activeTab must be an integer");
    const title = copy3(p.heading, "heading", 24), address = copy3(p.address, "address", 74), imageSrc = mediaPath(p.imageSrc), clip2 = h.uid("content-clip");
    const tabWidth = Math.min(218, (w - 166) / p.tabs.length), tabs2 = p.tabs.map((v, i) => {
      const label2 = copy3(v, "tab", 15), xx = 124 + i * tabWidth, fill = i === active ? "#fff" : "#d8ecff", size = Math.min(21, (tabWidth - 43) / Math.max(1, units7(label2)));
      return `<path d="M${xx} 50V22Q${xx} 10 ${xx + 12} 10H${xx + tabWidth - 22}Q${xx + tabWidth - 10} 10 ${xx + tabWidth - 10} 22V50Z" fill="${fill}" stroke="${tokens.ink}" stroke-width="1.7"/>${txt2(xx + 15, 36, label2, size, h)}<path d="M${xx + tabWidth - 32} 23l8 8m-8 0 8-8" stroke="#53759b" stroke-width="1.7"/>`;
    }).join("");
    const chrome = `<path d="M18 0H${w - 18}Q${w} 0 ${w} 18V50H0V18Q0 0 18 0Z" fill="#cae5ff"/><circle cx="27" cy="25" r="7" fill="#ff9565" stroke="${tokens.ink}" stroke-width="1.5"/><circle cx="51" cy="25" r="7" fill="${tokens.orange}" stroke="${tokens.ink}" stroke-width="1.5"/><circle cx="75" cy="25" r="7" fill="#39c09a" stroke="${tokens.ink}" stroke-width="1.5"/>${tabs2}<path d="M0 50H${w}" stroke="${tokens.ink}" stroke-width="2"/><path d="M31 75l-8 8 8 8m29-16 8 8-8 8M89 82a10 10 0 1 1 2 8m-1-8v-7h-7" fill="none" stroke="${tokens.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><rect x="119" y="65" width="${w - 142}" height="36" rx="13" fill="#eef7ff" stroke="#a4bedb" stroke-width="1.5"/><rect x="132" y="78" width="10" height="11" rx="2" fill="none" stroke="#527094" stroke-width="1.8"/><path d="M134 78v-3a3 3 0 0 1 6 0v3" fill="none" stroke="#527094" stroke-width="1.8"/>${txt2(157, 90, address, Math.min(20, (w - 203) / Math.max(1, units7(address))), h, 'fill="#527094"')}<path d="M12 116H${w - 12}" stroke="#bdd6ee" stroke-width="1.5"/>`;
    let body = "";
    if (imageSrc) {
      if (!["contain", "cover"].includes(p.imageFit)) throw new Error("imageFit must be contain or cover");
      body = `<defs><clipPath id="${h.esc(clip2)}"><rect x="14" y="119" width="${w - 28}" height="${height - 134}" rx="9"/></clipPath></defs><image href="${h.esc(imageSrc)}" x="14" y="119" width="${w - 28}" height="${height - 134}" preserveAspectRatio="xMidYMid ${p.imageFit === "cover" ? "slice" : "meet"}" clip-path="url(#${h.esc(clip2)})"><title>${h.esc(p.imageAlt)}</title></image>`;
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
        const label2 = copy3(item, "item", 60);
        if (units7(label2) * fs > w - 101) throw new Error("Browser list item is too long");
        body += `<circle cx="45" cy="${cursor - 8}" r="5" fill="${tokens.blue}"/>${txt2(62, cursor, label2, fs, h)}`;
        cursor += fs * 1.62;
      }
      if (cursor > height - 9) throw new Error("Browser content does not fit; enlarge objectHeight or shorten the copy");
    }
    return `<g data-atom="browser" transform="translate(${x} ${y})" style="${font4}" fill="${tokens.ink}">${frame(w, height)}${chrome}${body}<rect width="${w}" height="${height}" rx="18" fill="none" stroke="${tokens.ink}" stroke-width="3.5"/></g>`;
  }
  var connectorDefaults = { kind: "curve", start: { x: 270, y: 448 }, end: { x: 1e3, y: 278 }, controlPoints: [{ x: 500, y: 448 }, { x: 770, y: 278 }], waypoints: [], arrowStart: false, arrowEnd: true, tone: "blue", lineWidth: 8, cornerRadius: 28, dashed: false, label: "\u8D44\u6599\u4F20\u9012", labelX: 635, labelY: 307 };
  var point = (p, name) => ({ x: number2(p?.x, name + ".x", 16, 1264), y: number2(p?.y, name + ".y", 16, 704) });
  var direction = (a, b) => {
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (d < 0.1) throw new Error("Connector segments must have distinct points");
    return { x: (b.x - a.x) / d, y: (b.y - a.y) / d, length: d };
  };
  var shifted = (p, v, length) => ({ x: p.x + v.x * length, y: p.y + v.y * length });
  function elbowPath(points, radius) {
    let d = `M${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1], curr = points[i], next = points[i + 1], vin = direction(curr, prev), vout = direction(curr, next), r = Math.min(radius, vin.length / 2, vout.length / 2), a = shifted(curr, vin, r), b = shifted(curr, vout, r);
      d += `L${a.x} ${a.y}Q${curr.x} ${curr.y} ${b.x} ${b.y}`;
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
    const a = p.arrowStart ? shifted(start, first, headLength - 1) : start, b = p.arrowEnd ? shifted(end, last, -headLength + 1) : end;
    let d;
    if (p.kind === "curve") {
      if (p.arrowStart) c1 = shifted(c1, first, headLength - 1);
      if (p.arrowEnd) c2 = shifted(c2, last, -headLength + 1);
      d = `M${a.x} ${a.y}C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`;
    } else if (p.kind === "elbow") {
      points[0] = a;
      points[points.length - 1] = b;
      d = elbowPath(points, radius);
    } else d = `M${a.x} ${a.y}L${b.x} ${b.y}`;
    const color2 = tones3[p.tone], dash = p.dashed ? 'stroke-dasharray="14 11"' : "";
    const arrow3 = (tip, dir, back) => {
      const base2 = shifted(tip, dir, back * headLength), nx = -dir.y * half, ny = dir.x * half;
      return `<path data-atom-arrow d="M${tip.x} ${tip.y}L${base2.x + nx} ${base2.y + ny}L${base2.x - nx} ${base2.y - ny}Z" fill="${color2}" stroke="${tokens.ink}" stroke-width="2.2" stroke-linejoin="round"/>`;
    };
    let label2 = "";
    const labelText = copy3(p.label, "connector label", 22);
    if (labelText) {
      const lx = number2(p.labelX, "labelX", 30, 1250), ly = number2(p.labelY, "labelY", 30, 690), lw = units7(labelText) * 25 + 34;
      if (lx - lw / 2 < 4 || lx + lw / 2 > 1276) throw new Error("Connector label leaves preview canvas");
      label2 = `<g data-atom-label><rect x="${lx - lw / 2 + 3}" y="${ly - 28 + 4}" width="${lw}" height="43" rx="14" fill="${tokens.shadow}"/><rect x="${lx - lw / 2}" y="${ly - 28}" width="${lw}" height="43" rx="14" fill="#f3faff" stroke="${tokens.ink}" stroke-width="2"/>${txt2(lx, ly + 2, labelText, 25, h, 'text-anchor="middle"')}</g>`;
    }
    return `<g data-atom="connector" style="${font4}" fill="${tokens.ink}"><path d="${d}" fill="none" stroke="${tokens.ink}" stroke-width="${stroke + 3}" stroke-linecap="round" stroke-linejoin="round" ${dash}/><path data-motion="line" data-atom-line d="${d}" fill="none" stroke="${color2}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" ${dash}/>${p.arrowStart ? arrow3(start, first, 1) : ""}${p.arrowEnd ? arrow3(end, last, -1) : ""}${label2}</g>`;
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

  // families/animation-style-learning.mjs
  var scope4 = (h, key) => ({ ...h, uid: (s) => h.uid(key + "-" + s) });
  var units8 = (s) => Array.from(String(s ?? "")).reduce((n3, c) => n3 + (/[\u0000-\u00ff]/.test(c) ? 0.55 : 1), 0);
  function text4(x, y, value, size, width, h, extra2 = "") {
    const u = units8(value), font5 = Math.min(size, width / Math.max(1, u));
    if (font5 < Math.min(17, size * 0.7)) throw new Error("\u52A8\u753B\u98CE\uFF1A\u6587\u5B57\u8D85\u51FA\u53EF\u8BFB\u8303\u56F4\uFF0C\u8BF7\u7F29\u77ED\uFF1A" + String(value).slice(0, 22));
    return `<text x="${x}" y="${y}" font-size="${font5}" ${/\bfill=/.test(extra2) ? "" : `fill="${tokens.ink}"`} ${extra2}>${h.esc(value)}</text>`;
  }
  var line = (d, color2 = tokens.green, width = 4) => `<path data-ani-link d="${d}" fill="none" stroke="${color2}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  var node = (x, y, color2 = tokens.green) => `<circle cx="${x}" cy="${y}" r="8" fill="white" stroke="${color2}" stroke-width="4"/>`;
  var enter = (html) => `<g data-ani-enter>${html}</g>`;
  var pop = (html) => `<g data-ani-pop>${html}</g>`;
  function heading(p, h) {
    return `${text4(62, 77, p.title, 47, 1138, h)}<path d="M65 97H176" stroke="#6bbfc9" stroke-width="7" stroke-linecap="round"/>${p.subtitle ? text4(64, 125, p.subtitle, 19, 1120, h, 'fill="#547699"') : ""}`;
  }
  function footer(p, h) {
    return p.footer ? text4(640, 694, p.footer, 20, 1120, h, 'text-anchor="middle" fill="#4b7498"') : "";
  }
  function shell(x, y, w, ht, label2, h) {
    const titleH = 42;
    return `<g transform="translate(${x} ${y})"><rect x="11" y="13" width="${w}" height="${ht}" rx="16" fill="${tokens.shadow}"/><rect width="${w}" height="${ht}" rx="16" fill="#fcfeff" stroke="${tokens.ink}" stroke-width="3"/><path d="M16 0H${w - 16}Q${w} 0 ${w} 16V${titleH}H0V16Q0 0 16 0Z" fill="#57a4f5" stroke="${tokens.ink}" stroke-width="3"/>${[23, 47, 71].map((cx) => `<circle cx="${cx}" cy="21" r="6" fill="white" stroke="${tokens.ink}" stroke-width="1.8"/>`).join("")}<g data-text-panel="window-title" data-panel-bounds="0 0 ${w} ${titleH}">${text4(w - 22, 29, label2, 21, w - 126, h, 'text-anchor="end"')}</g><path d="M6 ${ht - 23}V${ht - 15}Q6 ${ht - 6} 16 ${ht - 6}H${w - 18}" stroke="#e1f1ff" stroke-width="5" fill="none"/></g>`;
  }
  function miniWindow(x, y, w, ht, p, h) {
    const left = w * 0.43, pad2 = 16, bodyY = y + 56, bodyH = ht - 75;
    const imgW = w - left - 32;
    return `${shell(x, y, w, ht, p.windowLabel || p.toolLabel || "\u5DE5\u5177\u793A\u610F", h)}<rect x="${x + pad2}" y="${bodyY}" width="${left - 25}" height="${bodyH - 49}" rx="10" fill="#f9fcff" stroke="#bdd4ed" stroke-width="1.6"/>${[0, 1, 2].map((i) => `<path d="M${x + pad2 + 14} ${bodyY + 27 + i * 20}H${x + pad2 + left - 55 - i % 2 * 35}" stroke="#b8cbdf" stroke-width="7" stroke-linecap="round"/>`).join("")}<rect x="${x + left - 88}" y="${y + ht - 48}" width="69" height="27" rx="6" fill="${tokens.blue}"/>${mountains(x + left, y + 57, imgW, bodyH - 4, scope4(h, "landscape"))}${text4(x + left + 12, bodyY + 27, p.previewLabel || "AI \u5B66\u4E60", 22, imgW - 24, h)}`;
  }
  function symbol2(kind, x, y, size, h) {
    if (kind === "check") return magnifier(x, y, size, h);
    if (kind === "document") return icon("document", x, y, size, h);
    const s = size / 100;
    let art;
    if (kind === "pencil") art = `<path d="M15 81L27 55L73 9Q78 4 84 10L91 17Q96 22 91 28L45 75Z" fill="#4499f5" stroke="${tokens.ink}" stroke-width="3"/><path d="M73 9L91 28L82 37L64 18Z" fill="${tokens.orange}" stroke="${tokens.ink}" stroke-width="2.5"/><path d="M15 81L27 55L45 75Z" fill="#fff0ce" stroke="${tokens.ink}" stroke-width="3"/><path d="M15 81L21 66L31 77Z" fill="${tokens.ink}"/><path d="M35 54L67 22" stroke="#a8dfff" stroke-width="5"/>`;
    else if (kind === "palette") art = `<path d="M49 13C22 11 3 28 6 49C8 70 33 82 49 76C69 69 61 59 72 57C104 53 100 22 75 15C65 11 55 12 49 13Z" fill="white" stroke="${tokens.ink}" stroke-width="3"/><circle cx="30" cy="34" r="9" fill="${tokens.blue}"/><circle cx="55" cy="28" r="9" fill="${tokens.orange}"/><circle cx="23" cy="54" r="9" fill="#239aac"/><circle cx="51" cy="61" r="6" fill="#d6effb" stroke="${tokens.ink}" stroke-width="2"/>`;
    else if (kind === "ruler") art = `<g transform="rotate(-43 50 50)"><rect x="6" y="30" width="88" height="39" rx="6" fill="#bfe5ff" stroke="${tokens.ink}" stroke-width="3"/><path d="M23 31V47M38 31V41M53 31V47M68 31V41M83 31V47" stroke="${tokens.ink}" stroke-width="3"/><circle cx="20" cy="58" r="3" fill="${tokens.ink}"/></g>`;
    else if (kind === "layout") art = `<rect x="5" y="14" width="89" height="69" rx="5" fill="white" stroke="${tokens.ink}" stroke-width="3"/><rect x="14" y="24" width="37" height="25" rx="2" fill="${tokens.blue}"/><path d="M59 28H84M59 39H80M15 59H49M15 69H44" stroke="#adc6e2" stroke-width="5" stroke-linecap="round"/><rect x="58" y="54" width="26" height="20" rx="2" fill="#a4dfff"/>`;
    else art = `<rect x="7" y="9" width="85" height="81" rx="12" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="3"/><circle cx="30" cy="31" r="9" fill="white"/><path d="M15 77L43 45L59 63L72 49L87 77Z" fill="white"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">${art}</g>`;
  }
  function document2(x, y, w, ht, label2, kind, h) {
    return paper(x, y, w, ht, { fold: 28, depth: 8, content: `${symbol2(kind, w / 2 - 29, 18, 58, h)}${text4(w / 2, ht - 19, label2, 23, w - 16, h, 'text-anchor="middle"')}` }, h);
  }
  var create = (id, name, description, defaults3, ref3, render) => ({ id, name: "\u52A8\u753B\u98CE \xB7 " + name, category: "\u52A8\u753B\u98CE", description, width: 1280, height: 720, defaultEffect: "ani-diagram-build", defaults: defaults3, reference: { basis: "\u7528\u6237\u63D0\u4F9B\u7684\u9759\u5E27\u53C2\u8003 " + ref3 + "\uFF1B\u539F\u751F SVG \u51E0\u4F55\u91CD\u5EFA\uFF0C\u8FD0\u52A8\u4E3A\u65B0\u7F16\u6392\uFF0C\u4E0D\u79F0 1:1 \u6216\u9010\u5E27\u590D\u523B\u3002", source: "reports/animation-style/reference-review-wechat/" + ref3, level: "designed" }, render(props, h) {
    return render({ ...defaults3, ...props }, h);
  } });
  var components8 = [
    create("ani-tool-workbench", "\u8F93\u5165\u3001\u68C0\u67E5\u4E0E\u4FEE\u6539", "\u5B8C\u6574\u5DE5\u5177\u7A97\u53E3\u642D\u914D\u8981\u6C42\u7EB8\u3001\u96EA\u5C71\u9884\u89C8\u4E0E\u68C0\u67E5\u653E\u5927\u955C\uFF0C\u8868\u8FBE\u5148\u8F93\u5165\u3001\u518D\u68C0\u67E5\u3001\u518D\u4FEE\u6539\u7684\u5DE5\u4F5C\u8FC7\u7A0B\u3002", {
      title: "\u8F93\u5165\u3001\u68C0\u67E5\uFF0C\u518D\u4FEE\u6539",
      subtitle: "\u628A\u8981\u6C42\u5199\u8FDB\u53BB\uFF0C\u628A\u7ED3\u679C\u62FF\u51FA\u6765\u770B\u3002",
      toolLabel: "\u5DE5\u5177 A",
      requestLabel: "\u8981\u6C42",
      request: "AI \u5B66\u4E60\u6D77\u62A5",
      tags: ["\u4E3B\u9898", "\u5C3A\u5BF8"],
      revisionLabel: "\u4FEE\u6539",
      revision: "\u6807\u9898\u7F29\u5C0F",
      action: "\u751F\u6210",
      previewLabel: "AI \u5B66\u4E60",
      footer: "\u68C0\u67E5\u7ED3\u679C\uFF0C\u624D\u80FD\u77E5\u9053\u4E0B\u4E00\u6B65\u8BE5\u6539\u54EA\u91CC\u3002"
    }, "07_\u8F93\u5165\u68C0\u67E5\u518D\u4FEE\u6539.png", (p, h) => {
      if (!Array.isArray(p.tags) || p.tags.length !== 2) throw new Error("\u5DE5\u4F5C\u53F0 tags \u9700\u8981\u4E24\u4E2A\u6807\u7B7E");
      const win = `${shell(222, 156, 866, 468, p.toolLabel, scope4(h, "window"))}<rect x="240" y="213" width="269" height="388" rx="13" fill="white" stroke="#c1d9f2" stroke-width="2"/><rect x="528" y="213" width="541" height="388" rx="13" fill="white" stroke="#c1d9f2" stroke-width="2"/>${text4(260, 253, p.requestLabel, 25, 220, h)}<rect x="259" y="269" width="230" height="57" rx="11" fill="#fff" stroke="${tokens.ink}" stroke-width="2"/>${text4(275, 306, p.request, 25, 200, h)}${p.tags.map((v, i) => `<rect x="${258 + i * 121}" y="346" width="110" height="49" rx="22" fill="#e7f5ff" stroke="#9bc9ee" stroke-width="1.6"/>${text4(313 + i * 121, 377, v, 21, 94, h, 'text-anchor="middle"')}`).join("")}${text4(261, 441, p.revisionLabel, 25, 220, h)}<rect x="259" y="456" width="230" height="56" rx="11" fill="white" stroke="${tokens.ink}" stroke-width="2"/>${text4(275, 491, p.revision, 25, 200, h)}<rect x="259" y="533" width="230" height="51" rx="11" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="2.5"/>${text4(374, 568, p.action, 29, 198, h, 'text-anchor="middle" fill="white"')}${mountains(545, 232, 507, 350, scope4(h, "hero"))}`;
      const paperArt = paper(48, 266, 156, 243, { fold: 31, content: `${symbol2("image", 39, 31, 79, h)}<path d="M24 145H126M24 165H119M24 185H105" stroke="#bbcee1" stroke-width="9" stroke-linecap="round"/>` }, scope4(h, "request-paper"));
      return svgScene(`${heading(p, h)}${line("M116 546V587Q116 606 136 606H220")}${line("M1088 493H1168Q1195 493 1195 518V558", tokens.green, 3.5)}${enter(`<g transform="rotate(-8 128 387)">${paperArt}</g>`)}${enter(gear(1096, 206, 128, h))}${enter(win)}${enter(`<rect x="569" y="263" width="169" height="49" rx="7" fill="white" stroke="${tokens.orange}" stroke-width="3"/>${text4(653, 296, p.previewLabel, 26, 147, h, 'text-anchor="middle"')}`)}${pop(`${magnifier(729, 256, 137, h)}<path d="M731 255l-6-17M745 256l12-12M754 271l18-1" stroke="${tokens.orange}" stroke-width="5" stroke-linecap="round"/>`)}${node(116, 546)}${node(1195, 558)}${footer(p, h)}`, h);
    }),
    create("ani-file-collection", "\u6536\u85CF\u4E0D\u7B49\u4E8E\u4F1A", "\u6298\u89D2\u6559\u7A0B\u7EB8\u6536\u8FDB\u6587\u4EF6\u5939\uFF0C\u4E0E\u53F3\u4FA7\u5B9E\u9645\u64CD\u4F5C\u7A97\u53E3\u5F62\u6210\u5BF9\u7167\uFF1B\u6536\u85CF\u5217\u8868\u548C\u7A97\u53E3\u6807\u7B7E\u53EF\u7F16\u8F91\u3002", {
      title: "\u6536\u85CF\uFF0C\u4E0D\u7B49\u4E8E\u4F1A",
      subtitle: "\u6750\u6599\u5B58\u8D77\u6765\u4E4B\u540E\uFF0C\u8FD8\u9700\u8981\u81EA\u5DF1\u505A\u4E00\u6B21\u3002",
      files: ["\u5F00\u59CB", "\u68C0\u67E5", "\u8C03\u6574"],
      folderLabel: "\u6536\u85CF\u7684\u6559\u7A0B",
      windowLabel: "\u5B9E\u9645\u64CD\u4F5C",
      previewLabel: "AI \u5B66\u4E60",
      result: "\u2260",
      footer: "\u4ECE\u201C\u6211\u770B\u8FC7\u201D\u8D70\u5230\u201C\u6211\u80FD\u505A\u201D\u3002"
    }, "02_\u6536\u85CF\u4E0D\u7B49\u4E8E\u4F1A.png", (p, h) => {
      if (!Array.isArray(p.files) || p.files.length !== 3) throw new Error("\u6536\u85CF\u7EC4\u4EF6 files \u9700\u8981\u4E09\u9879");
      const files2 = p.files.map((v, i) => enter(`<g transform="rotate(${[-9, 0, 8][i]} ${160 + i * 125} 343)">${paper(84 + i * 131, 245 - i * 7, 162, 233, { fold: 32, content: `<rect x="25" y="38" width="47" height="42" rx="7" fill="${tokens.blue}"/><path d="M43 49L58 59L43 69Z" fill="white"/>${text4(83, 68, v, 24, 66, h)}<path d="M26 112H134M26 137H132M26 162H120" stroke="#b7cee3" stroke-width="8" stroke-linecap="round"/>` }, scope4(h, "file-" + i))}</g>`)).join("");
      const folder = `<ellipse cx="323" cy="622" rx="255" ry="24" fill="#e2f1ff"/><path d="M82 423Q76 404 96 399H266L289 421H541Q563 421 556 447L519 610H119Z" fill="#8ac7f5" stroke="${tokens.ink}" stroke-width="3"/><path d="M80 456Q74 433 98 433H242L260 451H527Q547 451 542 474L518 612Q516 624 501 624H118Q101 624 98 608Z" fill="#d6edff" stroke="${tokens.ink}" stroke-width="3.3"/><path d="M114 479H499" stroke="white" stroke-width="4" opacity=".85"/><rect x="132" y="496" width="295" height="74" rx="12" fill="#f7fcff" stroke="#adceea" stroke-width="1.7"/>${text4(154, 541, p.folderLabel, 29, 256, h)}`;
      return svgScene(`${heading(p, h)}${files2}${enter(folder)}${enter(miniWindow(726, 259, 478, 350, p, scope4(h, "demo")))}${enter(gear(1123, 547, 107, h))}${pop(text4(627, 479, p.result, 112, 135, h, 'text-anchor="middle" fill="#b56a00"'))}${footer(p, h)}`, h);
    }),
    create("ani-method-transfer", "\u719F\u6089\u90E8\u5206\u53EF\u590D\u7528", "\u4ECE\u719F\u6089\u5DE5\u5177\u63D0\u53D6\u8981\u6C42\u3001\u68C0\u67E5\u3001\u4FEE\u6539\uFF0C\u9001\u8FDB\u5E26\u539A\u5EA6\u7684\u590D\u7528\u6258\u76D8\uFF0C\u7ED9\u65B0\u5DEE\u5F02\u7559\u51FA\u72EC\u7ACB\u69FD\u4F4D\u3002", {
      title: "\u719F\u6089\u90E8\u5206\u53EF\u590D\u7528",
      subtitle: "\u539F\u6765\u7684\u529E\u6CD5\uFF0C\u53EF\u4EE5\u5E26\u5230\u65B0\u95EE\u9898\u91CC\u3002",
      windowLabel: "\u719F\u6089\u7684\u5DE5\u5177",
      previewLabel: "AI \u5B66\u4E60",
      steps: ["\u8981\u6C42", "\u68C0\u67E5", "\u4FEE\u6539"],
      trayTitle: "\u56FE\u50CF\u8981\u6C42",
      newLabel: "\u65B0\u5DEE\u5F02",
      footer: "\u5148\u8BA4\u51FA\u80FD\u590D\u7528\u7684\u90E8\u5206\uFF0C\u518D\u5904\u7406\u771F\u6B63\u4E0D\u540C\u7684\u5730\u65B9\u3002"
    }, "12_\u719F\u6089\u90E8\u5206\u4E0E\u65B0\u5DEE\u5F02.png", (p, h) => {
      if (!Array.isArray(p.steps) || p.steps.length !== 3) throw new Error("\u590D\u7528\u6258\u76D8 steps \u9700\u8981\u4E09\u9879");
      const methods = p.steps.map((v, i) => enter(`<g data-method-card="${i}">${document2(64 + i * 165, 474, 126, 154, v, ["image", "check", "pencil"][i], scope4(h, "source-" + i))}</g>`)).join("");
      const lid = paper(652, 158, 539, 217, { fold: 43, depth: 11, content: `${symbol2("image", 34, 43, 91, h)}${text4(151, 95, p.trayTitle, 37, 338, h)}<path d="M153 122H461M153 145H421M153 166H365" stroke="#becfe0" stroke-width="9" stroke-linecap="round"/>` }, scope4(h, "lid"));
      const tray = `<path d="M649 401H1184L1220 611Q1227 634 1202 641H645Q620 639 618 620Z" fill="#bcd9f6" stroke="${tokens.ink}" stroke-width="3"/><path d="M654 393H1181L1210 599Q1214 617 1195 619H645Q628 618 632 600Z" fill="#f8fdff" stroke="${tokens.ink}" stroke-width="3"/><path d="M674 416H997L1020 590H652Z" fill="#e5f8f7" stroke="#149daf" stroke-width="3"/><path d="M1068 416H1156L1186 590H1043Z" fill="#fff2d7" stroke="#df8b10" stroke-width="3"/>`;
      const slots = p.steps.map((v, i) => enter(`<g transform="translate(${669 + i * 112} 437)"><rect x="4" y="5" width="98" height="140" rx="8" fill="#acdae6"/><rect width="98" height="140" rx="8" fill="white" stroke="#61b8c3" stroke-width="2"/>${symbol2(["document", "check", "pencil"][i], 22, 19, 57, h)}${text4(49, 116, v, 24, 86, h, 'text-anchor="middle"')}</g>`)).join("");
      const connection = (id, d, x, y) => `<g data-ani-link data-ani-connection="${id}"><path d="${d}" fill="none" stroke="${tokens.green}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${node(x, y)}</g>`;
      const connections = connection("requirements-check", "M190 551H229", 210, 551) + connection("check-revision", "M355 551H394", 375, 551) + connection("revision-tray", "M520 551H555Q584 551 584 519V478Q584 449 614 449H646", 615, 449);
      return svgScene(`${heading(p, h)}${connections}${enter(miniWindow(61, 163, 486, 270, p, scope4(h, "known-window")))}${methods}${enter(lid)}${enter(`<g data-method-tray>${tray}</g>`)}${slots}${pop(`<rect x="1056" y="443" width="98" height="88" rx="8" fill="#fffaf0" stroke="#f4a126" stroke-width="2.5" stroke-dasharray="7 5"/>${text4(1111, 575, p.newLabel, 27, 107, h, 'text-anchor="middle"')}`)}${footer(p, h)}`, h);
    }),
    create("ani-knowledge-network", "\u628A\u65B0\u65E7\u8FDE\u8D77\u6765", "\u5DF2\u6709\u8D44\u6599\u4E0E\u6210\u54C1\u8FDB\u5165\u8981\u6C42\u7ED3\u6784\uFF0C\u7ECF\u68C0\u67E5\u548C\u4FEE\u6539\u8FDE\u5230\u65B0\u7684\u7AD6\u7248\u4EFB\u52A1\uFF1B\u5BF9\u8C61\u3001\u5B57\u6BB5\u548C\u7ED3\u679C\u53EF\u7F16\u8F91\u3002", {
      title: "\u628A\u65B0\u65E7\u8FDE\u8D77\u6765",
      subtitle: "\u8BA9\u65B0\u95EE\u9898\u6302\u5230\u5DF2\u6709\u7ECF\u9A8C\u4E0A\u3002",
      previewLabel: "AI \u5B66\u4E60",
      requirementsTitle: "\u6D77\u62A5\u8981\u6C42",
      fields: ["\u4E3B\u9898", "\u98CE\u683C", "\u5C3A\u5BF8"],
      steps: ["\u68C0\u67E5", "\u4FEE\u6539"],
      outputTitle: "\u6539\u4E3A\u7AD6\u7248",
      resultLabel: "\u56FE\u50CF\u8981\u6C42",
      questionTitle: "\u7F3A\u5C11\u76F8\u5173\u7ECF\u9A8C\u65F6",
      question: "\u4ECE\u54EA\u91CC\u95EE\u8D77\uFF1F",
      footer: "\u8054\u7CFB\u8D8A\u5177\u4F53\uFF0C\u8D8A\u5BB9\u6613\u77E5\u9053\u4E0B\u4E00\u6B65\u600E\u4E48\u505A\u3002"
    }, "16_\u628A\u65B0\u65E7\u8FDE\u8D77\u6765.png", (p, h) => {
      if (!Array.isArray(p.fields) || p.fields.length !== 3 || !Array.isArray(p.steps) || p.steps.length !== 2) throw new Error("\u77E5\u8BC6\u7F51\u7EDC\u9700\u8981\u4E09\u4E2A fields \u548C\u4E24\u4E2A steps");
      const docs = [0, 1, 2].reverse().map((i) => enter(paper(75 + i * 63, 204 - i * 24, 115, 150, { fold: 25, depth: 7, content: `${icon(["document", "table", "document"][i], 24, 16, 54, h)}<path d="M21 95H87M21 115H73" stroke="#b3ccdf" stroke-width="6" stroke-linecap="round"/>` }, scope4(h, "knowledge-" + i)))).join("");
      const center = `<rect x="458" y="181" width="358" height="272" rx="12" fill="${tokens.shadow}"/><rect x="449" y="171" width="358" height="272" rx="12" fill="#fcfeff" stroke="${tokens.ink}" stroke-width="3"/><path d="M461 171H795Q807 171 807 183V228H449V183Q449 171 461 171Z" fill="#dfedff" stroke="${tokens.ink}" stroke-width="3"/>${text4(474, 211, p.requirementsTitle, 29, 305, h)}${p.fields.map((v, i) => `<rect x="469" y="${243 + i * 60}" width="315" height="50" rx="8" fill="${i === 2 ? "#dcf7f4" : "white"}" stroke="${i === 2 ? "#37adbc" : "#afcfea"}" stroke-width="1.7"/>${symbol2(["document", "palette", "ruler"][i], 479, 248 + i * 60, 39, h)}<path d="M530 ${245 + i * 60}V${291 + i * 60}" stroke="#a3d1e4"/>${text4(548, 278 + i * 60, v, 27, 205, h)}`).join("")}`;
      const steps = p.steps.map((v, i) => enter(`<rect x="${455 + i * 185}" y="497" width="165" height="70" rx="11" fill="${tokens.shadow}"/><rect x="${448 + i * 185}" y="490" width="165" height="70" rx="11" fill="white" stroke="${tokens.ink}" stroke-width="2.4"/>${symbol2(i ? "pencil" : "check", 462 + i * 185, 501, 43, h)}${text4(528 + i * 185, 533, v, 25, 78, h)}`)).join("");
      const result = paper(962, 156, 243, 328, { fold: 39, depth: 11, content: `${text4(25, 56, p.outputTitle, 30, 195, h)}<rect x="53" y="81" width="141" height="218" rx="4" fill="none" stroke="#7ca2c5" stroke-width="2" stroke-dasharray="6 5"/>${mountains(64, 91, 119, 197, scope4(h, "portrait"))}` }, scope4(h, "result-paper"));
      return svgScene(`${heading(p, h)}${line("M313 277H368V365H449", "#6590b7", 2.4)}${line("M355 542H390V365H449", "#6590b7", 2.4)}${line("M628 442V469H529V490M628 469H714V490M529 560V588H630V606M714 560V588H630", "#6590b7", 2.4)}${line("M784 388H962", tokens.green, 4)}${docs}${enter(`${mountains(70, 430, 288, 207, scope4(h, "old-image"))}${text4(86, 466, p.previewLabel, 26, 245, h)}`)}${enter(center)}${steps}${enter(`<rect x="513" y="608" width="236" height="51" rx="12" fill="#edf7ff" stroke="${tokens.ink}" stroke-width="2.3"/>${symbol2("image", 527, 617, 34, h)}${text4(579, 643, p.resultLabel, 26, 155, h)}`)}${pop(result)}${pop(`<rect x="930" y="527" width="285" height="123" rx="13" fill="#fff6e7" stroke="${tokens.orange}" stroke-width="1.6"/>${text4(952, 564, p.questionTitle, 25, 244, h)}<circle cx="963" cy="605" r="20" fill="white" stroke="${tokens.orange}" stroke-width="2.5" stroke-dasharray="6 4"/>${text4(993, 615, p.question, 25, 197, h)}`)}${node(784, 388)}${node(962, 388)}${footer(p, h)}`, h);
    }),
    create("ani-capability-tiles", "\u6563\u843D\u77E5\u8BC6\u7816", "\u516D\u5757\u5177\u6709\u539A\u5EA6\u7684\u5DE5\u5177\u7816\u5206\u522B\u627F\u8F7D\u8981\u6C42\u3001\u914D\u8272\u3001\u5C3A\u5BF8\u3001\u7248\u5F0F\u3001\u68C0\u67E5\u548C\u4FEE\u6539\uFF0C\u4E0E\u5DE5\u5177\u7ED3\u679C\u7A97\u53E3\u5E76\u7F6E\u3002", {
      title: "\u5B66\u4E00\u4E2A\uFF0C\u6254\u4E00\u4E2A",
      subtitle: "\u96F6\u6563\u6280\u5DE7\uFF0C\u9700\u8981\u8FDE\u6210\u81EA\u5DF1\u7684\u65B9\u6CD5\u3002",
      tiles: ["\u8981\u6C42", "\u914D\u8272", "\u5C3A\u5BF8", "\u7248\u5F0F", "\u68C0\u67E5", "\u4FEE\u6539"],
      windowLabel: "AI \u5DE5\u5177 B",
      previewLabel: "AI \u5B66\u4E60",
      result: "\u628A\u672C\u4E8B\u8FDE\u8D77\u6765",
      footer: "\u8BA9\u4E00\u6B21\u5B66\u4F1A\u7684\u5185\u5BB9\uFF0C\u6210\u4E3A\u4E0B\u4E00\u6B21\u80FD\u7528\u7684\u7ECF\u9A8C\u3002"
    }, "10_\u6563\u843D\u7684\u77E5\u8BC6\u7816.png", (p, h) => {
      if (!Array.isArray(p.tiles) || p.tiles.length !== 6) throw new Error("\u77E5\u8BC6\u7816 tiles \u9700\u8981\u516D\u9879");
      const pos = [[81, 235, -8], [321, 251, 7], [557, 223, -9], [169, 458, 7], [445, 471, -8], [747, 456, -10]], kinds = ["document", "palette", "ruler", "layout", "check", "pencil"];
      const tiles = p.tiles.map((label2, i) => {
        const [x, y, r] = pos[i];
        return enter(`<g transform="rotate(${r} ${x + 96} ${y + 91})"><rect x="${x + 9}" y="${y + 13}" width="190" height="172" rx="15" fill="${tokens.shadow}"/><rect x="${x}" y="${y + 6}" width="190" height="172" rx="15" fill="#aed3f4" stroke="${tokens.ink}" stroke-width="2.7"/><rect x="${x}" y="${y}" width="190" height="167" rx="15" fill="#f2faff" stroke="${tokens.ink}" stroke-width="2.7"/><path d="M${x + 8} ${y + 26}V${y + 16}Q${x + 8} ${y + 8} ${x + 19} ${y + 8}H${x + 169}" fill="none" stroke="white" stroke-width="3"/>${symbol2(kinds[i], x + 53, y + 19, 86, h)}${text4(x + 95, y + 143, label2, 28, 165, h, 'text-anchor="middle"')}</g>`);
      }).join("");
      return svgScene(`${heading(p, h)}${enter(miniWindow(836, 156, 366, 282, p, scope4(h, "tiles-window")))}${tiles}${pop(`<path d="M976 508L998 490M997 524H1023M960 490L967 466" stroke="${tokens.orange}" stroke-width="5" stroke-linecap="round"/>${text4(1098, 569, p.result, 27, 214, h, 'text-anchor="middle"')}`)}${footer(p, h)}`, h);
    })
  ];

  // families/animation-style-objects.mjs
  var context = (h, id) => ({ ...h, uid: (s) => h.uid(id + "-" + s) });
  var units9 = (s) => Array.from(String(s ?? "")).reduce((n3, c) => n3 + (c.charCodeAt(0) < 256 ? 0.55 : 1), 0);
  var text5 = (h, x, y, value, size = 24, width = 600, extra2 = "") => {
    const font5 = Math.min(size, width / Math.max(1, units9(value)));
    if (font5 < 14) throw Error("\u6587\u5B57\u8FC7\u957F\uFF0C\u8BF7\u7F29\u77ED\u5F53\u524D\u6587\u6848\u540E\u518D\u5E94\u7528\u3002");
    return `<text x="${x}" y="${y}" font-size="${font5}" fill="${tokens.ink}" ${extra2}>${h.esc(value)}</text>`;
  };
  var arrow = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 13H31V0L57 24L31 48V35H0Z" fill="${tokens.green}" stroke="${tokens.ink}" stroke-width="3.5" stroke-linejoin="round"/><path d="M4 18H34V11" stroke="#70ceb3" stroke-width="3" fill="none"/></g>`;
  function processing(p, h) {
    if (p.inputs.length !== 3 || p.outputs.length !== 3) throw Error("\u5904\u7406\u88C5\u7F6E\u793A\u4F8B\u9700\u8981\u4E09\u9879\u8F93\u5165\u548C\u4E09\u9879\u7ED3\u679C\u3002");
    const colors3 = [tokens.green, tokens.purple, tokens.orange];
    const input = p.inputs.map((item, i) => `<g data-ani-enter>${paper(50 + i * 94, 268 + i % 2 * 16, 116, 158, { fold: 24, depth: 7 }, context(h, "in" + i))}${icon(item.icon || "document", 72 + i * 94, 315 + i % 2 * 16, 61, context(h, "input-icon" + i))}${text5(h, 108 + i * 94, 305 + i % 2 * 16, item.label, 21, 94, 'text-anchor="middle"')}</g>`).join("");
    const slots = colors3.map((color2, i) => `<g><path d="M${477 + i * 91} 256L${492 + i * 91} 234H${548 + i * 91}L${533 + i * 91} 256Z" fill="${color2}" stroke="${tokens.ink}" stroke-width="3"/><path d="M${491 + i * 91} 246H${531 + i * 91}" stroke="#ffffff" stroke-width="3" opacity=".5"/><rect x="${477 + i * 91}" y="288" width="81" height="217" rx="8" fill="${color2}" fill-opacity=".15"/><rect x="${492 + i * 91}" y="291" width="10" height="90" rx="5" fill="#c8dcf0" stroke="${tokens.ink}" stroke-width="2"/><rect x="${483 + i * 91}" y="360" width="29" height="18" rx="4" fill="#658ab6" stroke="${tokens.ink}" stroke-width="2"/><rect x="${473 + i * 91}" y="459" width="88" height="41" rx="8" fill="#456486" stroke="${tokens.ink}" stroke-width="3"/><rect x="${481 + i * 91}" y="465" width="71" height="22" rx="10" fill="#abc9e4" stroke="${tokens.ink}" stroke-width="2"/><circle cx="${492 + i * 91}" cy="476" r="6" fill="white" stroke="${tokens.ink}" stroke-width="2"/><circle cx="${541 + i * 91}" cy="476" r="6" fill="white" stroke="${tokens.ink}" stroke-width="2"/><g data-ani-gear>${gear(488 + i * 91, 387, 53, context(h, "gear" + i))}</g></g>`).join("");
    const outputs = p.outputs.map((item, i) => `<g data-ani-pop><g transform="translate(0 ${i * 89})"><rect x="934" y="302" width="267" height="75" rx="12" fill="white" stroke="#97b5d6" stroke-width="2"/>${icon(item.icon || "document", 947, 311, 55, context(h, "output-icon" + i))}${text5(h, 1012, 347, item.label, 22, 143)}<circle cx="1173" cy="339" r="13" fill="${tokens.green}" stroke="${tokens.ink}" stroke-width="2"/><path d="M1166 339L1171 345L1180 333" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/></g></g>`).join("");
    return svgScene(`${banner(357, 39, 566, p.title, tokens.blue, context(h, "title"))}${text5(h, 640, 143, p.subtitle, 24, 1050, 'text-anchor="middle"')}<ellipse cx="642" cy="578" rx="240" ry="22" fill="#dceffd"/>${input}${banner(78, 201, 211, p.inputTitle, tokens.green, context(h, "input-label"))}${arrow(355, 340)}<g data-ani-enter><path d="M436 259L466 217H757L799 254V533L773 562H452L425 530V280Z" fill="#dcf0ff" stroke="${tokens.ink}" stroke-width="4"/><path d="M773 262L799 254V533L773 562Z" fill="#5ca8f6" stroke="${tokens.ink}" stroke-width="3"/><path d="M437 259L466 217H757L773 262Z" fill="white" stroke="${tokens.ink}" stroke-width="3"/><rect x="448" y="275" width="307" height="239" rx="15" fill="#f5fbff" stroke="${tokens.ink}" stroke-width="3"/>${slots}<circle cx="475" cy="538" r="10" fill="${tokens.green}" stroke="${tokens.ink}" stroke-width="2"/><circle cx="503" cy="538" r="10" fill="white" stroke="${tokens.ink}" stroke-width="2"/><circle cx="531" cy="538" r="10" fill="white" stroke="${tokens.ink}" stroke-width="2"/><path d="M613 533H738M613 541H738M613 549H738" stroke="#6a93bb" stroke-width="3" stroke-linecap="round"/><path d="M447 562V571H473V562M728 562V571H754V562" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="3"/></g>${banner(521, 175, 202, p.processTitle, tokens.blue, context(h, "process-label"))}<g data-ani-travel>${icon("document", 477, 246, 53, context(h, "travel"))}</g>${arrow(824, 340)}<g><rect x="922" y="282" width="299" height="292" rx="18" fill="#c7e2fa"/><rect x="914" y="274" width="299" height="292" rx="18" fill="white" stroke="#102b62" stroke-width="4"/><path d="M1207 289V549Q1207 560 1196 560H932" fill="none" stroke="#d4ecff" stroke-width="5"/>${outputs}</g>${banner(953, 202, 217, p.outputTitle, tokens.blue, context(h, "result-label"))}<g data-ani-pop>${text5(h, 640, 651, p.footer, 26, 1060, 'text-anchor="middle"')}</g>`, h);
  }
  function question(p, h) {
    const cards = p.examples;
    if (!Array.isArray(cards) || cards.length !== 2) throw Error("\u7ED3\u5C3E\u793A\u4F8B\u9700\u8981\u4E24\u4E2A\u5BF9\u8C61\u3002");
    const examples = cards.map((c, i) => {
      const x = i ? 739 : 248, w = i ? 296 : 260;
      const lines3 = (c.lines || []).slice(0, 3);
      return `<g data-ani-enter>${paper(x, 414, w, 181, { fold: 34, depth: 8 }, context(h, "example" + i))}${banner(x + 25, 426, w - 62, c.title, i ? tokens.green : tokens.blue, context(h, "example-title" + i))}${lines3.map((s, j) => `${icon(i ? "table" : "document", x + 17, 488 + j * 30, 26, context(h, "mini" + i + j))}${text5(h, x + 54, 509 + j * 30, s, 16, w - 71)}`).join("")}</g>`;
    }).join("");
    return svgScene(`<g data-ani-enter><path d="M178 67H1065L1102 96V316L1069 350H178Q153 350 153 324V94Q153 67 178 67Z" fill="${tokens.blue}" stroke="${tokens.ink}" stroke-width="4"/><path d="M1069 82L1102 96V316L1069 350Z" fill="#0560c7" stroke="${tokens.ink}" stroke-width="3"/><rect x="169" y="81" width="895" height="248" rx="34" fill="#fbfeff" stroke="${tokens.ink}" stroke-width="4"/><path d="M185 122Q185 97 211 96H1018" fill="none" stroke="#cae6ff" stroke-width="5" stroke-linecap="round"/>${text5(h, 615, 178, p.title, 56, 775, 'text-anchor="middle" font-weight="900"')}${text5(h, 615, 255, p.subtitle, 56, 775, 'text-anchor="middle" font-weight="900"')}<path d="M123 67L111 43M146 51L142 23M107 91L82 81" stroke="${tokens.ink}" stroke-width="13" stroke-linecap="round"/><path d="M123 67L111 43M146 51L142 23M107 91L82 81" stroke="${tokens.orange}" stroke-width="7" stroke-linecap="round"/></g><g data-ani-pop><text x="1050" y="361" font-size="138" font-weight="900" fill="#b56a00" stroke="${tokens.ink}" stroke-width="3" transform="rotate(13 1050 315)">?</text></g>${examples}<path data-ani-link d="M523 497C570 497 566 464 604 464M678 464C716 464 696 497 722 497" stroke="${tokens.green}" stroke-width="4" fill="none" stroke-linecap="round"/><g data-ani-pop><path d="M620 458L637 484M637 453L621 489" stroke="${tokens.orange}" stroke-width="5" stroke-linecap="round"/>${banner(428, 620, 424, p.footer, tokens.blue, context(h, "footer"))}</g>`, h);
  }
  var common4 = { category: "\u52A8\u753B\u98CE", width: 1280, height: 720, reference: { level: "designed", basis: "\u6309\u7528\u6237\u63D0\u4F9B\u7684 V8 \u539F\u751F\u56FE\u89E3\u6BCD\u7248\u91CD\u5EFA SVG \u51E0\u4F55\u3002\u4FDD\u6301\u5BF9\u8C61\u7ED3\u6784\u4E0E\u72B6\u6001\u8BED\u4E49\uFF0C\u5177\u4F53\u8865\u95F4\u4E3A\u672C\u6B21\u8BBE\u8BA1\uFF1B\u4E0D\u662F\u5B9E\u9645\u8F6F\u4EF6\u622A\u56FE\u3002", source: "references/animation-style/sources.json" } };
  var components9 = [
    { ...common4, id: "ani-processing-machine", name: "\u52A8\u753B\u98CE \xB7 \u8F93\u5165\u5904\u7406\u88C5\u7F6E", description: "\u6587\u4EF6\u9001\u5165\u4E09\u901A\u9053\u88C5\u7F6E\uFF0C\u5185\u90E8\u5904\u7406\u540E\u751F\u6210\u5BF9\u5E94\u7ED3\u679C\uFF1B\u8F93\u5165\u3001\u5904\u7406\u6807\u7B7E\u548C\u8F93\u51FA\u5185\u5BB9\u53EF\u66FF\u6362\u3002", defaultEffect: "ani-machine-process", defaults: { title: "\u8BA9\u8FC7\u7A0B\u770B\u5F97\u89C1", subtitle: "\u8F93\u5165\u6750\u6599\uFF0C\u7ECF\u8FC7\u5904\u7406\uFF0C\u7559\u4E0B\u53EF\u6838\u5BF9\u7684\u7ED3\u679C\u3002", inputTitle: "\u8F93\u5165", processTitle: "\u5904\u7406\u8FC7\u7A0B", outputTitle: "\u7ED3\u679C", inputs: [{ label: "\u6587\u672C", icon: "document" }, { label: "\u56FE\u7247", icon: "documents" }, { label: "\u6570\u636E", icon: "table" }], outputs: [{ label: "\u5185\u5BB9\u5DF2\u6574\u7406", icon: "document" }, { label: "\u753B\u9762\u5DF2\u751F\u6210", icon: "documents" }, { label: "\u6570\u636E\u5DF2\u6C47\u603B", icon: "table" }], footer: "\u8BB2\u5230\u54EA\u4E00\u6B65\uFF0C\u753B\u9762\u5C31\u53D8\u5316\u5230\u54EA\u4E00\u6B65\u3002" }, render: processing },
    { ...common4, id: "ani-question-outro", name: "\u52A8\u753B\u98CE \xB7 \u95EE\u9898\u4E0E\u9884\u544A", description: "\u4FDD\u7559\u4E24\u4E2A\u6848\u4F8B\u5BF9\u8C61\uFF0C\u5C06\u5F53\u524D\u95EE\u9898\u5F15\u5411\u4E0B\u4E00\u671F\uFF1B\u5927\u5B57\u95EE\u9898\u724C\u3001\u6A59\u8272\u95EE\u53F7\u548C\u9884\u544A\u6807\u7B7E\u4F9D\u6B21\u51FA\u73B0\u3002", defaultEffect: "ani-diagram-build", defaults: { title: "\u660E\u660E\u5B66\u8FC7\uFF0C", subtitle: "\u4E3A\u4EC0\u4E48\u60F3\u4E0D\u8D77\u6765\u7528\uFF1F", footer: "\u4E0B\u671F\uFF1A\u8FDC\u8FC1\u79FB", examples: [{ title: "\u672C\u5468\u8FDB\u5EA6\u901A\u77E5", lines: ["\u8C01\u6765\u505A\u3001\u505A\u4EC0\u4E48", "\u4EC0\u4E48\u65F6\u5019\u5B8C\u6210", "\u5230\u54EA\u91CC\u586B\u5199"] }, { title: "\u8BA2\u5355\u660E\u7EC6", lines: ["\u6309\u54EA\u4E2A\u65E5\u671F", "\u7EDF\u8BA1\u54EA\u4E9B\u72B6\u6001", "\u5BF9\u7167\u539F\u59CB\u8BB0\u5F55"] }] }, render: question }
  ];

  // families/animation-style.mjs
  var defaults = {
    title: "\u672C\u5468\u8FDB\u5EA6\u901A\u77E5",
    subtitle: "\u4ECE\u6536\u4EF6\u4EBA\u89D2\u5EA6\u6838\u5BF9",
    rows: [
      { label: "\u5BF9\u8C61", text: "\u5404\u7EC4\u8D1F\u8D23\u4EBA", icon: "people" },
      { label: "\u5185\u5BB9", text: "\u672C\u5468\u5DF2\u5B8C\u6210\u3001\u672A\u5B8C\u6210\u4E8B\u9879", icon: "documents" },
      { label: "\u622A\u6B62", text: "\u5468\u4E94 17:00 \u524D", icon: "calendar" },
      { label: "\u586B\u5199", text: "\u5171\u4EAB\u8868\u683C", icon: "link" }
    ],
    footnote: "\u8F6E\u5230\u8C01\u505A\u3001\u8981\u505A\u4EC0\u4E48\u3001\u51E0\u70B9\u524D\u5B8C\u6210\u3001\u5728\u54EA\u513F\u586B\uFF0C\u90FD\u627E\u5F97\u5230\u3002"
  };
  var charUnits = (s) => Array.from(String(s ?? "")).reduce((sum, c) => sum + (/[\u0000-\u00ff]/.test(c) ? 0.54 : 1), 0);
  function renderNotice(p, h) {
    if (!Array.isArray(p.rows) || p.rows.length !== 4) throw new Error("ani-notice-check requires exactly four rows");
    const e = h.esc, t = tokens;
    const paperX = 205, paperY = 30, paperW = 870, paperH = 639;
    const rows2 = p.rows.map((r, i) => {
      const y = 142 + i * 112, c = i % 2 ? t.orange : t.green, fill = i % 2 ? "#fffbf2" : "#f0fbf7";
      const body = String(r.text ?? ""), label2 = String(r.label ?? ""), font5 = Math.max(22, Math.min(29, 475 / Math.max(1, charUnits(body)))), labelColor = i % 2 ? t.ink : "white";
      if (charUnits(body) > 21.5 || charUnits(label2) > 4) throw new Error("ani-notice-check: row copy exceeds readable field width");
      return `<g data-ani-row="${i}" data-text-panel="row-${i}" data-panel-bounds="232 ${y} 816 104"><rect x="232" y="${y}" width="816" height="104" rx="16" fill="${fill}" stroke="#829bc3" stroke-width="1.8"/><path d="M252 ${y}H342Q362 ${y} 362 ${y + 18}V${y + 23}Q362 ${y + 37} 343 ${y + 37}H232V${y + 20}Q232 ${y} 252 ${y}Z" fill="${c}" stroke="${t.ink}" stroke-width="2.2"/><path d="M242 ${y + 7}Q245 ${y + 5} 254 ${y + 5}H339" fill="none" stroke="white" stroke-width="2" opacity=".35"/><text x="296" y="${y + 27}" text-anchor="middle" font-size="25" font-weight="900" fill="${labelColor}">${e(label2)}</text>${icon(r.icon || "document", 264, y + 28, 76, h)}<path d="M385 ${y + 30}V${y + 84}" stroke="#aac6db" stroke-width="1.8"/><text x="415" y="${y + 65}" font-size="${font5}" fill="${t.ink}">${e(body)}</text><g transform="translate(1003 ${y + 55})"><circle r="19" fill="white" stroke="#91acc4" stroke-width="2.2"/><g data-ani-check="${i}"><circle r="19" fill="${t.green}" stroke="${t.ink}" stroke-width="2.3"/><path d="M-9 0L-2 8L10-7" fill="none" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M-11-9Q-5-14 2-14" stroke="#7bdbb5" stroke-width="2" fill="none" stroke-linecap="round"/></g></g><rect data-ani-focus="${i}" x="230" y="${y - 2}" width="820" height="108" rx="18" fill="none" stroke="${t.blue}" stroke-width="4"/></g>`;
    }).join("");
    const titleW = Math.min(650, Math.max(450, charUnits(p.title) * 48 + 40));
    const title = banner(640 - titleW / 2, 49, titleW, p.title, t.blue, h);
    const subtitle = String(p.subtitle ?? "");
    const sub = subtitle ? `<text x="${paperX + paperW - 94}" y="131" text-anchor="end" font-size="16" fill="#527094">${e(subtitle)}</text>` : "";
    const foot = String(p.footnote ?? "");
    if (charUnits(foot) > 47) throw new Error("ani-notice-check: footnote exceeds readable width");
    return svgScene(`${paper(paperX, paperY, paperW, paperH, { fold: 58, depth: 12 }, h)}${title}${sub}${rows2}<g data-ani-result data-text-panel="result" data-panel-bounds="220 612 840 44"><path d="M440 643H840" stroke="#dcf0ff" stroke-width="16" stroke-linecap="round"/><text x="640" y="647" text-anchor="middle" font-size="${Math.min(21, 790 / Math.max(1, charUnits(foot)))}" fill="#496d9e">${e(foot)}</text></g>`, h);
  }
  var components10 = [{
    id: "ani-notice-check",
    name: "\u52A8\u753B\u98CE \xB7 \u901A\u77E5\u9010\u9879\u6838\u5BF9",
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
  var array = (v, n3 = 20) => Array.isArray(v) ? v.slice(0, n3) : [];
  var extra = { airdrop: "M12 2a10 10 0 0 1 8 16M4 18A10 10 0 0 1 12 2M12 6a6 6 0 0 1 4.8 9.6M7.2 15.6A6 6 0 0 1 12 6M12 10a2 2 0 1 1 0 4m0 2-5 6h10Z", bluetooth: "M12 2v20l7-6L6 6m0 12L19 8Z", moon: "M19 16A9 9 0 0 1 8 5a9 9 0 1 0 11 11Z", sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0", airplane: "m2 12 8 2v7l3-3v-4l8 1v-3l-8-4V3l-3-2v7Z", share: "M12 16V2m-4 4 4-4 4 4M7 9H3v12h18V9h-4", columns: "M3 4h18v16H3ZM9 4v16M15 4v16", music: "M10 18V4l10-2v14M10 8l10-2M10 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0m10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0", camera: "M3 7h4l2-3h6l2 3h4v14H3ZM16 14a4 4 0 1 1-8 0 4 4 0 0 1 8 0", flash: "M9 3h6l-1 4 3 3v4H7v-4l3-3ZM9 14h6v8H9Z", rotate: "M20 7V3m0 4h-4M20 7A8 8 0 1 0 21 13M10 10h5v7h-5ZM11 10V8a1.5 1.5 0 0 1 3 0v2", sliders: "M4 7h16M4 17h16M8 4v6M16 14v6" };
  function ai(h, name, size = 18) {
    if (name === "folder") return `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M2 6q0-2 2-2h6l2 2h8q2 0 2 2v12H2Z" fill="#75c4ee" stroke="#4daae0" stroke-width=".6"/><path d="M2 8h20v12H2Z" fill="#9bd9f6"/></svg>`;
    return extra[name] ? `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="${extra[name]}"/></svg>` : h.icon(name, size);
  }
  var lights = () => '<span class="ap-lights"><i></i><i></i><i></i></span>';
  function appIcon(h, name, size = 34) {
    const color2 = { finder: "#53b9f5", safari: "#178ddd", notes: "#e9b924", calendar: "#ee594b", mail: "#2c9bf1", terminal: "#242529", settings: "#8e949c", preview: "#72a3d7", messages: "#49c863", files: "#3b9ded", photos: "#d877ac" }[name] || "#aab4c0";
    let content2;
    if (name === "finder") content2 = '<svg width="100%" height="100%" viewBox="0 0 40 40"><path fill="#aee1ff" d="M20 1h14q5 0 5 5v28q0 5-5 5H20Z"/><path d="M12 13v4m15-4v4M11 25q9 8 18-1M22 2l-3 20h5v16" fill="none" stroke="#244c7c" stroke-width="1.4"/></svg>';
    else if (name === "safari") content2 = '<svg viewBox="0 0 40 40" width="100%" height="100%"><circle cx="20" cy="20" r="16" fill="#ecf8ff"/><circle cx="20" cy="20" r="14" fill="#44acef"/><path d="m27 10-4 13-13 7 6-14Z" fill="#fff"/><path d="m27 10-11 6 7 7Z" fill="#ee6a61"/></svg>';
    else if (name === "calendar") content2 = '<span class="ap-icon-calendar"><small>\u4E5D\u6708</small><b>17</b></span>';
    else content2 = ai(h, { notes: "file", mail: "mail", terminal: "terminal", settings: "settings", preview: "image", messages: "more", files: "folder" }[name] || "grid", Math.round(size * 0.66));
    return `<span class="ap-appicon" style="width:${size}px;height:${size}px;background:${color2}">${content2}</span>`;
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
  var table = (h, headers, rows2, selected = 1) => `<div class="ap-table"><div class="ap-tr ap-th">${headers.map((x) => `<span>${h.esc(x)}</span>`).join("")}</div>${array(rows2, 14).map((r, i) => `<div class="ap-tr ${i === selected ? "is-selected" : ""}" data-motion="item">${r.map((x, j) => `<span>${j === 0 ? ai(h, String(x).includes(".") ? "file" : "folder", 16) : ""}${h.esc(x)}</span>`).join("")}</div>`).join("")}</div>`;
  function component(id, name, description, defaults3, render, mobile = false) {
    return { id, name, description, category: mobile ? "Apple \xB7 iPhone / iPad" : "Apple \xB7 macOS", width: 1280, height: 800, defaults: defaults3, reference: { level: "documented", basis: mobile ? "iOS 18 / iPadOS 18 \u5B98\u65B9\u624B\u518C\u7684\u7ED3\u6784\u53C2\u7167\uFF1BWindows \u5B57\u4F53\u56DE\u9000\uFF0C\u672A\u5BA3\u79F0\u771F\u673A\u9010\u50CF\u7D20\u4E00\u81F4\u3002" : "macOS Sequoia 15 \u5B98\u65B9\u624B\u518C\u7684\u7ED3\u6784\u53C2\u7167\uFF1BWindows \u5B57\u4F53\u56DE\u9000\uFF0C\u672A\u5BA3\u79F0\u771F\u673A\u9010\u50CF\u7D20\u4E00\u81F4\u3002", source: mobile ? "https://support.apple.com/zh-cn/guide/iphone/iph59095ec58/18.0/ios/18.0" : "https://support.apple.com/zh-cn/guide/mac-help/mchl83c9e8b8/15.0/mac/15.0" }, render };
  }
  var commonCSS = `
.ap-desktop{width:1280px;height:800px;position:relative;overflow:hidden;background:#f7f8fa;font-family:Arial,ComponentHan,sans-serif;font-size:13px;color:#26272a}.ap-wall{background:radial-gradient(ellipse at 14% 2%,#eec8ae 0,transparent 48%),radial-gradient(ellipse at 78% 65%,#88b0d6,transparent 65%),linear-gradient(140deg,#b9bdce,#bbcfdc 60%,#9cb9ba)}.ap-menubar{height:27px;background:#ffffffb8;display:flex;align-items:center;gap:22px;padding:0 18px;color:#222;font-size:12px}.ap-menubar>i{flex:1}.ap-menubar strong{font-size:13px}.ap-apple{font-size:14px;line-height:1}.ap-window{position:absolute;left:90px;top:82px;width:1100px;height:632px;background:white;border:1px solid #bfc1c6;border-radius:11px;box-shadow:0 23px 55px #1e2f4424,0 3px 10px #1c304914;overflow:hidden}.ap-toolbar{height:53px;display:flex;align-items:center;gap:19px;padding:0 19px;background:linear-gradient(#fafafa,#f2f2f2);border-bottom:1px solid #dedfe2}.ap-toolbar>b{font-size:14px}.ap-lights{display:flex;gap:8px;align-items:center;margin-right:15px;flex-shrink:0}.ap-lights i{width:12px;height:12px;border:1px solid #0000000c;border-radius:50%;background:#ff5f57}.ap-lights i:nth-child(2){background:#febc2e}.ap-lights i:nth-child(3){background:#28c840}.ap-spacer{flex:1}.ap-sidebar{width:190px;flex-shrink:0;background:#f0f0f2;min-height:100%;padding:17px 11px;border-right:1px solid #dfdfe2}.ap-sidebar label{font-size:11px;font-weight:bold;color:#7e7e86;padding:8px 8px;display:block;margin-top:7px}.ap-sidebar>div{height:31px;border-radius:6px;display:flex;align-items:center;gap:9px;padding:0 10px;font-size:13px}.ap-sidebar svg{color:#1686de}.ap-sidebar .is-selected{background:#dcdce1}.ap-tag-dot{width:9px;height:9px;border-radius:50%;margin:0 3px}.ap-split{display:flex;height:calc(100% - 53px)}.ap-main{flex:1;min-width:0;position:relative;background:#fff}.ap-table{font-size:12px}.ap-tr{display:grid;grid-template-columns:2.5fr 1.6fr 1.2fr .9fr;min-height:29px;padding:0 15px;align-items:center}.ap-tr:nth-child(2n+1){background:#f4f5f7}.ap-tr>span{display:flex;align-items:center;gap:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 8px}.ap-tr>span>svg{color:#42a5db}.ap-th{background:#fff!important;border-bottom:1px solid #dedfe2;color:#72767d;height:30px;font-size:11px}.ap-tr.is-selected{background:#176dd5!important;color:#fff}.ap-tr.is-selected svg{color:#fff}.ap-bottom{position:absolute;bottom:0;left:0;right:0;height:27px;border-top:1px solid #e0e2e6;text-align:center;color:#767b83;font-size:11px;padding-top:6px;background:#fafafa}.ap-search{display:flex;align-items:center;gap:6px;background:#e8e8ec;color:#7f8189;border-radius:6px;height:27px;padding:0 10px;font-size:12px}.ap-appicon{border-radius:8px;box-shadow:inset 0 0 0 1px #00000009,0 1px 2px #00000015;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;color:white;vertical-align:middle}.ap-icon-calendar{background:#fff;color:#222;display:flex;align-items:center;flex-direction:column;width:100%;height:100%}.ap-icon-calendar small{font-size:8px;background:#ed6556;color:#fff;width:100%;text-align:center;padding:2px}.ap-icon-calendar b{font-size:20px}.ap-button{display:inline-flex;align-items:center;justify-content:center;padding:4px 17px;border:1px solid #ceced2;border-radius:5px;background:linear-gradient(#fff,#f0f0f1);box-shadow:0 1px 2px #0000000a;font-size:12px;min-height:25px}.ap-button.primary{background:linear-gradient(#4998f7,#1671df);border-color:#367dcc;color:#fff}.ap-tiny{font-size:11px;color:#7f8490}.ap-native-row{display:flex;align-items:center;gap:11px;min-height:40px;padding:8px 12px;border-bottom:1px solid #e5e5e8}.ap-native-row>b{font-size:13px}.ap-native-row>span:last-child{margin-left:auto;color:#888}.ap-switch{display:inline-block;width:32px;height:19px;background:#34c759;border-radius:20px;padding:2px;flex-shrink:0}.ap-switch:after{content:'';display:block;width:15px;height:15px;background:#fff;border-radius:50%;margin-left:13px;box-shadow:0 1px 2px #0002}.ap-switch.off{background:#d3d3d7}.ap-switch.off:after{margin-left:0}.ap-scroll{overflow:hidden}
`;

  // families/apple-macos-extra.mjs
  var files = [["\u8BFE\u7A0B\u8BB2\u7A3F.md", "\u4ECA\u5929 09:12", "Markdown \u6587\u7A3F", "16 KB"], ["\u5206\u955C\u6E05\u5355.csv", "\u6628\u5929 18:20", "CSV \u6587\u7A3F", "8 KB"], ["\u53C2\u8003\u622A\u56FE.png", "\u6628\u5929 16:40", "PNG \u56FE\u50CF", "2.4 MB"], ["\u5236\u4F5C\u6307\u5357.pdf", "\u6628\u5929 14:08", "PDF \u6587\u7A3F", "1.2 MB"]];
  var components11 = [
    component("mac-calendar", "macOS \xB7 \u65E5\u5386", "\u6708\u89C6\u56FE\u3001\u65E5\u5386\u5206\u7EC4\u548C\u4E8B\u4EF6\u5361\u7247\uFF0C\u4E8B\u4EF6\u4F4D\u7F6E\u7531\u65E5\u671F\u914D\u7F6E\u3002", { title: "2026\u5E749\u6708", firstWeekday: 2, days: 30, today: 17, events: [{ day: 8, title: "\u5185\u5BB9\u9009\u9898", color: "#3484e8" }, { day: 17, title: "\u5236\u4F5C\u8BC4\u5BA1 10:00", color: "#ed6556" }, { day: 21, title: "\u5F55\u5C4F\u4E0E\u914D\u97F3", color: "#6caf9e" }, { day: 25, title: "\u6210\u7247\u68C0\u67E5", color: "#956dcc" }] }, (p, h) => desktop(h, window(h, "\u65E5\u5386", `<div class="ap-split"><aside class="ap-calendar-side"><div class="ap-search">${ai(h, "search", 13)} \u641C\u7D22</div><label>iCloud</label>${["\u5DE5\u4F5C", "\u4E2A\u4EBA", "\u5BB6\u5EAD", "\u751F\u65E5"].map((x, i) => `<p><i style="background:${["#3484e8", "#ed6556", "#6caf9e", "#956dcc"][i]}">\u2713</i>${x}</p>`).join("")}<label>\u5176\u4ED6</label><p><i style="background:#999">\u2713</i>\u4E2D\u56FD\u8282\u5047\u65E5</p></aside><main class="ap-calendar-main"><h1>${h.esc(p.title)}</h1><div class="ap-weeknames">${["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D"].map((x) => `<span>${x}</span>`).join("")}</div><div class="ap-month-grid">${Array.from({ length: 35 }, (_, i) => {
      const d = i - Number(p.firstWeekday) + 1;
      return `<div class="${d < 1 || d > p.days ? "empty" : ""}" data-motion="item"><b class="${d === p.today ? "today" : ""}">${d >= 1 && d <= p.days ? d : ""}</b>${array(p.events).filter((x) => Number(x.day) === d).map((x) => `<p style="--event:${/^#[0-9a-f]{6}$/i.test(x.color) ? x.color : "#3484e8"}">${h.esc(x.title)}</p>`).join("")}</div>`;
    }).join("")}</div></main></div>`, { toolbar: `${ai(h, "panel")}${ai(h, "plus")}<span class="ap-spacer"></span><div class="ap-segments">\u65E5\u3000\u3000\u5468\u3000\u3000<b>\u6708</b>\u3000\u3000\u5E74</div><span class="ap-spacer"></span>${ai(h, "chevron-left")}<span class="ap-button">\u4ECA\u5929</span>${ai(h, "chevron-right")}` }), "\u65E5\u5386")),
    component("mac-mail", "macOS \xB7 \u90AE\u4EF6", "\u90AE\u7BB1\u3001\u90AE\u4EF6\u5217\u8868\u548C\u6B63\u6587\u4E09\u680F\uFF0C\u53EF\u914D\u7F6E\u53D1\u4EF6\u4EBA\u3001\u4E3B\u9898\u4E0E\u6B63\u6587\u3002", { subject: "\u672C\u5468\u8BFE\u7A0B\u7684\u5236\u4F5C\u5B89\u6392", sender: "\u9648\u8001\u5E08", email: "chen@example.com", to: "\u6797\u540C\u5B66", date: "2026\u5E749\u670817\u65E5 09:20", messages: [["\u9648\u8001\u5E08", "\u672C\u5468\u8BFE\u7A0B\u7684\u5236\u4F5C\u5B89\u6392", "\u5148\u6574\u7406\u8BB2\u7A3F\uFF0C\u518D\u51C6\u5907\u6F14\u793A\u7D20\u6750\u3002", "09:20"], ["\u6797\u540C\u5B66", "\u53C2\u8003\u8D44\u6599\u6574\u7406\u5B8C\u6210", "\u8BF7\u67E5\u6536\u9644\u4EF6\u4E2D\u7684\u5185\u5BB9\u6E05\u5355\u3002", "\u6628\u5929"], ["\u9879\u76EE\u7EC4", "\u5468\u4E94\u7684\u8BFE\u7A0B\u8BC4\u5BA1", "\u8BC4\u5BA1\u65F6\u95F4\u4E3A\u5468\u4E94\u4E0B\u5348\u4E09\u70B9\u3002", "\u661F\u671F\u4E8C"]], paragraphs: ["\u6797\u540C\u5B66\uFF0C\u4F60\u597D\uFF1A", "\u672C\u5468\u6211\u4EEC\u5148\u5B8C\u6210\u7B2C\u4E00\u8282\u8BFE\u7A0B\u3002\u8BF7\u6309\u987A\u5E8F\u51C6\u5907\u4EE5\u4E0B\u5185\u5BB9\uFF1A", "1. \u6574\u7406\u4E3B\u9898\u548C\u9010\u5B57\u7A3F\uFF0C\u6807\u8BB0\u9700\u8981\u5C55\u793A\u7684\u6570\u636E\u3002", "2. \u5F55\u5236\u771F\u5B9E\u64CD\u4F5C\u8FC7\u7A0B\uFF0C\u4FDD\u7559\u9F20\u6807\u548C\u72B6\u6001\u53D8\u5316\u3002", "3. \u68C0\u67E5\u5B57\u5E55\u3001\u753B\u9762\u91CD\u70B9\u548C\u8BB2\u89E3\u8282\u594F\u3002", "\u6709\u9700\u8981\u8865\u5145\u7684\u5185\u5BB9\uFF0C\u6211\u4EEC\u5728\u8BC4\u5BA1\u65F6\u4E00\u8D77\u786E\u8BA4\u3002"] }, (p, h) => desktop(h, window(h, "\u90AE\u4EF6", `<div class="ap-split">${sidebar(h, "\u6536\u4EF6\u7BB1", ["\u6240\u6709\u6536\u4EF6\u7BB1", "\u6536\u4EF6\u7BB1", "\u5DF2\u53D1\u9001", "\u8349\u7A3F", "\u5F52\u6863", "\u5E9F\u7EB8\u7BD3"])}<div class="ap-mail-list">${array(p.messages, 8).map((m, i) => `<article class="${i === 0 ? "active" : ""}" data-motion="item"><small>${h.esc(m[3])}</small><b>${h.esc(m[0])}</b><strong>${h.esc(m[1])}</strong><p>${h.esc(m[2])}</p></article>`).join("")}</div><article class="ap-mail-message"><header><span class="ap-avatar">\u9648</span><div><h1>${h.esc(p.subject)}</h1><p><b>${h.esc(p.sender)}</b> &lt;${h.esc(p.email)}&gt;</p><small>\u6536\u4EF6\u4EBA\uFF1A${h.esc(p.to)}</small></div><time>${h.esc(p.date)}</time></header>${array(p.paragraphs).map((x) => `<p>${h.esc(x)}</p>`).join("")}</article></div>`, { toolbar: `${ai(h, "panel")}${ai(h, "mail")}${ai(h, "edit")}<span class="ap-spacer"></span>${ai(h, "trash")}${ai(h, "folder")}${ai(h, "undo")}${ai(h, "share")}<span class="ap-search">${ai(h, "search", 14)} \u641C\u7D22</span>` }), "\u90AE\u4EF6")),
    component("mac-preview", "macOS \xB7 \u9884\u89C8 PDF", "\u539F\u751F\u7F29\u7565\u56FE\u4FA7\u680F\u3001\u9875\u6570\u3001\u7F29\u653E\u5DE5\u5177\u4E0E\u53EF\u66FF\u6362\u6587\u6863\u9875\u3002", { filename: "\u5236\u4F5C\u6307\u5357.pdf", page: 2, pages: 6, title: "\u5982\u4F55\u7EC4\u7EC7\u4E00\u4E2A\u6E05\u695A\u7684\u8BB2\u89E3", subtitle: "\u8BFE\u7A0B\u8BBE\u8BA1 / 02", paragraphs: ["\u5148\u786E\u5B9A\u89C2\u4F17\u9700\u8981\u89E3\u51B3\u7684\u95EE\u9898\uFF0C\u518D\u9009\u62E9\u80FD\u8BC1\u660E\u89C2\u70B9\u7684\u753B\u9762\u3002", "\u8BB2\u89E3\u7ED3\u6784\u7531\u4E09\u4E2A\u90E8\u5206\u7EC4\u6210\uFF1A\u95EE\u9898\u3001\u65B9\u6CD5\u548C\u9A8C\u8BC1\u3002\u6BCF\u4E00\u90E8\u5206\u90FD\u9700\u8981\u5BF9\u5E94\u7684\u6750\u6599\u3002"], steps: ["\u63D0\u51FA\u95EE\u9898", "\u6F14\u793A\u65B9\u6CD5", "\u9A8C\u8BC1\u7ED3\u679C"] }, (p, h) => desktop(h, window(h, p.filename, `<div class="ap-split"><aside class="ap-pdf-thumbs">${Array.from({ length: Math.min(7, Number(p.pages)) }, (_, i) => `<div class="${i + 1 === p.page ? "active" : ""}" data-motion="item"><article><b>${i === 0 ? "\u5236\u4F5C\u6307\u5357" : i === 1 ? "\u8BB2\u89E3\u7ED3\u6784" : "\u8BFE\u7A0B\u7B14\u8BB0"}</b><hr><p></p><p></p><p></p><i></i></article><small>${i + 1}</small></div>`).join("")}</aside><main class="ap-pdf-canvas"><article class="ap-paper" data-motion="focus"><small>${h.esc(p.subtitle)}</small><h1>${h.esc(p.title)}</h1>${array(p.paragraphs).map((x) => `<p>${h.esc(x)}</p>`).join("")}<div class="ap-paper-steps">${array(p.steps, 4).map((x, i) => `<section data-motion="item"><b>0${i + 1}</b><h3>${h.esc(x)}</h3></section>`).join("")}</div><footer>\u5185\u5BB9\u5236\u4F5C\u5DE5\u4F5C\u5BA4<span>${h.esc(p.page)}</span></footer></article></main></div>`, { toolbar: `${ai(h, "panel")}<b>${h.esc(p.filename)}</b><span class="ap-tiny">\u7B2C ${h.esc(p.page)} \u9875\uFF0C\u5171 ${h.esc(p.pages)} \u9875</span><span class="ap-spacer"></span>${ai(h, "minus")}${ai(h, "plus")}${ai(h, "share")}${ai(h, "edit")}${ai(h, "search")}` }), "\u9884\u89C8")),
    component("mac-activity-monitor", "macOS \xB7 \u6D3B\u52A8\u76D1\u89C6\u5668", "\u8FDB\u7A0B\u5217\u8868\u548C\u5E95\u90E8 CPU \u56FE\u8868\uFF0C\u6570\u636E\u53EF\u66FF\u6362\uFF0C\u4E0D\u7ED1\u5B9A\u771F\u5B9E\u8BBE\u5907\u8BFB\u6570\u3002", { tab: "CPU", system: 5.6, user: 12.8, idle: 81.6, rows: [["HyperFrames", "8.3", "00:22.10", "16", "7", "28210"], ["WindowServer", "6.1", "02:14.82", "19", "4", "391"], ["Google Chrome", "4.8", "01:02.37", "28", "8", "12110"], ["Codex", "3.5", "00:45.12", "22", "6", "30418"], ["Finder", "0.3", "00:09.16", "5", "2", "422"], ["kernel_task", "0.2", "05:02.42", "181", "0", "0"]] }, (p, h) => desktop(h, window(h, "\u6D3B\u52A8\u76D1\u89C6\u5668", `<div class="ap-activity"><div class="ap-process-table"><div class="ap-process-row head">${["\u8FDB\u7A0B\u540D\u79F0", "% CPU", "CPU \u65F6\u95F4", "\u7EBF\u7A0B", "\u5524\u9192\u6B21\u6570", "PID"].map((x) => `<span>${x}</span>`).join("")}</div>${array(p.rows, 15).map((r, i) => `<div class="ap-process-row ${!i ? "active" : ""}" data-motion="item">${r.map((x) => `<span>${h.esc(x)}</span>`).join("")}</div>`).join("")}</div><footer><div><p><i class="red"></i>\u7CFB\u7EDF\uFF1A<b>${h.esc(p.system)}%</b></p><p><i class="blue"></i>\u7528\u6237\uFF1A<b>${h.esc(p.user)}%</b></p><p>\u95F2\u7F6E\uFF1A<b>${h.esc(p.idle)}%</b></p></div><section><small>CPU \u8D1F\u8F7D</small><svg viewBox="0 0 230 80"><path d="M0 73 12 69 24 70 36 40 48 66 60 62 72 67 84 34 96 65 108 64 120 46 132 60 144 28 156 63 168 52 180 56 192 38 204 61 216 65 230 53V80H0Z" fill="#6cafeb"/><path data-motion="line" d="M0 74 12 72 24 73 36 66 48 74 60 70 72 74 84 62 96 73 108 71 120 68 132 73 144 59 156 73 168 69 180 73 192 64 204 72 216 73 230 69" fill="none" stroke="#de6f75" stroke-width="2"/></svg></section><div><p>\u7EBF\u7A0B\uFF1A<b>1,402</b></p><p>\u8FDB\u7A0B\uFF1A<b>${array(p.rows).length}</b></p><small>\u793A\u4F8B\u6570\u636E</small></div></footer></div>`, { toolbar: `${ai(h, "x")}${ai(h, "info")}<span class="ap-spacer"></span><div class="ap-segments"><b>${h.esc(p.tab)}</b>\u3000\u5185\u5B58\u3000\u80FD\u8017\u3000\u78C1\u76D8\u3000\u7F51\u7EDC</div><span class="ap-spacer"></span><span class="ap-search">${ai(h, "search", 14)} \u641C\u7D22</span>` }), "\u6D3B\u52A8\u76D1\u89C6\u5668")),
    component("mac-file-dialog", "macOS \xB7 \u4FDD\u5B58\u5BF9\u8BDD\u6846", "\u4FDD\u5B58\u540D\u79F0\u3001\u4F4D\u7F6E\u3001\u6587\u4EF6\u5217\u8868\u548C\u786E\u8BA4\u64CD\u4F5C\uFF0C\u53EF\u7528\u4E8E\u5BFC\u51FA\u6B65\u9AA4\u6F14\u793A\u3002", { title: "\u5BFC\u51FA\u6587\u7A3F", filename: "\u8BFE\u7A0B\u8BB2\u7A3F.pdf", folder: "\u6587\u7A3F", format: "PDF", files, button: "\u5B58\u50A8" }, (p, h) => desktop(h, `<div class="ap-dialog-backdrop">${window(h, "\u5236\u4F5C\u6307\u5357", `<div class="ap-document-ghost"><h1>\u8BFE\u7A0B\u5236\u4F5C\u6307\u5357</h1><p>\u51C6\u5907\u8BB2\u7A3F\u4E0E\u7D20\u6750\uFF0C\u7136\u540E\u5BFC\u51FA\u5E76\u6838\u5BF9\u3002</p></div>`)}</div><div class="ap-save-sheet"><header>${h.esc(p.title)}</header><div class="ap-save-fields"><label>\u5B58\u50A8\u4E3A\uFF1A<span data-motion="focus">${h.esc(p.filename)}</span></label><label>\u6807\u7B7E\uFF1A<span class="empty">\u6DFB\u52A0\u6807\u7B7E\u2026</span></label><label>\u4F4D\u7F6E\uFF1A<b>${ai(h, "folder", 15)} ${h.esc(p.folder)}\u3000\u2304</b></label></div><div class="ap-save-files">${sidebar(h, p.folder)}<div class="ap-main">${table(h, ["\u540D\u79F0", "\u4FEE\u6539\u65E5\u671F", "\u79CD\u7C7B", "\u5927\u5C0F"], p.files, -1)}</div></div><footer><label>\u683C\u5F0F\uFF1A<span class="ap-button">${h.esc(p.format)}\u3000\u2304</span></label><span class="ap-spacer"></span><button class="ap-button">\u53D6\u6D88</button><button class="ap-button primary" data-motion="focus">${h.esc(p.button)}</button></footer></div>`, "\u9884\u89C8")),
    component("mac-alert", "macOS \xB7 \u6743\u9650\u63D0\u793A", "\u5C45\u4E2D\u7684\u7CFB\u7EDF\u8B66\u544A\u4E0E\u7EB5\u5411\u64CD\u4F5C\u6309\u94AE\uFF0C\u6807\u9898\u3001\u8BF4\u660E\u548C\u9009\u9879\u72EC\u7ACB\u914D\u7F6E\u3002", { app: "\u5C4F\u5E55\u5F55\u5236", title: "\u201C\u5C4F\u5E55\u5F55\u5236\u201D\u60F3\u8981\u8BBF\u95EE\u4F60\u7684\u9EA6\u514B\u98CE", message: "\u5141\u8BB8\u8BBF\u95EE\u9EA6\u514B\u98CE\uFF0C\u4EE5\u4FBF\u5728\u5F55\u5236\u753B\u9762\u65F6\u52A0\u5165\u4F60\u7684\u8BB2\u89E3\u3002\u4F60\u53EF\u4EE5\u968F\u65F6\u5728\u7CFB\u7EDF\u8BBE\u7F6E\u4E2D\u66F4\u6539\u6B64\u6743\u9650\u3002", primary: "\u5141\u8BB8", secondary: "\u4E0D\u5141\u8BB8" }, (p, h) => desktop(h, `<div class="ap-alert"><div class="ap-alert-icon">${appIcon(h, "settings", 60)}</div><h1>${h.esc(p.title)}</h1><p>${h.esc(p.message)}</p><button data-motion="focus" class="ap-alert-primary">${h.esc(p.primary)}</button><button>${h.esc(p.secondary)}</button></div>`, p.app, true)),
    component("mac-context-menu", "macOS \xB7 \u53F3\u952E\u83DC\u5355", "macOS \u7A84\u884C\u8DDD\u83DC\u5355\u3001\u5206\u9694\u7EBF\u3001\u5FEB\u6377\u952E\u4E0E\u7EA7\u8054\u5B50\u83DC\u5355\u3002", { filename: "\u8BFE\u7A0B\u8BB2\u7A3F.md", items: [["\u6253\u5F00", "\u2318O"], ["\u6253\u5F00\u65B9\u5F0F", "\u203A"], ["\u79FB\u5230\u5E9F\u7EB8\u7BD3", "\u2318\u232B"], ["---", ""], ["\u663E\u793A\u7B80\u4ECB", "\u2318I"], ["\u91CD\u65B0\u547D\u540D", ""], ["\u590D\u5236", "\u2318D"], ["\u5236\u4F5C\u66FF\u8EAB", ""], ["\u5FEB\u901F\u67E5\u770B", "\u7A7A\u683C"], ["---", ""], ["\u5171\u4EAB", "\u203A"], ["\u62F7\u8D1D\u201C\u8BFE\u7A0B\u8BB2\u7A3F.md\u201D", "\u2318C"]], selected: 1, submenu: ["\u6587\u672C\u7F16\u8F91\uFF08\u9ED8\u8BA4\uFF09", "Visual Studio Code", "\u5907\u5FD8\u5F55", "\u5176\u4ED6\u2026"] }, (p, h) => desktop(h, `${window(h, "\u6587\u7A3F", `<div class="ap-split">${sidebar(h)}<div class="ap-main">${table(h, ["\u540D\u79F0", "\u4FEE\u6539\u65E5\u671F", "\u79CD\u7C7B", "\u5927\u5C0F"], files.map((r, i) => i ? r : [p.filename, ...r.slice(1)]), 0)}</div></div>`)}<div class="ap-context"><div class="ap-context-main">${array(p.items, 18).map((x, i) => x[0] === "---" ? "<hr>" : `<div class="${i === p.selected ? "active" : ""}" data-motion="item"><span>${h.esc(x[0])}</span><small>${h.esc(x[1])}</small></div>`).join("")}</div><div class="ap-context-sub">${array(p.submenu, 7).map((x) => `<div>${h.esc(x)}</div>`).join("")}</div></div>`)),
    component("mac-dock", "macOS \xB7 \u7A0B\u5E8F\u575E", "\u684C\u9762\u5E95\u90E8\u73BB\u7483\u5E95\u677F\u3001\u5E94\u7528\u56FE\u6807\u3001\u8FD0\u884C\u6307\u793A\u548C\u60AC\u505C\u63D0\u793A\u3002", { apps: [["finder", "\u8BBF\u8FBE"], ["safari", "Safari"], ["mail", "\u90AE\u4EF6"], ["calendar", "\u65E5\u5386"], ["notes", "\u5907\u5FD8\u5F55"], ["messages", "\u4FE1\u606F"], ["settings", "\u7CFB\u7EDF\u8BBE\u7F6E"], ["terminal", "\u7EC8\u7AEF"]], selected: 1, desktopFiles: ["\u89C6\u9891\u5236\u4F5C", "\u53C2\u8003\u8D44\u6599", "\u8BFE\u7A0B\u8BB2\u7A3F.pdf"] }, (p, h) => desktop(h, `<div class="ap-desktop-files">${array(p.desktopFiles, 5).map((x, i) => `<div data-motion="item">${ai(h, i === 2 ? "file" : "folder", 56)}<p>${h.esc(x)}</p></div>`).join("")}</div><div class="ap-dock">${array(p.apps, 12).map((x, i) => `<div class="ap-dock-item ${i === p.selected ? "active" : ""}" data-motion="item" data-app="${h.esc(x[0])}">${i === p.selected ? `<span class="ap-dock-tip">${h.esc(x[1])}</span>` : ""}${appIcon(h, x[0], 58)}<i></i></div>`).join("")}<b class="ap-dock-separator"></b><div class="ap-dock-item">${appIcon(h, "files", 58)}</div><div class="ap-dock-trash">${ai(h, "trash", 40)}</div></div>`, "\u8BBF\u8FBE", true))
  ];

  // families/apple-macos.mjs
  var fileRows = [["\u9879\u76EE\u7D20\u6750", "\u4ECA\u5929 09:30", "\u6587\u4EF6\u5939", "\u2014"], ["\u8BFE\u7A0B\u8BB2\u7A3F.md", "\u4ECA\u5929 09:12", "Markdown \u6587\u7A3F", "16 KB"], ["\u5206\u955C\u6E05\u5355.csv", "\u6628\u5929 18:20", "CSV \u6587\u7A3F", "8 KB"], ["\u53C2\u8003\u622A\u56FE.png", "\u6628\u5929 16:40", "PNG \u56FE\u50CF", "2.4 MB"], ["\u64CD\u4F5C\u5F55\u5C4F.mov", "\u6628\u5929 15:06", "QuickTime \u5F71\u7247", "86 MB"], ["\u914D\u97F3.wav", "9\u670815\u65E5 11:24", "WAV \u97F3\u9891", "24 MB"], ["README.md", "9\u670814\u65E5 14:08", "Markdown \u6587\u7A3F", "4 KB"]];
  var noteDefault = { title: "\u79D1\u666E\u89C6\u9891\u5236\u4F5C\u8BA1\u5212", folder: "\u5DE5\u4F5C", date: "2026\u5E749\u670817\u65E5 09:41", notes: ["\u79D1\u666E\u89C6\u9891\u5236\u4F5C\u8BA1\u5212", "\u7B2C\u4E00\u6BB5\u7684\u5F00\u5934", "\u8D44\u6599\u4E0E\u5F15\u7528", "\u5F55\u5C4F\u64CD\u4F5C\u6E05\u5355"], paragraphs: ["\u5148\u628A\u89C2\u4F17\u7684\u95EE\u9898\u5199\u6210\u4E00\u53E5\u8BDD\uFF0C\u518D\u51B3\u5B9A\u753B\u9762\u600E\u6837\u914D\u5408\u3002", "\u672C\u5468\u5148\u5B8C\u6210\u7B2C\u4E00\u6BB5\uFF0C\u4FDD\u6301\u8BB2\u7A3F\u3001\u53C2\u8003\u56FE\u548C\u6F14\u793A\u5185\u5BB9\u4E00\u81F4\u3002"], checklist: ["\u786E\u5B9A\u5F00\u5934\u94A9\u5B50", "\u6574\u7406\u53C2\u8003\u4F9D\u636E", "\u51C6\u5907\u771F\u5B9E\u5F55\u5C4F", "\u68C0\u67E5\u5B57\u5E55\u4E0E\u58F0\u97F3"] };
  var notesBody = (p, h) => `<aside class="ap-note-list">${array(p.notes).map((x, i) => `<article class="${i === 0 ? "active" : ""}" data-motion="item"><b>${h.esc(x)}</b><p>09:41 <span>${i === 0 ? "\u5148\u628A\u89C2\u4F17\u7684\u95EE\u9898\u5199\u6E05\u695A" : "\u5DE5\u4F5C\u7B14\u8BB0\u4E0E\u8BB0\u5F55"}</span></p><small>\u25B1 ${h.esc(p.folder)}</small></article>`).join("")}</aside><div class="ap-note-page"><small>${h.esc(p.date)}</small><h1>${h.esc(p.title)}</h1>${array(p.paragraphs).map((x) => `<p>${h.esc(x)}</p>`).join("")}<h2>\u5236\u4F5C\u6E05\u5355</h2>${array(p.checklist).map((x, i) => `<div class="ap-note-check" data-motion="item"><i class="${i < 2 ? "done" : ""}">${i < 2 ? "\u2713" : ""}</i>${h.esc(x)}</div>`).join("")}</div>`;
  var components12 = [
    component("mac-finder", "macOS \xB7 \u8BBF\u8FBE", "\u539F\u751F\u4FA7\u680F\u3001\u5DE5\u5177\u680F\u4E0E\u6587\u4EF6\u5217\u8868\uFF0C\u53EF\u66FF\u6362\u76EE\u5F55\u3001\u6587\u4EF6\u548C\u9009\u62E9\u72B6\u6001\u3002", { title: "\u6587\u7A3F", path: "iCloud \u4E91\u76D8 \u203A \u6587\u7A3F \u203A \u89C6\u9891\u5236\u4F5C", files: fileRows, selected: 1 }, (p, h) => desktop(h, window(h, p.title, `<div class="ap-split">${sidebar(h, p.title)}<div class="ap-main">${table(h, ["\u540D\u79F0", "\u4FEE\u6539\u65E5\u671F", "\u79CD\u7C7B", "\u5927\u5C0F"], array(p.files), p.selected)}<div class="ap-bottom">${h.esc(p.path)}\u3000 \xB7\u3000${p.files.length} \u4E2A\u9879\u76EE</div></div></div>`, { toolbar: `${ai(h, "chevron-left")}${ai(h, "chevron-right")}<b>${h.esc(p.title)}</b><span class="ap-spacer"></span>${ai(h, "grid")}${ai(h, "list")}${ai(h, "columns")}${ai(h, "share")}${ai(h, "more")}<span class="ap-search">${ai(h, "search", 14)} \u641C\u7D22</span>` }))),
    component("mac-safari", "macOS \xB7 Safari \u6D4F\u89C8\u5668", "macOS \u7684\u72EC\u7ACB\u5DE5\u5177\u680F\u3001\u5730\u5740\u680F\u4E0E\u6807\u7B7E\u9875\uFF0C\u7F51\u9875\u6B63\u6587\u53EF\u7F16\u8F91\u3002", { title: "\u5236\u4F5C\u6307\u5357", url: "docs.example.com", tabs: ["\u5236\u4F5C\u6307\u5357", "\u7EC4\u4EF6\u76EE\u5F55"], heading: "\u628A\u77E5\u8BC6\u53D8\u6210\u80FD\u770B\u61C2\u7684\u753B\u9762", intro: "\u4ECE\u4E00\u4E2A\u95EE\u9898\u51FA\u53D1\uFF0C\u7528\u6E05\u6670\u7684\u7ED3\u6784\u3001\u771F\u5B9E\u7D20\u6750\u548C\u51C6\u786E\u7684\u56FE\u89E3\u5B8C\u6210\u8BB2\u89E3\u3002", sections: [{ title: "\u51C6\u5907\u5185\u5BB9", detail: "\u6574\u7406\u4E3B\u9898\u3001\u53D7\u4F17\u3001\u9010\u5B57\u7A3F\u4E0E\u53C2\u8003\u6765\u6E90\u3002" }, { title: "\u9009\u62E9\u753B\u9762", detail: "\u6839\u636E\u5185\u5BB9\u9009\u62E9\u5F55\u5C4F\u3001\u56FE\u89E3\u3001\u56FE\u7247\u6216\u89C6\u9891\u3002" }, { title: "\u68C0\u67E5\u7ED3\u679C", detail: "\u786E\u8BA4\u6587\u5B57\u53EF\u8BFB\u3001\u4E8B\u5B9E\u51C6\u786E\u3001\u58F0\u753B\u540C\u6B65\u3002" }] }, (p, h) => desktop(h, window(h, p.title, `<div class="ap-safari-tabs">${array(p.tabs, 5).map((x, i) => `<div class="${!i ? "active" : ""}">${h.esc(i === 0 ? p.title : x)}<span>\xD7</span></div>`).join("")}</div><div class="ap-safari-page"><nav><b>Studio Docs</b><span>\u6587\u6863\u3000\u7EC4\u4EF6\u3000\u793A\u4F8B</span><button>\u5F00\u59CB\u5236\u4F5C</button></nav><div class="ap-site-body"><aside>\u5F00\u59CB\u4F7F\u7528<b>\u5236\u4F5C\u6307\u5357</b><span>\u5185\u5BB9\u4E0E\u5206\u955C</span><span>\u7D20\u6750\u7BA1\u7406</span><span>\u9884\u89C8\u4E0E\u5BFC\u51FA</span></aside><article><small>\u6587\u6863 / \u5236\u4F5C\u6307\u5357</small><h1>${h.esc(p.heading)}</h1><p>${h.esc(p.intro)}</p>${array(p.sections, 4).map((x) => `<section data-motion="item"><h2>${h.esc(x.title)}</h2><p>${h.esc(x.detail)}</p></section>`).join("")}<div class="ap-site-code" data-motion="focus">npm run build<br>npm run preview</div></article></div></div>`, { toolbar: `${ai(h, "panel")}${ai(h, "chevron-left")}${ai(h, "chevron-right")}<div class="ap-safari-address">${ai(h, "lock", 12)} ${h.esc(p.url)}<span>${ai(h, "refresh", 13)}</span></div>${ai(h, "share")}${ai(h, "plus")}${ai(h, "copy")}` }), "Safari")),
    component("mac-terminal", "macOS \xB7 \u7EC8\u7AEF", "\u4FDD\u7559 macOS \u7A97\u53E3\u5F62\u5236\u4E0E shell \u63D0\u793A\u7B26\uFF0C\u53EF\u66FF\u6362\u547D\u4EE4\u4E0E\u8F93\u51FA\u3002", { title: "video-studio \u2014 zsh \u2014 100\xD728", user: "lin@MacBook-Pro", folder: "video-studio", command: "npm run build", lines: ["> science-video-studio@1.0.0 build", "> node scripts/build.mjs", "", "\u2713 \u5185\u5BB9\u6821\u9A8C\u5B8C\u6210", "\u2713 \u5DF2\u751F\u6210\u53EF\u7F16\u8F91\u7EC4\u4EF6", "\u2713 \u672C\u5730\u9884\u89C8\u51C6\u5907\u5C31\u7EEA", "", "\u5B8C\u6210\u3002\u672A\u6E32\u67D3\u89C6\u9891\u3002"] }, (p, h) => desktop(h, window(h, p.title, `<div class="ap-terminal"><div>Last login: Thu Sep 17 09:38:24 on ttys001</div><div><span>${h.esc(p.user)}</span> ${h.esc(p.folder)} % <b data-motion="type">${h.esc(p.command)}</b></div>${array(p.lines, 18).map((x) => `<div data-output-line>${h.esc(x) || "&nbsp;"}</div>`).join("")}<div>${h.esc(p.user)} ${h.esc(p.folder)} % <i></i></div></div>`, { cls: "ap-terminal-window" }), "\u7EC8\u7AEF")),
    component("mac-system-settings", "macOS \xB7 \u7CFB\u7EDF\u8BBE\u7F6E", "\u8BBE\u7F6E\u4FA7\u680F\u3001\u5206\u7EC4\u9762\u677F\u3001\u5F00\u5173\u548C\u8BE6\u60C5\u884C\uFF0C\u53EF\u7528\u4E8E\u6559\u7A0B\u5B9A\u4F4D\u3002", { title: "\u901A\u7528", account: "\u6797\u540C\u5B66", subtitle: "Apple \u8D26\u6237", rows: [["\u5173\u4E8E\u672C\u673A", "MacBook Pro"], ["\u8F6F\u4EF6\u66F4\u65B0", "\u5DF2\u662F\u6700\u65B0"], ["\u50A8\u5B58\u7A7A\u95F4", "128 GB \u53EF\u7528"], ["\u9694\u7A7A\u6295\u9001\u4E0E\u63A5\u529B", ""], ["\u767B\u5F55\u9879\u4E0E\u6269\u5C55", ""], ["\u8BED\u8A00\u4E0E\u5730\u533A", "\u7B80\u4F53\u4E2D\u6587"], ["\u65E5\u671F\u4E0E\u65F6\u95F4", "\u81EA\u52A8\u8BBE\u7F6E"], ["\u5171\u4EAB", "\u5173\u95ED"]] }, (p, h) => desktop(h, window(h, p.title, `<div class="ap-split"><aside class="ap-settings-sidebar"><div class="ap-search">${ai(h, "search", 13)} \u641C\u7D22</div><div class="ap-account"><b>\u6797</b><div><strong>${h.esc(p.account)}</strong><small>${h.esc(p.subtitle)}</small></div></div>${["Wi-Fi", "\u84DD\u7259", "\u7F51\u7EDC", "\u901A\u77E5", "\u58F0\u97F3", "\u4E13\u6CE8\u6A21\u5F0F", "\u5C4F\u5E55\u4F7F\u7528\u65F6\u95F4", "\u901A\u7528", "\u8F85\u52A9\u529F\u80FD", "\u5916\u89C2", "\u63A7\u5236\u4E2D\u5FC3", "\u684C\u9762\u4E0E\u7A0B\u5E8F\u575E", "\u663E\u793A\u5668", "\u5899\u7EB8", "\u9690\u79C1\u4E0E\u5B89\u5168\u6027"].map((x, i) => `<div class="ap-setting-nav ${x === p.title ? "active" : ""}" data-motion="item"><i style="background:${["#248cef", "#258cf1", "#278ce8", "#ef514a", "#e7638c", "#7767c9", "#5856d6", "#9095a0"][i % 8]}">${ai(h, ["wifi", "bluetooth", "globe", "bell", "volume", "moon", "clock", "settings"][i % 8], 14)}</i>${x}</div>`).join("")}</aside><div class="ap-settings-main"><h2>${h.esc(p.title)}</h2><div class="ap-settings-hero">${appIcon(h, "settings", 54)}<b>${h.esc(p.title)}</b><p>\u7BA1\u7406\u8BBE\u5907\u7684\u6574\u4F53\u8BBE\u7F6E\u548C\u504F\u597D\u3002</p></div><div class="ap-setting-group">${array(p.rows, 10).map((x, i) => `<div data-motion="focus" class="ap-native-row">${ai(h, ["info", "refresh", "folder", "airdrop", "grid", "globe", "clock", "share"][i], 18)}<b>${h.esc(x[0])}</b><span>${h.esc(x[1])}\u3000\u203A</span></div>`).join("")}</div></div></div>`, { style: "left:211px;top:56px;width:858px;height:700px", toolbar: `<span class="ap-spacer"></span>${ai(h, "chevron-left")}${ai(h, "chevron-right")}<span class="ap-spacer"></span>` }), "\u7CFB\u7EDF\u8BBE\u7F6E")),
    component("mac-spotlight", "macOS \xB7 \u805A\u7126\u641C\u7D22", "\u72EC\u7ACB\u641C\u7D22\u6D6E\u5C42\u3001\u5206\u7C7B\u7ED3\u679C\u548C\u9884\u89C8\uFF0C\u53EF\u66FF\u6362\u641C\u7D22\u8BCD\u4E0E\u5339\u914D\u9879\u3002", { query: "\u89C6\u9891\u5236\u4F5C", results: [{ name: "\u89C6\u9891\u5236\u4F5C", detail: "\u6587\u7A3F / \u9879\u76EE\u6587\u4EF6\u5939", kind: "folder" }, { name: "\u89C6\u9891\u5236\u4F5C\u8BA1\u5212.md", detail: "\u4ECA\u5929 09:12 \xB7 Markdown \u6587\u7A3F", kind: "file" }, { name: "\u89C6\u9891\u5236\u4F5C\u53C2\u8003.pdf", detail: "\u6628\u5929 18:22 \xB7 PDF \u6587\u7A3F", kind: "file" }, { name: "\u89C6\u9891\u5236\u4F5C\u6559\u7A0B", detail: "\u5728\u7F51\u9875\u4E2D\u641C\u7D22", kind: "globe" }] }, (p, h) => desktop(h, `<div class="ap-spotlight"><div class="ap-spot-search">${ai(h, "search", 28)}<span data-motion="type">${h.esc(p.query)}</span></div><div class="ap-spot-body"><div><label>\u6700\u4F73\u5339\u914D</label>${array(p.results, 7).map((r, i) => `<article class="${i === 0 ? "active" : ""}" data-motion="item">${ai(h, r.kind, 28)}<div><b>${h.esc(r.name)}</b><small>${h.esc(r.detail)}</small></div>${i === 0 ? "<span>\u21B5</span>" : ""}</article>`).join("")}</div><aside>${appIcon(h, "files", 76)}<h2>${h.esc(p.results[0]?.name)}</h2><p>\u6587\u4EF6\u5939</p><hr><small>\u4F4D\u7F6E\u3000iCloud \u4E91\u76D8 / \u6587\u7A3F</small><small>\u4FEE\u6539\u3000\u4ECA\u5929 09:30</small><small>\u5927\u5C0F\u30008 \u4E2A\u9879\u76EE</small></aside></div><footer>\u6309\u56DE\u8F66\u952E\u6253\u5F00\u3000 \xB7\u3000\u6309\u4F4F \u2318 \u67E5\u770B\u4F4D\u7F6E</footer></div>`, "\u8BBF\u8FBE", true)),
    component("mac-control-center", "macOS \xB7 \u63A7\u5236\u4E2D\u5FC3", "\u6309\u5B98\u65B9\u5206\u7EC4\u7EC4\u7EC7\u7F51\u7EDC\u3001\u4E13\u6CE8\u3001\u663E\u793A\u548C\u58F0\u97F3\u63A7\u5236\u3002", { wifi: "Studio Wi-Fi", bluetooth: "\u5DF2\u6253\u5F00", airdrop: "\u4EC5\u9650\u8054\u7CFB\u4EBA", focus: "\u4E13\u6CE8\u6A21\u5F0F", brightness: 65, volume: 42, track: "\u672A\u5728\u64AD\u653E" }, (p, h) => desktop(h, `<div class="ap-control"><div class="ap-control-grid"><section class="ap-connect">${[["wifi", "Wi-Fi", p.wifi], ["bluetooth", "\u84DD\u7259", p.bluetooth], ["airdrop", "\u9694\u7A7A\u6295\u9001", p.airdrop]].map((x) => `<div data-motion="item"><i>${ai(h, x[0], 19)}</i><span><b>${h.esc(x[1])}</b><small>${h.esc(x[2])}</small></span></div>`).join("")}</section><section class="ap-focus" data-motion="focus">${ai(h, "moon", 24)}<b>${h.esc(p.focus)}</b></section><section class="ap-control-small">${ai(h, "panel", 24)}<span>\u53F0\u524D\u8C03\u5EA6</span></section><section class="ap-control-small">${ai(h, "copy", 24)}<span>\u5C4F\u5E55\u955C\u50CF</span></section></div>${[["\u663E\u793A\u5668", "sun", p.brightness], ["\u58F0\u97F3", "volume", p.volume]].map((x) => `<section class="ap-control-slider" data-motion="focus"><b>${x[0]}</b><div><i style="width:${Math.max(0, Math.min(100, Number(x[2])))}%"></i><span>${ai(h, x[1], 15)}</span></div></section>`).join("")}<section class="ap-control-playing">${appIcon(h, "notes", 37)}<b>${h.esc(p.track)}</b>${ai(h, "play", 17)}</section></div>`, "\u8BBF\u8FBE", true)),
    component("mac-notification-center", "macOS \xB7 \u901A\u77E5\u4E0E\u5C0F\u7EC4\u4EF6", "\u53F3\u4FA7\u901A\u77E5\u548C\u65E5\u5386\u5C0F\u7EC4\u4EF6\uFF0C\u6309\u771F\u5B9E\u684C\u9762\u9762\u677F\u5BC6\u5EA6\u7EC4\u7EC7\u3002", { date: "9\u670817\u65E5 \u661F\u671F\u56DB", events: [{ app: "\u65E5\u5386", title: "\u5236\u4F5C\u8BC4\u5BA1", body: "\u4ECA\u5929 10:00\u201310:30", time: "9\u5206\u949F\u524D" }, { app: "\u63D0\u9192\u4E8B\u9879", title: "\u68C0\u67E5\u7B2C\u4E00\u7248", body: "\u6838\u5BF9\u5B57\u5E55\u3001\u58F0\u97F3\u548C\u64CD\u4F5C\u6B65\u9AA4\u3002", time: "24\u5206\u949F\u524D" }, { app: "\u4FE1\u606F", title: "\u6797\u540C\u5B66", body: "\u53C2\u8003\u8D44\u6599\u5DF2\u7ECF\u6574\u7406\u5230\u9879\u76EE\u6587\u4EF6\u5939\u3002", time: "1\u5C0F\u65F6\u524D" }] }, (p, h) => desktop(h, `<div class="ap-notifications"><header>${h.esc(p.date)}</header><div class="ap-widget-pair"><section><small>\u661F\u671F\u56DB</small><b>17</b><p>\u4ECA\u5929\u6709 2 \u4E2A\u65E5\u7A0B</p></section><section><small>\u4E0B\u4E00\u9879\u65E5\u7A0B</small><h3>\u5236\u4F5C\u8BC4\u5BA1</h3><p>10:00\u201310:30</p><i>\u5DE5\u4F5C\u65E5\u5386</i></section></div>${array(p.events, 5).map((x, i) => `<article class="ap-notification" data-motion="item">${appIcon(h, ["calendar", "notes", "messages"][i % 3], 30)}<div><small>${h.esc(x.app)}<span>${h.esc(x.time)}</span></small><b>${h.esc(x.title)}</b><p>${h.esc(x.body)}</p></div></article>`).join("")}<div class="ap-notification-edit">\u7F16\u8F91\u5C0F\u7EC4\u4EF6</div></div>`, "\u8BBF\u8FBE", true)),
    component("mac-notes", "macOS \xB7 \u5907\u5FD8\u5F55", "\u6587\u4EF6\u5939\u3001\u7B14\u8BB0\u5217\u8868\u4E0E\u6B63\u6587\u4E09\u680F\uFF0C\u652F\u6301\u6E05\u5355\u548C\u6BB5\u843D\u66FF\u6362\u3002", noteDefault, (p, h) => desktop(h, window(h, "\u5907\u5FD8\u5F55", `<div class="ap-split">${sidebar(h, p.folder, ["\u6240\u6709 iCloud", "\u5907\u5FD8\u5F55", "\u5DE5\u4F5C", "\u4E2A\u4EBA", "\u6700\u8FD1\u5220\u9664"])}${notesBody(p, h)}</div>`, { toolbar: `${ai(h, "panel")}${ai(h, "trash")}<span class="ap-spacer"></span>${ai(h, "edit")}${ai(h, "check-circle")}<b>Aa</b>${ai(h, "grid")}${ai(h, "share")}${ai(h, "search")}` }), "\u5907\u5FD8\u5F55"))
  ];
  var css2 = commonCSS + `
.ap-safari-address{height:29px;border:1px solid #d5d5d9;background:#e9e9ed;border-radius:7px;display:flex;align-items:center;justify-content:center;gap:5px;width:560px;margin:auto;color:#555;font-size:12px;position:relative}.ap-safari-address>span{position:absolute;right:9px}.ap-safari-tabs{display:flex;height:32px;background:#eaeaec;border-bottom:1px solid #d9d9dc}.ap-safari-tabs>div{flex:1;display:flex;align-items:center;justify-content:center;position:relative;border-right:1px solid #d2d2d5;font-size:12px;color:#676a72}.ap-safari-tabs .active{background:#fff;color:#252931}.ap-safari-tabs span{position:absolute;left:15px}.ap-safari-page nav{height:62px;border-bottom:1px solid #e6e9ed;display:flex;align-items:center;gap:45px;padding:0 36px;font-size:12px}.ap-safari-page nav>b{font-size:18px}.ap-safari-page nav>button{margin-left:auto;background:#2563eb;color:#fff;border:0;border-radius:5px;padding:7px 12px}.ap-site-body{display:flex;padding:28px 36px;gap:48px}.ap-site-body>aside{width:150px;display:flex;flex-direction:column;font-size:11px;color:#7c8493;gap:18px}.ap-site-body>aside b{color:#2563eb;background:#eef4fd;padding:8px;margin-left:-8px;border-radius:4px;font-size:12px}.ap-site-body>article{flex:1}.ap-site-body small{font-size:10px;color:#8a92a1}.ap-site-body h1{font-size:28px;margin:13px 0 15px;letter-spacing:-.5px}.ap-site-body p{font-size:13px;line-height:1.9;color:#555f71}.ap-site-body h2{font-size:17px;margin:23px 0 7px}.ap-site-code{background:#f6f7f9;border:1px solid #e6e9ef;border-radius:5px;margin-top:19px;padding:13px;font:12px/1.7 ComponentMono,monospace;color:#315282}.ap-terminal{background:#fff;padding:17px 20px;font:14px/1.55 ComponentMono,monospace;height:100%;color:#26292c}.ap-terminal>div{min-height:22px}.ap-terminal b{font-weight:400}.ap-terminal i{display:inline-block;width:8px;height:17px;background:#444;vertical-align:middle}.ap-terminal-window{height:560px;top:111px}.ap-terminal-window .ap-toolbar{height:29px;padding:0 13px;gap:8px;justify-content:center}.ap-terminal-window .ap-toolbar>b{font-size:12px}.ap-terminal-window .ap-lights{position:absolute;left:13px}.ap-terminal-window .ap-toolbar>svg{display:none}.ap-settings-sidebar{width:225px;background:#eeeef0;border-right:1px solid #d6d6da;padding:13px 9px}.ap-settings-sidebar .ap-search{margin:0 4px 15px;border:1px solid #d5d5da;background:#e8e8ed}.ap-account{display:flex;gap:10px;align-items:center;margin:10px 6px 20px}.ap-account>b{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:#a8adb5;color:white;font-size:19px}.ap-account strong{font-size:14px}.ap-account small{font-size:11px;display:block;color:#74767c;margin-top:5px}.ap-setting-nav{height:33px;display:flex;align-items:center;gap:8px;padding:0 8px;border-radius:5px;font-size:12px}.ap-setting-nav i{width:21px;height:21px;display:grid;place-items:center;border-radius:5px;color:white}.ap-setting-nav.active{background:#337bd1;color:white}.ap-settings-main{padding:18px 22px;flex:1;background:#f8f8fa}.ap-settings-main>h2{font-size:16px}.ap-settings-hero{display:flex;align-items:center;flex-direction:column;margin:18px 0 22px;gap:10px}.ap-settings-hero>b{font-size:18px}.ap-settings-hero>p{font-size:12px;color:#6e747f}.ap-setting-group{background:#fff;border:1px solid #dddde2;border-radius:8px;overflow:hidden}.ap-setting-group .ap-native-row{height:44px}.ap-setting-group .ap-native-row>b{font-weight:400}.ap-setting-group .ap-native-row:last-child{border:0}.ap-spotlight{position:absolute;left:290px;top:152px;width:700px;background:#f5f6f7e8;border:1px solid #ffffffb0;border-radius:12px;box-shadow:0 30px 80px #19283d4a;overflow:hidden}.ap-spot-search{height:76px;display:flex;align-items:center;gap:18px;padding:0 24px;font-size:27px;border-bottom:1px solid #cdd2d9;color:#555d6b}.ap-spot-search>span{color:#262c35}.ap-spot-body{display:grid;grid-template-columns:360px 1fr;min-height:330px;padding:12px}.ap-spot-body label{font-size:11px;color:#737985;display:block;padding:7px 10px}.ap-spot-body article{display:flex;align-items:center;gap:13px;padding:13px 11px;border-radius:7px;margin-bottom:3px}.ap-spot-body article>svg{color:#328bdb}.ap-spot-body article b{font-size:13px}.ap-spot-body article small{display:block;font-size:11px;opacity:.6;margin-top:5px}.ap-spot-body article.active{background:#2b79d3;color:white}.ap-spot-body article.active>svg{color:white}.ap-spot-body article>span{margin-left:auto}.ap-spot-body>aside{border-left:1px solid #d4d7dd;text-align:center;padding:25px 15px}.ap-spot-body>aside h2{font-size:18px;margin:16px 0 9px}.ap-spot-body>aside p{font-size:12px;color:#7a818d}.ap-spot-body>aside hr{border:0;border-top:1px solid #d9dce2;margin:25px 10px 16px}.ap-spot-body>aside small{display:block;font-size:11px;text-align:left;margin:11px}.ap-spotlight footer{border-top:1px solid #d6d9df;padding:11px 20px;font-size:10px;color:#7c8493}.ap-control{position:absolute;right:24px;top:39px;width:334px;border:1px solid #fff9;padding:11px;border-radius:17px;background:#e4eaf1b8;backdrop-filter:blur(30px);box-shadow:0 14px 35px #17344c42}.ap-control section{background:#ffffff76;border:1px solid #ffffff37;border-radius:10px;box-shadow:0 2px 5px #17344c0d}.ap-control-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}.ap-connect{grid-column:span 2;grid-row:span 2;padding:8px}.ap-connect>div{display:flex;gap:8px;align-items:center;margin:4px 0 11px}.ap-connect>div:last-child{margin-bottom:3px}.ap-connect i{width:29px;height:29px;border-radius:50%;background:#0789ff;color:white;display:grid;place-items:center}.ap-connect b{font-size:12px}.ap-connect small{display:block;font-size:10px;color:#5d687c;margin-top:2px}.ap-focus{grid-column:span 2;display:flex;align-items:center;gap:10px;padding:13px 11px}.ap-focus>b{font-size:12px}.ap-control-small{padding:13px 4px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;font-size:10px}.ap-control-slider{padding:12px;margin-top:10px}.ap-control-slider>b{font-size:12px}.ap-control-slider>div{height:22px;border-radius:15px;background:#aebcd280;position:relative;margin-top:9px;overflow:hidden;border:1px solid #7286a02f}.ap-control-slider i{position:absolute;left:0;top:0;height:100%;background:#ffffffec;border-radius:15px}.ap-control-slider i:after{content:'';position:absolute;right:0;top:0;width:21px;height:21px;border-radius:50%;background:white;box-shadow:0 1px 4px #0003}.ap-control-slider span{position:absolute;left:5px;top:2px;color:#8a99ae}.ap-control-playing{display:flex;align-items:center;gap:12px;padding:12px;margin-top:10px}.ap-control-playing b{font-size:12px;flex:1}.ap-notifications{position:absolute;right:18px;top:51px;width:350px}.ap-notifications>header{font-size:19px;color:white;text-shadow:0 1px 3px #1e385e66;margin:0 0 17px 6px}.ap-widget-pair{display:flex;gap:12px;margin-bottom:16px}.ap-widget-pair>section{flex:1;background:#fffffff0;border-radius:16px;padding:17px;height:156px;box-shadow:0 6px 15px #183c6614}.ap-widget-pair small{font-size:11px;color:#e05850}.ap-widget-pair b{display:block;font-size:51px;font-weight:400;margin:3px 0}.ap-widget-pair p{font-size:11px;color:#838993}.ap-widget-pair h3{font-size:15px;margin:19px 0 11px}.ap-widget-pair i{display:block;font-size:10px;color:#dd635a;margin-top:10px;font-style:normal}.ap-notification{display:flex;gap:11px;background:#eef2f6e8;border:1px solid #fff6;border-radius:15px;padding:17px 14px;margin-bottom:12px;box-shadow:0 7px 21px #2646671e}.ap-notification>div{flex:1;min-width:0}.ap-notification small{font-size:10px;color:#6c7481;display:block;margin-bottom:6px}.ap-notification small span{float:right}.ap-notification b{font-size:13px}.ap-notification p{font-size:12px;line-height:1.6;margin-top:5px}.ap-notification-edit{width:100px;margin:23px auto;background:#e4e8eec0;border-radius:20px;padding:8px;text-align:center;font-size:11px}.ap-note-list{width:248px;background:#fbfbfc;border-right:1px solid #e5e5e7;padding:9px 8px;flex-shrink:0}.ap-note-list article{padding:15px 16px;border-radius:6px;border-bottom:1px solid #ececee;margin-bottom:3px}.ap-note-list article.active{background:#f8dfa0;border:0}.ap-note-list b{font-size:13px}.ap-note-list p{font-size:11px;margin:7px 0;color:#4e5057;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ap-note-list p span{color:#919196}.ap-note-list small{font-size:10px;color:#737477}.ap-note-page{flex:1;padding:17px 34px;overflow:hidden}.ap-note-page>small{display:block;text-align:center;font-size:11px;color:#8d8f94;margin-bottom:27px}.ap-note-page h1{font-size:26px;margin:10px 0 22px}.ap-note-page p{font-size:14px;line-height:1.9;margin-bottom:17px}.ap-note-page h2{font-size:19px;margin:30px 0 18px}.ap-note-check{font-size:14px;display:flex;align-items:center;gap:11px;margin:14px 0}.ap-note-check i{width:19px;height:19px;border:1.7px solid #d0a630;border-radius:50%;font-style:normal;color:white;display:grid;place-items:center;font-size:12px}.ap-note-check i.done{background:#d0a630}
`;

  // families/apple-mobile.mjs
  var phone = (p, h, body, cls2 = "") => `<section class="am-stage"><div class="am-phone"><div class="am-screen ${cls2}"><div class="am-status"><b>${h.esc(p.time || "9:41")}</b><span><svg width="15" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx=".7"/><rect x="4.5" y="5" width="3" height="7" rx=".7"/><rect x="9" y="2" width="3" height="10" rx=".7"/><rect x="13.5" width="3" height="12" rx=".7"/></svg>${ai(h, "wifi", 15)}<i class="am-battery"></i></span></div><div class="am-island"></div>${body}<div class="am-home"></div></div></div></section>`;
  var nav = (h, title, left = "\u8FD4\u56DE", right = "") => `<nav class="am-nav"><span>${ai(h, "chevron-left", 22)}${h.esc(left)}</span><b>${h.esc(title)}</b><span>${h.esc(right)}</span></nav>`;
  var iosRow = (h, x, i) => `<div class="am-row" data-motion="item"><i style="background:${["#168cff", "#1998ee", "#777e8b", "#ed5a58", "#b156cf", "#615ce4"][i % 6]}">${ai(h, x.icon || ["wifi", "bluetooth", "settings", "bell", "moon", "clock"][i % 6], 17)}</i><b>${h.esc(x.label)}</b><span>${x.toggle !== void 0 ? `<i class="am-switch ${x.toggle ? "" : "off"}" data-motion="focus"></i>` : h.esc(x.value || "") + (x.arrow === false ? "" : "\u3000\u203A")}</span></div>`;
  var paragraphs = (h, p) => array(p).map((x) => `<p>${h.esc(x)}</p>`).join("");
  var pad = (h, body) => `<section class="am-stage"><div class="am-ipad"><div class="am-pad-screen"><header class="am-pad-status">9:41\u30009\u670817\u65E5 \u661F\u671F\u56DB<span>\u25CF \u25CF \u25CF</span><i>${ai(h, "wifi", 14)}\u300085% ${ai(h, "battery", 21)}</i></header>${body}<div class="am-home"></div></div></div></section>`;
  var components13 = [
    component("ios-settings", "iPhone \xB7 \u8BBE\u7F6E", "iOS 18 \u8BBE\u7F6E\u9996\u9875\u3001\u8D26\u6237\u5361\u7247\u3001\u641C\u7D22\u548C\u5206\u7EC4\u5217\u8868\u3002", { title: "\u8BBE\u7F6E", account: "\u6797\u540C\u5B66", accountSubtitle: "Apple \u8D26\u6237\u3001iCloud \u7B49", groups: [[{ label: "\u98DE\u884C\u6A21\u5F0F", icon: "airplane", toggle: false }, { label: "\u65E0\u7EBF\u5C40\u57DF\u7F51", icon: "wifi", value: "Studio Wi-Fi" }, { label: "\u84DD\u7259", icon: "bluetooth", value: "\u6253\u5F00" }, { label: "\u8702\u7A9D\u7F51\u7EDC", icon: "phone" }], [{ label: "\u901A\u7528", icon: "settings" }, { label: "\u8F85\u52A9\u529F\u80FD", icon: "info" }, { label: "\u76F8\u673A", icon: "camera" }, { label: "\u63A7\u5236\u4E2D\u5FC3", icon: "sliders" }], [{ label: "\u663E\u793A\u4E0E\u4EAE\u5EA6", icon: "sun" }, { label: "\u5899\u7EB8", icon: "image" }]] }, (p, h) => phone(p, h, `<div class="am-settings"><h1>${h.esc(p.title)}</h1><div class="am-search">${ai(h, "search", 16)} \u641C\u7D22 ${ai(h, "mic", 16)}</div><div class="am-account"><b>\u6797</b><div><strong>${h.esc(p.account)}</strong><small>${h.esc(p.accountSubtitle)}</small></div><span>\u203A</span></div>${array(p.groups, 4).map((g) => `<section class="am-group">${array(g, 6).map((x, i) => iosRow(h, x, i)).join("")}</section>`).join("")}</div>`, "am-settings-screen"), true),
    component("ios-messages", "iPhone \xB7 \u4FE1\u606F", "\u8054\u7CFB\u4EBA\u680F\u3001\u6536\u53D1\u6C14\u6CE1\u3001\u53D1\u9001\u72B6\u6001\u548C\u8F93\u5165\u680F\uFF0C\u9002\u5408\u6F14\u793A\u6C9F\u901A\u6D41\u7A0B\u3002", { name: "\u9648\u8001\u5E08", initial: "\u9648", date: "\u4ECA\u5929 09:41", messages: [{ from: "them", text: "\u7B2C\u4E00\u6BB5\u7684\u5185\u5BB9\u51C6\u5907\u597D\u4E86\u5417\uFF1F" }, { from: "me", text: "\u8BB2\u7A3F\u548C\u53C2\u8003\u56FE\u90FD\u51C6\u5907\u597D\u4E86\u3002" }, { from: "me", text: "\u6211\u4F1A\u5148\u5F55\u5236\u64CD\u4F5C\uFF0C\u518D\u8865\u4E0A\u56FE\u89E3\u3002" }, { from: "them", text: "\u53EF\u4EE5\uFF0C\u8BB0\u5F97\u5C55\u793A\u6BCF\u4E00\u6B65\u7684\u7ED3\u679C\u3002" }, { from: "me", text: "\u597D\uFF0C\u6211\u4F1A\u628A\u5173\u952E\u4F4D\u7F6E\u653E\u5927\u8BB2\u89E3\u3002" }], draft: "", status: "\u5DF2\u9001\u8FBE" }, (p, h) => phone(p, h, `<div class="am-message-head"><span>${ai(h, "chevron-left", 27)}</span><div><i>${h.esc(p.initial)}</i><b>${h.esc(p.name)} \u203A</b></div>${ai(h, "video", 24)}</div><div class="am-messages"><small>${h.esc(p.date)}</small>${array(p.messages, 8).map((x) => `<article class="${x.from === "me" ? "me" : "them"}" data-motion="item">${h.esc(x.text)}</article>`).join("")}<em>${h.esc(p.status)}</em></div><footer class="am-message-compose">${ai(h, "plus", 27)}<div>${h.esc(p.draft || "iMessage \u4FE1\u606F")}${ai(h, "mic", 17)}</div></footer>`), true),
    component("ios-safari", "iPhone \xB7 Safari \u6D4F\u89C8\u5668", "\u5E95\u90E8\u5730\u5740\u680F\u548C\u6D4F\u89C8\u5668\u64CD\u4F5C\u6761\uFF1B\u652F\u6301\u66FF\u6362\u7F51\u9875\u6B63\u6587\u3002", { url: "docs.example.com", brand: "Studio Docs", title: "\u628A\u590D\u6742\u5185\u5BB9\u8BB2\u6E05\u695A", intro: "\u4E00\u4EFD\u53EF\u590D\u7528\u7684\u5185\u5BB9\u5236\u4F5C\u6307\u5357\u3002", sections: [{ title: "\u5148\u63D0\u51FA\u4E00\u4E2A\u95EE\u9898", detail: "\u7528\u5177\u4F53\u7684\u56F0\u60D1\u5F15\u51FA\u672C\u671F\u5185\u5BB9\u3002" }, { title: "\u5C55\u793A\u771F\u5B9E\u64CD\u4F5C", detail: "\u4FDD\u7559\u5173\u952E\u6B65\u9AA4\u548C\u53EF\u6838\u5BF9\u7684\u7ED3\u679C\u3002" }, { title: "\u7528\u56FE\u89E3\u8865\u5145\u8BF4\u660E", detail: "\u53EA\u8BA9\u9700\u8981\u5F3A\u8C03\u7684\u4FE1\u606F\u53D1\u751F\u53D8\u5316\u3002" }] }, (p, h) => phone(p, h, `<div class="am-safari-site"><header><b>${h.esc(p.brand)}</b>${ai(h, "menu", 21)}</header><small>\u6587\u6863 / \u5236\u4F5C\u6307\u5357</small><h1>${h.esc(p.title)}</h1><p>${h.esc(p.intro)}</p>${array(p.sections, 4).map((s, i) => `<section data-motion="item"><b>0${i + 1}</b><h2>${h.esc(s.title)}</h2><p>${h.esc(s.detail)}</p></section>`).join("")}</div><footer class="am-safari-bottom"><div class="am-safari-url">aA <span>${ai(h, "lock", 11)} ${h.esc(p.url)}</span>${ai(h, "refresh", 18)}</div><nav>${ai(h, "chevron-left", 23)}${ai(h, "chevron-right", 23)}${ai(h, "share", 23)}${ai(h, "file", 23)}${ai(h, "copy", 23)}</nav></footer>`), true),
    component("ios-notes", "iPhone \xB7 \u5907\u5FD8\u5F55", "\u539F\u751F\u5BFC\u822A\u3001\u65E5\u671F\u3001\u6807\u9898\u3001\u6BB5\u843D\u4E0E\u5706\u5F62\u6E05\u5355\u3002", { folder: "\u5DE5\u4F5C", title: "\u7B2C\u4E00\u8282\u8BFE\u7684\u5236\u4F5C\u6E05\u5355", date: "2026\u5E749\u670817\u65E5 09:41", paragraphs: ["\u8FD9\u8282\u8BFE\u5148\u56DE\u7B54\u4E00\u4E2A\u95EE\u9898\uFF1A\u5982\u4F55\u628A\u62BD\u8C61\u6982\u5FF5\u8BB2\u5F97\u5177\u4F53\uFF1F", "\u6BCF\u4E00\u53E5\u8BB2\u89E3\u90FD\u8981\u6709\u5BF9\u5E94\u7684\u753B\u9762\u3002"], checklist: [{ text: "\u786E\u5B9A\u89C2\u4F17\u7684\u95EE\u9898", done: true }, { text: "\u51C6\u5907\u8BB2\u7A3F\u548C\u6765\u6E90", done: true }, { text: "\u5F55\u5236\u771F\u5B9E\u64CD\u4F5C", done: false }, { text: "\u52A0\u5165\u91CD\u70B9\u56FE\u89E3", done: false }, { text: "\u68C0\u67E5\u5B57\u5E55\u548C\u58F0\u97F3", done: false }] }, (p, h) => phone(p, h, `${nav(h, "", p.folder, "\u2022\u2022\u2022")}<article class="am-note"><time>${h.esc(p.date)}</time><h1>${h.esc(p.title)}</h1>${paragraphs(h, p.paragraphs)}${array(p.checklist, 8).map((x) => `<div class="am-check" data-motion="item"><i class="${x.done ? "done" : ""}">${x.done ? "\u2713" : ""}</i>${h.esc(x.text)}</div>`).join("")}</article><footer class="am-note-tools">${ai(h, "check-circle", 23)}${ai(h, "camera", 23)}${ai(h, "edit", 23)}${ai(h, "grid", 23)}</footer>`, "am-note-screen"), true),
    component("ios-control-center", "iPhone \xB7 \u63A7\u5236\u4E2D\u5FC3", "iOS 18 \u63A7\u4EF6\u5206\u7EC4\u3001\u5927\u6ED1\u5757\u3001\u64AD\u653E\u5361\u7247\u4E0E\u5706\u5F62\u5FEB\u6377\u64CD\u4F5C\u3002", { network: "Studio Wi-Fi", track: "\u672A\u5728\u64AD\u653E", focus: "\u4E13\u6CE8\u6A21\u5F0F", brightness: 67, volume: 41 }, (p, h) => phone(p, h, `<div class="am-control-top">${ai(h, "plus", 25)}<span>\u25EF</span></div><div class="am-control-grid"><section class="am-connect"><i class="flight">${ai(h, "airplane", 23)}</i><i class="cell">${ai(h, "phone", 23)}</i><i class="wifi">${ai(h, "wifi", 23)}</i><i class="bluetooth">${ai(h, "bluetooth", 23)}</i></section><section class="am-player"><b>${h.esc(p.track)}</b><div>\u25C0\u25C0 ${ai(h, "play", 27)} \u25B6\u25B6</div><small>${h.esc(p.network)}</small></section><i class="am-control-circle">${ai(h, "rotate", 25)}</i><i class="am-control-circle">${ai(h, "copy", 25)}</i><section class="am-vertical-slider" data-motion="focus"><i style="height:${Math.max(0, Math.min(100, Number(p.brightness)))}%"></i><b>${ai(h, "sun", 29)}</b></section><section class="am-vertical-slider" data-motion="focus"><i style="height:${Math.max(0, Math.min(100, Number(p.volume)))}%"></i><b>${ai(h, "volume", 29)}</b></section><section class="am-control-focus">${ai(h, "moon", 24)}<b>${h.esc(p.focus)}</b><span>\u203A</span></section>${["flash", "clock", "camera", "phone", "mic", "sun", "battery", "settings"].map((x) => `<i class="am-control-circle" data-motion="item">${ai(h, x, 26)}</i>`).join("")}</div>`, "am-control-screen"), true),
    component("ios-share-sheet", "iPhone \xB7 \u5206\u4EAB\u9762\u677F", "\u5185\u5BB9\u6458\u8981\u3001\u5EFA\u8BAE\u8054\u7CFB\u4EBA\u3001\u5E94\u7528\u6A2A\u6392\u548C\u7CFB\u7EDF\u64CD\u4F5C\u5217\u8868\u3002", { title: "\u8BFE\u7A0B\u5236\u4F5C\u6307\u5357.pdf", detail: "PDF \u6587\u7A3F \xB7 1.2 MB", people: ["\u9648\u8001\u5E08", "\u6797\u540C\u5B66", "\u9879\u76EE\u7EC4"], apps: [["airdrop", "\u9694\u7A7A\u6295\u9001"], ["messages", "\u4FE1\u606F"], ["mail", "\u90AE\u4EF6"], ["notes", "\u5907\u5FD8\u5F55"]], actions: ["\u62F7\u8D1D", "\u6DFB\u52A0\u5230\u9605\u8BFB\u5217\u8868", "\u5B58\u50A8\u5230\u201C\u6587\u4EF6\u201D", "\u6253\u5370", "\u6807\u8BB0"] }, (p, h) => phone(p, h, `<div class="am-share-context"><h2>\u8BFE\u7A0B\u5236\u4F5C\u6307\u5357</h2><p>\u8BB2\u7A3F\u3001\u7D20\u6750\u548C\u56FE\u89E3\u9700\u8981\u4E00\u8D77\u6838\u5BF9\u3002</p></div><div class="am-share-sheet"><div class="am-grabber"></div><header>${appIcon(h, "preview", 42)}<div><b>${h.esc(p.title)}</b><small>${h.esc(p.detail)}</small></div><i>\xD7</i></header><div class="am-share-people">${array(p.people, 4).map((x, i) => `<div data-motion="item"><b style="background:${["#82a6c7", "#b0a3c8", "#99b9ac"][i % 3]}">${h.esc(x[0])}</b><small>${h.esc(x)}</small></div>`).join("")}</div><div class="am-share-apps">${array(p.apps, 4).map((x) => `<div>${x[0] === "airdrop" ? `<i>${ai(h, "airdrop", 33)}</i>` : appIcon(h, x[0], 49)}<small>${h.esc(x[1])}</small></div>`).join("")}</div><section class="am-group">${array(p.actions, 6).map((x, i) => `<div class="am-share-action" data-motion="item">${h.esc(x)}${ai(h, ["copy", "file", "folder", "download", "edit"][i % 5], 20)}</div>`).join("")}</section></div>`, "am-share-screen"), true),
    component("ipad-split-view", "iPad \xB7 \u5206\u5C4F\u5DE5\u4F5C\u53F0", "iPadOS 18 \u5206\u5C4F Safari \u4E0E\u5907\u5FD8\u5F55\uFF0C\u4FDD\u7559\u5206\u9694\u6761\u548C\u5404\u81EA\u5DE5\u5177\u680F\u3002", { url: "docs.example.com", webTitle: "\u4E00\u8282\u8BFE\u7684\u5185\u5BB9\u7ED3\u6784", webIntro: "\u4ECE\u95EE\u9898\u5F00\u59CB\uFF0C\u4EE5\u53EF\u9A8C\u8BC1\u7684\u7ED3\u679C\u7ED3\u675F\u3002", sections: [["\u63D0\u51FA\u95EE\u9898", "\u89C2\u4F17\u4E3A\u4EC0\u4E48\u9700\u8981\u8FD9\u8282\u8BFE\uFF1F"], ["\u6F14\u793A\u65B9\u6CD5", "\u9010\u6B65\u5C55\u793A\u64CD\u4F5C\u548C\u5224\u65AD\u4F9D\u636E\u3002"], ["\u9A8C\u8BC1\u7ED3\u679C", "\u7528\u5BF9\u7167\u753B\u9762\u56DE\u987E\u53D8\u5316\u3002"]], noteTitle: "\u8BFE\u7A0B\u7B14\u8BB0", notes: ["\u5F00\u5934\uFF1A\u7ED9\u89C2\u4F17\u4E00\u4E2A\u5177\u4F53\u7684\u95EE\u9898\u3002", "\u6B63\u6587\uFF1A\u6BCF\u4E00\u6B65\u53EA\u5F3A\u8C03\u4E00\u4EF6\u4E8B\u3002", "\u7ED3\u5C3E\uFF1A\u5C55\u793A\u524D\u540E\u5BF9\u7167\uFF0C\u7ED9\u51FA\u4E0B\u4E00\u6B65\u3002"] }, (p, h) => pad(h, `<div class="am-pad-split"><section class="am-pad-browser"><div class="am-pad-multi">\u2022\u2022\u2022</div><nav>${ai(h, "panel")}${ai(h, "chevron-left")}${ai(h, "chevron-right")}<span>${ai(h, "lock", 12)} ${h.esc(p.url)}</span>${ai(h, "share")}${ai(h, "plus")}</nav><article><small>Studio Docs / \u5185\u5BB9\u8BBE\u8BA1</small><h1>${h.esc(p.webTitle)}</h1><p>${h.esc(p.webIntro)}</p>${array(p.sections, 5).map((s, i) => `<section data-motion="item"><b>0${i + 1}</b><h2>${h.esc(s[0])}</h2><p>${h.esc(s[1])}</p></section>`).join("")}</article></section><div class="am-pad-divider"><i></i></div><section class="am-pad-note"><div class="am-pad-multi">\u2022\u2022\u2022</div><nav>${ai(h, "panel")}<span></span>${ai(h, "share")}${ai(h, "edit")}</nav><article><small>2026\u5E749\u670817\u65E5 09:41</small><h1>${h.esc(p.noteTitle)}</h1>${array(p.notes, 7).map((x) => `<p data-motion="item">${h.esc(x)}</p>`).join("")}<div class="am-pad-note-check">\u25CB\u3000\u5F55\u5C4F\u65F6\u653E\u5927\u5173\u952E\u533A\u57DF</div><div class="am-pad-note-check">\u25CB\u3000\u6838\u5BF9\u5F15\u7528\u548C\u6570\u636E\u6765\u6E90</div></article></section></div>`), true),
    component("ipad-files", "iPad \xB7 \u6587\u4EF6 App", "iPad \u539F\u751F\u4FA7\u680F\u3001\u6D4F\u89C8\u5BFC\u822A\u3001\u6587\u4EF6\u7F29\u7565\u56FE\u4E0E\u9009\u62E9\u6A21\u5F0F\u3002", { folder: "\u89C6\u9891\u5236\u4F5C", location: "iCloud \u4E91\u76D8", files: [{ name: "\u8BB2\u7A3F", type: "folder", detail: "4 \u4E2A\u9879\u76EE" }, { name: "\u5F55\u5C4F\u7D20\u6750", type: "folder", detail: "8 \u4E2A\u9879\u76EE" }, { name: "\u8BFE\u7A0B\u8BA1\u5212.pdf", type: "file", detail: "1.2 MB" }, { name: "\u5206\u955C\u6E05\u5355.csv", type: "file", detail: "8 KB" }, { name: "\u53C2\u8003\u8D44\u6599", type: "folder", detail: "6 \u4E2A\u9879\u76EE" }, { name: "\u65C1\u767D.wav", type: "music", detail: "24 MB" }, { name: "README.md", type: "file", detail: "4 KB" }, { name: "\u64CD\u4F5C\u6F14\u793A.mov", type: "video", detail: "86 MB" }] }, (p, h) => pad(h, `<div class="am-files"><aside><h1>\u6D4F\u89C8</h1><label>\u4F4D\u7F6E</label>${["\u6211\u7684 iPad", "iCloud \u4E91\u76D8", "\u4E0B\u8F7D", "\u6700\u8FD1\u5220\u9664"].map((x, i) => `<p class="${x === p.location ? "active" : ""}">${ai(h, ["phone", "folder", "download", "trash"][i], 21)}${x}</p>`).join("")}<label>\u4E2A\u4EBA\u6536\u85CF</label><p>${ai(h, "folder", 21)} \u89C6\u9891\u5236\u4F5C</p><label>\u6807\u7B7E</label>${["\u5DE5\u4F5C", "\u4E2A\u4EBA", "\u5F85\u5904\u7406"].map((x, i) => `<p><i style="background:${["#e56962", "#edb749", "#82baa7"][i]}"></i>${x}</p>`).join("")}</aside><main><nav><span>${ai(h, "chevron-left", 21)} ${h.esc(p.location)}</span><b>${h.esc(p.folder)}</b><span>\u9009\u62E9\u3000\u2022\u2022\u2022</span></nav><div class="am-search">${ai(h, "search", 15)} \u641C\u7D22</div><div class="am-file-controls">\u6309\u540D\u79F0\u3000\u2304<span>${ai(h, "grid", 19)}</span></div><div class="am-files-grid">${array(p.files, 12).map((f) => `<div data-motion="item"><i class="${f.type === "folder" ? "folder" : "document"}">${ai(h, f.type, 57)}</i><b>${h.esc(f.name)}</b><small>${h.esc(f.detail)}</small></div>`).join("")}</div><footer>${array(p.files).length} \u4E2A\u9879\u76EE</footer></main></div>`), true)
  ];

  // families/broll-graphics.mjs
  var reference4 = {
    basis: "\u539F\u521B\u684C\u9762\u7269\u4EF6\u63D2\u955C\uFF0C\u7EB8\u5F20\u3001\u4FBF\u7B7E\u548C\u7F16\u8F91\u75D5\u8FF9\u5747\u7531\u539F\u751F HTML/CSS/SVG \u7ED8\u5236\uFF1B\u4E0D\u662F\u8F6F\u4EF6\u622A\u56FE\u6216\u5B9E\u9645\u4E1A\u52A1\u8BB0\u5F55\u3002",
    source: "reports/broll-graphics-notes.md",
    level: "designed"
  };
  var list = (value, limit) => Array.isArray(value) ? value.slice(0, limit).filter((x) => x && typeof x === "object") : [];
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
    reference: { ...reference4 },
    render(props, helpers2) {
      return render({ ...defaults3, ...props }, helpers2);
    }
  });
  var desk = (id, content2) => '<section class="brg-desk brg-' + id + '"><div class="brg-light" aria-hidden="true"></div>' + content2 + "</section>";
  var components14 = [
    create2("broll-brief-desk", "\u684C\u9762\u4FBF\u7B7E \xB7 \u8865\u9F50\u8981\u6C42", "\u4FEF\u62CD\u7EB8\u5F20\u4E0E\u56DB\u5F20\u4FBF\u7B7E\uFF0C\u628A\u6A21\u7CCA\u4EFB\u52A1\u8865\u6210\u5BF9\u8C61\u3001\u4EFB\u52A1\u3001\u65F6\u95F4\u548C\u5165\u53E3\uFF1B\u6240\u6709\u6B63\u6587\u53EF\u7F16\u8F91\u3002", {
      documentLabel: "\u5DE5\u4F5C\u624B\u8BB0 / 01",
      title: "\u672C\u5468\u8FDB\u5EA6\u6536\u96C6",
      originalLabel: "\u6700\u521D\u7684\u4E00\u53E5\u8BDD",
      original: "\u63D0\u9192\u5927\u5BB6\u4EA4\u8FDB\u5EA6\uFF0C\u6B63\u5F0F\u4E00\u70B9\u3002",
      marginNote: "\u8FD8\u7F3A\u54EA\u4E9B\u4FE1\u606F\uFF1F",
      checklistLabel: "\u53D1\u51FA\u524D\uFF0C\u9010\u9879\u5BF9\u7167",
      checklist: ["\u8C01\u6765\u4EA4", "\u4EA4\u4EC0\u4E48", "\u51E0\u70B9\u524D", "\u5728\u54EA\u513F\u586B"],
      documentNote: "\u7AD9\u5728\u6536\u5230\u901A\u77E5\u7684\u4EBA\u90A3\u8FB9\uFF0C\u518D\u8BFB\u4E00\u904D\u3002",
      notes: [
        { label: "\u5BF9\u8C61", value: "\u5404\u7EC4\u8D1F\u8D23\u4EBA", detail: "\u8BA9\u8BE5\u884C\u52A8\u7684\u4EBA\u770B\u5F97\u89C1", tone: "blue" },
        { label: "\u4EFB\u52A1", value: "\u672C\u5468\u5B8C\u6210\u60C5\u51B5", detail: "\u5DF2\u5B8C\u6210 + \u672A\u5B8C\u6210\u4E8B\u9879", tone: "mint" },
        { label: "\u65F6\u95F4", value: "\u5468\u4E94 17:00 \u524D", detail: "\u7ED9\u51FA\u660E\u786E\u622A\u6B62\u65F6\u95F4", tone: "cream" },
        { label: "\u5165\u53E3", value: "\u5171\u4EAB\u8868\u683C", detail: "\u968F\u901A\u77E5\u9644\u4E0A\u94FE\u63A5", tone: "blue" }
      ]
    }, (p, h) => {
      const e = h.esc;
      return desk("brief", '<div class="brg-brief-paper-wrap" data-motion="item" data-broll-part="paper"><article class="brg-paper brg-brief-paper">' + clip + '<div class="brg-paper-meta">' + e(p.documentLabel) + "</div><h2>" + e(p.title) + '</h2><div class="brg-original"><small>' + e(p.originalLabel) + "</small><p>" + e(p.original) + '</p><svg class="brg-underline" viewBox="0 0 430 24" aria-hidden="true"><path data-motion="line" d="M6 10Q144 2 422 11M40 18Q241 7 382 17" fill="none" stroke="#d98371" stroke-width="2.2" stroke-linecap="round"/></svg></div><div class="brg-margin-note" data-motion="emphasis" data-broll-part="mark">' + e(p.marginNote) + '</div><div class="brg-checklist-title">' + e(p.checklistLabel) + '</div><div class="brg-paper-checks">' + textList(p.checklist, 4).map((x) => '<div><span data-motion="reveal" data-broll-part="tick">' + tick + "</span><p>" + e(x) + "</p></div>").join("") + '</div><p class="brg-document-note">' + e(p.documentNote) + "</p>" + corner + '</article></div><div class="brg-notes-grid">' + list(p.notes, 4).map((x, i) => '<div class="brg-note-wrap brg-note-slot-' + i + '" data-motion="item" data-broll-part="note"><article class="brg-sticky brg-tone-' + tone2(x.tone, i) + '"><i class="brg-tape" aria-hidden="true"></i><div class="brg-sticky-top"><span>' + e(x.label) + "</span><small>" + String(i + 1).padStart(2, "0") + "</small></div><strong>" + e(x.value) + "</strong><p>" + e(x.detail) + "</p></article></div>").join("") + "</div>" + pencil + '<div class="brg-paperclip" aria-hidden="true"></div>');
    }),
    create2("broll-message-pile", "\u6D88\u606F\u7EB8\u6761 \xB7 \u4ECE\u6A21\u7CCA\u5230\u660E\u786E", "\u62BD\u8C61\u6D88\u606F\u7EB8\u6761\u5806\u79EF\u5728\u684C\u4E0A\uFF0C\u95EE\u9898\u6807\u7B7E\u4E0E\u53F3\u4FA7\u660E\u786E\u901A\u77E5\u5F62\u6210\u5BF9\u7167\uFF1B\u4E0D\u4EFF\u5192\u4EFB\u4F55\u8F6F\u4EF6\u754C\u9762\u3002", {
      trayLabel: "\u5F85\u7406\u6E05\u7684\u6D88\u606F",
      clearLabel: "\u8865\u5145\u540E\u7684\u901A\u77E5",
      clearTitle: "\u672C\u5468\u8FDB\u5EA6\uFF0C\u6309\u8FD9\u4EFD\u4EA4",
      messages: [
        { author: "\u7B2C\u4E00\u53E5", text: "\u63D0\u9192\u5927\u5BB6\u4EA4\u8FDB\u5EA6\uFF0C\u6B63\u5F0F\u4E00\u70B9\u3002", question: "\u8C01\u6765\u4EA4\uFF1F", tone: "blue" },
        { author: "\u518D\u8865\u4E00\u53E5", text: "\u5199\u5177\u4F53\u4E00\u70B9\uFF0C\u5C3D\u5FEB\u4EA4\u3002", question: "\u51E0\u70B9\u524D\uFF1F", tone: "cream" },
        { author: "\u6536\u5230\u540E", text: "\u6536\u5230\u3002\u5177\u4F53\u586B\u5728\u54EA\u91CC\uFF1F", question: "\u5165\u53E3\u5462\uFF1F", tone: "coral" }
      ],
      fields: [{ label: "\u5BF9\u8C61", value: "\u5404\u7EC4\u8D1F\u8D23\u4EBA" }, { label: "\u5185\u5BB9", value: "\u672C\u5468\u5B8C\u6210 / \u672A\u5B8C\u6210\u4E8B\u9879" }, { label: "\u622A\u6B62", value: "\u5468\u4E94 17:00 \u524D" }, { label: "\u63D0\u4EA4", value: "\u5171\u4EAB\u8868\u683C\uFF08\u9644\u94FE\u63A5\uFF09" }],
      resultNote: "\u4E00\u5F20\u7EB8\uFF0C\u5C31\u80FD\u627E\u5230\u4E0B\u4E00\u6B65\u3002",
      indexLabel: "\u6574\u7406 / 02"
    }, (p, h) => {
      const e = h.esc;
      return desk("messages", '<div class="brg-message-backboard"><div class="brg-tray-label">' + e(p.trayLabel) + '</div><div class="brg-grid-paper" aria-hidden="true"></div></div><div class="brg-message-pile">' + list(p.messages, 3).map((x, i) => '<div class="brg-message-wrap brg-message-slot-' + i + '" data-motion="item" data-broll-part="message"><article class="brg-message-slip brg-tone-' + tone2(x.tone, i) + '"><div class="brg-slip-meta"><span>' + e(x.author) + "</span><small>" + String(i + 1).padStart(2, "0") + "</small></div><p>" + e(x.text) + '</p><span class="brg-question" data-motion="emphasis" data-broll-part="mark">' + e(x.question) + "</span></article></div>").join("") + '</div><svg class="brg-sort-arrow" viewBox="0 0 146 130" aria-hidden="true"><path data-motion="line" d="M9 94C59 90 48 24 121 31M104 14l20 17-19 18" fill="none" stroke="#8b9f91" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 8"/></svg><div class="brg-clear-paper-wrap" data-motion="reveal" data-broll-part="paper"><article class="brg-paper brg-clear-paper"><div class="brg-green-tab">' + e(p.clearLabel) + '</div><div class="brg-paper-meta">' + e(p.indexLabel) + "</div><h2>" + e(p.clearTitle) + '</h2><div class="brg-clear-fields">' + list(p.fields, 4).map((x) => '<div data-motion="item"><span>' + e(x.label) + "</span><strong>" + e(x.value) + '</strong><i data-motion="reveal" data-broll-part="tick">' + tick + "</i></div>").join("") + '</div><p class="brg-clear-note">' + e(p.resultNote) + "</p>" + corner + '</article></div><div class="brg-message-clip brg-paperclip" aria-hidden="true"></div>');
    }),
    create2("broll-revision-stack", "\u7A3F\u7EB8\u53E0\u5C42 \xB7 \u4FEE\u6539\u4E0E\u6838\u5BF9", "\u4E09\u7248\u7A3F\u7EB8\u548C\u84DD\u8272\u6807\u6CE8\u5448\u73B0\u9010\u6B21\u4FEE\u8BA2\uFF0C\u6700\u65B0\u4E00\u9875\u5F62\u6210\u53EF\u6838\u5BF9\u6E05\u5355\uFF1B\u7248\u672C\u3001\u7F3A\u53E3\u3001\u6B63\u6587\u5747\u53EF\u66FF\u6362\u3002", {
      earlier: [
        { version: "v1", label: "\u5148\u5199\u51FA\u6765", title: "\u8BF7\u4EA4\u8FDB\u5EA6", lines: ["\u8BF7\u5404\u4F4D\u79EF\u6781\u914D\u5408\u3002", "\u53CA\u65F6\u63D0\u4EA4\u76F8\u5173\u6750\u6599\u3002"], gap: "\u7F3A\u5C11\u5BF9\u8C61", note: "\u8C01\u6765\u4EA4\uFF1F" },
        { version: "v2", label: "\u628A\u4FE1\u606F\u8865\u4E0A", title: "\u5404\u7EC4\u8D1F\u8D23\u4EBA", lines: ["\u5468\u4E94 17:00 \u524D\u3002", "\u586B\u62A5\u672C\u5468\u5B8C\u6210\u60C5\u51B5\u3002"], gap: "\u8FD8\u7F3A\u5165\u53E3", note: "\u5F80\u54EA\u513F\u586B\uFF1F" }
      ],
      latestVersion: "v3",
      latestLabel: "\u5BF9\u7167\u8981\u6C42\u518D\u770B\u4E00\u904D",
      latestTitle: "\u4EA4\u4EE3\u6E05\u695A\uFF0C\u518D\u53D1\u51FA",
      checks: [{ label: "\u5BF9\u8C61", value: "\u5404\u7EC4\u8D1F\u8D23\u4EBA" }, { label: "\u5185\u5BB9", value: "\u5DF2\u5B8C\u6210 / \u672A\u5B8C\u6210" }, { label: "\u622A\u6B62", value: "\u5468\u4E94 17:00 \u524D" }, { label: "\u5165\u53E3", value: "\u5171\u4EAB\u8868\u683C\u94FE\u63A5" }],
      stamp: "\u5DF2\u6838\u5BF9",
      bottomNote: "\u4FEE\u6539\u6709\u4F9D\u636E\uFF0C\u68C0\u67E5\u4E5F\u6709\u4F9D\u636E\u3002"
    }, (p, h) => {
      const e = h.esc;
      return desk("revisions", '<div class="brg-revision-shadow" aria-hidden="true"></div>' + list(p.earlier, 2).map((x, i) => '<div class="brg-revision-wrap brg-old-revision brg-revision-' + i + '" data-motion="item" data-broll-part="paper"><article class="brg-paper brg-revision-paper"><div class="brg-version">' + e(x.version) + "</div><small>" + e(x.label) + "</small><h2>" + e(x.title) + '</h2><div class="brg-draft-lines">' + textList(x.lines, 3).map((line3) => "<p>" + e(line3) + "</p>").join("") + '</div><div class="brg-red-gap" data-motion="emphasis" data-broll-part="mark"><span>' + e(x.gap) + '</span><svg viewBox="0 0 260 63" aria-hidden="true"><path data-motion="line" d="M243 17C198-1 38-3 15 26S78 60 162 55 259 36 244 20C220 8 190 4 169 7" fill="none" stroke="#cb8271" stroke-width="2.1" stroke-linecap="round"/></svg></div><p class="brg-red-note">' + e(x.note) + '</p><div class="brg-ruled-filler" aria-hidden="true"></div>' + corner + "</article></div>").join("") + '<div class="brg-revision-wrap brg-latest-revision" data-motion="reveal" data-broll-part="paper"><article class="brg-paper brg-revision-paper"><div class="brg-version brg-version-final">' + e(p.latestVersion) + "</div><small>" + e(p.latestLabel) + "</small><h2>" + e(p.latestTitle) + '</h2><div class="brg-revision-checks">' + list(p.checks, 4).map((x) => '<div><span data-motion="reveal" data-broll-part="tick">' + tick + "</span><p><small>" + e(x.label) + "</small><strong>" + e(x.value) + "</strong></p></div>").join("") + '</div><span class="brg-stamp" data-motion="emphasis" data-broll-part="mark">' + e(p.stamp) + "</span>" + corner + '</article></div><div class="brg-revision-bottom" data-motion="reveal">' + e(p.bottomNote) + '</div><div class="brg-red-pencil">' + pencil + "</div>");
    })
  ];

  // families/broll-media.mjs
  var reference5 = { level: "designed", basis: "\u539F\u521B B-roll \u7F16\u6392\uFF1B\u793A\u4F8B\u7167\u7247\u4E0E\u89C6\u9891\u4E3A\u8BB8\u53EF\u660E\u786E\u7684\u7D20\u6750\uFF0C\u6765\u6E90\u89C1 assets/broll/CREDITS.md\u3002\u4E0D\u662F\u672C\u671F\u771F\u5B9E\u5DE5\u4F5C\u8BB0\u5F55\u3002", source: "assets/broll/CREDITS.md" };
  var clamp = (v, min, max, d) => Number.isFinite(Number(v)) ? Math.min(max, Math.max(min, Number(v))) : d;
  var array2 = (v, max = 5) => Array.isArray(v) ? v.slice(0, max) : [];
  function local(value) {
    const path = String(value || "").replaceAll("\\", "/");
    if (!path || /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(path) || /[\u0000-\u001f]/.test(path)) throw Error("B-roll \u7D20\u6750\u5FC5\u987B\u4F7F\u7528\u5DE5\u7A0B\u5185\u76F8\u5BF9\u8DEF\u5F84");
    for (const part of path.split("/")) {
      let decoded = part;
      try {
        decoded = decodeURIComponent(part);
      } catch {
      }
      if (decoded === ".." || decoded === "." || decoded.includes("/") || decoded.includes("\\")) throw Error("B-roll \u7D20\u6750\u8DEF\u5F84\u4E0D\u5F97\u8D8A\u8FC7\u5DE5\u7A0B\u76EE\u5F55");
    }
    return path;
  }
  function media(m, h, suffix = "media") {
    const src = h.esc(local(m.src || m.mediaSrc)), x = clamp(m.x, 0, 100, 50), y = clamp(m.y, 0, 100, 50), style = `object-position:${x}% ${y}%`, label2 = h.esc(m.alt || "\u53EF\u66FF\u6362 B-roll \u7D20\u6750");
    return m.type === "video" ? `<video id="${h.uid(suffix)}" class="brm-asset" src="${src}" muted playsinline preload="auto" data-media-start="${clamp(m.mediaStart, 0, 86400, 0)}" data-volume="0" aria-label="${label2}" style="${style}"></video>` : `<img class="brm-asset" src="${src}" alt="${label2}" style="${style}">`;
  }
  function tag(text6, h) {
    return text6 ? `<span class="brm-tag">${h.esc(text6)}</span>` : "";
  }
  var components15 = [
    {
      id: "broll-cutaway",
      name: "B-roll \xB7 \u5B9E\u666F\u5207\u955C",
      category: "B-roll \xB7 \u771F\u5B9E\u7D20\u6750",
      description: "\u8BA9\u771F\u5B9E\u529E\u516C\u955C\u5934\u77ED\u6682\u63A5\u7BA1\u753B\u9762\uFF0C\u5B57\u5E55\u677F\u3001\u53D6\u666F\u4F4D\u7F6E\u4E0E\u7167\u7247/\u89C6\u9891\u5747\u53EF\u66FF\u6362\u3002\u9002\u5408\u201C\u5F00\u59CB\u64CD\u4F5C\u3001\u7B49\u5F85\u3001\u6838\u5BF9\u201D\u65C1\u767D\u3002",
      width: 1280,
      height: 800,
      reference: reference5,
      defaults: { eyebrow: "\u5DE5\u4F5C\u4E2D\u7684\u4E00\u4E2A\u77AC\u95F4", title: "\u5148\u628A\u8981\u6C42\u8BF4\u6E05\u695A", caption: "\u52A8\u624B\u4E4B\u524D\uFF0C\u628A\u5BF9\u8C61\u3001\u5185\u5BB9\u548C\u65F6\u95F4\u5199\u4E0B\u6765\u3002", mediaSrc: "assets/broll/office.mp4", mediaType: "video", mediaAlt: "\u529E\u516C\u684C\u524D\u4F7F\u7528\u952E\u76D8\u7684\u5B9E\u62CD\u7D20\u6750", mediaX: 50, mediaY: 50, mediaStart: 0, showCaption: true, tag: "\u65E5\u5E38\u5DE5\u4F5C" },
      render(props, h) {
        const p = { ...this.defaults, ...props };
        return `<section class="brm-scene brm-cutaway"><div class="brm-shot-window"><div class="brm-shot-motion" data-broll-part="camera" data-motion="focus">${media({ src: p.mediaSrc, type: p.mediaType, alt: p.mediaAlt, x: p.mediaX, y: p.mediaY, mediaStart: p.mediaStart }, h)}</div></div><div class="brm-cutaway-top"><span>${h.esc(p.eyebrow)}</span>${tag(p.tag, h)}</div>${p.showCaption ? `<div class="brm-caption" data-broll-part="caption" data-motion="reveal"><div class="brm-rule"></div><h2>${h.esc(p.title)}</h2><p>${h.esc(p.caption)}</p></div>` : ""}</section>`;
      }
    },
    {
      id: "broll-sequence",
      name: "B-roll \xB7 \u4E09\u955C\u5934\u7EC4\u63A5",
      category: "B-roll \xB7 \u771F\u5B9E\u7D20\u6750",
      description: "\u540C\u4E00\u4EF6\u4E8B\u7684\u51C6\u5907\u3001\u64CD\u4F5C\u3001\u4EA4\u6D41\u4E09\u4E2A\u89C2\u5BDF\u89D2\u5EA6\u3002\u72EC\u7ACB\u7D20\u6750\u69FD\u53EF\u7528\u7167\u7247\u6216\u89C6\u9891\uFF0C\u9002\u5408\u627F\u63A5\u8FC7\u7A0B\u3001\u5BF9\u6BD4\u4E0E\u5F52\u7EB3\u3002",
      width: 1280,
      height: 800,
      reference: reference5,
      defaults: { eyebrow: "\u4ECE\u60F3\u6CD5\u5230\u884C\u52A8", title: "\u5199\u4E0B\u6765\uFF0C\u505A\u4E00\u904D\uFF0C\u518D\u6838\u5BF9", caption: "\u540C\u4E00\u4E2A\u76EE\u6807\uFF0C\u53EF\u4EE5\u4ECE\u4E0D\u540C\u89D2\u5EA6\u89C2\u5BDF\u3002", media: [{ src: "assets/broll/planning.jpg", type: "image", alt: "\u7EB8\u4E0A\u8BB0\u5F55\u8BA1\u5212", label: "\u5148\u7406\u6E05", detail: "\u628A\u8981\u6C42\u5199\u4E0B\u6765", x: 50, y: 50 }, { src: "assets/broll/keyboard.jpg", type: "image", alt: "\u952E\u76D8\u64CD\u4F5C", label: "\u518D\u52A8\u624B", detail: "\u5B8C\u6210\u4E00\u6B21\u64CD\u4F5C", x: 50, y: 50 }, { src: "assets/broll/teamwork.jpg", type: "image", alt: "\u56E2\u961F\u534F\u4F5C\u8BA8\u8BBA", label: "\u518D\u6838\u5BF9", detail: "\u5BF9\u7167\u7ED3\u679C\u770B\u4E00\u904D", x: 50, y: 50 }] },
      render(props, h) {
        const p = { ...this.defaults, ...props }, shots = array2(p.media, 3);
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
      defaults: { eyebrow: "\u505C\u4E0B\u6765\uFF0C\u770B\u4E00\u4E2A\u7EC6\u8282", title: "\u8981\u6C42\u843D\u5728\u7EB8\u4E0A\uFF0C\u624D\u65B9\u4FBF\u6838\u5BF9", mediaSrc: "assets/broll/planning.jpg", mediaType: "image", mediaAlt: "\u5DE5\u4F5C\u8BA1\u5212\u4E0E\u7B14\u8BB0\u7684\u5B9E\u62CD\u7D20\u6750", mediaX: 50, mediaY: 50, focusX: 70, focusY: 56, focusWidth: 31, focusHeight: 47, focusLabel: "\u5148\u628A\u8981\u6C42\u5199\u4E0B\u6765", notes: [{ label: "\u5BF9\u8C61", text: "\u8FD9\u4EF6\u4E8B\u8F6E\u5230\u8C01\u505A\uFF1F" }, { label: "\u52A8\u4F5C", text: "\u5177\u4F53\u8981\u5B8C\u6210\u4EC0\u4E48\uFF1F" }, { label: "\u68C0\u67E5", text: "\u62FF\u4EC0\u4E48\u5224\u65AD\u505A\u5BF9\u4E86\uFF1F" }], footer: "\u65C1\u767D\u63D0\u793A \xB7 \u53EF\u66FF\u6362\u4E3A\u81EA\u5DF1\u7684\u89C2\u5BDF" },
      render(props, h) {
        const p = { ...this.defaults, ...props }, w = clamp(p.focusWidth, 10, 75, 30), ht = clamp(p.focusHeight, 10, 65, 30), x = clamp(p.focusX, w / 2, 100 - w / 2, 45), y = clamp(p.focusY, ht / 2, 100 - ht / 2, 48);
        return `<section class="brm-scene brm-detail"><header class="brm-editorial-head"><span>${h.esc(p.eyebrow)}</span><span>DETAIL / 01</span></header><div class="brm-detail-layout"><div class="brm-detail-image"><div class="brm-shot-motion" data-broll-part="camera">${media({ src: p.mediaSrc, type: p.mediaType, alt: p.mediaAlt, x: p.mediaX, y: p.mediaY }, h)}</div><div class="brm-focus-box" data-broll-part="focus" data-motion="focus" style="left:${x - w / 2}%;top:${y - ht / 2}%;width:${w}%;height:${ht}%"><i></i><i></i><i></i><i></i></div><div class="brm-focus-label" data-broll-part="caption">${h.esc(p.focusLabel)}</div></div><aside class="brm-observation"><h2>${h.esc(p.title)}</h2>${array2(p.notes, 3).map((n3, i) => `<div class="brm-note" data-broll-part="note" data-motion="item"><span>0${i + 1} / ${h.esc(n3.label)}</span><p>${h.esc(n3.text)}</p></div>`).join("")}<small>${h.esc(p.footer)}</small></aside></div></section>`;
      }
    }
  ];

  // families/codex-workflow.mjs
  var array3 = (value) => Array.isArray(value) ? value : [];
  var object = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
  var state = (value) => ["idle", "queued", "running", "complete", "error"].includes(value) ? value : "complete";
  var number3 = (value, fallback, min, max) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Number(value))) : fallback;
  var icon2 = (h, name, size = 16) => h.icon(name, size);
  function attachments(items, h, where) {
    return array3(items).length ? `<div class="cxw-attachments" data-part="${where}-attachments">${array3(items).map((entry, index) => {
      const item = typeof entry === "string" ? { name: entry } : object(entry);
      return `<div class="cxw-attachment" data-attachment-id="${h.esc(item.id || `${where}-${index}`)}" data-motion="item">${icon2(h, "file", 19)}<span><b>${h.esc(item.name || "\u6587\u4EF6")}</b>${item.detail ? `<small>${h.esc(item.detail)}</small>` : ""}</span></div>`;
    }).join("")}</div>` : "";
  }
  function teachingTable(value, h) {
    const p = object(value), columns = array3(p.columns), rows2 = array3(p.rows);
    const selected = new Set(array3(p.selectedIds).map(String)), included = new Set(array3(p.includedIds).map(String));
    return `<section class="cxw-table-result" data-part="teaching-table" data-state="${h.esc(state(p.state))}">
    <div class="cxw-table-heading"><strong>${h.esc(p.title || "\u8BA2\u5355\u6837\u672C\u660E\u7EC6")}</strong><span>${h.esc(p.badge || "\u6559\u5B66\u6570\u636E")}</span></div>
    ${p.note ? `<p class="cxw-table-note">${h.esc(p.note)}</p>` : ""}
    <div class="cxw-table-viewport"><table><thead><tr>${columns.map((c) => `<th scope="col" data-field="${h.esc(c.key)}">${h.esc(c.label || c.key)}</th>`).join("")}</tr></thead><tbody>${rows2.map((row, index) => {
      const id = String(row.id ?? row.orderId ?? index), isIncluded = included.has(id), isSelected = selected.has(id);
      return `<tr data-row-id="${h.esc(id)}" data-included="${isIncluded}" data-selected="${isSelected}" class="${isSelected ? "cxw-row-selected" : ""}" data-motion="item">${columns.map((c) => `<td data-field="${h.esc(c.key)}" data-motion="highlight">${h.esc(row[c.key] ?? "\u2014")}</td>`).join("")}</tr>`;
    }).join("")}</tbody></table></div>
    ${p.summary ? `<div class="cxw-table-summary" data-part="table-summary">${h.esc(p.summary)}</div>` : ""}
    <small class="cxw-table-disclosure">${h.esc(p.disclosure || "\u53EF\u7F16\u8F91\u6559\u5B66\u5185\u5BB9\uFF1B\u4E0D\u662F Codex \u4E13\u7528\u7EDF\u8BA1\u754C\u9762")}</small>
  </section>`;
  }
  function toolEvents(events, h) {
    return array3(events).map((value, index) => {
      const e = object(value), s = state(e.state || e.status), kind = e.kind === "file" ? "file" : "command";
      return `<div class="cxw-tool-event cxw-tool-${kind}" data-tool-id="${h.esc(e.id || `event-${index}`)}" data-state="${h.esc(s)}" data-motion="item">
      <div class="cxw-tool-icon">${icon2(h, kind === "file" ? "file" : "terminal", 18)}</div>
      <div class="cxw-tool-copy"><div>${h.esc(e.label || e.summary || (kind === "file" ? "\u5DF2\u751F\u6210\u6587\u4EF6" : "\u5DF2\u8FD0\u884C\u547D\u4EE4"))}</div>${e.command ? `<code>${h.esc(e.command)}</code>` : ""}${e.detail ? `<small>${h.esc(e.detail)}</small>` : ""}</div>
      ${e.action ? `<span class="cxw-tool-action">${h.esc(e.action)}${icon2(h, "chevron-right", 12)}</span>` : icon2(h, "chevron-down", 12)}
    </div>`;
    }).join("");
  }
  function message(value, index, h) {
    const m = object(value), role = m.role === "user" ? "user" : "assistant", id = m.id || `message-${index}`, s = state(m.state);
    const paragraphs2 = Array.isArray(m.text) ? m.text : [m.text || ""];
    return `<article class="cxw-message cxw-${role}" data-message-id="${h.esc(id)}" data-role="${role}" data-state="${h.esc(s)}" data-motion="item">
    ${role === "assistant" && m.elapsed ? `<div class="cxw-elapsed" data-part="elapsed">${h.esc(m.elapsed)}${icon2(h, "chevron-right", 12)}</div>` : ""}
    <div class="cxw-message-content">${attachments(m.attachments, h, `message-${index}`)}<div class="cxw-message-text" data-part="message-text" data-motion="reveal">${paragraphs2.map((t) => `<p>${h.esc(t)}</p>`).join("")}</div>
      ${array3(m.bullets).length ? `<ul class="cxw-message-list">${m.bullets.map((t) => `<li data-motion="highlight">${h.esc(t)}</li>`).join("")}</ul>` : ""}
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
    <nav>${array3(p.items).map((entry, index) => {
      const item = typeof entry === "string" ? { label: entry } : object(entry);
      return `<div class="cxw-sidebar-item ${item.active ? "cxw-sidebar-active" : ""}" data-sidebar-id="${h.esc(item.id || `sidebar-${index}`)}">${icon2(h, item.icon || "folder", 15)}<span>${h.esc(item.label || "\u4EFB\u52A1")}</span></div>`;
    }).join("")}</nav>
    <div class="cxw-sidebar-bottom">${icon2(h, "settings", 17)}<span>${h.esc(p.footer || "\u6F14\u793A\u5DE5\u4F5C\u533A")}</span></div>
  </aside>`;
  }
  function panel2(value, h) {
    const p = object(value);
    return `<aside class="cxw-preview-panel" data-part="preview-panel"><header><span>${icon2(h, p.kind === "table" ? "grid" : "file", 15)}${h.esc(p.title || "\u6587\u4EF6\u9884\u89C8")}</span><span>${icon2(h, "more", 17)}${icon2(h, "x", 15)}</span></header><div class="cxw-panel-body" data-motion="scroll">${p.kind === "table" ? teachingTable(p.table, h) : `<div class="cxw-document">${p.heading ? `<h3>${h.esc(p.heading)}</h3>` : ""}${array3(p.paragraphs).map((t) => `<p>${h.esc(t)}</p>`).join("")}${p.code ? `<pre>${h.esc(p.code)}</pre>` : ""}</div>`}</div></aside>`;
  }
  var defaults2 = {
    title: "\u7EDF\u8BA1\u672C\u6708\u5DF2\u5B8C\u6210\u8BA2\u5355",
    project: "\u6F14\u793A\u9879\u76EE",
    disclosure: "\u754C\u9762\u590D\u523B \xB7 \u6848\u4F8B\u6F14\u793A",
    showSidebar: true,
    sidebar: { sectionLabel: "\u4EFB\u52A1", items: [{ id: "orders", label: "\u7EDF\u8BA1\u672C\u6708\u5DF2\u5B8C\u6210\u8BA2\u5355", active: true }], footer: "\u6F14\u793A\u5DE5\u4F5C\u533A" },
    messages: [
      { id: "request", role: "user", text: "\u6309\u5B8C\u6210\u65E5\u671F\u7B97\u8FD9\u4E2A\u6708\uFF0C\u53EA\u7EDF\u8BA1\u72B6\u6001\u662F\u5DF2\u5B8C\u6210\u7684\u3002\u628A\u7B97\u8FDB\u53BB\u7684\u8BA2\u5355\u4E5F\u5217\u51FA\u6765\u3002", attachments: [{ name: "orders-sample.csv", detail: "\u6559\u5B66\u6837\u672C \xB7 5 \u6761\u8BB0\u5F55" }] },
      { id: "response", role: "assistant", elapsed: "\u7528\u65F6 2\u520603\u79D2", text: "\u8FD9 5 \u6761\u6837\u672C\u4E2D\uFF0CA01\u3001A02\u3001A03 \u7B26\u5408\u6761\u4EF6\u3002\u5DF2\u53D6\u6D88\u548C\u5F85\u4ED8\u6B3E\u7684\u4E24\u6761\u4E0D\u8BA1\u5165\u3002", toolEvents: [{ id: "read-file", kind: "file", state: "complete", label: "\u5DF2\u8BFB\u53D6 orders-sample.csv", detail: "\u6559\u5B66\u6837\u672C\uFF1B\u6574\u5F20\u8868\u7684\u6708\u5EA6\u603B\u6570\u5C1A\u672A\u63D0\u4F9B\u3002" }] }
    ],
    toolEvents: [],
    composer: { draft: "", placeholder: "\u968F\u5FC3\u8F93\u5165", permission: "\u5B8C\u5168\u8BBF\u95EE", model: "GPT-6 Astra", effort: "Ultra", running: false, attachments: [] },
    panel: null,
    panelWidth: 400
  };
  var components16 = [{
    id: "codex-workflow",
    name: "Codex \u591A\u8F6E\u5DE5\u4F5C\u533A",
    category: "Codex",
    width: 1280,
    height: 800,
    description: "\u4F9D\u636E\u672C\u673A\u754C\u9762\u89C2\u5BDF\u91CD\u5EFA\u7684\u53EF\u7F16\u8F91\u591A\u8F6E\u5DE5\u4F5C\u533A\uFF1B\u652F\u6301\u9644\u4EF6\u3001\u8FD0\u884C\u8BB0\u5F55\u3001\u5E95\u90E8\u8F93\u5165\u533A\u53CA\u53EF\u9009\u6559\u5B66\u6587\u4EF6\u9884\u89C8\u3002",
    reference: { basis: "2026-09-18 \u672C\u673A Codex \u754C\u9762\u89C2\u5BDF\uFF1B\u8F93\u5165\u6846\u6CBF\u7528\u73B0\u6709 measured \u7EC4\u4EF6\u7684\u5B57\u4F53\u3001\u95F4\u8DDD\u4E0E\u63A7\u4EF6\u5F62\u72B6\u3002\u5168\u5DE5\u4F5C\u533A\u53CA\u9884\u89C8\u5185\u5BB9\u672A\u9010\u50CF\u7D20\u9A8C\u6536\u3002", source: "../component-reference/high-fidelity/references/codex-current-window.png", level: "documented" },
    defaults: defaults2,
    render(props, h) {
      const incoming = object(props), p = { ...defaults2, ...incoming, sidebar: { ...defaults2.sidebar, ...object(incoming.sidebar) }, composer: { ...defaults2.composer, ...object(incoming.composer) } };
      const hasPanel = Boolean(p.panel && typeof p.panel === "object"), panelWidth = number3(p.panelWidth, 400, 320, 520);
      return `<section class="cxw-workspace ${p.showSidebar ? "" : "cxw-no-sidebar"} ${hasPanel ? "cxw-has-panel" : ""}" style="--cxw-panel-width:${panelWidth}px" data-part="workspace" data-state="${p.composer.running ? "running" : "idle"}">
      ${p.showSidebar ? sidebar2(p.sidebar, h) : ""}<div class="cxw-main"><header class="cxw-header"><div class="cxw-heading">${icon2(h, "folder", 17)}${p.project ? `<span class="cxw-project">${h.esc(p.project)}</span><span class="cxw-heading-divider">/</span>` : ""}<strong>${h.esc(p.title)}</strong></div><div class="cxw-header-actions">${icon2(h, "more", 18)}<span>${icon2(h, "upload", 15)}\u5206\u4EAB</span>${icon2(h, "panel", 17)}</div></header>
      <div class="cxw-body"><div class="cxw-thread"><div class="cxw-conversation-viewport" data-part="conversation-viewport"><div class="cxw-conversation" data-part="conversation" data-motion="scroll">${array3(p.messages).map((m, i) => message(m, i, h)).join("")}${toolEvents(p.toolEvents, h)}</div></div>${composer(p.composer, h)}<div class="cxw-disclosure" data-part="disclosure">${h.esc(p.disclosure || "\u754C\u9762\u590D\u523B \xB7 \u6848\u4F8B\u6F14\u793A")}</div></div>${hasPanel ? panel2(p.panel, h) : ""}</div></div>
    </section>`;
    }
  }];

  // families/codex.mjs
  var native = { basis: "Windows Codex 26.915.3509.0\uFF1B\u672C\u673A\u771F\u5B9E\u622A\u56FE\u4E0E\u5B89\u88C5\u5305 UI \u5B57\u4F53/\u95F4\u8DDD token", source: "../component-reference/high-fidelity/references/codex-current-window.png", level: "measured" };
  function composer2(p, h) {
    return `<div class="cx-composer" data-motion="focus"><div class="cx-editor ${p.draft ? "cx-has-draft" : ""}" data-motion="type">${h.esc(p.draft || p.placeholder || "\u968F\u5FC3\u8F93\u5165")}</div><div class="cx-composer-footer"><div class="cx-composer-start"><span class="cx-square-icon">${h.icon("plus", 18)}</span><span class="cx-permission">${h.icon("shield", 15)}${h.esc(p.permission || "\u5B8C\u5168\u8BBF\u95EE")}</span></div><div class="cx-composer-end"><span class="cx-context"></span><span class="cx-model">${h.esc(p.model || "GPT-6 Astra")} <span class="cx-effort">${h.esc(p.effort || "Ultra")}</span>${h.icon("chevron-down", 11)}</span><span class="cx-square-icon">${h.icon("mic", 17)}</span><span class="cx-send">${p.running ? '<span class="cx-stop"></span>' : h.icon("arrow-up", 17)}</span></div></div></div>`;
  }
  function toolCard(p, h) {
    return `<div class="cx-tool-card" data-motion="item"><div class="cx-file-icon">${h.icon("file", 23)}<span>+</span></div><div class="cx-file-copy"><div>${h.esc(p.verb || "\u5DF2\u7F16\u8F91")} ${h.esc(p.file || "App.tsx")}</div><div class="cx-diff-stat"><span>+${h.esc(p.added ?? 18)}</span><span>-${h.esc(p.removed ?? 4)}</span></div></div><div class="cx-tool-actions"><span>${h.esc(p.undoLabel || "\u64A4\u9500")}${h.icon("undo", 14)}</span><button>${h.esc(p.reviewLabel || "\u5BA1\u6838")}</button></div></div>`;
  }
  var components17 = [
    { id: "codex-chat", name: "Codex \u5BF9\u8BDD\u7A97\u53E3", category: "Codex", description: "\u6309\u672C\u673A Codex \u91CD\u5EFA\u7684\u9ED1\u8272\u7528\u6237\u6D88\u606F\u3001\u65E0\u6C14\u6CE1\u56DE\u590D\u3001\u6267\u884C\u8BB0\u5F55\u548C\u5E95\u90E8\u8F93\u5165\u680F\u3002", width: 1280, height: 800, reference: native, defaults: { title: "\u4FEE\u590D\u79FB\u52A8\u7AEF\u9875\u9762\u5E03\u5C40", userMessage: "\u68C0\u67E5\u79FB\u52A8\u7AEF\u6309\u94AE\u88AB\u906E\u6321\u7684\u95EE\u9898\u3002\u53EA\u4FEE\u6539\u5E03\u5C40\u76F8\u5173\u4EE3\u7801\uFF0C\u4FDD\u6301\u684C\u9762\u7AEF\u6548\u679C\u4E0D\u53D8\u3002", status: "\u5DF2\u5904\u7406 38\u79D2", reply: "\u5DF2\u7ECF\u4FEE\u590D\u79FB\u52A8\u7AEF\u6309\u94AE\u88AB\u906E\u6321\u7684\u95EE\u9898\u3002\u6309\u94AE\u73B0\u5728\u4F1A\u968F\u5BB9\u5668\u5BBD\u5EA6\u6B63\u5E38\u6362\u884C\uFF0C\u684C\u9762\u7AEF\u5E03\u5C40\u4FDD\u6301\u539F\u6709\u6837\u5F0F\u3002", details: ["\u8C03\u6574\u4E86\u6309\u94AE\u5BB9\u5668\u7684\u6362\u884C\u89C4\u5219\u548C\u6700\u5C0F\u5BBD\u5EA6\u3002", "\u5728\u7A84\u5C4F\u4E0E\u684C\u9762\u5C3A\u5BF8\u4E0B\u68C0\u67E5\u4E86\u5E03\u5C40\u3002"], command: "npm run test -- --run", commandResult: "12 \u4E2A\u6D4B\u8BD5\u901A\u8FC7", file: "src/components/ActionBar.tsx", added: 18, removed: 4, placeholder: "\u968F\u5FC3\u8F93\u5165", draft: "", model: "GPT-6 Astra", effort: "Ultra", permission: "\u5B8C\u5168\u8BBF\u95EE", running: false }, render(p, h) {
      return `<section class="cx-thread"><header class="cx-thread-header"><div>${h.icon("folder", 18)}<span>${h.esc(p.title)}</span></div><div class="cx-header-controls">${h.icon("more", 19)}<span>${h.icon("upload", 15)} \u5206\u4EAB</span>${h.icon("panel", 17)}</div></header><div class="cx-conversation"><div class="cx-user-row"><div class="cx-user-bubble" data-motion="item">${h.esc(p.userMessage)}</div></div><div class="cx-status">${h.esc(p.status)}</div><div class="cx-assistant" data-motion="item"><p>${h.esc(p.reply)}</p><ul>${p.details.map((t) => `<li>${h.esc(t)}</li>`).join("")}</ul></div><div class="cx-execution" data-motion="item">${h.icon("terminal", 14)}<span>\u5DF2\u8FD0\u884C ${h.esc(p.command)}</span>${h.icon("chevron-down", 12)}</div><div class="cx-test-note">${h.icon("check", 15)}${h.esc(p.commandResult)}</div>${toolCard(p, h)}<div class="cx-answer-tools">${h.icon("copy", 15)}${h.icon("more", 17)}</div></div><div class="cx-fixed-composer">${composer2(p, h)}</div></section>`;
    } },
    { id: "codex-composer", name: "Codex \u8F93\u5165\u6846", category: "Codex", description: "\u72EC\u7ACB\u590D\u7528\u7684\u539F\u5C3A\u5BF8\u8F93\u5165\u533A\u3001\u6743\u9650\u6807\u7B7E\u3001\u6A21\u578B\u9009\u62E9\u5668\u3001\u9EA6\u514B\u98CE\u548C\u53D1\u9001/\u505C\u6B62\u6309\u94AE\u3002", width: 800, height: 160, reference: native, defaults: { placeholder: "\u968F\u5FC3\u8F93\u5165", draft: "", permission: "\u5B8C\u5168\u8BBF\u95EE", model: "GPT-6 Astra", effort: "Ultra", running: true }, render(p, h) {
      return `<section class="cx-composer-island">${composer2(p, h)}</section>`;
    } },
    { id: "codex-tool-result", name: "Codex \u6587\u4EF6\u4FEE\u6539\u5361", category: "Codex", description: "\u6587\u4EF6\u540D\u3001\u589E\u5220\u884C\u7EDF\u8BA1\u3001\u64A4\u9500\u4E0E\u5BA1\u6838\u5165\u53E3\uFF1B\u53EF\u63A5\u5728\u4EFB\u610F\u8BB2\u89E3\u753B\u9762\u4E2D\u3002", width: 800, height: 200, reference: native, defaults: { verb: "\u5DF2\u7F16\u8F91", file: "\u63D0\u793A\u8BCD.md", added: 37, removed: 0, undoLabel: "\u64A4\u9500", reviewLabel: "\u5BA1\u6838" }, render(p, h) {
      return `<section class="cx-tool-island">${toolCard(p, h)}</section>`;
    } },
    { id: "codex-plan", name: "Codex \u6267\u884C\u8BA1\u5212", category: "Codex", description: "\u6309 Codex \u539F\u751F\u6587\u5B57\u5BC6\u5EA6\u4E0E\u7070\u8272\u8FB9\u754C\u7EC4\u7EC7\u7684\u53EF\u7F16\u8F91\u8BA1\u5212\u6E05\u5355\u3002", width: 800, height: 420, reference: { ...native, level: "documented", basis: "Codex \u672C\u673A\u6392\u7248 token \u4E0E\u4EFB\u52A1\u72B6\u6001\u7ED3\u6784\uFF1B\u8BA1\u5212\u4E13\u7528\u72B6\u6001\u5C1A\u672A\u9010\u50CF\u7D20\u6BD4\u5BF9" }, defaults: { title: "\u66F4\u65B0\u8BA1\u5212", summary: "\u5148\u5B9A\u4F4D\u95EE\u9898\uFF0C\u518D\u4FEE\u6539\u548C\u9A8C\u8BC1\u3002", steps: [{ text: "\u68C0\u67E5\u76F8\u5173\u7EC4\u4EF6\u548C\u73B0\u6709\u6D4B\u8BD5", state: "done" }, { text: "\u4FEE\u590D\u7A84\u5C4F\u5E03\u5C40\u5E76\u68C0\u67E5\u684C\u9762\u89C6\u56FE", state: "active" }, { text: "\u8FD0\u884C\u6D4B\u8BD5\u5E76\u6574\u7406\u4FEE\u6539\u8BF4\u660E", state: "pending" }], footer: "2 / 3 \xB7 \u6B63\u5728\u5904\u7406" }, render(p, h) {
      return `<section class="cx-plan-island"><div class="cx-plan"><header>${h.icon("list", 18)}<strong>${h.esc(p.title)}</strong><span>${h.icon("chevron-down", 14)}</span></header><p>${h.esc(p.summary)}</p><div class="cx-plan-steps">${p.steps.map((s) => `<div class="cx-plan-step cx-plan-${h.esc(s.state)}" data-motion="item"><span class="cx-plan-state">${s.state === "done" ? h.icon("check", 15) : s.state === "active" ? "<i></i>" : ""}</span><span>${h.esc(s.text)}</span></div>`).join("")}</div><footer>${h.esc(p.footer)}</footer></div></section>`;
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
  function controls(h) {
    return `<div class="dev-win-controls"><span>${h.icon("minus", 16)}</span><span>${h.icon("maximize", 14)}</span><span>${h.icon("x", 16)}</span></div>`;
  }
  function titlebar(p, h, brand = "Visual Studio Code") {
    return `<div class="dev-titlebar"><span class="dev-app-symbol">${h.icon("code", 19)}</span><div class="dev-menus"><span>\u6587\u4EF6</span><span>\u7F16\u8F91</span><span>\u9009\u62E9</span><span>\u67E5\u770B</span><span>\u8F6C\u5230</span><span>\u8FD0\u884C</span><span>\u7EC8\u7AEF</span><span>\u5E2E\u52A9</span></div><div class="dev-command-center">${h.icon("search", 14)}<span>${h.esc(p.project || p.title || brand)}</span></div>${controls(h)}</div>`;
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
  function simpleHead(p, h, label2) {
    return `<div class="dev-tool-title"><span>${h.icon(p.appIcon || "code", 18)}<b>${h.esc(p.appName || label2)}</b><span class="dev-tool-divider"></span>${h.esc(p.workspace || "\u79D1\u666E\u89C6\u9891\u9879\u76EE")}</span><div>${h.icon("search", 16)}${h.icon("settings", 16)}${controls(h)}</div></div>`;
  }
  var sampleFiles = [{ name: "SCIENCE-VIDEO", kind: "folder", depth: 0 }, { name: "public", kind: "folder", depth: 1, open: false }, { name: "src", kind: "folder", depth: 1 }, { name: "components", kind: "folder", depth: 2, open: false }, { name: "config.ts", depth: 2, badge: "M" }, { name: "timeline.ts", depth: 2 }, { name: "index.ts", depth: 2 }, { name: "tests", kind: "folder", depth: 1, open: false }, { name: "package.json", depth: 1 }, { name: "README.md", depth: 1 }];
  var sampleCode = ["import { createTimeline } from './timeline';", "", "// \u5148\u5B9A\u4E49\u5185\u5BB9\uFF0C\u518D\u4EA4\u7ED9\u65F6\u95F4\u8F74\u7F16\u6392", "export const video = {", "  title: '\u628A\u590D\u6742\u6982\u5FF5\u8BB2\u6E05\u695A',", "  width: 1920,", "  height: 1080,", "  fps: 30,", "  scenes: [", "    { id: 'intro', duration: 4.5 },", "    { id: 'explain', duration: 12 },", "    { id: 'summary', duration: 5 },", "  ],", "};", "", "const timeline = createTimeline(video);", "timeline.validate();"];
  var components18 = [
    {
      id: "terminal-session",
      name: "Windows Terminal \u4F1A\u8BDD",
      category: "\u5F00\u53D1\u4E0E\u6570\u636E",
      width: 1280,
      height: 800,
      description: "Windows \u6807\u7B7E\u680F\u4E0E\u7A97\u53E3\u6309\u94AE\u3001PowerShell \u63D0\u793A\u7B26\u3001\u5206\u7EA7\u65E5\u5FD7\u53CA\u53EF\u9010\u884C\u63ED\u793A\u7684\u8F93\u51FA\u3002\u547D\u4EE4\u4EC5\u7528\u4E8E\u52A8\u753B\u5C55\u793A\uFF0C\u4E0D\u4F1A\u6267\u884C\u3002",
      reference: documented("Windows Terminal \u7684\u6807\u7B7E\u3001\u52A0\u53F7\u3001\u4E0B\u62C9\u4E0E\u53F3\u4FA7\u7A97\u53E3\u6309\u94AE\u4F9D\u5FAE\u8F6F\u5B98\u65B9\u754C\u9762\u5F62\u5236\uFF1B\u7EC8\u7AEF\u6B63\u6587\u4E3A\u81EA\u5B9A\u4E49\u9AD8\u5BF9\u6BD4\u914D\u8272\uFF0C\u672A\u505A\u540C\u5C3A\u5BF8\u622A\u56FE\u9A8C\u6536\u3002", "https://learn.microsoft.com/en-us/windows/terminal/customize-settings/appearance"),
      defaults: { title: "PowerShell", path: "D:\\workspace\\science-video", greeting: "PowerShell 7.5.2", command: "npm run build", lines: [{ text: "> science-video@1.0.0 build", tone: "muted" }, { text: "> node scripts/build.mjs", tone: "muted" }, { text: "", tone: "muted" }, { text: "\u2713 \u8BFB\u53D6\u5185\u5BB9\u914D\u7F6E content.json", tone: "success" }, { text: "\u2713 \u6821\u9A8C 7 \u4E2A\u5206\u955C\u4E0E\u914D\u97F3\u65F6\u957F", tone: "success" }, { text: "\u2713 \u7F16\u8BD1\u53EF\u590D\u7528\u52A8\u753B\u7EC4\u4EF6", tone: "success" }, { text: "\u2713 \u751F\u6210 compositions/index.html", tone: "success" }, { text: "", tone: "muted" }, { text: "\u6784\u5EFA\u6210\u529F\u3002\u9884\u89C8\u5DF2\u51C6\u5907\u5C31\u7EEA\u3002", tone: "normal" }, { text: "  Local:   http://localhost:3027", tone: "link" }, { text: "  Duration: 76.6 s     Resolution: 1920 \xD7 1080", tone: "muted" }], nextCommand: "npm run check" },
      render(props, h) {
        const p = cfg(this, props);
        return `<article class="dev-stage"><div class="dev-window dev-terminal"><div class="dev-terminal-title"><div class="dev-terminal-tab">${h.icon("terminal", 18)}<span>${h.esc(p.title)}</span>${h.icon("x", 14)}</div><span class="dev-terminal-new">${h.icon("plus", 17)}${h.icon("chevron-down", 13)}</span>${controls(h)}</div><div class="dev-terminal-body"><div class="dev-terminal-greeting">${h.esc(p.greeting)}</div><div class="dev-command-row"><span class="dev-prompt">PS ${h.esc(p.path)}&gt;</span> <span data-motion="type">${h.esc(p.command)}</span></div><div class="dev-terminal-output">${arr(p.lines).map((l) => `<div class="dev-log-${cls(l.tone, ["muted", "success", "error", "link", "normal"], "normal")}" data-motion="line" data-output-line>${h.esc(l.text) || "&#160;"}</div>`).join("")}</div><div class="dev-command-row dev-terminal-last" data-output-line><span class="dev-prompt">PS ${h.esc(p.path)}&gt;</span> <span>${h.esc(p.nextCommand)}</span><span class="dev-terminal-caret" data-motion="cursor"></span></div></div></div></article>`;
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
      defaults: { project: "science-video", filename: "config.ts", branch: "main*", language: "TypeScript", position: "\u884C 10\uFF0C\u5217 3", files: sampleFiles, code: sampleCode, highlightLine: 10, secondaryTab: "timeline.ts" },
      render(props, h) {
        const p = cfg(this, props);
        return shell2(p, h, `${tabs([{ name: p.filename, kind: "TS" }, { name: p.secondaryTab, kind: "TS" }], h)}${crumbs(["src", p.filename, "video"], h)}<div class="dev-source-area" data-motion="scroll">${codeLines(p.code, h, { highlight: n(p.highlightLine), motion: "highlight" })}${miniMap(p.code, h)}</div><div class="dev-panel-tabs"><b>\u95EE\u9898</b><span>\u8F93\u51FA</span><span>\u8C03\u8BD5\u63A7\u5236\u53F0</span><span>\u7EC8\u7AEF</span><span>\u7AEF\u53E3</span></div><div class="dev-panel-message">\u5DE5\u4F5C\u533A\u4E2D\u5C1A\u672A\u68C0\u6D4B\u5230\u4EFB\u4F55\u95EE\u9898\u3002</div>`, { sidebar: `<div class="dev-sidebar-heading">\u8D44\u6E90\u7BA1\u7406\u5668 ${h.icon("more", 17)}</div><div class="dev-tree-group">${h.icon("chevron-down", 13)} \u6253\u5F00\u7684\u7F16\u8F91\u5668</div><div class="dev-open-file">${h.icon("x", 13)} <span class="dev-filetype">TS</span> ${h.esc(p.filename)}</div>${tree(p.files, h, p.filename)}<div class="dev-sidebar-bottom">${h.icon("chevron-right", 13)} \u5927\u7EB2</div>` });
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
      defaults: { project: "science-video", filename: "config.ts", branch: "feature/preview*", language: "TypeScript", position: "2 \u9879\u66F4\u6539", beforeLabel: "config.ts \xB7 HEAD", afterLabel: "config.ts \xB7 \u5DE5\u4F5C\u533A", before: ["export const output = {", { text: "  width: 960,", state: "remove" }, { text: "  height: 540,", state: "remove" }, "  fps: 30,", "  format: 'mp4',", "};", "", "export const theme = {", { text: "  background: '#17201e',", state: "remove" }, { text: "  accent: '#d8ae65',", state: "remove" }, "  complete: '#81c9b0',", "};"], after: ["export const output = {", { text: "  width: 1920,", state: "add" }, { text: "  height: 1080,", state: "add" }, "  fps: 30,", "  format: 'mp4',", "};", "", "export const theme = {", { text: "  background: '#ffffff',", state: "add" }, { text: "  accent: '#2563eb',", state: "add" }, "  complete: '#81c9b0',", "};"] },
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
      defaults: { project: "science-video", filename: "content.json", language: "JSON", position: "\u884C 8\uFF0C\u5217 18", branch: "main", files: [{ name: "SCIENCE-VIDEO", kind: "folder", depth: 0 }, { name: "assets", kind: "folder", depth: 1 }, { name: "audio", kind: "folder", depth: 2 }, { name: "intro.wav", depth: 3 }, { name: "explain.wav", depth: 3 }, { name: "images", kind: "folder", depth: 2, open: false }, { name: "recordings", kind: "folder", depth: 2 }, { name: "browser-demo.mp4", depth: 3 }, { name: "components", kind: "folder", depth: 1 }, { name: "browser.html", depth: 2 }, { name: "terminal.html", depth: 2 }, { name: "scripts", kind: "folder", depth: 1, open: false }, { name: "content.json", depth: 1, badge: "M" }, { name: "package.json", depth: 1 }, { name: "README.md", depth: 1 }], code: ["{", '  "title": "AI \u79D1\u666E\u5165\u95E8",', '  "aspectRatio": "16:9",', '  "theme": "white-blue",', '  "scenes": [', "    {", '      "component": "browser-window",', '      "source": "assets/recordings/browser-demo.mp4",', '      "duration": 12,', '      "caption": "\u4ECE\u4E00\u4E2A\u6E05\u695A\u7684\u95EE\u9898\u5F00\u59CB"', "    },", "    {", '      "component": "terminal-session",', '      "duration": 8', "    }", "  ]", "}"] },
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
      defaults: { appName: "API \u5DE5\u4F5C\u53F0", workspace: "\u79D1\u666E\u89C6\u9891\u9879\u76EE", appIcon: "globe", requestName: "\u8BFB\u53D6\u7EC4\u4EF6\u5217\u8868", method: "GET", url: "https://api.example.com/v1/components", status: "200 OK", latency: "128 ms", responseSize: "1.24 KB", requests: [{ method: "GET", name: "\u8BFB\u53D6\u7EC4\u4EF6\u5217\u8868" }, { method: "GET", name: "\u83B7\u53D6\u5206\u955C\u914D\u7F6E" }, { method: "POST", name: "\u521B\u5EFA\u9884\u89C8\u4EFB\u52A1" }, { method: "GET", name: "\u67E5\u8BE2\u4EFB\u52A1\u72B6\u6001" }], params: [{ key: "category", value: "software", description: "\u6309\u7EC4\u4EF6\u7C7B\u522B\u7B5B\u9009" }, { key: "limit", value: "30", description: "\u8FD4\u56DE\u7ED3\u679C\u6570\u91CF" }], response: ["{", '  "success": true,', '  "data": [', '    { "id": "browser-window", "name": "\u6D4F\u89C8\u5668\u7A97\u53E3" },', '    { "id": "terminal-session", "name": "\u7EC8\u7AEF\u4F1A\u8BDD" },', '    { "id": "code-editor", "name": "\u4EE3\u7801\u7F16\u8F91\u5668" }', "  ],", '  "total": 30', "}"] },
      render(props, h) {
        const p = cfg(this, props);
        return `<article class="dev-stage"><div class="dev-window dev-tool">${simpleHead(p, h, "API \u5DE5\u4F5C\u53F0")}<div class="dev-tool-body"><aside class="dev-http-sidebar"><div class="dev-sidebar-heading">\u96C6\u5408 ${h.icon("plus", 17)}</div><div class="dev-tree-group">${h.icon("chevron-down", 14)} \u89C6\u9891\u7EC4\u4EF6 API</div>${arr(p.requests).map((r, i) => `<div class="dev-http-request ${i === 0 ? "dev-http-selected" : ""}"><b class="${r.method === "POST" ? "dev-http-post" : ""}">${h.esc(r.method)}</b><span>${h.esc(r.name)}</span></div>`).join("")}</aside><main class="dev-http-main"><div class="dev-http-breadcrumb">\u96C6\u5408 ${h.icon("chevron-right", 14)} \u89C6\u9891\u7EC4\u4EF6 API ${h.icon("chevron-right", 14)} ${h.esc(p.requestName)}<span>${h.icon("more", 18)}</span></div><div class="dev-http-url" data-motion="focus"><b>${h.esc(p.method)} ${h.icon("chevron-down", 13)}</b><span>${h.esc(p.url)}</span><div>\u53D1\u9001 ${h.icon("chevron-down", 14)}</div></div><div class="dev-tool-tabs"><b>\u53C2\u6570 <i>${arr(p.params).length}</i></b><span>\u8EAB\u4EFD\u9A8C\u8BC1</span><span>\u8BF7\u6C42\u5934 <i>2</i></span><span>\u8BF7\u6C42\u4F53</span><span>\u8BBE\u7F6E</span></div><div class="dev-http-params-title">\u67E5\u8BE2\u53C2\u6570</div><div class="dev-params-table"><div class="dev-param-row dev-param-head"><span></span><span>KEY</span><span>VALUE</span><span>DESCRIPTION</span></div>${arr(p.params).map((r) => `<div class="dev-param-row" data-motion="item"><span class="dev-checkbox-checked">${h.icon("check", 12)}</span><code>${h.esc(r.key)}</code><code>${h.esc(r.value)}</code><span>${h.esc(r.description)}</span></div>`).join("")}<div class="dev-param-row dev-param-empty"><span class="dev-checkbox"></span><span>\u952E</span><span>\u503C</span><span>\u63CF\u8FF0</span></div></div><div class="dev-response-head"><b>\u54CD\u5E94</b><span class="dev-http-status" data-motion="highlight">${h.esc(p.status)}</span><span>${h.esc(p.latency)}</span><span>${h.esc(p.responseSize)}</span></div><div class="dev-tool-tabs dev-response-tabs"><b>\u6B63\u6587</b><span>Cookies</span><span>\u54CD\u5E94\u5934</span><span class="dev-flex-fill"></span><span>JSON ${h.icon("chevron-down", 12)}</span>${h.icon("copy", 15)}</div><div class="dev-response-code">${codeLines(p.response, h, { compact: true })}</div></main></div><div class="dev-tool-status">${h.icon("check-circle", 14)} \u672C\u5730\u793A\u4F8B\u6570\u636E<span>\u8BF7\u6C42\u672A\u5B9E\u9645\u53D1\u9001</span></div></div></article>`;
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
      defaults: { appName: "\u6570\u636E\u68C0\u67E5\u5668", workspace: "response.json", appIcon: "code", title: "\u54CD\u5E94\u6570\u636E", path: "$.data[0].duration", selected: "duration", fields: [{ key: "response", value: "Object", type: "object", depth: 0 }, { key: "success", value: "true", type: "boolean", depth: 1 }, { key: "data", value: "Array(2)", type: "array", depth: 1 }, { key: "0", value: "Object", type: "object", depth: 2 }, { key: "id", value: '"scene-01"', type: "string", depth: 3 }, { key: "component", value: '"browser-window"', type: "string", depth: 3 }, { key: "duration", value: "12.5", type: "number", depth: 3 }, { key: "enabled", value: "true", type: "boolean", depth: 3 }, { key: "captions", value: "Array(3)", type: "array", depth: 3 }, { key: "1", value: "Object", type: "object", depth: 2 }, { key: "total", value: "2", type: "number", depth: 1 }, { key: "version", value: '"1.0"', type: "string", depth: 1 }], detail: { key: "duration", type: "number", value: "12.5", description: "\u5F53\u524D\u5206\u955C\u7684\u6301\u7EED\u65F6\u957F\uFF0C\u5355\u4F4D\u4E3A\u79D2\u3002", constraint: "\u5927\u4E8E 0 \u7684\u6709\u9650\u6570\u503C", location: "data \u2192 0 \u2192 duration" } },
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
      defaults: { project: "science-video", filename: "README.md", branch: "main", language: "Markdown", position: "\u884C 8\uFF0C\u5217 1", title: "\u79D1\u666E\u89C6\u9891\u5236\u4F5C\u6D41\u7A0B", intro: "\u628A\u5185\u5BB9\u3001\u7D20\u6750\u548C\u52A8\u753B\u5206\u5F00\u7BA1\u7406\uFF0C\u8BA9\u6BCF\u4E00\u96C6\u90FD\u80FD\u5FEB\u901F\u590D\u7528\u3002", sectionTitle: "\u5236\u4F5C\u6B65\u9AA4", tasks: [{ text: "\u786E\u5B9A\u4E3B\u9898\u4E0E\u5F00\u5934\u94A9\u5B50", done: true }, { text: "\u51C6\u5907\u914D\u97F3\u548C\u771F\u5B9E\u5F55\u5C4F", done: true }, { text: "\u66FF\u6362\u6A21\u677F\u5185\u5BB9\u5E76\u68C0\u67E5\u8282\u594F", done: false }, { text: "\u9884\u89C8\u786E\u8BA4\u540E\u5BFC\u51FA\u89C6\u9891", done: false }], note: "\u5148\u505A\u4E00\u4E2A\u6709\u4EE3\u8868\u6027\u7684\u573A\u666F\uFF0C\u786E\u8BA4\u98CE\u683C\u540E\u518D\u5C55\u5F00\u6574\u96C6\u3002", command: "npm run build\nnpm run dev", sections: [{ title: "\u4EA4\u4ED8\u4E0E\u5F52\u6863", text: "\u786E\u8BA4\u5B57\u5E55\u4E0E\u914D\u97F3\u4E00\u81F4\uFF0C\u68C0\u67E5\u6BCF\u4E2A\u753B\u9762\u7684\u7D20\u6750\u6765\u6E90\u3002\u628A\u672C\u96C6\u7684\u5185\u5BB9\u914D\u7F6E\u3001\u5F55\u5C4F\u548C\u56FE\u7247\u4FDD\u5B58\u5728\u540C\u4E00\u76EE\u5F55\u3002" }, { title: "\u5F00\u59CB\u4E0B\u4E00\u96C6", text: "\u590D\u5236\u4E0A\u4E00\u96C6\u7684\u5185\u5BB9\u914D\u7F6E\uFF0C\u66FF\u6362\u4E3B\u9898\u3001\u955C\u5934\u548C\u7D20\u6750\u3002\u5148\u9884\u89C8\u5173\u952E\u573A\u666F\uFF0C\u518D\u8C03\u6574\u6574\u4F53\u8282\u594F\u3002" }], source: ["# \u79D1\u666E\u89C6\u9891\u5236\u4F5C\u6D41\u7A0B", "", "\u628A\u5185\u5BB9\u3001\u7D20\u6750\u548C\u52A8\u753B\u5206\u5F00\u7BA1\u7406\uFF0C", "\u8BA9\u6BCF\u4E00\u96C6\u90FD\u80FD\u5FEB\u901F\u590D\u7528\u3002", "", "## \u5236\u4F5C\u6B65\u9AA4", "", "- [x] \u786E\u5B9A\u4E3B\u9898\u4E0E\u5F00\u5934\u94A9\u5B50", "- [x] \u51C6\u5907\u914D\u97F3\u548C\u771F\u5B9E\u5F55\u5C4F", "- [ ] \u66FF\u6362\u6A21\u677F\u5185\u5BB9\u5E76\u68C0\u67E5\u8282\u594F", "- [ ] \u9884\u89C8\u786E\u8BA4\u540E\u5BFC\u51FA\u89C6\u9891", "", "> \u5148\u505A\u4E00\u4E2A\u6709\u4EE3\u8868\u6027\u7684\u573A\u666F\uFF0C", "> \u786E\u8BA4\u98CE\u683C\u540E\u518D\u5C55\u5F00\u6574\u96C6\u3002", "", "```powershell", "npm run build", "npm run dev", "```"] },
      render(props, h) {
        const p = cfg(this, props);
        return shell2(p, h, `<div class="dev-markdown-split"><section>${tabs([{ name: p.filename, kind: "M\u2193" }], h)}${crumbs([p.project, p.filename], h)}${codeLines(p.source, h, { compact: true })}</section><section>${tabs([{ name: `\u9884\u89C8 ${p.filename}`, kind: "M\u2193" }], h)}<div class="dev-markdown-scroll-viewport"><div class="dev-markdown-preview" data-motion="scroll"><h1 data-motion="reveal">${h.esc(p.title)}</h1><p>${h.esc(p.intro)}</p><h2>${h.esc(p.sectionTitle)}</h2><ul>${arr(p.tasks).map((t) => `<li data-motion="item"><span class="${t.done ? "dev-checkbox-checked" : "dev-checkbox"}">${t.done ? h.icon("check", 12) : ""}</span>${h.esc(t.text)}</li>`).join("")}</ul><blockquote>${h.esc(p.note)}</blockquote><pre>${h.esc(p.command)}</pre>${arr(p.sections).map((s) => `<h2>${h.esc(s.title)}</h2><p>${h.esc(s.text)}</p>`).join("")}</div></div></section></div>`);
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
      defaults: { project: "science-video", branch: "main", language: "Git", position: "\u5DE5\u4F5C\u533A\u5E72\u51C0", commits: [{ message: "\u5408\u5E76\u6D4F\u89C8\u5668\u7EC4\u4EF6\u4E0E\u5B57\u5E55\u7CFB\u7EDF", hash: "e7a4c19", author: "\u5C0F\u6797", time: "10 \u5206\u949F\u524D", branch: "main", lane: 0 }, { message: "\u5B8C\u5584\u5F55\u5C4F\u533A\u57DF\u805A\u7126\u6548\u679C", hash: "cf821d0", author: "\u5C0F\u6797", time: "32 \u5206\u949F\u524D", branch: "feature/focus", lane: 1 }, { message: "\u4FEE\u590D\u957F\u6807\u9898\u6362\u884C\u4E0E\u5B89\u5168\u8FB9\u8DDD", hash: "c92e517", author: "\u5C0F\u6797", time: "1 \u5C0F\u65F6\u524D", lane: 0 }, { message: "\u65B0\u589E\u7EC8\u7AEF\u4E0E\u4EE3\u7801\u7F16\u8F91\u5668\u7EC4\u4EF6", hash: "85a46bf", author: "\u5C0F\u6797", time: "2 \u5C0F\u65F6\u524D", lane: 1 }, { message: "\u7EDF\u4E00\u767D\u5E95\u84DD\u8272\u89C6\u89C9\u89C4\u8303", hash: "7db821a", author: "\u5C0F\u6797", time: "\u6628\u5929", lane: 0 }, { message: "\u5EFA\u7ACB\u53EF\u590D\u7528\u89C6\u9891\u5DE5\u7A0B", hash: "096bcfe", author: "\u5C0F\u6797", time: "\u6628\u5929", lane: 0 }], selectedHash: "e7a4c19", changedFiles: [{ name: "components/browser.html", add: 36, remove: 8 }, { name: "components/captions.html", add: 24, remove: 6 }, { name: "content.json", add: 12, remove: 3 }], detail: "\u5C06\u5F55\u5C4F\u5BB9\u5668\u3001\u5B57\u5E55\u5B89\u5168\u533A\u4E0E\u533A\u57DF\u805A\u7126\u52A8\u753B\u6574\u5408\u5230\u540C\u4E00\u5957\u65F6\u95F4\u8F74\u3002" },
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
      defaults: { appName: "\u6D4B\u8BD5\u5DE5\u4F5C\u53F0", workspace: "science-video", appIcon: "check-circle", suite: "components / browser.spec.ts", duration: "2.41 s", tests: [{ name: "\u6B63\u786E\u663E\u793A\u6D4F\u89C8\u5668\u6807\u9898\u4E0E\u5730\u5740", status: "passed", time: "142 ms" }, { name: "\u66FF\u6362\u5F55\u5C4F\u7D20\u6750\u540E\u6BD4\u4F8B\u4FDD\u6301\u6B63\u786E", status: "passed", time: "388 ms" }, { name: "\u957F\u6807\u9898\u5728\u53EF\u7528\u533A\u57DF\u5185\u7701\u7565", status: "passed", time: "96 ms" }, { name: "\u533A\u57DF\u805A\u7126\u53EA\u6539\u53D8\u6307\u5B9A\u76EE\u6807", status: "passed", time: "421 ms" }, { name: "\u5012\u5E8F\u8DF3\u8F6C\u540E\u753B\u9762\u72B6\u6001\u4E00\u81F4", status: "passed", time: "532 ms" }, { name: "\u4E2D\u6587\u4E0E\u7279\u6B8A\u5B57\u7B26\u5B89\u5168\u663E\u793A", status: "passed", time: "108 ms" }], output: ["RUN  components/browser.spec.ts", "", "\u2713 \u6B63\u786E\u663E\u793A\u6D4F\u89C8\u5668\u6807\u9898\u4E0E\u5730\u5740", "\u2713 \u66FF\u6362\u5F55\u5C4F\u7D20\u6750\u540E\u6BD4\u4F8B\u4FDD\u6301\u6B63\u786E", "\u2713 \u5012\u5E8F\u8DF3\u8F6C\u540E\u753B\u9762\u72B6\u6001\u4E00\u81F4", "", "Test Files  1 passed (1)", "     Tests  6 passed (6)", "  Duration  2.41s"], runLabel: "\u672C\u6B21\u8FD0\u884C" },
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
      defaults: { appName: "\u6570\u636E\u5DE5\u4F5C\u53F0", workspace: "science_video.db", appIcon: "grid", table: "scenes", tables: ["scenes", "assets", "captions", "render_jobs"], columns: [{ key: "id", label: "id", type: "integer" }, { key: "title", label: "title", type: "text" }, { key: "component", label: "component", type: "text" }, { key: "duration", label: "duration", type: "real" }, { key: "status", label: "status", type: "text" }], rows: [{ id: 1, title: "\u5F00\u5934\u94A9\u5B50", component: "codex-chat", duration: 5, status: "\u5B8C\u6210" }, { id: 2, title: "\u64CD\u4F5C\u6F14\u793A", component: "browser-window", duration: 12.5, status: "\u5B8C\u6210" }, { id: 3, title: "\u547D\u4EE4\u6267\u884C", component: "terminal-session", duration: 8, status: "\u5B8C\u6210" }, { id: 4, title: "\u914D\u7F6E\u8BF4\u660E", component: "code-editor", duration: 10, status: "\u7F16\u8F91\u4E2D" }, { id: 5, title: "\u539F\u7406\u62C6\u89E3", component: "flow-diagram", duration: 14, status: "\u5F85\u5904\u7406" }, { id: 6, title: "\u524D\u540E\u5BF9\u6BD4", component: "before-after", duration: 8.5, status: "\u5F85\u5904\u7406" }, { id: 7, title: "\u91CD\u70B9\u56DE\u987E", component: "summary-card", duration: 6, status: "\u5F85\u5904\u7406" }], selectedId: 4, filter: 'status != "\u5DF2\u5F52\u6863"', recordTitle: "\u5F53\u524D\u8BB0\u5F55", footer: "7 \u6761\u8BB0\u5F55 \xB7 5 \u4E2A\u5B57\u6BB5" },
      render(props, h) {
        const p = cfg(this, props);
        const row = arr(p.rows).find((r) => String(r.id) === String(p.selectedId)) || arr(p.rows)[0] || {};
        return `<article class="dev-stage"><div class="dev-window dev-tool">${simpleHead(p, h, "\u6570\u636E\u5DE5\u4F5C\u53F0")}<div class="dev-data-body"><aside class="dev-data-sidebar"><div class="dev-sidebar-heading">\u6570\u636E\u5E93 ${h.icon("plus", 16)}</div><div class="dev-tree-group">${h.icon("chevron-down", 13)} main</div>${arr(p.tables).map((t) => `<div class="dev-tree-row ${t === p.table ? "dev-tree-selected" : ""}">${h.icon("grid", 16)}${h.esc(t)}</div>`).join("")}</aside><main class="dev-data-main"><div class="dev-data-toolbar"><b>${h.icon("grid", 16)} ${h.esc(p.table)}</b><span>\u6570\u636E</span><span>\u7ED3\u6784</span><i></i>${h.icon("plus", 16)} \u6DFB\u52A0\u8BB0\u5F55 ${h.icon("refresh", 16)}</div><div class="dev-data-filter">${h.icon("search", 15)}<code>${h.esc(p.filter)}</code><span>\u7B5B\u9009 ${h.icon("chevron-down", 13)}</span></div><div class="dev-data-content"><div class="dev-data-grid"><table><thead><tr><th class="dev-data-rowno">#</th>${arr(p.columns).map((c) => `<th>${h.esc(c.label)}<small>${h.esc(c.type)}</small></th>`).join("")}</tr></thead><tbody>${arr(p.rows).map((r, i) => `<tr class="${String(r.id) === String(p.selectedId) ? "dev-data-selected" : ""}" data-motion="item"><td>${i + 1}</td>${arr(p.columns).map((c) => `<td>${c.key === "status" ? `<span class="dev-record-status ${r[c.key] === "\u5B8C\u6210" ? "dev-record-done" : r[c.key] === "\u7F16\u8F91\u4E2D" ? "dev-record-active" : ""}">${h.esc(r[c.key])}</span>` : h.esc(r[c.key])}</td>`).join("")}</tr>`).join("")}</tbody></table><div class="dev-data-filler"></div></div><aside class="dev-record-detail"><div>${h.esc(p.recordTitle)} ${h.icon("more", 15)}</div><h3>#${h.esc(row.id)}</h3>${arr(p.columns).map((c) => `<dl><dt>${h.esc(c.label)} <small>${h.esc(c.type)}</small></dt><dd>${h.esc(row[c.key])}</dd></dl>`).join("")}</aside></div><div class="dev-data-pager">${h.esc(p.footer)}<span>1\u2013${arr(p.rows).length} / ${arr(p.rows).length} ${h.icon("chevron-right", 14)}</span></div></main></div><div class="dev-tool-status">${h.icon("lock", 13)} \u53EA\u8BFB\u9884\u89C8<span>main.${h.esc(p.table)}</span></div></div></article>`;
      }
    }
  ];

  // families/doubao-chat.mjs
  var arr2 = (value) => Array.isArray(value) ? value : [];
  var str = (value) => String(value ?? "");
  var source = (value) => {
    const text6 = str(value).trim().replaceAll("\\", "/");
    if (!text6 || /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(text6) || /[\u0000-\u001f]/.test(text6)) return "";
    return text6.split("/").every((part) => {
      let decoded = part;
      try {
        decoded = decodeURIComponent(part);
      } catch {
      }
      return decoded !== "." && decoded !== ".." && !/[\\/]/.test(decoded);
    }) ? text6 : "";
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
    return `<article class="dbchat-message dbchat-message-${role}" data-message-id="${h.esc(m.id || `message-${index + 1}`)}" data-message-index="${index}" data-state="${state3}" data-motion="item"${m.visible === false ? " hidden" : ""}><div class="dbchat-message-body" data-part="message-text" data-motion="reveal">${m.heading ? `<h3>${h.esc(m.heading)}</h3>` : ""}${paragraphs2.map((text6, i) => `<p data-paragraph-index="${i}" data-motion="line">${h.esc(text6)}</p>`).join("")}${arr2(m.bullets).length ? `<ul>${m.bullets.map((text6) => `<li data-motion="line">${h.esc(text6)}</li>`).join("")}</ul>` : ""}${arr2(m.fields).length ? `<dl>${m.fields.map((field, i) => `<div data-field-index="${i}" data-motion="line"><dt>${h.esc(field.label)}</dt><dd>${h.esc(field.value)}</dd></div>`).join("")}</dl>` : ""}${m.linkLabel ? `<div class="dbchat-demo-link" data-motion="highlight">${h.icon("link", 14)}<span>${h.esc(m.linkLabel)}</span><small>${h.esc(m.linkNote || "\u6F14\u793A\u5360\u4F4D")}</small></div>` : ""}</div>${role === "assistant" && m.actions ? answerActions(h) : ""}</article>`;
  }
  function composer3(p, h) {
    const c = { ...p, ...p.composer };
    const draft = str(c.draft), running = Boolean(c.running), tools = arr2(c.tools);
    const requestedLimit = Number(c.maxTools), limit = Number.isFinite(requestedLimit) ? Math.max(0, Math.min(5, requestedLimit)) : 3;
    return `<div class="dbchat-composer${draft ? " dbchat-has-draft" : ""}${c.focused ? " dbchat-focused" : ""}" data-part="composer" data-state="${running ? "running" : draft ? "draft" : "idle"}" data-motion="focus"><div class="dbchat-editor" data-part="draft" data-motion="type" data-draft="${h.esc(draft)}">${h.esc(draft || c.placeholder)}</div><div class="dbchat-composer-footer"><div class="dbchat-composer-tools"><span class="dbchat-plus">${h.icon("plus", 19)}</span><span class="dbchat-mode">${chatIcon(16)}${h.esc(c.modeLabel)}${h.icon("chevron-down", 10)}</span>${tools.slice(0, limit).map((tool2, i) => `<span class="dbchat-tool" data-tool-index="${i}">${h.icon(tool2.icon || "file", 15)}<span>${h.esc(typeof tool2 === "string" ? tool2 : tool2.label)}</span></span>`).join("")}${tools.length > limit ? `<span class="dbchat-more-tools">${h.icon("more", 18)}</span>` : ""}</div><div class="dbchat-composer-right"><span class="dbchat-model">${h.esc(c.modelLabel)}<span>${h.esc(c.speedLabel)}</span>${h.icon("chevron-right", 10)}</span><span class="dbchat-send${running ? " dbchat-stop" : draft ? " dbchat-send-ready" : " dbchat-send-mic"}" data-part="send" data-state="${running ? "stop" : draft ? "send" : "mic"}" data-motion="cursor">${running ? "<i></i>" : draft ? h.icon("arrow-up", 18) : h.icon("mic", 18)}</span></div></div></div>`;
  }
  function home(p, h) {
    const logo = source(p.logoSrc);
    return `<div class="dbchat-home" data-part="home" data-motion="reveal">${p.showHomeLogo && logo ? `<img class="dbchat-home-logo" src="${h.esc(logo)}" alt="${h.esc(p.brand)}">` : ""}<h2>${h.esc(p.homeTitle)}</h2><div class="dbchat-home-switch"><span class="dbchat-switch-active">${chatIcon(16)}${h.esc(p.conversationModeLabel)}</span><span>${h.icon("monitor", 16)}${h.esc(p.workModeLabel)}</span></div></div>`;
  }
  var components19 = [{
    id: "doubao-chat",
    name: "\u8C46\u5305 \xB7 \u666E\u901A\u5BF9\u8BDD",
    category: "\u8C46\u5305",
    description: "\u4F9D\u636E\u8C46\u5305\u516C\u5F00\u804A\u5929\u9875\u9762\u7684\u666E\u901A\u5BF9\u8BDD\u6A21\u5F0F\u590D\u523B\uFF1A\u7070\u8272\u53F3\u4FA7\u7528\u6237\u6D88\u606F\u3001\u65E0\u6C14\u6CE1\u52A9\u624B\u6B63\u6587\u3001\u5E95\u90E8\u5BF9\u8BDD\u8F93\u5165\u533A\uFF1B\u591A\u8F6E\u5185\u5BB9\u548C\u72B6\u6001\u5747\u53EF\u7F16\u8F91\u3002",
    width: 1280,
    height: 800,
    reference: { basis: "2026-09-18 \u901A\u8FC7\u6D4F\u89C8\u5668\u89C2\u5BDF www.doubao.com/chat/ \u666E\u901A\u5BF9\u8BDD\u6A21\u5F0F\uFF0C1920\xD7910\uFF1B\u672C\u7EC4\u4EF6\u6309 1280\xD7800 \u9002\u914D\u3002\u684C\u9762 app \u622A\u56FE\u56E0\u81EA\u52A8\u5316\u8EAB\u4EFD\u6821\u9A8C\u5F02\u5E38\u672A\u6210\u529F\uFF0C\u4E0D\u5BA3\u79F0\u684C\u9762\u9010\u50CF\u7D20\u5BF9\u9F50\u3002", source: "https://www.doubao.com/chat/\uFF1Breports/doubao-chat-notes.md", level: "documented" },
    defaults: {
      brand: "\u8C46\u5305",
      logoSrc: "assets/brands/doubao.png",
      showHomeLogo: false,
      title: "\u8FDB\u5EA6\u63D0\u4EA4\u901A\u77E5",
      notice: "AI \u751F\u6210\u53EF\u80FD\u6709\u8BEF\uFF0C\u8BF7\u6838\u5B9E",
      simulationLabel: "\u754C\u9762\u590D\u523B \xB7 \u6848\u4F8B\u6F14\u793A",
      showSidebar: true,
      showHome: false,
      homeTitle: "\u6709\u4EC0\u4E48\u6211\u80FD\u5E2E\u4F60\u7684\u5417\uFF1F",
      conversationModeLabel: "\u5BF9\u8BDD",
      workModeLabel: "\u5DE5\u4F5C",
      navigation: [{ label: "\u65B0\u5DE5\u4F5C\u4EFB\u52A1", icon: "edit" }, { label: "\u65B0\u5BF9\u8BDD", icon: "chat" }, { label: "\u5B9A\u65F6\u4EFB\u52A1", icon: "clock" }, { label: "\u63D2\u4EF6\xB7\u6280\u80FD\xB7\u4F19\u4F34", icon: "grid" }, { label: "\u4E91\u76D8", icon: "folder" }, { label: "API \u670D\u52A1", icon: "code" }, { label: "\u66F4\u591A", icon: "more" }],
      pinnedLabel: "\u7F6E\u9876",
      pinnedTitle: "\u4E3B\u5BF9\u8BDD",
      projectsLabel: "\u9879\u76EE",
      newProjectLabel: "\u521B\u5EFA\u9879\u76EE",
      recentLabel: "\u6700\u8FD1",
      recentTasks: [],
      accountLabel: "\u7528\u6237",
      planLabel: "\u6807\u51C6\u5957\u9910",
      messages: [{ id: "request-vague", role: "user", text: "\u63D0\u9192\u5927\u5BB6\u4EA4\u8FDB\u5EA6\uFF0C\u6B63\u5F0F\u4E00\u70B9\u3002" }, { id: "reply-vague", role: "assistant", heading: "\u901A\u77E5", text: "\u8BF7\u5404\u4F4D\u79EF\u6781\u914D\u5408\uFF0C\u53CA\u65F6\u63D0\u4EA4\u76F8\u5173\u6750\u6599\u3002", actions: true }],
      suggestions: ["\u5E2E\u6211\u6539\u5F97\u66F4\u7B80\u6D01", "\u68C0\u67E5\u901A\u77E5\u662F\u5426\u4EA4\u4EE3\u6E05\u695A"],
      draft: "",
      running: false,
      focused: false,
      placeholder: "\u53D1\u6D88\u606F\u6216\u6309\u4F4F\u7A7A\u683C\u8BF4\u8BDD...",
      modeLabel: "\u5BF9\u8BDD",
      modelLabel: "\u8C46\u5305",
      speedLabel: "\u5FEB\u901F",
      maxTools: 3,
      tools: [{ label: "\u5F55\u97F3\u8F6C\u5199", icon: "mic" }, { label: "\u56FE\u50CF\u751F\u6210", icon: "image" }, { label: "PPT \u751F\u6210", icon: "file" }, { label: "\u5E2E\u6211\u5199\u4F5C", icon: "edit" }, { label: "\u89C6\u9891\u751F\u6210", icon: "video" }, { label: "AI \u64AD\u5BA2", icon: "volume" }],
      workingLabel: "\u6B63\u5728\u751F\u6210",
      composer: {}
    },
    render(props, h) {
      const p = { ...this.defaults, ...props }, c = { ...p, ...p.composer }, running = Boolean(c.running);
      const requestedHeight = Number(c.height ?? p.composerHeight), draft = str(c.draft);
      const height = Number.isFinite(requestedHeight) && requestedHeight > 0 ? Math.max(99, Math.min(188, requestedHeight)) : draft.length > 60 ? 148 : 99;
      const messages = arr2(p.messages), isHome = p.showHome && !messages.length;
      return `<section class="dbchat-app${p.showSidebar === false ? " dbchat-no-sidebar" : ""}" data-simulation="true" data-state="${running ? "running" : draft ? "draft" : "idle"}" style="--dbchat-composer-height:${height}px">${p.showSidebar === false ? "" : sidebar3(p, h)}<main class="dbchat-main"><header class="dbchat-header"><div class="dbchat-header-left">${h.icon("panel", 18)}${isHome ? "" : h.icon("edit", 17)}</div>${isHome ? "" : `<div class="dbchat-thread-title"><strong>${h.esc(p.title)}</strong><small>${h.esc(p.notice)}</small></div>`}<div class="dbchat-header-right">${h.icon("volume", 17)}${h.icon("more", 18)}</div></header><div class="dbchat-simulation" data-part="disclosure">${h.esc(p.disclosure || p.simulationLabel || "\u754C\u9762\u590D\u523B \xB7 \u6848\u4F8B\u6F14\u793A")}</div><div class="dbchat-conversation" data-part="conversation"><div class="dbchat-viewport" data-part="viewport" data-motion="scroll"><div class="dbchat-messages" data-part="message-list" data-motion="scroll">${isHome ? home(p, h) : messages.map((m, i) => message2(m, i, h)).join("")}${running ? `<div class="dbchat-working" data-part="status" data-state="running" data-motion="reveal"><span>${h.esc(p.workingLabel)}</span><i>\xB7\xB7\xB7</i></div>` : ""}${!isHome && !running && arr2(p.suggestions).length ? `<div class="dbchat-suggestions" data-part="suggestions">${p.suggestions.map((text6, index) => `<span data-suggestion-index="${index}" data-motion="item">${h.esc(text6)}${h.icon("arrow-right", 13)}</span>`).join("")}</div>` : ""}</div></div></div><div class="dbchat-composer-anchor">${composer3(p, h)}</div></main></section>`;
    }
  }];

  // families/doubao-work.mjs
  var list2 = (value) => Array.isArray(value) ? value : [];
  var str2 = (value) => String(value ?? "");
  var safeLocalSource = (value) => {
    const source2 = str2(value).trim();
    return source2 && !/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(source2) ? source2 : "";
  };
  var state2 = (value) => ["idle", "draft", "running", "complete"].includes(value) ? value : "idle";
  function windowControls(h) {
    return `<div class="dbw-window-controls" aria-hidden="true"><span>${h.icon("minus", 14)}</span><span>${h.icon("maximize", 12)}</span><span>${h.icon("x", 15)}</span></div>`;
  }
  function sidebar4(p, h) {
    const source2 = safeLocalSource(p.logoSrc);
    const navigation = list2(p.navigation);
    return `<aside class="dbw-sidebar">
    <div class="dbw-brand">${source2 ? `<img src="${h.esc(source2)}" alt="" class="dbw-brand-logo">` : ""}<strong>${h.esc(p.brand)}</strong><span>${h.esc(p.brandSuffix)}</span><span class="dbw-search">${h.icon("search", 17)}</span></div>
    <nav class="dbw-navigation">${navigation.map((item, index) => `<div class="dbw-nav-row${item.active ? " dbw-selected" : ""}" data-nav-index="${index}"><span class="dbw-nav-icon">${h.icon(item.icon || "file", 18)}</span><span>${h.esc(item.label)}</span></div>`).join("")}</nav>
    <div class="dbw-sidebar-section"><div class="dbw-section-label">${h.esc(p.pinnedLabel)}</div><div class="dbw-nav-row">${h.icon("list", 17)}<span>${h.esc(p.pinnedTitle)}</span></div></div>
    <div class="dbw-sidebar-section"><div class="dbw-section-label">${h.esc(p.projectsLabel)}</div><div class="dbw-nav-row dbw-muted">${h.icon("plus", 18)}<span>${h.esc(p.newProjectLabel)}</span></div></div>
    <div class="dbw-sidebar-section"><div class="dbw-section-label">${h.esc(p.recentLabel)}</div>${list2(p.recentTasks).map((item) => `<div class="dbw-recent-task${item.active ? " dbw-selected" : ""}">${h.esc(typeof item === "string" ? item : item.title)}</div>`).join("")}</div>
    <div class="dbw-account"><span class="dbw-avatar" aria-hidden="true"><i></i></span><div><div class="dbw-account-name">${h.esc(p.accountLabel)}${h.icon("chevron-right", 12)}</div><div class="dbw-plan">${h.esc(p.planLabel)}</div></div></div>
  </aside>`;
  }
  function message3(message4, index, h) {
    const role = message4.role === "user" ? "user" : "assistant";
    const messageState = state2(message4.state || "complete");
    const paragraphs2 = Array.isArray(message4.paragraphs) ? message4.paragraphs : message4.text ? [message4.text] : [];
    const fields = list2(message4.fields);
    const bullets = list2(message4.bullets);
    return `<article class="dbw-message dbw-message-${role}" data-message-id="${h.esc(message4.id || `message-${index + 1}`)}" data-message-index="${index}" data-state="${messageState}" data-motion="item"${message4.visible === false ? " hidden" : ""}>
    ${role === "assistant" && message4.status ? `<div class="dbw-message-status" data-motion="reveal">${h.esc(message4.status)}${messageState === "running" ? '<span class="dbw-static-dots">\xB7\xB7\xB7</span>' : ""}</div>` : ""}
    <div class="dbw-message-body" data-motion="reveal" data-part="message-text">
      ${message4.heading ? `<h3>${h.esc(message4.heading)}</h3>` : ""}
      ${paragraphs2.map((paragraph, paragraphIndex) => `<p data-motion="line" data-paragraph-index="${paragraphIndex}">${h.esc(paragraph)}</p>`).join("")}
      ${fields.length ? `<dl class="dbw-message-fields">${fields.map((field, fieldIndex) => `<div data-motion="line" data-field-index="${fieldIndex}"><dt>${h.esc(field.label)}</dt><dd>${h.esc(field.value)}</dd></div>`).join("")}</dl>` : ""}
      ${bullets.length ? `<ul>${bullets.map((item) => `<li data-motion="line">${h.esc(item)}</li>`).join("")}</ul>` : ""}
      ${message4.linkLabel ? `<div class="dbw-demo-link" data-motion="highlight">${h.icon("link", 15)}<span>${h.esc(message4.linkLabel)}</span><small>${h.esc(message4.linkNote || "\u6F14\u793A\u5360\u4F4D")}</small></div>` : ""}
    </div>
    ${role === "assistant" && message4.actions ? `<div class="dbw-answer-actions" aria-hidden="true">${h.icon("copy", 14)}${h.icon("refresh", 14)}${h.icon("more", 16)}</div>` : ""}
  </article>`;
  }
  function composer4(p, h) {
    const c = { ...p, ...p.composer || {} };
    const running = Boolean(c.running);
    const hasDraft = Boolean(str2(c.draft));
    return `<div class="dbw-composer${hasDraft ? " dbw-has-draft" : ""}${c.focused ? " dbw-composer-focused" : ""}" data-state="${running ? "running" : hasDraft ? "draft" : "idle"}" data-part="composer" data-motion="focus">
    <div class="dbw-editor" data-part="draft" data-motion="type" data-draft="${h.esc(c.draft || "")}">${h.esc(hasDraft ? c.draft : c.placeholder)}</div>
    <div class="dbw-composer-footer"><div class="dbw-composer-left"><span class="dbw-plus">${h.icon("plus", 19)}</span><span class="dbw-local-chip">${h.icon("monitor", 15)}${h.esc(c.environmentLabel)}</span><span class="dbw-composer-menu">${h.icon("folder", 15)}${h.esc(c.projectLabel)}${h.icon("chevron-right", 10)}</span><span class="dbw-composer-menu dbw-permission">${h.icon("info", 15)}${h.esc(c.permissionLabel)}${h.icon("chevron-right", 10)}</span><span class="dbw-composer-overflow">${h.icon("more", 18)}</span></div><div class="dbw-composer-right"><span class="dbw-model">${h.esc(c.modeLabel)}<span>${h.esc(c.effortLabel)}</span>${h.icon("chevron-right", 10)}</span><span class="dbw-send ${running ? "dbw-send-stop" : hasDraft ? "dbw-send-ready" : "dbw-send-mic"}" data-part="send" data-motion="cursor" data-state="${running ? "stop" : hasDraft ? "send" : "mic"}">${running ? "<i></i>" : hasDraft ? h.icon("arrow-up", 17) : h.icon("mic", 17)}</span></div></div>
  </div>`;
  }
  function summaryPanel(p, h) {
    const panel3 = p.summary || {};
    return `<aside class="dbw-summary" data-motion="reveal"><header><span>${h.esc(panel3.title || p.summaryTitle)}</span>${h.icon("panel", 16)}</header><div class="dbw-summary-body"><div class="dbw-summary-section"><div class="dbw-summary-section-heading"><span>${h.esc(panel3.artifactsLabel || p.artifactsLabel)}</span>${h.icon("plus", 15)}</div>${list2(panel3.artifacts).map((item) => `<div class="dbw-summary-file" data-motion="item">${h.icon("file", 16)}<span>${h.esc(typeof item === "string" ? item : item.name)}</span></div>`).join("")}</div><div class="dbw-summary-section"><div class="dbw-summary-section-heading"><span>${h.esc(panel3.skillsLabel || p.skillsLabel)}</span>${h.icon("chevron-right", 12)}</div></div><div class="dbw-summary-section"><div class="dbw-summary-section-heading"><span>${h.esc(panel3.filesLabel || p.filesLabel)}</span>${h.icon("chevron-right", 12)}</div>${list2(panel3.files).map((item) => `<div class="dbw-summary-file" data-motion="item">${h.icon("file", 16)}<span>${h.esc(typeof item === "string" ? item : item.name)}</span></div>`).join("")}</div></div></aside>`;
  }
  var components20 = [{
    id: "doubao-workflow",
    name: "\u8C46\u5305\u5DE5\u4F5C \xB7 \u901A\u77E5\u5BF9\u8BDD",
    category: "\u8C46\u5305\u5DE5\u4F5C",
    description: "\u6309\u684C\u9762\u8C46\u5305\u5DE5\u4F5C\u7684\u4FA7\u680F\u3001\u7070\u8272\u7528\u6237\u6D88\u606F\u3001\u65E0\u6C14\u6CE1\u6B63\u6587\u3001\u8F93\u5165\u680F\u53CA\u5BF9\u8BDD\u6458\u8981\u7ED3\u6784\u5236\u4F5C\u7684\u53EF\u7F16\u8F91\u6559\u5B66\u6A21\u62DF\u3002",
    width: 1280,
    height: 800,
    reference: {
      basis: "2026-09-18 \u672C\u673A Windows \u8C46\u5305\u5DE5\u4F5C\u684C\u9762\u754C\u9762\u89C2\u5BDF\uFF1A1193\xD7794\uFF0C280px \u5DE6\u4FA7\u680F\u4E0E 280px \u5BF9\u8BDD\u6458\u8981\uFF1B\u672C\u7EC4\u4EF6\u6269\u5C55\u4E3A 1280\xD7800\uFF0C\u672A\u505A\u5168\u72B6\u6001\u9010\u50CF\u7D20\u9A8C\u6536\u3002",
      source: "\u672C\u673A DoubaoWork.ChatApp \u5B9E\u9645\u754C\u9762\u89C2\u5BDF\uFF1Breports/doubao-work-notes.md",
      level: "documented"
    },
    defaults: {
      title: "\u8FDB\u5EA6\u63D0\u4EA4\u901A\u77E5",
      notice: "AI \u751F\u6210\u53EF\u80FD\u6709\u8BEF\uFF0C\u8BF7\u6838\u5B9E",
      simulationLabel: "\u754C\u9762\u590D\u523B \xB7 \u6848\u4F8B\u6F14\u793A",
      brand: "\u8C46\u5305",
      brandSuffix: "\u5DE5\u4F5C",
      logoSrc: "",
      navigation: [{ label: "\u65B0\u5DE5\u4F5C\u4EFB\u52A1", icon: "edit" }, { label: "\u5B9A\u65F6\u4EFB\u52A1", icon: "clock" }, { label: "\u63D2\u4EF6\xB7\u6280\u80FD\xB7\u4F19\u4F34", icon: "grid" }, { label: "\u4E91\u76D8", icon: "folder" }, { label: "\u624B\u673A\u9065\u63A7\u7535\u8111", icon: "phone" }],
      pinnedLabel: "\u7F6E\u9876",
      pinnedTitle: "\u4E3B\u5BF9\u8BDD",
      projectsLabel: "\u9879\u76EE",
      newProjectLabel: "\u65B0\u5EFA\u9879\u76EE",
      recentLabel: "\u6700\u8FD1",
      recentTasks: [],
      accountLabel: "\u7528\u6237",
      planLabel: "\u6807\u51C6\u5957\u9910",
      showSidebar: true,
      showSummary: true,
      summaryTitle: "\u5BF9\u8BDD\u6458\u8981",
      artifactsLabel: "\u5BF9\u8BDD\u4EA7\u7269",
      skillsLabel: "\u6280\u80FD",
      filesLabel: "\u6700\u8FD1\u6587\u4EF6",
      summary: { artifacts: [], files: [] },
      messages: [
        { id: "request-vague", role: "user", text: "\u63D0\u9192\u5927\u5BB6\u4EA4\u8FDB\u5EA6\uFF0C\u6B63\u5F0F\u4E00\u70B9\u3002" },
        { id: "reply-vague", role: "assistant", text: "\u8BF7\u5404\u4F4D\u79EF\u6781\u914D\u5408\uFF0C\u53CA\u65F6\u63D0\u4EA4\u76F8\u5173\u6750\u6599\u3002" },
        { id: "request-clear", role: "user", text: "\u53D1\u7ED9\u5404\u7EC4\u8D1F\u8D23\u4EBA\u3002\u5468\u4E94\u4E0B\u5348\u4E94\u70B9\u524D\uFF0C\u628A\u8FD9\u5468\u505A\u5B8C\u4E86\u4EC0\u4E48\u3001\u8FD8\u6709\u4EC0\u4E48\u6CA1\u505A\u5B8C\uFF0C\u586B\u8FDB\u8FD9\u4E2A\u5171\u4EAB\u8868\u683C\u3002", linkLabel: "\u672C\u5468\u8FDB\u5EA6\u5171\u4EAB\u8868\u683C", linkNote: "\u6F14\u793A\u5360\u4F4D" },
        { id: "reply-clear", role: "assistant", heading: "\u672C\u5468\u8FDB\u5EA6\u63D0\u4EA4\u901A\u77E5", text: "\u8BF7\u5404\u7EC4\u8D1F\u8D23\u4EBA\u4E8E\u5468\u4E94 17:00 \u524D\uFF0C\u5728\u5171\u4EAB\u8868\u683C\u4E2D\u586B\u5199\u672C\u5468\u5DF2\u5B8C\u6210\u4E8B\u9879\u548C\u672A\u5B8C\u6210\u4E8B\u9879\u3002", linkLabel: "\u672C\u5468\u8FDB\u5EA6\u5171\u4EAB\u8868\u683C", linkNote: "\u6F14\u793A\u5360\u4F4D", actions: true }
      ],
      draft: "",
      running: false,
      focused: false,
      placeholder: "\u53D1\u6D88\u606F\u6216\u521B\u5EFA\u4EFB\u52A1... / \u4F7F\u7528\u6280\u80FD @ \u6DFB\u52A0\u8D44\u6599",
      environmentLabel: "\u672C\u5730\u7535\u8111",
      projectLabel: "\u9879\u76EE",
      permissionLabel: "\u5168\u90E8\u5141\u8BB8",
      modeLabel: "\u81EA\u52A8",
      effortLabel: "\u9AD8",
      workingLabel: "\u62DF\u5199\u6B63\u5F0F\u8FDB\u5EA6\u63D0\u9192\u901A\u77E5",
      homeTitle: "\u4ECA\u5929\u6709\u4EC0\u4E48\u5DE5\u4F5C\u8981\u5904\u7406\uFF1F",
      showHome: false
    },
    render(props, h) {
      const p = { ...this.defaults, ...props };
      const running = Boolean(p.composer?.running ?? p.running);
      const draft = str2(p.composer?.draft ?? p.draft);
      const requestedHeight = Number(p.composer?.height ?? p.composerHeight);
      const composerHeight = Number.isFinite(requestedHeight) && requestedHeight > 0 ? Math.max(103, Math.min(188, requestedHeight)) : draft.length > 45 || p.composer?.expanded ? 148 : 103;
      const messages = list2(p.messages);
      return `<section class="dbw-app${p.showSidebar === false ? " dbw-no-sidebar" : ""}${p.showSummary === false ? " dbw-no-summary" : ""}" data-state="${running ? "running" : "idle"}" data-simulation="true" style="--dbw-composer-height:${composerHeight}px">
      <div class="dbw-titlebar"><div class="dbw-simulation-label">${h.esc(p.simulationLabel || "\u754C\u9762\u590D\u523B \xB7 \u6848\u4F8B\u6F14\u793A")}</div>${windowControls(h)}</div>
      <div class="dbw-workbench">${p.showSidebar === false ? "" : sidebar4(p, h)}<main class="dbw-main"><header class="dbw-main-header"><span class="dbw-header-start">${h.icon("panel", 18)}${h.icon("edit", 17)}</span><div class="dbw-thread-title"><strong>${h.esc(p.title)}</strong><small>${h.esc(p.notice)}</small></div><span class="dbw-header-end">${h.icon("more", 18)}</span></header>
      <div class="dbw-conversation" data-part="viewport" data-motion="scroll"><div class="dbw-messages" data-part="message-list" data-motion="scroll">${p.showHome && !messages.length ? `<div class="dbw-home"><h2>${h.esc(p.homeTitle)}</h2></div>` : messages.map((item, index) => message3(item, index, h)).join("")}${running ? `<div class="dbw-working" data-part="status" data-state="running" data-motion="reveal">${h.esc(p.workingLabel)}<span class="dbw-static-dots">\xB7\xB7\xB7</span></div>` : ""}</div></div><div class="dbw-composer-anchor">${composer4(p, h)}</div></main>${p.showSummary === false ? "" : summaryPanel(p, h)}</div>
    </section>`;
    }
  }];

  // families/education-expanded.mjs
  var colors2 = ["#2563eb", "#5b8def", "#81c9b0", "#f0b35c", "#9b8bd1", "#87a1b9"];
  var list3 = (v, min = 1, max = 12) => {
    if (!Array.isArray(v) || v.length < min || v.length > max) throw Error(`\u9700\u8981 ${min}\u2013${max} \u9879\u6570\u636E`);
    return v;
  };
  var number4 = (v) => {
    const n3 = Number(v);
    if (!Number.isFinite(n3) || n3 < 0) throw Error("\u6570\u503C\u5FC5\u987B\u662F\u6709\u9650\u7684\u975E\u8D1F\u6570");
    return n3;
  };
  var svg = (body, view = "0 0 1120 460") => `<svg class="edx-svg" viewBox="${view}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  var txt3 = (h, x, y, text6, size = 20, anchor = "middle", color2 = "#243247") => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${color2}">${h.esc(text6)}</text>`;
  var line2 = (x1, y1, x2, y2, cls2 = "") => `<path ${cls2} d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="#b6c9e7" stroke-width="2"/>`;
  var node2 = (h, x, y, w, label2, detail = "", fill = "#eff5ff") => `<g data-motion="item"><rect x="${x - w / 2}" y="${y - 33}" width="${w}" height="66" rx="14" fill="${fill}" stroke="#bed1ef"/>${txt3(h, x, y - 2, label2, 21)}${txt3(h, x, y + 23, detail, 14, "middle", "#60748c")}</g>`;
  function shell3(p, h, body, cls2 = "") {
    return `<section class="edx-scene ${cls2}"><header><div><span class="edx-eyebrow">${h.esc(p.eyebrow)}</span><h1>${h.esc(p.title)}</h1><p>${h.esc(p.subtitle)}</p></div><b>${h.esc(p.badge)}</b></header><main>${body}</main><footer><span>${h.esc(p.note)}</span><b>EXPLAIN / ${h.esc(p.code)}</b></footer></section>`;
  }
  function make5(id, name, description, defaults3, render) {
    return { id, name, description, category: "\u539F\u521B\u8BB2\u89E3\u56FE\u5F62", width: 1280, height: 800, reference: { level: "designed", basis: "\u539F\u521B\u53EF\u7F16\u8F91\u4FE1\u606F\u56FE\uFF1B\u793A\u4F8B\u6570\u636E\u7528\u4E8E\u8BB2\u89E3\uFF0C\u4E0D\u4EE3\u8868\u4EA7\u54C1\u5B9E\u6D4B\u3002", source: "\u672C\u5DE5\u7A0B\u539F\u521B SVG / HTML" }, defaults: { eyebrow: "EXPLAIN / \u7ED3\u6784\u4E0E\u6570\u636E", title: name, subtitle: description, badge: "\u793A\u4F8B\u6570\u636E", note: "\u66FF\u6362\u5185\u5BB9\u540E\uFF0C\u56FE\u5F62\u4E0E\u6570\u503C\u4E00\u8D77\u66F4\u65B0\u3002", code: id.toUpperCase(), ...defaults3 }, render(p, h) {
      return render(p, h);
    } };
  }
  var components21 = [
    make5("donut-chart", "\u73AF\u5F62\u5360\u6BD4\u56FE", "\u628A\u6574\u4F53\u62C6\u6210\u51E0\u90E8\u5206\uFF0C\u540C\u65F6\u4FDD\u7559\u6570\u91CF\u4E0E\u767E\u5206\u6BD4\u3002", { title: "\u5236\u4F5C\u65F6\u95F4\u82B1\u5728\u4E86\u54EA\u91CC", items: [{ label: "\u5185\u5BB9\u7F16\u5BFC", value: 42 }, { label: "\u7D20\u6750\u51C6\u5907", value: 28 }, { label: "\u526A\u8F91\u4E0E\u52A8\u753B", value: 20 }, { label: "\u590D\u6838", value: 10 }], unit: "\u5C0F\u65F6" }, (p, h) => {
      const a = list3(p.items, 2, 6), sum = a.reduce((s, x) => s + number4(x.value), 0);
      if (!sum) throw Error("\u5360\u6BD4\u603B\u6570\u4E0D\u80FD\u4E3A\u96F6");
      let offset = 0;
      const ring = a.map((x, i) => {
        const fraction = x.value / sum, v = `<circle data-motion="segment" cx="290" cy="225" r="150" fill="none" stroke="${colors2[i]}" stroke-width="52" stroke-dasharray="${fraction * 942.4778} 942.4778" stroke-dashoffset="${-offset * 942.4778}" transform="rotate(-90 290 225)"/>`;
        offset += fraction;
        return v;
      }).join("");
      return shell3(p, h, svg(ring + txt3(h, 290, 224, sum, 52) + txt3(h, 290, 262, p.unit, 18, "middle", "#60748c") + a.map((x, i) => `<g data-motion="item"><rect x="605" y="${88 + i * 83}" width="14" height="14" rx="4" fill="${colors2[i]}"/>${txt3(h, 640, 103 + i * 83, x.label, 23, "start")}${txt3(h, 1010, 103 + i * 83, `${x.value} \xB7 ${(x.value / sum * 100).toFixed(0)}%`, 22, "end")}</g>`).join("")));
    }),
    make5("scatter-plot", "\u6563\u70B9\u5173\u7CFB\u56FE", "\u7528\u4E8C\u7EF4\u5750\u6807\u540C\u65F6\u6BD4\u8F83\u4E24\u4E2A\u53D8\u91CF\uFF0C\u4FDD\u7559\u6BCF\u4E2A\u5BF9\u8C61\u7684\u4F4D\u7F6E\u3002", { title: "\u6295\u5165\u4E0E\u7ED3\u679C\u600E\u6837\u4E00\u8D77\u53D8\u5316", xLabel: "\u51C6\u5907\u65F6\u95F4 / \u5C0F\u65F6", yLabel: "\u5B8C\u6210\u5EA6 / %", xMax: 10, yMax: 100, points: [{ label: "A", x: 2, y: 34 }, { label: "B", x: 3.5, y: 48 }, { label: "C", x: 5, y: 63 }, { label: "D", x: 6.7, y: 79 }, { label: "E", x: 8.6, y: 87 }], note: "\u793A\u4F8B\u5173\u7CFB\u4E0D\u4EE3\u8868\u56E0\u679C\u7ED3\u8BBA\u3002" }, (p, h) => {
      const a = list3(p.points, 2, 12), xm = number4(p.xMax), ym = number4(p.yMax);
      if (!xm || !ym || a.some((x) => number4(x.x) > xm || number4(x.y) > ym)) throw Error("\u70B9\u5750\u6807\u5FC5\u987B\u5728\u6B63\u6570\u5750\u6807\u4E0A\u9650\u5185");
      let grid = "";
      for (let i = 0; i <= 5; i++) grid += line2(100, 370 - i * 62, 1020, 370 - i * 62) + txt3(h, 78, 377 - i * 62, ym * i / 5, 15, "end") + txt3(h, 100 + i * 184, 404, xm * i / 5, 15);
      return shell3(p, h, svg(grid + txt3(h, 560, 448, p.xLabel, 18) + txt3(h, 102, 34, p.yLabel, 18, "start") + a.map((x, i) => `<g data-motion="point"><circle cx="${100 + x.x / xm * 920}" cy="${370 - x.y / ym * 310}" r="12" fill="${colors2[i % 6]}" opacity=".85"/>${txt3(h, 100 + x.x / xm * 920, 349 - x.y / ym * 310, x.label, 17)}</g>`).join("")));
    }),
    make5("heatmap", "\u5F3A\u5EA6\u70ED\u529B\u56FE", "\u7528\u7EDF\u4E00\u8272\u9636\u5B9A\u4F4D\u9AD8\u4F4E\u503C\uFF0C\u9002\u5408\u6BD4\u8F83\u65F6\u95F4\u6BB5\u548C\u7C7B\u522B\u3002", { title: "\u4E0D\u540C\u73AF\u8282\u7684\u5DE5\u4F5C\u91CF\u5206\u5E03", columns: ["\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94"], rows: [{ label: "\u7F16\u5BFC", values: [8, 6, 3, 2, 1] }, { label: "\u7D20\u6750", values: [2, 7, 8, 4, 2] }, { label: "\u5236\u4F5C", values: [1, 3, 6, 9, 7] }, { label: "\u590D\u6838", values: [0, 1, 2, 4, 8] }], max: 10 }, (p, h) => {
      const cols = list3(p.columns, 2, 7), rows2 = list3(p.rows, 2, 5), max = number4(p.max);
      if (!max) throw Error("max \u5FC5\u987B\u5927\u4E8E\u96F6");
      const w = 880 / cols.length, ht = 300 / rows2.length;
      return shell3(p, h, svg(cols.map((x, i) => txt3(h, 195 + (i + 0.5) * w, 48, x, 18)).join("") + rows2.map((r, j) => {
        if (list3(r.values).length !== cols.length) throw Error("\u6BCF\u884C\u6570\u503C\u9700\u4E0E\u5217\u6570\u4E00\u81F4");
        return txt3(h, 156, 85 + (j + 0.5) * ht, r.label, 20, "end") + r.values.map((v, i) => {
          const z = number4(v) / max;
          if (z > 1) throw Error("\u6570\u503C\u4E0D\u80FD\u8D85\u8FC7 max");
          return `<g data-motion="cell"><rect x="${197 + i * w}" y="${64 + j * ht}" width="${w - 7}" height="${ht - 7}" rx="7" fill="rgb(${Math.round(239 - 202 * z)},${Math.round(245 - 146 * z)},${Math.round(255 - 20 * z)})"/>${txt3(h, 195 + (i + 0.5) * w, 62 + (j + 0.6) * ht, v, 22, "middle", z > 0.6 ? "#fff" : "#24456c")}</g>`;
        }).join("");
      }).join("") + Array.from({ length: 10 }, (_, i) => `<rect x="${400 + i * 30}" y="404" width="30" height="13" fill="rgb(${239 - i * 20},${245 - i * 14},${255 - i * 2})"/>`).join("") + txt3(h, 360, 417, "\u4F4E", 16) + txt3(h, 738, 417, "\u9AD8", 16)));
    }),
    make5("funnel-chart", "\u8F6C\u5316\u6F0F\u6597\u56FE", "\u6309\u9636\u6BB5\u5BBD\u5EA6\u5C55\u793A\u6570\u91CF\u9012\u51CF\uFF0C\u8BFB\u51FA\u6BCF\u4E00\u6B65\u7684\u8F6C\u5316\u3002", { title: "\u4ECE\u5019\u9009\u5230\u6700\u7EC8\u6210\u7247", stages: [{ label: "\u6536\u96C6\u7D20\u6750", value: 120 }, { label: "\u7B5B\u9009\u53EF\u7528", value: 84 }, { label: "\u8FDB\u5165\u5206\u955C", value: 48 }, { label: "\u6700\u7EC8\u91C7\u7528", value: 30 }], unit: "\u4EFD" }, (p, h) => {
      const a = list3(p.stages, 2, 5), max = number4(a[0].value);
      if (!max || a.some((x, i) => number4(x.value) > (i ? a[i - 1].value : max))) throw Error("\u6F0F\u6597\u6570\u503C\u987B\u6309\u975E\u589E\u987A\u5E8F\u6392\u5217");
      return shell3(p, h, svg(a.map((x, i) => {
        const width = 640 * x.value / max, x0 = 425 - width / 2, y = 30 + i * 96;
        return `<g data-motion="item"><rect data-motion="bar" x="${x0}" y="${y}" width="${width}" height="72" rx="12" fill="${colors2[i]}"/>${txt3(h, 425, y + 45, `${x.label}  ${x.value}`, 23, "middle", "#fff")}${txt3(h, 880, y + 45, `${(x.value / max * 100).toFixed(0)}%`, 28)}${i ? txt3(h, 1030, y + 44, `\u4E0A\u6B65 ${(x.value / a[i - 1].value * 100).toFixed(0)}%`, 16) : ""}</g>`;
      }).join("")));
    }),
    make5("radar-chart", "\u591A\u7EF4\u96F7\u8FBE\u56FE", "\u5728\u76F8\u540C\u91CF\u5C3A\u4E0A\u6BD4\u8F83\u591A\u4E2A\u80FD\u529B\u7EF4\u5EA6\uFF0C\u8F6E\u5ED3\u4E0E\u5206\u503C\u5BF9\u5E94\u3002", { title: "\u4E0D\u540C\u65B9\u6848\u7684\u80FD\u529B\u8F6E\u5ED3", max: 100, axes: ["\u51C6\u786E\u6027", "\u901F\u5EA6", "\u53EF\u7F16\u8F91", "\u4E00\u81F4\u6027", "\u6210\u672C\u63A7\u5236"], values: [90, 70, 94, 82, 68], caption: "\u65B9\u6848 A \xB7 \u793A\u4F8B\u8BC4\u5206" }, (p, h) => {
      const a = list3(p.axes, 3, 7);
      if (list3(p.values).length !== a.length) throw Error("axes \u4E0E values \u957F\u5EA6\u4E0D\u4E00\u81F4");
      const max = number4(p.max);
      if (!max || p.values.some((x) => number4(x) > max)) throw Error("\u8BC4\u5206\u8D85\u51FA\u91CF\u5C3A");
      const point2 = (i, r) => [470 + Math.sin(i / a.length * Math.PI * 2) * r, 230 - Math.cos(i / a.length * Math.PI * 2) * r];
      return shell3(p, h, svg([0.25, 0.5, 0.75, 1].map((v) => `<polygon points="${a.map((_, i) => point2(i, 175 * v).join(",")).join(" ")}" fill="none" stroke="#d5e0ef"/>`).join("") + a.map((x, i) => {
        const [x1, y1] = point2(i, 175), [x2, y2] = point2(i, 211);
        return line2(470, 230, x1, y1) + txt3(h, x2, y2, x, 19);
      }).join("") + `<polygon data-motion="radar" points="${p.values.map((v, i) => point2(i, 175 * v / max).join(",")).join(" ")}" fill="#2563eb25" stroke="#2563eb" stroke-width="3"/>` + p.values.map((v, i) => {
        const [x, y] = point2(i, 175 * v / max);
        return `<circle data-motion="point" cx="${x}" cy="${y}" r="5" fill="#2563eb"/>`;
      }).join("") + txt3(h, 955, 130, p.caption, 22) + a.map((x, i) => txt3(h, 955, 178 + i * 41, `${x}  ${p.values[i]}`, 19)).join("")));
    }),
    make5("pyramid-diagram", "\u5C42\u7EA7\u91D1\u5B57\u5854", "\u7528\u5C42\u7EA7\u5173\u7CFB\u89E3\u91CA\u4ECE\u57FA\u7840\u5230\u5E94\u7528\u7684\u7EC4\u7EC7\u65B9\u5F0F\u3002", { title: "\u80FD\u529B\u662F\u600E\u6837\u5C42\u5C42\u5EFA\u7ACB\u7684", layers: [{ label: "\u5E94\u7528\u5B9E\u8DF5", detail: "\u9762\u5BF9\u771F\u5B9E\u95EE\u9898" }, { label: "\u65B9\u6CD5\u4E0E\u6D41\u7A0B", detail: "\u628A\u7ECF\u9A8C\u53D8\u6210\u6B65\u9AA4" }, { label: "\u6982\u5FF5\u7406\u89E3", detail: "\u77E5\u9053\u4E3A\u4EC0\u4E48" }, { label: "\u57FA\u7840\u77E5\u8BC6", detail: "\u5EFA\u7ACB\u5171\u540C\u8BED\u8A00" }], note: "\u56FE\u5F62\u8868\u8FBE\u5C42\u7EA7\u5173\u7CFB\uFF0C\u4E0D\u4EE5\u9762\u79EF\u8868\u793A\u6570\u91CF\u3002" }, (p, h) => {
      const a = list3(p.layers, 3, 5), top = 25, step = 390 / a.length;
      return shell3(p, h, svg(a.map((x, i) => {
        const wt = 30 + i * 140, wb = 30 + (i + 1) * 140, y = top + i * step;
        return `<g data-motion="item"><path d="M${400 - wt / 2} ${y}H${400 + wt / 2}L${400 + wb / 2} ${y + step - 6}H${400 - wb / 2}Z" fill="${colors2[i]}"/>${line2(400 + wb / 2 + 15, y + step / 2, 820, y + step / 2)}${txt3(h, 850, y + step / 2 - 5, x.label, 23, "start")}${txt3(h, 850, y + step / 2 + 23, x.detail, 16, "start", "#667b94")}</g>`;
      }).join("")));
    }),
    make5("venn-diagram", "\u4EA4\u96C6\u5173\u7CFB\u56FE", "\u7528\u4E24\u4E2A\u96C6\u5408\u53CA\u5171\u540C\u533A\u57DF\u89E3\u91CA\u6982\u5FF5\u4E4B\u95F4\u7684\u5173\u7CFB\u3002", { title: "\u597D\u5185\u5BB9\u6765\u81EA\u4E24\u4E2A\u6761\u4EF6\u7684\u4EA4\u96C6", left: "\u503C\u5F97\u8BB2", right: "\u8BB2\u5F97\u6E05", overlap: "\u89C2\u4F17\u80FD\u7528", leftDetail: "\u95EE\u9898\u771F\u5B9E \xB7 \u6709\u65B0\u4FE1\u606F", rightDetail: "\u7ED3\u6784\u6E05\u695A \xB7 \u8BC1\u636E\u53EF\u89C1", note: "\u793A\u610F\u96C6\u5408\u5173\u7CFB\uFF0C\u5706\u5F62\u9762\u79EF\u4E0D\u4EE3\u8868\u6837\u672C\u91CF\u3002" }, (p, h) => shell3(p, h, svg(`<g data-motion="item"><circle cx="425" cy="218" r="166" fill="#2563eb17" stroke="#6a98e9" stroke-width="2"/>${txt3(h, 339, 205, p.left, 30)}${txt3(h, 339, 246, p.leftDetail, 16)}</g><g data-motion="item"><circle cx="683" cy="218" r="166" fill="#81c9b030" stroke="#63b99c" stroke-width="2"/>${txt3(h, 769, 205, p.right, 30)}${txt3(h, 769, 246, p.rightDetail, 16)}</g><g data-motion="focus"><rect x="477" y="193" width="154" height="54" rx="27" fill="#fff" stroke="#b8cce5"/>${txt3(h, 554, 227, p.overlap, 23)}</g>`))),
    make5("mind-map", "\u653E\u5C04\u601D\u7EF4\u5BFC\u56FE", "\u56F4\u7ED5\u4E00\u4E2A\u4E3B\u9898\u5C55\u5F00\u5206\u652F\uFF0C\u9002\u5408\u9009\u9898\u62C6\u89E3\u548C\u77E5\u8BC6\u7EC4\u7EC7\u3002", { title: "\u5148\u628A\u4E00\u4E2A\u4E3B\u9898\u5C55\u5F00", center: "\u79D1\u666E\u89C6\u9891", branches: [{ title: "\u95EE\u9898", detail: "\u89C2\u4F17\u4E3A\u4EC0\u4E48\u5173\u5FC3" }, { title: "\u8BC1\u636E", detail: "\u80FD\u770B\u89C1\u7684\u4F8B\u5B50" }, { title: "\u7ED3\u6784", detail: "\u94A9\u5B50\u3001\u6B63\u6587\u3001\u7ED3\u5C3E" }, { title: "\u7D20\u6750", detail: "\u5F55\u5C4F\u3001\u56FE\u89E3\u3001\u5B9E\u62CD" }, { title: "\u8BB2\u7A3F", detail: "\u4E00\u53E5\u8BDD\u4E00\u4E2A\u610F\u601D" }, { title: "\u590D\u6838", detail: "\u4E8B\u5B9E\u3001\u53EF\u8BFB\u6027\u3001\u58F0\u97F3" }] }, (p, h) => {
      const a = list3(p.branches, 3, 6), coords = [[240, 66], [860, 66], [103, 230], [997, 230], [240, 397], [860, 397]];
      return shell3(p, h, svg(a.map((x, i) => {
        const [x1, y] = coords[i];
        return `<path data-motion="line" d="M560 230Q${x1} 230 ${x1} ${y}" fill="none" stroke="#9dbbec" stroke-width="3"/>`;
      }).join("") + node2(h, 560, 230, 230, p.center, "\u4E3B\u9898", "#dceaff") + a.map((x, i) => node2(h, ...coords[i], 218, x.title, x.detail, i % 2 ? "#eff8f4" : "#f1f5fc")).join("")));
    }),
    make5("cycle-diagram", "\u5FAA\u73AF\u53CD\u9988\u56FE", "\u628A\u6267\u884C\u3001\u89C2\u5BDF\u4E0E\u4FEE\u6B63\u8FDE\u63A5\u6210\u53EF\u91CD\u590D\u7684\u5FAA\u73AF\u3002", { title: "\u4E00\u6B21\u6539\u8FDB\uFF0C\u6765\u81EA\u4E00\u8F6E\u53CD\u9988", center: "\u6301\u7EED\u8FED\u4EE3", steps: [{ title: "\u63D0\u51FA\u5047\u8BBE", detail: "\u5199\u6E05\u9884\u671F" }, { title: "\u6267\u884C\u5B9E\u9A8C", detail: "\u4FDD\u6301\u6761\u4EF6" }, { title: "\u89C2\u5BDF\u7ED3\u679C", detail: "\u8BB0\u5F55\u8BC1\u636E" }, { title: "\u4FEE\u6B63\u65B9\u6CD5", detail: "\u8FDB\u5165\u4E0B\u4E00\u8F6E" }] }, (p, h) => {
      const a = list3(p.steps, 4, 4), pos = [[560, 58], [900, 228], [560, 403], [220, 228]], mark = h.uid("cycle-arrow");
      return shell3(p, h, svg(`<defs><marker id="${mark}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 7 4 0 8" fill="#719ddd"/></marker></defs>` + ["M650 75Q810 70 880 174", "M884 279Q805 395 665 396", "M459 396Q300 389 235 284", "M230 176Q300 66 455 70"].map((d) => `<path data-motion="line" d="${d}" fill="none" stroke="#719ddd" stroke-width="3" marker-end="url(#${mark})"/>`).join("") + txt3(h, 560, 238, p.center, 32) + a.map((x, i) => node2(h, ...pos[i], 230, x.title, x.detail)).join("")));
    }),
    make5("decision-tree", "\u51B3\u7B56\u6811", "\u628A\u6761\u4EF6\u3001\u5206\u652F\u4E0E\u7ED3\u679C\u5206\u5F00\uFF0C\u9002\u5408\u89E3\u91CA\u9009\u62E9\u903B\u8F91\u3002", { title: "\u8FD9\u6BB5\u5185\u5BB9\uFF0C\u9002\u5408\u4EC0\u4E48\u753B\u9762", question: "\u9700\u8981\u8BC1\u660E\u771F\u5B9E\u64CD\u4F5C\u5417\uFF1F", yes: "\u771F\u5B9E\u5F55\u5C4F", no: "\u9700\u8981\u89E3\u91CA\u62BD\u8C61\u5173\u7CFB\u5417\uFF1F", yes2: "\u539F\u751F\u56FE\u89E3", no2: "\u5B9E\u62CD / \u56FE\u7247", yesLabel: "\u662F", noLabel: "\u5426" }, (p, h) => shell3(p, h, svg(`<path data-motion="line" d="M560 94V151H277V220M560 151H837V220M837 286V342H652V388M837 342H1010V388" fill="none" stroke="#88aadd" stroke-width="3"/>` + node2(h, 560, 62, 324, p.question) + node2(h, 277, 252, 232, p.yes, "\u4FDD\u7559\u53EF\u9A8C\u8BC1\u7684\u8FC7\u7A0B", "#eaf7f0") + node2(h, 837, 252, 310, p.no) + node2(h, 652, 416, 225, p.yes2) + node2(h, 1010, 416, 211, p.no2) + txt3(h, 300, 142, p.yesLabel, 18) + txt3(h, 810, 142, p.noLabel, 18) + txt3(h, 675, 334, p.yesLabel, 18) + txt3(h, 998, 334, p.noLabel, 18)))),
    make5("architecture-map", "\u7CFB\u7EDF\u67B6\u6784\u56FE", "\u5C06\u5165\u53E3\u3001\u670D\u52A1\u4E0E\u5B58\u50A8\u5206\u5C42\uFF0C\u8FDE\u7EBF\u8868\u8FBE\u6570\u636E\u6D41\u5411\u3002", { title: "\u4E00\u6B21\u8BF7\u6C42\uFF0C\u7ECF\u8FC7\u54EA\u4E9B\u5C42", layers: [{ name: "\u63A5\u5165\u5C42", items: ["\u6D4F\u89C8\u5668", "\u79FB\u52A8\u5BA2\u6237\u7AEF", "\u81EA\u52A8\u5316\u4EFB\u52A1"] }, { name: "\u670D\u52A1\u5C42", items: ["\u8BF7\u6C42\u9A8C\u8BC1", "\u4EFB\u52A1\u5904\u7406", "\u7ED3\u679C\u6574\u7406"] }, { name: "\u6570\u636E\u5C42", items: ["\u9879\u76EE\u6587\u4EF6", "\u8D44\u6599\u7D22\u5F15", "\u6267\u884C\u8BB0\u5F55"] }] }, (p, h) => {
      const a = list3(p.layers, 3, 3);
      return shell3(p, h, svg(a.map((r, j) => `<rect x="95" y="${24 + j * 142}" width="1010" height="111" rx="14" fill="${j === 1 ? "#f1f6ff" : "#f6f8fb"}"/>${txt3(h, 64, 88 + j * 142, r.name, 19)}${list3(r.items, 3, 3).map((x, i) => node2(h, 290 + i * 330, 78 + j * 142, 253, x, "", j === 1 ? "#e2edff" : "#fff")).join("")}`).join("") + [0, 1].map((j) => [290, 620, 950].map((x) => `<path data-motion="line" d="M${x} ${111 + j * 142}v76" stroke="#94afda" stroke-width="2" stroke-dasharray="5 5"/>`).join("")).join("")));
    }),
    make5("swimlane-flow", "\u804C\u8D23\u6CF3\u9053\u56FE", "\u6309\u89D2\u8272\u6392\u5217\u52A8\u4F5C\uFF0C\u7A81\u51FA\u4EA4\u63A5\u70B9\u4E0E\u8D23\u4EFB\u8FB9\u754C\u3002", { title: "\u4ECE\u9009\u9898\u5230\u4EA4\u4ED8\uFF0C\u8C01\u8D1F\u8D23\u54EA\u4E00\u6B65", lanes: [{ name: "\u7F16\u5BFC", tasks: [{ title: "\u786E\u8BA4\u95EE\u9898", column: 0 }, { title: "\u6574\u7406\u8BB2\u7A3F", column: 1 }] }, { name: "\u5236\u4F5C", tasks: [{ title: "\u51C6\u5907\u7D20\u6750", column: 2 }, { title: "\u7EC4\u5408\u753B\u9762", column: 3 }] }, { name: "\u590D\u6838", tasks: [{ title: "\u6821\u5BF9\u4E0E\u53CD\u9988", column: 4 }] }] }, (p, h) => {
      const a = list3(p.lanes, 3, 3), xs = [231, 425, 619, 813, 1007], route = a.flatMap((r, j) => r.tasks.map((t) => ({ x: xs[t.column], y: 94 + j * 135, column: t.column }))).sort((a2, b) => a2.column - b.column);
      if (new Set(route.map((t) => t.column)).size !== route.length) throw Error("\u6BCF\u4E2A\u6B65\u9AA4\u8BF7\u4F7F\u7528\u4E00\u4E2A\u4E0D\u540C\u7684 column");
      const links = route.slice(1).map((b, i) => {
        const a2 = route[i], mx = (a2.x + b.x) / 2;
        return `M${a2.x + 82} ${a2.y}H${mx}V${b.y}H${b.x - 82}`;
      }).join("");
      return shell3(p, h, svg(a.map((r, j) => `<rect x="0" y="${30 + j * 135}" width="1120" height="127" rx="10" fill="${j % 2 ? "#f7f9fc" : "#edf3fa"}"/>${txt3(h, 61, 103 + j * 135, r.name, 23)}${list3(r.tasks, 1, 5).map((t) => {
        if (!Number.isInteger(t.column) || t.column < 0 || t.column > 4) throw Error("column \u8303\u56F4 0\u20134");
        return node2(h, xs[t.column], 94 + j * 135, 164, t.title);
      }).join("")}`).join("") + `<path data-motion="line" d="${links}" fill="none" stroke="#79a1dc" stroke-width="3"/>`));
    }),
    make5("kanban-board", "\u4EFB\u52A1\u770B\u677F", "\u8BA9\u4EFB\u52A1\u6309\u72B6\u6001\u5206\u7EC4\uFF0C\u7528\u5361\u7247\u4F4D\u7F6E\u89E3\u91CA\u5DE5\u4F5C\u6D41\u3002", { title: "\u628A\u4E0B\u4E00\u6B65\u653E\u5230\u770B\u5F97\u89C1\u7684\u4F4D\u7F6E", columns: [{ name: "\u5F85\u5F00\u59CB", tasks: [{ title: "\u6574\u7406\u8D44\u6599", tag: "\u5185\u5BB9" }, { title: "\u786E\u8BA4\u5F15\u7528", tag: "\u6838\u5BF9" }] }, { name: "\u8FDB\u884C\u4E2D", tasks: [{ title: "\u5236\u4F5C\u7B2C\u4E00\u6BB5", tag: "\u5236\u4F5C" }, { title: "\u5F55\u5236\u64CD\u4F5C", tag: "\u5F55\u5C4F" }] }, { name: "\u5DF2\u5B8C\u6210", tasks: [{ title: "\u786E\u5B9A\u4E3B\u9898", tag: "\u5185\u5BB9" }] }] }, (p, h) => shell3(p, h, `<div class="edx-board">${list3(p.columns, 3, 3).map((c, i) => `<section><h2><i style="background:${colors2[i]}"></i>${h.esc(c.name)}<small>${c.tasks.length}</small></h2>${list3(c.tasks, 1, 4).map((t, j) => `<article data-motion="item"><span class="edx-task-tag">${h.esc(t.tag)}</span><h3>${h.esc(t.title)}</h3><p>\u89C6\u9891\u5236\u4F5C / ${String(j + 1).padStart(2, "0")}</p><div class="edx-task-bottom"><span>\u25F7 \u672C\u5468</span><b>\u6797</b></div></article>`).join("")}</section>`).join("")}</div>`)),
    make5("roadmap", "\u9879\u76EE\u8DEF\u7EBF\u56FE", "\u901A\u8FC7\u65F6\u95F4\u533A\u95F4\u5C55\u793A\u5E76\u884C\u4EFB\u52A1\uFF0C\u9002\u5408\u5236\u4F5C\u8BA1\u5212\u548C\u91CC\u7A0B\u7891\u3002", { title: "\u56DB\u5468\u5B8C\u6210\u4E00\u8F6E\u5185\u5BB9\u5236\u4F5C", weeks: ["\u7B2C 1 \u5468", "\u7B2C 2 \u5468", "\u7B2C 3 \u5468", "\u7B2C 4 \u5468"], tasks: [{ label: "\u7F16\u5BFC\u4E0E\u8D44\u6599", start: 0, end: 1.5 }, { label: "\u5F55\u5C4F\u4E0E\u7D20\u6750", start: 1, end: 2.7 }, { label: "\u526A\u8F91\u4E0E\u52A8\u753B", start: 1.8, end: 3.5 }, { label: "\u590D\u6838\u4E0E\u4EA4\u4ED8", start: 3, end: 4 }] }, (p, h) => {
      const a = list3(p.tasks, 2, 5), weeks = list3(p.weeks, 4, 4);
      return shell3(p, h, svg(weeks.map((w, i) => txt3(h, 275 + i * 230, 38, w, 19) + line2(160 + i * 230, 59, 160 + i * 230, 426)).join("") + line2(1080, 59, 1080, 426) + a.map((x, i) => {
        if (number4(x.start) >= number4(x.end) || x.end > 4) throw Error("\u4EFB\u52A1\u533A\u95F4\u987B\u5728 0\u20134 \u5185");
        return txt3(h, 135, 115 + i * 84, x.label, 18, "end") + `<g data-motion="item"><rect data-motion="bar" x="${160 + x.start * 230}" y="${82 + i * 84}" width="${(x.end - x.start) * 230}" height="50" rx="9" fill="${colors2[i]}"/>${txt3(h, 170 + x.start * 230, 114 + i * 84, `${Number((x.end - x.start).toFixed(2))} \u5468`, 18, "start", "#fff")}</g>`;
      }).join("")));
    }),
    make5("formula-breakdown", "\u516C\u5F0F\u62C6\u89E3", "\u9010\u9879\u89E3\u91CA\u516C\u5F0F\u7684\u8F93\u5165\u4E0E\u542B\u4E49\uFF0C\u518D\u7ED9\u51FA\u4E00\u6B21\u6F14\u7B97\u3002", { title: "\u628A\u516C\u5F0F\u53D8\u6210\u53EF\u4EE5\u7406\u89E3\u7684\u6B65\u9AA4", terms: [{ symbol: "\u901F\u5EA6", meaning: "\u5355\u4F4D\u65F6\u95F4\u5B8C\u6210\u91CF", value: "24 \u4E2A / \u5C0F\u65F6" }, { symbol: "\u65F6\u95F4", meaning: "\u5B9E\u9645\u6295\u5165\u65F6\u957F", value: "3 \u5C0F\u65F6" }, { symbol: "\u4EA7\u51FA", meaning: "\u5B8C\u6210\u7684\u603B\u6570\u91CF", value: "72 \u4E2A" }], operators: ["\xD7", "="], note: "\u6F14\u7B97\u7528\u4E8E\u8BF4\u660E\u5173\u7CFB\uFF0C\u4E0D\u662F\u5B9E\u9645\u751F\u4EA7\u6548\u7387\u627F\u8BFA\u3002" }, (p, h) => {
      const a = list3(p.terms, 3, 3);
      return shell3(p, h, `<div class="edx-formula">${a.map((x, i) => `<article data-motion="item"><b data-motion="emphasis">${h.esc(x.symbol)}</b><div class="edx-formula-rule"></div><p>${h.esc(x.meaning)}</p><strong data-motion="focus">${h.esc(x.value)}</strong></article>${i < 2 ? `<span>${h.esc(p.operators[i])}</span>` : ""}`).join("")}</div>`);
    }),
    make5("spectrum-scale", "\u8FDE\u7EED\u5C3A\u5EA6\u56FE", "\u5728\u8FDE\u7EED\u8303\u56F4\u4E0A\u5B9A\u4F4D\u591A\u4E2A\u5BF9\u8C61\uFF0C\u907F\u514D\u975E\u9ED1\u5373\u767D\u7684\u5206\u7C7B\u3002", { title: "\u81EA\u52A8\u5316\u662F\u4E00\u6761\u8FDE\u7EED\u7684\u5C3A\u5EA6", left: "\u66F4\u591A\u4EBA\u5DE5\u5224\u65AD", right: "\u66F4\u591A\u81EA\u52A8\u6267\u884C", markers: [{ label: "\u4EBA\u5DE5\u6574\u7406", value: 15 }, { label: "\u8F85\u52A9\u751F\u6210", value: 42 }, { label: "\u89C4\u5219\u6D41\u7A0B", value: 70 }, { label: "\u81EA\u52A8\u6279\u5904\u7406", value: 91 }] }, (p, h) => {
      const a = list3(p.markers, 2, 6);
      return shell3(p, h, svg(`<defs><linearGradient id="${h.uid("spectrum")}"><stop stop-color="#dce8fb"/><stop offset=".5" stop-color="#709bea"/><stop offset="1" stop-color="#81c9b0"/></linearGradient></defs><rect x="75" y="219" width="970" height="38" rx="19" fill="url(#${h.uid("spectrum")})"/>` + a.map((x, i) => {
        const v = number4(x.value);
        if (v > 100) throw Error("value \u987B\u5728 0\u2013100");
        const xx = 75 + v / 100 * 970, top = i % 2 === 0;
        return `<g data-motion="point">${line2(xx, top ? 152 : 257, xx, top ? 219 : 326)}<circle cx="${xx}" cy="238" r="10" fill="#fff" stroke="#386dbc" stroke-width="3"/>${txt3(h, xx, top ? 133 : 356, x.label, 20)}${txt3(h, xx, top ? 104 : 388, v, 18, "middle", "#6c80a0")}</g>`;
      }).join("") + txt3(h, 75, 437, p.left, 19, "start") + txt3(h, 1045, 437, p.right, 19, "end")));
    }),
    make5("process-steps", "\u6A2A\u5411\u6B65\u9AA4\u8BF4\u660E", "\u7ED9\u6BCF\u4E00\u6B65\u5206\u914D\u7F16\u53F7\u3001\u52A8\u4F5C\u4E0E\u7ED3\u679C\uFF0C\u9002\u5408\u64CD\u4F5C\u6559\u5B66\u3002", { title: "\u5148\u7ED9\u5185\u5BB9\uFF0C\u518D\u5F97\u5230\u53EF\u5236\u4F5C\u7684\u5206\u955C", steps: [{ title: "\u8F93\u5165\u4E3B\u9898", detail: "\u95EE\u9898\u4E0E\u53D7\u4F17", result: "\u660E\u786E\u76EE\u6807" }, { title: "\u7F16\u6392\u7ED3\u6784", detail: "\u94A9\u5B50\u4E0E\u6B63\u6587", result: "\u5F62\u6210\u8BB2\u7A3F" }, { title: "\u5B89\u6392\u753B\u9762", detail: "\u5F55\u5C4F\u4E0E\u56FE\u89E3", result: "\u5F97\u5230\u5206\u955C" }, { title: "\u68C0\u67E5\u4EA4\u4ED8", detail: "\u4E8B\u5B9E\u4E0E\u8282\u594F", result: "\u53EF\u8FDB\u5165\u5236\u4F5C" }] }, (p, h) => shell3(p, h, `<div class="edx-steps">${list3(p.steps, 3, 5).map((x, i) => `<article data-motion="item"><b class="edx-step-number">${String(i + 1).padStart(2, "0")}</b><h2>${h.esc(x.title)}</h2><p>${h.esc(x.detail)}</p><div class="edx-step-result" data-motion="focus">${h.esc(x.result)}</div>${i < p.steps.length - 1 ? '<span class="edx-step-arrow">\u2192</span>' : ""}</article>`).join("")}</div>`)),
    make5("lecture-stage", "\u52A8\u6001\u8BFE\u4EF6\u8BB2\u89E3\u821E\u53F0", "\u771F\u5B9E PPT\u3001\u5F55\u5C4F\u6216\u539F\u751F\u56FE\u89E3\u7684\u7EDF\u4E00\u821E\u53F0\uFF0C\u80CC\u666F\u4E0E\u4E3B\u4F53\u5206\u522B\u8FD0\u52A8\u3002", { eyebrow: "COURSE / 01", title: "\u8BA9\u5185\u5BB9\u7A33\u5B9A\uFF0C\u8BA9\u80CC\u666F\u4FDD\u6301\u547C\u5438", subtitle: "\u771F\u5B9E\u7D20\u6750\u53EF\u4EE5\u76F4\u63A5\u653E\u8FDB\u8FD9\u4E2A\u4F4D\u7F6E", badge: "\u8BFE\u4EF6\u821E\u53F0", media: { kind: "image", src: "", fit: "contain" }, chapter: "01 / \u4E3A\u4EC0\u4E48\u8981\u62C6\u5206\u4EFB\u52A1", sections: [{ title: "\u8D44\u6599", detail: "\u7ED9\u51FA\u5DF2\u77E5\u4E8B\u5B9E\u548C\u53C2\u8003\u4F9D\u636E" }, { title: "\u76EE\u6807", detail: "\u5199\u6E05\u8981\u5B8C\u6210\u7684\u7ED3\u679C" }, { title: "\u9A8C\u8BC1", detail: "\u68C0\u67E5\u7ED3\u679C\u662F\u5426\u7B26\u5408\u8981\u6C42" }], caption: "\u80CC\u666F\u8D1F\u8D23\u6C1B\u56F4\uFF0C\u4E3B\u4F53\u8D1F\u8D23\u6E05\u695A\u5730\u4F20\u8FBE\u3002" }, (p, h) => {
      const m = p.media || {};
      if (m.src && (/^(?:[a-z]+:|\/\/)/i.test(m.src) || m.src.includes(".."))) throw Error("\u7D20\u6750\u987B\u4F7F\u7528\u672C\u5730\u76F8\u5BF9\u8DEF\u5F84");
      const body = m.src ? m.kind === "video" ? `<video id="${h.uid("lecture-media")}" src="${h.esc(m.src)}" muted playsinline style="object-fit:${m.fit === "cover" ? "cover" : "contain"}"></video>` : `<img src="${h.esc(m.src)}" alt="\u8BFE\u4EF6\u7D20\u6750" style="object-fit:${m.fit === "cover" ? "cover" : "contain"}">` : `<div class="edx-lesson-native"><span>${h.esc(p.chapter)}</span><h1>${h.esc(p.title)}</h1><p>${h.esc(p.subtitle)}</p><div>${list3(p.sections, 2, 4).map((x, i) => `<article data-motion="item"><b>${String(i + 1).padStart(2, "0")}</b><h2>${h.esc(x.title)}</h2><p>${h.esc(x.detail)}</p></article>`).join("")}</div></div>`;
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
    const path = String(value || "");
    if (/^(?:[a-z]+:|\/\/)/i.test(path) || path.includes("..") || /[\u0000-\u001f]/.test(path)) throw new Error("mediaSrc must be a local relative media path");
    return path;
  };
  var tick2 = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4.5 10 3.4 3.4 7.6-7.1" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var arrow2 = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function shell4(p, h, body, extra2 = "") {
    const e = h.esc;
    return '<section class="edu-scene ' + extra2 + '"><header class="edu-header"><div><div class="edu-eyebrow">' + e(p.eyebrow) + "</div><h1>" + e(p.title) + "</h1><p>" + e(p.subtitle) + '</p></div><span class="edu-edition">' + e(p.badge) + '</span></header><main class="edu-body">' + body + '</main><footer class="edu-footer"><span>' + e(p.footer) + '</span><span class="edu-footer-mark"><i></i>' + e(p.series) + "</span></footer></section>";
  }
  var base = {
    eyebrow: "\u53EF\u590D\u7528\u8BB2\u89E3\u7EC4\u4EF6",
    title: "",
    subtitle: "",
    badge: "\u793A\u4F8B\u5185\u5BB9",
    footer: "\u793A\u4F8B\u5185\u5BB9\u53EF\u66FF\u6362 \xB7 \u767D\u5E95 / \u84DD\u8272\u5F3A\u8C03 / \u8584\u8377\u7EFF\u5B8C\u6210\u6001",
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
  var create3 = (id, name, description, defaults3, render) => ({
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
  var components22 = [
    create3("before-after", "\u524D\u540E\u5BF9\u6BD4", "\u5728\u540C\u4E00\u7EC4\u4EFB\u52A1\u4E2D\u5BF9\u7167\u4E24\u79CD\u7EC4\u7EC7\u65B9\u5F0F\uFF1B\u4E24\u4FA7\u6587\u6848\u3001\u72B6\u6001\u548C\u7ED3\u8BBA\u5747\u53EF\u7F16\u8F91\u3002", {
      eyebrow: "01 / \u5BF9\u7167\u89C2\u5BDF",
      title: "\u540C\u6837\u7684\u4EFB\u52A1\uFF0C\u6362\u4E00\u79CD\u7EC4\u7EC7\u65B9\u5F0F",
      subtitle: "\u4FDD\u6301\u4EFB\u52A1\u4E0D\u53D8\uFF0C\u8BA9\u6574\u7406\u65B9\u5F0F\u7684\u5DEE\u5F02\u6E05\u695A\u53EF\u89C1\u3002",
      badge: "\u524D\u540E\u5BF9\u6BD4",
      beforeLabel: "\u6574\u7406\u524D",
      beforeNote: "\u4FE1\u606F\u6563\u843D\u5728\u540C\u4E00\u5F20\u6E05\u5355\u91CC",
      afterLabel: "\u6574\u7406\u540E",
      afterNote: "\u6309\u72B6\u6001\u7EC4\u7EC7\uFF0C\u4E0B\u4E00\u6B65\u66F4\u660E\u786E",
      tasks: [{ title: "\u6574\u7406\u53C2\u8003\u8D44\u6599", detail: "8 \u7BC7\u6587\u7AE0 \xB7 2 \u4EFD\u62A5\u544A", state: "done" }, { title: "\u5B8C\u6210\u7B2C\u4E00\u7248\u811A\u672C", detail: "\u5F00\u5934 \xB7 \u6B63\u6587 \xB7 \u7ED3\u5C3E", state: "active" }, { title: "\u5F55\u5236\u64CD\u4F5C\u8FC7\u7A0B", detail: "\u9879\u76EE\u521B\u5EFA\u4E0E\u8BBE\u7F6E", state: "todo" }],
      columns: [{ state: "todo", label: "\u5F85\u5F00\u59CB" }, { state: "active", label: "\u8FDB\u884C\u4E2D" }, { state: "done", label: "\u5DF2\u5B8C\u6210" }],
      resultLabel: "\u53D8\u5316\u8981\u70B9",
      result: "\u8D44\u6599\u3001\u6267\u884C\u4E0E\u9A8C\u6536\u5404\u6709\u4F4D\u7F6E\uFF0C\u51CF\u5C11\u53CD\u590D\u5BFB\u627E\u3002",
      series: "EXPLAIN / COMPARE"
    }, (p, h) => {
      const e = h.esc;
      const tasks = arr3(p.tasks, 6);
      const columns = arr3(p.columns, 3);
      const before = tasks.map((x, i) => '<div class="edu-task-row" data-motion="item"><span class="edu-task-index">' + String(i + 1).padStart(2, "0") + "</span><div><strong>" + e(x.title) + "</strong><p>" + e(x.detail) + '</p></div><span class="edu-task-dot"></span></div>').join("");
      const after = columns.map((c) => '<div class="edu-kanban-column"><div class="edu-kanban-label"><i class="edu-state-' + e(c.state) + '"></i>' + e(c.label) + "<span>" + tasks.filter((t) => t.state === c.state).length + "</span></div>" + tasks.filter((t) => t.state === c.state).map((t) => '<div class="edu-kanban-task" data-motion="item"><strong>' + e(t.title) + "</strong><p>" + e(t.detail) + '</p><div class="edu-mini-progress"><i class="edu-state-' + e(c.state) + '"></i></div></div>').join("") + "</div>").join("");
      return shell4(p, h, '<div class="edu-compare-layout"><section class="edu-panel edu-before"><div class="edu-panel-heading"><span class="edu-pill">' + e(p.beforeLabel) + "</span><p>" + e(p.beforeNote) + '</p></div><div class="edu-task-list">' + before + '</div></section><div class="edu-compare-arrow">' + arrow2 + '</div><section class="edu-panel edu-after" data-motion="reveal"><div class="edu-panel-heading"><span class="edu-pill edu-pill-blue">' + e(p.afterLabel) + "</span><p>" + e(p.afterNote) + '</p></div><div class="edu-kanban">' + after + '</div></section></div><div class="edu-takeaway"><span>' + e(p.resultLabel) + "</span><strong>" + e(p.result) + "</strong></div>");
    }),
    create3("flowchart", "\u6D41\u7A0B\u4E0E\u539F\u7406\u56FE", "\u53EF\u7F16\u8F91\u7684\u4E94\u8282\u70B9\u5206\u652F\u6D41\u7A0B\uFF0C\u8282\u70B9\u4E0E SVG \u8FDE\u7EBF\u72EC\u7ACB\uFF0C\u53EF\u6309\u987A\u5E8F\u70B9\u4EAE\u3002", {
      eyebrow: "02 / \u89E3\u91CA\u8FC7\u7A0B",
      title: "\u4ECE\u95EE\u9898\uFF0C\u5230\u53EF\u4EE5\u9A8C\u8BC1\u7684\u7ED3\u679C",
      subtitle: "\u628A\u8F93\u5165\u3001\u6267\u884C\u4E0E\u68C0\u67E5\u62C6\u5F00\uFF0C\u8BB2\u6E05\u6BCF\u4E00\u6B65\u7684\u804C\u8D23\u3002",
      badge: "\u6D41\u7A0B\u56FE",
      nodes: [{ label: "\u8F93\u5165\u76EE\u6807", detail: "\u8981\u5B8C\u6210\u4EC0\u4E48", tag: "01" }, { label: "\u8865\u5145\u4E0A\u4E0B\u6587", detail: "\u8D44\u6599\u4E0E\u9650\u5236", tag: "02" }, { label: "\u6267\u884C\u4EFB\u52A1", detail: "\u4EA7\u51FA\u7B2C\u4E00\u7248", tag: "03" }, { label: "\u901A\u8FC7\u68C0\u67E5", detail: "\u8FDB\u5165\u4EA4\u4ED8", tag: "04" }, { label: "\u9700\u8981\u4FEE\u6539", detail: "\u5E26\u53CD\u9988\u7EE7\u7EED", tag: "05" }],
      branchLabels: ["\u7B26\u5408\u8981\u6C42", "\u53D1\u73B0\u95EE\u9898"],
      noteTitle: "\u68C0\u67E5\u6807\u51C6\u5148\u5199\u6E05\u695A",
      note: "\u9A8C\u6536\u4F9D\u636E\u660E\u786E\uFF0C\u53CD\u9988\u624D\u5BB9\u6613\u8F6C\u5316\u6210\u4E0B\u4E00\u6B65\u884C\u52A8\u3002",
      series: "EXPLAIN / FLOW"
    }, (p, h) => {
      const e = h.esc;
      const nodes = arr3(p.nodes, 5);
      const marker = h.uid("flow-arrow");
      const positions = [{ x: 0, y: 158 }, { x: 286, y: 158 }, { x: 572, y: 158 }, { x: 906, y: 42 }, { x: 906, y: 278 }];
      const lines3 = '<svg class="edu-flow-lines" viewBox="0 0 1164 460" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="' + e(marker) + '" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1 1 6 4 1 7" fill="none" stroke="#2563eb" stroke-width="1.5"/></marker></defs><path data-motion="line" d="M238 225H282" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#' + e(marker) + ')"/><path data-motion="line" d="M524 225H568" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#' + e(marker) + ')"/><path data-motion="line" d="M810 225H850V109H902" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#' + e(marker) + ')"/><path data-motion="line" d="M850 225V345H902" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#' + e(marker) + ')"/><circle cx="850" cy="225" r="5" fill="#2563eb"/></svg>';
      const cards = nodes.map((x, i) => '<div class="edu-flow-node ' + (i === 2 ? "edu-flow-node-active" : i === 3 ? "edu-flow-node-done" : "") + '" style="left:' + positions[i].x + "px;top:" + positions[i].y + 'px" data-motion="item"><span>' + e(x.tag) + "</span><strong>" + e(x.label) + "</strong><p>" + e(x.detail) + "</p></div>").join("");
      return shell4(p, h, '<div class="edu-flow-stage">' + lines3 + cards + '<span class="edu-flow-label edu-flow-label-top">' + e(arr3(p.branchLabels, 2)[0] || "") + '</span><span class="edu-flow-label edu-flow-label-bottom">' + e(arr3(p.branchLabels, 2)[1] || "") + '</span></div><div class="edu-note"><strong>' + e(p.noteTitle) + "</strong><span>" + e(p.note) + "</span></div>");
    }),
    create3("layer-stack", "\u5206\u5C42\u7ED3\u6784\u56FE", "\u7528\u7EDF\u4E00\u7B49\u8DDD\u51E0\u4F55\u548C\u72EC\u7ACB\u5F15\u7EBF\u89E3\u91CA\u4E09\u5C42\u7ED3\u6784\uFF1B\u5C42\u540D\u3001\u8BF4\u660E\u548C\u8981\u70B9\u53EF\u66FF\u6362\u3002", {
      eyebrow: "03 / \u7ED3\u6784\u62C6\u89E3",
      title: "\u628A\u590D\u6742\u7CFB\u7EDF\uFF0C\u62C6\u6210\u4E09\u4E2A\u5C42\u6B21",
      subtitle: "\u6BCF\u5C42\u8D1F\u8D23\u4E00\u4EF6\u4E8B\uFF0C\u5173\u7CFB\u6BD4\u7EC6\u8282\u66F4\u5BB9\u6613\u7406\u89E3\u3002",
      badge: "\u5206\u5C42\u7ED3\u6784",
      layers: [{ title: "\u9879\u76EE", label: "\u7EC4\u7EC7\u8D44\u6599", detail: "\u4FDD\u5B58\u5171\u540C\u80CC\u666F\uFF0C\u8BA9\u76F8\u5173\u4EFB\u52A1\u6709\u7EDF\u4E00\u7684\u5DE5\u4F5C\u73AF\u5883\u3002", index: "L1" }, { title: "\u4EFB\u52A1", label: "\u805A\u7126\u76EE\u6807", detail: "\u56F4\u7ED5\u4E00\u4E2A\u660E\u786E\u7ED3\u679C\uFF0C\u8BB0\u5F55\u8FC7\u7A0B\u4E0E\u5F53\u524D\u8FDB\u5C55\u3002", index: "L2" }, { title: "\u5DE5\u5177", label: "\u6267\u884C\u64CD\u4F5C", detail: "\u8BFB\u53D6\u3001\u7F16\u8F91\u548C\u9A8C\u8BC1\uFF0C\u628A\u8BA1\u5212\u8F6C\u5316\u6210\u5177\u4F53\u7ED3\u679C\u3002", index: "L3" }],
      note: "\u793A\u610F\u5173\u7CFB\u4EC5\u7528\u4E8E\u89E3\u91CA\u5206\u5DE5\uFF1B\u5177\u4F53\u4EA7\u54C1\u7ED3\u6784\u4EE5\u5B9E\u9645\u5B9E\u73B0\u4E3A\u51C6\u3002",
      series: "EXPLAIN / LAYERS"
    }, (p, h) => {
      const e = h.esc;
      const layers = arr3(p.layers, 3);
      const slabs = layers.map((x, i) => {
        const y = 25 + i * 146;
        const fill = ["#f5f8fe", "#e2edff", "#d9f0e8"][i], side = ["#e6ebf3", "#bad1f9", "#acd8c8"][i];
        return '<g data-motion="item"><path d="M75 ' + (y + 88) + " 325 " + y + " 560 " + (y + 91) + " 309 " + (y + 182) + 'Z" fill="' + fill + '" stroke="#bdd0e4" stroke-width="1.4"/><path d="M75 ' + (y + 88) + "V" + (y + 111) + "L309 " + (y + 205) + "V" + (y + 182) + 'Z" fill="' + side + '" stroke="#bdd0e4" stroke-width="1.4"/><path d="M309 ' + (y + 182) + " 560 " + (y + 91) + "V" + (y + 114) + "L309 " + (y + 205) + 'Z" fill="' + side + '" stroke="#bdd0e4" stroke-width="1.4"/><text x="318" y="' + (y + 103) + '" text-anchor="middle" fill="#1f2329" font-size="30" font-weight="650">' + e(x.title) + "</text></g>";
      }).reverse().join("");
      const leaders = layers.map((x, i) => '<g><path data-motion="line" d="M560 ' + (116 + i * 146) + 'H613" fill="none" stroke="#8ba8cb" stroke-width="1.5"/><circle cx="560" cy="' + (116 + i * 146) + '" r="4" fill="#2563eb"/><text x="586" y="' + (105 + i * 146) + '" fill="#71849d" font-size="14">' + e(x.index) + "</text></g>").join("");
      return shell4(p, h, '<div class="edu-layers-layout"><svg class="edu-layer-art" viewBox="0 0 640 525" role="img" aria-label="' + e(p.title) + '">' + slabs + leaders + '</svg><div class="edu-layer-descriptions">' + layers.map((x, i) => '<article data-motion="item"><span class="edu-layer-number">' + e(x.index) + "</span><div><h2>" + e(x.label) + "</h2><p>" + e(x.detail) + "</p></div></article>").join("") + '<p class="edu-fine-note">' + e(p.note) + "</p></div></div>");
    }),
    create3("bar-chart", "\u67F1\u5F62\u6570\u636E\u56FE", "\u6309\u771F\u5B9E\u6570\u636E\u6620\u5C04\u9AD8\u5EA6\uFF0C\u652F\u6301\u53EF\u7F16\u8F91\u7C7B\u76EE\u3001\u6570\u503C\u3001\u8303\u56F4\u548C\u5355\u4F4D\uFF1B\u9ED8\u8BA4\u7528\u793A\u4F8B\u65F6\u957F\u6BD4\u8F83\u3002", {
      eyebrow: "04 / \u6570\u636E\u5BF9\u7167",
      title: "\u65F6\u95F4\u82B1\u5728\u4E86\u54EA\u91CC\uFF1F",
      subtitle: "\u628A\u6D41\u7A0B\u5206\u6BB5\uFF0C\u624D\u80FD\u627E\u5230\u503C\u5F97\u4F18\u5316\u7684\u73AF\u8282\u3002",
      badge: "\u793A\u4F8B\u6570\u636E",
      chartTitle: "\u5355\u6B21\u5236\u4F5C\u8017\u65F6",
      unit: "\u5206\u949F",
      max: 60,
      values: [{ label: "\u6574\u7406\u8D44\u6599", value: 28 }, { label: "\u5199\u4F5C\u811A\u672C", value: 46 }, { label: "\u5236\u4F5C\u753B\u9762", value: 54 }, { label: "\u526A\u8F91\u68C0\u67E5", value: 34 }],
      highlight: 2,
      noteLabel: "\u89C2\u5BDF",
      note: "\u5148\u770B\u8017\u65F6\u6700\u5927\u7684\u73AF\u8282\uFF0C\u518D\u51B3\u5B9A\u4F18\u5316\u987A\u5E8F\u3002",
      source: "\u6570\u636E\uFF1A\u793A\u4F8B\u503C\uFF0C\u4EC5\u5C55\u793A\u56FE\u8868\u7528\u6CD5\u3002",
      series: "EXPLAIN / BARS"
    }, (p, h) => {
      const e = h.esc;
      const values = arr3(p.values, 6);
      const max = Math.max(1, n2(p.max, 100), ...values.map((x) => n2(x.value)));
      const left = 64, top = 58, bottom = 356, width = 1030, slot = width / Math.max(1, values.length), barWidth = Math.min(114, slot * 0.52);
      const grid = Array.from({ length: 5 }, (_, i) => {
        const y = bottom - (bottom - top) * i / 4;
        return '<line x1="' + left + '" y1="' + y + '" x2="1110" y2="' + y + '" stroke="#e7ecf3"/><text x="44" y="' + (y + 6) + '" text-anchor="end" font-size="18" fill="#687387">' + e(fmt(max * i / 4)) + "</text>";
      }).join("");
      const bars = values.map((x, i) => {
        const height = (bottom - top) * clamp2(x.value, 0, max) / max;
        const cx = left + slot * (i + 0.5);
        return '<g><rect data-motion="bar" x="' + (cx - barWidth / 2) + '" y="' + (bottom - height) + '" width="' + barWidth + '" height="' + height + '" rx="7" fill="' + (i === n2(p.highlight) ? "#2563eb" : "#bfd5f8") + '"/><text data-motion="counter" x="' + cx + '" y="' + (bottom - height - 13) + '" text-anchor="middle" font-size="26" font-weight="650" fill="#1f2329">' + e(fmt(x.value)) + '</text><text x="' + cx + '" y="397" text-anchor="middle" font-size="21" fill="#455064">' + e(x.label) + "</text></g>";
      }).join("");
      return shell4(p, h, '<section class="edu-chart-panel"><div class="edu-chart-heading"><h2>' + e(p.chartTitle) + "</h2><span>" + e(p.unit) + '</span></div><svg class="edu-bar-svg" viewBox="0 0 1164 426" role="img" aria-label="' + e(p.chartTitle) + '">' + grid + bars + '</svg><div class="edu-chart-source">' + e(p.source) + '</div></section><div class="edu-takeaway edu-takeaway-compact"><span>' + e(p.noteLabel) + "</span><strong>" + e(p.note) + "</strong></div>");
    }),
    create3("line-chart", "\u8D8B\u52BF\u6298\u7EBF\u56FE", "\u53EF\u7F16\u8F91\u8D8B\u52BF\u3001\u76EE\u6807\u7EBF\u4E0E\u9009\u4E2D\u70B9\uFF1B\u6570\u503C\u51B3\u5B9A\u5750\u6807\uFF0C\u6298\u7EBF\u4E0E\u9762\u79EF\u4F7F\u7528\u539F\u751F SVG\u3002", {
      eyebrow: "05 / \u89C2\u5BDF\u8D8B\u52BF",
      title: "\u4E00\u6B21\u6539\u8FDB\uFF0C\u8981\u770B\u8FDE\u7EED\u7684\u53D8\u5316",
      subtitle: "\u7528\u540C\u4E00\u628A\u5C3A\u5B50\u89C2\u5BDF\u8D8B\u52BF\uFF0C\u907F\u514D\u53EA\u770B\u67D0\u4E00\u4E2A\u9AD8\u70B9\u3002",
      badge: "\u793A\u4F8B\u6570\u636E",
      chartTitle: "\u6BCF\u5468\u5B8C\u6210\u4EFB\u52A1\u6570",
      unit: "\u9879",
      max: 40,
      target: 30,
      targetLabel: "\u53C2\u8003\u76EE\u6807",
      values: [{ label: "\u7B2C1\u5468", value: 12 }, { label: "\u7B2C2\u5468", value: 17 }, { label: "\u7B2C3\u5468", value: 15 }, { label: "\u7B2C4\u5468", value: 24 }, { label: "\u7B2C5\u5468", value: 29 }, { label: "\u7B2C6\u5468", value: 34 }],
      selected: 4,
      note: "\u6298\u7EBF\u53EA\u8FDE\u63A5\u793A\u4F8B\u89C2\u6D4B\u503C\uFF1B\u4E0D\u4EE3\u8868\u5BF9\u672A\u6765\u8868\u73B0\u7684\u9884\u6D4B\u3002",
      series: "EXPLAIN / TREND"
    }, (p, h) => {
      const e = h.esc;
      const values = arr3(p.values, 10);
      const max = Math.max(1, n2(p.max, 40), n2(p.target), ...values.map((x) => n2(x.value)));
      const left = 64, right = 1095, top = 60, bottom = 370;
      const points = values.map((x, i) => ({ x: left + (right - left) * i / Math.max(1, values.length - 1), y: bottom - (bottom - top) * clamp2(x.value, 0, max) / max, ...x }));
      const line3 = points.map((x, i) => (i ? "L" : "M") + x.x + " " + x.y).join(" ");
      const area = points.length ? line3 + "L" + points.at(-1).x + " " + bottom + "L" + points[0].x + " " + bottom + "Z" : "";
      const grad = h.uid("trend-fill");
      const targetY = bottom - (bottom - top) * clamp2(p.target, 0, max) / max;
      const grid = Array.from({ length: 5 }, (_, i) => {
        const y = bottom - (bottom - top) * i / 4;
        return '<line x1="' + left + '" y1="' + y + '" x2="' + right + '" y2="' + y + '" stroke="#e6ecf3"/><text x="44" y="' + (y + 6) + '" font-size="18" text-anchor="end" fill="#687387">' + e(fmt(max * i / 4)) + "</text>";
      }).join("");
      const chosen = points[clamp2(p.selected, 0, Math.max(0, points.length - 1))];
      const chip = chosen ? '<g data-motion="focus"><rect x="' + clamp2(chosen.x - 82, 64, 931) + '" y="' + Math.max(4, chosen.y - 66) + '" width="164" height="43" rx="8" fill="#1f2329"/><text x="' + (clamp2(chosen.x - 82, 64, 931) + 82) + '" y="' + Math.max(31, chosen.y - 39) + '" text-anchor="middle" fill="white" font-size="20">' + e(chosen.label) + " \xB7 " + e(fmt(chosen.value)) + " " + e(p.unit) + "</text></g>" : "";
      return shell4(p, h, '<section class="edu-chart-panel"><div class="edu-chart-heading"><h2>' + e(p.chartTitle) + "</h2><span>" + e(p.unit) + '</span></div><svg class="edu-line-svg" viewBox="0 0 1164 442" role="img" aria-label="' + e(p.chartTitle) + '"><defs><linearGradient id="' + e(grad) + '" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#2563eb" stop-opacity=".18"/><stop offset="1" stop-color="#2563eb" stop-opacity=".01"/></linearGradient></defs>' + grid + '<line x1="' + left + '" y1="' + targetY + '" x2="' + right + '" y2="' + targetY + '" stroke="#4c9d83" stroke-width="1.7" stroke-dasharray="6 6"/><text x="' + (left + 16) + '" y="' + (targetY - 12) + '" text-anchor="start" font-size="18" fill="#28735d">' + e(p.targetLabel) + " " + e(fmt(p.target)) + '</text><path d="' + area + '" fill="url(#' + e(grad) + ')"/><path data-motion="line" d="' + line3 + '" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' + points.map((x) => '<circle cx="' + x.x + '" cy="' + x.y + '" r="5.5" fill="white" stroke="#2563eb" stroke-width="3"/><text x="' + x.x + '" y="415" text-anchor="middle" font-size="20" fill="#455064">' + e(x.label) + "</text>").join("") + chip + '</svg><div class="edu-chart-source">' + e(p.note) + "</div></section>");
    }),
    create3("comparison-matrix", "\u65B9\u6848\u6BD4\u8F83\u77E9\u9635", "\u6309\u7EDF\u4E00\u7EF4\u5EA6\u6BD4\u8F83\u4E09\u79CD\u65B9\u6848\uFF0C\u4F7F\u7528\u6587\u5B57\u800C\u975E\u4E3B\u89C2\u6253\u5206\uFF1B\u5217\u3001\u884C\u4E0E\u63A8\u8350\u8BF4\u660E\u53EF\u7F16\u8F91\u3002", {
      eyebrow: "06 / \u5E2E\u52A9\u9009\u62E9",
      title: "\u9009\u5DE5\u5177\uFF0C\u5148\u770B\u4EFB\u52A1\u9700\u8981\u4EC0\u4E48",
      subtitle: "\u6BD4\u8F83\u540C\u4E00\u7EC4\u6761\u4EF6\uFF0C\u8BA9\u9009\u62E9\u4F9D\u636E\u6709\u8FF9\u53EF\u5FAA\u3002",
      badge: "\u793A\u4F8B\u6BD4\u8F83",
      columns: [{ name: "\u9759\u6001\u56FE\u7247", tag: "\u89E3\u91CA\u7ED3\u6784" }, { name: "\u771F\u5B9E\u5F55\u5C4F", tag: "\u6F14\u793A\u64CD\u4F5C" }, { name: "AI \u89C6\u9891", tag: "\u5448\u73B0\u573A\u666F" }],
      rows: [{ criterion: "\u6700\u9002\u5408", values: ["\u6982\u5FF5\u4E0E\u5173\u7CFB", "\u8F6F\u4EF6\u64CD\u4F5C\u6B65\u9AA4", "\u96BE\u4EE5\u5B9E\u62CD\u7684\u753B\u9762"] }, { criterion: "\u6587\u5B57\u51C6\u786E\u6027", values: ["\u53EF\u9010\u5B57\u63A7\u5236", "\u4FDD\u7559\u771F\u5B9E\u754C\u9762", "\u9700\u53E6\u52A0\u5B57\u5E55\u6807\u6CE8"] }, { criterion: "\u4FEE\u6539\u65B9\u5F0F", values: ["\u7F16\u8F91\u6587\u5B57\u4E0E\u5E03\u5C40", "\u8865\u5F55\u6216\u91CD\u65B0\u526A\u8F91", "\u8C03\u6574\u63D0\u793A\u8BCD\u518D\u751F\u6210"] }, { criterion: "\u5EFA\u8BAE\u7528\u6CD5", values: ["\u6D41\u7A0B\u56FE / \u539F\u7406\u56FE", "\u6309\u94AE / \u9875\u9762 / \u64CD\u4F5C", "\u6BD4\u55BB / \u8F6C\u573A / \u6C1B\u56F4"] }],
      noteLabel: "\u7EC4\u5408\u4F7F\u7528",
      note: "\u7531\u8981\u8BB2\u6E05\u7684\u5185\u5BB9\u51B3\u5B9A\u753B\u9762\u5F62\u5F0F\uFF0C\u540C\u4E00\u6761\u89C6\u9891\u53EF\u4EE5\u6DF7\u5408\u4E09\u79CD\u7D20\u6750\u3002",
      series: "EXPLAIN / MATRIX"
    }, (p, h) => {
      const e = h.esc;
      const columns = arr3(p.columns, 3), rows2 = arr3(p.rows, 5);
      return shell4(p, h, '<div class="edu-matrix-panel"><table class="edu-matrix"><thead><tr><th></th>' + columns.map((c) => "<th><strong>" + e(c.name) + "</strong><span>" + e(c.tag) + "</span></th>").join("") + "</tr></thead><tbody>" + rows2.map((r) => '<tr data-motion="item"><th>' + e(r.criterion) + "</th>" + columns.map((_, i) => "<td>" + e(arr3(r.values, 3)[i] || "") + "</td>").join("") + "</tr>").join("") + '</tbody></table></div><div class="edu-takeaway"><span>' + e(p.noteLabel) + "</span><strong>" + e(p.note) + "</strong></div>");
    }),
    create3("event-timeline", "\u4E8B\u4EF6\u65F6\u95F4\u7EBF", "\u4E94\u4E2A\u9636\u6BB5\u6CBF\u6C34\u5E73\u65F6\u95F4\u8F74\u5C55\u793A\uFF0C\u533A\u5206\u5DF2\u5B8C\u6210\u3001\u5F53\u524D\u548C\u5F85\u5F00\u59CB\uFF1B\u652F\u6301\u66FF\u6362\u65F6\u95F4\u3001\u5185\u5BB9\u548C\u72B6\u6001\u3002", {
      eyebrow: "07 / \u68B3\u7406\u987A\u5E8F",
      title: "\u4E00\u6761\u89C6\u9891\uFF0C\u5982\u4F55\u4E00\u6B65\u6B65\u5B8C\u6210",
      subtitle: "\u628A\u5236\u4F5C\u8FC7\u7A0B\u653E\u5728\u65F6\u95F4\u7EBF\u4E0A\uFF0C\u6BCF\u4E2A\u9636\u6BB5\u90FD\u6709\u660E\u786E\u4EA7\u7269\u3002",
      badge: "\u5236\u4F5C\u793A\u4F8B",
      events: [{ time: "09:00", title: "\u660E\u786E\u4E3B\u9898", detail: "\u786E\u5B9A\u89C2\u4F17\u4E0E\u6838\u5FC3\u95EE\u9898", status: "done" }, { time: "10:00", title: "\u5B8C\u6210\u811A\u672C", detail: "\u6574\u7406\u94A9\u5B50\u3001\u6B63\u6587\u4E0E\u7ED3\u5C3E", status: "done" }, { time: "13:00", title: "\u51C6\u5907\u7D20\u6750", detail: "\u53C2\u8003\u56FE\u3001\u5F55\u5C4F\u4E0E\u914D\u97F3", status: "active" }, { time: "15:00", title: "\u7EC4\u5408\u753B\u9762", detail: "\u6309\u914D\u97F3\u7EC4\u7EC7\u955C\u5934", status: "todo" }, { time: "17:00", title: "\u68C0\u67E5\u4EA4\u4ED8", detail: "\u6838\u5BF9\u5185\u5BB9\u3001\u5B57\u5E55\u4E0E\u58F0\u97F3", status: "todo" }],
      activeLabel: "\u5F53\u524D\u9636\u6BB5",
      note: "\u65F6\u95F4\u4E3A\u793A\u4F8B\u8BA1\u5212\uFF0C\u53EF\u66FF\u6362\u4E3A\u65E5\u671F\u3001\u7AE0\u8282\u6216\u91CC\u7A0B\u7891\u3002",
      series: "EXPLAIN / TIMELINE"
    }, (p, h) => {
      const e = h.esc;
      const events = arr3(p.events, 5);
      return shell4(p, h, '<div class="edu-event-track"><div class="edu-event-baseline" data-motion="line"></div>' + events.map((x, i) => '<article class="edu-event edu-event-' + e(x.status) + '" style="left:' + i * 100 / Math.max(1, events.length - 1) + '%" data-motion="item"><div class="edu-event-time">' + e(x.time) + '</div><div class="edu-event-node">' + (x.status === "done" ? tick2 : "<i></i>") + '</div><div class="edu-event-card"><span class="edu-event-number">' + String(i + 1).padStart(2, "0") + "</span><h2>" + e(x.title) + "</h2><p>" + e(x.detail) + "</p>" + (x.status === "active" ? '<span class="edu-event-active">' + e(p.activeLabel) + "</span>" : "") + "</div></article>").join("") + '</div><div class="edu-timeline-note">' + e(p.note) + "</div>");
    }),
    create3("metric-dashboard", "\u5173\u952E\u6307\u6807\u9762\u677F", "\u4EE5\u4E09\u4E2A\u6307\u6807\u3001\u8FDB\u5EA6\u548C\u9A8C\u6536\u6E05\u5355\u590D\u76D8\u5236\u4F5C\u72B6\u6001\uFF1B\u793A\u4F8B\u6570\u636E\u3001\u5355\u4F4D\u4E0E\u8BF4\u660E\u53EF\u7F16\u8F91\u3002", {
      eyebrow: "08 / \u67E5\u770B\u72B6\u6001",
      title: "\u4EA4\u4ED8\u4E4B\u524D\uFF0C\u628A\u5173\u952E\u72B6\u6001\u770B\u6E05\u695A",
      subtitle: "\u8FDB\u5EA6\u3001\u7D20\u6750\u4E0E\u9A8C\u6536\u653E\u5728\u540C\u4E00\u9875\uFF0C\u51CF\u5C11\u9057\u6F0F\u3002",
      badge: "\u793A\u4F8B\u6570\u636E",
      metrics: [{ label: "\u955C\u5934\u5B8C\u6210", value: "8", unit: "/ 10", detail: "\u8FD8\u6709 2 \u4E2A\u955C\u5934\u9700\u8981\u8C03\u6574", progress: 0.8 }, { label: "\u7D20\u6750\u5C31\u7EEA", value: "24", unit: "/ 24", detail: "\u56FE\u7247\u3001\u5F55\u5C4F\u4E0E\u914D\u97F3\u5DF2\u5F52\u6863", progress: 1 }, { label: "\u9A8C\u6536\u901A\u8FC7", value: "6", unit: "/ 8", detail: "\u5269\u4F59\u5B57\u5E55\u4E0E\u7247\u5C3E\u68C0\u67E5", progress: 0.75 }],
      progressTitle: "\u6700\u8FD1\u4E94\u6B21\u5236\u4F5C\u8FDB\u5EA6",
      progress: [32, 46, 59, 68, 80],
      progressLabels: ["\u7B2C1\u6B21", "\u7B2C2\u6B21", "\u7B2C3\u6B21", "\u7B2C4\u6B21", "\u7B2C5\u6B21"],
      checklistTitle: "\u672C\u6B21\u68C0\u67E5",
      checks: [{ label: "\u5185\u5BB9\u4E0E\u5F15\u7528", done: true }, { label: "\u6784\u56FE\u4E0E\u6E05\u6670\u5EA6", done: true }, { label: "\u5B57\u5E55\u65F6\u95F4\u70B9", done: false }, { label: "\u914D\u97F3\u4E0E\u80CC\u666F\u58F0", done: false }],
      note: "\u8FD9\u91CC\u53EA\u6C47\u603B\u793A\u4F8B\u72B6\u6001\uFF0C\u4E0D\u4EE3\u8868\u5DF2\u7ECF\u6267\u884C\u68C0\u67E5\u3002",
      series: "EXPLAIN / STATUS"
    }, (p, h) => {
      const e = h.esc;
      const metrics = arr3(p.metrics, 3), progress = arr3(p.progress, 8), labels = arr3(p.progressLabels, 8);
      const pts = progress.map((v, i) => 25 + i * 500 / Math.max(1, progress.length - 1) + "," + (195 - clamp2(v, 0, 100) * 1.5)).join(" ");
      return shell4(p, h, '<div class="edu-metric-grid">' + metrics.map((x) => '<article class="edu-metric-card" data-motion="item"><div class="edu-metric-label">' + e(x.label) + '</div><div class="edu-metric-value"><strong data-motion="counter">' + e(x.value) + "</strong><span>" + e(x.unit) + '</span></div><div class="edu-metric-progress"><i data-motion="bar" style="width:' + clamp2(x.progress, 0, 1) * 100 + '%"></i></div><p>' + e(x.detail) + "</p></article>").join("") + '</div><div class="edu-dashboard-bottom"><section class="edu-progress-panel"><h2>' + e(p.progressTitle) + '</h2><svg viewBox="0 0 550 235" role="img" aria-label="' + e(p.progressTitle) + '"><path d="M25 45H525M25 120H525M25 195H525" fill="none" stroke="#e9edf4"/><polyline points="' + pts + '" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" data-motion="line"/>' + progress.map((v, i) => {
        const x = 25 + i * 500 / Math.max(1, progress.length - 1), y = 195 - clamp2(v, 0, 100) * 1.5;
        return '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#2563eb"/><text x="' + x + '" y="' + (y - 13) + '" text-anchor="middle" font-size="18" fill="#1f2329">' + e(fmt(v)) + '%</text><text x="' + x + '" y="227" text-anchor="middle" font-size="16" fill="#687387">' + e(labels[i] || "") + "</text>";
      }).join("") + '</svg></section><section class="edu-check-panel"><h2>' + e(p.checklistTitle) + "</h2>" + arr3(p.checks, 5).map((x) => '<div class="edu-check-item" data-motion="item"><span class="' + (x.done ? "edu-check-done" : "edu-check-pending") + '">' + (x.done ? tick2 : "") + "</span><strong>" + e(x.label) + "</strong></div>").join("") + '</section></div><div class="edu-dashboard-note">' + e(p.note) + "</div>");
    }),
    create3("definition-card", "\u6982\u5FF5\u89E3\u91CA\u5361", "\u7528\u5B9A\u4E49\u3001\u4E09\u4E2A\u5173\u952E\u8981\u7D20\u548C\u5177\u4F53\u4F8B\u5B50\u8BB2\u6E05\u4E00\u4E2A\u540D\u8BCD\uFF0C\u907F\u514D\u53EA\u5806\u6807\u9898\u548C\u6807\u7B7E\u3002", {
      eyebrow: "09 / \u89E3\u91CA\u6982\u5FF5",
      title: "\u4EC0\u4E48\u662F\u4E0A\u4E0B\u6587\uFF1F",
      subtitle: "\u5148\u7ED9\u4E00\u53E5\u6E05\u695A\u7684\u5B9A\u4E49\uFF0C\u518D\u628A\u5B83\u653E\u8FDB\u5177\u4F53\u4EFB\u52A1\u3002",
      badge: "\u6982\u5FF5\u89E3\u91CA",
      term: "\u4E0A\u4E0B\u6587",
      english: "CONTEXT",
      definition: "\u5B8C\u6210\u5F53\u524D\u4EFB\u52A1\u6240\u9700\u8981\u7684\u80CC\u666F\u4FE1\u606F\u3002",
      factors: [{ label: "\u76EE\u6807", detail: "\u6700\u7EC8\u5E0C\u671B\u5F97\u5230\u4EC0\u4E48" }, { label: "\u8D44\u6599", detail: "\u53EF\u4EE5\u53C2\u8003\u54EA\u4E9B\u5185\u5BB9" }, { label: "\u9650\u5236", detail: "\u54EA\u4E9B\u6761\u4EF6\u5FC5\u987B\u9075\u5B88" }],
      exampleLabel: "\u653E\u8FDB\u4E00\u4E2A\u771F\u5B9E\u4EFB\u52A1",
      exampleTitle: "\u4FEE\u6539\u4EA7\u54C1\u4ECB\u7ECD\u9875",
      example: "\u53C2\u8003\u73B0\u6709\u9875\u9762\uFF0C\u628A\u9996\u5C4F\u4ECB\u7ECD\u7F29\u77ED\u5230 80 \u5B57\u4EE5\u5185\uFF0C\u4FDD\u7559\u54C1\u724C\u8272\uFF0C\u5E76\u9002\u914D\u624B\u673A\u3002",
      note: "\u4EFB\u52A1\u8D8A\u5177\u4F53\uFF0C\u8D8A\u5BB9\u6613\u5224\u65AD\u7ED3\u679C\u662F\u5426\u7B26\u5408\u9884\u671F\u3002",
      series: "EXPLAIN / CONCEPT"
    }, (p, h) => {
      const e = h.esc;
      return shell4(p, h, '<div class="edu-definition-layout"><section class="edu-definition-main"><span class="edu-definition-en">' + e(p.english) + '</span><h2 data-motion="emphasis">' + e(p.term) + '</h2><p class="edu-definition-sentence" data-motion="reveal">' + e(p.definition) + '</p><div class="edu-factor-list">' + arr3(p.factors, 3).map((x, i) => '<div data-motion="item"><span>' + String(i + 1).padStart(2, "0") + "</span><strong>" + e(x.label) + "</strong><p>" + e(x.detail) + "</p></div>").join("") + '</div></section><aside class="edu-example-panel"><span class="edu-pill edu-pill-mint">' + e(p.exampleLabel) + "</span><h2>" + e(p.exampleTitle) + '</h2><blockquote data-motion="type">' + e(p.example) + '</blockquote><div class="edu-example-note">' + tick2 + "<p>" + e(p.note) + "</p></div></aside></div>");
    }),
    create3("chapter-summary", "\u7AE0\u8282\u4E0E\u603B\u7ED3\u9875", "\u7AE0\u8282\u7F16\u53F7\u3001\u6838\u5FC3\u7ED3\u8BBA\u3001\u4E09\u9879\u603B\u7ED3\u4E0E\u4E0B\u4E00\u6B65\u7EC4\u6210\u5B8C\u6574\u6536\u675F\u753B\u9762\u3002", {
      eyebrow: "10 / \u7AE0\u8282\u6536\u675F",
      title: "\u628A\u7406\u89E3\uFF0C\u53D8\u6210\u4E00\u6B21\u5B8C\u6574\u5B9E\u8DF5",
      subtitle: "\u51C6\u5907\u597D\u76EE\u6807\u3001\u7D20\u6750\u548C\u9A8C\u6536\u6807\u51C6\uFF0C\u518D\u5F00\u59CB\u52A8\u624B\u3002",
      badge: "\u7AE0\u8282\u603B\u7ED3",
      number: "03",
      chapterLabel: "\u5F00\u59CB\u5B9E\u8DF5",
      headline: "\u5148\u5B8C\u6210\u4E00\u4E2A\u5C0F\u9879\u76EE",
      points: [{ title: "\u660E\u786E\u76EE\u6807", detail: "\u7528\u4E00\u53E5\u8BDD\u8BF4\u6E05\u695A\u8981\u5F97\u5230\u7684\u7ED3\u679C\u3002" }, { title: "\u51C6\u5907\u7D20\u6750", detail: "\u628A\u53C2\u8003\u56FE\u3001\u5F55\u5C4F\u548C\u914D\u97F3\u653E\u5728\u4E00\u8D77\u3002" }, { title: "\u9A8C\u8BC1\u7ED3\u679C", detail: "\u5BF9\u7167\u8981\u6C42\u68C0\u67E5\uFF0C\u518D\u51B3\u5B9A\u4E0B\u4E00\u6B65\u3002" }],
      nextLabel: "\u4E0B\u4E00\u6B65",
      next: "\u9009\u62E9\u4E00\u4E2A\u4E3B\u9898\uFF0C\u5B8C\u6210\u7B2C\u4E00\u6BB5 30 \u79D2\u8BB2\u89E3\u3002",
      series: "EXPLAIN / CHAPTER"
    }, (p, h) => {
      const e = h.esc;
      return shell4(p, h, '<div class="edu-chapter-layout"><div class="edu-chapter-index"><span data-motion="counter">' + e(p.number) + "</span><div>" + e(p.chapterLabel) + '</div><i></i></div><div class="edu-chapter-content"><h2>' + e(p.headline) + "</h2>" + arr3(p.points, 3).map((x) => '<article data-motion="item"><span>' + tick2 + "</span><div><h3>" + e(x.title) + "</h3><p>" + e(x.detail) + "</p></div></article>").join("") + '</div></div><div class="edu-next-strip" data-motion="reveal"><span>' + e(p.nextLabel) + "</span><strong>" + e(p.next) + "</strong>" + arrow2 + "</div>");
    }),
    create3("media-stage", "\u56FE\u7247\u4E0E\u89C6\u9891\u5C55\u793A\u53F0", "\u5A92\u4F53\u69FD\u4F4D\u4FDD\u7559\u539F\u59CB\u6BD4\u4F8B\uFF0C\u53F3\u4FA7\u8BF4\u660E\u4E0E\u7AE0\u8282\u6807\u7B7E\u53EF\u66F4\u6362\uFF1B\u9ED8\u8BA4\u793A\u4F8B\u4E3A\u539F\u751F SVG \u4FE1\u606F\u793A\u610F\u3002", {
      eyebrow: "11 / \u7D20\u6750\u8BB2\u89E3",
      title: "\u753B\u9762\u8D1F\u8D23\u5C55\u793A\uFF0C\u6807\u6CE8\u8D1F\u8D23\u89E3\u91CA",
      subtitle: "\u628A\u5173\u952E\u8BF4\u660E\u653E\u5728\u7D20\u6750\u65C1\u8FB9\uFF0C\u8BA9\u89C2\u4F17\u77E5\u9053\u6B64\u523B\u5E94\u8BE5\u770B\u4EC0\u4E48\u3002",
      badge: "\u53EF\u66FF\u6362\u7D20\u6750",
      mediaSrc: "",
      mediaKind: "image",
      mediaAlt: "\u4ECE\u8F93\u5165\u8D44\u6599\u5230\u53EF\u7528\u7ED3\u679C\u7684\u6982\u5FF5\u793A\u610F",
      mediaLabel: "\u6982\u5FF5\u793A\u610F / 01",
      diagramNodes: [{ title: "\u8D44\u6599", detail: "\u7528\u6237\u63D0\u4F9B" }, { title: "\u5904\u7406", detail: "\u56F4\u7ED5\u76EE\u6807" }, { title: "\u7ED3\u679C", detail: "\u53EF\u68C0\u67E5" }],
      noteTitle: "\u5148\u8BA9\u89C2\u4F17\u770B\u61C2",
      notes: [{ label: "\u4FDD\u7559\u5B8C\u6574\u753B\u9762", detail: "\u4E0D\u62C9\u4F38\u7D20\u6750\uFF0C\u4E0D\u88C1\u6389\u5173\u952E\u7ED3\u6784\u3002" }, { label: "\u4E00\u6B21\u53EA\u8BB2\u4E00\u70B9", detail: "\u8BF4\u660E\u987A\u5E8F\u8DDF\u968F\u914D\u97F3\u5C55\u5F00\u3002" }, { label: "\u7EC6\u8282\u518D\u505A\u805A\u7126", detail: "\u9700\u8981\u65F6\u52A0\u5165\u653E\u5927\u4E0E\u6807\u6CE8\u3002" }],
      caption: "\u628A\u7D20\u6750\u4E0E\u8BB2\u89E3\u5206\u5F00\u7EF4\u62A4\uFF0C\u66FF\u6362\u5185\u5BB9\u540E\u6CBF\u7528\u540C\u4E00\u5957\u5E03\u5C40\u3002",
      series: "EXPLAIN / MEDIA"
    }, (p, h) => {
      const e = h.esc;
      const src = localMedia(p.mediaSrc);
      const marker = h.uid("media-arrow");
      let media3 = "";
      if (src) media3 = p.mediaKind === "video" ? '<video class="edu-media-element" id="' + e(h.uid("video")) + '" src="' + e(src) + '" muted playsinline preload="metadata"></video>' : '<img class="edu-media-element" src="' + e(src) + '" alt="' + e(p.mediaAlt) + '"/>';
      else {
        const nodes = arr3(p.diagramNodes, 3);
        media3 = '<svg class="edu-media-diagram" viewBox="0 0 760 428" role="img" aria-label="' + e(p.mediaAlt) + '"><defs><marker id="' + e(marker) + '" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="m1 1 4.5 2.5L1 6" fill="none" stroke="#2563eb" stroke-width="1.4"/></marker></defs><path d="M70 68H690M70 360H690" stroke="#e5edf7"/><path data-motion="line" d="M232 211H293" stroke="#2563eb" stroke-width="2.4" marker-end="url(#' + e(marker) + ')"/><path data-motion="line" d="M465 211H526" fill="none" stroke="#2563eb" stroke-width="2.4" marker-end="url(#' + e(marker) + ')"/>' + nodes.map((x, i) => {
          const cx = 147 + i * 233;
          return '<g data-motion="item"><rect x="' + (cx - 84) + '" y="125" width="168" height="174" rx="18" fill="' + (i === 2 ? "#e3f3eb" : i === 1 ? "#edf3ff" : "#ffffff") + '" stroke="' + (i === 1 ? "#93b8f7" : "#d9e4ef") + '" stroke-width="1.6"/><rect x="' + (cx - 17) + '" y="151" width="34" height="34" rx="9" fill="' + (i === 2 ? "#81c9b0" : "#2563eb") + '"/><path d="M' + (cx - 7) + ' 161h14m-14 7h14m-14 7h9" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="' + cx + '" y="229" text-anchor="middle" font-size="30" font-weight="650" fill="#1f2329">' + e(x.title) + '</text><text x="' + cx + '" y="266" text-anchor="middle" font-size="20" fill="#5f6875">' + e(x.detail) + "</text></g>";
        }).join("") + "</svg>";
      }
      return shell4(p, h, '<div class="edu-media-layout"><div class="edu-media-main"><div class="edu-media-canvas">' + media3 + '</div><div class="edu-media-caption"><span class="edu-pill">' + e(p.mediaLabel) + "</span><p>" + e(p.caption) + '</p></div></div><aside class="edu-media-notes"><h2>' + e(p.noteTitle) + "</h2>" + arr3(p.notes, 3).map((x, i) => '<article data-motion="item"><span>' + String(i + 1).padStart(2, "0") + "</span><div><h3>" + e(x.label) + "</h3><p>" + e(x.detail) + "</p></div></article>").join("") + "</aside></div>");
    }),
    create3("annotation-callout", "\u7BAD\u5934\u4E0E\u8BF4\u660E\u6807\u6CE8", "\u4E09\u4E2A\u7CBE\u786E\u951A\u70B9\u8FDE\u63A5\u793A\u610F\u4E3B\u4F53\u4E0E\u8BF4\u660E\u5361\uFF1B\u8BF4\u660E\u3001\u76EE\u6807\u6807\u7B7E\u548C\u5173\u7CFB\u5747\u53EF\u66FF\u6362\u3002", {
      eyebrow: "12 / \u6307\u5411\u5173\u952E",
      title: "\u8BA9\u8BF4\u660E\uFF0C\u51C6\u786E\u843D\u5230\u5173\u952E\u4F4D\u7F6E",
      subtitle: "\u6807\u6CE8\u7684\u4F5C\u7528\u662F\u5EFA\u7ACB\u5BF9\u5E94\u5173\u7CFB\uFF0C\u6BCF\u4E00\u6839\u7EBF\u90FD\u8981\u6709\u660E\u786E\u76EE\u6807\u3002",
      badge: "\u901A\u7528\u6807\u6CE8",
      subjectTitle: "\u4E00\u6761\u6709\u6548\u7684\u5236\u4F5C\u9700\u6C42",
      subjectSubtitle: "\u793A\u4F8B\u8BF4\u660E\u5361",
      fields: [{ label: "\u76EE\u6807", value: "\u505A\u4E00\u6BB5 30 \u79D2\u79D1\u666E\u52A8\u753B" }, { label: "\u7D20\u6750", value: "\u53C2\u8003\u56FE + \u5F55\u5C4F + \u914D\u97F3" }, { label: "\u9A8C\u6536", value: "\u5B57\u5E55\u51C6\u786E\uFF0C\u58F0\u97F3\u6E05\u695A" }],
      callouts: [{ title: "\u8BF4\u6E05\u7ED3\u679C", detail: "\u65F6\u957F\u3001\u5BF9\u8C61\u4E0E\u8868\u8FBE\u76EE\u7684\u3002" }, { title: "\u7ED9\u5230\u80CC\u666F", detail: "\u628A\u5DF2\u6709\u8D44\u6599\u653E\u5728\u4E00\u8D77\u3002" }, { title: "\u5B9A\u4E49\u5B8C\u6210", detail: "\u80FD\u6309\u6761\u4EF6\u68C0\u67E5\u597D\u574F\u3002" }],
      note: "\u951A\u70B9\u4E0E\u88AB\u6807\u6CE8\u5185\u5BB9\u7ED1\u5B9A\uFF1B\u66FF\u6362\u6587\u6848\u540E\u4ECD\u987B\u6838\u5BF9\u8FDE\u7EBF\u4F4D\u7F6E\u3002",
      series: "EXPLAIN / ANNOTATE"
    }, (p, h) => {
      const e = h.esc;
      const marker = h.uid("callout-arrow");
      return shell4(p, h, '<div class="edu-callout-stage"><section class="edu-callout-subject"><div class="edu-callout-subject-head"><span>' + e(p.subjectSubtitle) + "</span><h2>" + e(p.subjectTitle) + "</h2></div>" + arr3(p.fields, 3).map((x, i) => '<div class="edu-callout-field" data-motion="highlight"><span>' + e(x.label) + "</span><strong>" + e(x.value) + "</strong><i></i></div>").join("") + '</section><svg class="edu-callout-lines" viewBox="0 0 1164 470" aria-hidden="true"><defs><marker id="' + e(marker) + '" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M1 1 5 4 1 7" fill="none" stroke="#2563eb" stroke-width="1.5"/></marker></defs><path data-motion="line" d="M772 90C668 90 687 203 579 203" fill="none" stroke="#2563eb" stroke-width="2.2" marker-end="url(#' + e(marker) + ')"/><path data-motion="line" d="M772 278C690 278 665 289 579 289" fill="none" stroke="#2563eb" stroke-width="2.2" marker-end="url(#' + e(marker) + ')"/><path data-motion="line" d="M772 439C681 439 678 375 579 375" fill="none" stroke="#2563eb" stroke-width="2.2" marker-end="url(#' + e(marker) + ')"/></svg><div class="edu-callout-notes">' + arr3(p.callouts, 3).map((x, i) => '<article style="top:' + [37, 225, 386][i] + 'px" data-motion="item"><span>' + String(i + 1).padStart(2, "0") + "</span><div><h3>" + e(x.title) + "</h3><p>" + e(x.detail) + "</p></div></article>").join("") + '</div></div><div class="edu-timeline-note">' + e(p.note) + "</div>");
    })
  ];
  var css3 = String.raw`
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

  // families/systems.mjs
  var ref2 = (basis, source2) => ({ basis, source: source2, level: "documented" });
  var arr4 = (v) => Array.isArray(v) ? v : [];
  var num5 = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
  var safeSrc = (v) => {
    const s = String(v || "");
    if (/^(?:[a-z]+:|\/\/)/i.test(s) || s.includes("..")) return "";
    return s;
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
  var tool = (h, name, label2 = "") => `<span class="os-tool">${cn(h, name, 17)}${label2 ? `<span>${h.esc(label2)}</span>` : ""}</span>`;
  var fileIcon = (h, kind = "file", size = 18) => `<span class="os-file-icon os-kind-${["folder", "image", "video", "code", "file"].includes(kind) ? kind : "file"}">${cn(h, kind, size)}</span>`;
  var status2 = (p, h) => `<div class="os-ios-status"><b>${h.esc(p.time)}</b><span class="os-island" aria-hidden="true"></span><span class="os-ios-status-right"><svg viewBox="0 0 20 14" width="18" height="14" fill="currentColor" aria-hidden="true"><rect x="0" y="9" width="3" height="5" rx="1"/><rect x="5" y="6" width="3" height="8" rx="1"/><rect x="10" y="3" width="3" height="11" rx="1"/><rect x="15" width="3" height="14" rx="1"/></svg>${cn(h, "wifi", 17)}<span class="os-ios-battery"><i style="width:${Math.max(0, Math.min(100, num5(p.battery, 100)))}%"></i></span></span></div>`;
  var media2 = (p, h, fallback, klass = "") => {
    const src = safeSrc(p.media?.src);
    const kind = p.media?.kind;
    if (src && kind === "image") return `<img class="os-replace-media ${klass}" src="${h.esc(src)}" alt="${h.esc(p.media.alt || "")}" style="object-fit:${p.media.fit === "cover" ? "cover" : "contain"}">`;
    if (src && kind === "video") return `<video id="${h.uid("media")}" class="os-replace-media ${klass}" src="${h.esc(src)}" muted playsinline preload="auto" style="object-fit:${p.media.fit === "cover" ? "cover" : "contain"}"></video>`;
    return fallback;
  };
  var locationDefaults = [
    { label: "\u4E3B\u6587\u4EF6\u5939", icon: "home" },
    { label: "\u684C\u9762", icon: "monitor" },
    { label: "\u4E0B\u8F7D", icon: "download" },
    { label: "\u6587\u6863", icon: "file" },
    { label: "\u56FE\u7247", icon: "image" },
    { label: "\u89C6\u9891", icon: "video" },
    { label: "\u6B64\u7535\u8111", icon: "monitor" },
    { label: "\u672C\u5730\u78C1\u76D8 (D:)", icon: "monitor" }
  ];
  var filesDefaults = [
    { name: "assets", kind: "folder", date: "2026/9/17  10:24", type: "\u6587\u4EF6\u5939", size: "" },
    { name: "compositions", kind: "folder", date: "2026/9/17  10:26", type: "\u6587\u4EF6\u5939", size: "" },
    { name: "renders", kind: "folder", date: "2026/9/17  11:08", type: "\u6587\u4EF6\u5939", size: "" },
    { name: "content.json", kind: "code", date: "2026/9/17  11:02", type: "JSON \u6587\u4EF6", size: "8 KB" },
    { name: "index.html", kind: "code", date: "2026/9/17  11:04", type: "HTML \u6587\u6863", size: "24 KB" },
    { name: "README.md", kind: "file", date: "2026/9/17  10:45", type: "MD \u6587\u4EF6", size: "3 KB" },
    { name: "scene-01.mp4", kind: "video", date: "2026/9/17  11:08", type: "MP4 \u89C6\u9891", size: "12,840 KB" }
  ];
  function winNav(p, h) {
    return `<aside class="os-win-nav">${arr4(p.locations).map((x, i) => `<div data-motion="item" class="os-win-nav-item ${x.label === p.activeLocation ? "os-selected" : ""}"><span class="os-nav-chevron">${i > 5 ? cn(h, "chevron-right", 12) : ""}</span>${fileIcon(h, x.icon, 17)}<span>${h.esc(x.label)}</span>${i > 0 && i < 6 ? `<span class="os-pin">${cn(h, "pin", 11)}</span>` : ""}</div>`).join("")}</aside>`;
  }
  function breadcrumbs(p, h) {
    return `<div class="os-address-row">${tool(h, "chevron-left")}${tool(h, "chevron-right")}${tool(h, "arrow-up")}${tool(h, "refresh")}<div class="os-win-address">${cn(h, "folder", 17)}${arr4(p.path).map((x) => `<span>${h.esc(x)}</span>${cn(h, "chevron-right", 12)}`).join("")}<span class="os-flex"></span>${cn(h, "chevron-down", 13)}</div><div class="os-win-search"><span>${h.esc(p.search)}</span>${cn(h, "search", 16)}</div></div>`;
  }
  function winRows(p, h) {
    return `<div class="os-files-table"><div class="os-file-row os-table-head">${arr4(p.columns).map((x) => `<span>${h.esc(x)}</span>`).join("")}</div><div class="os-files-body" data-motion="scroll">${arr4(p.files).map((x, i) => `<div data-motion="item" class="os-file-row ${i === num5(p.selected, -1) ? "os-row-selected" : ""}"><span>${fileIcon(h, x.kind, 18)}<span>${h.esc(x.name)}</span></span><span>${h.esc(x.date)}</span><span>${h.esc(x.type)}</span><span>${h.esc(x.size)}</span></div>`).join("")}</div></div>`;
  }
  function phoneFolderSvg(h, index) {
    const back = h.uid(`phone-folder-back-${index}`), front = h.uid(`phone-folder-front-${index}`);
    return `<svg class="os-phone-folder-icon" viewBox="0 0 104 80" width="104" height="80" aria-hidden="true"><defs><linearGradient id="${back}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#54baf1"/><stop offset="1" stop-color="#319cde"/></linearGradient><linearGradient id="${front}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#98d9f9"/><stop offset=".12" stop-color="#85d1f6"/><stop offset="1" stop-color="#63bef0"/></linearGradient></defs><path d="M6 14.5C6 10.9 8.9 8 12.5 8H35.8C37.8 8 39.1 8.7 40.5 10.1L46.1 15.7C47.3 16.9 48.7 17.5 50.6 17.5H91.5C95.1 17.5 98 20.4 98 24V67.5C98 71.1 95.1 74 91.5 74H12.5C8.9 74 6 71.1 6 67.5Z" fill="url(#${back})"/><path d="M9 26H95V65.5C95 69.1 93.1 71 89.5 71H14.5C10.9 71 9 69.1 9 65.5Z" fill="#d3eefc"/><path d="M6 30C6 26.7 8.7 24 12 24H92C95.3 24 98 26.7 98 30V68C98 71.3 95.3 74 92 74H12C8.7 74 6 71.3 6 68Z" fill="url(#${front})"/><path d="M6.5 30C6.5 26.9 8.9 24.5 12 24.5H92C95.1 24.5 97.5 26.9 97.5 30" fill="none" stroke="#bfeafa" stroke-width=".8"/><path d="M12 73.5H92" stroke="#46a8df" stroke-opacity=".25"/></svg>`;
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
    return `<div class="os-ios-files ${tablet ? "os-ipad-files" : ""}">${tablet ? `<aside class="os-ipad-sidebar"><div class="os-ios-side-head">${cn(h, "menu", 19)}${cn(h, "more", 19)}</div><h2>${h.esc(p.appTitle)}</h2><div class="os-ios-search">${cn(h, "search", 17)}${h.esc(p.search)}</div>${arr4(p.sidebar).map((x, i) => `<div class="os-ios-sidebar-item ${i === num5(p.selectedSidebar) ? "os-ios-selected" : ""}" data-motion="item">${cn(h, x.icon, 21)}<span>${h.esc(x.label)}</span></div>`).join("")}<h4>${h.esc(p.tagsTitle)}</h4>${arr4(p.tags).map((x) => `<div class="os-ios-tag"><i style="background:${/^#[0-9a-f]{6}$/i.test(x.color) ? x.color : "#7d7d7d"}"></i>${h.esc(x.label)}</div>`).join("")}</aside>` : ""}<div class="os-ios-files-main"><div class="os-ios-nav">${tablet ? cn(h, "chevron-left", 21) : `<span>${cn(h, "chevron-left", 22)}${h.esc(p.backLabel)}</span>`}<b>${tablet ? h.esc(p.folderTitle) : ""}</b><span>${tablet ? cn(h, "more", 22) : phoneMoreIcon()}</span></div>${tablet ? "" : `<h2>${h.esc(p.folderTitle)}</h2><div class="os-ios-search">${cn(h, "search", 17)}${h.esc(p.search)}</div>`}<div class="os-ios-sort"><span>${h.esc(p.sortLabel)}</span>${cn(h, "chevron-down", 12)}<span class="os-flex"></span>${cn(h, "grid", 18)}</div><div class="os-ios-filegrid">${arr4(p.folders).map((x, index) => `<div data-motion="item" class="os-ios-gridfile">${tablet ? `<svg viewBox="0 0 104 78" width="104" height="78" aria-hidden="true"><path d="M3 12Q3 6 9 6H39L48 16H94Q101 16 101 23V65Q101 72 94 72H9Q3 72 3 65Z" fill="#55bdf8"/><path d="M3 25Q3 19 9 19H95Q101 19 101 25V66Q101 72 95 72H9Q3 72 3 66Z" fill="#77c9f9"/><path d="M4 25Q4 20 9 20H95Q100 20 100 25" fill="none" stroke="#a9e2ff"/></svg>` : phoneFolderSvg(h, index)}<span>${h.esc(x.name)}</span><small>${h.esc(x.count)}</small></div>`).join("")}</div><div class="os-ios-filecount">${h.esc(p.itemCount)}</div></div>${tablet ? "" : `<div class="os-ios-tabs">${arr4(p.tabs).map((x, i) => `<div class="${i === num5(p.activeTab) ? "os-ios-tab-active" : ""}">${phoneTabIcon(h, x.icon, i === num5(p.activeTab))}<small>${h.esc(x.label)}</small></div>`).join("")}</div>`}</div>`;
  }
  var components23 = [
    {
      id: "chrome-browser",
      name: "Chrome \u6D4F\u89C8\u5668 \xB7 Windows",
      category: "\u7CFB\u7EDF\u4E0E\u8BBE\u5907",
      width: 1280,
      height: 800,
      description: "Windows Chrome \u539F\u751F\u6807\u7B7E\u680F\u3001\u5730\u5740\u680F\u548C\u4E66\u7B7E\u680F\uFF1B\u7F51\u9875\u533A\u53EF\u66FF\u6362\u56FE\u7247\u3001\u89C6\u9891\u6216\u7ED3\u6784\u5316 HTML \u5185\u5BB9\u3002",
      reference: ref2("Google Chrome \u5B98\u65B9\u754C\u9762\u4E0E\u684C\u9762\u6807\u7B7E\u7BA1\u7406\u6587\u6863\uFF1BWindows \u6C34\u5E73\u6807\u7B7E\u680F\uFF0C\u672A\u505A\u540C\u5C3A\u5BF8\u50CF\u7D20\u6BD4\u8F83\u3002", "https://www.google.com/chrome/"),
      defaults: { tabs: [{ title: "\u9879\u76EE\u6587\u6863", active: true }, { title: "\u7EC4\u4EF6\u76EE\u5F55", active: false }], url: "docs.example.com/getting-started", profile: "L", bookmarks: ["\u5DE5\u4F5C\u53F0", "\u6587\u6863", "\u53C2\u8003\u7D20\u6750"], media: { kind: "demo", src: "", fit: "contain", alt: "" }, brand: "Studio Docs", actionButton: "\u65B0\u5EFA\u9879\u76EE", nav: ["\u6307\u5357", "\u7EC4\u4EF6", "\u793A\u4F8B", "\u66F4\u65B0"], section: "\u5F00\u59CB\u4F7F\u7528", title: "\u521B\u5EFA\u4F60\u7684\u7B2C\u4E00\u4E2A\u9879\u76EE", intro: "\u5C06\u7D20\u6750\u3001\u5185\u5BB9\u548C\u65F6\u95F4\u5B89\u6392\u653E\u5728\u4E00\u8D77\uFF0C\u5F00\u59CB\u5236\u4F5C\u4E00\u6BB5\u6E05\u6670\u7684\u8BB2\u89E3\u89C6\u9891\u3002", sidebar: ["\u5FEB\u901F\u5F00\u59CB", "\u9879\u76EE\u7ED3\u6784", "\u6DFB\u52A0\u7D20\u6750", "\u65F6\u95F4\u8F74", "\u9884\u89C8\u4E0E\u5BFC\u51FA"], activePage: 0, eyebrow: "\u6307\u5357 / \u5FEB\u901F\u5F00\u59CB", steps: [{ title: "\u521B\u5EFA\u9879\u76EE", body: "\u5728\u5DE5\u4F5C\u76EE\u5F55\u4E2D\u51C6\u5907\u9879\u76EE\u6587\u4EF6\uFF0C\u5E76\u4E3A\u6BCF\u4E00\u6BB5\u5185\u5BB9\u5EFA\u7ACB\u6E05\u6670\u7684\u547D\u540D\u3002" }, { title: "\u66FF\u6362\u5185\u5BB9", body: "\u7F16\u8F91\u6807\u9898\u3001\u8BF4\u660E\u548C\u7D20\u6750\u8DEF\u5F84\u3002\u7EC4\u4EF6\u4F1A\u6CBF\u7528\u7EDF\u4E00\u7684\u6392\u7248\u4E0E\u89C6\u89C9\u6837\u5F0F\u3002" }], code: "npm run build\nnpm run dev", tocTitle: "\u672C\u9875\u5185\u5BB9", toc: ["\u521B\u5EFA\u9879\u76EE", "\u66FF\u6362\u5185\u5BB9", "\u4E0B\u4E00\u6B65"], button: "\u4E0B\u4E00\u6B65\uFF1A\u6DFB\u52A0\u7D20\u6750" },
      render(p, h) {
        return `<div class="os-stage"><div class="os-window os-chrome" data-motion="reveal"><div class="os-chrome-tabs"><span class="os-tab-search">${cn(h, "chevron-down", 15)}</span>${arr4(p.tabs).map((t) => `<div class="os-chrome-tab ${t.active ? "os-chrome-tab-active" : ""}"><span class="os-favicon">${cn(h, "file", 13)}</span><span>${h.esc(t.title)}</span>${cn(h, "x", 13)}</div>`).join("")}<span class="os-new-tab">${cn(h, "plus", 17)}</span><span class="os-flex"></span>${winButtons(h)}</div><div class="os-chrome-toolbar">${tool(h, "chevron-left")}${tool(h, "chevron-right")}${tool(h, "refresh")}<div class="os-omnibox">${cn(h, "tune", 15)}<span>${h.esc(p.url)}</span><span class="os-flex"></span><span class="os-bookmark-star">\u2606</span></div>${tool(h, "download")}<span class="os-profile">${h.esc(p.profile)}</span>${tool(h, "vertical-more")}</div><div class="os-bookmarks">${arr4(p.bookmarks).map((x) => `<span>${cn(h, "folder", 14)}${h.esc(x)}</span>`).join("")}</div><div class="os-web-viewport">${media2(p, h, `<div class="os-docsite"><header><strong>${h.esc(p.brand)}</strong><nav>${arr4(p.nav).map((x) => `<span>${h.esc(x)}</span>`).join("")}</nav><button type="button" class="os-doc-action" data-motion="focus">${h.esc(p.actionButton)}</button>${cn(h, "search", 18)}</header><div class="os-doc-body"><aside><b>${h.esc(p.section)}</b>${arr4(p.sidebar).map((x, i) => `<span class="${i === num5(p.activePage) ? "os-doc-active" : ""}">${h.esc(x)}</span>`).join("")}</aside><article data-motion="scroll"><div class="os-doc-eyebrow">${h.esc(p.eyebrow)}</div><h1>${h.esc(p.title)}</h1><p>${h.esc(p.intro)}</p>${arr4(p.steps).map((x, i) => `<section data-motion="item"><h2>${h.esc(x.title)}</h2><p>${h.esc(x.body)}</p>${i === 0 ? `<pre data-motion="type">${h.esc(p.code)}</pre>` : ""}</section>`).join("")}<div class="os-doc-next">${h.esc(p.button)}${cn(h, "arrow-right", 16)}</div></article><div class="os-doc-toc"><b>${h.esc(p.tocTitle)}</b>${arr4(p.toc).map((x) => `<span>${h.esc(x)}</span>`).join("")}</div></div></div>`)}</div></div></div>`;
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
      defaults: { time: "9:41", battery: 100, media: { kind: "demo", src: "", fit: "cover", alt: "" }, appTitle: "\u6587\u4EF6", folderTitle: "\u89C6\u9891\u9879\u76EE", backLabel: "\u6D4F\u89C8", search: "\u641C\u7D22", sortLabel: "\u540D\u79F0", itemCount: "6 \u4E2A\u9879\u76EE", folders: [{ name: "\u53C2\u8003\u7D20\u6750", count: "12 \u9879" }, { name: "\u5F55\u5C4F", count: "8 \u9879" }, { name: "\u914D\u97F3", count: "5 \u9879" }, { name: "\u56FE\u7247", count: "16 \u9879" }, { name: "\u52A8\u753B", count: "10 \u9879" }, { name: "\u5BFC\u51FA", count: "3 \u9879" }], tabs: [{ label: "\u6700\u8FD1\u9879\u76EE", icon: "refresh" }, { label: "\u5171\u4EAB", icon: "link" }, { label: "\u6D4F\u89C8", icon: "folder" }], activeTab: 2 },
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
      defaults: { time: "9:41", date: "9\u670817\u65E5 \u661F\u671F\u56DB", battery: 100, media: { kind: "demo", src: "", fit: "contain", alt: "" }, appTitle: "\u6587\u4EF6", folderTitle: "\u89C6\u9891\u5236\u4F5C", search: "\u641C\u7D22", sortLabel: "\u540D\u79F0", itemCount: "8 \u4E2A\u9879\u76EE", sidebar: [{ label: "\u6700\u8FD1\u9879\u76EE", icon: "refresh" }, { label: "\u5171\u4EAB", icon: "link" }, { label: "iCloud \u4E91\u76D8", icon: "folder" }, { label: "\u6211\u7684 iPad", icon: "monitor" }, { label: "\u6700\u8FD1\u5220\u9664", icon: "trash" }], selectedSidebar: 2, tagsTitle: "\u6807\u7B7E", tags: [{ label: "\u91CD\u8981", color: "#ff453a" }, { label: "\u5DE5\u4F5C", color: "#0a84ff" }, { label: "\u5DF2\u5B8C\u6210", color: "#30b15a" }], folders: [{ name: "01 \u539F\u59CB\u7D20\u6750", count: "24 \u9879" }, { name: "02 \u53C2\u8003\u56FE\u7247", count: "18 \u9879" }, { name: "03 \u5F55\u5C4F", count: "8 \u9879" }, { name: "04 \u914D\u97F3", count: "5 \u9879" }, { name: "05 \u7EC4\u4EF6", count: "36 \u9879" }, { name: "06 \u52A8\u753B", count: "12 \u9879" }, { name: "07 \u5DE5\u7A0B", count: "4 \u9879" }, { name: "08 \u6210\u7247", count: "3 \u9879" }] },
      render(p, h) {
        return `<div class="os-stage os-device-stage"><div class="os-ipad" data-motion="reveal"><i class="os-ipad-camera"></i><div class="os-ipad-screen"><div class="os-ipad-logical"><div class="os-ipad-status"><span>${h.esc(p.time)}\u3000${h.esc(p.date)}</span><span>${cn(h, "wifi", 15)} ${h.esc(p.battery)}% <span class="os-ios-battery"><i style="width:${Math.max(0, Math.min(100, num5(p.battery, 100)))}%"></i></span></span></div><div class="os-ipad-content">${media2(p, h, iosFiles(p, h, true))}</div><div class="os-home-indicator"></div></div></div></div></div>`;
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
      defaults: { title: "\u6253\u5F00", path: ["\u6B64\u7535\u8111", "\u672C\u5730\u78C1\u76D8 (D:)", "\u89C6\u9891\u9879\u76EE"], search: "\u641C\u7D22 \u89C6\u9891\u9879\u76EE", locations: locationDefaults, activeLocation: "\u89C6\u9891", columns: ["\u540D\u79F0", "\u4FEE\u6539\u65E5\u671F", "\u7C7B\u578B", "\u5927\u5C0F"], files: filesDefaults, selected: 6, organize: "\u7EC4\u7EC7", newFolder: "\u65B0\u5EFA\u6587\u4EF6\u5939", fileNameLabel: "\u6587\u4EF6\u540D(N):", fileName: "scene-01.mp4", typeLabel: "\u6587\u4EF6\u7C7B\u578B(T):", fileType: "\u89C6\u9891\u6587\u4EF6 (*.mp4;*.mov)", open: "\u6253\u5F00(O)", cancel: "\u53D6\u6D88" },
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
      defaults: { title: "\u89C6\u9891\u9879\u76EE", path: ["\u6B64\u7535\u8111", "\u672C\u5730\u78C1\u76D8 (D:)", "\u89C6\u9891\u9879\u76EE"], search: "\u641C\u7D22 \u89C6\u9891\u9879\u76EE", locations: locationDefaults, activeLocation: "\u89C6\u9891", columns: ["\u540D\u79F0", "\u4FEE\u6539\u65E5\u671F", "\u7C7B\u578B", "\u5927\u5C0F"], files: filesDefaults, selected: 3, commands: [{ icon: "plus", label: "\u65B0\u5EFA" }, { icon: "cut", label: "" }, { icon: "copy", label: "" }, { icon: "paste", label: "" }, { icon: "rename", label: "" }, { icon: "share", label: "" }, { icon: "trash", label: "" }, { icon: "list", label: "\u6392\u5E8F" }, { icon: "grid", label: "\u67E5\u770B" }], status: "7 \u4E2A\u9879\u76EE\u3000|\u3000\u9009\u4E2D 1 \u4E2A\u9879\u76EE\u30008.00 KB" },
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
      defaults: { title: "\u8BBE\u7F6E", user: "Lin", email: "lin@example.com", initial: "L", search: "\u67E5\u627E\u8BBE\u7F6E", nav: ["\u4E3B\u9875", "\u7CFB\u7EDF", "\u84DD\u7259\u548C\u5176\u4ED6\u8BBE\u5907", "\u7F51\u7EDC\u548C Internet", "\u4E2A\u6027\u5316", "\u5E94\u7528", "\u8D26\u6237", "\u65F6\u95F4\u548C\u8BED\u8A00", "\u6E38\u620F", "\u8F85\u52A9\u529F\u80FD", "\u9690\u79C1\u548C\u5B89\u5168\u6027", "Windows \u66F4\u65B0"], selectedNav: 1, breadcrumb: "\u7CFB\u7EDF", pageTitle: "\u5C4F\u5E55", displayNumber: "1", displayNote: "\u5185\u7F6E\u663E\u793A\u5668", sectionTitle: "\u4EAE\u5EA6\u548C\u989C\u8272", brightness: 72, brightnessLabel: "\u4EAE\u5EA6", brightnessHelp: "\u8C03\u6574\u5185\u7F6E\u663E\u793A\u5668\u7684\u4EAE\u5EA6", nightTitle: "\u591C\u95F4\u6A21\u5F0F", nightHelp: "\u4F7F\u7528\u6696\u8272\u8BA9\u773C\u775B\u66F4\u8212\u9002", nightOn: false, onLabel: "\u5F00", offLabel: "\u5173", hdrTitle: "HDR", hdrHelp: "\u89C6\u9891\u3001\u6E38\u620F\u548C\u5E94\u7528\u4E2D\u7684\u9AD8\u52A8\u6001\u8303\u56F4", layoutTitle: "\u7F29\u653E\u548C\u5E03\u5C40", scaleTitle: "\u7F29\u653E", scaleHelp: "\u66F4\u6539\u6587\u672C\u3001\u5E94\u7528\u548C\u5176\u4ED6\u9879\u76EE\u7684\u5927\u5C0F", scaleValue: "150% (\u63A8\u8350)", resolutionTitle: "\u663E\u793A\u5668\u5206\u8FA8\u7387", resolutionValue: "2560 \xD7 1600 (\u63A8\u8350)", orientationTitle: "\u663E\u793A\u65B9\u5411", orientationValue: "\u6A2A\u5411" },
      render(p, h) {
        return `<div class="os-stage"><div class="os-window os-settings" data-motion="reveal"><div class="os-settings-title">${cn(h, "chevron-left", 16)}<span>${h.esc(p.title)}</span><span class="os-flex"></span>${winButtons(h)}</div><div class="os-settings-layout"><aside class="os-settings-nav"><div class="os-account"><span>${h.esc(p.initial)}</span><div><b>${h.esc(p.user)}</b><small>${h.esc(p.email)}</small></div></div><div class="os-settings-search">${h.esc(p.search)}${cn(h, "search", 15)}</div>${arr4(p.nav).map((x, i) => `<div class="${i === num5(p.selectedNav) ? "os-setting-selected" : ""}" data-motion="item">${cn(h, ["home", "monitor", "phone", "globe", "image", "grid", "file", "calendar", "play", "check-circle", "lock", "refresh"][i] || "settings", 19)}${h.esc(x)}</div>`).join("")}</aside><main class="os-settings-main"><h1><span>${h.esc(p.breadcrumb)}</span>${cn(h, "chevron-right", 23)}${h.esc(p.pageTitle)}</h1><div class="os-display-preview"><div>${h.esc(p.displayNumber)}</div><span>${h.esc(p.displayNote)}</span></div><h2>${h.esc(p.sectionTitle)}</h2><div class="os-setting-row" data-motion="item">${cn(h, "monitor", 21)}<div><b>${h.esc(p.brightnessLabel)}</b><small>${h.esc(p.brightnessHelp)}</small></div><div class="os-slider" style="--os-value:${Math.max(0, Math.min(100, num5(p.brightness, 70)))}%"><i data-motion="bar"></i><em></em></div>${cn(h, "chevron-down", 13)}</div><div class="os-setting-row" data-motion="item">${cn(h, "monitor", 21)}<div><b>${h.esc(p.nightTitle)}</b><small>${h.esc(p.nightHelp)}</small></div><span class="os-flex"></span><span>${h.esc(p.nightOn ? p.onLabel : p.offLabel)}</span><span class="os-toggle ${p.nightOn ? "os-toggle-on" : ""}"><i></i></span>${cn(h, "chevron-right", 13)}</div><div class="os-setting-row" data-motion="item">${cn(h, "video", 21)}<div><b>${h.esc(p.hdrTitle)}</b><small>${h.esc(p.hdrHelp)}</small></div><span class="os-flex"></span>${cn(h, "chevron-right", 13)}</div><h2>${h.esc(p.layoutTitle)}</h2>${[[p.scaleTitle, p.scaleHelp, p.scaleValue], [p.resolutionTitle, "", p.resolutionValue], [p.orientationTitle, "", p.orientationValue]].map((x, i) => `<div class="os-setting-row" data-motion="item">${cn(h, i === 0 ? "search" : "monitor", 21)}<div><b>${h.esc(x[0])}</b>${x[1] ? `<small>${h.esc(x[1])}</small>` : ""}</div><span class="os-flex"></span><div class="os-select" ${i === 2 ? 'data-motion="focus"' : ""}>${h.esc(x[2])}${cn(h, "chevron-down", 13)}</div></div>`).join("")}</main></div></div></div>`;
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
      defaults: { title: "PowerShell", terminalLines: ["PowerShell 7.4.6", "PS D:\\video-project> Get-ChildItem", "", "    Directory: D:\\video-project", "", "Mode                 LastWriteTime         Length Name", "----                 -------------         ------ ----", "d----          2026/9/17     10:24                assets", "d----          2026/9/17     10:26                compositions", "-a---          2026/9/17     11:02           8124 content.json", "", "PS D:\\video-project>"], query: "> \u65B0\u5EFA", heading: "\u547D\u4EE4", commands: [{ icon: "plus", label: "\u65B0\u5EFA\u6807\u7B7E\u9875", detail: "\u4F7F\u7528\u9ED8\u8BA4\u914D\u7F6E\u6587\u4EF6", shortcut: "Ctrl+Shift+T" }, { icon: "terminal", label: "\u65B0\u5EFA\u6807\u7B7E\u9875\u2026", detail: "\u9009\u62E9\u914D\u7F6E\u6587\u4EF6", shortcut: "\u203A" }, { icon: "monitor", label: "\u65B0\u5EFA\u7A97\u53E3", detail: "\u6253\u5F00\u65B0\u7684\u7EC8\u7AEF\u7A97\u53E3", shortcut: "Ctrl+Shift+N" }, { icon: "terminal", label: "\u65B0\u5EFA PowerShell \u6807\u7B7E\u9875", detail: "PowerShell", shortcut: "" }, { icon: "terminal", label: "\u65B0\u5EFA\u547D\u4EE4\u63D0\u793A\u7B26\u6807\u7B7E\u9875", detail: "Command Prompt", shortcut: "" }], selected: 0, hint: "\u6309 Enter \u8FD0\u884C\u547D\u4EE4", dismiss: "Esc \u5173\u95ED" },
      render(p, h) {
        return `<div class="os-stage"><div class="os-window os-terminal-window"><div class="os-terminal-tabs"><div>${cn(h, "terminal", 16)}${h.esc(p.title)}${cn(h, "x", 12)}</div>${tool(h, "plus")}${tool(h, "chevron-down")}<span class="os-flex"></span>${winButtons(h)}</div><pre class="os-terminal-content">${h.esc(arr4(p.terminalLines).join("\n"))}</pre><div class="os-palette" data-motion="reveal"><div class="os-palette-input"><span data-motion="type">${h.esc(p.query)}</span><i class="os-text-caret" data-motion="cursor"></i></div><div class="os-palette-heading">${h.esc(p.heading)}</div>${arr4(p.commands).map((x, i) => `<div class="os-palette-command ${i === num5(p.selected) ? "os-palette-active" : ""}" data-motion="item">${cn(h, x.icon, 20)}<div><b>${h.esc(x.label)}</b><small>${h.esc(x.detail)}</small></div><kbd>${h.esc(x.shortcut)}</kbd></div>`).join("")}<div class="os-palette-footer"><span>${h.esc(p.hint)}</span><span>${h.esc(p.dismiss)}</span></div></div></div></div>`;
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
      defaults: { title: "\u901A\u77E5", clear: "\u5168\u90E8\u6E05\u9664", date: "9\u670817\u65E5\uFF0C\u661F\u671F\u56DB", month: "2026\u5E749\u6708", weekdayLabels: ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"], monthStartOffset: 1, monthDays: 30, selectedDay: 17, notifications: [{ app: "\u89C6\u9891\u5DE5\u4F5C\u53F0", icon: "video", time: "\u73B0\u5728", title: "\u9884\u89C8\u5DF2\u51C6\u5907\u5C31\u7EEA", body: "\u6240\u6709\u7EC4\u4EF6\u5DF2\u52A0\u8F7D\uFF0C\u53EF\u4EE5\u68C0\u67E5\u753B\u9762\u548C\u52A8\u753B\u65F6\u95F4\u70B9\u3002", actions: ["\u6253\u5F00\u9884\u89C8"] }, { app: "\u6587\u4EF6\u8D44\u6E90\u7BA1\u7406\u5668", icon: "folder", time: "5 \u5206\u949F\u524D", title: "\u7D20\u6750\u5DF2\u590D\u5236", body: "8 \u4E2A\u9879\u76EE\u5DF2\u590D\u5236\u5230\u201C\u89C6\u9891\u9879\u76EE / assets\u201D\u3002", actions: [] }, { app: "\u65E5\u5386", icon: "calendar", time: "12 \u5206\u949F\u524D", title: "\u5F55\u5236\u7B2C\u4E8C\u6BB5\u8BB2\u89E3", body: "\u4ECA\u5929 14:00 \u2014 14:30", actions: ["\u7A0D\u540E\u63D0\u9192", "\u5173\u95ED"] }], focus: "\u4E13\u6CE8", focusTime: "30 \u5206\u949F" },
      render(p, h) {
        const count = Math.max(28, Math.min(31, num5(p.monthDays, 30)));
        const offset = Math.max(0, Math.min(6, num5(p.monthStartOffset, 0)));
        return `<div class="os-stage os-notification-stage"><div class="os-notification-shell" data-motion="reveal"><section class="os-notification-panel"><header><b>${h.esc(p.title)}</b><span class="os-button">${h.esc(p.clear)}</span></header>${arr4(p.notifications).map((x) => `<article class="os-notification" data-motion="item"><div class="os-notification-source">${fileIcon(h, x.icon, 17)}<span>${h.esc(x.app)}</span><small>${h.esc(x.time)}</small>${cn(h, "more", 16)}${cn(h, "x", 13)}</div><h3>${h.esc(x.title)}</h3><p>${h.esc(x.body)}</p>${arr4(x.actions).length ? `<div class="os-notification-actions">${x.actions.map((a) => `<span class="os-button">${h.esc(a)}</span>`).join("")}</div>` : ""}</article>`).join("")}</section><section class="os-calendar-panel"><header><b>${h.esc(p.date)}</b>${cn(h, "chevron-down", 15)}</header><div class="os-month-label"><b>${h.esc(p.month)}</b><span>${cn(h, "chevron-left", 16)}${cn(h, "chevron-right", 16)}</span></div><div class="os-calendar-grid">${arr4(p.weekdayLabels).map((x) => `<span class="os-weekday">${h.esc(x)}</span>`).join("")}${Array.from({ length: offset }, () => "<span></span>").join("")}${Array.from({ length: count }, (_, i) => `<span class="${i + 1 === num5(p.selectedDay) ? "os-day-selected" : ""}">${i + 1}</span>`).join("")}</div><footer><span>${h.esc(p.focusTime)}</span><span class="os-button">${cn(h, "play", 14)}${h.esc(p.focus)}</span></footer></section></div></div>`;
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
      defaults: { filename: "\u5206\u955C\u811A\u672C.md", filetype: "Markdown \u6587\u6863", topActions: [{ icon: "cut", label: "\u526A\u5207" }, { icon: "copy", label: "\u590D\u5236" }, { icon: "rename", label: "\u91CD\u547D\u540D" }, { icon: "share", label: "\u5171\u4EAB" }, { icon: "trash", label: "\u5220\u9664" }], items: [{ icon: "file", label: "\u6253\u5F00", shortcut: "Enter" }, { icon: "code", label: "\u6253\u5F00\u65B9\u5F0F", submenu: true }, { separator: true }, { icon: "link", label: "\u590D\u5236\u6587\u4EF6\u5730\u5740", shortcut: "Ctrl+Shift+C" }, { icon: "folder", label: "\u538B\u7F29\u4E3A ZIP \u6587\u4EF6" }, { icon: "check-circle", label: "\u6DFB\u52A0\u5230\u6536\u85CF\u5939" }, { separator: true }, { icon: "info", label: "\u5C5E\u6027", shortcut: "Alt+Enter" }, { separator: true }, { icon: "more", label: "\u663E\u793A\u66F4\u591A\u9009\u9879", shortcut: "Shift+F10" }], selected: 1, submenu: [{ icon: "code", label: "Visual Studio Code" }, { icon: "file", label: "\u8BB0\u4E8B\u672C" }, { icon: "globe", label: "Google Chrome" }, { separator: true }, { icon: "search", label: "\u9009\u62E9\u5176\u4ED6\u5E94\u7528" }], selectedSub: 0 },
      render(p, h) {
        return `<div class="os-stage"><div class="os-context-scene"><div class="os-context-file">${fileIcon(h, "file", 48)}<div><b>${h.esc(p.filename)}</b><small>${h.esc(p.filetype)}</small></div></div><div class="os-context-menu" data-motion="reveal"><div class="os-context-actions">${arr4(p.topActions).map((x) => `<span>${cn(h, x.icon, 18)}<small>${h.esc(x.label)}</small></span>`).join("")}</div>${arr4(p.items).map((x, i) => x.separator ? '<div class="os-menu-separator"></div>' : `<div class="os-menu-row ${i === num5(p.selected) ? "os-menu-hover" : ""}" data-motion="item">${cn(h, x.icon, 17)}<span>${h.esc(x.label)}</span><kbd>${h.esc(x.shortcut || "")}</kbd>${x.submenu ? cn(h, "chevron-right", 12) : ""}</div>`).join("")}</div><div class="os-context-submenu" data-motion="reveal">${arr4(p.submenu).map((x, i) => x.separator ? '<div class="os-menu-separator"></div>' : `<div class="os-menu-row ${i === num5(p.selectedSub) ? "os-menu-hover" : ""}" data-motion="item">${cn(h, x.icon, 18)}<span>${h.esc(x.label)}</span></div>`).join("")}</div></div></div>`;
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
      defaults: { appTitle: "\u89C6\u9891\u5DE5\u4F5C\u53F0", title: "\u521B\u5EFA\u9879\u76EE", description: "\u4E3A\u65B0\u7684\u89C6\u9891\u8BBE\u7F6E\u540D\u79F0\u3001\u4FDD\u5B58\u4F4D\u7F6E\u548C\u753B\u9762\u89C4\u683C\u3002", nav: [{ icon: "home", label: "\u4E3B\u9875" }, { icon: "folder", label: "\u9879\u76EE" }, { icon: "settings", label: "\u8BBE\u7F6E" }], activeNav: 1, fields: [{ label: "\u9879\u76EE\u540D\u79F0", value: "Codex \u5165\u95E8\u8BB2\u89E3", kind: "text", help: "\u4F7F\u7528\u7B80\u77ED\u3001\u5BB9\u6613\u8BC6\u522B\u7684\u540D\u79F0\u3002", focused: true }, { label: "\u4FDD\u5B58\u4F4D\u7F6E", value: "D:\\\u89C6\u9891\u9879\u76EE\\codex-intro", kind: "folder", help: "" }, { label: "\u753B\u9762\u6BD4\u4F8B", value: "16:9 \xB7 \u6A2A\u5C4F", kind: "select", help: "" }, { label: "\u9879\u76EE\u5E27\u7387", value: "30 fps", kind: "select", help: "" }], optionsTitle: "\u9879\u76EE\u9009\u9879", options: [{ label: "\u521B\u5EFA\u7D20\u6750\u6587\u4EF6\u5939", checked: true }, { label: "\u542F\u7528\u81EA\u52A8\u4FDD\u5B58", checked: true }, { label: "\u521B\u5EFA\u540E\u6253\u5F00\u9879\u76EE", checked: false }], note: "\u8BBE\u7F6E\u53EF\u4EE5\u968F\u65F6\u5728\u9879\u76EE\u5C5E\u6027\u4E2D\u4FEE\u6539\u3002", cancel: "\u53D6\u6D88", submit: "\u521B\u5EFA\u9879\u76EE" },
      render(p, h) {
        return `<div class="os-stage"><div class="os-window os-form-window" data-motion="reveal"><div class="os-settings-title">${cn(h, "video", 17)}<span>${h.esc(p.appTitle)}</span><span class="os-flex"></span>${winButtons(h)}</div><div class="os-form-layout"><aside>${arr4(p.nav).map((x, i) => `<div class="${i === num5(p.activeNav) ? "os-setting-selected" : ""}">${cn(h, x.icon, 19)}${h.esc(x.label)}</div>`).join("")}</aside><main><h1>${h.esc(p.title)}</h1><p>${h.esc(p.description)}</p><div class="os-form-fields">${arr4(p.fields).map((x) => `<div class="os-form-field" data-motion="item"><label>${h.esc(x.label)}</label><div class="os-input ${x.focused ? "os-focused" : ""}"><span data-motion="${x.focused ? "type" : "reveal"}">${h.esc(x.value)}</span>${x.kind === "select" ? cn(h, "chevron-down", 13) : x.kind === "folder" ? cn(h, "folder", 17) : ""}</div>${x.help ? `<small>${h.esc(x.help)}</small>` : ""}</div>`).join("")}</div><h2>${h.esc(p.optionsTitle)}</h2><div class="os-form-options">${arr4(p.options).map((x) => `<div data-motion="item"><span class="os-checkbox ${x.checked ? "os-checkbox-checked" : ""}">${x.checked ? cn(h, "check", 14) : ""}</span>${h.esc(x.label)}</div>`).join("")}</div><div class="os-form-note">${cn(h, "info", 17)}${h.esc(p.note)}</div><footer><div class="os-button">${h.esc(p.cancel)}</div><div class="os-button os-primary">${h.esc(p.submit)}</div></footer></main></div></div></div>`;
      }
    }
  ];

  // shared.mjs
  var esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
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
    const path = paths[name] ?? paths.file;
    return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;
  }
  function helpers(id) {
    return { esc, icon: icon3, uid: (s) => `${id}-${String(s).replace(/[^a-z0-9_-]/gi, "-")}` };
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
      } catch (e) {
        if (request === state3.token) state3.lastError = e.message || "\u89C6\u9891\u64AD\u653E\u5931\u8D25";
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
      } catch (e) {
        if (request === token) {
          lastError = e.message || "\u58F0\u97F3\u64AD\u653E\u5931\u8D25";
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
  var rows = [
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
  var expandedEffects = rows.map(([id, name, category, component2, selector, description]) => ({ id, name, category, component: component2, selector, description, duration: 8, previewTime: category === "\u8F6C\u573A" ? 2.28 : category === "\u9000\u573A" ? 3.6 : category === "\u80CC\u666F" ? 3.5 : 1.4, cueHints: cuesFor(id, category), silent: category === "\u80CC\u666F" }));
  function extendMotion(gsap, root, id, options, tl) {
    const wrap3 = root.querySelector(".motion-wrap") || root, start = Number(options.start ?? 0.6), W = root.clientWidth, H = root.clientHeight;
    const choose = (s) => [...root.querySelectorAll(options.selector || s)];
    const box = (e) => {
      const a = e.getBoundingClientRect(), b = root.getBoundingClientRect();
      return { x: a.x - b.x, y: a.y - b.y, w: a.width, h: a.height };
    };
    const make6 = (css4, html = "", parent = root) => {
      const e = document.createElement("div");
      e.dataset.generatedEffect = id;
      e.style.cssText = css4;
      e.innerHTML = html;
      parent.append(e);
      return e;
    };
    const overlay = () => {
      const e = make6("position:absolute;inset:0;z-index:900;pointer-events:none");
      e.className = "fx-layer";
      return e;
    };
    const frame2 = (b, color2 = "#2563eb") => make6(`position:absolute;left:${b.x - 6}px;top:${b.y - 6}px;width:${b.w + 12}px;height:${b.h + 12}px;border:2px solid ${color2};border-radius:8px;transform-origin:0 0`, "", overlay());
    const items = (s = '[data-motion="item"]') => {
      const a = choose(s);
      return a.length ? a : [wrap3];
    };
    const draw = (el, at, duration = 0.8) => {
      if (el.getTotalLength) {
        const length = el.getTotalLength();
        tl.fromTo(el, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration, ease: "power2.inOut" }, at);
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
      targets.forEach((e, i) => tl.fromTo(e, { x: -45, y: 40, rotation: -6, opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.65, ease: "power3.out" }, start + i * 0.13));
    }
    if (id === "center-stagger") {
      targets = items();
      targets.forEach((e, i) => {
        const b = box(e);
        tl.fromTo(e, { x: (W / 2 - b.x - b.w / 2) * 0.38, y: (H / 2 - b.y - b.h / 2) * 0.38, scale: 0.75, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.75, ease: "power3.out" }, start + i * 0.12);
      });
      const lines3 = choose('[data-motion="line"]');
      tl.fromTo(lines3, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.12 }, start + 0.65);
    }
    if (id === "border-assemble") {
      targets = items(".edx-lesson-shell");
      const b = box(targets[0]), l = overlay();
      const s = make6(`position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px`, `<svg width="100%" height="100%" viewBox="0 0 ${b.w} ${b.h}"><rect x="2" y="2" width="${b.w - 4}" height="${b.h - 4}" rx="25" fill="none" stroke="#2563eb" stroke-width="2"/></svg>`, l);
      draw(s.querySelector("rect"), start, 0.9);
      tl.fromTo(targets, { opacity: 0 }, { opacity: 1, duration: 0.5 }, start + 0.55);
      tl.to(s, { opacity: 0, duration: 0.3 }, start + 1.1);
    }
    if (id === "toggle-switch") {
      targets = items(".am-switch").slice(0, 1);
      const e = targets[0];
      e.style.setProperty("--knob-x", "0px");
      e.classList.add("fx-toggle");
      const style = document.createElement("style");
      style.textContent = ".fx-toggle:after{margin-left:0!important;transform:translateX(var(--knob-x))}";
      root.append(style);
      tl.fromTo(e, { backgroundColor: "#e5e5ea", "--knob-x": "0px" }, { backgroundColor: "#34c759", "--knob-x": "17px", duration: 0.3, ease: "power2.inOut" }, start);
    }
    if (id === "drag-drop") {
      targets = items(".edx-board article").slice(0, 1);
      const e = targets[0], b = box(e), cols = choose(".edx-board>section"), from = e.closest("section"), last = cols.at(-1), r = box(last), destCards = [...last.querySelectorAll("article")];
      if (from === last || destCards.length > 1) throw Error("\u4EFB\u52A1\u62D6\u653E\u9700\u8981\u6E90\u5217\u4E0E\u76EE\u6807\u5217\u4E0D\u540C\uFF0C\u4E14\u76EE\u6807\u5217\u6700\u591A\u5DF2\u6709\u4E00\u5F20\u5361");
      const lastCard = destCards.at(-1), destY = lastCard ? box(lastCard).y + box(lastCard).h + 14 : box(last.querySelector("h2")).y + box(last.querySelector("h2")).h + 20, dx = r.x + 19 - b.x, dy = destY - b.y;
      gsap.set(e, { zIndex: 20, position: "relative" });
      tl.to(e, { scale: 1.03, boxShadow: "0 15px 28px #20426a30", rotation: -2, duration: 0.2 }, start);
      tl.to(e, { x: dx * 0.5, y: Math.min(0, dy) - 45, rotation: 1, duration: 0.55, ease: "power2.in" }, start + 0.2);
      tl.to(e, { x: dx, y: dy, rotation: 0, duration: 0.55, ease: "power2.out" }, start + 0.75);
      tl.to(e, { scale: 1, boxShadow: "0 3px 9px #19365705", duration: 0.22 }, start + 1.3);
      const remaining = [...from.querySelectorAll("article")].filter((x) => x !== e);
      tl.to(remaining, { y: -b.h - 14, duration: 0.35, ease: "power2.inOut" }, start + 0.65);
      tl.set(from.querySelector("small"), { textContent: String(remaining.length) }, start + 1.3);
      tl.set(last.querySelector("small"), { textContent: String(destCards.length + 1) }, start + 1.3);
    }
    if (id === "text-select") {
      targets = items('[data-motion="type"]').slice(0, 1);
      const b = box(targets[0]), l = overlay(), m = make6(`position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;background:#2776d63d;transform-origin:left center`, "", l), cursor = make6(`position:absolute;left:${b.x}px;top:${b.y - 2}px;height:${b.h + 4}px;width:1px;background:#265aa0`, "", l);
      tl.fromTo(m, { scaleX: 0 }, { scaleX: 1, duration: 1.05, ease: "none" }, start);
      tl.fromTo(cursor, { x: 0, opacity: 0 }, { x: b.w, opacity: 1, duration: 1.05, ease: "none" }, start);
      tl.to(cursor, { opacity: 0, duration: 0.1 }, start + 1.08);
    }
    if (id === "slider-drag") {
      targets = items(".ap-control-slider i").slice(0, 1);
      targets.forEach((e) => {
        const width = e.style.width || "65%";
        tl.fromTo(e, { width: "12%" }, { width, duration: 1.05, ease: "power2.inOut" }, start);
      });
    }
    if (id === "dashed-frame") {
      targets = items(".edx-lesson-shell");
      const b = box(targets[0]), l = overlay();
      const f = make6(`position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border:3px dashed #2563eb;border-radius:25px`, "", l);
      tl.fromTo(f, { clipPath: "inset(0 100% 0 0)", opacity: 0 }, { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1.15, ease: "power2.inOut" }, start);
    }
    if (id === "corner-brackets") {
      targets = items('[data-motion="focus"]').slice(0, 1);
      const b = box(targets[0]), l = overlay();
      [[b.x - 7, b.y - 7, 1, 1], [b.x + b.w - 15, b.y - 7, -1, 1], [b.x - 7, b.y + b.h - 15, 1, -1], [b.x + b.w - 15, b.y + b.h - 15, -1, -1]].forEach(([x, y, sx, sy], i) => {
        const e = make6(`position:absolute;left:${x}px;top:${y}px;width:22px;height:22px;border-${sy > 0 ? "top" : "bottom"}:3px solid #2563eb;border-${sx > 0 ? "left" : "right"}:3px solid #2563eb`, "", l);
        tl.fromTo(e, { x: -sx * 15, y: -sy * 15, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, start + i * 0.055);
      });
    }
    if (id === "callout-pin") {
      targets = items('[data-motion="highlight"]').slice(0, 1);
      const field = targets[0], path = root.querySelector('.edu-callout-lines [data-motion="line"]'), note = root.querySelector(".edu-callout-notes article"), pin = field.querySelector("i");
      if (!path || !note || !pin) throw Error("\u5F15\u7EBF\u6807\u6CE8\u9700\u8981 annotation-callout \u7684\u771F\u5B9E\u951A\u70B9\u3001\u5F15\u7EBF\u548C\u8BF4\u660E\u5361");
      const length = path.getTotalLength();
      tl.fromTo(path, { strokeDasharray: length, strokeDashoffset: -length, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.75, ease: "power2.inOut" }, start + 0.2);
      tl.fromTo(pin, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(1.4)" }, start);
      tl.fromTo(note, { x: 12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, start + 0.75);
      if (options.label) note.querySelector("h3").textContent = options.label;
    }
    if (id === "number-tags") {
      targets = items().slice(0, 7);
      const l = overlay();
      targets.forEach((e, i) => {
        const b = box(e), tag2 = make6(`position:absolute;left:${Math.max(8, b.x - 11)}px;top:${Math.max(8, b.y - 13)}px;width:29px;height:29px;border-radius:50%;background:#2563eb;border:2px solid #fff;color:white;display:grid;place-items:center;font:14px ComponentMono`, String(i + 1), l);
        tl.fromTo(tag2, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.38, ease: "back.out(1.4)" }, start + i * 0.42);
      });
    }
    if (id === "branch-reveal" || id === "mindmap-expand") {
      const lines3 = choose('[data-motion="line"]'), nodes = items();
      targets = [...lines3, ...nodes];
      lines3.forEach((e, i) => draw(e, start + 0.3 + i * 0.15, 1.05));
      nodes.forEach((e, i) => tl.fromTo(e, { opacity: 0, scale: id === "mindmap-expand" ? 0.92 : 1, transformOrigin: "center center" }, { opacity: 1, scale: 1, duration: 0.4 }, start + (i === 0 ? 0 : 0.75 + i * 0.2)));
      if (id === "branch-reveal") tl.fromTo(choose(".edx-svg > text"), { opacity: 0 }, { opacity: 1, duration: 0.35, stagger: 0.16 }, start + 0.8);
    }
    if (id === "orbit-steps") {
      targets = items();
      const svg3 = root.querySelector(".edx-svg"), lines3 = choose('[data-motion="line"]'), NS = "http://www.w3.org/2000/svg";
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", lines3.map((p, i) => p.getAttribute("d").replace(/^M/, i ? "L" : "M")).join(" ") + "Z");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "none");
      svg3.insertBefore(path, svg3.querySelector('[data-motion="item"]'));
      const dot = document.createElementNS(NS, "circle");
      dot.setAttribute("r", "6");
      dot.setAttribute("fill", "#2563eb");
      svg3.insertBefore(dot, svg3.querySelector('[data-motion="item"]'));
      const length = path.getTotalLength(), state3 = { progress: 0 }, move = () => {
        const p = path.getPointAtLength(state3.progress * length);
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
      const b = box(targets[0]), l = overlay(), line3 = make6(`position:absolute;left:${b.x}px;top:${b.y}px;width:3px;height:${b.h}px;background:#2563eb;box-shadow:0 0 10px #2563eb30`, "", l);
      tl.fromTo(targets, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 2.4, ease: "power2.inOut" }, start);
      tl.fromTo(line3, { x: 0, opacity: 0 }, { x: b.w, opacity: 1, duration: 2.4, ease: "power2.inOut" }, start);
      tl.to(line3, { opacity: 0, duration: 0.2 }, start + 2.4);
    }
    if (id === "equation-build") {
      targets = items(".edx-formula article");
      targets.forEach((e, i) => tl.fromTo(e, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, start + i * 0.85));
      choose(".edx-formula>span").forEach((e, i) => tl.fromTo(e, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35 }, start + 0.55 + i * 0.85));
    }
    if (id === "pyramid-build") {
      targets = items().reverse();
      tl.fromTo(targets, { y: 22, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.42, duration: 0.55, ease: "power2.out" }, start);
    }
    if (id === "step-track") {
      targets = items(".edx-steps article");
      targets.forEach((e, i) => {
        tl.to(e, { borderColor: "#2563eb", backgroundColor: "#eaf2ff", duration: 0.25 }, start + i * 1.2);
        if (i < targets.length - 1) tl.to(e, { borderColor: "#dae6f4", backgroundColor: "#f5f8fd", duration: 0.25 }, start + (i + 1) * 1.2);
        const r = e.querySelector(".edx-step-result");
        if (r) tl.fromTo(r, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, start + i * 1.2 + 0.45);
      });
    }
    const focus = (e, scale) => {
      const b = box(e);
      return { scale, x: (W / 2 - b.x - b.w / 2) * scale, y: (H / 2 - b.y - b.h / 2) * scale };
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
      const a = focus(targets[0], 1.25);
      tl.to(wrap3, { ...a, duration: 1.15, ease: "power3.inOut" }, start);
      if (id === "focus-return") tl.to(wrap3, { scale: 1, x: 0, y: 0, duration: 1.2, ease: "power3.inOut" }, 4.5);
      else tl.to(wrap3, { ...focus(targets.at(-1), 1.25), duration: 1.3, ease: "power3.inOut" }, 3.3);
    }
    if (id === "tilt-settle") {
      targets = [wrap3];
      tl.fromTo(wrap3, { rotationY: -7, rotationX: 3, scale: 0.96, transformPerspective: 1300 }, { rotationY: 0, rotationX: 0, scale: 1, duration: 1.35, ease: "power3.out" }, start);
    }
    if (id === "parallax-depth") {
      targets = items();
      targets.forEach((e, i) => tl.fromTo(e, { x: (i % 3 - 1) * 30, y: (i % 3 - 1) * 12 }, { x: -(i % 3 - 1) * 30, y: -(i % 3 - 1) * 12, duration: 5.6, ease: "sine.inOut" }, start));
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
      targets.forEach((e, i) => {
        const original = e.getAttribute("stroke-dasharray"), len = Number(original.split(" ")[0]);
        tl.fromTo(e, { strokeDasharray: `0 ${942.4778}` }, { strokeDasharray: `${len} ${942.4778}`, duration: 1.15, ease: "power2.out" }, start + i * 0.35);
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
      targets.forEach((e) => {
        const end = e.getAttribute("points"), zero = end.trim().split(/\s+/).map(() => "470,230").join(" ");
        tl.fromTo(e, { attr: { points: zero } }, { attr: { points: end }, duration: 1.65, ease: "power2.out" }, start);
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
      const at = start + 2.7;
      targets = [wrap3];
      if (id === "fade-out") tl.to(wrap3, { opacity: 0, duration: 0.85 }, at);
      if (id === "slide-out-left") {
        wrap3.style.willChange = "transform, opacity";
        tl.to(wrap3, { x: -W, opacity: 0.3, duration: 0.8, ease: "power3.in" }, at);
      }
      if (id === "lift-away") tl.to(wrap3, { y: -H, scale: 0.97, duration: 0.85, ease: "power3.in" }, at);
      if (id === "shrink-center") tl.to(wrap3, { scale: 0.65, opacity: 0, duration: 0.7, ease: "power3.in" }, at);
      if (id === "iris-close") tl.fromTo(wrap3, { clipPath: "circle(75% at 50% 50%)" }, { clipPath: "circle(0% at 50% 50%)", duration: 0.85, ease: "power3.inOut" }, at);
      if (id === "mask-retract") tl.fromTo(wrap3, { clipPath: "inset(0 0% 0 0)" }, { clipPath: "inset(0 100% 0 0)", duration: 0.8, ease: "power3.inOut" }, at);
      if (id === "stagger-out") {
        targets = items();
        tl.to(targets, { opacity: 0, y: -20, duration: 0.4, stagger: 0.14, ease: "power2.in" }, at);
      }
      if (id === "blur-out") {
        gsap.set(wrap3, { filter: "blur(0px)" });
        tl.to(wrap3, { filter: "blur(12px)", opacity: 0, scale: 1.03, duration: 0.8, ease: "power2.in" }, at);
      }
      if (id === "split-away") {
        const clone = wrap3.cloneNode(true);
        clone.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id"));
        clone.style.cssText = "position:absolute;inset:0;pointer-events:none";
        wrap3.parentNode.append(clone);
        tl.set(wrap3, { clipPath: "inset(0 50% 0 0)" }, 0);
        tl.set(clone, { clipPath: "inset(0 0 0 50%)" }, 0);
        tl.to(wrap3, { x: -W * 0.55, opacity: 0, duration: 0.8, ease: "power3.in" }, at);
        tl.to(clone, { x: W * 0.55, opacity: 0, duration: 0.8, ease: "power3.in" }, at);
        targets.push(clone);
      }
    }
    if (["success-toast", "save-pulse", "copy-confirm", "loading-resolve", "warning-breathe", "notification-ping", "soft-confetti"].includes(id)) {
      targets = items('[data-motion="focus"]').slice(0, 1);
      const l = overlay();
      if (id === "success-toast" || id === "save-pulse") {
        const save = id === "save-pulse", t = make6(`position:absolute;left:${save ? W - 236 : W / 2 - 120}px;top:${save ? 94 : 38}px;background:${save ? "#edf8f2" : "#fff"};border:1px solid #c7e2d6;border-radius:10px;padding:13px 18px;box-shadow:0 6px 20px #1f423718;color:#326c53;font-size:15px`, "", l);
        t.textContent = "\u2713\u3000" + (options.label || (save ? "\u5DF2\u4FDD\u5B58" : "\u64CD\u4F5C\u5DF2\u5B8C\u6210"));
        tl.fromTo(t, { opacity: 0, y: -12, scale: save ? 0.9 : 1 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }, start);
        if (save) tl.to(t, { scale: 1.035, duration: 0.22, repeat: 1, yoyo: true }, start + 0.4);
        else tl.to(t, { opacity: 0, y: -8, duration: 0.35 }, start + 2.6);
      }
      if (id === "copy-confirm") {
        const b = box(targets[0]), tag2 = make6(`position:absolute;left:${Math.min(W - 145, b.x + b.w - 110)}px;top:${Math.max(12, b.y - 39)}px;border-radius:7px;padding:8px 13px;background:#25364f;color:white;font-size:14px`, "\u2713 \u5DF2\u590D\u5236", l);
        tl.fromTo(tag2, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 }, start);
        tl.to(tag2, { opacity: 0, y: -4, duration: 0.3 }, start + 2);
      }
      if (id === "loading-resolve") {
        const t = make6(`position:absolute;left:${W / 2 - 95}px;top:${H / 2 - 32}px;width:190px;height:64px;border:1px solid #d7e3f3;border-radius:12px;background:white;box-shadow:0 10px 25px #24426622;display:flex;align-items:center;gap:14px;padding:17px;color:#356194;font-size:14px`, '<i style="width:23px;height:23px;border:2px solid #dce9fa;border-top-color:#2563eb;border-radius:50%"></i><span>\u6B63\u5728\u5904\u7406\u2026</span><b style="position:absolute;left:18px;color:#438967;opacity:0">\u2713</b>', l);
        tl.fromTo(t, { opacity: 0 }, { opacity: 1, duration: 0.2 }, start);
        tl.to(t.querySelector("i"), { rotation: 540, duration: 1.55, ease: "none" }, start);
        tl.to(t.querySelector("i"), { opacity: 0, duration: 0.1 }, start + 1.65);
        tl.to(t.querySelector("b"), { opacity: 1, duration: 0.15 }, start + 1.65);
        tl.set(t.querySelector("span"), { textContent: "\u5904\u7406\u5B8C\u6210" }, start + 1.65);
        tl.to(t, { opacity: 0, duration: 0.35 }, start + 3.4);
      }
      if (id === "warning-breathe") {
        const b = box(targets[0]), f = frame2(b, "#6686c5");
        tl.fromTo(f, { opacity: 0 }, { opacity: 1, duration: 0.3 }, start);
        tl.to(f, { scaleX: 1.02, scaleY: 1.04, opacity: 0.45, duration: 0.5, repeat: 3, yoyo: true, ease: "sine.inOut" }, start + 0.3);
      }
      if (id === "notification-ping") {
        targets = items(".ap-notification").slice(0, 1);
        const b = box(targets[0]);
        for (let i = 0; i < 2; i++) {
          const e = make6(`position:absolute;left:${b.x - 7}px;top:${b.y + 9}px;width:15px;height:15px;border:2px solid #4c92d5;border-radius:50%`, "", l);
          tl.fromTo(e, { scale: 0, opacity: 0 }, { scale: 2.7, opacity: 0.8, duration: 0.35 }, start + i * 0.2);
          tl.to(e, { scale: 4, opacity: 0, duration: 0.6 }, start + 0.35 + i * 0.2);
        }
      }
      if (id === "soft-confetti") {
        for (let i = 0; i < 16; i++) {
          const e = make6(`position:absolute;left:${W * 0.5}px;top:${H * 0.34}px;width:${i % 2 ? 5 : 7}px;height:${i % 2 ? 12 : 7}px;border-radius:2px;background:${i % 2 ? "#81c9b0" : "#4980df"}`, "", l), a = i / 16 * Math.PI * 2;
          tl.fromTo(e, { x: 0, y: 0, rotation: 0, opacity: 0 }, { x: Math.cos(a) * 180, y: Math.sin(a) * 105, rotation: i * 33, opacity: 0.8, duration: 0.65, ease: "power3.out" }, start);
          tl.to(e, { y: Math.sin(a) * 105 + 120, rotation: i * 33 + 90, opacity: 0, duration: 1.2, ease: "power2.in" }, start + 0.65);
        }
      }
    }
    const transitions = ["iris-reveal", "wipe-transition", "curve-ribbon", "diagonal-ribbon", "shared-slide", "soft-dissolve", "zoom-through", "card-lift", "blinds-swap", "liquid-sweep"];
    if (transitions.includes(id)) {
      const next = root.querySelector(".motion-next");
      if (!next) throw Error("\u8F6C\u573A\u9700\u8981 A/B \u4E24\u5E45\u5185\u5BB9\uFF0C\u8BF7\u901A\u8FC7 mountNext \u88C5\u914D");
      targets = [wrap3, next];
      const at = Number(options.transitionAt ?? 2.1), duration = Number(options.transitionDuration ?? 0.66);
      if (at < 0 || duration < 0.35 || at + duration > 7.8) throw Error("\u8F6C\u573A\u65F6\u70B9\u6216\u957F\u5EA6\u8D85\u51FA\u516B\u79D2\u6A21\u677F\u8303\u56F4");
      tl.set(next, { opacity: 0 }, 0);
      root.dataset.transitionStart = String(at);
      root.dataset.transitionEnd = String(at + duration);
      root.dataset.transitionCut = String(at + duration * 0.5);
      if (id === "iris-reveal") {
        tl.set(next, { opacity: 1, clipPath: "circle(0% at 50% 50%)" }, at);
        tl.to(next, { clipPath: "circle(75% at 50% 50%)", duration, ease: "power3.inOut" }, at);
        tl.set(wrap3, { opacity: 0 }, at + duration);
      }
      if (id === "shared-slide") {
        const oldParts = [...wrap3.querySelectorAll(".edx-lesson-shell,.edx-lesson-caption")], nextBg = next.querySelector(".edx-ambient"), nextStage = next.querySelector(".edx-lecture");
        if (nextBg) nextBg.style.opacity = "0";
        if (nextStage) nextStage.style.background = "transparent";
        tl.set(next, { opacity: 1, x: W }, at);
        tl.to(oldParts.length ? oldParts : wrap3, { x: -W, duration, ease: "power3.inOut" }, at);
        tl.to(next, { x: 0, duration, ease: "power3.inOut" }, at);
      }
      if (id === "soft-dissolve") {
        tl.to(wrap3, { opacity: 0, filter: "blur(5px)", duration, ease: "sine.inOut" }, at);
        tl.fromTo(next, { opacity: 0, filter: "blur(5px)" }, { opacity: 1, filter: "blur(0px)", duration, ease: "sine.inOut" }, at);
      }
      if (id === "zoom-through") {
        tl.to(wrap3, { scale: 1.28, opacity: 0, duration, ease: "power2.in" }, at);
        tl.fromTo(next, { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration, ease: "power2.out" }, at);
      }
      if (id === "card-lift") {
        tl.set(wrap3, { zIndex: 3, position: "relative" }, 0);
        tl.set(next, { opacity: 1, zIndex: 2 }, at);
        tl.to(wrap3, { y: -H * 1.2, rotation: -5, scale: 0.97, duration, ease: "power3.in" }, at);
        tl.fromTo(next, { scale: 0.97 }, { scale: 1, duration, ease: "power3.out" }, at);
      }
      if (id === "blinds-swap") {
        const key = (root.closest("[data-composition-src]")?.id || root.dataset.compositionId || "gallery") + "-blind-mask";
        const defs = make6("position:absolute;width:0;height:0;overflow:hidden", `<svg width="0" height="0"><defs><clipPath id="${key}" clipPathUnits="userSpaceOnUse">${Array.from({ length: 6 }, (_, i) => `<rect x="${i * W / 6}" y="0" width="${W / 6 + 0.5}" height="0"/>`).join("")}</clipPath></defs></svg>`);
        tl.set(next, { opacity: 1, clipPath: `url(#${key})` }, at);
        [...defs.querySelectorAll("rect")].forEach((r, i) => tl.fromTo(r, { attr: { height: 0 } }, { attr: { height: H }, duration: duration * 0.68, ease: "power3.inOut" }, at + i * duration * 0.064));
        tl.set(next, { clipPath: "none" }, at + duration);
        tl.set(wrap3, { opacity: 0 }, at + duration);
      }
      if (["wipe-transition", "curve-ribbon", "diagonal-ribbon", "liquid-sweep"].includes(id)) {
        const l = overlay(), colors3 = ["#d9e8ff", "#81c9b0", "#2563eb"], stagger = duration * 0.05, enter2 = duration * 0.4, cut = at + enter2 + 2 * stagger;
        l.dataset.effectSpace = "canvas";
        root.dataset.transitionCut = String(cut);
        tl.set(next, { opacity: 1 }, cut);
        tl.set(wrap3, { opacity: 0 }, cut);
        colors3.forEach((color2, i) => {
          let e;
          if (id === "curve-ribbon" || id === "liquid-sweep") {
            const k = id === "curve-ribbon" ? W * 0.19 : W * 0.12, shape = id === "curve-ribbon" ? `M0 0H${W + k}Q${W - k} ${H * 0.5} ${W + k} ${H}H0Z` : `M0 0H${W + k}C${W - k} ${H * 0.24} ${W + 2 * k} ${H * 0.7} ${W + k} ${H}H0Z`;
            e = make6(`position:absolute;inset:0;width:${W + k * 2}px;height:${H}px`, `<svg width="100%" height="100%" viewBox="0 0 ${W + k * 2} ${H}"><path d="${shape}" fill="${color2}"/></svg>`, l);
            tl.fromTo(e, { x: -W - k * 2 }, { x: 0, duration: enter2, ease: "power2.inOut" }, at + i * stagger);
            tl.to(e, { x: W + k * 2, duration: enter2 * 0.85, ease: "power2.inOut" }, cut + 0.025 + i * stagger);
          } else {
            const diagonal = id === "diagonal-ribbon", off = W * (diagonal ? 1.65 : 1.06);
            e = make6(`position:absolute;left:-${W * (diagonal ? 0.15 : 0.01)}px;top:-${H * (diagonal ? 0.35 : 0.05)}px;width:${W * (diagonal ? 1.3 : 1.02)}px;height:${H * (diagonal ? 1.7 : 1.1)}px;border-radius:${diagonal ? "130" : "0"}px;background:${color2}`, "", l);
            tl.fromTo(e, { x: -off, rotation: diagonal ? -17 : 0 }, { x: 0, duration: enter2, ease: "power2.inOut" }, at + i * stagger);
            tl.to(e, { x: off, duration: enter2 * 0.85, ease: "power2.inOut" }, cut + 0.025 + i * stagger);
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
        const inner = make6("position:absolute;inset:-120px;pointer-events:none", "", bg);
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
            const e = document.createElementNS(ns, "line");
            for (const [k, v] of Object.entries({ x1, y1, x2, y2, stroke: "#9cb8df", "stroke-width": 1.25, "stroke-opacity": 0.48 })) e.setAttribute(k, String(v));
            e.dataset.gridLine = kind;
            svg3.append(e);
            return e;
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
          [["#c5ddff", -120, -105, 370], ["#b4e2d1", W - 200, H - 200, 420], ["#e4edff", W - 260, -180, 250]].forEach(([color2, x, y, size], i) => {
            const e = make6(`position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:50%;background:${color2};opacity:${id === "ambient-breath" ? 0.37 : 0.46};filter:${id === "ambient-breath" ? "blur(40px)" : "none"}`, "", bg);
            tl.fromTo(e, { x: 0, y: 0, scale: 1 }, { x: i % 2 ? -26 : 28, y: i % 2 ? -24 : 20, scale: id === "ambient-breath" ? 1.22 : 1.03, duration: d, ease: "sine.inOut" }, 0);
          });
        }
        if (id === "contour-flow" || id === "wave-bands") {
          const wave = id === "wave-bands";
          inner.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 ${W + 240} ${H + 240}" preserveAspectRatio="none">${Array.from({ length: wave ? 4 : 14 }, (_, i) => `<path d="M-100 ${80 + i * (wave ? 180 : 78)}C380 ${-140 + i * (wave ? 160 : 71)} 970 ${370 + i * (wave ? 120 : 62)} ${W + 360} ${130 + i * (wave ? 170 : 67)}" fill="none" stroke="${i % 2 ? "#81c9b0" : "#7ca5de"}" stroke-width="${wave ? 70 : 1.4}" opacity="${wave ? 0.11 : 0.25}"/>`).join("")}</svg>`;
          tl.fromTo(inner, { x: -40, y: -20 }, { x: 45, y: 30, duration: d, ease: "sine.inOut" }, 0);
        }
        if (id === "ring-orbit") {
          [[15, 5, 430], [W - 125, H - 60, 520]].forEach(([x, y, size], j) => {
            const e = make6(`position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;border:1px solid #7aa2d94a`, "", bg);
            [0.7, 0.85].forEach((s) => make6(`position:absolute;inset:${(1 - s) * 50}%;border-radius:50%;border:1px dashed #82b8a860`, "", e));
            make6(`position:absolute;left:50%;top:-4px;width:8px;height:8px;border-radius:50%;background:#81b0dc`, "", e);
            tl.fromTo(e, { rotation: 0 }, { rotation: j ? -48 : 42, duration: d, ease: "none" }, 0);
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
      name: "\u901A\u77E5\u9010\u9879\u6838\u5BF9",
      component: "ani-notice-check",
      description: "\u4ECE\u5B8C\u6574\u901A\u77E5\u5F00\u59CB\uFF0C\u9010\u884C\u805A\u7126\u5E76\u7559\u4E0B\u68C0\u67E5\u52FE\uFF0C\u6700\u540E\u663E\u793A\u6838\u5BF9\u7ED3\u679C\u3002",
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
      name: "\u8BA2\u5355\u6761\u4EF6\u7B5B\u9009",
      component: "ani-order-filter",
      description: "\u5148\u4FDD\u7559\u5B8C\u6574\u8BA2\u5355\u8868\uFF0C\u964D\u4F4E\u4E0D\u7B26\u5408\u6761\u4EF6\u7684\u884C\uFF0C\u518D\u663E\u793A\u7B5B\u9009\u7ED3\u679C\u3002",
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
  function compareFlow(flow, tl, at) {
    const joins = [...flow.querySelectorAll("[data-ani-flow-join]")];
    const trunks = [...flow.querySelectorAll("[data-ani-flow-trunk]")];
    const bridge = [...flow.querySelectorAll("[data-ani-flow-bridge] path")];
    const result = flow.querySelector("[data-ani-flow-result]");
    const footer2 = flow.querySelector("[data-ani-flow-footer]");
    const draw = (paths2, start, duration) => paths2.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length);
      path.style.opacity = "0";
      tl.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 }, 0);
      tl.set(path, { opacity: 1 }, start);
      tl.fromTo(path, { strokeDashoffset: length }, {
        strokeDashoffset: 0,
        duration,
        ease: "none",
        autoRound: false,
        immediateRender: false
      }, start);
    });
    draw(joins, at, 0.45);
    draw(trunks, at + 0.45, 0.7);
    tl.fromTo(result, { opacity: 0 }, {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out"
    }, at + 1.15);
    draw(bridge, at + 1.55, 0.25);
    tl.fromTo(footer2, { opacity: 0 }, {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out"
    }, at + 1.8);
    return [...joins, ...trunks, ...bridge, result, footer2];
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
    links.forEach((node3, index) => {
      const at = linksAt + index * Math.min(0.2, 1.2 / Math.max(1, links.length - 1));
      const length = typeof node3.getTotalLength === "function" ? node3.getTotalLength() : 0;
      if (length > 0) tl.fromTo(node3, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 }, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 0.65,
        ease: "power2.inOut"
      }, at);
      else tl.fromTo(node3, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "sine.out" }, at);
    });
    const resultAt = Math.max(4.8, linksAt + 1.5);
    const movingResults = result.filter((node3) => !node3.hasAttribute("data-ani-stationary"));
    if (movingResults.length) tl.fromTo(movingResults, { y: 10, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.45,
      stagger: 0.12,
      ease: "power2.out"
    }, resultAt);
    result.filter((node3) => node3.hasAttribute("data-ani-stationary")).forEach((node3) => {
      tl.fromTo(node3, { opacity: 0 }, {
        opacity: 1,
        duration: 0.45,
        ease: "power2.out"
      }, resultAt + result.indexOf(node3) * 0.12);
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
        [...row.querySelectorAll("[data-ani-row-bg], [data-ani-status-bg]")].forEach((node3) => {
          const originalFill = node3.getAttribute("fill") || "#ffffff";
          const finalFill = node3.hasAttribute("data-ani-status-bg") ? "#e2e8f0" : "#f4f6f8";
          tl.fromTo(node3, { fill: originalFill }, {
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
    const rows2 = [...root.querySelectorAll("[data-ani-row]")];
    const focus = [...root.querySelectorAll("[data-ani-focus]")];
    const checks = [...root.querySelectorAll("[data-ani-check]")];
    const results = [...root.querySelectorAll("[data-ani-result]")];
    const total = Number(options.duration || 8);
    const start = Number(options.start ?? 0.6);
    const count = Math.max(rows2.length, focus.length, checks.length, 1);
    const step = Math.min(1.18, Math.max(0.42, (total - start - 2) / count));
    const targets = [...focus, ...checks, ...results];
    if (targets.length) {
      gsap.set(targets, { opacity: 0 });
      tl.set(targets, { opacity: 0 }, 0);
    }
    focus.forEach((node3, index) => {
      const at = start + index * step;
      tl.fromTo(node3, { opacity: 0 }, {
        opacity: 1,
        duration: 0.16,
        ease: "sine.out",
        immediateRender: false
      }, at);
      tl.fromTo(node3, { opacity: 1 }, {
        opacity: 0,
        duration: 0.2,
        ease: "sine.inOut",
        immediateRender: false
      }, at + step - 0.22);
    });
    checks.forEach((node3, index) => {
      tl.fromTo(node3, { opacity: 0 }, {
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
    }, start + count * step + 0.25);
    return targets;
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
  var effects = [...legacyEffects.map((e) => e.category === "\u8F6C\u573A" ? { ...e, component: "lecture-stage", previewTime: 2.28, cueHints: [{ sound: "whoosh", at: 2.1, gain: 0.24, duration: 0.7 }], name: e.id === "wipe-transition" ? "\u4E09\u5C42\u77ED\u906E\u5E45\u8F6C\u573A" : "\u5706\u5F62\u753B\u9762\u4EA4\u63A5", description: e.id === "wipe-transition" ? "\u6D45\u84DD\u3001\u8584\u8377\u4E0E\u84DD\u8272\u77ED\u906E\u5E45\u63A5\u529B\uFF1B\u5B8C\u5168\u906E\u6321\u65F6\u5207\u6362\u5230\u72EC\u7ACB\u7684\u65B0\u753B\u9762\u3002" : "\u5706\u5F62\u906E\u7F69\u4ECE\u4E0A\u4E00\u5E45\u5185\u5BB9\u4E2D\u63ED\u5F00\u4E0B\u4E00\u5E45\u5185\u5BB9\u3002" } : e), ...expandedEffects, ...animationStyleEffects, ...pendingAnimationStyleEffects];
  function buildEffect(gsap, root, id, options = {}) {
    gsap.config({ force3D: false });
    const tl = gsap.timeline({ paused: true });
    const wrap3 = root.querySelector(".motion-wrap") || root;
    gsap.set(wrap3, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
    const total = Number(options.duration || 8), start = Number(options.start ?? 0.6);
    const choose = (selector, fallback) => {
      let n3 = [...root.querySelectorAll(options.selector || selector)];
      if (!n3.length && fallback) n3 = [...root.querySelectorAll(fallback)];
      return n3;
    };
    const rect = (el) => {
      const a = el.getBoundingClientRect(), b = root.getBoundingClientRect();
      return { x: a.x - b.x, y: a.y - b.y, w: a.width, h: a.height };
    };
    const layer = () => {
      const e = document.createElement("div");
      e.className = "fx-layer";
      e.dataset.generatedEffect = id;
      root.appendChild(e);
      return e;
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
        for (const node3 of texts) {
          const f = document.createDocumentFragment();
          for (const c of Array.from(node3.textContent)) {
            const span = document.createElement("span");
            span.textContent = c;
            span.dataset.fxChar = "";
            f.appendChild(span);
            chars.push(span);
          }
          node3.replaceWith(f);
        }
        const typingDuration = 1.2, characterFade = 0.025, stagger = chars.length > 1 ? (typingDuration - characterFade) / (chars.length - 1) : 0, at = start + row * 0.58;
        if (chars.length) tl.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: characterFade, stagger, ease: "none" }, at);
        commandsEnd = Math.max(commandsEnd, Number((at + typingDuration).toFixed(6)));
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
      targets = targets.filter((e) => e.getBoundingClientRect().width > 18 || e.getBoundingClientRect().height > 18);
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
      const target = targets[0] || wrap3, b = rect(target);
      const x = b.x + b.w * 0.6, y = b.y + b.h * 0.54;
      const l = layer();
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
      const b = rect(targets[0] || wrap3), rb = rect(root);
      const factor = Number(options.scale || 1.32);
      const x = (rb.w / 2 - (b.x + b.w / 2)) * (factor - 1), y = (rb.h / 2 - (b.y + b.h / 2)) * (factor - 1);
      tl.to(wrap3, { scale: factor, x, y, duration: 1.2, ease: "power3.inOut" }, start);
    }
    if (id === "spotlight") {
      targets = choose('[data-motion="focus"]', "input");
      const b = rect(targets[0] || wrap3), rb = rect(root);
      const x = Math.max(0, b.x - 7), y = Math.max(0, b.y - 7), w = Math.min(rb.w - x, b.w + 14), h = Math.min(rb.h - y, b.h + 14);
      const l = layer();
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
        const number5 = Number(match[0].replaceAll(",", "")), decimals = (match[0].split(".")[1] || "").length, state3 = { n: 0 };
        const update = () => {
          let formatted = state3.n.toFixed(decimals);
          if (match[0].includes(",")) {
            const parts = formatted.split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            formatted = parts.join(".");
          }
          el.textContent = original.replace(match[0], formatted);
        };
        tl.fromTo(state3, { n: 0 }, { n: number5, duration: 1.7, ease: "power2.out", onUpdate: update }, start + i * 0.14);
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
      const l = layer();
      targets.slice(0, 5).forEach((el, i) => {
        const b = rect(el), line3 = document.createElement("div");
        line3.className = "fx-underline";
        line3.style.cssText = `left:${b.x}px;top:${b.y + b.h + 4}px;width:${b.w}px`;
        l.appendChild(line3);
        tl.fromTo(line3, { scaleX: 0 }, { scaleX: 1, duration: 0.65, ease: "power2.out" }, start + i * 0.85);
      });
    }
    if (id === "window-exit") {
      targets = [wrap3];
      const b = rect(root);
      tl.fromTo(wrap3, { x: 0, y: 0, scale: 1, opacity: 1 }, { x: b.w * 0.28, y: b.h * 0.3, scale: 0.7, opacity: 0, duration: 0.78, ease: "power3.in", transformOrigin: "right bottom" }, start + 2.75);
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
      const b = rect(targets[0]), l = layer(), pad2 = 6, w = b.w + pad2 * 2, h = b.h + pad2 * 2;
      l.innerHTML = `<svg style="position:absolute;left:${b.x - pad2}px;top:${b.y - pad2}px;overflow:visible" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect x="1.5" y="1.5" width="${Math.max(1, w - 3)}" height="${Math.max(1, h - 3)}" rx="7" fill="none" stroke="#2563eb" stroke-width="2.5"/></svg>`;
      const path = l.querySelector("rect"), length = path.getTotalLength();
      tl.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, start);
    }
    if (id === "marker-sweep") {
      targets = choose('[data-motion="emphasis"]', "strong");
      if (!targets.length) targets = [wrap3];
      const l = layer();
      targets.slice(0, 4).forEach((el, i) => {
        const b = rect(el), mark = document.createElement("div");
        mark.style.cssText = `position:absolute;left:${b.x - 3}px;top:${b.y + b.h * 0.44}px;width:${b.w + 6}px;height:${Math.max(7, b.h * 0.55)}px;background:#81c9b057;border-radius:3px;transform-origin:left center;mix-blend-mode:multiply`;
        l.appendChild(mark);
        tl.fromTo(mark, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, start + i * 0.85);
      });
    }
    if (id === "focus-hop") {
      targets = choose('[data-motion="highlight"]', '[data-motion="item"]');
      if (!targets.length) targets = [wrap3];
      targets = targets.slice(0, 3);
      const boxes = targets.map((el) => rect(el)), b = boxes[0], l = layer(), frame2 = document.createElement("div");
      frame2.style.cssText = `position:absolute;left:${b.x - 6}px;top:${b.y - 6}px;width:${b.w + 12}px;height:${b.h + 12}px;border:2px solid #2563eb;border-radius:6px;background:#2563eb08;transform-origin:left top`;
      l.appendChild(frame2);
      tl.fromTo(frame2, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "sine.out" }, start);
      boxes.slice(1).forEach((next, i) => {
        tl.to(frame2, { x: next.x - b.x, y: next.y - b.y, scaleX: (next.w + 12) / (b.w + 12), scaleY: (next.h + 12) / (b.h + 12), duration: 0.42, ease: "power3.inOut" }, start + (i + 1) * 1.4);
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
      icons.forEach((path) => {
        const length = path.getTotalLength();
        tl.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, start + 1.08);
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
      const path = targets[0];
      if (path) {
        const length = path.getTotalLength(), matrix = path.getScreenCTM(), rb = root.getBoundingClientRect(), pathRect = rect(path), points = Array.from({ length: 65 }, (_, i) => {
          const p = path.getPointAtLength(length * i / 64);
          return { x: matrix.a * p.x + matrix.c * p.y + matrix.e - rb.x, y: matrix.b * p.x + matrix.d * p.y + matrix.f - rb.y };
        });
        const l = layer(), needle = document.createElement("div"), dot = document.createElement("div");
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
      const boxes = targets.map((el) => rect(el)), middle = boxes.reduce((sum, b) => sum + b.y + b.h / 2, 0) / boxes.length;
      targets.forEach((el, i) => {
        const b = boxes[i];
        tl.fromTo(el, { y: middle - b.y - b.h / 2, opacity: i === targets.length - 1 ? 1 : 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.inOut" }, start);
      });
      const text6 = [...root.querySelectorAll(".edu-layer-descriptions article")], lines3 = [...root.querySelectorAll('.edu-layer-art [data-motion="line"]')];
      if (text6.length) tl.fromTo(text6, { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.12, ease: "power2.out" }, start + 0.85);
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
      const b = rect(targets[0]), l = layer(), stamp = document.createElement("div");
      const x = Math.max(14, b.x + b.w - 92), y = Math.max(14, b.y - 66);
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
      const color2 = getComputedStyle(targets[0]).borderColor;
      tl.to(targets, { keyframes: [{ x: -7, duration: 0.08 }, { x: 6, duration: 0.08 }, { x: -4, duration: 0.08 }, { x: 3, duration: 0.08 }, { x: 0, duration: 0.13 }], ease: "none" }, start);
      tl.fromTo(targets, { borderColor: color2 }, { borderColor: "#be5260", duration: 0.15, ease: "sine.out" }, start);
      tl.to(targets, { borderColor: color2, duration: 0.35, ease: "sine.inOut" }, start + 1.1);
    }
    const extended = extendMotion(gsap, root, id, options, tl);
    if (extended.length) targets = extended;
    const animationStyleTargets = extendAnimationStyleMotion(gsap, root, id, options, tl);
    if (animationStyleTargets.length) targets = animationStyleTargets;
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
    for (const { node: node3, anchor } of prior.nodes) {
      if (anchor.parentNode === root) {
        root.insertBefore(node3, anchor);
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
  function decorateFrame(back, front, id, w, h, radius) {
    const size = `border-radius:${radius}px;`;
    back.style.cssText += size;
    front.style.cssText += size;
    if (id === "thin-blue") front.style.cssText += "border:1.5px solid #6d9ade;";
    if (id === "dashed-round") {
      front.style.cssText += "border:1.7px dashed #6696e2;";
      back.style.cssText += "box-shadow:0 10px 25px #214b8210;";
    }
    if (id === "double-line") {
      front.style.cssText += "border:1.7px solid #6d9ade;";
      front.innerHTML = `<div style="position:absolute;inset:7px;border:1px solid #a7d5c4;border-radius:${Math.max(2, radius - 5)}px"></div>`;
    }
    if (id === "software-window") {
      front.style.cssText += "border:1.7px solid #7295c3;";
      back.style.cssText += "box-shadow:0 var(--sap-shadow-step) 0 #dceafb;";
      front.innerHTML = '<div class="sap-window-bar"><i></i><i></i><i></i><span></span></div>';
    }
    if (id === "folded-paper") {
      const fold = Math.min(31, w * 0.055, h * 0.08);
      const step = Math.min(7, h * 0.012), outline = `M1 1H${w - fold}L${w - 1} ${fold}V${h - 1}H1Z`;
      back.style.cssText += "background:transparent;border-radius:2px;";
      back.innerHTML = svg2(`<path d="${outline}" fill="#d8e8f8" transform="translate(${step} ${step})"/><path d="${outline}" fill="#fff"/>`, w, h);
      front.innerHTML = svg2(`<path d="M1 1H${w - fold}L${w - 1} ${fold}V${h - 1}H1Z" fill="none" stroke="#7597c5" stroke-width="1.8"/><path d="M${w - fold} 1V${fold}H${w - 1}" fill="#e4efff" stroke="#7597c5" stroke-width="1.8" stroke-linejoin="round"/>`, w, h);
    }
    if (id === "animation-outline") {
      front.style.cssText += "border:3px solid #16376d;";
      back.style.cssText += "box-shadow:var(--sap-shadow-step) var(--sap-shadow-step) 0 #c8e2fc;";
      front.innerHTML = `<div style="position:absolute;inset:5px;border:1px solid #d0e5fb;border-radius:${Math.max(2, radius - 6)}px"></div>`;
    }
    if (id === "shadow-card") {
      front.style.cssText += "border:1px solid #e2ebf5;";
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
    const nodes = [...root.children].filter((node3) => node3.matches(".component-stage") || node3.matches(".fx-layer") && node3.dataset.effectSpace !== "canvas");
    if (!nodes.some((node3) => node3.matches(".component-stage"))) return appearance;
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
      const back = doc.createElement("div"), front = doc.createElement("div");
      back.className = "sap-frame-back";
      front.className = "sap-frame-front";
      for (const el of [back, front]) {
        el.dataset.appearanceFrameLayer = appearance.frame;
        el.style.cssText = `left:${edge}px;top:${edge}px;width:${w - edge * 2}px;height:${h - edge * 2}px;`;
        el.setAttribute("aria-hidden", "true");
      }
      decorateFrame(back, front, appearance.frame, w - edge * 2, h - edge * 2, Math.min(22, small * 0.03));
      stage.append(back, front);
    }
    const content2 = doc.createElement("div");
    content2.dataset.appearanceContent = "";
    content2.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:scale(${scale});`;
    stage.append(content2);
    const saved = nodes.map((node3) => {
      const anchor = doc.createComment("stage appearance slot");
      root.insertBefore(anchor, node3);
      content2.append(node3);
      return { node: node3, anchor };
    });
    root.append(stage);
    root.classList.add("sap-active");
    applied.set(root, { stage, nodes: saved });
    return appearance;
  }

  // component-renderers-entry.mjs
  var components24 = [...components, ...components2, ...components3, ...components4, ...components6, ...components5, ...components7, ...components8, ...components9, ...components10, ...components11, ...components12, ...components13, ...components14, ...components15, ...components16, ...components17, ...components18, ...components19, ...components20, ...components21, ...components22, ...components23];
  function mountNext(root, id, props, instance, effect, options = {}) {
    root.querySelector(".motion-next")?.remove();
    if (!effects.some((e) => e.id === effect && e.category === "\u8F6C\u573A")) return;
    const next = options.nextScene || props.transitionNext || (effect === "shared-slide" ? { component: "lecture-stage", props: { title: "\u628A\u601D\u8DEF\uFF0C\u53D8\u6210\u4E00\u6B21\u64CD\u4F5C", subtitle: "\u8BA9\u771F\u5B9E\u8FC7\u7A0B\u652F\u6491\u4F60\u7684\u8BB2\u89E3", chapter: "02 / \u5F00\u59CB\u5B9E\u8DF5", sections: [{ title: "\u6F14\u793A", detail: "\u5148\u5C55\u793A\u4E00\u6B21\u5B8C\u6574\u8FC7\u7A0B" }, { title: "\u89C2\u5BDF", detail: "\u805A\u7126\u64CD\u4F5C\u524D\u540E\u7684\u53D8\u5316" }, { title: "\u590D\u6838", detail: "\u56DE\u5230\u7ED3\u679C\u786E\u8BA4\u662F\u5426\u5B8C\u6210" }] } } : { component: "chapter-summary", props: { title: "\u4ECE\u7406\u89E3\u5230\u5B9E\u8DF5", subtitle: "\u628A\u521A\u624D\u7684\u601D\u8DEF\uFF0C\u53D8\u6210\u4E0B\u4E00\u6B65\u884C\u52A8\u3002" } });
    const target = components24.find((c) => c.id === next.component);
    if (!target) throw Error("\u4E0B\u4E00\u5E45\u753B\u9762\u7684\u7EC4\u4EF6\u4E0D\u5B58\u5728\uFF1A" + next.component);
    const node3 = document.createElement("div");
    node3.className = "motion-next";
    node3.dataset.scene = "B";
    node3.style.cssText = "position:absolute;inset:0;width:100%;height:100%;opacity:0";
    node3.innerHTML = rewriteRenderedMediaMarkup(target.render(normalizeMediaProps({ ...target.defaults, ...next.props }), helpers(instance + "-next")), assetBaseURL);
    root.querySelector(".component-stage").append(node3);
    root.querySelector(".motion-wrap").dataset.scene = "A";
    const at = Number(options.transitionAt ?? 2.1), duration = Number(options.transitionDuration ?? 0.66), covered = ["wipe-transition", "curve-ribbon", "diagonal-ribbon", "liquid-sweep"].includes(effect), nextStart = at + (covered ? duration * 0.5 : 0);
    node3.querySelectorAll("video,audio").forEach((media3, index) => {
      media3.id = instance + "-next-media-" + index;
      media3.classList.add("clip");
      media3.dataset.start = String(nextStart);
      media3.dataset.duration = String(Number(root.dataset.duration || 8) - nextStart);
      media3.dataset.trackIndex = "1";
    });
    root.querySelector(".motion-wrap").querySelectorAll("video,audio").forEach((media3) => media3.dataset.duration = String(at + duration));
  }
  var assetBaseURL = new URL("../", document.currentScript?.src || new URL("vendor/component-renderers.js", document.baseURI).href).href;
  function mount(root, id, props, instance) {
    const component2 = components24.find((c) => c.id === id);
    if (!component2) throw Error("Unknown component " + id);
    const html = component2.render(normalizeMediaProps({ ...component2.defaults, ...props }), helpers(instance));
    root.querySelector(".motion-wrap").innerHTML = rewriteRenderedMediaMarkup(html, assetBaseURL);
    root.querySelectorAll("video,audio:not([data-component-sfx])").forEach((media3, index) => {
      if (!media3.id) media3.id = instance + "-media-" + index;
      media3.classList.add("clip");
      media3.setAttribute("data-start", "0");
      media3.setAttribute("data-duration", root.getAttribute("data-duration") || "8");
      media3.setAttribute("data-track-index", "0");
    });
    return root;
  }
  return __toCommonJS(component_renderers_entry_exports);
})();
