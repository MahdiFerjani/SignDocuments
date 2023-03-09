<template>
  <base-layout color="light" :page-title="docName">

    <div class="app-top-tools">
      <ion-chip color="white"> page {{ currentPage }} / {{ totalPages }}</ion-chip>
      <ion-button color="light" size="small" @click="goToPrevPage"><ion-icon slot="icon-only"
          :icon="playBack"></ion-icon></ion-button>
      <ion-button color="light" size="small" @click="goToNextPage"><ion-icon slot="icon-only"
          :icon="playForward"></ion-icon></ion-button>
      <ion-button color="light" size="small" @click="Print"><ion-icon slot="icon-only"
          :icon="download"></ion-icon></ion-button>
      <ion-button color="light" size="small" @click="showSignatures = !showSignatures"><ion-icon slot="icon-only"
          :icon="pencil"></ion-icon></ion-button>
    </div>
    <div v-if="showSignatures">
      <div class="flex-container">
        <div :key="index" v-for="(item, index) in signatures" class="card-signatures">
          <ion-thumbnail>
            <img :src="item.imageData" :draggable="true" v-on:dragstart="onDragStart($event)"
              v-bind:data-image="item.imageData" v-on:dragend="onDragEnd($event)" />
          </ion-thumbnail>
        </div>
        <div @click="addSignature" class="card-signatures freehand">
          <ion-thumbnail>
            <img :draggable="false" :src="pencil" />
          </ion-thumbnail>
        </div>
      </div>
    </div>
    <div class="pdf-container">

      <vue-pdf-embed id="vuepa" :source="pdfUrl" :page="currentPage" ref="pageRef" @loaded="onPdfLoaded"
        @drop="onDrop($event)" @dragover.prevent />
    </div>
  </base-layout>
</template>
<script lang="ts" >
import { fabric } from 'fabric';
import { defineComponent, ref } from "vue";

