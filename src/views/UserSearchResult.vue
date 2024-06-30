<template>
    <hero-bar :title=subherobar></hero-bar>
    <!--show datas-->
    <el-row>
        <el-col :span="12" :offset="1" style="margin-top: 20px;">
            <!--table-->
            <table style="width: auto;text-align: left;">
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
                <tr v-for="(item,idx) in userResultList" :key="idx">
                  <td><span style="color: aqua;text-decoration: none">{{idx+1}}</span></td>
                  <td>
                    <router-link :to="{path:'/userDetail',query:{ username:item.name,userid:item.id,char_shot:item.character_short }}" class="wwc_link">
                      <span style="color: darkorange;font-size: large;text-decoration: none;">{{ item.name }}</span>
                    </router-link>
                    <span>&nbsp</span>
                    <span style="color: darkcyan;font-size: small;">{{ item.platform }}</span>
                  </td>
                  <td><span style="color: aqua;text-decoration: none">{{ item.character }}</span></td>
                  <td><span style="color: aqua;text-decoration: none">{{ item.rating_value }} &#177 {{item.rating_deviation}}</span></td>
                  <td><span style="color: aqua;text-decoration: none">{{ item.game_count }}</span></td>
                </tr>
              </tbody>
            </table>
        </el-col>
    </el-row>
</template>

<script setup>
import { useRoute,useRouter } from 'vue-router';
import { onMounted, reactive, ref, watch } from 'vue';
import axios from 'axios';
import HeroBar from '../components/HeroBar.vue';

const route=useRoute();
var searchuser=route.query.username;
const subherobar=ref("Search Result : "+searchuser);

const showuser=ref(searchuser);

const userResultList=reactive([]);

//axios
getremote(showuser.value)

watch(
    () => route.query.username, 
    (newValue) => {
        showuser.value = newValue; // Update showuser whenever username changes
      //axios
        getremote(showuser.value)
    },
    { immediate: true }
);

function getremote(_username){
   
    axios.get("https://localhost:7018/api/searchUsersByUsername",{params:{username:_username}})
  .then((response)=> {
    
    if(response.status=="200"){
        
      userResultList.length=0;
      userResultList.push(...response.data);
    }
  })
  .catch(function (error) {
    console.log(error);
    return [];
  });
}


</script>

<style scoped>

.wwc_link{
  text-decoration: none;
}

table{
  border-collapse: collapse;
  width: 100%;
}

tr {
    border-bottom: 1px solid darkcyan; /* Show bottom border for each row */
}

th ,td{
  padding-top: 7px;
  padding-bottom: 7px;
  padding-left: 10px;
  padding-right: 10px;
  border-bottom: 1px;
  border-color: aqua;
}
</style>