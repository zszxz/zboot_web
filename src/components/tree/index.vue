<template>
  <el-select
    v-model="fromData[parentId]"
    placeholder="请选择父节点"
    style="width: 200px"
    ref="topTreeRef"
  >
    <el-option
      :value="fromData[parentId]"
      :label="fromData.parentName"
      style="width: 300px;height:200px;overflow: auto;background-color:#fff"
    >
      <el-tree :data="treeData" :props="defaultProps" @node-click="handleAddNodeClick"></el-tree>
    </el-option>
  </el-select>
</template>

<script>
// parentName 是虚拟父名称，只用于下拉框显示，实际传给后端时不需要
export default {
  name: "tree",
  props: {
    parentId: {
      type: String,
      required: true
    },
    nodeName: {
      type: String,
      required: true
    },
    nodeId: {
      type: String,
      required: true
    },
    treeData: {
      type: Array,
      required: true
    },
    fromData: {
      required: true,
      type: Object
    },
    childrenName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      defaultProps: {
        children: this.childrenName,
        label: this.nodeName
      }
    };
  },
  computed: {},
  methods: {
    handleAddNodeClick(node) {
      this.$set(this.fromData, this.parentId, node[this.nodeId]);
      this.$set(this.fromData, "parentName", node[this.nodeName]);
      this.$refs.topTreeRef.blur();
    }
  }
};
</script>