import { Signature } from '@/Models/Signature'
import { usePdfStore } from "../store/PdfStore";
import { useRoute } from "vue-router";
import VuePdfEmbed, { VuePdfEmbedData, VuePdfEmbedMethods } from "vue-pdf-embed";
import { pencil, playBack, playForward, download, brush} from "ionicons/icons";
import { IonButton, IonThumbnail, IonIcon, IonChip,IonFab} from "@ionic/vue";
import { useSignatureStore } from '@/store/SignatureStore';
export default defineComponent({
  components: {
    IonButton,
    VuePdfEmbed,
    IonThumbnail,
    IonIcon,
    IonChip,
  },
  data() {
    return {
      signatureImg: null as any,
      signatures: [] as Signature[],
      showSignatures: false,
      pdfUrl: "",
      freeHandEnabled: false,
      docName: "" as string,
      showPdfViewer: false,
      signedPdfUrl: "",
      currentPage: 1,
      totalPages: 0,
      loading: true,
      pencil,
      brush,
      playBack, playForward, download
    };
  },

  methods: {
    onDragStart(event: any) {
      const target = event.target as HTMLImageElement;
      const imageData = target.getAttribute('data-image');
      event.dataTransfer.setData('text/plain', imageData);
      event.target.classList.add('dragging');
    },
    onDragEnd(event: any) {
      event.target.classList.remove('dragging');
    },
    Print() {
      const link = document.createElement('a');
      link.href = this.pdfUrl;
      link.target = '_blank';
      link.download = `${this.docName}.pdf`;
      link.click();
    },
    onDrop(event: any) {
      event.preventDefault();
      const signatureData = event.dataTransfer.getData("text/plain");
      const signatureImg = new Image();
      signatureImg.src = signatureData;
      signatureImg.style.width = '100%';
      signatureImg.style.height = '100%';
      signatureImg.style.objectFit = 'contain';
      const signatureContainer = document.createElement('div');
      signatureContainer.style.position = 'absolute';
      signatureContainer.style.left = `${event.offsetX - (signatureImg.width) / 2}px`;
      signatureContainer.style.top = `${event.offsetY - (signatureImg.height) / 2}px`;
      signatureContainer.style.border = '1px dashed black';
      signatureContainer.style.cursor = 'move';
      const annotationLayer = document.getElementsByClassName("annotationLayer")[0];
      annotationLayer.appendChild(signatureContainer);
      // Create signature image element
      signatureContainer.appendChild(signatureImg);
      // Create resize handle element
      const resizeHandle = document.createElement('div');
      resizeHandle.setAttribute("id", "resizeBtn")
      resizeHandle.style.position = 'absolute';
      resizeHandle.style.width = '10px';
      resizeHandle.style.height = '10px';
      resizeHandle.style.border = '1px solid white';
      resizeHandle.style.background = 'black';
      resizeHandle.style.right = '0';
      resizeHandle.style.bottom = '0';
      resizeHandle.style.cursor = 'nwse-resize';
      signatureContainer.appendChild(resizeHandle);

      // Create delete button element
      const deleteButton = document.createElement('button');
      deleteButton.setAttribute("id", "deleteBtn")
      deleteButton.innerText = 'X';
      deleteButton.style.color = 'white'
      deleteButton.style.position = 'absolute';
      deleteButton.style.right = '0';
      deleteButton.style.top = '0';
      deleteButton.style.border = '1px black ';
      deleteButton.style.background = 'black';
      deleteButton.style.cursor = 'pointer';
      signatureContainer.appendChild(deleteButton);


      signatureContainer.setAttribute('data-image', signatureData);


      signatureImg.removeEventListener('dragstart', this.onDragStart);


      signatureContainer.addEventListener('dragend', () => {
        signatureContainer.remove();
      });


      resizeHandle.addEventListener('mousedown', (event) => {
        event.preventDefault();

        const initialWidth = signatureContainer.offsetWidth;
        const initialHeight = signatureContainer.offsetHeight;
        const initialX = event.clientX;
        const initialY = event.clientY;
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', () => {
          document.removeEventListener('mousemove', handleResize);
        });
        function handleResize(event: any) {
          event.preventDefault();
          const newWidth = initialWidth + (event.clientX - initialX);
          const newHeight = initialHeight + (event.clientY - initialY);
          signatureContainer.style.width = `${newWidth}px`;
          signatureContainer.style.height = `${newHeight}px`;
          signatureImg.width = newWidth
          signatureImg.height = newHeight
        }
      });
      signatureImg.addEventListener('click', () => {
        signatureContainer.style.border = '1px dashed black';
        signatureContainer.style.cursor = 'move';
        const deleteBtn = document.getElementById("deleteBtn")
        deleteBtn ? deleteBtn.style.display = 'block' : null
        const resizeBtn = document.getElementById("resizeBtn")
        resizeBtn ? resizeBtn.style.display = 'block' : null
      });

      deleteButton.addEventListener('click', () => {
        signatureContainer.remove();
      });

      //const currentHtmlPage= document.querySelector('.textLayer') as HTMLElement;
      document.addEventListener('click', (event: any) => {
        if (!signatureContainer.contains(event.target)) {
          signatureContainer.style.border = 'none';
          const deleteBtn = document.getElementById("deleteBtn")
          deleteBtn ? deleteBtn.style.display = 'none' : null
          const resizeBtn = document.getElementById("resizeBtn")
          resizeBtn ? resizeBtn.style.display = 'none' : null
        }
      });

    },
   

    

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
    addSignature() {
  const container = (this.$refs.pageRef as any).$el;
  const originalCanvasElement = container.querySelector('canvas');
  const existingCanvasElement = document.getElementById("canvasCopy");
  const canvasElement = existingCanvasElement as HTMLCanvasElement|| document.createElement('canvas');
  canvasElement.setAttribute("id", "canvasCopy");
  canvasElement.width = originalCanvasElement.clientWidth;
  canvasElement.height = originalCanvasElement.clientHeight;
  canvasElement.style.position = 'absolute';
  canvasElement.style.top = `${originalCanvasElement.offsetTop}px`;
  canvasElement.style.left = `${originalCanvasElement.offsetLeft}px`;
  canvasElement.style.zIndex = '2';
  if (!existingCanvasElement) {
    container.appendChild(canvasElement);
  }
  const fabricCanvas = new fabric.Canvas(canvasElement);
  fabricCanvas.isDrawingMode = true;
  fabricCanvas.freeDrawingBrush.color = 'black';
  fabricCanvas.freeDrawingBrush.width = 2;
  fabricCanvas.freeDrawingBrush.opacity = 1;
  originalCanvasElement.style.position = 'absolute';
  originalCanvasElement.style.top = `${originalCanvasElement.offsetTop}px`;
  originalCanvasElement.style.left = `${originalCanvasElement.offsetLeft}px`;
 

  canvasElement.addEventListener('mousedown', function (event) {
    fabricCanvas.freeDrawingBrush.onMouseDown(event);
  });
  canvasElement.addEventListener('mousemove', function (event) {
    fabricCanvas.freeDrawingBrush.onMouseMove(event);
  });

  // Add a button to save the signature
const saveButton = document.createElement('ion-chip');
const icon = document.createElement('ion-icon');
icon.setAttribute('icon', this.brush);
saveButton.append(icon);
saveButton.setAttribute('slot', 'fixed');
saveButton.setAttribute('vertical', 'bottom');
saveButton.setAttribute('horizontal', 'center');
saveButton.innerText = 'Save Signature';
saveButton.style.position = 'absolute';

  saveButton.style.zIndex = '3';
  saveButton.addEventListener('click', async function() {
    const dataURL = await fabricCanvas.toDataURL();
    fabricCanvas.isDrawingMode = false;

    // Add signature image to canvas as an object
    fabric.Image.fromURL(dataURL, function(img : any ) {
      img.set({
        left: fabricCanvas.getWidth() / 2,
        top: fabricCanvas.getHeight() / 2,
        originX: 'center',
        originY: 'center',
        scaleX: fabricCanvas.getWidth() / img.width,
        scaleY: fabricCanvas.getHeight() / img.height,
        selectable: true,
        hasBorders: true,
        hasControls: true
      });
       console.log(img.getElement())
      const annotationLayer = document.getElementsByClassName("annotationLayer")[0];
      annotationLayer.appendChild(img);
    });
  });

  container.appendChild(saveButton);
}


    
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
    this.docName = doc?.name
    document.body.onresize = () => {
      (this.$refs.pageRef as VuePdfEmbedMethods)?.render()

    }


  },
});
</script>
<style>
#body {

  background: #dedede;

}

.card-signatures {

  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  color: white;
  width: 110px;
  margin: 10px;
  opacity: 0.8;
  cursor: move;

}

.freehand {
  cursor: pointer;
}

.dragging {
  opacity: 0.7;
  transform: scale(1.2);
  background-color: rgba(77, 151, 80, 0.404);
}

.pdf-container {
  background-color: #dedede;
  padding-left: 200px;
  padding-right: 200px;

}

.pdf-header {
  display: flex;
  justify-content: center;
  margin-bottom: 0px, 16px, 0px, 16px;
}

.app-top-tools {
  background-color: rgb(153, 153, 153);
  color: white;
  line-height: 2em;
  display: flex;

}


.flex-container {

  background-color: #b1aeae;
  display: flex;
  justify-content: center;
}</style>