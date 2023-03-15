import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const productRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.products.findMany({
      include: {
        outlets: true,
      },
    });
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.products.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getByOutlet: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.products.findMany({
        where: {
          outlet_id: input.id,
        },
      });
    }),
  getMostSold: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.products.findMany({
      orderBy: {
        sold: "desc",
      },
      take: 5,
      include: {
        outlets: {
          select: {
            name: true,
          },
        },
      },
    });
  }),
  getMostSoldByOutlet: protectedProcedure.input(z.object({
    outlet_id: z.number()
  })).query(({ ctx, input }) => {
    return ctx.prisma.products.findMany({
      orderBy: {
        sold: "desc",
      },
      where: {
        outlet_id: input.outlet_id
      },
      take: 5,
      include: {
        outlets: {
          select: {
            name: true,
          },
        },
      },
    });
  }),
  getGroupByCategory: protectedProcedure.query(({ctx}) =>{
    return ctx.prisma.products.groupBy({
      by: ["type"],
      _sum: {
        sold: true,
      },
      orderBy: {
        _sum: {
          sold: "desc"
        }
      }
    })
  }),
  getGroupByCategoryPerOutlet: protectedProcedure.input(z.object({
    outlet_id: z.number()
  })).query(({ctx, input}) =>{
    return ctx.prisma.products.groupBy({
      where: {
        outlet_id: input.outlet_id
      },
      by: ["type"],
      _sum: {
        sold: true,
      },
      orderBy: {
        _sum: {
          sold: "desc"
        }
      }
    })
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        type: z.enum(["kiloan", "selimut", "kaos", "bed_cover", "lainnya"]),
        outlet_id: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.products.create({
        data: {
          name: input.name,
          price: input.price,
          type: input.type,
          outlet_id: input.outlet_id,
          sold: 0,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        price: z.number(),
        type: z.enum(["kiloan", "selimut", "kaos", "bed_cover", "lainnya"]),
        outlet_id: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.products.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          price: input.price,
          type: input.type,
          outlet_id: input.outlet_id,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.products.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
