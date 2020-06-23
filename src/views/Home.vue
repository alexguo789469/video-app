<template>
  <div class="home">
    <nav-bar></nav-bar>

    <van-tabs v-model="active" sticky swipeable>
      <van-tab v-for="category in categories" :key="category._id" :title="category.title">

          <van-list
            v-model="category.loading"
            :finished="category.finished"
            finished-text="我也是有底线的"
            :immediate-check = "false"
            @load="onLoad"
          >
            <div style="overflow: hidden">
              <cover :detailitem="categoryitem" v-for="(categoryitem, categoryindex) in category.list" :key="categoryindex"></cover>
            </div>
          </van-list>
      </van-tab>
    </van-tabs>


  
  </div>
</template>

<script>
import NavBar from '../components/common/NavBar'
import cover from './Cover'

export default {
    data() {
      return {
        categories: [],
        active: 0,
      }
    },
    components: {
      NavBar,
      cover
    },
    created() {
      this.selectCategory()
    },
    methods: {
      async selectCategory(){
        const res = await this.$http.get('/category');
        this.changeCategory(res.data)
      },
      changeCategory (data) {
        this.categories =  data.map(item => {
          item.list = [];
          item.page = 1;
          item.pagesize = 12;
          item.finished = false;
          item.loading = false;
          return item
        })
        this.selectArticle();
      },
      async selectArticle() {
        const categoryitem = this.categories[this.active];
        const res = await this.$http.get('/detail/' + categoryitem._id, {
          params: {
            page: categoryitem.page,
            pagesize: categoryitem.pagesize
          }
        })

        this.categories[this.active].list = 
        this.categories[this.active].list.concat(res.data);
        categoryitem.loading = false;
        if(res.data.length < categoryitem.pagesize){
          categoryitem.finished = true;
        }
      },
      onLoad(){
        console.log("加载onload");
        setTimeout(() => {
          this.categories[this.active].page ++;
          this.selectArticle();
        }, 1000)
      }
    },
    watch: {
      active(){
        this.selectArticle();
      }
    }
    
}
</script>

<style lang="less">
.home{
  background-color: white;
  overflow: hidden;
}
</style>
