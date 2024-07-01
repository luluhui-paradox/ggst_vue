<template>
    <hero-bar :title=heroTitle></hero-bar>
    <!--check shouwer-->
    <div v-show="!isGamePadConnected">
        <el-row type="flex" justify="center" align="middle">
            <div style="margin-top: 50px;margin-bottom: 50px;">
                <el-text size='large' style="font-size: 30px;" >
                    <el-icon :class="{ 'rotate-animation': isRotating }" style="margin-right: 10px;"><Loading /></el-icon>Please connect your device and press a key
                </el-text>
            </div>
            
        </el-row>
    </div>
    <!--main content-->
    <div v-show="isGamePadConnected">
        <el-row>
            <el-col :span="8" :offset="1">
                <!--此处放hitbox的canvas-->
                <canvas ref="canvasRef" height="240" width="440" class="wwc-hitbox-canvas"></canvas>
            </el-col>
            <!--filteredItems_slice1-->
            <el-col :span="4">
                <!--此处放hitbox的数据table---->
                <!--table 1-->
                <table>
                    <tbody>
                        <tr v-for="(item,idx) in filteredItems_slice1" :key="idx">
                            <td><span style="color: darkorange;text-decoration: none">{{ buttonNameList[idx] }}</span></td>
                            <td class="long-td"><span style="color: aqua;text-decoration: none">{{ item.value }}</span></td>   
                        </tr>
                    </tbody>
                </table>
            </el-col>
            <!--filteredItems_slice2-->
            <el-col :span="4">
                <!--此处放hitbox的数据table---->
                <!--table 2-->
                <table>
                    <tbody>
                        <tr v-for="(item,idx) in filteredItems_slice2" :key="idx">
                            <td><span style="color: darkorange;text-decoration: none">{{ buttonNameList[idx+8] }}</span></td>
                            <td class="long-td"><span style="color: aqua;text-decoration: none">{{ item.value }}</span></td>   
                        </tr>
                    </tbody>
                </table>
            </el-col>
            <!-- gamepadAxisData -->
            <el-col :span="7">
                <el-row>
                    <canvas class="wwc-hitbox-canvas" ref="stickCanvasRef" height="200" width="400"></canvas>
                </el-row>
                <el-row>
                    <!--table 3-->
                    <table>
                        <tbody>
                            <tr>
                                <td><span style="color: darkorange;text-decoration: none">LEFT STICK </span></td>
                                <td style="width: 230px;"><span style="color: aqua;text-decoration: none">{{ gamepadAxisData[0] }} , {{ gamepadAxisData[1]}}</span></td>   
                            </tr>
                            <tr>
                                <td><span style="color: darkorange;text-decoration: none">RIGHT STICK </span></td>
                                <td style="width: 230px;"><span style="color: aqua;text-decoration: none">{{ gamepadAxisData[2] }} , {{ gamepadAxisData[3]}}</span></td>   
                            </tr>
                        </tbody>
                    </table>
                </el-row>
            </el-col>
        </el-row>
        
    </div>
</template>

<script setup>

import HeroBar from '@/components/HeroBar.vue';
import { nextTick, onMounted, reactive,ref ,onUnmounted,computed } from 'vue';
import { useRoute,useRouter } from 'vue-router';

//herobar props
const heroTitle=ref("STICK CHECKER")

const isRotating=ref(true);

const isGamePadConnected=ref(false);

const activegampadid=ref("");

const activegampadDisplayid=ref("");

const buttonNameList=["A","B","X","Y","LB","RB","LT","RT","CAP","SHARE","LS","RS","D_UP","D_DOWN","D_LEFT","D_RIGHT","HOME"]
const buttonStatusList=reactive([]);

const filteredItems_slice1 = computed(() => {
    return buttonStatusList.slice(0, 8);
});

const filteredItems_slice2 = computed(() => {
    return buttonStatusList.slice(8, 17);
});

const gamepadAxisData=reactive([]);

//canvas
const canvasRef = ref(null);
const stickCanvasRef = ref(null); 

//check  gamepad stillalive
const isstillAlive=ref(false);

let intervalId = null;


