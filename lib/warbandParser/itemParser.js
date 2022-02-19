import { TxtReader } from 'txt-reader'

export async function parseItemsFile(file) {
    var reader = new TxtReader()
    await reader.loadFile(file)
    const { result } = await reader.getLines()
    return parseItems([...result, ''])
}

export function parseItems(lines) {
    const iterator = lines[Symbol.iterator]()
    const magic = readLine()
    if (magic !== 'itemsfile version 3')
        throw 'invalid file'
    const count = +readLine()
    const items = []
    for (let i = 0; i < count; i++) {
        items.push(readItem())
    }

    return items

    function readItem() {
        const primaryLine = readLine().trim().split(' ').filter(x => x !== '')
        let i = 0
        const id = primaryLine[i++]
        const name = primaryLine[i++]
        const pluralizedName = primaryLine[i++]
        const meshCount = +primaryLine[i++]
        const meshes = []
        for (let j = 0; j < meshCount; j++) {
            const meshID = primaryLine[i++]
            const modifier = BigInt(primaryLine[i++])
            meshes.push({ meshID, modifier })
        }
        const flags = BigInt(primaryLine[i++])
        const capabilities = BigInt(primaryLine[i++])
        const value = +primaryLine[i++]
        const modifiers = +primaryLine[i++]
        const weight = +primaryLine[i++]	//this one is float
        const abundance = +primaryLine[i++]
        const headArmor = +primaryLine[i++]	//for foods this is food's quality
        const bodyArmor = +primaryLine[i++]
        const legArmor = +primaryLine[i++]	//for ranged weapons this is the weapon's accuracy
        const difficulty = +primaryLine[i++]
        const hitPoints = (+primaryLine[i++]) & 1023    //workaround for warband module compiler bug that reads overflow value of hitPoints which should have a cap of 0x3ff but instead reads data into swing damage, thrust damage and weaponLength bits
        const speedRating = +primaryLine[i++]	//for horses this is horse's maneuver
        const missileSpeed = +primaryLine[i++]	//for shields this is shield's height, for horses this is horse's speed
        const weaponLength = +primaryLine[i++]	//for shields this is shield's width, for horses this is horse's scale
        const maxAmmo = +primaryLine[i++]
        const thrustDamage = +primaryLine[i++]	//for horses this is charge damage
        const swingDamage = +primaryLine[i++]

        const factionCount = +readLine().trim()
        const factionIDs = factionCount > 0 ? readLine().trim().split(' ').map(x => +x) : []

        const triggerCount = +readLine().trim()
        const triggers = []
        for (let j = 0; j < triggerCount; j++) {
            const triggerLine = readLine().trim()
            triggers.push(triggerLine)
        }

        readLine()

        return {
            id,
            name,
            pluralizedName,
            meshes,
            flags,
            capabilities,
            value,
            modifiers,
            weight,
            abundance,
            armor: {
                head: headArmor,
                body: bodyArmor,
                leg: legArmor,
            },
            difficulty,
            hitPoints,
            speedRating,
            missileSpeed,
            weaponLength,
            maxAmmo,
            damage: {
                thrust: thrustDamage,
                swing: swingDamage,
            },
            factionIDs,
            triggers,
        }
    }

    function readLine() {
        const { done, value } = iterator.next()
        if (done)
            throw 'unexpected EOF reached before finishing'
        return value
    }
}

const ixmesh_inventory = 1n << 60n
const ixmesh_flying_ammo = 2n << 60n
const ixmesh_carry = 3n << 60n
export function parseMeshModifier(modifier) {
    if (modifier === ixmesh_inventory)
        return 'ixmesh_inventory'
    else if (modifier === ixmesh_flying_ammo)
        return 'ixmesh_flying_ammo'
    else if (modifier === ixmesh_carry)
        return 'ixmesh_carry'
    else
        return null
}

