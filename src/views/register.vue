<template>
    <div>
        <top head="注册bilibili">
            <div slot="right" @click="$router.push('/login')">切换到登录</div>
        </top>

        <bodycontent 
        label="姓名"
        placeholder="请输入姓名"
        style="margin-top: 2vw"
        rule="^.{6,16}$"
        @submit="res => model.name=res"
        ></bodycontent>

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

        <login-button name="注册" @registerSubmit="registerSubmit"></login-button>
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
            let rule = /^.{6,16}$/
            if(
            rule.test(this.model.name) && 
            rule.test(this.model.username) && 
            rule.test(this.model.password)){
                await this.$http.post('/register', this.model).then(res => {
                    this.$errMsg.fail(res.data.msg);

                    if(res.data.code == 200){
                        localStorage.setItem("id", res.data.id);
                        localStorage.setItem("token", res.data.objtoken);

                        setTimeout(() => {
                            this.$router.push('/userinfo')
                        }, 1000)
                    }
                })
            }else{
                this.$errMsg.fail("格式不正确，请重新输入")
            }
        }
    },
    data() {
        return {
            model: {
                name: "",
                username: "",
                password: ""
            }
        }
    },
}
</script>

<style>
    
</style>