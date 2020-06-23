<template>
    <div>
        <top head="登录bilibili">
            <div slot="right" @click="$router.push('/register')">切换到注册</div>
        </top>


        <bodycontent 
        label="用户名"
        placeholder="请输入用户名"
        style="margin-top: 2vw"
        rule="^.{6,16}$"
        @submit="res => model.username=res"
        ></bodycontent>


        <bodycontent 
        label="密码"
        placeholder="请输入密码"
        type="password"
        rule="^.{6,16}$"
        @submit="res => model.password=res"
        ></bodycontent>

        <login-button name="登录" @registerSubmit="registerSubmit"></login-button>
    </div>
</template>

<script>
import top from "../components/common/LoginTop"
import bodycontent from "../components/common/LoginText"
import LoginButton from '../components/common/LoginBtn'
export default {
    components: {
        top,
        bodycontent,
        LoginButton
    },
    methods: {
        async registerSubmit(){
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
            
        }
    },
    data() {
        return {
            model: {
                username: "",
                password: ""
            }
        }
    },
}
</script>

<style>
    
</style>