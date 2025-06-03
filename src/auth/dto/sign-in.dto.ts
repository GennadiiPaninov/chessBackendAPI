export class SignInDto {
  password: string;
  email: string;
}
export interface DebutWhereInput {
  ownerId?: string;
  title?: {
    contains: string;
    mode: 'insensitive';
  };
}