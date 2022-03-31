<template>
</template>

<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {SongListUtil} from "../../util/SongListUtil";
import {useRouter} from "vue-router";
import {CommonUtil} from "../../util/CommonUtil";
import {ResourceManager} from "../../managers/ResourceManager";
import {MainManager} from "../../managers/MainManager";
import {Actor, Color, DisplayMode, Engine, vec} from "excalibur";
import {SetManager} from "../../managers/SetManager";

const loading = ref(true)
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
    resolution: {height: 600, width: 900},
    maxFps: SetManager.speedRatio
  });
  new MainManager(game);
  game.on('initialize', (event) => {
    event.target.currentScene.camera.pos = vec(0, 0);
    game.currentScene.camera.zoom = 1 / game.screen.aspectRatio;
    //game.add(new Actor({pos: vec(200, 200), height: 20, width: 20, color: Color.Yellow}))
  })

  game.on('postupdate', event => {
    MainManager.Instance.update(event.engine, event.delta)
    console.log("update")
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


  let json = JSON.parse(SongListUtil.data2play.json!);
  let chart_raw = json as PhiChart.Chart;
  MainManager.Instance.loadChart(chart_raw)
  //console.log("chart读取完毕")

  await MainManager.Instance.loadBgm(SongListUtil.data2play.music!)
  //console.log("BGM读取完毕")

  loading.value = false;

  MainManager.Instance.start();

  console.log("kaishi!")
})


</script>

<style scoped>

</style>
