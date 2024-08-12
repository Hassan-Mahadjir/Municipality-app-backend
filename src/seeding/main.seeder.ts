import { faker } from '@faker-js/faker';
import { Profile } from '../entities/profile.entity';
import { Staff } from '../entities/staff.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('Seeding Staff ....');
    const staffFactory = factoryManager.get(Staff);

    // Generate 5 staff records
    const staffs = await staffFactory.saveMany(5);

    console.log('Seeding Profile ....');
    const profileFactory = factoryManager.get(Profile);

    // Create profiles and ensure each profile is assigned to a unique staff
    const profiles = await Promise.all(
      staffs.map(async (staff) => {
        const profile = await profileFactory.make({ staff: staff });
        return profile;
      }),
    );

    const profileRepo = dataSource.getRepository(Profile);
    await profileRepo.save(profiles);
  }
}
