<template>
  <div>
    <p class="desc">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-setting-user"></use>
      </svg>
      <span>
        选择{{ nodeName }}，<span style="color: #86909C;font-size: 12px;">配置可发起审批任务的人员范围</span>
      </span>
    </p>
    <el-radio-group v-model="radio">
      <el-radio label="所有人">所有人</el-radio>
      <el-radio label="指定部门/人员/角色">
        指定部门/人员/角色
      </el-radio>
    </el-radio-group>
    <br/>
    <div v-if="radio === '指定部门/人员/角色'">
      <el-button size="mini" @click="selectOrg" icon="el-icon-plus" type="primary">选择部门/人员/系统角色</el-button>
      <div style="margin-top: 20px">
        <div class="tag-action" >
          <div class="tag-box" v-for="(item, index) in select" :key="index">
            <TrsTag :tag="{...item, ...tagConfig}" @handleClose="removeOrgItem(index)" />
          </div>
        </div>
        <!-- <el-tag class="org-item" :type="org.type === 'dept'?'':'info'"
                v-for="(org, index) in select" :key="index + '_org'"
                closable size="mini" @close="removeOrgItem(index)">
          {{org.name}}
        </el-tag> -->
      </div>
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
    },
    nodeName: {
      type: String,
      default: undefined
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
  watch: {
    config: {
      handler(val) {
        if (val.assignedUser.length) {
          this.radio = '指定部门/人员/角色'
        }
      },
      immediate: true,
      deep: true
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
      this.config.assignedUser = []
      // this.select = []
      for (let key in select) {
        select[key].forEach(val => this.select.push({
          ...val,
          label: val.label
        }))
      }
      const mapId = {}
      const assignedUser = []
      this.config.assignedUser = this.select
      this.config.assignedUser.forEach(item => {
        if (!mapId[item.id + item.type]) {
          mapId[item.id + item.type] = true
          assignedUser.push(item)
        }
      })
      this.config.assignedUser = assignedUser
    },
    removeOrgItem(index){
      console.log(index)
      this.select.splice(index, 1)
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
