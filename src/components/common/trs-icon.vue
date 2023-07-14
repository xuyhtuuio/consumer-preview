<template>
  <div>
    <svg class="icon" :style="styleIcon" aria-hidden="true">
      <use :xlink:href="href"></use>
    </svg>
  </div>
</template>

<script>
  export default {
    name: "gIcon",
    props: {
      href: {
        typeof: String,
        required: true
      },
      stylePx: {
        typeof: Number,
        default: ""
      },
      wProp: {
        typeof: Number,
        default: "2em"
      },
      hProp: {
        typeof: Number,
        default: "2em"
      }
    },
    data() {
      return {
        styleIcon: {
          width: (this.stylePx || this.wProp)+ 'px' ,
          height: (this.stylePx || this.hProp)+ 'px',
        }
      }
    }
  }
</script>

<style lang="css" scoped>

</style>