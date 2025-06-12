import { IsArray, IsOptional, IsString } from 'class-validator';

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
  @IsArray()
  @IsString({ each: true })
  fens: string[];

  @IsArray()
  @IsString({ each: true })
  pieces: string[];
  @IsString()
  side: string;
}
