<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-10-23 21:17:11
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-10-24 15:25:29
 * @FilePath: /consumer-preview/src/views/rules-base/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="rules-base">
    <ul class="left-menu">
      <li
        v-for="(item, index) in menu"
        :key="index"
        :class="item.id == activeMenuId ? 'active-menu pointer' : 'pointer'"
        @click="
          () => {
            ;(activeMenuId = item.id), (component = item.component)
          }
        "
      >
        <i
          :class="[
            'iconfont',
            item.id == activeMenuId ? `${item.activeIcon} active-icon`: item.icon
          ]"
        ></i>
        {{ item.name }}
      </li>
    </ul>
    <div class="right-content">
      <component :is="component"></component>
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
  }
}
</script>
<style lang="less" scoped>
.rules-base {
  display: flex;
  .left-menu {
    width: 200px;
    padding: 8px 12px;
    border-radius: 10px;
    background: #fff;
    margin-right: 8px;
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
      color: #ACB1B9;
    }
    .active-icon{
      color: #2D5CF6;
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
