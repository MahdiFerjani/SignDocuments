<template>
    <base-layout page-title="add file" page-default-back-link="/Files">
      <form @submit.prevent="submitForm" class="ion-padding">
        <ion-list>
          <ion-item>
            <input type="file" accept="application/pdf" @change="handleFileInput" />
          </ion-item>
          <ion-item>
            <ion-input placeholder="File Name" v-model="name" type="text" required />
          </ion-item>
        </ion-list>
        <ion-button color="dark" type="submit" expand="full">save</ion-button>
      </form>
    </base-layout>
  </template>
  
  <script lang="ts">
    import { defineComponent } from "vue";
    import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
    import { usePdfStore } from "@/store/PdfStore";
    import { IonInput,IonList, IonItem, IonButton } from "@ionic/vue";
    import { Document } from "@/Models/Document";
  
    export default defineComponent({
      name: "AddFiles",
      components: {
        IonInput,
       
        IonList,
        IonItem,
        IonButton,
      },
      setup() {
        const myPdfStore = usePdfStore();
  
        return {
          myPdfStore,
        };
      },
      data() {
        return {
          name: "" as string,
          path: "",
          data :'' as any
        };
      },
      methods: {
        submitForm() {
          const doc: Document = {
            id: Date.now().toString(),
            path: this.path,
            name: this.name,
            data: this.data
          };
  
          this.myPdfStore.addDocument(doc);
          this.$router.replace('/files')
          console.log(doc);
        },
        async handleFileInput(event: Event) {
        
          const fileInput = event.target as HTMLInputElement;
          if (fileInput.files != null && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            
           
            await new Promise((resolve) => {
              reader.onload = resolve;
              console.log(reader);
            });
  
            
           
           
             const data1 = new Uint8Array(reader.result as ArrayBuffer);
            const data = btoa(String.fromCharCode(...data1));
            try {
             
              const fileExtension = ".pdf";
              await Filesystem.writeFile({
                path: this.name ?`${this.name}${fileExtension}` : file.name,
                data,
                directory: Directory.Documents,
             
              }).then((e:any) => {
                this.path = e.uri;
                
              });
              console.log(this.path);
              this.data=data
            } catch (error) {
              console.error("Error saving file:", error);
            }
          } else {
            console.log("No file selected");
          }
        },
      },
    });
  </script>
  