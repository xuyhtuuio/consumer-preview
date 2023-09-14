<template>
  <div class="reconciliation-point" v-if="list.length" ref="globalRef">
    <g-table-card :title="title">
      <template v-slot:cardInfo>
        <div class="cardInfo">
          <span style="color: #eb5757">*</span>
          {{ cardInfo }}
        </div>
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div class="warn" v-if="judgeWarnFlag">
          <warn-info :info="warnInfo"> </warn-info>
        </div>

      </template>
      <template #content>
        <div class="content">
          <el-form :hide-required-asterisk="true" label-width="120px" class="ruleForm my-form">
            <template v-for="(item, index) in list">
              <el-form-item :key="index">
                <label slot="label"
                  >{{ item.title
                  }}<span :style="{ color: 'red', opacity: !item.props.required && 0 }">
                    *
                  </span></label
                >
                <el-checkbox-group v-if="item.name==='MultipleSelect'" v-model="item.value" :disabled="item.perm === 'R'">
                  <el-checkbox
                    v-for="iten in item.props.options"
                    @change="handleChange"
                    :key="iten.id"
                    :label="iten.id"
                    >{{ iten.value }}</el-checkbox
                  >
                </el-checkbox-group>
                <div v-else-if="item.name==='SingleGroupsSelect'" class="form-item-1">
                  <div
                    class="form-content-item"
                    v-for="(iten, indey) in item.props.options"
                    :key="indey"
                  >
                    <p class="item-label">{{ iten.value }}</p>
                    <el-radio-group v-model="iten.value1" class="content-item" :disabled="item.perm === 'R'" @change="(val)=>handleRadioChange(val,indey,item.value)">
                      <el-radio
                        v-for="(itev, indev) in iten?.children"
                        :key="indev"
                        :label="itev.id"
                        >{{ itev.value }}</el-radio
                      >
                    </el-radio-group>
                  </div>
                </div>
              </el-form-item>
            </template>
          </el-form>
        </div>
      </template>
    </g-table-card>
  </div>
</template>

<script>
import WarnInfo from './warn-info';
// 核对要点
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
  data() {
    return {
      title: '核对要点',
      cardInfo: '（请核对审查材料是否包含以下选项）',
      warnInfo: '必须勾选全部选项才可提交申请',
      ruleForm: {},
      ruleFormLen: 0,
      judgeWarnFlag: false,
      checkAll: false
    };
  },
  created() {
    this.initData();
  },
  watch: {
    list: {
      handler(val) {
        this.judgeWarnFlag = false
        // this.handleCheckAll(val)
        val.length && val.forEach(item => {
          if (item.name === 'SingleGroupsSelect') {
            item.props.options.forEach((propItem, propIndex) => {
              this.$set(propItem, 'value1', '')
              propItem.value1 = item.value[propIndex] || ''
            })
          }
        })
      },
    }
  },
  methods: {
    initData() {
      this.list.forEach(item => {
        if (item.valueType === 'Array') {
          this.$set(this.ruleForm, item.id, []);
        }
        this.ruleFormLen += item.props.options.length;
      });
    },
    handleCheckAll(val) {
      let len = 0;
      let valLen = 0;
      val.forEach(listItem => {
        len += listItem.value.length;
        valLen += listItem.props.options.length;
      });
      this.checkAll = len === valLen || false;
      this.checkAll && (this.judgeWarnFlag = false);
    },
    // 全选
    handleCheckAllChange(val) {
      if (this.judgeWarnFlag) {
        this.judgeWarnFlag = false;
      }
      this.list.forEach(listItem => {
        if (val) {
          if (listItem.name === 'MultipleSelect') {
            listItem.value = []
            listItem.props.options.forEach(({ id }) => {
              listItem.value.push(id);
            });
          } else if (listItem.name === 'SingleGroupsSelect') {
            listItem.props.options.forEach(optItem => {
              optItem.value1 = optItem.children[0].id
              listItem.value.push(optItem.value1)
            })
          }
        } else {
          listItem.value = []
          if (listItem.name === 'SingleGroupsSelect') {
            listItem.props.options.forEach(optItem => {
              optItem.value1 = ''
            })
          }
        }
      });
    },
    handleChange() {
      if (this.judgeWarnFlag) {
        this.judgeWarnFlag = false;
      }
    },
    handleRadioChange(val, idx, originArr) {
      originArr[idx] = val
    },
    judgeWarn() {
      // const rulelen =  Object.values(this.ruleForm).reduce((item,next)=> item.length + next.length)
      //   if(this.ruleFormLen !== rulelen){
      //     this.judgeWarnFlag = true
      //     return false
      //   }else {
      //     this.judgeWarnFlag = false
      //     return true
      //   }
      if (this.list.length === 0) {
        return [true];
      } else if (this.list.every(item => Object.keys(item.value).length === item.props.options.length)) {
        return [true];
      } else {
        const { offsetTop } = this.$refs['globalRef'];
        this.judgeWarnFlag = true;
        return [false, offsetTop];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.reconciliation-point {
  .cardInfo {
  }

  .warn {
    display: flex;
    align-items: center;
    margin-left: 14px;
    font-size: 12px;
    color: rgba(235, 87, 87, 1);
    .right-icon {
      margin-right: 8px;
    }
  }
  .content {
    padding: 16px 72px 0;
  }

  .my-form {
    /deep/.el-form-item {
      position: relative;
      .el-form-item__label {
        position: absolute;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
    .form-item-1 {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin-left: -16px;
      background-color: #fff;
      .form-content-item {
        margin: 0 8px 8px 0;
        width: 30%;
        width: calc((100% - 16px) / 3);
        min-width: calc((100% - 16px) / 3);
        max-width: calc((100% - 16px) / 3);
        padding: 12px;
        border-radius: 4px;
        background-color: #f7f8fa;
        &:nth-child(3n) {
          // 去除第3n个的margin-right
          margin-right: 0;
        }
        .item-label {
          line-height: 22px;
          margin-bottom: 8px;
        }
        .content-item {
          display: flex;

          /deep/.el-radio {
            flex: 1;
            line-height: 22px;
          }
        }
      }
    }
  }
}
</style>
