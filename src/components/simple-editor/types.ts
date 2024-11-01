export interface SceneSettings {
  width: number
  height: number
}
  
export interface SceneNode {
  id: string
  type: 'camera' | 'box' | 'sphere' | 'cone' | 'obj' | 'plan' | 'tag2D'
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
}
  
export interface CameraSceneNode extends SceneNode {
  type: 'camera'
  properties: {
    fov: number
  }
}
  
export interface BoxSceneNode extends SceneNode {
  type: 'box'
  properties: {
    width: number
    height: number
    length: number
  }
}
  
export interface SphereSceneNode extends SceneNode {
  type: 'sphere'
  properties: {
    radius: number
  }
}

export interface ConeSceneNode extends SceneNode {
  type: 'cone'
  properties: {
    radius: number
    height: number
  }
}

export interface ObjectSceneNode extends SceneNode {
  type: 'obj',
  properties: {
    name: string
    url: string
  }
}

export interface PlanSceneNode extends SceneNode {
  type: 'plan'
  properties: {
    texture: string
    width: number
    height: number
  }
}

export interface TagSceneNode extends SceneNode {
  type: 'tag2D'
  properties: {
    name: string
    model: string
  }
}