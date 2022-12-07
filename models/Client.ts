import { Schema } from 'mongoose'

export interface IClient {
  _id: Schema.Types.ObjectId
  name: string
  email: string
  mobile: string
  address: string
  database: string
  status: 'active' | 'disabled'
  createdAt?: Date
  clientCode: number
}

const clientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    database: { type: String, required: true, unique: true, lowercase: true },
    status: { type: String, enum: ['active', 'disabled'], required: true },
    clientCode: { type: Number, required: true, unique: true },
  },
  { timestamps: true }
)

export default clientSchema
