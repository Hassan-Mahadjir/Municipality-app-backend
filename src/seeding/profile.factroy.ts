import { Faker } from '@faker-js/faker';
import { Profile } from '../entities/profile.entity';
import { setSeederFactory } from 'typeorm-extension';

export const ProfileFactory = setSeederFactory(Profile, (faker: Faker) => {
  const profile = new Profile();
  profile.firstName = faker.person.firstName();
  profile.lastName = faker.person.lastName();
  profile.gender = faker.person.gender();
  profile.avatar = faker.image.avatar();
  profile.dateofBirth = faker.date.birthdate();
  profile.phone = faker.phone.number();
  profile.address = faker.location.city();

  return profile;
});
