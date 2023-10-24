<template>
  <div class="basic-information" v-if="list.length">
    <g-table-card :title="title">
      <template v-slot:cardInfo>
        <div class="cardInfo">
          <!-- <g-icon class="right-icon" stylePx="20" href="#icon-guanzhu1"/> -->
          <img class="img" src="@/assets/image/apply-center/focus.svg" alt="" />
          {{ cardInfo }}
        </div>
      </template>
      <template v-slot:content>
        <el-form
          hide-required-asterisk
          label-width="120px"
          class="ruleForm my-form"
        >
          <template v-for="(item, index) in list">
            <el-form-item :class="formItemCpt(item)" :key="index">
              <label slot="label"
                >{{ item.title
                }}<span
                  :style="{
                    color: 'red',
                    opacity: item.props.required ? 1 : 0
                  }"
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
                v-else-if="
                  item.name === 'MultipleSelect' && item.props.expanding
                "
                v-model.trim="item.value"
                :disabled="item.perm === 'R'"
              >
                <template v-for="(iten, indey) in item.props.options">
                  <!-- <template v-if="iten.id == 9999">
                     <el-checkbox :key="indey" @change="checked=>checkRow (checked, item)" :label="iten.id">{{iten.value}}</el-checkbox>
                    <el-input class="checkbox-ipt" v-show="item.value.includes(iten.id)" :key="iten.id" :value="checkBox[item.id]" @input="(val)=>handleInput(val,item,iten.id)" placeholder="请补充具体内容"></el-input>
                  </template> -->
                  <el-checkbox :key="indey" :label="iten.id">{{
                    iten.value
                  }}</el-checkbox>
                </template>
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
                  :label="iten.value || iten.name"
                  :value="iten.id"
                ></el-option>
              </el-select>

              <template v-else-if="item.name === 'TimePicker'">
                <el-date-picker
                  v-if="item.title !== '上线时间' && item.title !== '下线时间'"
                  :disabled="item.perm === 'R'"
                  type="datetime"
                  :placeholder="item.props.placeholder"
                  :value-format="item.props.format"
                  v-model.trim="item.value"
                  style="width: 100%"
                ></el-date-picker>
                <div v-else @click="handlePickerClick(item.props.order, item)" @mousemove="handlePickerMouse(item,'enter','refDatePicker'+item.props.order)" @mouseout="handlePickerMouse(item,'out','refDatePicker'+item.props.order)">
                  <el-date-picker
                    :popper-class="
                      Number(item.props.order) === 1
                        ? 'my-date-picker-1 my-date-picker'
                        : 'my-date-picker'
                    "
                    :ref="'refDatePicker'+item.props.order"
                    :disabled="item.perm === 'R'"
                    type="datetime"
                    :value-format="item.props.format"
                    :placeholder="item.props.placeholder"
                    v-model.trim="item.value"
                    :picker-options="
                      pickerTime(item.props.gl, item.props.order, item.value)
                    "
                    @change="handlePickerChange(item)"
                    style="width: 100%"
                  ></el-date-picker>
                </div>
              </template>

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

              <div class="warn" v-if="item.isWarning">
                <warn-info
                  ref="refWarn"
                  :info="judgementWarn(item)"
                ></warn-info>
              </div>
            </el-form-item>
          </template>
        </el-form>
      </template>
    </g-table-card>
  </div>
</template>

