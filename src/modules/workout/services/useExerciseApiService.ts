const WGER_BASE_URL = 'https://wger.de/api/v2'
const WGER_MEDIA_URL = 'https://wger.de'

// Language IDs in wger
const LANG_FR = 1 // French language ID — note: wger uses 1 for German sometimes, need to check
const LANG_EN = 2

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

export function useExerciseApiService() {
  async function searchExercises(term: string): Promise<WgerSearchResult[]> {
    if (!term.trim()) return []

    const url = `${WGER_BASE_URL}/exercise/search/?term=${encodeURIComponent(term)}&language=en&format=json`
    const response = await fetch(url)
    if (!response.ok) return []

    const data = await response.json()
    return (data.suggestions || []).map((s: any) => ({
      id: s.data.id,
      base_id: s.data.base_id,
      name: s.data.name,
      category: s.data.category,
      image: s.data.image ? `${WGER_MEDIA_URL}${s.data.image}` : null,
      image_thumbnail: s.data.image_thumbnail ? `${WGER_MEDIA_URL}${s.data.image_thumbnail}` : null,
    }))
  }

  async function getExerciseInfo(baseId: number): Promise<WgerExerciseInfo | null> {
    const url = `${WGER_BASE_URL}/exerciseinfo/${baseId}/?format=json`
    const response = await fetch(url)
    if (!response.ok) return null

    return await response.json()
  }

  /**
   * Get the French name if available, fallback to English
   */
  function getTranslatedName(info: WgerExerciseInfo): string {
    // Try French first (language IDs vary, check common ones: 4=FR in wger)
    const fr = info.translations.find(t => t.language === 4)
    if (fr?.name) return fr.name

    // Fallback to English
    const en = info.translations.find(t => t.language === 2)
    if (en?.name) return en.name

    // Fallback to first available
    return info.translations[0]?.name || 'Sans nom'
  }

  /**
   * Get the main image URL from exercise info
   */
  function getMainImage(info: WgerExerciseInfo): string | null {
    const main = info.images.find(img => img.is_main)
    return main?.image || info.images[0]?.image || null
  }

  /**
   * Get primary muscle group name
   */
  function getPrimaryMuscle(info: WgerExerciseInfo): string {
    if (info.muscles.length) {
      return info.muscles[0].name_en || info.muscles[0].name
    }
    return info.category.name
  }

  /**
   * Get secondary muscles as comma-separated string
   */
  function getSecondaryMuscles(info: WgerExerciseInfo): string | null {
    if (!info.muscles_secondary.length) return null
    return info.muscles_secondary.map(m => m.name_en || m.name).join(', ')
  }

  /**
   * Get equipment as comma-separated string
   */
  function getEquipment(info: WgerExerciseInfo): string | null {
    if (!info.equipment.length) return null
    return info.equipment.map(e => e.name).join(', ')
  }

  return {
    searchExercises,
    getExerciseInfo,
    getTranslatedName,
    getMainImage,
    getPrimaryMuscle,
    getSecondaryMuscles,
    getEquipment,
  }
}
