import { SetMetadata } from '@nestjs/common';

export const Actions = (...actions: string[]) =>
  SetMetadata('actions', actions);
