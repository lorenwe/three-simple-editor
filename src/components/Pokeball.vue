<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'

const { scene } = await useGLTF('/models/scene01.gltf', { draco: true })
</script>

<template>
  <primitive :object="scene" />
</template>

<style scoped>

</style>
