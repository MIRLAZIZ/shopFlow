    <script setup lang="ts">
    import { useProductsStore } from '@/@core/stores/products';
    import { onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { VDataTable } from 'vuetify/labs/VDataTable';


    definePage({
        meta: {
            action: 'read',
            subject: 'SecondPage',
        },
    })
    const route = useRoute()
    const id = (route.params as { id: number }).id
    const store = useProductsStore()
    const isLoading = ref(false)
    const batches = ref([])
    const limit = ref(1)
    const page = ref(1)
    const total = ref(0)
    const router = useRouter()

    const headers = [
        {
            title: 'pruchase price',
            key: 'purchase_price'
        },
        {
            title: 'selling price',
            key: 'selling_price'
        },
        {
            title: 'deliveryCost',
            key: 'deliveryCost'
        },
        {
            title: 'vatRate',
            key: 'vatRate'
        },
        {
            title: 'costPrice',
            key: 'costPrice'
        },
        {
            title: 'quantity',
            key: 'quantity'
        },
        {
            title: 'status',
            key: 'status'
        },
        {
            title: 'remaining_quantity',
            key: 'remaining_quantity'
        },
        // {
        //     title: 'activated_at',
        //     key: 'activated_at'
        // },
        // {
        //     title: 'depleted_at',
        //     key: 'depleted_at'
        // },
        {
            title: 'createdAt',
            key: 'createdAt'
        },
        {
            title: 'actions',
            key: 'actions',
            sortable: false
        }

    ]

    const refresh = (page: number) => {
        store.getBatchByProductId(id, page).then((res) => {
            batches.value = res.data.data
            limit.value = res.data.meta.limit
            total.value = res.data.meta.total
        })
    }

    onMounted(() => {
        refresh(page.value)

    })

</script>
    
<template>
    <div>
        <VCard class="mb-6 pa-5">

            <VCardItem>
                <VCardTitle>Batchs</VCardTitle>
            </VCardItem>

            <VDivider />
            <VDataTable :items="batches" :headers="headers">

                <template #item.createdAt="{ item }">
                    {{ new Date(item.createdAt).toLocaleString('uz-UZ') }} </template>


                <!-- Actions -->
                <template #item.actions="{ item }">

                    <IconBtn @click="router.push(`/products/${item.name}/batches/create`)">
                        <VIcon icon="tabler-edit" color="success" />
                    </IconBtn>





                </template>

                <template #bottom>
                    <VDivider />

                    <div class="d-flex align-center justify-space-between flex-wrap gap-3 pa-5 pt-3">
                        <p class="text-sm text-medium-emphasis mb-0">
                        </p>

                        <VPagination v-model="store.page" :length="Math.ceil(total / limit)"
                            :total-visible="$vuetify.display.xs ? 1 : 5" @update:modelValue="refresh" />
                    </div>
                </template>
            </VDataTable>


        </VCard>

    </div>
</template>

<style lang="scss" scoped></style>
