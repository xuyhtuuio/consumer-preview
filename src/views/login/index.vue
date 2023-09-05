<template>
  <div class="unity-login">
    <div class="main">
      <!-- 登录 -->
      <div
        :class="
          crtOp !== 'register' ? 'container-noregister container' : 'container-normal container'
        "
      >
        <div class="container-top" :class="crtOp === 'register' ? 'pt52' : 'pt80'">
          <div class="left">
            <swiperContent></swiperContent>
          </div>
          <div class="right" v-if="crtOp === 'inputPhone'">
            <div class="register_btn" @click="register">注册</div>
            <div class="sub-header">
              <div class="circle"></div>
              <div class="welcome">
                欢迎使用
                <span>消保管控平台</span>
              </div>
            </div>
            <div class="login-way">
              <span
                v-for="item in loginWay"
                :key="item.key"
                :class="item.name == activeName ? 'activeName' : ''"
                @click="changeLoginWays(item)"
                >{{ item.name }}</span
              >
            </div>
            <!-- 输入手机号 -->
            <!--输入框 -->
            <div>
              <el-form :model="form" ref="form" :rules="rules">
                <el-form-item prop="phone" class="phone_input">
                  <el-input
                    v-model.trim="form.phone"
                    placeholder="请输入你的手机号"
                    maxlength="11"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    style="height: 50px"
                  >
                    <el-select v-model="areaCode" slot="prepend" placeholder="请选择">
                      <el-option
                        v-for="(item, index) in areaCodes"
                        :key="index"
                        :value="item.value"
                      >
                        <span style="float: left">{{ item.value }} {{ item.label }}</span>
                      </el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-form>
              <!-- 服务协议 -->
              <div class="service-agreement">
                <el-checkbox v-model="checked">
                  <span style="color: rgb(80, 89, 104)">我已阅读并同意</span>
                  <span class @click="toUserAgreement">用户协议</span>
                  <span style="color: rgb(80, 89, 104)">和</span>
                  <span @click="toPrivacypolicy">隐私政策</span>
                </el-checkbox>
              </div>
              <!-- 下一步 -->
              <el-button type="text" class="next" @click="next">下一步</el-button>
              <!-- <p class="no-account">没有账号，去 <span class="register">免费注册</span></p> -->
            </div>
          </div>

          <!-- 密码登录 -->
          <div class="right" v-if="crtOp === 'inputPsw'">
            <div class="register_btn" @click="register">注册</div>
            <div class="sub-header">
              <div class="circle"></div>
              <div class="welcome">
                欢迎使用
                <span>消保管控平台</span>
              </div>
            </div>
            <div class="login-way">
              <span
                v-for="item in loginWay"
                :key="item.key"
                :class="item.name == activeName ? 'activeName' : ''"
                @click="changeLoginWays(item)"
                >{{ item.name }}</span
              >
            </div>
            <!--输入框 -->
            <div>
              <el-form :model="form" ref="form" :rules="rules">
                <el-form-item prop="username">
                  <el-input
                    v-model="form.username"
                    placeholder="请输入用户名"
                    class="password-input"
                  >
                    <template slot="prepend">
                      <img src="@/assets/image/username.png" alt />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    v-model="form.password"
                    placeholder="请输入密码"
                    type="password"
                    show-password
                    class="password-input"
                  >
                    <template slot="prepend">
                      <img src="@/assets/image/password.png" alt />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="verify" v-if="firstVerCode">
                  <el-input v-model="form.verify" placeholder="点击输入验证码"></el-input>
                  <div class="verify_code">
                    <img v-if="verCode" :src="verCode" @click="verCodeChange" />
                  </div>
                </el-form-item>
              </el-form>
              <!-- 滑块验证 -->
              <!-- <div class="drag" ref="dragDiv">
              <div class="drag_bg"></div>
              <div class="drag_text">{{ confirmWords }}</div>
              <div ref="moveDiv" @mousedown="mousedownFn($event)" :class="{ 'handler_ok_bg': confirmSuccess }"
                class="handler handler_bg" style="position: absolute;top: 0px;left: 0px;">
                <img src="@/assets/image/toRight.png" alt="">
              </div>
            </div>-->
              <!-- 记住密码 -->
              <div class="remember-password">
                <el-checkbox v-model="rememberPsd">记住密码</el-checkbox>
                <span @click="forgetPsw">忘记密码?</span>
              </div>
              <div class="service-agreement">
                <el-checkbox v-model="checked">
                  <span style="color: rgb(80, 89, 104)">我已阅读并同意</span>
                  <span class @click="toUserAgreement">用户协议</span>
                  <span style="color: rgb(80, 89, 104)">和</span>
                  <span @click="toPrivacypolicy">隐私政策</span>
                </el-checkbox>
              </div>
              <!-- 下一步 -->
              <!-- <p class="no-account">没有账号，去 <span class="register" @click="register">免费注册</span></p> -->
            </div>
            <div class="pwd-login">
              <el-button type="text" class="nextPwd" @click="next">登录</el-button>
              <!-- 服务协议 -->
            </div>
          </div>
          <div class="right" v-if="crtOp === 'inputSms'">
            <!-- 返回 -->
            <span class="sms-back" @click="smsBack">&lt; 返回</span>
            <p class="input-code">输入手机号验证码</p>
            <p class="input-code-warn">
              请输入发送至
              <span>{{ form.phone | phoneFormat }}</span> 的 <span>6</span> 位验证码， 有效期 5 分钟
            </p>
            <div class="code-container">
              <div v-for="(item, index) in captchas" :key="index" class :id="'captcha0' + index">
                <input
                  v-model="item.num"
                  :id="'captcha' + index"
                  @input="inputFinash(index)"
                  @focus="adjust(index)"
                  @keydown="inputDirection(index)"
                  :class="
                    activeInput == index
                      ? 'captcha_input_box row-center activeInput'
                      : 'captcha_input_box row-center'
                  "
                  type="tel"
                  maxlength="1"
                />
              </div>
            </div>
            <div class="regain" v-if="regainShow">{{ CodeMibleTime }} 秒后可重新获取验证码</div>
            <div class="regain-code" @click="regainCode" v-if="!regainShow">重新获取验证码</div>
            <div
              class="regain-code"
              @click="changeLoginWays({ name: '账号密码', key: '1', type: 'inputPsw' })"
            >
              密码登录
            </div>
            <div class="forget-phone">
              手机号已停用?
              <span @click="findMyPwd">找回帐号</span>
            </div>

            <el-button @click="login" class="login" type="text">登录</el-button>
          </div>
          <div class="register-box" v-if="crtOp === 'register'">
            <register @showAgreeDialog="showAgreeDialog" @tologin="tologin"></register>
          </div>
          <!-- 找回密码 -->
          <div class="right" v-if="crtOp === 'forget-pwd'">
            <div class="sub-header">
              <div class="circle"></div>
              <div class="welcome">忘记密码</div>
              <div class="back-login" @click="pwdBack">
                返回登录
                <span>></span>
              </div>
            </div>
            <div class="forget_pwd">
              <el-form
                :model="changePwdform"
                ref="changePwdform"
                :rules="rules"
                label-width="90px"
                class="login_form"
              >
                <el-form-item label="手机" prop="phone" class="phone_input2">
                  <el-input v-model.trim="changePwdform.phone" placeholder="请输入你的手机号">
                    <el-select
                      v-model="areaCode"
                      slot="prepend"
                      placeholder="请选择"
                      class="phone_input-select"
                      style="width: 87px"
                    >
                      <el-option
                        v-for="(item, index) in areaCodes"
                        :key="index"
                        :value="item.value"
                      >
                        <span style="float: left">{{ item.value }} {{ item.label }}</span>
                      </el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                  <el-input
                    v-model.trim="changePwdform.code"
                    placeholder="请输入6位验证码"
                  ></el-input>
                  <div class="verify_code get_code">
                    <span @click="getCodeMible">{{ CodeMibleTxt }}</span>
                  </div>
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd" class="pwd-eye">
                  <el-input
                    v-model.trim="changePwdform.newPwd"
                    placeholder="请输入新密码"
                    type="password"
                    show-password
                  ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPwd" class="pwd-eye">
                  <el-input
                    v-model.trim="changePwdform.confirmPwd"
                    placeholder="请输入确认密码"
                    type="password"
                    show-password
                  ></el-input>
                </el-form-item>
              </el-form>
              <el-button type="text" @click="submit" class="next edit_pwd">提交</el-button>
            </div>
          </div>
        </div>
        <div :class="crtOp === 'register' ? 'container-bottom-left' : 'container-bottom'">
          <img src="@/assets/image/trs_logo.png" alt />@2022拓尔思信息技术股份有限公司 版权所有
          京ICP备11022871号-7
        </div>
      </div>
      <!-- 协议弹窗 -->
      <el-dialog
        :visible.sync="checkAgreement"
        :before-close="handleClose"
        width="500px"
        custom-class="agreeDialog"
      >
        <div slot="title" class="title"><img src="@/assets/image/tips.png" />提示</div>
        <div class="tips">
          请先同意
          <span>用户协议</span> 和
          <span>隐私政策</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="text" class="cancel" @click="checkAgreement = false">取 消</el-button>
          <el-button type="text" class="submitCheck" @click="checkAgreement = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="findPwd"
        :before-close="handleClose"
        width="500px"
        custom-class="agreeDialog"
      >
        <div slot="title" class="title"><img src="@/assets/image/tips.png" />提示</div>
        <div class="tips">
          本系统暂不支持主动找回账号，请
          <span style="font-wight: 700; color: #1d2128">联系管理员</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="text" class="cancel" @click="findPwd = false">取 消</el-button>
          <el-button type="text" class="submitCheck" @click="findPwd = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="expirydialog"
        :before-close="handleClose"
        width="600px"
        custom-class="expiryDialog"
      >
        <div class="expiry-content">
          <div>
            <img src="@/assets/image/expiry-tips.png" />
            账号已到期
          </div>
          <p>可提交申请延期，待管理员审核！</p>
          <el-input v-model="appeal" placeholder="请输入您的诉求" class="appeal-input"></el-input>
          <!-- 于 {{ expirytime }}  -->
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="text" class="cancel" @click="applicationCancel">取消</el-button>
          <el-button type="text" class="submitCheck" @click="applicationExpiry">申请延期</el-button>
        </span>
      </el-dialog>
      <!-- 提交申请成功 -->
      <el-dialog
        :visible.sync="applySuccessdialog"
        width="600px"
        custom-class="applyDialog"
        :before-close="handleClose"
      >
        <div class="expiry-content">
          <img src="@/assets/image/apply-success.png" />
          <p>已提交申请</p>
          <p>待管理员审核，请耐心等待</p>
        </div>
      </el-dialog>
      <!-- 注册申请成功 -->
      <el-dialog
        :visible.sync="registerSuccessdialog"
        width="600px"
        custom-class="registerDialog"
        :before-close="handleClose"
        :close-on-press-escape="false"
      >
        <div class="expiry-content">
          <img src="@/assets/image/expiry-tips.png" />
          <p class="register-status">待审核</p>
          <p class="register-msg">请耐心等待，账号审核通过后将发送账号信息至您的邮箱和短信</p>
          <p class="to-trs">
            <span>{{ downTime }}</span> 秒后自动跳转至
            <span>TRS数星云服务平台</span>
          </p>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { toCode, fromCode } from '@/utils/utils';
