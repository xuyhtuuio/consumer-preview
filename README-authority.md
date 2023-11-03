# 权限配置&判断说明
# 当前权限type主要四种情况： ''：无权限;'view'：仅查看全新啊; 'edit'：查看&编辑权限, 'export'： 查看&导出权限
## 1、权限配置

  权限设置页中，新增需控制权限模块时， 需后端新增对应模块数据， 其code建议与该  模块的 主入口（或二级路由等）的 name,path都保持一致， 页面负责人[子沛]，

  路由中，若仅指定页面受权限控制，需在meta中添加 code;若整个模块均受同一个权限控制，则可在 主入口（或二级路由等） 的meta中设置 code;[code是数组， 其下子模块无需再配置code]

## 2、权限判断

  navMenu（头部导航）：新增模块，时在 \src\components\common\navMenu.vue 中 navList添加到指定顺序即可，字段有：title，name（入口path）,pathName(该  模块的 主入口（或二级路由等）的 name, 用于激活菜单),code（不区分权限时可没有）

  后台管理左侧导航： 新增子模块时，在 src\views\admin\manage\leftMenu.vue 中 pathNames的指定位置添加 数据即可，字段有：name， pathName， path,code（不区分权限时可没有）

  具体页面内判断是否有权限或权限如何
  可通过 this.$store.getters.getPermissionByCode(code) 来获取权限对象， 其中code为前面提到的code, 例如'flowableManagement'， 对象为空则说明不存在此code的权限，  不为空，再根据其type判断具体权限