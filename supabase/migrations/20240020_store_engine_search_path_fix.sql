-- Corrige el advisor "Function Search Path Mutable" en las dos
-- funciones nuevas del motor de tiendas.
ALTER FUNCTION public.has_store_access(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.sync_company_status() SET search_path = public;
