export async function GetIdols(gender: string, category: string) {
    try {
        const categoryName = `${gender} ${category}`;
        const url = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(categoryName)}&cmlimit=500&format=json&origin=*`
        const response = await fetch(url)
        
        if(!response.ok) {
            throw new Error(`HTTP Error ${response.status}`)
        }

        const result = await response.json()
        return

    } catch(error) {

    }
}