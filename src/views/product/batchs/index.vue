<template>
    <div>
        <VCard :title="routeSlug + ' mahsulotiga partiya qo\'shish'">
            <VCardText>

                <VForm ref="formRef" class="mt-6" @submit.prevent="saveProduct">

                    <VRow>



                        <!-- Xarid narxi -->
                        <VCol cols="12" md="6">
                            <CurrencyInput v-model="productBatch.purchase_price" placeholder="0" label="Xarid narxi"
                                :rules="[requiredValidator]" />
                        </VCol>





                        <!-- miqdori  -->
                        <VCol cols="12" md="6">


                            <CurrencyInput v-model="productBatch.quantity" placeholder="0" label="Miqdori"
                                :rules="[requiredValidator]" />
                        </VCol>


                        <!-- Sotuv narxi -->
                        <VCol cols="12" md="6">

                            <CurrencyInput v-model="productBatch.selling_price" placeholder="0" label="Sotuv narxi"
                                :rules="[requiredValidator]" />

                        </VCol>


                        <!-- Delivery narxi -->
                        <VCol cols="12" md="6">


                            <CurrencyInput v-model="productBatch.deliveryCost" placeholder="0" label="Delivery narxi" />
                        </VCol>

                        <!-- Vat rate -->
                        <VCol cols="12" md="6">
                            <CurrencyInput v-model="productBatch.vatRate" placeholder="0" label="Vat rate" />
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









                    </VRow>

                    <!-- ─── footer ─────────────────────────────────────────── -->
                    <div class="d-flex flex-wrap     justify-end  gap-y-4 gap-x-6 mb-6">


                        <div class="d-flex gap-4 align-center  mt-4 ">
                            <VBtn variant="tonal" color="secondary" @click="closeNavigationDrawer">
                                Bekor qilish
                            </VBtn>
                            <VBtn :loading="isLoading" type="submit">
                                Saqlash
                            </VBtn>
                        </div>
                    </div>
                </VForm>
            </VCardText>
        </VCard>

    </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '@/@core/stores/products';
import { useToastStore } from '@/@core/stores/toast.store';
import { requiredValidator } from '@core/utils/validators';
import { useRoute, useRouter } from 'vue-router';
import { VForm } from 'vuetify/lib/components/index.mjs';
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const routeSlug = (route.params as { slug: string }).slug
const store = useProductsStore()
const productId = ref(null)
const toastStore = useToastStore()
const batchId = ref(null)


enum PriceMode {
    UNIFORM = 'UNIFORM',
    FIFO = 'FIFO'
}
const formRef = ref<InstanceType<typeof VForm> | null>(null)


const productBatch = ref({

    quantity: null,
    purchase_price: null,
    selling_price: null,
    deliveryCost: null,
    vatRate: null,
    costPrice: null,
    product_id: null
})





const computedCostPrice = computed(() => {
    const purchase = productBatch.value.purchase_price ?? 0
    const delivery = productBatch.value.deliveryCost ?? 0
    const vat = productBatch.value.vatRate ?? 0
    const quantity = productBatch.value.quantity ?? 0

    if (!purchase && !quantity) return 0



    const costPrice = purchase + (delivery / quantity)
    const vatPrice = (costPrice / 100) * vat
    const totalCostPrice = costPrice + vatPrice

    // Masalan: costPrice = purchase + delivery + (purchase * vat / 100)
    return totalCostPrice
})
const closeNavigationDrawer = async () => {
    formRef.value?.resetValidation()
    await router.push('/products')
}

onMounted(() => {

    if (routeSlug) {
        store.searchProduct({ name: routeSlug }).then((response) => {
            productBatch.value.product_id = response.data[0].id
        })
    }


})




const saveProduct = () => {

    formRef.value?.validate().then(({ valid }) => {

        if (valid) {

            console.log('ishladi');


            isLoading.value = true

            if (!batchId.value) {
                console.log('if');

                const { costPrice, ...filterProductForm } = productBatch.value
                store.createBatch(filterProductForm).then(() => {
                    console.log(productBatch.value);

                    isLoading.value = false
                    closeNavigationDrawer()
                        .then(() => {
                            toastStore.success('Mahsulot muvaffaqiyatli qo\'shildi')

                        })

                }).catch((error) => {
                    isLoading.value = false

                    // let parseErorr = JSON.parse(error.response._data.message)
                    // errorMessage.value = parseErorr
                    toastStore.showErrors(error.response._data.message)




                    // toastStore.error(error.response._data.message)
                })

            } else {
                console.log('else');

                const filterProductForm = Object.fromEntries(Object.entries(productBatch.value).filter(([key, value]) => value != null))

                store.updataProduct(Number(productId), filterProductForm).then(() => {
                    isLoading.value = false
                    closeNavigationDrawer()
                        .then(() => {
                            toastStore.success('Mahsulot muvaffaqiyatli qo\'shildi')

                        })

                }).catch((error) => {
                    isLoading.value = false
                    // let parseErorr = JSON.parse(error.response._data.message)
                    // errorMessage.value = parseErorr
                    toastStore.showErrors(error.response._data.message)
                })

            }


        }


    })


}
</script>

<style scoped></style>
