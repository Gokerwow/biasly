import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Read the search query from the incoming request's URL
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  // 2. Prepare the request to the external RapidAPI
  const url = `https://k-pop.p.rapidapi.com/idols?q=${query}&by=Stage%20Name`;
  const options = {
    method: 'GET',
    headers: {
      // 3. Securely add the API key from environment variables
      'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
      'x-rapidapi-host': 'k-pop.p.rapidapi.com',
    },
  };

  try {
    // 4. Make the call to the external API
    const response = await fetch(url, options);
    const result = await response.json(); // Use .json() if the API returns JSON

    if (!response.ok) {
      // Forward the error from the external API
      return NextResponse.json({ error: 'Failed to fetch data from K-Pop API' }, { status: response.status });
    }

    // 5. Send the successful result back to your frontend
    return NextResponse.json(result);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}