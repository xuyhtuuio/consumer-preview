/*
  * 权限配置说明
    code是数组,能找到配置code,则说明存在权限控制，无则说明  任何人可访问，code会向上查找，父路由存在，则子路由通用存在
    父路由若无  单独控制权限，则 需 父路由的code需要包含子路由所有权限code
    code 需要与  后端库中对应权限code一致
 */
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import { editThePermissionsPage } from '@/api/admin/role'
Vue.use(Router)

const viewport = {
  content: 'width=device-width, initial-scale=1.0, user-scalable=no'
}
const router = new Router({
  mode: 'hash',
  base: __dirname,
  routes: [
    {
      path: '/',
      redirect: '/applycenter'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login'),
      meta: { title: '消保管控平台', viewport }
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: () => import('@/views/front/privacy-policy'),
      meta: {
        title: '隐私政策'
      }
    },
    {
      path: '/user-agreement',
      name: 'user-agreement',
      component: () => import('@/views/front/user-agreement'),
      meta: {
        title: '用户协议'
      }
    },
    // 后台管理
    {
      path: '/admin/manage',
      name: 'manage',
      component: () => import('@/views/admin/manage/index'),
      meta: { code: ['backManagement'], title: '后台管理', viewport },
      children: [
        {
          path: 'userManage',
          name: 'UserManage',
          component: () => import('@/views/admin/manage/userManage'),
          meta: { code: ['userManagement'], title: '用户管理' }
        },
        {
          path: 'rolePermission',
          name: 'RolePermission',
          component: () => import('@/views/admin/manage/rolePermission'),
          meta: { code: ['rolePermManagement'], title: '角色/权限' }
        },
        {
          path: 'flowManage',
          name: 'FlowManage',
          component: () => import('@/views/admin/manage/flowManage'),
          meta: { code: ['flowableManagement'], title: '流程管理' }
        },
        {
          path: 'formManage',
          name: 'FormManage',
          component: () => import('@/views/admin/manage/formManage'),
          meta: { code: ['formManagement'], title: '表单管理' }
        },
        {
          path: 'labelManage',
          name: 'LabelManage',
          component: () => import('@/views/admin/manage/labelManage'),
          meta: { code: ['tagManagement'], title: '标签管理' }
        },
        {
          path: 'opinionManage',
          name: 'OpinionManage',
          component: () => import('@/views/admin/manage/opinionManage-1.0'),
          meta: { code: ['opinionManagement'], title: '意见管理' }
        },
        {
          path: 'opinionManage-1.0',
          name: 'OpinionManageOne',
          component: () => import('@/views/admin/manage/opinionManage-1.0'),
          meta: { code: ['opinionManagement'], title: '意见管理' }
        }
      ]
    },
    // 工作流设计
    {
      path: '/admin/design',
      name: 'design',
      component: () => import('@/views/admin/FormProcessDesign'),
      meta: { code: ['flowableManagement'], title: '表单流程设计', viewport },
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
        },
        {
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
      meta: { code: ['recheckIndex'], title: '智能回检', viewport },
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
            title: '回检列表',
            // keepAlive: true
          }
        },
        {
          path: 'recheck-record',
          name: 'recheck-record',
          component: () => import('@/views/intelligent-recheck/record'),
          meta: {
            title: '回检记录'
          }
        },
        {
          path: 'recheck-compare',
          name: 'recheck-compare',
          component: () => import('@/views/intelligent-recheck/compare-detail'),
          meta: {
            title: '回检对比'
          }
        }
      ]
    },
    // 申请中心
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
          meta: { title: '申请中心' }
        },
        {
          path: 'details',
          name: 'details',
          component: () => import('@/views/applycenter/details'),
          meta: { title: '申请单详情' }
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
    // 审批中心
    {
      path: '/approvalcenter',
      name: 'approvalcenter',
      component: () => import('@/views/approvalCenter/home'),
      meta: { code: ['approvalCenter'], title: '审批中心', viewport },
      redirect: '/approvalcenter/approval-list',
      children: [
        {
          path: 'approval-list',
          name: 'approval-list',
          component: () => import('@/views/approvalCenter/index'),
          meta: { title: '审批中心' }
        },
        {
          path: 'approval-details',
          name: 'approval-details',
          component: () => import('@/views/approvalCenter/details'),
          meta: { title: '申请单详情', }
        },
        {
          path: 'aiApproval',
          name: 'aiApproval',
          component: () => import('@/views/aiApproval/index'),
          meta: { title: '智能审批', viewport }
        },
        // OCR重构页
        {
          path: 'aiApprovalNew',
          name: 'aiApprovalNew',
          component: () => import('@/views/aiApprovalNew/index'),
          meta: { title: '智能审批', viewport }
        },
        {
          path: 'compare',
          name: 'compare',
          component: () => import('@/views/approvalCenter/text-compare'),
          meta: { title: '线上对比', viewport }
        }
      ]
    },
    // 统计中心
    {
      path: '/statistical-center',
      name: 'statistical-center',
      component: () => import('@/views/statistical-center/index'),
      meta: { code: ['statisticsCenter'], title: '统计中心', viewport }
    },
    // 首页
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
          meta: { title: '首页', viewport }
        }
      ]
    },
    // 产品图谱
    {
      path: '/productmap',
      name: 'productmap',
      component: () => import('@/views/product-map/index'),
      meta: { title: '产品图谱', viewport }
    },
    // 人员中心
    {
      path: '/person-center',
      name: 'personCenter',
      component: () => import('@/views/personCenter/index'),
      meta: { code: ['peopleCenter'], title: '人员中心', viewport }
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/error'),
      meta: { title: '404', viewport }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  let auth = handleAuth(to)
  // 区分是没有 没有权限，还是 没有获取到权限
  if (!auth && !store.state?.permissionsPage?.dataPerm?.length) {
    await getUserRole();
    auth = handleAuth(to)
  }
  if (!auth) {
    next('/error')
    return;
  }
  if (to.path.split('/').length > 1) {
    const data = [
      { name: to.path.split('/')[1], title: to.meta.pTitle },
      { name: to.path.split('/')[2], title: to.meta.title }
    ]
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
  next()
  sessionStorage.setItem('router-path', to.path)
})
// 解决报错
const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}
// replace
Router.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch((err) => err)
}
// 权限处理
/* function handleAuth(to) {
  // 本地化持久存储
  if (!store.state?.permissionsPage?.funPerms?.length) {
    const permissionsPage = JSON.parse(
      window.localStorage.getItem('permissionsPage')
    )
    if (permissionsPage) {
      store.state.permissionsPage = permissionsPage
    }
  }
  const { permissionsPage } = store.state
  const auth = permissionsPage.permition.find((item) => item.pathName === to.name && item.type)
  if (
    auth
    || to.name === 'login'
    || to.name === '404'
    || to.name === 'front'
    || to.name === 'privacy-policy'
    || to.name === 'user-agreement'
  ) {
    return true
  }
  return false
} */
// 权限处理V2
function handleAuth(to) {
  // 本地化持久存储
  if (!store.state?.permissionsPage?.dataPerm?.length) {
    const permissionsPage = JSON.parse(
      window.localStorage.getItem('permissionsPage')
    )
    if (permissionsPage) {
      store.state.permissionsPage = permissionsPage
    }
  }
  // 判断权限
  const { permissionsPage } = store.state;
  // code是数组,能找到配置 code,则说明存在权限控制，无则说明  任何人可访问，code会向上查找，父路由存在，则子路由通用存在,   父路由若无  单独控制权限，则 需 父路由的code需要包含子路由所有权限code
  const code = to?.meta?.code || to?.matched?.filter(item => item?.meta?.code)?.[0]?.meta?.code || [];
  const auth = permissionsPage.funPerms.find((item) => code.includes(item.code) && item.type)
  return code.length ? Boolean(auth) : true;
}
async function getUserRole() {
  const token = window.localStorage.getItem('AI_token')
  if (!token) {
    router.push({
      name: 'login'
    })
  } else {
    await getPermissionsPage()
  }
}
export async function getPermissionsPage() {
  const res = await editThePermissionsPage()
  const data = res.data.data || {}
  // data.funPerms = data.funPerms.map(item => {
  //   return {
  //     name: item.name,
  //     type: item.type,
  //     code: item.code,
  //     child: item.child
  //   }
  // })
  // data.funPerms = data.funPerms.filter((item) => item.type)
  // data.defaultPerm = data.defaultPerm.filter((item) => item.type)
  store.state.permissionsPage = data
  window.localStorage.setItem('permissionsPage', JSON.stringify(data))
}

export default router
