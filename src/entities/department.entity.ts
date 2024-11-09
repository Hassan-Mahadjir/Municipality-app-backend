import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Pharmacy } from './pharmacy.entity';
import { Hospital } from './hospitals.entity';
import { CollectedVehicle } from './collected-vehicle.entity';
import { Line } from './line.entity';
import { DisasterPoint } from './disaster-point.entity';
import { Availability } from './availability.entity';
import { Request } from './request.entity';
import { Report } from './report.entity';
import { Restaurant } from './restaurant.entity';
import { HistoricalPlace } from './historical-place.entity';
import { Announcement } from './annoucemnet.entity';
import { EmergencyContact } from './emergency-contact.entity';
import { WasteType } from './waste-type.entity';
import { Animal } from './animal.entity';
import { AnimalShelter } from './shelter.entity';

@Entity({ name: 'DEPARTMENT' })
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  phone: string;

  //  Relationship with USER
  @OneToOne(() => User, (user) => user.department)
  @JoinColumn({ name: 'responsible' })
  responsible: User;

  // Relationship with PHARAMCY
  @OneToMany(() => Pharmacy, (pharmacy) => pharmacy.department)
  pharmacies: Pharmacy[];

  // Relationship with HOSPITAL
  @OneToMany(() => Hospital, (hospital) => hospital.department)
  hospitals: Hospital[];

  // Relationship with COLLECTED-VEHICLE
  @OneToMany(() => CollectedVehicle, (vehicle) => vehicle.departmnet)
  collectedVehicles: CollectedVehicle[];

  // Relationship with LINE
  @OneToMany(() => Line, (line) => line.department)
  lines: Line[];

  // Relationship with DISASTER POINT
  @OneToMany(() => DisasterPoint, (disasterPoint) => disasterPoint.department)
  disasterPoints: DisasterPoint[];

  // Relationship with AVAILABLIITY
  @OneToMany(() => Availability, (availability) => availability.department)
  availabilities: Availability[];

  // Relationship with REQUEST
  @OneToMany(() => Request, (request) => request.department)
  requests: Request[];

  // Relationship with REPORT
  @OneToMany(() => Report, (report) => report.department)
  reports: Report[];

  // Relationship with RESTAURANT
  @OneToMany(() => Restaurant, (restaurant) => restaurant.department)
  restaurants: Restaurant[];

  // Relationship with HISTORICAL-PLACE
  @OneToMany(() => HistoricalPlace, (place) => place.department)
  historicalPlaces: HistoricalPlace[];

  // Relationship with ANNOUNCEMNET
  @OneToMany(() => Announcement, (announcement) => announcement.department)
  annoucenments: Announcement[];

  // Relationship with EMERGENCY
  @OneToMany(
    () => EmergencyContact,
    (emergencyContact) => emergencyContact.department,
  )
  emergencyContacts: EmergencyContact[];

  // Relationship with WASTE TYPE
  @OneToMany(() => WasteType, (wasteType) => wasteType.department)
  wasteTypes: WasteType[];

  // Relationship with ANIMAL
  @OneToMany(() => Animal, (animal) => animal.department)
  animals: Animal[];

  // Relationship with ANIMAL SHELTER
  @OneToMany(() => AnimalShelter, (shelter) => shelter.department)
  animalShelters: AnimalShelter[];
}
