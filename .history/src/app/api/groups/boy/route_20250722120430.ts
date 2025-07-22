import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url)

    try {
        const response = fetch()
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Terjadi kesalahan internal' }, { status: 500 });
    }
}