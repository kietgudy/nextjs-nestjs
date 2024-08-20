import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({message: "Email không được để trống"})
    email: string
    @IsNotEmpty({message: "Password không được để trống"})
    password: string
    @IsOptional()
    name: string
}
export class CheckCodeAuthDto {
    @IsNotEmpty({message: "ID không được để trống"})
    _id: string
    @IsNotEmpty({message: "Code không được để trống"})
    code: string
}
export class ChangePasswordAuthDto {
    @IsNotEmpty({message: "Code không được để trống"})
    code: string
    @IsNotEmpty({message: "Mật khẩu không được để trống"})
    password: string
    @IsNotEmpty({message: "Mật khẩu xác nhận không được để trống"})
    confirmPassword: string
    @IsNotEmpty({message: "Email không được để trống"})
    email: string
}
