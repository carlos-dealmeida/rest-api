import { Body, Controller, Get, Post, Patch,  Delete, Param, ParseUUIDPipe, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel} from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
  ) {}
    @Get()
    async getUsers(): Promise<Omit<UserModel, 'password'>[]> {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<Omit<UserModel, 'password'>>{
      return this.userService.getUserById(id);
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto ): Promise<Omit<UserModel, 'password'>>{
      return this.userService.createUser(createUserDto);
    }

    @Patch(':id')
    async updateUser(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateUserDto: UpdateUserDto,
    ) {
      return this.userService.updateUser(id, updateUserDto);
    }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
      return this.userService.deleteUser(id);
  }
    
}
