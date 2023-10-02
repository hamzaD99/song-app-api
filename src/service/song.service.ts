import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, now } from "mongoose";
import { Song, SongDocument } from "../model/song.schema";
import { User, UserDocument } from "../model/user.schema"

@Injectable()
export class SongService {
    constructor(@InjectModel(Song.name) private songModel: Model<SongDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async addSong(song: Song): Promise<any> {
        if(song.name && song.singer && song.link && song.createdBy){
            let createdBy =  await this.userModel.findById(song.createdBy).exec();
            if(createdBy.roleId == 2 || createdBy.roleId == 3){
                const reqBody = {
                    name: song.name,
                    singer: song.singer,
                    link: song.link,
                    coverImage: song.coverImage,
                    createdBy: createdBy
                }
                const newSong = new this.songModel(reqBody);
                console.log(newSong)
                return newSong.save();
            }
            else return new HttpException('really?!', HttpStatus.UNAUTHORIZED)
        }
    }

    async getSongs(page: number = 1, perPage: number = 2): Promise<Song[]> {
        const skip = (page - 1) * perPage;
        return await this.songModel.find().populate('createdBy').skip(skip)
        .limit(perPage)
    }
}