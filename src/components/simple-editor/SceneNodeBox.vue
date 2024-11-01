<script setup lang="ts">
import { type Mesh, Color, MathUtils } from 'three'
import type { BoxSceneNode } from './types'
import { ref, toRefs, computed, defineEmits } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  properties: { 
    type: Object as PropType<BoxSceneNode['properties']>, 
    default: () => ({ width: 10, height: 10, length: 10 }), 
  },
  first: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

const { properties } = toRefs(props)

// 随机颜色
const randomColor = new Color(MathUtils.randInt(0, 0xffffff))

const meshRef = ref<Mesh | null>()

defineExpose({ mesh: meshRef })
</script>

<template>
  <TresMesh ref="meshRef" @click="emit('click')" >
    <TresBoxGeometry :args="[properties.width, properties.height, properties.length]" />
    <TresMeshBasicMaterial :color="randomColor" />
  </TresMesh>
</template>