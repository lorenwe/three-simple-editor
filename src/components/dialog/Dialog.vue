<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
    show: {
      type: (null as unknown) as PropType<boolean>,
      default: false
    },
    title: {
      type: (null as unknown) as PropType<string>,
      default: ""
    },
    close: {
      type: Function,
      default: (fun: any) => fun()
    },
    confim: {
      type: Function,
      default: (fun: any) => fun()
    }
})
const emit = defineEmits(['dialog:close', 'dialog:confim'])

const handleClose = () => {
  console.log('dialog:close')
  emit('dialog:close', false)
}
</script>

<template>
  <div v-if="show" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-base font-semibold text-gray-900" id="modal-title">{{props.title}}</h3>
                <div class="mt-2">
                  <slot></slot>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button @click="confim(handleClose)"  type="button" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">确认</button>
            <button @click="close(handleClose)" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>