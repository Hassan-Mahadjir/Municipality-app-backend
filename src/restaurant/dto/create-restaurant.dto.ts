export class CreateRestaurantDto {
    name: string;
    weekdays: boolean;
    weekends: boolean;
    phone: string;
    openWeekdays: string;
    closeWeekdays: string;
    openWeekends: string;
    closeWeekends: string;
    serviceId: bigint;
  }
  