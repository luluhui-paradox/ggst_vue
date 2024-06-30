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
    <el-row type="flex" justify="center" align="middle" class="wwc_last_item">
    
        <el-form :inline="true" :model="formInline" >
          <el-form-item >
            <el-input v-model="formInline.username" placeholder="GG PLAYER" clearable />
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="onSubmit">search</el-button>
          </el-form-item>
        </el-form>
      
    </el-row>
    
    
  </el-menu>
</template>

<script setup>


import { onBeforeMount, onMounted, ref } from 'vue';
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute,useRouter } from 'vue-router';

const char_list=["ky","sol","ba","br"];
const formInline = reactive({
  username: '',
})

const router = useRouter();

const onSubmit=()=>{
  
  if(formInline.username==""||formInline.username==null){
    ElMessage.error('you must input username')
  }else{
    router.push({
      name:"UserSearchResult",
      query:{
        username:formInline.username
      }
    })
  }
}



</script>

<style scoped lang="scss">
  .el-sub-menu{
    border: 0;
    border-radius: 0;
  }
  .el-menu{
    border:0;
  }
  .el-form-item{
    margin-bottom: 0;
  }
  .wwc_last_item:hover{
    background-color: #811104!important;
  }



  /deep/.el-input__inner{
    background-color: #0a0a0a;
    border-color: #0a0a0a!important;
    
  }

  /deep/ .el-input__wrapper{
    background-color: #0a0a0a;
    border-color: #0a0a0a!important;
  }

  .el-input{
    -el-input-border:#0a0a0a;
    
  }
  

  .el-input:hover{
    border-color: #0a0a0a;
  }

  .el-button{
    background-color: #c00000;
    border:none;
    border-color: #0a0a0a;
  }

  .el-button:hover{
    background-color: #680e03;
    border-color: #0a0a0a;
  }


  
</style>
