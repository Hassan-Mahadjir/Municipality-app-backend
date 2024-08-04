import { faker } from '@faker-js/faker';
import { Complaint } from '../entities/complaint.entity';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/userProfile.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // with dataSource we can access our Repositories entities
    // with factoryManager will allow us to access factories we created

    /* 1. create 2-types of Roles manually */
    console.log('seeding RoleTypes .....');
    const roleRepo = dataSource.getRepository(Role);
    const roleTypes = await roleRepo.save([
      {
        roleName: 'Admin',
        description: 'Responsible for the entire system by...',
      },
      {
        roleName: 'User',
        description: 'Views the components defined to him/her',
      },
    ]);

    const userFactory = factoryManager.get(User);
    console.log('seeding users .....');
    const users = await userFactory.saveMany(10);

    const complaintFactory = factoryManager.get(Complaint);
    console.log('seeding complaints .....');
    const complaints = await Promise.all(
      Array(20)
        .fill('')
        .map(async () => {
          const complaint = await complaintFactory.make({
            user: faker.helpers.arrayElement(users),
            // type: faker.helpers.arrayElement(roleTypes),
          });
          return complaint;
        }),
    );

    const complaintRepo = dataSource.getRepository(Complaint);
    await complaintRepo.save(complaints);

    const profileFactory = factoryManager.get(UserProfile);
    console.log('seeding profiles .....');
    const profiles = await Promise.all(
      Array(10)
        .fill('')
        .map(async () => {
          const profile = await profileFactory.make({
            user: faker.helpers.arrayElement(users),
          });
          return profile;
        }),
    );

    const profileRepo = dataSource.getRepository(UserProfile);
    await profileRepo.save(profiles);
  }
}
