# 用vue仿照b站

# vue项目之b站

## 登录和注册界面

1. 单独建立了登录和注册可以共用组件

   + header

     - header中的名字是通过父传子的方式将register或login界面的数据传递到header中

     - 左边切换组件是通过slot插槽的方式传递的

       子组件

       ```html
       <slot name="right"></slot>
       ```

       父组件

       ```html
       <div slot="right" @click="$router.push('/login')">切换到登录</div>
       ```

       $router.push相当于把当前页面推到另一个页面

   + body （使用了vant做为工具库）

     - 每次input内容发生改变的时候，上一级的register和login应该接受到子组件传入的数据

       ```vue
          methods: {
               handler(){
                   this.$emit("submit", this.text)
       
               }
           },
           watch: {
               text(){
                   this.handler()
               }
           },
       ```

   + submit button

     + 每次button被click的时候，父组件做出相应的数据请求

       这就涉及到了数据请求的问题

     + 子组件的请求需要向父组件的传递

2. 在本地存储中设置id和token，并在成功之后跳转到userinfo（个人信息）界面

   ```js
   if(res.data.code == 200){
       localStorage.setItem("id", res.data.id);
       localStorage.setItem("token", res.data.objtoken);
   
       setTimeout(() => {
           this.$router.push('/userinfo')
       }, 1000)
   }
   ```

   

## vue中的数据交互方式 -- axios

1. 先创建一个axios模块

2. 建立一个axios实例

   ```js
   const http = axios.create({
       baseURL: "http://112.74.99.5:3000/web/api"
   })
   ```

3. 建立拦截器： 

   拦截器的作用： 用于我们在网络请求或响应时对数据进行处理

   + request拦截的作用： 添加网页动画； 使用token认证
   + response拦截的作用： 根据状态码进行错误信息处理

   ```js
   //在所有请求前面都加上请求头
   http.interceptors.request.use(config => {
       if(localStorage.getItem('token') && localStorage.getItem('id')){
           config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
       }
       return config;
   }, err => {
       console.log(err);
   })
   ```

   ```js
   http.interceptors.response.use(config => {
       return config
   },err => {
       if(err.response.status == 401 || err.response.status == 402){
           router.push('/login');
           Vue.prototype.$errMsg.fail(err.response.data.message);
           console.dir(err);
       }
   })
   ```

   注：这里的router和Vue都是import进入axios模块的

   ```js
   //要在vue实例中才能重定向
   import router from './src/router/index'
   
   import Vue from 'vue'
   ```

   

4. 之后将拦截器挂载到main.js中

   ```js
   import http from "../http"
   
   Vue.prototype.$http = http
   ```

   注，vant组件之前也被挂载到main中

   ```js
   import Vant from 'vant'
   import 'vant/lib/index.css'
   Vue.use(Vant);
   
   import { Toast } from 'vant'
   
   Vue.prototype.$errMsg = Toast
   ```

## 注册和登录界面中的数据交互

### 注册

1. 首先用正则表达式判断输入内容是否正确

   ```js
   let rule = /^.{6,16}$/;
   if (
       rule.test(this.model.name) &&
       rule.test(this.model.username) &&
       rule.test(this.model.password)
   ) {
       ....
   }
   ```

2. 使用之前定义的axios实例，做post请求，

   1. 首先打印后台获得的message
   2. 当状态码为200时，将id和token存储进localstorage
   3. 过一秒中后进入用户信息界面

   ```js
   await this.$http.post("/register", this.model).then(res => {
       this.$errMsg.fail(res.data.msg);
   
       if (res.data.code == 200) {
           localStorage.setItem("id", res.data.id);
           localStorage.setItem("token", res.data.objtoken);
   
           setTimeout(() => {
               this.$router.push("/userinfo");
           }, 1000);
       }
   ```

### 登录

和注册差不多

```js
await this.$http.post('/login', this.model).then(res => {
    this.$errMsg.fail(res.data.msg)
    if(res.data.code == 200){
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("token", res.data.token)
        setTimeout(() => {
            this.$router.push("/userinfo")
        }, 1000)
    }
})
```



