<template>
  <div class="senior-setup">
    <el-form label-position="top" label-width="80px">
      <el-form-item label="审批同意时是否签字">
        <template slot="label">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-setting-user"></use>
          </svg>
          撤销设置
        </template>
        <el-switch active-text="允许撤销指定审批节点未结束的申请"
                   v-model="setup.undo"></el-switch>
        <div class="sign-tip">该节点第一个审批人未提交审批结果前，申请人可以撤销申请（配置前已发起的申请不生效）</div>
        <span style="display: inline-block;font-size:14px;margin: 24px 10px 0 0;">指定节点 </span>
        <el-select v-model="setup.target" @visible-change="visibleChange" placeholder="请选择指定节点" size="medium" class="is-dark input" style="width: 250px;">
          <el-option v-for="(op, index) in nodes" :key="index" :label="op.name" :value="op.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "FormProSetting",
  data() {
    return {
      showSelect: false,
      nodes: []
    }
  },
  computed: {
    setup() {
      return this.$store.state.design.settings || {};
    },
    nodeMap() {
      return this.$store.state.nodeMap
    },
    // nodes: {
    //   get() {
    //     return this.getNodes()
    //   },
    //   set() {}
    // }
  },
  methods: {
    validate(){
      return []
    },
    visibleChange(show) {
      if (show) {
        this.nodes = this.getNodes()
      }
    },
    getNodes() {
      const tempNodes = []
      this.nodeMap.forEach(value => {
        if (['ROOT', 'CC', 'APPROVAL', 'APPROVAL-TWO'].includes(value?.type)) {
          tempNodes.push({
            name: value.name,
            id: value.id
          })
        }
      })
      return JSON.parse(JSON.stringify(tempNodes))
    }
  }
}
</script>

<style lang="less" scoped>
.senior-setup {
  overflow: auto;
  margin: 0 auto;
  width: 600px;
  height: calc(100vh - 105px);
  background: #ffffff;
  margin-top: 10px;
  padding: 15px 20px;

  .sign-tip {
    color: #949495;
    font-size: small;
    margin-left: 20px;
  }
}
svg {
  position: relative;
  top: 4px;
  width: 24px;
  height: 24px;
}
/deep/.el-switch__label.el-switch__label--right.is-active {
  color: #2D5CF6;
}
</style>
