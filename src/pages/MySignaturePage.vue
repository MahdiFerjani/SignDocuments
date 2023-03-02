<template>
      <div :key="index" v-for="(item, index) in signatures"   >
        <div class="card-categories ion-activatable ripple-parent" style="background:#e2e2e2;"  v-on:dragstart="onDragStart($event, item.imageData)">
          
          <ion-thumbnail>
          <img :src="item.imageData" />
          </ion-thumbnail>
        </div>
      </div>
</template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useSignatureStore } from '@/store/SignatureStore';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import {IonThumbnail,IonRippleEffect} from '@ionic/vue'
  //import SwiperCore, { Mousewheel, Virtual } from 'swiper/core';
  import 'swiper/css';
  import '@ionic/vue/css/ionic-swiper.css';
  export default defineComponent({
    name: 'SignatureList',
    components:{
     
        IonThumbnail, 
    },
    setup() {
      const signatureStore = useSignatureStore();
      const signatures = signatureStore.Signatures;
  
      return {
        signatures,
      };
    },
  });
  </script>
  <style>
  .card-categories {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    background: var(--ion-color-light);
    border-radius: 10px;
    color: white;
    width: 110px;
    margin-left:10px;
    opacity: 0.8;
  }
  
  .card-categories ion-icon {
    font-size: 40px;
    margin-bottom: 8px;
  }
</style>