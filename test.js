// test-google.js

// --- PUT YOUR KEYS HERE ---
const API_KEY = 'AIzaSyCwO5QOSxsucJ_4eyco7uSKa7RhltzAdCw'; 
const CX = '8341c87ae520e479f'; 

async function searchGoogleImage(query) {
    if (API_KEY === 'YOUR_GOOGLE_API_KEY') {
        console.error("❌ ERROR: You must replace 'YOUR_GOOGLE_API_KEY' with a real key.");
        return;
    }

    console.log(`🔍 Googling: "${query}"...`);

    // We search for "Group Name + logo + transparent" specifically
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${CX}&key=${API_KEY}&searchType=image&fileType=png&num=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("⚠️ Google API Error:", data.error.message);
            return;
        }

        if (!data.items || data.items.length === 0) {
            console.log("❌ No images found.");
            return;
        }

        const firstResult = data.items[0];
        console.log(`✅ Found: ${firstResult.link}`);
        return firstResult.link;

    } catch (error) {
        console.error("Network error:", error);
    }
}

// --- TEST ---
(async () => {
    // We append "logo transparent" to get the logo, not the group photo
    await searchGoogleImage("BTS kpop logo transparent");
    await searchGoogleImage("EXO logo transparent");
})();