const itemTypeLookup = new Map([
    [BigInt('0x0000000000000001'), 'itp_type_horse'],
    [BigInt('0x0000000000000002'), 'itp_type_one_handed_wpn'],
    [BigInt('0x0000000000000003'), 'itp_type_two_handed_wpn'],
    [BigInt('0x0000000000000004'), 'itp_type_polearm'],
    [BigInt('0x0000000000000005'), 'itp_type_arrows'],
    [BigInt('0x0000000000000006'), 'itp_type_bolts'],
    [BigInt('0x0000000000000007'), 'itp_type_shield'],
    [BigInt('0x0000000000000008'), 'itp_type_bow'],
    [BigInt('0x0000000000000009'), 'itp_type_crossbow'],
    [BigInt('0x000000000000000a'), 'itp_type_thrown'],
    [BigInt('0x000000000000000b'), 'itp_type_goods'],
    [BigInt('0x000000000000000c'), 'itp_type_head_armor'],
    [BigInt('0x000000000000000d'), 'itp_type_body_armor'],
    [BigInt('0x000000000000000e'), 'itp_type_foot_armor'],
    [BigInt('0x000000000000000f'), 'itp_type_hand_armor'],
    [BigInt('0x0000000000000010'), 'itp_type_pistol'],
    [BigInt('0x0000000000000011'), 'itp_type_musket'],
    [BigInt('0x0000000000000012'), 'itp_type_bullets'],
    [BigInt('0x0000000000000013'), 'itp_type_animal'],
    [BigInt('0x0000000000000014'), 'itp_type_book'],
])
const itemFlagList = [
    { key: 'itp_force_attach_left_hand', value: BigInt('0x0000000000000100') },
    { key: 'itp_force_attach_right_hand', value: BigInt('0x0000000000000200') },
    { key: 'itp_force_attach_left_forearm', value: BigInt('0x0000000000000300') },
    { key: 'itp_attach_armature', value: BigInt('0x0000000000000f00') },
    { key: 'itp_unique', value: BigInt('0x0000000000001000') },
    { key: 'itp_always_loot', value: BigInt('0x0000000000002000') },
    { key: 'itp_no_parry', value: BigInt('0x0000000000004000') },
    { key: 'itp_default_ammo', value: BigInt('0x0000000000008000') },
    { key: 'itp_merchandise', value: BigInt('0x0000000000010000') },
    { key: 'itp_wooden_attack', value: BigInt('0x0000000000020000') },
    { key: 'itp_wooden_parry', value: BigInt('0x0000000000040000') },
    { key: 'itp_food', value: BigInt('0x0000000000080000') },
    { key: 'itp_cant_reload_on_horseback', value: BigInt('0x0000000000100000') },
    { key: 'itp_two_handed', value: BigInt('0x0000000000200000') },
    { key: 'itp_primary', value: BigInt('0x0000000000400000') },
    { key: 'itp_secondary', value: BigInt('0x0000000000800000') },
    { key: 'itp_covers_legs', value: BigInt('0x0000000001000000') },
    { key: 'itp_doesnt_cover_hair', value: BigInt('0x0000000001000000') },
    { key: 'itp_can_penetrate_shield', value: BigInt('0x0000000001000000') },
    { key: 'itp_consumable', value: BigInt('0x0000000002000000') },
    { key: 'itp_bonus_against_shield', value: BigInt('0x0000000004000000') },
    { key: 'itp_penalty_with_shield', value: BigInt('0x0000000008000000') },
    { key: 'itp_cant_use_on_horseback', value: BigInt('0x0000000010000000') },
    { key: 'itp_civilian', value: BigInt('0x0000000020000000') },
    { key: 'itp_next_item_as_melee', value: BigInt('0x0000000020000000') },
    { key: 'itp_fit_to_head', value: BigInt('0x0000000040000000') },
    { key: 'itp_offset_lance', value: BigInt('0x0000000040000000') },
    { key: 'itp_covers_head', value: BigInt('0x0000000080000000') },
    { key: 'itp_couchable', value: BigInt('0x0000000080000000') },
    { key: 'itp_crush_through', value: BigInt('0x0000000100000000') },
    { key: 'itp_remove_item_on_use', value: BigInt('0x0000000400000000') },
    { key: 'itp_unbalanced', value: BigInt('0x0000000800000000') },
    { key: 'itp_covers_beard', value: BigInt('0x0000001000000000') },
    { key: 'itp_no_pick_up_from_ground', value: BigInt('0x0000002000000000') },
    { key: 'itp_can_knock_down', value: BigInt('0x0000004000000000') },
    { key: 'itp_covers_hair', value: BigInt('0x0000008000000000') },
    { key: 'itp_force_show_body', value: BigInt('0x0000010000000000') },
    { key: 'itp_force_show_left_hand', value: BigInt('0x0000020000000000') },
    { key: 'itp_force_show_right_hand', value: BigInt('0x0000040000000000') },
    { key: 'itp_covers_hair_partially', value: BigInt('0x0000080000000000') },
    { key: 'itp_extra_penetration', value: BigInt('0x0000100000000000') },
    { key: 'itp_has_bayonet', value: BigInt('0x0000200000000000') },
    { key: 'itp_cant_reload_while_moving', value: BigInt('0x0000400000000000') },
    { key: 'itp_ignore_gravity', value: BigInt('0x0000800000000000') },
    { key: 'itp_ignore_friction', value: BigInt('0x0001000000000000') },
    { key: 'itp_is_pike', value: BigInt('0x0002000000000000') },
    { key: 'itp_offset_musket', value: BigInt('0x0004000000000000') },
    { key: 'itp_no_blur', value: BigInt('0x0008000000000000') },
    { key: 'itp_cant_reload_while_moving_mounted', value: BigInt('0x0010000000000000') },
    { key: 'itp_has_upper_stab', value: BigInt('0x0020000000000000') },
    { key: 'itp_disable_agent_sounds', value: BigInt('0x0040000000000000') },
]
export function parseItemFlags(flags) {
    const result = []
    const itemType = itemTypeLookup.get(flags & 255n)
    if (itemType)
        result.push(itemType)

    for (const { key, value } of itemFlagList) {
        if ((flags & value) == value)
            result.push(key)
    }
    return result
}

