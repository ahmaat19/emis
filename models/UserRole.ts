import { Schema } from 'mongoose'

export interface IUserRole {
  _id: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
  role: Schema.Types.ObjectId
  createdAt?: Date
}

const userRoleSchema = new Schema<IUserRole>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
  },
  { timestamps: true }
)

export default userRoleSchema
