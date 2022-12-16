import { Schema } from 'mongoose'

export interface IOrganization {
  _id: Schema.Types.ObjectId
  name?: string
  image?: string
  address?: string
  mobile?: number
  details?: string
  createdAt?: Date
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: String,
    image: String,
    address: String,
    mobile: Number,
    details: String,
  },
  { timestamps: true }
)

export default organizationSchema
