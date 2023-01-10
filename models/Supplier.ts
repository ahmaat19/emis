import { Schema } from 'mongoose'

export interface ISupplier {
  _id: Schema.Types.ObjectId
  name: string
  phone: number
  business: string
  warehouse: string
  address: string
  openingBalance: number
  status: 'active' | 'disabled'
  createdBy: Schema.Types.ObjectId
  updatedBy: Schema.Types.ObjectId
}

const supplierSchema = new Schema<ISupplier>(
  {
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    business: { type: String, required: true },
    warehouse: { type: String, required: true },
    address: { type: String, required: true },
    openingBalance: { type: Number, required: true },
    status: { type: String, enum: ['active', 'disabled'], required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default supplierSchema
