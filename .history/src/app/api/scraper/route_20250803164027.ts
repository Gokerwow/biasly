// app/api/scraper/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface IdolData {
    name?: string;
    birth_name?: string;
    birth_date?: string;
    birth_place?: string;
    height?: number;
    weight?: number;
    blood_type?: string;
    occupation?: string[];
    agency?: string;
    image_url?: string;
    native_name?: string;
    korean_stage_name?: string;
    japanese_stage_name?: string;
    stage_name?: string;
}

interface GroupData {
    name: string;
    korean_name?: string;
    korean_debut_date?: string;
    japan_debut_date?: string;
    agency?: string;
    fandom_name?: string;
    fandom_color?: string;
    genres?: string[];
    years_active?: string;
    category?: string;
    status?: string;
    group_logo?: string;
    origin?: string;
    japan_name?: string;
    roman_name?: string;
    image_url?: string;
}

interface AgencyData {
    name: string;
    country?: string;
    founded_year?: string;
    ceo?: string;
    website?: string;
}

class KPopScraper {
    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async fetchWithRetry(url: string, retries = 3): Promise<string> {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Accept-Encoding': 'gzip, deflate',
                        'Connection': 'keep-alive',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return await response.text();
            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                if (i === retries - 1) throw error;
                await this.delay(2000 * (i + 1)); // Exponential backoff
            }
        }
        throw new Error('All retry attempts failed');
    }

    // Scrape from dbkpop.com
    async scrapeDbkpop(): Promise<{ groups: GroupData[], idols: IdolData[] }> {
        const groups: GroupData[] = [];
        const idols: IdolData[] = [];

        try {
            // Scrape groups list
            const groupsHtml = await this.fetchWithRetry('https://dbkpop.com/groups');
            const $groups = cheerio.load(groupsHtml);

            // Extract group links
            const groupLinks: string[] = [];
            $groups('a[href*="/group/"]').each((_, element) => {
                const href = $groups(element).attr('href');
                if (href && !groupLinks.includes(href)) {
                    groupLinks.push(href);
                }
            });

            // Scrape each group detail
            for (const link of groupLinks.slice(0, 10)) { // Limit to 10 for testing
                try {
                    await this.delay(1000); // Rate limiting
                    const groupHtml = await this.fetchWithRetry(`https://dbkpop.com${link}`);
                    const $group = cheerio.load(groupHtml);

                    const groupData: GroupData = {
                        name: $group('h1').first().text().trim(),
                        korean_name: $group('td:contains("Korean Name")').next().text().trim() || undefined,
                        korean_debut_date: this.parseDate($group('td:contains("Debut")').next().text().trim()),
                        agency: $group('td:contains("Agency")').next().text().trim() || undefined,
                        fandom_name: $group('td:contains("Fandom Name")').next().text().trim() || undefined,
                        origin: $group('td:contains("Origin")').next().text().trim() || undefined,
                        status: $group('td:contains("Status")').next().text().trim() || undefined,
                        image_url: $group('img').first().attr('src') || undefined,
                    };

                    if (groupData.name) {
                        groups.push(groupData);
                    }

                    // Extract members
                    $group('a[href*="/idol/"]').each((_, element) => {
                        const memberLink = $group(element).attr('href');
                        if (memberLink) {
                            // You would scrape individual idol pages here
                            // For now, we'll extract basic info from group page
                            const memberName = $group(element).text().trim();
                            if (memberName) {
                                idols.push({
                                    name: memberName,
                                    stage_name: memberName,
                                });
                            }
                        }
                    });

                } catch (error) {
                    console.error(`Error scraping group ${link}:`, error);
                }
            }

        } catch (error) {
            console.error('Error scraping dbkpop:', error);
        }

        return { groups, idols };
    }

    // Scrape from kpopping.com
    async scrapeKpopping(): Promise<{ groups: GroupData[], idols: IdolData[] }> {
        const groups: GroupData[] = [];
        const idols: IdolData[] = [];

        try {
            // Scrape popular groups
            const groupsHtml = await this.fetchWithRetry('https://kpopping.com/profiles/group');
            const $groups = cheerio.load(groupsHtml);

            $groups('.profile-card').each((_, element) => {
                const $card = $groups(element);
                const name = $card.find('.profile-name').text().trim();
                const agency = $card.find('.profile-agency').text().trim();
                const imageUrl = $card.find('img').attr('src');

                if (name) {
                    groups.push({
                        name,
                        agency: agency || undefined,
                        image_url: imageUrl ? `https://kpopping.com${imageUrl}` : undefined,
                    });
                }
            });

            // Scrape idols
            const idolsHtml = await this.fetchWithRetry('https://kpopping.com/profiles/idol');
            const $idols = cheerio.load(idolsHtml);

            $idols('.profile-card').each((_, element) => {
                const $card = $idols(element);
                const name = $card.find('.profile-name').text().trim();
                const birthDate = $card.find('.profile-birth').text().trim();
                const agency = $card.find('.profile-agency').text().trim();
                const imageUrl = $card.find('img').attr('src');

                if (name) {
                    idols.push({
                        name,
                        stage_name: name,
                        birth_date: this.parseDate(birthDate),
                        agency: agency || undefined,
                        image_url: imageUrl ? `https://kpopping.com${imageUrl}` : undefined,
                    });
                }
            });

        } catch (error) {
            console.error('Error scraping kpopping:', error);
        }

        return { groups, idols };
    }

    private parseDate(dateStr: string): string | undefined {
        if (!dateStr) return undefined;

        try {
            // Handle various date formats
            const patterns = [
                /(\d{4})-(\d{2})-(\d{2})/,
                /(\d{2})\/(\d{2})\/(\d{4})/,
                /(\d{4})\.(\d{2})\.(\d{2})/,
            ];

            for (const pattern of patterns) {
                const match = dateStr.match(pattern);
                if (match) {
                    return new Date(dateStr).toISOString().split('T')[0];
                }
            }

            return undefined;
        } catch {
            return undefined;
        }
    }
}

