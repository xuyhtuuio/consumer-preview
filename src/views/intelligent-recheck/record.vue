<template>
  <div>
    <div class="outer">
      <div class="search-area">
        <div class="search-title">智能回检</div>
        <el-input placeholder="请输入关键词开始检索"></el-input>
      </div>

      <div class="search-middle-area">
        <div class="left-area">
          <el-row>
            <el-col :span="6">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  选择机构
                  <img
                    src="../../assets/image/person-center/down.png"
                    class="down"
                    alt=""
                  />
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item> </el-dropdown-item>
                    <el-dropdown-item>Action 3</el-dropdown-item>
                    <el-dropdown-item>Action 4</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <img
                src="../../assets/image/why.png"
                alt=""
                style="width: 20px; height: 20px; margin-left: 4px"
              />
            </el-col>
            <el-col :span="6">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  上线时间
                  <img
                    src="../../assets/image/person-center/down.png"
                    class="down"
                    alt=""
                  />
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item> </el-dropdown-item>
                    <el-dropdown-item>Action 3</el-dropdown-item>
                    <el-dropdown-item>Action 4</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
            <el-col :span="6">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  提单时间
                  <img
                    src="../../assets/image/person-center/down.png"
                    class="down"
                    alt=""
                  />
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item> </el-dropdown-item>
                    <el-dropdown-item>Action 3</el-dropdown-item>
                    <el-dropdown-item>Action 4</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
            <el-col :span="6" justify="center">
              <el-switch size="small" style="margin-right: 4px" />
              已回检
            </el-col>
          </el-row>
        </div>
        <div class="right-area">
          <el-row>
            <el-col :span="8"
              ><p class="tot-num">共<span class="num">3216</span>条</p></el-col
            >
            <el-col :span="8" justify="center">
              <p class="sort">
                按上线时间<img src="../../assets/image/upup.png" alt="" /></p
            ></el-col>
            <el-col :span="8" justify="center">
              <p class="sort">
                按提单时间<img src="../../assets/image/upup.png" alt="" /></p
            ></el-col>
          </el-row>
        </div>
      </div>
      <recordTableVue />
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import recordTableVue from './components/record-table.vue'
export default {
  name: 'Record',
  data() {
    return {}
  },
  components: {
    recordTableVue
  },
  methods: {},
  created() {},
  mounted() {},
  watch: {}
}
</script>

<style scoped lang="less">
.outer {
  border-radius: 10px;
  background: #fff;
  padding: 24px;
  .search-area {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
    gap: 19px;

    .search-title {
      background: var(--2, linear-gradient(90deg, #2f54eb 0%, #5196ff 100%));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 18px;
      font-style: normal;
      font-weight: 900;
      font-style: italic;
      width: 81px;
      margin-left: 5px;
    }
    .el-input {
      margin-left: 5px;
      :deep(.el-input__inner) {
        display: flex;
        padding: 8px 20px;
        align-items: center;
        gap: 16px;
        flex: 1 0 0;
        border-radius: 32px;
        background: var(--gray-gray-3, #f2f3f5);
        border: none;
        width: 100%;
      }
    }
  }

  .search-middle-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    :deep(.el-dropdown-link) {
      color: var(--gray-gray-9, #1d2128);
      /* 正文/常规 */
      font-family: Microsoft YaHei;
      font-size: 2px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;

      img {
        margin-left: 4px;
        width: 8px;
        height: 6px;
      }
    }
    .left-area {
      width: 525px;
    }

    .right-area {
      width: 300px;
      .tot-num {
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;

        .num {
          color: var(--unnamed, #2d5cf6);
          font-size: 14px;
          font-weight: 700;
          margin: 0px 4px;
        }
      }

      img {
        width: 12px;
        height: 12px;
      }

      .sort {
        color: var(--gray-gray-8, #505968);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
      }
    }
  }

  :deep(.el-col-6) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
