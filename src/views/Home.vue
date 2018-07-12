<template>
  <el-container class="container">
      <el-header class="header">
        <el-row>
          <el-col :span="4">
            <img src="../../static/logo.png" alt="">
          </el-col>

           <el-col class="middle" :span="19">
            <h2>电商后台管理</h2>
          </el-col>

           <el-col :span="1">
            <a @click.prevent="handleLogout" class="logout" href="#">退出</a>
          </el-col>
        </el-row>
      </el-header>
      <el-container class="container">
        <el-aside class="aside" width="200px">
         <!-- 侧边栏 -->
        <el-menu
          :router="true"
          :unique-opened="true"
          class="menu">

          <el-submenu
          v-for="itme in menus"
          :key="itme.id"
          :index="itme.id + ''">

            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{itme.authName}}</span>
            </template>

            <el-menu-item
            v-for="itme2 in itme.children"
            :key="itme2.id"
            :index="'/'+itme2.path">
              <i class="el-icon-menu"></i>
              {{itme2.authName}}
            </el-menu-item>

          </el-submenu>

        </el-menu>
      </el-aside>
        <el-main class="main">
          <!-- 给匹配路由的占位 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: []
    };
  },
  created() {
    this.loadData();
  },
  // 判断是否登录
  beforeCreate() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      // 如果没有返回登录页
      this.$router.push({name: 'login'});
      // 提示
      this.$message.warning('请先登录');
    }
  },
  methods: {
    handleLogout() {
      sessionStorage.clear();
      this.$router.push({name: 'login'});
      this.$message.warning('退出成功');
    },
    async loadData() {
      const { data: resData } = await this.$http.get('menus');
      const { data, meta: {status, msg} } = resData;

      if (status === 200) {
        this.menus = data;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.container {
  height: 100%;
}

.header {
  background-color: #b3c0d1;
  padding: 0;
}

.header .middle {
  line-height: 60px;
  color: #ffffff;
  margin: 0;
  text-align: center;
}

.header .logout {
  line-height: 60px;
}

.aside {
  background-color: #d3dce6;
}

.aside .menu {
  height: 100%;
}

.main {
  background-color: #e9eef3;
  height: 100%;
}
</style>
