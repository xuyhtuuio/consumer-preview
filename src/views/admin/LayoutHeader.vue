<template>
  <div>
    <div class="header">
      <el-menu :default-active="value" active-text-color="#165DFF" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="baseSetting" @click="to('baseSetting')"><span class="num">1</span> 基础设置</el-menu-item>
        <span style="position: relative; top: 20px;">></span>
        <!-- <el-menu-item index="/admin/design/formSetting" @click="to('/admin/design/formSetting')">④ 表单设计</el-menu-item> -->
        <el-menu-item index="processDesign" @click="to('processDesign')"><span class="num">2</span> 流程设计
        </el-menu-item>
        <span style="position: relative; top: 20px;">></span>
        <el-menu-item index="proSetting" @click="to('proSetting')"><span class="num">3</span> 高级设置</el-menu-item>
      </el-menu>
      <div class="publish" v-if="editAuth">
        <el-button size="mini" @click="save"><i class="el-icon-folder-opened"></i>保存</el-button>
        <el-button size="mini" type="primary" :disabled="setup.processDefinitionId" @click="publish"><i class="el-icon-s-promotion"></i>{{ setup.processDefinitionId ? '已发布' : '发布' }}</el-button>
      </div>
      <div class="back">
        <el-button @click="exit" size="small" icon="el-icon-arrow-left" circle style="line-height: 12px;padding: 7px;background: #F7F8FA;border:none;margin-right: 12px;"></el-button>
        <span>
          <span>消保审批</span>
        </span>
      </div>
    </div>
    <secondary-confirmation :option="confirmOption" ref="confirmation" @handleClose="handleClose" @handleConfirm="handleStop(confirmOption)"></secondary-confirmation>
  </div>
</template>

<script>
import secondaryConfirmation from '@/components/common/secondaryConfirmation'
export default {
  name: 'LayoutHeader',
  components: {
    secondaryConfirmation
  },
  props: {
    value: {
      type: String,
      default: 'baseSetting'
    }
  },
  data() {
    return {
      viewCode: false,
      confirmOption: {
        message: '当前流程未保存，是否保存？',
        cancelBtn: '不保存',
        confirmBtn: '保存'
      }
    };
  },
  computed: {
    setup() {
      return this.$store.state.design
    },
    editAuth() {
      const { permissionsPage = {} } = this.$store.state
      const flowManage = [...permissionsPage.funPerms, ...permissionsPage.defaultPerm]?.find(item => item.pathName === 'FlowManage') || {}
      if (flowManage.type === 'edit') {
        return true
      }
      return false
    }
  },
  created() {
    this.check()
  },
  mounted() {
    if (document.body.offsetWidth <= 970) {
      this.$msgbox.alert('本设计器未适配中小屏幕，建议您在PC电脑端浏览器进行操作')
    }
    this.listener()
  },
  methods: {
    publish() {
      this.$emit('publish')
    },
    save() {
      this.$emit('save')
    },
    valid() {
      return true;
    },
    handleStop() {
      this.$emit('save', () => {
        this.$router.push({ name: 'FlowManage' })
      })
    },
    handleClose() {
      this.$router.push({ name: 'FlowManage' })
    },
    exit() {
      if (this.$store.state.designSave === JSON.stringify(this.$store.state.design)) {
        this.$router.push({ name: 'FlowManage' })
        return;
      }
      this.$refs.confirmation.dialogVisible = true;
    },
    to(name) {
      if (name !== this.$route.name) {
        this.$router.push({ name, query: { ...this.$route.query } });
        this.$emit('changeRoute', name)
      }
    },
    listener() {
      window.onunload = this.closeBefore()
      window.onbeforeunload = this.closeBefore()
      // window.on('beforeunload',this.closeBefore())
    },
    closeBefore() {
      // alert("您将要离开本页")
      return false
    },
    check() {
      if (this.$store.state.isEdit === null) {
        // this.$router.push("/workPanel");
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "@/assets/global";

/deep/ .header {
  position: fixed;
  top: 0;
  width: 100vw;
  margin: -15px -100px 0;
  // min-width: 980px;
  position: relative;
  height: 60px;
  background: #ffffff;

  .el-menu {
    top: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    width: 100%;
    border-bottom: none;
    .el-menu-item {
      height: 50px !important;
      line-height: 50px !important;
      .num {
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 100%;
        background: #F2F3F5;
      }
    }
    .el-menu-item.is-active {
      .num {
        background: #165DFF;
        color: #ffffff;
      }
    }
  }

  .publish {
    position: absolute;
    top: 15px;
    right: 20px;
    z-index: 1000;

    i {
      margin-right: 6px;
    }

    button {
      padding: 4px 15px;
      border-radius: 15px;
    }
  }

  .back {
    position: absolute;
    z-index: 1000;
    top: 16px;
    left: 20px;
    font-size: small;

    span {
      i {
        border-radius: 10px;
        padding: 7.8px;
        font-size: 20px;
        color: #ffffff;
        margin: 0 10px;
      }
    }

  }
}
</style>
<style lang="less">
.back-confim {
  .el-message-box__status.el-icon-warning {
    left: 32px;
  }
}
</style>
