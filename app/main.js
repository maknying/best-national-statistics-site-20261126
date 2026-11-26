/* Statistik Indonesia — router hash, kartu indikator, grafik SVG, dan tampilan.
   Semua angka berasal dari data.js (ID_STATS, sumber BPS). Tanpa dependensi. */
"use strict";

/* ---------- util ---------- */
const $app = document.getElementById("app");
const D = ID_STATS;

function fmt(n, digits) {
  return n.toLocaleString("id-ID", {
    minimumFractionDigits: digits === undefined ? 0 : digits,
    maximumFractionDigits: digits === undefined ? 0 : digits
  });
}
function fmtSigned(n, digits) {
  const s = n > 0 ? "+" : "";
  return s + fmt(n, digits);
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/* ---------- grafik SVG ---------- */
function svgOpen(w, h, label) {
  return '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label) + '">';
}

function lineChart(series, opts) {
  const o = Object.assign({ w: 760, h: 300, unit: "", color: "#c8102e", ymin: null, ymax: null }, opts || {});
  const padL = 52, padR = 16, padT = 18, padB = 34;
  const vals = series.values;
  let lo = o.ymin !== null ? o.ymin : Math.min.apply(null, vals);
  let hi = o.ymax !== null ? o.ymax : Math.max.apply(null, vals);
  if (lo === hi) { lo -= 1; hi += 1; }
  const span = hi - lo;
  lo -= span * 0.12; hi += span * 0.12;
  const iw = o.w - padL - padR, ih = o.h - padT - padB;
  const x = function (i) { return padL + (iw * i) / (vals.length - 1); };
  const y = function (v) { return padT + ih - ((v - lo) / (hi - lo)) * ih; };
  let s = svgOpen(o.w, o.h, series.label + " 2019–2024");
  // garis grid + label sumbu Y
  const ticks = 4;
  for (let t = 0; t <= ticks; t++) {
    const v = lo + ((hi - lo) * t) / ticks;
    const yy = y(v);
    s += '<line class="gridline" x1="' + padL + '" y1="' + yy.toFixed(1) + '" x2="' + (o.w - padR) + '" y2="' + yy.toFixed(1) + '"/>';
    s += '<text class="tick" x="' + (padL - 8) + '" y="' + (yy + 4).toFixed(1) + '" text-anchor="end">' + fmt(v, 1) + '</text>';
  }
  // area + garis
  let pts = vals.map(function (v, i) { return x(i).toFixed(1) + "," + y(v).toFixed(1); }).join(" ");
  s += '<polygon class="area" points="' + padL + ',' + y(lo).toFixed(1) + ' ' + pts + ' ' + (o.w - padR) + ',' + y(lo).toFixed(1) + '"/>';
  s += '<polyline class="line" points="' + pts + '"/>';
  vals.forEach(function (v, i) {
    s += '<circle class="dot" cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="4.5"/>';
    s += '<text class="valuelabel" x="' + x(i).toFixed(1) + '" y="' + (y(v) - 10).toFixed(1) + '" text-anchor="middle">' + fmt(v, 2) + '</text>';
    s += '<text class="tick" x="' + x(i).toFixed(1) + '" y="' + (o.h - 10) + '" text-anchor="middle">' + D.years[i] + '</text>';
  });
  s += '<line class="axis" x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + (o.h - padB) + '"/>';
  s += "</svg>";
  return s;
}

function barChart(items, opts) {
  const o = Object.assign({ w: 760, h: 300, unit: "", maxLabel: null }, opts || {});
  const padL = 52, padR = 70, padT = 14, padB = 34;
  const max = Math.max.apply(null, items.map(function (d) { return d.value; })) * 1.08;
  const iw = o.w - padL - padR, ih = o.h - padT - padB;
  const bw = Math.min(64, (iw / items.length) * 0.62);
  const gap = iw / items.length;
  let s = svgOpen(o.w, o.h, o.label || "Grafik batang");
  for (let t = 0; t <= 4; t++) {
    const v = (max * t) / 4;
    const yy = padT + ih - (ih * t) / 4;
    s += '<line class="gridline" x1="' + padL + '" y1="' + yy.toFixed(1) + '" x2="' + (o.w - padR) + '" y2="' + yy.toFixed(1) + '"/>';
    s += '<text class="tick" x="' + (padL - 8) + '" y="' + (yy + 4).toFixed(1) + '" text-anchor="end">' + fmt(v, 0) + '</text>';
  }
  items.forEach(function (d, i) {
    const h = (d.value / max) * ih;
    const xx = padL + gap * i + (gap - bw) / 2;
    const yy = padT + ih - h;
    s += '<rect class="bar' + (d.alt ? " alt" : "") + '" x="' + xx.toFixed(1) + '" y="' + yy.toFixed(1) +
      '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3"/>';
    s += '<text class="barlabel" x="' + (xx + bw / 2).toFixed(1) + '" y="' + (yy - 6).toFixed(1) + '" text-anchor="middle">' + fmt(d.value, d.digits === undefined ? 1 : d.digits) + '</text>';
    s += '<text class="tick" x="' + (xx + bw / 2).toFixed(1) + '" y="' + (o.h - 10) + '" text-anchor="middle">' + esc(d.label) + '</text>';
  });
  s += "</svg>";
  return s;
}

function hbarChart(items, opts) {
  const o = Object.assign({ w: 760, unit: "%" }, opts || {});
  const rowH = 34, padL = 210, padR = 64, padT = 8;
  const h = padT + items.length * rowH + 14;
  const max = Math.max.apply(null, items.map(function (d) { return d.value; })) * 1.05;
  const iw = o.w - padL - padR;
  let s = svgOpen(o.w, h, o.label || "Grafik batang horizontal");
  items.forEach(function (d, i) {
    const y = padT + i * rowH;
    const w = (d.value / max) * iw;
    s += '<text class="tick" x="' + (padL - 10) + '" y="' + (y + 16) + '" text-anchor="end" style="font-size:12.5px;fill:#1c2733">' + esc(d.label) + '</text>';
    s += '<rect class="bar' + (d.alt ? " alt" : "") + '" x="' + padL + '" y="' + (y + 4) + '" width="' + w.toFixed(1) + '" height="18" rx="4"/>';
    s += '<text class="barlabel" x="' + (padL + w + 8).toFixed(1) + '" y="' + (y + 18) + '">' + fmt(d.value, 2) + o.unit + '</text>';
  });
  s += "</svg>";
  return s;
}

/* ---------- komponen ---------- */
function kpiCard(label, value, unit, sub, tone) {
  return '<div class="kpi' + (tone === "accent" ? " accent" : "") + '">' +
    '<div class="kpi-label">' + label + '</div>' +
    '<div class="kpi-value">' + value + (unit ? ' <small>' + unit + '</small>' : "") + '</div>' +
    '<div class="kpi-sub">' + sub + '</div></div>';
}

function yearOptions(selected) {
  return D.years.map(function (y) {
    return '<option value="' + y + '"' + (y === selected ? " selected" : "") + '>' + y + '</option>';
  }).join("");
}

function navActive(route) {
  document.querySelectorAll(".mainnav a").forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("data-route") === route);
  });
}

