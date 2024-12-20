import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { NotificationTranslation } from 'src/entities/notificationTranslation.entity';
import { Notification } from 'src/entities/notification.entity';
import { UserService } from 'src/user/user.service';
import { Animal } from 'src/entities/animal.entity';
import { TranslationService } from 'src/translation/translation.service';
import { Request } from 'src/entities/request.entity';
import { Report } from 'src/entities/report.entity';
import { Appointment } from 'src/entities/appointment.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(NotificationTranslation)
    private translationRepo: Repository<NotificationTranslation>,
    @InjectRepository(Animal) private animalRepo: Repository<Animal>,
    private userService: UserService,
    private translationService: TranslationService,
    @InjectRepository(Request) private requestRepo: Repository<Request>,
    @InjectRepository(Report) private reportRepo: Repository<Report>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto, id: number) {
    let animal, report, request, appointment;

    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    if (createNotificationDto.animalId) {
      animal = await this.animalRepo.findOne({
        where: { id: createNotificationDto.animalId },
      });

      if (!animal) throw new NotFoundException('Animal not found');
    } else if (createNotificationDto.reportId) {
      report = await this.reportRepo.findOne({
        where: { id: createNotificationDto.reportId },
      });

      if (!report) throw new NotFoundException('Report not found');
    } else if (createNotificationDto.requestId) {
      request = await this.requestRepo.findOne({
        where: { id: createNotificationDto.requestId },
      });

      if (!request) throw new NotFoundException('Request not found');

      if (!request) throw new NotFoundException('Request not found');
    } else if (createNotificationDto.appointmentId) {
      appointment = await this.appointmentRepo.findOne({
        where: { id: createNotificationDto.appointmentId },
      });

      if (!appointment) throw new NotFoundException('Appointment not found');
    }

    const notification = this.notificationRepo.create({
      body: createNotificationDto.body,
      language: createNotificationDto.language,
      user: user,
      animal: animal,
      report: report,
      request: request,
      appointment: appointment,
    });

    const savedNotification = await this.notificationRepo.save(notification);

    // Define target languages
    const allLanguages = ['EN', 'TR'];
    const sourceLang = createNotificationDto.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    // Create translations
    for (const targetLang of targetLanguages) {
      const translateBody = createNotificationDto.body
        ? await this.translationService.translateText(
            createNotificationDto.body,
            targetLang,
          )
        : null;
      const translatedTranslation = this.translationRepo.create({
        body: translateBody,
        language: targetLang,
        notification: savedNotification,
      });

      await this.translationRepo.save(translatedTranslation);

      return {
        message: 'The notification is created successfully',
        data: savedNotification,
      };
    }

    return 'This action adds a new notification';
  }

  async findAll() {
    const notifications = await this.notificationRepo.find({
      relations: [
        'user',
        'animal',
        'report',
        'request',
        'appointment',
        'translations',
      ],
    });

    return {
      message: 'All notifications have been fetched successfully',
      data: notifications,
    };
  }

  async findOne(userId: number) {
    const userNotifications = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['notifications', 'notifications.translations'],
    });

    if (!userNotifications)
      throw new NotFoundException(`The user #ID: ${userId} does not exist.`);

    return {
      message: 'The user notifications have been fetched successfully',
      data: userNotifications.notifications,
    };
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.notificationRepo.findOne({
      where: { id },
      relations: [
        'translations',
        'appointment',
        'request',
        'report',
        'animal',
        'user',
      ],
    });
    if (!notification)
      throw new NotFoundException(`Notification with ID: ${id} not found`);

    // Update the notification
    Object.assign(notification, updateNotificationDto);

    if (updateNotificationDto.body) {
      const allLanguages = ['EN', 'TR'];
      const sourceLang =
        updateNotificationDto.language || notification.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        let existingTranslation = notification.translations.find(
          (translation) => translation.language === targetLang,
        );

        const translatedBody = updateNotificationDto.body
          ? await this.translationService.translateText(
              updateNotificationDto.body,
              targetLang,
            )
          : existingTranslation.body;

        if (existingTranslation) {
          Object.assign(existingTranslation, { body: translatedBody });
        } else {
          const newTranslation = this.translationRepo.create({
            body: translatedBody,
            language: targetLang,
            notification: notification,
          });

          notification.translations.push(newTranslation);
        }

        await this.translationRepo.save(notification.translations);
      }
    }

    const updatedNotification = await this.notificationRepo.save(notification);

    return { message: 'The notification has been updated successfully' };
  }

  async remove(id: number) {
    const notification = await this.notificationRepo.findOne({
      where: { id },
      relations: [
        'translations',
        'appointment',
        'request',
        'report',
        'animal',
        'user',
      ],
    });

    if (!notification)
      throw new NotFoundException(`Notification with ID: ${id} not found`);

    // Remove associated translations
    if (notification.translations?.length > 0) {
      for (const translation of notification.translations) {
        await this.translationRepo.remove(translation);
      }
    }

    notification.appointment = null;
    notification.request = null;
    notification.report = null;
    notification.animal = null;
    notification.user = null;

    await this.notificationRepo.save(notification);

    await this.notificationRepo.remove(notification);

    return { message: 'The notification has been deleted successfully' };
  }
}