## 路由拦截器

```js
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
```

我这里是再userinfo界面，清除了token之后，就跳转到了login界面，因为路由拦截器

如果要是没有满足if的条件，就直接next（）跳转			

## 用户信息页

1. 在用户信息页最先建了一个navbar，这个navbar用于除了登录和注册的所有界面
2. navbar获取了用户的数据
3. 把数据从navbar传到了用户信息页

这里是为了防止连续访问$router.push两次，造成错误

```js
pathpush1(){
    if(this.$route.path != '/'){
        this.$router.push('/');
    }
},
    pathpush2(){
        if(this.$route.path != "/userinfo"){
            this.$router.push('/userinfo');
        }
    }
```

## 修改用户信息页

1. 和用户信息页一样，通过navbar获取数据

2. 定义了一个更新信息的方法，每次数据更新的时候都调用此方法

   ```js
   async userUpdate(){
       await this.$http.post('/update/' + localStorage.getItem('id'), this.model)
   },
   ```

3. 上传头像要将数据改成formdata的形式

   ```js
   const formData = new FormData();
   formData.append('file', file.file);
   const res = await this.$http.post('/upload', formData);
   ```

## 首页

1. navbar

2. 使用vant做了一个滚动条，并在滚动条最后加了一个自定义类别的设置摁扭

3. 使用vant-list实现懒加载

   使用方法

   List 组件通过loading和finished两个变量控制加载状态，当组件滚动到底部时，会触发load事件并将loading设置成true。此时可以发起异步操作并更新数据，数据更新完毕后，将loading设置成false即可。若数据已全部加载完毕，则直接将finished设置成true即可。

   immediate-check：是否在初始化时立即执行滚动位置检查

4. 方法：

   1. 使用了selectCategory方法获取用户选择的或者全部的分类

      ```js
          async selectCategory() {
            if(localStorage.getItem("newCat")){
              this.changeCategory(JSON.parse(localStorage.getItem("newCat")));
              return
            }
            const res = await this.$http.get("/category");
            this.changeCategory(res.data);
          
      ```

   2. changeCategory改变了每个元素的值,

      加了list，是为了获取该类中的视频

      加了page和pagesize，是为了确定在获取多少数据后重新加载

      finished和loading是用来配置懒加载的数据

      ```js
          changeCategory(data) {
            this.categories = data.map(item => {
              item.list = [];
              item.page = 1;
              item.pagesize = 12;
              item.finished = false;
              item.loading = false;
              return item;
            });
            this.selectArticle();
          }
      ```

   3. selectArticle，加载页面的所有数据

      首先获取每个分类下的数据

      其次将获取到的数据加入到每个分类的list下面

      加载完毕后将loading设为false，代表数据已经更新完毕，如果滑倒了底部，则触发onload事件重新加载

      如果获取的数据长度小于pagesize，证明已经加载完毕了，这时应将finished设为true

      ```js
         async selectArticle() {
            const categoryitem = this.categories[this.active];
            const res = await this.$http.get("/detail/" + categoryitem._id, {
              params: {
                page: categoryitem.page,
                pagesize: categoryitem.pagesize
              }
            });
            this.categories[this.active].list = this.categories[
            	this.active
            ].list.concat(res.data);
            categoryitem.loading = false;
            if (res.data.length < categoryitem.pagesize) {
              categoryitem.finished = true;
            }
          }
      ```

   4. onload是懒加载的触发机制

      每次到底部，过一秒后，将page的值增加，之后再重新加载页面的数据

      ```js
      onLoad() {
          console.log("加载onload");
          setTimeout(() => {
              this.categories[this.active].page++;
              this.selectArticle();
          }, 1000);
      }
      ```

   5. active是vant-tab标签栏自带的，如果每当换一个标签，active值就会发生改变，所以每次active值发生改变的时候重新调用selectArticle，加载页面的数据

      ```js
      watch: {
          active() {
            this.selectArticle();
          }
        
      ```

   6. cover指的是每一个小的视频详情页

      也是通过父类给的数据渲染到每一个cover的组件

      每次点击就会router.push到一个url上

      url后面都拼接了该连接的id

   7. 在router-view前加keep-alive，

      在开发中经常有从列表跳到详情页，然后返回详情页的时候需要缓存列表页的状态（比如滚动位置信息），这个时候就需要保存状态，要缓存状态；vue里提供了keep-alive组件用来缓存状态。

      作者：crystal
      链接：https://segmentfault.com/a/1190000019610283?utm_source=tag-newest
      来源：SegmentFault 思否
      著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

      ```html
      <keep-alive>
          <router-view v-if="$route.meta.keepalive"/>
      </keep-alive>
      <router-view v-if="!$route.meta.keepalive"/>
      ```

      

