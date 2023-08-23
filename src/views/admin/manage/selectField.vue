<template>
  <div>
    <draggable :list="data" group="option" handler=".el-icon-rank" :options="{animation: 300, sort: true, disabled: viewDisable}">
      <div v-for="(op, index) in data" :key="op.id">
        <i class="el-icon-rank" style="margin-right: 6px;color:#bbb;"></i>
        <el-input v-model="data[index].value" size="small" style="width: calc(100% - 20px);"
                  placeholder="请设置选项值">
          <i slot="suffix" class="el-input__icon el-icon-delete" @click="deleteOptions(data, index)"></i>
        </el-input>
      </div>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
export default {
  name: 'SelectField',
  components: {
    draggable
  },
  props: {
    data: Array,
    viewDisable: Boolean
  },
  methods: {
    deleteOptions(data, index) {
      if (this.viewDisable) return;
      if (data.length <= 1) {
        this.$message.warning('至少有一个选项')
        return;
      }
      data.splice(index, 1)
    },
  }
}
</script>
