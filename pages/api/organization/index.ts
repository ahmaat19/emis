import nc from 'next-connect'
import { models } from '../../../models'

const handler = nc()
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Organization } = (await models({ req, res })) as any

      const organization = await Organization.find({}).limit(1)

      res.json(organization?.[0])
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
