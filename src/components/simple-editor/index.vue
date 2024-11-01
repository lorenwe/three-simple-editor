<script setup lang="ts">
import { type Object3D } from 'three'
import { TresCanvas } from '@tresjs/core'
import { TransformControls } from '@tresjs/cientos'
import { ref, computed, watch, shallowRef, watchEffect } from 'vue'
import { useElementSize, useRefHistory, useDark } from '@vueuse/core'
import ContainElement from './ContainElement.vue'
import CustomTresOrbitControls from './CustomTresOrbitControls.vue'
import { Sky, Html } from '@tresjs/cientos'

import SceneNodeCone from './SceneNodeCone.vue'
import SceneNodeBox from './SceneNodeBox.vue'
import SceneNodeSphere from './SceneNodeSphere.vue'
import SceneNodeObj from './SceneNodeObj.vue'
import SceneNodePlan from './SceneNodePlan.vue'
import SceneNodeTag2D from './SceneNodeTag2D.vue'

import SceneSettingsProps from './SceneSettingsProps.vue'
import SceneNodeProps from './SceneNodeProps.vue'

import SceneNodeCameraProps from './SceneNodeCameraProps.vue'
import SceneNodeConeProps from './SceneNodeConeProps.vue'
import SceneNodeBoxProps from './SceneNodeBoxProps.vue'
import SceneNodeSphereProps from './SceneNodeSphereProps.vue'
import SceneNodeObjProps from './SceneNodeObjProps.vue'
import SceneNodeTag2DProps from './SceneNodeTag2DProps.vue'
import SceneNodePlanProps from './SceneNodePlanProps.vue'

import type { BoxSceneNode, CameraSceneNode, ConeSceneNode, SceneSettings, SphereSceneNode, ObjectSceneNode, PlanSceneNode, TagSceneNode } from './types'
import type { TDialogPlan, TDialogTag, TDialogObj } from "./../dialog/types";

import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three'

import DialogPlan from './../dialog/DialogPlan.vue'
import DialogTag from './../dialog/DialogTag.vue'
import DialogObj from './../dialog/DialogObj.vue'

const gl = {
  clearColor: '#82DBC5',
  shadows: true,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
}


interface State { 
  sceneSettings: SceneSettings
  sceneNodes: (CameraSceneNode | BoxSceneNode | SphereSceneNode | ConeSceneNode | ObjectSceneNode | PlanSceneNode | TagSceneNode)[] 
}
const state = ref<State>({ sceneSettings: { width: 800, height: 600 }, sceneNodes: [
  {
    id: crypto.randomUUID(),
    type: 'camera',
    properties: {
      fov: 40,
    },
    position: [ 0, 5, 50 ],
    rotation: [ 0, 0, 0 ],
    scale: [ 1, 1, 1 ],
  },
] })
const history = useRefHistory(state, { deep: true })
history.clear()

const isDark = useDark()

const currentCameraName = ref('nav')
const currentCamera = computed(() => ({ render: renderCamRef, nav: navCamRef }[currentCameraName.value]?.value))

const selectedNodeId = ref<string | null>()
watch(selectedNodeId, () => {
  // console.log("执行selectedNodeId", selectedNodeId)
}, { immediate: true })
const selectedNode = computed(() => state.value.sceneNodes.find(i => i.id === selectedNodeId.value))
const cameraNode = computed(() => state.value.sceneNodes.find(i => i.type === 'camera') as CameraSceneNode)

type Mode = 'translate' | 'rotate' | 'scale'
const currentMode = ref<Mode>('translate')
const modes: Mode[] = ['translate', 'rotate', 'scale']

type Space = 'world' | 'local'
const currentSpace = ref<Space>('world')
const spaces: Space[] = ['world', 'local']

//#region TresJS
const tresCanvasRef = shallowRef()
const renderCamRef = shallowRef()
const navCamRef = shallowRef()
const cameraHelperRef = shallowRef()
const canvasContainerRef = shallowRef()
const sceneNodeRefs = ref<{ [sceneNodeId: string]: Object3D }>({})

// 初始化过程中将摄像头设置为手动
const setCamerasManualWatcher = watchEffect(() => {
  if (renderCamRef.value != null && navCamRef.value != null) {
    renderCamRef.value.manual = false
    navCamRef.value.manual = false
    setCamerasManualWatcher()
  }
})

