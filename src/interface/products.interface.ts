import { Unit } from "chart.js/dist/scales/scale.time"
import { PriceHistory } from "./price-history.interface"


export interface Product {
    id: number
    name: string
    barcode: string
    quick_code: string | null
    max_quantity_notification: number
    price_history: PriceHistory[]
    quantity: number
    isLowStock: boolean
    unit: Unit
    price_mode: string
}
