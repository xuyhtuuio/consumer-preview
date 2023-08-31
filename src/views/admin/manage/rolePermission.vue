<template>
  <div class="rolePermission">
    <template>
      <div class="top">
        <template v-if="level">
          <!-- <g-button type="primary" @click="handleNew">新增</g-button> -->
        </template>
        <template v-else>
          <span class="title"
            ><i class="top-back" @click="handleReturn">编辑权限</i>/总行管理员</span
          >
          <div class="btn">
            <g-button class="btn-item" @click="handleReturn">
              <i class="iconfont icon-fanhui1 icon"></i>
              返回</g-button
            >
            <g-button class="btn-item" type="primary" @click="handleSave">
              <i class="iconfont icon-baocun icon"></i>
              保存</g-button
            >
          </div>
        </template>
      </div>

      <div class="main" v-loading="mainLoading">
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
            <template #operate="{ row }">
              <el-button type="text" size="small" @click="handleClick(row)">编辑权限</el-button>
              <!-- <el-button type="text" size="small" v-if="!scope.row.isStop">恢复</el-button>
              <el-button type="text" class="red" v-else @click="stopApllay(scope.row)"
                >停用</el-button
              > -->
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
        </template>
        <template v-else>
          <g-table-card title="消保审查" v-loading="cardLoading" :hProp="22">
            <template #cardInfo> </template>
            <template #content>
              <div class="main-content">
                <div class="con-top">
                  功能权限
                  <div class="con-main">
                    <div class="con-main-item" v-for="(item, index) in permissionList" :key="index">
                      <div class="item-left">
                        <el-checkbox
                          v-model="item.type"
                          true-label="view"
                          false-label=""
                          @change="handleCheckBoxChange(item)"
                          >{{ item.title }}</el-checkbox
                        >
                        <p class="warn" v-if="item.isShowWarn">
                          <g-icon class="right-icon" stylePx="20" href="#icon-a-tubiao1" />
                          至少选择一个
                        </p>
                      </div>

                      <div class="item-right">
                        <div
                          class="item-right-item"
                          v-for="(childItem, childIndex) in item.children"
                          :key="childIndex"
                        >
                          <p>{{ childItem.title }}</p>
                          <div>
                            <el-radio
                              v-for="(iten, indey) in childItem.props"
                              :key="indey"
                              v-model="childItem.type"
                              :label="iten.label"
                              @click.native.prevent="handleRadioChange(iten.label, childItem, item)"
                              >{{ iten.value }}</el-radio
                            >
                          </div>
                        </div>
                        <div class="item-right-item" style="height: 0"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="con-top">
                  <div class="title">
                    <span class="title-item">
                      数据权限<span style="margin-left: 5px; color: #eb5757">*</span>
                    </span>
                    <span class="title-item">
                      <i></i>
                      数据权限仅作用于审批中心、后台管理（用户管理、表单管理、流程管理）及统计中心
                    </span>
                  </div>
                  <div class="con-main">
                    <el-radio
                      v-for="item in dataRadioList"
                      :key="item.label"
                      v-model="dataPerm"
                      :label="item.label"
                      >{{ item.value }}</el-radio
                    >
                  </div>
                </div>
              </div>
            </template>
          </g-table-card>
        </template>
      </div>
    </template>
    <SecondaryConfirmation
      :option="saveOption[action]"
      ref="confirmation"
      @handleClose="handleClose"
      @handleConfirm="editStatus"
    ></SecondaryConfirmation>
  </div>
</template>

<script>
import SecondaryConfirmation from '@/components/common/secondaryConfirmation';

