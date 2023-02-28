import { defineStore } from 'pinia';
import { Signature } from '@/Models/Signature';
export const useSignatureStore = defineStore({
  id: 'signature',
  state: () => ({
    Signatures: [] as Signature[]
  }),
  getters:{
    getDocumentById(state){
    return (id:string)=>{
    return state.Signatures.find(sign=>sign.id===id)
  }
}},
  actions: {
    addSignature(Sign:Signature){
      this.Signatures.push(Sign)
    },
  }
});