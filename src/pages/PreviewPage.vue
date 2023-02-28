<template>
    <base-layout page-title="All Files">
     <div :key="index" v-for="(item, index) in signatures"  v-on:dragstart="onDragStart($event, item.imageData)"   >
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
      <div @drop="onDrop($event)" @dragover.prevent>
      <vue-pdf-embed :source="pdfUrl" :page="currentPage" ref="pageRef" @loaded="onPdfLoaded" />
    </div>
    </base-layout>
  </template>
  
  <script lang="ts" >
  import { defineComponent, ref } from "vue";
  import { PDFDocument, StandardFonts } from 'pdf-lib';
  import jsPDF from 'jspdf';
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
        signedPdfUrl: "",
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
      onDragStart(event : any, imageData :any) {
  event.dataTransfer.setData('text/plain', imageData);
},
async onDrop(event: any) {
      const imageData = event.dataTransfer.getData("text/plain");
      const image = new Image();
      image.src = imageData;
      const pdfBytes = await fetch(this.pdfUrl).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const [page] = pdfDoc.getPages();
      const { width, height } = page.getSize();
      const signatureImage = await pdfDoc.embedPng(imageData);
      const signatureImageWidth = 100;
      const signatureImageHeight = (signatureImageWidth  * signatureImage.height
    ) / signatureImage.width;
        const annotation = {
    x: 100,
    y: 100,
    width: signatureImageWidth,
    height: signatureImageHeight,
  //  color: rgb(1, 0, 0),
    //borderColor: rgb(1, 1, 1),
    borderWidth: 3,
    iconName: "Comment",
   // iconColor: rgb(1, 1, 1),
    contents: "Signed by User",
    modifyDate: new Date(),
  };
  page.drawRectangle({
    x: annotation.x - 2,
    y: annotation.y - 2,
    width: annotation.width + 4,
    height: annotation.height + 4,
    borderWidth: 0,
  //  color: rgb(1, 0, 0),
  });
  page.drawText(annotation.contents, {
    x: annotation.x + 10,
    y: annotation.y + annotation.height / 2,
    size: 10,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    //color: rgb(1, 1, 1),
  });
  page.drawImage(signatureImage, {
    x: annotation.x,
    y: annotation.y,
    width: signatureImageWidth,
    height: signatureImageHeight,
  });
  const pdfBytesSigned = await pdfDoc.save();
  this.signedPdfUrl = URL.createObjectURL(
    new Blob([pdfBytesSigned], { type: "application/pdf" })
  );
},
async viewSignedPdf() {
  if (this.signedPdfUrl) {
    window.open(this.signedPdfUrl, "_blank");
  }
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