<script>
// eslint-disable-next-line
import * as dayjs from 'dayjs'
import WarnInfo from './warn-info'
function rulesFn(data) {
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
    default:
      return []
  }
}
export default {
  components: {
    WarnInfo
  },
  props: {
    list: {
      typeof: Array,
      default: () => []
    }
  },
  created() {
    this.$nextTick(() => {})
  },
  data() {
    return {
      flag: 9999,
      title: '基本信息',
      cardInfo: '提醒：产品类内容审查，需于在产品上线/宣传前14天进行提交。',
      checkBox: {},
      isAddPickerFoot: false,
      lastProps: {}
    }
  },
  computed: {
    formItemCpt() {
      return (item) => {
        if (item.name === 'SelectInput' && !item.props.expanding) {
          return ['form-item']
        } else if (item.name === 'MultipleSelect' && !item.props.expanding && item.id !== '-1') {
          return ['form-item']
        } else if (item.name === 'TimePicker' || item.name === 'Cascader') {
          return ['form-item']
        } else if (
          Object.keys(item.props).includes('exclusiveRowOrNot')
            && !item.props.exclusiveRowOrNot
        ) {
          return ['form-item']
        } else {
          return []
        }
      }
    }
  },
  watch: {
    list() {
      this.initWarn()
    }
  },
  methods: {
    pickerTime(id, order, originVal) {
      if (Number(order) === 0) {
        return this.startTime(id, originVal)
      } else {
        return this.endTime(id, originVal)
      }
    },
    startTime(nextId, originVal) {
      if (!nextId) {
        return;
      }
      const { value } = this.list.find((item) => item.id === nextId)
      let startDateTime = '00:00:00'
      let endDateTime = '23:59:59'
      // 关联的下线时间
      if (value) {
        if (
          this.handleDate(value) === this.handleDate(originVal)
        ) {
          startDateTime = '00:00:00'
          endDateTime = this.handleDate(value, 'HH:mm:ss')
        } else if (
          this.handleDate() === this.handleDate(originVal)
        ) {
          startDateTime = this.handleDate(new Date(), 'HH:mm:ss')
          endDateTime = '23:59:59'
        } else {
          startDateTime = '00:00:00'
          endDateTime = '23:59:59'
        }
      } else if (
        this.handleDate() === this.handleDate(originVal)
      ) {
        startDateTime = this.handleDate(new Date(), 'HH:mm:ss')
        endDateTime = '23:59:59'
      } else {
        startDateTime = '00:00:00'
        endDateTime = '23:59:59'
      }
      return {
        selectableRange: `${startDateTime} - ${endDateTime}`,
        disabledDate: (time) => {
          // 既不能大于当前日期 也不能小于结束日期
          if (value) {
            return (
              time.getTime() > new Date(value).getTime()
              || time.getTime() < new Date() - 8.64e7
            )
          }
          return time.getTime() < new Date() - 8.64e7
          // - 8.64e7减去了当天，即可选择当天
        }
      }
    },
    endTime(prevId, originVal) {
      const { value } = this.list.find((item) => item.id === prevId)
      let startDateTime = '00:00:00'
      let endDateTime = '23:59:59'
      if (value) {
        if (
          this.handleDate(value) === this.handleDate(originVal)
        ) {
          startDateTime = this.handleDate(value, 'HH:mm:ss')
          endDateTime = '23:59:59'
        } else {
          startDateTime = '00:00:00'
          endDateTime = '23:59:59'
        }
      } else if (
        this.handleDate() === this.handleDate(originVal)
      ) {
        startDateTime = this.handleDate(new Date(), 'HH:mm:ss')
        endDateTime = '23:59:59'
      } else {
        startDateTime = '00:00:00'
        endDateTime = '23:59:59'
      }
      return {
        disabledDate: (time) => {
          // 既不能大于当前日期 也不能大于开始日期
          if (value) {
            return this.handleDate(value, 'HH:mm:ss') === '00:00:00' ? time.getTime() < new Date(value).getTime() : time.getTime() < new Date(value).getTime() - 8.64e7
          }
          return time.getTime() < new Date() - 8.64e7
          // 如果想实现结束时间可以在开始时间当天内的话 可以减掉86400000秒，相当于一天。
          // return time.getTime() < new Date(this.params.actStartTime).getTime() - 86400000;
        },
        selectableRange: startDateTime + '-' + endDateTime
      }
    },
    handlePickerClick(order, item) {
      if (Number(order) !== 1 || this.isAddPickerFoot) return
      this.$nextTick(() => {
        const footerEls = document.querySelector('.my-date-picker-1').children[1]
        const btnEl = document.createElement('button')
        btnEl.className = footerEls.children[footerEls.children.length - 1].className
        btnEl.classList.add('my-royalty')
        btnEl.textContent = '永久'
        footerEls.insertBefore(btnEl, footerEls.children[footerEls.children.length - 1])
        document.querySelector('.my-royalty').addEventListener('click', () => {
          this.$refs.refDatePicker1[0].$el.classList.add('my-class' + order)
          this.$refs.refDatePicker1[0].handleClose()
          if (!item.lastProps) {
            item.lastProps = JSON.parse(JSON.stringify(item.props))
          }
          item.value = ''
          item.props.placeholder = '永久'
          item.props.isRoyalty = true
        })
        this.isAddPickerFoot = true
      })
    },
    handlePickerChange(item) {
      if (item.value) { item.props.isRoyalty = false }
      if (!item.value && item.lastProps && !item.props.isRoyalty) {
        item.props.placeholder = item.lastProps.placeholder || ''
      }
      if (
        this.handleDate(item.value)
          === this.handleDate()
        && this.handleDate(item.value, 'HH:mm:ss')
      ) {
        item.value = new Date()
      }
      const otherItem = this.list.find(
        (iten) => Number(iten.id) === Number(item.props.gl)
      )
      const otherVal = new Date(otherItem.value).getTime()
      const itemVal = new Date(item.value).getTime()
      if (Number(item.props.order) === 0 && otherVal && itemVal > otherVal) {
        item.value = ''
      } else if (
        Number(item.props.order) === 1
        && otherVal
        && itemVal < otherVal
      ) {
        item.value = ''
      }
    },
    handleInput(val, item) {
      // this.checkBox[item.id]= val
      this.$set(this.checkBox, item.id, val)
    },
    handlePickerMouse(item, action, refEl) {
      const order = Number(item.props.order)
      if (order === 0) return
      if (order === 0 || !item.props.isRoyalty) return
      const els = this.$refs[refEl][0].$el
      const closeIconEl = els.children[els.children.length - 1].children[0]
      const closeIconElChild = els.children[els.children.length - 1].children[0].children[0]
      if (action === 'enter') {
        closeIconElChild.classList.add('el-icon-circle-close')
        closeIconEl.addEventListener('click', () => {
          if (!item.props.placeholder) return
          item.props.placeholder = item.lastProps.placeholder || ''
          document.querySelector('.my-date-picker-1').style.display = 'none'
          item.props.isRoyalty = false
          closeIconElChild.classList.remove('el-icon-circle-close')
        }, false)
      } else {
        closeIconElChild.classList.remove('el-icon-circle-close')
      }
    },

    // 判断警告出现
    judgementWarn(item) {
      let flag
      if (item.valueType === 'Date') {
        flag = item.value == null ? '' : String(item.value)
      } else {
        flag = item.value
      }
      if (item.title === '下线时间' && item.props.isRoyalty) {
        flag = '永久'
      }
      if (item.props.required) {
        if (!flag.length && typeof item.value !== 'number') {
          return item.warnInfo[0].message
        } else if (
          item.props.numberOfWords
          && item.value.length > item.props.numberOfWords
        ) {
          item.isWarning = true
          return item.warnInfo[1].message
        } else {
          item.isWarning = false
        }
      } else if (item.props.numberOfWords && item.value.length) {
        if (item.value.length > item.props.numberOfWords) {
          return item.warnInfo[0].message
        }
        item.isWarning = false
      } else {
        item.isWarning = false
      }
    },
    judgeWarn() {
      const result = this.list.every((item) => {
        if (item.title === '下线时间' && item.props.required && !item.value && item.props.placeholder === '永久' && item.props.isRoyalty && item.lastProps) {
          return true
        } else if (item.props.required) {
          if (item.value == null) return false
          else if (item.props.numberOfWords && item.value.length !== 0) {
            return item.value.length <= item.props.numberOfWords
          } else return item.value.length !== 0
        } else if (item.props.numberOfWords && item.value.length !== 0) {
          return false
        } else {
          return true
        }
      })
      if (!result) {
        this.list.forEach((item) => {
          if (item.props.required || item.props.numberOfWords) {
            item.isWarning = true
          }
        })
      }
      return result
    },
    judgeWarnSave() {
      this.list.forEach((item) => {
        item.isWarning = false
      })
      if (
        this.list[0].value.length === 0
        || this.list[0].value.length > this.list[0].props.numberOfWords
      ) {
        this.list[0].isWarning = true
        return false
      } else {
        return true
      }
    },
    initWarn() {
      this.list.forEach((item) => {
        if (item.props.required) {
          this.$set(item, 'isWarning', false)
          this.$set(item, 'warnInfo', rulesFn(item))
          if (item.title === '下线时间' && item.value === '永久') {
            this.$nextTick(() => {
              this.$refs.refDatePicker1[0].$el.classList.add('my-class' + item.props.order)
            })
            if (!item.lastProps) {
              item.lastProps = JSON.parse(JSON.stringify(item.props))
            }
            item.value === ''
            item.props.placeholder = '永久'
            item.props.isRoyalty = true
          }
        } else if (item.props.numberOfWords) {
          this.$set(item, 'isWarning', false)
          this.$set(item, 'warnInfo', [rulesFn(item)[1]])
        }
      })
    },

    // 其他输入框
    checkRow(check, item) {
      if (!check) {
        this.checkBox[item.id] = ''
      }
    },
    // 判断时间
    handleDate(date = new Date(), formatText = 'YYYY-MM-DD') {
      return dayjs(date).format(formatText)
    }
  }
}
</script>

