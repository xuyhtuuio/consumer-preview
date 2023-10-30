<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-10-23 21:17:11
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-10-30 15:01:50
 * @FilePath: /consumer-preview/src/views/rules-base/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="rules-base">
    <el-input
      v-model.trim="keyword"
      class="keyword-input"
      placeholder="请输入标题、正文、发文字号等关键词查询"
      clearable
      prefix-icon="el-icon-search"
      @keyup.enter.native="keywordSearch"
      @clear="keywordSearch"
    >
      <el-select
        v-model="effectiveValue"
        slot="prepend"
        placeholder="效力级别"
        clearable
        @change="keywordSearch"
      >
        <el-option label="有效" value="1"></el-option>
        <el-option label="无效" value="2"></el-option>
      </el-select>
    </el-input>
    <ul class="left-menu">
      <li
        v-for="(item, index) in menu"
        :key="index"
        :class="item.id == activeMenuId ? 'active-menu pointer' : 'pointer'"
        @click="changeMenu(item)"
      >
        <i
          :class="[
            'iconfont',
            item.id == activeMenuId
              ? `${item.activeIcon} active-icon`
              : item.icon
          ]"
        ></i>
        {{ item.name }}
      </li>
    </ul>
    <div class="right-content">
      <component :is="component" ref="component"></component>
    </div>
  </div>
</template>
<script>
import laws from './components/laws'
import system from './components/system'
import notification from './components/notification'

export default {
  components: {
    laws,
    system,
    notification
  },
  data() {
    return {
      activeMenuId: 0,
      component: 'laws',
      keyword: '',
      effectiveValue: '',
      menu: [
        {
          name: '法律法规',
          id: 0,
          component: 'laws',
          activeIcon: 'icon-fagui1',
          icon: 'icon-fagui'
        },
        {
          name: '内部制度',
          id: 1,
          component: 'system',
          activeIcon: 'icon-neibuzhidu1',
          icon: 'icon-neibuzhidu'
        },
        {
          name: '监管通报',
          id: 2,
          component: 'notification',
          activeIcon: 'icon-jianguantongbao1',
          icon: 'icon-jianguantongbao'
        }
      ]
    }
  },
  mounted() {
  },
  methods: {
    changeMenu(item) {
      if (item.id === this.activeMenuId) return
      this.activeMenuId = item.id
      this.keywordSearch()
    },
    keywordSearch() {
      this.$refs['component'].initData({
        keyword: this.keyword,
        effectiveValue: this.effectiveValue
      })
    },
  }
}
</script>
<style lang="less" scoped>
.rules-base {
  display: flex;
  height: calc(100% - 58px);
  position: relative;
  .keyword-input {
    position: absolute;
    width: 376px;
    top: -51px;
    right: 0;
    height: 28px;
    /deep/ .el-input__inner {
      height: 28px;
      border-radius: 4px;
      border: 1px solid #e5e6eb;
      background: #f7f8fa;
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding-right: 12px;
      color: #86909c;
      font-weight: 400;
    }
    input::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #86909c;
      font-weight: 400;
      font-size: 12px;
    }
    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #86909c;
      font-weight: 400;
      font-size: 12px;
    }
    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #86909c;
      font-weight: 400;
      font-size: 12px;
    }
    input:-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #86909c;
      font-weight: 400;
      font-size: 12px;
    }
    /deep/.el-input-group__prepend {
      background: none;
      overflow: hidden;
      .el-input__inner {
        width: 95px;
        border: none;
        height: 26px;
        padding: 0 8px 0 12px;
        color: #505968;
        background: #f7f8fa;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      input::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #505968;
      }
      input:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #505968;
      }
      input::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #505968;
      }
      input:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #505968;
      }

      .el-icon-arrow-up:before {
        font-family: element-icons !important;
        content: '\e78f';
      }
    }
    /deep/ .el-input-group__prepend::after {
      display: inline-block;
      content: '';
      position: absolute;
      width: 1px;
      height: 10px;
      top: 8px;
      right: 0;
      background: #acb1b9;
    }
  }
  .left-menu {
    width: 200px;
    padding: 8px 12px;
    border-radius: 10px;
    background: #fff;
    margin-right: 8px;
    height: calc(100% - 58px);
    li {
      padding: 8px 12px;
      margin-bottom: 8px;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      display: flex;
      color: #505968;
    }
    .iconfont {
      font-size: 20px;
      line-height: 22px;
      margin-right: 12px;
      color: #acb1b9;
    }
    .active-icon {
      color: #2d5cf6;
    }
    .active-menu {
      border-radius: 8px;
      background: #f0f6ff;
      color: #2d5cf6;
    }
  }
  .right-content {
    flex: 1;
    padding: 16px;
    border-radius: 10px;
    background: #fff;
  }
}

</style>
