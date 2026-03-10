import { Product } from '@/interface/products.interface'
import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [] as ResponseData<Product>[],
    }),
    actions: {
        fetchProducts(page: number) {
            return $api(`products/${page}`, {
                method: 'GET',
            }).then((response) => {
                this.products = response.data
            })

        }
    }
})
