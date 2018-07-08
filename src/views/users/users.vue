<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link :to="{ name: 'users'}">用户管理</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input class="searchInput" clearable placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
 </el-card>
</template>

<script>
export default {

};
</script>

<style>
.box-card {
  height: 100%;
}

.searchArea {
  margin: 10px 0;
}

.searchArea .searchInput {
  width: 350px;
}
</style>
