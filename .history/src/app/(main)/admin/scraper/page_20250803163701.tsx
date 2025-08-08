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