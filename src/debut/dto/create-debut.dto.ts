import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDebutDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @IsString()
  side: string;
}
