<template>
    <el-row type="flex" justify="center" align="middle" style="background-color:#c00000;height: 132px;">
        <el-col :span="24">
            <el-row type="flex" justify="center">
                <p style="color: aqua;"><h2>search : {{$route.query.username}}</h2></p>
            </el-row>
        </el-col>
    </el-row>
    
    <!--show user detail page-->
    <el-row type="flex" justify="center" align="middle">
        <ul style="padding-left: 0;margin-top: 10px" v-for="item in tableData">
          <li class="li_nopond">
            <router-link :to="{path:'/userDetail',query:{ username:item.name,userid:item.id,char_shot:item.character_short }}" class="wwc_link">
              <span style="color: darkorange;font-size: large;">{{ item.platform }}</span>&nbsp&nbsp
              <span style="color: aqua;font-size: large;">{{item.character}} {{item.rating_value}}&#177{{item.rating_deviation}}  {{item.game_count}}</span>
            </router-link>
          </li>
        </ul>
    </el-row>
</template>

<script setup>
import axios from 'axios';
import { reactive } from 'vue';
import { useRoute,useRouter } from 'vue-router';

//get query param
const route = useRoute();
const queryParams = route.query;
var _username=queryParams.username;
var _userid=queryParams.userid;
var _character_short=queryParams.char_shot;
const tableData=reactive([]);
//axios to get current user
axios.get("https://localhost:7018/api/searchUserExt",{params:{username:_username,userid:_userid}})
  .then((response)=> {
    if(response.status=="200"){
      tableData.push(...response.data)  
    }
  })
  .catch(function (error) {
    console.log(error);
  });



</script>

<style scoped>
  .wwc_link{
    text-decoration: none;
  }
  .li_nopond{
    list-style-type:none;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    width: 300px;
    
  }
</style>