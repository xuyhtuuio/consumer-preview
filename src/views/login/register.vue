<template>
  <div class="register-content">
    <div class="register_btn" @click="login">登录</div>
    <div class="sub-header">
      <div class="circle"></div>
      <div class="welcome">完成企业注册，开启免费试用！</div>
    </div>
    <el-form :model="registerForm" :rules="registerRule" ref="registerForm" label-width="90px" class="login_form">
      <el-form-item label="公司" prop="entname">
        <el-input v-char v-model.trim="registerForm.entname" placeholder="请填写您的公司名称"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="user">
        <el-input v-char v-model.trim="registerForm.user" placeholder="请填写您的姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-char v-model.trim="registerForm.email" placeholder="请填写您的企业邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone" class="phone_input">
        <el-input v-char v-model.trim="registerForm.phone" placeholder="请输入您的手机号">
          <el-select v-model="areaCode" slot="prepend" placeholder="请选择" class="phone_input-select" style="width:87px;">
            <el-option v-for="(item, index) in areaCodes" :key="index" :value="item.value">
              <span style="float: left">{{ item.value }} {{ item.label }}</span>
            </el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code" class="verify_code_content">
        <el-input v-char v-model="registerForm.code" placeholder="请输入6位验证码"></el-input>
        <div class="verify_code get_code">
          <span @click="getCodeMible">{{ CodeMibleTxt }}</span>
        </div>
      </el-form-item>
      <!-- <el-form-item label="申请平台" prop="platform">
        <el-checkbox-group v-model="registerForm.platform" class="apply-platform">
          <el-checkbox v-for="item in options" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item> -->
      <el-form-item label="职务">
        <el-input v-char v-model.trim="registerForm.post" placeholder="请填写您目前的职务"></el-input>
      </el-form-item>
      <el-form-item label="需求">
        <el-input v-char v-model="registerForm.des" placeholder="请填写您的需求"></el-input>
      </el-form-item>
      <div class="service-agreement">
      <el-checkbox v-model="checkAgreement"> <span style="color:rgb(80, 89, 104)">我已阅读并同意</span> <span class="" @click="toUserAgreement">用户协议</span>
             <span style="color:rgb(80, 89, 104)"> 和 </span>
              <span @click="toPrivacypolicy">隐私政策</span></el-checkbox>
    </div>
    <p class="dash_line"></p>
      <el-form-item>
        <el-button type="text" @click="register" class="register-btn">
          免费注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      registerForm: {
        platform: []
      },
      areaCode: '+86',
      areaCodes: [
        { label: '中国大陆', value: '+86' },
        { label: '中国香港', value: '+852' },
        { label: '中国澳门', value: '+853' },
        { label: '中国台湾', value: '+886' },

      ],
      registerRule: {
        // platform: [
        //   {
        //     required: true,
        //     message: '请选择申请平台',
        //     trigger: 'change',
        //   },
        // ],
        entname: [
          {
            required: true,
            message: '请输入公司名称',
            trigger: ['blur', 'change'],
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change'],
          },
        ],
        user: [
          {
            required: true,
            message: '请输入姓名',
            trigger: ['blur', 'change'],
          },
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: ['blur', 'change'],
          },
        ],
        post: [
          {
            required: true,
            message: '请输入职务',
            trigger: ['blur', 'change'],
          },
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['blur', 'change'],
          },
          {
            validator: (rule, value, callback) => {
              if (
                /^1\d{10}$/i.test(
                  value
                ) === false
              ) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: ['blur', 'change'],
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
        ]

      },
      CodeMibleTime: 60,
      CodeMibleTimer: null,
      CodeMibleTxt: '点击发送验证码',
      checkList: [],
      checkAgreement: true,
      // options: [
      //   {
      //     value: 'trs-middle-platform',
      //     label: 'TRS智能数据标签平台',
      //   },
      //   {
      //     value: 'rwscdata',
      //     label: '数星智能风控大数据平台',
      //   },
      //   {
      //     value: 'teisdata',
      //     label: 'SAAS数星产业大脑',
      //   },
      //   {
      //     value: 'openapi',
      //     label: '数星智能API平台'
      //   }
      // ],
    }
  },
  methods: {
    // 系统内部手机号验证码
    getCodeMible() {
      return this.$message.success('目前没有注册')
      // if (!this.registerForm.phone) {
      //   return this.$message.error('请输入手机号')
      // }
      // if (this.CodeMibleTime > 0 && this.CodeMibleTime < 60) {
      //   return;
      // }
      // clearInterval(this.CodeMibleTimer);
      // this.CodeMibleTime = 60;

      // this.$http({
      //   method: 'post',
      //   contentType: 'application/x-www-form-urlencoded',
      //   url: this.$GLOBAL.uaa + 'registerValidCodeSms',
      //   data: {
      //     phone: this.registerForm.phone
      //   }
      // }).then((res) => {
      //   if (res.success) {
      //     this.CodeMibleTimer = setInterval(() => {
      //       if (this.CodeMibleTime <= 0) {
      //         this.CodeMibleTxt = '点击重新发送';
      //       } else {
      //         this.CodeMibleTxt = `剩余时间${this.CodeMibleTime}秒`;
      //         this.CodeMibleTime--;
      //       }
      //     }, 1000);
      //   }
      // }).catch(res => {
      //   if (['验证码还在有效期，请勿重复操作'].includes(res.data.msg)) {
      //     this.CodeMibleTimer = setInterval(() => {
      //       if (this.CodeMibleTime <= 0) {
      //         this.CodeMibleTxt = '点击重新发送';
      //       } else {
      //         this.CodeMibleTxt = `剩余时间${this.CodeMibleTime}秒`;
      //         this.CodeMibleTime--;
      //       }
      //     }, 1000);
      //   }
      // })
    },
    register() {
      if (!this.checkAgreement) {
        this.$emit('showAgreeDialog', true)
        return
      }
      this.registerUser()
    },
    login() {
      this.$emit('tologin', true)
      this.$refs['registerForm'].clearValidate()
      this.$refs['registerForm'].resetFields()
    },
    // 新用户注册
    registerUser() {
      return this.$message.success('目前没有注册')
      // this.$refs.registerForm.validate(async (valid) => {
      //   if (valid) {
      //     const data = {
      //       custname: this.registerForm.entname,
      //       mobile: this.registerForm.phone,
      //       mail: this.registerForm.email,
      //       position: this.registerForm.post,
      //       description: this.registerForm.des,
      //       // platform: this.registerForm.platform.join(),
      //       fullname: this.registerForm.user,
      //       smsCode: this.registerForm.code,
      //     };
      //     const res = await this.$http({
      //       method: 'post',
      //       url: this.$GLOBAL.uaa + 'user/requestTry',
      //       data
      //     })
      //     if (res.success) {
      //       this.$parent.registerSuccessdialog = true
      //       this.$parent.downtimer()
      //       // this.$emit('tologin', true)
      //       this.$refs['registerForm'].clearValidate()
      //       this.$refs['registerForm'].resetFields()
      //     }
      //   }
      // });
    },
    toPrivacypolicy() {
      const page2 = this.$router.resolve({ name: 'privacy-policy' })
      window.open(page2.href, '_blank')
    },
    toUserAgreement() {
      const page2 = this.$router.resolve({ name: 'user-agreement' })
      window.open(page2.href, '_blank')
    },

  }
}
</script>
<style lang="less" scoped>
.register-content {
  position: relative;
  padding: 32px 80px 20px 40px;
  width: 650px;
  // height: 722px;
  box-sizing: border-box;
  box-shadow: 0px 0px 10px rgba(67, 67, 67, 0.1);
  border-radius: 16px;
  background: #FFFFFF;

  .register_btn {
    position: absolute;
    right: 0;
    top: 0;
    width: 80px;
    height: 80px;
    padding-top: 12px;
    padding-right: 8px;
    text-align: right;
    z-index: 10;
    font-weight: 700;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 16px;
    line-height: 24px;
    clip-path: polygon(0px 0px, 100% 100%, 100% 0);
    color: #FFFFFF;
    border-top-right-radius: 16px;
    background: linear-gradient(90deg, #7B61FF 0%, #61A0FF 107.5%);

  }

  .sub-header {
    // display: flex;
    position: relative;
    margin-bottom: 36px;
  }

  .circle {
    position: absolute;
    background: linear-gradient(90deg, rgba(123, 97, 255, 0.2) 0%, rgba(97, 160, 255, 0.2) 107.5%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }

  .welcome {
    position: absolute;
    top: 5px;
    left: 6px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #505968;

    span {
      color: #2D5CF6;
      font-style: italic;
      transform: matrix(0.99, 0, -0.11, 1, 0, 0);
      font-family: 'Microsoft YaHei';
    }
  }

  .login_form {
    margin-right: 60px;
    margin-top: 59px;

    /deep/.el-form-item {
      margin-bottom: 16px;

      .el-form-item__label {
        padding-right: 16px;
      }

      .verify_code_content {
        position: relative;
        .verify_code {
          cursor: pointer;
          position: absolute;
          top: -25px;
          right: 16px;
          img {
            width: 140px;
            height: 50px;
          }
        }

      }

      .el-form-item__content {
        .get_code {
          top: 0;
          right: -40px;
          span {
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
            color: #2d5cf6 !important;
          }

        }

        img {
          position: absolute;
          top: 10px;
          width: 18px;
          height: 18px;
          z-index: 9999;
        }

        .pwdPic {
          cursor: pointer;
          width: 20px;
          height: 13.32px;
          position: absolute;
          right: 0px;
          top: 15px;
        }

        .register-btn {
          width: 424px;
          background: linear-gradient(90deg, #7B61FF 0%, #61A0FF 107.5%);
          border-radius: 6px;
          font-weight: 700;
          font-size: 16px;
          line-height: 24px;
          color: #FFFFFF;
        }

        .apply-platform {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          margin-bottom: -16px;

          .el-checkbox {
            width: 50%;
            margin-right: 0;
            display: flex;
            justify-self: flex-start;
            align-items: center;
            margin-bottom: 16px;

          }

          .is-checked {
            .el-checkbox__inner {
              background: #2D5CF6 !important;
              border-color: #2D5CF6 !important;
            }

            .el-checkbox__label {
              color: #595959;
              // background: #2D5CF6 !important;
              // border-color: #2D5CF6 !important;
            }
          }

        }

        .el-input {
          .el-input__inner {
            width: 437px;
          }
        }
      }

    }

    /deep/ .thiny {
      margin-bottom: 10px;

      .el-form-item__content {
        line-height: 10px;

        span {
          color: #2D5CF6;
          cursor: pointer;
        }
      }
    }
  }

  .login_form {
    .phone_input {

      // background: pink;
      /deep/ .el-input-group__prepend {
        background: #fff;
      }

      /deep/ .el-form-item__content {
        .el-input .el-input__inner {
          width: 350px !important;
        }

        .el-select .el-input .el-input__inner {
          width: 87px !important;

        }

        .el-select .el-input .el-select__caret::before {
          content: "\e78f";
        }
      }
    }
  }

  .dash_line {
    width: 100%;
    height: 1px;
    margin-top: 16px;
    margin-bottom: 12px;
    margin-left: 50px;
    border-bottom: 1px dashed #E5E6EB;
  }

  .service-agreement {
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #505968;
    cursor: default;
    padding-left: 100px;
    text-align: center;
    // position: absolute;
    // bottom: 32px;
    /deep/ .el-checkbox {
      margin-right: 12px;
    }
    /deep/ .el-checkbox {
      .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #505968 !important;
      }
    }

    /deep/ .is-checked {
      .el-checkbox__inner {
        background: #2D5CF6 !important;
        border-color: #2D5CF6 !important;
      }
    }

    span {
      color: #2D5CF6;
      cursor: pointer;
    }
  }
}
</style>
