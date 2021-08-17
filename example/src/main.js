import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

Vue.prototype.$track = (name, data={}) => {
  if (data.baseTrackProps) {
    const baseTrackProps = {
      ...data.baseTrackProps
    }
    delete data.baseTrackProps
    const params = {
      ...data,
      ...baseTrackProps
    }
    console.log(`****track：${name},${JSON.stringify(params)}******`)
  } else {
    delete data.baseTrackProps
    const params = {
      ...data
    }
    console.log(`****track：${name},${JSON.stringify(params)}******`)
  }
}

new Vue({
  render: h => h(App),
}).$mount('#app')
