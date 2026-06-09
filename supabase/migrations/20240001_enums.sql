-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('user', 'company', 'admin');

CREATE TYPE job_type AS ENUM (
  'full_time',
  'part_time',
  'freelance',
  'internship',
  'temporary'
);

CREATE TYPE job_category AS ENUM (
  'hosteleria',
  'construccion',
  'limpieza',
  'belleza',
  'transporte',
  'comercio',
  'tecnologia',
  'educacion',
  'salud',
  'administracion',
  'otro'
);

CREATE TYPE company_category AS ENUM (
  'restaurantes',
  'abogados',
  'peluquerias',
  'construccion',
  'contables',
  'tiendas',
  'transporte',
  'educacion',
  'salud',
  'tecnologia',
  'otro'
);

CREATE TYPE event_category AS ENUM (
  'fiesta',
  'cultura',
  'deporte',
  'networking',
  'gastronomia',
  'arte',
  'musica',
  'otro'
);

CREATE TYPE guide_category AS ENUM (
  'nie',
  'empadronamiento',
  'autonomos',
  'seguridad_social',
  'bancos',
  'vivienda',
  'educacion',
  'sanidad',
  'otro'
);

CREATE TYPE ad_position AS ENUM (
  'home_hero',
  'sidebar',
  'footer',
  'jobs_top',
  'companies_top'
);
