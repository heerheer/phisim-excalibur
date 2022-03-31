<script setup lang="ts">
import {Ref, ref} from 'vue'
import JSZip from "jszip";
//import {pec2json} from "../util/pec2json";

const props = defineProps<{ msg: string }>()


const json = ref('')
const file: Ref<File | undefined> = ref(undefined);


const uploaded = async (x: any) => {
  file.value = x.target.files[0] as File;

  if (file.value) {
    console.log(file.value?.name)
  }

  let zip = new JSZip();
  await zip.loadAsync(file.value)
  console.log(zip.files)
  for (const key in zip.files) {
    console.log(key)

    if (key.endsWith(".json")) {
      //console.log(await zip.file(zip.files[key].name)?.async('string'))
      json.value = await zip.file(key)?.async('string')!

      //let chart = pec2json(json.value, "json");

      console.log({})

    }
  }


}
</script>

<template>
  <label for="upload">上传</label>
  <input type="file" id="upload" name="upload" @change="uploaded($event)"/>

  {{ json }}
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
