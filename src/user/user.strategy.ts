import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { env } from "process";
import { Repository } from "typeorm";
import User from "./user.entity";

type JwtPayload = {
    uid : string;
    email : string;
    user_type: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>

    ) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: env.jwt_secret
        });
    }

    async validate(payload : JwtPayload) : Promise<any>{
        try {
            console.log(payload);
            const user = await this.userRepository.findOne({
                where: {
                    email : payload.email,
                    uid: payload.uid,
                    user_type: payload.user_type
                }
            })

            if(!user) throw new UnauthorizedException();

            return user;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}


@Injectable()
export class RoleStrategy extends PassportStrategy(Strategy, 'contributor'){
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>

    ) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: env.jwt_secret
        });
    }

    async validate(payload : JwtPayload) : Promise<any>{
        try {
            console.log(payload);
            const user = await this.userRepository.findOne({
                where: {
                    email : payload.email,
                    uid: payload.uid,
                }
            })
            if(!user) throw new UnauthorizedException();
            if(user.user_type != 'contributor'){
                console.log(user.user_type);
                throw new ForbiddenException();
            }
            return user;
        } catch (error) {
            if(error instanceof ForbiddenException){
                throw new ForbiddenException();
            }
            throw new UnauthorizedException();
        }
    }
}