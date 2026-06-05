<template>
    <div>
        <VCard :title="routeSlug + ' mahsulotiga partiya qo\'shish'">
            <VCardText>

                <VForm ref="formRef" class="mt-6" @submit.prevent="saveProduct">

                    <VRow>



                        <!-- Xarid narxi -->
                        <VCol cols="12" md="6">
                            <CurrencyInput v-model="productForm.purchase_price" placeholder="0" label="Xarid narxi"
                                :rules="[requiredValidator]" />
                        </VCol>



                        <!-- Delivery narxi -->
                        <VCol cols="12" md="6">


                            <CurrencyInput v-model="productForm.deliveryCost" placeholder="0" label="Delivery narxi" />
                        </VCol>


                        <!-- miqdori  -->
                        <VCol cols="12" md="6">


                            <CurrencyInput v-model="productForm.quantity" placeholder="0" label="Miqdori"
                                :rules="[requiredValidator]" />
                        </VCol>


                        <!-- Sotuv narxi -->
                        <VCol cols="12" md="6">

                            <CurrencyInput v-model="productForm.selling_price" placeholder="0" label="Sotuv narxi"
                                :rules="[requiredValidator]" />

                        </VCol>

                        <!-- Vat rate -->
                        <VCol cols="12" md="6">
                            <CurrencyInput v-model="productForm.vatRate" placeholder="0" label="Vat rate" />
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
import { requiredValidator } from '@core/utils/validators';
import { useRoute, useRouter } from 'vue-router';
import { VForm } from 'vuetify/lib/components/index.mjs';
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const routeSlug = (route.params as { slug: string }).slug
const store = useProductsStore()



enum PriceMode {
    UNIFORM = 'UNIFORM',
    FIFO = 'FIFO'
}
const formRef = ref<InstanceType<typeof VForm> | null>(null)


const productForm = ref({

    quantity: null,
    purchase_price: null,
    selling_price: null,
    deliveryCost: null,
    vatRate: null,
    costPrice: null,
})

const saveProduct = () => {
    console.log('ishladi')
}

const computedCostPrice = computed(() => {
    const purchase = productForm.value.purchase_price ?? 0
    const delivery = productForm.value.deliveryCost ?? 0
    const vat = productForm.value.vatRate ?? 0
    const quantity = productForm.value.quantity ?? 0

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


})

</script>

<style scoped></style>
