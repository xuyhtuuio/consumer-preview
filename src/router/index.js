import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/index'
import request from '@/api/request'
import Qs from 'qs'
import { editThePermissionsPage } from '@/api/admin/role'
Vue.use(Router);

const viewport = {
  content: 'width=device-width, initial-scale=1.0, user-scalable=no'
}
// meta: { title: '新增详情' ,viewport: viewport ,pTitle: "首页",pPath: "/home"}
const router = new Router({
  // mode: 'history',
  mode: 'history',
  base: __dirname,
  routes: [
    // {
    //   path: '/',
    //   redirect: '/applycenter'
    // },
    {
      path: '/',
      name: 'homePage',
      meta: {
        title: '',
      },
      redirect: '/front',
      component: () => import('@/views/front/home'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login'),
      meta: { title: '消保管控平台', viewport }
    },
    {
      path: '/show-review',
      name: 'showReview',
      component: () => import('@/views/front/show-review'),
    },
    // 后台管理
    {
      path: '/admin/manage',
      name: 'manage',
      component: () => import('@/views/admin/manage/index'),
      meta: { title: '后台管理', viewport },
      redirect: '/admin/manage/flowManage',
      children: [
        {
          path: 'userManage',
          name: 'UserManage',
          component: () => import('@/views/admin/manage/userManage'),
          meta: { title: '用户管理' }
        },
        {
          path: 'rolePermission',
          name: 'RolePermission',
          component: () => import('@/views/admin/manage/rolePermission'),
          meta: { title: '角色/权限' }
        },
        {
          path: 'flowManage',
          name: 'FlowManage',
          component: () => import('@/views/admin/manage/flowManage'),
          meta: { title: '用户管理' }
        },
        {
          path: 'formManage',
          name: 'FormManage',
          component: () => import('@/views/admin/manage/formManage'),
          meta: { title: '表单管理' }
        },
        {
          path: 'labelManage',
          name: 'LabelManage',
          component: () => import('@/views/admin/manage/labelManage'),
          meta: { title: '标签管理' }
        },
        {
          path: 'opinionManage',
          name: 'OpinionManage',
          component: () => import('@/views/admin/manage/opinionManage-1.0'),
          meta: { title: '意见管理' }
        },
        {
          path: 'opinionManage-1.0',
          name: 'OpinionManageOne',
          component: () => import('@/views/admin/manage/opinionManage-1.0'),
          meta: { title: '意见管理' }
        }
      ]
    },
    // 工作流设计
    {
      path: '/admin/design',
      name: 'design',
      component: () => import('@/views/admin/FormProcessDesign'),
      meta: { title: '表单流程设计', viewport },
      redirect: '/admin/design/baseSetting',
      children: [
        {
          path: 'baseSetting',
          name: 'baseSetting',
          component: () => import('@/views/admin/layout/FormBaseSetting'),
          meta: { title: '基础信息' }
        },
        // {
        //   path: "formSetting",
        //   name: "formSetting",
        //   component: () => import("@/views/admin/layout/FormDesign"),
        //   meta: { title: '表单设计' }
        // },
        {
          path: 'processDesign',
          name: 'processDesign',
          component: () => import('@/views/admin/layout/ProcessDesign'),
          meta: { title: '审批流程' }
        }, {
          path: 'proSetting',
          name: 'proSetting',
          component: () => import('@/views/admin/layout/FormProSetting'),
          meta: { title: '扩展设置' }
        }
      ]
    },
    // 智能回检
    {
      path: '/recheck',
      name: 'recheck',
      component: () => import('@/views/intelligent-recheck/home'),
      meta: { title: '智能回检', viewport },
      redirect: '/recheck/recheck-index',
      children: [
        {
          path: 'recheck-index',
          name: 'recheck-index',
          component: () => import('@/views/intelligent-recheck/index'),
          meta: {
            title: '智能回检'
          }
        },
        {
          path: 'recheck-detail',
          name: 'recheck-detail',
          component: () => import('@/views/intelligent-recheck/detail'),
          meta: {
            title: '回检列表'
          }
        },
        {
          path: 'recheck-record',
          name: 'recheck-record',
          component: () => import('@/views/intelligent-recheck/record'),
          meta: {
            title: '回检记录'
          }
        }
      ]
    },
    {
      path: '/applycenter',
      name: 'applycenter',
      component: () => import('@/views/applycenter/home'),
      meta: { title: '申请中心', viewport },
      redirect: '/applycenter/apply-list',
      children: [
        {
          path: 'apply-list',
          name: 'apply-list',
          component: () => import('@/views/applycenter/index'),
          meta: { title: '申请中心', }
        },
        {
          path: 'details',
          name: 'details',
          component: () => import('@/views/applycenter/details'),
          meta: { title: '申请单详情', }
        },
        {
          path: 'addApply',
          name: 'addApply',
          component: () => import('@/views/front/addApply'),
          parent: '/home',
          meta: { title: '新的申请', viewport, pTitle: '申请中心' }
        },
        {
          path: 'editApply',
          name: 'editApply',
          component: () => import('@/views/front/addApply'),
          parent: '/home',
          meta: { title: '编辑申请', viewport, pTitle: '申请中心' }
        }
      ]
    },
    {
      path: '/approvalcenter',
      name: 'approvalcenter',
      component: () => import('@/views/approvalCenter/home'),
      meta: { title: '审批中心', viewport },
      redirect: '/approvalcenter/approval-list',
      children: [
        {
          path: 'approval-list',
          name: 'approval-list',
          component: () => import('@/views/approvalCenter/index'),
          meta: { title: '审批中心', }
        },
        {
          path: 'approval-details',
          name: 'approval-details',
          component: () => import('@/views/approvalCenter/details'),
          meta: { title: '申请单详情', }
        }, {
          path: 'aiApproval',
          name: 'aiApproval',
          component: () => import('@/views/aiApproval/index'),
          meta: { title: '智能审批', viewport }
        }, {
          path: 'compare',
          name: 'compare',
          component: () => import('@/views/approvalCenter/text-compare'),
          meta: { title: '线上对比', viewport }
        },
      ]
    },
    {
      path: '/statistical-center',
      name: 'statistical-center',
      component: () => import('@/views/statistical-center/index'),
      meta: { title: '统计中心', viewport },
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: () => import('@/views/knowledge/index'),
      meta: { title: '知识库', viewport },
      redirect: '/knowledge/collectKnowledge',
      children: [
        {
          path: 'rulesBase',
          name: 'RulesBase',
          component: () => import('@/views/rules-base/index'),
          meta: { title: '法规库', viewport },
        },
        {
          path: 'rulesDetail',
          name: 'RulesDetail',
          meta: { title: '法规详情页', viewport },
          component: () => import('@/views/rules-base/detail'),
        },
        {
          path: 'collectKnowledge',
          name: 'CollectKnowledge',
          meta: { title: '知识库', viewport },
          component: () => import('@/views/knowledge/collectKnowledge'),
        }
      ]
    },

    {
      path: '/front',
      name: 'front',
      component: () => import('@/views/front/index'),
      meta: { title: '消保管控平台', viewport },
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/front/home'),
          meta: { title: '首页', viewport },
        },
      ]
    },
    {
      path: '/productmap',
      name: 'productmap',
      component: () => import('@/views/product-map/index'),
      meta: { title: '产品图谱', viewport },
    },
    {
      path: '/person-center',
      name: 'personCenter',
      component: () => import('@/views/personCenter/index'),
      meta: { title: '人员中心', viewport },
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/404'),
      meta: { title: '404', viewport }
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  await getToken()
  const auth = handleAuth(to)
  if (!auth) {
    getUserRole()
    return;
  }
  if (to.path.split('/').length > 1) {
    const data = [{ name: to.path.split('/')[1], title: to.meta.pTitle }, { name: to.path.split('/')[2], title: to.meta.title }]
    store.commit('setBreadcrumbList', data)
  }

  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.meta.content) {
    const head = document.getElementByTagName('head')
    const meta = document.createElemnet('meta')
    meta.name = 'viewport'
    meta.content = 'width=device-width, initial-scale=1.0, user-scalable=no'
    head[0].appendChild(meta)
  }
  next();
  sessionStorage.setItem('router-path', to.path)
})
// 解决报错
const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
Router.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}
// 权限处理
function handleAuth(to) {
  // 本地化持久存储
  if (!store.state?.permissionsPage?.funPerms?.length) {
    const permissionsPage = JSON.parse(window.localStorage.getItem('permissionsPage'))
    if (permissionsPage) {
      store.state.permissionsPage = permissionsPage
    }
  }
  const { permissionsPage } = store.state
  const auth = [...permissionsPage.funPerms, ...permissionsPage.defaultPerm].find(item => ((item.pathName === to.name) && item.type))
  if (auth || to.name === 'login' || to.name === '404' || to.name === 'front') {
    return true
  }
  return false
}

