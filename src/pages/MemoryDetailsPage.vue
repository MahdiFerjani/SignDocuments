<template>
 <base-layout :page-title="memory?.title" page-default-back-link="/memories">
        <memory-over-view :image="memory?.image" :title="memory?.title" :description="memory?.description" ></memory-over-view>
</base-layout>
</template>
<script lang="ts">

import { defineComponent,watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMemoriesStore } from '../store/store'
import { Memory } from '@/Models/Memory';
import MemoryOverView from '@/components/memories/MemoryOverView.vue';
export default defineComponent({
    name: "MemoryDetailsPage",
    components:{
      MemoryOverView
    },
    setup() {
        const route=useRoute()
        const MemoriesStore = useMemoriesStore();
        const id = route.params.id as string; 
        const memory = MemoriesStore.getMemoryById(id)
        return {
             memory
        } 
    },
})
</script> 