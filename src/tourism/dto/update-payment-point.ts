import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentPointDto } from './create-payment-point';

export class UpdatePaymentPointDto extends PartialType(
    CreatePaymentPointDto,
) {}
