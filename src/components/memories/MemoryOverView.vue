<template>
  <ion-img :src="image" :alt="title"> </ion-img>
  <h2 class="ion-text-center"> {{title}}   </h2>
    <p class="ion-text-center" >{{description}}</p>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { IonImg, } from "@ionic/vue";
export default defineComponent({
  name: "MemoryOverView",
  props: ["title", "description", "image"],
  components: {
    IonImg,
  },
});
</script>
