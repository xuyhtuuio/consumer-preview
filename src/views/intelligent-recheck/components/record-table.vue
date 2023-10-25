<template>
  <div>
    <TrsTable
      theme="TRS-table-gray"
      :data="data"
      :colConfig="colConfig"
      @sort-change="sortChange"
      @submitEdit="submitEdit"
      @rowDragSort="rowDragSort"
    >
      <template #fileName="scope">
        <div class="short hover" @click="openFilePreview">{{ scope.row.fileName }}</div>
        <div class="people-id left">ID: {{ scope.row.fileID }}</div>
      </template>
      <template #people="scope">
        <div style="position: relative; right: 20px; padding: 5px 0px">
          {{ scope.row.people }}
        </div>
        <div class="people-id">工号: {{ scope.row.peopleID }}</div>
      </template>

      <template #backInspectionFrequency="scope">
        <div class="center">
          {{ scope.row.backInspectionFrequency }}
          <span style="font-size: 12px">次</span>
          <img
            src="../../../assets/image/notice.png"
            alt=""
            style="width: 16px; height: 16px; cursor: pointer;"
            @click="handleOpenRecord"
          />
        </div>
      </template>
      <template #backInspectionOption="scope">
        <div
          class="short"
          @click="handleOpenOption(scope.row.backInspectionOption)"
        >
          {{ scope.row.backInspectionOption }}
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
    <TrsPagination
      :pageSize="10"
      :pageNow="page.pageNow"
      :total="page.totalCount"
      @getList="handleCurrentChange"
    >
    </TrsPagination>
  </div>
</template>
<script>
export default {
  name: 'TestTrsTable',
  data: () => ({
    search: '',
    data: [
      {
        fileName: '景顺长城七月报告七月七月',
        fileID: '202308090023',
        people: '谭新宇',
        peopleID: '34279811',
        backInspectionTime: '2023-8-31',
        isRight: '是',
        thingTpe: '产品类',
        department: '财富平台部',
        backInspectionFrequency: '8',
        backInspectionOption:
          '活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；'
      },
      {
        fileName: '景顺长城七月报告七月七月',
        fileID: '202308090023',
        people: '谭新宇',
        peopleID: '34279811',
        backInspectionTime: '2023-8-31',
        isRight: '是',
        thingTpe: '产品类',
        department: '财富平台部',
        backInspectionFrequency: '8',
        backInspectionOption:
          '活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；'
      },
      {
        fileName: '景顺长城七月报告七月七月',
        fileID: '202308090023',
        people: '谭新宇',
        peopleID: '34279811',
        backInspectionTime: '2023-8-31',
        isRight: '是',
        thingTpe: '产品类',
        department: '财富平台部',
        backInspectionFrequency: '8',
        backInspectionOption:
          '活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；'
      },
      {
        fileName: '景顺长城七月报告七月七月',
        fileID: '202308090023',
        people: '谭新宇',
        peopleID: '34279811',
        backInspectionTime: '2023-8-31',
        isRight: '是',
        thingTpe: '产品类',
        department: '财富平台部',
        backInspectionFrequency: '8',
        backInspectionOption:
          '活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；'
      },
      {
        fileName: '景顺长城七月报告七月七月',
        fileID: '202308090023',
        people: '谭新宇',
        peopleID: '34279811',
        backInspectionTime: '2023-8-31',
        isRight: '是',
        thingTpe: '产品类',
        department: '财富平台部',
        backInspectionFrequency: '8',
        backInspectionOption:
          '活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；'
      },
      {
        fileName: '景顺长城七月报告七月七月',
        fileID: '202308090023',
        people: '谭新宇',
        peopleID: '34279811',
        backInspectionTime: '2023-8-31',
        isRight: '是',
        thingTpe: '产品类',
        department: '财富平台部',
        backInspectionFrequency: '8',
        backInspectionOption:
          '活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；'
      },
      {
        fileName: '景顺长城七月报告七月七月',
        fileID: '202308090023',
        people: '谭新宇',
        peopleID: '34279811',
        backInspectionTime: '2023-8-31',
        isRight: '是',
        thingTpe: '产品类',
        department: '财富平台部',
        backInspectionFrequency: '8',
        backInspectionOption:
          '活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；'
      }
    ],
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
        prop: 'people',
        header: 'people-header',
        bind: {
          align: 'center',
          width: 150
        }
      },
      {
        label: '回检时间',
        prop: 'backInspectionTime',
        bind: {
          align: 'center',
          width: 100
        }
      },
      {
        label: '是否符合要求',
        prop: 'isRight',
        bind: {
          align: 'center',
          width: 120
        }
      },
      {
        label: '事项类型',
        prop: 'thingTpe',
        bind: {
          align: 'center',
          width: 120
        }
      },
      {
        label: '文件所在部门',
        prop: 'department',
        bind: {
          align: 'center',
          width: 150
        }
      },
      {
        label: '回检次数',
        prop: 'backInspectionFrequency',
        bind: {
          align: 'center',
          width: 120
        }
      },
      {
        label: '回检意见',
        prop: 'backInspectionOption',
        bind: {
          align: 'center',
          width: 280
        }
      }
    ],
    page: {
      pageNow: 1,
      totalCount: 100
    }
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
    handleOpenOption(option) {
      this.$emit('openOption', option)
    },
    handleOpenRecord(option) {
      this.$emit('openRecord', option)
    },
    handleCurrentChange() {},
    openFilePreview() {
      this.$emit('openFilePreview')
    }
  }
}
</script>
<style lang="less" scoped>
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
</style>
