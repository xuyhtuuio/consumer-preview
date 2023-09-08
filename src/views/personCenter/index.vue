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
          <el-tooltip class="item" effect="dark" content="选择机构提示文字" placement="top">
            <img src="@/assets/image/person-center/hintIcon.png" alt="" class="hintIcon">
          </el-tooltip>
        </div>
        <div class="scrren-com">提单时间
          <img src="../../assets/image/person-center/down.png" class="down" alt="">
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
    <div class="person-approval" v-if="billValue === '审批人员'">
      <div class="approval-top">
        <div class="top-com">
          <div class="com-tit">贡献值分布</div>
          <div class="com-echarts" id="contribution"></div>
        </div>
        <div class="top-com">
          <div class="com-tit">接受率分布</div>
          <div class="com-echarts">
            <barEcharts :industryData="acceptanceData"></barEcharts>
          </div>
        </div>
        <div class="top-com">
          <div class="com-tit">平均处理时长分布</div>
          <div class="com-echarts" id="processing"></div>
        </div>
      </div>
      <div class="approval-table">
        <div class="table-tit">
          <div class="tit-left">
            <div class="left-com">全部人员</div>
            <div class="left-com black">共<span class="blue">1500</span>人</div>
          </div>
          <div class="tit-search">
            <el-input v-model="keywords" placeholder="请输入审查人员姓名" clearable @clear="approvalList"
              @keyup.enter.native="approvalList">
              <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="approvalList"></i>
            </el-input>
          </div>
        </div>
        <div class="table-wrap  TRS-table-gray">
          <el-table :header-cell-style="{ background: '#f5f6f6' }" :data="approvalTable" style="width: 100%;">
            <el-table-column type="index" show-overflow-tooltip label="序号" align="center" width="75px">
              <template slot-scope="scope">
                <p class="black fs14">{{ scope.$index + 1 }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="name" show-overflow-tooltip label="审查人员">
              <template slot-scope="scope">
                <p class="black fs14">{{ scope.row.name }}</p>
                <p class="gray fs12">{{ scope.row.id }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="level" :sortable='true' show-overflow-tooltip label="等级" align="center">
              <template slot-scope="scope">
                <div class="flex-box">
                  <img class="icon w24" v-if="scope.$index === 0" src="../../assets/image/person-center/level1.png"
                    alt="">
                  <img class="icon w24" v-else-if="scope.$index === 1" src="../../assets/image/person-center/level2.png"
                    alt="">
                  <img class="icon w24" v-else src="../../assets/image/person-center/level3.png" alt="">
                  <p class="gray fs12 fw">Lv.{{ scope.row.level }}</p>
                  <p class="black fs12">{{ scope.row.levelName }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="gxz" :sortable='true' show-overflow-tooltip label="贡献值" align="center">
              <template slot-scope="scope">
                <div class="flex-box">
                  <p class="black fs14 fw">{{ scope.row.gxz }}</p>
                  <img class="icon pointer w16" src="../../assets/image/person-center/tc1.png" alt="">
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="scs" :sortable='true' show-overflow-tooltip label="审查数" align="center">
              <template slot-scope="scope">
                <div class="flex-box">
                  <p class="black fs16 ">{{ scope.row.scs }}</p>
                  <p class="gray fs12 pt6 flex-box ">项<img class="icon pointer  w16"
                      src="../../assets/image/person-center/tc2.png" alt=""></p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="yjts" :sortable='true' show-overflow-tooltip label="意见条数" align="center">
              <template slot-scope="scope">
                <div class="flex-box">
                  <p class="black fs16 ">{{ scope.row.yjts }}</p>
                  <p class="gray fs12 pt6">条</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="szxyj" :sortable='true' show-overflow-tooltip label="实质性意见" align="center">
              <template slot-scope="scope">
                <div class="flex-box">
                  <p class="black fs16 ">{{ scope.row.szxyj }}</p>
                  <p class="gray fs12 pt6">/{{ scope.row.szxyjRate }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="fszxyj" :sortable='true' show-overflow-tooltip label="非质性意见" align="center">
              <template slot-scope="scope">
                <div class="flex-box">
                  <p class="black fs16 ">{{ scope.row.fszxyj }}</p>
                  <p class="gray fs12 pt6">/{{ scope.row.fszxyjRate }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="mpbs" :sortable='true' show-overflow-tooltip label="秒批笔数" align="center">
              <template slot-scope="scope">
                <div class="flex-box">
                  <p class="black fs16 ">{{ scope.row.mpbs }}</p>
                  <p class="gray fs12 pt6">项</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="pjclsc" :sortable='true' show-overflow-tooltip label="平均处理时长" align="center">
              <template slot-scope="scope">
                <div class="flex-box">
                  <p class="black fs16 ">{{ scope.row.pjclsc }}</p>
                  <p class="gray fs12 pt6">h</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="jsl" :sortable='true' show-overflow-tooltip label="接受率" align="center">
            </el-table-column>
            <el-table-column prop="hjtgl" :sortable='true' show-overflow-tooltip label="回检通过率" align="center">
            </el-table-column>
          </el-table>
          <trs-pagination :total="total" @getList="approvalList" :pageNow="pageNow"></trs-pagination>
        </div>
      </div>
    </div>
    <div class="person-approval" v-if="billValue === '提单人员'">
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
            <el-table-column prop="name" show-overflow-tooltip label="提单人员">
              <template slot-scope="scope">
                <p class="black fs14">{{ scope.row.name }}</p>
                <p class="gray fs12">{{ scope.row.id }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="tds" :sortable='true' show-overflow-tooltip label="提单数" align="center">
              <template slot-scope="scope">
                <div class="flex-box">
                  <p class="black fs16 ">{{ scope.row.tds }}</p>
                  <p class="gray fs12 pt6 flex-box ">项<img class="icon pointer  w16"
                      src="../../assets/image/person-center/tc2.png" alt=""></p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="yjts" :sortable='true' show-overflow-tooltip label="意见条数" align="center">
              <template slot-scope="scope">
                <div class="flex-box">
                  <p class="black fs16 ">{{ scope.row.yjts }}</p>
                  <p class="gray fs12 pt6">条</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="szxyj" :sortable='true' show-overflow-tooltip label="实质性意见" align="center">
              <template slot-scope="scope">
                <div class="flex-box">
                  <p class="black fs16 ">{{ scope.row.szxyj }}</p>
                  <p class="gray fs12 pt6">/{{ scope.row.szxyjRate }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="fszxyj" :sortable='true' show-overflow-tooltip label="非质性意见" align="center">
              <template slot-scope="scope">
                <div class="flex-box">
                  <p class="black fs16 ">{{ scope.row.fszxyj }}</p>
                  <p class="gray fs12 pt6">/{{ scope.row.fszxyjRate }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="jsl" :sortable='true' show-overflow-tooltip label="接受率" align="center">
            </el-table-column>
            <el-table-column prop="yctgl" :sortable='true' show-overflow-tooltip label="一次通过率" align="center">
            </el-table-column>
            <el-table-column prop="bhqk" :sortable='true' show-overflow-tooltip label="驳回情况" align="center">
              <template slot-scope="scope">
                <div class="flex-box">
                  <p class="black fs16 ">{{ scope.row.bhqk }}</p>
                  <p class="gray fs12 pt6 flex-box">/{{ scope.row.bhqkRate }}<img class="icon pointer  w16"
                      src="../../assets/image/person-center/tc1.png" alt=""></p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="hjtgl" :sortable='true' show-overflow-tooltip label="回检通过率" align="center">
            </el-table-column>
          </el-table>
          <trs-pagination :total="total" @getList="approvalList" :pageNow="pageNow"></trs-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import barEcharts from './components/bar-echarts'
export default {
  components: {
    barEcharts
  },
  name: 'person-center-index',
  data() {
    return {
      total: 5,
      pageNow: 1,
      contributionData: {
        xData: ['＜100', '100(含)-200', '200(含)-300', '300(含)-400', '400(含)-500'],
        yData: [800, 1200, 390, 200, 1500],
      },
      acceptanceData: {
        name: '接受率（%）',
        xData: ['＜20%', '20(含)-40%', '40(含)-60%', '60(含)-80%', '80(含)-100%'],
        yData: [800, 1200, 390, 200, 1500],
        rate: ['10%', '20%', '30%', '10%', '40%'],
      },
      processingData: [
        { value: 200, name: '产品类', rate: '20%' },
        { value: 400, name: '活动类', rate: '40%' },
        { value: 300, name: '客户类', rate: '30%' },
        { value: 100, name: '其他', rate: '10%' },
      ],
      colorListTimes: ['#5773F9', '#249EFF', '#21CCFF', '#81E2FF'],
      approvalTable: [
        {
          name: '谭新宇',
          id: 'ID.34279811',
          level: 1,
          levelName: '心领神会',
          gxz: 120,
          scs: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          mpbs: 319,
          pjclsc: 2.5,
          jsl: '90%',
          hjtgl: '80%',
        },
        {
          name: '谭新宇',
          id: 'ID.34279811',
          level: 2,
          levelName: '心领神会',
          gxz: 120,
          scs: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          mpbs: 319,
          pjclsc: 2.5,
          jsl: '90%',
          hjtgl: '80%',
        },
        {
          name: '谭新宇',
          id: 'ID.34279811',
          level: 3,
          levelName: '心领神会',
          gxz: 120,
          scs: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          mpbs: 319,
          pjclsc: 2.5,
          jsl: '90%',
          hjtgl: '80%',
        },
        {
          name: '谭新宇',
          id: 'ID.34279811',
          level: 4,
          levelName: '心领神会',
          gxz: 120,
          scs: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          mpbs: 319,
          pjclsc: 2.5,
          jsl: '90%',
          hjtgl: '80%',
        },
        {
          name: '谭新宇',
          id: 'ID.34279811',
          level: 5,
          levelName: '心领神会',
          gxz: 120,
          scs: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          mpbs: 319,
          pjclsc: 2.5,
          jsl: '90%',
          hjtgl: '80%',
        },
      ],
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
      billOptions: [{
        value: '审批人员',
        label: '审批人员'
      }, {
        value: '提单人员',
        label: '提单人员'
      }],
      billValue: '审批人员',
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
    }
  },
  mounted() {
  },
  watch: {
  },
  created() {
    this.billChange()
  },
  methods: {
    billChange() {
      if (this.billValue === '审批人员') {
        this.$nextTick(() => {
          this.initPassingEcharts(this.contributionData)
          this.initProcessingEcharts(this.processingData)
        })
      }
    },
    approvalList() {
    },
    // 贡献值分布
    initPassingEcharts(industryDataVal) {
      const option = {
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          trigger: 'axis',
          formatter: (serie) => {
            const name = serie[0].axisValueLabel
            let params = `<p class="charts-tooltip-p fontw black"><span class="serieName"><span class="charts-tooltip-dot" style="background: #5773F9;"></span>${name}</span><span><span class="blue">${serie[0].data}</span>人</span></p>`
            params += `<p class="charts-tooltip-p black">占全部人员  <span class="blue">${serie[0].data}</span>%</p>`
            return params
          },
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
          minInterval: 1,
        },
        xAxis: {
          type: 'category',
          data: industryDataVal.xData,
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
                      offset: 0, color: 'rgba(33,204,255,0.6)', opacity: 0.6, // 100% 处的颜色
                    },
                    {
                      offset: 1, color: 'rgba(45,92,246,0.6)', opacity: 0.6, // 0% 处的颜色
                    }
                  ],
                },
              },
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
                      offset: 0, color: '#21CCFF', opacity: 1, // 100% 处的颜色
                    },
                    {
                      offset: 1, color: '#2D5CF6', opacity: 1, // 0% 处的颜色
                    }
                  ],
                },
              },
            },
            data: industryDataVal.yData.reverse(),
          },
        ]
      };
      this.initChart('contribution', option)
    },
    // 平均处理时长分布
    initProcessingEcharts() {
      const option = {
        color: this.colorListTimes,
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,0.8)',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
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
            radius: [10, 80],
            center: ['50%', '50%'],
            roseType: 'radius',
            itemStyle: {
              borderRadius: 5
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: this.processingData
          }]
      };
      this.initChart('processing', option)
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
}
</style>
<style lang="less">
.num-table {

  .el-table th.el-table__cell>.cell {
    font-size: 12px;
    font-weight: 400;
    padding: 0 5px !important;
    color: #000;
  }
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