// 切换当前相机时，将其设置在tres上下文中
watchEffect(() => {
  if (tresCanvasRef.value?.context != null && currentCamera.value != null) {
    const { setCameraActive } = tresCanvasRef.value.context
    setCameraActive(currentCamera.value)
  }
})

// 当渲染相机处于活动状态时，手动更新所需内容。当纵横比/视场发生变化时，须手动更新CameraHelper
watchEffect(() => {
  if (renderCamRef.value != null) {
    renderCamRef.value.aspect = state.value.sceneSettings.width / state.value.sceneSettings.height
    renderCamRef.value.fov = cameraNode.value?.properties?.fov ?? 40
    renderCamRef.value.updateProjectionMatrix()
  }
  if (cameraHelperRef.value != null) {
    cameraHelperRef.value.update()
  }
})

// 当NAV相机处于活动状态时，手动更新所需内容
const canvasContainerSize = useElementSize(canvasContainerRef)
watchEffect(() => {
  if (navCamRef.value != null) {
    navCamRef.value.aspect = canvasContainerSize.width.value / canvasContainerSize.height.value
    navCamRef.value.updateProjectionMatrix()
  }
})


const transformControlFocused = ref(false)
const orbitEnabled = computed(() => {
  return !transformControlFocused.value && currentCameraName.value === 'nav'
})

//#endregion

function addConeSceneNode() {
  const newSceneNode: ConeSceneNode = {
    id: crypto.randomUUID(),
    type: 'cone',
    properties: {
      radius: 5,
      height: 10,
    },
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  }

  state.value.sceneNodes.push(newSceneNode)
  selectSceneNode(newSceneNode.id)
}

function addBoxSceneNode() {
  const newSceneNode: BoxSceneNode = {
    id: crypto.randomUUID(),
    type: 'box',
    properties: {
      width: 10,
      height: 10,
      length: 10,
    },
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  }

  state.value.sceneNodes.push(newSceneNode)
  selectSceneNode(newSceneNode.id)
}

function addSphereSceneNode() {
  const newSceneNode: SphereSceneNode = {
    id: crypto.randomUUID(),
    type: 'sphere',
    properties: {
      radius: 5,
    },
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  }

  state.value.sceneNodes.push(newSceneNode)
  selectSceneNode(newSceneNode.id)
}

function addObjSceneNode(name: string, url: string) {
  const newSceneNode: ObjectSceneNode = {
    id: crypto.randomUUID(),
    type: 'obj',
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    properties: {
      name: name,
      url: url
    }
  }
  state.value.sceneNodes.push(newSceneNode)
}

function addPlanSceneNode(texture: string) {
  const newSceneNode: PlanSceneNode = {
    id: crypto.randomUUID(),
    type: 'plan',
    properties: {
      texture: texture,
      width: 100,
      height: 100
    },
    position: [0, 0, 0],
    rotation: [-Math.PI/2, 0, 0],
    scale: [1, 1, 1],
  }
  state.value.sceneNodes.push(newSceneNode)
  selectSceneNode(newSceneNode.id)
}

function addTagSceneNode(tagName: string, model: string) {
  const newSceneNode: TagSceneNode = {
    id: crypto.randomUUID(),
    type: 'tag2D',
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [20, 20, 20],
    properties: {
      name: tagName,
      model: model,
    }
  }
  state.value.sceneNodes.push(newSceneNode)
  selectSceneNode(newSceneNode.id)
}

function selectSceneNode(sceneNodeId: string) {
  selectedNodeId.value = sceneNodeId
}

function handleTransformChange(sceneNodeId: string, object: Object3D) {
  const sceneNode = state.value.sceneNodes.find(i => i.id === sceneNodeId)
  if (sceneNode != null) {
    sceneNode.position = [object.position.x, object.position.y, object.position.z]
    sceneNode.rotation = [object.rotation.x, object.rotation.y, object.rotation.z]
    sceneNode.scale = [object.scale.x, object.scale.y, object.scale.z]
  }
  // console.log(state.value.sceneNodes)
}

function handleDeleteSceneNode(sceneNodeId: string) {
  if (selectedNodeId.value === sceneNodeId) {
    selectedNodeId.value = null
  }
  state.value.sceneNodes.splice(
    state.value.sceneNodes.findIndex(i => i.id === sceneNodeId),
    1,
  )
}