import { editThePermissionsPage } from '@/api/admin/role'
import md5 from 'js-md5';
import moment from 'moment';
// import Iframes from '@/components/iframe-send-message'
// import "swiper/dist/css/swiper.min.css";
// eslint-disable-next-line
import register from './register';
import swiperContent from './swiper';
export default {
  name: 'loginTest',
  components: { swiperContent, register },
  data() {
    // eslint-disable-next-line
    var handlePasswordCheck = (rule, value, callback) => {
      const password = this.changePwdform.newPwd;
      if (value === undefined || value === '') {
        callback(new Error('请输入确认密码'));
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次输入密码不相同，请重新输入'));
      }
      callback();
    };
    // eslint-disable-next-line
    var handleNewPasswordCheck = (rule, value, callback) => {
      if (value.length > 0 && value.length < 8) {
        callback(new Error('密码必须为8-20位包含大小写字母及数字！'));
      } else if (
        !value.match(
          /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,}$/
        )
      ) {
        callback(new Error('密码必须为8-20位包含大小写字母及数字！'));
      } else {
        callback();
      }
    };
    return {
      loginWay: [
        { name: '手机号', key: '0', type: 'inputPhone' },
        { name: '账号密码', key: '1', type: 'inputPsw' }
      ],
      activeName: '账号密码',
      phone: '',
      form: {
        verKey: '',
        username: '',
        password: '',
        verify: '',
        phone: ''
      },
      applySuccessdialog: false,
      registerSuccessdialog: false,
      firstVerCode: false,
      checkAgreement: false,
      verCode: '', // 图形验证码
      crtOp: 'inputPsw',
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^1\d{10}$/i.test(value) === false) {
                callback(new Error('请输入正确的手机号'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        verify: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: handleNewPasswordCheck, trigger: ['blur', 'change'] }
        ],
        confirmPwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: handlePasswordCheck, trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: ['blur', 'change']
          }
        ]
      },
      changePwdform: {
        phone: '',
        code: '',
        newPwd: '',
        confirmPwd: ''
      },
      platDialog: false,
      CodeMibleTimer: '',
      CodeMibleTxt: '',
      CodeMibleTime: 60,
      activeInput: 0,
      downTime: 5,
      checked: true,
      regainShow: true,
      applyInfo: {},
      appeal: '',
      captchas: [{ num: '' }, { num: '' }, { num: '' }, { num: '' }, { num: '' }, { num: '' }],
      code: '',
      confirmWords: '拖动滑块验证',
      beginClientX: 0,
      mouseMoveStata: false,
      maxwidth: '',
      confirmSuccess: false,
      expirydialog: false,
      // expirytime: '',
      userinfo: {},
      platlist: [],
      platlistBack: [],
      rememberPsd: false,
      sendMessage: {},
      env: '',
      areaCode: '+86',
      areaCodes: [
        { label: '中国大陆', value: '+86' },
        { label: '中国香港', value: '+852' },
        { label: '中国澳门', value: '+853' },
        { label: '中国台湾', value: '+886' }
      ],
      findPwd: false,
      hostArr: ['www.aikn.trs.com.cn', 'dataelite.trs.com.cn'],
      iframeSrc: [
        {
          develop: 'http://192.168.210.57:31588/404',
          prod: 'https://ib.dataelite.trs.com.cn/404',
          route: '/404',
          value: 'teisdata',
          loaded: false,
          label: '数星产业大脑'
        },
        {
          develop: 'http://192.168.210.57:30630/404',
          prod: 'https://tag.dataelite.trs.com.cn/404',
          route: '/404',
          value: 'trs-middle-platform',
          loaded: false,
          label: '数星智能标签平台'
        },
        {
          develop: 'http://192.168.210.57:31199/404',
          prod: 'https://api.dataelite.trs.com.cn/404',
          route: '/404',
          value: 'openapi',
          loaded: false,
          label: '数星API平台'
        },
        {
          // develop: 'http://localhost/rwscwebv3/loginEmpty.html',
          develop: 'http://192.168.210.57:30648/loginEmpty.html',
          prod: 'https://rm.dataelite.trs.com.cn/loginEmpty.html',
          route: '/loginEmpty.html',
          value: 'rwscdata',
          loaded: false,
          label: '数星智能风控'
        }
      ],
      iframeType: 'develop',
      gohistory: false
    };
  },
  watch: {
    checked(val) {
      if (val) {
        window.localStorage.setItem('trsUserAgree', '1');
      } else {
        window.localStorage.removeItem('trsUserAgree');
      }
    }
  },
  created() {
    this.env = process.env.NODE_ENV;
    const userName = window.localStorage.getItem('AI_name');
    const pwd = window.localStorage.getItem('AI_pwd');
    this.crtOp = this.$route.query.type || 'inputPsw';
    const trsUserAgree = window.localStorage.getItem('trsUserAgree');
    this.checked = trsUserAgree === '1';
    this.form.username = userName || '';
    if (pwd) {
      this.form.password = fromCode(pwd) || '';
      this.rememberPsd = true;
    }
    // 判断当前系统为生产或测试
    if (this.hostArr.indexOf(window.location.host) !== -1) {
      this.iframeType = 'prod';
    }
    if (this.$route.query.from && this.$route.query.from !== 'trs') {
      this.checkToken();
    }
  },
  methods: {
    findMyPwd() {
      this.findPwd = true;
    },
    tologin(val) {
      if (val) {
        const type = this.loginWay.filter(item => item.name === this.activeName);
        this.crtOp = type[0].type;
        // this.crtOp = 'inputPhone'
      }
    },
    showAgreeDialog(val) {
      this.checkAgreement = val;
    },
    register() {
      this.crtOp = 'register';
    },
    // 点击改变验证码
    verCodeChange() {
      this.codeFun();
    },
    changeLoginWays(item) {
      if (item.name === this.activeName) return;
      this.activeName = item.name;
      this.crtOp = item.name === '手机号' ? 'inputPhone' : 'inputPsw';
      this.$refs['form'].clearValidate();
    },
    // 隐私政策
    toPrivacypolicy() {
      const page2 = this.$router.resolve({ name: 'privacy-policy' });
      window.open(page2.href, '_blank');
    },
    // 用户协议
    toUserAgreement() {
      // const page2 = this.$router.resolve({ name: 'user-agreement' })
      // window.open(page2.href, '_blank')
    },
    next() {
      if (this.activeName === '手机号') {
        this.$message.success('当前只能用账号密码登录');
        /*  this.$refs['form'].validate(async valid => {
          if (valid) {
            if (!this.checked) {
              this.checkAgreement = true;
              return;
            }
            const res = await this.getCodeMible();
            if (res.success) {
              this.crtOp = 'inputSms';
              this.$nextTick(() => {
                const dom = document.getElementById('captcha' + this.activeInput);
                dom.focus();
              });
              this.activeInput = 0;
              // 获取短信验证码
              this.captchas = [
                { num: '' },
                { num: '' },
                { num: '' },
                { num: '' },
                { num: '' },
                { num: '' }
              ];
            }
          }
        }); */
      } else if (this.activeName === '账号密码') {
        this.$refs['form'].validate(async valid => {
          if (valid) {
            const _this = this;
            // 滑动滑块
            if (!this.checked) {
              this.checkAgreement = true;
              return;
            }
            try {
              const res = await this.loginByPwd();

              if (!res.access_token) {
                this.$message.error(res?.error_description);
                this.codeFun();
                return;
              }
              if (res.access_token) {
                window.localStorage.setItem('AI_name', this.form.username);
                if (this.rememberPsd === true) {
                  window.localStorage.setItem('AI_pwd', toCode(this.form.password));
                } else {
                  window.localStorage.removeItem('AI_pwd');
                }
                window.localStorage.setItem('AI_token', res.access_token);
                const userPermis = await this.getUserRole();
                window.localStorage.setItem('userPermis', JSON.stringify(userPermis));
                await this.getPermissionsPage()
                this.$message.success('登录成功');
                if (this.gohistory && this.gohistory !== '404') {
                  this.$router.go(-1);
                } else {
                  this.$router.push({ name: 'home' });
                }
                // this.sendMessage = {
                //   uni__teis_Token: res.access_token,
                //   uni__expires_in: res.expires_in
                // }
                // this.checkToken()
              }
            } catch (err) {
              if (err.data.error_description === '用户帐号已过期') {
                _this.expirydialog = true;
                return;
              }
              if (err && err.data && err.data.error === 'invalid_grant') {
                _this.$message.error(err.data.error_description);
              } else {
                _this.$message.error(err.data.error);
              }
              _this.form.verify = '';
              _this.codeFun();
            }
          }
        });
      }
    },
    async getUserRole() {
      const res = await this.$http({
        method: 'post',
        url: '/cpr/oauth/check_token',
        contentType: 'application/x-www-form-urlencoded',
        data: {
          token: window.localStorage.getItem('AI_token')
        },
        msg: false
      });
      window.localStorage.setItem('user_name', res.data.user_name)
      const role = JSON.parse(res.data.user_name).roles.filter(item => {
        return item.clientId === 'teisdata';
      });
      return role;
    },
    async getPermissionsPage() {
      // const user = JSON.parse(window.localStorage.getItem('user_name'))
      const res = await editThePermissionsPage();
      this.$store.state.permissionsPage = res.data.data || {}
      window.localStorage.setItem('permissionsPage', JSON.stringify(res.data.data))
    },
    // 判断账号是否过期
    async checkToken() {
      // 登录成功后本地存一个AI_token
      if (window.localStorage.getItem('AI_token') == null && !this.sendMessage.uni__teis_Token) {
        return;
      }
      this.sendMessage.uni__teis_Token && localStorage.setItem('AI_token', this.sendMessage.uni__teis_Token);
      this.platlistBack = [];
      this.platlist = [];
      const res = await this.$http({
        method: 'post',
        url: this.$GLOBAL.uaa + 'oauth/check_token',
        contentType: 'application/x-www-form-urlencoded',
        data: {
          token: window.localStorage.getItem('AI_token')
        }
      });
      if (res && !res.error && res.user_name) {
        this.sendMessage.uni__user_name = res.user_name;
        // 判断过期时间
        const userinfo = JSON.parse(res.user_name);
        this.userinfo = userinfo;
        // 权限申请
        const { platform, expiryTime } = userinfo;
        const routeFrom = this.$route.query.from;
        const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const diff = moment(expiryTime).diff(moment(startTime), 'seconds');
        this.platlistBack = platform ? platform.split(',') : [];
        localStorage.setItem('platlistBack', JSON.stringify(this.platlistBack));
        this.platlist = platform ? platform.split(',') : [];
        // 判断下一步是否跳转
        if (routeFrom === 'trs') {
          this.$router.push({
            name: 'homePage'
          });
        } else if (
          routeFrom
          && routeFrom !== 'trs'
          && this.platlistBack.indexOf(routeFrom) === -1
        ) {
          // 没有对应权限，需申请
          this.platlist.push(routeFrom);
          this.platDialog = true;
        } else if (expiryTime && diff <= 0) {
          // 说明过期
          this.expirydialog = true;
          // this.expirytime = expiryTime || moment().format('YYYY-MM-DD HH:mm:ss')
        } else if (
          routeFrom && !this.platDialog && !this.expirydialog && routeFrom && routeFrom !== 'trs'
        ) {
          // 未到期 & 有权限
          const plat = this.iframeSrc.filter(item => item.value === routeFrom);
          // 来源为存在平台
          if (plat.length) {
            window.opener = null;
            window.open(
              plat[0][this.iframeType].replace(plat[0].route, '') + `?id=
              ${md5.hex(window.localStorage.getItem('AI_token'))}`,
              '_self'
            );
          } else {
            this.$router.push({
              name: 'homePage'
            });
          }
        } else {
          this.$router.push({
            name: 'homePage'
          });
        }
      }
    },
    // 获取账号验证码
    async codeFun() {
      const res = await this.$http({
        url: '/cpr/captcha'
      });
      if (res.data === undefined) {
        this.$message.error('网络错误，请稍后再试');
        return;
      }
      this.verCode = res.data.data.image;
      this.firstVerCode = true;
      this.form.verKey = res.data.data.key;
    },
    // 系统内部手机号验证码
    async getCodeMible() {
      return this.$message.success('当前只能用账号密码登录');
      // if (this.crtOp === 'forget-pwd') {
      //   if (!this.changePwdform.phone) {
      //     return this.$message.error('请输入手机号');
      //   }
      // }
      // if (this.crtOp === 'inputPhone') {
      //   if (this.CodeMibleTime > 0 && this.CodeMibleTime < 60) {
      //     this.regainShow = true;
      //     this.crtOp = 'inputSms';
      //     // 获取短信验证码
      //     this.captchas = [
      //       { num: '' },
      //       { num: '' },
      //       { num: '' },
      //       { num: '' },
      //       { num: '' },
      //       { num: '' }
      //     ];
      //     return;
      //   }
      // }

      // clearInterval(this.CodeMibleTimer);
      // const data = {
      //   phone: this.crtOp === 'forget-pwd' ? this.changePwdform.phone : this.form.phone
      // };
      // let res;
      // try {
      //   res = await this.$http({
      //     method: 'post',
      //     contentType: 'application/x-www-form-urlencoded',
      //     url: this.$GLOBAL.uaa + 'validCodeSms',
      //     data
      //   });
      //   if (res.success) {
      //     this.regainShow = true;
      //     this.CodeMibleTime = 60;
      //     if (this.crtOp === 'inputPhone') {
      //       this.crtOp = 'inputSms';
      //       this.activeInput = 0;
      //       // 获取短信验证码
      //       this.captchas = [
      //         { num: '' },
      //         { num: '' },
      //         { num: '' },
      //         { num: '' },
      //         { num: '' },
      //         { num: '' }
      //       ];
      //     }

      //     this.CodeMibleTimer = setInterval(() => {
      //       // eslint-disable-next-line
      //       if (this.CodeMibleTime <= 0) {
      //         // this.CodeMibleTime=60
      //         clearInterval(this.CodeMibleTimer);
      //         if (this.crtOp === 'forget-pwd') {
      //           this.CodeMibleTxt = '点击发送验证码';
      //         }
      //         this.regainShow = false;
      //       } else {
      //         this.CodeMibleTime--;
      //         this.CodeMibleTxt = `剩余时间${this.CodeMibleTime}秒`;
      //       }
      //     }, 1000);
      //   } else if (this.crtOp === 'forget-pwd') {
      //     this.CodeMibleTxt = '点击发送验证码';
      //     this.regainShow = true;
      //     this.CodeMibleTime = 60;
      //     // this.crtOp = 'inputSms';
      //     // this.activeInput = 0;
      //     // 获取短信验证码
      //     // this.captchas = [
      //     //   { num: '' },
      //     //   { num: '' },
      //     //   { num: '' },
      //     //   { num: '' },
      //     //   { num: '' },
      //     //   { num: '' },
      //     // ]
      //   } else if (['验证码有效，请勿频繁发送'].includes(res.msg)) {
      //     this.regainShow = true;
      //     this.CodeMibleTime = 60;
      //     if (this.crtOp === 'inputPhone') {
      //       this.crtOp = 'inputSms';
      //       this.activeInput = 0;
      //       // 获取短信验证码
      //       this.captchas = [
      //         { num: '' },
      //         { num: '' },
      //         { num: '' },
      //         { num: '' },
      //         { num: '' },
      //         { num: '' }
      //       ];
      //     }
      //     this.CodeMibleTimer = setInterval(() => {
      //       // eslint-disable-next-line
      //       if (this.CodeMibleTime <= 0) {
      //         this.regainShow = false;
      //         clearInterval(this.CodeMibleTimer);
      //         if (this.crtOp === 'forget-pwd') {
      //           this.CodeMibleTxt = '点击发送验证码';
      //         }
      //       } else {
      //         this.CodeMibleTime--;
      //         this.CodeMibleTxt = `剩余时间${this.CodeMibleTime}秒`;
      //       }
      //     }, 1000);
      //   } else if (['超出单日可使用上限'].includes(res.msg)) {
      //     this.regainShow = true;
      //     this.CodeMibleTime = 60;
      //     if (this.crtOp === 'inputPhone') {
      //       this.crtOp = 'inputSms';
      //       this.activeInput = 0;
      //       // 获取短信验证码
      //       this.captchas = [
      //         { num: '' },
      //         { num: '' },
      //         { num: '' },
      //         { num: '' },
      //         { num: '' },
      //         { num: '' }
      //       ];
      //     }
      //     this.CodeMibleTimer = setInterval(() => {
      //       // eslint-disable-next-line
      //       if (this.CodeMibleTime <= 0) {
      //         this.regainShow = false;
      //         clearInterval(this.CodeMibleTimer);
      //         if (this.crtOp === 'forget-pwd') {
      //           this.CodeMibleTxt = '点击发送验证码';
      //         }
      //       } else {
      //         this.CodeMibleTime--;
      //         this.CodeMibleTxt = `剩余时间${this.CodeMibleTime}秒`;
      //       }
      //     }, 1000);
      //   }
      // } catch {
      //   if (['验证码有效，请勿频繁发送'].includes(res.msg)) {
      //     this.CodeMibleTimer = setInterval(() => {
      //       // eslint-disable-next-line
      //       if (this.CodeMibleTime <= 0) {
      //         this.regainShow = false;
      //         clearInterval(this.CodeMibleTimer);
      //         if (this.crtOp === 'forget-pwd') {
      //           this.CodeMibleTxt = '点击发送验证码';
      //         }
      //       } else {
      //         this.CodeMibleTime--;
      //         this.CodeMibleTxt = `剩余时间${this.CodeMibleTime}秒`;
      //       }
      //     }, 1000);
      //   }
      // }
    },
    smsBack() {
      this.activeName = '手机号';
      this.crtOp = 'inputPhone';
    },
    pwdBack() {
      this.$refs['changePwdform'].resetFields();
      this.$refs['changePwdform'].clearValidate();
      this.crtOp = 'inputPsw';
      this.activeName = '账号密码';
    },
    // 忘记密码提交
    submit() {
      this.$message.success('当前只能用账号密码登录');
      this.$refs['changePwdform'].validate(async () => {
        // return
        // if (valid) {
        //   const data = {
        //     code: this.changePwdform.code,
        //     password: this.changePwdform.newPwd,
        //     phone: this.changePwdform.phone,
        //     mobile: this.changePwdform.phone
        //   };
        //   const res = await this.$http({
        //     method: 'post',
        //     url: this.$GLOBAL.uaa + 'user/update',
        //     headers: {
        //       'Content-Type': 'application/json'
        //     },
        //     data
        //   });
        //   if (res.success) {
        //     this.$message.success('密码修改成功');
        //     this.pwdBack();
        //   }
        // }
      });
    },
    login() {
      const code = this.captchas.map(x => x.num).join('');
      this.code = code;
      if (this.code.length !== 6) return this.$message.error('请输入短信验证码');
      this.loginByMible();
    },
    async loginByMible() {
      const _this = this;
      try {
        const res = await this.$http({
          method: 'post',
          contentType: 'application/x-www-form-urlencoded',
          url: this.$GLOBAL.uaa + 'oauth/token',
          data: {
            username: this.form.phone,
            smscode: this.code,
            grant_type: 'sms_code',
            client_id: 'uaa',
            client_secret: 'secret'
          },
          msg: false
        });
        if (res.access_token) {
          this.$message.success('登录成功');
          this.sendMessage = {
            uni__teis_Token: res.access_token,
            uni__expires_in: res.expires_in
          };
          // this.checkToken()
        } else {
          return this.$message.error(res.error_description);
        }
      } catch (err) {
        if (
          err.data.error_description
          === '账号已到期\n可输入您的诉求并申请延期，提交后需管理员审核！'
        ) {
          _this.expirydialog = true;
          return;
        }
        if (err && err.data && err.data.error === 'invalid_grant') {
          _this.$message.error(err.data.error_description);
        } else {
          _this.$message.error(err.data.error);
        }
      }
    },
    // 登录（用户名+密码+图片验证码）
    async loginByPwd() {
      const res = await this.$http({
        method: 'post',
        url: '/cpr/oauth/token',
        contentType: 'application/x-www-form-urlencoded',
        data: {
          username: this.form.username,
          password: this.form.password,
          verKey: this.form.verKey,
          verCode: this.form.verify,
          scope: 'cpr',
          grant_type: 'password',
          client_id: 'cpr',
          client_secret: 'secret'
        },
        msg: false
      });
      return res.data;
    },
    adjust(index) {
      const dom = document.getElementById('captcha' + this.activeInput);
      if (index !== this.activeInput && dom) {
        dom.focus();
      }
    },
    // 控制前后方向
    inputDirection(index) {
      const val = this.captchas[index].num;
      // 回退键处理
      // eslint-disable-next-line
      if (event.keyCode == 8 && val == '') {
        // 重新校准
        const dom = document.getElementById('captcha' + (index - 1));
        this.activeInput = index - 1;
        if (dom) dom.focus();
      }
      // eslint-disable-next-line
      if (event.keyCode != 8 && val != '') {
        const dom = document.getElementById('captcha' + (index + 1));
        this.activeInput = index + 1;
        if (dom) dom.focus();
      }
    },
    // 输入框相互联动
    inputFinash(index) {
      const val = this.captchas[index].num;
      this.activeInput = val ? index + 1 : index - 1;
      const dom = document.getElementById('captcha' + this.activeInput);
      if (dom) dom.focus();
      if (index === this.captchas.length - 1) {
        const code = this.captchas.map(x => x.num).join('');
        if (code.length === 6) {
          this.code = code;
          // this.$emit('finish', code);
        }
      }
    },
    regainCode() {
      this.getCodeMible();
    },
    forgetPsw() {
      this.CodeMibleTimer = null;
      this.CodeMibleTime = 60;
      this.CodeMibleTxt = '点击发送验证码';
      this.crtOp = 'forget-pwd';
    },
    mousedownFn(e) {
      if (!this.confirmSuccess) {
        e.preventDefault && e.preventDefault(); // 阻止文字选中等 浏览器默认事件
        this.mouseMoveStata = true;
        this.beginClientX = e.clientX;
      }
    }, // mousedoen 事件
    successFunction() {
      this.confirmSuccess = true;
      this.confirmWords = '验证通过';
      if (window.addEventListener) {
        document.getElementsByTagName('html')[0].removeEventListener('mousemove', this.mouseMoveFn);
        document.getElementsByTagName('html')[0].removeEventListener('mouseup', this.moseUpFn);
      } else {
        document.getElementsByTagName('html')[0].removeEventListener('mouseup', () => {});
      }
      document.getElementsByClassName('drag_text')[0].style.color = '#fff';
      document.getElementsByClassName('handler')[0].style.left = this.maxwidth + 'px';
      document.getElementsByClassName('drag_bg')[0].style.width = this.maxwidth + 'px';
    }, // 验证成功函数
    mouseMoveFn(e) {
      if (this.mouseMoveStata) {
        const width = e.clientX - this.beginClientX;
        if (width > 0 && width <= this.maxwidth) {
          document.getElementsByClassName('handler')[0].style.left = width + 'px';
          document.getElementsByClassName('drag_bg')[0].style.width = width + 'px';
        } else if (width > this.maxwidth) {
          this.successFunction();
        }
      }
    }, // mousemove事件
    moseUpFn(e) {
      this.mouseMoveStata = false;
      const width = e.clientX - this.beginClientX;
      if (width < this.maxwidth) {
        document.getElementsByClassName('handler')[0].style.left = 0 + 'px';
        document.getElementsByClassName('drag_bg')[0].style.width = 0 + 'px';
      }
    }, // mouseup事件
    handleClose() {
      this.checkAgreement = false;
      this.expirydialog = false;
      this.platDialog = false;
      this.applySuccessdialog = false;
      this.findPwd = false;
      this.registerSuccessdialog = false;
      this.appeal = '';
      clearInterval(this.timer);
    },
    // 老用户申请延期
    async applicationUser() {
      const data = {
        uid: this.userinfo.id,
        platform: this.platlist.join(),
        delay: true,
        description: this.applyInfo.desc
      };
      // if (this.crtOp === 'inputPsw') {}
      const res = await this.$http({
        method: 'post',
        url: this.$GLOBAL.uaa + 'user/requestAuth',
        contentType: 'application/x-www-form-urlencoded',
        data
      });
      // 申请成功
      if (res.success) {
        this.platDialog = false;
        this.expirydialog = false;
        // 提交申请弹窗
        this.applySuccessdialog = true;
        this.downtimer();
      }
    },
    applicationCancel() {
      this.expirydialog = false;
      this.appeal = '';
    },
    async applicationExpiry() {
      const data = {
        description: this.appeal
      };
      if (this.crtOp === 'inputPsw') {
        data.username = this.form.username;
      } else {
        data.mobile = this.form.phone;
      }
      const res = await this.$http({
        method: 'post',
        url: this.$GLOBAL.uaa + 'user/requestDelay',
        contentType: 'application/x-www-form-urlencoded',
        data
      });
      if (res.status) {
        this.expirydialog = false;
        this.applySuccessdialog = true;
        this.downtimer();
      }
    },
    downtimer() {
      this.downTime = 5;
      const that = this;
      this.timer = setInterval(() => {
        if (this.downTime > 0) {
          this.downTime--;
        } else if (this.downTime === 0) {
          that.applySuccessdialog = false;
          that.registerSuccessdialog = false;
          window.open('https://dataelite.trs.com.cn/#/home-page', '_self');
          clearInterval(this.timer);
        }
      }, 1000);
    },
    keepPsd() {
      if (this.rememberPsd) {
        const data = {
          username: this.form.username,
          password: this.form.password
        };
        window.localStorage.setItem('trs_key', JSON.stringify(data));
      } else {
        window.localStorage.removeItem('trs_key');
      }
    },
    changeAreaCode(val) {
      this.areaCode = val;
    }
  },
  filters: {
    phoneFormat(val) {
      return val ? val.substring(0, 3) + '****' + val.substring(7) : '';
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (
        from
        && !['login', 'loginAuto', 'microLogin'].includes(from.name)
        && from.fullPath !== '/'
      ) {
        vm.gohistory = from.name || true;
      }
    });
  }
};
</script>
<style lang='less' scoped>
.unity-login {
  position: relative;
  background-image: url(../../assets/image/login_bgc.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: auto;
  // width: 1440px;
  height: 100vh;
  min-width: 1440px;

  // min-height: 800px;
  .main {
    margin: 64px -80px auto;
  }
  .iframe-container {
    position: absolute;
    z-index: -100;
    height: 0;
    visibility: hidden;
    left: 0;
  }
}

.container {
  position: relative;
  overflow: hidden;
  z-index: 10;
  min-height: 720px;

  .container-top {
    height: 100%;
    display: flex;
    flex-direction: row;

    .left {
      flex: 1;
      width: 300px;

      .swiper-container {
        width: 800px;
        height: 400px;
      }
    }

    .right {
      height: 614px;
      width: 488px;
      background: #fff;
      margin-right: 160px;
      margin-left: 10px;
      box-shadow: 0px 0px 10px rgba(67, 67, 67, 0.1);
      border-radius: 16px;
      padding: 32px;
      text-align: left;
      position: relative;

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
        color: #ffffff;
        border-top-right-radius: 16px;
        background: linear-gradient(90deg, #7b61ff 0%, #61a0ff 107.5%);
      }

      .sub-header {
        // display: flex;
        position: relative;
        height: 32px;
      }

      .circle {
        position: absolute;
        background: linear-gradient(
          90deg,
          rgba(123, 97, 255, 0.2) 0%,
          rgba(97, 160, 255, 0.2) 107.5%
        );
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
          color: #2d5cf6;
          font-style: italic;
          transform: matrix(0.99, 0, -0.11, 1, 0, 0);
          font-family: 'Microsoft YaHei';
        }
      }

      .back-login {
        text-align: right;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #2d5cf6;
        position: absolute;
        top: 10px;
        right: 0;
        cursor: pointer;
      }

      .login-way {
        padding-top: 52px;
        margin-bottom: 20px;

        span {
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          color: #505968;
          cursor: pointer;
        }

        span:nth-of-type(1) {
          margin-right: 32px;
        }

        .activeName {
          font-weight: 700;
          color: #2d5cf6;
          position: relative;
        }

        .activeName::after {
          position: absolute;
          left: 50%;
          bottom: -4px;
          transform: translateX(-50%);
          display: inline-block;
          content: '';
          width: 26px;
          border-bottom: 2px solid #2d5cf6;
        }
      }

      .next {
        width: 100%;
        background: linear-gradient(90deg, #7b61ff 0%, #61a0ff 107.5%);
        border-radius: 6px;
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        color: #ffffff;
        margin: 24px 0 12px;
      }

      .nextPwd {
        // position: absolute;
        // left:50%;
        // transform: translateX(-50%);
        // bottom:208px;
        width: 100%;
        background: linear-gradient(90deg, #7b61ff 0%, #61a0ff 107.5%);
        border-radius: 6px;
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        color: #ffffff;
        margin: 10px 0 12px;
        // width: 424px;
      }

      .pwd-login {
        // position: absolute;
        width: 424px;
        // bottom: 40px;
        margin-top: 42px;
      }

      .edit_pwd {
        margin-top: 180px;
      }

      .phone_input {
        /deep/ .el-input__inner {
          height: 50px;
        }

        /deep/ .el-input-group__prepend {
          background: #fff;
          width: 87px;
        }

        /deep/ .el-select .el-input .el-select__caret::before {
          content: '\e78f';
          // position: absolute;
          // width: 100%;
          // height: 100%;
          // top: 50%;
          // left: 50%;
          // transform: translate(-50%, -50%);
        }
      }

      .login_form {
        margin-top: 60px;

        /deep/.el-form-item {
          margin-bottom: 22px;

          .el-form-item__label {
            padding-right: 16px;
          }

          .el-form-item__content {
            position: relative;

            .verify_code {
              cursor: pointer;
              position: absolute;
              top: -25px;
              right: 137px;

              img {
                width: 140px;
                height: 50px;
              }
            }

            .service-agreement {
              font-weight: 400;
              font-size: 14px;
              line-height: 22px;
              color: #505968;
              cursor: default;
              text-align: left;

              .el-checkbox {
                margin-right: 12px;
              }

              .is-checked {
                .el-checkbox__inner {
                  background: #2d5cf6 !important;
                  border-color: #2d5cf6 !important;
                }
              }
              /deep/ .el-checkbox {
                .el-checkbox__input.is-checked + .el-checkbox__label {
                  color: #505968 !important;
                }
              }

              span {
                color: #2d5cf6;
                cursor: pointer;
              }
            }

            .get_code {
              top: 0;
              right: 16px;

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
                  background: #2d5cf6 !important;
                  border-color: #2d5cf6 !important;
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
                width: 331px;
              }
            }
          }
        }
      }

      .login_form {
        .phone_input2 {
          /deep/ .el-input-group__prepend {
            background: #fff;
          }

          /deep/ .el-form-item__content {
            .el-input .el-input__inner {
              width: 247px !important;
            }

            .el-select .el-input .el-input__inner {
              width: 87px !important;
            }

            .el-select .el-input .el-select__caret::before {
              content: '\e78f';
            }
          }
        }
      }

      .no-account {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #505968;
        text-align: center;

        .register {
          color: #2d5cf6;
          cursor: pointer;
        }
      }

      .line {
        position: absolute;
        border-bottom: 1px dashed #e5e6eb;
        width: 88%;
        bottom: 66px;
      }

      .dash_line {
        width: 100%;
        height: 1px;
        margin-top: 32px;
        border-bottom: 1px dashed #e5e6eb;
      }

      .service-agreement {
        text-align: left;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #505968;
        cursor: default;
        margin-top: 12px;

        /deep/ .el-checkbox {
          margin-right: 12px;
        }

        /deep/ .is-checked {
          .el-checkbox__inner {
            background: #2d5cf6;
            border-color: #2d5cf6;
          }
        }

        span {
          color: #2d5cf6;
          cursor: pointer;
        }
      }

      .sms-back {
        cursor: pointer;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #505968;
      }

      .input-code {
        margin-top: 32px;
        font-weight: 700;
        font-size: 20px;
        line-height: 28px;
        color: #505968;
        margin-bottom: 16px;
      }

      .input-code-warn {
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #505968;

        span {
          font-weight: 700;
        }
      }

      .code-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 32px;
      }

      .row-center {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }

      .captcha_input_wrapper {
        width: 100%;
      }

      .captcha_input_box {
        width: 50px;
        height: 50px;
        margin-right: 18px;
        background: rgba(255, 255, 255, 1);
        border-radius: 6px;
        border: 1px solid #cacdd3;
        font-size: 28px;
        text-align: center;
        color: #1e243a;
      }

      .activeInput {
        border: 1px solid #5784ff;
      }

      #captcha02 {
        margin-right: 48px;
        position: relative;

        .captcha_input_box {
          margin-right: 0px;
        }
      }

      #captcha05 {
        .captcha_input_box {
          margin-right: 0px;
        }
      }

      #captcha02::after {
        right: -24px;
        top: 25px;
        position: absolute;
        display: inline-block;
        content: '';
        width: 12px;
        height: 1px;
        border-bottom: 1px solid #86909c;
      }

      .regain {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #505968;
        margin: 24px 0 16px;
        cursor: default;
      }

      .regain-code {
        display: inline-block;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #2d5cf6;
        margin-top: 16px;
        cursor: pointer;
      }

      .forget-phone {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #505968;
        cursor: default;
        margin-top: 16px;

        span {
          color: #2d5cf6;
          cursor: pointer;
        }
      }

      .login {
        margin-top: 114px;
        background: linear-gradient(90deg, #7b61ff 0%, #61a0ff 107.5%);
        border-radius: 6px;
        width: 424px;
        height: 48px;
        font-weight: 700;
        font-size: 16px;
        line-height: 48px;

        .el-button {
          color: #ffffff;
        }

        line-height: 24px;
        text-align: center;
        color: #ffffff;
      }

      /deep/ .password-input {
        .el-input__inner {
          border: 1px solid #cacdd3;
          border-left: none;
          height: 50px;
        }

        .el-input-group__prepend {
          background: none;
          padding: 0 16px;
          border: 1px solid #cacdd3;
          border-right: none;

          img {
            width: 18px;
            height: 18px;
          }
        }
      }

      .drag {
        position: relative;
        background: #fafafa;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border: 1px solid #a8c5ff;
        box-sizing: content-box;
        border-radius: 6px;
        overflow: hidden;
      }

      .handler {
        width: 50px;
        height: 50px;
        border-radius: 0px 6px 6px 0px;
        cursor: move;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
          linear-gradient(90deg, #7b61ff 0%, #61a0ff 107.5%);

        img {
          width: 24px;
          height: 24px;
        }
      }

      .drag_bg {
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
          linear-gradient(90deg, #7b61ff 0%, #61a0ff 107.5%);
        height: 50px;
        width: 0px;
      }

      .drag_text {
        position: absolute;
        top: 0px;
        width: 100%;
        text-align: center;
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        -o-user-select: none;
        -ms-user-select: none;
      }

      .remember-password {
        margin: 16px 0 16px;
        display: flex;
        justify-content: space-between;

        /deep/ .el-checkbox {
          .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #1d2128 !important;
          }

          .is-checked {
            .el-checkbox__inner {
              background: #2d5cf6;
              border-color: #2d5cf6;
            }
          }
        }

        span {
          font-weight: 400;
          font-size: 12px;
          line-height: 20px;
          color: #2d5cf6;
          cursor: pointer;
        }
      }
    }
  }

  .container-bottom {
    // position: fixed;
    position: absolute;
    bottom: 10px;
    left: 50%;
    // display: flex;
    // justify-content: center;
    // margin-top: 60px;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: #88909b;
    transform: translate(-50%);
    display: flex;
    align-items: center;

    img {
      width: 60px;
      height: 15px;
      margin-right: 6px;
    }
  }

  .container-bottom-left {
    position: absolute;
    // position: fixed;
    bottom: 22px;
    left: 25%;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: #88909b;
    transform: translate(-50%);
    display: flex;
    align-items: center;

    img {
      width: 60px;
      height: 15px;
      margin-right: 6px;
    }
  }

  .register-box {
    margin-right: 80px;
    margin-left: 10px;
  }
}

