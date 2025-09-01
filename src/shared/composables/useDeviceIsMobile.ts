import { computed } from "vue"

export function useDeviceIsMobile() {

    const mobileSize = 430
    const isMobile = computed(() => {
        return window.innerWidth <= mobileSize
    })

    return {
        isMobile
    }
}