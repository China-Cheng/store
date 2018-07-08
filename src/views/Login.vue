<template>
  <div class="login-wrap">
    <el-form
    class="login-form"
      label-position="top"
      label-width="80px"
      :model="fromData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="fromData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="fromData.password"></el-input>
      </el-form-item>
      <el-button class="login-btn" type="primary" @click="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 绑定表单数据
      fromData: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    // 点击按钮登陆
    async handleLogin() {
      const res = await this.$http.post('login', this.fromData);
      const data = res.data;
      console.log(data);
      const { meta: { status, msg } } = data;
      if (status === 200) {
        this.$message.success(msg);
        const { data: { token } } = data;
        sessionStorage.setItem('token', token);
      } else {
        this.$message.error(msg);
      }
    // handleLogin() {
    //   this.$http
    //     .post('login', this.fromData)
    //     .then((res) => {
    //       console.log(res);
    //       // {data:{},meta:{status:200,msg:""}}
    //       // const { data: { data: { token }, meta: {status, msg} }}
    //       const data = res.data;
    //       const { meta: { status, msg } } = data;
    //       if (status === 200) {
    //         // 登陆成功
    //         const token = data.data.token;
    //         // 跳转到后台页面
    //         // 记录token,seetionStotage
    //         sessionStorage.setItem('token', token);
    //         this.$message.success(msg);
    //       } else {
    //         // 失败
    //         this.$message.error(msg);
    //       }
    //     });
    }
  }
};
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-form .login-btn {
  width: 100%;
}
</style>
