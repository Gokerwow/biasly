export async function SeedGroups() {
    const MaleURL = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:male%20groups&cmlimit=500&format=json&origin=*`
    const GirlURL = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:female%20groups&cmlimit=500&format=json&origin=*`

    const arrayOfFetchPromises = [fetch(MaleURL), GirlURL]

    const responses = await Promise.all(arrayOfFetchPromises)

    responses.forEach(response => {
        if (!response.ok) {
            throw new Error(`Salah satu panggilan API gagal dengan status: ${response.status}`);
        }
    });
}