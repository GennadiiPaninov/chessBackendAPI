import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from '../../decorators/Public';
import { Response, Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  async signIn(@Body() data: SignInDto, @Res() res: Response) {
    try {
      const result = await this.authService.signIn(
        data.email,
        data.password,
        res,
      );
      return res.json(result);
    } catch (error) {
      console.error('Error during sign in:', error);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }
  @HttpCode(HttpStatus.OK)
  @Post('register')
  @Public()
  async signUp(@Body() data: SignInDto, @Res() res: Response) {
    try {
      const result = await this.authService.signUp(data.email, data.password);
      return res.json(result);
    } catch (error) {
      console.error('Error during sign in:', error);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refresh_token = req.cookies['refresh_token'];
    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const result = await this.authService.refreshAccessToken(
      refresh_token,
      res,
    );
    return result;
  }
  @Post('confirm-email')
  async confirmEmail(@Body('token') token: string, @Res() res: Response) {
    const result = await this.authService.confirmEmail(token);
    return res.json(result);
  }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.clearToken(req, res);
    return result;
  }
}
