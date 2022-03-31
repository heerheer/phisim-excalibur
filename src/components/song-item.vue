<template>
  <div class="n1" v-show="!isSelected" @click="emit('selected',props.songInfo);">
    <div style="left:10%;height: 60%;font-size: 3.2vw;">
      {{ songInfo.name }}
    </div>
  </div>
  <div class="n2" v-show="isSelected">
    <div class="back">
      <!-- back -->
    </div>
    <div class="info">
      <div style="height: 60%;font-size: 3.2vw">
        {{ songInfo.name }}
      </div>
      <div style="height: 40%;font-size: 1.4vw;display: flex;align-items: center">
        {{ songInfo.artist }}
      </div>
    </div>
    <div class="level" style="opacity: 0.9">
      <div class="y-flex" style="transform: skew(15deg);height: 100%;width: 100%">
        <div style=" height:60%;font-size: 3.2vw;display: flex;align-items: end">
          {{ songInfo[dif.toLowerCase() + "Ranking"] ?? "?" }}
        </div>
        <div style="height: 40%;font-size: 1.8vw;display: flex;align-items: start">
          {{ dif }}
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {SongListUtil} from "../util/SongListUtil";
const dif = SongListUtil.difficulty

const emit = defineEmits<{ (e: 'selected', info: any): void }>()
const props = withDefaults(defineProps<{ songInfo: any, isSelected: boolean }>(), {isSelected: false})

</script>

<style>
* .display {
  display: none;
}

.n1 {
  height: 80%;
  width: 100%;
  position: relative;
  color: white;
  margin: 10px;
  align-items: center;
  display: flex;
  align-content: center;
}

.n2 {
  height: 100%;
  width: 100%;
  position: relative;

}

.n2 .back {
  top: 10%;
  height: 80%;
  width: 100%;
  background: #1c1c1c;
  opacity: 0.9;
  transform: skew(-15deg);
  float: left;
  position: absolute;
  z-index: 1;
}

.n2 .level {

  height: 100%;
  width: 20%;
  background: white;
  transform: skew(-15deg);
  float: right;
  position: absolute;
  z-index: 2;
  right: 2%;
}

.y-flex {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.n2 .info {
  top: 10%;
  color: white;
  height: 80%;
  width: 60%;
  float: left;
  left: 5%;
  position: absolute;
  z-index: 3;
}
</style>
