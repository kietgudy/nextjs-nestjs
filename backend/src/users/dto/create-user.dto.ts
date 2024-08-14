import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không đúng định dạng!' })
  @IsNotEmpty({ message: 'Địa chỉ email không được để trống!' })
  email: string;
  @IsNotEmpty({ message: 'Mật khẩu không được để trống!' })
  password: string;
  @IsNotEmpty({ message: 'Tên tài khoản không được để trống!' })
  name: string;
  @IsOptional()
  phone: string;
  @IsOptional()
  address: string;
  @IsOptional()
  image: string;
}
