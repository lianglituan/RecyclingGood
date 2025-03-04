<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

interface InventoryItem {
  id: number
  name: string
  quantity: number
  price: number
}

const tableData = ref<InventoryItem[]>([])
const dialogVisible = ref(false)
const editDialogVisible = ref(false)
const editingItem = ref<InventoryItem | null>(null)

const formData = ref({
  name: '',
  quantity: 0,
  price: 0
})

const handleAdd = () => {
  formData.value = {
    name: '',
    quantity: 0,
    price: 0
  }
  dialogVisible.value = true
}

const handleEdit = (row: InventoryItem) => {
  editingItem.value = row
  formData.value = { ...row }
  editDialogVisible.value = true
}

const handleDelete = (row: InventoryItem) => {
  const index = tableData.value.findIndex(item => item.id === row.id)
  if (index !== -1) {
    tableData.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}

const handleSubmit = () => {
  const newItem = {
    id: tableData.value.length + 1,
    ...formData.value
  }
  tableData.value.push(newItem)
  ElMessage.success('添加成功')
  dialogVisible.value = false
}

const handleEditSubmit = () => {
  if (!editingItem.value) return
  const index = tableData.value.findIndex(item => item.id === editingItem.value?.id)
  if (index !== -1) {
    tableData.value[index] = {
      ...editingItem.value,
      ...formData.value
    }
    ElMessage.success('修改成功')
    editDialogVisible.value = false
    editingItem.value = null
  }
}
</script>

<template>
  <div class="inventory-container">
    <h1>库存管理</h1>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>库存列表</span>
          <el-button type="primary" @click="handleAdd">添加商品</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="quantity" label="库存数量" width="120" />
        <el-table-column prop="price" label="单价" width="120">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="添加商品"
      width="500px"
    >
      <el-form :model="formData" label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="formData.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input-number v-model="formData.quantity" :min="0" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="formData.price" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="editDialogVisible"
      title="编辑商品"
      width="500px"
    >
      <el-form :model="formData" label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="formData.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input-number v-model="formData.quantity" :min="0" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="formData.price" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.inventory-container {
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