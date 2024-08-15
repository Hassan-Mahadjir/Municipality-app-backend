import { faker } from '@faker-js/faker';
import { Profile } from '../entities/profile.entity';
import { Staff } from '../entities/staff.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../entities/user.entity';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('Seeding Staff ....');
    const staffFactory = factoryManager.get(Staff);

    // Generate 5 staff records
    const staffs = await staffFactory.saveMany(5);

    //Generate 5 user recods
    console.log('seeding user ...');
    const userFactory = factoryManager.get(User);
    const users = await userFactory.saveMany(5);

    console.log('Seeding staff Profile ....');
    const profileFactory = factoryManager.get(Profile);

    // Create profiles and ensure each profile is assigned to a unique staff
    const staffProfiles = await Promise.all(
      staffs.map(async (staff) => {
        const profile = await profileFactory.make({ staff: staff });
        return profile;
      }),
    );

    const profileRepo = dataSource.getRepository(Profile);
    await profileRepo.save(staffProfiles);
    console.log('seeding user profiles');
    const userProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await profileFactory.make({ user: user });
        return profile;
      }),
    );

    await profileRepo.save(userProfiles);
  }
}
