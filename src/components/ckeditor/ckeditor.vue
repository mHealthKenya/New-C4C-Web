<template>
  <div id="app-editor">
    <ckeditor
      :editor="editor"
      v-model="editorData"
      :config="editorConfig"
      tag-name="textarea"/>
  </div>
</template>

<script>

import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  data () {
    return {
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
      }
    }
  },
  methods: {

  }

}
</script>
<style >
.ck-editor__editable_inline {
    min-height: 250px !important;
}

</style>
