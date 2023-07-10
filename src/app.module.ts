import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Student } from './Database/student.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'test db',
      entities: [Student],
      synchronize: true,
    }),
    StudentModule,
  ],
  exports: [TypeOrmModule],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
