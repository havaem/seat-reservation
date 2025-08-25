class Environment {
  env = process.env;

  MONGODB_URI = this.getString("MONGODB_URI");
  HOLD_TTL_MIN = parseInt(this.getString("HOLD_TTL_MIN") || "30");
  ORDER_TTL_MIN = parseInt(this.getString("ORDER_TTL_MIN") || "30");
  BANK_ACC_NAME = this.getString("BANK_ACC_NAME");
  BANK_ACC_NUMBER = this.getString("BANK_ACC_NUMBER");
  BANK_NAME = this.getString("BANK_NAME");
  JWT_SECRET = this.getString("JWT_SECRET");
  ADMIN_USERNAME = this.getString("ADMIN_USERNAME");
  ADMIN_PASSWORD = this.getString("ADMIN_PASSWORD");
  CRON_SECRET = this.getString("CRON_SECRET");

  // private getBoolean(key: string): boolean {
  //   const value = this.get(key);

  //   try {
  //     return Boolean(JSON.parse(value));
  //   } catch {
  //     throw new Error(key + ' env var is not a boolean');
  //   }
  // }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, "\n");
  }

  private get(key: string): string {
    const value = this.env[key];

    if (!value) {
      throw new Error(key + " environment variable does not set");
    }

    return value;
  }
}
export const ENV = new Environment();
