import Vue from "vue";
import Router from "vue-router";
import store from "@/store/index"
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
    // 首页
    {
      path: "/index",
      name: "index",
      component: () => import("@/views/Index.vue"),
      meta: { title: 'OA工作流', viewport: viewport }
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
    // 工作台
    {
      path: "/workspace",
      name: "workspace",
      component: () => import("@/views/workspace/WorkSpace.vue"),
      meta: { title: '工作区', viewport: viewport }
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
  ]
})

router.beforeEach((to, from, next) => {
  console.log();
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



export default router;
