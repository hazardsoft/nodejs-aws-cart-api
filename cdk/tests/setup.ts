import { vi } from 'vitest'

vi.stubEnv('CDK_DEFAULT_ACCOUNT', '999999999999')
vi.stubEnv('CDK_DEFAULT_REGION', 'region')
vi.stubEnv('DATABASE_USERNAME', 'testUser')
vi.stubEnv('DATABASE_PASSWORD', 'password')
