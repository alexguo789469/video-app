<template>
  <div class="commentContainer">


    <div v-for="(item, index) in commentlist" :key="index">
      <div class="userinfo">
        <div class="avator">
          <img :src="item.userinfo.user_img" alt v-if="item.userinfo && item.userinfo.user_img" />
          <img src="../../assets/avator.png" alt v-else />
        </div>
        <div class="data">
          <p v-if="item.userinfo">{{item.userinfo.name}}</p>
          <p v-else>此用户没有填写姓名</p>
          <p>{{item.comment_date}}</p>
        </div>
      </div>

      <p class="comBody">{{item.comment_content}} <span class="reply"
      @click="publishClick(item.comment_id)">回复</span></p>
      <div class="childcontainer">
        <commentitem :commentChild="item.child" @postPrimary="postPrimary"></commentitem>
      </div>
    </div>
  </div>
</template>

<script>
import commentitem from "./Commentitem";
export default {
  components: {
    commentitem
  },
  props: ["commentlist"],
  methods: {
    publishClick(id){
      this.$emit("focusipt", id)
    },
    postPrimary(id){
      this.$emit("postLastStep", id)
    }
  },
};
</script>

<style lang="less" scoped>

.commentContainer {
  border-bottom: 1px solid #e7e7e7;
  background-color: #fff;
  .userinfo {
    display: flex;
    align-items: center;
    .avator {
      img {
        width: 30px;
        height: 30px;
        padding: 8px;
        border-radius: 50%;
      }
    }
    .data {
      font-size: 13px;
      color: #757575;
      p {
        margin: 5px 0;
      }
    }
  }
  .comBody {
    margin: 0 12px 10px 46px;
    color: #212121;
    font-size: 13px;
    position: relative;
    .reply{
      position: absolute;
      right: 10px;
      color: red;
    }
  }
  .childcontainer {
    padding: 0 12px 10px 46px;
  }
}
</style>