import { Faker, faker } from '@faker-js/faker';
import { Complaint } from '../entities/complaint.entity';
import { setSeederFactory } from 'typeorm-extension';

export const ComplaintFactroy = setSeederFactory(Complaint, (faker: Faker) => {
  // Create an instance of complaint class
  const complaint = new Complaint();

  // genrate random values of the defined fields
  complaint.type = faker.commerce.department();
  complaint.feedback = faker.lorem.sentence(2);

  return complaint;
});
