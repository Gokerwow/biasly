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