<template>
  <div class="person-center">
    <div class="center-scrren">
      <div class="tips">
        <i class="iconfont icon-xiaoxi-tongzhi"></i>消保审查个人月报已生成 <span>立即查看 ↓</span>
      </div>
      <div class="scrren-right">
        <div class="scrren-com" :class="billValue ? 'active' : ''">{{ billValue }}
          <img src="../../assets/image/person-center/down.png" class="down" alt="">
          <el-select v-model="billValue" placeholder="请选择" @change="billChange">
            <el-option v-for="item in billOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="scrren-com">
          <div class="com-tit">选择机构
            <img src="../../assets/image/person-center/down.png" class="down" alt="">
          </div>
          <el-cascader class="my-hidden" v-model="cascader" :options="agenciesList" :show-all-levels="false" :props="{
            emitPath: false,
            checkStrictly: true,
            label: 'name',
            value: 'id',
            children: 'children'
          }" @change="handleOrganChange"></el-cascader>
          <el-tooltip class="item" effect="dark" content="选择机构提示文字" placement="top">
            <img src="@/assets/image/person-center/hintIcon.png" alt="" class="hintIcon">
          </el-tooltip>
        </div>
        <div class="scrren-com">
          <el-popover placement="bottom-start" trigger="click" @show="handlePopoverShow" @hide="handlePopoverHide"
            :width="400">
            <el-date-picker ref="my-date-picker" v-model="datePicker" type="monthrange" align="right" range-separator="至"
              start-placeholder="开始月份" end-placeholder="结束月份" :picker-options="pickerOptions">
            </el-date-picker>
            <div slot="reference">
              提单时间
              <img src="../../assets/image/person-center/down.png" class="down" alt="" />
            </div>
          </el-popover>
        </div>
        <div class="scrren-btn">
          <img src="@/assets/image/person-center/reset.png" alt="" class="btnIcon">
          重置
        </div>
        <div class="scrren-btn">
          <img src="@/assets/image/person-center/share.png" alt="" class="btnIcon">
          导出数据
        </div>
      </div>
    </div>
    <personApproval v-if="billValue === '审批人员'" @rejectDialogShow="rejectDialogShow"></personApproval>
    <personLading v-if="billValue === '提单人员'" @rejectDialogShow="rejectDialogShow"></personLading>
    <el-dialog :visible.sync="rejectDialog" :before-close="rejectDialogClose"
      :width="rejectDialogTit === '驳回情况' ? '800px' : '1000px'" center custom-class="transfer-dialog">
      <span slot="title">{{ rejectDialogTit }}</span>
      <div class="dialog-cont">
        <div class="cont-approve" v-if="rejectDialogTit === '审批概览' || rejectDialogTit === '申请概览'">
          <div class="user">
            <div class="user-info">
              <img src="@/assets/image/ai-approval/ocr-avatar.png" alt="" />
              <span class="nickname">
                谭新宇
              </span>
              <span>总行 | 财富平台部 | 财富客群团队</span>
            </div>
            <slot name="apply-modify"></slot>
          </div>
          <div class="filters">
            <div class="filters-content">
              <div class="floor1">
                <el-select v-model="search.approvalType" placeholder="审批事项类型" @change="searchList" clearable>
                  <el-option v-for="(item, index) in transactionTypes" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
                <el-select v-model="search.hasOpinions" placeholder="有/无实质意见" @change="searchList" clearable>
                  <el-option v-for="(item, index) in $field('isOpinions')" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
                <el-select v-model="search.onceAdopt" placeholder="一次通过" @change="searchList" clearable>
                  <el-option v-for="(item, index) in $field('isOncePass')" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </div>
              <div class="floor2">
                <div class="floor2-item">
                  <el-input v-model="search.keywords" placeholder="请输入项目名称关键词查询" clearable @clear="searchList"
                    @keyup.enter.native="searchList">
                    <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="searchList"></i>
                  </el-input>
                </div>
                <div class="floor2-item floor2-itemW">
                  <span>提单时间</span>
                  <el-date-picker v-model="search.startDate" type="daterange" @clear="searchList" @change="searchList"
                    value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
                  </el-date-picker>
                </div>
              </div>
            </div>
          </div>
          <div class="list trs-scroll" v-loading="search.loading" ref="box">
            <div v-if="list.length">
              <div v-for="(item, index) in list" :key="index">
                <approvalEventCard :item="item" :crtSign="crtSign"></approvalEventCard>
              </div>
              <trs-pagination :total="search.total" @getList="getList" :pageNow="pageNow"></trs-pagination>
            </div>
            <div v-loading="search.loading" v-else>
              <Empty></Empty>
            </div>
          </div>
        </div>
        <div class="cont-echart" v-if="rejectDialogTit === '月度贡献值变化情况'">
          <div class="stackBar-echarts" id="passing-echarts"></div>
        </div>
        <div class="cont-reject" v-if="rejectDialogTit === '驳回情况'">
          <div class="reject-tab">
            <template v-for="(item, index) in tabList">
              <div :class="['tab-name', currentTabListIndex === index && 'active']" :key="'total' + item.id"
                @click="handleTabToggle(index)">
                {{ item.name }}
              </div>
              <span v-if="index !== 1" class="line" :key="index"></span>
            </template>
          </div>
          <div class="filters">
            <div class="filters-content">
              <div class="floor2">
                <div class="floor2-item">
                  <el-select v-model="search.approvalType" placeholder="审批事项类型" @change="searchList" clearable>
                    <el-option v-for="(item, index) in transactionTypes" :key="index" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </div>
                <div class="floor2-item floor2-itemW">
                  <span>提单时间</span>
                  <el-date-picker v-model="search.startDate" type="daterange" @clear="searchList" @change="searchList"
                    value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
                  </el-date-picker>
                </div>
              </div>
            </div>
          </div>
          <div class="reject-echart">
            <div class="echart-com" v-show="currentTabListIndex === 0">
              <div class="com-echart" id="reason-echart"></div>
              <div class="legend">
                <div class="legend-item" v-for="(item, index) in reasonData.xData" :key="'legend' + index">
                  <span class="legend-icon" :style="{ backgroundColor: reasonData.color[index] }"></span>
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>
            <div class="echart-com" v-show="currentTabListIndex === 1">
              <div class="com-echart com-echart-rate" id="reasonRate-echart"></div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getApprovalType,
  getApprovalListStation,
  getOrgTree
} from '@/api/approvalCenter'
import approvalEventCard from './components/approval-event-card'
import personApproval from './components/person-approval'
import personLading from './components/person-lading'
export default {
  components: {
    approvalEventCard,
    personApproval,
    personLading
  },
  name: 'person-center-index',
  data() {
    return {
      total: 5,
      pageNow: 1,
      cascader: '',
      agenciesList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', [new Date(), new Date()])
            }
          },
          {
            text: '上月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 12)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      datePicker: '',
      keywords: '',
      billOptions: [{
        value: '审批人员',
        label: '审批人员'
      }, {
        value: '提单人员',
        label: '提单人员'
      }],
      billValue: '审批人员',
      rejectDialog: false,
      rejectDialogTit: '',
      passingData: {
        xData: ['2022-09', '2022-10', '2022-11', '2022-12', '2023-01'],
        yData: [10, 12, 30, 20, 15],
      },
      search: {
        approvalType: '',
        approvalStage: '',
        urgent: '',
        hasOpinions: '',
        adoptionStatus: '',
        keywords: '',
        startDate: [],
        productLaunchDate: [],
        total: 0,
        loading: false,
        orgIds: []
      },
      transactionTypes: [],
      crtSign: 'allTask',
      list: [],
      tabList: [
        { id: 1, name: '驳回原因分布' },
        { id: 2, name: '驳回率' }
      ],
      currentTabListIndex: 0,
      reasonData: {
        xData: [
          '文件预览失败（文件损坏/清晰度过低）',
          '附件材料与审批项目不匹配',
          '其他',
        ],
        yData: [10, 12, 30],
        color: [
          '#249EFF',
          '#65CFE4',
          '#74E4BD',
        ],
        yDataHint: [
          {
            cp: 210,
            hd: 230,
            kh: 220,
            qt: 240,
          },
          {
            cp: 210,
            hd: 230,
            kh: 220,
            qt: 240,
          },
          {
            cp: 210,
            hd: 230,
            kh: 220,
            qt: 240,
          }
        ],
      },
      rejectionRateData: {
        name: '驳回率',
        xData: ['2022-11', '2022-12', '2023-01', '2023-02', '2023-03'],
        yData: [800, 1200, 390, 200, 1500],
      },
      contributionLoading: false,
      acceptanceLoading: false,
      processingLoading: false,
      rowData: {}
    }
  },
  mounted() {
    this.getOrgTree()
    this.billChange()
  },
  watch: {
  },
  created() {
  },
  methods: {
    getOrgTree() {
      getOrgTree().then((res) => {
        const { data } = res.data
        if (data) {
          const value = this.formatOrg(data.children)
          this.agenciesList = [
            {
              ...data,
              children: value
            }
          ]
        }
      })
    },
    formatOrg(data) {
      data.forEach((m) => {
        if (m.children && m.children.length) {
          this.formatOrg(m.children)
        } else {
          m.children = null
        }
      })
      return data
    },
    rejectDialogClose() {
      this.rejectDialog = false
      this.rejectDialogTit = ''
    },
    billChange() {
      if (this.billValue === '审批人员') {
        // this.$nextTick(() => {
        //   this.getApproveContribution()
        //   this.getApproveAcceptRate()
        //   this.getApproveAvgTime()
        // })
      }
    },
    // eslint-disable-next-line no-unused-vars
    rejectDialogShow(rejectDialogData) {
      // console.log('rejectDialogData', rejectDialogData);
      this.rejectDialogTit = rejectDialogData.rejectDialogTit;
      this.rowData = rejectDialogData.rowData;
      this.rejectDialog = true
      if (this.rejectDialogTit === '月度贡献值变化情况') {
        this.$nextTick(() => {
          this.initPassingEcharts(this.passingData);
        })
      }
      if (this.rejectDialogTit === '审批概览' || this.rejectDialogTit === '申请概览') {
        this.getApprovalType()
        this.getList(1)
      }
      if (this.rejectDialogTit === '驳回情况') {
        this.$nextTick(() => {
          this.initReasonEcharts(this.reasonData);
        })
      }
    },
    approvalList() {
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
          },
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
          minInterval: 1,
        },
        xAxis: {
          type: 'category',
          data: industryDataVal.xData,
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
            handleIcon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIuSURBVHgBtVXBTttAEH2zDiZRixRoT1UrkgP3Vj311H5ApVb9gbZfAHwByReQP2i/oCpSP4CeekLlzgEjEHAJRAKU4MReZpI42qzXlmOJJ1nyjj1vdmZn3hJycKx1vTrCptb4wE+DTY3ppx4RDuMR9oaE380aBVkc5DJe9HVDe/ghxCgCws8wQtsVSNmGy1Bvxgr/C5MLNL757HM+0Fu5AS6GeifS6PBrHYujrgm7wmEaZyWSnU/JUwhj4OQeuIkm62dL/FSAp547Emlsv6hSZxZAai5lsXcuxP9ugaO+m2ijBrx94gzUY983cibjEjH5jk1+y7v9dZVNLpBvf64n/1qoL3OTjDOY7v7YJs9wdEIy+LIG+FbLhD5WFdf9s+1wcFecPNmQlNJGZYAtpSr4ZP+cV5YsiI+cmQnPw3vF/f7aNHZHKI3gfn4t0y9Vmzvc7hCl4ShrQ+GRoXjMA9Ow4qE01iopU0+Rmg+wXkVpPF+aX7N0HKoowl/T6PNsb5QIIj6piY6xR6L5fohr0x5qnuLuYoP2cTUdgNu2qZpEcnnsmx8kC5fDIuRyR4gW5YqdZHAgYjdwk0tZ3q2kJQKG2M3k+owvC85k10UkgWQAkxmRTltfdhKPwQO2/dKU6wSnfd1SE2UtjThG+1WNWsk6dSdPM0nJdwH0eOftZOeZAQRyJlyVFs/IVxQA9/v+MMJ316VPeY7jQCLnrLg0EcUkq4BJA80zNKqiI52YxfEArMjodcM5n8kAAAAASUVORK5CYII=',
          },
          {
            type: 'inside',
            start: 5,
            end: 95,
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
                      offset: 0, color: industryDataVal.seriesItemStyle ? industryDataVal.seriesItemStyle[0] : 'rgba(33,204,255,0.6)' // 100% 处的颜色
                    },
                    {
                      offset: 1, color: industryDataVal.seriesItemStyle ? industryDataVal.seriesItemStyle[1] : 'rgba(33,204,255,0.6)' // 0% 处的颜色
                    }
                  ],
                },
              },
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
                      offset: 0, color: industryDataVal.emphasisItemStyle ? industryDataVal.emphasisItemStyle[0] : '#21CCFF' // 100% 处的颜色
                    },
                    {
                      offset: 1, color: industryDataVal.emphasisItemStyle ? industryDataVal.emphasisItemStyle[1] : '#2D5CF6' // 0% 处的颜色
                    }
                  ],
                },
              },
            },
            data: industryDataVal.yData,
          },
        ]
      };
      this.initChart('passing-echarts', option)
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
    getList(pageNow) {
      const listType = '4'
      this.pageNow = pageNow
      const param = {
        pageNow,
        pageSize: 10,
        ...this.search,
        listType,
        formManagementId: this.search.approvalType,
        nodeid: this.search.approvalStage,
        orgIds: this.search.orgIds.length ? this.search.orgIds : null,
        createTimeStart:
          this.search.startDate && this.search.startDate.length > 0
            ? this.search.startDate[0] + ' 00:00:00'
            : '',
        createTimeEnd:
          this.search.startDate && this.search.startDate.length > 0
            ? this.search.startDate[1] + ' 23:59:59'
            : '',
      }
      Reflect.deleteProperty(param, 'total')
      Reflect.deleteProperty(param, 'loading')
      Reflect.deleteProperty(param, 'productLaunchDate')
      Reflect.deleteProperty(param, 'startDate')
      this.search.loading = true
      const userInfo = JSON.parse(window.localStorage.getItem('user_name'))
      const taskDTO = {
        pageNo: 0,
        pageSize: 10,
        currentUserInfo: {
          id: userInfo.id,
          name: userInfo.fullname
        }
      }
      // eslint-disable-next-line
      const wait_param = {
        ...param,
        taskDTO
      }
      getApprovalListStation(wait_param)
        .then((res) => {
          const { data } = res.data
          this.search.total = data.totalCount
          const flag = Array.isArray(data.list)
          this.list = flag && data.list.length > 0
            ? data.list.map((v) => {
              return {
                ...v,
                taskNumber: v.recordId + '',
                taskName: v.entryName,
                initiator: {
                  ...v.originator,
                  label: v.institutional && v.institutional[1]
                },
                taskStatus: v.nodeStatus
              }
            })
            : []
          this.search.loading = false
        })
        .catch(() => {
          this.search.loading = false
          this.search.total = 0
          this.list = []
        })
    },
    // 驳回原因分布
    initReasonEcharts(industryDataVal) {
      const yData1 = JSON.parse(JSON.stringify(industryDataVal.yData))
      const xData1 = JSON.parse(JSON.stringify(industryDataVal.xData))
      const color = JSON.parse(JSON.stringify(industryDataVal.color)).reverse()
      const option = {
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderColor: 'rgba(255,255,255,0.8)',
          formatter(params) {
            const p = `
            <div style="padding: 6px;display:flex;gap:8px;flex-direction:column;font-size:12px">
            <div style="line-height: 20px;color:rgba(29, 33, 40, 1);font-weight:700">驳回原因</div>
            <div>
              <div style="display:flex;align-items:center;gap:12px;color:#1D2128;">
                <span style="margin-right:4px;border-radius:10px;width:10px;height:10px;background-color: ${params.color};"></span>
                <span>${params.name}</span>
                <span>${params.data}项</span>
              </div>
              <div style="display:flex;gap:12px;">
                <span style="margin-right:4px;border-radius:10px;width:10px;height:10px;"></span>
                <div style="flex:1;display:flex;justify-content: space-between;">
                  <div style="display:flex;align-items:center;gap:12px;font-size:20px;zoom:0.5">
                    <span>产品类</span>
                    <span>230项</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:12px;font-size:20px;zoom:0.5">
                    <span>活动类</span>
                    <span>23项</span>
                  </div>
                </div>
              </div>
              <div style="display:flex;gap:12px;">
                <span style="margin-right:4px;border-radius:10px;width:10px;height:10px;"></span>
                <div style="flex:1;display:flex;justify-content: space-between">
                  <div style="display:flex;align-items:center;gap:12px;font-size:20px;zoom:0.5">
                    <span>产品类</span>
                    <span>230项</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:12px;font-size:20px;zoom:0.5">
                    <span>活动类</span>
                    <span>23项</span>
                  </div>
                </div>
              </div>
            </div>
            </div>
            `
            return p
          }
        },
        grid: {
          top: '0',
          left: '0',
          right: '10',
          bottom: '10',
          containLabel: true
        },
        xAxis: {},
        yAxis: {
          type: 'category',
          data: xData1,
          axisLabel: {
            formatter(value) {
              let str = '';
              const num = 9; // 每行显示字数
              const valLength = value.length; // 该项x轴字数
              const rowNum = Math.ceil(valLength / num); // 行数
              if (rowNum > 1) {
                for (let i = 0; i < rowNum; i++) {
                  let temp = '';
                  const start = i * num;
                  const end = start + num;

                  temp = value.substring(start, end) + '\n';
                  str += temp;
                }
                return str;
              } else {
                return value;
              }
            }
          }
        },
        series: {
          barWidth: '16px',
          name: xData1.reverse()[0],
          type: 'bar',
          itemStyle: {
            color: (params) => {
              return color[params.dataIndex]
            }
          },
          data: yData1.reverse()
        }
      }
      this.initChart('reason-echart', option)
    },
    handleTabToggle(index) {
      if (this.currentTabListIndex !== index) {
        this.currentTabListIndex = index
        if (index === 0) {
          this.initReasonEcharts(this.reasonData)
        }
        if (index === 1) {
          this.initRejectionRateEcharts(this.rejectionRateData)
        }
      }
    },
    initRejectionRateEcharts(industryDataVal) {
      const option = {
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          trigger: 'axis',
          formatter: (serie) => {
            const name = serie[0].axisValueLabel
            const params = `<p class="charts-tooltip-p fontw black">${name}</p><p class="charts-tooltip-p fontw black"><span class="serieName"><span class="charts-tooltip-dot" style="background: #21CCFF;"></span>驳回率</span><span><span class="blue">${serie[0].data}</span>%</span></p>`
            return params
          },
        },
        grid: {
          left: '0',
          right: '0',
          top: '12%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: industryDataVal.xData
        },
        yAxis: {
          type: 'value',
          name: '%',
        },
        series: [
          {
            data: industryDataVal.yData,
            type: 'line',
            areaStyle: { normal: {} },
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(0,194,255, 0.05)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#fff' // 100% 处的颜色
                  }
                ]), // 背景渐变色
                lineStyle: {
                  // 系列级个性化折线样式
                  color: '#21CCFF'
                }
              }
            },
            smooth: true
          }
        ]
      };
      this.initChart('reasonRate-echart', option)
    },
    handleOrganChange(item) {
      if (!item && this.cascader.length) {
        this.handleSearchBlur()
      }
    },
    handlePopoverShow() {
      this.$refs['my-date-picker'].handleFocus()
    },
    handlePopoverHide() {
      if (this.datePicker) {
        this.handleSearchBlur()
      }
    },
    handleSearchBlur() {
      // console.log(this.search)
    },
    getApprovalType() {
      getApprovalType().then((res) => {
        this.transactionTypes = res.data.data.map((v) => {
          return {
            label: v.examineTypesName,
            value: v.recordId
          }
        })
      })
    },
  },
}
</script>
<style lang="less" scoped>
.person-center {
  .center-scrren {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tips {
      display: inline-block;
      color: #FA8C16;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      padding: 6px 12px;
      border-radius: 20px;
      background: linear-gradient(90deg, #FFE7C0 0%, rgba(255, 213, 145, 0) 67.75%);
      margin-bottom: 8px;
      width: 400px;
      cursor: default;
      align-items: center;

      span {
        border-bottom: 1px solid #FA8C16;
        display: inline-block;
        cursor: pointer;
        margin-left: 5px;
      }

      i {
        margin-right: 8px;
        font-size: 16px;
      }
    }

    .scrren-right {
      display: flex;
      align-items: center;
      gap: 12px;

      .scrren-com {
        cursor: pointer;
        color: #1D2128;
        font-size: 16px;
        line-height: 24px;
        width: fit-content;
        padding: 0 6px;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 4px;
        position: relative;

        &.active {
          color: #2D5CF6;
        }

        .my-hidden {
          position: absolute;
          opacity: 0;
        }

        .el-select {
          position: absolute;
          opacity: 0;
        }

        .down {
          width: 12px;
        }

        .hintIcon {
          width: 20px;
          margin-left: 4px;
        }
      }

      .scrren-btn {
        cursor: pointer;
        width: fit-content;
        display: flex;
        align-items: center;
        height: 36px;
        padding: 6px 16px 6px 16px;
        border-radius: 4px;
        gap: 4px;
        background: #2D5CF6;
        color: #FFFFFF;
        font-size: 14px;

        .btnIcon {
          width: 20px;
        }
      }
    }
  }

  /deep/ .transfer-dialog {
    border-radius: 10px;
    background: #fff;
    padding: 40px 60px;
    /* 阴影/大 */
    box-shadow: 0px 0px 10px 0px rgba(67, 67, 67, 0.1);

    .el-dialog__header {
      padding: 0;
      color: var(--gray-gray-9, #1d2128);
      text-align: center;

      /* 二级标题/加粗 */
      font-family: Microsoft YaHei;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;

      /* 150% */
      .el-dialog__headerbtn {
        right: 60px;
        top: 40px;
        font-size: 20px;
        color: #505968;
      }
    }

    .el-dialog__body {
      padding: 0;
    }

    .dialog-cont {
      margin-top: 24px;

      .filters {
        display: flex;
        padding-right: 16px;
        justify-content: space-between;

        .filters-content {
          display: flex;
          flex-direction: column;
          flex: 1;

          /deep/ .el-input__inner,
          /deep/ .el-range-input {
            border-radius: 4px;
            border: none;
            background: #f7f8fa;
            color: #1d2128;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;

            .el-range-separator {
              padding: 0;
            }
          }

          .floor1 {
            // padding-right: 16px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .el-select,
            .el-cascader {
              margin-bottom: 12px;
              width: 32%;
            }

            /deep/ .el-cascader .el-input .el-icon-arrow-down::before {
              font-family: element-icons !important;
              content: '\e790';
            }

            /deep/ .el-select .el-input .el-icon-arrow-up::before {
              font-family: element-icons !important;
              content: '\e78f';
            }
          }

          .floor2 {
            width: 100%;
            display: flex;
            padding-right: 16px;

            .floor2-item {
              width: 33%;
              margin-right: 16px;
              display: flex;
              align-items: center;

              .el-input,
              .el-date-editor {
                width: 100%;
              }

              span {
                color: #86909c;
                font-size: 14px;
                font-weight: 400;
                line-height: 22px;
                word-break: keep-all;
                margin-right: 8px;
              }
            }

            .floor2-itemW {
              width: 40%;
            }

            .floor2-item:last-of-type {
              margin-right: 0;
            }

            /deep/.el-range-editor {
              position: relative;

              .el-icon-date,
              .el-icon-time {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
              }

              .el-icon-time::before {
                font-family: element-icons !important;
                content: '\e78e';
              }

              .el-input__suffix {
                right: 20px;
              }
            }
          }
        }

        .export-reset {
          border-left: 1px dashed #e5e6eb;
          padding-left: 16px;
          display: flex;
          flex-direction: column;

          .el-button {
            height: 38px;
            padding: 6px 0px;
            width: 84px;
            border-radius: 6px;
            border: 1px solid #a8c5ff;
            background: #f0f6ff;
            margin-left: 0;
            margin-bottom: 12px;
          }

          .el-button:last-of-type {
            margin-bottom: 0;
          }
        }
      }

      .cont-approve {
        .user {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          width: fit-content;

          .user-info {
            flex: 1;
            padding-right: 12px;
            border-radius: 20px;
            background: #f7f8fa;
            display: flex;
            align-items: center;

            .avatar {
              width: 32px;
              height: 32px;
              background: #80a6ff;
              text-align: center;
              line-height: 32px;
              border-radius: 20px;
              margin-right: 8px;
              font-weight: 700;
              color: #fff;
              font-size: 14px;
            }

            img {
              width: 32px;
              height: 32px;
              margin-right: 8px;
            }

            color: #505968;
            font-size: 12px;
            font-weight: 400;
            line-height: 32px;

            .nickname {
              color: #1d2128;
              font-weight: 700;
              line-height: 32px;
              margin-right: 16px;
            }
          }
        }

        .list {
          padding-right: 16px;
          height: 390px;
          overflow-y: auto;
        }
      }

      .el-input__inner,
      .el-range-input {
        border-radius: 4px;
        border: none;
        background: #f7f8fa;
        color: #1d2128;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;

        .el-range-separator {
          padding: 0;
        }
      }

      .el-range-editor .el-icon-date {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
      }

      .cont-screen {
        width: 100%;
        display: flex;
        padding-right: 16px;

        .screen-item {
          margin-right: 16px;
          display: flex;
          align-items: center;

          .el-input,
          .el-date-editor {
            width: 100%;
          }

          .el-cascader .el-input .el-icon-arrow-down::before {
            font-family: element-icons !important;
            content: "\e790";
          }

          .el-select .el-input .el-icon-arrow-up::before {
            font-family: element-icons !important;
            content: "\e78f";
          }

          .el-range-editor .el-icon-date {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
          }

          .item-tit {
            color: #1D2128;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            word-break: keep-all;
            margin-right: 8px;
          }

          span {
            color: #86909C;
          }
        }

        .screen-item1 {
          width: 208px;

          .hintIcon {
            width: 20px;
            margin-left: 4px;
          }
        }

        .screen-item2 {
          width: 208px;

          .el-select {
            width: 100%;
          }
        }

        .screen-item3 {
          width: 416px;
        }

        .screen-item:last-of-type {
          margin-right: 0;
        }

        /deep/.el-range-editor {
          position: relative;

          .el-icon-date,
          .el-icon-time {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
          }

          .el-icon-time::before {
            font-family: element-icons !important;
            content: "\e78e";
          }

          .el-input__suffix {
            right: 20px;
          }
        }
      }

      .cont-echart {
        margin-top: 24px;
        height: 454px;

        .stackBar-echarts {
          height: 454px;
        }
      }

      .cont-reject {
        .reject-tab {
          width: 100%;
          display: flex;
          gap: 12px;
          align-items: center;
          line-height: 22px;
          color: #1D2128;
          position: relative;

          .tab-name {
            font-weight: 700;
            cursor: pointer;

            &.active {
              color: #2D5CF6;
            }
          }

          .line {
            padding: 4px 0;
            width: 1px;
            background-color: #CACDD3;
          }
        }

        .filters {
          width: 100%;
          margin-top: 24px;

          .floor2-item {
            width: 240px !important;

            .el-select {
              width: 100%;
            }
          }

          .floor2-itemW {
            width: 416px !important;
          }
        }

        .reject-echart {
          width: 100%;
          margin-top: 24px;

          .echart-com {
            width: 100%;

            .com-echart {
              width: 680px;
              height: 242px;
            }

            .com-echart-rate {
              height: 288px;
            }

            .legend {
              display: flex;
              justify-content: center;
              align-items: center;
              flex-wrap: wrap;
              padding: 0 40px;
              font-size: 12px;

              &-item {
                display: flex;
                align-items: center;
                gap: 8px;
                line-height: 20px;
                margin-top: 8px;

                &:not(:first-child) {
                  margin-left: 24px;
                }
              }

              &-icon {
                width: 8px;
                height: 8px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.el-range-editor.el-input__inner {
  width: 100%;
}

.charts-tooltip-p {
  text-align: left;
  min-width: 80px;
  color: '#505968';
  line-height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;

  &.fontw {
    font-weight: 700;
  }

  &.black {
    color: #333;
  }

  // span {
  //   margin-right: 10px;
  // }

  .charts_span {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #2D5CF6;
    border: 2px solid #FFFFFF;
    box-sizing: border-box;
    border-radius: 50%;
    margin-right: 8px;
  }

  .charts_num {
    margin-left: 6px;
  }

  // transform: scale(0.83);
  &.charts-tooltip-p {
    margin-top: 6px;
  }

  .charts-tooltip-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
  }

  .serieName {
    display: inline-block;
    width: fit-content;
    padding-right: 15px;
  }

  .blue {
    color: #2D5CF6;
  }

  .bold {
    font-weight: bold;
    color: '#1D2128';
    display: inline-block;
    width: fit-content;
    padding-left: 15px;
  }
}

.charts-tooltip-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 300px;

  .w50 {
    width: 49%;
  }
}

.charts-tooltip-box-s {
  width: 220px;
}

.el-picker-panel__footer {
  display: none;
}
</style>
