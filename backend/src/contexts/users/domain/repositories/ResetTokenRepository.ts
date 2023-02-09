import { ResetToken } from '../models/ResetToken'

export interface ResetTokenRepository {
    save: (resetToken:ResetToken) => void
}