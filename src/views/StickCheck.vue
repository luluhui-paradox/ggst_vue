<template>
    <hero-bar :title=heroTitle></hero-bar>
    <!--check shouwer-->
    <div v-show="!isGamePadConnected">
        <el-row type="flex" justify="center" align="middle">
            <el-text size='large' style="font-size: 30px;" >
                <el-icon :class="{ 'rotate-animation': isRotating }" style="margin-right: 10px;"><Loading /></el-icon>Please connect your device and press a key
            </el-text>
            

        </el-row>
    </div>
    <!--main content-->
    <div v-show="isGamePadConnected">
        <el-row>
            <el-col>
                <!--此处放hitbox的canvas-->
                <canvas ref="canvasRef" height="240" width="440" class="wwc-hitbox-canvas"></canvas>
            </el-col>
            <el-col>
                <!--此处放hitbox的数据table---->
            </el-col>
        </el-row>
        
    </div>
</template>

<script setup>

import HeroBar from '@/components/HeroBar.vue';
import { nextTick, onMounted, reactive,ref ,onUnmounted } from 'vue';
import { useRoute,useRouter } from 'vue-router';

const heroTitle=ref("STICK CHECKER")

const isRotating=ref(true);

const isGamePadConnected=ref(false);

const activegampadid=ref("");

const activegampadDisplayid=ref("");

const buttonNameList=["A","B","X","Y","LB","RB","LT","RT","CAP","SHARE","LS","RS","D_UP","D_DOWN","D_LEFT","D_RIGHT","HOME"]
const buttonStatusList=reactive([]);

const gamepadAxisData=reactive([]);

const canvasRef = ref(null);

const isstillAlive=ref(false);

let intervalId = null;

const drawInitCircle=()=>{
    const canvas = canvasRef.value;
    if(canvas == null){return}
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const circles = [
        //--------------- A -------------------
        { x: 3.235, y:-3.844, radius: 24},
        //--------------- B --------------------
        { x: 30.355, y:6.946, radius: 24},
        //--------------- X --------------------
        { x: 5.795, y:24.626, radius: 24},
        //--------------- Y --------------------
        { x: 31.945, y:36.026, radius: 24},
        //--------------- LB --------------------
        { x: 60.735, y:35.326, radius: 24},
        //--------------- RB --------------------
        { x: 89.455, y:32.426, radius: 24},
        //--------------- LT --------------------
        { x: 59.212, y:7.303, radius: 24},
        //--------------- RT --------------------
        { x: 88.422, y:2.223, radius: 24},
        //--------------- CAP --------------------
        { x: -85.217, y:51, radius: 10},
        //--------------- SHARE --------------------
        { x: -71.692, y:51, radius: 10},
        //--------------- LS --------------------
        { x: -58.166, y:51, radius: 10},
        //--------------- RS --------------------
        { x: -44.641, y:51, radius: 10},
        //--------------- D_UP --------------------
        { x: -8.383, y:-41.403, radius: 24},
        //--------------- D_DOWN --------------------
        { x: -46.765, y:25.586, radius: 24},
        //--------------- D_LEFT --------------------
        { x: -75.505, y:25.546, radius: 24},
        //--------------- D_RIGHT --------------------
        { x: -21.265, y:13.086, radius: 24},
        //--------------- HOME --------------------
        { x: -31.115, y:51, radius: 10},

    ];

    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc((110+(circle.x))*2, (60-(circle.y))*2, circle.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'aqua';  // 边框颜色为 aqua
        ctx.lineWidth = 2;  // 边框线宽度为 3 像素
        ctx.stroke();  // 绘制圆形的边框
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
        { x: 3.235, y:-3.844, radius: 24},
        //--------------- B --------------------
        { x: 30.355, y:6.946, radius: 24},
        //--------------- X --------------------
        { x: 5.795, y:24.626, radius: 24},
        //--------------- Y --------------------
        { x: 31.945, y:36.026, radius: 24},
        //--------------- LB --------------------
        { x: 60.735, y:35.326, radius: 24},
        //--------------- RB --------------------
        { x: 89.455, y:32.426, radius: 24},
        //--------------- LT --------------------
        { x: 59.212, y:7.303, radius: 24},
        //--------------- RT --------------------
        { x: 88.422, y:2.223, radius: 24},
        //--------------- CAP --------------------
        { x: -85.217, y:51, radius: 10},
        //--------------- SHARE --------------------
        { x: -71.692, y:51, radius: 10},
        //--------------- LS --------------------
        { x: -58.166, y:51, radius: 10},
        //--------------- RS --------------------
        { x: -44.641, y:51, radius: 10},
        //--------------- D_UP --------------------
        { x: -8.383, y:-41.403, radius: 24},
        //--------------- D_DOWN --------------------
        { x: -46.765, y:25.586, radius: 24},
        //--------------- D_LEFT --------------------
        { x: -75.505, y:25.546, radius: 24},
        //--------------- D_RIGHT --------------------
        { x: -21.265, y:13.086, radius: 24},
        //--------------- HOME --------------------
        { x: -31.115, y:51, radius: 10},

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

</style>