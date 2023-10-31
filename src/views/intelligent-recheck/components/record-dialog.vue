<template>
  <div class="outter">
    <div class="top-tabble">
      <TrsTable
      theme="TRS-table-gray"
      :data="recordDetailList"
      :colConfig="colConfig"
      @sort-change="sortChange"
      @submitEdit="submitEdit"
      @rowDragSort="rowDragSort"
    >
      <template #fileName="scope">
        <div class="short">{{ scope.row.fileName }}</div>
      </template>
      <template #userName="scope">
        <div class="center">
          {{ scope.row.userName }}
        </div>
      </template>

      <template #createTime="scope">
        <div class="short">
          {{ timeFormat(scope.row.createTime) }}
        </div>
      </template>
      <template #backInspectionFrequency="scope">
        <div class="center">
          {{ scope.row.backInspectionFrequency }}
          <span style="font-size: 12px">次</span>
          <img
            src="../../../assets/image/notice.png"
            alt=""
            style="width: 16px; height: 16px"
            @click="handleOpenRecord"
          />
        </div>
      </template>
      <template #feedBack="scope">
        <div style="padding: 15px 0px" class="center">
          {{ scope.row.feedBack }}
        </div>
      </template>

      <template #isRight="scope">
        <div>{{ scope.row.isRight }}</div>
      </template>

      <template #thingTpe="scope">
        <div class="center">{{ scope.row.thingTpe }}</div>
      </template>
      <template #department="scope">
        <div class="center">{{ scope.row.department }}</div>
      </template>
    </TrsTable>

    </div>

    <TrsPagination
      :pageSize="page.pageSize"
      :pageNow="page.pageNow"
      :total="page.totalCount"
      @getList="handleCurrentChange"
    >
    </TrsPagination>
  </div>

</template>
<script>
import * as dayjs from 'dayjs'
import { getRecheckDetailList } from '@/api/intelligent-recheck'
export default {
  name: 'TestTrsTable',
  props: {
    ocrId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    search: '',
    recordDetailList: [],
    colConfig: [
      {
        label: '序号',
        prop: '',
        bind: {
          align: 'center',
          type: 'index',
          width: 70,
          index: function indexMethod(index) {
            return index + 1
          }
        }
      },
      {
        label: '回检文件名称',
        header: 'fileHeader',
        prop: 'fileName',
        bind: {
          align: 'center',
          width: 150
        }
      },
      {
        label: '回检人员',
        prop: 'userName',
        header: 'people-header',
        bind: {
          align: 'center',
          width: 150
        }
      },
      {
        label: '回检时间',
        prop: 'createTime',
        bind: {
          align: 'center',
          width: 130
        }
      },

      {
        label: '回检意见',
        prop: 'feedBack',
        bind: {
          align: 'center',
          width: 490
        }
      }
    ],
    page: {
      pageNow: 1,
      pageSize: 5,
      totalCount: 0
    },
    searchParmO: {}
  }),
  methods: {
    sortChange({ column, prop, order }) {
      console.log(column, prop, order)
    },
    handleClick(row) {
      console.log(row)
    },
    submitEdit(row, beforeRow, prop) {
      console.log(row)
      console.log(beforeRow)
      console.log(prop)
    },
    rowDragSort(data) {
      console.log(data)
    },
    timeFormat(val) {
      return val ? dayjs(val).format('YYYY-MM-DD ') : '--'
    },
    handleOpenOption(option) {
      this.$emit('openOption', option)
    },
    handleOpenRecord(option) {
      this.$emit('openRecord', option)
    },
    handleCurrentChange(pageNow) {
      this.page.pageNow = pageNow
      this.getList()
    },
    async getList() {
      this.searchParmO.ocrId = this.ocrId
      this.searchParmO.pageNow = this.page.pageNow
      this.searchParmO.pageSize = this.page.pageSize
      const res = await getRecheckDetailList(this.searchParmO)
      if (res.status === 200) {
        const { list, totalCount } = res.data.data
        this.recordDetailList = list
        this.page.totalCount = totalCount
      }
    },
    getOnePage() {
      this.page.pageNow = 1
      this.getList()
    }
  },
  async mounted() {
    console.log('mounted', this.ocrId)
    this.getList()
  },
  created() {

  },
}
</script>
<style lang="less" scoped>

.top-tabble {
  height: 530px;
  overflow-y: auto;
}
.short {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.people-id {
  color: var(--gray-gray-8, #505968);
  font-size: 12px;
  line-height: 20px;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.left {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
}

.hover {
  &:hover {
    cursor: pointer;
    color: var(--unnamed, #2d5cf6);
  }
}

// :deep(.el-dialog) {
//   background-color: red;
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   margin: 0 !important;
//   transform: translate(-50%, -50%);
//   max-height: calc(100% - 30px);
//   max-width: calc(100% - 30px);
//   display: flex;
//   flex-direction: column;
// }

</style>
