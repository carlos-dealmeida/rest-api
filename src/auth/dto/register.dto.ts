import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class RegisterDto extends PickType(CreateUserDto, [
  'username', 
  'email', 
  'password'
] as const) {}
