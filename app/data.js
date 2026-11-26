/* Data statistik Indonesia — angka resmi Badan Pusat Statistik (BPS).
   Tahun acuan utama 2024; deret waktu 2019–2024. Nilai dibulatkan untuk
   tampilan; sumber dicantumkan di setiap bagian situs. */
"use strict";

const ID_STATS = {
  meta: {
    country: "Indonesia",
    source: "Badan Pusat Statistik (BPS)",
    updated: "November 2026",
    note: "Angka tahun 2024 adalah angka resmi BPS; deret 2019–2024."
  },

  /* Indikator utama, per tahun. Satuan dicantumkan di tiap kunci. */
  years: [2019, 2020, 2021, 2022, 2023, 2024],
  population: { // juta jiwa, pertengahan tahun
    label: "Penduduk", unit: "juta jiwa",
    values: [266.91, 271.35, 272.68, 275.77, 278.69, 281.60]
  },
  gdpGrowth: { // persen yoy, harga konstan
    label: "Pertumbuhan ekonomi", unit: "% yoy",
    values: [5.02, -2.07, 3.70, 5.31, 5.05, 5.03]
  },
  gdpNominal: { // Rp triliun, harga berlaku
    label: "PDB harga berlaku", unit: "Rp triliun",
    values: [15833.94, 15434.16, 16976.69, 19588.45, 20892.38, 22138.96]
  },
  gdpPerCapitaUsd: { // dolar AS
    label: "PDB per kapita", unit: "US$",
    values: [4196, 3870, 4349, 4784, 4919, 4960]
  },
  inflation: { // persen yoy, Desember
    label: "Inflasi", unit: "% yoy",
    values: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57]
  },
  unemployment: { // persen, Agustus (TPT)
    label: "Tingkat pengangguran terbuka", unit: "%",
    values: [5.28, 7.07, 6.49, 5.86, 5.32, 4.91]
  },
  poverty: { // persen, September
    label: "Tingkat kemiskinan", unit: "%",
    values: [9.22, 10.19, 9.71, 9.54, 9.36, 8.57]
  },
  exports: { // miliar US$
    label: "Ekspor", unit: "US$ miliar",
    values: [167.53, 163.19, 231.61, 291.90, 258.82, 264.70]
  },
  imports: { // miliar US$
    label: "Impor", unit: "US$ miliar",
    values: [170.72, 141.57, 196.20, 237.45, 221.89, 233.66]
  },

  /* Potret 2024. */
  snapshot2024: {
    population: 281.60,
    populationGrowth: 1.11,
    gdpNominal: 22138.96,
    gdpGrowth: 5.03,
    gdpPerCapitaRp: 78.62, // juta rupiah
    gdpPerCapitaUsd: 4960,
    inflation: 1.57,
    unemployment: 4.91,
    poverty: 8.57,
    povertyPeople: 24.06, // juta jiwa
    povertyUrban: 7.02, // persen, perkotaan Sep 2024
    povertyRural: 11.34, // persen, perdesaan Sep 2024
    gini: 0.381,
    hdi: 75.02,
    lifeExpectancy: 74.15,
    laborForce: 152.11, // juta jiwa, Agustus 2024
    employed: 144.64, // juta jiwa
    informalShare: 59.17, // persen pekerja informal
    exports: 264.70,
    imports: 233.66,
    surplus: 31.04,
    density: 148 // jiwa per km2
  },

  /* Komponen inflasi 2024 (persen yoy, Desember). */
  inflation2024: { core: 2.26, administered: 0.94, volatile: 0.12 },

  /* Struktur umur 2024 (persen, perkiraan BPS). */
  ageStructure: [
    { group: "0–14 tahun", share: 24.0 },
    { group: "15–64 tahun", share: 68.6 },
    { group: "65+ tahun", share: 7.4 }
  ],

  /* Jenis kelamin 2024 (juta jiwa). */
  gender: { male: 142.44, female: 139.16 },

  /* Lima pulau besar: penduduk 2024 (juta jiwa, proyeksi BPS). */
  islands: [
    { name: "Jawa", population: 155.33, share: 55.15 },
    { name: "Sumatera", population: 60.68, share: 21.55 },
    { name: "Sulawesi", population: 20.26, share: 7.19 },
    { name: "Kalimantan", population: 17.35, share: 6.16 },
    { name: "Bali & Nusa Tenggara", population: 15.85, share: 5.63 },
    { name: "Maluku & Papua", population: 12.13, share: 4.31 }
  ],

  /* Pangsa sektor terhadap PDB 2024 (persen, BPS). */
  sectors: [
    { name: "Industri pengolahan", share: 18.67 },
    { name: "Perdagangan", share: 12.84 },
    { name: "Pertanian, kehutanan & perikanan", share: 11.91 },
    { name: "Konstruksi", share: 10.05 },
    { name: "Pertambangan & penggalian", share: 8.46 },
    { name: "Transportasi & pergudangan", share: 5.88 },
    { name: "Informasi & komunikasi", share: 4.41 },
    { name: "Jasa keuangan & asuransi", share: 4.20 },
    { name: "Lainnya", share: 23.58 }
  ],

  /* Tujuan ekspor utama 2024 (miliar US$, dibulatkan, BPS). */
  exportDestinations: [
    { country: "Tiongkok", value: 62.4 },
    { country: "Amerika Serikat", value: 26.3 },
    { country: "Jepang", value: 18.1 },
    { country: "India", value: 15.4 },
    { country: "Malaysia", value: 10.1 },
    { country: "Singapura", value: 8.9 },
    { country: "Korea Selatan", value: 8.1 },
    { country: "Filipina", value: 7.6 }
  ],

  /* Komoditas ekspor utama 2024 (miliar US$, dibulatkan, BPS). */
  exportCommodities: [
    { name: "Batu bara", value: 30.0 },
    { name: "Besi dan baja", value: 27.7 },
    { name: "Minyak kelapa sawit", value: 23.5 },
    { name: "Nikel dan barang daripadanya", value: 10.8 },
    { name: "Kendaraan bermotor", value: 9.6 },
    { name: "Karet dan barang dari karet", value: 8.4 }
  ],

  /* Ketenagakerjaan Agustus 2024. */
  labor: {
    force: 152.11, employed: 144.64, unemployed: 7.47,
    formal: 59.12, informal: 85.52, // juta jiwa
    sectors: [
      { name: "Pertanian", share: 28.21 },
      { name: "Perdagangan", share: 18.83 },
      { name: "Industri pengolahan", share: 13.63 },
      { name: "Konstruksi", share: 7.45 },
      { name: "Jasa kemasyarakatan", share: 17.02 },
      { name: "Lainnya", share: 14.86 }
    ]
  },

  /* 38 provinsi: penduduk 2024 (juta jiwa, proyeksi BPS), ibu kota, pulau. */
  provinces: [
    { name: "Jawa Barat", capital: "Bandung", island: "Jawa", pop: 49.94 },
    { name: "Jawa Timur", capital: "Surabaya", island: "Jawa", pop: 41.81 },
    { name: "Jawa Tengah", capital: "Semarang", island: "Jawa", pop: 37.89 },
    { name: "Sumatera Utara", capital: "Medan", island: "Sumatera", pop: 15.59 },
    { name: "Banten", capital: "Serang", island: "Jawa", pop: 12.43 },
    { name: "DKI Jakarta", capital: "Jakarta", island: "Jawa", pop: 10.56 },
    { name: "Sulawesi Selatan", capital: "Makassar", island: "Sulawesi", pop: 9.46 },
    { name: "Lampung", capital: "Bandar Lampung", island: "Sumatera", pop: 9.28 },
    { name: "Sumatera Selatan", capital: "Palembang", island: "Sumatera", pop: 9.05 },
    { name: "Riau", capital: "Pekanbaru", island: "Sumatera", pop: 6.96 },
    { name: "Kalimantan Barat", capital: "Pontianak", island: "Kalimantan", pop: 5.91 },
    { name: "Sumatera Barat", capital: "Padang", island: "Sumatera", pop: 5.83 },
    { name: "Nusa Tenggara Timur", capital: "Kupang", island: "Bali & Nusa Tenggara", pop: 5.78 },
    { name: "Nusa Tenggara Barat", capital: "Mataram", island: "Bali & Nusa Tenggara", pop: 5.66 },
    { name: "Aceh", capital: "Banda Aceh", island: "Sumatera", pop: 5.55 },
    { name: "Bali", capital: "Denpasar", island: "Bali & Nusa Tenggara", pop: 4.41 },
    { name: "Kalimantan Selatan", capital: "Banjarmasin", island: "Kalimantan", pop: 4.31 },
    { name: "Kalimantan Timur", capital: "Samarinda", island: "Kalimantan", pop: 3.92 },
    { name: "DI Yogyakarta", capital: "Yogyakarta", island: "Jawa", pop: 3.76 },
    { name: "Jambi", capital: "Jambi", island: "Sumatera", pop: 3.68 },
    { name: "Sulawesi Tengah", capital: "Palu", island: "Sulawesi", pop: 3.17 },
    { name: "Sulawesi Tenggara", capital: "Kendari", island: "Sulawesi", pop: 2.82 },
    { name: "Kalimantan Tengah", capital: "Palangka Raya", island: "Kalimantan", pop: 2.81 },
    { name: "Sulawesi Utara", capital: "Manado", island: "Sulawesi", pop: 2.72 },
    { name: "Kepulauan Riau", capital: "Tanjung Pinang", island: "Sumatera", pop: 2.20 },
    { name: "Bengkulu", capital: "Bengkulu", island: "Sumatera", pop: 2.10 },
    { name: "Maluku", capital: "Ambon", island: "Maluku & Papua", pop: 2.04 },
    { name: "Sulawesi Barat", capital: "Mamuju", island: "Sulawesi", pop: 1.57 },
    { name: "Bangka Belitung", capital: "Pangkal Pinang", island: "Sumatera", pop: 1.52 },
    { name: "Papua Pegunungan", capital: "Wamena", island: "Maluku & Papua", pop: 1.47 },
    { name: "Maluku Utara", capital: "Sofifi", island: "Maluku & Papua", pop: 1.44 },
    { name: "Papua Tengah", capital: "Nabire", island: "Maluku & Papua", pop: 1.40 },
    { name: "Gorontalo", capital: "Gorontalo", island: "Sulawesi", pop: 1.27 },
    { name: "Papua", capital: "Jayapura", island: "Maluku & Papua", pop: 1.11 },
    { name: "Kalimantan Utara", capital: "Tanjung Selor", island: "Kalimantan", pop: 0.74 },
    { name: "Papua Barat Daya", capital: "Sorong", island: "Maluku & Papua", pop: 0.62 },
    { name: "Papua Barat", capital: "Manokwari", island: "Maluku & Papua", pop: 0.57 },
    { name: "Papua Selatan", capital: "Merauke", island: "Maluku & Papua", pop: 0.55 }
  ]
};
