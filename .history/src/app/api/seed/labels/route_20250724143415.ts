export async function GET() {
    const url = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:Record%20labels&cmlimit=500&format=json&origin=*`

    const response = await fetch(url)

    if(!response.ok) {

    }

    const result = response.json 
}