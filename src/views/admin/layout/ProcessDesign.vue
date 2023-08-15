<template>
  <el-main :style="{ 'height': $route.name !== 'processDesign' ? 'calc(100vh - 300px)' : 'calc(100vh - 100px)' }" class="trs-scroll">
    <!-- <div class="scale">
      <el-button icon="el-icon-plus" size="small" @click="scale += 10" :disabled="scale >= 150" circle></el-button>
      <span>{{ scale }}%</span>
      <el-button icon="el-icon-minus" size="small" @click="scale -= 10" :disabled="scale <= 40" circle></el-button>
      <el-button @click="validate">校验流程</el-button>
    </div> -->
    <div class="op-btns" v-show="from !== 'flowManage'">
      <span class="zoomIn" @click="handleZoom"><i class="el-icon-refresh" />恢复</span>
      <span class="zoomOut" @click="handleZoom(10)"><i class="el-icon-zoom-in" />放大</span>
      <span class="zoomIn" @click="handleZoom(-10)"><i class="el-icon-zoom-out" />缩小</span>
    </div>
    <div class="design" id="design-box" :style="'transform: scale('+ scale / 100 +');'">
      <process-tree v-bind="$attrs" ref="process-tree" @selectedNode="nodeSelected"/>
    </div>
    <el-drawer :title="selectedNode.name" :visible.sync="showConfig"
               :size="selectedNode.type === 'CONDITION' ? '600px':'550px'"
               direction="rtl" :modal="false" destroy-on-close @close="closeConfigDrawer">
      <div slot="title">
        <template v-if="selectedNode.name !== '二次会签' && selectedNode.id !== 'root'">
          <el-input v-model.trim="selectedNode.name" size="medium" v-show="showInput"
                    style="width: 300px">
            <i
              class="el-icon-success el-input__icon"
              style="color: #2D5CF6;"
              slot="suffix"
              @click="saveSelectedNodeName">
            </i>
          </el-input>
          <div @mouseover="isHover = true" @mouseout="isHover=false">
            <div class="header-title" v-show="!showInput" @click="startEditName" style="font-size: medium">
              {{selectedNode.name}}
              <i class="iconfont icon-bi"></i>
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
  props: {
    from: String
  },
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
    disabledForm() {
      return this.$route.name === 'FlowManage'
    },
    selectedNode(){
      return this.$store.state.selectedNode
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
  watch:{
    selectedNode:{
      deep: true,
      handler(node){
        console.log("更新")
        this.$refs["process-tree"].nodeDomUpdate(node)
      }
    }
  },
  methods: {
    validate(){
      return this.$refs["process-tree"].validateProcess()
    },
    nodeSelected(node){
      console.log('配置节点', node)
      this.showConfig = true
    },
    closeConfigDrawer() {
      this.bus.$emit('closeConfigDrawer')
    },
    handleZoom(scale) {
      if (typeof scale === 'number') {
        this.scale += scale
      } else {
        this.scale = 100
      }
      // document.querySelector('#design-box').style.transform
    },
    startEditName() {
      if (this.disabledForm) return;
      this.tempNodes = JSON.parse(JSON.stringify(this.nodes))
      this.nodeName = this.selectedNode.name
      this.showInput = true
    },
    saveSelectedNodeName() {
      if (this.tempNodes.find(item => item.name === this.selectedNode.name && this.selectedNode.id !== item.id)) {
        this.$store.state.selectedNode.name = this.nodeName
        this.$message.warning('节点名称不可重复，请重新编辑')
      } else if (!this.selectedNode.name) {
        this.$store.state.selectedNode.name = this.nodeName
        this.$message.warning('节点名称不能为空，请重新编辑')
      }
      this.showInput = false
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

.op-btns {
  position: absolute;
  // top: 130px;
  right: 95px;
  z-index: 99;
  display: inline-block;
  padding: 6px 4px;
  border: 1px solid #E5E6EB;
  border-radius: 4px;
  font-size: 12px;
  height: 30px;
  background: #FFFFFF;
  z-index: 999;
  span {
    padding: 2px 6px;
    border-right: 1px solid #E5E6EB;
    cursor: pointer;
    user-select: none;
    &:hover {
      color: #2D5CF6;
      background: #F9FBFF;
    }
    i {
      color: #2D5CF6;
      margin-right: 2px;
    }
  }
  span:last-child {
    border-right: none;
  }
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
