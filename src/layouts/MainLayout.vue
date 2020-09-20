<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" bordered>
      <q-toolbar class="constrain">
        <q-btn
          flat
          round
          dense
          size="18px"
          icon="eva-camera-outline"
          to="/camera"
          class="large-screen-only"
        />
        <q-separator vertical spaced class="large-screen-only" />
        <q-toolbar-title class="text-grand-hotel text-bold">Amazkart</q-toolbar-title>
        <q-separator vertical spaced class="large-screen-only" />
        <q-btn
          flat
          round
          dense
          size="18px"
          icon="eva-home-outline"
          to="/"
          class="large-screen-only"
        />
      </q-toolbar>
    </q-header>
    <q-footer class="bg-white small-screen-only" bordered>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <q-banner inline-actions dense class="bg-primary text-white" v-if="showAppInstallBanner">
          <template v-slot:avatar>
            <q-avatar
              color="white"
              text-color="grey-10"
              font-size="22px"
              icon="eva-shopping-cart-outline"
            />
          </template>
          <b>Install Amazkart?</b>
          <template v-slot:action>
            <q-btn flat label="Yes" dense class="q-px-sm" @click="installApp" />
            <q-btn flat label="Later" dense class="q-px-sm" @click="showAppInstallBanner = false" />
            <q-btn flat label="Never" dense class="q-px-sm" @click="neverShowAppInstall" />
          </template>
        </q-banner>
      </transition>
      <q-tabs class="text-grey-10" active-color="primary" indicator-color="transparent">
        <q-route-tab icon="eva-home-outline" to="/" name="home" exact />
        <q-route-tab icon="eva-camera-outline" name="camera" to="/camera" exact />
        <q-route-tab icon="eva-film-outline" name="AR" to="/AR" exact />
      </q-tabs>
    </q-footer>
    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
let deferredPrompt;
export default {
  name: "MainLayout",
  data() {
    return {
      showAppInstallBanner: false,
    };
  },
  methods: {
    installApp() {
      this.showAppInstallBanner = false;
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
          this.neverShowAppInstall();
        } else {
          console.log("User dismissed the install prompt");
        }
      });
    },
    neverShowAppInstall() {
      this.showAppInstallBanner = false;
      this.$q.localStorage.set("neverShowAppInstallBanner", true);
    },
  },
  mounted() {
    if(!this.$q.localStorage.getItem('neverShowAppInstallBanner')){
      window.addEventListener("beforeinstallprompt", (e) => {
        console.log("beforeinstallprompt called");
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        this.showAppInstallBanner = true;
      });
    }
  },
};
</script>

<style lang="scss">
.q-toolbar__title {
  text-align: center;
  font-size: 30px;
}
.q-footer {
  .q-tab__icon {
    font-size: 30px;
  }
}
@media (min-width: $breakpoint-sm-min) {
  .q-toolbar {
    height: 55px;
  }
  .q-toolbar__title {
    text-align: left;
  }
}
</style>
