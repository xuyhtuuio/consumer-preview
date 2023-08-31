<template>
  <div class="add-tag">
    <div class="left">
      <img class="img" src="@/assets/image/ai-approval/ocr-avatar.png" alt="" />
      <span class="text">{{ fullname }}</span>
    </div>
    <div class="center">
      <div v-show="approverInfo">
        <span class="item"> 总行</span>
        <span class="line">|</span>
        <span class="item"> 财富平台部</span>
        <span class="line">|</span>
        <span class="item">财富客群团队</span>
      </div>
    </div>
    <div class="right">
      <slot>
        <g-button class="btn" @click="save">保存草稿</g-button>
        <g-button class="btn" type="primary" @click="submit">提交</g-button>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fullname: '',
      approverInfo: ''
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      const {
        data: { data }
      } = await this.$http({
        method: 'get',
        url: '/cpr/user/getCurrentUser'
      });
      this.userId = data.id;
      this.fullname = data.fullname;
    },
    submit() {
      this.$emit('submit');
    },
    save() {
      this.$emit('save');
    }
  }
};
</script>

<style lang="less" scoped>
.add-tag {
  display: flex;
  align-items: center;
  width: 100%;
  .left {
    display: flex;
    align-items: center;
    margin: 0 16px;
    .img {
      margin-right: 8px;
      width: 32px;
      height: 32px;
      background-color: #333;
      border-radius: 50%;
      overflow: hidden;
    }
    .text {
      font-weight: 700;
      color: rgba(29, 33, 40, 1);
    }
  }
  .center {
    flex: 1;
    color: rgba(80, 89, 104, 1);

    .line {
      margin: 0 8px;
    }
  }
  .right {
    display: flex;

    .btn {
      &:not(:last-child) {
        margin-right: 8px;
      }
    }
  }
}

</style>