<template>
  <base-layout page-title="All Files">
    <div class="flex-container">
      <div :key="index"  v-for="(item, index) in signatures" class="card-categories" style="background:#e2e2e2;">
        <ion-thumbnail>
          <img :src="item.imageData" :draggable="true" v-on:dragstart="onDragStart($event)"  v-bind:data-image="item.imageData" v-on:dragend="onDragEnd($event)" />
        </ion-thumbnail>
      </div>
    </div>
    <div class="pdf-header">
    <ion-button size="large" @click="goToNextPage">Next</ion-button>
    <ion-button size="large" @click="goToPrevPage">Prev</ion-button>
    <ion-button size="large" @click="goToPrevPage">FreeHand</ion-button>
    </div>
    <div class="pdf-container">
      <div v-if="totalPages > 0">
      Page {{ currentPage }} / {{ totalPages }}
    </div>
    <ion-button size="large" @click="goToPrevPage"><ion-icon slot="icon-only" :icon="pencil"></ion-icon></ion-button>
      <vue-pdf-embed :source="pdfUrl" :page="currentPage" ref="pageRef" @loaded="onPdfLoaded"  @drop="onDrop($event)" @dragover.prevent />
    </div>
  </base-layout>
</template>
  <script lang="ts" >
  import { defineComponent, ref } from "vue";
  import {Signature} from '@/Models/Signature'
  import { usePdfStore } from "../store/PdfStore";
  import { useRoute } from "vue-router";
  import VuePdfEmbed , {VuePdfEmbedData ,VuePdfEmbedMethods} from "vue-pdf-embed";
  import { pencil} from "ionicons/icons";
  import { IonButton ,IonThumbnail} from "@ionic/vue";
  import { useSignatureStore } from '@/store/SignatureStore';
  export default defineComponent({
    components: {
      IonButton,
      VuePdfEmbed,
      IonThumbnail,
    },
 
    data() {
      return {
        signatureImg : null as any,
        signatures : [] as Signature[],
        droppedSignature:[] as  any,
        pdfUrl: "",
        showPdfViewer: false,
        signedPdfUrl: "",
        currentPage: 1,
        totalPages: 0,
        loading: true,
        pencil,
        
      };
    },
  
    methods: {
      onDragStart(event : any) {
        const target = event.target as HTMLImageElement;
        const imageData = target.getAttribute('data-image');
        event.dataTransfer.setData('text/plain', imageData);
        event.target.classList.add('dragging');
      },
      onDragEnd(event:any) {
        event.target.classList.remove('dragging');
      },
      onDrop(event: any) {
  event.preventDefault();

  // Get signature data from drag event
  const signatureData = event.dataTransfer.getData("text/plain");

  const signatureImg = new Image();
  signatureImg.src = signatureData;

  signatureImg.style.width = '100%';
  signatureImg.style.height = '100%';
  signatureImg.style.objectFit = 'contain';
  // Create signature container element
  const signatureContainer = document.createElement('div');
  signatureContainer.style.position = 'absolute';
  signatureContainer.style.left = `${event.offsetX - (signatureImg.width)/2}px`;
  signatureContainer.style.top = `${event.offsetY - (signatureImg.height)/2}px`;
  signatureContainer.style.border = '1px dashed black';
  signatureContainer.style.cursor = 'move';
  const annotationLayer = document.getElementsByClassName("annotationLayer")[0];
  annotationLayer.appendChild(signatureContainer);
  // Create signature image element
  signatureContainer.appendChild(signatureImg);
  // Create resize handle element
  const resizeHandle = document.createElement('div');
  resizeHandle.style.position = 'absolute';
  resizeHandle.style.width = '10px';
  resizeHandle.style.height = '10px';
  resizeHandle.style.border = '1px solid black';
  resizeHandle.style.right = '0';
  resizeHandle.style.bottom = '0';
  resizeHandle.style.cursor = 'nwse-resize';
  signatureContainer.appendChild(resizeHandle);

  // Create delete button element
  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'X';
  deleteButton.style.color ='red'
  deleteButton.style.position = 'absolute';
  deleteButton.style.right = '0';
  deleteButton.style.top = '0';
  deleteButton.style.border = '1px solid red' ;
  deleteButton.style.background ='none';
  deleteButton.style.cursor = 'pointer';
  signatureContainer.appendChild(deleteButton);

  
  signatureContainer.setAttribute('data-image', signatureData);


  signatureImg.removeEventListener('dragstart', this.onDragStart);


  signatureContainer.addEventListener('dragend', () => {
    signatureContainer.remove();
  });


  resizeHandle.addEventListener('mousedown', (event) => {
    event.preventDefault();

    const initialWidth =  signatureContainer.offsetWidth;
    const initialHeight = signatureContainer.offsetHeight;
    const initialX = event.clientX;
    const initialY = event.clientY;

    // Add mousemove event listener to handle resize
    document.addEventListener('mousemove', handleResize);

    // Add mouseup event listener to stop resizing
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', handleResize);

    });

    // Event listener function to handle resize
    function handleResize(event : any) {
      event.preventDefault();
      const newWidth = initialWidth + (event.clientX - initialX);
      const newHeight = initialHeight + (event.clientY - initialY);
      signatureContainer.style.width = `${newWidth}px`;
      signatureContainer.style.height = `${newHeight}px`;
    }
  });

  // Add click event listener to delete button
  deleteButton.addEventListener('click', () => {
    signatureContainer.remove();
  });
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
    cursor: move ;
  }
  
  .dragging {
    opacity: 0.7;
    transform: scale(1.2);
    background-color: rgba(77, 151, 80, 0.404);
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