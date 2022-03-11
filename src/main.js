import {createApp} from "vue";
import App from "./App.vue";
import router from '@/router';
import store from '@/store';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "@/styles/normalize.css";
import "@/styles/hover-min.css";
import "@/styles/index.scss";
import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const app = createApp(App);
app.use(router)
app.use(store)
app.use(VueLoaders)
app.use(ElementPlus, {
	locale: zhCn,
})
app.mount("#app");
