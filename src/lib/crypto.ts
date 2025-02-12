import bcryptjs from 'bcryptjs';

export const bcrypt = {
  /**
   * 加密密码
   * @param password 原始密码
   * @returns 加密后的密码
   */
  async hash(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  },

  /**
   * 验证密码
   * @param password 原始密码
   * @param hash 加密后的密码
   * @returns 是否匹配
   */
  async compare(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }
};