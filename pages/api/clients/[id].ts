import nc from 'next-connect'
import { models } from '../../../models'
import { isAuth } from '../../../utils/auth'

const schemaNameString = 'Client'

const handler = nc()

handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Client } = (await models({ req, res })) as any

      const { id } = req.query
      const { name, email, mobile, address, database, status, clientCode } =
        req.body

      const object = await Client.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      const exist = await Client.exists({
        _id: { $ne: id },
        database: database.toLowerCase(),
      })

      if (exist) {
        return res.status(400).send('Database already exists')
      }

      object.name = name
      object.email = email
      object.address = address
      object.clientCode = clientCode
      object.status = status
      object.mobile = mobile
      await object.save()
      res.status(200).json({ message: `${schemaNameString} updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Client } = (await models({ req, res })) as any

      const { id } = req.query
      const object = await Client.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      await object.remove()
      res.status(200).json({ message: `${schemaNameString} removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
