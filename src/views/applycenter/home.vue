<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-07-21 14:57:28
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-09-04 17:54:03
 * @FilePath: /consumer-preview/src/views/applycenter/home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
     <transition name="router-fade" mode="out-in">
          <router-view v-if="!$route.meta.keepAlive"/>
      </transition>
</template>
<script>
</script>
