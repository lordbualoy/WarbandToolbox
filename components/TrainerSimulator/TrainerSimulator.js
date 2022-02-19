import { troops as troopSource } from '../../modules/warbandHighLevelData.js'
const { ref, reactive, computed, watch } = Vue

export default {
  setup() {
    const trainerExp = [
      0,
      4,
      10,
      16,
      23,
      30,
      38,
      46,
      55,
      65,
      80,
    ]

    const columnsTrainer = [
      { key: 'characterLevel', text: 'Character Level' },
      { key: 'trainerLevel', text: 'Trainer Level' },
      { key: 'expAmount', text: 'Exp Amount' },
      { key: 'tools', text: 'Tools' },
    ]

    const trainers = ref([])

    function addTrainer() {
      const trainer = reactive({
        characterLevel: 1,
        trainerLevel: 0,
        expAmount: 0,
        unwatches: [],
      })
      trainer.unwatches.push(watch(() => trainer.trainerLevel, () => {
        trainer.expAmount = trainerExp[trainer.trainerLevel]
        recalculateIncomingExpOfTroops()
      }))
      trainer.unwatches.push(watch(() => trainer.characterLevel, () => {
        recalculateIncomingExpOfTroops()
      }))
      trainers.value.push(trainer)
    }
    function deleteTrainer(index) {
      trainers.value[index].unwatch()
      trainers.value.splice(index, 1)
    }

    const columnsTroop = [
      { key: 'select', text: 'Select Troop' },
      { key: 'id', text: 'ID' },
      { key: 'name', text: 'Name' },
      { key: 'level', text: 'Level' },
      { key: 'expRequired', text: 'Exp Required' },
      { key: 'incomingExp', text: 'Incoming Exp' },
      { key: 'count', text: 'Count' },
      { key: 'promotableCount', text: 'Promotable Count' },
      { key: 'stackAccumulatedExp', text: 'Stack Accumulated Exp' },
      { key: 'stackMaxExp', text: 'Stack Max Exp' },
      { key: 'tools', text: 'Tools' },
    ]

    const troopOptions = computed(() => troopSource.value.filter(x => !x.lowLevelFlags.has('hero')).map(x => ({ value: x.id, text: x.name })))
    const troops = ref([])

    function createTroopFromID(id) {
      const troop = troopSource.value.find(x => x.id === id)
      return createTroop(troop)
    }
    function createTroop(troop) {
      return {
        id: troop.id,
        name: troop.name,
        level: troop.level,
        expRequired: troop.expRequiredForLevelUp,
        count: 1,
        incomingExp: 0,
        promotableCount: 0,
        stackAccumulatedExp: 0,
        stackMaxExp: 0,
        upgrades: troop.upgrades,
        unwatches: [],
      }
    }
    function addTroop() {
      const troopsValue = troops.value
      const troopOptionsValue = troopOptions.value
      if (troopsValue.length === troopOptionsValue.length)
        return
      
      let id
      let i = 0
      do {
        id = troopOptionsValue[i++].value
      } while (troopsValue.find(x => x.id === id))
      addTroopWithID(id, troopsValue.length)
    }
    function addTroopWithID(id, index) {
      const troop = reactive(createTroopFromID(id))
      troop.unwatches.push(watch(
        () => troop.id
        , (newID) => {
          const index = troops.value.findIndex(x => x.id === newID)
          deleteTroop(index)
          if (troops.value.find(x => x.id === newID))
            return
          
          addTroopWithID(newID, index)
        }
      ))
      troop.unwatches.push(watch(
        () => troop.count
        , () => {
          troop.incomingExp = getIncomingExp(troop)
          troop.stackMaxExp = getStackMaxExp(troop)
          if (troop.stackAccumulatedExp > troop.stackMaxExp)
            troop.stackAccumulatedExp = troop.stackMaxExp
        }
        , { immediate: true }
      ))
      troops.value.splice(index, 0, troop)
    }
    function promoteTroop(id, index) {
      const troop = troops.value[index]
      troop.stackAccumulatedExp -= troop.expRequired
      troop.count--
      troop.promotableCount = getPromotableCount(troop)
      if (troop.count === 0)
        deleteTroop(index)
      
      const find = troops.value.find(x => x.id === id)
      if (find)
        find.count++
      else
        addTroopWithID(id, troops.value.length)
    }
    function deleteTroop(index) {
      for (const unwatch of troops.value[index].unwatches)
        unwatch()
      troops.value.splice(index, 1)
    }

    const aggregatedTrainers = computed(() => {
      const map = new Map()
      for (const trainer of trainers.value) {
        let newExpAmount = trainer.expAmount
        const existingExpAmount = map.get(trainer.characterLevel)
        if (existingExpAmount)
          newExpAmount += existingExpAmount
        map.set(trainer.characterLevel, newExpAmount)
      }
      const aggregatedTrainers = []
      for (const [key, value] of map) {
        aggregatedTrainers.push({ level: key, amount: value })
      }
      return aggregatedTrainers
    })
    const totalTrainedExp = computed(() => troops.value.reduce((acc, x) => acc + x.incomingExp, 0))
    const trainedCounter = ref(0)
    function trainTroops() {
      for (const troop of troops.value)
        trainTroop(troop)
      trainedCounter.value++
    }
    function trainTroop(troop) {
      troop.stackAccumulatedExp = Math.min(troop.stackAccumulatedExp + getIncomingExp(troop), getStackMaxExp(troop))
      troop.promotableCount = getPromotableCount(troop)
    }
    function recalculateIncomingExpOfTroops() {
      for (const troop of troops.value)
        troop.incomingExp = getIncomingExp(troop)
    }
    function getIncomingExp(troop) {
      if (troop.upgrades.length === 0)
        return 0
      
      let sum = 0
      for (const trainer of aggregatedTrainers.value) {
        if (trainer.level > troop.level)
          sum += trainer.amount
      }
      return sum * troop.count
    }
    function getStackMaxExp(troop) {
      return troop.upgrades.length === 0 ? 0 : troop.expRequired * troop.count
    }
    function getPromotableCount(troop) {
      return Math.trunc(troop.stackAccumulatedExp / troop.expRequired)
    }

    return {
      columnsTrainer,
      trainers,
      addTrainer,
      deleteTrainer,
      columnsTroop,
      troopOptions,
      troops,
      addTroop,
      promoteTroop,
      deleteTroop,
      totalTrainedExp,
      trainedCounter,
      trainTroops,
    }
  },
}
