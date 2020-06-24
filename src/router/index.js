import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '../views/register.vue'
import Login from '../views/login.vue'
import userinfo from '../views/userinfo.vue'
import edit from '../views/Edit.vue'
import home from '../views/Home.vue'
import article from '../views/Article.vue'
import editcategory from '../views/editcategory.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/register',
    component: Register
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/userinfo',
    component: userinfo,
    meta: {
      istoken: true
    }
  },
  {
    path: '/edit',
    component: edit,
    meta: {
      istoken: true
    }
  },
  {
    path: '/',
    component: home,
    meta: {
      keepalive: true
    }
  },
  {
    path: '/article/:id',
    component: article
  },
  {
    path: '/editcategory',
    component: editcategory
  }
  
]

const router = new VueRouter({
  routes
})

//路由拦截器可以拦截一些没有ajax请求的页面
//比如说后台管理系统
router.beforeEach((to, from, next) => {
  if( (!localStorage.getItem('token') || !localStorage.getItem('id')) && to.meta.istoken){
    router.push("/login");
    Vue.prototype.$errMsg.fail("路由拦截器")
    return;
  }
  next();
})

export default router
