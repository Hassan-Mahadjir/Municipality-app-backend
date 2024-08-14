import dbConfig from '../config/db.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { StaffFactory } from '../seeding/staff.factory';
import { ProfileFactory } from '../seeding/profile.factroy';
import { MainSeeder } from './main.seeder';
import { UserFactory } from './user.factory';

const options: DataSourceOptions & SeederOptions = {
  ...dbConfig(),
  factories: [StaffFactory, ProfileFactory, UserFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);
dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
