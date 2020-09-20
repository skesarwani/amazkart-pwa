import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

Vue.config.ignoredElements = [
    'a-scene',
    'a-entity',
    'a-camera',
    'a-box',
    'a-nft'
  ]
