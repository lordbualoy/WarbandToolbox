const { computed } = Vue

export default {
  props: {
    modelValue: {
      type: String,
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
  setup(props, { emit }) {
    const value = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      },
    })

    return {
      value,
    }
  },
}
