import { Profile } from '../entities/profile.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../entities/user.entity';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    //Generate 5 user recods
    console.log('seeding user ...');
    const userFactory = factoryManager.get(User);
    const users = await userFactory.saveMany(5);

    console.log('Seeding staff Profile ....');
    const profileFactory = factoryManager.get(Profile);

    // Create profiles and ensure each profile is assigned to a unique user
    const profileRepo = dataSource.getRepository(Profile);
    console.log('seeding user profiles');
    const Profiles = await Promise.all(
      users.map(async (user) => {
        const profile = await profileFactory.make({ user: user });
        return profile;
      }),
    );

    await profileRepo.save(Profiles);
  }
}
