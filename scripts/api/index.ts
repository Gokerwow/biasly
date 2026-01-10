import { apiClient } from "@/utils/apiClient";
import { delay } from "@/lib/delay";

interface rawDataProps {
    pageid: number,
    title: string,
    last_updated: string
}

interface arrayDataProps {
    pageid: number,
    ns: number,
    title: string,
    revisions: [
        {
            timestamp: string
        }
    ]
}

interface paramsProps {
    action: string,
    generator: string,
    gcmtitle: string,
    gcmlimit: number,
    prop: string,
    rvprop: string,
    format: string,
    cmcontinue?: string,
    origin: string,
    cmprop: string
}

export async function fetchList(categoryName: string) {
    const params: paramsProps = {
        action: 'query',
        generator: 'categorymembers',
        gcmtitle: `Category:${categoryName}`,
        gcmlimit: 500,
        prop: 'revisions',
        rvprop: 'timestamp',
        format: 'json',
        origin: '*',
        cmprop: 'title|timestamp',
    };

    const allGroups: rawDataProps[] = []
    let continueToken = null

    do {
        if (continueToken) {
            params['cmcontinue'] = continueToken;
        }

        const { data: rawData } = await apiClient.get('', { params });

        const arrayData = Object.values(rawData.query.pages) as arrayDataProps[]

        if (rawData.continue) {
            continueToken = rawData.continue.gcmcontinue;
        } else {
            continueToken = null;
        }


        const cleanData = arrayData.map((item: arrayDataProps) => ({
            pageid: item.pageid,
            title: item.title,
            last_updated: item.revisions[0].timestamp
        }))

        allGroups.push(...cleanData);
        console.log(cleanData)

        console.log('SLESAI BUAT KATEGORI', categoryName)
        console.log('sabar nunggu dulu 2 detik')
        await delay(2000)

    } while (continueToken);

    return allGroups

    // console.log(allGroups)

}

// 1. fetch the groups by categories
// 2. loop it by categories in constants
// 3. check for continue token for conitnuing the fetch
// 3. push all the data into an array