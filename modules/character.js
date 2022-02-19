import { expTable } from './warbandHighLevelData.js'
const { reactive, computed, watch } = Vue

export function createCharacter(troop, initialAttributePoints = 0, initialSkillPoints = 0) {
    const baseAttributes = troop.attributes
    const character = reactive({
        id: troop.id,
        name: troop.name,
        pluralizedName: getPluralizedName(troop),
        type: getType(troop),
        sex: getSex(troop),
        faction: troop.factionID,
        facekey1: troop.faceKey1,
        facekey2: troop.faceKey2,
        otherFlags: troop.otherFlags,
        level: troop.level,
        expRequired: troop.expRequiredForLevelUp,
        hp: troop.hitPoints,
        ...baseAttributes,
        remainingAttributePoints: initialAttributePoints,
        skills: getSkills(troop),
        remainingSkillPoints: initialSkillPoints,
        weaponProficiencies: getWeaponProficiencies(troop),
        inventory: getInventory(troop),
        upgrades: troop.upgrades,
    })
    const gainedLevels = computed(() => character.level - troop.level)
    const gainedIntelligences = computed(() => character.intelligence - baseAttributes.intelligence)
    const gainedSkillPoints = computed(() => gainedIntelligences.value)
    const totalBaseAttributes = baseAttributes.strength + baseAttributes.agility + baseAttributes.intelligence + baseAttributes.charisma
    const totalAttributes = computed(() => character.strength + character.agility + character. intelligence + character.charisma)
    const ironflesh = character.skills.find(x => x.name === 'ironflesh')
    const totalBaseSkills = character.skills.reduce((sum, x) => sum + x.rank, 0)
    const totalSkills = computed(() => character.skills.reduce((sum, x) => sum + x.rank, 0))
    watch(() => character.level, () => { character.expRequired = getExpRequiredForLevelUp(troop, character.level) })
    watch([() => character.strength,() => ironflesh.rank], () => { character.hp = 35 + (ironflesh.rank * 2) + character.strength })
    watch([totalAttributes, totalSkills], () => {
      character.level = troop.level + Math.max(totalAttributes.value - totalBaseAttributes - initialAttributePoints, totalSkills.value - (gainedSkillPoints.value + totalBaseSkills + initialSkillPoints), 0)
      character.remainingAttributePoints = totalBaseAttributes + initialAttributePoints + gainedLevels.value - totalAttributes.value
      character.remainingSkillPoints = totalBaseSkills + initialSkillPoints + gainedLevels.value + gainedIntelligences.value - totalSkills.value
    })
    return character
}

function getPluralizedName(troop) {
  if (!troop.pluralizedName)
    return null
  if (troop.pluralizedName === troop.name)
    return null
  return troop.pluralizedName
}

function getType(troop) {
  if (troop.type === 'cavalry')
    return 'Cavalry'
  else if (troop.type === 'archer')
    return 'Archer'
  else if (troop.type === 'infantry')
    return 'Infantry'
  else
    return '?'
}

function getSex(troop) {
  if (troop.sex === 'female')
    return 'Female'
  else if (troop.sex === 'male')
    return 'Male'
  else
    return '?'
}

function getExpRequiredForLevelUp(troop, newLevel) {
    if (troop.lowLevelFlags.has('hero'))
        return expTable[newLevel + 1] - expTable[newLevel]
    else {
        const baseExpRequired = Math.round(expTable[newLevel + 4] * 0.006) + 30
        return troop.factionID === 'fac_outlaws' ? baseExpRequired * 2 : baseExpRequired
    }
}

function getSkills(troop) {
  return [
    'ironflesh',
    'powerStrike',
    'powerThrow',
    'powerDraw',
    'weaponMaster',
    'shield',
    'athletics',
    'riding',
    'horseArchery',
    'looting',
    'trainer',
    'tracking',
    'tactics',
    'pathfinding',
    'spotting',
    'inventoryManagement',
    'woundTreatment',
    'surgery',
    'firstAid',
    'engineer',
    'persuasion',
    'prisonerManagement',
    'leadership',
    'trade',
  ].map(x => ({name: x, rank: troop.skills[x]}))
}

