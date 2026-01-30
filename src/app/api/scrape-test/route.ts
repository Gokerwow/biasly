/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/scrape-test/route.ts
import { NextResponse } from 'next/server';
import GroupScraping from '../../../../scripts/group/scrape'
import IdolScraping from '../../../../scripts/idol/scrape';

export async function GET(request: Request) {
    // Get the group name from the URL query (e.g., ?name=NewJeans)
    const { searchParams } = new URL(request.url);
    const groupName = searchParams.get('name') || 'Baekhyun'; // Default to NewJeans

    console.log(`🧪 Testing Scraping for: ${groupName}`);

    try {
        // Call your function
        const data = await IdolScraping(groupName);

        // Return the result as JSON so you can see it in the browser
        return NextResponse.json({
            success: true,
            data: data
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}