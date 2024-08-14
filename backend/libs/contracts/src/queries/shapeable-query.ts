import { IsNumberString, IsOptional } from 'class-validator';

export class ShapeableQuery {
  @IsOptional()
  include?: string[];

  @IsOptional()
  select?: string[];

  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  sortDirection?: string; // 'asc' | 'desc';
}
