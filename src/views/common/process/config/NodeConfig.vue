<template>
  <div>
    <!-- <el-tabs v-model="active" v-if="name && formConfig.length > 0"> -->
    <el-tabs v-model="active" v-if="name">
      <el-tab-pane :label="name" name="properties">
        <component :is="(selectNode.type||'').toLowerCase()" :nodeName="nodeName" :config="selectNode.props" @changeTargetPage="changeTargetPage"/>
      </el-tab-pane>
      <el-tab-pane label="表单权限设置" name="permissions">
        <form-authority-config ref="formAuthorityConfig" :nodeName="nodeName"/>
      </el-tab-pane>
    </el-tabs>
    <component :is="(selectNode.type||'').toLowerCase()" v-else :nodeName="nodeName"  :config="selectNode.props"/>
  </div>
</template>

<script>
import Approval from './ApprovalNodeConfig'
import Condition from './ConditionNodeConfig'
import Delay from './DelayNodeConfig'
import Cc from './CcNodeConfig'
import ApprovalTwo from './ApprovalTwoNodeConfig'
import Trigger from './TriggerNodeConfig'
import FormAuthorityConfig from './FormAuthorityConfig'
import Root from './RootNodeConfig'

export default {
  name: 'NodeConfig',
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
    },
    changeTargetPage() {
      this.$refs['formAuthorityConfig'].formPermsLoad()
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
