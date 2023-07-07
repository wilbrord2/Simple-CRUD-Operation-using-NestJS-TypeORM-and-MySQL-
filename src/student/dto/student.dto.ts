import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  level: string;
  @IsString()
  @IsNotEmpty()
  combination: string;
}
export class testDto{
  id: number;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  level: string;
  @IsString()
  @IsNotEmpty()
  combination: string;
}

export class editStudentDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  level?: string;
  @IsString()
  @IsOptional()
  combination?: string;
}