.container-normal {
  min-height: 720px;
}

/deep/ .el-form {
  .el-form-item__content {
    position: relative;
  }

  .verify_code {
    cursor: pointer;
    position: absolute;
    top: -2px;
    right: 4px;

    img {
      width: 104px;
      height: 30px;
    }
  }
}

/deep/ .agreeDialog {
  border-radius: 10px;
  height: 160px;

  .el-dialog__header {
    text-align: left;
    font-weight: 700;
    font-size: 16px;
    line-height: 28px;
    color: #1d2128;

    .title {
      display: flex;
      align-items: center;
    }

    img {
      width: 24px;
      height: 24px;
      margin-right: 9px;
    }
  }

  .el-dialog__body {
    padding: 0;
  }

  .tips {
    margin-top: 10px;
    padding-left: 55px;
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #1d2128;

    span {
      color: #2d5cf6;
    }
  }

  .dialog-footer {
    .cancel {
      border: 1px solid #e5e6eb;
      border-radius: 4px;
      background: #ffffff;
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
      color: #1d2128;
      padding: 6px 16px;
    }

    .submitCheck {
      border: 1px solid #e5e6eb;
      border-radius: 4px;
      background: #2d5cf6;
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
      color: #ffffff;
      padding: 6px 16px;
    }
  }
}

