<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>

    <el-row class="row-add">
      <el-col :span="24">
        <el-button @click="handleShowAdd" type="success" plain>添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      stripe
      border
      :data="list"
      style="width: 100%">

      <!-- tree grid
        treeKey 绑定到id，给每一个节点设置一个唯一值
        parentKey 绑定到父id属性，区分父子节点
        levelKey 绑定到层级的属性
        childKey 绑定到存储子元素的属性
       -->
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        :indentSize="30">
      </el-tree-grid>
      <!-- <el-table-column
        prop="cat_name"
        label="分类名称"
        width="180">
      </el-table-column> -->
      <el-table-column
        label="级别"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有效">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '无效' : '有效' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleShowEdit(scope.row)" plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
          <el-button @click="handleDelete(scope.row)" plain size="mini" type="danger" icon="el-icon-delete" ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加表单 -->
    <el-dialog title="添加商品分类" :visible.sync="addDiaLogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="100px">
          <el-input v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" label-width="100px">
            <div class="block">
              <el-cascader
                expand-trigger="hover"
                change-on-select
                clearable
                placeholder="默认一级分类添加"
                :options="options"
                v-model="selectedOptions2"
                :props="{
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children'
                }">
              </el-cascader>
            </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDiaLogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加表单 -->
    <el-dialog title="编辑商品分类" :visible.sync="editDiaLogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="100px">
          <el-input v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDiaLogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 1. npm install element-tree-grid
// 2. 引入组件
// 3. 局部注册组件
import ElTreeGrid from 'element-tree-grid';

export default {
  data() {
    return {
      list: [],
      loading: true,
      // 分页数据
      pagenum: 1,
      pagesize: 5,
      total: 0,
      // 添加框
      addDiaLogFormVisible: false,
      // 添加数据
      form: {
        cat_name: ''
      },
      // 级联选择器
      selectedOptions2: [],
      options: [],
      // 编辑弹框
      editDiaLogFormVisible: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载列表数据
    async loadData() {
      this.loading = true;
      const { data: resData } = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;

      const { data: { result, total } } = resData;
      this.list = result;
      // 获取总条数
      this.total = total;
    },
    // 分页方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    },
    // 添加表单显示框
    async handleShowAdd() {
      this.addDiaLogFormVisible = true;
      const res = await this.$http.get('categories?type=' + 2);
      this.options = res.data.data;
    },
    // 添加数据
    async handleAdd() {
      let tobal = 0;
      if (this.selectedOptions2[0]) {
        tobal = this.selectedOptions2[this.selectedOptions2.length - 1];
      };
      const formData = {
        ...this.form,
        cat_pid: tobal,
        cat_level: this.selectedOptions2.length
      };
      const res = await this.$http({
        url: 'categories',
        method: 'post',
        data: formData
      });
      const { meta: { status, msg } } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        this.loadData();
        this.addDiaLogFormVisible = false;
      } else {
        this.$message.error(msg);
      }
    },
    // 删除数据
    async handleDelete(row) {
      const res = await this.$http.delete(`categories/${row.cat_id}`);
      const { data: {meta: {status, msg}} } = res;
      if (status === 200) {
        this.$message.success(msg);
        this.loadData();
      } else {
        this.$message.error(msg);
      }
    },
    // 编辑弹框
    handleShowEdit(row) {
      this.editDiaLogFormVisible = true;
      this.form = row;
    },
    // 编辑数据
    async handleEdit() {
      const { catId, catName } = this.form;
      console.log(this.form);
      const { data: resData } = await this.$http.put(`categories/${catId}`, {cat_name: catName});
      const { meta: { status, msg } } = resData;
      if (status === 200) {
        this.$message.success(msg);
        this.loadData();
        this.editDiaLogFormVisible = false;
      } else {
        this.$message.error(msg);
      }
    }
  },
  components: {
    ElTreeGrid
  }
};
</script>

<style>
.row-add {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
