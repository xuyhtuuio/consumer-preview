<template>
  <div>
    <div class="title" v-if="level === 1">
      <span>表单管理</span>
      <el-button type="primary" @click="addForm">新增</el-button>
    </div>
    <div class="title" v-else>
      <div>
        <span @click="goBack" class="breadcrumb">编辑管理</span>/{{ currentRow.type }}
      </div>
    </div>
    <div class="TRS-table">
      <!-- 表单管理一级表格 -->
      <el-table :data="data" @sort-change="changeSort" v-if="level === 1">
        <el-table-column label="审查类型" prop="type">
        </el-table-column>
        <el-table-column label="图标" prop="icon">
          <template slot-scope="scope">
            <i class="icon-chanpin1"></i>
          </template>
        </el-table-column>
        <el-table-column label="提单时限（加急单）" prop="limitTime">
        </el-table-column>
        <el-table-column label="更新时间" prop="utime" sortable="custom"  align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text">复制</el-button>
            <el-button type="text" @click="editForm(scope.row)">编辑</el-button>
            <el-button type="text" @click="editSelfForm(scope.row)">修改</el-button>
            <el-button type="text" class="red" @click="stopApllay(scope.row)">停用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表单管理二级表格 -->
      <div v-else>
        <div style="margin-bottom: 24px;">
          <el-input class="is-dark input" v-model="search.name" size="small" placeholder="请输入字段名称搜索" style="width: 254px;">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-select class="is-dark input" v-model="search.type" size="small" placeholder="字段类型" style="margin: 0 16px;">
            <el-option v-for="item in feildTypes" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
          <el-select class="is-dark input" v-model="search.belong" size="small" placeholder="所属模块">
            <el-option v-for="item in belongModules" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
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
      :size="600"
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
    <el-dialog
      title="修改"
      :visible.sync="limitTimeVisible"
      width="40%"
      center>
      <div class="dialog-item">
        <p><b>审查事项类型</b></p>
        <el-input v-model.trim="checkType" size="small" class="is-dark input" oninput="value=value.slice(0, 8)" placeholder="请输入审查事项类型" style="width: 150px; display: inline-block;"></el-input><span class="gray">{{ checkType.length }}/8</span>
      </div>
      <div class="dialog-item">
        <p><b>图标</b></p>
        <i class="icon-chanpin1"></i>
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false">
          <el-button size="small" type="text">重写上传</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </div>
      <div class="dialog-item">
        <p><b>提单时限（加急单）</b></p>
        上线前
        <el-input v-model="limitTime" size="small" class="is-dark input" oninput="value=value.replace(/^0|[^0-9]/g, '')" placeholder="请输入数字" style="width: 150px; display: inline-block;"></el-input>
        天 视为加急
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="limitTimeVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitLimitTime">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { feildTypes, belongModules } from '@/utils/dict'
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
      feildTypes,
      belongModules,
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
      currentRowItem: {},
      limitTimeVisible: false,
      checkType: '',
      limitTime: null
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
      // 掉接口复制一个
    },
    editForm(item) {
      this.level = 2
      this.currentRow = item
    },
    editSelfForm(item) {
      this.currentRow = item
      this.limitTimeVisible = true
    },
    // 停用
    stopApllay(row) {
      this.$confirm('<div><div><i class="el-alert__icon el-icon-warning" style="color: #e6a23c;font-size: 26px;"></i></div>停用此表单可能影响部分申请单，确定停用该表单吗？</div>', '', {
        confirmButtonText: '停用',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        // showClose: false,
      }).then(() => {
        this.$message({
          type: 'success',
          message: '停用成功!'
        });
      }).catch(() => {
         
      });
    },
    handleSubmitLimitTime() {
      if (this.limitTime) {
        this.limitTimeVisible = false
        this.$message.success('修改时限成功')
      } else {
        this.$message.warning('请输入大于0的数字')
      }
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
<style lang="less">
.el-message-box {
  .el-button {
    height: 34px;
    line-height: 34px;
    border-radius: 6px;
    span {
      position: relative;
      bottom: 5px;
    }
  }
  .el-button--primary {
    background: linear-gradient(90deg, #2F54EB 0%, #5196FF 100%);
    border: none;
  }
}
.dialog-item {
  margin-bottom: 12px;
  p {
    margin-bottom: 6px;
  }
  .gray {
    color: #86909C;
  }
}
</style>