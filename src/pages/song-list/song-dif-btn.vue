<template>
  <div v-show="dif===difficulty" class="red"></div>

  <div class="c" @click="changeDif();">
    <div v-bind:style="{'font-size': '3vw','color':dif===difficulty?'white':'black'}">
      {{ value }}
    </div>
    <div v-bind:style="{'font-size': '1vw','color':dif===difficulty?'white':'black'}">
      {{ difficulty }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {SongListUtil} from "../../util/SongListUtil";

const props = defineProps<{ value: number, difficulty: "EZ" | "HD" | "IN" | "AT" | "SP" }>()

const dif = SongListUtil.difficulty


const changeDif = () => {
  SongListUtil.set(props.difficulty);
}
</script>

<style scoped>
.red {
  background: red;
  width: 90%;
  height: 120%;
  transform: translateY(-10%) translateX(5%);
  position: absolute;
  top: 0;
  z-index: 0;
}

.c {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 0;
}
</style>
