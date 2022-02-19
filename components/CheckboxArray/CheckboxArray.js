export default {
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Array,
      required: true,
    },
    threeState: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    function isChecked(value) {
      return props.modelValue.find(x => x.key === value)?.value
    }
    function onChecked(key, value) {
      const newValue = props.modelValue.slice()
      const index = props.modelValue.findIndex(x => x.key === key)
      if (value === null || value === undefined)
        newValue.splice(index, 1)
      else if (index >= 0)
        newValue[index].value = value
      else
        newValue.push({ key, value })
      emit('update:modelValue', newValue)
    }

    return {
      isChecked,
      onChecked,
    }
  },
}
