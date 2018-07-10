<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link :to="{ name: 'rights'}">权限管理</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button @click="userFormVisible = true" class="addRoles">添加角色</el-button>
    <!-- 表格 -->
    <el-table
      stripe
      border
      :data="list"
      style="width: 100%">
      <el-table-column
      type="index"
      width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="300">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button size="mini" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="handleDelete(scope.row.id)" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            <el-button size="mini" type="success" icon="el-icon-check" circle></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加弹出层 -->
    <el-dialog title="添加用户" :visible.sync="userFormVisible">
        <el-form
        label-position="right"
        label-width="120px"
        :model="form"
        :rules="formRules"
        ref="myform">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="form.roleName"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="form.roleDesc" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="userFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handelePush">确 定</el-button>
        </div>
    </el-dialog>
 </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      // 添加弹出框
      userFormVisible: false,
      // 添加数据
      form: {
        roleName: '',
        roleDesc: ''
      },
      // 添加表单的验证规则
      formRules: {
        roleName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 渲染数据
    async loadData() {
      const res = await this.$http.get('roles');
      const data = res.data;
      this.list = data.data;
    },
    // 点击添加数据
    async handelePush() {
      // 表单的 DOM对象 this.$refs.myform
      this.$refs.myform.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请完整输入内容');
        }
        // 表单验证成功，添加的操作
        const res = await this.$http.post('roles', this.form);
        // 相当于回调函数中的处理
        const data = res.data;
        const { meta: { status, msg } } = data;
        if (status === 201) {
          // 添加成功
          // 隐藏对话框
          this.userFormVisible = false;
          // 提示成功
          this.$message.success(msg);
          // 重新加载数据
          this.loadData();
          // 清空文本框的值
          for (let key in this.formData) {
            this.form[key] = '';
          }
        } else {
          this.$message.error(msg);
        }
      });
    },
    // 删除数据
    async handleDelete(id) {
      const res = await this.$http.delete(`roles/${id}`);
      console.log(res);
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
  overflow: auto;
}

.addRoles {
  margin-top: 10px;
}
</style>
