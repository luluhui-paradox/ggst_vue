<template>
    <el-row type="flex" justify="center" align="middle" style="background-color:#c00000;height: 132px;">
        <el-col :span="24">
            <el-row type="flex" justify="center">
                <p style="color: aqua;"><h2>{{ props.title }}</h2></p>
            </el-row>
        </el-col>
    </el-row>
</template>

<script setup>
import { defineComponent, defineProps } from 'vue';
const props = defineProps({
  title: String
})
</script>

<style scoped>

</style>
