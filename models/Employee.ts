import { Schema } from 'mongoose'

export interface IEmployee {
  _id: Schema.Types.ObjectId
  name: string
  phone: number
  title: string
  user: Schema.Types.ObjectId
  status: 'active' | 'disabled'
  createdBy: Schema.Types.ObjectId
  updatedBy: Schema.Types.ObjectId
}

const employeeSchema = new Schema<IEmployee>(
  {
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    title: { type: String, required: true },
    status: { type: String, enum: ['active', 'disabled'], required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default employeeSchema