## 视频详情页

1. 上面的一些代码都是用户渲染之类的东西

2. 下面是一个点击可以切换组件的摁扭 一个组件是推荐视频，另外一个是评论

3. 推荐视频也是借用了cover这个组件，将获得的数据渲染到cover上

4. 由于router-view是复用的，会遇到如`/serviceId/:id`这样只改变`id`号的场景，单纯的改变`id`号并不会刷新router-view

   所以我们这个时候可以采取watch $route的方法

   ```js
   watch: {
       //同一组件created只执行一次，所以要监控，每当路由发生变化的时候，再调用方法
       //会触发新的ajax请求
       $route(){
           this.commendData();
       }
   ```

5. 视频详情页下还有一个comment组件



## 如何制作评论

1. comment整体定义了三个组件

   + 第一个组件：comment ，写了发表评论的样式

     ![image-20200630233513866](C:\Users\gxx\AppData\Roaming\Typora\typora-user-images\image-20200630233513866.png)

   + 第二个组件：commentbody，主要时写了一级评论的样式

     ![image-20200630233637699](C:\Users\gxx\AppData\Roaming\Typora\typora-user-images\image-20200630233637699.png)

   + 第三个组件：commentitem，写了二级及以上评论的样式

     ![image-20200630233742830](C:\Users\gxx\AppData\Roaming\Typora\typora-user-images\image-20200630233742830.png)

     组件也是可以循环的，props也要传给循环的组件

     ```html
     <commentchilditem :commentChild="item.child" :temp="true" @postchild="postchild"></commentchilditem>
     ```

     ```js
     name: "commentchilditem",
     props: ["commentChild", "temp"],
     ```

     点击二级评论及以上，都会传给commentbody，之后再传给comment

     commentbody中的一级评论的回复点击事件也会传给comment

     传过去之后，首先将鼠标focus，之后再把对应的comment_id赋值给parent_id

     这样每次点击post都会把该条回复赋给上一级评论

2. 首先是使用递归改变评论的数据结构  changeCommentData(data)

3. 之后定义一个获取评论数据的函数 this.commentData()

4. 定义一个检测localstorage中是否有token的函数

5. 定义一个发表评论的函数

   ```js
       async post() {
         const dd = new Date();
         let m = (dd.getMonth() + 1).toString().padStart(2, "0");
         let d = dd
           .getDate()
           .toString()
           .padStart(2, "0");
         let dateStr = m + "-" + d;
         console.log(dateStr);
         this.publishcommentData.comment_content = this.text;
         this.publishcommentData.comment_date = dateStr;
         this.publishcommentData.article_id = this.articleid;
   
         const res = await this.$http.post(
           "/comment_post/" + localStorage.getItem("id"),
           this.publishcommentData
         );
    
         if(res.status == 200){
           this.$errMsg.fail("评论发表成功")
         }
           //发表评论成功后，再次调用获取评论数据的内容，即可刷新页面
         this.commentData();
           //改变input的值，再次设置为空
         this.text = "";
       }
     }
   ```

6. 同理每次created和watch的时候都要调用一下this.commentData()

   created也会调用用户信息

   ```js
     created() {
       this.myuserinfo();//获取用户信息
       this.commentData();//获取评论数据
     },
     components: {
       commentBody
     },
     watch: {
       $route(){
         this.commentData();
       }
     }
   ```

   







































## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
