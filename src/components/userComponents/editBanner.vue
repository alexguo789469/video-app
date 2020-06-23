<template>
    <div>
        <div class="edit-container" @click="bannerclick">
            <span>{{left}}</span>
            <span>
                <slot name="right"></slot>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: ["left"],
    methods: {
        bannerclick(){
            this.$emit('bannerclick')
        }
    },
}
</script>

<style lang="less">
.edit-container{
    padding: 4.167vw;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.278vw solid #eee;
}
</style>