<template>
 <ion-item >
 <ion-thumbnail slot="start">
    <ion-img :src="memory?.image" :alt="memory?.title"></ion-img>
        </ion-thumbnail>
         <ion-label>
          {{ memory.title }}
    </ion-label>
</ion-item>
</template>
<script lang="ts">
import {IonThumbnail,IonImg,IonLabel,IonItem} from '@ionic/vue' 
import {defineComponent} from 'vue'
 export default defineComponent({
    name: 'MemoryListItem',
    props:["memory"],
    components:{
        IonThumbnail,
        IonImg,
        IonLabel,
        IonItem
    }
})
</script>