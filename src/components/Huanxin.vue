<template>
  <div class="!mt-2.5 flex justify-between">
    <a-button class="mt-2.5" type="primary" @click="handleAdd">新建</a-button>
    <a-input
      v-model:value="keyword"
      class="!w-[360px]"
      placeholder="请输入任务名称"
      enter-button
      @change="handleSearch"
    >
      <template #suffix>
        <SearchOutlined />
      </template>
    </a-input>
  </div>
  <a-list class="!mt-2.5"  bordered item-layout="vertical" size="large" :data-source="cardList" :loading="initLoading">
    <template #loadMore>
      <div
        v-if="!initLoading && !loading"
        :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
      >
      </div>
    </template>
    <template #renderItem="{ item }">
      <a-list-item key="item.title">
        <template v-if="!loading" #actions>
          <a-button class="flex items-center" type="link" @click="deleteConfirm(item)">
            <template #icon>
              <DeleteOutlined class="!align-middle" />
            </template>
            删除
          </a-button>
        </template>
        <template #extra>
          <img
            v-if="!loading"
            width="272"
            alt="logo"
            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          />
        </template>
        <a-skeleton :loading="loading" active avatar>
          <a-list-item-meta :description="item.description">
            <template #title>
              <a :href="item.href">{{ item.name }}</a>
            </template>
            <template #avatar><a-avatar :src="item.avatar" /></template>
          </a-list-item-meta>
          {{ item.content }}
        </a-skeleton>
      </a-list-item>
    </template>
  </a-list>
  <a-modal
    v-model:open="open"
    title="新建任务"
    :okButtonProps="{
      loading: submitLoading
    }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    autocomplete="off"
  >
    <a-form-item
      label="任务名称"
      name="name"
    >
      <a-input v-model:value="formState.name" />
    </a-form-item>

    <a-form-item
      label="描述"
      name="description"
    >
      <a-input v-model:value="formState.description" />
    </a-form-item>
  </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { DeleteOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { debounce } from 'lodash-es';

const keyword = ref('')

const cardList = ref([])
const loading = ref<boolean>(false)
const initLoading = ref<boolean>(true)

const open = ref<boolean>(false)
const submitLoading = ref<boolean>(false)
const formRef = ref(null);
const formState = reactive({
  name: '',
  description: ''
})
const rules = {
  name: {
    required: true,
    message: '请输入任务名称'
  },
  description: {
    required: true,
    message: '请输入任务地址'
  }
}


onMounted(() => {
  fetchList()
})



function timer(func, wait:number) {
  setTimeout(func, wait)
}

const fetchList = debounce((isSearch:boolean = false) => {
  updateLoading()

  const setDefaultList = () => {
    for (let i = 0; i < 3; i++) {
      cardList.value.push({
        id: i,
        href: 'https://www.antdv.com/',
        name: `ant design vue part ${i}`,
        avatar: 'https://joeschmoe.io/api/v1/random',
        description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      });
    }
    initLoading.value = false
  }

  const setSearchList = () => {
    cardList.value.forEach(i => {
      i.name = `search-${i.id}_${unref(keyword)}`
    })
  }

  timer(isSearch ? setSearchList: setDefaultList, 500)
},100)


function handleSearch() {
  fetchList(true)
}


function deleteConfirm(item) {
  Modal.confirm({
    title: '确认是否删除?',
    icon: createVNode(ExclamationCircleOutlined),
    onOk() {
      return new Promise((resolve, reject) => {
        timer(() => {
          message.success({
            content: '删除成功!'
          })
          const index = unref(cardList).findIndex(i => i.id === item.id)
          cardList.value.splice(index, 1)
          updateLoading()
          resolve(true)
        }, 500)
      })
    }
  })
}

function updateLoading() {
  loading.value = true
  timer(() => (loading.value = false), 500)
}

function handleAdd() {
  open.value = true
}

function handleOk() {
  formRef.value
    .validate()
    .then(() => {
      submitLoading.value = true
      timer(() => {
        cardList.value.unshift({
          href: 'https://www.antdv.com/',
          avatar: 'https://joeschmoe.io/api/v1/random',
          content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            key: unref(cardList).length,
          id: unref(cardList),
          ...formState
        })
        submitLoading.value = false
        message.success('添加成功!')
        handleCancel()
      }, 300)
    })
    .catch(error => {
      console.log('error', error);
    });
}

function handleCancel() {
  open.value = false
  formRef.value.resetFields()
}
</script>
