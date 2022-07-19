<template>
  <div class="uk-margin-small">
    <label>
      <span class="uk-checkbox-switch uk-margin-small-right">
          <input type="checkbox" :checked="value" @change="$emit('update:value', $event.target.checked)"><span></span>
      </span>
      <span class="uk-form-label">{{ label }}</span>
    </label>
  </div>
</template>

<script>
export default {
  name: "MethodOption",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>