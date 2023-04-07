import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, TypeORMError } from 'typeorm';
import { LoginDto, RegisterDto } from './user.dto';
import User from './user.entity';
import { LoginResponse, RegisterResponse } from './user.responses';
import * as jwt from 'jsonwebtoken';
import { env } from 'src/constants/constants';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
    ){

    }

    async login(payload : LoginDto) : Promise<LoginResponse>{
        let token = null;
        try {
            const user = await this.userRepository.findOne({
                where: {
                    uid: payload.uid,
                    email: payload.email,
                }
            })
            if(!user) {
                return {statusCode : 200, message: "user not found", data : {user: null, token}}
            }
            if(user.user_type != payload.user_type){
                return {statusCode: 422, message: `Given user exists as ${user.user_type}`, data: {user : null, token}}
            }
            token = await jwt.sign({
                email: payload.email,
                uid: payload.uid,
                user_type: payload.user_type
            }, env.jwt_secret, {
                expiresIn: env.jwt_expire
            })
            return {statusCode: 200, message: "", data: {user, token}}
        } catch (error) {
            if(error instanceof TypeORMError){
                return {statusCode: 400, message: error.message, data: {user: null, token}}
            }         
            return {statusCode: 500, message: error, data: {user: null, token}}   
        }
    }

    async register(payload: RegisterDto) : Promise<RegisterResponse> {
        let user : User | null = null;
        let token = null;
        try {
            if(payload.user_type == "contributor"){
                if(!payload.IFS_code || !payload.bank_ac_number){
                    return {statusCode: 400, message: 'Bank details required for contributors', data: {user : null, token}}
                }
            }
            let data = await this.userRepository.insert(payload);
            token = await jwt.sign({
                email: payload.email,
                uid: payload.uid
            }, env.jwt_secret, {
                expiresIn: env.jwt_expire
            })
            let user = await this.userRepository.findOne({where: {uid: payload.uid}});
            return {statusCode: 200, message: "", data: {user, token}}

        } catch (error) {
            if(error instanceof TypeORMError){
                if(error.message.includes('Duplicate'))
                return {statusCode: 422, message: error.message, data: {user, token}}
            }
            return {statusCode: 500, message: error, data: {user, token}}
        }
        
    }
}
