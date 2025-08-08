// utils/image.ts
export function cleanFandomImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // Temukan ekstensi file (.png, .jpg, .jpeg, .gif)
  const match = url.match(/\.(png|jpg|jpeg|gif)/i);

  if (match) {
    // Ambil URL hanya sampai ekstensi filenya
    const extensionIndex = match.index! + match[0].length;
    return url.substring(0, extensionIndex);
  }

  // Jika tidak ada ekstensi yang cocok, kembalikan URL aslinya
  return url;
}