/*
 * @Description:
 * @Author: juyang
 * @Date: 2019-09-10 19:51:31
 * @Last Modified by: juyang
 * @Last Modified time: 2019-09-11 19:23:07
 */
<template>
  <div class="flow-chart" :id="'dom_flow_chart_'+ chartId">

    <div v-for="item in domNodes" class="flow-node" :id="item.id" :key="item.id" :style="'top:' + item.y + 'px;left:' + item.x + 'px'">
      {{item.x}},{{item.y}}
      <div v-if="item['type'] === 'switch'" class="switch-content">
        {{item.label}}
        <el-button class="btn-remove" icon="el-icon-close" type="danger" size="mini" circle @click="onRemoveNode(item.id)"></el-button>
      </div>

      <div v-else-if="item['type'] === 'start'" class="start-content">
        <i class="el-icon-s-home"></i> {{item.label}}
      </div>

      <div v-else-if="item['type'] === 'end'" class="end-content">
        <i class="el-icon-s-flag"></i> {{item.label}}
      </div>

      <div v-else>
        {{item.label}}
        <el-button class="btn-remove" icon="el-icon-close" type="danger" size="mini" circle @click="onRemoveNode(item.id)"></el-button>
      </div>

    </div>

    <el-dialog
      title="图表链接"
      :visible.sync="dialogVisible"
      width="500px">

      <div>您要在<strong>{{addNodeData.sourceId}}</strong>和<strong>addNodeData.targetId</strong>两个节点之间增加哪种类型？</div>

      <el-select v-model="addForm.nodeType" placeholder="请选择类型">
        <el-option
          v-for="item in nodeTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" :disabled="isAddingNode">取消</el-button>
        <el-button type="primary" @click="onAddNode" :loading="isAddingNode">确定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
/**
 * 任务流程图
 * 参考：https://zhuanlan.zhihu.com/p/41808577
 */
import { jsPlumb } from 'jsplumb';
import { graphlib, layout } from 'dagre';
import { setTimeout } from 'timers';

const connectorPaintStyle = {
    strokeWidth: 2,
    stroke: "#61B7CF",
    joinstyle: "round",
    outlineStroke: "white",
    outlineWidth: 2
};

// .. and this is the hover style.
const connectorHoverStyle = {
    strokeWidth: 3,
    stroke: "#216477",
    outlineWidth: 5,
    outlineStroke: "white"
};

const endpointHoverStyle = {
    fill: "#216477",
    stroke: "#216477"
};

