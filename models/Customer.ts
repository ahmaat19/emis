import { Schema } from 'mongoose'

export interface ICustomer {
  _id: Schema.Types.ObjectId
  name: string
  phone: number
  address: string
  openingBalance: number
  status: 'active' | 'disabled'
  createdBy: Schema.Types.ObjectId
  updatedBy: Schema.Types.ObjectId
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    openingBalance: { type: Number, required: true },
    status: { type: String, enum: ['active', 'disabled'], required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default customerSchema