import {
  getRoleList,
  deactivateRecoveryRole,
  editThePermissionsPage,
  updateRolePermission
} from '@/api/admin/role.js';
import rolePermission from '../data/rolePermission.json';
import { permissionList } from '../data/rolePermission.js';
export default {
  name: 'rolePermission',
  components: { SecondaryConfirmation },
  data() {
    return {
      level: true,
      mainLoading: false,
      cardLoading: false,
      data: [],
      colConfig: [
        {
          label: '角色',
          prop: 'roleName'
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          bind: {
            align: 'center'
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
        pageSize: 10,
        total: 3
      },
      saveOption: {
        edit1: {
          message: '停用与此角色相关的用户权限将受到影响，确定停用吗？',
          cancelBtn: '取消',
          confirmBtn: '停用'
        },
        edit2: {
          message: '当前权限设置未保存，是否保存？',
          cancelBtn: '不保存',
          confirmBtn: '保存'
        }
      },
      action: 'edit1',
      stopOrRun: {},
      roleId: '',
      permissionList: [],
      dataPerm: 'org',
      dataRadioList: [
        { value: '全行', label: 'all' },
        { value: '本行', label: 'own' },
        { value: '本部门', label: 'org' },
        { value: '信用卡', label: 'card' }
      ],
      rolePermission: []
    };
  },
  created() {
    this.permissionList = JSON.parse(JSON.stringify(permissionList));
  },
  activated() {
    this.initData();
  },
  deactivated() {
    this.handleBack();
  },
  mounted() {},
  methods: {
    async initData() {
      if (this.mainLoading) return;
      this.mainLoading = true;
      const { pageNow, pageSize } = this.page;
      const {
        data: { data: res, success, msg }
      } = await getRoleList({ pageNow, pageSize });
      if (success) {
        this.data = res.list;
        this.page.total = res.totalCount;
      } else {
        this.$message.error(msg);
      }
      this.mainLoading = false;
    },
    // 编辑
    async handleClick({ roleId }) {
      this.level = false;
      this.cardLoading = true;
      this.roleId = roleId;
      const {
        data: { data: res, success, msg }
      } = await editThePermissionsPage({ roleId });
      if (success) {
        this.formatDataZero(res);
      } else {
        this.$message.error(msg);
      }
      this.cardLoading = false;
    },
    stopApllay({ roleId }, action) {
      this.stopOrRun = { roleId, status: action === 'edit0' ? 0 : 1 };
      action === 'edit1' && (this.$refs.confirmation.dialogVisible = true);
      action === 'edit0' && this.editStatus(true);
    },
    editStatus(flag = false) {
      if (this.action === 'edit2') {
        return this.handleSave();
      }
      deactivateRecoveryRole(this.stopOrRun).then(({ data: { data: res, success } }) => {
        if (success) {
          this.initData();
          flag &&
            this.$message({
              type: 'success',
              customClass: 'el-icon-success-one',
              message: '已恢复该角色所有操作权限。'
            });
          !flag && this.$message.success('停用成功');
        }
      });
    },
    handleClose() {
      if (this.action === 'edit2') {
        this.handleBack();
      }
    },
    sortChange() {},
    submitEdit() {},
    handleCurrentChange(val) {
      this.page.pageNow = val;
      this.initData();
    },
    async handleSave() {
      // 红色警告
      if (this.permissionList[1].type && !this.permissionList[1].children.some(item => item.type)) {
        return (this.permissionList[1].isShowWarn = true);
      }
      this.cardLoading = true;
      this.formatData();
      console.log(this.rolePermission);
      // const {
      //   data: { data: res, success, msg }
      // } = await updateRolePermission({
      //   roleId: this.roleId,
      //   permissionIdList: this.checkedPermission
      // });
      this.$message({
        type: 'success',
        customClass: 'el-icon-success-one',
        message: '已成功保存该角色的操作权限'
      });
      this.cardLoading = false;
      this.handleBack();
    },
    handleBack() {
      this.level = true;
      this.roleId = '';
      this.action = 'edit1';
      this.permissionList = JSON.parse(JSON.stringify(permissionList));
    },
    formatDataZero(data) {
      const { funPerms, dataPerm, defaultPerm } = data;
      this.rolePermission = rolePermission;
      for (const key in this.permissionList) {
        if (Number(key) === 0) {
          this.permissionList[key].type = funPerms[key].type;
          this.permissionList[key].children[0].type = funPerms[key].child[0].type;
        } else if (Number(key) === 1) {
          this.permissionList[key].type = funPerms[key].type;
          const children = this.permissionList[key].children;
          children.forEach((item, index) => {
            item.type = funPerms[Number(key) + 1 + Number(index)].type;
          });
        } else {
          this.permissionList[this.permissionList.length - 1].type =
            funPerms[funPerms.length - 1].type;
        }
      }
      this.dataPerm = Array.isArray(this.dataPerm) ? dataPerm : dataPerm[0];
    },
    formatData() {
      const { funPerms, defaultPerm } = this.rolePermission;
      this.rolePermission.dataPerm = Array.isArray(this.dataPerm) ? this.dataPerm : [this.dataPerm];
      for (const key in this.permissionList) {
        const originVal = this.permissionList[key];
        if (Number(key) === 0) {
          if (originVal.type !== funPerms[key].type) {
            funPerms[key].type = originVal.type;
            this.permissionList[key].reflect.forEach(reflectItem => {
              defaultPerm.find(item => item.pathName === reflectItem).type = originVal.type;
            });
          }
          funPerms[key].child[0].type = originVal.children[0].type;
        } else if (Number(key) === 1) {
          funPerms[key].type = originVal.type;
          const children = originVal.children;
          children.forEach((item, index) => {
            if (item.title === '流程管理') {
              if (item.type !== funPerms[Number(key) + 1 + Number(index)].type) {
                funPerms[Number(key) + 1 + Number(index)].type = item.type;
                item.reflect.forEach(reflectItem => {
                  defaultPerm.find(item => item.pathName === reflectItem).type = item.type;
                });
              }
            } else {
              funPerms[Number(key) + 1 + Number(index)].type = item.type;
            }
          });
        } else if (Number(key) === this.permissionList.length - 1) {
          console.log(originVal);
          if (originVal.type !== funPerms[funPerms.length - 1].type) {
            funPerms[funPerms.length - 1].type = originVal.type;
          }
        }
      }
    },
    handleChecked() {},
    handleSubmitLimitTime() {},
    handleReturn() {
      this.action = 'edit2';
      this.$refs.confirmation.dialogVisible = true;
    },
    handleCheckBoxChange(item) {
      item.isShowWarn = false;
      if (!item.type && item?.children?.length) {
        item.children.forEach(item => (item.type = ''));
      }
    },
    handleRadioChange(value, data, origin) {
      data.type = value === data.type ? '' : value;
      origin.type = origin.children.some(item => item.type) ? 'view' : '';
      origin.isShowWarn = false;
    }
  }
};
</script>

<style lang="less" scoped>
@color1: #1d2128;
.rolePermission {
  height: 100%;
  overflow: hidden;
  font-size: 14px;
  color: #1d2128;
  .el-button--text {
    padding: 5px;
  }
  .top {
    display: flex;
    height: 50px;
    margin: 0 -24px;
    padding: 0 24px;
    border-bottom: 1px solid #e5e6eb;
    .top-back {
      cursor: pointer;
      &:hover {
        font-weight: 700;
      }
    }
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
    padding: 24px 0 0;
    height: calc(100% - 50px);
    overflow-y: auto;
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
        padding: 12px 16px;
        background-color: #f7f8fa;
        border-radius: 8px;

        .con-top {
          font-weight: 700;
          line-height: 22px;
          color: #1d2128;
          .con-main {
            margin: 12px 0;
            padding: 0 24px;
            .con-main-item {
              display: flex;
              justify-content: space-between;
              margin: 0 -24px;
              padding: 12px 24px;
              border-top: 1px dotted #e5e6eb;

              &:last-child {
                border-bottom: 1px dotted #e5e6eb;
              }
              .item-left {
                min-width: 100px;
                margin-right: 40px;
                .warn {
                  display: flex;
                  padding-top: 16px;
                  line-height: 20px;
                  font-size: 12px;
                  font-weight: normal;
                  color: #eb5757;
                  .right-icon {
                    margin-right: 6px;
                  }
                }
                .el-checkbox__input {
                  .el-checkbox__inner {
                    width: 20px;
                    height: 20px;
                    &::after {
                      left: 6px;
                      height: 11px;
                    }
                  }
                }
                .el-checkbox__label {
                  color: #1d2128;
                  font-weight: 700;
                }
              }
              .item-right {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                &-item {
                  width: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 0 24px;
                  &:not(:last-child):nth-child(n + 3) {
                    padding-top: 16px;
                  }
                  &:nth-child(2n) {
                    border-left: 1px solid #e5e6eb;
                  }
                  & > p {
                    font-weight: normal;
                  }
                  .el-radio {
                    &:focus {
                      .el-radio__inner {
                        box-shadow: 0 0 0 0;
                      }
                    }
                  }
                }
              }
            }
          }
          .title {
            line-height: 22px;
            &-item {
              margin-right: 8px;

              &:nth-child(2) {
                font-size: 12px;
                font-weight: normal;
              }
            }
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
  /deep/.is-checked {
    .el-radio__label {
      color: #1d2128;
    }
  }
}



</style>