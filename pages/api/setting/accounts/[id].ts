import nc from 'next-connect'
import { models } from '../../../../models'
import { isAuth } from '../../../../utils/auth'

const schemaNameString = 'Account'

const handler = nc()

handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Account, AccountType } = (await models({ req, res })) as any

      const { id } = req.query
      const { accNo, name, accountType, openingBalance, description, status } =
        req.body
      const object = await Account.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      const exist = await Account.findOne({
        name: { $regex: `^${name?.trim()}$`, $options: 'i' },
        accountType,
        _id: { $ne: id },
      })

      if (exist)
        return res
          .status(400)
          .json({ error: 'Duplicate account type detected' })

      const accountTypeObj = await AccountType.findOne({
        _id: accountType,
        status: 'disabled',
      })
      if (accountTypeObj)
        return res.status(404).json({ error: 'Account type does not exist' })

      object.name = name
      object.accNo = accNo
      object.status = status
      object.openingBalance = openingBalance
      object.description = description
      object.updatedBy = req.user._id
      await object.save()
      res.status(200).json({ message: `${schemaNameString} updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { Account } = (await models({ req, res })) as any

      const { id } = req.query
      const object = await Account.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      await object.remove()
      res.status(200).json({ message: `${schemaNameString} removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
