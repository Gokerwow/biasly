import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { SearchParams } = new URL(request.url)
    const query = 
}