import nc from 'next-connect'
import { models } from '../../../../models'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Supplier } = (await models({ req, res })) as any

      const q = req.query && req.query.q

      let query = Supplier.find(
        q ? { business: { $regex: q, $options: 'i' } } : {}
      )

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Supplier.countDocuments(
        q ? { business: { $regex: q, $options: 'i' } } : {}
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
      const {
        name,
        phone,
        address,
        openingBalance,
        status,
        business,
        warehouse,
      } = req.body
      const { Supplier } = (await models({ req, res })) as any

      // console.log(req.body)

      const exist = await Supplier.findOne({
        business: { $regex: `^${business?.trim()}$`, $options: 'i' },
      })
      if (exist)
        return res.status(400).json({ error: 'Duplicate supplier detected' })

      const object = await Supplier.create({
        name,
        phone,
        address,
        openingBalance,
        status,
        business,
        warehouse,
        createdBy: req.user._id,
      })
      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
