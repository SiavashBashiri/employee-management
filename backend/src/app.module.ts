import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './modules/employees/employees.module';
import { TagsModule } from './modules/tags/tags.module';
import { OfficesModule } from './modules/offices/offices.module';

@Module({
  imports: [EmployeesModule, TagsModule, OfficesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
