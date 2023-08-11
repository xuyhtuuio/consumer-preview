<template>
    <transition name="router-fade" mode="out-in">
       <keep-alive :exclude="['aiApproval','approval-center-index']">
         <router-view v-if="!$route.meta.keepAlive"/>
       </keep-alive>
     </transition>
</template>
<script>
</script>
<style></style>