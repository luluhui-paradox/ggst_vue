<template>
    <hero-bar :title=_username ></hero-bar>
    <!--show user detail page-->
    <el-row  type="flex" justify="center" align="middle">
      <el-col :span="10" style="text-align: center;">
        <!--table-->
        <table >
              <thead>
                <tr>
                  <th><span style="color: aqua;font-size: medium;">#</span></th>
                  <th><span style="color: aqua;font-size: medium;">Name</span></th>
                  <th><span style="color: aqua;font-size: medium;">Character</span></th>
                  <th><span style="color: aqua;font-size: medium;">Rating</span></th>
                  <th><span style="color: aqua;font-size: medium;">Games played</span></th>
                </tr>
              </thead>
              
              <tbody>
                <tr v-for="(item,idx) in tableData" :key="idx" :class="getRowClass(item)" v-on:click="tableRowClick(item)">
                  <td :class="getTdClass(item)">{{idx+1}}</td>
                  <td :class="getTdClass(item)">
                    <router-link :to="{path:'/userDetail',query:{ username:item.name,userid:item.id,char_shot:item.character_short }}" class="wwc_link">
                      <span :class="getTdClass(item)" style="font-size: large;text-decoration: none;">{{ item.name }}</span>
                    </router-link>
                    <span>&nbsp</span>
                    <span style="color: darkcyan;font-size: small;">{{ item.platform }}</span>
                  </td>
                  <td :class="getTdClass(item)">{{ item.character }}</td>
                  <td :class="getTdClass(item)">{{ item.rating_value }} &#177 {{item.rating_deviation}}</td>
                  <td :class="getTdClass(item)">{{ item.game_count }}</td>
                </tr>
              </tbody>
            </table>
      </el-col>
        
    </el-row>
</template>

<script setup>
import axios from 'axios';
import { reactive ,watch} from 'vue';
import { useRoute,useRouter } from 'vue-router';
import HeroBar from '../components/HeroBar.vue';
//get query param
const router = useRouter();
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

const getRowClass=(item)=>{
      // 根据 item 的属性动态决定 class
      return {
        'table-row-hover': item.character_short !== _character_short,
        'table-highlight': item.character_short === _character_short
      };
    }

const getTdClass=(item)=>{
  // 根据 item 的属性动态决定 class
  return {
    'normal-textcolor': item.character_short !== _character_short,
    'highlight-textcolor': item.character_short === _character_short
  };
}

const tableRowClick=(item)=>{
  router.push({
      name:"UserDetail",
      query:{
        username:item.name,
        userid:item.id,
        char_shot:item.character_short
      }
    })
}

//watch query param
watch(
    () => [route.query.username,route.query.userid,route.query.char_shot], 
    ([new_username,new_userid,new_char_shot]) => {
        _username = new_username; 
        _userid=new_userid;
        _character_short=new_char_shot;

      //axios
      axios.get("https://localhost:7018/api/searchUserExt",{params:{username:_username,userid:_userid}})
        .then((response)=> {
          if(response.status=="200"){
            tableData.length=0;
            tableData.push(...response.data)  
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    { immediate: true }
);

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
    width: 100%;
    display: block;
  }

  

  table{
    border-collapse: collapse;
    width: 100%;
    margin-top: 30px;
    margin-bottom: 30px;
    text-align: left;
  }

  tr {
      border-bottom: 0px solid darkcyan; /* Show bottom border for each row */
  }

  th ,td{
    padding-top: 7px;
    padding-bottom: 7px;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: 1px;
    border-color: aqua;
  }

  .table-row-hover:hover{
    background-color: #363636;
  }

  .table-highlight{
    background-color: darkorange;
  }

  .normal-textcolor{
    color: aqua;
  }

  .highlight-textcolor{
    color:#171717;
  }
</style>