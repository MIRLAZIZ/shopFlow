<script setup lang="ts">
import { VDataTable } from 'vuetify/lib/labs/components.mjs';

definePage({
    meta: {
        action: 'read',
        subject: 'SecondPage',
    },
})

const headers = [
    { title: 'ID', sortable: false, key: 'id' },
    { title: 'NAME', key: 'name' },
    { title: 'label', key: 'label' },


]
</script>

<template>
    <VDataTable :headers="headers" :items="[{ id: 1, name: 'kg' }]" :items-per-page="5" />
</template>
