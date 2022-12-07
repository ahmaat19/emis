import nc from 'next-connect'
import { models } from '../../../../models'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Profile } = (await models({ req, res })) as any

      const { _id } = req.user
      const objects = await Profile.findOne({ user: _id })
        .lean()
        .sort({ createdAt: -1 })
        .populate('user', ['name', 'email', 'confirmed', 'blocked'])

      res.status(200).send(objects)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
