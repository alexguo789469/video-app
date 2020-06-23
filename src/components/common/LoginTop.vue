<template>
    <div class="top-container">
        <div></div>
        <div class="loginTop">
            {{head}}
        </div>
        <div>
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: ["head"]
}
</script>

<style lang="less">
.top-container{
    display: flex;
    justify-content: space-between;
    background: white;
    div{
        width: 33.3%;
        flex: 1;
        div{
            line-height: 12.5vw;
            text-align: center;
            font-size: 13px;
            width: 100%;
            padding-right: 10px;
        }
    }
    .loginTop{
    line-height: 12.5vw;
    text-align: center;
    font-size: 4.4vw;
}
}
 
</style>