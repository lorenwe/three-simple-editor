interface Base {
  show: boolean
}

export interface TDialogPlan extends Base {
  texture: string
}

export interface TDialogTag extends Base {
  name: string
  model: string
}

export interface TDialogObj extends Base {
  name: string
  url: string
}


// https://img2.honglounews.com/qyct.png
// https://img2.honglounews.com/01scene.glb
// https://img2.honglounews.com/02scene.glb
// https://img2.honglounews.com/03scene.glb
// https://img2.honglounews.com/05scene.glb
// https://img2.honglounews.com/06scene.glb
// https://img2.honglounews.com/07scene.glb
// https://img2.honglounews.com/08scene.glb