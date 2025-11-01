import type { IAppointmentRepository } from "../repositories/DTOappointment";

interface GetOccupiedTimesRequest {
  date: string; // formato YYYY-MM-DD
  barbeiro_id: number;
}

interface GetOccupiedTimesResponse {
  occupiedTimes: string[]; // array de horários no formato HH:MM
}

export class GetOccupiedTimesUseCase {
  constructor(private appointmentsRepository: IAppointmentRepository) {}

  async execute({ date, barbeiro_id }: GetOccupiedTimesRequest): Promise<GetOccupiedTimesResponse> {
    const dateObj = new Date(date + 'T00:00:00');
    
    const occupiedDateTimes = await this.appointmentsRepository.getOccupiedTimes(
      dateObj,
      barbeiro_id
    );

    // Converter para formato HH:MM
    const occupiedTimes = occupiedDateTimes.map(dt => {
      const hours = String(dt.getHours()).padStart(2, '0');
      const minutes = String(dt.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    });

    return { occupiedTimes };
  }
}
