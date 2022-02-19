const { computed, toRefs } = Vue

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
    } = toRefs(props.value)

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
    
    return {
      conditionType,
      singularValue,
      lowerBoundConditionType,
      lowerBoundValue,
      upperBoundConditionType,
      upperBoundValue,

      conditions,
      lowerBoundConditions,
      upperBoundConditions,

      isSingularValueCondition,
    }
  },
}
