import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreateSlotDto } from './dto/create-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Availability } from 'src/entities/availability.entity';
import { Repository } from 'typeorm';
import { AvailabilityDay } from 'src/entities/availability-day.entity';
import { DepartmentService } from 'src/department/department.service';
import { UserService } from 'src/user/user.service';
import { Appointment } from 'src/entities/appointment.entity';
import { AnnouncementTranslation } from 'src/entities/announcementTranslation.entity';
import { TranslationService } from 'src/translation/translation.service';
import { AppointmentTranslation } from 'src/entities/appointmentTranslation.entity';
import { AvailabilityDayTranslation } from 'src/entities/availability-dayTranslation.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepo: Repository<Availability>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(AvailabilityDay)
    private dayRepo: Repository<AvailabilityDay>,
    private departmentService: DepartmentService,
    private userService: UserService,
    @InjectRepository(AppointmentTranslation)
    private translationRepo: Repository<AppointmentTranslation>,
    private translationService: TranslationService,
    @InjectRepository(AvailabilityDayTranslation)
    private availableDayTranslationRepo: Repository<AvailabilityDayTranslation>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: number) {
    const { date, startTime, purpose, appointmentWith, language } =
      createAppointmentDto;

    // Check if the user exists
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID #${userId} does not exist.`);
    }

    // Check if the user already has an appointment on the given date
    const existingAppointment = await this.appointmentRepo.findOne({
      where: {
        user: { id: userId },
        availability: { day: { date } },
      },
      relations: ['availability', 'availability.day'],
    });

    if (existingAppointment) {
      throw new ConflictException(
        'You already have an appointment booked on this date.',
      );
    }

    // Check if the availability exists for the given date and startTime and if it's unbooked
    const availableSlot = await this.availabilityRepo.findOne({
      where: { day: { date }, startTime, appointment: null },
      relations: ['day'],
    });

    if (!availableSlot) {
      throw new ConflictException(
        'The selected time slot is already booked or unavailable.',
      );
    }

    // Translate the default status into the report's language
    const translatedStatus = await this.translationService.translateText(
      'On hold',
      language,
    );

    // Create a new appointment and associate it with the available slot
    const newAppointment = this.appointmentRepo.create({
      purpose,
      appointmentWith,
      user,
      status: translatedStatus || 'On hold',
      availability: availableSlot,
      language: language,
    });

    // Save the new appointment in the database
    const savedAppointmnet = await this.appointmentRepo.save(newAppointment);

    const allLanguages = ['EN', 'TR']; // Example: English, Turkish
    const sourceLang = language; // Original language
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    for (const targetLang of targetLanguages) {
      const translatedPurpose = purpose
        ? await this.translationService.translateText(purpose, targetLang)
        : null;
      const translatedAppointmentWith = appointmentWith
        ? await this.translationService.translateText(
            appointmentWith,
            targetLang,
          )
        : null;

      const targetStatus = await this.translationService.translateText(
        'On hold',
        targetLang,
      );

      const translatedTranslation = this.translationRepo.create({
        purpose: translatedPurpose,
        appointmentWith: translatedAppointmentWith,
        status: targetStatus,
        language: targetLang,
        appointment: savedAppointmnet,
      });

      await this.translationRepo.save(translatedTranslation);
    }
    return {
      message: 'Appointment has been created successfully.',
      data: savedAppointmnet,
    };
  }

  async createSlot(createSlotDto: CreateSlotDto) {
    const { date, numberOfSlots, startingTimes, duration, departmentName } =
      createSlotDto;

    // Check if the department exists
    const department =
      await this.departmentService.findDepartmentbyName(departmentName);
    if (!department) {
      throw new NotFoundException(
        `Department with name ${departmentName} does not exist.`,
      );
    }

    // Find or create the AvailabilityDay for the given date
    let availabilityDay = await this.dayRepo.findOne({ where: { date } });
    if (!availabilityDay) {
      const dayOfWeek = new Date(date).toLocaleString('en-US', {
        weekday: 'long',
      });
      availabilityDay = this.dayRepo.create({
        date,
        day: dayOfWeek,
        language: createSlotDto.language,
      });
      availabilityDay = await this.dayRepo.save(availabilityDay);

      // Define target languages
      const allLanguages = ['EN', 'TR'];
      const sourceLang = createSlotDto.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        const translatedDay = dayOfWeek
          ? await this.translationService.translateText(dayOfWeek, targetLang)
          : null;

        const translatedAvailableDay = this.availableDayTranslationRepo.create({
          day: translatedDay,
          language: targetLang,
          availableDay: availabilityDay,
        });

        await this.availableDayTranslationRepo.save(translatedAvailableDay);
      }
    }

    // Check for existing slots in the database
    const existingSlots = await this.availabilityRepo.find({
      where: { day: availabilityDay, department },
    });

    const existingStartTimes = new Set(
      existingSlots.map((slot) => slot.startTime),
    );

    const slots = [];
    for (let i = 0; i < numberOfSlots; i++) {
      const startTime = startingTimes[i];
      if (!startTime) break;

      // Skip if the start time already exists
      if (existingStartTimes.has(startTime)) continue;

      const [startHour, startMinutes] = startTime.split(':').map(Number);
      const endHour = startHour + Math.floor((startMinutes + duration) / 60);
      const endMinutes = (startMinutes + duration) % 60;
      const endTime = `${endHour
        .toString()
        .padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

      const slot = this.availabilityRepo.create({
        startTime,
        endTime,
        day: availabilityDay,
        department,
      });
      slots.push(slot);
    }

    // Save only new slots
    const savedSlots = await this.availabilityRepo.save(slots);

    return {
      message: 'Slots have been created successfully',
      data: savedSlots,
    };
  }

  async getSlots() {
    const slots = await this.dayRepo
      .createQueryBuilder('day')
      .leftJoinAndSelect('day.availabilities', 'availability')
      .leftJoinAndSelect('day.translations', 'translation')
      .leftJoin('availability.appointment', 'appointment') // Join the appointment relation
      .where('appointment.id IS NULL') // Check if no appointment exists
      .getMany();

    // Filter out days with no available slots
    const filteredSlots = slots.filter((day) => day.availabilities.length > 0);

    return {
      message: `Successfully fetched ${filteredSlots.length} available days`,
      data: filteredSlots,
    };
  }

  async findAll() {
    const appointments = await this.appointmentRepo.find({
      relations: [
        'availability',
        'availability.day',
        'user.profile',
        'availability.day.translations',
        'translations',
      ],
    });
    return {
      message: `Successfully fetch ${appointments.length} appointments`,
      data: appointments,
    };
  }

  async findOne(id: number) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: id },
      relations: [
        'availability',
        'availability.day',
        'user.profile',
        'translations',
        'availability.day.translations',
      ],
    });
    if (!appointment)
      throw new NotFoundException(
        `The appointment with #ID:${id} does not exits.`,
      );
    return {
      message: `Appointment has been fetched successfully`,
      data: appointment,
    };
  }

  async getUserAppointments(userId: number) {
    try {
      // Fetch user appointments with required relations
      const userAppointments = await this.appointmentRepo.find({
        relations: [
          'user.profile',
          'translations',
          'availability',
          'availability.day.translations',
        ],
        where: { user: { id: userId } },
        order: { id: 'DESC' }, // Optional: Order appointments by latest first
      });

      if (!userAppointments.length) {
        return {
          message: `No appointments found for user with ID ${userId}`,
          data: [],
        };
      }

      // Format the response to include the day object with translations
      const formattedAppointments = userAppointments.map((appointment) => ({
        id: appointment.id,
        purpose: appointment.purpose,
        status: appointment.status,
        appointmentWith: appointment.appointmentWith,
        language: appointment.language,
        startTime: appointment.availability?.startTime ?? null,
        endTime: appointment.availability?.endTime ?? null,
        translations: appointment.translations,
        day: appointment.availability?.day
          ? {
              id: appointment.availability.day.id,
              date: appointment.availability.day.date,
              day: appointment.availability.day.day,
              language: appointment.availability.day.language,
              translations: appointment.availability.day.translations ?? [],
            }
          : null, // Handle case where day might not exist
      }));

      return {
        message: `Appointments have been fetched successfully`,
        data: formattedAppointments,
      };
    } catch (error) {
      // Handle any unexpected errors
      throw new Error(
        `Failed to fetch appointments for user with ID ${userId}: ${error.message}`,
      );
    }
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    // Fetch the appointment to update, including related entities
    const appointment = await this.appointmentRepo.findOne({
      where: { id: id },
      relations: [
        'availability',
        'availability.day',
        'user.profile',
        'translations',
      ],
    });

    // If the appointment does not exist, throw an exception
    if (!appointment)
      throw new NotFoundException(
        `The appointment with #ID:${id} does not exist.`,
      );

    // Update the appointment with the provided DTO
    Object.assign(appointment, updateAppointmentDto);

    // Check if translation fields (status, purpose, appointmentWith) are updated
    if (
      updateAppointmentDto.status ||
      updateAppointmentDto.purpose ||
      updateAppointmentDto.appointmentWith
    ) {
      const allLanguages = ['EN', 'TR']; // Example: English, Turkish
      const sourceLang = updateAppointmentDto.language; // Original language (from the appointment)
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        // Ensure that translated fields are not null
        let existingTranslation = appointment.translations.find(
          (translation) => translation.language === targetLang,
        );
        const translatedPurpose = updateAppointmentDto.purpose
          ? await this.translationService.translateText(
              updateAppointmentDto.purpose,
              targetLang,
            )
          : existingTranslation.purpose;

        const translatedAppointmentWith = updateAppointmentDto.appointmentWith
          ? await this.translationService.translateText(
              updateAppointmentDto.appointmentWith,
              targetLang,
            )
          : existingTranslation.appointmentWith;

        const translatedStatus = updateAppointmentDto.status
          ? await this.translationService.translateText(
              updateAppointmentDto.status,
              targetLang,
            )
          : existingTranslation.status;

        if (existingTranslation) {
          Object.assign(existingTranslation, {
            status: translatedStatus,
            appointmentWith: translatedAppointmentWith,
            purpose: translatedPurpose,
          });
        } else {
          // Create new translation if it does not exist
          existingTranslation = this.translationRepo.create({
            purpose: translatedPurpose || 'Translations unavailable',
            status: translatedStatus || 'Translations unavailable',
            appointmentWith:
              translatedAppointmentWith || 'Translations unavailable',
          });
          appointment.translations.push(existingTranslation);
        }

        await this.translationRepo.save(existingTranslation);
      }
    }

    // save teh updated appointment
    const updatedAppointment = await this.appointmentRepo.save(appointment);
    // Return a response with the updated appointment
    return {
      message: `Appointment with #${id} successfully updated`,
      data: updatedAppointment,
    };
  }

  async remove(id: number) {
    // Find the appointment by ID, including relations for availability, user, and translations
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['availability', 'translations', 'user'], // Include user in the query
    });

    // If the appointment does not exist, throw an exception
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID #${id} not found`);
    }

    // Clear the associated availability so the slot is reusable
    if (appointment.availability) {
      appointment.availability.appointment = null; // Break the relationship with the appointment
      await this.availabilityRepo.save(appointment.availability); // Save updated availability
    }

    // Clear the user association for the appointment
    if (appointment.user) {
      appointment.user = null; // Disassociate the user from the appointment
      await this.appointmentRepo.save(appointment); // Save updated appointment without the user
    }

    // Remove associated translations (if any exist)
    if (appointment.translations?.length > 0) {
      for (const translation of appointment.translations) {
        // Optionally, you can check if translations should be deleted based on certain conditions.
        await this.translationRepo.remove(translation); // Delete the translation
      }
    }

    // Delete the appointment itself
    await this.appointmentRepo.delete(id);

    // Optionally, you can add any additional clean-up or post-delete logic here

    return { message: `Appointment #${id} successfully removed` };
  }
}
