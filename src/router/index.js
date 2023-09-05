import Vue from "vue";
import Router from "vue-router";
import store from "@/store/index"
import request from '@/api/request.js'
Vue.use(Router);

const viewport = {
  content: "width=device-width, initial-scale=1.0, user-scalable=no"
}


// meta: { title: '新增详情' ,viewport: viewport ,pTitle: "首页",pPath: "/home"}
const router = new Router({
  // mode: 'history',
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
      meta: { title: '消保管控平台', viewport: viewport }
    },
    {
      path: "/show-review",
      name: "showReview",
      component: () => import('@/views/front/show-review.vue'),
    },
    // 后台管理
    {
      path: '/admin/manage',
      name: 'manage',
      component: () => import("@/views/admin/manage/index.vue"),
      meta: { title: '后台管理', viewport: viewport },
      redirect: '/admin/manage/flowManage',
      children: [
        {
          path: "userManage",
          name: "UserManage",
          component: () => import("@/views/admin/manage/userManage.vue"),
          meta: { title: '用户管理' }
        },
        {
          path: "rolePermission",
          name: "RolePermission",
          component: () => import("@/views/admin/manage/rolePermission.vue"),
          meta: { title: '角色/权限' }
        },
        {
          path: "flowManage",
          name: "FlowManage",
          component: () => import("@/views/admin/manage/flowManage.vue"),
          meta: { title: '用户管理' }
        },
        {
          path: "formManage",
          name: "FormManage",
          component: () => import("@/views/admin/manage/formManage.vue"),
          meta: { title: '表单管理' }
        },
        {
          path: "labelManage",
          name: "LabelManage",
          component: () => import("@/views/admin/manage/labelManage.vue"),
          meta: { title: '标签管理' }
        },
        {
          path: "opinionManage",
          name: "OpinionManage",
          component: () => import("@/views/admin/manage/opinionManage.vue"),
          meta: { title: '意见管理' }
        },
        {
          path: "opinionManage-1.0",
          name: "OpinionManageOne",
          component: () => import("@/views/admin/manage/opinionManage-1.0.vue"),
          meta: { title: '意见管理' }
        }
      ]
    },
    // 工作流设计
    {
      path: "/admin/design",
      name: "design",
      component: () => import("@/views/admin/FormProcessDesign.vue"),
      meta: { title: '表单流程设计', viewport: viewport },
      redirect: '/admin/design/baseSetting',
      children: [
        {
          path: "baseSetting",
          name: "baseSetting",
          component: () => import("@/views/admin/layout/FormBaseSetting.vue"),
          meta: { title: '基础设置' }
        },
        // {
        //   path: "formSetting",
        //   name: "formSetting",
        //   component: () => import("@/views/admin/layout/FormDesign.vue"),
        //   meta: { title: '表单设计' }
        // },
        {
          path: "processDesign",
          name: "processDesign",
          component: () => import("@/views/admin/layout/ProcessDesign.vue"),
          meta: { title: '流程设计' }
        }, {
          path: "proSetting",
          name: "proSetting",
          component: () => import("@/views/admin/layout/FormProSetting.vue"),
          meta: { title: '高级设置' }
        }
      ]
    },
    {
      path: "/applycenter",
      name: "applycenter",
      component: () => import("@/views/applycenter/home"),
      meta: { title: '申请中心', viewport: viewport },
      redirect: '/applycenter/apply-list',
      children: [
        {
          path: "apply-list",
          name: "apply-list",
          component: () => import("@/views/applycenter/index"),
          meta: { title: '申请中心', }
        },
        {
          path: "details",
          name: "details",
          component: () => import("@/views/applycenter/details"),
          meta: { title: '申请单详情', }
        },
        {
          path: "addApply",
          name: "addApply",
          component: () => import("@/views/front/addApply.vue"),
          parent: "/home",
          meta: { title: '新的申请' ,viewport: viewport ,pTitle: "申请中心"}
        },
        {
          path:"editApply",
          name: "editApply",
          component: () => import("@/views/front/addApply.vue"),
          parent: "/home",
          meta: { title: '编辑申请' ,viewport: viewport ,pTitle: "申请中心"}
        }
      ]
    },
    {
      path: "/approvalcenter",
      name: "approvalcenter",
      component: () => import("@/views/approvalCenter/home.vue"),
      meta: { title: '审批中心', viewport: viewport },
      redirect: '/approvalcenter/approval-list',
      children: [
        {
          path: "approval-list",
          name: "approval-list",
          component: () => import("@/views/approvalCenter/index"),
          meta: { title: '审批中心',}
        },
        {
          path: "approval-details",
          name: "approval-details",
          component: () => import("@/views/approvalCenter/details"),
          meta: { title: '申请单详情', }
        }, {
          path: "aiApproval",
          name: "aiApproval",
          component: () => import("@/views/aiApproval/index.vue"),
          meta: { title: '智能审批', viewport: viewport }
        }, {
          path: "compare",
          name: "compare",
          component: () => import("@/views/approvalCenter/text-compare.vue"),
          meta: { title: '线上对比', viewport: viewport }
        },
      ]
    },
    {
      path: "/front",
      name: "front",
      redirect: '/home',
      component: () => import("@/views/front/index.vue"),
      meta: { title: '消保管控平台', viewport: viewport },
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import("@/views/front/home.vue"),
          meta: { title: '首页', viewport: viewport },
        },
      ]
    },
    {
      path: "/productmap",
      name: "productmap",
      component: () => import("@/views/product-map/index"),
      meta: { title: '产品图谱', viewport: viewport },
    },
    {
      path: "/404",
      name: "404",
      component: () => import("@/views/404"),
      meta: { title: '404', viewport: viewport },
    },
  ]
})

