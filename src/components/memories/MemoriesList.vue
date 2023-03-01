<template>

<ion-list>
    <memory-list-item v-for="memory in memories" 
                    :router-link="`/memories/${memory.id}`" 
                    :key="memory.id"
                    :memory="memory" >
    </memory-list-item>
</ion-list>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {IonList} from '@ionic/vue'
import  MemoryListItem from './MemoryListItem.vue'
 export default defineComponent({
    props:["memories"],
    name:'MemoriesList',
    components:{
        IonList,
        MemoryListItem
    }
})

</script>