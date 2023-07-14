<template>
  <div class="front">
    <div>
      <nav-menu></nav-menu>
      <transition name="router-fade" mode="out-in">
			<router-view v-if="!$route.meta.keepAlive" class="view-box"/>
		</transition>
    </div>
  </div>
</template>

<script>
import NavMenu from "@/components/common/navMenu"
  export default {
    components: {
      NavMenu
    },
    data() {
      return {
      }
    },
    methods: {
      handleItem(item) {
      console.log(item);
    }
    }
  }
</script>

<style lang="less" scoped>

</style>