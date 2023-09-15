<template>
  <div class="person-approval">
    <div class="approval-top">
      <div class="top-com">
        <div class="com-tit">一次通过率分布</div>
        <div class="com-echarts1">
          <barEcharts :industryData="passData"></barEcharts>
        </div>
      </div>
      <div class="top-com">
        <div class="com-tit">接受率分布</div>
        <div class="com-echarts1">
          <barEcharts :industryData="acceptanceDataBill"></barEcharts>
        </div>
      </div>
      <div class="top-com">
        <div class="com-tit">驳回率分布</div>
        <div class="com-echarts1">
          <barEcharts :industryData="rejectionData"></barEcharts>
        </div>
      </div>
    </div>
    <div class="approval-table">
      <div class="table-tit">
        <div class="tit-left">
          <div class="left-com">全部人员</div>
          <div class="left-com black">共<span class="blue">1500</span>人</div>
        </div>
        <div class="tit-search">
          <el-input v-model="keywords" placeholder="请输入提单人员姓名" clearable @clear="approvalList"
            @keyup.enter.native="approvalList">
            <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="approvalList"></i>
          </el-input>
        </div>
      </div>
      <div class="table-wrap  TRS-table-gray">
        <el-table :header-cell-style="{ background: '#f5f6f6' }" :data="billTable" style="width: 100%;">
          <el-table-column type="index" show-overflow-tooltip label="序号" align="center" width="75px">
            <template slot-scope="scope">
              <p class="black fs14">{{ scope.$index + 1 }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="name" show-overflow-tooltip label="提单人员" min-width="100px">
            <template slot-scope="scope">
              <p class="black fs14">{{ scope.row.name }}</p>
              <p class="gray fs12">{{ scope.row.id }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="tds" :sortable='true' show-overflow-tooltip label="提单数" align="center" min-width="90px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.tds }}</p>
                <p class="gray fs12 pt6 flex-box ">项<img class="icon pointer  w16"
                    @click="rejectDialogShow('申请概览', scope.row)" src="@/assets/image/person-center/tc2.png" alt="">
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="yjts" :sortable='true' show-overflow-tooltip label="意见条数" align="center"
            min-width="120px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.yjts }}</p>
                <p class="gray fs12 pt6">条</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="szxyj" :sortable='true' show-overflow-tooltip label="实质性意见" align="center"
            min-width="120px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.szxyj }}</p>
                <p class="gray fs12 pt6">/{{ scope.row.szxyjRate }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="fszxyj" :sortable='true' show-overflow-tooltip label="非质性意见" align="center"
            min-width="120px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.fszxyj }}</p>
                <p class="gray fs12 pt6">/{{ scope.row.fszxyjRate }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="jsl" :sortable='true' show-overflow-tooltip label="接受率" align="center" min-width="90px">
          </el-table-column>
          <el-table-column prop="yctgl" :sortable='true' show-overflow-tooltip label="一次通过率" align="center"
            min-width="120px">
          </el-table-column>
          <el-table-column prop="bhqk" :sortable='true' show-overflow-tooltip label="驳回情况" align="center"
            min-width="120px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.bhqk }}</p>
                <p class="gray fs12 pt6 flex-box">/{{ scope.row.bhqkRate }}<img class="icon pointer  w16"
                    @click="rejectDialogShow('驳回情况', scope.row)" src="@/assets/image/person-center/tc1.png" alt="">
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="hjtgl" :sortable='true' show-overflow-tooltip label="回检通过率" align="center"
            min-width="120px">
          </el-table-column>
        </el-table>
        <trs-pagination :total="total" @getList="approvalList" :pageNow="pageNow"></trs-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { proposeAcceptRate, proposeOnePassRate } from '@/api/personCenter'
import barEcharts from './bar-echarts'
export default {
  components: {
    barEcharts,
  },
  name: 'person-center-index',
  data() {
    return {
      total: 5,
      pageNow: 1,
      datePicker: '',
      billTable: [
        {
          name: '谭新宇',
          id: 'ID.34279811',
          tds: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          jsl: '90%',
          yctgl: '90%',
          bhqk: 2378,
          bhqkRate: '90%',
          hjtgl: '80%',
        },
        {
          name: '谭新宇',
          id: 'ID.34279811',
          tds: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          jsl: '90%',
          yctgl: '90%',
          bhqk: 2378,
          bhqkRate: '90%',
          hjtgl: '80%',
        },
        {
          name: '谭新宇',
          id: 'ID.34279811',
          tds: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          jsl: '90%',
          yctgl: '90%',
          bhqk: 2378,
          bhqkRate: '90%',
          hjtgl: '80%',
        },
        {
          name: '谭新宇',
          id: 'ID.34279811',
          tds: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          jsl: '90%',
          yctgl: '90%',
          bhqk: 2378,
          bhqkRate: '90%',
          hjtgl: '80%',
        },
        {
          name: '谭新宇',
          id: 'ID.34279811',
          tds: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          jsl: '90%',
          yctgl: '90%',
          bhqk: 2378,
          bhqkRate: '90%',
          hjtgl: '80%',
        },
      ],
      keywords: '',
      passData: {
        name: '一次通过率分布（人）',
        xData: ['＜20%', '20(含)-40%', '40(含)-60%', '60(含)-80%', '80(含)-100%'],
        yData: [700, 1200, 390, 200, 1500],
        rate: ['10%', '20%', '30%', '10%', '40%'],
      },
      acceptanceDataBill: {
        name: '接受率分布（人）',
        xData: ['＜20%', '20(含)-40%', '40(含)-60%', '60(含)-80%', '80(含)-100%'],
        yData: [600, 1200, 390, 200, 1500],
        rate: ['10%', '20%', '30%', '10%', '40%'],
      },
      rejectionData: {
        name: '驳回率分布（人）',
        xData: ['＜20%', '20(含)-40%', '40(含)-60%', '60(含)-80%', '80(含)-100%'],
        yData: [100, 1100, 390, 200, 1500],
        rate: ['10%', '20%', '30%', '10%', '40%'],
        seriesItemStyle: ['rgba(255,221,100,0.6)', 'rgba(255,153,0,0.6)'],
        emphasisItemStyle: ['#FFDD64', '#FF9900'],
      },
      rejectDialog: false,
      rejectDialogTit: '',
    }
  },
  mounted() {
  },
  watch: {
  },
  created() {
  },
  methods: {
    rejectDialogShow(rejectDialogTit, rowData) {
      const rejectDialogData = {
        rejectDialogTit,
        rowData,
        rejectDialog: true
      }
      this.$emit('rejectDialogShow', rejectDialogData)
    },
    approvalList() {
    },
    initChart(ref, option) {
      const chart = document.getElementById(ref);
      let myChart;
      if (chart) {
        myChart = this.$echarts.init(chart);
        myChart.setOption(option);
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', () => {
          myChart.resize();
        });
      });
    },
    searchList() { },
    // 接受率分布
    getProposeAcceptRate() {
      proposeAcceptRate({ dataFlag: 1 }).then((res) => {
        console.log('res', res);
      })
    },
    // 一次通过率分布
    getProposeOnePassRate() {
      proposeOnePassRate({ dataFlag: 1 }).then((res) => {
        console.log('res', res);
      })
    },
  },
}
</script>
<style lang="less" scoped>
.person-approval {
  margin-top: 16px;

  .approval-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .top-com {
      width: calc((100% - 32px) / 3);
      height: 290px;
      padding: 16px;
      box-sizing: border-box;
      border-radius: 10px;
      background: #FFFFFF;

      .com-tit {
        position: relative;
        padding-left: 13px;
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        color: #1D2128;

        &::before {
          content: '';
          display: block;
          width: 5px;
          height: 20px;
          background: #306EF5;
          border-radius: 0px 10px 0px 10px;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      .com-echarts {
        width: 100%;
        height: 220px;
        margin-top: 16px;
      }

      .com-echarts1 {
        width: 100%;
        height: 220px;
        margin-top: 16px;
      }
    }
  }

  .approval-table {
    background: #fff;
    padding: 16px;
    box-sizing: border-box;
    border-radius: 10px;
    margin-top: 16px;

    .table-tit {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .tit-left {
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        text-align: left;
        color: #1D2128;
        display: flex;
        align-items: center;
        gap: 12px;

        .black {
          color: #000000;
        }

        .blue {
          color: #2D5CF6;
          font-weight: 600;
          margin: 0 5px;
        }
      }

      .tit-search {
        width: 280px;

        /deep/ .el-input__inner {
          border-radius: 4px;
          border: none;
          background: #f7f8fa;
          color: #1d2128;
          font-size: 14px;
          font-weight: 400;
          height: 36px;
          line-height: 36px;
        }
      }
    }

    .table-wrap {
      margin-top: 16px;

      &.TRS-table-gray {
        /deep/ .el-table {
          border: none;

          &::before {
            display: none;
          }

          th.el-table__cell {
            font-size: 14px;
            font-weight: 700;
            color: #1D2128;
          }

          td.el-table__cell {
            border-right: none;
            border-bottom: 1px dashed #E5E6EB;
          }

          .black {
            color: #1D2128;
          }

          .gray {
            color: #505968;
          }

          .fs12 {
            font-size: 12px;
          }

          .fs14 {
            font-size: 14px;
          }

          .fw {
            font-weight: 700;
          }

          .w16 {
            width: 16px;
            height: 16px;
          }

          .w24 {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
          }

          .pt6 {
            padding-top: 6px;
          }

          .flex-box {
            display: flex;
            gap: 0 3px;
            align-items: center;
            justify-content: center;
          }

          .pointer {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