/deep/ .expiryDialog {
  padding-bottom: 40px;
  background-image: url(../../assets/image/yq_bgc.png);
  background-size: 100% 142px;
  background-repeat: no-repeat;
  cursor: default;

  .expiry-content {
    div {
      display: flex;
      align-items: center;
      font-weight: 700;
      font-size: 20px;
      line-height: 28px;
      color: #1d2128;
      justify-content: center;

      img {
        width: 32px;
        height: 32px;
        margin-right: 10px;
      }
    }

    p {
      margin-top: 23px;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      color: #1d2128;

      span {
        font-weight: 700;
        color: #2d5cf6;
      }
    }

    .el-input {
      .el-input__inner {
        width: 455px;
        margin: 36px 0;
        margin-bottom: 6px;
        font-size: 14px;
      }
    }
  }

  .el-dialog__footer {
    padding: 0 !important;
  }

  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    .cancel {
      border: 1px solid #e5e6eb;
      border-radius: 4px;
      background: #ffffff;
      font-weight: 400;
      font-size: 14px;
      color: #1d2128;
      width: 140px;
    }

    .submitCheck {
      background: #2d5cf6;
      border-radius: 4px;
      width: 140px;
      font-weight: 700;
      font-size: 14px;

      color: #ffffff;
    }
  }
}

