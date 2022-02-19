export default {
  props: {
    modelValue: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    function onChanged($event) {
      emit('update:modelValue', $event.target.files[0])
    }
    return {
      onChanged,
    }
  },
}
