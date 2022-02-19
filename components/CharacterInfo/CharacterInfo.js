import { troops } from '../../modules/warbandHighLevelData.js'
import { createCharacter } from '../../modules/character.js'
const { ref, computed, watch } = Vue
const { useRouter } = VueRouter

export default {
  props: {
    troopID: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()

    const id = computed(() => props.troopID)
    const index = computed(() => troops.value.findIndex(x => x.id === id.value))
    const prevIndex = computed(() => index.value > 0 ? index.value - 1 : null)
    const nextIndex = computed(() => {
      const nextIndex = index.value + 1
      return troops.value.length > nextIndex ? nextIndex : null
    })
    
    const character = ref()
    watch(id, () => character.value = createCharacter(troops.value[index.value]), { immediate: true })

    function goToPrev() {
      if (prevIndex.value !== null)
        router.push({ name: 'Character', params: { troopID: troops.value[prevIndex.value].id } })
    }

    function goToNext() {
      if (nextIndex.value !== null)
        router.push({ name: 'Character', params: { troopID: troops.value[nextIndex.value].id } })
    }
    
    return {
      character,
      goToPrev,
      goToNext,
    }
  },
}
