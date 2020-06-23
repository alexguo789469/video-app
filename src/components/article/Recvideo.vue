<template>
    <div>
        <div class="recommendation">
            <cover :detailitem="item" v-for="(item, index) in commendList" :key="index"></cover>
        </div>
    </div>
</template>

<script>
import Cover from '../../views/Cover'
export default {
    components: {
        Cover
    },
    data() {
        return {
            commendList: []
        }
    },
    methods: {
        async commendData(){
            const res = await this.$http.get('/commend');
            this.commendList = res.data;
        },
  
    },
    created() {
        this.commendData();
    },
    watch: {
        //同一组件created只执行一次，所以要监控，每当路由发生变化的时候，再调用方法
        //会触发新的ajax请求
        $route(){
            this.commendData();
        }
    },
}
</script>

<style lang="less">
.recommendation{
    background-color: #fff;
}
</style>