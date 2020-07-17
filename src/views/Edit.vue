<template>
    <div>
        <nav-bar @getuserinfo="selectUser"></nav-bar>

        <div class="avator-container">
            <van-uploader :after-read="afterRead" class="uploadimg"></van-uploader>
            <edit-banner left="头像" style="margin-top: 10px" class="edit-banner">
                <img :src="model.user_img" alt="" slot="right" height="46px" width="46px" style="border-radius: 50%" v-if="model.user_img">
                <img src="../assets/avator.png" alt="" slot="right" height="46px" width="46px"  style="border-radius: 50%" v-else>
            </edit-banner>
        </div>

        <edit-banner left="昵称" @bannerclick="() => show=true">
            <a href="javascript:;" slot="right">{{model.name}}</a>
        </edit-banner>
        <edit-banner left="账号">
            <a href="javascript:;" slot="right">{{model.username}}</a>
        </edit-banner>

        <edit-banner left="性别" @bannerclick="gendershow=true" >
                <a href="javascript:;" slot="right" v-if="model.gender==1">男</a>
                <a href="javascript:;" slot="right" v-else>女</a>
        </edit-banner>

                   


        <edit-banner left="个性签名" @bannerclick="descShow=true">
            <a href="javascript:;" slot="right" class="signature">{{model.user_desc}}</a>
        </edit-banner>
        

        <van-dialog v-model="show" title="昵称" show-cancel-button @confirm="confirm">
            <van-field v-model="value" placeholder="请输入昵称" />
        </van-dialog>


        
        <van-dialog v-model="descShow" title="个性签名" show-cancel-button @confirm="confirm">
            <van-field v-model="descValue" placeholder="请输入个性签名" />
        </van-dialog>


        <van-action-sheet
            v-model="gendershow"
            :actions = "actions"
            cancel-text="取消"
            close-on-click-action
            @select="onSelect"
            />

        <div class="btn" @click="$router.back()">返回空间</div>
    </div>
</template>

<script>
import NavBar from '../components/common/NavBar'
import editBanner from '../components/userComponents/editBanner'
export default {
    components: {
        NavBar,
        editBanner
    },
    data() {
        return {
            model: {},
            show: false,
            value:  "",
            descShow: false,
            descValue: "",
            gendershow: false,
            actions: [ { name: '男', val: "1"},
            { name: '女', val: "0"}
            ]

        }
    },

    methods: {
        //获取用户数据
        selectUser(data){
            //这里还可以用兄弟组件传值
            // const res = await this.$http.get('/user/' + localStorage.getItem('id'));
            // this.model = res.data[0];
            this.model = data;
            this.value = this.model.name;
            this.descValue = this.model.user_desc;
        },
        //上传头像
        async afterRead(file){
            const formData = new FormData();
            formData.append('file', file.file);
            const res = await this.$http.post('/upload', formData);
            this.model.user_img = res.data.url;
            this.userUpdate();
        },
        //更新信息
        async userUpdate(){
            await this.$http.post('/update/' + localStorage.getItem('id'), this.model)
        },
        confirm(){
            this.model.name = this.value;
            this.model.user_desc = this.descValue;
            this.userUpdate();
        },
        onSelect(data){
            console.log(data);
            this.model.gender = data.val;
            this.userUpdate();
        }
    },
}
</script>

<style lang="less" scoped>
a{
    text-decoration: none;
    color: black;
}
.avator-container{
    .uploadimg{
        position: absolute;
        z-index: 1;
        right: 0;
        opacity: 0;
    }
    .edit-banner{
        position: relative;
    }
}
.signature{
    width: 50vw; 
    display: block; 
    white-space: nowrap; 
    text-overflow:ellipsis;
    overflow: hidden;
    text-align: right;
}
.btn{
    margin-top: 20px;
    background: white;
    text-align: center;
    line-height: 40px;
}
</style>