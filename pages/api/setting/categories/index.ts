import nc from 'next-connect'
import { models } from '../../../../models'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Category } = (await models({ req, res })) as any

      const q = req.query && req.query.q

      let query = Category.find(q ? { name: { $regex: q, $options: 'i' } } : {})

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Category.countDocuments(
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
      const { name, status } = req.body
      const { Category } = (await models({ req, res })) as any

      const exist = await Category.findOne({
        name: { $regex: `^${name?.trim()}$`, $options: 'i' },
      })
      if (exist)
        return res.status(400).json({ error: 'Duplicate category detected' })

      const object = await Category.create({
        name,
        status,
        createdBy: req.user._id,
      })
      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
