<template>
  <base-layout page-title="All Files">
    <ion-list>
      <ion-item v-for="file in files" :key="file.id" :router-link="`/file/${file.id}`">
        <ion-icon slot="start" :icon="readerOutline"></ion-icon>
        <ion-label>{{ file.name }}</ion-label>
      </ion-item>
    </ion-list>
   
    <template v-slot:actions-end>
      <ion-button router-link="/files/add">
        <ion-icon slot="icon-only" :icon="add"></ion-icon>
      </ion-button>
    </template>
    <template v-slot:actions-sign>
      <ion-button router-link="/sign">
        <ion-icon slot="icon-only" :icon="brush"></ion-icon>
      </ion-button>
    </template>
  </base-layout>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { usePdfStore } from "../store/PdfStore";
import {IonLabel, IonIcon, IonButton, IonList, IonItem} from "@ionic/vue";
import { brush ,add, readerOutline } from "ionicons/icons";
import { Document} from '@/Models/Document';

export default defineComponent({
  name: "DocumentPage",
  components: { IonLabel, IonIcon, IonButton, IonList, IonItem },
  setup() {
    const fileStore = usePdfStore();
    const files = computed(() => fileStore.Documents);
    return { files, add, readerOutline ,brush};
  },
  data() {
    return { showPreviewModal: false, pdfUrl: "" };
  },
  methods: {
    previewPDF(file: Document) {
      this.pdfUrl=`data:application/pdf;base64,${file.data}`
      this.showPreviewModal=true
    },
  
  },
});
</script>
