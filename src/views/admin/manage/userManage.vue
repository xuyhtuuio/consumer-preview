<template>
  <div class="user">
    <div class="top">
      <div class="info">
        <span class="info-title">全部用户</span>
        <span class="info-desc">共<span class="desc-blue">12000</span>/15000 个</span>
      </div>
      <div class="search">
        <el-form class="my-form form" :inline="true" :model="search">
          <el-form-item class="form-item" label="所属机构">
            <el-cascader
              v-model="search.value"
              :options="cascaderOptions"
            ></el-cascader>
          </el-form-item>

          <el-form-item class="form-item" label="角色">
            <el-select v-model="search.region" placeholder="全部">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="form-item">
            <el-input v-model="search.user1" placeholder="请输入姓名或一事通ID"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main">
      <TrsTable
        theme="TRS-table-gray"
        :data="data"
        :colConfig="colConfig"
        @sort-change="sortChange"
        @submitEdit="submitEdit"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <!-- <template #address="scope">
          <div class="template-class">地址：{{ scope.row.address }}</div>
        </template> -->
        <template #operate="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">变更角色</el-button>
          <el-button type="text" size="small">恢复</el-button>
          <el-button type="text" class="red" @click="stopApllay(scope.row)">停用</el-button>
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
    </div>

    <el-dialog
      title="修改"
      :visible.sync="limitTimeVisible"
      width="600px"
      custom-class="user-dialog"
      :show-close="false"
      center
    >
      <template slot="title">
        <span>修改</span>
        <span class="close" @click="limitTimeVisible = false"><i class="el-icon-close"></i></span>
      </template>
      <div class="dialog-item">
        <g-table-card :title="dialogTitle"></g-table-card>
        <el-radio-group v-model="dialogRadio">
          <el-radio v-for="item in dialogRadioItem" :key="item.label" :label="item.label">{{
            item.value
          }}</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <g-button @click="limitTimeVisible = false">取 消</g-button>
        <g-button type="primary" @click="handleSubmitLimitTime">确 定</g-button>
      </div>
    </el-dialog>

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
  name: 'UserManage',
  data() {
    return {
      search: {
        approvalType: ''
      },
      limitTimeVisible: false,
      limitVisible: false,
      tabs: [
        {
          label: '第一个tab',
          value: 0
        },
        {
          label: '第二个tab',
          value: 1
        },
        {
          label: '第三个tab',
          value: 2
        }
      ],
      data: [
        {
          organization: '乌鲁木齐分行',
          department: '办公室/消费者权益保护监督部',
          team: '财富运营团队',
          name: '杨xxx/123456',
          role: '总行部门管理员',
          updateTime: '2021-1015 11:00:34'
        },
        {
          organization: '乌鲁木齐分行',
          department: '办公室/消费者权益保护监督部',
          team: '财富运营团队',
          name: '杨xxx/123456',
          role: '总行部门管理员',
          updateTime: '2021-1015 11:00:34'
        }
      ],
      colConfig: [
        {
          label: '所属机构',
          prop: 'organization',
          bind: {
            align: 'center'
          }
        },
        {
          label: '所属部门',
          prop: 'department'
        },
        {
          label: '所属团队',
          prop: 'team'
        },
        {
          label: '姓名',
          prop: 'name'
        },
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
            width: 250,
            align: 'center'
          }
        }
      ],
      cascaderOptions: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                },
                {
                  value: 'fankui',
                  label: '反馈'
                },
                {
                  value: 'xiaolv',
                  label: '效率'
                },
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }
              ]
            }
          ]
        }
      ],
      page: {
        pageNow: 1,
        total: 3
      },
      dialogTitle: '变更角色',
      dialogRadio: '',
      dialogRadioItem: [
        { label: 0, value: '超级管理员' },
        { label: 1, value: '超级管理员' },
        { label: 2, value: '总行' },
        { label: 3, value: '超级管理员' },
        { label: 4, value: '总行' }
      ]
    };
  },
  created() {},
  methods: {
    sortChange({ column, prop, order }) {
      console.log(column, prop, order);
    },
    handleClick(row) {
      this.limitTimeVisible = true;
      console.log(row);
    },
    submitEdit(row) {
      console.log(row);
    },
    // 停用
    stopApllay(item) {
      console.log(item);
      this.limitVisible = true;
    },
    handleCurrentChange() {},
    handleSubmitLimitTime() {}
  }
};
</script>
<style lang="less" scoped>
@color1: #1d2128;
.user {
  .top {
    font-size: 14px;
    margin: 0 -24px;
    padding: 0 24px 24px;
    border-bottom: 1px solid #e5e6eb;

    .info {
      margin-bottom: 20px;
      &-title {
        font-size: 20px;
        font-weight: 700;
        color: rgba(51, 51, 51, 1);
      }
      &-desc {
        margin-left: 20px;
        font-size: 14px;
        color: rgba(51, 51, 51, 1);

        .desc-blue {
          color: rgba(48, 110, 245, 1);
        }
      }
    }

    .search {
      .form {
        display: flex;
        &-item {
          flex: 1;
          display: flex;
          margin-right: 0;
          margin-bottom: 0;
          &:nth-child(n + 2) {
            margin-left: 20px;
          }
          /deep/.el-form-item__content {
            border-radius: 4px;
            flex: 1;
          }
        }
      }
    }

    .el-button {
      width: 80px;
      height: 34px;
      line-height: 26px;
      border-radius: 6px;
      span {
        position: relative;
        bottom: 5px;
      }
    }
    .el-button--primary {
      border: none;
    }
  }

  .main {
    padding: 24px 0;
  }

  .el-button--text {
    padding: 5px;
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
  /deep/.el-dialog.user-dialog {
    border-radius: 10px;
    padding: 40px;
    .dialog-item {
      padding: 24px 40px;
      margin-bottom: 32px;
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
        font-size: 40px;
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
        font-size: 14px;
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

  /deep/ .tableCard {
    padding: 0;

    .left {
      position: relative;
      left: -8px;
    }
    .content {
      font-weight: 700;
      color: @color1;
    }
  }

  /deep/.el-radio-group {
    display: flex;
    flex-wrap: wrap;
    .el-radio {
      // display: flex;
      // align-items: center;
      padding: 15px 20px;
      width: 140px;
      margin-top: 20px;
      margin-right: 10px;
      border-radius: 4px;
      background: #f7f8fa;
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
  /deep/.el-dialog__footer {
    padding: 0;
    .dialog-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      .g-button {
        margin-right: 20px;
        .btn-primary {
          background: #306ef5;
        }
      }
    }
  }
}
</style>