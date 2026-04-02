import { PriceHistory } from "./price-history.interface"


export interface Product {
    id: number
    name: string
    barcode: string
    quick_code: string | null
    max_quantity_notification: number | null
    price_history: PriceHistory[]
    quantity: number
    isLowStock: boolean
    unit: null | number
    price_mode: string
}
