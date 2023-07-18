<template>
  <div>
    <p class="desc">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-setting-user"></use>
      </svg>
      选择申请人，
      <span style="color: #86909C;font-size: 12px;">配置可发起审批任务的人员范围</span>
    </p>
    <el-radio-group v-model="radio">
      <el-radio label="所有人">所有人</el-radio>
      <el-radio label="指定部门/人员/角色">
        指定部门/人员/角色
        <svg class="icon" aria-hidden="true" style="position: relative; top: 4px;">
          <use xlink:href="#icon-wenhao"></use>
        </svg>
      </el-radio>
    </el-radio-group>
    <br/>
    <el-button size="mini" @click="selectOrg" icon="el-icon-plus" type="primary">选择部门/人员/系统角色</el-button>
    <div style="margin-top: 20px">
      <div class="tag-action" >
        <div class="tag-box" v-for="(item, index) in select" :key="index">
          <TrsTag :tag="item" @handleClose="removeOrgItem(index)" />
        </div>
      </div>
      <!-- <el-tag class="org-item" :type="org.type === 'dept'?'':'info'"
              v-for="(org, index) in select" :key="index + '_org'"
              closable size="mini" @close="removeOrgItem(index)">
        {{org.name}}
      </el-tag> -->
    </div>
    <org-picker :show="showOrgSelect" @close="closeSelect" :selected="select" @selectOver="selected"></org-picker>
  </div>
</template>

<script>
import orgPicker from '@/components/common/organizationPicker'
export default {
  name: "RootConfig",
  components: {orgPicker},
  props:{
    config:{
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  data() {
    return {
      showOrgSelect: false,
      radio: '所有人',
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
      select.forEach(val => this.select.push({
        ...val,
        label: val.name,
        ...this.tagConfig
      }))
      console.log(this.select)
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
  padding: 10px 0 17px;
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
