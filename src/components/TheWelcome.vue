<script setup>
import { ref, onMounted } from 'vue';
import { debounce } from 'lodash-es';
import Markdown from './Markdown.vue';

import hljs from 'highlight.js/lib/common';
// 引入 github 代码主题
import 'highlight.js/styles/github.css'

const arr = [
  {key: 'k1', value: 10},
  {key: 'k2', value: 4},
  {key: 'k3', value: 50},
  {key: 'k4', value: 15},
  {key: 'k5', value: 18}
]

const data = ref([]);
const value = ref();
const fetching = ref(false)
const text1 = '```javascript \n let maxObj = arr[0]; \n'+
' for (let i = 1; i < arr.length; i++) { \n'+
'   if (arr[i].value > maxObj.value) { \n'+
'     maxObj = arr[i]; \n'+
'   } \n'+
' }'

const text2 = '```javascript \n const maxValue = Math.max(...arr.map(item => item.value)); \n'+
' const maxObj = arr.find(item => item.value === maxValue);'


const text3 = '```javascript \n const sortedArr = [...arr].sort((a, b) => b.value - a.value); \n'+
' const maxObj = sortedArr[0];'

const text4 = '```javascript \n const maxObj = arr.reduce((prev, current) => \n'+
'   (prev.value > current.value) ? prev : current \n'+
' );'

onMounted(async () => {
  hljs.highlightAll()
  a()
})


const fetchData = debounce((value, callback) => {
  const result = []
  fetching.value = true
  fetch(`/githubApi/search/users?q=${value}`).then(res => res.json()).then(res => {
    (res?.items||[]).forEach(item => {
      result.push({
        value: item.login,
        label: item.login
      })
    });
    callback(result)
  })
  .catch(err => {
    console.error(err, 'err');
  })
  .finally(() => fetching.value = false)
},300)

const handleSearch = (val) => {
  fetchData(val, (d) => (data.value = d));
};

const handleChange = (val) => {
  value.value = val;
  fetchData(val, (d) => (data.value = d));
};



</script>

<template>
 <div>
  <h1>输入框功能</h1>

  <a-select
    v-model:value="value"
    show-search
    placeholder="input search text"
    style="width: 200px"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="fetching ? undefined : null"
    :options="data"
    @search="handleSearch"
    @change="handleChange"
  >
  <template #notFoundContent>
    <a-spin size="small" />
  </template>
  </a-select>


  <h1 class="mt-40">方法一——排序法</h1>
  <Markdown :markdown-content="text1"/>
  <h1 class="mt-40">方法二—Math.max结合find方法</h1>
  <Markdown :markdown-content="text2"/>
  <h1 class="mt-40">方法四—sort方法</h1>
  <Markdown :markdown-content="text3"/>
  <h1 class="mt-40">方法四—Array.reduce()方法</h1>
  <Markdown :markdown-content="text4"/>
 </div>
</template>

<style>
.mt-40 {
  margin-top: 40px;
}
</style>
