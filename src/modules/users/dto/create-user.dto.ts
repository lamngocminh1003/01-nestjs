import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;
  @IsNotEmpty({ message: 'email không được để trống' })
  @IsEmail({}, { message: 'email không đúng định dạng' })
  email: string;
  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;
  @IsOptional() // Cho phép bỏ qua nếu không có
  @IsString()
  phone: string;
  @IsOptional() // Cho phép bỏ qua nếu không có
  @IsString()
  address: string;
  @IsOptional() // Cho phép bỏ qua nếu không có
  @IsString()
  image: string;
}
