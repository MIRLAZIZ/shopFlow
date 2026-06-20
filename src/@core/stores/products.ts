import { Product } from '@/interface/products.interface';
import { ApiResponse } from '@/type/api-response.type';
import { defineStore } from 'pinia';

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [] as Product[],
        page: 1,
        total: 0,
        limit: 1
    }),

    actions: {
        async fetchProducts(page: number) {
            const response: ApiResponse<Product> = await $api(`products/?page=${page}`);


            this.products = response.data.data;
            console.log(response.data.data);

            this.total = response.data.meta.total
            this.limit = response.data.meta.limit

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

        async fetchOneProduct(id: number) {
            return await $api(`/products/${id}`);
        },
        async searchProduct({ name, barcode, quickCode }: {
            name?: string,
            barcode?: string,
            quickCode?: string
        } = {}) {
            const params = new URLSearchParams();

            if (name) params.append('name', name);
            if (barcode) params.append('barcode', barcode);
            if (quickCode) params.append('quickCode', quickCode);

            const query = params.toString();
            return await $api(`/products/search${query ? `?${query}` : ''}`);
        },

        async createBatch(data: any) {
            console.log(data);

            return await $api("/products/batch", {
                method: "post",
                body: data,
            });
        },

        // get batch by product id and page
        async getBatchByProductId(id: number, page: number) {
            return await $api(`/products/${id}/batches?page=${page}`);
        },





    }
});
