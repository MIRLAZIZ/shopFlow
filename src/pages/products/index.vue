<template>
  <div>
    <!-- <pre>
      {{ store.total }}
    </pre> -->
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
      <VDataTable :headers="headers" :items="store.products" class="text-no-wrap px-5 " :no-data-text="t('no_data')">




        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn @click="router.push(`/products/edit/${item.id}`)">
            <VIcon icon="tabler-edit" color="success" />
          </IconBtn>


          <IconBtn @click="deleteModal = true, itemId = item.id">
            <VIcon icon="tabler-trash" color="error" />
          </IconBtn>




        </template>

        <template #bottom>
          <VDivider />

          <div class="d-flex align-center justify-space-between flex-wrap gap-3 pa-5 pt-3">
            <p class="text-sm text-medium-emphasis mb-0">
              <!-- {{ paginationMeta({ page, itemsPerPage }, totalProduct) }} -->
            </p>

            <!-- <VPagination v-model="page" :length="Math.min(Math.ceil(totalProduct / itemsPerPage), 5)"
              :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalProduct / itemsPerPage), 5)">
              <template #prev="slotProps">
                <VBtn variant="tonal" color="default" v-bind="slotProps" :icon="false">
                  Previous
                </VBtn>
              </template>

<template #next="slotProps">
                <VBtn variant="tonal" color="default" v-bind="slotProps" :icon="false">
                  Next
                </VBtn>
              </template>
</VPagination> -->
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
  { title: 'Selling Price', key: 'product_batches.0.selling_price', sortable: false },
  { title: 'Olingan narxi', key: 'product_batches.0.purchase_price', sortable: false },

  { title: 'Quantity', key: 'quantity' },
  // { title: 'Low Stock', key: 'isLowStock', sortable: false },
  { title: 'Price Mode', key: 'price_mode', sortable: false },
  // { title: 'Status', key: 'status', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]

const selectedStatus = ref()
const selectedCategory = ref()
const selectedStock = ref<boolean | undefined>()
const store = useProductsStore()
const deleteModal = ref(false)
const itemId = ref<number | null>(null)


onMounted(() => {
  store.fetchProducts(1)

})


const deleteProduct = () => {
  if (!itemId.value) return
  store.deleteProduct(itemId.value).then(() => {
    store.fetchProducts(1)
    toasStore.success(t('success'))
    deleteModal.value = false
  })
    .catch((error) => {
      toasStore.error(error.response._data.message)
    })
}



</script>
