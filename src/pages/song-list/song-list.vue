<script setup lang="ts">

import {onMounted, ref} from "vue";
import SongItem from "../../components/song-item.vue";
import SongDifBtn from "./song-dif-btn.vue";
import {SongListUtil} from "../../util/SongListUtil";
import {useRouter} from "vue-router";
import {ChartApi, ChartInfo} from "../../util/ChartApi";
//歌曲列表
const loaded = ref(false)
const json = ref('')
const router = useRouter();
const selectedSong = ref<ChartInfo | undefined>(undefined)

// noinspection HttpUrlsUsage
const api = ref(new ChartApi("http://server2.heerdev.top/charts"));

onMounted(async () => {
  await api.value.init();
  loaded.value = true;
  selectedSong.value = api.value.charts[0];
})

const itemSelected = (info: any) => {
  selectedSong.value = info;
  console.log("info被选择")
  console.log(info)

}

const start = async () => {
  let diff = SongListUtil.difficulty.value;
  if (diff == undefined) {
    alert("你还没有选择难度。")
    return;
  }
  try {
    SongListUtil.data2play.chartInfo = selectedSong.value;
    SongListUtil.data2play.json = JSON.stringify(await api.value.getChartJson(selectedSong.value?.codename!, diff))
    console.log("远程json读取完成")

    SongListUtil.data2play.music = await api.value.getChartMusicData(selectedSong.value!)

    SongListUtil.data2play.illustration = api.value.getChartIllustrationUrl(selectedSong.value!)

    console.log("远程音频arrayBuffer读取完成")

    await router.push({path: '/play'})
  } catch {
    alert("出现错误!可能是难度选择错误，或者是谱面JSON与音频/图片读取出错。")

  }
}
</script>

<template>



  <div v-if="loaded" style="height: 100%;width: 100%;position: fixed;overflow: hidden">
    <div id="backgroundImg" style="height: 100%;width: 100%;">
      <el-image style="height: 100%;width: 100%;filter: blur(8px);"
                v-if="selectedSong!==undefined" :src="api.getChartIllustrationUrl(selectedSong)"
                fit="cover">
      </el-image>
    </div>
    <div id="listPanel">
      <el-scrollbar style="background: transparent;position:absolute;width: 100%">
        <div v-for="item in api.charts" class="song-item">
          <song-item @selected="itemSelected" :is-selected="selectedSong === item"
                     :song-info="item"></song-item>
        </div>
      </el-scrollbar>
      <div style="z-index: 1;height: 100%;width: 90%;background: #3f3f3fCC;position: absolute"></div>
    </div>
    <div id="illustrationPanel" v-if="selectedSong!==undefined"
         style="position: fixed;left: 50%;top:10%;height: 70%;width: 42%;
         transform: skew(-15deg);">
      <div style="height: 75%;overflow-x: hidden;overflow-y: hidden;box-shadow: 0 0 10px 0 #7c7c7c;">

        <el-image style="height: 100%;width: 120%;left: -10%;transform:skew(15deg);"
                  v-if="selectedSong!==undefined" :src="api.getChartIllustrationUrl(selectedSong)"
                  fit="cover"></el-image>
      </div>
      <div style="height: 10%"></div>
      <div style="height: 15%">
        <div id="infoBar">
          <div style="height: 100%;width: 80%;">
            <el-row id="infoBarDifRow" :gutter="0">
              <el-col :span="4" v-if="selectedSong?.ezRanking !==undefined">
                <song-dif-btn :value="selectedSong?.ezRanking" difficulty="EZ"/>
              </el-col>
              <el-col :span="4" v-if="selectedSong?.hdRanking !==undefined">
                <song-dif-btn :value="selectedSong?.hdRanking" difficulty="HD"/>
              </el-col>
              <el-col :span="4" v-if="selectedSong?.inRanking !==undefined">
                <song-dif-btn :value="selectedSong?.inRanking" difficulty="IN"/>
              </el-col>
              <el-col :span="4" v-if="selectedSong?.atRanking !==undefined">
                <song-dif-btn :value="selectedSong?.atRanking" difficulty="AT"/>
              </el-col>
              <el-col :span="4" v-if="selectedSong?.spRanking !==undefined">
                <song-dif-btn :value="selectedSong?.spRanking" difficulty="SP"/>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <!--开始按钮-->
    <div id="startBtn" @click="start">
      <svg style="margin-left: 15%"
           t="1648635290592" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
           p-id="2336" height="60%">
        <path
            d="M213.333333 65.386667a85.333333 85.333333 0 0 1 43.904 12.16L859.370667 438.826667a85.333333 85.333333 0 0 1 0 146.346666L257.237333 946.453333A85.333333 85.333333 0 0 1 128 873.28V150.72a85.333333 85.333333 0 0 1 85.333333-85.333333z m0 64a21.333333 21.333333 0 0 0-21.184 18.837333L192 150.72v722.56a21.333333 21.333333 0 0 0 30.101333 19.456l2.197334-1.152L826.453333 530.282667a21.333333 21.333333 0 0 0 2.048-35.178667l-2.048-1.386667L224.298667 132.416A21.333333 21.333333 0 0 0 213.333333 129.386667z"
            fill="#333333" p-id="2337"></path>
      </svg>
    </div>
  </div>

  <!--Loading-->
  <div v-if="!loaded" v-loading="true" style="position: fixed;height: 100%;width: 200%;">
  </div>


</template>


<style scoped>
#listPanel {
  transform: skew(-15deg);
  overflow: hidden;
  position: fixed;
  left: 10%;
  height: 100%;
  width: 35%;
  top: 0;
  display: flex;
  justify-content: left;

}

.song-item {
  z-index: 2;
  position: relative;
  height: 8vw;
  width: 90%;
  transform: skew(15deg);
}

#infoBar {
  width: 100%;
  height: 100%;
  background: #3f3f3fFF;
  box-shadow: 0 0 20px 0 #7c7c7c;

}

#startBtn {
  width: 15%;
  height: 15%;
  position: fixed;
  right: -5%;
  bottom: 5%;
  background: white;
  transform: skew(-15deg);
  text-align: left;
  display: flex;
  align-items: center;
  box-shadow: 0 0 10px 0 #7c7c7c;
}

#startBtn > * {
  transform: skew(15deg);
}

#infoBarDifRow {
  height: 100%;
}

#infoBarDifRow > .el-col {
  background: white;
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
