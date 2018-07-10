<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link :to="{ name: 'rights'}">权限管理</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table
      border
      stripe
      class="tb"
      :data="list"
      style="width: 100%">
       <el-table-column
        type="index"
        width="50">
      </el-table-column>

      <el-table-column
        prop="authName"
        label=权限名称
        width="180">
      </el-table-column>

      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>

      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else-if="scope.row.level === '2'">一级</span>
        </template>
      </el-table-column>
    </el-table>
 </el-card>
</template>
<script>
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$http.get('rights/list');
      this.list = res.data.data;
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}

.tb {
  margin-top: 10px;
}
</style>
