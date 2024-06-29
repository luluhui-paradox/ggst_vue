<template>
  <el-menu
    style="border-bottom: 0;"
    mode="horizontal"
    background-color="#811104"
    text-color="aqua"
    :ellipsis="false"
    
    @select="handleSelect"
  >
    <el-menu-item index="1">
      <router-link to="/home" style="text-decoration: none;font-size: larger"><strong>Rating update</strong></router-link>
    </el-menu-item>
    
    <el-menu-item index="2">
      <router-link to="/top100" style="text-decoration: none;">
        top100
      </router-link>
    </el-menu-item>

    <el-menu-item index="3">
      <router-link to="/top100" style="text-decoration: none;">
        Match up
      </router-link>
    </el-menu-item>

    <el-sub-menu index="4">
      <template #title>Characters</template>
      <el-menu-item v-for="item in char_list">{{item}}</el-menu-item>
    </el-sub-menu>

    <!--search bar-->
    <div style="flex-grow: 1;">
      
    </div>
    <el-menu-item index="5">
      
        <el-form :inline="true" :model="formInline">
          <el-form-item>
            <el-input v-model="formInline.username" placeholder="GG PLAYER" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">search</el-button>
          </el-form-item>
        </el-form>
      
    </el-menu-item>
    
    
  </el-menu>
</template>

<script setup>


import { onBeforeMount, onMounted, ref } from 'vue';
import { reactive } from 'vue';


const char_list=["ky","sol","ba","br"];
const formInline = reactive({
  username: '',
})

const onSubmit=()=>{
  console.log(formInline.username);
}



</script>
<style scoped lang="css">
  .el-sub-menu{
    border: 0;
    border-radius: 0;
  }
  .el-menu{
    border:0;
  }
</style>
