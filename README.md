# Using Vue to imitate Bilibili


![ezgif com-gif-maker](https://user-images.githubusercontent.com/66407147/152670339-8b75ef29-e21f-4ac0-815c-b7ce58c9e4ac.gif)


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


## Login and Register Page

1. create a common component

   + header
  
       Child Component

       ```html
       <slot name="right"></slot>
       ```

       Father Component

       ```html
       <div slot="right" @click="$router.push('/login')">切换到登录</div>
       ```


   + body （use vant as our mobile UI component）

     - Each time the input content changes, the upper-level component should receive the data passed in by the child component

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

2. Put id and token in local storage

   ```js
   if(res.data.code == 200){
       localStorage.setItem("id", res.data.id);
       localStorage.setItem("token", res.data.objtoken);
   
       setTimeout(() => {
           this.$router.push('/userinfo')
       }, 1000)
   }
   ```

   

## use axios to make HTTP request


   ```js
   const http = axios.create({
       baseURL: "http://112.74.99.5:3000/web/api"
   })
   ```

* axios interceptors

   ```js
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
   

* import axios to main.js

   ```js
   import http from "../http"
   
   Vue.prototype.$http = http
   ```

   Note: vant.js is also imported to main.js

   ```js
   import Vant from 'vant'
   import 'vant/lib/index.css'
   Vue.use(Vant);
   
   import { Toast } from 'vant'
   
   Vue.prototype.$errMsg = Toast
   ```

### Register

1.check input

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

2. use axios to make POST request

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

### Login


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



## Router interceptor

```js
router.beforeEach((to, from, next) => {
  if( (!localStorage.getItem('token') || !localStorage.getItem('id')) && to.meta.istoken){
    router.push("/login");
    Vue.prototype.$errMsg.fail("路由拦截器")
    return;
  }
  next();
})
```
		

## User Info Page

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

## edit user Info


   ```js
   async userUpdate(){
       await this.$http.post('/update/' + localStorage.getItem('id'), this.model)
   },
   ```

* upload avatar

   ```js
   const formData = new FormData();
   formData.append('file', file.file);
   const res = await this.$http.post('/upload', formData);
   ```

## Main Page

1. use vant-list to implement lazy load

      ```js
          async selectCategory() {
            if(localStorage.getItem("newCat")){
              this.changeCategory(JSON.parse(localStorage.getItem("newCat")));
              return
            }
            const res = await this.$http.get("/category");
            this.changeCategory(res.data);
          
      ```

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

      ```js
      onLoad() {
          console.log("加载onload");
          setTimeout(() => {
              this.categories[this.active].page++;
              this.selectArticle();
          }, 1000);
      }
      ```

      ```js
      watch: {
          active() {
            this.selectArticle();
          }
        
      ```

   2. use keep-alive to save current state

      ```html
      <keep-alive>
          <router-view v-if="$route.meta.keepalive"/>
      </keep-alive>
      <router-view v-if="!$route.meta.keepalive"/>
      ```


## render comments

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
         this.commentData();
         this.text = "";
       }
     }
   ```

   ```js
     created() {
       this.myuserinfo();
       this.commentData();
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

   







































