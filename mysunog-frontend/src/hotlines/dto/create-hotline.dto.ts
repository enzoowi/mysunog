import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHotlineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsString()
  category?: string;
}
