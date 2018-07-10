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
        <el-input v-model="searValue" class="searchInput" clearable placeholder="请输入内容">
          <el-button @click="handleSear" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button  type="success" plain @click="userFormVisible = true">
          添加用户
        </el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
     <el-table
      v-loading="loading"
      stripe
      border
      :data="list"
      style="width: 100%">
      <el-table-column
      type="index"
      width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>

      <el-table-column
        label="创建日期" >
        <template slot-scope="scope">
          {{scope.row.create_time | fmtDate('YYYY-MM-DD')}}
        </template>
      </el-table-column>

      <el-table-column
        label="用户状态" width="100">
        <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change='changeStatus(scope.row.id, scope.row.mg_state)'>
            </el-switch>
        </template>
      </el-table-column>

      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button @click="handelePut(scope.row.id)"  size="mini" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="handleDelete(scope.row.id)" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            <el-button @click="roleFormVisible = true" size="mini" type="success" icon="el-icon-check" circle></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加弹出层 -->
    <el-dialog title="添加用户" :visible.sync="userFormVisible">
        <el-form label-position="right" label-width="120px">
            <el-form-item label="用户名">
                <el-input v-model="form.username"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="form.email" ></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="form.mobile" ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="userFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handelePush">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 编辑弹出层 -->
    <el-dialog title="修改用户" :visible.sync="dialogFormVisible">
        <el-form label-position="right" label-width="120px" >
            <el-form-item label="用户名">
                <el-input disabled v-model="form.username"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="form.email" ></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="form.mobile" ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handelePuts">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="roleFormVisible">
      <el-form :model="form">
        <el-form-item label="当前用户">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="请选择角色">
          <el-select v-model="form.region" placeholder="请选择角色">
            <el-option label="主管" value="shanghai"></el-option>
            <el-option label="总监" value="beijing"></el-option>
            <el-option label="组长" value="beijing"></el-option>
            <el-option label="员工" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- @size-change 每页多少条数据发生改变 触发的事件 -->
    <!-- @current-change 当前页码改变发生 -->
    <!-- current-page 当前页码 -->
    <!-- page-sizes 每页多少条数据的下拉框 -->
    <!-- page-size 每页显示多少条数据 -->

    <!-- total  总条数 -->
    <!-- layout 分页所支持的功能 -->
    <!-- 分页 -->
     <el-pagination
      @size-change = "handleSizeChange"
      @current-change= "handleCurrentChange"
      :current-page= "pagenum"
      :page-sizes= "[2, 4, 6, 8]"
      :page-size= "pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
 </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: true,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: '',
        region: ''
      },
      userFormVisible: false,
      dialogFormVisible: false,
      roleFormVisible: false,
      id: '',
      // 分页相关数据
      // 页码
      pagenum: 1,
      // 每页条数
      pagesize: 4,
      // 总共的数据条数，从服务器获取
      total: 0,
      // 搜索
      searValue: ''
    };
  },
  created () {
    this.loadData();
  },
  methods: {
    // 分页
    handleSizeChange(val) {
    // size发生变化
      this.pagesize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
    // 页码发生变化
      this.pagenum = val;
      this.loadData();
    },
    // 查询数据
    async loadData () {
      this.loading = true;
      const token = sessionStorage.getItem('token');
      this.$http.defaults.headers.common['Authorization'] = token;
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searValue}`);
      this.loading = false;
      const data = res.data;
      const {meta: {msg, status}} = data;
      if (status === 200) {
        const {data: {users, total}} = data;
        this.list = users;
        this.total = total;
      } else {
        this.$message.error(msg);
      }
    },
    // 删除数据
    async handleDelete (id) {
      if (!confirm('确定要删除吗？')) {
        return;
      }
      const res = await this.$http.delete(`users/${id}`);
      console.log(res);
      const data = res.data;
      const { meta: {msg, status} } = data;
      if (status === 200) {
        this.$message.success(msg);
        this.loadData();
      } else {
        this.$message.error(msg);
      }
    },
    // 添加数据
    async handelePush () {
      // 点击确定关闭弹出层
      this.userFormVisible = false;
      const res = await this.$http.post('users', this.form);
      const data = res.data;
      const {meta: {msg, status}} = data;
      if (status === 201) {
        this.$message.success(msg);
        this.loadData();
        this.form = {
          username: '',
          password: '',
          email: '',
          mobile: ''
        };
      } else {
        this.$message.error(msg);
      }
    },
    // 编辑页面
    // 拿到Id渲染数据
    async handelePut (id) {
      // 因为有作用域，所以把id绑定到Data上,方便给编辑使用
      this.id = id;
      this.dialogFormVisible = true;
      const res = await this.$http.get(`users/${id}`);
      console.log(res);
      const data = res.data;
      console.log(data.data);
      this.form = data.data;
    },
    // 修改数据
    async handelePuts () {
      this.dialogFormVisible = false;
      const res = await this.$http.put(`users/${this.id}`, this.form);
      const data = res.data;
      const { meta: { status, msg } } = data;
      if (status === 200) {
        this.$message.success(msg);
        this.loadData();
      } else {
        this.$message.error(msg);
      }
    },
    // 修改状态
    async changeStatus (id, state) {
      const res = await this.$http.put(`users/${id}/state/${state}`);
      console.log(res);
      const data = res.data;
      const { meta: { msg, status } } = data;
      if (status === 200) {
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
      } else {
        this.$message.error(msg);
      }
    },
    // 搜索查询
    handleSear() {
      this.loadData();
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
  overflow: auto;
}
.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}
.searchArea .searchInput {
  width: 350px;
}
</style>
