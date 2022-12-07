import nc from 'next-connect'
import {
  permissions,
  clientPermissions,
  users,
  profile,
  roles,
} from '../../../config/data'
import { models } from '../../../models'
import { isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Client } = (await models({ req, res })) as any

      const q = req.query && req.query.q

      let query = Client.find(q ? { name: { $regex: q, $options: 'i' } } : {})

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Client.countDocuments(
        q ? { name: { $regex: q, $options: 'i' } } : {}
      )

      const pages = Math.ceil(total / pageSize)

      query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 }).lean()

      const result = await query

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + result.length,
        count: result.length,
        page,
        pages,
        total,
        data: result,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Client } = (await models({ req, res })) as any

      const { name, email, address, mobile, status, clientCode, database } =
        req.body

      const exist = await Client.exists({
        database: database.toLowerCase(),
      })

      if (exist) {
        return res.status(400).send('Database already exists')
      }
      const object = await Client.create({
        name,
        email,
        address,
        mobile,
        status,
        clientCode,
        database,
      })

      // seed data
      const { User, Profile, Permission, ClientPermission, Role, UserRole } =
        (await models({
          req,
          res,
          dbCode: clientCode,
        })) as any

      // Create users
      const userObject = await User.create({
        _id: users._id,
        name: name,
        email: email,
        password: `${clientCode}123`,
        confirmed: true,
        blocked: false,
        clientCode: clientCode,
      })

      // Create profiles for users
      await Profile.create({
        _id: profile._id,
        user: userObject._id,
        name: name,
        address: address,
        mobile: mobile,
        bio: '',
        image: `https://ui-avatars.com/api/?uppercase=true&name=${name}&background=random&color=random&size=128`,
      })

      // Create permissions
      const filteredPermissions = permissions.filter((p) => p.name !== 'Client')

      const permissionsObj = Promise.all(
        filteredPermissions?.map(async (obj) => await Permission.create(obj))
      )
      const permissionsObjects = await permissionsObj

      // Create client permissions
      const filteredClientPermissions = clientPermissions.filter(
        (p) => p.name !== 'Client'
      )

      const clientPermissionsObj = Promise.all(
        filteredClientPermissions?.map(
          async (obj) => await ClientPermission.create(obj)
        )
      )

      const clientPermissionsObjects = await clientPermissionsObj

      // Create roles
      const roleObj = Promise.all(
        roles?.map(async (obj) => await Role.create(obj))
      )
      const roleObjects = await roleObj

      // Create user roles
      await UserRole.create({
        user: users._id,
        role: roles[0]._id,
      })

      // Find super admin role
      const superAdminRole = roleObjects.find((r) => r.type === 'SUPER_ADMIN')

      // Create permissions for super admin role
      superAdminRole.permission = permissionsObjects.map((p) => p._id)

      // create client permissions for super admin role
      superAdminRole.clientPermission = clientPermissionsObjects.map(
        (p) => p._id
      )

      // Update super admin role
      await superAdminRole.save()

      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
