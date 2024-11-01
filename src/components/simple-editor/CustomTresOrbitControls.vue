<script setup lang="ts">
import { extend, useTresContext } from '@tresjs/core'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'
// import { OrbitControls } from '@tresjs/cientos'
import { ref, computed } from 'vue'

const props = defineProps({
  enabled: {
    type: Boolean,
    default: true,
  },
  camera: {
    type: Object,
  },
})

// console.log(props);

const { camera: contextCamera, renderer } = useTresContext()

const orbitControlsRef = ref()

const internalCamera = computed(() => props.camera ?? contextCamera.value)

extend({ OrbitControls })

defineExpose({ value: orbitControlsRef })
</script>

<template>
  <!-- <OrbitControls
    auto-rotate
    make-default
  /> -->
  <TresOrbitControls
    v-if="renderer"
    :key="internalCamera?.uuid"
    ref="orbitControlsRef"
    :args="[internalCamera, renderer?.domElement]"
    :camera="internalCamera"
    :enabled="enabled"
  />
</template>