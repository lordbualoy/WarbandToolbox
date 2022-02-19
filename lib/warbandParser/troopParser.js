import { TxtReader } from 'txt-reader'
import converter from 'hex2dec'

export async function parseTroopsFile(file) {
    var reader = new TxtReader()
    await reader.loadFile(file)
    const { result } = await reader.getLines()
    return parseTroops([...result, ''])
}

export function parseTroops(lines) {
    const iterator = lines[Symbol.iterator]()
    const magic = readLine()
    if (magic !== 'troopsfile version 2')
        throw 'invalid file'
    const count = +readLine().trim()
    const troops = []
    for (let i = 0; i < count; i++) {
        troops.push(readTroop())
    }

    return troops

    function readTroop() {
        const firstLine = readLine().trim().split(' ')
        const id = firstLine[0]
        const name = firstLine[1]
        const pluralizedName = firstLine[2]
        const troopImage = firstLine[3]
        const flags = +firstLine[4]
        const no_scene = +firstLine[5]
        const reserved = +firstLine[6]
        const factionID = +firstLine[7]
        const upgrade1TroopIndex = firstLine[8]
        const upgrade2TroopIndex = firstLine[9]

        const secondLine = readLine().trim().split(' ')
        const inventory = []
        for (let i = 0; i < 64; i++) {
            const itemID = +secondLine[i * 2]
            if (itemID >= 0)
                inventory.push(itemID)
        }

        const thirdLine = readLine().trim().split(' ')
        const strength = +thirdLine[0]
        const agility = +thirdLine[1]
        const intelligence = +thirdLine[2]
        const charisma = +thirdLine[3]
        const level = +thirdLine[4]

        const fourthLine = readLine().trim().split(' ')
        const oneHanded = +fourthLine[0]
        const twoHanded = +fourthLine[1]
        const polearms = +fourthLine[2]
        const archery = +fourthLine[3]
        const crossbow = +fourthLine[4]
        const throwing = +fourthLine[5]
        const firearms = +fourthLine[6]

        const fifthLine = readLine().trim().split(' ')
        const firstSkillChunk = parseSkills(fifthLine[0])
        const secondSkillChunk = parseSkills(fifthLine[1])
        const thirdSkillChunk = parseSkills(fifthLine[2])
        const fourthSkillChunk = parseSkills(fifthLine[3])
        const fifthSkillChunk = parseSkills(fifthLine[4])
        const sixthSkillChunk = parseSkills(fifthLine[5])
        const skills = {
            trade: firstSkillChunk[0],
            leadership: firstSkillChunk[1],
            prisonerManagement: firstSkillChunk[2],
            persuasion: firstSkillChunk[3],
            engineer: secondSkillChunk[0],
            firstAid: secondSkillChunk[1],
            surgery: secondSkillChunk[2],
            woundTreatment: secondSkillChunk[3],
            inventoryManagement: secondSkillChunk[4],
            spotting: secondSkillChunk[5],
            pathfinding: secondSkillChunk[6],
            tactics: secondSkillChunk[7],
            tracking: thirdSkillChunk[0],
            trainer: thirdSkillChunk[1],
            looting: thirdSkillChunk[6],
            horseArchery: thirdSkillChunk[7],
            riding: fourthSkillChunk[0],
            athletics: fourthSkillChunk[1],
            shield: fourthSkillChunk[2],
            weaponMaster: fourthSkillChunk[3],
            powerDraw: fifthSkillChunk[1],
            powerThrow: fifthSkillChunk[2],
            powerStrike: fifthSkillChunk[3],
            ironflesh: fifthSkillChunk[4],
        }

        const sixthLine = readLine().trim().split(' ')
        const faceKey1 = parseFaceKey(sixthLine.slice(0, 4))
        const faceKey2 = parseFaceKey(sixthLine.slice(4))

        readLine()

        return {
            id,
            name,
            pluralizedName,
            troopImage,
            flags,
            no_scene,
            reserved,
            factionID,
            upgrade1TroopIndex,
            upgrade2TroopIndex,
            inventory,
            level,
            attributes: {
                strength,
                agility,
                intelligence,
                charisma,
            },
            weaponProficiencies: {
                oneHanded,
                twoHanded,
                polearms,
                archery,
                crossbow,
                throwing,
                firearms,
            },
            skills,
            faceKey1,
            faceKey2,
        }

        function parseSkills(num) {
            const skills = []
            for (let i = 0; i < 8; i++) {
                skills.push(((+num) >>> (4 * i)) & 15)
            }
            return skills
        }

        function parseFaceKey(arr) {
            let faceKey = '0x'
            for (let i = 0; i < arr.length; i++) {
                faceKey += converter.decToHex(arr[i]).slice(2).padStart(16, '0')
            }
            return faceKey
        }
    }

    function readLine() {
        const { done, value } = iterator.next()
        if (done)
            throw 'unexpected EOF reached before finishing'
        return value
    }
}

const flagList = [
    { key: 'female', value: 1 },
    { key: 'undead', value: 1 << 1 },
    { key: 'hero', value: 1 << 4 },
    { key: 'inactive', value: 1 << 5 },
    { key: 'unkillable', value: 1 << 6 },
    { key: 'alwaysFallDead', value: 1 << 7 },
    { key: 'noCaptureAlive', value: 1 << 8 },
    { key: 'mounted', value: 1 << 10 },
    { key: 'isMerchant', value: 1 << 12 },
    { key: 'randomizeFace', value: 1 << 15 },
    { key: 'guaranteeBoots', value: 1 << 20 },
    { key: 'guaranteeArmor', value: 1 << 21 },
    { key: 'guaranteeHelmet', value: 1 << 22 },
    { key: 'guaranteeGloves', value: 1 << 23 },
    { key: 'guaranteeHorse', value: 1 << 24 },
    { key: 'guaranteeShield', value: 1 << 25 },
    { key: 'guaranteeRanged', value: 1 << 26 },
    { key: 'guaranteePolearms', value: 1 << 27 },
    { key: 'unmoveableInPartyWindow', value: 1 << 28 },
]
export function parseTroopFlags(flags) {
    const result = []
    for (const { key, value } of flagList) {
        if ((flags & value) == value)
            result.push(key)
    }
    return result
}
