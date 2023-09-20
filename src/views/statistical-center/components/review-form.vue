<template>
  <div class="review-form" v-loading="isShow">
    <TrsTable
      theme="TRS-table-gray"
      :data="data"
      :colConfig="colConfig"
      @sort-change="sortChange"
      @submitEdit="submitEdit"
      :header-cell-style="{ 'text-align': 'center', 'font-weight': 400 }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <template #id="{ $index }">
        <div>
          {{ $index + 1 }}
        </div>
      </template>
      <template #org="scope">
        <div class="orgName">
          <span
            class="org-icon"
            :style="{'background-color' : colorData[scope.$index%7]} "
          ></span>
          {{ scope.row.org }}
        </div>
      </template>
    </TrsTable>
    <TrsPagination
      :pageSize="page.pageSize"
      :pageNow="page.pageNow"
      :total="page.total"
      @getList="handleCurrentChange"
    >
    </TrsPagination>
  </div>
</template>

<script>
import { reviewTaskDistribution } from '@/api/statistical-center'
export default {
  data() {
    return {
      isShow: true,
      colConfig: [
        {
          label: '序号',
          prop: 'id',
          bind: {
            width: 50,
            align: 'center'
          }
        },
        {
          label: '机构',
          prop: 'orgName',
          bind: {
            width: 140,
            align: 'center'
          }
        },
        {
          label: '审查项目数',
          prop: 'examineAllTotal'
        },
        {
          label: '平均审查时长',
          prop: 'averageReviewDuration',
          bind: {
            width: 120,
            align: 'center'
          }
        },
        {
          label: '一次通过率',
          prop: 'formOneTimePassRate'
        },
        {
          label: '接受率',
          prop: 'viewAcceptanceRate',
          bind: {
            align: 'center',
            sortable: 'custom'
          }
        }
      ],
      data: [
      ],
      colorData: [
        '#2D5CF6',
        '#14C9C9',
        '#FA8C16',
        '#F7BA1E',
        '#CF84CD',
        '#52C41A',
        '#EB2F96'
      ],
      page: {
        pageNow: 1,
        total: 20,
        pageSize: 8
      },
      searchData: null
    }
  },
  methods: {
    async initData(data = this.searchData) {
      this.isShow = true
      this.searchData = data
      const { data: res } = await reviewTaskDistribution(data)
      if (res.success) {
        this.data = res.data.list
        this.isShow = false
      }
    },
    sortChange() {},
    submitEdit() {},
    handleCurrentChange() {}
  }
}
</script>

<style lang="less" scoped>
.review-form {
  width: 50%;
  .org {
    display: flex;
    align-items: center;
    gap: 8px;
    .org-icon {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
  }
}
</style>
