import { verify, hash } from '@node-rs/argon2';

async function hashPassword(password) {
  return hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1
  });
}
async function verifyPassword(hashValue, password) {
  return verify(hashValue, password);
}

export { hashPassword as h, verifyPassword as v };
