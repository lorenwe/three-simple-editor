import { createApp } from 'vue'
import Dialog from './Dialog.vue'

const createDialog = (option = {}) => {
    const mountNode = document.createElement('div') as HTMLElement
    const Instance = createApp(Dialog, {
        show: true,
        ...option,
        close: () => { 
            Instance.unmount(); 
            document.body.removeChild(mountNode);
        }
    })

    document.body.appendChild(mountNode)
    Instance.mount(mountNode)
}

export default createDialog