import { parseTroopsFile } from 'warbandParser/troopParser'
import { parseItemsFile } from 'warbandParser/itemParser'
const { reactive } = Vue

export const rawData = reactive({
    troops: [],
    items: [],
})

export async function setTroops(troopsFile) {
    rawData.troops = await parseTroopsFile(troopsFile)
}

export async function setItems(itemsFile) {
    rawData.items = await parseItemsFile(itemsFile)
}
