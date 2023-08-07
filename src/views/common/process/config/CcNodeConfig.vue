<template>
  <div>
    <p class="desc">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-setting-user"></use>
      </svg>
      <span>
        选择{{ nodeName }}，<span style="color: #86909C;font-size: 12px;">配置抄送的人员范围</span>
      </span>
    </p>
    <el-button size="mini" @click="selectOrg" icon="el-icon-plus" type="primary">选择部门/人员/系统角色</el-button>
    <div style="margin-top: 16px">
      <div class="tag-action" >
        <div class="tag-box" v-for="(item, index) in select" :key="index">
          <TrsTag :tag="{...item, ...tagConfig}" @handleClose="removeOrgItem(index)" />
        </div>
      </div>
    </div>
    <p style="color: #86909C;font-size: 12px;margin-top:20px">抄送对象仅可查看申请单，无其他操作权限</p>
    <org-picker :show="showOrgSelect" @close="closeSelect" :selected="select" @selectOver="selected"></org-picker>
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
    }
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
    select: {
      get() {
        return this.config.assignedUser
      },
      set() {

      }
    }
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
      this.select = []
      for (let key in select) {
        select[key].forEach(val => this.select.push({
          ...val,
          label: val.label
        }))
      }
      // select.forEach(val => this.select.push({
      //   ...val,
      //   label: val.name,
      //   ...this.tagConfig
      // }))
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
