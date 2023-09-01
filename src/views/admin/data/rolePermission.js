export const permissionList = [
  {
    title: '审批中心',
    type: '',
    reflect: ['approval-details', 'aiApproval', 'compare'],
    children: [
      {
        title: '全部任务（审批中心）',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'export', value: '查看并导出' }
        ]
      }
    ]
  },
  {
    title: '后台管理',
    type: '',
    isShowWarn: false,
    children: [
      {
        title: '用户管理',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' }
        ]
      },
      {
        title: '表单管理',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' }
        ]
      },
      {
        title: '流程管理',
        reflect: ['baseSetting', 'processDesign', 'proSetting'],
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' }
        ]
      },
      {
        title: '角色/权限管理',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' }
        ]
      },
      {
        title: '标签管理',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' }
        ]
      },
      {
        title: '意见管理',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' }
        ]
      },
      {
        title: '法规制度管理',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' }
        ]
      },
      {
        title: '其他配置',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' }
        ]
      }
    ]
  },
  {
    title: '统计中心',
    type: ''
  }
]