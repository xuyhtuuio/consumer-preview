<template>
  <div class="statistical-center">
    <div class="header"></div>
    <div class="main">
      <div class="main-item common">
        <DataOverview />
      </div>
      <div class="main-item flex">
        <TypeDistribution class="common"/>
        <MissionTrends class="common"/>
      </div>
      <div class="main-item"></div>
      <div class="main-item"></div>
      <div class="main-item"></div>
      <div class="main-item"></div>
    </div>
  </div>
</template>

<script>
import DataOverview from './components/data-overview'
import MissionTrends from './components/mission-trends'
import TypeDistribution from './components/type-distribution'
export default {
  components: {
    DataOverview,
    MissionTrends,
    TypeDistribution
  }
}
</script>

<style lang="less" scoped>
.statistical-center {
  font-size: 14px;
  .header {
    height: 36px;
    margin-bottom: 16x;
  }

  .main {
    .common {
      border-radius: 10px;
      background-color: #fff;
    }
    .main-item {
      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }
  }
}
</style>
