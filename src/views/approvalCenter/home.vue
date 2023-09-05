<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-08-31 17:21:49
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-09-05 10:22:11
 * @FilePath: /consumer-preview/src/views/approvalCenter/home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <transition name="router-fade" mode="out-in">
       <!-- <keep-alive exclude="['aiApproval','approval-center-index','approval-details']"> -->
         <router-view />
       <!-- </keep-alive> -->
     </transition>
</template>
