import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'src/entities/request.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { DepartmentService } from 'src/department/department.service';
import { User } from 'src/entities/user.entity';
import { ImageService } from 'src/image/image.service';
import { TranslationService } from 'src/translation/translation.service';
import { RequestTranslation } from 'src/entities/requestTranslation.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request) private requestRepo: Repository<Request>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private userService: UserService,
    private departmentService: DepartmentService,
    private imageService: ImageService,
    private translationService: TranslationService,
    @InjectRepository(RequestTranslation)
    private translationRepo: Repository<RequestTranslation>,
  ) {}

  async create(createRequestDto: CreateRequestDto, userId: number) {
    // Fetch the user
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(
        `The user with #ID: ${userId} does not exist.`,
      );
    }

    // Fetch the department by name (supports translations)
    const department = await this.departmentService.findDepartmentbyName(
      createRequestDto.departmentName,
    );
    if (!department) {
      throw new NotFoundException(
        `The department ${createRequestDto.departmentName} does not exist.`,
      );
    }

    // Process images
    const images = [];
    for (const imageUrl of createRequestDto.imageUrls) {
      const image = await this.imageService.create(imageUrl);
      if (image) images.push(image);
    }

    // Translate the default status into the request's language
    const translatedStatus = await this.translationService.translateText(
      'On hold',
      createRequestDto.language,
    );

    // Create the original request
    const newRequest = this.requestRepo.create({
      subject: createRequestDto.subject,
      message: createRequestDto.message,
      images: images,
      latitude: createRequestDto.latitude,
      longitude: createRequestDto.longitude,
      language: createRequestDto.language,
      department: department,
      status: translatedStatus || 'On hold',
      user: user,
    });
    const savedRequest = await this.requestRepo.save(newRequest);

    // Define target languages
    const allLanguages = ['EN', 'TR'];
    const sourceLang = createRequestDto.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    // Create translations for target languages
    for (const targetLang of targetLanguages) {
      const translatedSubject = createRequestDto.subject
        ? await this.translationService.translateText(
            createRequestDto.subject,
            targetLang,
          )
        : null;

      const translatedMessage = createRequestDto.message
        ? await this.translationService.translateText(
            createRequestDto.message,
            targetLang,
          )
        : null;

      const targetStatus = await this.translationService.translateText(
        'On hold',
        targetLang,
      );

      const translatedTranslation = this.translationRepo.create({
        subject: translatedSubject || 'Translation unavailable',
        message: translatedMessage || 'Translation unavailable',
        status: targetStatus || translatedStatus || 'On hold',
        language: targetLang,
        request: savedRequest,
      });

      await this.translationRepo.save(translatedTranslation);
    }

    return {
      message: 'requests has been created successfully.',
      data: savedRequest,
    };
  }

  async findAll() {
    const requests = await this.requestRepo.find({
      relations: ['user', 'department', 'images', 'translations'],
    });
    return {
      message: `Successfully fetched ${requests.length} requests`,
      data: requests,
    };
  }

  async findUserRequests(userId: number) {
    const userRequests = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['requests', 'requests.images', 'requests.translations'],
    });
    if (!userRequests)
      throw new NotFoundException(`The user #ID: ${userId} does not exist.`);

    return {
      message: 'Request has been fetched successfully',
      data: userRequests,
    };
  }

  async findOne(id: number) {
    const requestInfo = await this.requestRepo.findOne({
      where: { id: id },
      relations: [
        'user',
        'department',
        'user.profile',
        'images',
        'translations',
      ],
    });

    if (!requestInfo)
      throw new NotFoundException(
        `The request with #ID: ${id} does not exist.`,
      );
    return {
      message: 'Request has been fetched successfully',
      data: requestInfo,
    };
  }

  async update(id: number, updateRequestDto: UpdateRequestDto) {
    // Find the request along with its translations and related entities
    const request = await this.requestRepo.findOne({
      where: { id },
      relations: ['translations', 'department', 'images'],
    });

    if (!request) {
      throw new NotFoundException(
        `The request with #ID: ${id} does not exist.`,
      );
    }

    // Update request fields
    Object.assign(request, updateRequestDto);

    // Handle images
    if (updateRequestDto.imageUrls) {
      const existingImageIds = request.images.map((image) => image.id);

      if (existingImageIds.length > 0) {
        await this.imageService.deleteImages(existingImageIds);
      }

      request.images = [];
      for (const imageUrl of updateRequestDto.imageUrls) {
        const image = await this.imageService.create(imageUrl);
        if (image) {
          request.images.push(image);
        }
      }
    }

    // Handle translations
    if (
      updateRequestDto.subject ||
      updateRequestDto.message ||
      updateRequestDto.status
    ) {
      // Define target languages
      const allLanguages = ['EN', 'TR'];
      const sourceLang = updateRequestDto.language || request.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        let existingTranslation = request.translations.find(
          (translation) => translation.language === targetLang,
        );

        // Translate fields if provided in the update DTO
        const translatedSubject = updateRequestDto.subject
          ? await this.translationService.translateText(
              updateRequestDto.subject,
              targetLang,
            )
          : existingTranslation?.subject;
        const translatedMessage = updateRequestDto.message
          ? await this.translationService.translateText(
              updateRequestDto.message,
              targetLang,
            )
          : existingTranslation?.message;
        const translatedStatus = updateRequestDto.status
          ? await this.translationService.translateText(
              updateRequestDto.status,
              targetLang,
            )
          : existingTranslation?.status;

        if (existingTranslation) {
          // Update the existing translation
          Object.assign(existingTranslation, {
            subject: translatedSubject,
            status: translatedStatus,
            message: translatedMessage,
          });
        } else {
          // Create a new translation if it doesn't exist
          existingTranslation = this.translationRepo.create({
            subject: translatedSubject || 'Translation unavailable',
            status: translatedStatus || 'Translation unavailable',
            message: translatedMessage || 'Translation unavailable',
            language: targetLang,
            request: request,
          });
          request.translations.push(existingTranslation);
        }

        // Save the translation (whether updated or newly created)
        await this.translationRepo.save(existingTranslation);
      }
    }

    // Save the updated request
    const updatedRequest = await this.requestRepo.save(request);

    return { message: `The request with #ID: ${id} has been updated.` };
  }

  async remove(id: number) {
    // Find the request by ID and include its relations
    const request = await this.requestRepo.findOne({
      where: { id },
      relations: ['user', 'department', 'images', 'translations'],
    });

    // If the request does not exist, throw an error
    if (!request) {
      throw new NotFoundException(`The request with ID #${id} does not exist.`);
    }

    // Remove associated images
    if (request.images?.length > 0) {
      const imageIds = request.images.map((image) => image.id);
      await this.imageService.deleteImages(imageIds);
    }

    // Remove associated translations
    if (request.translations?.length > 0) {
      for (const translation of request.translations) {
        await this.translationRepo.remove(translation);
      }
    }

    // Remove associations with user and department
    request.user = null;
    request.department = null;

    // Save changes to clear associations
    await this.requestRepo.save(request);

    // Finally, remove the request itself
    await this.requestRepo.remove(request);

    return {
      message: `The request with ID #${id} has been successfully removed.`,
    };
  }
}
