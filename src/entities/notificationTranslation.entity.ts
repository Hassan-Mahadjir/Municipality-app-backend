import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from './notification.entity';

@Entity({ name: 'NOTIFICATION_TRANSLATION ' })
export class NotificationTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  language: string;

  //  relationship with notification
  @ManyToOne(() => Notification, (notification) => notification.translations)
  notification: Notification;
}
