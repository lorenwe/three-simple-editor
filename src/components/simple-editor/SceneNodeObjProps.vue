<script setup lang="ts">
import type { ObjectSceneNode } from './types'
import { ref, toRefs, watch, toRaw, defineEmits } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<ObjectSceneNode>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const { modelValue } = toRefs(props)
const internalModelValue = ref<ObjectSceneNode>(structuredClone(toRaw(modelValue.value)))
watch(modelValue, () => {
  internalModelValue.value = structuredClone(toRaw(modelValue.value))
})
function handleModelValueUpdate() {
  emit('update:modelValue', structuredClone(toRaw(internalModelValue.value)))
}
</script>

<template>
  <div class="grid grid-cols-[auto_auto] gap-1">
    name:
    <input
      v-model="internalModelValue.properties.name"
      class="dark:text-black"
      @update:model-value="handleModelValueUpdate"
    >
    url:
    <input
      :readonly="true"
      v-model="internalModelValue.properties.url"
      class="dark:text-black"
      @update:model-value="handleModelValueUpdate"
    >
  </div>
</template>