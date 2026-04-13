import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { AlertType } from '../alert.entity';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(AlertType)
  type: AlertType;

  @IsOptional()
  @IsString()
  targetBarangay?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
