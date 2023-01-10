import { Schema } from 'mongoose'

export interface IUnit {
  _id: Schema.Types.ObjectId
  name: string
  status: 'active' | 'disabled'
  createdBy: Schema.Types.ObjectId
  updatedBy: Schema.Types.ObjectId
}

const unitSchema = new Schema<IUnit>(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'disabled'], required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default unitSchema
