<template>
  <div class="product-map">
    <div class="map-canvas" id="product-map"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
const { Util } = G6;
export default {
  data: () => ({
    treeData: {
      name: "Modeling Methods",
      children: [
        {
          name: "Classification",
          children: [
            { name: "Logistic regression" },
            { name: "Linear discriminant analysis" },
            { name: "Rules" },
            { name: "Decision trees" },
            { name: "Naive Bayes" },
            { name: "K nearest neighbor" },
            { name: "Probabilistic neural network" },
            { name: "Support vector machine" },
          ],
        },
        {
          name: "Consensus",
          children: [
            {
              name: "Models diversity",
              children: [
                { name: "Different initializations" },
                { name: "Different parameter choices" },
                { name: "Different architectures" },
                { name: "Different modeling methods" },
                { name: "Different training sets" },
                { name: "Different feature sets" },
              ],
            },
            {
              name: "Methods",
              children: [
                { name: "Classifier selection" },
                { name: "Classifier fusion" },
              ],
            },
            {
              name: "Common",
              children: [
                { name: "Bagging" },
                { name: "Boosting" },
                { name: "AdaBoost" },
              ],
            },
          ],
        },
        {
          name: "Regression",
          children: [
            { name: "Multiple linear regression" },
            { name: "Partial least squares" },
            { name: "Multi-layer feedforward neural network" },
            { name: "General regression neural network" },
            { name: "Support vector regression" },
          ],
        },
      ],
    },
    maxWidth: [],
  }),
  mounted() {
    this.initTree();
  },
  methods: {
    initTree() {
      let that = this;
      G6.registerNode(
        "tree-node",
        {
          drawShape: function drawShape(cfg, group) {
            const content = cfg.name;
            const text = group.addShape("text", {
              attrs: {
                text: content,
                x: 0,
                y: 0,
                textAlign: "left",
                textBaseline: "middle",
                fontSize: 14,
                lineHeight: 22,
                fill: "transparent",
              },
              name: "text-shape",
            });
            const bbox = text.getBBox();
            // that.maxWidth[cfg.depth];
            const rect = group.addShape("rect", {
              attrs: {
                fill: "#80A6FF",
                x: -1,
                y: 0,
                width: bbox.width <= 98 ? 112 : bbox.width + 14,
                height: 42,
                radius: 2,
              },
              name: "rect-shape",
            });
            group.addShape("rect", {
              attrs: {
                fill: "#fff",
                x: 0,
                y: 0,
                width: bbox.width <= 98 ? 110 : bbox.width + 12,
                height: 38,
                radius: 2,
              },
              name: "rect-shape",
            });
            const rectBbox = rect.getBBox();

            group.addShape("text", {
              attrs: {
                text: content,
                x: (rectBbox.width - bbox.width) / 2,
                y: rectBbox.height / 2,
                textAlign: "left",
                textBaseline: "middle",
                fontSize: 14,
                lineHeight: 22,
                fill: "#1D2128",
              },
              name: "text-shape",
            });
            const hasChildren = cfg.children && cfg.children.length > 0;
            if (hasChildren) {
              group.addShape("marker", {
                attrs: {
                  x: bbox.width / 2 + 12,
                  y: 0,
                  r: 6,
                  symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
                  stroke: "#666",
                  lineWidth: 2,
                },
                name: "collapse-icon",
              });
            }
            return rect;
          },
          update: (cfg, item) => {
            const group = item.getContainer();
            const icon = group.find((e) => e.get("name") === "collapse-icon");
            icon.attr(
              "symbol",
              cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse
            );
          },
        },
        "single-node"
      );

      const container = document.getElementById("product-map");
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;
      const graph = new G6.TreeGraph({
        container: "product-map",
        width,
        height,
        modes: {
          default: [
            {
              type: "collapse-expand",
              onChange: function onChange(item, collapsed) {
                const data = item.get("model");
                graph.updateItem(item, {
                  collapsed,
                });
                data.collapsed = collapsed;
                return true;
              },
            },
            "drag-canvas",
            "zoom-canvas",
          ],
        },
        defaultNode: {
          type: "tree-node",
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        },
        defaultEdge: {
          type: "cubic-horizontal",
          style: {
            stroke: "#A3B1BF",
          },
        },
        layout: {
          type: "compactBox",
          direction: "LR",
          getId: function getId(d) {
            return d.id;
          },
          getHeight: function getHeight(val) {
            return 16;
          },
          getWidth: function getWidth() {
            return 16;
          },
          getVGap: function getVGap() {
            return 20;
          },
          getHGap: function getHGap() {
            return 80;
          },
        },
        minZoom: 1,
        maxZoom: 1.5,
      });

      G6.Util.traverseTree(that.treeData, function (item) {
        item.id = item.name;
      });
      graph.data(that.treeData);
      graph.render();
      graph.fitView();
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
}
</style>