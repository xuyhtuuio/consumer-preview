<template>
  <div class="flow">
    <div class="title">
      <div>
        <span>流程管理</span>
        <span class="title-desc">停用流程时请先确认当前流程是否有未结束任务，且当前流程关联表单是否停用。</span>
      </div>
      <el-button type="primary" @click="addFlow">新增</el-button>
    </div>
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
        <el-button type="text" v-if="scope.row.status === '已发布'" class="red" @click="stopFlow(scope.row)">停用</el-button>
        <el-button type="text" v-if="scope.row.status !== '已发布'" @click="editFlow(scope.row)">编辑</el-button>
        <el-button type="text" v-if="scope.row.status !== '已发布'" @click="publishFlow(scope.row)">发布</el-button>
        <el-button type="text" v-if="scope.row.status !== '已发布'" class="red" @click="deleteFlow(scope.row)">删除</el-button>
      </template>
    </TrsTable>
    <TrsPagination :pageSize="10" :pageNow="page.pageNow" :total="page.total" @getList="handleCurrentChange" scrollType="scrollCom" scrollName="scrollCom"
      v-if="page.total">
    </TrsPagination>
    <w-dialog :showFooter="false" v-model="flowVisible" :title="currentRow.templateName + '-预览'">
      <process-design from="flowManage" ref="processDesign" style="background: #f5f6f6;" />
    </w-dialog>
  </div>
</template>
<script>
import { getProcessList } from '@/api/manage'
import { deleteProcess, publishProcess, getProcessDetailByTemplateId, stopProcess } from '@/api/design'
import ProcessDesign from '@/views/admin/layout/ProcessDesign'
export default {
  name: 'flowManage',
  components: {
    ProcessDesign
  },
  data() {
    return {
      tableLoading: false,
      flowVisible: false,
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
            width: 250,
            align: 'center'
          }
        },
      ],
      currentRow: {}
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
      this.$nextTick(() => {
        this.flowVisible = true
      })
    },
    editFlow(row) {
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
    async publishFlow(row) {
      const res = await publishProcess(row)
      if (res.data) {
        this.getProcessList()
        this.$message.success("审批流程已发布成功！可在列表页查看")
      }
    },
    async stopFlow(row) {
      const processDetailRes = await getProcessDetailByTemplateId(row.templateId)
      console.log(processDetailRes.data)
      if (!processDetailRes.data?.data?.processDefinitionId) {
        this.$message.error("流程id不存在！")
        return;
      }
      const res = await stopProcess(processDetailRes.data.data.processDefinitionId, row.templateId)
      // const msg = '此流程中存在未结束的申请单，暂时无法停用'
      // const msg1 = '停用后将无法使用此流程，确定停用吗？'
      const msg = res.data?.msg
      if (msg) {
        this.$confirm(`<div><div><i class="el-alert__icon el-icon-warning" style="color: #e6a23c;font-size: 26px;"></i></div>${msg}</div>`, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          // type: 'warning'
        }).then(() => {
          
        })
      } else {
        this.getProcessList()
        this.$message.success('停用成功')
      }
    },
    async deleteFlow(row) {
      const res = await deleteProcess(row.templateId)
      if (res.data.data === 1) {
        this.$message.success('删除成功')
        this.getProcessList({
          pageNow: 1
        })
      }
    },
  }
}
</script>
<style lang="less" scoped>
.flow {
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
