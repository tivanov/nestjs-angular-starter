import { Types, PaginateResult } from 'mongoose';
import { UserRoleEnum } from '@app/contracts';
import { UserMappers } from './user.mappers';
import { User } from '../model/user.model';

describe('UserMappers', () => {
  const userId = new Types.ObjectId();

  const inputUser = {
    _id: userId,
    firstName: 'Jane',
    lastName: 'Doe',
    userName: 'jane.doe',
    email: 'jane@example.com',
    role: UserRoleEnum.Admin,
    avatar: '/uploads/avatars/jane.webp',
    address: '123 Main St',
    phone: '+1234567890',
    country: 'US',
    createdAt: new Date('2024-01-15T10:00:00.000Z'),
    updatedAt: new Date('2024-06-01T12:00:00.000Z'),
    lastLogin: new Date('2024-06-10T08:30:00.000Z'),
    settings: {
      currencyCode: 'USD',
      theme: 'dark',
      language: 'en',
    },
  } as User;

  describe('toDto', () => {
    it('maps user document fields to UserDto', () => {
      const actual = UserMappers.toDto(inputUser);

      expect(actual).toEqual({
        id: userId.toHexString(),
        avatar: inputUser.avatar,
        createdAt: inputUser.createdAt.toISOString(),
        updatedAt: inputUser.updatedAt.toISOString(),
        lastLogin: inputUser.lastLogin.toISOString(),
        firstName: inputUser.firstName,
        lastName: inputUser.lastName,
        userName: inputUser.userName,
        role: UserRoleEnum.Admin,
        displayName: 'Jane Doe',
        email: inputUser.email,
        address: inputUser.address,
        phone: inputUser.phone,
        country: inputUser.country,
        creator: null,
        settings: {
          currencyCode: 'USD',
          theme: 'dark',
          language: 'en',
        },
      });
    });

    it('returns ObjectId as string when source is an ObjectId', () => {
      const actual = UserMappers.toDto(userId);
      expect(actual).toBe(userId.toHexString());
    });
  });

  describe('userToDisplayName', () => {
    it('combines first and last name', () => {
      expect(UserMappers.userToDisplayName(inputUser)).toBe('Jane Doe');
    });

    it('falls back to userName when name is empty', () => {
      const user = { userName: 'jane.doe', email: 'jane@example.com' } as User;
      expect(UserMappers.userToDisplayName(user)).toBe('jane.doe');
    });

    it('falls back to email when userName is also empty', () => {
      const user = { email: 'jane@example.com' } as User;
      expect(UserMappers.userToDisplayName(user)).toBe('jane@example.com');
    });

    it('returns N/A when source is null', () => {
      expect(UserMappers.userToDisplayName(null)).toBe('N/A');
    });
  });

  describe('toIdName', () => {
    it('maps user to IdNameDto', () => {
      const actual = UserMappers.toIdName(inputUser);

      expect(actual).toEqual({
        id: userId.toHexString(),
        name: 'Jane Doe',
        name2: 'jane.doe',
        name3: inputUser.avatar,
      });
    });
  });

  describe('toDtosPaged', () => {
    it('maps paginate result to PagedListDto', () => {
      const inputPaged = {
        docs: [inputUser],
        totalDocs: 1,
        limit: 10,
        page: 1,
        totalPages: 1,
      } as PaginateResult<User>;

      const actual = UserMappers.toDtosPaged(inputPaged);

      expect(actual.totalDocs).toBe(1);
      expect(actual.docs).toHaveLength(1);
      expect(actual.docs[0].id).toBe(userId.toHexString());
    });
  });

  describe('toDtos', () => {
    it('returns null for invalid array input', () => {
      expect(UserMappers.toDtos(null)).toBeNull();
    });

    it('maps array of users to DTOs', () => {
      const actual = UserMappers.toDtos([inputUser]);
      expect(actual).toHaveLength(1);
      expect((actual[0] as { id: string }).id).toBe(userId.toHexString());
    });
  });
});