/* ---------- tampilan ---------- */
function viewHome() {
  const s = D.snapshot2024;
  const i = D.years.indexOf(2024);
  const html =
    '<p class="eyebrow">Indonesia · 2019–2024</p>' +
    '<h1>Indonesia dalam angka</h1>' +
    '<p class="lede">Penduduk 281,6 juta jiwa, ekonomi terbesar di Asia Tenggara, dan ' +
    'pertumbuhan 5,03% pada 2024. Jelajahi indikator utama, deret waktu, dan ' +
    'perbandingan 38 provinsi — semua dari data resmi BPS.</p>' +

    '<div class="kpis">' +
    kpiCard("Penduduk 2024", fmt(s.population, 2), "juta jiwa", "Tumbuh " + fmt(s.populationGrowth, 2) + "% per tahun", "accent") +
    kpiCard("Pertumbuhan ekonomi", fmt(s.gdpGrowth, 2), "%", "PDB Rp" + fmt(s.gdpNominal, 0) + " triliun") +
    kpiCard("Inflasi (Des 2024)", fmt(s.inflation, 2), "% yoy", "Terendah sejak 2020") +
    kpiCard("Pengangguran", fmt(s.unemployment, 2), "%", "Agustus 2024 · TPT") +
    kpiCard("Kemiskinan", fmt(s.poverty, 2), "%", fmt(s.povertyPeople, 2) + " juta jiwa · Sep 2024") +
    kpiCard("PDB per kapita", "US$" + fmt(s.gdpPerCapitaUsd, 0), "", "Rp" + fmt(s.gdpPerCapitaRp, 2) + " juta") +
    kpiCard("Ekspor 2024", "US$" + fmt(s.exports, 2), "miliar", "Surplus US$" + fmt(s.surplus, 2) + " miliar") +
    kpiCard("IPM 2024", fmt(s.hdi, 2), "", "Harapan hidup " + fmt(s.lifeExpectancy, 2) + " tahun") +
    '</div>' +

    '<div class="grid two">' +
    '<section class="card"><h2>Pertumbuhan ekonomi</h2>' +
    '<p class="source">PDB harga konstan, % yoy · BPS</p>' +
    lineChart(D.gdpGrowth, { ymin: -3, ymax: 6 }) +
    '<p class="source">Kontraksi 2020 adalah dampak pandemi COVID-19; ekonomi pulih di atas 5% sejak 2022.</p></section>' +
    '<section class="card"><h2>Ekspor vs impor</h2>' +
    '<p class="source">Miliar US$ · BPS</p>' +
    barChart(D.years.map(function (y, k) { return { label: String(y), value: D.exports.values[k], alt: false }; }), { label: "Ekspor" }) +
    '<div class="legend"><span><i style="background:#13315c"></i>Ekspor</span>' +
    '<span>Impor 2024: US$' + fmt(D.imports.values[i], 2) + ' miliar</span></div></section>' +
    '</div>' +

    '<section class="card"><h2>Lihat tahun tertentu</h2>' +
    '<div class="controls"><label for="yearPick">Tahun</label>' +
    '<select id="yearPick">' + yearOptions(2024) + '</select>' +
    '<span id="yearSummary" class="pill">2024: penduduk 281,60 juta · PDB tumbuh 5,03% · inflasi 1,57%</span></div>' +
    '<p class="source">Pilih tahun untuk melihat ringkasan indikator tahun itu. Data lengkap tiap tahun ada di halaman Penduduk, Ekonomi, dan Harga &amp; Inflasi.</p></section>' +

    '<section class="card"><h2>Sekilas Indonesia</h2><ul class="facts">' +
    '<li><b>281,6 juta jiwa</b> tinggal di 38 provinsi dan lebih dari 17.000 pulau; 55% penduduk tinggal di Jawa.</li>' +
    '<li><b>68,6% penduduk</b> berusia produktif (15–64 tahun) — bonus demografi yang masih berjalan.</li>' +
    '<li><b>Rp22.139 triliun</b> PDB 2024, dengan industri pengolahan sebagai penyumbang terbesar (18,67%).</li>' +
    '<li><b>8,57% penduduk</b> hidup di bawah garis kemiskinan pada September 2024 — terendah dalam sejarah.</li>' +
    '</ul><p class="source">Sumber: Badan Pusat Statistik (BPS), 2024.</p></section>';

  $app.innerHTML = html;
  document.getElementById("yearPick").addEventListener("change", function (e) {
    const y = parseInt(e.target.value, 10);
    const k = D.years.indexOf(y);
    document.getElementById("yearSummary").textContent =
      y + ": penduduk " + fmt(D.population.values[k], 2) + " juta · PDB tumbuh " +
      fmtSigned(D.gdpGrowth.values[k], 2) + "% · inflasi " + fmt(D.inflation.values[k], 2) + "%";
  });
}

