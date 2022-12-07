import nc from 'next-connect'
import { sendEmail } from '../../../../utils/nodemailer'
import DeviceDetector from 'device-detector-js'
import { eTemplate } from '../../../../utils/eTemplate'
import { models } from '../../../../models'

const handler = nc()
handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    // db logic

    try {
      const { email, dbCode } = req.body

      const { User } = (await models({ req, res, dbCode })) as any

      if (!email)
        return res.status(400).json({ error: 'Please enter your email' })

      const user = await User.findOne({ email })
      if (!user)
        return res.status(404).json({ error: 'No email could not be send' })

      const resetToken = user.getResetPasswordToken()
      await user.save()

      const deviceDetector = new DeviceDetector()
      const device = deviceDetector.parse(req.headers['user-agent']) as any

      const {
        client: { type: clientType, name: clientName },
        os: { name: osName },
        device: { type: deviceType, brand },
      } = device

      const message = eTemplate({
        url: `http://localhost:3000/auth/reset-password/${resetToken}`,
        user: user?.name,
        clientType,
        clientName,
        osName,
        deviceType,
        brand,
        webName: 'Next.JS Boilerplate',
        validTime: '10 minutes',
        addressStreet: 'Makka Almukarrama',
        addressCountry: 'Mogadishu - Somalia',
      })

      const result = sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: message,
        webName: 'Next.JS Boilerplate Team',
      })

      if (await result)
        return res.status(200).json({
          message: `An email has been sent to ${email} with further instructions.`,
        })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
