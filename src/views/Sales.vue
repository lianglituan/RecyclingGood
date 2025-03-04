<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

interface SalesRecord {
  id: number
  date: string
  product: string
  quantity: number
  amount: number
  status: string
}

const tableData = ref<SalesRecord[]>([])
const dialogVisible = ref(false)
const formData = ref({
  product: '',
  quantity: 1,
  amount: 0,
  status: '已完成'
})

const handleAdd = () => {
  formData.value = {
    product: '',
    quantity: 1,
    amount: 0,
    status: '已完成'
  }
  dialogVisible.value = true
}

const handleSubmit = () => {
  const newSale = {
    id: tableData.value.length + 1,
    date: new Date().toISOString().split('T')[0],
    ...formData.value
  }
  tableData.value.push(newSale)
  ElMessage.success('添加成功')
  dialogVisible.value = false
}

const handleVoid = (row: SalesRecord) => {
  const index = tableData.value.findIndex(item => item.id === row.id)
  if (index !== -1) {
    tableData.value[index] = {
      ...row,
      status: '已作废'
    }
    ElMessage.success('订单已作废')
  }
}
</script>

<template>
  <div class="sales-container">
    <h1>销售管理</h1>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>销售记录</span>
          <el-button type="primary" @click="handleAdd">新增销售</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="订单ID" width="100" />
        <el-table-column prop="date" label="销售日期" width="180" />
        <el-table-column prop="product" label="商品名称" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small">详情</el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="handleVoid(row)"
              :disabled="row.status === '已作废'"
            >作废</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="新增销售"
      width="500px"
    >
      <el-form :model="formData" label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="formData.product" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="formData.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="金额">
          <el-input-number v-model="formData.amount" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.sales-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.box-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  width: 100%;
}

.el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.el-table {
  flex: 1;
  width: 100% !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>