function getWeaponProficiencies(troop) {
  return [
    { key: 'oneHanded', text: 'One Handed Weapons' },
    { key: 'twoHanded', text: 'Two Handed Weapons' },
    { key: 'polearms', text: 'Polearms' },
    { key: 'archery', text: 'Archery' },
    { key: 'crossbow', text: 'Crossbows' },
    { key: 'throwing', text: 'Throwing' },
    { key: 'firearms', text: 'Firearms' },
  ].map(({key, text}) => ({name: text, value: troop.weaponProficiencies[key]}))
}

function getInventory(troop) {
  const typeMap = [
    { type: 'itp_type_horse', flag: 'guaranteeHorse' },
    { type: 'itp_type_one_handed_wpn', flag: null },
    { type: 'itp_type_two_handed_wpn', flag: null },
    { type: 'itp_type_polearm', flag: 'guaranteePolearms' },
    { type: 'itp_type_arrows', flag: 'guaranteeRanged' },
    { type: 'itp_type_bolts', flag: 'guaranteeRanged' },
    { type: 'itp_type_shield', flag: 'guaranteeShield' },
    { type: 'itp_type_bow', flag: 'guaranteeRanged' },
    { type: 'itp_type_crossbow', flag: 'guaranteeRanged' },
    { type: 'itp_type_thrown', flag: 'guaranteeRanged' },
    { type: 'itp_type_head_armor', flag: 'guaranteeHelmet' },
    { type: 'itp_type_body_armor', flag: 'guaranteeArmor' },
    { type: 'itp_type_foot_armor', flag: 'guaranteeBoots' },
    { type: 'itp_type_hand_armor', flag: 'guaranteeGloves' },
    { type: 'itp_type_pistol', flag: 'guaranteeRanged' },
    { type: 'itp_type_musket', flag: 'guaranteeRanged' },
    { type: 'itp_type_bullets', flag: 'guaranteeRanged' },
  ]
  const typeOrdering = [
    'itp_type_one_handed_wpn',
    'itp_type_two_handed_wpn',
    'itp_type_polearm',
    'itp_type_bow',
    'itp_type_crossbow',
    'itp_type_pistol',
    'itp_type_musket',
    'itp_type_bullets',
    'itp_type_thrown',
    'itp_type_arrows',
    'itp_type_bolts',
    'itp_type_shield',
    'itp_type_head_armor',
    'itp_type_body_armor',
    'itp_type_foot_armor',
    'itp_type_hand_armor',
    'itp_type_horse',
  ]
  const mappedItems = troop.inventory.map(x => {
    const type = x.type
    const find = typeMap.find(y => y.type === type)
    const isGuaranteed = find ? find.flag === null || troop.lowLevelFlags.has(find.flag) : false
    return {
      id: x.id,
      name: x.name,
      type,
      isGuaranteed,
      image: mapImage(type),
    }

    function mapImage(type) {
      if (type === 'itp_type_one_handed_wpn')
        return 'images/onehanded.png'
      else if (type === 'itp_type_two_handed_wpn')
        return 'images/twohanded.png'
      else if (type === 'itp_type_polearm')
        return 'images/polearm.png'
      else if (type === 'itp_type_bow')
        return 'images/bow.png'
      else if (type === 'itp_type_crossbow')
        return 'images/crossbow.png'
      else if (type === 'itp_type_pistol' || type === 'itp_type_musket')
        return 'images/firearm.png'
      else if (type === 'itp_type_thrown')
        return 'images/thrown.png'
      else if (type === 'itp_type_arrows' || type === 'itp_type_bolts' || type === 'itp_type_bullets')
        return 'images/arrow.png'
      else if (type === 'itp_type_shield')
        return 'images/shield.png'
      else if (type === 'itp_type_head_armor')
        return 'images/helmet.svg'
      else if (type === 'itp_type_body_armor')
        return 'images/armor.svg'
      else if (type === 'itp_type_foot_armor')
        return 'images/boot.svg'
      else if (type === 'itp_type_hand_armor')
        return 'images/glove.svg'
      else if (type === 'itp_type_horse')
        return 'images/horse.png'
    }
  })
  return typeOrdering.map(x => mappedItems.filter(y => y.type === x)).flatMap(x => x)
}
