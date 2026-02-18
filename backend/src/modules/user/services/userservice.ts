import { compare, hash } from "bcrypt";

export class PasswordHasher {
  constructor(private readonly saltRounds = 10) {}

  async hash(password: string): Promise<string> {
    return hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
