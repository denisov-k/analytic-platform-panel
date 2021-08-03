<template>
  <div class="uk-margin-small">
    <label>
      <span class="uk-checkbox-switch uk-margin-small-right">
          <input type="checkbox" :value="value"><span></span>
      </span>
      <span class="uk-form-label">Схлопывать нули</span>
    </label>
  </div>
</template>

<script>
export default {
  name: "MethodOption",
  props: {
    value: Boolean
  }
}
</script>

<style scoped>

</style>