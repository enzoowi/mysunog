import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { PermitType } from '../permit.entity';

export class CreatePermitDto {
  @IsString()
  @MinLength(2)
  businessName: string;

  @IsString()
  @MinLength(5)
  businessAddress: string;

  @IsString()
  @MinLength(3)
  purpose: string;

  @IsOptional()
  @IsEnum(PermitType)
  permitType?: PermitType;
}
