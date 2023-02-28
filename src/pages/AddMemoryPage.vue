<template>
<base-layout page-title="Add Memory" page-default-back-link="/memories">
<create-memory-from @save-memory="saveMemory"></create-memory-from>
</base-layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import CreateMemoryFrom from '@/components/memories/CreateMemoryFrom.vue';
import BaseLayout from '../components/base/BaseLayout.vue'
import {useMemoriesStore} from '../store/store'
import { Method } from '@ionic/core/dist/types/stencil-public-runtime';
import { Memory } from '@/Models/Memory';
import { assertThisExpression } from '@babel/types';
export default  defineComponent({
 name:"AddMemoryPage",
 setup(){
    const memoriesStore = useMemoriesStore();
    return {
     memoriesStore
    }
 },
 components:{
    CreateMemoryFrom,
  
 },
 methods:{
        saveMemory(Memory:Memory){
          this.memoriesStore.addMemory(Memory)
          this.$router.replace('/memories')
     }
    }
})
</script>