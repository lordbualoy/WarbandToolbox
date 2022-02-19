import { troops as lowLevelTroopsRef, items as lowLevelItemsRef } from './warbandLowLevelData.js'
const { computed, watch } = Vue

export const expTable = Object.freeze([
    0,
    600,
    1360,
    2296,
    3426,
    4768,
    6345,
    8179,
    10297,
    13010,
    16161,
    19806,
    24007,
    28832,
    34362,
    40682,
    47892,
    56103,
    65441,
    77233,
    90809,
    106425,
    124371,
    144981,
    168636,
    195769,
    226879,
    262533,
    303381,
    350164,
    412091,
    484440,
    568974,
    667638,
    782877,
    917424,
    1074494,
    1257843,
    1471851,
    1721626,
    2070551,
    2489361,
    2992033,
    3595340,
    4319408,
    5188389,
    6231267,
    7482821,
    8984785,
    11236531,
    14051314,
    17569892,
    21968215,
    27466219,
    34338823,
    42929679,
    53668349,
    67091786,
    83871183,
    160204600,
    320304600,
    644046000,
])

export const { meleeWeaponTypes, rangedWeaponTypes, weaponTypes } = (function () {
    const meleeWeaponTypes = [
        'itp_type_one_handed_wpn',
        'itp_type_two_handed_wpn',
        'itp_type_polearm',
    ]

    const rangedWeaponTypes = [
        'itp_type_bow',
        'itp_type_crossbow',
        'itp_type_thrown',
        'itp_type_pistol',
        'itp_type_musket',
    ]

    return {
        meleeWeaponTypes: new Set(meleeWeaponTypes),
        rangedWeaponTypes: new Set(rangedWeaponTypes),
        weaponTypes: new Set([...meleeWeaponTypes, ...rangedWeaponTypes]),
    }
})()

export const ammoTypes = new Set([
    'itp_type_arrows',
    'itp_type_bolts',
    'itp_type_bullets',
])

export const shieldTypes = new Set([
    'itp_type_shield',
])

export const armorTypes = new Set([
    'itp_type_head_armor',
    'itp_type_body_armor',
    'itp_type_foot_armor',
    'itp_type_hand_armor',
])

export const mountTypes = new Set([
    'itp_type_horse',
])

const itemTypeDifficultyToStatsLookup = new Map([
    ['itp_type_one_handed_wpn', 'strength'],
    ['itp_type_two_handed_wpn', 'strength'],
    ['itp_type_polearm', 'strength'],
    ['itp_type_crossbow', 'strength'],
    ['itp_type_head_armor', 'strength'],
    ['itp_type_body_armor', 'strength'],
    ['itp_type_foot_armor', 'strength'],
    ['itp_type_hand_armor', 'strength'],
    ['itp_type_bow', 'powerDraw'],
    ['itp_type_thrown', 'powerThrow'],
    ['itp_type_horse', 'riding'],
])

export const weaponPropertyFlags = new Set([
    'itp_no_parry',
    'itp_cant_reload_on_horseback',
    'itp_can_penetrate_shield',
    'itp_bonus_against_shield',
    'itp_penalty_with_shield',
    'itp_cant_use_on_horseback',
    'itp_couchable',
    'itp_crush_through',
    'itp_remove_item_on_use',
    'itp_unbalanced',
    'itp_can_knock_down',
    'itp_extra_penetration',
    'itp_cant_reload_while_moving',
    'itp_ignore_gravity',
    'itp_ignore_friction',
    'itp_is_pike',
    'itp_cant_reload_while_moving_mounted',
    'itp_has_upper_stab',
])

