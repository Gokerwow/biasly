export async function GetIdols(gender: string, category: string) {
    try {
        const url = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(gender)}%${encodeURIComponent(category)}&cmlimit=500&format=json&origin=*`
        const response = await fetch(url)
        
        if(!response.ok) {
            throw new Error(`HTTP Error ${response.status}`)
        }

        const result = await response.json()

    } catch(error) {

    }
}