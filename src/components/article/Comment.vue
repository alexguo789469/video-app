<template>
  <div style="background-color: #fff;">
    <div class="postComment">
      <!-- img一般不用三元运算符 -->
      <img v-if="myuser" :src="myuser.user_img" alt />
      <img v-else :src="default_img" alt />
      <input type="text" placeholder="说点什么吧" v-model="text" ref="clickipt"/>
      <button @click="pleaseLogin">发表</button>
    </div>

    <comment-body :commentlist="commentList" @focusipt="focusipt" :publishcommentData="publishcommentData"
    @postLastStep="postLastStep"
    ></comment-body>
  </div>
</template>

<script>
import commentBody from "./CommentBody";
export default {
  props: ["articleid"],
  data() {
    return {
      myuser: null,
      //用require才好使
      default_img: require("../../assets/avator.jpg"),
      commentList: null,
      text: "",
      publishcommentData: {
        parent_id: null,
        article_id: null
      }
    };
  },
  methods: {
    postLastStep(id){
      console.log(id);
      this.$refs.clickipt.focus();
      this.publishcommentData.parent_id = id;
    },
    focusipt(id){
      this.$refs.clickipt.focus();
      this.publishcommentData.parent_id = id;
    },
    async myuserinfo() {
      if (localStorage.getItem("token")) {
        const res = await this.$http.get("/user/" + localStorage.getItem("id"));
        this.myuser = res.data[0];
      } else {
        return;
      }
    },
    pleaseLogin() {
      if (
        !this.myuser &&
        (!localStorage.getItem("id") || !localStorage.getItem("token"))
      ) {
        this.$errMsg.fail("请先登录吧");
        return;
      }
      this.post()
    },
    //获取评论数据
    async commentData() {
      const res = await this.$http.get("/comment/" + this.$route.params.id);
      this.commentList = this.changeCommentData(res.data);
    },
    //改造comment数据结构
    changeCommentData(data) {
      function fn(temp) {
        let arr1 = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].parent_id == temp) {
            arr1.push(data[i]);
            data[i].child = fn(data[i].comment_id);
          }
        }
        return arr1;
      }
      return fn(null);
    },
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
      console.log(res);
      this.publishcommentData.parent_id = null;
      if(res.status == 200){
        this.$errMsg.fail("评论发表成功")
      }
      this.commentData();
      this.text = "";
    }
  },
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
  },
};
</script>

<style lang="less" scoped>
.postComment {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding-right: 8px;
  padding-bottom: 10px;
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    padding: 8px;
  }
  input {
    flex: 1;
    border-radius: 10px;
    height: 30px;
    outline: none;
    border: none;
    font-size: 10px;
    background: #f4f4f4;
    padding-left: 10px;
  }
  button {
    border: none;
    font-size: 12px;
    color: white;
    background-color: #fb7299;
    padding: 5px 15px;
    border-radius: 10px;
    margin-left: 10px;
  }
}

.topcontainer {
  background-color: #fff;
  display: flex;

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
  .reply {
    position: absolute;
    right: 10px;
    color: red;
  }
}
</style>