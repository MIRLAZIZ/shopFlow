// composables/useCurrencyInput.ts
import { nextTick, ref } from 'vue'

export function useCurrencyInput() {
    const rawValue = ref<number | null>(null)
    const displayValue = ref('')

    function format(value: string): string {
        // Nuqtadan ajrat: butun qism + kasr qism
        const [intPart, ...decParts] = value.split('.')
        const dec = decParts.length > 0 ? '.' + decParts.join('') : ''

        const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        return formattedInt + dec
    }

    function sanitize(raw: string): string {
        // Faqat raqam, nuqta (bitta) — boshqa hamma narsani olib tashla
        const cleaned = raw.replace(/[^\d.]/g, '')
        const firstDot = cleaned.indexOf('.')
        if (firstDot === -1) return cleaned
        // Ikkinchi nuqtani olib tashlash
        return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '')
    }

    async function onUpdateModelValue(val: string, inputEl?: HTMLInputElement) {
        const cursor = inputEl?.selectionStart ?? null
        const oldLen = (val || '').length

        const sanitized = sanitize(val || '')
        const formatted = format(sanitized)
        displayValue.value = formatted

        // Kasr qismi bo'lsa float, bo'lmasa int
        rawValue.value = sanitized && sanitized !== '.' ? Number(sanitized) : null

        if (inputEl && cursor !== null) {
            await nextTick()
            const diff = formatted.length - oldLen
            const pos = Math.max(0, cursor + diff)
            inputEl.setSelectionRange(pos, pos)
        }
    }

    function onKeydown(e: KeyboardEvent) {
        const input = e.target as HTMLInputElement
        const pos = input.selectionStart ?? 0

        // Bo'shliq ustida Backspace — bo'shliq + oldidagi raqamni o'chir
        if (e.key === 'Backspace' && pos > 0 && input.value[pos - 1] === ' ') {
            e.preventDefault()
            const before = input.value.slice(0, pos - 2)
            const after = input.value.slice(pos)
            const sanitized = sanitize(before + after)
            const formatted = format(sanitized)
            displayValue.value = formatted
            rawValue.value = sanitized && sanitized !== '.' ? Number(sanitized) : null

            nextTick(() => {
                input.value = formatted
                const np = Math.max(0, pos - 2)
                input.setSelectionRange(np, np)
            })
        }
    }

    return { rawValue, displayValue, onUpdateModelValue, onKeydown }
}
