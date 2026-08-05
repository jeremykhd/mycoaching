const WGER_BASE_URL = 'https://wger.de/api/v2'
const WGER_MEDIA_URL = 'https://wger.de'

// Language IDs in wger (verified against /api/v2/language/)
const LANG_FR = 12 // Français
const LANG_EN = 2 // English

// wger removed the server-side /exercise/search/ endpoint and exposes no working
// text/language filter on its list endpoints. Like the official wger app, we download
// the exercise-translation catalog once, slim it to FR/EN names, cache it in
// localStorage, and search locally.
const CATALOG_CACHE_KEY = 'wger_exercise_catalog_v1'
const CATALOG_PAGE_SIZE = 999
const CATALOG_MAX_PAGES = 10 // safety cap (~3300 translations / 999 ≈ 4 pages)
const MAX_RESULTS = 30

interface CatalogEntry {
    exerciseId: number
    name: string
    lang: number
}

export interface WgerSearchResult {
    id: number
    base_id: number
    name: string
    category: string
    image: string | null
    image_thumbnail: string | null
}

export interface WgerExerciseInfo {
    id: number
    category: { id: number; name: string }
    muscles: { id: number; name: string; name_en: string }[]
    muscles_secondary: { id: number; name: string; name_en: string }[]
    equipment: { id: number; name: string }[]
    images: { id: number; image: string; is_main: boolean }[]
    translations: {
        id: number
        name: string
        description: string
        language: number
        aliases: string[]
    }[]
}

let catalog: CatalogEntry[] | null = null
let catalogPromise: Promise<CatalogEntry[]> | null = null

async function fetchCatalog(): Promise<CatalogEntry[]> {
    const entries: CatalogEntry[] = []
    let url: string | null =
        `${WGER_BASE_URL}/exercise-translation/?format=json&limit=${CATALOG_PAGE_SIZE}`
    let page = 0

    while (url && page < CATALOG_MAX_PAGES) {
        const response: Response = await fetch(url)
        if (!response.ok) break

        const data = await response.json()
        for (const r of data.results ?? []) {
            if ((r.language === LANG_FR || r.language === LANG_EN) && r.exercise && r.name) {
                entries.push({ exerciseId: r.exercise, name: r.name, lang: r.language })
            }
        }

        url = data.next ?? null
        page++
    }

    return entries
}

async function loadCatalog(): Promise<CatalogEntry[]> {
    if (catalog) return catalog

    // Persistent cache first (survives reloads / sessions)
    try {
        const cached = localStorage.getItem(CATALOG_CACHE_KEY)
        if (cached) {
            catalog = JSON.parse(cached) as CatalogEntry[]
            if (catalog.length) return catalog
        }
    } catch {
        // ignore corrupted / unavailable storage
    }

    // De-duplicate concurrent loads (e.g. fast typing) into a single fetch
    if (!catalogPromise) catalogPromise = fetchCatalog()

    try {
        catalog = await catalogPromise
    } finally {
        catalogPromise = null
    }

    try {
        if (catalog.length) localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(catalog))
    } catch {
        // storage quota exceeded — keep the in-memory catalog only
    }

    return catalog
}

export function useExerciseApiService() {
    async function searchExercises(term: string): Promise<WgerSearchResult[]> {
        const query = term.trim().toLowerCase()
        if (!query) return []

        const entries = await loadCatalog()

        // Match per translation, then dedupe by exercise, preferring the French name.
        const byExercise = new Map<number, CatalogEntry>()
        for (const entry of entries) {
            if (!entry.name.toLowerCase().includes(query)) continue
            const existing = byExercise.get(entry.exerciseId)
            if (!existing || (entry.lang === LANG_FR && existing.lang !== LANG_FR)) {
                byExercise.set(entry.exerciseId, entry)
            }
        }

        return Array.from(byExercise.values())
            .slice(0, MAX_RESULTS)
            .map((entry) => ({
                id: entry.exerciseId,
                base_id: entry.exerciseId,
                name: entry.name,
                category: '',
                image: null,
                image_thumbnail: null
            }))
    }

    async function getExerciseInfo(baseId: number): Promise<WgerExerciseInfo | null> {
        const url = `${WGER_BASE_URL}/exerciseinfo/${baseId}/?format=json`
        const response = await fetch(url)
        if (!response.ok) return null

        return await response.json()
    }

    /**
     * Get the French name if available, fallback to English, then anything.
     */
    function getTranslatedName(info: WgerExerciseInfo): string {
        const fr = info.translations.find((t) => t.language === LANG_FR)
        if (fr?.name) return fr.name

        const en = info.translations.find((t) => t.language === LANG_EN)
        if (en?.name) return en.name

        return info.translations[0]?.name || 'Sans nom'
    }

    /**
     * Get the main image URL from exercise info (absolute URL).
     */
    function getMainImage(info: WgerExerciseInfo): string | null {
        const main = info.images.find((img) => img.is_main)
        const image = main?.image || info.images[0]?.image || null
        if (!image) return null
        return image.startsWith('http') ? image : `${WGER_MEDIA_URL}${image}`
    }

    /**
     * Get primary muscle group name.
     */
    function getPrimaryMuscle(info: WgerExerciseInfo): string {
        if (info.muscles.length) {
            return info.muscles[0].name_en || info.muscles[0].name
        }
        return info.category.name
    }

    /**
     * Get secondary muscles as comma-separated string.
     */
    function getSecondaryMuscles(info: WgerExerciseInfo): string | null {
        if (!info.muscles_secondary.length) return null
        return info.muscles_secondary.map((m) => m.name_en || m.name).join(', ')
    }

    /**
     * Get equipment as comma-separated string.
     */
    function getEquipment(info: WgerExerciseInfo): string | null {
        if (!info.equipment.length) return null
        return info.equipment.map((e) => e.name).join(', ')
    }

    return {
        searchExercises,
        getExerciseInfo,
        getTranslatedName,
        getMainImage,
        getPrimaryMuscle,
        getSecondaryMuscles,
        getEquipment
    }
}
