import { GroupsCategories, IndividualCategories } from "@/constants";
import { fetchList } from "../api";
import { delay } from "@/lib/delay";
import GroupScraping from "../scraping/groups/scrape";

export default async function MainGo() {
    console.log('executing the Main Function...')
    try {
        // const groupsCategoryNames = Object.values(GroupsCategories)
        // const idolsCategoryNames = Object.values(IndividualCategories)
        // const allData = []
        // for (let i = 0; i < groupsCategoryNames.length; i++) {
        //     const category = groupsCategoryNames[i]
        //     console.log(category)
        //     const fetchData = await fetchList(category)
        //     console.log(fetchData)
        //     allData.push(...fetchData)
        //     await delay(1300);
        // }
        // for (let i = 0; i < idolsCategoryNames.length; i++) {
        //     const category = idolsCategoryNames[i]
        //     console.log(category)
        //     const fetchData = await fetchList(category)
        //     console.log(fetchData)
        //     allData.push(...fetchData)
        //     await delay(1300);
        // }
        // console.log('SELESAI BROKK INI DATANYA', allData)
        GroupScraping(undefined, 'exo')
    } catch(error) {
        console.log(error)
    }
}

MainGo()

// SCENARIO
// group first -> looks for members(exist former, current, and inactive) -> associations contains (subunits) does not contains labels (sometimes) -> entries both to groups and idols and group_idols table

// idols first -> looks for groups (might have alot) inn association sometimes its mixed with the label or company -> 