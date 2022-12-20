import db from '../config/db'
import accountSchema, { IAccount } from './Account'
import accountTypeSchema, { IAccountType } from './AccountType'
import clientSchema, { IClient } from './Client'
import clientPermissionSchema, { IClientPermission } from './ClientPermission'
import organizationSchema, { IOrganization } from './Organization'
import permissionSchema, { IPermission } from './Permission'
import profileSchema, { IProfile } from './Profile'
import roleSchema, { IRole } from './Role'
import userSchema, { IUser } from './User'
import userRoleSchema, { IUserRole } from './UserRole'

export const checkClientDatabase = async (clientCode: any) => {
  const conn = await db('masterdb')
  const Client = await conn.model('Client', clientSchema)
  const clientDB = await Client.findOne({ clientCode, status: 'active' })
  return clientDB
}

interface Props {
  req: NextApiRequestExtended
  res: NextApiResponseExtended
  dbCode?: any
}

interface ModelProps {
  User: IUser
  UserRole: IUserRole
  Role: IRole
  Permission: IPermission
  ClientPermission: IClientPermission
  Profile: IProfile
  Client: IClient
  Organization: IOrganization
  AccountType: IAccountType
  Account: IAccount
}

export const models = async ({ req, res, dbCode }: Props) => {
  const clientDB = await checkClientDatabase(dbCode || req.headers['x-db-key'])

  if (!clientDB) return res.status(404).json({ error: 'Database error' })

  const conn = await db(clientDB.database)
  const User = await conn.model('User', userSchema)
  const UserRole = await conn.model('UserRole', userRoleSchema)
  const Role = await conn.model('Role', roleSchema)
  const ClientPermission = await conn.model(
    'ClientPermission',
    clientPermissionSchema
  )
  const Permission = await conn.model('Permission', permissionSchema)
  const Profile = await conn.model('Profile', profileSchema)
  const Client = await conn.model('Client', clientSchema)
  const Organization = await conn.model('Organization', organizationSchema)
  const AccountType = await conn.model('AccountType', accountTypeSchema)
  const Account = await conn.model('Account', accountSchema)

  return {
    User,
    UserRole,
    Role,
    Permission,
    ClientPermission,
    Profile,
    Client,
    Organization,
    AccountType,
    Account,
  } as ModelProps
}
