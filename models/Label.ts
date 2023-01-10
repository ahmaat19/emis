import { Schema } from 'mongoose'

export interface ILabel {
  _id: Schema.Types.ObjectId
  name: string
  module: string
  status: 'active' | 'disabled'
  createdBy: Schema.Types.ObjectId
  updatedBy: Schema.Types.ObjectId
}

const labelSchema = new Schema<ILabel>(
  {
    name: { type: String, required: true },
    module: { type: String, required: true },
    status: { type: String, enum: ['active', 'disabled'], required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default labelSchema
