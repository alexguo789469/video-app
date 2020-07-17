<template>
  <div id="navbar">
    <div id="logo" @click="pathpush1">
      <img src="../../assets/logo.png" alt />
    </div>
    <div id="searchbar">
      <p>
        <van-icon class="icon" name="search" />
        <span>请输入想搜索的内容</span>
      </p>
    </div>
    <div id="avator">
      <router-link to="/userinfo">
        <img :src="userinfo.user_img" alt v-if="userinfo.user_img" />
        <img src="../../assets/avator.jpg" alt v-else @click="$router.push('/userinfo')" />
      </router-link>

      <p>下载App</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userinfo: {}
    };
  },
  methods: {
    async init() {
      if (localStorage.getItem("token")) {
        const res = await this.$http.get("/user/" + localStorage.getItem("id"));
        this.userinfo = res.data[0];

        this.$emit("getuserinfo", res.data[0]);
      }
    },
    pathpush1() {
      if (this.$route.path != "/") {
        this.$router.push("/");
      }
    },
    pathpush2() {
      if (this.$route.path != "/userinfo") {
        this.$router.push("/userinfo");
      }
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="less">
#navbar {
  height: 12.5vw;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  #logo {
    padding-left: 2.778vw;
  }
  #logo,
  #avator {
    display: flex;
    align-items: center;
  }
  #avator p {
    padding: 1.389vw 5.556vw;
    margin: 0 2.778vw;
    background: #fb7299;
    color: white;
    font-size: 3.611vw;
    border-radius: 0.833vw;
  }
  #avator img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  #searchbar {
    flex: 1;
    p {
      height: 6.667vw;
      background: #f4f4f4;
      margin: 2.778vw 2.778vw;
      border-radius: 2.778vw;
      display: flex;
      align-items: center;
      .icon {
        padding-left: 10px;
        color: #aaa;
      }
      span {
        padding-left: 5px;
        color: #aaa;
        font-size: 8px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 80px;
      }
    }
  }
}
</style>