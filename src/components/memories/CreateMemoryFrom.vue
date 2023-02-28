<template>
    <form @submit.prevent="submitForm" class="ion-padding">
<ion-list>
    <ion-item>
        <ion-label position="floating">
            Title
        </ion-label>
        <ion-input v-model="Memory.title" type="text" required/>
    </ion-item>
    <ion-item>
        <ion-label  position="floating">
            Image
        </ion-label>
        <ion-input v-model="Memory.image" type="text" required/>
    </ion-item>
    <ion-item>
        <ion-label v-model="Memory.description"  position="floating">
            description
        </ion-label>
        <ion-textarea :rows="5"></ion-textarea>
    </ion-item>
   
        <ion-button type="submit" expand="full">save</ion-button>
    
</ion-list>
</form>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Memory } from '@/Models/Memory';
import {IonInput,IonLabel,IonTextarea,IonList,IonItem,IonButton} from '@ionic/vue'
export default defineComponent({
    emits:["save-memory"],
    components:{
    IonInput,
    IonLabel,
    IonTextarea,
    IonList,
    IonItem,
    IonButton
},
data(){
    return{
        Memory:{
        id:new Date().toISOString(),
        title:'' as string,
        image:'' as string,
        description:'' as string
        } as Memory
    }
}
,
methods:{
    submitForm(){
        this.$emit('save-memory',this.Memory)
    }
}
})
</script>