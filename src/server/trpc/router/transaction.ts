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
          transaction_details : {
            include : {
                products : {
                    select : {
                        price: true,
                        name: true
                    }
                }
            }
          }
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
        status: z.enum(["new" , "on_process" , "finished" , "picked_up"]),
        is_paid: z.boolean(),
        transaction_details: z.object({
            product_id: z.number(),
            quantity: z.number(),
            description: z.string()
        }).array()
      })
    )
    .mutation(({ ctx, input }) => {
      const now = new Date()
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
          transaction_details : {
            createMany : {
              data: input.transaction_details
            }
          }
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
      return ctx.prisma.transactions.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
