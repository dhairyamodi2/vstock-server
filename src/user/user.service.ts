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
                    id: payload.id,
                    email: payload.email
                }
            })
            if(!user) {
                return {statusCode : 200, message: "user not found", data : {user: null, token}}
            }
            token = await jwt.sign({
                email: payload.email,
                id: payload.id
            }, env.jwt_secret, {
                expiresIn: env.jwt_expire
            })
            return {statusCode: 200, message: "", data: {user, token}}
        } catch (error) {
            if(error instanceof TypeORMError){
                return {statusCode: 422, message: error.message, data: {user: null, token}}
            }         
            return {statusCode: 500, message: error, data: {user: null, token}}   
        }
    }

    async register(payload: RegisterDto) : Promise<RegisterResponse> {
        let user : User | null = null;
        let token = null;
        try {
            if(payload.type == "contributor"){
                if(!payload.IFS_code || !payload.bank_ac_number){
                    return {statusCode: 400, message: 'Bank details required for contributors', data: {user, token}}
                }
            }
            let data = await this.userRepository.insert(payload);
            token = await jwt.sign({
                email: payload.email,
                id: payload.id
            }, env.jwt_secret, {
                expiresIn: env.jwt_expire
            })
            return {statusCode: 200, message: "", data: {user: payload, token}}

        } catch (error) {
            if(error instanceof TypeORMError){
                if(error.message.includes('Duplicate'))
                return {statusCode: 422, message: error.message, data: {user, token}}
            }
            return {statusCode: 500, message: error, data: {user, token}}
        }
        
    }
}
