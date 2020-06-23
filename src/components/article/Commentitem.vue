<template>
  <div class="subCommentContainer">
    <div>
      <div class="subComments" v-for="(item, index) in commentChild" :key="index">
        <div class="sub">
          <p class="subBody">
            <span class="author" v-if="item.userinfo">{{item.userinfo.name}}:</span>
            <span class="author" v-else>此用户未填写姓名:</span>

            <span v-if="!temp" class="content-body">{{item.comment_content}}</span>
            <span v-else class="content-body">
              <span>回复 @{{item.parent_user_info.name}} :</span>
              {{item.comment_content}}
            </span>
            <span class="reply" @click="postReplyComment(item.comment_id)">回复</span>
          </p>
        </div>
        <commentchilditem :commentChild="item.child" :temp="true" @postchild="postchild"></commentchilditem>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "commentchilditem",
  props: ["commentChild", "temp"],
  methods: {
    postReplyComment(id){
      //和顺序没关系
      this.$emit('postchild', id);
      this.$emit("postPrimary", id);
    },
    postchild(id){
      this.postReplyComment(id);
    }
    
  },
};
</script>

<style lang="less">
.subCommentContainer {
  .subComments {
    .sub {
      margin-bottom: 10px;
      position: relative;
      .subBody {
        width: 230px;

        .author {
          color: #5090cc;
          font-size: 13px;
        }
        .subBody {
          color: #212121;
          font-size: 13px;
        }
        .content-body {
          position: relative;
          flex: 1;
          font-size: 13px;
        }
        .reply {
          position: absolute;
          right: 10px;
          font-size: 13px;
          color: red;
        }
      }
    }
  }
}
</style>