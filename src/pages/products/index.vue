<template>
  <div>
    <pre>
      {{ store.products }}
    </pre>
    <!-- 👉 products -->
    <VCard title="Filters" class="mb-6 ">
      <VCardText>
        <VRow>
          <!-- 👉 Select Status
          <VCol cols="12" sm="4">
            <AppSelect v-model="selectedStatus" placeholder="Status" :items="status" clearable clear-icon="tabler-x" />
          </VCol> -->

          <!-- 👉 Select Category -->
          <!-- <VCol cols="12" sm="4">
            <AppSelect v-model="selectedCategory" placeholder="Category" :items="categories" clearable
              clear-icon="tabler-x" />
          </VCol> -->

          <!-- 👉 Select Stock Status -->
          <!-- <VCol cols="12" sm="4">
            <AppSelect v-model="selectedStock" placeholder="Stock" :items="stockStatus" clearable
              clear-icon="tabler-x" />
          </VCol> -->
        </VRow>
      </VCardText>

      <VDivider class="my-6" />

      <div class="d-flex flex-wrap gap-4 mx-5">
        <div class="d-flex align-center">
          <!-- 👉 Search  -->
          <!-- <AppTextField v-model="searchQuery" placeholder="Search Product" density="compact" style="inline-size: 200px;"
            class="me-3" /> -->
        </div>

        <VSpacer />
        <div class="d-flex gap-4 flex-wrap align-center">
          <!-- <AppSelect v-model="itemsPerPage" :items="[5, 10, 20, 25, 50]" /> -->
          <!-- 👉 Export button -->
          <VBtn variant="tonal" color="secondary" prepend-icon="tabler-upload">
            Export
          </VBtn>

          <VBtn color="primary" prepend-icon="tabler-plus" @click="router.push('products/create')">
            Add Product
          </VBtn>
        </div>
      </div>

      <VDivider class="mt-4" />

      <!-- 👉 Datatable  -->
      <VDataTable :headers="headers" :items="store.products" class="text-no-wrap px-5 " :no-data-text="t('no_data')"
        :loading="loading" :loading-text="t('loading')" :items-per-page="store.limit"">



        <template #item.barcode="{ item }">
        <span v-if="item.barcode"> {{ item.barcode }} </span>
        <span v-else> - </span>
</template>

<template #item.quick_code="{ item }">
  <span v-if="item.quick_code"> {{ item.quick_code }} </span>
  <span v-else> - </span>
</template>




<!-- Actions -->
<template #item.actions="{ item }">

  <IconBtn @click="goBatchs(item.name, item.id)">
    <VIcon icon="tabler-plus" color="success" />

  </IconBtn>

  <IconBtn @click="router.push(`/products/edit/${item.id}`)">
    <VIcon icon="tabler-edit" color="success" />
  </IconBtn>


  <IconBtn @click="deleteModal = true, itemId = item.id">
    <VIcon icon="tabler-trash" color="error" />
  </IconBtn>


</template>



<template #item.price_mode="{ item }">

  <VChip :color="item.price_mode === 'Old' ? 'grey' : 'green'" size="small">
    {{ item.price_mode }}

  </VChip>



  <VBtn v-if="item.price_mode === 'Old'" size="x-small">
    Activate
  </VBtn>
</template>



<template #bottom>
  <VDivider />

  <div class="d-flex align-center justify-space-between flex-wrap gap-3 pa-5 pt-3">
    <p class="text-sm text-medium-emphasis mb-0">
    </p>

    <VPagination v-model="store.page" :length="Math.ceil(store.total / store.limit)"
      :total-visible="$vuetify.display.xs ? 1 : 5" @update:modelValue="refresh" />
  </div>
</template>
</VDataTable>
</VCard>
</div>

<DelateDialog v-model:delete-modal="deleteModal" @delete-element="deleteProduct" />
</template>

<script lang="ts" setup>
import { useProductsStore } from '@/@core/stores/products';
import { useToastStore } from '@/@core/stores/toast.store';
import { useRouter } from 'vue-router';
import { VDataTable } from 'vuetify/labs/VDataTable';
definePage({
  meta: {
    action: 'read',
    subject: 'SecondPage',
  },
})

const { t } = useI18n()
const router = useRouter()
const toasStore = useToastStore()

const headers = [
  { title: 'Nomi', key: 'name' },
  { title: 'Barcode', key: 'barcode', sortable: false },
  { title: 'Quick Code', key: 'quick_code' },
  { title: 'birlik', key: 'unit.name', sortable: false },
  { title: 'Selling Price', key: 'selling_price', sortable: false },
  { title: 'Olingan narxi', key: 'purchase_price', sortable: false },

  { title: 'Quantity', key: 'quantity' },
  // { title: 'Low Stock', key: 'isLowStock', sortable: false },
  { title: 'Price Mode', key: 'pricing_strategy', sortable: false },
  // { title: 'Status', key: 'status', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },

]

const priceMode = [{ title: 'Eski narx', value: 'Old' }, { title: 'Yeni narx', value: 'Current' }]

const selectedStatus = ref()
const selectedCategory = ref()
const selectedStock = ref<boolean | undefined>()
const store = useProductsStore()
const deleteModal = ref(false)
const itemId = ref<number | null>(null)
const loading = ref(false)


const refresh = () => {
  store.fetchProducts(store.page)
    .then(() => { loading.value = false })
    .catch((error) => {
      toasStore.error(error.response._data.message)
      loading.value = false
    })


}

const goBatchs = (slug: string, productid: number) => {
  router.push({
    path: `/products/${slug}/batches/create`,
    params: {
      id: productid
    }
  })

}

onMounted(() => {
  refresh()
})


const deleteProduct = () => {
  if (!itemId.value) return
  store.deleteProduct(itemId.value).then(() => {
    refresh()
    toasStore.success(t('success'))
    deleteModal.value = false
  })
    .catch((error) => {
      toasStore.error(error.response._data.message)
    })
}



</script>
