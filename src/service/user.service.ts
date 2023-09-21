import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, now } from "mongoose";
import { User, UserDocument } from "../model/user.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { secret } from "../utils/constants";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async signin(user: User, jwt: JwtService): Promise<any> {
        const foundUser = await this.userModel.findOne({ email: user.email }).exec();
        if (foundUser) {
            const { password } = foundUser;
            if (await bcrypt.compare(user.password, password)) {
                const payload = { email: user.email };
                return {
                    token: jwt.sign({sub: payload},{secret: secret}),
                };
            }
            return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
        }
        return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
    }

    async signup(user: User): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        const reqBody = {
            name: user.name,
            email: user.email,
            password: hash,
            createdDate: now()
        }
        const newUser = new this.userModel(reqBody);
        return newUser.save();
    }

    async getOne(email): Promise<User> {
        return await this.userModel.findOne({ email }).exec();
    }
}