const shootTypeLookup = new Map([
    [BigInt('0x0000000000001000'), 'itcf_shoot_bow'],
    [BigInt('0x0000000000002000'), 'itcf_shoot_javelin'],
    [BigInt('0x0000000000004000'), 'itcf_shoot_crossbow'],

    [BigInt('0x0000000000010000'), 'itcf_throw_stone'],
    [BigInt('0x0000000000020000'), 'itcf_throw_knife'],
    [BigInt('0x0000000000030000'), 'itcf_throw_axe'],
    [BigInt('0x0000000000040000'), 'itcf_throw_javelin'],
    [BigInt('0x0000000000070000'), 'itcf_shoot_pistol'],
    [BigInt('0x0000000000080000'), 'itcf_shoot_musket'],
])
const attackOnFootFlagList = [
    { key: 'itcf_thrust_onehanded', value: BigInt('0x0000000000000001') },
    { key: 'itcf_overswing_onehanded', value: BigInt('0x0000000000000002') },
    { key: 'itcf_slashright_onehanded', value: BigInt('0x0000000000000004') },
    { key: 'itcf_slashleft_onehanded', value: BigInt('0x0000000000000008') },

    { key: 'itcf_thrust_twohanded', value: BigInt('0x0000000000000010') },
    { key: 'itcf_overswing_twohanded', value: BigInt('0x0000000000000020') },
    { key: 'itcf_slashright_twohanded', value: BigInt('0x0000000000000040') },
    { key: 'itcf_slashleft_twohanded', value: BigInt('0x0000000000000080') },

    { key: 'itcf_thrust_polearm', value: BigInt('0x0000000000000100') },
    { key: 'itcf_overswing_polearm', value: BigInt('0x0000000000000200') },
    { key: 'itcf_slashright_polearm', value: BigInt('0x0000000000000400') },
    { key: 'itcf_slashleft_polearm', value: BigInt('0x0000000000000800') },
]
const attackOnHorsebackFlagList = [
    { key: 'itcf_horseback_thrust_onehanded', value: BigInt('0x0000000000100000') },
    { key: 'itcf_horseback_overswing_right_onehanded', value: BigInt('0x0000000000200000') },
    { key: 'itcf_horseback_overswing_left_onehanded', value: BigInt('0x0000000000400000') },
    { key: 'itcf_horseback_slashright_onehanded', value: BigInt('0x0000000000800000') },
    { key: 'itcf_horseback_slashleft_onehanded', value: BigInt('0x0000000001000000') },
    { key: 'itcf_thrust_onehanded_lance', value: BigInt('0x0000000004000000') },
    { key: 'itcf_thrust_onehanded_lance_horseback', value: BigInt('0x0000000008000000') },
]
const carryTypeLookup = new Map([
    [BigInt('0x0000000010000000'), 'itcf_carry_sword_left_hip'],
    [BigInt('0x0000000020000000'), 'itcf_carry_axe_left_hip'],
    [BigInt('0x0000000030000000'), 'itcf_carry_dagger_front_left'],
    [BigInt('0x0000000040000000'), 'itcf_carry_dagger_front_right'],
    [BigInt('0x0000000050000000'), 'itcf_carry_quiver_front_right'],
    [BigInt('0x0000000060000000'), 'itcf_carry_quiver_back_right'],
    [BigInt('0x0000000070000000'), 'itcf_carry_quiver_right_vertical'],
    [BigInt('0x0000000080000000'), 'itcf_carry_quiver_back'],
    [BigInt('0x0000000090000000'), 'itcf_carry_revolver_right'],
    [BigInt('0x00000000a0000000'), 'itcf_carry_pistol_front_left'],
    [BigInt('0x00000000b0000000'), 'itcf_carry_bowcase_left'],
    [BigInt('0x00000000c0000000'), 'itcf_carry_mace_left_hip'],

    [BigInt('0x0000000100000000'), 'itcf_carry_axe_back'],
    [BigInt('0x0000000110000000'), 'itcf_carry_sword_back'],
    [BigInt('0x0000000120000000'), 'itcf_carry_kite_shield'],
    [BigInt('0x0000000130000000'), 'itcf_carry_round_shield'],
    [BigInt('0x0000000140000000'), 'itcf_carry_buckler_left'],
    [BigInt('0x0000000150000000'), 'itcf_carry_crossbow_back'],
    [BigInt('0x0000000160000000'), 'itcf_carry_bow_back'],
    [BigInt('0x0000000170000000'), 'itcf_carry_spear'],
    [BigInt('0x0000000180000000'), 'itcf_carry_board_shield'],

    [BigInt('0x0000000210000000'), 'itcf_carry_katana'],
    [BigInt('0x0000000220000000'), 'itcf_carry_wakizashi'],
])
const itcf_show_holster_when_drawn = BigInt('0x0000000800000000')
const reloadTypeLookup = new Map([
    [BigInt('0x0000007000000000'), 'itcf_reload_pistol'],
    [BigInt('0x0000008000000000'), 'itcf_reload_musket'],
])
const otherFlagList = [
    { key: 'itcf_parry_forward_onehanded', value: BigInt('0x0000010000000000') },
    { key: 'itcf_parry_up_onehanded', value: BigInt('0x0000020000000000') },
    { key: 'itcf_parry_right_onehanded', value: BigInt('0x0000040000000000') },
    { key: 'itcf_parry_left_onehanded', value: BigInt('0x0000080000000000') },

    { key: 'itcf_parry_forward_twohanded', value: BigInt('0x0000100000000000') },
    { key: 'itcf_parry_up_twohanded', value: BigInt('0x0000200000000000') },
    { key: 'itcf_parry_right_twohanded', value: BigInt('0x0000400000000000') },
    { key: 'itcf_parry_left_twohanded', value: BigInt('0x0000800000000000') },

    { key: 'itcf_parry_forward_polearm', value: BigInt('0x0001000000000000') },
    { key: 'itcf_parry_up_polearm', value: BigInt('0x0002000000000000') },
    { key: 'itcf_parry_right_polearm', value: BigInt('0x0004000000000000') },
    { key: 'itcf_parry_left_polearm', value: BigInt('0x0008000000000000') },

    { key: 'itcf_horseback_slash_polearm', value: BigInt('0x0010000000000000') },
    { key: 'itcf_overswing_spear', value: BigInt('0x0020000000000000') },
    { key: 'itcf_overswing_musket', value: BigInt('0x0040000000000000') },
    { key: 'itcf_thrust_musket', value: BigInt('0x0080000000000000') },

    { key: 'itcf_force_64_bits', value: BigInt('0x8000000000000000') },
]
export function parseItemCapabilities(flags) {
    const result = []
    for (const { key, value } of attackOnFootFlagList) {
        if ((flags & value) == value)
            result.push(key)
    }

    const shootType = shootTypeLookup.get(flags & BigInt('0x00000000000ff000'))
    if (shootType)
        result.push(shootType)

    for (const { key, value } of attackOnHorsebackFlagList) {
        if ((flags & value) == value)
            result.push(key)
    }

    const carryType = carryTypeLookup.get(flags & BigInt('0x00000007f0000000'))
    if (carryType)
        result.push(carryType)

    if ((flags & itcf_show_holster_when_drawn) == itcf_show_holster_when_drawn)
        result.push('itcf_show_holster_when_drawn')

    const reloadType = reloadTypeLookup.get(flags & BigInt('0x000000f000000000'))
    if (reloadType)
        result.push(reloadType)

    for (const { key, value } of otherFlagList) {
        if ((flags & value) == value)
            result.push(key)
    }

    return result
}

