<template>
  <base-layout page-title="Draw signature" page-default-back-link="/Files">
    <div class="canvas-container">
      <canvas id="my-canvas" ref="canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"></canvas>
    </div>
    <div class="button-container">
      <ion-row>
        <ion-col>
          <ion-button @click="clear">Clear</ion-button>
        </ion-col>
        <ion-col>
          <ion-button @click="save">Save</ion-button>
        </ion-col>
      </ion-row>
    </div>
  </base-layout>
</template>
<script >
import { fabric } from 'fabric';
import { useSignatureStore }from "@/store/SignatureStore";

import {Signature} from '@/Models/Signature'
import {IonButton,IonCol,IonRow} from '@ionic/vue'
export default {
  components:{
   IonButton,
   IonCol,
   IonRow
  },

  setup() {
        const SignatureStore=useSignatureStore()
  
        return {
          SignatureStore
        };
      },
  data() {
    return {
      isDrawing: false,
      signature: null
    };
  },
  mounted() {
      this.canvas = new fabric.Canvas(this.$refs.canvas, {
      width: window.innerWidth,
      height: window.innerHeight,
      isDrawingMode: true,
      freeDrawingBrush: new fabric.PencilBrush(this.canvas)
    });
  },
  methods: {
      startDrawing(e) {
      this.isDrawing = true;
      const pointer = this.canvas.getPointer(e.e);
      this.canvas.freeDrawingBrush.color = 'black';
      this.canvas.freeDrawingBrush.width = 5;
      this.canvas.freeDrawingBrush.moveTo(pointer.x, pointer.y);
    },
    draw(e) {
      if (this.isDrawing) {
        const pointer = this.canvas.getPointer(e.e);
        this.canvas.freeDrawingBrush.lineTo(pointer.x, pointer.y);
        this.canvas.renderAll();
      }
    },
    stopDrawing() {
      this.isDrawing = false;
    },
    clear() {
      this.canvas.clear();
    },
    cropBase64Image(base64String) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64String;
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          let left = canvas.width;
          let right = 0;
          let top = canvas.height;
          let bottom = 0;
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const i = (y * canvas.width + x) * 4;
              if (imageData.data[i + 3] !== 0) {
                    left = Math.min(left, x);
                    right = Math.max(right, x);
                    top = Math.min(top, y);
                    bottom = Math.max(bottom, y);
                    }
                  }
                }      
          const croppedCanvas = document.createElement("canvas");
          const croppedCtx = croppedCanvas.getContext("2d");
          const croppedWidth = right - left + 1;
          const croppedHeight = bottom - top + 1;
          croppedCanvas.width = croppedWidth;
          croppedCanvas.height = croppedHeight;
          croppedCtx.drawImage(canvas, left, top, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);
          const croppedBase64String = croppedCanvas.toDataURL("image/png").split(",")[1];
          resolve(croppedBase64String);
        };
        img.onerror = function () {
          reject(new Error('Invalid base64 string.'));
        };
        img.src = `data:image/png;base64,${base64String}`;
      });
    },

    save() {
      const dataURL = this.canvas.toDataURL();
      const base64String = dataURL.substring(dataURL.indexOf(',') + 1);
      this.cropBase64Image(base64String)
        .then(croppedBase64 => {
          const signature={
            id:Date.now().toString(),
            imageData:`data:image/png;base64,${croppedBase64}`
          }
          this.SignatureStore.addSignature(signature)
        })
        .catch(error => {
          console.error(error);
        });
        this.$router.push('/files')
        this.canvas.clear()
    }

  
  }
}




</script>
<style scoped>
.canvas-container {
  height: 80vh;
  border: 2px solid rgb(244, 36, 36);
  background-color: white;
  overflow: hidden;
}
.button-container {
  padding: 10px 10px 20px 10px;
  font-size: 14px;
}

ion-button {
  width: 100%;
}
</style>