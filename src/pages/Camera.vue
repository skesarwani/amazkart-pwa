<template>
  <q-page class="constrain-more q-pa-md">
    <div class="camera-frame q-pa-md">
      <video v-show="!imageCaptured" ref="video" class="full-width" height="240" autoplay />
      <canvas v-show="imageCaptured" ref="canvas" class="full-width" height="240" />
    </div>
    <div class="text-center q-pa-md">
      {{cameraError}}
      <q-btn-group rounded>
        <q-btn color="grey-10" size="lg" @click="toggleCamera" :disable="videoDevices.length <= 1 || !hasCameraSupport" rounded glossy icon="eva-toggle-left-outline" />
        <q-btn color="grey-10" rounded glossy size="lg" icon="eva-camera" :disable="imageCaptured || !hasCameraSupport" @click="captureImage" />
      </q-btn-group>
      <!-- <q-btn
        v-if="hasCameraSupport"
        @click="captureImage"
        color="grey-10"
        icon="eva-toggle-left-outline"
        size="lg"
        :disable="videoDevices.length <= 1"
        round
      />
      <q-btn
        v-if="hasCameraSupport"
        @click="captureImage"
        color="grey-10"
        icon="eva-camera"
        size="lg"
        :disable="imageCaptured"
        round
      /> -->
      <q-file
        v-model="imageUpload"
        @input="captureImageFallback"
        label="Choose an image"
        accept="image/*"
        
        borderless
      >
        <template v-slot:prepend>
          <q-icon name="eva-attach-outline" />
        </template>
      </q-file>
      <q-separator inset />
      <div class="row justify-center q-ma-md">
        <q-input v-model="product.name" class="col col-sm-6" label="Product Name *" dense />
      </div>
      <div class="row justify-center q-ma-md">
        <q-input v-model="product.price" class="col col-sm-6" type="number" label="Price *" dense />
      </div>
      <div class="row justify-center q-ma-md">
        <q-input
          v-model="product.location"
          :loading="locationLoading"
          class="col col-sm-6"
          label="Location"
          dense
        >
          <template v-slot:append>
            <q-btn
              v-if="!locationLoading && locationSupported"
              @click="getLocation"
              icon="eva-navigation-2-outline"
              dense
              flat
              round
            />
          </template>
        </q-input>
      </div>
      <div class="row justify-center q-mt-lg">
        <q-btn color="primary" @click="saveproduct()" :disable="!product.photo || !product.name || !product.price" label="post Product" rounded unelevated />
      </div>
    </div>
  </q-page>
</template>

<script>
import { uid } from "quasar";
require("md-gum-polyfill");

export default {
  name: "Camera",
  data() {
    return {
      product: {
        id: uid(),
        name: "",
        location: "",
        photo: null,
        price: 0,
      },
      imageCaptured: false,
      imageUpload: [],
      hasCameraSupport: true,
      locationLoading: false,
      selectedDeviceIndex: 0,
      videoDevices: [],
      cameraError: null
    };
  },
  computed: {
    locationSupported() {
      if ("geolocation" in navigator) return true;
      return false;
    },
  },
  methods: {
    toggleCamera(){
        this.selectedDeviceIndex = this.selectedDeviceIndex ? 0 : 1;
        this.initCamera({
          video: //true
          {
            deviceId: {
              exact: this.videoDevices[this.selectedDeviceIndex].deviceId
            }
          }
        });
    },
    getCameraSelection() {
        navigator.mediaDevices.enumerateDevices().then(devices => {
          this.videoDevices = devices.filter(device => device.kind === 'videoinput');
          this.initCamera({
          video: //true
          {
            deviceId: {
              exact: this.videoDevices.length > 1 ? this.videoDevices[1].deviceId : this.videoDevices[0].deviceId
            }
          }
        });
          console.log(this.videoDevices);
        });

        // const options = videoDevices.map(videoDevice => {
        //   return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
        // });
        // cameraOptions.innerHTML = options.join('');
      },
    initCamera(constraints) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.$refs.video.srcObject = stream;
        })
        .catch((error) => {
          this.hasCameraSupport = false;
          this.cameraError = error;
        });
    },
    captureImage() {
      let video = this.$refs.video;
      let canvas = this.$refs.canvas;
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      let context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageCaptured = true;
      this.product.photo = this.dataURItoBlob(canvas.toDataURL());
      this.disableCamera();
    },
    captureImageFallback(file) {
      this.disableCamera();
      this.product.photo = file;

      let canvas = this.$refs.canvas;
      let context = canvas.getContext("2d");

      var reader = new FileReader();
      reader.onload = (event) => {
        var img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          this.imageCaptured = true;
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    disableCamera() {
      this.$refs.video.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    },
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString });
      return blob;
    },
    getLocation() {
      this.locationLoading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getCityAndCountry(position);
        },
        (err) => {
          this.locationError();
        },
        { timeout: 7000 }
      );
    },
    getCityAndCountry(position) {
      let apiUrl = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1`;
      this.$axios
        .get(apiUrl)
        .then((result) => {
          this.locationSuccess(result);
        })
        .catch((err) => {
          this.locationError();
        });
    },
    locationSuccess(result) {
      console.log(result.data);
      this.product.location = result.data.city;
      if (result.data.country) {
        this.product.location += `, ${result.data.country}`;
      }
      this.locationLoading = false;
    },
    locationError() {
      this.$q.dialog({
        title: "Error",
        message: "Could not find your location.",
      });
      this.locationLoading = false;
    },
    saveproduct(){
        this.$q.loading.show();
        const formData = new FormData();
        formData.append('id', this.product.id),
        formData.append('name', this.product.name),
        formData.append('location', this.product.location),
        formData.append('price', this.product.price),
        formData.append('photo', this.product.photo, this.product.id + '.png'),

        this.$axios
        .post(`${process.env.API}/api/products/create`, formData)
        .then((res) => {
          this.$q.loading.hide();
          this.$q.notify({
            message: 'product Created',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
          this.$router.push('/');
        })
        .catch((err) => {
          this.$q.loading.hide();
          this.$q.dialog({
            title: "Error",
            message: err.message,
          });
          // this.loadingproducts = false;
        });
    }
  },
  mounted() {
    this.getCameraSelection();
  },
  beforeDestroy() {
    if (this.hasCameraSupport) {
      this.disableCamera();
    }
  },
};
</script>

<style lang="scss">
.camera-frame {
  border: 2px solid $grey-10;
  border-radius: 10px;
}
</style>
