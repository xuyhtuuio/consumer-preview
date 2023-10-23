<!-- <template>
  <div class="outter">
    <el-row class="table-head">
      <el-col :span="1" align="center"> 序号 </el-col>
      <el-col :span="5" align="center"> 回检文件名称 </el-col>
      <el-col :span="4" align="center"> 回检人员 </el-col>
      <el-col :span="3" align="center"> 回检时间 </el-col>
      <el-col :span="3" align="center"> 是否符合要求 </el-col>
      <el-col :span="3" align="center"> 事项类型 </el-col>
      <el-col :span="4" align="center"> 文件所在部门 </el-col>
      <el-col :span="3" align="center"> 回检次数 </el-col>
      <el-col :span="8" align="center"> 回检意见 </el-col>
    </el-row>
    <div class="table-content">
      <el-row
        v-for="(item, index) in recordData"
        :key="index"
        style="text-align: center"
        class="table-head-again"
      >
        <el-col :span="1" align="center" justify="center" class="my-col-1">
          {{ index + 1 }}
        </el-col>
        <el-col :span="5" align="center" class="my-col-5">
          <p>{{ item.backInspectionFile.fileName }}</p>
          <p class="file-id">ID.{{ item.backInspectionFile.fileID }}</p>
        </el-col>
        <el-col :span="4" align="center" class="my-col-4">
          <p>{{ item.backInspectionPeople.people }}</p>
          <p class="people-id">
            工号：{{ item.backInspectionPeople.peopleID }}
          </p>
        </el-col>
        <el-col :span="3" align="center" class="my-col-new">
          {{ item.backInspectionTime }}
        </el-col>
        <el-col :span="3" align="center" class="my-col-new">
          {{ item.isRight }}
        </el-col>
        <el-col :span="3" align="center" class="my-col-new">
          {{ item.thingTpe }}
        </el-col>
        <el-col :span="4" align="center" class="my-col-new">
          {{ item.department }}
        </el-col>
        <el-col
          :span="3"
          align="center"
          class="my-col-new"
          style="font-size: 16px"
        >
          {{ item.backInspectionFrequency
          }}<span style="font-size: 12px">次</span>
          <img
            src="../../../assets/image/notice.png"
            alt=""
            style="width: 16px; height: 16px"
            @click="handleOpenRecord"
          />
        </el-col>
        <el-col :span="8" align="center" class="my-col-new">
          <div @click="handleOpenOption(item.backInspectionOption)">
            {{ item.backInspectionOption }}
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-bottom">
      <TrsPagination
        :pageSize="10"
        :pageNow="page.pageNow"
        :total="page.total"
        scrollType="scrollCom"
        scrollName="scrollCom"
        @getList="handleCurrentChange"
        v-if="page.total"
      >
      </TrsPagination>
    </div>
  </div>
</template>

<script>
import { recordData } from '../record-data'
export default {
  name: 'RecordTable',
  data() {
    return {
      recordData,
      page: {
        pageNow: 1,
        total: 1
      }
    }
  },
  methods: {
    handleOpenOption(option) {
      this.$emit('openOption', option)
    },
    handleOpenRecord(option) {
      this.$emit('openRecord', option)
    },
    handleCurrentChange(val) {
    }
  }
}
</script>

<style scoped lang="less">
.outter {
  .table-head {
    width: 100%;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    height: 42px;
    margin-top: 16px;
    border-radius: 4px;
    background-color: rgba(249, 249, 251, 1);
    color: var(--gray-gray-9, #1d2128);
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
  }

  .table-head-again {
    width: 100%;
    padding: 30px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    height: 42px;
    border-radius: 4px;
    color: var(--gray-gray-9, #1d2128);
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
    border-bottom: 1px dashed var(--gray-gray-3, #f2f3f5);

    &:nth-child(8) {
      border-bottom: none;
    }
  }
  .table-content {
    :deep(.el-col) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .my-col-5 {
    position: relative;
    left: 15px;
    text-align: start;
    color: var(--gray-gray-9, #1d2128);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

    &:hover {
      cursor: pointer;
      color: var(--unnamed, #2d5cf6);
    }

    .file-id {
      color: var(--gray-gray-8, #505968);
      font-size: 12px;
      line-height: 20px;
    }
  }

  .my-col-4 {
    position: relative;
    left: 22px;
    text-align: start;
    color: var(--gray-gray-9, #1d2128);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    .people-id {
      color: var(--gray-gray-8, #505968);
      font-size: 12px;
      line-height: 20px;
    }
  }

  .my-col-1 {
    color: var(--gray-gray-8, #505968);
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
  }

  .my-col-new {
    color: var(--gray-gray-9, #1d2128);
    cursor: pointer;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }

  .my-row {
    flex-wrap: wrap;
  }

  .table-bottom {
    margin-top: 30px;
    display: flex;
    flex-direction: row-reverse;
    .my-pag {
      margin-left: auto;
    }
  }
}
</style> -->
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
        <div class="short hover">{{ scope.row.fileName }}</div>
        <div class="people-id left">ID: {{ scope.row.fileID }}</div>
      </template>
      <template #people="scope">
        <div style="position: relative; right: 20px">
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
            style="width: 16px; height: 16px"
            @click="handleOpenRecord"
          />
        </div>
      </template>
      <template #backInspectionOption="scope">
        <div style="padding: 15px 0px;"
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
          '活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；'
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
          '活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；'
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
        label: '回检意见',
        prop: 'backInspectionOption',
        bind: {
          align: 'center',
          width: 520
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
    handleCurrentChange() {
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
