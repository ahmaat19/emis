import db from '../config/db'
import accountSchema, { IAccount } from './Account'
import accountTypeSchema, { IAccountType } from './AccountType'
import categorySchema, { ICategory } from './Category'
import clientSchema, { IClient } from './Client'
import clientPermissionSchema, { IClientPermission } from './ClientPermission'
import customerSchema, { ICustomer } from './Customer'
import employeeSchema, { IEmployee } from './Employee'
import labelSchema, { ILabel } from './Label'
import organizationSchema, { IOrganization } from './Organization'
import permissionSchema, { IPermission } from './Permission'
import productTypeSchema, { IProductType } from './ProductType'
import profileSchema, { IProfile } from './Profile'
import roleSchema, { IRole } from './Role'
import supplierSchema, { ISupplier } from './Supplier'
import unitSchema, { IUnit } from './Unit'
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
  Employee: IEmployee
  Supplier: ISupplier
  Customer: ICustomer
  Label: ILabel
  ProductType: IProductType
  Category: ICategory
  Unit: IUnit
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
  const Employee = await conn.model('Employee', employeeSchema)
  const Supplier = await conn.model('Supplier', supplierSchema)
  const Customer = await conn.model('Customer', customerSchema)
  const Label = await conn.model('Label', labelSchema)
  const ProductType = await conn.model('ProductType', productTypeSchema)
  const Category = await conn.model('Category', categorySchema)
  const Unit = await conn.model('Unit', unitSchema)

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
    Employee,
    Supplier,
    Customer,
    Label,
    ProductType,
    Category,
    Unit,
  } as ModelProps
}
