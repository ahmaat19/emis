import { Schema } from 'mongoose'

export interface ICategory {
  _id: Schema.Types.ObjectId
  name: string
  status: 'active' | 'disabled'
  createdBy: Schema.Types.ObjectId
  updatedBy: Schema.Types.ObjectId
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'disabled'], required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default categorySchema
