import nc from 'next-connect'
import { permissions, clientPermissions } from '../../../config/data'
import { models } from '../../../models'
import { isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Client } = (await models({ req, res })) as any

      const { clientCode, database } = req.body

      const exist = await Client.exists({
        database: database.toLowerCase(),
      })

      if (!exist) {
        return res.status(400).json({ error: 'Database does not exist' })
      }

      if (database === 'masterdb') {
        const { Permission, ClientPermission } = (await models({
          req,
          res,
          dbCode: clientCode,
        })) as any

        await Permission.deleteMany({})
        await ClientPermission.deleteMany({})

        permissions?.map(async (obj) => await Permission.create(obj))

        clientPermissions?.map(
          async (obj) => await ClientPermission.create(obj)
        )

        return res.status(200).send('Database restored successfully')
      }

      // seed data
      const { Permission, ClientPermission } = (await models({
        req,
        res,
        dbCode: clientCode,
      })) as any

      await Permission.deleteMany({})
      await ClientPermission.deleteMany({})

      // Create permissions
      const filteredPermissions = permissions.filter((p) => p.name !== 'Client')

      const permissionsObj = Promise.all(
        filteredPermissions?.map(async (obj) => await Permission.create(obj))
      )
      permissionsObj

      // Create client permissions
      const filteredClientPermissions = clientPermissions.filter(
        (p) => p.name !== 'Client'
      )

      const clientPermissionsObj = Promise.all(
        filteredClientPermissions?.map(
          async (obj) => await ClientPermission.create(obj)
        )
      )
      clientPermissionsObj

      res.status(200).send('Database restored successfully')
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
