export class SignInDto {
  name: string
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