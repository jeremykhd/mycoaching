import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './assets/base.css'
import { registerSW } from 'virtual:pwa-register'
const updateSW = registerSW({
    onNeedRefresh() {
        console.log('Nouvelle version disponible !')
    },
    onOfflineReady() {
        console.log('Application prête à être utilisée hors ligne.')
    },
    immediate: true
})
const app = createApp(App)

app.use(createPinia())
app.use(Toast)
app.use(router)
app.use(updateSW)
app.mount('#app')
