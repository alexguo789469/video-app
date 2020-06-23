<template>
    <div>
        <van-field v-model="text" 
        :label="label"
        :type="type"
        :placeholder="placeholder"
        :rule="rule" 
        />
    </div>
</template>

<script>
export default {
    props: ["label", "placeholder", "type", "rule"],
    data() {
        return {
            text: ""
        }
    },
    methods: {
        handler(){
            this.$emit("submit", this.text)

        }
    },
    watch: {
        text(){
            this.handler()
        }
    },
}
</script>

<style lang="less">
    
</style>