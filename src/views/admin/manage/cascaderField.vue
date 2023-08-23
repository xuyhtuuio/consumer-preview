<template>
  <div :style="{ 'margin-left': leval * 10 + 'px' }">
    <draggable :list="data" group="option" handler=".el-icon-rank" :options="{animation: 300, sort: true, disabled: viewDisable}">
      <div v-for="(op, index) in data" :key="op.id">
        <i class="el-icon-rank" style="margin-right: 6px;color:#bbb;"></i>
        <el-input v-model="data[index].value" size="small" style="width: 160px;"
                  placeholder="请设置选项值">
          <i slot="suffix" class="el-input__icon el-icon-delete" @click="deleteOptions(data, index, leval)"></i>
        </el-input>
        <el-popover
          placement="bottom-start"
          width="140"
          trigger="hover">
          <ul class="cascader-field-popover">
            <li @click="addCascaderOptions">新建选项</li>
            <li @click="addCascaderChildOptions(op)">新建子选项</li>
          </ul>
          <i slot="reference" class="el-icon-plus" style="color:#1e80ff; margin-left: 4px;"></i>
        </el-popover>
        <template v-if="op.children?.length">
          <CascaderField :leval="leval+1" :data="op.children"/>
        </template>
      </div>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import { getTreeId } from '@/utils/utils'
export default {
  name: 'CascaderField',
  components: {
    draggable
  },
  props: {
    leval: Number,
    data: Array,
    viewDisable: Boolean
  },
  methods: {
    addCascaderChildOptions(op) {
      if (this.viewDisable) return;
      op.children.push({
        // id: op.id + '-' + op.children.length,
        id: getTreeId('cascader'),
        value: '',
        children: []
      })
    },
    addCascaderOptions() {
      if (this.viewDisable) return;
      // const ids = this.data[this.data.length - 1].id.split('-')
      // ids[ids.length - 1] = +ids[ids.length -1] + 1 + ''
      this.data.push({
        id: getTreeId('cascader'),
        value: '',
        children: []
      })
    },
    deleteOptions(data, index, level) {
      if (this.viewDisable) return;
      if ((data.length <= 1) && (level === 1)) {
        this.$message.warning('至少有一个选项')
        return;
      }
      data.splice(index, 1)
    },
  }
}
</script>
<style lang="less">
.cascader-field-popover {
  li {
    padding-left: 10px;
    height: 26px;
    line-height: 26px;
    cursor: pointer;
  }
  li:hover {
    background: #F7F8FA;
  }
}
</style>
