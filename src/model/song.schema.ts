import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";

export type SongDocument = Song & Document;
@Schema()
export class Song {
    @Prop({required:true})
    name: string;
    @Prop({required:true})
    singer: string;
    @Prop({required:true})
    songLink: string;
    @Prop()
    coverImage: string;
    @Prop({ default: Date.now() })
    uploadDate: Date
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    createdBy: User
}
export const SongSchema = SchemaFactory.createForClass(Song)