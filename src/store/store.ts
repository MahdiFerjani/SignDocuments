import { defineStore } from 'pinia';
import { Memory } from '@/Models/Memory';
export const useMemoriesStore = defineStore({
  id: 'memories',
  state: () => ({
    memories: [
      {
        id: '1',
        image:'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
        title: 'A trip into the mountains',
        description: 'It was a really nice trip',
      },
      {
        id: '2',
        image:'https://newquayactivitycentre.co.uk/wp-content/uploads/2017/08/featured-faq-surfing.jpg',
        title: 'Surfing the sea Side',
        description: 'Feeling the cool breez',
      },
      {
        id: '3',
        image:'https://blog.myfitnesspal.com/wp-content/uploads/2017/12/Essential-Guide-to-Healthy-Eating-2.png',
        title: 'Good eating',
        description: 'Really tasty',
      },
    ],
    
    
  }),
  getters:{
    getMemoryById(state){
    return (memoryid:string)=>{
    return state.memories.find(memory=>memory.id===memoryid)
  }
}
  },
  actions: {
    addMemory(Memory:Memory){
      this.memories.push(Memory)
    },
    deleteMemory(id: string) {
      const index = this.memories.findIndex(memory => memory.id === id);
      if (index !== -1) {
        this.memories.splice(index, 1);
      }
    },
    editMemory(id: string, memory: Memory) {
      const index = this.memories.findIndex(memory => memory.id === id);
      if (index !== -1) {
        this.memories.splice(index, 1, memory);
      }
    }
  },
});