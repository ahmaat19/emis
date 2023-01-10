import nc from 'next-connect'
import { models } from '../../../../models'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Label } = (await models({ req, res })) as any

      const q = req.query && req.query.q

      let query = Label.find(q ? { name: { $regex: q, $options: 'i' } } : {})

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Label.countDocuments(
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
      const { name, status, module } = req.body
      const { Label } = (await models({ req, res })) as any

      const exist = await Label.findOne({
        name: { $regex: `^${name?.trim()}$`, $options: 'i' },
        module: { $regex: `^${module?.trim()}$`, $options: 'i' },
      })
      if (exist)
        return res.status(400).json({ error: 'Duplicate label detected' })

      const object = await Label.create({
        name,
        status,
        module,
        createdBy: req.user._id,
      })
      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
