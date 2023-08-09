<template>
  <node :title="config.name" :show-error="showError" :content="content" :error-info="errorInfo"
        @selected="$emit('selected')" @delNode="$emit('delNode')" @insertNode="type => $emit('insertNode', type)"
        placeholder="请设置抄送人" header-bgc="#2D5CF6" header-icon="#icon-stamp"/>
</template>

<script>
import Node from './Node'

export default {
  name: "CcNode",
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
      content: ''
    }
  },
  computed:{
    assignedUser() {
      return this.$store.state.selectedNode?.props?.assignedUser
    },
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
  },
  watch: {
    assignedUser: {
      handler() {
        this.content = (this.config.props.assignedUser || []).map(item => item.label).join('、') || ''
        if (this.$store.state.selectedNode.id !== this.config.id || this.config.name === '二次会签') {
          return;
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    //校验数据配置的合法性
    validate(){
      this.showError = false
      if(this.config.assignedUser && this.config.assignedUser.length > 0){
        this.showError = false
      }else {
        this.showError = true
        this.errorInfo = '请选择需要抄送的人员'
      }
      return !this.showError
    }
  }
}
</script>

<style scoped>

</style>
