<template>
  <div>
    <div class="title" v-if="level === 1">
      <span>表单管理</span>
      <el-button type="primary" @click="addForm">新增</el-button>
    </div>
    <div class="title" v-else>
      <div>
        <span @click="goBack" class="breadcrumb">{{ isEdit ? '编辑管理' : '新增管理' }}</span>/{{ currentRow.typesOfReviewItemsName }}
      </div>
    </div>
    <div>
      <!-- 表单管理一级表格 -->
      <TrsTable theme="TRS-table-gray" :data="data" :colConfig="colConfig" @sort-change="changeSort" v-if="level === 1" @submitEdit="submitEdit">
        <template #icon="scope">
          <img v-if="scope.row.icon" :src="scope.row.icon"/>
          <span v-else>--</span>
        </template>
        <template #operate="scope">
          <el-button type="text" @click="copyForm(scope.row)">复制</el-button>
          <el-button type="text" @click="editForm(scope.row)">编辑</el-button>
          <el-button type="text" @click="editSelfForm(scope.row)">修改时限</el-button>
          <el-button type="text" v-if="scope.row.deactivateOrNot" class="red" @click="stopApllay(scope.row)">停用</el-button>
          <el-button type="text" v-else @click="stopApllay(scope.row)">恢复</el-button>
        </template>
      </TrsTable>
      <!-- 表单管理二级表格 -->
      <div v-else>
        <div style="margin-bottom: 24px;">
          <el-input class="is-dark input" v-model="search.title" size="small" placeholder="请输入字段名称搜索" style="width: 254px;">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-select class="is-dark input" v-model="search.type" size="small" placeholder="字段类型" style="margin: 0 16px;">
            <el-option v-for="item in feildTypes" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
          <el-select class="is-dark input" v-model="search.belong" size="small" placeholder="所属模块">
            <el-option v-for="item in belongModules" :label="item.label" :value="item.value" :key="item.value"></el-option>
            <el-option lable="上传" value="Upload" key="Upload"></el-option>
          </el-select>
          <el-button type="primary" @click="addFormItem" size="small" style="margin-left: 16px;">新增字段</el-button>
        </div>
        <TrsTable theme="TRS-table-gray" :data="data1" :colConfig="colConfig1" @sort-change="changeSort" @submitEdit="submitEdit" :row-class-name="tableRowClassName">
          <template #operate="scope">
            <el-button type="text" v-if="readonlyField.includes(scope.row.title)">查看</el-button>
            <template v-else>
              <el-button type="text" v-if="scope.row.status === '0'">恢复</el-button>
              <el-button type="text" v-else @click="editFormItem(scope.row)">编辑</el-button>
              <el-button type="text" class="red" :style="{ visibility: scope.row.status !== '0' ? 'visible' : 'hidden' }">停用</el-button>
              <el-button type="text" class="red" v-if="!['下线时间'].includes(scope.row.title)">删除</el-button>
            </template>
          </template>
        </TrsTable>
        <!-- <el-table :data="data1" @sort-change="changeSort1" :row-class-name="tableRowClassName">
          <el-table-column label="字段名称" prop="title">
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
              <el-button type="text" v-if="readonlyField.includes(scope.row.title)">查看</el-button>
              <template v-else>
                <el-button type="text" v-if="scope.row.status === '0'">恢复</el-button>
                <el-button type="text" v-else @click="editFormItem(scope.row)">编辑</el-button>
                <el-button type="text" class="red" :style="{ visibility: scope.row.status !== '0' ? 'visible' : 'hidden' }">停用</el-button>
                <el-button type="text" class="red" v-if="!['下线时间'].includes(scope.row.title)">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table> -->
      </div>
      <TrsPagination :pageSize="10" :pageNow="page.pageNow" :total="page.total" @getList="handleCurrentChange" scrollType="scrollCom" scrollName="scrollCom"
          v-if="page.total">
        </TrsPagination>
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
      <!-- <div class="dialog-item">
        <p><b>审查事项类型</b></p>
        <el-input v-model.trim="checkType" size="small" class="is-dark input" oninput="value=value.slice(0, 8)" placeholder="请输入审查事项类型" style="width: 150px; display: inline-block;"></el-input><span class="gray">{{ checkType.length }}/8</span>
      </div> -->
      <div class="dialog-item">
        <p><b>提单时限（加急单）</b></p>
        上线前
        <el-input v-model="limitTime" size="small" class="is-dark input" oninput="value=value.replace(/^0|[^0-9]/g, '')" placeholder="请输入数字" style="width: 150px; display: inline-block;"></el-input>
        天 视为加急
      </div>
      <div class="dialog-item">
        <p><b>图标</b></p>
        <i class="icon-chanpin1"></i>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-success="handleAvatarSuccess"
          :show-file-list="false">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <el-button size="small" style="display: none;" id="icon-uploader" type="text">上传</el-button>
        </el-upload>
        <div style="position: relative;left: 80px;bottom:54px;">
          <el-button size="small" type="text" @click="reUpload">{{ imageUrl ? '重写上传' : '点击上传' }}</el-button>
        </div>
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
import { obtainExamineTypeList } from '@/api/manage'
import FormManageCustomField from './formManageCustomField'
export default {
  name: 'FormManage',
  components: {
    FormManageCustomField,
  },
  data() {
    return {
      feildTypes,
      belongModules,
      level: 1,
      data: [
        {
          typesOfReviewItemsName: '产品类',
          billOfLadingTimeLimit: '上线前12小时',
          deactivateOrNot: 0,
          icon: '#',
          updateTime: '2023-07-12 09:00:01'
        },
        {
          typesOfReviewItemsName: '产品类1',
          billOfLadingTimeLimit: '上线前121小时',
          deactivateOrNot: 1,
          icon: '',
          updateTime: '2023-07-13 09:00:01'
        }
      ],
      colConfig: [
        {
          label: '审查事项类型',
          prop: 'typesOfReviewItemsName',
          edit: true
        },
        {
          label: '图标',
          prop: 'icon',
          bind: {
            width: 120
          }
        },
        {
          label: '提单时限（加急单）',
          prop: 'billOfLadingTimeLimit'
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          bind: {
            align: 'center',
            sortable: "custom"
          }
        },
        {
          label: '操作',
          prop: 'operate',
          bind: {
            width: 250,
            align: 'center'
          }
        },
      ],
      readonlyField: ['项目名称', '上线时间', '审查材料'],
      data1: [
        {
          index: 1,
          title: '项目名称',
          name: '单行文本框',
          module: '基本信息',
          require: true,
          updateTime: '2023-07-17: 00:00:00',
          status: '1'
        },
        {
          index: 2,
          title: '上线时间',
          name: '时间选择器',
          module: '基本信息',
          require: true,
          updateTime: '2023-07-17: 00:00:00',
          status: '1'
        },
        {
          index: 3,
          title: '审查材料',
          name: '上传',
          module: '宣传渠道',
          require: true,
          updateTime: '2023-07-17: 00:00:00',
          status: '1'
        },
        {
          index: 4,
          title: '产品代码',
          name: '多选框',
          module: '宣传渠道',
          require: true,
          updateTime: '2023-07-17: 00:00:00',
          status: '0'
        }
      ],
      colConfig1: [
        {
          label: '序号',
          prop: 'index',
          edit: true
        },
        {
          label: '字段名称',
          prop: 'title',
          edit: true
        },
        {
          label: '字段类型',
          prop: 'name'
        },
        {
          label: '所属模块',
          prop: 'module'
        },
        {
          label: '是否必填',
          prop: 'require'
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          bind: {
            align: 'center',
            sortable: "custom"
          }
        },
        {
          label: '操作',
          prop: 'operate',
          bind: {
            width: 250,
            align: 'center'
          }
        },
      ],
      currentRow: {},
      search: {
        title: '',
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
      limitTime: null,
      imageUrl: ''
    }
  },
  created() {
    this.getObtainExamineTypeList()
  },
  methods: {
    async getObtainExamineTypeList(params) {
      const res = await obtainExamineTypeList({
        pageNow: 10,
        pageSize: 1,
        ...params
      })
      if (res.data) {
        this.data = res.data.list;
        this.page.total = res.data.totalCount
        this.page.pageNow = res.data.pageNow
      }
    },
    changeSort() {

    },
    changeSort1() {

    },
    handleCurrentChange() {

    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    reUpload() {
      console.log(document.querySelector('#icon-uploader'))
      document.querySelector('#icon-uploader').click()
    },
    addForm() {
      // 掉接口复制一个
      this.isEdit = false
      this.currentRow.title = '表单' + (this.page.total + 1)
      this.level = 2
    },
    editForm(item) {
      this.isEdit = true
      this.level = 2
      this.currentRow = item
    },
    copyForm() {
      this.data.unshift({
        title: '表单' + (this.page.total + 1),
        limitTime: '上线前12小时',
        utime: '2023-07-12 09:00:01'
      })
      this.page.total++
    },
    // 编辑单元格
    submitEdit() {

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
        this.stopApllayNo()
      }).catch(() => {
         
      });
    },
    // 无法停用
    stopApllayNo(row) {
      this.$confirm('<div><div><i class="el-alert__icon el-icon-warning" style="color: #e6a23c;font-size: 26px;"></i></div>此表单关联的流程中存在未结束的申请单，暂时无法停用</div>', '', {
        confirmButtonText: '停用',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        // showClose: false,
      }).then(() => {
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
      this.drawer = true
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>