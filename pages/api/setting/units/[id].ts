import nc from 'next-connect'
import { models } from '../../../../models'
import { isAuth } from '../../../../utils/auth'

const schemaNameString = 'Unit'

const handler = nc()

handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Unit } = (await models({ req, res })) as any

      const { id } = req.query
      const { name, status } = req.body

      const object = await Unit.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      const exist = await Unit.findOne({
        name: { $regex: `^${name?.trim()}$`, $options: 'i' },
        _id: { $ne: id },
      })

      if (exist)
        return res.status(400).json({ error: 'Duplicate unit detected' })

      object.name = name
      object.status = status
      object.updatedBy = req.user._id
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
      const { Unit } = (await models({ req, res })) as any

      const { id } = req.query
      const object = await Unit.findById(id)
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
