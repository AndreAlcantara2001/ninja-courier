<template>
  <div>
    Customer dashboard
  </div>

  <button @click="routeToOrder">Order</button>

</template>

<script>

import { useRouter } from 'vue-router'
export default {

  components:{
  },

  setup() {
    const router = useRouter()
    const routeToOrder = () => {
      router.push({ name: 'orderingView' })
    }

    return {
      routeToOrder
    }
  }
}
</script>

<style></style>