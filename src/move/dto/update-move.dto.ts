import { IsOptional, IsString } from 'class-validator';

export class UpdateMoveDto {
  @IsOptional()
  @IsString()
  desc?: string;
}
