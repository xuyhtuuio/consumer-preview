<template>
  <div>
    <p class="desc">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-setting-user"></use>
      </svg>
      <span>
        选择{{ nodeName }}人员
      </span>
    </p>
    <p style="color: #86909C;font-size: 12px;margin:20px 0 0 6px;">注：二次会签时，仅支持指定之前某一节点对应的审批人（包含发起人），仅选择审批节点即可</p>
    <span style="display: inline-block;font-size:14px;margin: 24px 10px 0 0;">指定节点 </span>
    <el-select v-model="nodeProps.target" placeholder="请选择指定节点" size="medium" class="is-dark input" style="width: 250px;">
      <el-option v-for="(op, index) in nodes" :key="index" :label="op.name" :value="op.id"></el-option>
    </el-select>
  </div>
</template>

<script>
import orgPicker from '@/components/common/organizationPicker'
export default {
  name: "CcNodeConfig",
  components: {orgPicker},
  props:{
    config:{
      type: Object,
      default: ()=>{
        return {}
      }
    },
    nodeName: {
      type: String,
      default: undefined
    },
  },
  data() {
    return {
      showOrgSelect: false,
      tagConfig: {
        background: '#f0f6ff',
        color: '#2d5cf6',
        borderColor: '#5784FF',
        borderRadius: '4px',
        closable: true,
        size: 'medium'
      }
    }
  },
  computed:{
    nodeProps() {
      return this.$store.state.selectedNode.props
    },
    nodeMap() {
      return this.$store.state.nodeMap
    },
    nodes() {
      const tempNodes = []
      this.nodeMap.forEach(value => {
        if (['ROOT', 'CC', 'APPROVAL', 'APPROVAL-TWO'].includes(value?.type) && value.name !== this.nodeName) {
          tempNodes.push({
            name: value.name,
            id: value.id
          })
        }
      })
      return tempNodes
    },
    select: {
      get() {
        return this.config.assignedUser || []
      },
      set() {

      }
    },
  },
  methods: {
    closeSelect(){
      this.showOrgSelect = false
    },
    selectOrg() {
      this.showOrgSelect = true
    },
    selected(select) {
      this.showOrgSelect = false
      // this.select = []
      this.config.assignedUser = []
      for (let key in select) {
        select[key].forEach(val => this.select.push({
          ...val,
          label: val.label,
          name: val.label,
        }))
      }
    },
    removeOrgItem(index){
      console.log(index)
      this.select.splice(index, 1)
      console.log(this.select)
    }
  }
}
</script>

<style lang="less" scoped>
.icon {
  width: 24px;
  height: 24px;
}
.desc{
  display: flex;
  align-items: center;
  padding-top: 10px;
  font-size: 14px;
  color: #1D2128;
}
.org-item{
  margin: 5px;
}
.el-button--mini {
  margin-top: 16px;
  border-radius: 17px;
}
/deep/.el-radio .el-radio__label {
  font-weight: normal;
}
.tag-action {
  text-align: left;
}
.tag-box {
  display: inline-block;
  margin-bottom: 8px;
}
</style>
