import { Schema } from 'mongoose'

export interface IPermission {
  _id: Schema.Types.ObjectId
  name: string
  method: string
  route: string
  description?: boolean
  createdAt?: Date
}

const permissionSchema = new Schema<IPermission>(
  {
    name: { type: String, required: true },
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE'],
      toUpperCase: true,
      required: true,
    },
    route: { type: String, required: true, toLowerCase: true },
    description: String,
  },
  { timestamps: true }
)

export default permissionSchema
