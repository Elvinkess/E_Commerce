CREATE TABLE "public"."product" (
     id SERIAL PRIMARY KEY,
    "inventory_id" int4 NOT NULL,
    "category_id" int4 NOT NULL,
    "name" varchar NOT NULL,
    "price" int4 NOT NULL,
    "image_url" text
    
)
