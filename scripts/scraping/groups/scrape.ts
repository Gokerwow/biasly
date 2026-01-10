import { apiClient } from "@/utils/apiClient"
import * as cheerio from "cheerio";


export default async function GroupScraping(pageId?: number, groupName?: string) {
    console.log('ngambil detail buat grup', groupName)
    const params = {
        action: 'parse',
        page: pageId || groupName?.toUpperCase(),
        format: 'json',
        origin: '*',
        prop: 'text|categories'
    };


    try {
        const fetchDetail = await apiClient('', { params })


        const html = fetchDetail.data.parse.text['*']

        const $ = cheerio.load(html)

        const DataSourceAvailable = $('.portable-infobox [data-source]').map((i, el) => $(el).attr('data-source')).get()
        const dataSourceObjects: Record<string, any> = {
        }


        DataSourceAvailable.forEach((item, index) => {
            console.log(item)
            const dataSourceInfobox = $(`.portable-infobox [data-source="${item}"]`)

            let valueCells = dataSourceInfobox.find('.pi-data-value')
            let valueText;

            if (valueCells.length === 0) {
                valueCells = dataSourceInfobox
                valueText = dataSourceInfobox.text().trim()
            } else {
                valueText = valueCells.text().trim()
            }

            if (valueCells.find('li').length > 0) {
                console.log('ADA LIST NYA UY DI LOOP AJA', valueText)
                if (!dataSourceObjects.members) {
                    dataSourceObjects.members = {};
                }
                const htmlString = valueCells.html()?.replace(/<\/*ul>/g, '').split(/<\/*li>/g).filter(item => item !== '')
                const cleanText = htmlString?.map((item) => {
                    const clean = item.replace(/^<.*?>([^<]+)<\/.*?>/, '$1')
                    return clean
                })
                console.log(cleanText)
                dataSourceObjects.members[item] = cleanText
            }

            if (valueCells.find('a').length > 0 && !(valueCells.find('li').length > 0)) {
                console.log('ADA LINKNYA BROK', valueText)
                if (item === 'label') {
                    const labels = valueCells.html()?.split('<br>').map((item) => {
                        const text = item.replace(/<sup.+sup>/, '')
                        return text
                    })
                    const cleanLabes = labels?.map((item) => {
                        const text = item.replace(/<[^<]+>/g, '').replace(')', '').split('(').map(item => item.trim())
                        const labelArr = text.map((item) => {
                            const regex = /\d+/
                            if (item.includes(';') && regex.test(item)) {
                                const splitText = item.trim().split(';').map(item => item.trim())
                                const dateText = splitText.map((item) => {
                                    if (item.includes('–')) {
                                        const splitDate = item.split('–').map(item => item.trim())
                                        return splitDate
                                    }
                                    return item
                                })
                                return dateText
                            }
                            return item
                        })
                        return labelArr.flat(Infinity)
                    })
                    const formattedData = cleanLabes?.map((item) => {

                        return {
                            label: item[0] ?? 'Unknown Label',
                            region: (typeof item[1] === 'string' && !item[1].match(/\d+/)) ? item[1] : 'Unknown Region',
                            active: {
                                start: item.find(str => typeof str === 'string' && str.match(/\d{4}/)) ?? "Date not provided",
                                end: item.includes('present') ? 'present' : (item.filter(str => str.match(/\d{4}/))[1] ?? "Date not provided")
                            }
                        };
                    });
                    console.log(formattedData)
                    dataSourceObjects[item] = formattedData
                } else if (item === 'associated') {
                    if (valueCells.find('br').length > 0) {
                        const valueHtml = valueCells.html()?.split('<br>')
                        const cleanText = valueHtml?.map((item) => {
                            const clean = item.replace(/^<.*?>([^<]+)<\/.*?>/, '$1')
                            return clean
                        })
                        console.log(cleanText)
                        dataSourceObjects[item] = cleanText
                    }
                } else if (item === 'website') {
                    const webRegion = valueCells.find('b, a').map((_, el) => {
                        if ($(el).is('a')) {
                            return $(el).attr('href')
                        } else {
                            return $(el).text().trim()
                        }
                    }).get();
                    const chunkSize = 2
                    const chunks = []
                    for (let i = 0; i < webRegion.length; i += chunkSize) {
                        chunks.push(webRegion.slice(i, i + chunkSize));
                    }
                    const webObj = chunks.map((item) => {
                        const isLink = /\//
                        return {
                            region: isLink.test(item[0]) ? 'Unknown Region' : item[0],
                            link: item[1] ?? item[0]
                        }
                    })
                    console.log(webObj)
                    dataSourceObjects[item] = webObj
                } else if (item === 'sns') {
                    const snsBreak = valueCells.html()?.split('<br>')
                    const snsExtract = snsBreak?.map((item => {
                        const $item = $(`<div>${item}</div>`)
                        const data = $item.find('b, a').map((_, el) => {
                            if ($(el).is('a')) {
                                return $(el).attr('href')
                            } else {
                                return $(el).text().trim()
                            }
                        }).get()
                        return data
                    }))
                    const snsObj = snsExtract?.map((item) => {
                        const isLink = /\//
                        const newItem = item.filter(item => isLink.test(item))
                        return {
                            region: isLink.test(item[0]) ? 'Unknown Region' : item[0],
                            links: newItem
                        }
                    })
                    console.log(snsObj)
                    dataSourceObjects[item] = snsObj
                }
            }

            if (!(valueCells.find('li').length > 0) && !(valueCells.find('a').length > 0)) {
                console.log('AMAN HARUSNYA', valueText)
                const hasSeparator = /[,–(]/;

                if (valueCells.find('br').length > 0) {
                    if (valueCells.contents().first().is('span')) {
                        const valueHtml = valueCells.html()?.split('<br>')
                        const cleanData = valueHtml?.map((item) => {
                            const text = item.replace(/<[^<]+[^>]+>/g, '').trim()
                            return text
                        })
                        console.log(cleanData)
                        dataSourceObjects[item] = cleanData
                    } else {
                        const valueHtml = valueCells.html()?.split('<br>')
                        const cleanData = valueHtml?.map((item) => {
                            const text = item.replace(/<[^>]+>/g, '').trim().match(/^([^\(]+)\s+\(([^)]+)\)/)
                            const date = text?.[1].match(/(?<month>\w+)\s+(?<day>\d+),\s+(?<year>\d+)/)
                            return {
                                day: date?.groups?.day,
                                month: date?.groups?.month,
                                year: date?.groups?.year,
                                location: text?.[2]
                            }

                        })
                        console.log(cleanData)
                        dataSourceObjects[item] = cleanData
                    }
                } else {
                    if (hasSeparator.test(valueText) || item === 'genres') {
                        const trimText = valueText.trim()
                        const textArr = hasSeparator.test(trimText) ? trimText.split(hasSeparator) : [trimText];
                        if (item !== 'genres') {
                            if (item === 'years') {
                                const yearsObject = {
                                    start: textArr[0],
                                    end: textArr[1]
                                }
                                console.log(yearsObject)
                                dataSourceObjects[item] = yearsObject
                            } else if (item === 'origin') {
                                const orginObj = {
                                    city: textArr[0],
                                    country: textArr[1]
                                }
                                console.log(orginObj)
                                dataSourceObjects[item] = orginObj
                            } else {
                                const fandomObj = {
                                    name: textArr[0],
                                    hangul: textArr[1]
                                }
                                console.log(fandomObj)
                                dataSourceObjects[item] = fandomObj
                            }
                        } else {
                            console.log(textArr)
                            dataSourceObjects[item] = textArr
                        }
                    } else {
                        dataSourceObjects[item] = valueText
                    }
                }
            }
        })

        console.log(dataSourceObjects)

    } catch (error) {
        console.error(error)
    }
}

// WHAT I NEED
// GROUPS ID, PAGEID, INFO (JSONB), CATEGORIES, 