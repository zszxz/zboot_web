<template>
  <div :style="'height:' +height">
    <iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
  </div>
</template>

<script>
import request from '@/http/request'
export default {
    data() {
        return {
            src: '',
            height: document.documentElement.clientHeight - 95 + 'px;',
        }
    },
    created() {
      this.getAddress()
    },
    methods: {
      getAddress() {
        this.src = request.defaults.baseURL+ '/druid/index.html'
      }
    }
}
</script>