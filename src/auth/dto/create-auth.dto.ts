import { IsNotEmpty, IsEmail, IsMongoId } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'email không đúng định dạng' })
  email: string;
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;
}
export class CodeAuthDto {
  @IsNotEmpty({ message: 'Id không được để trống' })
  _id: string;
  @IsNotEmpty({ message: 'Code không được để trống' })
  code: string;
}
