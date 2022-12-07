import nc from 'next-connect'
import { models } from '../../../../models'
import { isAuth } from '../../../../utils/auth'

const schemaNameString = 'Profile'

const handler = nc()
handler.use(isAuth)

handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { User, Profile } = (await models({ req, res })) as any

      const { id } = req.query
      const { name, address, mobile, bio, image, password } = req.body

      const object = await Profile.findOne({ user: id }).populate('user')
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      if (name) await User.findOneAndUpdate({ _id: id }, { name })
      if (password) {
        const regex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!regex.test(password))
          return res.status(400).json({
            error:
              'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character',
          })

        await User.findOneAndUpdate(
          { _id: id },
          { password: await object.user.encryptPassword(password) }
        )
      }

      object.name = name ? name : object.name
      object.mobile = mobile ? mobile : object.mobile
      object.address = address ? address : object.address
      object.image = image ? image : object.image
      object.bio = bio ? bio : object.bio
      object.user = id
      await object.save()
      res.status(200).json({ message: `${schemaNameString} updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
