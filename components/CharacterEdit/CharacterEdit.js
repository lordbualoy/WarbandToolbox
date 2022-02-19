import { troops } from '../../modules/warbandHighLevelData.js'
import { createCharacter } from '../../modules/character.js'
const { ref, computed, watch } = Vue

export default {
  props: {
    troopID: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const id = computed(() => props.troopID)
    const index = computed(() => troops.value.findIndex(x => x.id === id.value))
    const character = ref()
    watch(id, () => character.value = createCharacter(troops.value[index.value]), { immediate: true })

    function changeAttributeValue(attribute, value) {
      const characterValue = character.value
      if (value >= 0 || characterValue[attribute] + value > 0)
        characterValue[attribute]+=value
    }

    function changeSkillValue(skill, value) {
      const skillValue = character.value.skills.find(x => x.name === skill)
      if (skillValue.rank + value >= 0 && skillValue.rank + value <= 10)
        skillValue.rank+=value
    }
    
    return {
      character,
      changeAttributeValue,
      changeSkillValue,
    }
  },
}
