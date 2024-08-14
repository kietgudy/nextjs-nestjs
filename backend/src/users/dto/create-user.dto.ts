import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không đúng định dạng!' })
  @IsNotEmpty({ message: 'Địa chỉ email không được để trống!' })
  email: string;
  @IsNotEmpty({ message: 'Mật khẩu không được để trống!' })
  password: string;
  @IsNotEmpty({ message: 'Tên tài khoản không được để trống!' })
  name: string;
  phone: string;
  address: string;
  image: string;
}
