import './assets/main.css'
import 'vue-toastification/dist/index.css'
import './assets/base.css'
// import 'unfonts.css'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'

// @ts-ignore
// import { registerSW } from 'virtual:pwa-register'

// registerSW({
//     onNeedRefresh() {
//         console.log('Nouvelle version disponible !')
//     },
//     onOfflineReady() {
//         console.log('Application prête à être utilisée hors ligne.')
//     },
//     immediate: true
// })

const app = createApp(App)
const vuetify = createVuetify({
    components,
    directives,
    ssr: true
})
app.use(vuetify)
app.use(createPinia())
app.use(Toast)
app.use(router)
app.mount('#app')
