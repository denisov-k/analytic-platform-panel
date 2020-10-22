<template>
  <vk-card class="status-card">
    <h4>Заметки</h4>
    <textarea class="note" placeholder="Keep your things here..." v-model="noteContent"></textarea>
  </vk-card>
</template>

<script>

export default {
  name: "Notes",
  data() {
    return {
      noteContent: localStorage.userNote || ''
    }
  },
  created() {
    window.onbeforeunload = this.saveNoteContent;
  },
  beforeDestroy() {
    this.saveNoteContent()
  },
  methods: {
    saveNoteContent: function (event) {
      localStorage.userNote = this.noteContent;
    }
  }
}
</script>

<style scoped>
  .note {
    width: 100%;
    min-height: 100px;
    height: 185px;
    border: 1px solid #dfe2e8;
    font-size: 14px;
    resize: vertical;
  }

  .note::placeholder {
    color: #bfbfbf;
  }
</style>