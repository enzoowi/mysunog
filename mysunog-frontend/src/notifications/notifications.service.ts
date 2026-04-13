import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../users/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async createNotification(user: User, title: string, message: string) {
    const notification = this.notificationsRepository.create({
      user,
      title,
      message,
      isRead: false,
    });

    return this.notificationsRepository.save(notification);
  }

  async getMyNotifications(userId: number) {
    return this.notificationsRepository.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async markAsRead(notificationId: number, userId: number) {
    const notification = await this.notificationsRepository.findOne({
      where: {
        id: notificationId,
        user: { id: userId },
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;
    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: number) {
    const notifications = await this.notificationsRepository.find({
      where: {
        user: { id: userId },
        isRead: false,
      },
    });

    for (const notification of notifications) {
      notification.isRead = true;
    }

    return this.notificationsRepository.save(notifications);
  }

  async getUnreadCount(userId: number) {
    return this.notificationsRepository.count({
      where: {
        user: { id: userId },
        isRead: false,
      },
    });
  }
}
