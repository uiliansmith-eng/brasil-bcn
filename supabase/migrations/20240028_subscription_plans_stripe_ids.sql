-- IDs de Stripe (modo test) para los planes de pago. NULL en el
-- plan free porque no tiene producto/precio en Stripe.
ALTER TABLE subscription_plans ADD COLUMN stripe_product_id TEXT;
ALTER TABLE subscription_plans ADD COLUMN stripe_price_id TEXT;

UPDATE subscription_plans SET stripe_product_id = 'prod_V7G222PRNiEdiH', stripe_price_id = 'price_1U71WRDgDVmbsnBDZaJWxxT9' WHERE key = 'business';
UPDATE subscription_plans SET stripe_product_id = 'prod_V7G24EKnfLTbqX', stripe_price_id = 'price_1U71WVDgDVmbsnBDy3aZWJSZ' WHERE key = 'premium';
