<template>
  <div>
    <el-table
      :data="tableData"
      border
      :span-method="objectSpanMethod"
      :cell-style="cellStyle"
      :row-style="rowStyle"
      :header-cell-style="{ background: '#FF6A6C', color: '#fff' }"
    >
      <el-table-column prop="mode" label="审批模式" align="center">
      </el-table-column>
      <el-table-column prop="dart" label="所属部门"> </el-table-column>
      <el-table-column prop="team" label="部门团队" width="150">
      </el-table-column>
      <el-table-column prop="people" label="审批人"> </el-table-column>
      <el-table-column prop="num" label="审查数"> </el-table-column>
      <el-table-column prop="opinion" label="实质性意见"> </el-table-column>
      <el-table-column prop="rate" label="实质性意见占比"> </el-table-column>
      <el-table-column prop="noOpinion" label="非实质性意见"> </el-table-column>
      <el-table-column prop="noRate" label="非实质性意见占比">
      </el-table-column>
      <el-table-column prop="opinionNum" label="意见条数"> </el-table-column>
      <el-table-column prop="averageTime" label="平均审批时长">
      </el-table-column>
      <el-table-column prop="secondNum" label="秒批笔数"> </el-table-column>
      <el-table-column prop="acceptRate" label="接受率"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
const [spanObj, pos] = [{}, {}]
const dataMethod = (data, isH = ['mode', 'dart', 'team']) => {
  // 循环数据
  for (const i in data) {
    const dataI = data[i]
    // 循环数据内对象，查看有多少key
    for (const j in dataI) {
      // 如果只有一条数据时默认为1即可，无需合并
      if (+i === 0) {
        spanObj[j] = [1]
        pos[j] = 0
      } else {
        const [e, k] = [dataI, data[i - 1]]
        // 判断上一级别是否存在 ，
        // 存在当前的key是否和上级别的key是否一样
        // 判断是否有数组规定只允许那几列需要合并单元格的
        if (k && e[j] === k[j] && (!isH?.length || isH.includes(j))) {
          // 如果上一级和当前一级相当，数组就加1 数组后面就添加一个0
          spanObj[j][pos[j]] += 1
          spanObj[j].push(0)
        } else {
          spanObj[j].push(1)
          pos[j] = i
        }
        // console.log(e, k);
      }
    }
  }
  return spanObj
}
export default {
  data() {
    return {
      spanObj: {},

      tableData: [
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '平台经营团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '平台经营团队',
          people: '王1',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '用户体验与服务管理',
          people: '审批人1',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '品牌及用户发展团队',
          people: '审批人2',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '人1',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '零售跨境金融',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '零售跨境金融',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '零售跨境金融',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '零售跨境金融',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '财富平台部',
          team: '风险管理',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '零售信贷部',
          team: '风险管理1',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '零售信贷部',
          team: '风险管理2',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '零售信贷部',
          team: '风险管理3',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '零售信贷部',
          team: '风险管理4',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '业务部门消保专员',
          dart: '零售信贷部',
          team: '风险管理5',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '内审员合计审单',
          dart: '',
          team: '',
          people: '',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '平台经营团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '平台经营团队',
          people: '王1',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '用户体验与服务管理',
          people: '审批人1',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '品牌及用户发展团队',
          people: '审批人2',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '人1',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '财富产品团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '零售跨境金融',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '零售跨境金融',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '零售跨境金融',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '零售跨境金融',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '财富平台部',
          team: '风险管理',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '零售信贷部',
          team: '风险管理1',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '零售信贷部',
          team: '风险管理2',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '零售信贷部',
          team: '风险管理3',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '零售信贷部',
          team: '风险管理4',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '零售信贷部',
          team: '风险管理5',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '私人银行部',
          team: '产品营销团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '私人银行部',
          team: '产品营销团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '私人银行部',
          team: '策略及经营分析团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保办内审模式',
          dart: '私人银行部',
          team: '客群经营与服务团队',
          people: '审批人',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '消保专员合计审单',
          dart: '',
          team: '',
          people: '',
          num: '720',
          opinion: '244',
          rate: '33.89%',
          noOpinion: '476',
          noRate: '66.11%',
          opinionNum: '108',
          averageTime: '371',
          secondNum: '85',
          acceptRate: '11.81%'
        },
        {
          mode: '合计',
          dart: '',
          team: '',
          people: '',
          num: '720',
          opinion: '',
          rate: '',
          noOpinion: '',
          noRate: '',
          opinionNum: '',
          averageTime: '',
          secondNum: '',
          acceptRate: ''
        }
      ]
    }
  },
  created() {
    this.spanObj = dataMethod(this.tableData)
  },
  methods: {
    getSpanArr() {},
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        row.mode === '合计'
        || row.mode === '消保专员合计审单'
        || row.mode === '内审员合计审单'
      ) {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 4,
            align: 1
          }
        } else if (columnIndex < 4) {
          return {
            rowspan: 1,
            colspan: 0
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
      // 列合并
      const _row = this.spanObj[column.property]
        ? this.spanObj[column.property][rowIndex]
        : 1
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    },
    cellStyle({ row, columnIndex }) {
      if (row.name === '总计') { return { background: 'pink', borderColor: '#cbc9d5' } }
      if (columnIndex === 0) {
        // 指定坐标rowIndex ：行，columnIndex ：列
        return { background: 'pink', color: '#333', borderColor: '#cbc9d5' } // rgb(105,0,7)
      } else {
        return { borderColor: '#cbc9d5' }
      }
    },
    rowStyle(options) {
      const { row, columnIndex } = options
      if (row.dart === '财富平台部' && columnIndex !== 0) {
        return { background: 'rgb(234, 244, 254)', color: '#4d72bf' }
      } else if (row.dart === '零售信贷部') {
        return { background: '#fff9ee', color: '#ac816e' }
      } else if (row.dart === '私人银行部') {
        return { background: '#fff7cc', color: '#fd9949' }
      }
    }
  }
}
</script>
<style lang="less">
.el-table tbody tr {
  pointer-events: none;
}
.el-table .el-table__cell {
  padding: 0;
}
.el-table tr {
  color: #333;
  font-weight: 500;
  background-color: pink;
}
</style>
