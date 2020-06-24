<template>
  <div>
    <navbar></navbar>
    <div class="current">
      <van-divider contentPosition="center">现有组件</van-divider>
      <div class="spancontainer">
        <span  v-for="(category, index) in categoryList" :key="index" @click="delitem(category, index)">{{category.title}}</span>
      </div>
    </div>


    <van-divider contentPosition="center">已删除组件</van-divider>
    <div class="spancontainer">
      <span v-for="(item, index) in delCate" :key="index" @click="additem(item, index)">{{item.title}}</span>
    </div>
  </div>
</template>

<script>
import navbar from "../components/common/NavBar";

export default {
  components: {
    navbar
  },
  data() {
      return {
          categoryList: [],
          delCate: []
      }
  },
  methods: {
      async selectCategory(){
          const res = await this.$http.get("/category");
          console.log(res);
          this.categoryList = res.data;
      },
      delitem(item, index){
          if(this.categoryList.length<2){
              this.$errMsg.fail("最少保留一个栏目")
              return 
          }
          this.categoryList.splice(index, 1);
          this.delCate.push(item);
      },
      additem(item, index){
          this.delCate.splice(index, 1);
          this.categoryList.push(item);
      }
  },
  created() {
      if(localStorage.getItem("newCat") && localStorage.getItem("delCat")){
          this.categoryList = JSON.parse(localStorage.getItem("newCat"));
          this.delCate = JSON.parse(localStorage.getItem("delCat"));
          return 
      }
      this.selectCategory();
  },
  watch: {
      categoryList(){
          localStorage.setItem("newCat", JSON.stringify(this.categoryList));
          localStorage.setItem("delCat", JSON.stringify(this.delCate));
      }
  }
};
</script>

<style lang="less" scoped>
.spancontainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  span {
    display: block;
    width: 70px;
    padding: 10px 10px;
    margin: 5px 5px;
    text-align: center;
    background-color: #fff;
  }
}
</style>