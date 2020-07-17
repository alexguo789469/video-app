<template>
    <div id="infocontainer">
        <nav-bar @getuserinfo="getuserinfo"></nav-bar>
       

        <img src="http://s1.hdslb.com/bfs/static/jinkela/mstation-h5/asserts/bannerTop_new.png" alt="">
            <div class="userinfocontainer">
                    <div class="face">
                        <img :src="model.user_img" alt="" v-if="model.user_img">
                        <img src="../assets/avator.png" alt="" v-else>
                        <div class="relation">
                            <div class="count">
                                <div class="fans">
                                    <p style="color: black">5</p>
                                    <p>粉丝</p>
                                </div>
                                <div class="follows">
                                    <p style="color: black">5</p>
                                    <p>关注</p>
                                </div>
                                <div class="likes">
                                    <p style="color: black">5</p>
                                    <p>获赞</p>
                                </div>
                            </div>
                            <div class="followbtn">
                                <button class="editprofile" @click="$router.push('/edit')">编辑资料</button>
                            </div>
                        </div>
                    </div>


                <div class="userprofile">
                    <div class="username">{{model.name}}</div>
                    <div class="description" v-if="model.user_desc">{{model.user_desc}}</div>
                    <div class="description" v-else>这个人很懒，什么都没写</div>
                </div>

            </div> 
    </div>
</template>

<script>
import NavBar from '../components/common/NavBar'

export default {
    components:{
        NavBar
    },
    data() {
        return {
            model: {}
        }
    },
    methods: {
        // async userinfo(){
        //     const res = await this.$http.get('/user/' + localStorage.getItem('id'))
        //     this.model = res.data[0];
        // }
        getuserinfo(userinfo){
            this.model = userinfo;
        }
    },

}
</script>

<style lang="less">
#infocontainer{
    width: 100%;
    img{
        width: 100%;
    }
    .userinfocontainer{
        transform: translateY(-50px);
        background-color: #fff;
        .face{
                display: flex;
                justify-content: space-between;
                img{
                    width: 84px;
                    height: 84px;
                    margin-left: 10px;
                    border-radius: 50%;
                }
                .relation{
                    .count{
                        display: flex;
                        
                        .fans, .follows, .likes{
                            padding: 0 20px;
                            margin: 10px 0;
                            text-align: center;
                            color: #aaa;
                            font-size: 13px;
                        }
                        .fans, .follows{
                            border-right: 0.5px solid #999999;
                        }
                    }
                    .followbtn{
                        .editprofile{
                            width: 220px;
                            height: 30px;
                            background-color: #fff;
                            color: #FB7299;
                            border: 1px solid #FB7299;
                            margin-right: 5px;
                            border-radius: 3px;
                        }
                    }
                }
            
        }
        .userprofile{
            .username{
                color: #212121;
                margin-top: 10px;
                padding: 5px 10px;
                font-size: 18px;
            }
            .description{
                color: #999999;
                padding: 5px 10px;
                font-size: 13px;
            }
        }
    }
   
}
 
</style>