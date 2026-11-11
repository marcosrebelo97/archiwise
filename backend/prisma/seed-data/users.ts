import { Prisma } from '@prisma/client';

export const users: Prisma.UserCreateManyInput[] = [
  {
    id: '1',
    name: 'admin',
    email: 'admin@archiwise.local',
    // Usuário só para desenvolvimento local; troque a senha fora do ambiente local
    password: '$2a$10$nDWDymxym6oJx.3mlTaUPe.SlabO5/UmuRv6JsihNaYKfDECFxhVS',
    createdAt: new Date(),
  }
];
