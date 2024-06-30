import { createRouter,createWebHashHistory } from "vue-router";
import HelloWorld from '../components/HelloWorld.vue';
import Top100 from '../views/Top100.vue';
import UserDetail from '../views/UserDetail.vue';
import UserSearchResult from '../views/UserSearchResult.vue';

const routes = [
    {
        path:'/home',
        name:'HelloWorld',
        component:HelloWorld
    },
    {
        path:'/',
        redirect:'/top100'
    },
    {
        path:'/top100',
        name:'Top100',
        component:Top100
    },
    {
        path:'/userDetail',
        name:'UserDetail',
        component:UserDetail
    },
    {
        path:'/userSearchResult',
        name:'UserSearchResult',
        component:UserSearchResult
    }
    
]

const router = createRouter({
    history:createWebHashHistory(),
    routes
})

export default router