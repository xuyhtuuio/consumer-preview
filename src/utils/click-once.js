export default {
  install(Vue) {
    // 防止重复点击 在前端元素中添加 v-once-click属性
    Vue.directive('onceClick', {
      inserted(el) {
        el.addEventListener('click', () => {
          if (el.style.pointerEvents === '') {
            el.style.pointerEvents = 'none'; // 防止a标签
            setTimeout(() => {
              el.style.pointerEvents = '';
            }, 3000);
          }
        });
      },
    });
  },
};
