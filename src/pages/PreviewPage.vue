<template>
    <base-layout page-title="All Files">
     <div :key="index" v-for="(item, index) in signatures"   >
        <div class="card-categories ion-activatable ripple-parent" style="background:#e2e2e2;">
          
          <ion-thumbnail>
          <img :src="item.imageData" />
          </ion-thumbnail>
        </div>
      </div>
      <ion-button @click="goToNextPage">Next</ion-button>
      <ion-button @click="goToPrevPage">Prev</ion-button>
      <ion-spinner v-if="loading" />
      <div v-if="totalPages > 0">
            Page {{ currentPage }} of {{ totalPages }}
      </div>
      <vue-pdf-embed :source="pdfUrl" :page="currentPage" ref="pageRef" @loaded="onPdfLoaded" />
    </base-layout>
  </template>
  
  <script lang="ts" >
  import { defineComponent, ref } from "vue";
  import MySignaturePage from "./MySignaturePage.vue";

  import { usePdfStore } from "../store/PdfStore";
  import { useRoute } from "vue-router";
  import VuePdfEmbed , {VuePdfEmbedData} from "vue-pdf-embed";
  import { IonButton, IonSpinner } from "@ionic/vue";
  import { useSignatureStore } from '@/store/SignatureStore';
  export default defineComponent({
    components: {
     // MySignaturePage,
      IonButton,
      VuePdfEmbed,
      IonSpinner,
    },
    setup(){
      const signatureStore = useSignatureStore();
      const signatures = signatureStore.Signatures;
      return {
        signatures,
      };
    },

    data() {
      return {
        pdfUrl: "",
        showPdfViewer: false,
        currentPage: 1,
        totalPages: 0,
        loading: true,
      };
    },
  
    methods: {
      async goToNextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      async goToPrevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      onPdfLoaded() {
        const pageCount =(this.$refs.pageRef as VuePdfEmbedData)?.pageCount ?? 0;
        this.totalPages = pageCount;
        this.loading = false;
      },
    },
  
    async mounted() {
      const route = useRoute();
      const Store = usePdfStore();
      const id = route.params.id as string;
      const doc = Store.getDocumentById(id);
      const base64String = doc?.data;
      this.pdfUrl = `data:application/pdf;base64,${base64String}`;
    },
  });
  </script>
  <style>
  .card-categories {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    background: var(--ion-color-light);
    border-radius: 10px;
    color: white;
    width: 110px;
    margin-left:10px;
    opacity: 0.8;
  }
  
  .card-categories ion-icon {
    font-size: 40px;
    margin-bottom: 8px;
  }
</style>