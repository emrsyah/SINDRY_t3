import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const transactionRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.transactions.findMany({
      include: {
        outlets: {
          select: {
            name: true,
          },
        },
        customers: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }),
  getLast: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.transactions.findMany({
        orderBy: {
          created_at: "desc",
        },
        take: input.limit,
        include: {
          outlets: {
            select: {
              name: true
            }
          }
        }
      });
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.transactions.findUnique({
        where: {
          id: input.id,
        },
        include: {
          outlets: {
            select: {
              name: true,
            },
          },
          customers: {
            select: {
              name: true,
              address: true,
              contact: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          transaction_details: {
            include: {
              products: {
                select: {
                  price: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    }),
  getByIdComplete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.transactions.findUnique({
        where: {
          id: input.id,
        },
        include: {
          outlets: {
            include: {
              customers: true,
              products: true,
            },
          },
          customers: {
            select: {
              name: true,
              address: true,
              contact: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          transaction_details: {
            include: {
              products: true,
            },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        customer_id: z.number(),
        total: z.number(),
        sub_total: z.number(),
        cashier_id: z.string(),
        invoice_code: z.string(),
        outlet_id: z.number(),
        additional_cost: z.number(),
        discount: z.number(),
        taxes: z.number(),
        status: z.enum(["new", "on_process", "finished", "picked_up"]),
        is_paid: z.boolean(),
        transaction_details: z
          .object({
            product_id: z.number(),
            quantity: z.number(),
            description: z.string(),
          })
          .array(),
      })
    )
    .mutation(({ ctx, input }) => {
      const now = new Date();
      return ctx.prisma.transactions.create({
        data: {
          customer_id: input.customer_id,
          total: input.total,
          sub_total: input.sub_total,
          cashier_id: input.cashier_id,
          invoice_code: input.invoice_code,
          outlet_id: input.outlet_id,
          additional_cost: input.additional_cost,
          discount: input.discount,
          taxes: input.taxes,
          status: input.status,
          is_paid: input.is_paid,
          deadline: now,
          paid_at: now,
          transaction_details: {
            createMany: {
              data: input.transaction_details,
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        customer_id: z.number(),
        total: z.number(),
        sub_total: z.number(),
        cashier_id: z.string(),
        additional_cost: z.number(),
        discount: z.number(),
        taxes: z.number(),
        status: z.enum(["new", "on_process", "finished", "picked_up"]),
        is_paid: z.boolean(),
        transaction_details: z
          .object({
            product_id: z.number(),
            quantity: z.number(),
            description: z.string(),
          })
          .array(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.transactions.update({
        where: {
          id: input.id,
        },
        data: {
          customer_id: input.customer_id,
          total: input.total,
          sub_total: input.sub_total,
          cashier_id: input.cashier_id,
          additional_cost: input.additional_cost,
          discount: input.discount,
          taxes: input.taxes,
          status: input.status,
          is_paid: input.is_paid,
          transaction_details: {
            deleteMany: {
              transaction_id: input.id,
            },
            createMany: {
              data: input.transaction_details,
            },
          },
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
      return ctx.prisma.transactions.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getSalesStatistics: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.transactions.aggregate({
      _sum: {
        total: true,
      },
      _avg: {
        total: true,
      },
      _count: true,
    });
  }),
});
