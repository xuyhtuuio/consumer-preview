<template>
  <el-main>
    <!-- <div class="scale">
      <el-button icon="el-icon-plus" size="small" @click="scale += 10" :disabled="scale >= 150" circle></el-button>
      <span>{{ scale }}%</span>
      <el-button icon="el-icon-minus" size="small" @click="scale -= 10" :disabled="scale <= 40" circle></el-button>
      <el-button @click="validate">校验流程</el-button>
    </div> -->
    <div class="design" :style="'transform: scale('+ scale / 100 +');'">
      <process-tree ref="process-tree" @selectedNode="nodeSelected"/>
    </div>
    <el-drawer :title="selectedNode.name" :visible.sync="showConfig"
               :size="selectedNode.type === 'CONDITION' ? '600px':'550px'"
               direction="rtl" :modal="false" destroy-on-close>
      <div slot="title">
        <template v-if="selectedNode.name !== '二次会签'">
          <el-input v-model="selectedNode.name" size="medium" v-show="showInput"
                    style="width: 300px" @blur="showInput = false">
            <i
              class="el-icon-success el-input__icon"
              style="color: #2D5CF6;"
              slot="suffix"
              @click="showInput = false">
            </i>
          </el-input>
          <div @mouseover="isHover = true" @mouseout="isHover=false">
            <div class="header-title" v-show="!showInput" @click="showInput = true" style="font-size: medium">
              {{selectedNode.name}}
              <svg v-if="isHover" class="icon" aria-hidden="true">
                <use xlink:href="#icon-bi"></use>
              </svg>
              <svg v-else class="icon" aria-hidden="true">
                <use xlink:href="#icon-bi1"></use>
              </svg>
            </div>
          </div>
        </template>
        <template v-else>
          <span style="font-size:medium;font-weight:700">
            {{selectedNode.name}}
          </span>
        </template> 
      </div>
      <div class="node-config-content">
        <node-config/>
      </div>
    </el-drawer>
  </el-main>
</template>

<script>
import ProcessTree from './process/ProcessTree.vue'
import NodeConfig from '../../common/process/config/NodeConfig'
//import ProcessTree from '@/views/common/process/FormComponentConfig.vue'

export default {
  name: "ProcessDesign",
  components: {ProcessTree, NodeConfig},
  data() {
    return {
      scale: 100,
      selected: {},
      showInput: false,
      showConfig: false,
      isHover: false
    }
  },
  computed:{
    selectedNode(){
      return this.$store.state.selectedNode
    }
  },
  mounted() {

  },
  methods: {
    validate(){
      this.$refs["process-tree"].validateProcess()
    },
    nodeSelected(node){
      console.log('配置节点', node)
      this.showConfig = true
    }
  },
  watch:{
    selectedNode:{
      deep: true,
      handler(node){
        console.log("更新")
        this.$refs["process-tree"].nodeDomUpdate(node)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-main {
  overflow: auto;
  max-height: calc(100vh - 100px);
}
.design {
  margin-top: 100px;
  display: flex;
  transform-origin: 50% 0px 0px;
}

.scale {
  z-index: 999;
  position: fixed;
  top: 80px;
  right: 40px;

  span {
    margin: 0 10px;
    font-size: 15px;
    color: #7a7a7a;
    width: 50px;
  }
}

.node-config-content{
  padding: 0 20px 20px;
}

/deep/ .el-drawer__body{
  overflow-y: auto;
}
/deep/ .el-input__inner {
  border: 1px solid #2D5CF6;
}
/deep/ .header-title:hover {
  color: #2D5CF6;
  cursor: pointer;
}
</style>
