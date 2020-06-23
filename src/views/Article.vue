<template>
  <div v-if="model">
    <nav-bar></nav-bar>
    <div>
      <div class="video-container">
        <video :src="model.content" controls="controls"></video>
      </div>
      <div class="detailinfotext">
        <div class="name">
          <span>{{model.category.title}}</span>
          <span>{{model.name}}</span>
        </div>
        <div class="userdata">
          <span>{{model.userinfo.name}}</span>
          <span>146.4万次观看</span>
          <span>528弹幕</span>
          <span>{{model.date}}</span>
        </div>

        <div class="count">
          <span>
            <svg
              t="1592735477808"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2722"
              width="20"
              height="20"
            >
              <path
                d="M884.875894 423.143253 646.970506 423.143253c92.185562-340.464205-63.516616-357.853247-63.516616-357.853247-65.993017 0-52.312436 52.182476-57.3031 60.881602 0 166.502152-176.849824 296.971645-176.849824 296.971645l0 472.171899c0 46.607504 63.516616 63.393819 88.433098 63.393819l357.452111 0c33.641191 0 61.036122-88.224344 61.036122-88.224344 88.434122-300.70569 88.434122-390.177444 88.434122-390.177444C944.657442 418.179195 884.875894 423.143253 884.875894 423.143253L884.875894 423.143253 884.875894 423.143253zM884.875894 423.143253"
                p-id="2723"
              />
              <path
                d="M251.671415 423.299819 109.214912 423.299819c-29.420053 0-29.873378 28.89612-29.873378 28.89612l29.420053 476.202703c0 30.309306 30.361495 30.309306 30.361495 30.309306L262.420223 958.707948c25.686009 0 25.458835-20.049638 25.458835-20.049638L287.879058 459.411271C287.879058 422.837284 251.671415 423.299819 251.671415 423.299819L251.671415 423.299819 251.671415 423.299819zM251.671415 423.299819"
                p-id="2724"
              />
            </svg>
            点赞
          </span>
          <span @click="collection" :class="{activeCollection: collectionStatus}">
            <svg
              t="1592734003184"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1920"
              width="20"
              height="20"
            >
              <path
                d="M327.728136 804.301276l150.60509-60.966537 33.721009-13.627369 33.721009 13.627369 150.609183 60.914348-4.484128-166.562527-0.907673-32.985252 20.663622-25.711592 96.563266-120.353089L652.842749 411.574776l-30.030967-9.081843-17.825994-25.716708-92.931552-134.033669-92.871177 134.033669-17.825994 25.716708-30.033014 9.081843-155.490354 47.120181 96.566336 120.29476 20.663622 25.711592-0.907673 32.985252L327.728136 804.301276M789.940197 939.129031 512.054235 826.727031 234.17339 939.129031l8.115841-303.886125L62.389956 411.175687l282.879696-85.667102L512.054235 84.869946l166.843936 240.638639 282.711873 85.667102L781.766027 635.243929 789.940197 939.129031 789.940197 939.129031 789.940197 939.129031z"
                p-id="1921"
              />
            </svg>
            收藏
          </span>
          <span>
            <img src="../assets/download.png" alt width="20px" height="20px" />
            下载
          </span>

          <span style="color: black" @click="subscribe" :class="{activeCollection: subscribeStatus}">
              关注此用户
          </span>
        </div>
      </div>

      <div class="button">
        <div class="video" :class="{active: flag}" @click="flag=true; componentId='recvideo'">相关推荐</div>
        <div
          class="comment"
          :class="{active: !flag}"
          @click="flag=false; componentId='comment'"
        >评论1.5万</div>
      </div>

      <component :is="componentId" :articleid="$route.params.id"></component>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/common/NavBar";
import Recvideo from "../components/article/Recvideo";
import Comment from "../components/article/Comment";

export default {
  data() {
    return {
      model: null,
      flag: true,
      componentId: "recvideo",
      collectionStatus: null,
      subscribeStatus: null
    };
  },
  methods: {
    async articleItemDate() {
      const res = await this.$http.get("/article/" + this.$route.params.id);
      this.model = res.data[0];

      this.subscribeInit();
    },
    //收藏文章
    async collection() {
      if (!localStorage.getItem("id") || !localStorage.getItem("token")) {
        return this.$errMsg.fail("请先登录！");
      }
      const res = await this.$http.post(
        "/collection/" + localStorage.getItem("id"),
        { article_id: this.$route.params.id }
      );
      console.log(res);
      if (res.data.msg == "收藏成功") {
        this.collectionStatus = true;
      } else {
        this.collectionStatus = false;
      }

      this.$errMsg.fail(res.data.msg);
    },
    //初始化，看用户是否收藏了此文章
    async collectionInit() {
      if (localStorage.getItem("token")) {
        const res = await this.$http.get(
          "/collection/" + localStorage.getItem("id"),{
              params: { article_id: this.$route.params.id }
          }
        );
        this.collectionStatus = res.data.success;
      }
    },

    //关注用户
    async subscribe(){
        if(!localStorage.getItem("id") || !localStorage.getItem("token")){
            return this.$errMsg.fail("请先登录");
        }
        const res = await this.$http.post("/sub_scription/" + localStorage.getItem("id"), 
        {sub_id: this.model.userid});
        console.log(res);
        if(res.data.msg == "关注成功"){
            this.subscribeStatus = true;
        }else{
            this.subscribeStatus = false;
        }
        this.$errMsg.fail(res.data.msg);
    },

    //用户关注初始化
    async subscribeInit(){
        if(localStorage.getItem("id")){
            const res = await this.$http.get("/sub_scription/" + localStorage.getItem("id"), {
                params: {sub_id: this.model.userid}
            });
            this.subscribeStatus = res.data.success;
        }
    }
  },
  created() {
    this.articleItemDate();
    this.collectionInit();
  },
  components: {
    NavBar,
    Comment,
    Recvideo
  },
  watch: {
      //切换文章的时候关注
    $route() {
      this.articleItemDate();
      this.collectionInit();
    }
  }
};
</script>

<style scoped lang="less">
.video-container {
  video {
    width: 100%;
  }
}
.detailinfotext {
  font-size: 16px;
  color: #212121;
  padding: 13px;
  background-color: #fff;
  .name {
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    span:nth-child(1) {
      font-size: 12px;
      color: #fb7299;
      background: #f4f4f4;
      line-height: 24px;
      border-radius: 8px;
      padding: 0 6px;
    }
    span:nth-child(2) {
      font-size: 16px;
      padding-left: 8px;
    }
  }
  .userdata {
    font-size: 12px;
    span:nth-child(1) {
      color: #212121;
      padding-left: 5px;
    }
    span:nth-child(2) {
      color: #999;
      padding: 0 7px 0 14px;
    }
    span:nth-child(3) {
      color: #999;
    }
    span:nth-child(4) {
      color: #999;
      padding-left: 7px;
    }
  }
  .count {
    padding-top: 10px;
    display: flex;
    padding-left: 5px;
    span {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #999;
      padding-right: 10px;
    }
  }
}
.button {
  background: white;
  display: flex;
  div {
    color: #505050;
    width: 50%;
    text-align: center;
    font-size: 14px;
    line-height: 40px;
  }
}
.active {
  color: #fb7299 !important;
  border-bottom: 1px solid #fb7299;
}
.activeCollection {
  color: #fb7299 !important;
}
</style>