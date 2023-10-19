<template>
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
          <img src="../../../assets/image/notice.png" alt="" style="width: 16px; height: 16px;">
        </el-col>
        <el-col :span="8" align="center" class="my-col-new">
          {{ item.backInspectionOption }}
        </el-col>
      </el-row>
    </div>
    <div class="table-bottom">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000"
        class="my-pag"
      />
    </div>
  </div>
</template>

<script>
import { recordData } from '../record-data'
export default {
  name: 'RecordTable',
  data() {
    return {
      recordData
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
</style>
