import { pgConfig } from '../../dbConfig';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { UserFactroy } from '../seeding/user.factory';
import { ComplaintFactroy } from '../seeding/complaint.factroy';
import { MainSeeder } from '../seeding/main.seeder';
import { UserProfileFactory } from './profile.factory';

const options: DataSourceOptions & SeederOptions = {
  ...pgConfig,
  factories: [UserFactroy, ComplaintFactroy, UserFactroy, UserProfileFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);
dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
