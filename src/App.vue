<script setup lang="ts">
import { ref } from 'vue'
import { ElMenu, ElMenuItem } from 'element-plus'
import 'element-plus/dist/index.css'

const isCollapse = ref(false)
</script>

<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <el-menu
        default-active="1"
        class="el-menu-vertical"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/phone-purchase" @click="$router.push('/phone-purchase')">
          <el-icon><iphone /></el-icon>
          <span>手机收购管理</span>
        </el-menu-item>
        <el-menu-item index="/inventory" @click="$router.push('/inventory')">
          <el-icon><document /></el-icon>
          <span>库存管理</span>
        </el-menu-item>
        <el-menu-item index="/sales" @click="$router.push('/sales')">
          <el-icon><setting /></el-icon>
          <span>销售管理</span>
        </el-menu-item>
        <el-menu-item index="/finance" @click="$router.push('/finance')">
          <el-icon><money /></el-icon>
          <span>资金流水</span>
        </el-menu-item>
        <el-menu-item index="/users" @click="$router.push('/users')">
          <el-icon><user /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container class="main-container">
      <el-header height="60px">
        <div class="header-left">
          <el-icon class="toggle-button" @click="isCollapse = !isCollapse">
            <expand v-if="isCollapse" />
            <fold v-else />
          </el-icon>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
}

.sidebar {
  height: 100vh;
  background-color: #304156;
  transition: width 0.3s;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  overflow-x: hidden;
  overflow-y: auto;
}

.main-container {
  flex: 1;
  margin-left: 200px;
  transition: margin-left 0.3s;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.layout-container:has(.sidebar[width="64px"]) .main-container {
  margin-left: 64px;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  padding: 0 20px;
  width: 100%;
}

.el-main {
  background-color: #f5f7fa;
  padding: 0;
  height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  width: 100%;
}
</style>
