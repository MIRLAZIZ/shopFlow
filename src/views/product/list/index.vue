<script setup lang="ts">
import { Product } from '@/interface/products.interface'
import { TableHeader } from '@/interface/table-headers.interface'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const widgetData = ref([
  { title: 'In-Store Sales', value: '$5,345.43', icon: 'tabler-home', desc: '5k orders', change: 5.7 },
  { title: 'Website Sales', value: '$674,347.12', icon: 'tabler-device-laptop', desc: '21k orders', change: 12.4 },
  { title: 'Discount', value: '$14,235.12', icon: 'tabler-gift', desc: '6k orders' },
  { title: 'Affiliate', value: '$8,345.23', icon: 'tabler-wallet', desc: '150 orders', change: -3.5 },
])

const porps = defineProps({
  products: {
    type: Object,
    required: true,
  },
})

//  id: number
//     name: string
//     barcode: string
//     quick_code: string | null
//     max_quantity_notification: number
//     price_history: PriceHistory[]
//     quantity: number
//     isLowStock: boolean
//     unit: Unit
//     price_mode: string
const headers: TableHeader<Product>[] = [
  { title: 'Nomi', key: 'name' },
  { title: 'Barcode', key: 'barcode' },
  { title: 'Quick Code', key: 'quick_code' },
  { title: 'Unit', key: 'unit', sortable: false },
  { title: 'Price', key: 'price_history', sortable: false },
  { title: 'Quantity', key: 'quantity' },
  { title: 'Low Stock', key: 'isLowStock', sortable: false },
  { title: 'Price Mode', key: 'price_mode', sortable: false },
  // { title: 'Status', key: 'status', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]

const selectedStatus = ref()
const selectedCategory = ref()
const selectedStock = ref<boolean | undefined>()
const searchQuery = ref('')

const status = ref([
  { title: 'Scheduled', value: 'Scheduled' },
  { title: 'Publish', value: 'Published' },
  { title: 'Inactive', value: 'Inactive' },
])

const categories = ref([
  { title: 'Accessories', value: 'Accessories' },
  { title: 'Home Decor', value: 'Home Decor' },
  { title: 'Electronics', value: 'Electronics' },
  { title: 'Shoes', value: 'Shoes' },
  { title: 'Office', value: 'Office' },
  { title: 'Games', value: 'Games' },
])

const stockStatus = ref([
  { title: 'In Stock', value: true },
  { title: 'Out of Stock', value: false },
])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const resolveCategory = (category: string) => {
  if (category === 'Accessories')
    return { color: 'error', icon: 'tabler-device-watch' }
  if (category === 'Home Decor')
    return { color: 'info', icon: 'tabler-home' }
  if (category === 'Electronics')
    return { color: 'primary', icon: 'tabler-device-imac' }
  if (category === 'Shoes')
    return { color: 'success', icon: 'tabler-shoe' }
  if (category === 'Office')
    return { color: 'warning', icon: 'tabler-briefcase' }
  if (category === 'Games')
    return { color: 'primary', icon: 'tabler-device-gamepad-2' }
}

const resolveStatus = (statusMsg: string) => {
  if (statusMsg === 'Scheduled')
    return { text: 'Scheduled', color: 'warning' }
  if (statusMsg === 'Published')
    return { text: 'Publish', color: 'success' }
  if (statusMsg === 'Inactive')
    return { text: 'Inactive', color: 'error' }
}

// const { data: productsData, execute: fetchProducts } = await useApi<any>(createUrl('/apps/ecommerce/products',
//   {
//     query: {
//       q: searchQuery,
//       stock: selectedStock,
//       category: selectedCategory,
//       status: selectedStatus,
//       page,
//       itemsPerPage,
//       sortBy,
//       orderBy,
//     },
//   },
// ))
const productsData = ref({ products: [], total: 0 })

const products = computed(() => productsData.value.products)
const totalProduct = computed(() => productsData.value.total)

const deleteProduct = async (id: number) => {
  await $api(`apps/ecommerce/products/${id}`, {
    method: 'DELETE',
  })

  // fetchProducts()
}
</script>

<template>
  <div>
    <!-- 👉 widgets -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <template v-for="(data, id) in widgetData" :key="id">
            <VCol cols="12" sm="6" md="3" class="px-6">
              <div class="d-flex justify-space-between" :class="$vuetify.display.xs
                ? 'product-widget'
                : $vuetify.display.sm
                  ? id < 2 ? 'product-widget' : ''
                  : ''">
                <div class="d-flex flex-column gap-y-1">
                  <div class="text-body-1 font-weight-medium text-capitalize">
                    {{ data.title }}
                  </div>

                  <h4 class="text-h4 my-1">
                    {{ data.value }}
                  </h4>

                  <div class="d-flex">
                    <div class="me-2 text-disabled text-no-wrap">
                      {{ data.desc }}
                    </div>

                    <VChip v-if="data.change" label :color="data.change > 0 ? 'success' : 'error'">
                    </VChip>
                  </div>
                </div>

                <VAvatar variant="tonal" rounded size="38">
                  <VIcon :icon="data.icon" size="28" />
                </VAvatar>
              </div>
            </VCol>
            <VDivider v-if="$vuetify.display.mdAndUp ? id !== widgetData.length - 1
              : $vuetify.display.smAndUp ? id % 2 === 0
                : false" vertical inset length="95" />
          </template>
        </VRow>
      </VCardText>
    </VCard>

    <!-- 👉 products -->
    <VCard title="Filters" class="mb-6">
      <VCardText>
        <VRow>
          <!-- 👉 Select Status -->
          <VCol cols="12" sm="4">
            <AppSelect v-model="selectedStatus" placeholder="Status" :items="status" clearable clear-icon="tabler-x" />
          </VCol>

          <!-- 👉 Select Category -->
          <VCol cols="12" sm="4">
            <AppSelect v-model="selectedCategory" placeholder="Category" :items="categories" clearable
              clear-icon="tabler-x" />
          </VCol>

          <!-- 👉 Select Stock Status -->
          <VCol cols="12" sm="4">
            <AppSelect v-model="selectedStock" placeholder="Stock" :items="stockStatus" clearable
              clear-icon="tabler-x" />
          </VCol>
        </VRow>
      </VCardText>

      <VDivider class="my-4" />

      <div class="d-flex flex-wrap gap-4 mx-5">
        <div class="d-flex align-center">
          <!-- 👉 Search  -->
          <AppTextField v-model="searchQuery" placeholder="Search Product" density="compact" style="inline-size: 200px;"
            class="me-3" />
        </div>

        <VSpacer />
        <div class="d-flex gap-4 flex-wrap align-center">
          <AppSelect v-model="itemsPerPage" :items="[5, 10, 20, 25, 50]" />
          <!-- 👉 Export button -->
          <VBtn variant="tonal" color="secondary" prepend-icon="tabler-upload">
            Export
          </VBtn>

          <VBtn color="primary" prepend-icon="tabler-plus">
            Add Product
          </VBtn>
        </div>
      </div>

      <VDivider class="mt-4" />

      <!-- 👉 Datatable  -->
      <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :headers="headers" show-select
        :items="porps.products.data" :items-length="totalProduct" class="text-no-wrap" @update:options="updateOptions">
        <!-- product  -->
        <template #item.unit="{ item }">
          <span class="text-body-1 font-weight-medium">{{ item.unit.name }}</span>
        </template>

        <template #item.price_history="{ item }">
          <span class="text-body-1 font-weight-medium">{{ item }}</span>
        </template>

        <!-- category -->
        <template #item.category="{ item }">
          <VAvatar size="30" variant="tonal" :color="resolveCategory(item.category)?.color" class="me-2">
            <VIcon :icon="resolveCategory(item.category)?.icon" size="18" />
          </VAvatar>
          <span class="text-body-1 font-weight-medium">{{ item.category }}</span>
        </template>

        <!-- stock -->
        <template #item.stock="{ item }">
          <VSwitch :model-value="item.stock" />
        </template>

        <!-- status -->
        <template #item.status="{ item }">
          <VChip v-bind="resolveStatus(item.status)" density="default" label />
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn>
            <VIcon icon="tabler-edit" />
          </IconBtn>

          <IconBtn>
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem value="download" prepend-icon="tabler-download">
                  Download
                </VListItem>

                <VListItem value="delete" prepend-icon="tabler-trash" @click="deleteProduct(item.id)">
                  Delete
                </VListItem>

                <VListItem value="duplicate" prepend-icon="tabler-copy">
                  Duplicate
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>

        <template #bottom>
          <VDivider />

          <div class="d-flex align-center justify-space-between flex-wrap gap-3 pa-5 pt-3">
            <p class="text-sm text-medium-emphasis mb-0">
              <!-- {{ paginationMeta({ page, itemsPerPage }, totalProduct) }} -->
            </p>

            <VPagination v-model="page" :length="Math.min(Math.ceil(totalProduct / itemsPerPage), 5)"
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
            </VPagination>
          </div>
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
.product-widget {
  border-block-end: 1px solid rgba(var(--v-theme-on-surface), var(--v-border-opacity));
  padding-block-end: 1rem;
}
</style>
