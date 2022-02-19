import { itemLookup, weaponTypes, meleeWeaponTypes, rangedWeaponTypes, ammoTypes, shieldTypes, armorTypes, mountTypes } from '../../modules/warbandHighLevelData.js'
const { computed } = Vue

export default {
  props: {
    id: {
      type: String,
    },
  },
  setup(props) {
    const item = computed(() => itemLookup.get(props.id))
    const typeLookup = new Map([
      ['itp_type_horse', 'Mount'],
      ['itp_type_one_handed_wpn', 'One-handed'],
      ['itp_type_two_handed_wpn', 'Two-handed'],
      ['itp_type_polearm', 'Polearm'],
      ['itp_type_arrows', 'Arrows'],
      ['itp_type_bolts', 'Bolts'],
      ['itp_type_shield', 'Shield'],
      ['itp_type_bow', 'Bow'],
      ['itp_type_crossbow', 'Crossbow'],
      ['itp_type_thrown', 'Thrown'],
      ['itp_type_goods', 'Goods'],
      ['itp_type_head_armor', 'Head Armor'],
      ['itp_type_body_armor', 'Body Armor'],
      ['itp_type_foot_armor', 'Leg Armor'],
      ['itp_type_hand_armor', 'Hand Armor'],
      ['itp_type_pistol', 'Pistol'],
      ['itp_type_musket', 'Musket'],
      ['itp_type_bullets', 'Bullets'],
      ['itp_type_animal', 'Animal'],
      ['itp_type_book', 'Book'],
    ])
    const hasAlternateMode = computed(() => !!item.value.alternateMode)
    const alternateModeItem = computed(() => item.value.alternateMode)
    const name = computed(() => item.value.name)
    const type = computed(() => item.value.type)
    const isWeapon = computed(() => weaponTypes.has(type.value))
    const isAmmo = computed(() => ammoTypes.has(type.value))
    const isShield = computed(() => shieldTypes.has(type.value))
    const isArmor = computed(() => armorTypes.has(type.value))
    const isMount = computed(() => mountTypes.has(type.value))
    const typeName = computed(() => {
      const typeName = mapItemTypeName(type.value, item.value.lowLevelFlags)
      if (!hasAlternateMode.value)
        return typeName

      return `${typeName}/${mapItemTypeName(alternateModeItem.value.type, alternateModeItem.value.lowLevelFlags)}`
    })
    const difficulty = computed(() => {
      const difficulty = item.value.difficulty
      if (!difficulty)
        return null

      const requirementName = mapRequirementName()
      return `Requires ${item.value.difficulty.value} ${requirementName}`

      function mapRequirementName() {
        if (difficulty.statsType === 'strength')
          return 'Strength'
        else if (difficulty.statsType === 'powerDraw')
          return 'Power Draw'
        else if (difficulty.statsType === 'powerThrow')
          return 'Power Throw'
        else if (difficulty.statsType === 'riding')
          return 'Riding'
        else
          return '?'
      }
    })
    const value = computed(() => item.value.value)
    const weight = computed(() => item.value.weight.toFixed(1))
    const weaponFlags = computed(() => mapWeaponFlags(item.value.weaponFlags))
    const weaponDetails = computed(() => {
      if (!isWeapon.value)
        return []

      const weaponDetails = [mapWeaponDetail(item.value)]
      if (hasAlternateMode.value)
        weaponDetails.push(mapWeaponDetail(alternateModeItem.value))
      return weaponDetails
    })

    const ammoDetail = computed(() => {
      const damage = item.value.damageRanged
      return {
        damage: `${damage.amount}${damage.type}`,
        maxAmmo: item.value.maxAmmo,
      }
    })

    const shieldDetail = computed(() => {
      return {
        hitPoints: item.value.hitPoints,
        armor: item.value.shieldArmor,
        size: `${item.value.shieldWidth} x ${item.value.shieldHeight}`,
        speedRating: item.value.speedRating,
      }
    })

    const armorDetail = computed(() => {
      const result = []
      if (item.value.headArmor)
        result.push({ text: 'Head armor', value: item.value.headArmor })
      if (item.value.bodyArmor)
        result.push({ text: 'Body armor', value: item.value.bodyArmor })
      if (item.value.legArmor)
        result.push({ text: 'Leg armor', value: item.value.legArmor })
      return result
    })

    const mountDetail = computed(() => {
      return {
        armor: item.value.mountArmor,
        speedRating: item.value.speedRating,
        maneuver: item.value.maneuver,
        charge: item.value.damageCharge.amount,
        hitPoints: item.value.hitPoints,
        scale: item.value.mountScale.toFixed(2),
      }
    })

    function mapItemTypeName(type, flags) {
      if (type === 'itp_type_polearm' && flags.has('itp_two_handed'))
        return `${typeLookup.get(type)} (No shield)`
      else if (type === 'itp_type_two_handed_wpn' && !flags.has('itp_two_handed'))
        return `${typeLookup.get(type)}/${typeLookup.get('itp_type_one_handed_wpn')}`
      return typeLookup.get(type)
    }

    function mapWeaponDetail(item) {
      const weaponDetail = {
        typeName: mapItemTypeName(item.type, item.lowLevelFlags),
        speedRating: item.speedRating,
      }
      weaponDetail.flags = mapWeaponFlags(item.weaponFlags)
      if (meleeWeaponTypes.has(item.type)) {
        weaponDetail.isMelee = true
        weaponDetail.weaponLength = item.weaponLength
        const swing = item.damageSwing
        if (swing)
          weaponDetail.swing = `${swing.amount}${swing.type}`
        const thrust = item.damageThrust
        if (thrust)
          weaponDetail.thrust = `${thrust.amount}${thrust.type}`
      }
      else if (rangedWeaponTypes.has(item.type)) {
        weaponDetail.isRanged = true
        weaponDetail.missileSpeed = item.missileSpeed
        const thrust = item.damageRanged
        weaponDetail.thrust = `${thrust.amount}${thrust.type}`
        weaponDetail.accuracy = item.accuracy || 99
        weaponDetail.maxAmmo = item.maxAmmo
      }
      return weaponDetail
    }

    const weaponFlagsLookup = new Map([
      ['itp_no_parry', { text: 'Can\'t be used to block', flagType: 'bad' }],
      ['itp_cant_reload_on_horseback', { text: 'Can\'t reload on horseback', flagType: 'bad' }],
      ['itp_can_penetrate_shield', { text: 'Can penetrate through shields', flagType: 'good' }],
      ['itp_bonus_against_shield', { text: 'Bonus against shields', flagType: 'good' }],
      ['itp_penalty_with_shield', { text: 'Penalty when used with a shield', flagType: 'bad' }],
      ['itp_cant_use_on_horseback', { text: 'Cannot be used on horseback', flagType: 'bad' }],
      ['itp_couchable', { text: 'Couchable lance', flagType: 'good' }],
      ['itp_crush_through', { text: 'Can crush through blocks', flagType: 'good' }],
      ['itp_remove_item_on_use', { text: 'itp_remove_item_on_use', flagType: 'bad' }],
      ['itp_unbalanced', { text: 'Unbalanced', flagType: 'bad' }],
      ['itp_can_knock_down', { text: 'Can knockdown', flagType: 'good' }],
      ['itp_extra_penetration', { text: 'itp_extra_penetration', flagType: 'good' }],
      ['itp_cant_reload_while_moving', { text: 'itp_cant_reload_while_moving', flagType: 'bad' }],
      ['itp_ignore_gravity', { text: 'itp_ignore_gravity', flagType: null }],
      ['itp_ignore_friction', { text: 'itp_ignore_friction', flagType: null }],
      ['itp_is_pike', { text: 'itp_is_pike', flagType: null }],
      ['itp_cant_reload_while_moving_mounted', { text: 'itp_cant_reload_while_moving_mounted', flagType: 'bad' }],
      ['itp_has_upper_stab', { text: 'itp_has_upper_stab', flagType: null }],
    ])
    function mapWeaponFlags(flags) {
      const result = []
      for (const flag of flags) {
        const get = weaponFlagsLookup.get(flag)
        if (get)
          result.push(get)
      }
      return result
    }

    return {
      hasAlternateMode,
      isWeapon,
      isAmmo,
      isShield,
      isArmor,
      isMount,
      name,
      typeName,
      difficulty,
      value,
      weight,
      weaponFlags,
      weaponDetails,
      ammoDetail,
      shieldDetail,
      armorDetail,
      mountDetail,
    }
  },
}
