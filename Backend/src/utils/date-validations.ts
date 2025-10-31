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
    
    // Criar datas sem milissegundos para comparação justa (usando valores locais)
    const dateLocal = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      0,
      0
    );
    
    const nowLocal = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      0,
      0
    );
    
    // Permitir agendar com pelo menos 1 minuto de diferença da data atual
    const umMinutoEmMs = 60 * 1000;
    
    if (dateLocal.getTime() <= (nowLocal.getTime() + umMinutoEmMs)) {
      throw new Error('Não é possível agendar para uma data passada. Use uma data e hora futura.');
    }
    return true;
  }
}