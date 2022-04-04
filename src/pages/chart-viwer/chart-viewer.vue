<template>
  <div
      class="combo"
      v-if="!loading"
  >
    <span style="font-size:2.6vw;">{{ MainManager.Instance.combo }}</span>
    <span style="font-size:0.8vw;">Combo(Auto)</span>
  </div>
  <div
      v-if="!loading"
      style="z-index: 99;
  align-items: center;
  position:fixed;
  bottom:1%;
  right: 1%;
  font-weight: lighter;
  color: white">
    <span style="font-size:3vmin;">Phi-Sim-Excalibur-Viewer</span>
  </div>
  <div class="fps">FPS:{{ fps }}</div>
  <el-image style="z-index: -99;width: 100%;height: 100%;position: fixed;filter: blur(50px);"
            :src="SongListUtil.data2play.illustration"
            fit="cover"/>


</template>

<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {SongListUtil} from "../../util/SongListUtil";
import {useRouter} from "vue-router";
import {CommonUtil} from "../../util/CommonUtil";
import {ResourceManager} from "../../managers/ResourceManager";
import {MainManager} from "../../managers/MainManager";
import {Color, DisplayMode, Engine, vec} from "excalibur";
import {SetManager} from "../../managers/SetManager";

const loading = ref(true)
const fps = ref(0)
const router = useRouter();

CommonUtil.mitt.on('playEnd', () => {
  //结束播放
  document.getElementsByTagName('canvas')[0].remove();
  router.push({path: '/list'})
})

onMounted(async () => {
  if (SongListUtil.data2play.json == undefined || SongListUtil.data2play.music == undefined) {
    document.getElementsByTagName('canvas')[0]?.remove();
    return router.push({path: '/list'})
  }


  const game = new Engine({
    resolution: {height: 900, width: 1350},
    maxFps: SetManager.speedRatio,
    displayMode: DisplayMode.FillScreen,
    backgroundColor: Color.Transparent
  });
  new MainManager(game);
  game.on('initialize', (event) => {
    //game.add(new Actor({pos: vec(0, 0), height: 900, width: 1350, color: Color.LightGray}))

    event.target.currentScene.camera.pos = vec(0, 0);

    game.currentScene.camera.zoom = Math.min(game.drawHeight / 900, game.drawWidth / 1350);


  })

  game.on('postupdate', event => {
    MainManager.Instance.update(event.engine, event.delta)

    fps.value = Math.round(1000 / event.delta)
    //console.log("update")
  })
  await game.load(ResourceManager.Tap);
  await game.load(ResourceManager.Hold);
  await game.load(ResourceManager.Drag);
  await game.load(ResourceManager.Flick);
  await game.load(ResourceManager.Clicks);
  await game.load(ResourceManager.HitSound);
  await game.load(ResourceManager.HitSound_Drag);
  await game.load(ResourceManager.HitSound_Flick);

  await game.start();


  let json = SongListUtil.data2play.json!;

  MainManager.Instance.loadChart(json, SongListUtil.data2play.chartInfo?.formatter ?? "rpe_json");
  //console.log("chart读取完毕")

  await MainManager.Instance.loadBgm(SongListUtil.data2play.music!)
  //console.log("BGM读取完毕")

  loading.value = false;

  MainManager.Instance.start();

})


</script>

<style scoped>
.combo {
  z-index: 99;
  align-items: center;
  position: fixed;
  top: 5%;
  left: 40%;
  width: 20%;
  height: 10%;
  display: flex;
  flex-direction: column;
  font-weight: lighter;
  color: white

}

.fps {
  z-index: 99;
  position: fixed;
  top: 5%;
  right: 1%;
  font-weight: lighter;
  color: white
}
</style>
