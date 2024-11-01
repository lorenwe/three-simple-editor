<script setup lang="ts">
import { type Mesh, Color, MathUtils } from 'three'
import { PlaneGeometry, CircleGeometry, MeshBasicMaterial, DoubleSide, TextureLoader, RepeatWrapping } from 'three'
import type { PlanSceneNode } from './types'
import { ref, toRefs, computed, defineEmits } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  properties: { 
    type: Object as PropType<PlanSceneNode['properties']>, 
    default: () => ({ width: 100, height: 100}), 
  },
})

const { properties } = toRefs(props)
   
//纹理贴图加载器TextureLoader
const texLoader = new TextureLoader();
let texture = texLoader.load(properties.value.texture);
// const plan_geometry = new PlaneGeometry(properties.value.width, properties.value.height);
const plan_geometry = new CircleGeometry(2048);
const plan_material = new MeshBasicMaterial( {map: texture, side: DoubleSide} );

const emit = defineEmits(['click'])

const meshRef = ref<Mesh | null>()

defineExpose({ mesh: meshRef })
</script>

<template>
  <!-- @click="emit('click')" -->
  <TresMesh
    ref="meshRef"
    @click="emit('click')"
    :material="plan_material"
    :geometry="plan_geometry"
  >
  </TresMesh>
</template>