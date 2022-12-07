import nc from 'next-connect'
import { models } from '../../../../models'
import { isAuth } from '../../../../utils/auth'

const schemaNameString = 'UserRole'

const handler = nc()

handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { User, Role, UserRole } = (await models({ req, res })) as any

      const { id } = req.query
      const { user, role } = req.body

      if (!user || !role) return res.status(400).json({ error: 'Bad request' })

      const userExist = await User.findById(user)
      if (!userExist)
        return res.status(400).json({ error: 'User does not exist' })

      const roleExist = await Role.findById(role)
      if (!roleExist)
        return res.status(400).json({ error: 'Role does not exist' })

      const userRoleExist = await UserRole.findOne({ user })
      if (userRoleExist && userRoleExist.id !== id)
        return res.status(400).json({ error: 'User Role already exist' })

      const object = await UserRole.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      object.user = user
      object.role = role
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
      const { UserRole } = (await models({ req, res })) as any

      const { id } = req.query
      const object = await UserRole.findById(id)
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
