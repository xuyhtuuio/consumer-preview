<template>
  <div style="height: 100%">
    <div class="title" v-if="level === 1">
      <span class="title-nav">表单管理</span>
      <el-button type="primary" @click="addForm" :loading="addLoading">新增</el-button>
    </div>
    <div class="title" v-else>
      <div class="title-nav">
        <span @click="goBack" class="breadcrumb">{{ isEdit ? '表单管理' : '表单管理' }}</span>/{{ currentRow.examineTypesName }}
      </div>
    </div>
    <div v-loading="loadingList" style="height: calc(100% - 63px); overflow-y: auto;">
      <!-- 表单管理一级表格 -->
      <TrsTable theme="TRS-table-gray" :data="data" :colConfig="colConfig" @sort-change="changeSort" v-if="level === 1"
        @submitEdit="submitEdit" :row-class-name="tableRowClassName">
        <template #icon="scope">
          <img v-if="scope.row.icon" :src="scope.row.icon" style="max-height: 30px;max-width: 120px;" />
          <span v-else>--</span>
        </template>
        <template #ladingBillTimeLimit="scope">
          <span>{{ scope.row.ladingBillTimeLimit ? `上线前${scope.row.ladingBillTimeLimit}天` : '--' }}</span>
        </template>
        <template #operate="scope">
          <el-button type="text" @click="copyForm(scope.row)">复制</el-button>
          <el-button type="text" @click="editForm(scope.row)">编辑</el-button>
          <el-button type="text" @click="editSelfForm(scope.row)">修改时限</el-button>
          <el-button type="text" v-if="scope.row.run === '1'" class="red" @click="stopApllay(scope.row)">停用</el-button>
          <el-button type="text" v-else @click="enableApllay(scope.row)">恢复</el-button>
        </template>
      </TrsTable>
      <!-- 表单管理二级表格 -->
      <div v-else>
        <div style="margin-bottom: 24px;">
          <el-input class="is-dark input" v-model="search.title" @keypress.native.enter="changeSearch" size="small"
            placeholder="请输入字段名称搜索" style="width: 254px;">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch"></i>
          </el-input>
          <el-select class="is-dark input" v-model="search.type" @change="changeSearch" clearable size="small" placeholder="字段类型"
            style="margin: 0 16px;">
            <el-option v-for="item in feildTypes" :label="item.chineseCharacter" :value="item.name" :key="item.name"></el-option>
          </el-select>
          <el-select class="is-dark input" v-model="search.belong" @change="changeSearch" clearable size="small" placeholder="所属模块">
            <el-option v-for="item in belongModules" :label="item.label" :value="item.value"
              :key="item.value"></el-option>
          </el-select>
          <el-button type="primary" @click="addFormItem" size="small" style="margin-left: 16px;">新增字段</el-button>
        </div>
        <TrsTable theme="TRS-table-gray" :data="data1" :colConfig="colConfig1" @sort-change="changeSort1"
          @submitEdit="submitEdit" :row-class-name="tableRowClassName">
          <template #operate="scope">
            <el-button type="text" v-if="+scope.row.run === 0" @click="changeFormItemState(scope.row)">恢复</el-button>
            <el-button type="text" v-else @click="editFormItem(scope.row)">编辑</el-button>
            <el-button type="text" class="red" v-if="!defalutField.includes(scope.row.title)"
              :style="{ visibility: +scope.row.run === 1 ? 'visible' : 'hidden' }"  @click="changeFormItemState(scope.row)">停用</el-button>
            <el-button type="text" class="red" v-if="!defalutField.includes(scope.row.title)" @click="deleteFormItem(scope.row)">删除</el-button>
          </template>
          <template #required="scope">
            {{ scope.row.required ? '是' : '否' }}
          </template>
        </TrsTable>
      </div>
      <TrsPagination v-if="page.total" :pageSize="10" :pageNow="page.pageNow" :total="page.total"
        @getList="handleCurrentChange" scrollType="scrollCom" scrollName="scrollCom">
      </TrsPagination>
    </div>
    <el-drawer :size="600" :visible.sync="drawer" direction="rtl" :before-close="handleClose">
      <span slot="title" style="font-size: 16px;">
        {{ drawerTitle }}
        <!-- <i class="el-icon-edit"></i> -->
      </span>
      <div class="drawer-main">
        <FormManageCustomField @close="drawer = false" :feildTypes="feildTypes" ref="formManageCustomField" @refreshItemList="refreshItemList" />
      </div>
    </el-drawer>
    <el-dialog title="修改" :visible.sync="limitTimeVisible" width="40%" center>
      <!-- <div class="dialog-item">
        <p><b>审查事项类型</b></p>
        <el-input v-model.trim="checkType" size="small" class="is-dark input" oninput="value=value.slice(0, 8)" placeholder="请输入审查事项类型" style="width: 150px; display: inline-block;"></el-input><span class="gray">{{ checkType.length }}/8</span>
      </div> -->
      <div class="dialog-item">
        <p><b>提单时限（加急单）</b></p>
        上线前
        <el-input v-model="limitTime" size="small" class="is-dark input" oninput="value=value.replace(/^0|[^0-9]/g, '')"
          placeholder="请输入数字" style="width: 150px; display: inline-block;"></el-input>
        天 视为加急
      </div>
      <div class="dialog-item">
        <p><b>图标</b></p>
        <!-- <i class="icon-chanpin1"></i> -->
        <el-upload class="avatar-uploader" action="/cpr/file/upload" :http-request="uploadBpmn" :show-file-list="false">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <el-button size="small" style="display: none;" id="icon-uploader" type="text">上传</el-button>
        </el-upload>
        <div style="position: relative;left: 80px;bottom:45px;">
          <el-button size="small" type="text" @click="reUpload">{{ imageUrl ? '重新上传' : '点击上传' }}</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="limitTimeVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitLimitTime">确 定</el-button>
      </span>
    </el-dialog>
    <secondary-confirmation :option="confirmOption" ref="confirmation" @handleConfirm="handleStop(confirmOption)"></secondary-confirmation>
  </div>
