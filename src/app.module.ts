import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { secret } from './utils/constants';
import { join } from 'path/posix';
import { UserController } from './controller/user.controller';
import { SongController } from './controller/song.controller'
import { UserService } from './service/user.service';
import { SongService } from './service/song.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from './model/user.schema';
import { Song, SongSchema } from './model/song.schema';
import { isAuthenticated } from "./app.middleware"


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/Stream'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, {name: Song.name, schema:SongSchema}]),
    JwtModule.register({
      secret,
      signOptions: { expiresIn: '2h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController, UserController, SongController],
  providers: [AppService, UserService, JwtService, SongService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthenticated)
      .exclude(
        { path: '/api/v1/user/signin', method: RequestMethod.ALL },
        { path: '/api/v1/user/signup', method: RequestMethod.ALL },
      )
      .forRoutes('/*')
  }
}
