import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InspectionStatus } from '../inspection.entity';

export class UpdateInspectionDto {
  @IsEnum(InspectionStatus)
  status: InspectionStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;

  @IsOptional()
  @IsString()
  scheduledDate?: string;

  @IsOptional()
  @IsString()
  scheduledTime?: string;
}
