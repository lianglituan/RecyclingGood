<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

interface PhonePurchase {
  id: number
  model: string
  price: number
  condition: string
  seller: string
  contact: string
  purchaseDate: string
  status: string
}

const tableData = ref<PhonePurchase[]>([
  {
    id: 1,
    model: 'iPhone 13',
    price: 3000,
    condition: '95新',
    seller: '张三',
    contact: '13800138000',
    purchaseDate: '2024-02-21',
    status: '待验机'
  }
])

const editingRecord = ref<PhonePurchase | null>(null)
const editDialogVisible = ref(false)

const handleEdit = (row: PhonePurchase) => {
  editingRecord.value = row
  formData.value = { ...row }
  editDialogVisible.value = true
}

const dialogVisible = ref(false)
const formData = ref({
  model: '',
  price: 0,
  condition: '',
  seller: '',
  contact: '',
  status: '待验机'
})

const handleAdd = () => {
  dialogVisible.value = true
}

const rules = {
  model: [{ required: true, message: '请输入手机型号', trigger: 'blur' }],
  price: [{ required: true, message: '请输入收购价格', trigger: 'blur' }],
  condition: [{ required: true, message: '请输入手机成色', trigger: 'blur' }],
  seller: [{ required: true, message: '请输入卖家姓名', trigger: 'blur' }],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

const formRef = ref()

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      const newPurchase = {
        id: tableData.value.length + 1,
        ...formData.value,
        purchaseDate: new Date().toISOString().split('T')[0]
      }
      tableData.value.push(newPurchase)
      ElMessage.success('添加成功')
      dialogVisible.value = false
      formData.value = {
        model: '',
        price: 0,
        condition: '',
        seller: '',
        contact: '',
        status: '待验机'
      }
    }
  })
}

const handleEditSubmit = async () => {
  if (!formRef.value || !editingRecord.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      const index = tableData.value.findIndex(item => item.id === editingRecord.value?.id)
      if (index !== -1) {
        tableData.value[index] = <PhonePurchase>{
          ...editingRecord.value,
          ...formData.value
        }
        ElMessage.success('修改成功')
        editDialogVisible.value = false
        editingRecord.value = null
      }
    }
  })
}

const handleVerify = (row: PhonePurchase) => {
  const index = tableData.value.findIndex(item => item.id === row.id)
  if (index !== -1) {
    tableData.value[index] = {
      ...row,
      status: '已验机'
    }
    ElMessage.success('验机确认成功')
  }
}
</script>

<template>
  <div class="phone-purchase">
    <h1>手机收购管理</h1>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>收购记录</span>
          <el-button type="primary" @click="handleAdd">新增收购</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="model" label="手机型号" />
        <el-table-column prop="price" label="收购价格" width="120">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="condition" label="成色" width="100" />
        <el-table-column prop="seller" label="卖家" width="100" />
        <el-table-column prop="contact" label="联系方式" width="120" />
        <el-table-column prop="purchaseDate" label="收购日期" width="120" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              type="primary" 
              size="small" 
              @click="handleVerify(row)"
              :disabled="row.status === '已验机'"
            >验机</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="新增收购"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="手机型号" prop="model">
          <el-input v-model="formData.model" placeholder="请输入手机型号" />
        </el-form-item>
        <el-form-item label="收购价格" prop="price">
          <el-input-number v-model="formData.price" :min="0" />
        </el-form-item>
        <el-form-item label="成色" prop="condition">
          <el-input v-model="formData.condition" placeholder="请输入手机成色" />
        </el-form-item>
        <el-form-item label="卖家姓名" prop="seller">
          <el-input v-model="formData.seller" placeholder="请输入卖家姓名" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="formData.contact" placeholder="请输入联系方式" />
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
      title="编辑收购信息"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="手机型号" prop="model">
          <el-input v-model="formData.model" placeholder="请输入手机型号" />
        </el-form-item>
        <el-form-item label="收购价格" prop="price">
          <el-input-number v-model="formData.price" :min="0" />
        </el-form-item>
        <el-form-item label="成色" prop="condition">
          <el-input v-model="formData.condition" placeholder="请输入手机成色" />
        </el-form-item>
        <el-form-item label="卖家姓名" prop="seller">
          <el-input v-model="formData.seller" placeholder="请输入卖家姓名" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="formData.contact" placeholder="请输入联系方式" />
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
.phone-purchase {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #f5f7fa;
  overflow: hidden;
}

.box-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  width: 100%;
  overflow: auto;
}

.el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: auto;
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
  padding: 0 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>