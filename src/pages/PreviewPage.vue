<template>
  <base-layout page-title="All Files">
    <div class="flex-container">
      <div :key="index"  v-for="(item, index) in signatures" class="card-categories ion-activatable ripple-parent" style="background:#e2e2e2;">
        <ion-thumbnail>
          <img :src="item.imageData" :draggable="true" v-on:dragstart="onDragStart($event, item.imageData)" v-on:dragend="onDragEnd($event)" />
        </ion-thumbnail>
      </div>
    </div>
    <div class="pdf-header">
    <ion-button size="large">sign</ion-button>
    <ion-button size="large" @click="goToNextPage">Next</ion-button>
    <ion-button size="large" @click="goToPrevPage">Prev</ion-button>
    </div>
    <div class="pdf-container">
      <div v-if="totalPages > 0">
      Page {{ currentPage }} / {{ totalPages }}
    </div>
      <vue-pdf-embed :source="pdfUrl" :page="currentPage" ref="pageRef" @loaded="onPdfLoaded" @touchmove.prevent @touchend.prevent @touchcancel.prevent @touchstart.prevent @drop="onDrop($event)" @dragover.prevent />
      <canvas v-if="signatureImg" ref="canvasRef" style="position: absolute; left: 0; top: 0;"></canvas>
    </div>
  </base-layout>
</template>
  <script lang="ts" >
  import { defineComponent, ref } from "vue";
  import {Signature} from '@/Models/Signature'
  import { usePdfStore } from "../store/PdfStore";
  import { useRoute } from "vue-router";
  import VuePdfEmbed , {VuePdfEmbedData ,VuePdfEmbedMethods} from "vue-pdf-embed";
  import { IonButton } from "@ionic/vue";
  import { useSignatureStore } from '@/store/SignatureStore';
  export default defineComponent({
    components: {
      IonButton,
      VuePdfEmbed,
    
    },
 
    data() {
      return {
        signatureImg : null as any,
        signatures : [] as Signature[],
        pdfUrl: "",
        showPdfViewer: false,
        signedPdfUrl: "",
        currentPage: 1,
        totalPages: 0,
        loading: true,
      };
    },
  
    methods: {
      onDragStart(event : any, imageData : any) {
        event.dataTransfer.setData('text/plain', imageData);
        event.target.classList.add('dragging');
      },
      onDragEnd(event:any) {
        event.target.classList.remove('dragging');
      },
      onDrop(event :any ) {
       event.preventDefault();
       const signatureData = event.dataTransfer.getData("text/plain");
       if (!this.signatureImg) {
       this.signatureImg = new Image();
       const annotationLayer = document.getElementsByClassName("annotationLayer")[0];
       annotationLayer.appendChild(this.signatureImg);
       this.signatureImg.style.position = "absolute";
   }

  this.signatureImg.src = signatureData;
  const canvas = document.getElementsByTagName("canvas")[0];
  const canvasRect = canvas.getBoundingClientRect();
  const signatureWidth = this.signatureImg.width;
  const signatureHeight = this.signatureImg.height;
  const x = event.offsetX - (signatureWidth / 2);
  const y = event.offsetY - (signatureHeight / 2);
  this.signatureImg.style.left = `${x}px`;
  this.signatureImg.style.top = `${y}px`;
}
,
      goToNextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      goToPrevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      onPdfLoaded() {
        const pageCount = (this.$refs.pageRef as VuePdfEmbedData)?.pageCount ?? 0;
        this.totalPages = pageCount;
        this.loading = false;
      },
    },
    async mounted() {
      const signatureStore = useSignatureStore();
      this.signatures = signatureStore.Signatures;
      const route = useRoute();
      const Store = usePdfStore();
      const id = route.params.id as string;
      const doc = Store.getDocumentById(id);
      const base64String = doc?.data;
      this.pdfUrl = `data:application/pdf;base64,${base64String}`;
      document.body.onresize=()=>{
      (this.$refs.pageRef as VuePdfEmbedMethods)?.render()
     // this.signatureImg=null;
}
    },
  });
  </script>
  <style>
  #body{
 
    background-color: #dedede;

  }
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
  
  .card-categories {
  background-color:  #dedede;
  width: 100px;
  margin: 10px;
  text-align: center;
  line-height: 75px;
  font-size: 30px;
  }
  .dragging {
    opacity: 0.7;
    transform: scale(1.2);
  }
  .pdf-container {
  background-color: #dedede;
   padding:16px;
}
.pdf-header {
  display: flex;
  justify-content: center;
  margin-bottom: 0px,16px,0px,16px;
}

@media (min-width: 640px) {
  .pdf-container {
    padding:  0px,32px,0px,32px;
  }
}

@media (min-width: 768px) {
  .pdf-container {
    padding: 0px,64px,0px,64px;
  }
}

@media (min-width: 1024px) {
  .pdf-container {
    padding: 0px,128px,0px,128px;
  }
  
}
.flex-container {
  display: flex;
  flex-wrap: nowrap;

}
</style>