// 异步组件加载完成后触发选中
function onResolveSuspense(sceneNodeId: string) {
  selectSceneNode(sceneNodeId)
}

// 展示DialogPlan
const dialogPlanData = ref<TDialogPlan>({show: false, texture: "./models/qyct.png"})
const dialogPlanConfim = (e: TDialogPlan) => {
  dialogPlanData.value = e
  // console.log("dialogPlanConfim", e)
  // 添加物体 './models/qyct.png'
  addPlanSceneNode(e.texture)
}
const dialogPlanClose = () => {
  dialogPlanData.value.show = false
}
function showDialogPlan(){
  // 打开弹框
  dialogPlanData.value.show = true
}

// 展示DialogTag
const dialogTagData = ref<TDialogTag>({show: false, name: "楼栋", model: ""})
const dialogTagConfim = (e: TDialogTag) => {
  dialogTagData.value = e
  // console.log("dialogTagConfim", e)
  // 添加标签
  addTagSceneNode(e.name, e.model)
}
const dialogTagClose = () => {
  dialogTagData.value.show = false
  // console.log(dialogTagData.value)
}
function showDialogTag(){
  // 打开弹框
  dialogTagData.value.show = true
}

// 展示DialogObj
const dialogObjData = ref<TDialogObj>({show: false, name: "楼栋", url: "/models/scene01.gltf"})
const dialogObjConfim = (e: TDialogObj) => {
  dialogObjData.value = e
  // console.log("dialogObjConfim", e)
  // 添加标签
  addObjSceneNode(e.name, e.url)
}
const dialogObjClose = () => {
  dialogObjData.value.show = false
  // console.log(dialogObjData.value)
}
function showDialogObj(){
  // 打开弹框
  dialogObjData.value.show = true
}

// 保存所有坐标数据
const saveData = () => {
  console.log(state.value.sceneNodes)
  var jsonText = JSON.stringify(state.value.sceneNodes)
  console.log(jsonText)
}
</script>

