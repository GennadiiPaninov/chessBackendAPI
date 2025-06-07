import { IsOptional, IsString } from 'class-validator';

export class CreateMoveDto {
  @IsString()
  title: string;

  @IsString()
  desc: string;

  @IsString()
  notation: string;

  @IsOptional()
  @IsString()
  debutId?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsString()
  fen: string;
}