// the definition of source endpoints (the small blue ones)
const sourceEndpoint = {
    endpoint: "Dot",
    paintStyle: {
        stroke: "#7AB02C",
        fill: "transparent",
        radius: 7,
        strokeWidth: 1
    },
    isSource: true,
    connector: [ "StateMachine", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
    connectorStyle: connectorPaintStyle,
    hoverPaintStyle: endpointHoverStyle,
    connectorHoverStyle: connectorHoverStyle,
    dragOptions: {},
    overlays: [
        [ "Label", {
            location: [0.5, 1.5],
            label: "Drag",
            cssClass: "endpointSourceLabel",
            visible:false
        } ]
    ]
};
// the definition of target endpoints (will appear when the user drags a connection)
const targetEndpoint = {
    endpoint: "Dot",
    paintStyle: { fill: "#7AB02C", radius: 7 },
    hoverPaintStyle: endpointHoverStyle,
    maxConnections: -1,
    dropOptions: { hoverClass: "hover", activeClass: "active" },
    isTarget: true,
    overlays: [
        [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
    ]
};

const dragOptions = {
  grid:[10,10]
};

export default {

  name: 'flowChart',

  props: {
    serverData: {
      type: Array,
      default: () => [{
        id: 123123123123,
        sourceId: null,
        sourceType: 'start',
        targetId: 1234345,
        targetType: 'normal'
      },
      {
        id: 123123123124,
        sourceId: 1234345,
        sourceType: 'normal',
        targetId: null,
        targetType: 'end'
      }]
    }
  },

  data(){
    return {
      /** 用于绘制图的数据 */
      chartData: {
        nodes: [],
        edges: []
      },

      /** 用于生成 DOM 的数据 */
      domNodes: [],

      /** 当前 task 的 ID */
      chartId: 12345,

      dialogVisible: false,

      /** 在哪里加入新的节点 */
      addNodeData: {},

      /** 增加哪种类型的节点 */
      addForm: {
        nodeType: '',
      },

      /** 是否正在向后台请求添加节点 */
      isAddingNode: false,

      nodeTypes: [
        {
          label: 'Switch',
          value: 'switch'
        },
        {
          label: 'Forck',
          value: 'forck'
        }
      ]
    };
  },

  watch: {
    chartData(){
      this.layout();
    }
  },

  mounted() {

    this.init();

  },

  methods: {

    init(){
      this.formatData();

      const plumbIns = jsPlumb.getInstance({
        Container: 'dom_flow_chart_'+ this.chartId,
        Connector: [ "StateMachine"],
        ConnectionOverlays: [
          [ "Arrow", {
              location: 1,
              visible:true,
              width:11,
              length:11,
              id:"ARROW"
          } ],
          [ "Label", {
            label: "请连接",
            id: "label",
            cssClass: "aLabel",
            events:{
                click:(label) => {

                  const endpoints = label.component.endpoints;

                  this.addNodeData = {
                    sourceId: endpoints[0].elementId,
                    targetId: endpoints[1].elementId,
                    // 替换当前线
                    isReplace: true
                  };

                  this.dialogVisible = true;
                }
            }
          }]
        ],
        DragOptions: { cursor: "pointer", zIndex: 2000 },
        PaintStyle: { stroke: "red", strokeWidth: 4 },
        EndpointStyle: { radius: 9, fill: "#ec9f2e" },
        HoverPaintStyle: { stroke: "blue" },
        EndpointHoverStyle: {fill: "#ec9f2e" },
      });

      this.plumbIns = plumbIns;

    },

    /**
     * 把从服务器中获得的数据转成图表可以使用的数据
     */
    formatData() {
      const serverData = this.serverData;

      const chartData = {
        nodes: [],
        edges: []
      };

      const nodeMap = {};

      serverData.forEach((item) => {

        const {sourceId, sourceType, targetId, targetType} = item;

        /** 判断是否是开始和结束 */
        if(sourceType !== 'start' && !(nodeMap[sourceId])) {

          chartData['nodes'].push({
            id: 'flow_chart_' + sourceId,
            label: '上游',
            type: sourceType
          });

          nodeMap[sourceId] = true;

        }

        if(targetType !== 'end' && !(nodeMap[targetId])) {

          chartData['nodes'].push({
            id: 'flow_chart_' + targetId,
            label: '下游',
            type: targetType
          });

          nodeMap[targetId] = true;

        }

        /** 要判断是否是开始和结束 */
        chartData['edges'].push({
          source: sourceType === 'start' ?  'flow_chart_start_' + this.chartId : 'flow_chart_' + sourceId,
          target: targetType === 'end' ? 'flow_chart_end_' + this.chartId : 'flow_chart_' + targetId
        });

      });

      /** 要有一个开始和结束 */
      chartData.nodes.push({
        id: 'flow_chart_start_' + this.chartId,
        label: '开始',
        type: 'start'
      });

      chartData.nodes.push({
        id: 'flow_chart_end_' + this.chartId,
        label: '结束',
        type: 'end'
      });

      this.chartData = chartData;

    },

    /**
     * 调整布局，jsPlumb 社区版没有自动布局的功能，
     * 需要 dagre 去布局
     */
    layout() {
      var g = new graphlib.Graph();
      g.setGraph({});
      g.setDefaultEdgeLabel(function() { return {}; });

      this.chartData.nodes.forEach(item => {

        const type = item.type;
        let width = 180;
        let height = 80;

        switch (type) {
          case 'switch':

            break;
          case 'start':

            break;

          case 'end':

            break;

          default:
            break;
        }

        g.setNode(item.id,  {...item, width, height });

      });


      this.chartData.edges.forEach(item => {

        g.setEdge(item.source, item.target);

      });

      layout(g);

      const myList = [];

      g.nodes().forEach(function(v) {

        myList.push({
          ...g.node(v)
        });

      });

      this.domNodes = myList;

      const graph = g.graph();

      document.querySelector('#dom_flow_chart_'+ this.chartId).style.minHeight = (graph.height + 100) + 'px';

      this.$nextTick(() => {

        this.review();

      });

    },

    /**
     * 重新绘制流程图
     **/
    review(){

      const plumbIns = this.plumbIns;

      /** 要清空以前的连接线 */
      plumbIns.reset();


      this.chartData.nodes.forEach(item => {
        const dom = document.querySelector('#' + item.id);

        /**
         * 如果以后有成对出现的，不能加拖曳连接这个功能
         */

        if(item.type !== 'start') {
          this.addTargetPoint(dom, item);
        }

        if(item.type !== 'end'){
          this.addSourcePoint(dom, item);
        }

        plumbIns.draggable(dom, dragOptions);

      });

      this.chartData.edges.forEach((item) => {

        plumbIns.connect({
          // 对应上述基本概念
          uuids: [item.source + "_bottom", item.target + "_top"],

          /** 不可使用鼠标分开链接 */
          detachable: false
        });

      });

      /** 当点击连接线时 */
      plumbIns.bind("click", function (info) {
        console.log(info);

        const endpoints = info.endpoints;
      });


      plumbIns.bind("connection", function (info) {
        console.log(info);
        //instance.deleteConnection(c);
      });

      /**
       * 取消自动连接
       * ⚠️ 参数要使用 info ，不可以使用 {sourceId, targetId} 这种
       * 否则不能正常运行
       */
      plumbIns.bind('beforeDrop', (info) => {

        this.addNodeData = {
          sourceId: info.sourceId,
          targetId: info.targetId,
        };

        this.dialogVisible = true;

        /** 不要自动联接，通过向后台请求，再决定是否连接 */
        return false;
      });

    },

    /**
     * 增加节点
     */
    onAddNode(){

      const type = this.addForm.nodeType;

      switch (type) {

        /** 增加两个节点 */
        case 'switch':

          this.addSwitchNode();

          break;

        case 'forck':
          break;

        default:
          break;
      }

    },

    addSwitchNode() {

      this.isAddingNode = true;

      /** 模拟后台 */
      setTimeout(() => {
        const id = Date.now().valueOf();
        const targetType = this.addForm.nodeType;

        /** 两个 node   */
        const nodes = this.chartData.nodes.concat([
          {
            id: 'flow_chart_switch_top_' + id,
            label: 'Switch 1',
            type: targetType,
            /** 指向尾 ID */
            endNodeId: 'flow_chart_switch_btm_' + id
          },
          {
            id: 'flow_chart_switch_btm_' + id,
            label: 'Switch 2',
            type: targetType,
            /** 指向头 ID */
            startNodeId: 'flow_chart_switch_top_' + id
          }

        ]);

        /**
         * 增加三个链线
         * 并且要注意是否是替换
         **/
        const { sourceId, targetId, isReplace } = this.addNodeData;

        /** 如果是替换，去掉当前已有的连接线 */
        let edges = isReplace ? this.chartData.edges.filter((item) => {
          return (item.source !== sourceId || item.target !== targetId);
        }) : this.chartData.edges;

        edges = edges.concat([
          {
            source: sourceId,
            target: 'flow_chart_switch_top_' + id
          },
          {
            source: 'flow_chart_switch_top_' + id,
            target: 'flow_chart_switch_btm_' + id
          },
          {
            source: 'flow_chart_switch_btm_' + id,
            target: targetId
          }
        ]);


        this.chartData = {
          nodes,
          edges
        };

        this.isAddingNode = false;
        this.dialogVisible = false;

      }, 1000);

    },


    addSourcePoint(dom, option){

      const { type } = option;
      this.plumbIns.addEndpoint(dom, {
        uuid: option.id + "_bottom",
        anchor: "Bottom",
        isSource:true,
        maxConnections: -1,
      }, sourceEndpoint);

    },
    addTargetPoint(dom, option){

      const { type } = option;

      this.plumbIns.addEndpoint(dom, {
        uuid: option.id + "_top",
        anchor: "Top",
        isTarget: true,
        /** 最大连接数 */
        maxConnections: -1,
        onMaxConnections: (info, e) => {

          this.$message({
            type: 'warning',
            message: `链接数量不能大于<strong>${info.maxConnections}</strong>个`,
            dangerouslyUseHTMLString: true
          });
        }
      }, targetEndpoint);

    },

    onRemoveNode(id){

      const list = this.chartData.nodes.filter((item) => {
        return item.id === id;
      });

      if(list.length !== 0) {

        const node = list[0];

        const { type,  } = node;

        switch (type) {

          case 'switch':

            this.removeSwitchNode(node);

            break;

          default:
            // 直接删除
            break;
        }

      }

    },

    removeSwitchNode(node){
      console.log(node);
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-chart{
  position: relative;

  min-height: 500px;

  .active {
    border: 1px dotted green;
  }

  .hover {
    border: 1px dotted red;
  }
}

.flow-node{
  position: absolute;
}

.flow-node
{
  width: 180px;
  height: 80px;


  z-index: 20;

  border: 1px solid #346789;
  box-shadow: 2px 2px 19px #aaa;
  -o-box-shadow: 2px 2px 19px #aaa;
  -webkit-box-shadow: 2px 2px 19px #aaa;
  -moz-box-shadow: 2px 2px 19px #aaa;
  -moz-border-radius: 0.5em;
  border-radius: 0.5em;

  opacity: 0.8;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
  background-color: #eeeeef;
  color: black;
  font-family: helvetica, sans-serif;
  font-size: 0.9em;
  -webkit-transition: -webkit-box-shadow 0.15s ease-in;
  -moz-transition: -moz-box-shadow 0.15s ease-in;
  -o-transition: -o-box-shadow 0.15s ease-in;
  transition: box-shadow 0.15s ease-in;



  .start-content,
  .end-content{
    background: #303962;

    line-height: 60px;
    text-align: center;
    color:#EAA2B8;
    font-size: 18px;
  }
  &:hover{
    box-shadow: 2px 2px 19px #444;
    -o-box-shadow: 2px 2px 19px #444;
    -webkit-box-shadow: 2px 2px 19px #444;
    -moz-box-shadow: 2px 2px 19px #444;
    opacity: 0.6;
  }

  .btn-remove{
    position: absolute;
    top: 3px;
    right: 3px;
    padding:0;
  }
}
</style>
