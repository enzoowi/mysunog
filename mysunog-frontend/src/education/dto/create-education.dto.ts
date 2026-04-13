import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { EducationCategory } from '../education.entity';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(EducationCategory)
  category: EducationCategory;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
