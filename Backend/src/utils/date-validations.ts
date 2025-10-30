export class DateValidations {
  static validateBusinessHours(dateTime: Date): boolean {
    const hour = dateTime.getHours();
    const dayOfWeek = dateTime.getDay();
    
    // Verifica se é fim de semana
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      throw new Error('Não é possível agendar em fins de semana');
    }
    
    // Verifica horário comercial
    if (hour < 9 || hour >= 18) {
      throw new Error('Horário fora do período de funcionamento (9h às 18h)');
    }
    
    return true;
  }

  static validateFutureDate(date: Date): boolean {
    const now = new Date();
    if (date < now) {
      throw new Error('Não é possível agendar para uma data passada');
    }
    return true;
  }
}