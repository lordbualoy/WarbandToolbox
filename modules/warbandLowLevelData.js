import { rawData } from './warbandRawData.js'
import { parseTroopFlags } from 'warbandParser/troopParser'
import { parseMeshModifier, parseItemFlags, parseItemCapabilities, parseItemModifiers, parseDamage } from 'warbandParser/itemParser'
const { computed } = Vue

export const troops = computed(() => {
    const upgrades = []
    const troops = rawData.troops.map((x, i) => {
        if (x.upgrade1TroopIndex > 0 || x.upgrade2TroopIndex > 0) {
            upgrades.push({ i, upgrade1TroopIndex: x.upgrade1TroopIndex, upgrade2TroopIndex: x.upgrade2TroopIndex })
        }
        return {
            i,
            id: x.id,
            name: x.name,
            pluralizedName: x.pluralizedName,
            troopImage: x.troopImage,
            flags: parseTroopFlags(x.flags),
            no_scene: x.no_scene,
            reserved: x.reserved,
            factionID: factionLookup.get(x.factionID),
            upgrades: [],
            inventory: x.inventory.map(y => items.value[y]),
            level: x.level,
            attributes: x.attributes,
            weaponProficiencies: x.weaponProficiencies,
            skills: x.skills,
            faceKey1: x.faceKey1,
            faceKey2: x.faceKey2,
        }
    })
    for (const { i, upgrade1TroopIndex, upgrade2TroopIndex } of upgrades) {
        const u = troops[i].upgrades
        if (upgrade1TroopIndex > 0)
            u.push(troops[upgrade1TroopIndex])
        if (upgrade2TroopIndex > 0)
            u.push(troops[upgrade2TroopIndex])
    }
    return troops
})

export const items = computed(() => {
    return rawData.items.map((x, i) => {
        return {
            i,
            id: x.id,
            name: x.name,
            pluralizedName: x.pluralizedName,
            meshes: x.meshes.map(y => ({ meshID: y.meshID, modifier: parseMeshModifier(y.modifier) })),
            flags: parseItemFlags(x.flags),
            capabilities: parseItemCapabilities(x.capabilities),
            value: x.value,
            modifiers: parseItemModifiers(x.modifiers),
            weight: x.weight,
            abundance: x.abundance,
            armor: x.armor,
            difficulty: x.difficulty,
            hitPoints: x.hitPoints,
            speedRating: x.speedRating,
            missileSpeed: x.missileSpeed,
            weaponLength: x.weaponLength,
            maxAmmo: x.maxAmmo,
            damage: {
                thrust: parseDamage(x.damage.thrust),
                swing: parseDamage(x.damage.swing),
            },
            factionIDs: x.factionIDs.map(y => factionLookup.get(y)),
            triggers: x.triggers,
        }
    })
})

const factionLookup = new Map([
    [0, 'fac_no_faction'],
    [1, 'fac_commoners'],
    [2, 'fac_outlaws'],
    [3, 'fac_neutral'],
    [4, 'fac_innocents'],
    [5, 'fac_merchants'],
    [6, 'fac_dark_knights'],
    [7, 'fac_culture_1'],
    [8, 'fac_culture_2'],
    [9, 'fac_culture_3'],
    [10, 'fac_culture_4'],
    [11, 'fac_culture_5'],
    [12, 'fac_culture_6'],
    [13, 'fac_player_faction'],
    [14, 'fac_player_supporters_faction'],
    [15, 'fac_kingdom_1'],
    [16, 'fac_kingdom_2'],
    [17, 'fac_kingdom_3'],
    [18, 'fac_kingdom_4'],
    [19, 'fac_kingdom_5'],
    [20, 'fac_kingdom_6'],
    [21, 'fac_kingdoms_end'],
    [22, 'fac_robber_knights'],
    [23, 'fac_khergits'],
    [24, 'fac_black_khergits'],
    [25, 'fac_manhunters'],
    [26, 'fac_deserters'],
    [27, 'fac_mountain_bandits'],
    [28, 'fac_forest_bandits'],
    [29, 'fac_undeads'],
    [30, 'fac_slavers'],
    [31, 'fac_peasant_rebels'],
    [32, 'fac_noble_refugees'],
    [33, 'fac_ccoop_all_stars'],
])
