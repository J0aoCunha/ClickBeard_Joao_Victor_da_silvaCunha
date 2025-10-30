export class BarberValidations {
  static validateAge(age: number): boolean {
    if (age < 18) {
      throw new Error('Barbeiro deve ter no mínimo 18 anos');
    }
    return true;
  }

  static validateName(name: string): boolean {
    if (name.trim().length < 3) {
      throw new Error('Nome do barbeiro deve ter no mínimo 3 caracteres');
    }
    return true;
  }
}