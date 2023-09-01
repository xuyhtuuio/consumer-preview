
<template>
  <div class="user">
    <div class="top">
      <div class="info">
        <span class="info-title">全部用户</span>
        <span class="info-desc"
          >共<span class="desc-blue">{{ totalCountInitiated }}</span
          >/{{ count }} 个</span
        >
      </div>
      <div class="search">
        <el-form class="my-form form" :inline="true" :model="search">
          <el-form-item class="form-item" label="所属机构">
            <el-cascader
              v-model="search.value"
              popper-class="my-cascader"
              :options="cascaderOptions"
              @change="onSearch"
              :props="{ label: 'name', value: 'id', checkStrictly: true }"
              clearable
            ></el-cascader>
          </el-form-item>

          <el-form-item class="form-item" label="角色">
            <el-select
              ref="refSelect"
              v-model="search.roleId"
              placeholder="全部"
              @change="onSearch"
              :loading="selectLoading"
              @blur="handleSelectBlur"
              clearable
            >
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="form-item">
            <el-input
              v-model="search.name"
              placeholder="请输入姓名或一事通ID"
              @keyup.enter.native="onSearch"
              @blur="onSearch"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main" v-loading="formLoading">
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
        <template #operate="{ row }" v-if="editAuth">
          <el-button type="text" size="small" @click="handleClick(row)">变更角色</el-button>
          <el-button
            type="text"
            :class="{ red: row.status !== 0 }"
            size="small"
            @click="stopApllay(row, row.status == 0 ? 'edit0' : 'edit1')"
            >{{ row.status == 0 ? '恢复' : '停用' }}</el-button
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
        <el-radio-group v-model="dialog.roleId">
          <el-radio v-for="item in roleList" :key="item.label" :label="item.id">{{
            item.name
          }}</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <g-button @click="limitTimeVisible = false">取 消</g-button>
        <g-button type="primary" @click="handleSubmitLimitTime">确 定</g-button>
      </div>
    </el-dialog>
    <SecondaryConfirmation
      :option="saveOption[action]"
      ref="confirmation"
      @handleConfirm="editStatus"
    ></SecondaryConfirmation>
  </div>