function viewPopulation() {
  const s = D.snapshot2024;
  const html =
    '<p class="eyebrow">Penduduk</p><h1>Penduduk Indonesia</h1>' +
    '<p class="lede">Jumlah penduduk terus bertambah sekitar 2–3 juta jiwa per tahun. ' +
    'Separuh lebih tinggal di Jawa, dan dua pertiga berada pada usia produktif.</p>' +
    '<div class="kpis">' +
    kpiCard("Penduduk 2024", fmt(s.population, 2), "juta jiwa", "Laju tumbuh " + fmt(s.populationGrowth, 2) + "%", "accent") +
    kpiCard("Laki-laki", fmt(D.gender.male, 2), "juta", "50,6% penduduk") +
    kpiCard("Perempuan", fmt(D.gender.female, 2), "juta", "49,4% penduduk") +
    kpiCard("Kepadatan", fmt(s.density, 0), "jiwa/km²", "Luas daratan ±1,9 juta km²") +
    '</div>' +
    '<div class="grid two">' +
    '<section class="card"><h2>Pertumbuhan penduduk</h2><p class="source">Juta jiwa, pertengahan tahun · BPS</p>' +
    lineChart(D.population, {}) +
    '<p class="source">Sensus Penduduk 2020 mencatat 270,20 juta jiwa; angka 2020 di atas adalah proyeksi pertengahan tahun.</p></section>' +
    '<section class="card"><h2>Struktur umur 2024</h2><p class="source">Persen penduduk · BPS</p>' +
    hbarChart(D.ageStructure.map(function (a) { return { label: a.group, value: a.share }; }), { label: "Struktur umur" }) +
    '<div class="legend"><span>Rasio ketergantungan: 45,8 per 100 penduduk usia kerja.</span></div></section>' +
    '</div>' +
    '<section class="card"><h2>Penduduk per pulau besar</h2><p class="source">Juta jiwa dan persen, 2024 · BPS</p>' +
    '<div class="tablewrap"><table class="data"><thead><tr><th>Pulau</th><th class="num">Penduduk (juta)</th><th class="num">Pangsa</th><th>Porsi</th></tr></thead><tbody>' +
    D.islands.map(function (p) {
      return '<tr><td>' + esc(p.name) + '</td><td class="num">' + fmt(p.population, 2) + '</td><td class="num">' +
        fmt(p.share, 2) + '%</td><td><div class="bar-cell"><div class="track"><div class="fill" style="width:' +
        p.share.toFixed(1) + '%"></div></div></div></td></tr>';
    }).join("") +
    '</tbody></table></div></section>' +
    '<p class="source">Sumber: Badan Pusat Statistik (BPS), proyeksi penduduk 2024.</p>';
  $app.innerHTML = html;
}

