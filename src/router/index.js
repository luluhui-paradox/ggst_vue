import { createRouter,createWebHashHistory } from "vue-router";
import HelloWorld from '../components/HelloWorld.vue';
import Top100 from '../components/Top100.vue';
import UserDetail from '../components/UserDetail.vue';

const routes = [
    {
        path:'/home',
        name:HelloWorld,
        component:HelloWorld
    },
    {
        path:'/',
        redirect:'/top100'
    },
    {
        path:'/top100',
        name:Top100,
        component:Top100
    },
    {
        path:'/userDetail',
        name:UserDetail,
        component:UserDetail
    }
    
]

const router = createRouter({
    history:createWebHashHistory(),
    routes
})

export default router