import { Product } from '@/interface/products.interface';
import { ApiResponse } from '@/type/api-response.type';
import { defineStore } from 'pinia';

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [] as Product[],
        page: 1,
        total: 0,
        limit: 0
    }),

    actions: {
        async fetchProducts(page: number) {
            const response: ApiResponse<Product> = await $api(`products/${page}`);

            this.products = response.data.data;
            this.total = response.data.total
            this.limit = response.data.limit

        },

        async createProduct(data: any) {
            return await $api("/products", {
                method: "post",
                body: data,
            });
        },

        async deleteProduct(id: number) {
            return await $api(`/products/${id}`, {
                method: "delete",
            });
        },
        async updataProduct(id: number, data: any) {
            return await $api(`/products/${id}`, {
                method: "put",
                body: data,
            });
        },
    }
});
