import { ResetToken } from '../models/ResetToken'
import { ResetTokenDto } from '../models/ResetTokenDto'

export interface ResetTokenRepository {
    saveToken: (resetToken:ResetToken) => void,
    findToken: (options:Object) => Promise<ResetTokenDto | null>
}