import { defineStore } from 'pinia';
import { Document } from '@/Models/Document';
export const usePdfStore = defineStore({
  id: 'pdfs',
  state: () => ({
    Documents: [] as Document[]
  }),
  getters:{
    getDocumentById(state){
    return (id:string)=>{
    return state.Documents.find(doc=>doc.id===id)
  }
}},
  actions: {
    addDocument(doc:Document){
      this.Documents.push(doc)
    },
  }
});