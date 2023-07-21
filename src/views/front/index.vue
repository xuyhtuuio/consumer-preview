<template>
  <div class="front">
    <div>
      <transition name="router-fade" mode="out-in">
			<router-view v-if="!$route.meta.keepAlive" class="view-box "/>
		</transition>
    </div>
  </div>
</template>

<script>

export default {
  components: {
    
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

<style lang="less" scoped></style>