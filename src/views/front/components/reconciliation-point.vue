<template>
  <div class="reconciliation-point" ref="globalRef" v-if="list.length">
    <g-table-card :title="title">
      <template v-slot:cardInfo>
        <div class="cardInfo">
          <span style="color: #eb5757">*</span>
          {{ cardInfo }}
        </div>
        <div class="warn" v-if="judgeWarnFlag">
          <warn-info :info="warnInfo"> </warn-info>
        </div>
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </template>
      <template #content>
        <div class="content">
          <el-form :hide-required-asterisk="true" label-width="100px" class="ruleForm my-form">
            <template v-for="(item, index) in list">
              <el-form-item :key="index">
                <label slot="label"
                  >{{ item.title
                  }}<span :style="{ color: 'red', opacity: !item.props.required && 0 }">
                    *
                  </span></label
                >
                <el-checkbox-group v-model="item.value">
                  <el-checkbox
                    v-for="iten in item.props.options"
                    @change="handleChange"
                    :key="iten.id"
                    :label="iten.id"
                    >{{ iten.value }}</el-checkbox
                  >
                </el-checkbox-group>
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
        let len = 0;
        let valLen = 0;
        val.forEach(listItem => {
          len += listItem.value.length;
          valLen += listItem.props.options.length;
        });
        this.checkAll = len === valLen ? true : false;
        this.checkAll && (this.judgeWarnFlag = false)
      },
      deep: true
    }
  },
  methods: {
    initData() {
      this.list.forEach(item => {
        // console.log(item);
        if (item.valueType === 'Array') {
          this.$set(this.ruleForm, item.id, []);
        }
        this.ruleFormLen += item.props.options.length;
      });
    },
    handleCheckAllChange(val) {
      console.log(val, this.list);
      this.list.forEach(listItem => {
        val &&
          listItem.props.options.forEach(({ id }) => {
            listItem.value.push(id);
          });
        !val && (listItem.value = []);
      });
    },
    handleChange() {
      if (this.judgeWarnFlag) {
        this.judgeWarnFlag = false;
      }
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
      } else if (this.list.every(item => item.value.length === item.props.options.length)) {
        return [true];
      } else {
        const offsetTop = this.$refs[`globalRef`].offsetTop;
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
}


</style>