/deep/ .platDialog {
  .el-dialog__header {
    padding: 40px 0 20px;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: italic;

    img {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }

    span {
      font-weight: 700;
      font-size: 24px;
      line-height: 32px;
      color: #505968;
      font-style: italic;

      i {
        color: #2d5cf6;
        font-style: italic;
      }
    }
  }

  .expiry-content {
    .sub-header {
      // display: flex;
      position: relative;
      margin-bottom: 36px;
    }

    .circle {
      position: absolute;
      background: linear-gradient(
        90deg,
        rgba(123, 97, 255, 0.2) 0%,
        rgba(97, 160, 255, 0.2) 107.5%
      );
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
        color: #2d5cf6;
        font-style: italic;
        transform: matrix(0.99, 0, -0.11, 1, 0, 0);
        font-family: 'Microsoft YaHei';
      }
    }
  }

  .el-dialog__body {
    position: relative;
    top: -40px;
  }

  .choose-content {
    position: relative;
    top: 40px;

    .el-checkbox {
      position: relative;
      width: 171px;
      height: 184px;
      box-shadow: 0px 0px 10px rgba(67, 67, 67, 0.1);
      border-radius: 6px;
      margin-right: 7px;
      box-sizing: border-box;
      border: 1px solid transparent;
      background: linear-gradient(90deg, #f8fafe 0%, #f9f9f9 100%);

      img {
        width: 147px;
        height: 89px;
        position: absolute;
        top: -130%;
        left: 50%;
        transform: translateX(-50%);
      }

      .el-checkbox__input {
        position: absolute;
        right: 12px;
        top: 12px;
      }

      .el-checkbox__label {
        position: absolute;
        top: 100px;
        left: 0;

        .desc {
          text-align: left;
          width: 150px;

          p:nth-of-type(1) {
            color: #1d2128;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            margin-bottom: 8px;
          }

          p:nth-of-type(2) {
            width: 80%;
            color: #1d2128;
            font-weight: 400;
            font-size: 12px;
            line-height: 20px;
            word-break: break-all;
            white-space: break-spaces;
          }
        }
      }
    }

    .is-checked {
      box-sizing: border-box;
      border: 1px solid #5784ff;
      background: linear-gradient(90deg, #f8fafe 0%, #f9f9f9 100%);

      img {
        width: 147px;
        height: 89px;
        position: absolute;
        top: -130%;
        left: 50%;
        transform: translateX(-50%);
      }

      .el-checkbox__input {
        border: none;

        .el-checkbox__inner {
          background: #2d5cf6;
        }
      }
    }

    .is-disabled {
      border: none;

      .el-checkbox__input {
        border: none;

        .el-checkbox__inner {
          background: #86909c;
        }
      }
    }
  }

  .el-form {
    position: relative;
    top: 54px;
    margin: 16px 0 50px;

    .el-input__inner {
      width: 676px;
    }
  }

  .el-dialog__footer {
    text-align: center;
  }

  .dialog-footer {
    .submitCheck {
      border: 1px solid #e5e6eb;
      border-radius: 4px;
      background: #2d5cf6;
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
      color: #ffffff;
      padding: 6px 16px;
    }
  }
}

/deep/ .applyDialog {
  height: 260px;

  .expiry-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      width: 26px;
      height: 26px;
      margin-bottom: 10px;
    }

    p:nth-of-type(1) {
      font-weight: 700;
      font-size: 16px;
      line-height: 28px;
      color: #1d2128;
      margin-bottom: 8px;
    }

    p:nth-of-type(2) {
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      color: #1d2128;

      span {
        color: #2d5cf6;
      }
    }
  }
}
/deep/ .registerDialog {
  background: #fff;
  height: 260px;
  background-image: url(../../assets/image/register_success.png);
  background-size: 600px 146px;
  background-repeat: no-repeat;
  box-shadow: 0px 0px 10px rgba(67, 67, 67, 0.1);
  border-radius: 10px;
  .expiry-content {
    img {
      width: 35px;
      height: 35px;
    }
    .register-status {
      color: #1d2128;
      font-weight: 700;
      font-size: 20px;
      line-height: 28px;
      margin: 15px 0 12px;
    }
    .register-msg {
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      color: #1d2128;
    }
    .to-trs {
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      color: #1d2128;
      span {
        color: #2d5cf6;
      }
    }
  }
}
</style>