<style lang="less" scoped>
.basic-information {
  .tableCard{
    /deep/ .head{
      justify-content: flex-start;
    }
  }
  .cardInfo {
    display: flex;
    align-items: center;
    padding: 0 8px;
    border-radius: 20px;
    background: rgba(255, 252, 232, 1);
    color: rgba(250, 140, 22, 1);
    .img {
      margin-right: 8px;
    }
  }
  .ruleForm {
    padding: 16px 72px 0;
    display: flex;
    flex-wrap: wrap;
    /deep/.el-form-item {
      width: 100%;
    }
    .form-item {
      width: 50%;
    }
    .groups-select {
      .group-title {
        margin-top: 12px;
        line-height: 22px;
        color: #86909c;
      }
      .group-value {
        /deep/.el-checkbox {
          min-width: 160px;
        }
      }
    }
    .checkbox-ipt {
      display: inline-block;
      width: auto;
      /deep/.el-input__inner {
        width: 320px;
        height: 24px;
        padding-left: 10px;
        background-color: rgba(255, 255, 255, 1);
        border-radius: 6px;
        font-size: 12px;
      }
    }
  }

  .warn {
    // margin-top: -16px;
    margin-left: -16px;
    background: #fff;
    line-height: normal;
    font-size: 12px;
    color: rgba(235, 87, 87, 1);
  }

  /deep/.el-date-editor {
    display: flex;
    input {
      flex: 1;
    }
    .el-input__prefix {
      position: static;
      margin-right: 5px;
      .el-input__icon {
        &::before {
          content: '\e78e';
        }
      }
    }

    .el-input__suffix {
      right: 20px;
    }
  }
}

.my-class1 {
  /deep/.el-input__inner {
    &::-webkit-input-placeholder{
      color: #606266;
    }
  }
}
</style>
<style lang="less">
.my-date-picker {
  .el-picker-panel__footer {
    .el-button {
      &:first-child {
        display: none;
      }
    }
  }
}
</style>
