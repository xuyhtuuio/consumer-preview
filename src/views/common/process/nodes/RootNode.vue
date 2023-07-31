<template>
  <node :title="config.name" :is-root="true" :content="content"
        @selected="$emit('selected')" @insertNode="type => $emit('insertNode', type)"
        placeholder="所有人" header-bgc="#576a95" header-icon="#icon-user"/>
</template>

<script>
import Node from './Node'

export default {
  name: "RootNode",
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
    }
  },
  computed:{
    content(){
      return this.config.props.assignedUser.map(item => item.label).join('、') || ''
    }
  },
  // watch: {
  //   config: {
  //     handler(val) {
  //       console.log(val)
  //     },
  //     immediate: true,
  //     deep: true
  //   }
  // },
  methods: {}
}
</script>

<style scoped>

</style>
