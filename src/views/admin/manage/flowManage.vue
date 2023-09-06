<template>
  <div class="flow">
    <div class="title">
      <div>
        <span>流程管理</span>
        <span class="title-desc">停用流程时请先确认当前流程是否有未结束任务，且当前流程关联表单是否停用。</span>
      </div>
      <el-button type="primary" @click="addFlow" v-if="editAuth">新增</el-button>
    </div>
    <div  style="height: calc(100% - 63px); overflow-y: auto;">
      <TrsTable v-loading="tableLoading" theme="TRS-table-gray" :data="data" :colConfig="colConfig">
        <template #status="scope">
          <TrsTag v-if="scope.row.status==='已发布'" :tag="tagItem" />
          <TrsTag v-else :tag="tagItem1" />
        </template>
        <template #createUserName="scope">
          <span>{{ scope.row.createUserName + '/' +  scope.row.createUserId }}</span>
        </template>
        <template #operate="scope">
          <el-button type="text" @click="previewFlow(scope.row)">预览</el-button>
          <el-button type="text" v-if="scope.row.status === '已发布' && editAuth" class="red" @click="stopFlow(scope.row)">停用</el-button>
          <el-button type="text" v-if="scope.row.status !== '已发布' && editAuth" @click="editFlow(scope.row)">编辑</el-button>
          <el-button type="text" v-if="scope.row.status !== '已发布' && editAuth" class="red" @click="deleteFlow(scope.row)">删除</el-button>
        </template>
      </TrsTable>
      <TrsPagination :pageSize="10" :pageNow="page.pageNow" :total="page.total" @getList="handleCurrentChange" scrollType="scrollCom" scrollName="scrollCom"
        v-if="page.total">
      </TrsPagination>
    </div>
    <w-dialog :showFooter="false" v-model="flowVisible" :title="currentRow.templateName + '-预览'" width="600px">
      <process-design from="flowManage" ref="processDesign" style="background: #f5f6f6;" />
    </w-dialog>
    <secondary-confirmation :option="confirmOption" ref="confirmation" @handleConfirm="handleConfirmation(confirmOption)"></secondary-confirmation>
  </div>
</template>
<script>
import { getProcessList } from '@/api/manage'
import { deleteProcess, getProcessDetailByTemplateId, stopProcess } from '@/api/design'
import ProcessDesign from '@/views/admin/layout/ProcessDesign'
import secondaryConfirmation from '@/components/common/secondaryConfirmation'
export default {
  name: 'flowManage',
  components: {
    ProcessDesign,
    secondaryConfirmation
  },
  data() {
    return {
      tableLoading: false,
      flowVisible: false,
      confirmOption: {},
      tagItem: {
        label: '已发布',
        background: '#f0fffc',
        color: '#0da5aa',
        borderRadius: '4px',
        size: 'small'
      },
      tagItem1: {
        label: '草稿',
        background: '#f0f6ff',
        color: '#2d5cf6',
        borderColor: '',
        borderRadius: '4px',
        size: 'small'
      },
      data: [
      ],
      page: {
        pageNow: 1,
        total: 1
      },
      colConfig: [
        {
          label: '流程名称',
          prop: 'templateName'
        },
        {
          label: '关联表单',
          prop: 'formName',
          bind: {
            width: 120
          }
        },
        {
          label: '表单说明',
          prop: 'remark'
        },
        {
          label: '发布状态',
          prop: 'status'
        },
        {
          label: '创建人',
          prop: 'createUserName'
        },
        {
          label: '更新时间',
          prop: 'updated',
          bind: {
            width: 180,
            // align: 'center',
            // sortable: "custom"
          }
        },
        {
          label: '操作',
          prop: 'operate',
          bind: {
            width: 200,
            align: 'left'
          }
        },
      ],
      currentRow: {}
    }
  },
  computed: {
    editAuth() {
      const { permissionsPage = {} } = this.$store.state
      const flowManage = [...permissionsPage.funPerms, ...permissionsPage.defaultPerm]?.find(item => item.pathName === 'FlowManage') || {}
      if (flowManage.type === 'edit') {
        return true
      }
      return false
    }
  },
  created() {
    this.getProcessList()
  },
  methods: {
    async getProcessList(params) {
      this.tableLoading = true
      const res = await getProcessList({
        pageNow: 1,
        pageSize: 10,
        ...params
      })
      const resData = res.data.data
      if (resData) {
        this.data = resData.list
        this.page.pageNow = resData.pageNow
        this.page.total = resData.totalCount
      }
      this.tableLoading = false
    },
    addFlow() {
      this.$store.commit('setIsPreview', false);
      this.$store.commit('loadForm', {})
      this.$router.push({
        name: 'design'
      })
    },
    handleCurrentChange(val) {
      this.getProcessList({
        pageNow: val
      })
    },
    previewFlow(row) {
      this.currentRow = row
      const design = JSON.parse(JSON.stringify(row))
      design.formId = +design.formId
      design.settings = JSON.parse(design.settings)
      design.formItems = JSON.parse(design.formItems)
      design.process = JSON.parse(design.process)
      this.$store.commit('loadForm', design)
      this.$store.commit('setIsPreview', true);
      this.$nextTick(() => {
        this.flowVisible = true
      })
    },
    editFlow(row) {
      this.$store.commit('setIsPreview', false);
      this.$store.state.design = {
        ...row
      }
      this.$router.push({
        name: 'design',
        query: {
          code: row.templateId
        }
      })
    },
    async handleConfirmation() {
      if (this.confirmOption.flag === 'delete') {
        const res = await deleteProcess(this.currentRow.templateId)
        if (res.data.data === 1) {
          this.$message.success('删除成功')
          this.getProcessList({
            pageNow: 1
          })
        }
        return;
      }
      const res = await stopProcess(this.processDetailRes.data.data.processDefinitionId, this.currentRow.templateId)
      if (res.data.status === 200) {
        this.getProcessList()
        this.$message.success('停用成功')
      } else {
        this.$message.error(res.data.msg || '停用失败')
      }
    },
    async stopFlow(row) {
      this.currentRow = row
      this.processDetailRes = await getProcessDetailByTemplateId(row.templateId)
      if (!this.processDetailRes.data?.data?.processDefinitionId) {
        this.$message.error('流程id不存在！')
        return false;
      }
      // check 接口
      const msg = '此流程中存在未结束的申请单，暂时无法停用'
      const msg1 = '停用后将无法使用此流程，确定停用吗？'
      const res = {}
      if (res.msg) {
        this.confirmOption = {
          message: msg,
          cancelBtn: '取消',
          confirmBtn: '停用',
          fetch: true
        }
      } else {
        this.confirmOption = {
          message: msg1,
          cancelBtn: '取消',
          confirmBtn: '停用',
          fetch: true
        }
      }
      this.$refs.confirmation.dialogVisible = true;
    },
    async deleteFlow(row) {
      this.currentRow = row
      this.confirmOption = {
        message: '确定删除此流程？',
        cancelBtn: '取消',
        confirmBtn: '删除',
        flag: 'delete'
      }
      this.$refs.confirmation.dialogVisible = true;
    },
  }
}
</script>
<style lang="less" scoped>
.flow {
  height: 100%;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #E5E6EB;
    &-desc {
      margin-left: 8px;
      font-size: 12px;
      color: #86909C;
    }
    .el-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 34px;
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
  .el-button--text {
    padding: 5px;
  }
}
</style>
