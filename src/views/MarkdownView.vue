<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div v-html="innerHtml" class='subheading'></div>
    </v-flex>
  </v-layout>
</template>

<script>
import marked from 'marked';

export default {
  name: 'MarkdownView',
  props: ['value', 'onPreHtml', 'onPostHtml'],
  data() {
    return {
      tempContent: '',
      innerHtml: '',
    };
  },
  mounted() {
    this.setData();
  },
  watch: {
    value() {
      this.setData();
    },
  },
  methods: {
    setData() {
      this.tempContent = this.value ? this.value : '';
      this.updatePreview();
    },
    async updatePreview() {
      this.innerHtml = 'Loading...';
      let tempContent = this.tempContent;

      if (this.onPreHtml) {
        tempContent = await this.onPreHtml(tempContent);
      }
      tempContent = marked(tempContent);
      if (this.onPostHtml) {
        tempContent = await this.onPostHtml(tempContent);
      }

      this.innerHtml = tempContent;
    },
  },
};
</script>
