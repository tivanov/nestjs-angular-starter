import { IsOptional } from 'class-validator';

export class ShapeableQuery {
  @IsOptional()
  include?: string[];

  @IsOptional()
  select?: string[];
}
