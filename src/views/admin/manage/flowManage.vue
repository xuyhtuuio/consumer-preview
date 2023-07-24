<template>
  <div class="flow">
    <div class="title">
      <div>
        <span>流程管理</span>
        <span class="title-desc">停用流程时请先确认当前流程是否有未结束任务，且当前流程关联表单是否停用。</span>
      </div>
      <el-button type="primary" @click="addFlow">新增</el-button>
    </div>
    <!-- <TrsTable theme="TRS-table-gray" :data="data" :colConfig="colConfig">
      <template #status="scope">
        <TrsTag v-if="scope.row.status==='1'" :tag="tagItem" />
        <TrsTag v-else :tag="tagItem1" />
      </template>
      <template #operate="scope">
        <el-button type="text" @click="previewFlow(scope.row)">预览</el-button>
        <el-button type="text" v-if="scope.row.status === '1'" class="red" @click="stopFlow(scope.row)">停用</el-button>
        <el-button type="text" v-if="scope.row.status === '0'" @click="editFlow(scope.row)">编辑</el-button>
        <el-button type="text" v-if="scope.row.status === '0'" @click="publishFlow(scope.row)">发布</el-button>
        <el-button type="text" v-if="scope.row.status === '0'" class="red" @click="deleteFlow(scope.row)">删除</el-button>
      </template>
    </TrsTable>
    <TrsPagination :pageSize="10" :pageNow="page.pageNow" :total="page.total" @getList="handleCurrentChange" scrollType="scrollCom" scrollName="scrollCom"
      v-if="page.total">
    </TrsPagination> -->
  </div>
</template>
<script>
export default {
  name: 'flowManage',
  data() {
    return {
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
        {
          formName: '消保审批流程',
          formId: '关联表单1',
          remark: '表单说明111',
          status: '1',
          createUser: '章三',
          updateTime: '2023-07-12 09:00:01'
        },
        {
          formName: '消保审批流程1',
          formId: '关联表单2',
          remark: '表单说明2',
          status: '0',
          createUser: '章思',
          updateTime: '2023-07-13 09:00:11'
        }
      ],
      page: {
        pageNow: 1,
        total: 1
      },
      colConfig: [
        {
          label: '流程名称',
          prop: 'formName'
        },
        {
          label: '关联表单',
          prop: 'formId',
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
          prop: 'createUser'
        },
        {
          label: '更新时间',
          prop: 'updateTime',
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
    }
  },
  methods: {
    addFlow() {
      this.$router.push({
        name: 'design'
      })
    },
    handleCurrentChange() {

    },
    previewFlow() {},
    editFlow() {},
    publishFlow() {
      this.$message.success("审批流程已发布成功！")
    },
    stopFlow() {
      const msg = '此流程中存在未结束的申请单，暂时无法停用'
      const msg1 = '停用后将无法使用此流程，确定停用吗？'
      this.$confirm(`<div><div><i class="el-alert__icon el-icon-warning" style="color: #e6a23c;font-size: 26px;"></i></div>${msg}</div>`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        // type: 'warning'
      }).then(() => {
        
      })
    },
    deleteFlow() {},
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
      width: 80px;
      height: 34px;
      line-height: 26px;
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
