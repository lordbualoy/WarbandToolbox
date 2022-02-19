import { setTroops, setItems } from './warbandRawData.js'

export function setupNewWarbandData({ troopsFile, itemsFile }) {
    return Promise.all([
        persistFiles(...[
            {fileName: 'troops.txt', data: troopsFile},
            {fileName: 'item_kinds1.txt', data: itemsFile},
        ]),
        setTroops(troopsFile),
        setItems(itemsFile),
    ])
}

export async function restoreWarbandData() {
    const [ troopsFile, itemsFile ] = await restoreFiles('troops.txt', 'item_kinds1.txt')
    return await Promise.all([
        setTroops(troopsFile),
        setItems(itemsFile),
    ])
}

async function persistFiles(...files) {
    await Promise.all(files.map(async ({fileName, data}) => localStorage.setItem(fileName, await readAsText(data))))
}

async function restoreFiles(...files) {
    const restoredFiles = []
    for (const fileName of files) {
        let text = localStorage.getItem(fileName)
        if (text === null)
            text = await fetch(`default/${fileName}`).then(x => x.text())
        restoredFiles.push(convertToFile(text, fileName))
    }
    return restoredFiles
}

function readAsText(file) {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.addEventListener("load", () => resolve(reader.result))
        reader.readAsText(file)
    })
}

function convertToFile(text, fileName) {
    return new File([...text], fileName)
}
