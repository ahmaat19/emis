import { Schema } from 'mongoose'

export interface IAccount {
  _id: Schema.Types.ObjectId
  accNo: number
  name: string
  accountType: Schema.Types.ObjectId
  openingBalance: number
  description: string
  status: 'active' | 'disabled'
  createdBy: Schema.Types.ObjectId
  updatedBy: Schema.Types.ObjectId
}

const accountSchema = new Schema<IAccount>(
  {
    accNo: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    accountType: {
      type: Schema.Types.ObjectId,
      ref: 'AccountType',
      required: true,
    },
    openingBalance: { type: Number, default: 0 },
    description: String,
    status: { type: String, enum: ['active', 'disabled'], required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default accountSchema