const drawInitCircle=()=>{
    const canvas = canvasRef.value;
    if(canvas == null){return}
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const circles = [
        //--------------- A -------------------
        { x: 3.235, y:-3.844, radius: 24 , showtxt:"A"},
        //--------------- B --------------------
        { x: 30.355, y:6.946, radius: 24,showtxt:"B"},
        //--------------- X --------------------
        { x: 5.795, y:24.626, radius: 24,showtxt:"X"},
        //--------------- Y --------------------
        { x: 31.945, y:36.026, radius: 24,showtxt:"Y"},
        //--------------- LB --------------------
        { x: 60.735, y:35.326, radius: 24,showtxt:"LB"},
        //--------------- RB --------------------
        { x: 89.455, y:32.426, radius: 24,showtxt:"RB"},
        //--------------- LT --------------------
        { x: 59.212, y:7.303, radius: 24,showtxt:"LT"},
        //--------------- RT --------------------
        { x: 88.422, y:2.223, radius: 24,showtxt:"RT"},
        //--------------- CAP --------------------
        { x: -85.217, y:51, radius: 10,showtxt:"CAP"},
        //--------------- SHARE --------------------
        { x: -71.692, y:51, radius: 10,showtxt:"SHARE"},
        //--------------- LS --------------------
        { x: -58.166, y:51, radius: 10,showtxt:"LS"},
        //--------------- RS --------------------
        { x: -44.641, y:51, radius: 10,showtxt:"RS"},
        //--------------- D_UP --------------------
        { x: -8.383, y:-41.403, radius: 24,showtxt:"UP"},
        //--------------- D_DOWN --------------------
        { x: -46.765, y:25.586, radius: 24,showtxt:"DOWN"},
        //--------------- D_LEFT --------------------
        { x: -75.505, y:25.546, radius: 24,showtxt:"LEFT"},
        //--------------- D_RIGHT --------------------
        { x: -21.265, y:13.086, radius: 24,showtxt:"RIGHT"},
        //--------------- HOME --------------------
        { x: -31.115, y:51, radius: 10,showtxt:"HOME"},

    ];

    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc((110+(circle.x))*2, (60-(circle.y))*2, circle.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'aqua';  // 边框颜色为 aqua
        ctx.lineWidth = 2;  // 边框线宽度为 3 像素
        ctx.stroke();  // 绘制圆形的边框
        //showtxt
        if(circle.radius===24){
            ctx.font = '10px Arial';
            ctx.fillStyle = 'darkorange';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(circle.showtxt, (110+(circle.x))*2, (60-(circle.y))*2);
        }
    });
    ctx.closePath();
}

