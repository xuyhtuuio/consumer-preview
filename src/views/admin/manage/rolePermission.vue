<template>
  <div class="rolePermission">
    <template>
      <div class="top">
        <template v-if="level">
          <!-- <g-button type="primary" @click="handleNew">新增</g-button> -->
        </template>
        <template v-else>
          <span class="title">编辑权限/总行管理员</span>
          <div class="btn">
            <g-button class="btn-item" @click="level = true">
              <i class="iconfont icon-fanhui1 icon"></i>
              返回</g-button
            >
            <g-button class="btn-item" type="primary" @click="handleSave">
              <i class="iconfont icon-baocun icon"></i>
              {{ isSave ? '已保存' : '保存' }}</g-button
            >
          </div>
        </template>
      </div>

      <div class="main">
        <template v-if="level">
          <TrsTable
            theme="TRS-table-gray"
            :data="data"
            :colConfig="colConfig"
            @sort-change="sortChange"
            @submitEdit="submitEdit"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <template #operate="scope">
              <el-button type="text" size="small" @click="handleClick(scope.row)"
                >编辑权限</el-button
              >
              <el-button type="text" size="small" v-if="!scope.row.isStop">恢复</el-button>
              <el-button type="text" class="red" v-else @click="stopApllay(scope.row)"
                >停用</el-button
              >
            </template>
          </TrsTable>
          <TrsPagination
            :pageSize="10"
            :pageNow="page.pageNow"
            :total="page.total"
            @getList="handleCurrentChange"
            scrollType="scrollCom"
            scrollName="scrollCom"
            v-if="page.total"
          >
          </TrsPagination>
        </template>
        <template v-else>
          <g-table-card title="消保审查">
            <template #cardInfo>
              <span class="main-info">共<span class="high"> 8</span>/13</span>
            </template>
            <template #content>
              <div class="main-content">
                <div class="con-top">功能权限 <span class="normal">6</span></div>
                <el-checkbox-group v-model="checkedPermission" @change="handleChecked">
                  <el-checkbox
                    v-for="check in checkedPermissions"
                    :label="check.label"
                    :key="check.label"
                    >{{ check.value }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </template>
          </g-table-card>
        </template>
      </div>
    </template>

    <el-dialog
      :visible.sync="limitVisible"
      width="500px"
      custom-class="stop-dialog"
      :show-close="false"
      center
    >
      <template slot="title">
        <span class="close" @click="limitVisible = false"><i class="el-icon-close"></i></span>
      </template>
      <div class="dialog-item">
        <i class="el-alert__icon el-icon-warning icon"></i>
        <div class="info">停用该用户将不能登录，确定停用吗？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <g-button @click="limitVisible = false">取 消</g-button>
        <g-button class="stop" type="primary" @click="handleSubmitLimitTime">停用</g-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'rolePermission',
  data() {
    return {
      level: true,
      isSave: false,
      limitVisible: false,
      data: [
        {
          role: '总行部门管理员',
          updateTime: '2021-1015 11:00:34'
        },
        {
          role: '总行部门管理员',
          updateTime: '2021-1015 11:00:341',
          isStop: true
        }
      ],
      colConfig: [
        {
          label: '角色',
          prop: 'role'
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          bind: {
            align: 'center',
            sortable: 'custom'
          }
        },
        {
          label: '操作',
          prop: 'operate',
          bind: {
            align: 'center'
          }
        }
      ],
      page: {
        pageNow: 1,
        total: 3
      },
      checkedPermission: [],
      checkedPermissions: [
        { label: 1, value: '提单' },
        { label: 2, value: '审批' },
        { label: 3, value: '消保审批（智能审批）' },
        { label: 4, value: '统计中心' },
        { label: 5, value: '后台管理' },
        { label: 6, value: '附件下载' },
        { label: 7, value: '审查任务删除' }
      ]
    };
  },
  methods: {
    handleClick() {
      this.level = false;
      this.isSave = false;
    },
    stopApllay() {
      this.limitVisible = true;
    },
    getList() {},
    sortChange() {},
    submitEdit() {},
    handleCurrentChange() {},
    handleSave() {
      this.isSave = true;
    },
    handleChecked() {},
    handleSubmitLimitTime() {}
  }
};
</script>

<style lang="less" scoped>
@color1: #1d2128;
.rolePermission {
  .el-button--text {
    padding: 5px;
  }
  .top {
    display: flex;
    height: 50px;
    margin: 0 -24px;
    padding: 0 24px;
    border-bottom: 1px solid #e5e6eb;
    .title {
      flex: 1;
    }
    .btn {
      display: flex;
      &-item {
        &:first-child {
          margin-right: 20px;
        }
        .icon {
          margin-right: 4px;
          font-size: 20px;
        }

        /deep/.btn {
          padding: 0 16px;
          min-width: auto;
        }
      }
    }
  }
  .main {
    padding: 24px 0;

    /deep/.tableCard {
      padding: 0;
      .content {
        margin-right: 12px;
      }
      .main-info {
        font-size: 12px;

        .high {
          color: #2d5cf6;
        }
      }
      .main-content {
        margin-top: 14px;
        padding: 8px 0;
        background-color: #f7f8fa;
        border-radius: 8px;

        .con-top {
          padding-left: 18px;
          font-size: 12px;
          font-weight: 700;
          line-height: 22px;
          color: #505968;
          .normal {
            font-weight: 400;
          }
        }
      }
    }

    /deep/.el-checkbox-group {
      .el-checkbox {
        min-width: 200px;
        height: 50px;
        line-height: 50px;
        padding: 6px 20px;
        margin-right: 10px;
      }
    }
  }

  /deep/.el-dialog.stop-dialog {
    border-radius: 10px;
    padding: 20px 20px 40px;
    .dialog-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 40px;
      .icon {
        margin-bottom: 16px;
        color: #fdb123;
        font-size: 54px;
      }
      .info {
        color: #1d2128;
      }
    }
    .el-dialog__footer {
      padding: 0;
      .dialog-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        .g-button {
          margin-right: 24px;
          .btn-primary {
            background-image: linear-gradient(
              to right,
              rgba(47, 84, 235, 1),
              rgba(81, 150, 255, 1)
            );
          }
        }
      }
    }
  }

  /deep/.el-dialog {
    .el-dialog__header {
      padding: 0;
      font-size: 16px;
      font-weight: 700;
      color: @color1;
      line-height: 24px;
      height: 24px;
      .close {
        float: right;
        font-size: 24px;

        &:hover {
          cursor: pointer;
        }
      }
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>