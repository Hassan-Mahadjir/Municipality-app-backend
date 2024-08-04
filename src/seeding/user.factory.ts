import { Faker, faker } from '@faker-js/faker';
import { User } from '../entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export const UserFactroy = setSeederFactory(User, (faker: Faker) => {
  // Create an instance of User class
  const user = new User();

  // genrate random values of the defined fields
  user.userName = faker.internet.userName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();

  return user;
});
