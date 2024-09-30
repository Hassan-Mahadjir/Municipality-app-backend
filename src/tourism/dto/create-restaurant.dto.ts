export class CreateRestaurantDto {
    id: number;
    name: string;
    weekdays: boolean;
    weekends: boolean;
    phone: string;
    openWeekdays: string;
    closeWeekdays: string;
    openWeekends: string;
    closeWeekends: string;
  }
  