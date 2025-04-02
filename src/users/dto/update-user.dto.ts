export interface UpdateUserDto {
  password?: string;
  email?: string;
  name?: string;
  refreshToken?: string | null;
}
