import type { JWTWithRole } from '@/types/auth';

const role = (token as JWTWithRole)?.role;
