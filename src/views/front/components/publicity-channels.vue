<template>
  <div class="publicity-channels" v-if="list.length" ref="globalRef" >
    <g-table-card :title="title">
      <template v-slot:cardInfo>
        <div class="cardInfo">
          {{ cardInfo }}
        </div>
        <div class="warn" v-if="judgeWarnFlag">
          <warn-info :info="warnInfo"> </warn-info>
        </div>
      </template>
      <template v-slot:content>
        <el-form
          ref="ruleForm"
          :hide-required-asterisk="true"
          label-width="120px"
          class="ruleForm my-form"
        >
          <el-form-item v-for="(item, index) in list" :key="index" prop="name">
            <label slot="label"
              >{{ item.title
              }}<span :style="{ color: 'red', opacity: !item.props.required && 0 }">
                *
              </span></label
            >
            <el-checkbox-group v-model="item.value" :disabled="item.perm === 'R'">
              <el-checkbox
                v-for="item in item.props.options"
                :key="item.id"
                @change="handleChange"
                :label="item.id"
                >{{ item.value }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
    </g-table-card>
  </div>
</template>

<script>
import WarnInfo from './warn-info';
export default {
  components: { WarnInfo },
  props: {
    list: {
      typeof: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: '宣传渠道',
      cardInfo: '*',
      judgeWarnFlag: false,
      warnInfo: '必须勾选至少一项才可提交申请'
    };
  },
  methods: {
    handleChange() {
      if (this.judgeWarnFlag === true) this.judgeWarnFlag = false;
    },
    judgeWarn() {
      if (this.list.length === 0) {
        return [true];
      } else if (this.list.some(item => item.value.length !== 0)) {
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
.publicity-channels {
  .cardInfo {
    color: #eb5757;
    padding: 0 8px;
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
  .ruleForm {
    padding: 16px 72px 0;

    /deep/.el-checkbox {
      min-width: 160px;
    }
  }
}

</style>