function viewEconomy() {
  const s = D.snapshot2024;
  const html =
    '<p class="eyebrow">Ekonomi</p><h1>Ekonomi Indonesia</h1>' +
    '<p class="lede">PDB 2024 mencapai Rp22.139 triliun dengan pertumbuhan 5,03%. ' +
    'Industri pengolahan, perdagangan, dan pertanian adalah tiga sektor terbesar.</p>' +
    '<div class="kpis">' +
    kpiCard("PDB 2024", "Rp" + fmt(s.gdpNominal, 0), "triliun", "Harga berlaku", "accent") +
    kpiCard("Pertumbuhan", fmt(s.gdpGrowth, 2), "% yoy", "Kuartal IV 2024: 5,02%") +
    kpiCard("PDB per kapita", "US$" + fmt(s.gdpPerCapitaUsd, 0), "", "Rp" + fmt(s.gdpPerCapitaRp, 2) + " juta") +
    kpiCard("Inflasi", fmt(s.inflation, 2), "% yoy", "Desember 2024") +
    '</div>' +
    '<div class="grid two">' +
    '<section class="card"><h2>PDB harga berlaku</h2><p class="source">Rp triliun · BPS</p>' +
    barChart(D.years.map(function (y, k) { return { label: String(y), value: D.gdpNominal.values[k], digits: 0 }; }), { label: "PDB" }) +
    '</section>' +
    '<section class="card"><h2>PDB per kapita</h2><p class="source">US$ · BPS</p>' +
    lineChart(D.gdpPerCapitaUsd, {}) +
    '<p class="source">PDB per kapita menembus US$4.900 pada 2023 dan naik ke US$4.960 pada 2024.</p></section>' +
    '</div>' +
    '<section class="card"><h2>Struktur PDB menurut lapangan usaha, 2024</h2><p class="source">Persen terhadap PDB · BPS</p>' +
    hbarChart(D.sectors.map(function (x) { return { label: x.name, value: x.share }; }), { label: "Sektor PDB" }) +
    '<p class="source">Industri pengolahan tetap menjadi tulang punggung, diikuti perdagangan dan pertanian.</p></section>' +
    '<section class="card"><h2>Pertumbuhan per tahun</h2><div class="tablewrap"><table class="data">' +
    '<thead><tr><th>Tahun</th><th class="num">Pertumbuhan (%)</th><th class="num">PDB (Rp triliun)</th><th class="num">PDB/kapita (US$)</th></tr></thead><tbody>' +
    D.years.map(function (y, k) {
      return '<tr' + (y === 2024 ? ' class="hl"' : "") + '><td>' + y + '</td><td class="num">' +
        fmtSigned(D.gdpGrowth.values[k], 2) + '</td><td class="num">' + fmt(D.gdpNominal.values[k], 2) +
        '</td><td class="num">' + fmt(D.gdpPerCapitaUsd.values[k], 0) + '</td></tr>';
    }).join("") + '</tbody></table></div></section>' +
    '<p class="source">Sumber: Badan Pusat Statistik (BPS), Berita Resmi Statistik.</p>';
  $app.innerHTML = html;
}

