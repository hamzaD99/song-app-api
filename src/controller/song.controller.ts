import { Body, Controller, Delete, Get, HttpStatus, HttpException, Post, UploadedFiles, Put, Req, Res } from "@nestjs/common";
import { Song } from "../model/song.schema";
import { SongService } from "../service/song.service";

@Controller('/api/v1/song')
export class SongController {
    constructor(private readonly songService: SongService,
    ) { }

    @Post('/')
    async AddSong(@Req() request, @Res() response, @Body() song: Song) {
        if(request.user && request.user._id && (request.user.roleId == 2 || request.user.roleId == 3)){
            song.createdBy = request.user._id
            const newSong = await this.songService.addSong(song);
            return response.status(HttpStatus.CREATED).json(newSong)
        }
        return response.status(HttpStatus.UNAUTHORIZED).json('really?!')
    }
    @Get('/')
    async GetSongs(@Req() request, @Res() response) {
        const songs = await this.songService.getSongs(request.query && request.query.page ? parseInt(request.query.page) : 1, request.query && request.query.name ? request.query.name : '');
        return response.status(HttpStatus.OK).json(songs)
    }
    @Delete('/')
    async DeleteSong(@Res() response, @Body() id:any) {
        console.log(id)
        let res = await this.songService.deleteSong(id)
        return response.status(HttpStatus.OK).json(res)
    }
}