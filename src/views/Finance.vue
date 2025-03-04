<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

interface FinanceRecord {
  id: number
  date: string
  type: string
  description: string
  amount: number
  status: string
}

const tableData = ref<FinanceRecord[]>([])
const dialogVisible = ref(false)
const formData = ref({
  type: '',
  description: '',
  amount: 0,
  status: '已确认'
})

const handleAdd = () => {
  formData.value = {
    type: '',
    description: '',
    amount: 0,
    status: '已确认'
  }
  dialogVisible.value = true
}

const handleSubmit = () => {
  const newRecord = {
    id: tableData.value.length + 1,
    date: new Date().toISOString().split('T')[0],
    ...formData.value
  }
  tableData.value.push(newRecord)
  ElMessage.success('添加成功')
  dialogVisible.value = false
}

const handleDelete = (row: FinanceRecord) => {
  const index = tableData.value.findIndex(item => item.id === row.id)
  if (index !== -1) {
    tableData.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}
</script>

<template>
  <div class="finance-container">
    <h1>财务管理</h1>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>财务记录</span>
          <el-button type="primary" @click="handleAdd">新增记录</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="记录ID" width="100" />
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="新增记录"
      width="500px"
    >
      <el-form :model="formData" label-width="100px">
        <el-form-item label="类型">
          <el-input v-model="formData.type" placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" placeholder="请输入描述" />
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
.finance-container {
  padding: 20px;
  min-height: 100vh;
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
}

.el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.el-table {
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>