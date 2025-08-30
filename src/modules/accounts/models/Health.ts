export enum EnumMeasureWeight {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly'
}

export interface Health {
  id: number
  height: number
  weight: number
  target_weight: number
  target_training: number
  measure_weight: EnumMeasureWeight
}
