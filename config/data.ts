const roles = [
  {
    _id: '5e0af1c63b6482125c1b22cb',
    name: 'Super Admin',
    description:
      'Super Admins can access and manage all features and settings.',
    type: 'SUPER_ADMIN',
  },
  {
    _id: '5e0af1c63b6482125c1b44cb',
    name: 'Authenticated',
    description: 'Default role given to authenticated user.',
    type: 'AUTHENTICATED',
  },
]

const users = {
  _id: '5063114bd386d8fadbd6b00a',
  name: 'Ahmed Ibrahim',
  email: 'info@ahmedibra.com',
  password: '123456',
  confirmed: true,
  blocked: false,
}

const clients = {
  _id: '5063124bd386d8fadbd6b00a',
  name: 'Ahmed Ibrahim',
  email: 'info@ahmedibra.com',
  mobile: '252615301507',
  address: 'Mogadishu',
  database: 'masterdb',
  status: 'active',
  clientCode: 615301507,
}

const organization = {
  _id: '639b19eaf695de3b46047798',
  name: '',
  image: '',
  address: '',
  mobile: '',
  details: '',
}

const profile = {
  _id: '5063114bd386d8fadbd6b00b',
  mobile: 252615301507,
  address: 'Mogadishu',
  image: 'https://github.com/ahmaat19.png',
  bio: 'Full Stack Developer',
}

const sort = {
  hidden: 0,
  profile: 1,
  admin: 2,
  setting: 3,
}

const clientPermissions = [
  {
    _id: '637e0261fadbdf65bba856b6',
    name: 'Home',
    path: '/',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Home page',
  },
  {
    _id: '637e0261fadbdf65bba856b7',
    name: 'Users',
    path: '/admin/users',
    menu: 'admin',
    sort: sort.admin,
    description: 'Users page',
  },
  {
    _id: '637e0261fadbdf65bba856b8',
    name: 'Roles',
    path: '/admin/roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'Roles page',
  },
  {
    _id: '637e0261fadbdf65bba856b9',
    name: 'Profile',
    path: '/account/profile',
    menu: 'profile',
    sort: sort.profile,
    description: 'Profile page',
  },
  {
    _id: '637e0261fadbdf65bba856bb',
    name: 'Permissions',
    path: '/admin/permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Permissions page',
  },
  {
    _id: '637e0261fadbdf65bba856ba',
    name: 'Client Permissions',
    path: '/admin/client-permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Client Permissions page',
  },
  {
    _id: '637e0261fadbdf65bba856bc',
    name: 'User Roles',
    path: '/admin/user-roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'User Roles page',
  },
  {
    _id: '637e0261fadbdf65bba856bd',
    name: 'User Profiles',
    path: '/admin/user-profiles',
    menu: 'admin',
    sort: sort.admin,
    description: 'User Profiles page',
  },
  {
    _id: '639096dcc21ae2f51f014d7a',
    name: 'Client',
    path: '/admin/clients',
    menu: 'admin',
    sort: sort.admin,
    description: 'Client page',
  },
  {
    _id: '639b1bfea398f1e9b6097590',
    name: 'Organization',
    path: '/admin/organization',
    menu: 'admin',
    sort: sort.admin,
    description: 'Organization page',
  },
  {
    _id: '63a1b4aebfa6707d880d07b1',
    name: 'Account Type',
    path: '/setting/account-types',
    menu: 'setting',
    sort: sort.setting,
    description: 'Account types page',
  },
  {
    _id: '63a1b4aebfa6707d880d07b0',
    name: 'Account',
    path: '/setting/accounts',
    menu: 'setting',
    sort: sort.setting,
    description: 'Account page',
  },
]

