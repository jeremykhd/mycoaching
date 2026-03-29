import type { UUID } from 'crypto'
import type { Health } from './Health'
import type { Role } from './Role'
import type { Objectives } from './Objectives'

export enum EnumGender {
  male = 'male',
  female = 'female'
}
export interface Account {
  id: number
  user_id: UUID
  firstname: string
  lastname: string
  email: string
  gender: EnumGender | null
  birthday: Date | string
  phone_number?: string
  created_at: string
  is_active: boolean
  health: Health | null
  objectives: Objectives | null
  role: Role
}
