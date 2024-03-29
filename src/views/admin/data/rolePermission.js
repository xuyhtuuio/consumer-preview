export const permissionList = [
  {
    code: 'approvalCenter',
    title: '审批中心',
    type: '',
    isNoWarn: true, // 去除警告
    props: { trueLabel: 'edit', falseLabel: '' },
    reflect: ['applicationFormDetails', 'smartApprovals', 'onlineComparison'], // 关联权限
    children: [
      {
        code: 'allTask',
        title: '全部任务（审批中心）',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'export', value: '查看并导出' },
        ],
      },
    ],
  },
  {
    code: 'backManagement',
    title: '后台管理',
    type: '',
    props: { trueLabel: 'edit', falseLabel: '' },
    isShowWarn: false,
    children: [
      {
        code: 'userManagement',
        title: '用户管理',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' },
        ],
      },
      {
        code: 'rolePermManagement',
        title: '角色/权限管理',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' },
        ],
      },
      {
        code: 'formManagement',
        title: '表单管理',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' },
        ],
      },
      {
        code: 'flowableManagement',
        title: '流程管理',
        reflect: ['workflowBaseInfo', 'workflowProcessDesign', 'workflowConfiguration'],
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' },
        ],
      },
      {
        code: 'tagManagement',
        title: '标签管理',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' },
        ],
      },
      {
        code: 'opinionManagement',
        title: '意见管理',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' },
        ],
      },
      {
        code: 'statutesManagement',
        title: '法规制度管理',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' },
        ],
      },
      {
        code: 'otherDisposition',
        title: '其他配置',
        type: '',
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' },
        ],
      },
    ],
  },
  {
    code: 'knowledge',
    title: '知识库',
    type: '',
    isShowWarn: false,
    props: { trueLabel: 'edit', falseLabel: '' },
    children: [
      {
        code: 'collectKnowledge',
        title: '知识库',
        type: '',
        reflect: ['rulesBase', 'rulesDetail', 'collectKnowledge'],
        props: [
          { label: 'view', value: '查看' },
          { label: 'edit', value: '查看并编辑' },
        ],
      },
    ],
  },
  {
    code: 'recheckIndex',
    title: '智能回检',
    type: '',
    props: { trueLabel: 'edit', falseLabel: '' },
  },
  {
    code: 'statisticsCenter',
    title: '统计中心',
    type: '',
    props: { trueLabel: 'edit', falseLabel: '' },
  },

  {
    code: 'peopleCenter',
    title: '人员中心',
    type: '',
    props: { trueLabel: 'edit', falseLabel: '' },
  }
];
