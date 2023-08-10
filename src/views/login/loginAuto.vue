<template>
  <div style="heigth: 100vh" v-loading="loading"></div>
</template>

<script>
export default {
  name: 'login-page',
  data() {
    return {
      loading: true
    };
  },
  created() {
    this.autoLogin();
  },
  methods: {
    autoLogin() {
      const ifm = window.self === window.top;
      const ifmUrl = this.getParentUrl();
      if (ifm === false) {
        // false的话 页面被嵌套在iframe中
        const host = [this.$store.state.getImageUrl, 'http://192.168.210.57:31578']
        if (ifmUrl.startsWith(host[0]) || ifmUrl.startsWith(host[1]) || ifmUrl.startsWith(host[2])) {
          this.$http({
            method: 'post',
            contentType: 'application/x-www-form-urlencoded',
            url: this.$GLOBAL.uaa + 'oauth/token',
            data: {
              username: 'hs2trs',
              password: 'CGj43pe*7Q&GRWvzle',
              verKey: '1e6798b3bc454f22a172bc14fcc012e0',
              grant_type: 'password',
              client_id: 'teisdata',
              client_secret: 'secret'
            },
            msg: false
          }).then((res) => {
            if (res.access_token) {
              window.localStorage.setItem('AI_token', res.access_token);
              window.history.go(-1);
            }
          });
        }
      }
    },
    getParentUrl() {
      let url = '';
      try {
        url = window.top.document.referrer;
      } catch (M) {
        if (window.parent) {
          try {
            url = window.parent.document.referrer;
          } catch (L) {
            url = '';
          }
        }
      }
      if (url === '') {
        url = document.referrer;
      }
      return url;
    },
  },
};
</script>
<style lang='less' src='./login.less' scoped></style>