</template>
<script>
import { debounce } from 'lodash';
import { belongModules } from '@/utils/dict'
import { getFormGroups } from "@/api/front";
import secondaryConfirmation from "@/components/common/secondaryConfirmation"
import {
  obtainExamineTypeList,
  copyFormCategory,
  addFormCategory,
  modifyNameFormCategory,
  modifyTimeLimitFormCategory,
  switchFormCategoryState,
  itemPagingList,
  modifyOrder,
  deletedFormItem,
  switchFormItemState,
  getItemType
} from '@/api/manage'
import FormManageCustomField from './formManageCustomField'
export default {
  name: 'FormManage',
  components: {
    FormManageCustomField,
    secondaryConfirmation
  },
  data() {
    return {
      confirmOption: {},
      addLoading: false,
      feildTypes: [],
      belongModules,
      level: 1,
      loadingList: false,
      data: [],
      colConfig: [
        {
          label: '审查事项类型',
          prop: 'examineTypesName',
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
          prop: 'ladingBillTimeLimit'
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
      defalutField: ['项目名称', '上线时间', '下线时间', '宣传渠道'],
      data1: [],
      colConfig1: [
        {
          label: '序号',
          prop: 'sort',
          edit: true,
          bind: {
            width: 110
          }
        },
        {
          label: '字段名称',
          prop: 'title'
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
          prop: 'required',
          bind: {
            width: 80
          }
        },
        // {
        //   label: '更新时间',
        //   prop: 'updateTime',
        //   bind: {
        //     width: 200,
        //     align: 'center',
        //     sortable: "custom"
        //   }
        // },
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
      page1: {
        pageNow: 1,
        total: 1
      },
      page2: {
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
    this.getItemType()
  },
  methods: {
    uploadBpmn(param) {
      const formData = new FormData();
      formData.append("mf", param.file); // 传入bpmn文件
      getFormGroups(formData)
        .then((res) => {
          if (res.data.data) {
            this.handleAvatarSuccess(res.data.data, param.file.uid);
          } else {
            console.log(res.data.data, 123)
            this.$message.error(res.data.msg)
          }
        })
        .catch((err) => {
          param.onError(param.file.uid);
        });
    },
    async getItemType() {
      const res = await getItemType()
      if (res.data.data) {
        this.feildTypes = res.data.data || []
      }
      this.getObtainExamineTypeList()
    },
    async getObtainExamineTypeList(params) {
      this.loadingList = true
      const res = await obtainExamineTypeList({
        pageNow: 1,
        pageSize: 10,
        orderColumn: 'updateTime',
        orderType: 'desc',
        ...params
      })
      const resData = res.data.data
      if (resData) {
        this.data = resData.data.list;
        this.resData = JSON.parse(JSON.stringify(resData.data.list))
        this.page1.total = resData.data.totalCount
        this.page1.pageNow = resData.data.pageNow
        this.page = this.page1
      }
      this.loadingList = false
    },
    changeSort(sort) {
      if (sort.order.startsWith('desc')) {
        this.getObtainExamineTypeList({
          orderColumn: sort.prop,
          orderType: 'desc'
        })
        this.order = {
          orderColumn: sort.prop,
          orderType: 'desc'
        }
      } else {
        this.getObtainExamineTypeList({
          orderColumn: sort.prop,
          orderType: 'asc'
        })
        this.order = {
          orderColumn: sort.prop,
          orderType: 'asc'
        }
      }
    },
    changeSort1(sort) {
      // let data = {
      //   orderColumn: sort.prop,
      //   orderType: 'asc'
      // }
      // if (sort.order.startsWith('desc')) {
      //   data = {
      //     orderColumn: sort.prop,
      //     orderType: 'desc'
      //   }
      // }
      // this.order = { ...data }
      this.editForm({
        recordId: this.currentRow.recordId,
        params: {
          itemName: this.search.title,
          itemType: this.search.type,
          currentModule: this.search.belong,
          // orderColumn: 'updateTime',
          // orderType: 'desc',
          // ...data
        }
      })
    },
    handleCurrentChange(val) {
      if (this.level === 1) {
        this.getObtainExamineTypeList({
          pageNow: val,
          ...this.order,
        })
      } else {
        this.editForm({
          recordId: this.currentRow.recordId,
          params: {
            itemName: this.search.title,
            itemType: this.search.type,
            currentModule: this.search.belong,
            // orderColumn: 'updateTime',
            // orderType: 'desc',
            pageSize: 10,
            pageNow: val,
            // ...this.order,
          }
        })
      }
    },
    // 表单项 搜索
    changeSearch() {
      this.editForm({
        recordId: this.currentRow.recordId,
        params: {
          itemName: this.search.title,
          itemType: this.search.type,
          currentModule: this.search.belong,
          // orderColumn: 'updateTime',
          // orderType: 'desc',
          pageSize: 10,
          pageNow: 1
        }
      })
    },
    handleAvatarSuccess(data) {
      this.imageUrl = data.url;
    },
    reUpload() {
      document.querySelector('#icon-uploader').click()
    },
    // 新增表单
    addForm: debounce(async function() {
      this.addLoading = true;
      const res = await addFormCategory()
      this.addLoading = false;
      if (res.data) {
        this.getObtainExamineTypeList()
        this.$message.success('新增成功')
      }
    }, 500),
    async editForm(item) {
      if (this.level === 1) {
        this.currentRow = item;
        this.isEdit = true;
        this.level = 2;
      }
      this.loadingList = true
      const res = await itemPagingList({
        formCategoryId: item.recordId,
        // orderColumn: 'updateTime',
        // orderType: 'desc',
        ...item.params
      })
      this.loadingList = false
      const resData = res.data.data
      if (resData) {
        this.data1 = resData.list;
        this.resData1 = JSON.parse(JSON.stringify(resData.list))
        this.page2.total = resData.totalCount
        this.page2.pageNow = resData.pageNow
        this.page = this.page2
      }
    },
    // 复制表单
    copyForm: debounce(async function(row) {
      await copyFormCategory(row.recordId)
      this.getObtainExamineTypeList({
        orderColumn: 'updateTime',
        orderType: 'desc'
      })
    }, 500),
    // 编辑单元格
    async submitEdit(row) {
      let res;
      let resData;
      if (this.level === 1) {
        res = await modifyNameFormCategory({
          name: row.examineTypesName,
          formCategoryId: row.recordId
        })
        resData = this.resData
      } else {
        // 修改字段序号
        res = await modifyOrder({
          newSort: Number(row.sort),
          formItemId: row.id
        })
        this.editForm(this.currentRow)
      }
      console.log(res?.data)
      if (res?.data?.success) {
        this.$message.success('修改成功!')
      } else {
        if (resData && this.level === 1) {
          const findRow = resData.find(item => item.recordId === row.recordId)
          console.log(findRow, row)
          if (row.recordId === findRow.recordId && findRow.examineTypesName === row.examineTypesName) {
            return;
          }
          row.examineTypesName = findRow.examineTypesName
        }
        this.$message.warning(res?.data.msg)
      }
    },
    editSelfForm(item) {
      this.currentRow = item
      this.imageUrl = item.icon
      this.limitTime = item.ladingBillTimeLimit
      this.limitTimeVisible = true
    },
    // 停用
    stopApllay: debounce(function(row) {
      this.confirmOption = {
        message: '停用此表单可能影响部分申请单，确定停用该表单吗？',
        cancelBtn: '取消',
        confirmBtn: '停用',
        fetch: true
      }
      this.$refs.confirmation.dialogVisible = true;
      this.currentRow = row
    }, 500),
    enableApllay: debounce(async function(row) {
      const res = await switchFormCategoryState({
        formCategoryId: row.recordId
      })
      if (res.data.data) {
        this.$message({
          type: 'success',
          message: row.run === '1' ? '停用成功!' : '该表单已恢复，可在提单时查看'
        });
        row.run = row.run === '0' ? '1' : '0'
        return;
      }
    }, 500),
    async handleStop(option) {
      if (!option.fetch) {
        return;
      }
      const res = await switchFormCategoryState({
        formCategoryId: this.currentRow.recordId
      })
      if (res.data.data) {
        this.$message({
          type: 'success',
          message: this.currentRow.run === '1' ? '停用成功!' : '恢复成功!'
        });
        this.currentRow.run = this.currentRow.run === '0' ? '1' : '0'
        return;
      }
      this.stopApllayNo()
    },
    // 无法停用
    stopApllayNo() {
      this.confirmOption = {
        message: '此表单关联的流程中存在未结束的申请单，暂时无法停用',
        cancelBtn: '取消',
        confirmBtn: '确定',
        fetch: false
      }
      this.$refs.confirmation.dialogVisible = true;
    },
    async handleSubmitLimitTime() {
      if (this.limitTime) {
        if (this.limitTime > 1000000) {
          this.$message.warning('请输入不大于1000000的数字')
          return;
        }
        await modifyTimeLimitFormCategory({
          formCategoryId: this.currentRow.recordId,
          timeLimit: this.limitTime,
          fileUrl: this.imageUrl
        })
        this.getObtainExamineTypeList()
        this.limitTimeVisible = false
        this.$message.success('修改成功!')
      } else {
        this.$message.warning('请输入大于0的数字')
      }
    },
    addFormItem() {
      this.drawerTitle = '新增字段'
      this.drawer = true
      this.$nextTick(() => {
        this.$refs['formManageCustomField'].initForm(this.currentRow)
      })
    },
    editFormItem(item) {
      this.drawer = true
      this.drawerTitle = '编辑字段'
      this.currentRowItem = item
      this.$nextTick(() => {
        this.$refs['formManageCustomField'].initForm(this.currentRow, this.currentRowItem)
      })
    },
    // 删除表单项
    async deleteFormItem(item) {
      const res = await deletedFormItem({
        formItemId: item.id
      })
      if (res?.data.success) {
        this.$message.success('删除成功!')
        this.handleCurrentChange(this.data1.length === 1 ? this.page2.pageNow -1: this.page2.pageNow)
      } else {
        this.$message.error(res?.data?.msg)
      }
    },
    // 停用表单项
    changeFormItemState: debounce(async function(item) {
      const res = await switchFormItemState({
        formItemId: item.id
      })
      if (res?.data.success) {
        this.$message.success(item.run ? '停用成功' : '恢复成功')
        item.run = item.run === 0 ? 1 : 0;
      } else {
        this.$message.error(res?.data?.msg)
      }
    }, 500),
    // 刷新表单项list
    refreshItemList() {
      this.drawer = false;
      this.handleCurrentChange(this.page2.pageNow)
    },
    handleClose(done) {
      this.$refs['formManageCustomField'].resetOptions()
      done()
    },
    goBack() {
      this.search = {
        title: '',
        type: '',
        belong: ''
      }
      this.level = 1
      this.page = this.page1
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.run === '0') {
        return 'disable-row';
      }
      return '';
    }
  }
}
</script>
<style lang="less" scoped>
.el-select:last-of-type {
  margin-right: 0;
}

/deep/ .el-select .el-input .el-icon-arrow-up::before {
  font-family: element-icons !important;
  content: "\e78f";
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #E5E6EB;

  &-nav {
    line-height: 34px;
  }

  .el-button {
    display: flex;
    align-items: center;
    justify-content: center;
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
/deep/.el-dialog {
  border-radius: 10px;
  padding: 20px 40px 10px;
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
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}

.avatar {
  width: 40px;
  height: 40px;
  display: block;
}
</style>