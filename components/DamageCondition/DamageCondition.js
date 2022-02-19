const { computed, toRef, toRefs } = Vue

export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const {
      conditionType,
      singularValue,
      lowerBoundConditionType,
      lowerBoundValue,
      upperBoundConditionType,
      upperBoundValue,
    } = toRefs(props.value.valueCondition)
    const typeCondition = toRef(props.value, 'typeCondition')

    const damageOptions = [
      'c',
      'p',
      'b',
    ]

    const lowerBoundConditions = [
      { value: '>', text: '>' },
      { value: '>=', text: '>=' },
    ]
    const upperBoundConditions = [
      { value: '<', text: '<' },
      { value: '<=', text: '<=' },
    ]
    const conditions = [
      { value: '==', text: '==' },
      { value: '!=', text: '!=' },
      ...lowerBoundConditions,
      ...upperBoundConditions,
      { value: '#', text: 'Range' },
    ]

    const isSingularValueCondition = computed(() => conditionType.value !== '#')
    
    function onChecked(value) {
      const index = typeCondition.value.findIndex(x => x === value)
      if (index >= 0)
        typeCondition.value.splice(index, 1)
      else
        typeCondition.value.push(value)
    }

    return {
      typeCondition,
      conditionType,
      singularValue,
      lowerBoundConditionType,
      lowerBoundValue,
      upperBoundConditionType,
      upperBoundValue,

      damageOptions,
      conditions,
      lowerBoundConditions,
      upperBoundConditions,

      isSingularValueCondition,

      onChecked,
    }
  },
}
