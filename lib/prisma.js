const { PrismaClient } = require('@prisma/client');

function ensureIncludeForLastGen(args) {
  const lastGenInclude = {
    attaques_generations: {
      orderBy: { generation_id: 'desc' }, // ou { generations: { number: 'desc' } }
      take: 1,
      include: { types: true },
    },
  };

  if (args?.include) {
    args.include = { ...args.include, ...lastGenInclude };
  } else if (args?.select) {
    args.select = { ...args.select, ...lastGenInclude };
  } else {
    args.include = lastGenInclude;
  }
  return args;
}

const base = new PrismaClient();

const prismaExtended = base.$extends({
  result: {
    attaques: {
      last_type: {
        needs: {},
        compute(attaque) {
          const ag = attaque.attaques_generations?.[0];
          return ag?.types?.name ?? null;
        },
      },
    },
  },
  query: {
    attaques: {
      async findMany({ args, query }) {
        args = ensureIncludeForLastGen(args);
        return query(args);
      },
      async findFirst({ args, query }) {
        args = ensureIncludeForLastGen(args);
        return query(args);
      },
      async findUnique({ args, query }) {
        args = ensureIncludeForLastGen(args);
        return query(args);
      },
    },
  },
});

const globalForPrisma = globalThis;
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