const drawInitStick=()=>{
    const stickCanvas = stickCanvasRef.value;
    if(stickCanvas == null){return}
    const ctx = stickCanvas.getContext('2d');
    ctx.clearRect(0, 0, stickCanvas.width, stickCanvas.height);
    const circles = [
        //----- left stick outside ---------
        { x:100, y:100, radius: 50},
        //------- right stick outside --------
        { x: 300, y:100, radius: 50},
        //--------- left stick inner ---------
        { x: 100, y:100, radius: 24},
        //---------right stick inner -------
        { x: 300, y:100, radius: 24},

    ];

    circles.forEach((circle,idx) => {
        ctx.beginPath();
        ctx.arc(circle.x,circle.y, circle.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'aqua';  // 边框颜色为 aqua
        ctx.lineWidth = 2;  // 边框线宽度为 3 像素
        ctx.stroke();  // 绘制圆形的边框
        if(idx>1){
            ctx.fillStyle='aqua';
            ctx.fill()
        }
    });
    ctx.closePath();
}

const reDrawStick=()=>{
    const stickCanvas = stickCanvasRef.value;
    if(stickCanvas == null){return}
    const ctx = stickCanvas.getContext('2d');
    ctx.clearRect(0, 0, stickCanvas.width, stickCanvas.height);
    const circles = [
        //----- left stick outside ---------
        { x:100, y:100, radius: 50},
        //------- right stick outside --------
        { x: 300, y:100, radius: 50},
        //--------- left stick inner ---------
        { x: 100, y:100, radius: 24},
        //---------right stick inner -------
        { x: 300, y:100, radius: 24},

    ];

    circles.forEach((circle,idx) => {
        ctx.beginPath();
        //left stick
        if(idx==2){
            ctx.arc(circle.x+(gamepadAxisData[idx-2])*50,circle.y+(gamepadAxisData[idx-1])*50, circle.radius, 0, 2 * Math.PI);
        }else if(idx==3) {
            ctx.arc(circle.x+(gamepadAxisData[idx-1])*50,circle.y+(gamepadAxisData[idx])*50, circle.radius, 0, 2 * Math.PI);
        }else{
            ctx.arc(circle.x,circle.y, circle.radius, 0, 2 * Math.PI);
        }
        ctx.strokeStyle = 'aqua';  // 边框颜色为 aqua
        ctx.lineWidth = 2;  // 边框线宽度为 3 像素
        ctx.stroke();  // 绘制圆形的边框
        if(idx>1){
            ctx.fillStyle='aqua';
            ctx.fill()
        }
    });
    ctx.closePath();
}



function stopPollingGamePad() {
    clearInterval(intervalId);
}

const reDrawHitbox=()=>{
    const canvas = canvasRef.value;
    if(canvas == null){return}
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const circles = [
        //--------------- A -------------------
        { x: 3.235, y:-3.844, radius: 24 , showtxt:"A"},
        //--------------- B --------------------
        { x: 30.355, y:6.946, radius: 24,showtxt:"B"},
        //--------------- X --------------------
        { x: 5.795, y:24.626, radius: 24,showtxt:"X"},
        //--------------- Y --------------------
        { x: 31.945, y:36.026, radius: 24,showtxt:"Y"},
        //--------------- LB --------------------
        { x: 60.735, y:35.326, radius: 24,showtxt:"LB"},
        //--------------- RB --------------------
        { x: 89.455, y:32.426, radius: 24,showtxt:"RB"},
        //--------------- LT --------------------
        { x: 59.212, y:7.303, radius: 24,showtxt:"LT"},
        //--------------- RT --------------------
        { x: 88.422, y:2.223, radius: 24,showtxt:"RT"},
        //--------------- CAP --------------------
        { x: -85.217, y:51, radius: 10,showtxt:"CAP"},
        //--------------- SHARE --------------------
        { x: -71.692, y:51, radius: 10,showtxt:"SHARE"},
        //--------------- LS --------------------
        { x: -58.166, y:51, radius: 10,showtxt:"LS"},
        //--------------- RS --------------------
        { x: -44.641, y:51, radius: 10,showtxt:"RS"},
        //--------------- D_UP --------------------
        { x: -8.383, y:-41.403, radius: 24,showtxt:"UP"},
        //--------------- D_DOWN --------------------
        { x: -46.765, y:25.586, radius: 24,showtxt:"DOWN"},
        //--------------- D_LEFT --------------------
        { x: -75.505, y:25.546, radius: 24,showtxt:"LEFT"},
        //--------------- D_RIGHT --------------------
        { x: -21.265, y:13.086, radius: 24,showtxt:"RIGHT"},
        //--------------- HOME --------------------
        { x: -31.115, y:51, radius: 10,showtxt:"HOME"},

    ];

    circles.forEach((circle,idx) => {
        //console.log(`------------------ idx :${idx} value : ${buttonStatusList[idx].value} -----------------`)
        ctx.beginPath();
        ctx.arc((110+(circle.x))*2, (60-(circle.y))*2, circle.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'aqua';  // 边框颜色为 aqua
        ctx.lineWidth = 2;  // 边框线宽度为 3 像素
        ctx.stroke();  // 绘制圆形的边框
        if(buttonStatusList[idx]!=null&&buttonStatusList[idx].value!=0){
            ctx.fillStyle = 'aqua';
            ctx.fill();
        }
        if(circle.radius===24){
            ctx.font = '14px Arial';
            ctx.fillStyle = 'darkorange';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(circle.showtxt, (110+(circle.x))*2, (60-(circle.y))*2);
        }
    });
    ctx.closePath();
}

const initGamepadStatus = () => {

    if(isGamePadConnected.value==true){
        
        //此时也需要判断手柄是否被拔掉
        //监听组件值
        const gamepads = navigator.getGamepads();
        isstillAlive.value=false;
        for(var idx in gamepads){
            
            if(gamepads[idx]!=null&&gamepads[idx].id===activegampadid.value){
                
                activegampadid.value=gamepads[idx].id;
                activegampadDisplayid.value=gamepads[idx].mapping
                
                buttonStatusList.length=0;
                buttonStatusList.push(...gamepads[idx].buttons);
                gamepadAxisData.length=0;
                gamepadAxisData.push(...gamepads[idx].axes);
                
                nextTick(()=>{
                    isstillAlive.value=true;
                    isGamePadConnected.value=true;
                    reDrawHitbox();
                    reDrawStick();
                })
                break;
            }
        }

        isGamePadConnected.value=isstillAlive.value;
        
    }else{
        const gamepads = navigator.getGamepads();
        for(var idx in gamepads){
            
            if(isGamePadConnected.value==true){
                    break;
            }
            if(gamepads[idx]!=null){
                
                activegampadid.value=gamepads[idx].id;
                isGamePadConnected.value=true;
                
            }
        }
    }
    
};

onMounted(()=>{

    intervalId = setInterval(()=>{
        initGamepadStatus()
    },16)
    drawInitCircle()
    drawInitStick()
})

onUnmounted(() => {
      stopPollingGamePad();
});

const changeStatus=()=>{
    isRotating.value=!isRotating.value;
}







</script>

<style scoped>

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotate-animation {
  animation: rotate 2s linear infinite; /* 根据需要调整动画持续时间和动画方式 */
}

.wwc-hitbox-canvas{
    border: 1px solid ;
    border-color: aqua;
    border-radius: 10px;
    margin-top: 10px;
}

td{
  padding-top: 7px;
  padding-bottom: 7px;
  padding-left: 10px;
  padding-right: 10px;
  border-bottom: 1px;
  border-color: aqua;
  width: 80px;
}
.long-td{
    width: 200px;
}

table{
  border-collapse: collapse;
  width: auto;text-align: left;
  margin-top: 3px;margin-bottom: 10px;
}

tr {
    border-bottom: 1px solid darkcyan; /* Show bottom border for each row */
}

</style>