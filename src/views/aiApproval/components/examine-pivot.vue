<template>
  <div v-if="newList.length" :class="{ 'diff-examine-pivot': isWidthDiff, 'examine-pivot': true }" ref="refGlobal">
    <slot> </slot>
    <div class="main">
      <header v-if="!titleShow" class="top">
        <i class="iconfont icon-tubiao4 item"></i>
        <span class="item"
          ><i class="strong">{{ title }}</i
          >（请优先核对该项目是否包含以下要点）</span
        >
        <i class="iconfont icon-a-tubiaoguding item"></i>
      </header>
      <content class="content">
        <div class="content-main" v-for="item in newList" :key="item.id">
          <div class="item-title">
            {{ item.title }}
            <span v-if="isWidthDiff" :style="{ color: 'red', opacity: item.props.required || 0 }">
              *
            </span>
          </div>
          <el-checkbox-group v-if="item.name === 'MultipleSelect'" v-model="item.value">
            <el-checkbox
              v-for="iten in item.props.options"
              @change="handleChange"
              :key="iten.id"
              :label="iten.id"
              >{{ iten.value }}</el-checkbox
            >
            <el-checkbox style="width: 0; height: 0; overflow: hidden"></el-checkbox>
          </el-checkbox-group>
          <div v-else-if="item.name === 'SingleGroupsSelect'" class="form-item-1">
            <div class="form-content-item" v-for="(iten, indey) in item.props.options" :key="indey">
              <p class="item-label">{{ iten.value }}</p>
              <el-radio-group
                v-model="iten.value1"
                class="content-item"
                @change="val => handleRadioChange(val, indey, item.value)"
              >
                <el-radio v-for="(itev, indev) in iten?.children" :key="indev" :label="itev.id">{{
                  itev.value
                }}</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </content>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    titleShow: {
      typeof: Boolean,
      default: false
    },
    isWidthDiff: {
      typeof: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      newList: [],
      title: '',
      data1: {
        module: '核对要点',
        name: 'SingleGroupsSelect',
        title: '核对要点1',
        value: ['1-1', '2-2', '3-3'],
        props: {
          options: [
            {
              id: 'selectGroup3422284479233',
              showInput: true,
              value:
                '承担义务不得低于宣传所承诺的标准承担义务不得低于宣传所承诺的标准承担义务不得低于宣传所承',
              children: [
                { id: '1-1', value: '是' },
                { id: '1-2', value: '否' },
                { id: '1-3', value: '无关' }
              ],
              value1: '1-1'
            },
            {
              id: 'selectGroup34222844792332',
              showInput: true,
              value: '不得承诺',
              children: [
                { id: '2-1', value: '是' },
                { id: '2-2', value: '否' },
                { id: '2-3', value: '无关' }
              ],
              value1: '2-1'
            },
            {
              id: 'selectGroup3422284479233',
              showInput: true,
              value: '不得承诺',
              children: [
                { id: '3-1', value: '是' },
                { id: '3-2', value: '否' },
                { id: '3-3', value: '无关' }
              ],
              value1: '3-1'
            },
            {
              id: 'selectGroup3422284479233',
              showInput: true,
              value: '不得承诺',
              children: [
                { id: '4-1', value: '是' },
                { id: '4-2', value: '否' },
                { id: '4-3', value: '无关' }
              ],
              value1: '4-1'
            }
          ]
        },
        value: ['1-1', '2-2', '3-3']
      }
    };
  },
  created() {
    // this.handleGlobalClick();
  },
  watch: {
    list(val) {
      if (val.length && !this.isWidthDiff) {
        this.title = val[0].module;
        
        val.forEach(item => {
          item.value.length = 0;
          if (item.name === 'SingleGroupsSelect') {
            item.props.options.forEach((propItem, propIndex) => {
              this.$set(propItem, 'value1', '');
            });
          }
        });
      }
      this.newList = [...val];
    }
  },
  methods: {
    handleChange() {},
    // handleGlobalClick() {
    //   document.addEventListener('click', e => {
    //     if (this.$refs.refGlobal) {
    //       let isSelf = this.$refs.refGlobal.contains(e.target);
    //       if (!isSelf) {
    //         this.searchbox = false;
    //       }
    //     }
    //   });
    // }
    handleRadioChange(val, idx, originArr) {
      originArr[idx] = val;
    }
  }
};
</script>

<style lang="less" scoped>
.examine-pivot {
  font-size: 14px;
  padding: 24px;
  line-height: 22px;
  .main {
    .top {
      display: flex;
      align-items: center;
      margin: 0 -24px;
      padding: 0 24px 12px;
      border-bottom: 1px dotted #e5e6eb;
      .item {
        font-size: 12px;
        line-height: 20px;
        &:first-child {
          margin-right: 4px;
        }
        &:last-child {
          flex: 1;
          text-align: right;
        }
      }
      .iconfont {
        font-size: 20px;
      }
      .strong {
        font-weight: 700;
        font-size: 14px;
      }
    }
    .content {
      &-main {
        &:first-child {
          margin-top: 8px;
        }
        &:not(:first-child) {
          margin-top: 16px;
        }
        &:last-child {
          margin-bottom: 16px;
        }
      }

      .item-title {
        margin-bottom: 8px;
      }
      /deep/.el-checkbox-group {
        padding: 8px 16px;
        background: #f7f8fa;
        border-radius: 4px;
        gap: 16px;
        .el-checkbox {
          display: flex;
          align-items: flex-start;
          &.is-checked {
            .el-checkbox__label {
              color: #606266;
            }
          }
          &:not(:last-child) {
            // margin-bottom: 16px;
            margin-right: 0;
          }
          .el-checkbox__input {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 22px;
          }
          .el-checkbox__label {
            line-height: 22px;
            white-space: normal;
          }
        }
      }

      .form-item-1 {
        .form-content-item {
          padding: 12px;
          background: #f7f8fa;
          border-radius: 4px;
          gap: 8px;
          margin-top: 8px;
          .content-item {
            display: flex;
            justify-content: space-around;
            margin-top: 8px;
          }
        }
      }
    }
  }
}

.diff-examine-pivot {
  padding: 0;
  .content-main {
    display: flex;
    align-items: center;
    &:first-child {
      margin-top: 0;
    }
    .item-title {
      margin-right: 12px;
    }
    /deep/.el-checkbox-group {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .el-checkbox {
        min-width: 300px;
      }
      .el-checkbox__inner {
        &::after {
          top: 3px;
          left: 6px;
          height: 8px;
        }
      }
    }
    .form-item-1 {
      flex: 1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      background-color: #fff;
      .form-content-item {
        display: inline-block;
        margin: 0 8px 8px 0;
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