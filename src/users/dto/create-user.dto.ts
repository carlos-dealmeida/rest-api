import { IsEmail, IsString, MinLength, MaxLength, IsOptional,IsEnum} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {

    @IsString()
    @MaxLength(20, {message: 'The username cannot exceed 20 characters'})
    username: string;

    @IsEmail({}, {message: 'E-mail is not valid.'})
    email: string;

    @IsString()
    @MinLength(8, { message: 'The password must have at least 8 characters'})
    password: string;

    @IsOptional()
    @IsEnum(Role, { 
        message: 'Role inválido. As opções válidas são: user, admin' 
    })
    role?: Role;
}