export const troops = computed(() => {
    const lowLevelTroops = lowLevelTroopsRef.value
    const upgrades = []
    const troops = lowLevelTroops.map((x, i) => {
        if (x.upgrades.length > 0) {
            upgrades.push({ i, upgradeIndices: x.upgrades.map(y => y.i) })
        }
        const troop = {
            i,
            id: x.id,
            name: x.name.replaceAll('_', ' '),
            pluralizedName: x.pluralizedName.replaceAll('_', ' '),
            troopImage: x.troopImage,
            type: null,
            sex: null,
            otherFlags: [],
            no_scene: x.no_scene,
            reserved: x.reserved,
            factionID: x.factionID,
            upgrades: [],
            inventory: x.inventory.map(y => itemLookup.get(y.id)),
            level: x.level,
            expRequiredForLevelUp: null,
            hitPoints: 35 + x.skills.ironflesh * 2 + x.attributes.strength,
            attributes: x.attributes,
            weaponProficiencies: x.weaponProficiencies,
            skills: x.skills,
            faceKey1: x.faceKey1,
            faceKey2: x.faceKey2,
            lowLevelFlags: new Set(),
        }
        for (const flag of x.flags) {
            troop.lowLevelFlags.add(flag)
            if (flag === 'female')
                troop.sex = 'female'
            else if (flag === 'guaranteeHorse') {
                troop.type ??= 'cavalry'
                troop.otherFlags.push(flag)
            }
            else if (flag === 'guaranteeRanged') {
                troop.type ??= 'archer'
                troop.otherFlags.push(flag)
            }
            else
                troop.otherFlags.push(flag)
        }
        if (!troop.sex)
            troop.sex = 'male'
        if (!troop.type)
            troop.type = 'infantry'
        troop.expRequiredForLevelUp = expRequiredForLevelUp()
        return troop

        function expRequiredForLevelUp() {
            if (troop.lowLevelFlags.has('hero'))
                return expTable[troop.level + 1] - expTable[troop.level]
            else {
                const baseExpRequired = Math.round(expTable[troop.level + 4] * 0.006) + 30
                return troop.factionID === 'fac_outlaws' ? baseExpRequired * 2 : baseExpRequired
            }
        }
    })
    for (const { i, upgradeIndices } of upgrades) {
        const u = troops[i].upgrades
        for (const j of upgradeIndices)
            u.push(troops[j])
    }
    return troops
})

