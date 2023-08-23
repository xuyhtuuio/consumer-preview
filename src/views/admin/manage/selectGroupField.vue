<template>
  <div class="groups">
    <div class="groups-item" v-for="(item, index) in data" :key="item.id">
      <el-input v-model="item.value" size="medium" v-show="item.showInput"
        maxlength="40"
        minlength="1"
        style="width: 300px"
        @blur="showInput = false">
        <i
          class="el-icon-success el-input__icon"
          style="color: #2D5CF6;"
          slot="suffix"
          @click="item.showInput = false">
        </i>
      </el-input>
      <div @mouseover="item.isHover = true" @mouseout="item.isHover=false" style="display: inline-block;">
        <div class="header-title" v-show="!item.showInput" @click="editInputName" style="font-size: medium">
          {{item.value}}
          <i class="iconfont icon-bi"></i>
        </div>
      </div>
      <div class="groups-btn" style="position: absolute;right:12px;display: inline-block;">
        <el-button icon="el-icon-plus" type="text" size="mini" @click="addSelectOptions(item.children)">新增选项</el-button>
        <i slot="suffix" class="el-input__icon el-icon-delete" style="position: absolute;right:0;top: 8px;height: 25px;" @click="deleteOptions(data, index)"></i>
      </div>
      <draggable :list="item.children" :draggable="!viewDisable" group="option" handler=".el-icon-rank" :options="{animation: 300, sort: true}">
        <div v-for="(op, index) in item.children" :key="op.id">
          <i class="el-icon-rank" style="margin-right: 6px;color:#bbb;"></i>
          <el-input v-model="item.children[index].value" size="small" style="width: 260px;"
                    placeholder="请设置选项值">
            <i slot="suffix" class="el-input__icon el-icon-delete" @click="deleteOptions(item.children, index)"></i>
          </el-input>
        </div>
      </draggable>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import { getTreeId } from '@/utils/utils'
export default {
  name: 'SelectGroupField',
  components: {
    draggable
  },
  props: {
    data: Array,
    viewDisable: Boolean
  },
  methods: {
    editInputName(item) {
      console.log(this.viewDisable)
      if (this.viewDisable) return;
      item.showInput = true
    },
    deleteOptions(data, index) {
      if (this.viewDisable) return;
      if (data.length <= 1) {
        this.$message.warning('至少有一个选项')
        return;
      }
      data.splice(index, 1)
    },
    addSelectOptions(data) {
      if (this.viewDisable) return;
      data.push({
        id: getTreeId('select'),
        value: ''
      })
    }
  }
}
</script>
<style lang="less" scoped>
.groups-item {
  padding: 8px 16px;
  margin-top: 16px;
  border-radius: 6px;
  background: #F7F8FA;
}
.header-title {
  word-break: break-all;
  max-width: 330px;
  line-height: 1.4em;
}
</style>