function viewLabor() {
  const s = D.snapshot2024;
  const html =
    '<p class="eyebrow">Ketenagakerjaan</p><h1>Ketenagakerjaan</h1>' +
    '<p class="lede">Angkatan kerja 152,11 juta jiwa pada Agustus 2024; 144,64 juta di antaranya bekerja. ' +
    'Pengangguran turun ke 4,91% — terendah sejak sebelum pandemi.</p>' +
    '<div class="kpis">' +
    kpiCard("Angkatan kerja", fmt(s.laborForce, 2), "juta jiwa", "Agustus 2024", "accent") +
    kpiCard("Bekerja", fmt(s.employed, 2), "juta jiwa", "TPAK 70,97%") +
    kpiCard("Pengangguran", fmt(s.unemployment, 2), "%", fmt(s.laborForce - s.employed, 2) + " juta jiwa menganggur") +
    kpiCard("Pekerja informal", fmt(s.informalShare, 2), "%", "Dari seluruh pekerja") +
    '</div>' +
    '<div class="grid two">' +
    '<section class="card"><h2>Tingkat pengangguran terbuka</h2><p class="source">Persen, Agustus · BPS</p>' +
    lineChart(D.unemployment, { ymin: 4, ymax: 8 }) +
    '<p class="source">Lonjakan 2020 adalah dampak pandemi; pemulihan berlanjut hingga 2024.</p></section>' +
    '<section class="card"><h2>Pekerja menurut lapangan usaha</h2><p class="source">Persen pekerja, Agustus 2024 · BPS</p>' +
    hbarChart(D.labor.sectors.map(function (x) { return { label: x.name, value: x.share }; }), { label: "Lapangan usaha" }) +
    '</section></div>' +
    '<div class="grid two">' +
    '<section class="card"><h2>Formal vs informal</h2><ul class="facts">' +
    '<li><b>' + fmt(D.labor.formal, 2) + ' juta</b> pekerja formal (berusaha dibantu buruh tetap, buruh/karyawan).</li>' +
    '<li><b>' + fmt(D.labor.informal, 2) + ' juta</b> pekerja informal — mayoritas berusaha sendiri dan pekerja keluarga.</li>' +
    '<li>Pekerja informal masih <b>' + fmt(s.informalShare, 2) + '%</b> dari total pekerja.</li>' +
    '<li>Kemiskinan September 2024: <b>' + fmt(s.povertyUrban, 2) + '% di kota</b> dan <b>' +
    fmt(s.povertyRural, 2) + '% di desa</b>.</li>' +
    '</ul></section>' +
    '<section class="card"><h2>Kemiskinan menurun</h2><p class="source">Persen penduduk miskin, September · BPS</p>' +
    lineChart(D.poverty, { ymin: 8, ymax: 11 }) +
    '<p class="source">Tingkat kemiskinan 8,57% pada September 2024 adalah yang terendah sepanjang sejarah pencatatan BPS.</p></section>' +
    '</div>' +
    '<p class="source">Sumber: Badan Pusat Statistik (BPS), Survei Angkatan Kerja Nasional (Sakernas) Agustus 2024.</p>';
  $app.innerHTML = html;
}

