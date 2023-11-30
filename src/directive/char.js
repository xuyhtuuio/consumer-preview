import Vue from 'vue'
Vue.directive('char', {
  bind(rootEl) {
    // 自定义正则表达式
    const regRule = /[~{}|$^&\\()=<>\\+-]/g
    let inputFlag = true;
    const el = rootEl.querySelector('input')
    if (!el) {
      return;
    }
    el.$handle = function () {
      if (inputFlag) {
        const val = el.value
        el.value = val.replace(regRule, '')
        trigger(el, 'input')
      }
    }
    el.addEventListener('compositionstart', () => {
      inputFlag = false;
    });
    el.addEventListener('compositionend', () => {
      inputFlag = true;
    });
    el.addEventListener('keyup', el.$handle)
  },
  unbind(el) {
    el.removeEventListener('keyup', el.$handle)
  },
});
const trigger = (el, type) => {
  const ev = document.createEvent('HTMLEvents');
  ev.initEvent(type, true, true);
  el.dispatchEvent(ev);
}
