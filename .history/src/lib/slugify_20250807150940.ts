function createSlug(name) {
  return name
    .toLowerCase() // ubah ke huruf kecil
    .replace(/\s+/g, '-') // ganti spasi dengan -
    .replace(/[^\w\-]+/g, ''); // hapus semua karakter non-kata kecuali -
}

// Contoh penggunaan:
// createSlug("LE SSERAFIM") akan menghasilkan "le-sserafim"
// createSlug("Billlie") akan menghasilkan "billlie"