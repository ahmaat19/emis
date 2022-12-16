'use strict'
import nc from 'next-connect'
import db from '../../../../config/db'

import {
  users,
  profile,
  roles,
  permissions,
  clientPermissions,
  clients,
  organization,
} from '../../../../config/data'
import userSchema from '../../../../models/User'
import profileSchema from '../../../../models/Profile'
import permissionSchema from '../../../../models/Permission'
import userRoleSchema from '../../../../models/UserRole'
import roleSchema from '../../../../models/Role'
import clientPermissionSchema from '../../../../models/ClientPermission'
import clientSchema from '../../../../models/Client'
import organizationSchema from '../../../../models/Organization'

const handler = nc()

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    // db logic
    const conn = await db('masterdb')
    const User = await conn.model('User', userSchema)
    const Profile = await conn.model('Profile', profileSchema)
    const Permission = await conn.model('Permission', permissionSchema)
    const Role = await conn.model('Role', roleSchema)
    const UserRole = await conn.model('UserRole', userRoleSchema)
    const ClientPermission = await conn.model(
      'ClientPermission',
      clientPermissionSchema
    )
    const Client = await conn.model('Client', clientSchema)
    const Organization = await conn.model('Organization', organizationSchema)

    try {
      const { secret } = req.query

      if (!secret || secret !== 'ts')
        return res.status(401).json({ error: 'Unauthorized' })

      // Delete all existing data
      await User.deleteMany({})
      await Profile.deleteMany({})
      await Role.deleteMany({})
      await Permission.deleteMany({})
      await UserRole.deleteMany({})
      await ClientPermission.deleteMany({})
      await Client.deleteMany({})
      await Organization.deleteMany({})

      const clientObject = await Client.create(clients)

      // Create users
      const userObject = await User.create({
        _id: users._id,
        name: users.name,
        email: users.email,
        password: users.password,
        confirmed: true,
        blocked: false,
        clientCode: clientObject?.clientCode,
      })

      // Create profiles for users
      await Profile.create({
        _id: profile._id,
        user: userObject._id,
        name: userObject.name,
        address: profile.address,
        mobile: profile.mobile,
        bio: profile.bio,
        image: `https://ui-avatars.com/api/?uppercase=true&name=${userObject.name}&background=random&color=random&size=128`,
      })

      // Check duplicate permissions
      permissions.map((p) => {
        if (p.method && p.route) {
          const duplicate = permissions.filter(
            (p2) => p2.method === p.method && p2.route === p.route
          )
          if (duplicate.length > 1) {
            return res.status(500).json({
              error: `Duplicate permission: ${p.method} ${p.route}`,
            })
          }
        }
      })

      // Create permissions
      const permissionsObj = Promise.all(
        permissions?.map(async (obj) => await Permission.create(obj))
      )
      const permissionsObjects = await permissionsObj

      // Create client permissions
      const clientPermissionsObj = Promise.all(
        clientPermissions?.map(
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

      await Organization.create(organization)

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

      res.status(200).json({
        message: 'Database seeded successfully',
        users: await User.countDocuments({}),
        profiles: await Profile.countDocuments({}),
        permissions: await Permission.countDocuments({}),
        clientPermissions: await ClientPermission.countDocuments({}),
        roles: await Role.countDocuments({}),
        userRoles: await UserRole.countDocuments({}),
        clients: await Client.countDocuments({}),
        organization: await Organization.countDocuments({}),
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