</template>
<script>
import SecondaryConfirmation from '@/components/common/secondaryConfirmation';
import {
  queryUserList,
  queryRoleList,
  getUserList,
  deactivateRecoveryUser,
  changeUserRoles
} from '@/api/admin/user.js';
export default {
  name: 'UserManage',
  components: { SecondaryConfirmation },
  data() {
    return {
      search: {
        value: '',
        name: '',
        roleId: ''
      },
      formLoading: true,
      limitTimeVisible: false,
      noMore: false,
      selectLoading: false,
      data: [],
      colConfig: [
        {
          label: '所属机构',
          prop: 'org',
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
          prop: 'userName'
        },
        {
          label: '角色',
          prop: 'role'
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          bind: {
            width:180,
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
      cascaderOptions: [],
      roleList: [],
      page: {
        pageNow: 1,
        pageSize: 10,
        total: 3
      },
      dialogTitle: '变更角色',
      dialog: {
        userId: '',
        roleId: ''
      },
      pageRole: {
        pageNow: 1,
        pageSize: 100
      },
      saveOption: {
        edit1: {
          message: '停用该用户将不能登录，确定停用吗？',
          cancelBtn: '取消',
          confirmBtn: '停用'
        }
      },
      action: 'edit1',
      stopOrRun: {},
      sortType: 2,
      count: 0,
      totalCountInitiated: 0
    };
  },
  computed: {
    editAuth() {
      const { permissionsPage = {} } = this.$store.state
      const flowManage = [...permissionsPage.funPerms, ...permissionsPage.defaultPerm]?.find(item => item.pathName === 'UserManage') || {}
      if (flowManage.type === 'edit') {
        return true
      }else {
        this.colConfig.pop()
        return false
      }
    }
  },
  created() {
    this.initOrganizationData();
    this.initRoleData();
    this.initData();
  },
  activated() {
    this.initOrganizationData();
    this.initRoleData();
    this.initData();
  },
  mounted() {
    // 监听滚动事件
    // 暂时没用
    this.$refs.refSelect.$refs.scrollbar.$refs.wrap.addEventListener(
      'scroll',
      _.throttle(this.scolling, 300, { leading: true, trailing: true })
    );
  },
  methods: {
    async initData() {
      this.formLoading = true;
      const data = {
        name: this.search.name || '',
        orgId: this.search.value[this.search.value.length - 1] || 0,
        pageNow: this.page.pageNow,
        pageSize: this.page.pageSize,
        roleId: this.search.roleId || 0,
        sortType: this.sortType
      };
      const {
        data: {
          data: { pageData: res, count, totalCountInitiated },
          success
        }
      } = await getUserList(data);
      if (success) {
        this.data = res.list;
        this.page.total = res.totalCount;
        this.count = count;
        this.totalCountInitiated = totalCountInitiated;
      }
      this.formLoading = false;
    },
    initOrganizationData() {
      queryUserList().then(res => {
        if (res.data.success) {
          this.cascaderOptions = this.getTreeData(res.data.data.root.children);
        }
      });
    },
    async initRoleData() {
      const {
        data: { data: res, success }
      } = await queryRoleList(this.pageRole);
      if (success) {
        this.roleList = [...res.list];
      }
    },
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    scolling() {
      let e = this.$refs.refSelect.$refs.scrollbar.$refs.wrap;
      if (this.noMore) return;
      // 到底时触发 loadMore
      let loadMore = e.scrollHeight - e.scrollTop <= e.clientHeight;
      if (loadMore) {
        // this.loadMore();
      }
    },
    loadMore() {
      if (this.selectLoading) return;
      // this.selectLoading = true
      this.pageRole.pageNow = 1 + this.pageRole.pageNow;
      this.initRoleData();
    },

    sortChange({ column, prop, order }) {
      if (!order) return;
      this.sortType = order.includes('asc') ? 1 : 2;
      this.initData();
    },
    onSearch() {
      this.initData();
    },
    // 失去焦点重置数据
    handleSelectBlur() {
      // this.roleList = [];
      this.pageRole.pageNow = 1;
      // this.initRoleData();
    },
    handleClick(row) {
      this.limitTimeVisible = true;
      this.dialog.roleIdOne = row.roleId;
      this.dialog.roleId = row.roleId;
      this.dialog.userId = row.userId;
    },
    submitEdit(row) {},
    // 停用
    stopApllay({ userId }, action) {
      this.stopOrRun = { userId, status: action === 'edit0' ? 0 : 1 };
      action === 'edit1' && (this.$refs.confirmation.dialogVisible = true);
      action === 'edit0' && this.editStatus(true);
    },
    editStatus(flag = false) {
      deactivateRecoveryUser(this.stopOrRun).then(({ data: { data: res, success } }) => {
        if (success) {
          this.initData();
          flag && this.$message.success('已恢复该用户所有操作权限。');
          !flag && this.$message.success('停用成功');
        }
      });
    },
    handleCurrentChange(val) {
      this.page.pageNow = val;
      this.initData();
    },
    handleSubmitLimitTime() {
      changeUserRoles(this.dialog).then(({ data: { data: res, msg, success } }) => {
        if (success) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
        this.initData();
        this.limitTimeVisible = false;
      });
    }
  }
};
</script>
<style lang="less" scoped>
@color1: #1d2128;
.user {
  height: 100%;
  overflow: hidden;
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
    height: calc(100% - 111px);
    overflow-y: auto;
    padding: 24px 0 0;
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
      margin-top: 20px;
      margin-right: 10px;
      border-radius: 4px;
      background: #f7f8fa;
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