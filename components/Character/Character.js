import { computePosition, flip } from 'floating-ui';
const { ref, computed } = Vue

export default {
  props: {
    character: {
      type: Object,
      required: true,
    },
    editMode: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    const id = computed(() => props.character.id)
    const name = computed(() => props.character.name)
    const pluralizedName = computed(() => props.character.pluralizedName)
    const type = computed(() => props.character.type)
    const sex = computed(() => props.character.sex)
    const faction = computed(() => props.character.faction)
    const facekey1 = computed(() => props.character.facekey1)
    const facekey2 = computed(() => props.character.facekey2)
    const otherFlags = computed(() => props.character.otherFlags)
    const level = computed(() => props.character.level)
    const expRequired = computed(() => props.character.expRequired)
    const hp = computed(() => props.character.hp)
    const strength = computed(() => props.character.strength)
    const agility = computed(() => props.character.agility)
    const intelligence = computed(() => props.character.intelligence)
    const charisma = computed(() => props.character.charisma)
    const remainingAttributePoints = computed(() => props.character.remainingAttributePoints)
    const skills = computed(() => props.character.skills)
    const remainingSkillPoints = computed(() => props.character.remainingSkillPoints)
    const weaponProficiencies = computed(() => props.character.weaponProficiencies)
    const inventory = computed(() => props.character.inventory)
    const upgrades = computed(() => props.character.upgrades)
    const itemTooltip = ref({
      id: undefined,
      hovering: false,
      x: 0,
      y: 0,
    })
    const itemTooltipRef = ref()
    function onTooltipShow(index){
      itemTooltip.value.id = props.character.inventory[index].id
      itemTooltip.value.hovering = true
      const itemElement = document.querySelectorAll('#character .inventory .item')[index]
      computePosition(itemElement, itemTooltipRef.value.$el, {
        placement: 'bottom',
        middleware: [flip()],
      }).then(({x, y}) => {
        itemTooltip.value.x = x
        itemTooltip.value.y = y
      })
    }
    function onTooltipHide(index){
      itemTooltip.value.hovering = false
    }
    return {
      id,
      name,
      pluralizedName,
      type,
      sex,
      faction,
      facekey1,
      facekey2,
      otherFlags,
      level,
      expRequired,
      hp,
      strength,
      agility,
      intelligence,
      charisma,
      remainingAttributePoints,
      skills,
      remainingSkillPoints,
      weaponProficiencies,
      inventory,
      upgrades,
      itemTooltip,
      itemTooltipRef,
      onTooltipShow,
      onTooltipHide,
    }
  },
}
