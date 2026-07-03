import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_orders_status" ADD VALUE 'confirmed' BEFORE 'processing';
  ALTER TYPE "public"."enum_orders_status" ADD VALUE 'completed' BEFORE 'cancelled';
  ALTER TABLE "products_variants" ADD COLUMN "low_stock_threshold" numeric;
  ALTER TABLE "orders" ADD COLUMN "status_change_note" varchar;
  CREATE UNIQUE INDEX "notification_user_idx" ON "notifications_reads" USING btree ("notification_id","user_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'::text;
  DROP TYPE "public"."enum_orders_status";
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'processing', 'ready', 'delivered', 'cancelled', 'refunded');
  ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."enum_orders_status";
  ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE "public"."enum_orders_status" USING "status"::"public"."enum_orders_status";
  DROP INDEX "notification_user_idx";
  ALTER TABLE "products_variants" DROP COLUMN "low_stock_threshold";
  ALTER TABLE "orders" DROP COLUMN "status_change_note";`)
}
