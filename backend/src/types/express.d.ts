import { User } from '../generated/client/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
