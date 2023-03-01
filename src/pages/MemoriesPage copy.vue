<template>
      <base-layout page-title="All Memories">
            <memories-list :memories="memories"></memories-list>
            <template v-slot:actions-end>
                <ion-button router-link="/memories/add">
                    <ion-icon slot="icon-only" :icon="add">
                    </ion-icon>
                </ion-button>
            </template>
     </base-layout>
     </template>
<script lang="ts">
import { defineComponent,computed } from 'vue';
import {useMemoriesStore} from '../store/store'
import MemoriesList from '../components/memories/MemoriesList.vue'
import {IonIcon,IonButton} from '@ionic/vue'
import {add} from'ionicons/icons'

export default defineComponent({
    name: 'MemoriesPage',
    components: {
        MemoriesList,
        IonIcon,
        IonButton

    },
    data(){
        return{
            add
        }
    },
    

    setup(){
        const memoriesStore = useMemoriesStore();
        const memories=computed(()=>memoriesStore.memories
        )
    return {
      memories,
    };      
          
    } 
   
})
</script>
