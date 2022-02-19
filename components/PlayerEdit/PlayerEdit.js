import { createBackground } from '../../modules/playerSetup.js'
import { troops } from '../../modules/warbandHighLevelData.js'
import { createCharacter } from '../../modules/character.js'
const { ref, watch } = Vue

export default {
  setup() {
    const editMode = ref(false)
    const useNativeBackground = ref(true)
    watch(useNativeBackground, () => {
      if (useNativeBackground.value)
        background.computeBackground()
    })
    const background = createBackground()
    const character = ref()

    function goToEditMode(){
      const playerTemplate = troops.value[0]
      character.value = createCharacter({
        ...playerTemplate,
        level: 1,
        attributes: {
          strength: background.strength.value,
          agility: background.agility.value,
          intelligence: background.intelligence.value,
          charisma: background.charisma.value,
        },
        skills: {
          ironflesh: background.ironflesh.value,
          powerStrike: background.powerStrike.value,
          powerThrow: background.powerThrow.value,
          powerDraw: background.powerDraw.value,
          weaponMaster: background.weaponMaster.value,
          shield: background.shield.value,
          athletics: background.athletics.value,
          riding: background.riding.value,
          horseArchery: background.horseArchery.value,
          looting: background.looting.value,
          trainer: background.trainer.value,
          tracking: background.tracking.value,
          tactics: background.tactics.value,
          pathfinding: background.pathfinding.value,
          spotting: background.spotting.value,
          inventoryManagement: background.inventoryManagement.value,
          woundTreatment: background.woundTreatment.value,
          surgery: background.surgery.value,
          firstAid: background.firstAid.value,
          engineer: background.engineer.value,
          persuasion: background.persuasion.value,
          prisonerManagement: background.prisonerManagement.value,
          leadership: background.leadership.value,
          trade: background.trade.value,
        },
      }, background.initialAttributePoints.value, background.initialSkillPoints.value)
      editMode.value = true
    }
    
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
      editMode,
      useNativeBackground,
      ...background,
      character,
      goToEditMode,
      changeAttributeValue,
      changeSkillValue,
    }
  },
}
