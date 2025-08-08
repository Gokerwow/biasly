import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Ambil URL gambar asli dari query parameter
    const imageUrl = request.nextUrl.searchParams.get('url');

    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 });
    }

    // Lakukan fetch ke URL gambar asli
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: response.status });
    }

    // Ambil konten gambar sebagai blob (binary large object)
    const imageBlob = await response.blob();
    // Dapatkan tipe konten (misal: 'image/png')
    const contentType = response.headers.get('content-type');

    // Buat respons baru untuk dikirim ke frontend
    const headers = new Headers();
    if (contentType) {
      headers.set('Content-Type', contentType);
    }
    // Set cache control agar browser menyimpan gambarnya
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(imageBlob, { status: 200, headers });

  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}