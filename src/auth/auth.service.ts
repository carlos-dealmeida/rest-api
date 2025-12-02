import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}
@Injectable()
export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService      
  ) {}

  async register(data: RegisterDto): Promise<Omit<UserModel, 'password'>> {

    const userAlreadyExists = await this.usersService.findByEmail(data.email);

    if(userAlreadyExists){
      throw new ConflictException(`The email ${data.email} already exists.`);
    }

    const newUser = await this.usersService.createUser(data);

    return newUser;
  }

  async login(data: LoginDto): Promise<{ access_token: string}>{

    const user = await this.usersService.findByEmail(data.email);

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = { 
      sub: user.id,  
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };

  }

}
