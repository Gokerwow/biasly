export async function GetIdols(gender: string, category: string) {
    try {
        const url = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(gender)}%${encodeURIComponent(category)}&cmlimit=500&format=json&origin=*`
        const response = 

    } catch(error) {

    }
}