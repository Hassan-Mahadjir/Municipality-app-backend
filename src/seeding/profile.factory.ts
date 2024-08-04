import { Faker, faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { UserProfile } from '../entities/userProfile.entity';

export const UserProfileFactory = setSeederFactory(
  UserProfile,
  (faker: Faker) => {
    // Create an instance of UserProfile class
    const profile = new UserProfile();

    // Generate random values for the defined fields
    profile.firstName = faker.person.firstName();
    profile.lastName = faker.person.lastName();
    profile.phone = faker.phone.number();
    profile.address = faker.location.city();

    return profile;
  },
);
