export type Role = 'ETUDIANT' | 'ENTREPRISE'
export type StatutCandidature = 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE'

export interface ApiResponse<T = null> {
  success: boolean
  data?: T
  error?: string
}
