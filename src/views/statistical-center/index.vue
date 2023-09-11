<template>
  <div class="statistical-center">
    <div class="header"></div>
    <div class="main">
      <div class="main-item common" style="padding: 0">
        <DataOverview />
      </div>
      <div class="main-item flex" style="gap: 16px">
        <TypeDistribution class="common" />
        <MissionTrends class="common" />
      </div>
      <div class="main-item common">
        <g-table-card title="审查任务分布">
          <template #content>
            <RectTree></RectTree>
            <ReviewForm></ReviewForm>
          </template>
        </g-table-card>
      </div>
      <div class="main-item common">
        <ReachingConsumers />
      </div>
      <div class="main-item flex" style="gap: 16px; height: 430px">
        <SystemConnection class="common" />
        <TurnDown class="common" />
      </div>
      <div class="main-item flex" style="gap: 16px">
        <SensitiveProhibited
          class="common"
          style="width: 60%"
        ></SensitiveProhibited>
        <SensitiveProhibited class="common"></SensitiveProhibited>
      </div>
    </div>
  </div>
</template>

<script>
import SensitiveProhibited from './components/sensitive-prohibited'
import TurnDown from './components/turn-down'
import SystemConnection from './components/system-connection'
import ReachingConsumers from './components/reaching-consumers'
import ReviewForm from './components/review-form'
import RectTree from './components/rect-tree'
import DataOverview from './components/data-overview'
import MissionTrends from './components/mission-trends'
import TypeDistribution from './components/type-distribution'
export default {
  components: {
    SensitiveProhibited,
    TurnDown,
    SystemConnection,
    ReachingConsumers,
    ReviewForm,
    RectTree,
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
      padding: 24px;
      border-radius: 10px;
      background-color: #fff;
    }
    .main-item {
      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }
    /deep/.tableCard {
      height: 100%;
      padding: 0;
      display: flex;
      flex-direction: column;
      & > .content {
        width: 100%;
        flex: 1;
        display: flex;
        gap: 10px;
        margin-top: 16px;
      }
    }
  }
}
</style>
