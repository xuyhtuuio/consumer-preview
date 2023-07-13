<template>
  <div :style="{ 'margin-left': leval * 10 + 'px' }">
    <div v-for="(op, index) in data" :key="op.id">
      <!-- <i class="el-icon-rank" style="margin-right: 6px;"></i> -->
      <el-input v-model="data[index].value" size="small" style="width: 160px;"
                placeholder="请设置选项值">
        <i slot="suffix" class="el-input__icon el-icon-delete" @click="deleteOptions(data, index)"></i>
      </el-input>
      <el-button icon="el-icon-plus" type="text" size="mini" @click="addCascaderChildOptions(op)">新增子选项</el-button>
      <template v-if="op.children?.length">
        <CascaderField :leval="leval+1" :data="op.children"/>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CascaderField',
  props: {
    leval: Number,
    data: Array
  },
  methods: {
    addCascaderChildOptions(op) {
      op.children.push({
        id: op.id + '-' + op.children.length,
        value: '',
        children: []
      })
    },
    deleteOptions(data, index) {
      data.splice(index, 1)
    }
  }
}
</script>