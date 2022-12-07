import nc from 'next-connect'
import { generateToken } from '../../../../utils/auth'
import { models } from '../../../../models'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const email = req.body.email.toLowerCase()
      const { password, dbCode } = req.body

      const { User, UserRole } = (await models({ req, res, dbCode })) as any

      const user = await User.findOne({ email })

      if (user && (await user.matchPassword(password))) {
        if (user.blocked)
          return res.status(401).send({ error: 'User is blocked' })

        if (!user.confirmed)
          return res.status(401).send({ error: 'User is not confirmed' })

        const roleObj = await UserRole.findOne({ user: user?._id })
          .lean()
          .sort({ createdAt: -1 })
          .populate({
            path: 'role',
            populate: {
              path: 'clientPermission',
              model: 'ClientPermission',
            },
          })

        if (!roleObj)
          return res
            .status(404)
            .json({ error: 'This user does not have associated role' })

        const routes = roleObj?.role?.clientPermission?.map(
          (a: { menu: string; name: string; path: string; sort: number }) => ({
            menu: a?.menu,
            name: a?.name,
            path: a?.path,
            sort: a?.sort,
          })
        )
        return res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          blocked: user.blocked,
          confirmed: user.confirmed,
          clientCode: user.clientCode,
          role: roleObj.role.type,
          routes: routes,
          token: generateToken(user._id),
        })
      } else {
        return res.status(401).send({ error: 'Invalid credentials' })
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
