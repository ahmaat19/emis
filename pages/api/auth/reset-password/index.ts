import nc from 'next-connect'
import crypto from 'crypto'
import { models } from '../../../../models'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { password, resetToken, dbCode } = req.body

      const { User } = (await models({ req, res, dbCode })) as any

      if (!resetToken || !password)
        return res.status(400).json({ error: 'Invalid Request' })

      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      })

      if (!user)
        return res.status(400).json({ error: 'Invalid Token or expired' })

      user.password = password
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined

      await user.save()

      res.status(200).json({ message: 'Password has been reset' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)
export default handler
