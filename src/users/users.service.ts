import { ConflictException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { Prisma, User as UserModel } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UserNotFoundException } from './errors/user-not-found';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllUsers(): Promise<Omit<UserModel, 'password'>[]> {
        const users = await this.prisma.user.findMany();

        return users.map((user) => {

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;

            return result;
        });
    }
    async getUserById(id: string): Promise<Omit<UserModel, 'password'>> {
        const user = await this.prisma.user.findUnique(
            {where: {id: id},
        });
        if(!user){
            throw new UserNotFoundException(id);
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...result } = user;

        return result;
    }

    async createUser(data: Prisma.UserCreateInput): Promise<Omit<UserModel, 'password'>>{

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(data.password, salt);

        try{
            const user = await this.prisma.user.create({
                data:{
                    ...data,
                    password:hashedPassword,
                },
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _password, ...result } = user;

            return result;

        }catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                    throw new ConflictException('Email already exists!');
                    }
                }
            throw new InternalServerErrorException('Something went wrong while creating the user!');
        }
        
    }

    async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<Omit<UserModel, 'password'>> {

        if(data.password) {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(data.password as string, salt);
        }
        try {
            const user = await this.prisma.user.update({
                where: {id},
                data
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {password: _password, ...result} = user

            return result;
            
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2025') {
                    throw new UserNotFoundException(id);
                    }
                }
            throw new InternalServerErrorException('Something went wrong while updating the user!');
            
        }

    }

    async deleteUser(id: string): Promise<void> {
        try {
            await this.prisma.user.delete({
                where: { id }, 
            });

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new UserNotFoundException(id);
                }
            }
            
            throw new InternalServerErrorException('Error deleting user');
        }
    }
}
