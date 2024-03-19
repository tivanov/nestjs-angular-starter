import { ShapeableQuery } from './shapeable-query';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class GetUsersQuery extends ShapeableQuery {
  @IsNotEmpty()
  @IsNumberString()
  page?: number;

  @IsNotEmpty()
  @IsNumberString()
  limit?: number;
}
