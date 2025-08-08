interface CategoryMember {
    pageid: number;
    ns: number;
    title: string;
}

export async function GetIdols(gender: string, category: string) {
    try {
        const categoryName = `${gender} ${category}`;
        const url = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(categoryName)}&cmlimit=500&format=json&origin=*`
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`)
        }

        const result = await response.json()

        if (result.error) {
            throw new Error(`API Error: ${result.error.info}`);
        }

        const IdolName = result.query.categorymembers.map((name: CategoryMember) => name.title)

        return IdolName

    } catch (error) {
        console.error("Gagal mengambil data idol:", error);
        return []
    }
}