function viewPrices() {
  const html =
    '<p class="eyebrow">Harga &amp; Inflasi</p><h1>Harga &amp; Inflasi</h1>' +
    '<p class="lede">Inflasi Desember 2024 tercatat 1,57% (yoy) — terendah dalam enam tahun terakhir. ' +
    'Lonjakan 2022 dipicu kenaikan harga BBM bersubsidi dan pangan global.</p>' +
    '<div class="callout"><b>Inflasi 2024: 1,57%.</b> Berada dalam sasaran Bank Indonesia (2,5% ± 1%) ' +
    'dan jauh di bawah puncak 5,51% pada 2022.</div>' +
    '<div class="grid two">' +
    '<section class="card"><h2>Inflasi tahunan</h2><p class="source">Persen yoy, Desember · BPS</p>' +
    lineChart(D.inflation, { ymin: 0, ymax: 6 }) +
    '</section>' +
    '<section class="card"><h2>Inflasi per tahun</h2><div class="tablewrap"><table class="data">' +
    '<thead><tr><th>Tahun</th><th class="num">Inflasi (% yoy)</th><th>Catatan</th></tr></thead><tbody>' +
    D.years.map(function (y, k) {
      const note = { 2019: "Dalam sasaran", 2020: "Terendah era pandemi", 2021: "Masih rendah",
        2022: "Kenaikan BBM & pangan", 2023: "Kembali ke sasaran", 2024: "Terendah 6 tahun" }[y];
      return '<tr' + (y === 2024 ? ' class="hl"' : "") + '><td>' + y + '</td><td class="num">' +
        fmt(D.inflation.values[k], 2) + '</td><td>' + note + '</td></tr>';
    }).join("") + '</tbody></table></div></section>' +
    '</div>' +
    '<section class="card"><h2>Apa yang menggerakkan harga?</h2><ul class="facts">' +
    '<li><b>Kelompok makanan, minuman &amp; tembakau</b> memberi andil inflasi terbesar pada 2024, terutama beras dan cabai.</li>' +
    '<li><b>Inflasi inti</b> 2024 tercatat ' + fmt(D.inflation2024.core, 2) + '% (yoy), menunjukkan tekanan harga dari sisi permintaan tetap terjaga.</li>' +
    '<li><b>Harga diatur pemerintah</b> (administered prices) naik ' + fmt(D.inflation2024.administered, 2) + '% pada 2024, antara lain tarif angkutan dan cukai rokok.</li>' +
    '<li><b>Inflasi bergejolak</b> (volatile food) hanya ' + fmt(D.inflation2024.volatile, 2) + '% pada 2024 — pasokan pangan relatif stabil.</li>' +
    '</ul><p class="source">Sumber: Badan Pusat Statistik (BPS), Berita Resmi Statistik Desember 2024.</p></section>' +
    '<p class="source">Catatan: inflasi diukur dari Indeks Harga Konsumen (IHK) di 90 kota.</p>';
  $app.innerHTML = html;
}

function viewTrade() {
  const s = D.snapshot2024;
  const i = D.years.indexOf(2024);
  const html =
    '<p class="eyebrow">Perdagangan</p><h1>Perdagangan Luar Negeri</h1>' +
    '<p class="lede">Ekspor 2024 mencapai US$264,70 miliar dengan surplus US$31,04 miliar — ' +
    'surplus tahunan kelima berturut-turut. Tiongkok, AS, dan Jepang adalah pasar utama.</p>' +
    '<div class="kpis">' +
    kpiCard("Ekspor 2024", "US$" + fmt(s.exports, 2), "miliar", "Naik 2,29% dari 2023", "accent") +
    kpiCard("Impor 2024", "US$" + fmt(s.imports, 2), "miliar", "Naik 5,31% dari 2023") +
    kpiCard("Surplus", "US$" + fmt(s.surplus, 2), "miliar", "Neraca perdagangan 2024") +
    kpiCard("Ekspor nonmigas", "US$" + fmt(248.83, 2), "miliar", "94,0% dari total ekspor") +
    '</div>' +
    '<div class="grid two">' +
    '<section class="card"><h2>Ekspor dan impor</h2><p class="source">Miliar US$ · BPS</p>' +
    barChart(D.years.map(function (y, k) { return { label: String(y), value: D.exports.values[k], digits: 0 }; }), { label: "Ekspor" }) +
    '<div class="legend"><span><i style="background:#13315c"></i>Ekspor</span>' +
    '<span>Impor 2024: US$' + fmt(D.imports.values[i], 2) + ' miliar</span></div></section>' +
    '<section class="card"><h2>Negara tujuan ekspor utama, 2024</h2><p class="source">Miliar US$ · BPS</p>' +
    hbarChart(D.exportDestinations.map(function (x) { return { label: x.country, value: x.value }; }), { label: "Tujuan ekspor", unit: "" }) +
    '</section></div>' +
    '<section class="card"><h2>Komoditas ekspor utama, 2024</h2><p class="source">Miliar US$, dibulatkan · BPS</p>' +
    hbarChart(D.exportCommodities.map(function (x) { return { label: x.name, value: x.value }; }), { label: "Komoditas ekspor", unit: "" }) +
    '<p class="source">Batu bara, besi-baja, dan minyak sawit adalah tiga komoditas ekspor terbesar Indonesia.</p></section>' +
    '<p class="source">Sumber: Badan Pusat Statistik (BPS), statistik ekspor-impor 2024.</p>';
  $app.innerHTML = html;
}

