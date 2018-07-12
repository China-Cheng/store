<template>
  <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        {{this.leval1}}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{this.leval2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  name: 'MyBreadcrumb',
  props: ['leval1', 'leval2']
};
</script>

<style>

</style>
