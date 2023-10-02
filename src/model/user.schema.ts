import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
export type UserDocument = User & Document;
@Schema()
export class User {
    @Prop({required:true})
    name: string;
    @Prop({required:true, unique:true, lowercase:true})
    userName: string;
    @Prop({required:true})
    password: string
    @Prop({required:true, default: 1})
    roleId: Number
    @Prop({default: Date.now()})
    createdDate: Date
}
export const UserSchema = SchemaFactory.createForClass(User)