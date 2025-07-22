import { METHODS } from "http";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
        return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const url = "https://k-pop.p.rapidapi.com/boy-groups?q=BTS&by=Group%20Name"
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
            'x-rapidapi-host': 'k-pop.p.rapidapi.com',
        }
    }

    
}