<template>
  <div class="flex w-full inset-0 h-full light">
    <DialogPlan :model-value="dialogPlanData" @confim="dialogPlanConfim" @close="dialogPlanClose"></DialogPlan>
    <DialogTag :model-value="dialogTagData" @confim="dialogTagConfim" @close="dialogTagClose"></DialogTag>
    <DialogObj :model-value="dialogObjData" @confim="dialogObjConfim" @close="dialogObjClose"></DialogObj>
    <div class="flex flex-col h-screen gap-2 bg-gray-200 dark:bg-gray-800 p-2 min-w-[140px]">
      <div>
        Scene Explorer:
      </div>
      <div class="flex flex-col items-center justify-center gap-2">
        <button class="dark:bg-gray-600" @click="addConeSceneNode">Add Cone</button>
        <button class="dark:bg-gray-600" @click="addBoxSceneNode">Add Box</button>
        <button class="dark:bg-gray-600" @click="addSphereSceneNode">Add Sphere</button>
        <button class="dark:bg-gray-600" @click="showDialogObj">Add Obj</button>
        <button class="dark:bg-gray-600" @click="showDialogPlan">Add Plan</button>
        <button class="dark:bg-gray-600" @click="showDialogTag">Add Tag</button>
      </div>
      <div class="flex flex-col flex-grow gap-2">
        <div
          v-for="sceneNode in state.sceneNodes"
          :key="sceneNode.id"
          class="flex justify-between"
          :class="{ 'ring-2 ring-blue-400': sceneNode.id === selectedNodeId }"
        >
          <div @click="selectSceneNode(sceneNode.id) ">
            {{ sceneNode.type }} 
            <!-- - 
            <span v-if="sceneNode.type == 'obj'">{{ sceneNode.name }}</span>
            <span v-if="sceneNode.type == 'tag2D'">{{ sceneNode.name }}</span> -->
          </div>
          <div
            v-if="sceneNode.type !== 'camera'"
            @click="handleDeleteSceneNode(sceneNode.id)"
          >
            x
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col flex-grow">
      <div class="flex gap-2 border border-b-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-500 p-1">
        <div class="flex gap-1">
          <button
            v-for="mode in modes"
            :key="mode"
            class="dark:bg-gray-600"
            :class="{ 'ring-2 ring-blue-400': currentMode === mode }"
            @click="currentMode = mode"
          >
            {{ mode }}
          </button>
        </div>
        |
        <div class="flex gap-1">
          <button
            class="dark:bg-gray-600"
            :disabled="!history.canUndo"
            @click="history.undo"
          >
            Undo
          </button>
          <button
            class="dark:bg-gray-600"
            :disabled="!history.canRedo"
            @click="history.redo"
          >
            Redo
          </button>
        </div>
        |
        <div class="flex gap-1">
          <button
            v-for="space in spaces"
            :key="space"
            class="dark:bg-gray-600"
            :class="{ 'ring-2 ring-blue-400': currentSpace === space }"
            @click="currentSpace = space"
          >
            {{ space }}
          </button>
        </div>
        |
        <div class="flex gap-1">
          <button
            v-for="cameraName in ['render', 'nav']"
            :key="cameraName"
            class="dark:bg-gray-600"
            :class="{ 'ring-2 ring-blue-400': currentCameraName === cameraName }"
            @click="currentCameraName = cameraName"
          >
            {{ cameraName }}
          </button>
        </div>
        |
        <div class="flex gap-1">
          <button class="dark:bg-gray-600" @click="saveData">save</button>
        </div>
      </div>
      <div class="flex flex-grow items-center justify-center border border-slate-200 dark:border-gray-700" >
        <ContainElement 
          :enabled="currentCameraName === 'render'"
          :aspect-ratio="state.sceneSettings.width / state.sceneSettings.height"
          class="border border-slate-400"
        >
          <div ref="canvasContainerRef" class="h-full w-full" >
            <TresCanvas v-bind="gl"
              shadows 
              v-if=" cameraNode != null"
              ref="tresCanvasRef"
              :clear-color="isDark ? '#252526' : '#FAFAFA'"
            >
              <TresPerspectiveCamera
                :ref="
                  (el) => {
                    renderCamRef = el;
                    sceneNodeRefs[cameraNode.id] = (el as unknown as Object3D);
                  }
                "
                name="render"
                :position="cameraNode.position"
                :rotation="cameraNode.rotation"
              />
              <TresPerspectiveCamera
                ref="navCamRef"
                name="nav"
                :position="[0, 500, 500]"
                :far="10000"
                :near="1"
              />
              <Sky />
              <TresCameraHelper
                v-if="navCamRef != null && renderCamRef != null"
                ref="cameraHelperRef"
                :visible="currentCameraName === 'nav'"
                :args="[renderCamRef]"
              />
              <CustomTresOrbitControls
                :enabled="orbitEnabled"
                :camera="navCamRef"
              />
              <SceneNodePlan
                v-for="sceneNode in state.sceneNodes.filter((i) => i.type === 'plan')"
                :key="sceneNode.id"    
                :ref="
                  (el: any) => {
                    sceneNodeRefs[sceneNode.id] = el?.mesh ;
                  }
                "
                :position="sceneNode.position"
                :rotation="sceneNode.rotation"
                :scale="sceneNode.scale"
                :properties="(sceneNode as PlanSceneNode).properties"
                @click="selectSceneNode(sceneNode.id)"
              />
              <SceneNodeCone
                v-for="sceneNode in state.sceneNodes.filter((i) => i.type === 'cone')"
                :key="sceneNode.id"    
                :ref="
                  (el: any) => {
                    sceneNodeRefs[sceneNode.id] = el?.mesh ;
                  }
                "
                :position="sceneNode.position"
                :rotation="sceneNode.rotation"
                :scale="sceneNode.scale"
                :properties="(sceneNode as ConeSceneNode).properties"
                :first="state.sceneNodes.filter(i => i.type === 'cone')[0] === sceneNode"
                @click="selectSceneNode(sceneNode.id)"
              />
              <SceneNodeBox
                v-for="sceneNode in state.sceneNodes.filter((i) => i.type === 'box')"
                :key="sceneNode.id"    
                :ref="
                  (el: any) => {
                    sceneNodeRefs[sceneNode.id] = el?.mesh;
                  }
                "
                :position="sceneNode.position"
                :rotation="sceneNode.rotation"
                :scale="sceneNode.scale"
                :properties="(sceneNode as BoxSceneNode).properties"
                @click="selectSceneNode(sceneNode.id)"
              />
              <SceneNodeTag2D
                v-for="sceneNode in state.sceneNodes.filter((i) => i.type === 'tag2D')"
                :key="sceneNode.id"    
                :ref="
                  (el: any) => {
                    sceneNodeRefs[sceneNode.id] = el?.mesh ;
                  }
                "
                sprite
                :position="sceneNode.position"
                :rotation="sceneNode.rotation"
                :scale="sceneNode.scale"
                :properties="(sceneNode as TagSceneNode).properties"
                @click="selectSceneNode(sceneNode.id)"
              />
              <SceneNodeSphere
                v-for="sceneNode in state.sceneNodes.filter((i) => i.type === 'sphere')"
                :key="sceneNode.id"    
                :ref="
                  (el: any) => {
                    sceneNodeRefs[sceneNode.id] = el?.mesh;
                  }
                "
                :position="sceneNode.position"
                :rotation="sceneNode.rotation"
                :scale="sceneNode.scale"
                :properties="(sceneNode as SphereSceneNode).properties"
                :first="state.sceneNodes.filter(i => i.type === 'sphere')[0] === sceneNode"
                @click="selectSceneNode(sceneNode.id)"
              />
              <Suspense>
                <SceneNodeObj
                  v-for="sceneNode in state.sceneNodes.filter((i) => i.type === 'obj')"
                  :key="sceneNode.id"    
                  :ref="
                    (el: any) => {
                      sceneNodeRefs[sceneNode.id] = el?.mesh;
                    }
                  "
                  :position="sceneNode.position"
                  :rotation="sceneNode.rotation"
                  :scale="sceneNode.scale"
                  :properties="(sceneNode as ObjectSceneNode).properties"
                  @click="selectSceneNode(sceneNode.id)"
                  @mounted="onResolveSuspense(sceneNode.id)"
                />
              </Suspense>
              <TransformControls
                v-if="selectedNodeId != null"
                :key="currentCameraName"
                :object="sceneNodeRefs[selectedNodeId!]"
                :mode="currentMode"
                :space="currentSpace"
                @mouse-down="() => {
                  transformControlFocused = !transformControlFocused;
                  history.resume(true);
                }"
                @object-change="handleTransformChange(selectedNodeId!, sceneNodeRefs[selectedNodeId!])"
              />
              <!-- <TresGridHelper :args="[100, 10, '#44403C', '#43ad7f']" /> -->
              <TresAmbientLight :intensity="0.1" />
              <TresDirectionalLight
                cast-shadow
                :position="[0, 5, 0]"
                :intensity="0.5"
              />
            </TresCanvas>
          </div>
        </ContainElement>
      </div>
    </div>
    <div class="flex flex-col bg-gray-200 dark:bg-gray-800 p-2 gap-2">
      <div>
        <b>Scene Settings</b>
        <SceneSettingsProps v-model="state.sceneSettings" />
      </div>
      <div v-if="selectedNode != null" class="flex flex-col gap-2">
        <b>Scene Node Properties</b>
        <SceneNodeProps
          :model-value="selectedNode"
          @update:model-value="selectedNode!.position = $event.position; 
                               selectedNode!.rotation = $event.rotation; 
                               selectedNode!.scale = $event.scale"
        />
        <SceneNodeCameraProps
          v-if="selectedNode.type === 'camera'"
          :model-value="selectedNode"
          @update:model-value="selectedNode!.properties = $event.properties"
        />
        <SceneNodeConeProps
          v-if="selectedNode.type === 'cone'"
          :model-value="selectedNode"
          @update:model-value="selectedNode!.properties = $event.properties"
        />
        <SceneNodeBoxProps
          v-if="selectedNode.type === 'box'"
          :model-value="selectedNode"
          @update:model-value="selectedNode!.properties = $event.properties"
        />
        <SceneNodeSphereProps
          v-if="selectedNode.type === 'sphere'"
          :model-value="selectedNode"
          @update:model-value="selectedNode!.properties = $event.properties"
        />
        <SceneNodeObjProps
          v-if="selectedNode.type === 'obj'"
          :model-value="selectedNode"
          @update:model-value="selectedNode!.properties = $event.properties"
        />
        <SceneNodeTag2DProps
          v-if="selectedNode.type === 'tag2D'"
          :model-value="selectedNode"
          @update:model-value="selectedNode!.properties = $event.properties"
        />
        <SceneNodePlanProps 
          v-if="selectedNode.type === 'plan'"
          :model-value="selectedNode"
          @update:model-value="selectedNode!.properties = $event.properties"
        />
      </div>
    </div>
  </div>
</template>