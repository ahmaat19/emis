import { Schema } from 'mongoose'

export interface IAccountType {
  _id: Schema.Types.ObjectId
  name: string
  status: 'active' | 'disabled'
  createdBy: Schema.Types.ObjectId
  updatedBy: Schema.Types.ObjectId
}

const accountTypeSchema = new Schema<IAccountType>(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'disabled'], required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default accountTypeSchema