// Database operations
class DatabaseSeeder {
    async seedAgencies(agencies: AgencyData[]) {
        for (const agency of agencies) {
            try {
                const { error } = await supabase
                    .from('agencies')
                    .upsert(agency, { onConflict: 'name' });

                if (error) {
                    console.error('Error inserting agency:', error);
                }
            } catch (error) {
                console.error('Error seeding agency:', error);
            }
        }
    }

    async seedGroups(groups: GroupData[]) {
        const results = [];

        for (const group of groups) {
            try {
                const { data, error } = await supabase
                    .from('groups')
                    .upsert({
                        ...group,
                        details_fetched_at: new Date().toISOString(),
                    }, { onConflict: 'name' })
                    .select();

                if (error) {
                    console.error('Error inserting group:', error);
                } else {
                    results.push(data?.[0]);
                }
            } catch (error) {
                console.error('Error seeding group:', error);
            }
        }

        return results.filter(Boolean);
    }

    async seedIdols(idols: IdolData[]) {
        const results = [];

        for (const idol of idols) {
            try {
                const { data, error } = await supabase
                    .from('idols')
                    .upsert(idol, { onConflict: 'name' })
                    .select();

                if (error) {
                    console.error('Error inserting idol:', error);
                } else {
                    results.push(data?.[0]);
                }
            } catch (error) {
                console.error('Error seeding idol:', error);
            }
        }

        return results.filter(Boolean);
    }

    async createGroupIdolRelations(groups: any[], idols: any[]) {
        // This is a simplified relation creation
        // In practice, you'd need more sophisticated logic to match idols to groups

        for (const group of groups) {
            // Find idols with same agency (simplified matching)
            const relatedIdols = idols.filter(idol =>
                idol.agency === group.agency && idol.agency
            );

            for (const idol of relatedIdols) {
                try {
                    const { error } = await supabase
                        .from('idols_groups')
                        .upsert({
                            idol_id: idol.id,
                            group_id: group.id,
                        }, { onConflict: 'idol_id,group_id' });

                    if (error) {
                        console.error('Error creating idol-group relation:', error);
                    }
                } catch (error) {
                    console.error('Error in relation creation:', error);
                }
            }
        }
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'all';

    try {
        const scraper = new KPopScraper();
        const seeder = new DatabaseSeeder();

        let allGroups: GroupData[] = [];
        let allIdols: IdolData[] = [];

        if (source === 'all' || source === 'dbkpop') {
            console.log('Scraping dbkpop...');
            const dbkpopData = await scraper.scrapeDbkpop();
            allGroups.push(...dbkpopData.groups);
            allIdols.push(...dbkpopData.idols);
        }

        if (source === 'all' || source === 'kpopping') {
            console.log('Scraping kpopping...');
            const kpoppingData = await scraper.scrapeKpopping();
            allGroups.push(...kpoppingData.groups);
            allIdols.push(...kpoppingData.idols);
        }

        // Remove duplicates
        const uniqueGroups = allGroups.filter((group, index, self) =>
            index === self.findIndex(g => g.name === group.name)
        );

        const uniqueIdols = allIdols.filter((idol, index, self) =>
            index === self.findIndex(i => i.name === idol.name)
        );

        console.log('Seeding database...');

        // Seed groups first
        const seededGroups = await seeder.seedGroups(uniqueGroups);

        // Seed idols
        const seededIdols = await seeder.seedIdols(uniqueIdols);

        // Create relations
        await seeder.createGroupIdolRelations(seededGroups, seededIdols);

        return NextResponse.json({
            success: true,
            message: 'Scraping and seeding completed',
            stats: {
                groups: seededGroups.length,
                idols: seededIdols.length,
                source: source,
            }
        });

    } catch (error) {
        console.error('Scraping error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Scraping failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, data } = body;

        const seeder = new DatabaseSeeder();

        switch (action) {
            case 'seed_groups':
                const seededGroups = await seeder.seedGroups(data);
                return NextResponse.json({ success: true, count: seededGroups.length });

            case 'seed_idols':
                const seededIdols = await seeder.seedIdols(data);
                return NextResponse.json({ success: true, count: seededIdols.length });

            default:
                return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        }

    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json(
            { success: false, error: 'Operation failed' },
            { status: 500 }
        );
    }
}