export const items = computed(() => {
    const lowLevelItems = lowLevelItemsRef.value
    const items = []
    let i = 0
    const itemsWithAlternateMode = []
    while (i < lowLevelItems.length) {
        const item = mapItem(i)
        //if (item.type)  //itm_items_end && itm_ccoop_new_items_end doesn't belong here
            items.push(item)
        i++

        function mapItem(i) {
            const lowLevelItem = lowLevelItems[i]
            const item = {
                i: lowLevelItem.i,
                id: lowLevelItem.id,
                name: lowLevelItem.name.replaceAll('_', ' '),
                pluralizedName: lowLevelItem.pluralizedName.replaceAll('_', ' '),
                type: null,
                meshes: lowLevelItem.meshes,
                otherFlags: [],
                weaponFlags: [],
                capabilities: lowLevelItem.capabilities,
                alternateMode: null,
                value: lowLevelItem.value,
                modifiers: lowLevelItem.modifiers,
                weight: lowLevelItem.weight,
                abundance: lowLevelItem.abundance,
                //armor: lowLevelItem.armor,
                difficulty: null,
                //hitPoints: lowLevelItem.hitPoints,
                //speedRating: lowLevelItem.speedRating,
                //missileSpeed: lowLevelItem.missileSpeed,
                //weaponLength: lowLevelItem.weaponLength,
                //maxAmmo: lowLevelItem.maxAmmo,
                //damage: lowLevelItem.damage,
                factionIDs: lowLevelItem.factionIDs,
                //triggers: x.triggers,
                lowLevelFlags: new Set(),
            }
            let hasAlternateMode = false
            let hasCanPenetrateShield = false
            let hasOffsetLance = false
            let hasCouchable = false
            for (const flag of lowLevelItem.flags) {
                item.lowLevelFlags.add(flag)
                if (flag.startsWith('itp_type_'))
                    item.type ??= flag
                else if (weaponPropertyFlags.has(flag)) {
                    item.weaponFlags.push(flag)
                    if (flag === 'itp_can_penetrate_shield')
                        hasCanPenetrateShield = true
                    else if (flag === 'itp_couchable')
                        hasCouchable = true
                }
                else if (flag === 'itp_next_item_as_melee') {
                    hasAlternateMode = true
                    itemsWithAlternateMode.push(i)
                }
                else {
                    if (flag === 'itp_offset_lance')
                        hasOffsetLance = true
                    item.otherFlags.push(flag)
                }
            }
            if (lowLevelItem.difficulty) {
                item.difficulty = {
                    statsType: itemTypeDifficultyToStatsLookup.get(item.type),
                    value: lowLevelItem.difficulty,
                }
            }
            if (hasCanPenetrateShield) {
                if (armorTypes.has(item.type)) {
                    item.weaponFlags.splice(item.weaponFlags.findIndex(x => x === 'itp_can_penetrate_shield'), 1)

                    const flagToRemove = item.type === 'itp_type_head_armor' ? 'itp_covers_legs' : 'itp_doesnt_cover_hair'
                    item.otherFlags.splice(item.otherFlags.findIndex(x => x === flagToRemove), 1)
                }
                else {
                    item.otherFlags.splice(item.otherFlags.findIndex(x => x === 'itp_covers_legs'), 1)
                    item.otherFlags.splice(item.otherFlags.findIndex(x => x === 'itp_doesnt_cover_hair'), 1)
                }
            }
            if (hasOffsetLance) {
                if (item.type === 'itp_type_head_armor') {
                    item.otherFlags.splice(item.otherFlags.findIndex(x => x === 'itp_offset_lance'), 1)
                }
                else {
                    item.otherFlags.splice(item.otherFlags.findIndex(x => x === 'itp_fit_to_head'), 1)
                }
            }
            if (hasCouchable) {
                if (item.type === 'itp_type_head_armor') {
                    item.weaponFlags.splice(item.weaponFlags.findIndex(x => x === 'itp_couchable'), 1)
                }
                else {
                    item.otherFlags.splice(item.otherFlags.findIndex(x => x === 'itp_covers_head'), 1)
                }
            }
            if (weaponTypes.has(item.type)) {
                if (hasAlternateMode) {
                    item.otherFlags.splice(item.otherFlags.findIndex(x => x === 'itp_civilian'), 1)
                }
                item.speedRating = lowLevelItem.speedRating
                if (meleeWeaponTypes.has(item.type)) {
                    item.weaponLength = lowLevelItem.weaponLength
                    const swing = lowLevelItem.damage.swing
                    item.damageSwing = swing.amount !== 0 ? swing : null
                    const thrust = lowLevelItem.damage.thrust
                    item.damageThrust = thrust.amount !== 0 ? thrust : null
                } else if (rangedWeaponTypes.has(item.type)) {
                    item.missileSpeed = lowLevelItem.missileSpeed
                    item.damageRanged = lowLevelItem.damage.thrust
                    item.accuracy = lowLevelItem.armor.leg || 99
                    item.maxAmmo = lowLevelItem.maxAmmo
                }
            }
            else if (ammoTypes.has(item.type)) {
                item.damageRanged = lowLevelItem.damage.thrust
                item.maxAmmo = lowLevelItem.maxAmmo
            }
            else if (shieldTypes.has(item.type)) {
                item.hitPoints = lowLevelItem.hitPoints
                item.shieldArmor = lowLevelItem.armor.body
                item.shieldWidth = lowLevelItem.weaponLength * 2
                item.shieldHeight = lowLevelItem.missileSpeed ? lowLevelItem.weaponLength + lowLevelItem.missileSpeed : item.shieldWidth
                item.speedRating = lowLevelItem.speedRating
            }
            else if (armorTypes.has(item.type)) {
                item.headArmor = lowLevelItem.armor.head
                item.bodyArmor = lowLevelItem.armor.body
                item.legArmor = lowLevelItem.armor.leg
            }
            else if (mountTypes.has(item.type)) {
                item.mountArmor = lowLevelItem.armor.body
                item.speedRating = lowLevelItem.missileSpeed
                item.maneuver = lowLevelItem.speedRating
                item.damageCharge = lowLevelItem.damage.thrust
                item.hitPoints = lowLevelItem.hitPoints
                item.mountScale = lowLevelItem.weaponLength / 100
            }

            return item
        }
    }
    const alternateModeItems = []
    for (const j of itemsWithAlternateMode) {
        const k = j + 1
        alternateModeItems.push(j)
        items[j].alternateMode = items[k]
    }
    for (const j of alternateModeItems) {
        if (!items[j].alternateMode)
            items.splice(j, 1)
    }
    return items
})

export const itemLookup = new Map()
watch(items
    , () => {
        itemLookup.clear()
        for (const item of items.value) {
            itemLookup.set(item.id, item)
        }
    }
    , { immediate: true }
)
