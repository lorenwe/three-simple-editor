<script setup lang="ts">
import type { PlanSceneNode } from './types'
import { ref, toRefs, watch, toRaw, defineEmits } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<PlanSceneNode>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const { modelValue } = toRefs(props)
const internalModelValue = ref<PlanSceneNode>(structuredClone(toRaw(modelValue.value)))
watch(modelValue, () => {
  internalModelValue.value = structuredClone(toRaw(modelValue.value))
})
function handleModelValueUpdate() {
  emit('update:modelValue', structuredClone(toRaw(internalModelValue.value)))
}
</script>

<template>
  <div class="grid grid-cols-[auto_auto] gap-1">
    texture:
    <input
      :readonly="true"
      v-model="internalModelValue.properties.texture"
      class="dark:text-black"
      @update:model-value="handleModelValueUpdate"
    >
    width:
    <input
      :readonly="true"
      v-model="internalModelValue.properties.width"
      class="dark:text-black"
      @update:model-value="handleModelValueUpdate"
    >
    height:
    <input
      :readonly="true"
      v-model="internalModelValue.properties.height"
      class="dark:text-black"
      @update:model-value="handleModelValueUpdate"
    >
  </div>
</template>