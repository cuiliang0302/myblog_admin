import {createApp} from "vue";
import App from "./App.vue";
import "@/styles/normalize.css";
import "@/styles/hover-min.css";
import "@/styles/index.scss";
import "element-plus/theme-chalk/src/message.scss"
import router from '@/router';
import store from '@/store';
import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';

const app = createApp(App);
app.use(router)
app.use(store)
app.use(VueLoaders)
app.mount("#app");
