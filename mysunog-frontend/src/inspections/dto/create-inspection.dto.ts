import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInspectionDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  barangay: string;

  @IsString()
  @IsNotEmpty()
  preferredDate: string;

  @IsString()
  @IsNotEmpty()
  preferredTime: string;

  @IsOptional()
  @IsString()
  description?: string;
}
