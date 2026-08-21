-- Seed de las 12 categorías del motor de tiendas + subcategorías.
-- legacy_company_category mapea cada una al enum company_category
-- existente para que /empresas siga funcionando sin cambios.

-- legacy_company_category usa los valores reales del enum company_category:
-- restaurantes, abogados, peluquerias, construccion, contables, tiendas,
-- transporte, educacion, salud, tecnologia, otro, bar_cafeteria, barberia,
-- servicios_profesionales
INSERT INTO store_categories (key, label, legacy_company_category, display_order) VALUES
  ('comercio',        'Tiendas y Comercio',       'tiendas',                  1),
  ('alimentacion',     'Alimentación',             'tiendas',                  2),
  ('restaurantes',     'Restaurantes',             'restaurantes',             3),
  ('belleza',          'Belleza y Bienestar',      'peluquerias',              4),
  ('servicios',        'Servicios',                'servicios_profesionales',  5),
  ('viajes',           'Viajes y Turismo',         'otro',                     6),
  ('automocion',       'Automóvil',                'transporte',               7),
  ('inmobiliaria',     'Inmobiliaria',             'otro',                     8),
  ('profesionales',    'Profesionales',            'servicios_profesionales',  9),
  ('educacion',        'Educación',                'educacion',                10),
  ('eventos',          'Eventos',                  'otro',                     11),
  ('digital',          'Digital y Freelance',      'tecnologia',               12),
  ('otros',            'Otros',                    'otro',                     13);

INSERT INTO store_subcategories (category_id, key, label, display_order)
SELECT c.id, s.key, s.label, s.ord FROM store_categories c
JOIN (VALUES
  ('comercio', 'ropa', 'Ropa y accesorios', 1),
  ('comercio', 'calzado', 'Calzado', 2),
  ('comercio', 'electronica', 'Electrónica', 3),
  ('comercio', 'hogar', 'Hogar y decoración', 4),
  ('comercio', 'regalos', 'Regalos y artesanía', 5),
  ('comercio', 'otros', 'Otros comercios', 6),

  ('alimentacion', 'panaderia', 'Panadería y repostería', 1),
  ('alimentacion', 'carniceria', 'Carnicería', 2),
  ('alimentacion', 'mercado', 'Mercado y frutería', 3),
  ('alimentacion', 'productos_brasil', 'Productos brasileños', 4),
  ('alimentacion', 'bebidas', 'Bebidas', 5),
  ('alimentacion', 'otros', 'Otros', 6),

  ('restaurantes', 'brasileno', 'Comida brasileña', 1),
  ('restaurantes', 'churrasco', 'Churrasquería', 2),
  ('restaurantes', 'lanchonete', 'Lanchonete / snacks', 3),
  ('restaurantes', 'delivery', 'Delivery', 4),
  ('restaurantes', 'otros', 'Otros', 5),

  ('belleza', 'peluqueria', 'Peluquería', 1),
  ('belleza', 'barberia', 'Barbería', 2),
  ('belleza', 'estetica', 'Estética y spa', 3),
  ('belleza', 'unas', 'Manicura y uñas', 4),
  ('belleza', 'masajes', 'Masajes', 5),
  ('belleza', 'otros', 'Otros', 6),

  ('servicios', 'limpieza', 'Limpieza', 1),
  ('servicios', 'reformas', 'Reformas y mantenimiento', 2),
  ('servicios', 'mudanzas', 'Mudanzas y transporte', 3),
  ('servicios', 'cuidado_personas', 'Cuidado de personas', 4),
  ('servicios', 'otros', 'Otros', 5),

  ('viajes', 'agencia', 'Agencia de viajes', 1),
  ('viajes', 'excursiones', 'Excursiones y tours', 2),
  ('viajes', 'alojamiento', 'Alojamiento', 3),
  ('viajes', 'otros', 'Otros', 4),

  ('automocion', 'taller', 'Taller mecánico', 1),
  ('automocion', 'compraventa', 'Compraventa de vehículos', 2),
  ('automocion', 'alquiler', 'Alquiler de vehículos', 3),
  ('automocion', 'otros', 'Otros', 4),

  ('inmobiliaria', 'venta', 'Venta de propiedades', 1),
  ('inmobiliaria', 'alquiler', 'Alquiler de propiedades', 2),
  ('inmobiliaria', 'gestion', 'Gestión inmobiliaria', 3),
  ('inmobiliaria', 'otros', 'Otros', 4),

  ('profesionales', 'abogacia', 'Abogacía', 1),
  ('profesionales', 'contabilidad', 'Contabilidad y gestoría', 2),
  ('profesionales', 'salud', 'Salud y terapias', 3),
  ('profesionales', 'consultoria', 'Consultoría', 4),
  ('profesionales', 'otros', 'Otros', 5),

  ('educacion', 'idiomas', 'Clases de idiomas', 1),
  ('educacion', 'academico', 'Refuerzo académico', 2),
  ('educacion', 'musica', 'Música y arte', 3),
  ('educacion', 'deportes', 'Deportes', 4),
  ('educacion', 'otros', 'Otros', 5),

  ('eventos', 'fiestas', 'Organización de fiestas', 1),
  ('eventos', 'musica_dj', 'Música y DJ', 2),
  ('eventos', 'fotografia', 'Fotografía y video', 3),
  ('eventos', 'catering', 'Catering', 4),
  ('eventos', 'otros', 'Otros', 5),

  ('digital', 'diseno', 'Diseño gráfico', 1),
  ('digital', 'desarrollo', 'Desarrollo web/software', 2),
  ('digital', 'marketing', 'Marketing digital', 3),
  ('digital', 'traduccion', 'Traducción', 4),
  ('digital', 'otros', 'Otros', 5),

  ('otros', 'general', 'General', 1)
) AS s(cat_key, key, label, ord) ON s.cat_key = c.key;
