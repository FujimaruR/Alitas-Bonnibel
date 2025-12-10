import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    console.log('🔐 validateUser()');
    console.log('  email from DTO:', email);
    console.log('  user found    :', user ? `${user.email} (id=${user.id})` : 'null');

    if (!user) {
      // Email no existe
      throw new UnauthorizedException('Invalid credentials');
    }

    let passwordValid = false;

    try {
      passwordValid = await argon2.verify(user.password_hash, password);
      console.log('  passwordValid :', passwordValid);
    } catch (e) {
      console.error('  Error in argon2.verify:', e);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    };
  }
}