const modifierFlagList = [
    { key: 'imodbit_plain', value: 1 },
    { key: 'imodbit_cracked', value: 2 },
    { key: 'imodbit_rusty', value: 4 },
    { key: 'imodbit_bent', value: 8 },
    { key: 'imodbit_chipped', value: 16 },
    { key: 'imodbit_battered', value: 32 },
    { key: 'imodbit_poor', value: 64 },
    { key: 'imodbit_crude', value: 128 },
    { key: 'imodbit_old', value: 256 },
    { key: 'imodbit_cheap', value: 512 },
    { key: 'imodbit_fine', value: 1024 },
    { key: 'imodbit_well_made', value: 2048 },
    { key: 'imodbit_sharp', value: 4096 },
    { key: 'imodbit_balanced', value: 8192 },
    { key: 'imodbit_tempered', value: 16384 },
    { key: 'imodbit_deadly', value: 32768 },
    { key: 'imodbit_exquisite', value: 65536 },
    { key: 'imodbit_masterwork', value: 131072 },
    { key: 'imodbit_heavy', value: 262144 },
    { key: 'imodbit_strong', value: 524288 },
    { key: 'imodbit_powerful', value: 1048576 },
    { key: 'imodbit_tattered', value: 2097152 },
    { key: 'imodbit_ragged', value: 4194304 },
    { key: 'imodbit_rough', value: 8388608 },
    { key: 'imodbit_sturdy', value: 16777216 },
    { key: 'imodbit_thick', value: 33554432 },
    { key: 'imodbit_hardened', value: 67108864 },
    { key: 'imodbit_reinforced', value: 134217728 },
    { key: 'imodbit_superb', value: 268435456 },
    { key: 'imodbit_lordly', value: 536870912 },
    { key: 'imodbit_lame', value: 1073741824 },
    { key: 'imodbit_swaybacked', value: 2147483648 },
    { key: 'imodbit_stubborn', value: 4294967296 },
    { key: 'imodbit_timid', value: 8589934592 },
    { key: 'imodbit_meek', value: 17179869184 },
    { key: 'imodbit_spirited', value: 34359738368 },
    { key: 'imodbit_champion', value: 68719476736 },
    { key: 'imodbit_fresh', value: 137438953472 },
    { key: 'imodbit_day_old', value: 274877906944 },
    { key: 'imodbit_two_day_old', value: 549755813888 },
    { key: 'imodbit_smelling', value: 1099511627776 },
    { key: 'imodbit_rotten', value: 2199023255552 },
    { key: 'imodbit_large_bag', value: 4398046511104 },
]
export function parseItemModifiers(flags) {
    const result = []
    for (const { key, value } of modifierFlagList) {
        if ((flags & value) == value)
            result.push(key)
    }
    return result
}

export function parseDamage(value) {
    const damageTypeCut = 0
    const damageTypePierce = 1
    const damageTypeBlunt = 2

    const damageType = (() => {
        const damageType = value >>> 8
        if (damageType === damageTypeCut)
            return 'c'
        else if (damageType === damageTypePierce)
            return 'p'
        else if (damageType === damageTypeBlunt)
            return 'b'
        else
            return '?'
    })()

    const damage = value & 255

    return { type: damageType, amount: damage }
}
