<template>
    <div class="loginContainer">
       <div class="loginBtn" @click="registerClick">{{name}}</div>
    </div>
</template>

<script>
export default {
    props: ["name"],
    methods: {
        registerClick(){
            this.$emit("registerSubmit")
        }
    },
}
</script>

<style scoped>
.loginContainer{
    padding: 4.167vw 2.778vw;
}
.loginBtn{
    height: 12.5vw;
    background: #ff9db5;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6.25vw;
}
</style>