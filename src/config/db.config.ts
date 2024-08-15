import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as path from 'path';
import { registerAs } from '@nestjs/config';
export default registerAs(
  'dbconfig.dev',
  (): PostgresConnectionOptions => ({
    url:
      process.env.DATABASE_URL ||
      'postgresql://evalugusta_owner:cH0qKVpMZF4W@ep-super-sound-a241nnav.eu-central-1.aws.neon.tech/evalugusta?sslmode=require',
    type: 'postgres',
    port: +process.env.DB_PORT,
    entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
);
