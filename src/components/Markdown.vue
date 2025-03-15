<template>
  <div class="border-1" v-html="parsedMarkdown"></div>
</template>

<script setup>
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';


// 定义 props 并设定默认值
const props = defineProps({
  markdownContent: {
    type: String,
    default: '# 默认标题\n\n这是默认的 Markdown 内容。'
  }
});

const md = new MarkdownIt(); // 初始化 markdown-it 实例

// 计算属性，将 Markdown 内容解析为 HTML
const parsedMarkdown = computed(() => {
  return md.render(props.markdownContent);
});

</script>

<style>
.border-1 {
  border: 1px solid #eaeaea;
  padding: 10px 0;
}
</style>