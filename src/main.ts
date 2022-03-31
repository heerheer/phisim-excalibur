import {createApp} from 'vue'
// @ts-ignore
import App from './App.vue'
import * as VueRouter from 'vue-router'
import PlayGround from './components/PlayGround.vue';
import SongList from './pages/song-list/song-list.vue';
import ChartViewer from './pages/chart-viwer/chart-viewer.vue';


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const routes = [
    {path: '/', component: PlayGround},
    {path: '/list', component: SongList},
    {path: '/play', name: 'play', component: ChartViewer}

]
const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

createApp(App).use(ElementPlus).use(router).mount('#app')
