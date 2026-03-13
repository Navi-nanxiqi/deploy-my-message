import { createHash } from 'node:crypto';
import * as bcrypt from 'bcrypt';

// hash 加密
export const generateUniqueId = async (data) => {
    return createHash("sha256").update(data).digest("hex")
}