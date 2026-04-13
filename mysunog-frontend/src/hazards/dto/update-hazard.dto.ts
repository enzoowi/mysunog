import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HazardStatus } from '../hazard-report.entity';

export class UpdateHazardDto {
  @IsEnum(HazardStatus)
  status: HazardStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
