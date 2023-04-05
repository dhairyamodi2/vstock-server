import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { env } from "src/constants/constants";
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
