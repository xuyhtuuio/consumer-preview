<template>
  <div>
    <!-- <el-tabs v-model="active" v-if="name && formConfig.length > 0"> -->
    <el-tabs v-model="active" v-if="name">
      <el-tab-pane :label="name" name="properties">
        <component :is="(selectNode.type||'').toLowerCase()" :nodeName="nodeName" :config="selectNode.props"/>
      </el-tab-pane>
      <el-tab-pane label="表单权限设置" name="permissions">
        <form-authority-config/>
      </el-tab-pane>
    </el-tabs>
    <component :is="(selectNode.type||'').toLowerCase()" v-else :nodeName="nodeName"  :config="selectNode.props"/>
  </div>
</template>

<script>
import Approval from './ApprovalNodeConfig.vue'
import Condition from './ConditionNodeConfig.vue'
import Delay from './DelayNodeConfig.vue'
import Cc from './CcNodeConfig.vue'
import ApprovalTwo from './ApprovalTwoNodeConfig.vue'
import Trigger from './TriggerNodeConfig.vue'
import FormAuthorityConfig from './FormAuthorityConfig.vue'
import Root from './RootNodeConfig.vue'

export default {
  name: "NodeConfig",
  components: {
    Approval,
    ApprovalTwo,
    ApprovalConfirm: Approval,
    Condition,
    Trigger,
    Delay,
    Root,
    Cc,
    FormAuthorityConfig
  },
  data() {
    return {
      active: 'properties'
    }
  },
  computed: {
    selectNode() {
      return this.$store.state.selectedNode
    },
    formConfig() {
      return this.$store.state.design.formItems
    },
    nodeName() {
      return this.selectNode.name;
    },
    name() {
      console.log(this.selectNode)
      switch (this.selectNode.type) {
        case 'ROOT':
          return '设置' + this.selectNode.name;
        case 'CC':
          return '设置' + this.selectNode.name;
        case 'APPROVAL':
          return '设置审批人';
        case 'APPROVAL-TWO':
          return '二次会签';
        default:
          return null;
      }
    }
  },
  methods: {
    getIsActive(active) {
      this.active = active
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-tabs__header {
  .el-tabs__item.is-active {
    color: #2D5CF6;
  }
  .el-tabs__item:hover {
    color: #2D5CF6;
  }
  .el-tabs__active-bar {
    background-color: #2D5CF6;
  }
}
</style>
