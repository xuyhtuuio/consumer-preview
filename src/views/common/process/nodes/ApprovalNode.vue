<template>
  <node :title="config.name" :show-error="showError" :content="content" :error-info="errorInfo"
        @selected="$emit('selected')" @delNode="$emit('delNode')" @insertNode="type => $emit('insertNode', type)"
        :placeholder="config.name === '二次会签' ? '指定节点审批人' : '请设置审批人'" :header-bgc="config.name === '二次会签' ? '#505968' : '#ff943e'" header-icon="#icon-shenpi"/>
</template>

<script>
import Node from './Node'

export default {
  name: "ApprovalNode",
  components: {Node},
  props:{
    config:{
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
    }
  },
  computed:{
    nodeMap() {
      return this.$store.state.nodeMap
    },
    nodes() {
      const tempNodes = []
      this.nodeMap.forEach(value => {
        if (['ROOT', 'CC', 'APPROVAL', 'APPROVAL-TWO', 'APPROVAL-CONFIRM'].includes(value?.type)) {
          tempNodes.push({
            name: value.name,
            id: value.id
          })
        }
      })
      return tempNodes
    },
    content(){
      // console.log(this.config.name, this.config.props.assignedUser)
      if (this.config.name === '二次会签') {
        return this.nodes.find(n => (n.id === this.config.props.nodeId))?.name
      }
      return this.config.props.assignedUser.map(item => item.label).join('、') || ''
    }
  },
  methods: {
    //校验数据配置的合法性
    validate(err){
      try {
        console.log(this.config.props.assignedType)
        return this.showError = !this[`validate_${this.config.props.assignedType}`](err)
      } catch (e) {
        return true;
      }
    },
    // 上一个审批人选中
    validate_SELF_SELECT(err){
      console.log('this.config.props.assignedUser', this.config.props.assignedUser)
      if (this.config.name === '二次会签' && this.config.props.nodeId) {
        return true;
      }
      if(this.config.name !== '二次会签' && this.config.props.assignedUser.length > 0){
        return true;
      }else {
        this.errorInfo = '请指定审批人员'
        err.push(`${this.config.name} 未指定审批人员`)
        return false
      }
    },
    // 指定人员/角色
    validate_USER_ROLE(err) {
      this.validate_SELF_SELECT(err)
    },
    validate_SELECT_NODE(err) {
      if(this.config.props.nodeId){
        return true;
      }else {
        this.errorInfo = '请指定节点审批人'
        err.push(`${this.config.name} 未指定节点审批人`)
        return false
      }
    },
    validate_LEADER_TOP(){
      return true;
    },
    validate_LEADER(){
      return true;
    },
    validate_ROLE(){
      return true;
    },
    validate_SELF(){
      return true;
    },
    validate_REFUSE(){
      return true;
    },
    validate_ROLE(err){
      if (this.config.props.role.length <= 0){
        this.errorInfo = '请指定负责审批的系统角色'
        err.push(`${this.config.name} 未指定审批角色`)
        return false
      }
      return true;
    },
    validate_FORM_USER(err){
     if (this.config.props.formUser === ''){
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
