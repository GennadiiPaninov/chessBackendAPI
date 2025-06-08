import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class SignUpUserDto {
  @MaxLength(15, { message: 'The name must be less than 16 characters long.' })
  name: string;
  @IsEmail()
  email: string;
  @MinLength(8, {
    message: 'The password must contain more than 8 characters.',
  })
  @MaxLength(15, {
    message: 'The password must be less than 16 characters long.',
  })
  password: string;
}
