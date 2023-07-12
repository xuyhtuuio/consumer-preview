<template>
  <div>
    <div class="title" v-if="level === 1">
      <span>表单管理</span>
      <el-button type="primary" @click="addForm">新增</el-button>
    </div>
    <div class="title" v-else>
      <div>
        <span @click="goBack" class="breadcrumb">表单管理</span>/{{ currentRow.type }}
      </div>
    </div>
    <div class="TRS-table">
      <!-- 表单管理一级表格 -->
      <el-table :data="data" @sort-change="changeSort" v-if="level === 1">
        <el-table-column label="审查类型" prop="type">
        </el-table-column>
        <el-table-column label="提单时限（加急单）" prop="limitTime">
        </el-table-column>
        <el-table-column label="更新时间" prop="utime" sortable="custom"  align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editForm(scope.row)">编辑</el-button>
            <el-button type="text">修改时限</el-button>
            <el-button type="text" class="red">停用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表单管理二级表格 -->
      <div v-else>
        <div style="margin-bottom: 24px;">
          <el-input class="is-dark input" v-model="search.name" size="small" placeholder="请输入字段名称搜索" style="width: 254px;">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-select class="is-dark input" v-model="search.type" size="small" placeholder="字段类型" style="margin: 0 16px;"></el-select>
          <el-select class="is-dark input" v-model="search.belong" size="small" placeholder="所属模块"></el-select>
          <el-button type="primary" @click="addFormItem" size="small" style="margin-left: 16px;">新增字段</el-button>
        </div>
        <el-table :data="data1" @sort-change="changeSort1" :row-class-name="tableRowClassName">
          <el-table-column label="字段名称" prop="name">
          </el-table-column>
          <el-table-column label="字段类型" prop="type">
          </el-table-column>
          <el-table-column label="所属模块" prop="belong">
          </el-table-column>
          <el-table-column label="是否必填" prop="isRequire">
          </el-table-column>
          <el-table-column label="更新时间" prop="utime" sortable="custom"  align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.status === '0'">恢复</el-button>
              <el-button type="text" v-else @click="editFormItem(scope.row)">编辑</el-button>
              <el-button type="text" class="red" :style="{ visibility: scope.row.status !== '0' ? 'visible' : 'hidden' }">停用</el-button>
              <el-button type="text" class="red">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Pagination :pageSize="10" :pageNow="page.pageNow" :total="page.total" @getList="handleCurrentChange" scrollType="scrollCom" scrollName="scrollCom"
          v-if="page.total">
        </Pagination>
    </div>
    <el-drawer
      :size="500"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose">
      <span slot="title" style="font-size: 16px;">
        {{ drawerTitle }}<i class="el-icon-edit"></i>
      </span>
      <div class="drawer-main">
        <FormManageCustomField/>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import Pagination from '@/components/common/pagination'
import FormManageCustomField from './formManageCustomField'
export default {
  name: 'FormManage',
  components: {
    Pagination,
    FormManageCustomField
  },
  data() {
    return {
      level: 1,
      data: [
        {
          type: '产品类',
          limitTime: '上线前12小时',
          utime: '2023-07-12 09:00:01'
        }
      ],
      data1: [
        {
          name: '自动',
          type: '多大的',
          status: '1'
        }
      ],
      currentRow: {},
      search: {
        name: '',
        type: '',
        belong: ''
      },
      page: {
        pageNow: 1,
        total: 1
      },
      drawer: false,
      drawerTitle: '',
      currentRowItem: {}
    }
  },
  methods: {
    changeSort() {

    },
    changeSort1() {

    },
    handleCurrentChange() {

    },
    addForm() {
      this.level = 2
    },
    editForm(item) {
      this.level = 2
      this.currentRow = item
    },
    addFormItem() {
      this.drawerTitle = '新增字段'
      this.drawer = true
    },
    editFormItem(item) {
      this.drawerTitle = '编辑字段'
      this.currentRowItem = item
    },
    handleClose(done) {
      done()
    },
    goBack() {
      this.page.pageNow = 1
      this.level = 1
    },
    tableRowClassName({row, rowIndex}) {
      if (row.status === '0') {
        return 'disable-row';
      }
      return '';
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
  .breadcrumb:hover {
    font-weight: 600;
    cursor: pointer;
  }
}
.el-button--text {
  padding: 5px;
}
/deep/.disable-row .cell {
  color: #86909C;
}
.drawer-main {
  padding: 0 24px 0 14px;
}
</style>