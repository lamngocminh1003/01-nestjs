import { IsString, IsOptional, IsMongoId, IsNotEmpty } from 'class-validator';
export class UpdateUserDto {
  @IsMongoId({ message: 'Id không hợp lệ' })
  @IsNotEmpty({ message: 'Id không được để trống' })
  _id: string;
  @IsOptional() // Cho phép bỏ qua nếu không có
  @IsString()
  name: string;
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
