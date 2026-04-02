<script setup lang="ts">
// import { PriceMode } from 'common/enums/priceMode.enum'
import { useCategoriesStore } from '@/@core/stores/categories'
import { useProductsStore } from '@/@core/stores/products'
import { useUnitsStore } from '@/@core/stores/units'
import { ToastService } from '@/services/toast.service'
import { requiredValidator } from '@core/utils/validators'
import { computed, ref } from 'vue'
import { VForm } from 'vuetify/lib/components/index.mjs'


const unitStore = useUnitsStore()
const categoryStore = useCategoriesStore()
const productStore = useProductsStore()
const router = useRouter()



const form = ref({
  name: '',
  barcode: '',
  quick_code: '',
  max_quantity_notification: null as number | null,
  quantity: null as number | null,
  unit_id: null as number | null,
  category_id: null as number | null,
  purchase_price: null as number | null,
  selling_price: null as number | null,
  deliveryCost: null as number | null,
  vatRate: null as number | null,
  costPrice: null as number | null,
})

const isLoading = ref(false)
const formRef = ref<InstanceType<typeof VForm> | null>(null)







onMounted(() => {
  unitStore.fetchUnits()
  categoryStore.fetchcategories()
})


const closeNavigationDrawer = () => {
  formRef.value?.resetValidation()
  router.push('/products')
}


const computedCostPrice = computed(() => {
  const purchase = form.value.purchase_price ?? 0
  const delivery = form.value.deliveryCost ?? 0
  const vat = form.value.vatRate ?? 0
  const quantity = form.value.quantity ?? 0

  if (!purchase && !quantity) return 0



  const costPrice = purchase + (delivery / quantity)
  const vatPrice = (costPrice / 100) * vat
  const totalCostPrice = costPrice + vatPrice

  // Masalan: costPrice = purchase + delivery + (purchase * vat / 100)
  return totalCostPrice
})

const saveProduct = () => {

  formRef.value?.validate().then(({ valid }) => {

    if (valid) {

      isLoading.value = true
      productStore.createProduct(form.value).then(() => {
        isLoading.value = false
        ToastService.success('Mahsulot muvaffaqiyatli qo\'shildi')
        closeNavigationDrawer()
      }).catch((error) => {
        isLoading.value = false
        ToastService.error(error.response._data.message)
      })

    }

  })


}
</script>

<template>
  <div>
    <div class="d-flex flex-column justify-center">
      <h4 class="text-h4 font-weight-medium">
        Yangi mahsulot qo'shish
      </h4>
      <span class="text-medium-emphasis">Mahsulot ma'lumotlarini kiriting</span>
    </div>


    <VForm ref="formRef" class="mt-6" @submit.prevent="saveProduct">
      <VRow>
        <!-- ─── Chap ustun ─────────────────────────────────── -->

        <VCol cols="12" md="8">

          <!-- Asosiy ma'lumotlar -->
          <VCard class="mb-6" title="Asosiy ma'lumotlar">
            <VCardText>
              <VRow>
                <!-- Nomi -->
                <VCol cols="12">
                  <AppTextField v-model="form.name" label="Mahsulot nomi" placeholder="Masalan: Coca-Cola 0.5L"
                    :rules="[requiredValidator]" />
                </VCol>

                <!-- Barcode -->
                <VCol cols="12" md="6">
                  <AppTextField v-model="form.barcode" label="Barcode" placeholder="0123-4567" />
                </VCol>

                <!-- Quick code -->
                <VCol cols="12" md="6">
                  <AppTextField v-model="form.quick_code" label="Tez kod" placeholder="A1, B2, 99..."
                    hint="Tez sotish uchun qisqa kod" persistent-hint />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>




          <!------------------------------------ Narx ma'lumotlari ------------------------------------>
          <VCard title="Narx ma'lumotlari">
            <VCardText>
              <VRow>

                <!-- miqdori  -->
                <VCol cols="12" md="6">
                  <AppTextField v-model.number="form.quantity" label="Miqdori" placeholder="0" type="number" min="0"
                    :rules="[requiredValidator]" />
                </VCol>


                <!-- Xarid narxi -->
                <VCol cols="12" md="6" mt-md="6">
                  <AppTextField v-model.number="form.purchase_price" label="Xarid narxi" placeholder="0" type="number"
                    min="0" :rules="[requiredValidator]" />
                </VCol>



                <!-- Delivery narxi -->
                <VCol cols="12" md="6">
                  <AppTextField v-model.number="form.deliveryCost" label="Delivery narxi" placeholder="0"
                    type="number" />
                </VCol>

                <!-- Vat rate -->
                <VCol cols="12" md="6">
                  <AppTextField v-model.number="form.vatRate" label="VAT rate" placeholder="0" type="number" />
                </VCol>
                <!-- Sotuv narxi -->
                <VCol cols="12" md="6">
                  <AppTextField v-model.number="form.selling_price" label="Sotuv narxi" placeholder="sotuv narxi"
                    type="number" :rules="[requiredValidator]" />

                </VCol>

                <!-- cost price  -->
                <!-- Narx ma'lumotlari kartasi ichida, inputlardan keyin -->
                <VCol cols="12">
                  <VDivider class="mb-4" />
                  <div class="d-flex align-center justify-space-between pa-3  rounded">
                    <div>
                      <div class="text-caption text-medium-emphasis">Tannarx (Cost Price)</div>
                      <div class="text-h6 font-weight-bold text-primary">
                        {{ computedCostPrice ? computedCostPrice.toLocaleString() + ' so\'m' : '—' }}
                      </div>
                    </div>
                    <VIcon icon="tabler-calculator" size="32" color="primary" opacity="0.4" />
                  </div>
                </VCol>








                <!-- Narx rejimi -->
                <!-- <VCol cols="12">
                <AppSelect v-model="form.price_mode" :items="PRICE_MODES" label="Narx rejimi" />
              </VCol> -->
              </VRow>
            </VCardText>
          </VCard>

        </VCol>





        <!-- ─── O'ng ustun ─────────────────────────────────── -->
        <VCol cols="12" md="4">

          <!-- Miqdor -->
          <VCard class="mb-6" title="Miqdor">
            <VCardText>
              <VRow>
                <!-- Birlik -->
                <VCol cols="12">
                  <AppSelect v-model="form.unit_id" :items="unitStore.units" label="Birlik" placeholder="Tanlang"
                    item-title="name" item-value="id" :rules="[requiredValidator]" />
                </VCol>



                <!-- Minimum qoldiq -->
                <VCol cols="12">
                  <AppTextField v-model.number="form.max_quantity_notification" label="Minimum qoldiq (ogohlantirish)"
                    placeholder="0" type="number" hint="Shu miqdordan kamayganda ogohlantirish beradi"
                    persistent-hint />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <!-- Kategoriya -->
          <VCard title="Kategoriya">
            <VCardText>
              <AppSelect v-model="form.category_id" :items="categoryStore.categories" label="Kategoriya"
                placeholder="Tanlang" item-title="name" item-value="id" :rules="[requiredValidator]" />
            </VCardText>
          </VCard>

        </VCol>
      </VRow>
      <!-- ─── Header ─────────────────────────────────────────── -->
      <div class="d-flex flex-wrap     justify-end  gap-y-4 gap-x-6 mb-6">


        <div class="d-flex gap-4 align-center  mt-4 ">
          <VBtn variant="tonal" color="secondary">
            Bekor qilish
          </VBtn>
          <VBtn :loading="isLoading" type="submit">
            Saqlash
          </VBtn>
        </div>
      </div>

    </VForm>
  </div>
</template>
