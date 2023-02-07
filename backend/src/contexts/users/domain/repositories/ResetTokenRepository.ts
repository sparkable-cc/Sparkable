import { ResetToken } from '../models/ResetToken'

export interface ResetTokenRepository {
    save: (token:ResetToken) => void
}