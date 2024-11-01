<script setup lang="ts">
import { type Mesh, Color, MathUtils } from 'three'
import type { TagSceneNode } from './types'
import { ref, toRefs, computed, defineEmits } from 'vue'
import type { PropType } from 'vue'
import { Html } from '@tresjs/cientos'

const props = defineProps({
  properties: { 
    type: Object as PropType<TagSceneNode['properties']>, 
    default: () => ({ width: 10, height: 10, length: 10 }), 
  },
})

const emit = defineEmits(['click'])

const meshRef = ref<Mesh | null>()

defineExpose({ mesh: meshRef })
</script>

<template>
  <TresMesh ref="meshRef">
    <Html center >
      <h1 @click="emit('click')" class="bg-white dark:bg-dark text-xs text-center text-nowrap p-1 rounded">
        {{ props.properties.name }}
      </h1>
    </Html>
  </TresMesh>
</template>