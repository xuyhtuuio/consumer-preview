<template>
  <div class="review-form">
    <TrsTable
      theme="TRS-table-gray"
      :data="data"
      :colConfig="colConfig"
      @sort-change="sortChange"
      @submitEdit="submitEdit"
      :header-cell-style="{ 'text-align': 'center','font-weight':400 }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <template #id="{ $index }">
        <div>
          {{ $index + 1 }}
        </div>
      </template>
    </TrsTable>
     <TrsPagination :pageSize="page.pageSize" :pageNow="page.pageNow" :total="page.total"
        @getList="handleCurrentChange">
      </TrsPagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
          prop: 'org',
          bind: {
            align: 'center'
          }
        },
        {
          label: '审查项目数',
          prop: 'project'
        },
        {
          label: '平均审查时长',
          prop: 'average'
        },
        {
          label: '一次通过率',
          prop: 'firstTime'
        },
        {
          label: '接受率',
          prop: 'acceptanceRate',
          bind: {
            align: 'center',
            sortable: 'custom'
          }
        }
      ],
      data: [
        {
          org: '招商银行总行',
          project: '13245',
          average: '3h',
          firstTime: '90.3%',
          acceptanceRate: '89.3%'
        },
        {
          org: '招商银行总行',
          project: '13245',
          average: '3h',
          firstTime: '90.3%',
          acceptanceRate: '89.3%'
        },
        {
          org: '招商银行总行',
          project: '13245',
          average: '3h',
          firstTime: '90.3%',
          acceptanceRate: '89.3%'
        },
        {
          org: '招商银行总行',
          project: '13245',
          average: '3h',
          firstTime: '90.3%',
          acceptanceRate: '89.3%'
        },
        {
          org: '招商银行总行',
          project: '13245',
          average: '3h',
          firstTime: '90.3%',
          acceptanceRate: '89.3%'
        },
        {
          org: '招商银行总行',
          project: '13245',
          average: '3h',
          firstTime: '90.3%',
          acceptanceRate: '89.3%'
        },
        {
          org: '招商银行总行',
          project: '13245',
          average: '3h',
          firstTime: '90.3%',
          acceptanceRate: '89.3%'
        },
        {
          org: '招商银行总行',
          project: '13245',
          average: '3h',
          firstTime: '90.3%',
          acceptanceRate: '89.3%'
        }
      ],
      page: {
        pageNow: 1,
        total: 20,
        pageSize: 8
      }
    }
  },
  methods: {
    sortChange() {

    },
    submitEdit() {

    },
    handleCurrentChange() {}
  }
}
</script>

<style lang="less" scoped>
.review-form {
  width: 50%;
}
</style>
