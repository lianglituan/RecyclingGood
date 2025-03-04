<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

interface User {
  id: number
  account: string
  enterprise: string
  employeeName: string
  enterpriseAccount: string
  city: string
  organization: string
  managementScope: string
  role: string
  status: string
  hasAuditPermission: boolean
  updateBy: string
  updateTime: string
}

const tableData = ref<User[]>([{
  id: 1,
  account: 'admin001',
  enterprise: '测试企业A',
  employeeName: '张三',
  enterpriseAccount: 'testA001',
  city: '北京市',
  organization: '技术部',
  managementScope: '全部',
  role: '管理员',
  status: '启用',
  hasAuditPermission: true,
  updateBy: 'admin',
  updateTime: '2024-02-21'
},
{
  id: 2,
  account: 'user001',
  enterprise: '测试企业B',
  employeeName: '李四',
  enterpriseAccount: 'testB001',
  city: '上海市',
  organization: '销售部',
  managementScope: '部门',
  role: '普通用户',
  status: '启用',
  hasAuditPermission: false,
  updateBy: 'admin',
  updateTime: '2024-02-21'
}])
const dialogVisible = ref(false)
const editDialogVisible = ref(false)
const editingUser = ref<User | null>(null)

const formData = ref({
  account: '',
  enterprise: '',
  employeeName: '',
  enterpriseAccount: '',
  city: '',
  organization: '',
  managementScope: '',
  role: '',
  status: '启用',
  hasAuditPermission: false
})

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  enterprise: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  employeeName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  enterpriseAccount: [{ required: true, message: '请输入企业账号', trigger: 'blur' }],
  city: [{ required: true, message: '请选择所属地市', trigger: 'change' }],
  organization: [{ required: true, message: '请输入所属组织', trigger: 'blur' }],
  managementScope: [{ required: true, message: '请选择管理范围', trigger: 'change' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const formRef = ref()

const handleAdd = () => {
  formData.value = {
    account: '',
    enterprise: '',
    employeeName: '',
    enterpriseAccount: '',
    city: '',
    organization: '',
    managementScope: '',
    role: '',
    status: '启用',
    hasAuditPermission: false
  }
  dialogVisible.value = true
}

const handleEdit = (row: User) => {
  editingUser.value = row
  formData.value = { ...row }
  editDialogVisible.value = true
}

const handleDelete = (row: User) => {
  const index = tableData.value.findIndex(item => item.id === row.id)
  if (index !== -1) {
    tableData.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      const newUser = {
        id: tableData.value.length + 1,
        ...formData.value,
        updateTime: new Date().toISOString().split('T')[0],
        updateBy: 'admin' // 这里应该使用当前登录用户的信息
      }
      tableData.value.push(newUser)
      ElMessage.success('添加成功')
      dialogVisible.value = false
    }
  })
}

const handleEditSubmit = async () => {
  if (!formRef.value || !editingUser.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      const index = tableData.value.findIndex(item => item.id === editingUser.value?.id)
      if (index !== -1) {
        tableData.value[index] = <User>{
          ...editingUser.value,
          ...formData.value,
          updateTime: new Date().toISOString().split('T')[0],
          updateBy: 'admin' // 这里应该使用当前登录用户的信息
        }
        ElMessage.success('修改成功')
        editDialogVisible.value = false
        editingUser.value = null
      }
    }
  })
}

const handleStatusChange = (row: User) => {
  const index = tableData.value.findIndex(item => item.id === row.id)
  if (index !== -1) {
    tableData.value[index] = {
      ...row,
      status: row.status === '启用' ? '禁用' : '启用'
    }
    ElMessage.success(`已${tableData.value[index].status}该用户`)
  }
}
</script>

<template>
  <div class="users-container">
    <h1>用户管理</h1>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="handleAdd">添加用户</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="序号" width="80" />
        <el-table-column prop="account" label="账号" />
        <el-table-column prop="enterprise" label="企业" />
        <el-table-column prop="employeeName" label="员工姓名" />
        <el-table-column prop="enterpriseAccount" label="企业账号" />
        <el-table-column prop="city" label="所属地市" />
        <el-table-column prop="organization" label="员工所属组织" />
        <el-table-column prop="managementScope" label="管理范围" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="'启用'"
              :inactive-value="'禁用'"
              @change="() => handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="hasAuditPermission" label="审核权限" width="100">
          <template #default="{ row }">
            <el-tag :type="row.hasAuditPermission ? 'success' : 'info'">
              {{ row.hasAuditPermission ? '有' : '无' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="120" />
        <el-table-column prop="updateBy" label="更新人" width="100" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="添加用户"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="formData.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="企业名称" prop="enterprise">
          <el-input v-model="formData.enterprise" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="员工姓名" prop="employeeName">
          <el-input v-model="formData.employeeName" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="企业账号" prop="enterpriseAccount">
          <el-input v-model="formData.enterpriseAccount" placeholder="请输入企业账号" />
        </el-form-item>
        <el-form-item label="所属地市" prop="city">
          <el-select v-model="formData.city" placeholder="请选择所属地市" style="width: 100%">
            <el-option label="北京市" value="北京市" />
            <el-option label="上海市" value="上海市" />
            <el-option label="广州市" value="广州市" />
            <el-option label="深圳市" value="深圳市" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属组织" prop="organization">
          <el-input v-model="formData.organization" placeholder="请输入所属组织" />
        </el-form-item>
        <el-form-item label="管理范围" prop="managementScope">
          <el-select v-model="formData.managementScope" placeholder="请选择管理范围" style="width: 100%">
            <el-option label="全部" value="全部" />
            <el-option label="部门" value="部门" />
            <el-option label="个人" value="个人" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="管理员" />
            <el-option label="普通用户" value="普通用户" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="formData.status"
            :active-value="'启用'"
            :inactive-value="'禁用'"
          />
        </el-form-item>
        <el-form-item label="审核权限">
          <el-switch v-model="formData.hasAuditPermission" />
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
      title="编辑用户"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="formData.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="企业名称" prop="enterprise">
          <el-input v-model="formData.enterprise" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="员工姓名" prop="employeeName">
          <el-input v-model="formData.employeeName" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="企业账号" prop="enterpriseAccount">
          <el-input v-model="formData.enterpriseAccount" placeholder="请输入企业账号" />
        </el-form-item>
        <el-form-item label="所属地市" prop="city">
          <el-select v-model="formData.city" placeholder="请选择所属地市" style="width: 100%">
            <el-option label="北京市" value="北京市" />
            <el-option label="上海市" value="上海市" />
            <el-option label="广州市" value="广州市" />
            <el-option label="深圳市" value="深圳市" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属组织" prop="organization">
          <el-input v-model="formData.organization" placeholder="请输入所属组织" />
        </el-form-item>
        <el-form-item label="管理范围" prop="managementScope">
          <el-select v-model="formData.managementScope" placeholder="请选择管理范围" style="width: 100%">
            <el-option label="全部" value="全部" />
            <el-option label="部门" value="部门" />
            <el-option label="个人" value="个人" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="管理员" />
            <el-option label="普通用户" value="普通用户" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="formData.status"
            :active-value="'启用'"
            :inactive-value="'禁用'"
          />
        </el-form-item>
        <el-form-item label="审核权限">
          <el-switch v-model="formData.hasAuditPermission" />
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
.users-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.users-container h1 {
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.box-card {
  flex: 1;
  display: flex;
  flex-direction: column;
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