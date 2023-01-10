import nc from 'next-connect'
import { models } from '../../../../models'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Employee } = (await models({ req, res })) as any

      const q = req.query && req.query.q

      let query = Employee.find(q ? { name: { $regex: q, $options: 'i' } } : {})

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Employee.countDocuments(
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
      const { name, phone, email, title, status, password } = req.body
      const { Employee, User, Profile } = (await models({ req, res })) as any

      // console.log(req.body)

      const exist = await Employee.findOne({ phone })
      if (exist)
        return res.status(400).json({ error: 'Duplicate employee detected' })

      if (email && password) {
        const userObj = await User.create({
          name,
          email,
          password,
          confirmed: true,
          blocked: false,
          clientCode: req.headers['x-db-key'],
        })

        if (!userObj)
          return res.status(400).json({ error: 'User registration failed' })

        await Profile.create({
          user: userObj._id,
          name: userObj.name,
          mobile: phone,
          image: `https://ui-avatars.com/api/?uppercase=true&name=${userObj.name}&background=random&color=random&size=128`,
        })

        const object = await Employee.create({
          name,
          phone,
          title,
          user: userObj._id,
          status,
          createdBy: req.user._id,
        })
        res.status(200).send(object)
      } else {
        const object = await Employee.create({
          name,
          phone,
          title,
          status,
          createdBy: req.user._id,
        })
        res.status(200).send(object)
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