const permissions = [
  // Users
  {
    _id: '637e01fbfadbdf65bba855e2',
    description: 'Users',
    route: '/api/auth/users',
    name: 'Users',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e3',
    description: 'User By Id',
    route: '/api/auth/users/:id',
    name: 'Users',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e4',
    description: 'User',
    route: '/api/auth/users',
    name: 'Users',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855e6',
    description: 'User',
    route: '/api/auth/users/:id',
    name: 'Users',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855e7',
    description: 'User',
    route: '/api/auth/users/:id',
    name: 'Users',
    method: 'DELETE',
  },

  //   User Profile
  {
    _id: '637e01fbfadbdf65bba855e5',
    description: 'Profiles',
    route: '/api/auth/user-profiles',
    name: 'User Profiles',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e8',
    description: 'Profile',
    route: '/api/auth/profile',
    name: 'User Profile',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e9',
    description: 'Profile',
    route: '/api/auth/profile/:id',
    name: 'User Profile',
    method: 'PUT',
  },

  //   Role
  {
    _id: '637e01fbfadbdf65bba855ea',
    description: 'Roles',
    route: '/api/auth/roles',
    name: 'Roles',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855eb',
    description: 'Role',
    route: '/api/auth/roles',
    name: 'Roles',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855ec',
    description: 'Role',
    route: '/api/auth/roles/:id',
    name: 'Roles',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855ed',
    description: 'Role',
    route: '/api/auth/roles/:id',
    name: 'Roles',
    method: 'DELETE',
  },

  //   Permission
  {
    _id: '637e01fbfadbdf65bba855ee',
    description: 'Permissions',
    route: '/api/auth/permissions',
    name: 'Permissions',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855ef',
    description: 'Permission',
    route: '/api/auth/permissions',
    name: 'Permissions',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855f0',
    description: 'Permission',
    route: '/api/auth/permissions/:id',
    name: 'Permissions',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855f1',
    description: 'Permission',
    route: '/api/auth/permissions/:id',
    name: 'Permissions',
    method: 'DELETE',
  },

  //   User Role
  {
    _id: '637e01fbfadbdf65bba855f2',
    description: 'User Roles',
    route: '/api/auth/user-roles',
    name: 'User Roles',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855f4',
    description: 'User Role',
    route: '/api/auth/user-roles',
    name: 'User Roles',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855f3',
    description: 'User Role',
    route: '/api/auth/user-roles/:id',
    name: 'User Roles',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855f5',
    description: 'User Role',
    route: '/api/auth/user-roles/:id',
    name: 'User Roles',
    method: 'DELETE',
  },

  //   Client Permission
  {
    _id: '637e01fbfadbdf65bba855f6',
    description: 'Client Permissions',
    route: '/api/auth/client-permissions',
    name: 'ClientPermissions',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855f7',
    description: 'Client Permission',
    route: '/api/auth/client-permissions',
    name: 'ClientPermissions',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855f8',
    description: 'Client Permission',
    route: '/api/auth/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855f9',
    description: 'Client Permission',
    route: '/api/auth/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'DELETE',
  },

  //   Clients
  {
    _id: '637e01fbfadbdf66bba855f6',
    description: 'Clients',
    route: '/api/clients',
    name: 'Client',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf64bba855f7',
    description: 'Client',
    route: '/api/clients',
    name: 'Client',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf63bba855f8',
    description: 'Client',
    route: '/api/clients/:id',
    name: 'Client',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf62bba855f9',
    description: 'Client',
    route: '/api/clients/:id',
    name: 'Client',
    method: 'DELETE',
  },
  {
    _id: '637e01fbfadbdf64bba855f8',
    description: 'Client Seed Data',
    route: '/api/clients/seed',
    name: 'Client',
    method: 'POST',
  },
  //   Organization
  {
    _id: '639b175ef695de3b46047776',
    description: 'Organization',
    route: '/api/organization',
    name: 'Organization',
    method: 'GET',
  },
  {
    _id: '639b175ef695de3b46047777',
    description: 'Organization',
    route: '/api/organization/:id',
    name: 'Organization',
    method: 'PUT',
  },

  //   Account Type
  {
    _id: '63a1b180bfa6707d880d07a8',
    description: 'Account Types',
    route: '/api/setting/account-types',
    name: 'Account Types',
    method: 'GET',
  },
  {
    _id: '63a1b180bfa6707d880d07a9',
    description: 'Account Type',
    route: '/api/setting/account-types',
    name: 'Account Types',
    method: 'POST',
  },
  {
    _id: '63a1b180bfa6707d880d07aa',
    description: 'Account Type',
    route: '/api/setting/account-types/:id',
    name: 'Account Types',
    method: 'PUT',
  },
  {
    _id: '63a1b180bfa6707d880d07ab',
    description: 'Account Type',
    route: '/api/setting/account-types/:id',
    name: 'Account Types',
    method: 'DELETE',
  },

  //   Account
  {
    _id: '63a1b180bfa6707d880d07ac',
    description: 'Accounts',
    route: '/api/setting/accounts',
    name: 'Accounts',
    method: 'GET',
  },
  {
    _id: '63a1b180bfa6707d880d07ad',
    description: 'Account ',
    route: '/api/setting/accounts',
    name: 'Accounts',
    method: 'POST',
  },
  {
    _id: '63a1b180bfa6707d880d07ae',
    description: 'Account ',
    route: '/api/setting/accounts/:id',
    name: 'Accounts',
    method: 'PUT',
  },
  {
    _id: '63a1b180bfa6707d880d07af',
    description: 'Account ',
    route: '/api/setting/accounts/:id',
    name: 'Accounts',
    method: 'DELETE',
  },
]

export {
  roles,
  users,
  profile,
  permissions,
  clientPermissions,
  clients,
  organization,
}
