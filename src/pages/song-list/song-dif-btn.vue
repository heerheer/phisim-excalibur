<template>
  <div v-show="dif===difficulty" class="red" v-bind:style="{'background':getColor()}"></div>

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

const getColor = () => {
  switch (props.difficulty) {
    case "EZ":
      return 'limegreen'
    case "HD":
      return 'dodgerblue'
    case "IN":
      return 'red'
    case "AT":
      return '#795d5d'
    case "SP":
      return 'linear-gradient(blue, slateblue, coral, lightpink)'
  }
}
</script>

<style scoped>
.red {
  background: linear-gradient(blue, slateblue, coral, lightpink);
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
  height: 100%;
  transform: skew(15deg);
}
</style>
