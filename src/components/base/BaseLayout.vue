<template>
    <ion-page>
        <ion-header >
            <ion-toolbar color="dark">
                <ion-buttons slot="start">
                <ion-back-button :default-href="pageDefaultBackLink"></ion-back-button>
                </ion-buttons>
                <ion-title>{{pageTitle}}</ion-title>
                <ion-buttons slot="end">
                    <slot name="actions-sign"></slot>
                </ion-buttons>
                <ion-buttons slot="end">
                    <slot name="actions-end"></slot>
                </ion-buttons>
                
            </ion-toolbar>
        </ion-header>
        <ion-content>
        <slot/>
        </ion-content>
</ion-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonBackButton ,IonButtons} from '@ionic/vue';
export default defineComponent({
    name: 'BaseLayout',
    props:['pageTitle','pageDefaultBackLink'],
    components: {
        IonPage,
        IonContent,
        IonTitle,
        IonHeader,
        IonToolbar,
        IonBackButton,
        IonButtons
    }
})
</script>
