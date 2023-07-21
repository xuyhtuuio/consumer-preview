<template>
  <node :title="config.name" :show-error="showError" :content="content" :error-info="errorInfo"
        @selected="$emit('selected')" @delNode="$emit('delNode')" @insertNode="type => $emit('insertNode', type)"
        :placeholder="config.name === '二次会签' ? '指定节点审批人' : '请设置审批人'" :header-bgc="config.name === '二次会签' ? '#505968' : '#ff943e'" header-icon="#icon-shenpi"/>
</template>

<script>
import Node from './Node'

export default {
  name: "ApprovalNode",
  props:{
    config:{
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {Node},
  data() {
    return {
      showError: false,
      errorInfo: '',
    }
  },
  computed:{
    content(){
      return this.config.props.assignedUser.map(item => item.label).join('、') || ''
    }
  },
  methods: {
    //校验数据配置的合法性
    validate(){
      try {
        return this.showError = !this[`validate_${this.config.assignedType}`]()
      } catch (e) {
        return true;
      }
    },
    validate_ASSIGN_USER(){
      return true;
      if(this.config.assignedUser && this.config.assignedUser.length > 0){
        return true;
      }else {
        //this.$message.warning("请设置审批人")
      }
    },
    validate_SELF_SELECT(){
      return true;
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
  }
}
</script>

<style scoped>

</style>
