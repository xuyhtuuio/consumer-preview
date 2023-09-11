<template>
  <div class="leader-edit-opinion" v-loading="searchLoading">
    <el-form
      :model="form"
      :rules="rules"
      label-position="left"
      ref="form"
      class="basic-form"
    >
      <el-form-item label="请选择" prop="isAccept">
        <el-radio-group v-model="form.isAccept">
          <el-radio :label="'1'">通过</el-radio>
          <el-radio :label="'0'">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- &&refuseWay=='TO_BEFORE' -->
      <el-form-item
        label="请选择驳回人"
        prop="crtDisavower"
        v-if="form.isAccept == '0' && refuseWay == 'TO_BEFORE'"
      >
        <el-select
          v-model="form.crtDisavower"
          placeholder="请选择驳回节点/驳回人"
          popper-class="approver-select"
          value-key="id"
        >
          <el-option
            v-for="(item, index) in disavower"
            :key="index"
            :label="item.name + '/' + item.label + ' 【' + item.nodeName + '】'"
            :value="item"
          >
            <div class="flex">
              <div class="item ellipsis ellipsis_1">{{ item.name }}</div>
              <div class="item ellipsis ellipsis_1">{{ item.label }}</div>
              <el-popover
                placement="top-start"
                trigger="hover"
                :content="item.nodeName"
                class="item"
                popper-class="node-popover"
                style="padding: 0"
              >
                <span
                  class="ellipsis ellipsis_1"
                  slot="reference"
                  style="font-weight: 400; color: #505968"
                >
                  · {{ item.nodeName }}
                </span>
              </el-popover>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="请选择驳回原因"
        prop="reason"
        v-if="form.isAccept == '0'"
      >
        <el-select v-model="form.reason" placeholder="请选择驳回原因">
          <el-option
            v-for="item in reasons"
            :key="item.value"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--  && assignedType == 'SELF_SELECT' -->
      <el-form-item
        label="请选择审批人"
        prop="crtApprover"
        v-if="form.isAccept == '1' && assignedType == 'SELF_SELECT'"
      >
        <el-select
          v-model="form.crtApprover"
          popper-class="approver-select"
          placeholder="需【下一节点名称】审批，请选择审批人"
        >
          <el-option
            v-for="item in approver"
            :key="item.id"
            :label="item.name + '/' + item.label + ' 【' + item.nodeName + '】'"
            :value="item.id"
          >
            <div class="flex">
              <div class="item ellipsis ellipsis_1">{{ item.name }}</div>
              <div class="item ellipsis ellipsis_1">{{ item.label }}</div>
              <el-popover
                placement="top-start"
                trigger="hover"
                :content="item.nodeName"
                class="item"
                popper-class="node-popover"
                style="padding: 0"
              >
                <span
                  class="ellipsis ellipsis_1"
                  slot="reference"
                  style="font-weight: 400; color: #505968"
                >
                  · {{ item.nodeName }}
                </span>
              </el-popover>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审查意见" class="opinion">
        <el-input
          type="textarea"
          placeholder="请输入审查话术内容"
          v-model="form.content"
          resize="none"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 用户自定义模块 -->
    <template>
      <el-form hide-required-asterisk label-width="80px" class="my-form">
        <div v-for="(item, index) in filledInByApprover" :key="index">
          <el-form-item :key="`${index}`">
            <label slot="label"
              >{{ item.title
              }}<span
                :style="{ color: 'red', opacity: item.props.required || 0 }"
              >
                *
              </span></label
            >
            <el-input
              v-if="item.name === 'TextInput'"
              :disabled="item.perm === 'R'"
              v-model.trim="item.value"
              :placeholder="item.props.placeholder"
            ></el-input>
            <el-select
              v-else-if="item.name === 'SelectInput' && !item.props.expanding"
              :disabled="item.perm === 'R'"
              v-model.trim="item.value"
              :placeholder="item.props.placeholder"
            >
              <el-option
                v-for="(iten, indey) in item.props.options"
                :key="indey"
                :label="iten.value"
                :value="iten.id"
              ></el-option>
            </el-select>

            <el-radio-group
              v-else-if="item.name === 'SelectInput' && item.props.expanding"
              :disabled="item.perm === 'R'"
              v-model.trim="item.value"
            >
              <el-radio
                v-for="(iten, indey) in item.props.options"
                :key="indey"
                :label="iten.id"
                >{{ iten.value }}</el-radio
              >
            </el-radio-group>
            <el-checkbox-group
              v-else-if="item.name === 'MultipleSelect' && item.props.expanding"
              v-model.trim="item.value"
              :disabled="item.perm === 'R'"
            >
              <div v-for="(iten, indey) in item.props.options" :key="indey">
                <el-checkbox :key="indey" :label="iten.id">{{
                  iten.value
                }}</el-checkbox>
              </div>
            </el-checkbox-group>

            <div
              class="groups-select"
              v-else-if="item.name === 'MultipleGroupsSelect'"
            >
              <div v-for="iten in item.props.options" :key="iten.id">
                <p class="group-title">{{ iten.value }}</p>
                <el-checkbox-group
                  class="group-value"
                  v-model="item.value"
                  :disabled="item.perm === 'R'"
                >
                  <el-checkbox
                    v-for="(itenItem, indey) in iten.children"
                    :key="indey"
                    :label="itenItem.id"
                    >{{ itenItem.value }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <el-select
              v-else-if="
                item.name === 'MultipleSelect' && !item.props.expanding
              "
              :disabled="item.perm === 'R'"
              v-model.trim="item.value"
              :placeholder="item.props.placeholder"
              multiple
            >
              <el-option
                v-for="(iten, indey) in item.props.options"
                :key="indey"
                :label="iten.value"
                :value="iten.id"
              ></el-option>
            </el-select>

            <el-date-picker
              v-else-if="item.name === 'TimePicker'"
              :disabled="item.perm === 'R'"
              type="datetime"
              :placeholder="item.props.placeholder"
              :format="item.props.format"
              v-model.trim="item.value"
              :picker-options="pickerTime(item.props.gl, item.props.order)"
              style="width: 100%"
            ></el-date-picker>

            <el-input
              v-else-if="item.name === 'TextareaInput'"
              :disabled="item.perm === 'R'"
              type="textarea"
              v-model.trim="item.value"
              :placeholder="item.props.placeholder"
            ></el-input>
            <el-cascader
              v-else-if="item.name === 'Cascader'"
              v-model="item.value"
              :options="item.props.childrens"
              :props="{
                label: 'value',
                value: 'id',
                checkStrictly: true,
                multiple: item.props.multiple
              }"
              clearable
            >
            </el-cascader>
          </el-form-item>
          <div class="warn" v-if="item.isWarning" style="margin-top: -16px">
            <warn-info ref="refWarn" :info="judgementWarn(item)"></warn-info>
          </div>
        </div>
      </el-form>
    </template>
  </div>
