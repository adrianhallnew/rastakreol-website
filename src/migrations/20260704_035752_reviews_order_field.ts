import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reviews" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "reviews" ADD COLUMN "order_id" integer NOT NULL;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "reviews_order_idx" ON "reviews" USING btree ("order_id");
  CREATE UNIQUE INDEX "product_order_idx" ON "reviews" USING btree ("product_id","order_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reviews" DROP CONSTRAINT "reviews_order_id_orders_id_fk";
  
  DROP INDEX "reviews_order_idx";
  DROP INDEX "product_order_idx";
  ALTER TABLE "reviews" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "reviews" DROP COLUMN "order_id";`)
}
