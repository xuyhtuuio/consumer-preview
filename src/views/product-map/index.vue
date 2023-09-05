<template>
  <div class="product-map">
    <div class="map-canvas" id="product-map" v-loading="mapLoading"></div>
    <el-drawer :title="chooseRisk" :visible.sync="drawer">
      <div v-loading="riskLoading">
        <div class="total-show">
          <div class="total">
            相关投诉
            <span style="font-weight: 700; color: #eb5757">{{
              riskList.total
            }}</span>
          </div>
          <div class="to-link" @click="toLink">查看详情></div>
        </div>
        <div class="complaint">
          <ComplaintCard
            v-for="(item, index) in riskList.list"
            :key="index"
            :item="item"
          ></ComplaintCard>
        </div>
        <TrsPagination
          class="trs-pagination"
          :pageSize="10"
          :pageNow="page.pageNow"
          :total="riskList.total"
          v-if="riskList.total"
        >
        </TrsPagination>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import G6 from '@antv/g6';
import ComplaintCard from './components/complaint-card';
// const { Util } = G6;
export default {
  components: {
    ComplaintCard,
  },
  data: () => ({
    treeData: {
      name: '产品图谱',
      children: [
        {
          name: '代销/理财产品',
          children: [
            {
              name: '南银理财',
              children: [
                {
                  name: '鑫逸稳系列',
                  children: [
                    {
                      name: '南银理财鑫逸稳两年13期-C份额',
                    },
                    {
                      name: '南银理财鑫逸稳两年12期（低波款）-B份额',
                    },
                    {
                      name: '南银理财鑫逸稳增强两年37期-A份额',
                    },
                    {
                      name: '南银理财鑫逸稳一年114期-B份额',
                    },
                  ],
                },
              ],
            },
            {
              name: '苏银理财',
              children: [
                {
                  name: '恒源系列',
                  children: [
                    {
                      name: '苏银理财恒源封闭债权42期14月A',
                    },
                    {
                      name: '苏银理财恒源1年定开37期G',
                    },
                  ],
                },
              ],
            },
            {
              name: '浦银理财',
              children: [
                {
                  name: '悦盈利系列',
                  children: [
                    {
                      name: '悦盈利之6个月定开型G款（多渠道专属2号）',
                    },
                    {
                      name: '悦盈利之14个月定开型12号（多渠道专属1号）',
                    },
                  ],
                },
              ],
            },
            {
              name: '兴银理财',
              children: [
                {
                  name: '增盈稳享系列',
                  children: [
                    {
                      name: '悦盈利之6个月定开型G款（多渠道专属2号）',
                    },
                    {
                      name: '悦盈利之14个月定开型12号（多渠道专属1号）',
                    },
                  ],
                },
                {
                  name: '稳利恒盈系列',
                  children: [
                    {
                      name: '兴银理财天天万利宝稳利恒盈7号封闭式净值型理财产品第32期',
                    },
                    {
                      name: '兴银理财天天万利宝稳利恒盈7号封闭式净值型理财产品第28期',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: '代销/基金产品',
          children: [
            {
              name: '华夏基金',
              children: [
                {
                  name: '稳茂增益系列',
                  children: [
                    {
                      name: '华夏稳茂增益C',
                    },
                    {
                      name: '华夏稳茂增益A',
                    },
                  ],
                },
              ],
            },
            {
              name: '华泰柏瑞基金',
              children: [
                {
                  name: '富利系列',
                  children: [
                    {
                      name: '华泰柏瑞富利灵活配置混合型证券投资基金C',
                    },
                    {
                      name: '华泰柏瑞富利灵活配置混合型证券投资基金A',
                    },
                  ],
                },
              ],
            },
            {
              name: '广发基金',
              children: [
                {
                  name: '稳宏系列',
                  children: [
                    {
                      name: '广发稳宏一年持有期混合型证券投资基金C',
                    },
                    {
                      name: '广发稳宏一年持有期混合型证券投资基金A',
                    },
                  ],
                },
              ],
            },
            {
              name: '博时基金',
              children: [
                {
                  name: '新收益系列',
                  children: [
                    {
                      name: '博时新收益C',
                    },
                    {
                      name: '博时新收益A',
                    },
                  ],
                },
                {
                  name: '均衡优选系列',
                  children: [
                    {
                      name: '博时均衡优选混合型基金C',
                    },
                    {
                      name: '博时均衡优选混合型基金A',
                    },
                  ],
                },
              ],
            },
            {
              name: '招商基金',
              children: [
                {
                  name: '鑫福系列',
                  children: [
                    {
                      name: '招商鑫福C',
                    },
                    {
                      name: '招商鑫福A',
                    },
                  ],
                },
              ],
            },
            {
              name: '百嘉基金',
              children: [
                {
                  name: '中证同业存单AAA指数',
                  children: [
                    {
                      name: '百嘉中证同业存单AAA指数7天持有期证券投资基金',
                    },
                  ],
                },
              ],
            },
            {
              name: '平安基金',
              children: [
                {
                  name: '蕙澜系列',
                  children: [
                    {
                      name: '平安蕙澜C',
                    },
                    {
                      name: '平安蕙澜A',
                    },
                  ],
                },
                {
                  name: '策略优选系列',
                  children: [
                    {
                      name: '平安策略优选1年持有期混合型C',
                    },
                    {
                      name: '平安策略优选1年持有期混合型A',
                    },
                  ],
                },
              ],
            },
            {
              name: '英大基金',
              children: [
                {
                  name: '中证同业存单AAA指数',
                  children: [
                    {
                      name: '英大中证同业存单AAA指数7天持有期',
                    },
                  ],
                },
                {
                  name: '现金宝系列',
                  children: [
                    {
                      name: '英大现金宝货币市场基金B',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: '代销/保险-寿险产品',
        },
        {
          name: '代销/贵金属',
        },
        {
          name: '代销/保险-财险产品',
        },
        {
          name: '代销/信托产品',
        },
        {
          name: '代销/理财产品',
        },
        {
          name: '我行/理财产品',
          children: [
            {
              name: '浙商银行',
              children: [
                {
                  name: '涌薪添利系列',
                  children: [
                    {
                      name: '浙商银行2023年涌薪添利尊享68号人民币理财产品',
                    },
                    {
                      name: '浙商银行2022年涌薪添利安享35号人民币理财产品',
                    },
                    {
                      name: '浙商银行2023年涌薪添利尊享51号人民币理财产品',
                    },
                    {
                      name: '浙商银行2023年涌薪添利尊享50号人民币理财产品',
                    },
                    {
                      name: '浙商银行2023年涌薪添利安享42号人民币理财产品',
                    },
                  ],
                },
                {
                  name: '涌薪增利系列',
                  children: [
                    {
                      name: '浙商银行2022年涌薪增利尊享36号人民币理财产品',
                    },
                    {
                      name: '浙商银行2022年涌薪增利尊享35号人民币理财产品',
                    },
                    {
                      name: '浙商银行2022年涌薪增利安享50号人民币理财产品',
                    },
                    {
                      name: '浙商银行2022年涌薪增利尊享32号人民币理财产品',
                    },
                    {
                      name: '浙商银行2022年涌薪增利安享49号人民币理财产品',
                      risk: true,
                    },
                  ],
                },
                {
                  name: '聚鑫赢系列',
                  children: [
                    {
                      name: '浙商银行聚鑫赢A周周开1号人民币理财产品',
                    },
                    {
                      name: '浙商银行聚鑫赢A十三月定开5号人民币理财产品',
                    },
                    {
                      name: '浙商银行聚鑫赢B-90天型3号人民币理财产品',
                    },
                    {
                      name: '浙商银行聚鑫赢B-180天型1号人民币理财产品',
                    },
                    {
                      name: '浙商银行聚鑫赢B-180天型2号人民币理财产品',
                      risk: true,
                    },
                  ],
                },
                {
                  name: '鸣泉系列',
                  children: [
                    {
                      name: '浙商银行鸣泉稳健同享2号（低波60天续投）人民币理财产品',
                    },
                    {
                      name: '浙商银行鸣泉半年定开1号人民币理财产品成立公告',
                    },
                  ],
                },
                {
                  name: '昕泽系列',
                  children: [
                    {
                      name: '浙商银行昕泽稳健同享2号（最短持有180天）人民币理财产品',
                    },
                    {
                      name: '浙商银行昕泽稳健同享3号（最短持有360天）人民币理财产品',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: '我行/存款',
          children: [
            {
              name: '单位存款',
              children: [
                {
                  name: '单位活期存款',
                },
                {
                  name: '单位定期存款',
                },
                {
                  name: '单位通知存款',
                },
                {
                  name: '协定存款',
                },
                {
                  name: '协议存款',
                },
                {
                  name: '挂钩SHIBOR存款',
                },
                {
                  name: '大额存单',
                },
              ],
            },
            {
              name: '个人存款',
              children: [
                {
                  name: '活期',
                },
                {
                  name: '定活两便',
                },
                {
                  name: '存本取息',
                },
                {
                  name: '零存整取',
                },
                {
                  name: '整存整取',
                },
                {
                  name: '定期一本通',
                },
                {
                  name: '通知存款',
                },
                {
                  name: '大额存单',
                },
              ],
            },
            {
              name: '个人结构性存款',
            },
          ],
        },
      ],
    },
    drawer: false,
    mapLoading: false,
    page: {
      pageNow: 1,
      total: 23,
    },
    showName: [
      '浙商银行2022年涌薪增利安享49号人民币理财产品',
      '浙商银行聚鑫赢B-180天型2号人民币理财产品',
    ],
    riskListMenu: {
      one: {
        list: [
          {
            content:
              '新入职公司需要办理杭州银行工资卡，杭州银行工作人员来公司上门集中开户办卡，在办理杭州银行卡时，拿着我的手机私自一顿操作，我提出疑问开通了什么功能，只是说开通网上银行功能，现在才明白没有任何告知开通了涌薪增利安享49号理财产品，并自动扣款，打电话95527投诉到银行，反馈已购理财产品无法取消，这种没有征得个人同意，开办银行卡时夹带办理理财的行为需要杜绝，并且必须向我公开道歉，否则我就去法院告你们',
            tag: [
              '未经客户同意，购买理财类产品',
              '未经客户同意扣费',
              '客户要求银行道歉',
              '司法类风险',
            ],
            source: '95527',
            time: '2023-08-06',
          },
          {
            content:
              '购买银行理财产品涌薪增利安享49号人民币理财产品，产品到期后但一直无法到账，订单界面一直显示到期兑付中，多次联系在线客服和95527每次都说已经提交反馈，但实际上毫无反应，拖延将近半个月依旧没有任何进展并给不到确切处理时间，客服表示根本查询不到这比款项也没有收到打款请求，并且服务态度恶劣。要求尽快解决我的问题',
            tag: [
              '理财类产品赎回后，资金未到账/到账时间晚',
              '客户对效率不满意',
              '客户要求尽快办理',
              '工作人员服务态度不好',
            ],
            source: '监管转办',
            time: '2023-08-08',
          },
        ],
        total: 2,
      },
      two: {
        list: [
          {
            content:
              '我6.2购买的理财产品聚鑫赢B-180天型2号理财产品我想赎回来，但是网上银行客服一直以系统显示风险为理由不让赎回，麻烦提供什么风险有什么依据，还有什么时候可以解除这个风险，我的理财产品如有亏损谁来承担，麻烦做出回复，不然我就发到抖音、微博上',
            tag: [
              '理财类产品无法赎回',
              '客户对理财产品赎回规则不满',
              '客户要求答复/回电',
              '舆情类风险',
            ],
            source: '监管转办',
            time: '2023-08-07',
          },
          {
            content:
              '本人6月13号下午3点以后购买手机银行上的理财产品聚鑫赢B-180天型2号，因过了交易时间，购买的净值以14号的为准，所以想要撤销，却被告知不能撤回，明明今日交易时间已经过去，也没有申购成功，确不能撤销，并且正规的理财产品都有犹豫期和可撤销期，但是这个确没有，本人怀疑是非合法的理财产品，要求在14号3点交易生效前退回全额',
            tag: ['客户对理财产品赎回规则不满', '客户要求退回账户资金'],
            source: '监管转办',
            time: '2023-08-07',
          },
          {
            content:
              '我购买的理财产品聚鑫赢B-180天型2号，该理财产品到期后一直没有回款，联系客服让等消息，结果等到的是让选择退出通道，最终选择了通道二，从那之后，每隔一段时间就又几百到两千不等的回款，但是到今年7月后，软件App登陆一直提示异常，也就无法查看和收到回款了，要求马上解决',
            tag: [
              '理财类产品赎回后，资金未到账/到账时间晚',
              '登录失败/无法登陆使用',
              '客户要求尽快办理',
            ],
            source: '95527',
            time: '2023-08-08',
          },
        ],
        total: 3,
      },
    },
    riskList: {},
    riskLoading: false,
    chooseRisk: '',
  }),
  mounted() {
    this.mapLoading = true;
    setTimeout(() => {
      this.mapLoading = false;
      this.initTree();
    }, 1000);
  },
  methods: {
    initTree() {
      const that = this;
      G6.registerNode(
        'tree-node',
        {
          drawShape: function drawShape(cfg, group) {
            const content = cfg.name;
            const text = group.addShape('text', {
              attrs: {
                text: content,
                x: 0,
                y: 0,
                textAlign: 'left',
                textBaseline: 'middle',
                fontSize: 14,
                lineHeight: 22,
                fill: 'transparent',
              },
              name: 'text-shape1',
            });
            const bbox = text.getBBox();
            const rect = group.addShape('rect', {
              attrs: {
                fill: cfg.risk ? '#EB5757' : '#80A6FF',
                x: -1,
                y: 0,
                width: bbox.width <= 98 ? 112 : bbox.width + 14,
                height: 42,
                radius: 2,
              },
              name: 'rect-shape1',
            });
            group.addShape('rect', {
              attrs: {
                fill: '#fff',
                x: 0,
                y: 0,
                width: bbox.width <= 98 ? 110 : bbox.width + 12,
                height: 38,
                radius: 2,
                cursor: 'pointer',
              },
              name: 'rect-shape2',
            });
            const rectBbox = rect.getBBox();

            group.addShape('text', {
              attrs: {
                text: content,
                x: (rectBbox.width - bbox.width) / 2,
                y: rectBbox.height / 2,
                textAlign: 'left',
                textBaseline: 'middle',
                fontSize: 14,
                lineHeight: 22,
                cursor: 'pointer',
                fill: '#1D2128',
              },
              name: 'text-shape2',
            });
            const hasChildren = cfg.children && cfg.children.length > 0;
            if (hasChildren) {
              group.addShape('marker', {
                attrs: {
                  x: rectBbox.width + 12,
                  y: 21,
                  r: 8,
                  symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
                  stroke: '#2D5CF6',
                  fill: '#2D5CF6',
                  lineWidth: 2,
                  cursor: 'pointer'
                },
                name: 'collapse-icon',
              });
            }
            return rect;
          },
          update: (cfg, item) => {
            const group = item.getContainer();
            const icon = group.find((e) => e.get('name') === 'collapse-icon');
            icon.attr(
              'symbol',
              cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse
            );
          },
        },
        'single-node'
      );

      const container = document.getElementById('product-map');
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;
      const graph = new G6.TreeGraph({
        container: 'product-map',
        width,
        height,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed) {
                const data = item.get('model');
                graph.updateItem(item, {
                  collapsed,
                });
                data.collapsed = collapsed;
                return true;
              },
            },
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        defaultNode: {
          type: 'tree-node',
          anchorPoints: [
            [0, 0.5],
            [1.1, 0.5],
          ],
        },
        // defaultEdge: {
        //   type: "cubic-horizontal",
        //   style: {
        //     stroke: "#2D5CF6",
        //     lineWidth: 1.5,
        //   },
        // },
        layout: {
          type: 'compactBox',
          direction: 'LR',
          getId: function getId(d) {
            return d.id;
          },
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth(cfg) {
            return G6.Util.getTextSize(cfg.name, 14)[0] <= 98
              ? 112
              : G6.Util.getTextSize(cfg.name, 14)[0] + 14;
          },
          getVGap: function getVGap() {
            return 20;
          },
          getHGap: function getHGap() {
            return 80;
          },
        },
        minZoom: 0.8,
        maxZoom: 1.5,
      });
      const treeData = that.setTree(that.treeData, 1);
      G6.Util.traverseTree(treeData, (item) => {
        if (item.deep > 2) {
          // collapsed为true时默认收起
          item.collapsed = true;
        } else {
          item.collapsed = false;
        }
      });
      graph.edge((edge) => {
        const node = graph.findById(edge.target);
        if (node._cfg.model.risk) {
          return {
            id: edge.id,
            type: 'cubic-horizontal',
            style: {
              stroke: '#EB5757',
              lineWidth: 1.5,
            },
          };
        } else {
          return {
            id: edge.id,
            type: 'cubic-horizontal',
            style: {
              stroke: '#2D5CF6',
              lineWidth: 1.5,
            },
          };
        }
      });
      graph.data(treeData);
      graph.render();
      graph.fitView();
      graph.on('rect-shape2:click', (ev) => {
        if (
          ev.item._cfg.model.collapsed
          && that.showName.indexOf(ev.item._cfg.model.name) !== -1
        ) {
          that.drawer = true;
          that.riskLoading = true;
          if (ev.item._cfg.model.name === that.showName[0]) {
            const tempEl = that.showName[0];
            that.chooseRisk = tempEl;
            setTimeout(() => {
              that.riskList = that.riskListMenu.one;
              that.riskLoading = false;
            }, 1000);
          } else {
            const tempEle = that.showName[1];
            that.chooseRisk = tempEle;
            setTimeout(() => {
              that.riskList = that.riskListMenu.two;
              that.riskLoading = false;
            }, 1000);
          }
        }
      });
      graph.on('text-shape2:click', (ev) => {
        if (
          ev.item._cfg.model.collapsed
          && that.showName.indexOf(ev.item._cfg.model.name) !== -1
        ) {
          that.drawer = true;
          that.riskLoading = true;
          if (ev.item._cfg.model.name === that.showName[0]) {
            const tempElem = that.showName[0]
            that.chooseRisk = tempElem;
            setTimeout(() => {
              that.riskList = that.riskListMenu.one;
              that.riskLoading = false;
            }, 1000);
          } else {
            const tempEleme = that.showName[1];
            that.chooseRisk = tempEleme;
            setTimeout(() => {
              that.riskList = that.riskListMenu.two;
              that.riskLoading = false;
            }, 1000);
          }
        }
      });
    },
    setTree(obj, deep) {
      obj.id = new Date().getTime() + this.uuid();
      obj.deep = deep;
      if (obj.children && obj.children.length > 0) {
        for (let i = 0; i < obj.children.length; i++) {
          this.setTree(obj.children[i], deep + 1);
        }
      }
      return obj;
    },
    // 随机数，用于绑定id
    uuid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return (
        s4()
        + s4()
        + '-'
        + s4()
        + '-'
        + s4()
        + '-'
        + s4()
        + '-'
        + s4()
        + s4()
        + s4()
      );
    },
    toLink() {
      window.open('http://192.168.210.58:31808/complaint', '_blank');
    },
  },
};
</script>

<style lang="less" scoped>
.product-map {
  margin: 0;
  padding: 0 !important;
  background: url("../../assets/image/product-map-bgc.png") no-repeat;
  background-size: 100% 100%;
  .map-canvas {
    width: 100%;
    height: 100%;
  }
  /deep/.el-drawer__wrapper {
    .el-drawer {
      width: 500px !important;
    }
    .el-drawer__header {
      padding: 16px 24px;
      margin-bottom: 0;
      color: #1d2128;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      border-bottom: 1px solid #e5e6eb;
    }
    .el-drawer__body {
      padding: 16px 24px;
      .total-show {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .total {
          color: #1d2128;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 22px;
        }
        .to-link {
          color: #2d5cf6;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 22px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
