import nc from 'next-connect'
import { models } from '../../../../models'
import { isAuth } from '../../../../utils/auth'

const schemaNameString = 'Permission'

const handler = nc()

handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Permission } = (await models({ req, res })) as any

      const { id } = req.query
      const { name, description, method, route, auth } = req.body

      const object = await Permission.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      object.name = name
      object.description = description
      object.method = method
      object.route = route
      object.auth = auth
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
      const { Permission, Role } = (await models({ req, res })) as any

      const { id } = req.query
      const object = await Permission.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      const rolesObject = await Role.find({
        permission: object._id,
      })

      if (rolesObject.length > 0) {
        rolesObject.forEach(async (role: any) => {
          role.permission.filter((item: string) => item.toString() !== id)
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
