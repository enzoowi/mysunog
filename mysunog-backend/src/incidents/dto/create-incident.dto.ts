import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  incidentDate: string;

  @IsString()
  @IsNotEmpty()
  incidentTime: string;

  @IsString()
  @IsNotEmpty()
  barangay: string;

  @IsOptional()
  @IsString()
  cause?: string;

  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  estimatedDamage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  casualties?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  injuries?: number;

  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  alarmTime?: string;

  @IsOptional()
  @IsString()
  responseTime?: string;

  @IsOptional()
  @IsString()
  controlTime?: string;

  @IsOptional()
  @IsString()
  fireOutTime?: string;
}
