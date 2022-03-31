<template>

  <el-form >
    <el-form-item label="JSON文件" >
      <input type="file" placeholder="上传JSON" id="upload-json"  name="upload-json" @change="uploaded_json($event)"/>
    </el-form-item>
    <el-form-item label="音频文件" >
      <input type="file" id="upload-bgm" name="upload-bgm" @change="uploaded_bgm($event)"/>
    </el-form-item>
  </el-form>
  <el-divider />
  <el-button @click="load">Load</el-button>
  <el-button @click="play" class='success'>Play</el-button>

  <div v-if="MainManager.Instance!==undefined">
    <div v-if="MainManager.Instance.soundBgm!==undefined">{{ MainManager.Instance.soundBgm.ctx.currentTime }}</div>
  </div>
  <game-engine-com></game-engine-com>
</template>

<script setup lang="ts">
import {ref, Ref} from "vue";
import {MainManager} from "../managers/MainManager";
import GameEngineCom from "./GameEngineCom.vue";
import {ResourceManager} from "../managers/ResourceManager";

const jsonFile: Ref<File | undefined> = ref(undefined);
const bgmFile: Ref<File | undefined> = ref(undefined);


const uploaded_json = async (event: any) => {
  jsonFile.value = event.target.files[0] as File;
  //console.log(await jsonFile.value?.text())
}
const uploaded_bgm = (event: any) => {
  bgmFile.value = event.target.files[0] as File;
}


const play = () => {
  MainManager.Instance.start();
}
const load = async () => {

  let json = JSON.parse((await jsonFile.value?.text())!);

  let chart_raw = json as PhiChart.Chart;
  console.log(chart_raw)
  MainManager.Instance.loadChart(chart_raw)
  console.log("OK")

  await MainManager.Instance.loadBgm((await bgmFile.value?.arrayBuffer())!)

  console.log("BGM OK")


}


</script>

<style scoped>

</style>
