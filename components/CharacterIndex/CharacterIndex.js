import { computePosition, flip } from 'floating-ui';
import { troops } from '../../modules/warbandHighLevelData.js'
const { ref, reactive, computed } = Vue
const { useRouter } = VueRouter

export default {
  setup() {
    const router = useRouter()

    const columns = [
      { key: 'rowNo', text: 'No.' },
      { key: 'i', text: 'i' },
      { key: 'id', text: 'ID' },
      { key: 'name', text: 'Name' },
      { key: 'type', text: 'Type' },
      { key: 'factionID', text: 'Faction' },
      { key: 'level', text: 'Level' },
      { key: 'attributes', text: 'Attributes' },
      { key: 'skills', text: 'Skills' },
      { key: 'weaponProficiencies', text: 'Proficiencies' },
      { key: 'otherFlags', text: 'Flags' },
      { key: 'inventory', text: 'Inventory' },
      { key: 'upgrades', text: 'Upgrades' },
      { key: 'tools', text: 'Tools' },
    ]
    const sortColumns = [
      'i',
      'level',

      'strength',
      'agility',
      'intelligence',
      'charisma',

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

      'oneHanded',
      'twoHanded',
      'polearms',
      'archery',
      'crossbow',
      'throwing',
      'firearms',
    ].map(x => ({ value: x, text: x }))
    const sortColumn = ref(sortColumns[0].value)
    
    const compareOperatorLookup = new Map([
      ['==', (a, b) => a === b],
      ['!=', (a, b) => a !== b],
      ['>', (a, b) => a > b],
      ['>=', (a, b) => a >= b],
      ['<', (a, b) => a < b],
      ['<=', (a, b) => a <= b],
    ])

    const filters = createFilters([
      {
        key: 'name',
        getter: x => x.name,
        value: '',
        predicate: (filter, getter, x) => {
          const value = getter(x)
          if (filter.length > 0) {
            return value.toLowerCase().includes(filter.toLowerCase())
          }
          return true
        },
      },
      {
        key: 'sex',
        getter: x => x.sex,
        value: 'male',
        predicate: (filter, getter, x) => filter === getter(x),
      },
      { key: 'type', getter: x => x.type, value: [], predicate: booleanLooseMatchPredicate, },
      { key: 'level', getter: x => x.level, value: createNumericFilter(), predicate: numericComparisonPredicate, },

      { key: 'strength', getter: x => x.attributes.strength, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'agility', getter: x => x.attributes.agility, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'intelligence', getter: x => x.attributes.intelligence, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'charisma', getter: x => x.attributes.charisma, value: createNumericFilter(), predicate: numericComparisonPredicate, },

      { key: 'ironflesh', getter: x => x.skills.ironflesh, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'powerStrike', getter: x => x.skills.powerStrike, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'powerThrow', getter: x => x.skills.powerThrow, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'powerDraw', getter: x => x.skills.powerDraw, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'weaponMaster', getter: x => x.skills.weaponMaster, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'shield', getter: x => x.skills.shield, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'athletics', getter: x => x.skills.athletics, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'riding', getter: x => x.skills.riding, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'horseArchery', getter: x => x.skills.horseArchery, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'looting', getter: x => x.skills.looting, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'trainer', getter: x => x.skills.trainer, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'tracking', getter: x => x.skills.tracking, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'tactics', getter: x => x.skills.tactics, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'pathfinding', getter: x => x.skills.pathfinding, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'spotting', getter: x => x.skills.spotting, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'inventoryManagement', getter: x => x.skills.inventoryManagement, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'woundTreatment', getter: x => x.skills.woundTreatment, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'surgery', getter: x => x.skills.surgery, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'firstAid', getter: x => x.skills.firstAid, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'engineer', getter: x => x.skills.engineer, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'persuasion', getter: x => x.skills.persuasion, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'prisonerManagement', getter: x => x.skills.prisonerManagement, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'leadership', getter: x => x.skills.leadership, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'trade', getter: x => x.skills.trade, value: createNumericFilter(), predicate: numericComparisonPredicate, },

      { key: 'oneHanded', getter: x => x.weaponProficiencies.oneHanded, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'twoHanded', getter: x => x.weaponProficiencies.twoHanded, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'polearms', getter: x => x.weaponProficiencies.polearms, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'archery', getter: x => x.weaponProficiencies.archery, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'crossbow', getter: x => x.weaponProficiencies.crossbow, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'throwing', getter: x => x.weaponProficiencies.throwing, value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'firearms', getter: x => x.weaponProficiencies.firearms, value: createNumericFilter(), predicate: numericComparisonPredicate, },

      { key: 'otherFlags', getter: x => x.otherFlags, value: [], predicate: booleanArrayStrictMatchPredicate, },
      {
        key: 'upgrades', 
        getter: x => x.upgrades,
        value: null,
        predicate: (filter, getter, x) => {
          if (filter === undefined || filter === null)
            return true
          
          const value = getter(x)
          return filter === value.length > 0
        },
      },
    ])
    function createFilters(args){
      const filters = {}
      for (const { key, getter, value, predicate } of args) {
        filters[key] = { key, getter, active: false, value, predicate }
      }
      return reactive(filters)
    }
    function createNumericFilter() {
      return {
        conditionType: '==',
        singularValue: undefined,
        lowerBoundConditionType: '>=',
        lowerBoundValue: undefined,
        upperBoundConditionType: '<=',
        upperBoundValue: undefined,
      }
    }
    function numericComparisonPredicate(filter, getter, x) {
      const value = getter(x)
      if (filter.conditionType !== '#') {
        return compareOperatorLookup.get(filter.conditionType)(value, filter.singularValue)
      }
      else if (filter.conditionType === '#') {
        return compareOperatorLookup.get(filter.lowerBoundConditionType)(value, filter.lowerBoundValue) && compareOperatorLookup.get(filter.upperBoundConditionType)(value, filter.upperBoundValue)
      }
      return true
    }
    function booleanArrayStrictMatchPredicate(filter, getter, x) {
      if (filter.length === 0)
        return true

      const set = new Set(getter(x))
      for (const {key, value} of filter) {
        const hasKey = set.has(key)
        if ((value && !hasKey) || (!value && hasKey))
          return false
      }
      return true
    }
    function booleanLooseMatchPredicate(filter, getter, x) {
      if (filter.length === 0)
        return false

      const value = getter(x)
      return filter.includes(value)
    }
    const sexOptions = [
      { value: 'male', text: 'Male' },
      { value: 'female', text: 'Female' },
    ]
    const typeOptions = [
      { value: 'infantry', text: 'Infantry' },
      { value: 'archer', text: 'Archer' },
      { value: 'cavalry', text: 'Cavalry' },
    ]
    function onTypeChecked(type, value) {
      const index = type.findIndex(x => x === value)
      if (index >= 0)
        type.splice(index, 1)
      else
        type.push(value)
    }
    const flagFilterModalState = ref(false)
    const flagOptions = [
      'undead',
      'hero',
      'inactive',
      'unkillable',
      'alwaysFallDead',
      'noCaptureAlive',
      'mounted',
      'isMerchant',
      'randomizeFace',
      'guaranteeBoots',
      'guaranteeArmor',
      'guaranteeHelmet',
      'guaranteeGloves',
      'guaranteeHorse',
      'guaranteeShield',
      'guaranteeRanged',
      'guaranteePolearms',
      'unmoveableInPartyWindow',
    ]

    const matchingTroops = computed(() => {
      let current = troops.value
      for (const filter of enumerateFilters()){
        current = enumerateMatchedItems(current, filter.predicate.bind(undefined, filter.value, filter.getter))
      }
      return [...current]
    })
    function* enumerateMatchedItems(items, predicate) {
      for (const item of items) {
        if (predicate(item)) {
          yield item
        }
      }
    }
    function* enumerateFilters() {
      for (const key in filters) {
        if (filters[key].active) {
          yield filters[key]
        }
      }
    }
    function numericCompare(a, b){
      return a - b
    }
    const sortDirection = ref('1')
    const sortDirectionOptions = [
      { value: '1', text: 'Ascending' },
      { value: '-1', text: 'Descending' },
    ]
    const sortingHandler = {
      i: (a, b) => numericCompare(a.i, b.i),
      level: (a, b) => numericCompare(a.level, b.level),

      strength: (a, b) => numericCompare(a.attributes.strength, b.attributes.strength),
      agility: (a, b) => numericCompare(a.attributes.agility, b.attributes.agility),
      intelligence: (a, b) => numericCompare(a.attributes.intelligence, b.attributes.intelligence),
      charisma: (a, b) => numericCompare(a.attributes.charisma, b.attributes.charisma),

      ironflesh: (a, b) => numericCompare(a.skills.ironflesh, b.skills.ironflesh),
      powerStrike: (a, b) => numericCompare(a.skills.powerStrike, b.skills.powerStrike),
      powerThrow: (a, b) => numericCompare(a.skills.powerThrow, b.skills.powerThrow),
      powerDraw: (a, b) => numericCompare(a.skills.powerDraw, b.skills.powerDraw),
      weaponMaster: (a, b) => numericCompare(a.skills.weaponMaster, b.skills.weaponMaster),
      shield: (a, b) => numericCompare(a.skills.shield, b.skills.shield),
      athletics: (a, b) => numericCompare(a.skills.athletics, b.skills.athletics),
      riding: (a, b) => numericCompare(a.skills.riding, b.skills.riding),
      horseArchery: (a, b) => numericCompare(a.skills.horseArchery, b.skills.horseArchery),
      looting: (a, b) => numericCompare(a.skills.looting, b.skills.looting),
      trainer: (a, b) => numericCompare(a.skills.trainer, b.skills.trainer),
      tracking: (a, b) => numericCompare(a.skills.tracking, b.skills.tracking),
      tactics: (a, b) => numericCompare(a.skills.tactics, b.skills.tactics),
      pathfinding: (a, b) => numericCompare(a.skills.pathfinding, b.skills.pathfinding),
      spotting: (a, b) => numericCompare(a.skills.spotting, b.skills.spotting),
      inventoryManagement: (a, b) => numericCompare(a.skills.inventoryManagement, b.skills.inventoryManagement),
      woundTreatment: (a, b) => numericCompare(a.skills.woundTreatment, b.skills.woundTreatment),
      surgery: (a, b) => numericCompare(a.skills.surgery, b.skills.surgery),
      firstAid: (a, b) => numericCompare(a.skills.firstAid, b.skills.firstAid),
      engineer: (a, b) => numericCompare(a.skills.engineer, b.skills.engineer),
      persuasion: (a, b) => numericCompare(a.skills.persuasion, b.skills.persuasion),
      prisonerManagement: (a, b) => numericCompare(a.skills.prisonerManagement, b.skills.prisonerManagement),
      leadership: (a, b) => numericCompare(a.skills.leadership, b.skills.leadership),
      trade: (a, b) => numericCompare(a.skills.trade, b.skills.trade),

      oneHanded: (a, b) => numericCompare(a.weaponProficiencies.oneHanded, b.weaponProficiencies.oneHanded),
      twoHanded: (a, b) => numericCompare(a.weaponProficiencies.twoHanded, b.weaponProficiencies.twoHanded),
      polearms: (a, b) => numericCompare(a.weaponProficiencies.polearms, b.weaponProficiencies.polearms),
      archery: (a, b) => numericCompare(a.weaponProficiencies.archery, b.weaponProficiencies.archery),
      crossbow: (a, b) => numericCompare(a.weaponProficiencies.crossbow, b.weaponProficiencies.crossbow),
      throwing: (a, b) => numericCompare(a.weaponProficiencies.throwing, b.weaponProficiencies.throwing),
      firearms: (a, b) => numericCompare(a.weaponProficiencies.firearms, b.weaponProficiencies.firearms),
    }
    const sortedTroops = computed(() => {
      return [...matchingTroops.value].sort((a, b) => {
        const column = sortColumn.value
        return sortingHandler[column](a, b) * (+sortDirection.value)
      })
    })
    const rows = computed(() => {
      return sortedTroops.value.map(x => {
        const { attributes, skills, weaponProficiencies, ...others } = x
        return {
          ...others,
          attributes: Object.keys(attributes).map(x => ({ text: x, value: attributes[x] })),
          skills: Object.keys(skills).map(x => ({ text: x, value: skills[x] })),
          weaponProficiencies: Object.keys(weaponProficiencies).map(x => ({ text: x, value: weaponProficiencies[x] })),
        }
      })
    })
    const itemTooltip = ref({
      id: undefined,
      hovering: false,
      x: 0,
      y: 0,
    })
    const itemTooltipRef = ref()
    function onTooltipShow(index, index2){
      itemTooltip.value.id = rows.value[index].inventory[index2].id
      itemTooltip.value.hovering = true
      const itemElement = document.querySelector(`#character-index .inventory .item[index="${index}"][index2="${index2}"]`)
      computePosition(itemElement, itemTooltipRef.value.$el, {
        placement: 'bottom',
        middleware: [flip()],
      }).then(({x, y}) => {
        itemTooltip.value.x = x
        itemTooltip.value.y = y
      })
    }
    function onTooltipHide(index, index2){
      itemTooltip.value.hovering = false
    }

    function selectTroop(index) {
        router.push({
          name: 'Character',
          params: { troopID: matchingTroops.value[index].id },
        })
    }
    function selectTroopEdit(index) {
        router.push({
          name: 'CharacterEdit',
          params: { troopID: matchingTroops.value[index].id },
        })
    }
    return {
        columns,
        sortDirection,
        sortDirectionOptions,
        sortColumn,
        sortColumns,
        filters,
        sexOptions,
        typeOptions,
        onTypeChecked,
        flagFilterModalState,
        flagOptions,
        rows,
        itemTooltip,
        itemTooltipRef,
        onTooltipShow,
        onTooltipHide,
        selectTroop,
        selectTroopEdit,
    }
  },
}
