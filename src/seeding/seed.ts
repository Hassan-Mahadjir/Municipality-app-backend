import { pgConfig } from '../../dbConfig';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { StaffFactory } from '../seeding/staff.factory';
import { ProfileFactory } from '../seeding/profile.factroy';
import { MainSeeder } from './main.seeder';

const options: DataSourceOptions & SeederOptions = {
  ...pgConfig,
  factories: [StaffFactory, ProfileFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);
dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
