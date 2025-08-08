// utils/scraperClient.ts
export class ScraperClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async scrapeAll() {
    const response = await fetch(`${this.baseUrl}/api/scraper?source=all`);
    return await response.json();
  }

  async scrapeSource(source: 'dbkpop' | 'kpopping') {
    const response = await fetch(`${this.baseUrl}/api/scraper?source=${source}`);
    return await response.json();
  }

  async manualSeedGroups(groups: any[]) {
    const response = await fetch(`${this.baseUrl}/api/scraper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'seed_groups',
        data: groups,
      }),
    });
    return await response.json();
  }

  async manualSeedIdols(idols: any[]) {
    const response = await fetch(`${this.baseUrl}/api/scraper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'seed_idols',
        data: idols,
      }),
    });
    return await response.json();
  }
}

// app/admin/scraper/page.tsx - Admin interface untuk testing
'use client';

import { useState } from 'react';
import { ScraperClient } from '../../../utils/scraperClient';

export default function ScraperAdmin() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const scraper = new ScraperClient();

  const handleScrape = async (source: string) => {
    setLoading(true);
    try {
      let response;
      if (source === 'all') {
        response = await scraper.scrapeAll();
      } else {
        response = await scraper.scrapeSource(source as 'dbkpop' | 'kpopping');
      }
      setResult(response);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">K-Pop Scraper Admin</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={() => handleScrape('all')}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Scraping...' : 'Scrape All Sources'}
        </button>
        
        <button
          onClick={() => handleScrape('dbkpop')}
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded disabled:opacity-50 ml-4"
        >
          Scrape DBKPop Only
        </button>
        
        <button
          onClick={() => handleScrape('kpopping')}
          disabled={loading}
          className="bg-purple-500 text-white px-6 py-2 rounded disabled:opacity-50 ml-4"
        >
          Scrape KPopping Only
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Result:</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// lib/scraperScheduler.ts - Untuk scheduling otomatis
import cron from 'node-cron';

export class ScraperScheduler {
  private isRunning = false;

  startScheduledScraping() {
    // Run every day at 3 AM
    cron.schedule('0 3 * * *', async () => {
      if (this.isRunning) {
        console.log('Scraper already running, skipping...');
        return;
      }

      this.isRunning = true;
      console.log('Starting scheduled scraping...');

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/scraper?source=all`);
        const result = await response.json();
        console.log('Scheduled scraping completed:', result);
      } catch (error) {
        console.error('Scheduled scraping failed:', error);
      } finally {
        this.isRunning = false;
      }
    }, {
      timezone: "Asia/Jakarta"
    });

    console.log('Scraper scheduler started');
  }

  stopScheduledScraping() {
    cron.destroy();
    console.log('Scraper scheduler stopped');
  }
}

// middleware.ts - Rate limiting untuk scraper endpoint
import { NextRequest, NextResponse } from 'next/server';

const rateLimit = new Map();

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/scraper')) {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 5; // 5 requests per minute

    if (!rateLimit.has(ip)) {
      rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
      return NextResponse.next();
    }

    const rateLimitInfo = rateLimit.get(ip);

    if (now > rateLimitInfo.resetTime) {
      rateLimitInfo.count = 1;
      rateLimitInfo.resetTime = now + windowMs;
      return NextResponse.next();
    }

    if (rateLimitInfo.count >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    rateLimitInfo.count++;
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/scraper/:path*'
};

// Contoh penggunaan dalam komponen React
export const ScraperExample = () => {
  const [data, setData] = useState(null);
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/scraper?source=kpopping');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Start Scraping</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};