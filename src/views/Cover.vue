<template>
    <div @click="pathpush">
        <div class="detailparent">
            <div class="imgcontainer">
                <img :src="detailitem.img" alt="">
                <div class="number">
                    <span>1233</span>
                    <span>{{detailitem.commentlen ? 66 : detailitem.commentlen}}</span>
                </div>
            </div>
            <div class="name">{{detailitem.name}}</div>
        </div>
    
    </div>
</template>

<script>
export default {
    props: ['detailitem'],
    methods: {
        //防止点击同一路径两次以上报错
        pathpush(){
            if(this.$route.path != '/article/' + this.detailitem.id ){
                this.$router.push('/article/' + this.detailitem.id)
            }
        }
    },
}
</script>

<style lang="less" scoped>
.detailparent{
    display: flex;
    flex-wrap: wrap;
    width: 44%;
    padding: 15px 10px;
    float: left;
    overflow: hidden;
    .imgcontainer{
        height: 110px;
        img{
            width: 100%;
            display: block;
        }
        .number{
            display: flex;
            justify-content: space-between;
            transform: translateY(-100%);
            padding: 10px 10px;
            background: linear-gradient(0deg,rgba(0,0,0,.85),transparent);
        }
    }
    .name{
        padding-top: 10px;
        font-size: 12px;
        color: #212121;
        text-align: center;
    }
}
</style>