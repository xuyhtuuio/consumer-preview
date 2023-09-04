import { $locale } from '@/utils/service'
import Vue from 'vue'
Vue.mixin({
  methods: {
    $msg(key) {
      return $locale.MESSAGES[key]
    },
    $field(key) {
      return $locale.FIELDS[key]
    }
  }
})
