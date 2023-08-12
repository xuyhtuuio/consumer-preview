import { $locale } from '@/utils/service'
import Vue from 'vue'
Vue.mixin({
    methods: {
      $msg: function (key) {
        return $locale.MESSAGES[key]
      },
      $field: function (key) {
        return $locale.FIELDS[key]
      }
  
    }
  })