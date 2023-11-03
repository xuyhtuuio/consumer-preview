<template>
  <div class="input" v-if="defaultShow">
    <div class="title">
      <el-input v-if="textarea" v-model.trim="textarea" ref="textareaCommon" @focus="handleFocus" type="textarea" @blur="handleBlur" :placeholder="placeholder" :rows="3" :maxlength="500" :minlength="1"></el-input>
      <el-input v-else v-model.trim="textarea" :ref="`inputCommon${id}`" :id="`inputCommon${id}`" @focus="handleFocus" @blur="handleBlur" :placeholder="placeholder"></el-input>
    </div>
    <el-button :loading="loading" type="primary" style="width:88px; margin-top: 10px;float: right;" :disabled="!textarea || loading" @click="handleConfirm">发 布</el-button>
  </div>
</template>
<script>
import { debounce } from 'lodash';
export default {
  name: 'input-textarea',
  props: {
    prevUser: {
      type: String,
      default: ''
    },
    defaultShow: {
      type: Boolean,
      default: true
    },
    id: {
      type: [Number, String]
    }
  },
  data() {
    return {
      loading: false,
      textarea: '',
      focus: false
    }
  },
  computed: {
    placeholder() {
      if (!this.focus) {
        return '发布你的评论'
      }
      return '回复' + this.prevUser
    }
  },
  watch: {
    textarea(newval, oldVal) {
      if (!oldVal && newval) {
        this.$nextTick(() => {
          this.$refs['textareaCommon'].focus()
        })
      }
    }
  },
  created() {
    this.bus.$on('setPublishLoading', (val) => {
      this.loading = val
      if (!val) {
        this.$emit('hiddenInput')
      }
    })
  },
  methods: {
    handleFocus() {
      this.focus = true
    },
    handleConfirm: debounce(function () {
      this.$emit('publishComment', this.textarea)
    }, 500),
    selectFocus() {
      this.$nextTick(() => {
        document.querySelector('#inputCommon' + this.id)?.focus()
      })
    },
    handleBlur() {
      // setTimeout(() => {
      //   this.$emit('hiddenInput')
      // }, 500)
    }
  }
}
</script>
<style lang="less" scoped>
.input {
  margin: 8px 0 48px;
}
</style>