router.beforeEach((to, from, next) => {
  const auth = handleAuth(to)
  if (!auth) {
    getUserRole()
    return;
  }
  if (to.path.split("/").length>1) {
    const data = [{ name: to.path.split("/")[1], title: to.meta.pTitle }, { name: to.path.split("/")[2], title: to.meta.title }]
    store.commit("setBreadcrumbList", data)
  }

  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.meta.content) {
    let head = document.getElementByTagName('head')
    let meta = document.createElemnet('meta')
    meta.name = 'viewport'
    meta.content = "width=device-width, initial-scale=1.0, user-scalable=no"
    head[0].appendChild(meta)
  }
  next();
  sessionStorage.setItem('router-path', to.path)
})

// 权限处理
function handleAuth(to) {
  // 本地化持久存储
  if (!store.state?.permissionsPage?.funPerms?.length) {
    const permissionsPage = JSON.parse(window.localStorage.getItem('permissionsPage'))
    if (permissionsPage) {
      store.state.permissionsPage = permissionsPage
    }
    console.log(store.state.permissionsPage)
  }
  const { permissionsPage } = store.state
  const auth = [...permissionsPage.funPerms, ...permissionsPage.defaultPerm].find(item => ((item.pathName === to.name) && item.type))
  console.log(to.name, [...permissionsPage.funPerms, ...permissionsPage.defaultPerm])
  if (auth || to.name === 'login' || to.name === '404') {
    return true
  }
  return false
}

async function getUserRole() {
  const token = window.localStorage.getItem('AI_token')
  if (!token) {
    router.push({ name: 'login' })
    return false
  }
  try {
    const res = await request({
      method: 'post',
      url: '/cpr/oauth/check_token',
      contentType: 'application/x-www-form-urlencoded',
      data: {
        token
      },
      msg: false
    });
    const role = (res.data.client_id === 'cpr')
    if (!role) {
      router.push({ name: 'login' })
    } else {
      router.push({ name: '404' })
    }
    return role;
  } catch {
    router.push({ name: '404' })
  }
}



export default router;
