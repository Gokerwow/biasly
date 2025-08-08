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