</template>
<script>
import { getEditById } from '@/api/approvalCenter'
// eslint-disable-next-line
import * as dayjs from 'dayjs'

import WarnInfo from '@/views/front/components/warn-info'
function rulesFn(data) {
  // eslint-disable-next-line
  switch (data.name) {
    case 'TextInput':
      return [
        { required: true, message: `请输入${data.title}` },
        {
          min: 3,
          max: data.props.numberOfWords,
          message: `长度在 1 到 ${data.props.numberOfWords} 个字符`
        }
      ]
    case 'TextareaInput':
      return [
        { required: true, message: `请输入${data.title}` },
        {
          min: 3,
          max: data.props.numberOfWords,
          message: `长度在 1 到 ${data.props.numberOfWords} 个字符`
        }
      ]
    case 'SelectInput':
      return [
        { required: true, message: `请选择${data.title}`, trigger: 'change' }
      ]
    case 'MultipleSelect':
      return [
        {
          type: 'array',
          required: true,
          message: `请至少选择一个${data.title}`,
          trigger: 'change'
        }
      ]
    case 'MultipleGroupsSelect':
      return [
        {
          type: 'array',
          required: true,
          message: `请至少选择一个${data.title}`,
          trigger: 'change'
        }
      ]
    case 'TimePicker':
      return [
        {
          type: 'date',
          required: true,
          message: '请选择日期',
          trigger: 'change'
        }
      ]
    case 'Cascader':
      return [
        {
          type: 'array',
          required: true,
          message: `请选择${data.title}`,
          trigger: 'change'
        }
      ]
  }
}
export default {
  props: {
    filledInByApprover: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    WarnInfo
  },
  data() {
    return {
      disavower: [],
      approver: [],
      rules: {
        isAccept: [{ required: true, message: '请选择', trigger: ['blur'] }],
        crtApprover: [
          { required: true, message: '请选择审批人', trigger: ['blur'] }
        ],
        crtDisavower: [
          {
            required: true,
            message: '请选择驳回节点/驳回人',
            trigger: ['blur']
          }
        ],
        reason: [
          { required: true, message: '请选择驳回原因', trigger: ['blur'] }
        ]
      },
      searchLoading: false,
      reasons: [
        '文件预览失败（文件损坏/清晰度过低）',
        '附件材料与审批项目不匹配',
        '其他'
      ],
      form: {
        isAccept: '',
        approver: '',
        content: '',
        reason: '',
        crtDisavower: null
      },
      refuseWay: '', // TO_NODE 驳回到指定节点 / TO_BEFORE 审批人自选（前序节点）
      assignedType: '', // SELF_SELECT 流程配置中下一节点审批人设置时选择“上一审批人选择”，增加选择审批人选择则框
      externalData: {} //
    }
  },
  computed: {},
  watch: {},

  mounted() {
    this.initWarn()
  },
  methods: {
    pickerTime(id, order, originVal) {
      if (order === 0) {
        return this.startTime(id, originVal)
      } else {
        return this.endTime(id, originVal)
      }
    },
    startTime(nextId, originVal) {
      const value = this.filledInByApprover.find(
        (item) => item.id === nextId
      )?.value
      let startDateTime = '00:00:00'
      let endDateTime = '23:59:59'
      // 关联的下线时间
      if (value) {
        if (
          dayjs(new Date(value)).format('l') === dayjs(originVal).format('l')
        ) {
          startDateTime = '00:00:00'
          endDateTime = dayjs(new Date(value)).format('HH:mm:ss')
        } else if (
          dayjs(new Date()).format('l') === dayjs(originVal).format('l')
        ) {
          startDateTime = dayjs(new Date()).format('HH:mm:ss')
          endDateTime = '23:59:59'
        } else {
          startDateTime = '00:00:00'
          endDateTime = '23:59:59'
        }
      } else {
        // eslint-disable-next-line
        if (dayjs(new Date()).format('l') === dayjs(originVal).format('l')) {
          startDateTime = dayjs(new Date()).format('HH:mm:ss')
          endDateTime = '23:59:59'
        } else {
          startDateTime = '00:00:00'
          endDateTime = '23:59:59'
        }
      }
      return {
        selectableRange: `${startDateTime} - ${endDateTime}`,
        disabledDate: (time) => {
          // 既不能大于当前日期 也不能小于结束日期
          if (value) {
            return (
              time.getTime() > new Date(value).getTime() || time.getTime() < new Date() - 8.64e7
            )
          }
          return time.getTime() < new Date() - 8.64e7
          // - 8.64e7减去了当天，即可选择当天
        }
      }
    },
    endTime(prevId, originVal) {
      const value = this.filledInByApprover.find(
        (item) => item.id === prevId
      )?.value
      let startDateTime = '00:00:00'
      let endDateTime = '23:59:59'
      if (value) {
        if (
          dayjs(new Date(value)).format('l') === dayjs(originVal).format('l')
        ) {
          startDateTime = dayjs(new Date(value)).format('HH:mm:ss')
          endDateTime = '23:59:59'
        } else {
          startDateTime = '00:00:00'
          endDateTime = '23:59:59'
        }
      } else {
        // eslint-disable-next-line
        if (dayjs(new Date()).format('l') === dayjs(originVal).format('l')) {
          startDateTime = dayjs(new Date()).format('HH:mm:ss')
          endDateTime = '23:59:59'
        } else {
          startDateTime = '00:00:00'
          endDateTime = '23:59:59'
        }
      }
      return {
        disabledDate: (time) => {
          // 既不能大于当前日期 也不能大于开始日期
          if (value) {
            return time.getTime() < new Date(value).getTime() - 8.64e7
          }
          return time.getTime() < new Date() - 8.64e7
          // 如果想实现结束时间可以在开始时间当天内的话 可以减掉86400000秒，相当于一天。
          // return time.getTime() < new Date(this.params.actStartTime).getTime() - 86400000;
        },
        selectableRange: startDateTime + '-' + endDateTime
      }
    },
    handlePickerChange(item) {
      if (
        dayjs(new Date(item.value)).format('l') === dayjs(new Date()).format('l') && dayjs(item.value).format('HH:mm:ss') === '00:00:00'
      ) {
        item.value = new Date()
      }
      const otherItem = this.filledInByApprover.find(
        (iten) => iten.id === item.props.gl
      )
      const otherVal = new Date(otherItem.value).getTime()
      const itemVal = new Date(item.value).getTime()
      if (item.props.order === 0 && otherVal && itemVal > otherVal) {
        item.value = ''
      } else if (item.props.order === 1 && otherVal && itemVal < otherVal) {
        item.value = ''
      }
    },
    initData(data) {
      // 查询是否保存过东西
      const { taskId, processInstanceId } = data
      this.getEditById(taskId, processInstanceId)
      this.externalData = data
      this.disavower = data.disavower
      this.approver = data.approver
      this.refuseWay = data.refuseWay
      this.assignedType = data.assignedType
    },
    getEditById(taskId, processInstanceId) {
      const param = {
        taskId,
        processInstanceId
      }
      this.searchLoading = true
      getEditById(param)
        .then((res) => {
          const { data } = res.data
          this.searchLoading = false
          // 如果 data为空
          if (!data) {
            this.$refs['form'].resetFields()
          } else {
            // 区分通过与驳回
            const { success, msg, targetUser, reason } = data
            this.form.isAccept = success ? '1' : '0'
            this.form.content = msg
            if (success) {
              this.form.crtApprover = targetUser || ''
            } else {
              this.form.crtDisavower = targetUser || ''
              this.form.reason = reason
            }
          }
        })
        .catch(() => {
          this.searchLoading = false
        })
    },
    updateForm() {
      // 动态表单
      // eslint-disable-next-line
      const approver_params =
        this.filledInByApprover?.map((v) => {
          return {
            formItemId: v.id,
            valueType: v.name,
            value: v.value
          }
        }) || []
      let params = {
        ...this.externalData,
        ...this.form,
        formId: this.externalData.formId,
        assignedType: this.assignedType,
        formItemDataList: approver_params
      }
      // 若审核员选择了驳回
      if (this.form.isAccept === '0') {
        params = {
          ...params,
          ...this.form.crtDisavower
        }
      }
      // this.$nextTick(() => {
      //   this.judgeWarnSave()
      // })

      const customFlag = this.judgeWarnSave()
      this.$refs['form'].validate((valid) => {
        this.$store.commit('setEditOpinionRequired', valid && customFlag)
        this.$store.commit('setEditOpinionForm', params)
      })
    },
    judgeWarnSave() {
      // eslint-disable-next-line
        for(let i in this.filledInByApprover) {
        const { props } = this.filledInByApprover[i]
        if (
          (this.filledInByApprover[i].value.length === 0 || this.filledInByApprover[i].value.length > this.filledInByApprover[i].props.numberOfWords) && props.required
        ) {
          this.filledInByApprover[i].isWarning = true
        }
      }
      let flag = true
      flag = !this.filledInByApprover.some(m => {
        return m.isWarning
      })
      return flag
    },
    // 判断警告出现
    judgementWarn(item) {
      let flag
      if (item.valueType === 'Date') {
        flag = item.value == null ? '' : String(item.value)
      } else {
        flag = item.value
      }
      if (item.props.required) {
        if (!flag.length && typeof item.value !== 'number') {
          return item.warnInfo[0].message
        } else if (
          item.props.numberOfWords && item.value.length > item.props.numberOfWords
        ) {
          item.isWarning = true
          return item.warnInfo[1].message
        } else {
          item.isWarning = false
        }
      } else if (item.props.numberOfWords && item.value.length) {
        if (item.value.length > item.props.numberOfWords)
          // eslint-disable-next-line
          return item.warnInfo[0].message
        item.isWarning = false
      } else {
        item.isWarning = false
      }
    },
    judgeWarn() {
      const result = this.filledInByApprover.every((item) => {
        if (item.props.required) {
          if (item.value == null) return false
          else if (item.props.numberOfWords && item.value.length !== 0)
            // eslint-disable-next-line
            return item.value.length < item.props.numberOfWords
          else return item.value.length !== 0
        } else if (item.props.numberOfWords && item.value.length !== 0) {
          return false
        } else {
          return true
        }
      })
      if (!result) {
        this.filledInByApprover.forEach((item) => {
          if (item.props.required || item.props.numberOfWords) {
            item.isWarning = true
          }
        })
      }
      return result
    },
    initWarn() {
      this.filledInByApprover.forEach((item) => {
        if (item.props.required) {
          this.$set(item, 'isWarning', false)
          this.$set(item, 'warnInfo', rulesFn(item))
        } else if (item.props.numberOfWords) {
          this.$set(item, 'isWarning', false)
          this.$set(item, 'warnInfo', [rulesFn(item)[1]])
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.leader-edit-opinion {
  width: 100%;

  /deep/ .basic-form {
    .el-form-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }

    .el-form-item__label {
      color: #1d2128;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      // line-height: 22px;
    }

    .el-form-item__label::before {
      display: none;
    }

    .is-required .el-form-item__label::after {
      content: '*';
      color: #f76560;
      margin-left: 5px;
      font-size: 16px; //改变星号的大小
    }

    .el-form-item__content {
      border-radius: 4px;
      background: #f7f8fa;
      border-radius: 4px;
      padding: 0 16px;

      .el-select {
        width: 100%;
      }

      .el-select .el-input__inner {
        background: #f7f8fa;
        border: none;
        padding: 0;
        // color: #ACB1B9;
      }

      .el-select .el-input .el-icon-arrow-up::before {
        font-family: element-icons !important;
        content: '\e78f';
      }
    }

    .el-form-item__error::before {
      font-family: element-icons !important;
      content: '\e7a3';
      font-size: 20px;
      margin-right: 8px;
    }

    .el-form-item__error {
      display: flex;
      align-items: center;
      margin-top: 0px;
      color: #eb5757;
    }

    .opinion {
      .el-form-item__content {
        padding: 0;

        .el-textarea {
          height: 96px;

          .el-textarea__inner {
            height: 100%;
          }
        }
      }
    }
  }

  /deep/ .my-form {
    .el-form-item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .el-form-item__label {
      line-height: 22px;
      color: #1d2128;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      display: flex;
      align-items: center;
      text-align: left;
    }

    .el-form-item__content {
      flex: 1;
      margin-left: 0 !important;
    }
  }
}
</style>
<style lang="less">
.approver-select {
  // width: 380px !important;
  right: 100px !important;
}
</style>
