import nc from 'next-connect'
import { models } from '../../../../models'
import { isAuth } from '../../../../utils/auth'

const schemaNameString = 'ClientPermission'

const handler = nc()
handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { ClientPermission } = (await models({ req, res })) as any

      const { id } = req.query
      const { name, menu, path, description, sort } = req.body

      const object = await ClientPermission.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      object.sort = sort
      object.name = name
      object.menu = menu
      object.path = path
      object.description = description
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
      const { ClientPermission, Role } = (await models({ req, res })) as any

      const { id } = req.query
      const object = await ClientPermission.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      const rolesObject = await Role.find({
        clientPermission: object._id,
      })

      if (rolesObject.length > 0) {
        rolesObject.forEach(async (role: any) => {
          role.clientPermission.filter((item: string) => item.toString() !== id)
            .length
          await role.save()
        })
      }

      await object.remove()
      res.status(200).json({ message: `${schemaNameString} removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
