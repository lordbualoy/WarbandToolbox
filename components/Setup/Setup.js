import { setupNewWarbandData } from '../../modules/warbandDataCoordinator.js'
const { ref, computed } = Vue
const { useRouter } = VueRouter

export default {
  setup() {
    const router = useRouter()

    const troops = ref(undefined)
    const items = ref(undefined)
    const canCommit = computed(() => troops.value && items.value)
    function onCommit() {
      setupNewWarbandData({ troopsFile: troops.value, itemsFile: items.value })
      router.push({
        name: 'Main',
      })
    }
    return {
      troops,
      items,
      canCommit,
      onCommit,
    }
  },
}
