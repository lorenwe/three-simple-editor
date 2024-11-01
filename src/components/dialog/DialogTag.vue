<script setup lang="ts">
import { ref, toRefs, toRaw, watch } from 'vue'
import type { PropType } from 'vue'
import Dialog from './Dialog.vue'
import type { TDialogTag } from './types'

const props = defineProps({
  modelValue: {
    type: Object as PropType<TDialogTag>,
    required: true,
  },
})
const { modelValue } = toRefs(props)

const emit = defineEmits(['confim', 'close'])

const title = ref<string>("添加标签")

const internalModelValue = ref<TDialogTag>(structuredClone(toRaw(modelValue.value)))
watch(modelValue, () => {
  internalModelValue.value = structuredClone(toRaw(modelValue.value))
})

const close = () => {
  // console.log("关闭按钮")
  emit('close')
}
const confim = () => {
  internalModelValue.value.show = false
  emit('confim', structuredClone(toRaw(internalModelValue.value)))
}
</script>

<template>
  <Dialog v-model:show="modelValue.show" :title="title" :close ="close" :confim ="confim">
    <form class="w-full max-w-sm">
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="tag_name">
            标签名称
          </label>
        </div>
        <div class="md:w-2/3">
          <input v-model="internalModelValue.name" class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="tag_name" type="text">
        </div>
      </div>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="tag_model">
            关联模型
          </label>
        </div>
        <div class="md:w-2/3">
          <input v-model="internalModelValue.model" class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="tag_model" type="text">
        </div>
      </div>
    </form>
  </Dialog>
</template>