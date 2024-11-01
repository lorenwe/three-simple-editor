<script setup lang="ts">
import { type Mesh } from 'three'
import type { ObjectSceneNode } from './types'
import { ref, toRefs, computed, defineEmits, onMounted } from 'vue'
import type { PropType } from 'vue'

import { useGLTF } from '@tresjs/cientos'

const props = defineProps({
  properties: { 
    type: Object as PropType<ObjectSceneNode['properties']>, 
    default: () => ({ name: "", url: ""}), 
  },
})

const { properties } = toRefs(props)

const { scene } = await useGLTF(properties.value.url, { draco: true })

const emit = defineEmits(['click', 'mounted'])
const meshRef = ref<Mesh | null>()

onMounted(() => {
  emit("mounted")
})

defineExpose({ mesh: meshRef })
</script>

<template>
  <primitive 
    ref="meshRef"
    @click="emit('click')" 
    :object="scene"
  />
</template>