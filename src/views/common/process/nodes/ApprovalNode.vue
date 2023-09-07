<template>
  <node :key="Math.random() + ''" :title="config.name" :show-error="showError" :content="content" :error-info="errorInfo"
        @selected="$emit('selected')" @delNode="$emit('delNode')" @insertNode="type => $emit('insertNode', type)"
        :placeholder="config.name === '二次会签' ? '请选择二次会签人员' : '请设置审批人'" :header-bgc="config.name === '二次会签' ? '#505968' : '#ff943e'" header-icon="#icon-shenpi"/>
</template>

<script>
import Node from './Node'

export default {
  name: 'ApprovalNode',
  components: { Node },
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showError: false,
      errorInfo: '',
      content: ''
    }
  },
  computed: {
    nodeMap() {
      return this.$store.state.nodeMap
    },
    nodes() {
      const tempNodes = []
      this.nodeMap.forEach(value => {
        if (['ROOT', 'CC', 'APPROVAL', 'APPROVAL-TWO'].includes(value?.type)) {
          tempNodes.push({
            name: value.name,
            id: value.id
          })
        }
      })
      return tempNodes
    },
    assignedUser() {
      return this.$store.state.selectedNode?.props?.assignedUser
    }
  },
  watch: {
    assignedUser: {
      handler(val) {
        this.content = (this.config.props.assignedUser || val || []).map(item => item.label).join('、') || ''
        if (this.config.name === '二次会签') {
          this.content = this.nodes.find(n => (n.id === this.config.props.countersignTarget))?.name
        } else if (this.config.props.assignedType === 'SELECT_NODE') {
          this.content = this.nodes.find(n => (n.id === this.config.props.target))?.name
        }
      },
      immediate: true,
      deep: true
    },
    config: {
      handler() {
        if (this.config.name === '二次会签') {
          this.content = this.nodes.find(n => (n.id === this.config.props.countersignTarget))?.name
        } else if (this.config.props.assignedType === 'SELECT_NODE') {
          this.content = this.nodes.find(n => (n.id === this.config.props.target))?.name
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 校验数据配置的合法性
    validate(err) {
      try {
        this.showError = false
        if (this.config.type === 'APPROVAL') {
          if (!this.config.props.targetPage) {
            err.push(`${this.config.name} 目标页面未配置`)
            this.errorInfo = '目标页面未配置'
            this.showError = true
          }
          if (this.config.props.targetPage !== 'CONFIRM' && this.config.props.refuseWay === 'TO_NODE' && !this.config.props.refuseNode) {
            err.push(`${this.config.name} 未配置驳回到指定节点`)
            this.errorInfo = '未配置驳回到指定节点'
            this.showError = true
          }
          if (this.config.props.targetPage === 'XIAOBAO' && !this.config.props.cpAuthority) {
            err.push(`${this.config.name} 未配置消保审批权限`)
            this.errorInfo = '未配置消保审批权限'
            this.showError = true
          }
          this[`validate_${this.config.props.assignedType}`](err)
        } else {
          // 二次会签
          // eslint-disable-next-line
          if (!this.config.props.countersignTarget) {
            this.errorInfo = '请指定二次会签人员'
            err.push(`${this.config.name} 未指定二次会签人员`)
            this.showError = true
          } else {
            this.showError = false
          }
        }
        return this.showError
      } catch (e) {
        return true;
      }
    },
    // 上一个审批人选中
    validate_SELF_SELECT(err) {
      const msg = '审批'
      if (this.config.props.assignedUser.length === 0) {
        this.errorInfo = `请指定${msg}人员`
        err.push(`${this.config.name} 未指定${msg}人员`)
        this.showError = true
      }
    },
    // 指定人员/角色
    validate_DEPT_USER_ROLE(err) {
      this.validate_SELF_SELECT(err)
    },
    validate_SELECT_NODE(err) {
      if (!this.config.props.target) {
        this.errorInfo = '请指定节点审批人'
        err.push(`${this.config.name} 未指定节点审批人`)
        this.showError = true
      }
    },
    validate_LEADER_TOP() {
      return true;
    },
    validate_LEADER() {
      return true;
    },
    validate_SELF() {
      return true;
    },
    validate_REFUSE() {
      return true;
    },
    validate_ROLE(err) {
      if (this.config.props.role.length <= 0) {
        this.errorInfo = '请指定负责审批的系统角色'
        err.push(`${this.config.name} 未指定审批角色`)
        return false
      }
      return true;
    },
    validate_FORM_USER(err) {
      if (this.config.props.formUser === '') {
        this.errorInfo = '请指定表单中的人员组件'
        err.push(`${this.config.name} 审批人为表单中人员，但未指定`)
        return false
      }
      return true;
    },
  }
}
</script>

<style scoped>

</style>
