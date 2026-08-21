-- Roles ampliados para el motor de tiendas (Fase 1).
-- Separado del resto porque Postgres no permite usar un valor de
-- enum recién creado dentro de la misma transacción en que se añade.
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'employee';
