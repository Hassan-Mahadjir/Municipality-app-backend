import { Faker } from '@faker-js/faker';
import { Staff } from '../entities/staff.entity';
import { setSeederFactory } from 'typeorm-extension';

export const StaffFactory = setSeederFactory(Staff, (faker: Faker) => {
  const staff = new Staff();
  staff.email = faker.internet.email();
  staff.password = faker.internet.password();

  return staff;
});
