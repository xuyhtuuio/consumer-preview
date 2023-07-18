<template>
  <node :title="config.name" :is-root="true" :content="content"
        @selected="$emit('selected')" @insertNode="type => $emit('insertNode', type)"
        :placeholder="config.name === '确认人' ? '发起人' : '所有人'" header-bgc="#576a95" header-icon="#icon-user"/>
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
      this.config
    }
  },
  watch: {
    config(val) {
      console.log(val)
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
