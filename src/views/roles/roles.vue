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
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
          class="level1"
          v-for="itme1 in scope.row.children"
          :key="itme1.id">
            <!-- 一级权限列表 -->
            <el-col :span="4">
              <el-tag @close="hanldeClose(scope.row, itme1.id)" closable>{{itme1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>

            <el-col :span="20">
              <!-- 二级权限列表 -->
              <el-row
              v-for="itme2 in itme1.children"
              :key="itme2.id">
                <el-col :span="4">
                  <el-tag @close="hanldeClose(scope.row, itme2.id)" closable type="success">{{itme2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>

                </el-col>
                <el-col :span="20">
                  <!-- 三级权限列表 -->
                  <el-tag
                  v-for="itme3 in itme2.children"
                  @close="hanldeClose(scope.row, itme3.id)"
                  :key="itme3.id"
                  type="warning"
                  closable
                  class="level3">
                    {{itme3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <!-- 没有权限的时候显示 -->
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">未分配权限</el-col>
          </el-row>
        </template>
      </el-table-column>
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
            <el-button @click="handleEdit(scope.row)" size="mini" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="handleDelete(scope.row.id)" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            <el-button @click="handleShowRightsDialog(scope.row)" size="mini" type="success" icon="el-icon-check" circle></el-button>
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
     <!-- 编辑弹出层 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
        <el-form
        label-position="right"
        label-width="120px"
        :model="form">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="form.roleName"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="form.roleDesc" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handeleEdit">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 分配权限对话框  -->
    <el-dialog
      @open="handleOpenDialog"
      title="分配权限"
      :visible.sync="dialogVisible">
      <el-tree
      ref="tree"
      :data="streeData"
      :props="defaultProps"
      node-key="id"
      :default-checked-keys="checkedList"
      show-checkbox
      default-expand-all>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSeRights">确 定</el-button>
      </span>
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
      },
      // 编辑弹出框
      dialogFormVisible: false,
      roleId: '',
      // 控制分配权限的对话框
      dialogVisible: false,
      // 绑定tree所需要的数据
      streeData: [],
      // 配置要展示数据中的那个属性
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 获取要选择的节点id
      checkedList: [],
      // 记录row.id，方便要修改
      currentRoleId: ''
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
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 包裹 await 的函数都需要加上async
        const res = await this.$http.delete(`roles/${id}`);
        // 服务器返回的数据
        const data = res.data;
        // meta内部的status和msg
        const { meta: { status, msg } } = data;
        if (status === 200) {
          // 删除成功 重新加载数据
          this.loadData();

          this.$message({
            type: 'success',
            message: msg
          });
        } else {
          this.$message.error(msg);
        }
      }).catch(() => {
        // 点击取消按钮执行
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 编辑数据渲染
    async handleEdit(user) {
      console.log(user);
      this.dialogFormVisible = true;
      this.form.roleName = user.roleName;
      this.form.roleDesc = user.roleDesc;
      this.roleId = user.id;
    },
    // 编辑数据修改
    async handeleEdit() {
      console.log(this.form.roleName);
      const res = await this.$http.put(`roles/${this.roleId}`, this.form);
      // 解析数据
      const data = res.data;
      const { meta: { status, msg } } = data;
      // 判断
      if (status === 200) {
        // 修改成功
        // 提示成功
        this.$message.success(msg);
        // 关闭对话框
        this.dialogFormVisible = false;
        // 重新加载列表
        this.loadData();
      } else {
        this.$message.error(msg);
      }
    },
    // 点击删除tag
    async hanldeClose(role, rightId) {
      const { data: resData } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      const { data, meta: { status, msg } } = resData;
      if (status === 200) {
        // 成功
        this.$message.success(msg);
        // 重新绑定当前角色的children 权限
        role.children = data;
      } else {
        // 失败
        this.$message.error(msg);
      }
    },
    // 点击获取权限列表选择项
    async handleOpenDialog() {
      const { data: resData } = await this.$http.get('rights/tree');
      const { data } = resData;
      this.streeData = data;
    },
    // 点击按钮显示分配权限对话框
    async handleShowRightsDialog(role) {
      // 记录角色id， 分配权限的时候使用
      this.currentRoleId = role.id;

      this.dialogVisible = true;
      // 获取当前角色所拥有的权限的id

      // 遍历一级权限
      const arr = [];
      role.children.forEach((item1) => {
        // arr.push(item1.id);
        // 遍历二级权限
        item1.children.forEach((item2) => {
          // arr.push(item2.id);
          // 遍历三级权限
          item2.children.forEach((item3) => {
            arr.push(item3.id);
          });
        });
      });
      this.checkedList = arr;
    },
    // 点击确定分配权限
    async handleSeRights() {
      // 获取全选和半选的id
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      const newArray = [...checkedKeys, ...halfCheckedKeys];

      const { data: resData } = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: newArray.join(',')
      });

      const { meta: { status, msg } } = resData;
      if (stats === 200) {
        this.dialogFormVisible = false;
        this.$message.success(msg);
        this.loadData();
      } else {
        this.$message.error(msg);
      }
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

.level3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
.level1 {
  margin-bottom: 10px;
}
</style>
