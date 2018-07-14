<template>
  <el-card class="box-card">
    <el-row class="row-add">
    </el-row>
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
      <!-- 步骤条 -->
      <el-steps :active="0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!-- 标签页 -->
      <el-tabs tab-position="left">
        <el-tab-pane label="基本信息">
          <el-form ref="form" :model="form" label-width="80px" label-position="top">
            <el-form-item label="商品名称">
              <el-input v-model="form.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格">
              <el-input v-model="form.goods_price"></el-input>
            </el-form-item>

            <el-form-item label="商品数量">
              <el-input v-model="form.goods_number"></el-input>
            </el-form-item>

            <el-form-item label="商品重量">
              <el-input v-model="form.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <CategoryCascader
              type="3"
              @gaibianle="handleGaiBianLe"></CategoryCascader>
            </el-form-item>
            <el-form-item>
              <el-button @click="handleAdd" type="primary">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片">配置管理</el-tab-pane>
        <el-tab-pane label="商品内容">角色管理</el-tab-pane>
      </el-tabs>
  </el-card>
</template>

<script>
import CategoryCascader from '@/components/CategoryCascader';

export default {
  data() {
    return {
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
      }
    }
  },
  methods: {
    async handleAdd() {
     const { data: resData } = await this.$http({
        url: 'goods',
        data: this.form,
        method: 'post'
      });
      const { meta: { status, msg } } = resData;
      if (status === 201) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    handleGaiBianLe(data) {
      this.form.goods_cat = data.join(',');
    }
  },
  components: {
    CategoryCascader
  }
};
</script>

<style>

</style>
