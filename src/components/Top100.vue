<template>
    <el-row type="flex" justify="center" align="middle" style="background-color:#c00000;height: 132px;">
        <el-col :span="24">
            <el-row type="flex" justify="center">
                <p style="color: aqua;"><h2>TOP 100</h2></p>
            </el-row>
        </el-col>
    </el-row>
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
                <tr v-for="(item,idx) in tableData" :key="idx">
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
import axios from 'axios';
import { onBeforeMount, onMounted, ref } from 'vue';
import { reactive } from 'vue';



const tableData=reactive([]);


axios.get('https://localhost:7018/api/getTop100/')
  .then(function (response) {
    if(response.status=="200"){
      
      tableData.push(...response.data)  
      
    }
  })
  .catch(function (error) {
    console.log(error);
  });



</script>
<style scoped>
    /* 表格内背景颜色 */
::v-deep .el-table th,
::v-deep .el-table tr,
::v-deep .el-table td {
  background-color: transparent;
}
::v-deep .el-table td.el-table__cell,
::v-deep .el-table th.el-table__cell.is-leaf {
  border-bottom: 0px;
}
::v-deep.el-table--enable-row-transition .el-table__body td.el-table__cell {
  background-color: transparent !important;
}
::v-deep.el-table td.el-table__cell div.cell {
  background-color: transparent !important;
}
::v-deep .el-table {
  background-color: transparent !important;
}
::v-deep .el-table__row {
  background-color: transparent ;
}

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