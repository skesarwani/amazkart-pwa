<template>
  <q-page class="constrain-more q-pa-md">
    <!-- a-frame scene -->
    <a-scene
      vr-mode-ui="enabled: false;"
      renderer="logarithmicDepthBuffer: true;"
      embedded
      arjs="trackingMethod: best; sourceType: webcam;debugUIEnabled: false;"
    >
      <!-- a-nft is the anchor that defines an Image Tracking entity -->
      <!-- on 'url' use the path to the Image Descriptors created before. -->
      <!-- the path should end with the name without the extension e.g. if file is 'pinball.fset' the path should end with 'pinball' -->
      <a-nft
        type="nft"
        url="https://arjs-cors-proxy.herokuapp.com/https://github.com/skesarwani/amazkart-pwa/tree/master/src/assets/nft-images/osram2/osram2"
        smooth="true"
        smoothCount="10"
        smoothTolerance=".01"
        smoothThreshold="5"
      >
          <!-- as a child of the a-nft entity, you can define the content to show. here's a GLTF model entity -->
          <a-entity
              gltf-model="https://arjs-cors-proxy.herokuapp.com/https://github.com/skesarwani/amazkart-pwa/tree/master/src/assets/gltf-models/building/scene.gltf"
              scale="5 5 5"
              position="50 150 0"
          >
          </a-entity>
      </a-nft>
      <!-- static camera that moves according to the device movemenents -->
      <a-entity camera></a-entity>
    </a-scene>
  </q-page>
</template>

<script>
export default {
  name: "AR",
  data() {
    return {
      
    };
  },
  
};
</script>

<style lang="scss">

</style>
