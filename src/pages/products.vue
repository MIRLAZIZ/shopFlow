<template>
  <div>
    <pre>
      {{ store.products }}
    </pre>
    <ProductsList :products="store.products" />

  </div>
</template>

<script lang="ts" setup>
import { useProductsStore } from '@/@core/stores/products';
import ProductsList from '@/views/product/list/index.vue';
definePage({
  meta: {
    action: 'read',
    subject: 'SecondPage',
  },
})
const store = useProductsStore()

onMounted(() => {
  store.fetchProducts(1)

})



</script>
