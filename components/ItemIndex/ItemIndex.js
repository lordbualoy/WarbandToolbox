import { items, meleeWeaponTypes, rangedWeaponTypes, ammoTypes, shieldTypes, armorTypes, mountTypes } from '../../modules/warbandHighLevelData.js'
import { computePosition, flip } from 'floating-ui';
const { ref, reactive, computed, watch } = Vue

export default {
  setup() {
    const itemTypeOptions = computed(() => [
      'itp_type_one_handed_wpn',
      'itp_type_two_handed_wpn',
      'itp_type_polearm',
      'itp_type_bow',
      'itp_type_crossbow',
      'itp_type_thrown',
      'itp_type_arrows',
      'itp_type_bolts',
      'itp_type_shield',
      'itp_type_head_armor',
      'itp_type_body_armor',
      'itp_type_foot_armor',
      'itp_type_hand_armor',
      'itp_type_horse',
      'itp_type_pistol',
      'itp_type_musket',
      'itp_type_bullets',
      'itp_type_goods',
      'itp_type_animal',
      'itp_type_book',
    ].map(x => ({ value: x, text: x })))
    const itemType = ref(itemTypeOptions.value[0].value)
    const itemClass = computed(() => {
      if (meleeWeaponTypes.has(itemType.value))
        return 'melee'
      else if (rangedWeaponTypes.has(itemType.value))
        return 'ranged'
      else if (ammoTypes.has(itemType.value))
        return 'ammo'
      else if (shieldTypes.has(itemType.value))
        return 'shield'
      else if (armorTypes.has(itemType.value))
        return 'armor'
      else if (mountTypes.has(itemType.value))
        return 'mount'
      else
        return 'other'
    })
    const baseColumns = [
      { key: 'rowNo', text: 'No.' },
      { key: 'i', text: 'i' },
      { key: 'id', text: 'ID' },
      { key: 'name', text: 'Name' },
      { key: 'value', text: 'Value' },
      { key: 'weight', text: 'Weight' },
      { key: 'abundance', text: 'Abundance' },
      { key: 'modifiers', text: 'Modifiers' },
      { key: 'factions', text: 'Factions' },
      { key: 'flags', text: 'Flags' },
    ]
    const meleeWeaponColumns = [
      { key: 'difficulty', text: 'Prerequisite' },
      { key: 'speed', text: 'Speed' },
      { key: 'reach', text: 'Reach' },
      { key: 'damageSwing', text: 'Swing' },
      { key: 'damageThrust', text: 'Thrust' },
      { key: 'hasAlternateMode', text: 'Alternate Mode' },
    ]
    const ammoColumns = [
      { key: 'damageRanged', text: 'Damage' },
      { key: 'ammo', text: 'Ammo' },
    ]
    const rangedWeaponColumns = [
      { key: 'difficulty', text: 'Prerequisite' },
      { key: 'speed', text: 'Speed' },
      { key: 'missileSpeed', text: 'Missile Speed' },
      { key: 'accuracy', text: 'Accuracy' },
      ...ammoColumns,
      { key: 'hasAlternateMode', text: 'Alternate Mode' },
    ]
    const shieldColumns = [
      { key: 'hitPoints', text: 'Hit Points' },
      { key: 'shieldArmor', text: 'Resistance' },
      { key: 'shieldWidth', text: 'Width' },
      { key: 'shieldHeight', text: 'Height' },
      { key: 'speed', text: 'Speed' },
    ]
    const armorColumns = [
      { key: 'difficulty', text: 'Prerequisite' },
      { key: 'headArmor', text: 'Head Armor' },
      { key: 'bodyArmor', text: 'Body Armor' },
      { key: 'legArmor', text: 'Leg Armor' },
    ]
    const mountColumns = [
      { key: 'difficulty', text: 'Prerequisite' },
      { key: 'mountArmor', text: 'Armor' },
      { key: 'speed', text: 'Speed' },
      { key: 'maneuver', text: 'Maneuver' },
      { key: 'damageCharge', text: 'Charge' },
      { key: 'hitPoints', text: 'Hit Points' },
      { key: 'mountScale', text: 'Scale' },
    ]
    const itemTypeColumns = computed(() => {
      if (meleeWeaponTypes.has(itemType.value))
        return meleeWeaponColumns
      else if (rangedWeaponTypes.has(itemType.value))
        return rangedWeaponColumns
      else if (ammoTypes.has(itemType.value))
        return ammoColumns
      else if (shieldTypes.has(itemType.value))
        return shieldColumns
      else if (armorTypes.has(itemType.value))
        return armorColumns
      else if (mountTypes.has(itemType.value))
        return mountColumns
      else
        return []
    })
    const columns = computed(() => {
      return [...baseColumns, ...itemTypeColumns.value]
    })
    const baseSortColumns = [
      'i',
      'value',
      'weight',
      'abundance',
    ]
    const meleeWeaponSortColumns = [
      'difficulty',
      'speedRating',
      'weaponLength',
      'damageSwing',
      'damageThrust',
    ]
    const ammoSortColumns = [
      'damageRanged',
      'maxAmmo',
    ]
    const rangedWeaponSortColumns = [
      'difficulty',
      'speedRating',
      'missileSpeed',
      'accuracy',
      ...ammoSortColumns,
    ]
    const shieldSortColumns = [
      'hitPoints',
      'shieldArmor',
      'shieldWidth',
      'shieldHeight',
      'speedRating',
    ]
    const armorSortColumns = [
      'difficulty',
      'headArmor',
      'bodyArmor',
      'legArmor',
    ]
    const mountSortColumns = [
      'difficulty',
      'mountArmor',
      'speedRating',
      'maneuver',
      'damageCharge',
      'hitPoints',
      'mountScale',
    ]
    const itemTypeSortColumns = computed(() => {
      if (meleeWeaponTypes.has(itemType.value))
        return meleeWeaponSortColumns
      else if (rangedWeaponTypes.has(itemType.value))
        return rangedWeaponSortColumns
      else if (ammoTypes.has(itemType.value))
        return ammoSortColumns
      else if (shieldTypes.has(itemType.value))
        return shieldSortColumns
      else if (armorTypes.has(itemType.value))
        return armorSortColumns
      else if (mountTypes.has(itemType.value))
        return mountSortColumns
      else
        return []
    })
    const sortColumn = ref(baseSortColumns[0])
    watch(itemType, () => {
      for (const key in filters)
        filters[key].active = false
      sortColumn.value = baseSortColumns[0]
    })
    const sortColumns = computed(() => {
      return [...baseSortColumns, ...itemTypeSortColumns.value].map(x => ({ value: x, text: x }))
    })

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
        value: '',
        predicate: (filter, key, x) => {
          const value = x[key]
          if (filter.length > 0) {
            return value.toLowerCase().includes(filter.toLowerCase())
          }
          return true
        },
      },
      { key: 'value', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'weight', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'abundance', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'modifiers', value: [], predicate: booleanArrayStrictMatchPredicate, },
      { key: 'factions', value: [], predicate: booleanArrayStrictMatchPredicate, },
      {
        key: 'flags',
        value: [],
        predicate: (filter, key, x) => {
          const value = { value: [...x.weaponFlags, ...x.otherFlags] }
          return booleanArrayStrictMatchPredicate(filter, 'value', value)
        },
      },
      { key: 'capabilities', value: [], predicate: booleanArrayStrictMatchPredicate, },
      {
        key: 'difficulty',
        value: createNumericFilter(),
        predicate: (filter, key, x) => {
          const value = x[key] ?? { value: 0 }
          return numericComparisonPredicate(filter, 'value', value)
        },
      },
      { key: 'speedRating', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'weaponLength', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'damageSwing', value: createTypedDamageFilter(), predicate: typedDamageComparisonPredicate, },
      { key: 'damageThrust', value: createTypedDamageFilter(), predicate: typedDamageComparisonPredicate, },
      { key: 'damageRanged', value: createTypedDamageFilter(), predicate: typedDamageComparisonPredicate, },
      { key: 'damageCharge', value: createNumericFilter(), predicate: damageComparisonPredicate, },
      {
        key: 'alternateMode',
        value: null,
        predicate: (filter, key, x) => {
          if (filter === undefined || filter === null)
            return true
          
          const value = x[key]
          return filter === !!value
        },
      },
      { key: 'missileSpeed', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'accuracy', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'maxAmmo', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'hitPoints', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'shieldArmor', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'headArmor', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'bodyArmor', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'legArmor', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'mountArmor', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'shieldWidth', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'shieldHeight', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'maneuver', value: createNumericFilter(), predicate: numericComparisonPredicate, },
      { key: 'mountScale', value: createNumericFilter(), predicate: numericComparisonPredicate, },
    ])
    function createFilters(args){
      const filters = {}
      for (const { key, value, predicate } of args) {
        filters[key] = { key, active: false, value, predicate }
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
    function createTypedDamageFilter() {
      return {
        typeCondition: [],
        valueCondition: createNumericFilter(),
      }
    }
    function numericComparisonPredicate(filter, key, x) {
      const value = x[key]
      if (filter.conditionType !== '#') {
        return compareOperatorLookup.get(filter.conditionType)(value, filter.singularValue)
      }
      else if (filter.conditionType === '#') {
        return compareOperatorLookup.get(filter.lowerBoundConditionType)(value, filter.lowerBoundValue) && compareOperatorLookup.get(filter.upperBoundConditionType)(value, filter.upperBoundValue)
      }
      return true
    }
    function damageComparisonPredicate(filter, key, x) {
      const value = x[key] ?? { amount: 0 }
      return numericComparisonPredicate(filter, 'amount', value)
    }
    function typedDamageComparisonPredicate(filter, key, x) {
      const typeValue = x[key] ?? { type: undefined }
      return booleanLooseMatchPredicate(filter.typeCondition, 'type', typeValue) && damageComparisonPredicate(filter.valueCondition, key, x)
    }
    function booleanArrayStrictMatchPredicate(filter, key, x) {
      if (filter.length === 0)
        return true

      const set = new Set(x[key])
      for (const {key, value} of filter) {
        const hasKey = set.has(key)
        if ((value && !hasKey) || (!value && hasKey))
          return false
      }
      return true
    }
    function booleanLooseMatchPredicate(filter, key, x) {
      if (filter.length === 0)
        return false

      const value = x[key]
      return filter.includes(value)
    }
    const modifierFilterModalState = ref(false)
    const flagFilterModalState = ref(false)
    const capabilityFilterModalState = ref(false)
    const modifierOptions = [
      'imodbit_plain',
      'imodbit_cracked',
      'imodbit_rusty',
      'imodbit_bent',
      'imodbit_chipped',
      'imodbit_battered',
      'imodbit_poor',
      'imodbit_crude',
      'imodbit_old',
      'imodbit_cheap',
      'imodbit_fine',
      'imodbit_well_made',
      'imodbit_sharp',
      'imodbit_balanced',
      'imodbit_tempered',
      'imodbit_deadly',
      'imodbit_exquisite',
      'imodbit_masterwork',
      'imodbit_heavy',
      'imodbit_strong',
      'imodbit_powerful',
      'imodbit_tattered',
      'imodbit_ragged',
      'imodbit_rough',
      'imodbit_sturdy',
      'imodbit_thick',
      'imodbit_hardened',
      'imodbit_reinforced',
      'imodbit_superb',
      'imodbit_lordly',
      'imodbit_lame',
      'imodbit_swaybacked',
      'imodbit_stubborn',
      'imodbit_timid',
      'imodbit_meek',
      'imodbit_spirited',
      'imodbit_champion',
      'imodbit_fresh',
      'imodbit_day_old',
      'imodbit_two_day_old',
      'imodbit_smelling',
      'imodbit_rotten',
      'imodbit_large_bag',
    ]
    const flagOptions = [
      'itp_force_attach_left_hand',
      'itp_force_attach_right_hand',
      'itp_force_attach_left_forearm',
      'itp_attach_armature',
      'itp_unique',
      'itp_always_loot',
      'itp_no_parry',
      'itp_default_ammo',
      'itp_merchandise',
      'itp_wooden_attack',
      'itp_wooden_parry',
      'itp_food',
      'itp_cant_reload_on_horseback',
      'itp_two_handed',
      'itp_primary',
      'itp_secondary',
      'itp_covers_legs',
      'itp_doesnt_cover_hair',
      'itp_can_penetrate_shield',
      'itp_consumable',
      'itp_bonus_against_shield',
      'itp_penalty_with_shield',
      'itp_cant_use_on_horseback',
      'itp_civilian',
      'itp_next_item_as_melee',
      'itp_fit_to_head',
      'itp_offset_lance',
      'itp_covers_head',
      'itp_couchable',
      'itp_crush_through',
      'itp_remove_item_on_use',
      'itp_unbalanced',
      'itp_covers_beard',
      'itp_no_pick_up_from_ground',
      'itp_can_knock_down',
      'itp_covers_hair',
      'itp_force_show_body',
      'itp_force_show_left_hand',
      'itp_force_show_right_hand',
      'itp_covers_hair_partially',
      'itp_extra_penetration',
      'itp_has_bayonet',
      'itp_cant_reload_while_moving',
      'itp_ignore_gravity',
      'itp_ignore_friction',
      'itp_is_pike',
      'itp_offset_musket',
      'itp_no_blur',
      'itp_cant_reload_while_moving_mounted',
      'itp_has_upper_stab',
      'itp_disable_agent_sounds',
    ]
    const capabilityOptions = [
      'itcf_shoot_bow',
      'itcf_shoot_javelin',
      'itcf_shoot_crossbow',
  
      'itcf_throw_stone',
      'itcf_throw_knife',
      'itcf_throw_axe',
      'itcf_throw_javelin',
      'itcf_shoot_pistol',
      'itcf_shoot_musket',
      
      'itcf_thrust_onehanded',
      'itcf_overswing_onehanded',
      'itcf_slashright_onehanded',
      'itcf_slashleft_onehanded',

      'itcf_thrust_twohanded',
      'itcf_overswing_twohanded',
      'itcf_slashright_twohanded',
      'itcf_slashleft_twohanded',

      'itcf_thrust_polearm',
      'itcf_overswing_polearm',
      'itcf_slashright_polearm',
      'itcf_slashleft_polearm',

      'itcf_horseback_thrust_onehanded',
      'itcf_horseback_overswing_right_onehanded',
      'itcf_horseback_overswing_left_onehanded',
      'itcf_horseback_slashright_onehanded',
      'itcf_horseback_slashleft_onehanded',
      'itcf_thrust_onehanded_lance',
      'itcf_thrust_onehanded_lance_horseback',
      
      'itcf_carry_sword_left_hip',
      'itcf_carry_axe_left_hip',
      'itcf_carry_dagger_front_left',
      'itcf_carry_dagger_front_right',
      'itcf_carry_quiver_front_right',
      'itcf_carry_quiver_back_right',
      'itcf_carry_quiver_right_vertical',
      'itcf_carry_quiver_back',
      'itcf_carry_revolver_right',
      'itcf_carry_pistol_front_left',
      'itcf_carry_bowcase_left',
      'itcf_carry_mace_left_hip',

      'itcf_carry_axe_back',
      'itcf_carry_sword_back',
      'itcf_carry_kite_shield',
      'itcf_carry_round_shield',
      'itcf_carry_buckler_left',
      'itcf_carry_crossbow_back',
      'itcf_carry_bow_back',
      'itcf_carry_spear',
      'itcf_carry_board_shield',

      'itcf_carry_katana',
      'itcf_carry_wakizashi',

      'itcf_show_holster_when_drawn',

      'itcf_reload_pistol',
      'itcf_reload_musket',
      
      'itcf_parry_forward_onehanded',
      'itcf_parry_up_onehanded',
      'itcf_parry_right_onehanded',
      'itcf_parry_left_onehanded',

      'itcf_parry_forward_twohanded',
      'itcf_parry_up_twohanded',
      'itcf_parry_right_twohanded',
      'itcf_parry_left_twohanded',

      'itcf_parry_forward_polearm',
      'itcf_parry_up_polearm',
      'itcf_parry_right_polearm',
      'itcf_parry_left_polearm',

      'itcf_horseback_slash_polearm',
      'itcf_overswing_spear',
      'itcf_overswing_musket',
      'itcf_thrust_musket',

      'itcf_force_64_bits',
    ]

    const matchingItems = computed(() => {
      let current = items.value
      current = enumerateMatchedItems(current, x => {
        if (itemType.value) {
          return x.type === itemType.value
        }
        return true
      })
      for (const filter of enumerateFilters()){
        current = enumerateMatchedItems(current, filter.predicate.bind(undefined, filter.value, filter.key))
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
    function damageCompare(a, b){
      return numericCompare(a?.amount ?? 0, b?.amount ?? 0)
    }
    const sortDirection = ref('1')
    const sortDirectionOptions = [
      { value: '1', text: 'Ascending' },
      { value: '-1', text: 'Descending' },
    ]
    const sortingHandler = {
      i: numericCompare,
      value: numericCompare,
      weight: numericCompare,
      abundance: numericCompare,
      difficulty: (a, b) => numericCompare(a?.value ?? 0, b?.value ?? 0),
      speedRating: numericCompare,
      weaponLength: numericCompare,
      damageSwing: damageCompare,
      damageThrust: damageCompare,
      damageRanged: damageCompare,
      damageCharge: damageCompare,
      maxAmmo: numericCompare,
      missileSpeed: numericCompare,
      accuracy: numericCompare,
      hitPoints: numericCompare,
      shieldArmor: numericCompare,
      shieldWidth: numericCompare,
      shieldHeight: numericCompare,
      headArmor: numericCompare,
      bodyArmor: numericCompare,
      legArmor: numericCompare,
      mountArmor: numericCompare,
      maneuver: numericCompare,
      mountScale: numericCompare,
    }
    const sortedItems = computed(() => {
      return [...matchingItems.value].sort((a, b) => {
        const column = sortColumn.value
        return sortingHandler[column](a[column], b[column]) * (+sortDirection.value)
      })
    })
    const rows = computed(() => {
      return sortedItems.value.map(x => {
        const { weaponFlags, otherFlags, difficulty, damageSwing, damageThrust, damageRanged, damageCharge, ...others } = x
        return {
          ...others,
          flags: [...weaponFlags, ...otherFlags],
          difficulty: difficulty ? `${difficulty.value} ${difficulty.statsType}` : '-',
          damageSwing: damageSwing ? `${damageSwing.amount}${damageSwing.type}` : '-',
          damageThrust: damageThrust ? `${damageThrust.amount}${damageThrust.type}` : '-',
          damageRanged: damageRanged ? `${damageRanged.amount}${damageRanged.type}` : '-',
          damageCharge: damageCharge ? damageCharge.amount : '-',
        }
      })
    })

    const tooltip = ref({
      id: undefined,
      hovering: false,
      x: 0,
      y: 0,
    })
    const tooltipRef = ref()
    function onTooltipShow(index){
      tooltip.value.id = sortedItems.value[index].id
      tooltip.value.hovering = true
      const itemElement = document.querySelectorAll('#item-index table .item-id')[index]
      computePosition(itemElement, tooltipRef.value.$el, {
        placement: 'right',
        middleware: [flip()],
      }).then(({x, y}) => {
        tooltip.value.x = x
        tooltip.value.y = y
      })
    }
    function onTooltipHide(index){
      tooltip.value.hovering = false
    }
    return {
      itemTypeOptions,
      itemType,
      itemClass,
      columns,
      sortDirection,
      sortDirectionOptions,
      sortColumn,
      sortColumns,
      filters,
      modifierFilterModalState,
      flagFilterModalState,
      capabilityFilterModalState,
      modifierOptions,
      flagOptions,
      capabilityOptions,
      rows,
      tooltip,
      tooltipRef,
      onTooltipShow,
      onTooltipHide,
    }
  },
}
