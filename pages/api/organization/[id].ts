import nc from 'next-connect'
import { models } from '../../../models'
import { isAuth } from '../../../utils/auth'

const schemaNameString = 'Organization'

const handler = nc()
handler.use(isAuth)

handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Organization } = (await models({ req, res })) as any

      const { id } = req.query
      const { name, image, address, mobile, details } = req.body

      const object = await Organization.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      object.name = name
      object.image = image
      object.address = address
      object.mobile = mobile
      object.details = details
      await object.save()

      res.status(200).json({ message: `${schemaNameString} updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
