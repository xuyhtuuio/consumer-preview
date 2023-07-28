<template>
  <div class="swiper">
    <div class="logo" @click="goMain">
      <img src="@/assets/image/logo.png" alt="" />
      <span><i>消保管控</i>平台</span>
    </div>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="@/assets/image/swiper1.png" alt="" />
        </div>
        <div class="swiper-slide"><img src="@/assets/image/swiper2.png" alt="" /></div>
        <div class="swiper-slide">
          <img src="@/assets/image/swiper4.png" alt="" />
        </div>
        <div class="swiper-slide">
          <img src="@/assets/image/swiper3.png" alt="" />
        </div>
      </div>

      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';
export default {
  data() {
    return {};
  },
  mounted() {
    // eslint-disable-next-line
    const swiper = new Swiper('.swiper-container', {
      loop: true, // 循环
      spaceBetween: 30, // swiper-slide 间的距离为30
      pagination: {
        el: '.swiper-pagination',
        clickable: true // 分页器点击
      }, // 分页器
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      autoplay: {
        delay: 3000, // 自动播放的间隔时间，单位ms，默认3000ms
        disableOnInteraction: false // 点击不会取消自动
      }
    });
  },
  methods: {
    goMain() {
      //   const page2 = this.$router.resolve({ name: 'homePage' })
      //   window.open(page2.href, '_blank')
    }
  }
};
</script>
<style lang="less" scoped>
.swiper {
  // height: 100vh;
  margin-left: 100px;

  .logo {
    cursor: pointer;
    display: flex;
    align-items: center;
    font-style: italic;

    img {
      width: 44px;
      height: 44px;
      margin-right: 8px;
    }

    span {
      font-weight: 700;
      font-size: 30px;
      line-height: 38px;
      color: #505968;
      font-style: italic;

      i {
        color: #2d5cf6;
        font-style: italic;
      }
    }
  }
}

.swiper-container {
  position: relative;
  height: 500px;
  width: 608px;
  z-index: -10;
}

.swiper-slide {
  width: 608px;
  height: 500px;

  img {
    width: 100%;
    height: 100%;
  }
}

.swiper1 {
  position: relative;

  .t1 {
    position: absolute;
    width: 165px;
    height: 179px;
    left: 0;
  }

  .t2 {
    position: absolute;
    width: 435px;
    height: 237px;
    bottom: 60px;
    right: 0;
  }

  .swiper1-1 {
    position: absolute;
    font-weight: 900;
    font-size: 32px;
    line-height: 48px;
    color: #2d5cf6;
    font-style: italic;
    bottom: 55px;
  }

  .swiper1-2 {
    position: absolute;
    font-weight: 900;
    font-size: 32px;
    line-height: 48px;
    color: #374160;
    font-style: italic;
    bottom: 20px;
  }
}

/deep/ .swiper-pagination {
  position: absolute;
  bottom: 0;

  .swiper-pagination-bullet-active {
    background: #2d5cf6 !important;
  }

  .swiper-pagination-bullet {
    width: 32px;
    height: 4px;
    background: #9a9eb4;
    border-radius: 20px;
    display: inline-block;
  }
}

</style>
