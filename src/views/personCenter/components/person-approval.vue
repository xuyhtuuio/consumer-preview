<template>
  <div class="person-approval">
    <div class="approval-top">
      <div class="top-com" v-loading="contributionLoading">
        <div class="com-tit">贡献值分布</div>
        <div class="com-echarts" id="contribution"></div>
      </div>
      <div class="top-com" v-loading="acceptanceLoading">
        <div class="com-tit">接受率分布</div>
        <div class="com-echarts">
          <barEcharts :industryData="acceptanceData"></barEcharts>
        </div>
      </div>
      <div class="top-com" v-loading="processingLoading">
        <div class="com-tit">平均处理时长分布</div>
        <div class="com-echarts" id="processing"></div>
      </div>
    </div>
    <div class="approval-table">
      <div class="table-tit">
        <div class="tit-left">
          <div class="left-com">全部人员</div>
          <div class="left-com black">共<span class="blue">{{ personListData.personTotalCount }}</span>人</div>
        </div>
        <div class="tit-search">
          <el-input v-model="personListData.username" placeholder="请输入审查人员姓名" clearable @clear="getApprovePersonList(1)" @keyup.enter.native="getApprovePersonList(1)">
            <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="getApprovePersonList(1)"></i>
          </el-input>
        </div>
      </div>
      <div class="table-wrap  TRS-table-gray" v-loading="personListLoading">
        <el-table :header-cell-style="{ background: '#f5f6f6' }" :data="personListData.list" style="width: 100%;" @sort-change="sortChange">
          <el-table-column type="index" show-overflow-tooltip label="序号" align="center" width="75px">
            <template slot-scope="scope">
              <p class="black fs14">{{ scope.$index + 1 }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="userName" show-overflow-tooltip label="审查人员" min-width="90px">
            <template slot-scope="scope">
              <p class="black fs14">{{ scope.row.userName }}</p>
              <p class="gray fs12">{{ scope.row.userId }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="levelNum" :sortable="'custom'" show-overflow-tooltip label="等级" align="center" min-width="130px">
            <template slot-scope="scope">
              <div class="flex-box">
                <img class="icon w24" v-if="scope.row.levelNum" :src="require('@/assets/image/person-center/level'+Math.ceil(Number(scope.row.levelNum) / 5)+'.png')" alt="">
                <p class="gray fs12 fw">Lv.{{ scope.row.levelNum }}</p>
                <p class="black fs12">{{ scope.row.levelName }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="contribution" :sortable="'custom'" show-overflow-tooltip label="贡献值" align="center" min-width="90px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs14 fw">{{ scope.row.contribution }}</p>
                <img @click="rejectDialogShow('月度贡献值变化情况', scope.row)" class="icon pointer w16" src="@/assets/image/person-center/tc1.png" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="approvalNum" :sortable="'custom'" show-overflow-tooltip label="审查数" align="center" min-width="100px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.approvalNum }}</p>
                <p class="gray fs12 pt6 flex-box ">项<img @click="rejectDialogShow('审批概览', scope.row)" class="icon pointer  w16" src="@/assets/image/person-center/tc2.png" alt=""></p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="opinionCount" :sortable="'custom'" show-overflow-tooltip label="意见条数" align="center" min-width="120px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.opinionCount }}</p>
                <p class="gray fs12 pt6">条</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="substanCount" :sortable="'custom'" show-overflow-tooltip label="实质性意见" align="center" min-width="130px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.substanCount }}</p>
                <p class="gray fs12 pt6">/{{ scope.row.substantiveRate }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="unSubstanCount" :sortable="'custom'" show-overflow-tooltip label="非质性意见" align="center" min-width="130px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.unSubstanCount }}</p>
                <p class="gray fs12 pt6">/{{ scope.row.unSubstantiveRate }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="secondBatchNum" :sortable="'custom'" show-overflow-tooltip label="秒批笔数" align="center" min-width="130px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.secondBatchNum }}</p>
                <p class="gray fs12 pt6">项</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="avgHandleTime" :sortable="'custom'" show-overflow-tooltip label="平均处理时长" align="center" min-width="130px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.avgHandleTime }}</p>
                <p class="gray fs12 pt6">h</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="acceptRate" :sortable="'custom'" show-overflow-tooltip label="接受率" align="center" min-width="90px">
          </el-table-column>
          <el-table-column prop="returnPassRate" :sortable="'custom'" show-overflow-tooltip label="回检通过率" align="center" min-width="130px">
          </el-table-column>
        </el-table>
        <trs-pagination :total="personListData.totalCount" @getList="getApprovePersonList" :pageNow="personListData.pageNow"></trs-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {
  approveContribution,
  approveAcceptRate,
  approveAvgTime,
  approvePersonList
} from '@/api/personCenter'
import barEcharts from './bar-echarts'
export default {
  components: {
    barEcharts
  },
  name: 'person-approval',
  props: {
    searchData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      contributionData: {
        xData: [
          '＜100',
          '100(含)-200',
          '200(含)-300',
          '300(含)-400',
          '400(含)-500'
        ],
        yData: [800, 1200, 390, 200, 1500]
      },
      acceptanceData: {
        name: '接受率（%）',
        xData: [],
        yData: [],
        rate: []
      },
      processingData: [],
      colorListTimes: [
        '#5773F9',
        '#249EFF',
        '#21CCFF',
        '#81E2FF',
        '#81DC74',
        '#B7DB57'
      ],
      keywords: '',
      rejectDialog: false,
      rejectDialogTit: '',
      contributionLoading: false,
      acceptanceLoading: false,
      processingLoading: false,
      personListLoading: false,
      personListData: {
        username: '',
        list: [],
        pageNow: 1,
        totalCount: 0,
        personTotalCount: 0,
        sortValue: null,
        sortType: ''
      }
    }
  },
  mounted() {},
  watch: {},
  created() {},
  methods: {
    sortChange({ prop, order }) {
      const propList = {
        levelNum: 1,
        contribution: 2,
        approvalNum: 3,
        opinionCount: 4,
        substanCount: 5,
        unSubstanCount: 6,
        secondBatchNum: 7,
        avgHandleTime: 8,
        acceptRate: 9,
        returnPassRate: 10
      }
      this.personListData.sortValue = propList[prop]
      // eslint-disable-next-line no-nested-ternary
      this.personListData.sortType = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
      this.getApprovePersonList(1)
    },
    rejectDialogShow(rejectDialogTit, rowData) {
      const rejectDialogData = {
        rejectDialogTit,
        rowData,
        rejectDialog: true
      }
      this.$emit('rejectDialogShow', rejectDialogData)
    },
    // 贡献值分布
    initContribuEcharts(industryDataVal) {
      const option = {
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          trigger: 'axis',
          formatter: (serie) => {
            const name = serie[0].axisValueLabel
            let params = `<p class="charts-tooltip-p fontw black"><span class="serieName"><span class="charts-tooltip-dot" style="background: #5773F9;"></span>${name}</span><span><span class="blue">${serie[0].data}</span>人</span></p>`
            params += `<p class="charts-tooltip-p black">占全部人员  <span class="blue">${
              industryDataVal.rate[serie[0].dataIndex]
            }</span>%</p>`
            return params
          }
        },
        grid: {
          left: '0',
          right: '0',
          top: '14%',
          bottom: '12%',
          containLabel: true
        },
        legend: {
          bottom: 0,
          itemWidth: 8,
          itemHeight: 8,
          itemStyle: {
            color: '#2D5CF6'
          }
        },
        yAxis: {
          type: 'value',
          name: '人',
          minInterval: 1
        },
        xAxis: {
          type: 'category',
          data: industryDataVal.title
        },
        series: [
          {
            // barWidth: '16px',
            name: '贡献值（分）',
            type: 'bar',
            label: {
              show: false
            },
            itemStyle: {
              normal: {
                // borderRadius: [8, 8, 0, 0],
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(33,204,255,0.6)',
                      opacity: 0.6 // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(45,92,246,0.6)',
                      opacity: 0.6 // 0% 处的颜色
                    }
                  ]
                }
              }
            },
            emphasis: {
              itemStyle: {
                // borderRadius: [8, 8, 0, 0],
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#21CCFF',
                      opacity: 1 // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#2D5CF6',
                      opacity: 1 // 0% 处的颜色
                    }
                  ]
                }
              }
            },
            data: industryDataVal.count
          }
        ]
      }
      this.initChart('contribution', option)
    },
    // 平均处理时长分布
    initProcessingEcharts(industryDataVal) {
      const option = {
        color: this.colorListTimes,
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderWidth: 0,
          formatter: (serie) => {
            const { name } = serie
            let params = `<p class="charts-tooltip-p fontw black"><span class="serieName"><span class="charts-tooltip-dot" style="background: ${serie.color}"></span>平均处理时长${name}</span><span><span class="blue">${serie.value}</span>人</span></p>`
            params += `<p class="charts-tooltip-p black">占全部人员  <span class="blue">${serie.data.rate}</span>%</p>`
            return params
          }
        },
        legend: {
          orient: 'vertical',
          right: 25,
          y: 'center',
          // 设置图例形状
          itemWidth: 12,
          itemHeight: 8,
          itemGap: 15,
          textStyle: {
            fontSize: 12,
            rich: {
              a: {
                fontWeight: 400
              },
              b: {
                width: '200px',
                lintHeight: '28px'
              }
            }
          },
          formatter(name) {
            const { value } = industryDataVal.find((item) => item.name === name)
            return `{b|${name}} {a| ${value}人}`
          }
        },
        grid: {
          left: '0',
          right: '0',
          bottom: '14%',
          containLabel: true
        },
        series: [
          {
            name: '平均处理时长',
            type: 'pie',
            radius: [35, 80],
            center: ['30%', '50%'],
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                formatter({ name, value }) {
                  return `{a|${name}项}\n{b| ${value}}`
                },
                rich: {
                  a: {
                    lineHeight: 20,
                    fontWeight: '700'
                  },
                  b: {
                    color: '#505968'
                  }
                }
              }
            },
            data: this.processingData
          }
        ]
      }
      this.initChart('processing', option)
    },
    // 月度贡献值变化情况
    initPassingEcharts(industryDataVal) {
      const option = {
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          trigger: 'axis',
          formatter: (serie) => {
            const name = serie[0].axisValueLabel
            let params = '<p class="charts-tooltip-p fontw black">贡献值</p>'
            params += `<p class="charts-tooltip-p black"><span style="margin-right:12px">${name}</span><span>贡献值${serie[0].data}</span></p>`
            return params
          }
        },
        grid: {
          left: '0',
          right: '0',
          bottom: '8%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          name: '分',
          minInterval: 1
        },
        xAxis: {
          type: 'category',
          data: industryDataVal.xData
        },
        dataZoom: [
          {
            start: 0,
            end: 100,
            bottom: '2%',
            height: 8,
            backgroundColor: '#F9F9FB',
            borderColor: '#fff',
            fillerColor: '#E5F9FF',
            moveHandleSize: 0,
            handleSize: '180%',
            handleIcon:
              'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIuSURBVHgBtVXBTttAEH2zDiZRixRoT1UrkgP3Vj311H5ApVb9gbZfAHwByReQP2i/oCpSP4CeekLlzgEjEHAJRAKU4MReZpI42qzXlmOJJ1nyjj1vdmZn3hJycKx1vTrCptb4wE+DTY3ppx4RDuMR9oaE380aBVkc5DJe9HVDe/ghxCgCws8wQtsVSNmGy1Bvxgr/C5MLNL757HM+0Fu5AS6GeifS6PBrHYujrgm7wmEaZyWSnU/JUwhj4OQeuIkm62dL/FSAp547Emlsv6hSZxZAai5lsXcuxP9ugaO+m2ijBrx94gzUY983cibjEjH5jk1+y7v9dZVNLpBvf64n/1qoL3OTjDOY7v7YJs9wdEIy+LIG+FbLhD5WFdf9s+1wcFecPNmQlNJGZYAtpSr4ZP+cV5YsiI+cmQnPw3vF/f7aNHZHKI3gfn4t0y9Vmzvc7hCl4ShrQ+GRoXjMA9Ow4qE01iopU0+Rmg+wXkVpPF+aX7N0HKoowl/T6PNsb5QIIj6piY6xR6L5fohr0x5qnuLuYoP2cTUdgNu2qZpEcnnsmx8kC5fDIuRyR4gW5YqdZHAgYjdwk0tZ3q2kJQKG2M3k+owvC85k10UkgWQAkxmRTltfdhKPwQO2/dKU6wSnfd1SE2UtjThG+1WNWsk6dSdPM0nJdwH0eOftZOeZAQRyJlyVFs/IVxQA9/v+MMJ316VPeY7jQCLnrLg0EcUkq4BJA80zNKqiI52YxfEArMjodcM5n8kAAAAASUVORK5CYII='
          },
          {
            type: 'inside',
            start: 5,
            end: 95
          }
        ],
        series: [
          {
            barWidth: '16px',
            name: '贡献值',
            type: 'bar',
            label: {
              show: false
            },
            itemStyle: {
              normal: {
                borderRadius: [8, 8, 0, 0],
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: industryDataVal.seriesItemStyle
                        ? industryDataVal.seriesItemStyle[0]
                        : 'rgba(33,204,255,0.6)' // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: industryDataVal.seriesItemStyle
                        ? industryDataVal.seriesItemStyle[1]
                        : 'rgba(33,204,255,0.6)' // 0% 处的颜色
                    }
                  ]
                }
              }
            },
            emphasis: {
              itemStyle: {
                borderRadius: [8, 8, 0, 0],
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: industryDataVal.emphasisItemStyle
                        ? industryDataVal.emphasisItemStyle[0]
                        : '#21CCFF' // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: industryDataVal.emphasisItemStyle
                        ? industryDataVal.emphasisItemStyle[1]
                        : '#2D5CF6' // 0% 处的颜色
                    }
                  ]
                }
              }
            },
            data: industryDataVal.yData
          }
        ]
      }
      this.initChart('passing-echarts', option)
    },
    initChart(ref, option) {
      const chart = document.getElementById(ref)
      let myChart
      if (chart) {
        myChart = this.$echarts.init(chart)
        myChart.setOption(option)
        window.addEventListener('resize', () => {
          myChart.resize()
        })
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', () => {
          myChart.resize()
        })
      })
    },
    // 审批人员-贡献值分布
    getApproveContribution() {
      this.contributionLoading = true
      const getData = {
        orgId: this.searchData.orgId?.length
          ? this.searchData.orgId[this.searchData.orgId.length - 1]
          : '',
        startTime: this.searchData.datePicker?.length
          ? this.searchData.datePicker[0]
          : '',
        endTime: this.searchData.datePicker?.length
          ? this.searchData.datePicker[1]
          : ''
      }
      approveContribution(getData).then((res) => {
        const { data } = res
        if (data.data) {
          this.contributionData = data.data
          this.initContribuEcharts(this.contributionData)
        }
        this.contributionLoading = false
      })
    },
    // 审批人员-接受率分布
    getApproveAcceptRate() {
      this.acceptanceLoading = true
      const getData = {
        orgId: this.searchData.orgId?.length
          ? this.searchData.orgId[this.searchData.orgId.length - 1]
          : '',
        startTime: this.searchData.datePicker?.length
          ? this.searchData.datePicker[0]
          : '',
        endTime: this.searchData.datePicker?.length
          ? this.searchData.datePicker[1]
          : ''
      }
      approveAcceptRate(getData).then((res) => {
        const { data } = res
        if (data.data) {
          // this.acceptanceData = data.data
          this.acceptanceData.xData = data.data.title
          this.acceptanceData.yData = data.data.count
          this.acceptanceData.rate = data.data.rate
        }
        this.acceptanceLoading = false
      })
    },
    // 审批人员-平均处理时长分布
    getApproveAvgTime() {
      this.processingLoading = true
      this.processingData = []
      const getData = {
        orgId: this.searchData.orgId?.length
          ? this.searchData.orgId[this.searchData.orgId.length - 1]
          : '',
        startTime: this.searchData.datePicker?.length
          ? this.searchData.datePicker[0]
          : '',
        endTime: this.searchData.datePicker?.length
          ? this.searchData.datePicker[1]
          : ''
      }
      approveAvgTime(getData).then((res) => {
        const { data } = res
        if (data.data) {
          data.data.title.map((item, index) => {
            this.processingData.push({
              value: data.data.count[index],
              name: data.data.title[index],
              rate: data.data.rate[index]
            })
          })
          this.initProcessingEcharts(this.processingData)
        }
        this.processingLoading = false
      })
    },

    getApprovePersonList(pageNow) {
      if (pageNow) {
        this.personListData.pageNow = pageNow
      }
      this.personListLoading = true
      this.personListData.list = []
      approvePersonList({
        orgId: this.searchData.orgId?.length
          ? this.searchData.orgId[this.searchData.orgId.length - 1]
          : '',
        startTime: this.searchData.datePicker?.length
          ? this.searchData.datePicker[0]
          : '',
        endTime: this.searchData.datePicker?.length
          ? this.searchData.datePicker[1]
          : '',
        sortValue: this.personListData.sortValue,
        sortType: this.personListData.sortType,
        pageNow: this.personListData.pageNow,
        username: this.personListData.username
      }).then((res) => {
        const { data } = res
        this.personListData.list = data.data.page.list
        this.personListData.totalCount = data.data.page.totalCount
        this.personListData.personTotalCount = data.data.personTotalCount
        this.personListLoading = false
      })
    }
  }
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
      background: #ffffff;

      .com-tit {
        position: relative;
        padding-left: 13px;
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        color: #1d2128;

        &::before {
          content: '';
          display: block;
          width: 5px;
          height: 20px;
          background: #306ef5;
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
        color: #1d2128;
        display: flex;
        align-items: center;
        gap: 12px;

        .black {
          color: #000000;
        }

        .blue {
          color: #2d5cf6;
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
            color: #1d2128;
          }

          td.el-table__cell {
            border-right: none;
            border-bottom: 1px dashed #e5e6eb;
          }

          .black {
            color: #1d2128;
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
            height: auto;
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
