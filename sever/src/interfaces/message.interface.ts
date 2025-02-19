import mongoose from "mongoose"
import { message } from "../types/message.types"

type messageWithOutID = Omit<message, 'id' | 'sender' | 'recipient'>

export interface ImessageDocument extends mongoose.Document, messageWithOutID {
    sender: mongoose.Types.ObjectId
    recipient: mongoose.Types.ObjectId
    create_at?: Date
    toMessage: () => message
}

export interface IMessageModel extends mongoose.Model<ImessageDocument> {

}