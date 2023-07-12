<template>
  <div>
    <div class="title">
      <span>表单管理</span>
      <el-button type="primary">新增</el-button>
    </div>
    <div class="TRS-table">
      <el-table :data="data" @sort-change="changeSort">
        <el-table-column label="审查类型" prop="type">
        </el-table-column>
        <el-table-column label="更新时间" prop="utime" sortable="custom"  align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text">编辑</el-button>
            <el-button type="text" class="red">停用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FormManage',
  data() {
    return {
      data: [
        {
          type: '1',
          utime: '2023-07-12 09:00:01'
        }
      ]
    }
  },
  methods: {
    changeSort() {

    }
  }
}
</script>
<style lang="less" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #E5E6EB;
  .el-button {
    width: 80px;
    height: 34px;
  }
}
</style>