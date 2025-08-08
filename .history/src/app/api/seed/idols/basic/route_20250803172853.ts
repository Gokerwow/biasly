export async function GetIdols(gender: string, category: string) {
    try {
        let hasMore = true
        let continueToken;
        const categoryName = `${gender} ${category}`;
        const IdolArray = []

        while (hasMore) {
            const url: string = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(categoryName)}&cmlimit=500&format=json&origin=*&cmcontinue=${encodeURIComponent(continueToken ?? '')}`
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`)
            }

            const result = await response.json()

            if (result.error) {
                throw new Error(`API Error: ${result.error.info}`);
            }

            if (!result.continue) {
                hasMore = false
            } else {
                continueToken = result.continue.cmcontinue
            }
            const IdolName = result.query.categorymembers.map((name: CategoryMember) => name.title)
            IdolArray.push(...IdolName)
        }

        return IdolArray

    } catch (error) {
        console.error("Gagal mengambil data nama idol:", error);
        return []
    }
}