async function getUserRole() {
  const token = window.localStorage.getItem('AI_token')
  if (!token) {
    const newWindow = window.open('', '_self');
    if (window.location.host === '192.168.210.57:31603') {
      newWindow.location = 'http://192.168.210.57:31963/#/login?from=cpr';
    } else if (window.location.host === 'cpr.dataelite.trs.com.cn') {
      newWindow.location = 'https://dataelite.trs.com.cn/#/login?from=cpr';
    } else {
      const name = window.self === window.top ? 'login' : 'loginAuto';
      router.push({
        name,
      });
    }
    return false
  } else {
    await getPermissionsPage()
  }
  // try {
  //   const res = await request({
  //     method: 'post',
  //     url: '/cpr/oauth/check_token',
  //     contentType: 'application/x-www-form-urlencoded',
  //     data: {
  //       token
  //     },
  //     msg: false
  //   });
  //   const role = (res.data.client_id === 'cpr')
  //   console.log('role', role)
  //   if (!role) {
  // const newWindow = window.open('', '_self');
  // if (window.location.host === '192.168.210.57:31603') {
  //   newWindow.location = 'http://192.168.210.57:31963/#/login?from=cpr';
  // } else if (window.location.host === 'cpr.dataelite.trs.com.cn') {
  //   newWindow.location = 'https://dataelite.trs.com.cn/#/login?from=cpr';
  // } else {
  //   const name = window.self === window.top ? 'login' : 'loginAuto';
  //   router.push({
  //     name,
  //   });
  // }
  //     return
  //   }
  //   return role;
  // } catch {
  //   // router.push({ name: '404' })
  // }
}
// 根据传递过来的id 解析token
async function getToken() {
  // let hasToken = false
  try {
    // hasToken = false
    const searchObj = Qs.parse(window.location.search.slice(1))
    if (searchObj && searchObj.id) {
      const res = await request({
        method: 'post',
        url: `uaa/user/getToken?key=${searchObj.id}`,
        showErrorMsg: false
      })
      if (res.data.data.scope.includes('cpr')) {
        window.localStorage.setItem('AI_token', res.data.data.value)
        window.localStorage.setItem('user_name', res.data.data.user_name)
        await getPermissionsPage()
        window.location.href = window.location.href.replace(`id=${searchObj.id}`, '')
      } else {
        // hasToken = true
      }
    } else {
      // hasToken = true
    }
  } catch {
    // hasToken = true
  }
}
async function getPermissionsPage() {
  const res = await editThePermissionsPage();
  const data = res.data.data || {}
  data.funPerms = data.funPerms.filter(item => item.type)
  data.defaultPerm = data.defaultPerm.filter(item => item.type)
  store.state.permissionsPage = data
  window.localStorage.setItem('permissionsPage', JSON.stringify(data))
}

export default router;
