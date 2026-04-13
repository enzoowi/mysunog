import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PermitsModule } from './permits/permits.module';
import { NotificationsModule } from './notifications/notifications.module';
import { IncidentsModule } from './incidents/incidents.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { InspectionsModule } from './inspections/inspections.module';
import { AlertsModule } from './alerts/alerts.module';
import { EducationModule } from './education/education.module';
import { HazardsModule } from './hazards/hazards.module';
import { HotlinesModule } from './hotlines/hotlines.module';
import { ReportsModule } from './reports/reports.module';
import { SiteImagesModule } from './site-images/site-images.module';
import { MapAssetsModule } from './map-assets/map-assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    PermitsModule,
    NotificationsModule,
    IncidentsModule,
    ChatbotModule,
    InspectionsModule,
    AlertsModule,
    EducationModule,
    HazardsModule,
    HotlinesModule,
    ReportsModule,
    SiteImagesModule,
    MapAssetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