function viewProvinces() {
  const total = D.provinces.reduce(function (a, p) { return a + p.pop; }, 0);
  const islands = ["Semua"].concat(D.islands.map(function (p) { return p.name; }));
  const html =
    '<p class="eyebrow">Provinsi</p><h1>38 Provinsi</h1>' +
    '<p class="lede">Jawa Barat adalah provinsi terpadat (49,94 juta jiwa), sedangkan Papua Selatan ' +
    'yang paling sedikit (0,55 juta). Cari provinsi, saring per pulau, atau urutkan tabelnya.</p>' +
    '<section class="card"><div class="controls">' +
    '<label for="provSearch">Cari</label>' +
    '<input type="search" id="provSearch" placeholder="Nama provinsi atau ibu kota…" size="28">' +
    '<label for="provIsland">Pulau</label>' +
    '<select id="provIsland">' + islands.map(function (x) { return '<option>' + esc(x) + '</option>'; }).join("") + '</select>' +
    '<label for="provSort">Urutkan</label>' +
    '<select id="provSort"><option value="pop-desc">Penduduk terbanyak</option>' +
    '<option value="pop-asc">Penduduk tersedikit</option>' +
    '<option value="name">Nama A–Z</option></select>' +
    '<span class="pill" id="provCount">' + D.provinces.length + ' provinsi</span>' +
    '</div>' +
    '<div class="tablewrap"><table class="data"><thead><tr><th>#</th><th>Provinsi</th><th>Ibu kota</th><th>Pulau</th>' +
    '<th class="num">Penduduk 2024 (juta)</th><th class="num">Pangsa</th><th>Porsi</th></tr></thead>' +
    '<tbody id="provBody"></tbody></table></div>' +
    '<p class="source">Penduduk 2024 adalah proyeksi BPS. Total 38 provinsi: ' + fmt(total, 2) + ' juta jiwa.</p></section>' +
    '<p class="source">Sumber: Badan Pusat Statistik (BPS), proyeksi penduduk 2024.</p>';
  $app.innerHTML = html;

  const body = document.getElementById("provBody");
  function render() {
    const q = document.getElementById("provSearch").value.trim().toLowerCase();
    const isl = document.getElementById("provIsland").value;
    const sort = document.getElementById("provSort").value;
    let list = D.provinces.filter(function (p) {
      const okQ = !q || p.name.toLowerCase().indexOf(q) !== -1 || p.capital.toLowerCase().indexOf(q) !== -1;
      const okI = isl === "Semua" || p.island === isl;
      return okQ && okI;
    });
    if (sort === "pop-desc") list.sort(function (a, b) { return b.pop - a.pop; });
    if (sort === "pop-asc") list.sort(function (a, b) { return a.pop - b.pop; });
    if (sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name, "id"); });
    document.getElementById("provCount").textContent = list.length + " provinsi";
    body.innerHTML = list.map(function (p, k) {
      const share = (p.pop / total) * 100;
      return '<tr><td>' + (k + 1) + '</td><td><b>' + esc(p.name) + '</b></td><td>' + esc(p.capital) +
        '</td><td>' + esc(p.island) + '</td><td class="num">' + fmt(p.pop, 2) + '</td><td class="num">' +
        fmt(share, 2) + '%</td><td><div class="bar-cell"><div class="track"><div class="fill' +
        (k === 0 ? " red" : "") + '" style="width:' + Math.max(share, 1.5).toFixed(1) + '%"></div></div></div></td></tr>';
    }).join("") || '<tr><td colspan="7">Tidak ada provinsi yang cocok. Coba kata kunci lain.</td></tr>';
  }
  ["provSearch", "provIsland", "provSort"].forEach(function (id) {
    document.getElementById(id).addEventListener(id === "provSearch" ? "input" : "change", render);
  });
  render();
}

/* ---------- router ---------- */
const ROUTES = {
  "/": viewHome,
  "/penduduk": viewPopulation,
  "/ekonomi": viewEconomy,
  "/kerja": viewLabor,
  "/harga": viewPrices,
  "/dagang": viewTrade,
  "/provinsi": viewProvinces
};

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const fn = ROUTES[hash] || ROUTES["/"];
  navActive(ROUTES[hash] ? hash : "/");
  fn();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
