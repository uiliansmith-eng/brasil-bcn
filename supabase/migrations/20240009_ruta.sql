-- ============================================================
-- RUTA DEL BRASILEÑO — Tablas y contenido inicial
-- ============================================================

-- route_stages
CREATE TABLE IF NOT EXISTS route_stages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT NOT NULL DEFAULT '📌',
  color       TEXT NOT NULL DEFAULT '#002776',
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE route_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ruta_stages_public_read" ON route_stages FOR SELECT USING (true);

-- route_steps
CREATE TABLE IF NOT EXISTS route_steps (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id            UUID NOT NULL REFERENCES route_stages(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  short_description   TEXT,
  icon                TEXT NOT NULL DEFAULT '✅',
  position            INTEGER NOT NULL DEFAULT 0,
  estimated_time      TEXT,
  difficulty          TEXT CHECK (difficulty IN ('facil','medio','dificil')),
  company_categories  TEXT[] DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_route_steps_stage ON route_steps(stage_id);
CREATE INDEX IF NOT EXISTS idx_route_steps_slug  ON route_steps(slug);

ALTER TABLE route_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ruta_steps_public_read" ON route_steps FOR SELECT USING (true);

-- guide_articles
CREATE TABLE IF NOT EXISTS guide_articles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id          UUID NOT NULL REFERENCES route_steps(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  excerpt          TEXT,
  content          TEXT NOT NULL DEFAULT '',
  featured_image   TEXT,
  published        BOOLEAN NOT NULL DEFAULT FALSE,
  last_verified_at TIMESTAMPTZ,
  seo_title        TEXT,
  seo_description  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guide_articles_step    ON guide_articles(step_id);
CREATE INDEX IF NOT EXISTS idx_guide_articles_slug    ON guide_articles(slug);
CREATE INDEX IF NOT EXISTS idx_guide_articles_pub     ON guide_articles(published);

ALTER TABLE guide_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "guide_articles_public_read" ON guide_articles FOR SELECT USING (published = true);
CREATE POLICY "guide_articles_admin_all"   ON guide_articles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- faq_items
CREATE TABLE IF NOT EXISTS faq_items (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id   UUID NOT NULL REFERENCES route_steps(id) ON DELETE CASCADE,
  question  TEXT NOT NULL,
  answer    TEXT NOT NULL,
  position  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_faq_step ON faq_items(step_id);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faq_public_read"  ON faq_items FOR SELECT USING (true);
CREATE POLICY "faq_admin_all"    ON faq_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- guide_resources
CREATE TABLE IF NOT EXISTS guide_resources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id     UUID NOT NULL REFERENCES route_steps(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  url         TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'web',
  description TEXT,
  position    INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_guide_resources_step ON guide_resources(step_id);

ALTER TABLE guide_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resources_public_read" ON guide_resources FOR SELECT USING (true);
CREATE POLICY "resources_admin_all"   ON guide_resources FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- brazil_news
CREATE TABLE IF NOT EXISTS brazil_news (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  image_url    TEXT,
  source       TEXT NOT NULL DEFAULT 'BrasilBCN',
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  article_url  TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brazil_news_published ON brazil_news(published_at DESC);

ALTER TABLE brazil_news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_public_read" ON brazil_news FOR SELECT USING (true);
CREATE POLICY "news_admin_all"   ON brazil_news FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- ============================================================
-- ETAPAS
-- ============================================================

INSERT INTO route_stages (id, title, slug, description, icon, color, position) VALUES
  ('11111111-0001-0001-0001-000000000001', 'Llegada y Primeros Pasos', 'llegada', 'Todo lo que necesitas hacer en tus primeras semanas en Barcelona.', '🛬', '#002776', 1),
  ('11111111-0002-0002-0002-000000000002', 'Documentación Legal', 'documentacion', 'Trámites esenciales para regularizar tu situación y tener documentación válida.', '📋', '#009C3B', 2),
  ('11111111-0003-0003-0003-000000000003', 'Vida Cotidiana', 'vida-cotidiana', 'Organiza tu salud, transporte, vivienda y día a día en la ciudad.', '🏙️', '#FFDF00', 3),
  ('11111111-0004-0004-0004-000000000004', 'Trabajo y Finanzas', 'trabajo-finanzas', 'Consigue empleo, entiende el sistema fiscal y gestiona tu dinero en España.', '💼', '#E07B5A', 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PASOS
-- ============================================================

INSERT INTO route_steps (id, stage_id, title, slug, short_description, icon, position, estimated_time, difficulty, company_categories) VALUES
  -- Etapa 1: Llegada
  ('22222222-0001-0001-0001-000000000001', '11111111-0001-0001-0001-000000000001',
   'Primeros días en Barcelona', 'primeros-dias',
   'Qué hacer nada más llegar: SIM, orientarte por la ciudad y tus primeros contactos.', '✈️', 1, '1-2 días', 'facil', '{}'),

  ('22222222-0002-0002-0002-000000000002', '11111111-0001-0001-0001-000000000001',
   'Empadronamiento en Barcelona', 'empadronamiento',
   'El padrón municipal es la base de todo. Sin él no puedes tramitar el NIE ni acceder a servicios.', '📋', 2, '1-2 semanas', 'facil', '{}'),

  -- Etapa 2: Documentación
  ('22222222-0003-0003-0003-000000000003', '11111111-0002-0002-0002-000000000002',
   'Situación migratoria', 'situacion-migratoria',
   'Identifica tu situación legal para saber qué trámites te corresponden.', '🗺️', 1, '30 min', 'facil', '{}'),

  ('22222222-0004-0004-0004-000000000004', '11111111-0002-0002-0002-000000000002',
   'NIE / TIE', 'nie-tie',
   'El NIE es tu número de identificación en España. Imprescindible para trabajar, alquilar y abrir cuentas.', '🪪', 2, '1-3 meses', 'dificil', '{}'),

  -- Etapa 3: Vida cotidiana
  ('22222222-0005-0005-0005-000000000005', '11111111-0003-0003-0003-000000000003',
   'Cuenta bancaria', 'cuenta-bancaria',
   'Abre una cuenta bancaria para recibir nómina, pagar alquiler y gestionar tu dinero.', '🏦', 1, '1-2 semanas', 'facil', '{}'),

  ('22222222-0006-0006-0006-000000000006', '11111111-0003-0003-0003-000000000003',
   'Tarjeta sanitaria (CatSalut)', 'tarjeta-sanitaria',
   'Accede a la sanidad pública catalana con la tarjeta CatSalut, gratuita y universal.', '🏥', 2, '1-3 semanas', 'facil', '{}'),

  ('22222222-0007-0007-0007-000000000007', '11111111-0003-0003-0003-000000000003',
   'Transporte público', 'transporte-publico',
   'La T-Casual, la T-Jove y otras tarjetas de TMB para moverte por Barcelona.', '🚇', 3, '1 día', 'facil', '{}'),

  -- Etapa 4: Trabajo y finanzas
  ('22222222-0008-0008-0008-000000000008', '11111111-0004-0004-0004-000000000004',
   'Número de la Seguridad Social', 'seguridad-social',
   'Necesitas el número de afiliación a la Seguridad Social para trabajar legalmente en España.', '🔐', 1, '1-2 semanas', 'facil', '{}'),

  ('22222222-0009-0009-0009-000000000009', '11111111-0004-0004-0004-000000000004',
   'Buscar trabajo en Barcelona', 'buscar-trabajo',
   'Portales, estrategias y consejos para encontrar empleo como brasileño en Barcelona.', '🔍', 2, 'Variable', 'medio', '{}'),

  ('22222222-0010-0010-0010-000000000010', '11111111-0004-0004-0004-000000000004',
   'Declaración de la Renta (IRPF)', 'declaracion-renta',
   'Si trabajas en España, deberás hacer la declaración anual de la renta. Cómo funciona.', '📊', 3, 'Anual', 'medio', '{}')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ARTÍCULOS — Paso 1: Primeros días
-- ============================================================

INSERT INTO guide_articles (step_id, title, slug, excerpt, content, published, last_verified_at, seo_title, seo_description) VALUES
(
  '22222222-0001-0001-0001-000000000001',
  'Qué hacer en tus primeros días en Barcelona',
  'primeros-dias-barcelona',
  'Una lista práctica de lo primero que debes hacer al llegar a Barcelona: SIM, barrio, contactos y mentalidad de adaptación.',
  E'## Los primeros días importan más de lo que crees\n\nLlegar a Barcelona es emocionante, pero también puede abrumarte. Tienes muchas cosas que organizar y no sabes por dónde empezar. Esta guía te ayuda a estructurar tus primeros días de forma práctica.\n\n## Lo primero: una SIM española\n\nAntes de salir del aeropuerto, o en cuanto puedas, hazte con una SIM española. Necesitarás datos móviles para todo: mapas, traducciones, buscar pisos, comunicarte.\n\nLas opciones más populares entre brasileños:\n\n- **Movistar / Vodafone / Orange**: operadores grandes, buena cobertura, tarjetas físicas en tiendas\n- **Lowi / Simyo / Yoigo**: más baratas, se contratan online\n- **Digi**: una de las más económicas del mercado, muy buena cobertura\n\n> **Consejo práctico:** Con pasaporte brasileño ya puedes contratar una SIM. No necesitas NIE todavía.\n\n## Oriéntate por la ciudad\n\nBarcelona tiene barrios muy distintos en precio, ambiente y servicios. Antes de buscar piso, date unos días para explorar:\n\n- **Gràcia, Eixample, Sant Martí**: zonas con mucha comunidad brasileña y latinoamericana\n- **Hospitalet de Llobregat**: a 15 minutos del centro, precios de alquiler más bajos\n- **Badalona**: también bien comunicada y más asequible\n\nUsa Google Maps o Citymapper para moverte. El metro de Barcelona es muy completo.\n\n## Busca alojamiento temporal primero\n\nLa mayoría de los brasileños llegan sin piso fijo. Opciones para los primeros días o semanas:\n\n- **Pisos compartidos temporales**: busca en Idealista, Fotocasa o grupos de Facebook de brasileños en Barcelona\n- **Hostels**: buena opción por pocos días si el presupuesto lo permite\n- **Airbnb**: más caro pero más flexible\n- **Redes de contactos**: pregunta en grupos de WhatsApp o Telegram de la comunidad brasileña\n\n## Conecta con la comunidad\n\nNo estás solo. Hay miles de brasileños en Barcelona con experiencia en todo lo que estás viviendo.\n\n- Busca grupos de Facebook: "Brasileiros em Barcelona", "Brasileños en España"\n- Telegram: hay grupos activos de la comunidad\n- BrasilBCN: esta misma plataforma tiene empresas y eventos de la comunidad\n\n---\n\n## Mentalidad de adaptación\n\nLos primeros meses son los más difíciles. Es normal sentirse perdido, frustrado o nostálgico. Algunas cosas que ayudan:\n\n- No compares todo con Brasil. Son culturas distintas\n- La burocracia española es lenta. Paciencia con los trámites\n- El catalán puede sorprenderte. No te preocupes, el castellano funciona en todas partes\n- Busca actividades sociales fuera de la comunidad brasileña también: te ayudará a adaptarte más rápido\n\n> La adaptación es un proceso. Date tiempo.',
  true,
  NOW(),
  'Qué hacer en tus primeros días en Barcelona | Guía para brasileños',
  'Lista práctica para brasileños recién llegados a Barcelona: SIM, barrio, alojamiento y comunidad.'
),

-- ============================================================
-- ARTÍCULO — Paso 2: Empadronamiento
-- ============================================================
(
  '22222222-0002-0002-0002-000000000002',
  'Cómo empadronarse en Barcelona paso a paso',
  'empadronamiento-barcelona',
  'El empadronamiento es el primer trámite legal que debes hacer en Barcelona. Te explicamos cómo hacerlo, qué documentos necesitas y por qué es tan importante.',
  E'## ¿Qué es el padrón municipal?\n\nEl padrón municipal es el registro donde constan los vecinos de un municipio. Empadronarte en Barcelona significa registrarte como residente en la ciudad.\n\nEs **el trámite más importante que debes hacer al llegar**, porque:\n\n- Sin él no puedes pedir el NIE ni la TIE\n- Sin él no puedes acceder a la sanidad pública (CatSalut)\n- Sin él no puedes escolarizar a tus hijos\n- Es necesario para muchos trámites bancarios y laborales\n\n## ¿Quién puede empadronarse?\n\nCualquier persona que resida en Barcelona, independientemente de su situación migratoria. Incluso en situación irregular se puede empadronar.\n\n## Documentos necesarios\n\n- **Pasaporte o documento de identidad** (original y fotocopia)\n- **Contrato de alquiler** (si eres inquilino) o autorización firmada del titular del piso\n- Si vives en un piso compartido: necesitas una autorización del titular del contrato o del propietario\n\n> **Ojo:** Si no tienes contrato de alquiler a tu nombre, el titular del contrato debe firmar una autorización. Descárgala en la web del Ayuntamiento.\n\n## ¿Dónde y cómo tramitarlo?\n\n### Opción 1: Online (recomendado si tienes certificado digital)\n\nSi tienes certificado digital o Cl@ve PIN, puedes hacerlo en:\n**seu.bcn.cat** → Tràmits → Empadronament\n\n### Opción 2: Presencial en la Oficina de Atención Ciudadana\n\n1. Pide cita previa en **w10.bcn.cat/APPS/irscAplacioBCN** o por teléfono al 010\n2. Acude con todos tus documentos\n3. Las oficinas más accesibles:\n   - **OAC Eixample**: Carrer de Provença 136\n   - **OAC Gràcia**: Travessera de Gràcia 53\n   - **OAC Sant Martí**: Rambla del Poblenou 45\n   - (Hay 8 OAC en total en Barcelona)\n\n## Plazo\n\nEl certificado de empadronamiento suele emitirse en el momento o en pocos días. Ten en cuenta que para el NIE/TIE necesitarás el **certificado original** con fecha reciente (máximo 3 meses).\n\n## ¿Qué pasa si me cambio de piso?\n\nDebes actualizar el padrón cada vez que cambies de domicilio. Es un trámite rápido.\n\n---\n\n## Preguntas frecuentes\n\n**¿Puedo empadronarme sin contrato de alquiler?**\nSí, pero necesitas una autorización firmada del titular del contrato o propietario del piso.\n\n**¿Cuánto tarda?**\nEl certificado de empadronamiento se entrega casi de inmediato (presencial) o en 1-3 días (online/correo).\n\n**¿Tiene algún coste?**\nNo. El empadronamiento es gratuito.\n\n**¿El padrón me da derecho a residir en España?**\nNo. El padrón no regulariza tu situación migratoria, pero es un trámite necesario para muchos otros.',
  true,
  NOW(),
  'Cómo empadronarse en Barcelona | Guía paso a paso para brasileños',
  'Guía completa para empadronarse en Barcelona: documentos necesarios, dónde hacerlo y por qué es el primer trámite imprescindible.'
),

-- ============================================================
-- ARTÍCULO — Paso 3: Situación migratoria
-- ============================================================
(
  '22222222-0003-0003-0003-000000000003',
  'Situación migratoria en España: ¿cuál es la tuya?',
  'situacion-migratoria',
  'Guía para entender qué tipo de permiso o visado tienes y qué trámites te corresponden según tu situación en España.',
  E'## ¿Por qué importa conocer tu situación migratoria?\n\nNo todos los brasileños que llegan a España tienen la misma situación legal. Dependiendo de cómo entraste y qué documentación tienes, los trámites que debes seguir son diferentes.\n\nIdentificar correctamente tu situación migratoria te ahorrará tiempo, dinero y errores que pueden ser muy costosos.\n\n## Las situaciones más comunes\n\n### ✈️ Turismo (sin visado)\n\nLlegaste a España sin un visado de larga duración, usando el acuerdo de exención de visados entre Brasil y el espacio Schengen.\n\n- Puedes permanecer hasta **90 días** en el espacio Schengen dentro de cada período de 180 días\n- Si quieres quedarte más, debes iniciar un trámite de regularización antes de que venza ese plazo\n- No puedes trabajar legalmente con este estatus\n\n### 🎓 Estudios\n\nTienes una visa de larga duración o permiso de residencia que te autoriza a vivir en España durante tu formación.\n\n- Solicita la TIE nada más llegar\n- Empadrómate cuanto antes\n- Algunos permisos de estudios permiten trabajar a tiempo parcial\n\n### 💼 Trabajo\n\nTienes un contrato de trabajo y los permisos necesarios para trabajar legalmente.\n\n- Solicita la TIE si no la tienes\n- Consigue tu número de la Seguridad Social\n- Empadrómate y abre una cuenta bancaria\n\n### 👨‍👩‍👧 Familiar de ciudadano UE\n\nEres familiar (cónyuge, hijo, ascendiente) de una persona con ciudadanía europea que reside en España.\n\n- El trámite es diferente al permiso de residencia ordinario\n- Solicita la **Tarjeta de Residencia de Familiar de Ciudadano de la UE**\n\n### 🚀 Emprendedor / Autónomo\n\nQuieres montar un negocio o trabajar como autónomo en España.\n\n- Opciones: visado de emprendedor o autorización de residencia por cuenta propia\n- Requiere plan de negocio y requisitos económicos\n\n### 💻 Nómada Digital\n\nTrabajes de forma remota para empresas o clientes fuera de España.\n\n- España tiene una **Visa de Nómada Digital** desde 2023\n- Requisitos de ingresos mínimos y documentación específica\n\n## ¿Y si mi situación es irregular?\n\nSi llevas más de 90 días sin permiso o tu visado ha vencido, existen vías de regularización:\n\n- **Arraigo social**: después de 3 años en España con vínculos demostrados\n- **Arraigo laboral**: si has trabajado sin autorización con un empleador dispuesto a contratarte\n- **Arraigo familiar**: si tienes hijos españoles o cónyuge con residencia legal\n\n> **Importante:** En cualquier situación de irregularidad, busca asesoramiento jurídico especializado. Hay entidades en Barcelona que ofrecen orientación gratuita.\n\n---\n\n## ¿Dónde buscar asesoramiento?\n\n- **Oficina d''Atenció als Immigrants (SAIER)**: Carrer de Avinyó 15, Barcelona\n- **Cruz Roja Barcelona**: orientación para migrantes\n- **Abogados de extranjería**: especializados en situaciones migratorias complejas\n\n> Este artículo es orientativo y no reemplaza el asesoramiento de un profesional de extranjería.',
  true,
  NOW(),
  'Situación migratoria en España para brasileños | BrasilBCN',
  'Descubre cuál es tu situación migratoria en España y qué trámites te corresponden: turismo, estudios, trabajo, arraigo y más.'
),

-- ============================================================
-- ARTÍCULO — Paso 4: NIE / TIE
-- ============================================================
(
  '22222222-0004-0004-0004-000000000004',
  'NIE y TIE en España: qué son y cómo obtenerlos',
  'nie-tie-espana',
  'El NIE (Número de Identificación de Extranjero) y la TIE (Tarjeta de Identidad de Extranjero) son documentos esenciales para vivir en España. Te explicamos la diferencia y cómo tramitarlos.',
  E'## NIE vs TIE: ¿cuál es la diferencia?\n\nSon dos cosas distintas que mucha gente confunde:\n\n- **NIE (Número de Identificación de Extranjero)**: es un número, no un documento físico. Empieza por X, Y o Z seguido de 7 dígitos y una letra. Lo necesitas para trabajar, alquilar, abrir cuentas, comprar vehículos, etc.\n\n- **TIE (Tarjeta de Identidad de Extranjero)**: es el documento físico (una tarjeta) que acredita tu residencia legal en España. La TIE ya incluye tu NIE impreso en ella.\n\n> Si tienes residencia legal (visa de trabajo, estudios, reagrupación familiar, etc.), lo que tramitas es la TIE. Si solo necesitas el número NIE por una operación puntual (sin residencia), tramitas el NIE por impreso EX-15.\n\n## ¿Cuándo necesitas el NIE?\n\n- Para trabajar legalmente\n- Para firmar un contrato de alquiler\n- Para abrir una cuenta bancaria en algunos bancos\n- Para comprar o vender bienes\n- Para matricularte en cursos o universidades\n- Para casi cualquier trámite oficial en España\n\n## Cómo tramitar la TIE (si tienes visa de residencia)\n\nSi llegaste con un visado de larga duración (trabajo, estudios, familiar UE, etc.), debes solicitar la TIE en el plazo de **30 días desde tu entrada en España**.\n\n### Documentos necesarios:\n\n- Formulario EX-17 (disponible en extranjería.gob.es)\n- Pasaporte original y fotocopia completa\n- Foto de carné reciente (fondo blanco, 32x26mm)\n- Certificado de empadronamiento original\n- Visado vigente\n- Tasa 790 código 012 pagada (aproximadamente 16€)\n- Documentación específica según tu tipo de visado\n\n### Pasos:\n\n1. Paga la tasa modelo 790 código 012 en un banco (o en algunas comisarías)\n2. Pide cita previa en la **Oficina de Extranjería de Barcelona** o en algunas Comisarías de Policía Nacional:\n   - Puedes pedir cita en: extranjeros.empleo.gob.es → Cita Previa\n   - También en el teléfono 060\n3. Acude con toda la documentación el día de la cita\n4. Te darán un resguardo y en 1-6 semanas recibirás la tarjeta\n\n## Cómo tramitar el NIE sin residencia (impreso EX-15)\n\nSi no tienes residencia pero necesitas el NIE para una gestión puntual:\n\n1. Justifica por qué lo necesitas (oferta de trabajo, contrato de alquiler, etc.)\n2. Rellena el formulario EX-15\n3. Paga la tasa 790 código 012\n4. Pide cita previa en la Comisaría de Policía Nacional (Brigada de Extranjería)\n5. Acude con: pasaporte original + fotocopia, formulario EX-15, justificación y tasa pagada\n\n## Tiempos de espera\n\nConseguir cita previa es el mayor obstáculo. El sistema de citas en extranjería.gob.es suele estar colapsado. Consejos:\n\n- Conectate a las 6:00 AM cuando el sistema abre nuevas citas\n- Usa gestorías especializadas que tienen acceso a citas\n- Revisa cancelaciones durante el día\n- Plataformas como MiCitaPrevia.es alertan de citas disponibles\n\n> Una gestoría especializada en extranjería puede ahorrarte muchos problemas. Suelen cobrar entre 100€ y 300€ por el trámite completo.\n\n---\n\n## Renovación de la TIE\n\n- La TIE inicial suele tener validez de 1 año. Renuévala 60 días antes de que venza\n- Tras 5 años de residencia legal puedes solicitar la **Residencia de Larga Duración** (tarjeta indefinida)\n- Los plazos y requisitos cambian según tu tipo de permiso',
  true,
  NOW(),
  'NIE y TIE en España: guía completa para brasileños | BrasilBCN',
  'Todo sobre el NIE y la TIE en España: diferencias, documentos necesarios, cómo pedir cita y tiempos de espera.'
),

-- ============================================================
-- ARTÍCULO — Paso 5: Cuenta bancaria
-- ============================================================
(
  '22222222-0005-0005-0005-000000000005',
  'Cómo abrir una cuenta bancaria en España siendo brasileño',
  'cuenta-bancaria-espana',
  'Guía completa para abrir una cuenta bancaria en España: qué bancos admiten extranjeros sin NIE, qué documentos necesitas y las mejores opciones.',
  E'## ¿Por qué necesitas una cuenta bancaria española?\n\n- Para recibir tu nómina o pagos\n- Para pagar el alquiler del piso\n- Para domiciliar facturas (luz, gas, internet)\n- Para hacer transferencias en España\n- Para las gestiones administrativas y tributarias\n\n## ¿Puedes abrir una cuenta sin NIE?\n\nSí, en muchos bancos. Lo que necesitas mínimo es:\n\n- **Pasaporte** (válido)\n- **Certificado de empadronamiento** (o dirección en España)\n- En algunos bancos: número de identificación fiscal del país de origen\n\nConviene hacerlo cuanto antes, aunque no tengas NIE todavía.\n\n## Las mejores opciones para recién llegados\n\n### 🏦 Bancos online / neobancos (más fáciles)\n\n**Revolut**\n- Se abre 100% desde el móvil en minutos\n- Solo necesitas pasaporte y selfie\n- IBAN europeo inmediato\n- Tarjeta gratuita, sin cuota mensual\n- Ideal para empezar\n\n**N26**\n- Similar a Revolut\n- IBAN alemán (funciona en toda Europa)\n- App muy buena, apertura online\n\n**Wise**\n- Muy útil para recibir y enviar dinero entre países (Brasil ↔ España)\n- Excelente tipo de cambio\n- No es un banco al uso pero cumple muchas funciones\n\n### 🏛️ Bancos tradicionales (más requisitos, más servicios)\n\n**CaixaBank**\n- El más grande en Cataluña, muy presente en Barcelona\n- Necesitas NIE o pasaporte + empadronamiento\n- Cuenta básica sin comisiones si cumples condiciones\n- Muchas oficinas en la ciudad\n\n**Sabadell**\n- Banco con sede en Cataluña\n- Acepta extranjeros con pasaporte\n- Cuenta Expansión Joven si eres menor de 30 años\n\n**BBVA**\n- App muy buena\n- Apertura online posible con pasaporte en algunos casos\n\n**Santander**\n- Familiar para brasileños (Santander Brasil es el mismo grupo)\n- Puedes preguntar por condiciones específicas para clientes de Brasil\n\n## Comisiones que debes conocer\n\n- Muchos bancos tradicionales cobran cuota mensual (entre 5€ y 15€) si no ingresas un mínimo mensual\n- Los neobancos suelen ser gratuitos\n- Comisión por transferencia internacional: varía mucho, usa Wise para el mejor tipo de cambio\n\n## Pasos para abrir una cuenta en CaixaBank (presencial)\n\n1. Ve a cualquier oficina CaixaBank en Barcelona\n2. Pide una cita o espera turno\n3. Lleva: pasaporte original + copia, certificado de empadronamiento, número de teléfono español\n4. La cuenta se abre en el momento o en 1-2 días\n5. La tarjeta llega por correo en 5-10 días\n\n---\n\n## Consejo\n\nEmpieza con Revolut o N26 mientras tramitas el NIE y el empadronamiento. Son rápidos y sin complicaciones. Cuando tengas el NIE, abre una cuenta en un banco español para gestiones más formales como nómina o alquiler.',
  true,
  NOW(),
  'Cuenta bancaria en España para brasileños | Mejores bancos y cómo abrirla',
  'Cómo abrir una cuenta bancaria en España siendo brasileño: mejores bancos, documentos necesarios y opciones sin NIE.'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- FAQs — Paso 1: Primeros días
-- ============================================================

INSERT INTO faq_items (step_id, question, answer, position) VALUES
('22222222-0001-0001-0001-000000000001', '¿Necesito un visado para entrar en España como turista?', 'No. Los ciudadanos brasileños pueden entrar en España y en el espacio Schengen sin visado para estancias de hasta 90 días en cada período de 180 días. Solo necesitas el pasaporte en vigor.', 1),
('22222222-0001-0001-0001-000000000001', '¿Puedo trabajar mientras estoy como turista?', 'No legalmente. El estatus de turista no te autoriza a trabajar en España. Necesitas un permiso de trabajo específico. Si quieres quedarte y trabajar, inicia el trámite de autorización antes de que venza el plazo de 90 días.', 2),
('22222222-0001-0001-0001-000000000001', '¿Qué SIM es mejor para recién llegados?', 'Digi y Lowi son populares por su precio. Movistar y Orange tienen mejor cobertura. Puedes contratar con pasaporte, sin NIE. Para los primeros días, cualquiera que tenga datos móviles te servirá.', 3),
('22222222-0001-0001-0001-000000000001', '¿Dónde hay más comunidad brasileña en Barcelona?', 'Los barrios de Gràcia, Eixample, El Poblenou y El Raval tienen bastante comunidad latinoamericana. También zonas de Hospitalet de Llobregat. Los grupos de Facebook y Telegram son la mejor forma de conectar.', 4),

-- FAQs — Paso 2: Empadronamiento
('22222222-0002-0002-0002-000000000002', '¿Puedo empadronarme sin tener contrato de alquiler a mi nombre?', 'Sí. Si vives en un piso compartido, el titular del contrato o el propietario puede firmar una autorización para que te empadrones. Descarga el formulario en la web del Ayuntamiento de Barcelona (bcn.cat).', 1),
('22222222-0002-0002-0002-000000000002', '¿Cuánto tarda el empadronamiento?', 'Si lo haces presencialmente en una OAC, el certificado te lo dan casi al momento. Online puede tardar 1-3 días hábiles. El certificado tiene validez de 3 meses para trámites como el NIE.', 2),
('22222222-0002-0002-0002-000000000002', '¿El empadronamiento me legaliza en España?', 'No. El padrón es un registro de residencia, no un permiso de residencia. No cambia tu situación migratoria. Pero es necesario para muchos trámites, incluida la solicitud del NIE o la TIE.', 3),
('22222222-0002-0002-0002-000000000002', '¿Tengo que empadronarme si solo voy a estar unos meses?', 'Depende. Si vas a estar más de 90 días, sí conviene porque lo necesitarás para trámites. Si solo son unos días o semanas como turista, no es necesario.', 4),

-- FAQs — Paso 3: Situación migratoria
('22222222-0003-0003-0003-000000000003', '¿Qué pasa si me quedo más de 90 días sin visado?', 'Entrás en situación irregular. Esto puede conllevar sanciones, dificultades para regularizarte y, en casos extremos, expulsión. Si sabes que quieres quedarte, inicia los trámites antes de los 90 días.', 1),
('22222222-0003-0003-0003-000000000003', '¿Qué es el arraigo y cuándo puedo pedirlo?', 'El arraigo social es una vía de regularización para personas que llevan al menos 3 años en España con vínculos demostrados (trabajo, familia, integración). Necesitas un informe de arraigo del Ayuntamiento y otros documentos.', 2),
('22222222-0003-0003-0003-000000000003', '¿Puedo regularizarme si entré como turista y llevo más de 90 días?', 'Sí, pero es complejo. Dependiendo de tu situación, puede haber vías como el arraigo laboral, social o familiar. Busca asesoramiento jurídico gratuito en el SAIER (Carrer de Avinyó 15, Barcelona).', 3),

-- FAQs — Paso 4: NIE/TIE
('22222222-0004-0004-0004-000000000004', '¿Cuál es la diferencia entre NIE y TIE?', 'El NIE es solo un número (empieza por X, Y o Z). La TIE es una tarjeta física que acredita tu residencia en España y lleva el NIE impreso. Si tienes residencia legal, lo que tramitas es la TIE.', 1),
('22222222-0004-0004-0004-000000000004', '¿Por qué es tan difícil conseguir cita previa para extranjería?', 'El sistema de citas en extranjería.gob.es está muy saturado. Las citas se liberan a primera hora de la mañana (6-8 AM) y se agotan en minutos. Muchas gestorías ofrecen el servicio de conseguir cita por un precio.', 2),
('22222222-0004-0004-0004-000000000004', '¿Cuánto cuesta tramitar la TIE?', 'La tasa oficial es de unos 16€ (modelo 790, código 012). Si usas una gestoría para el trámite completo, el coste suele ser de 100€ a 300€ adicionales.', 3),
('22222222-0004-0004-0004-000000000004', '¿Cuánto tiempo tarda en llegar la TIE?', 'Después de hacer la solicitud, la tarjeta física suele tardar entre 1 y 6 semanas. Te dan un resguardo de solicitud que tiene validez mientras esperas.', 4),

-- FAQs — Paso 5: Cuenta bancaria
('22222222-0005-0005-0005-000000000005', '¿Puedo abrir una cuenta bancaria sin NIE?', 'Sí. Muchos bancos y neobancos (Revolut, N26, CaixaBank) permiten abrir cuenta con pasaporte y empadronamiento. El NIE facilita el proceso pero no es siempre obligatorio para empezar.', 1),
('22222222-0005-0005-0005-000000000005', '¿Qué banco recomiendan los brasileños en Barcelona?', 'Para empezar: Revolut o N26 (sin comisiones, apertura online). Para cuenta principal: CaixaBank (muy presente en Barcelona) o BBVA (buena app). Santander es familiar por ser el mismo grupo que en Brasil.', 2),
('22222222-0005-0005-0005-000000000005', '¿Cómo envío dinero a Brasil de forma económica?', 'Wise es la opción más popular por su tipo de cambio cercano al real y bajas comisiones. Evita las transferencias internacionales de los bancos tradicionales, que cobran mucho más.', 3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- RECURSOS — Paso 1: Primeros días
-- ============================================================

INSERT INTO guide_resources (step_id, title, url, type, description, position) VALUES
('22222222-0001-0001-0001-000000000001', 'Grupos de brasileños en Barcelona (Facebook)', 'https://www.facebook.com/groups/brasileirosbcn', 'web', 'Grupo principal de la comunidad brasileña en Barcelona.', 1),
('22222222-0001-0001-0001-000000000001', 'Citymapper Barcelona', 'https://citymapper.com/barcelona', 'app', 'La mejor app para moverte en transporte público por Barcelona.', 2),
('22222222-0001-0001-0001-000000000001', 'Idealista — Pisos compartidos Barcelona', 'https://www.idealista.com/alquiler-habitaciones/barcelona/', 'web', 'Portal inmobiliario para buscar habitaciones y pisos compartidos.', 3),

-- Recursos — Paso 2: Empadronamiento
('22222222-0002-0002-0002-000000000002', 'Cita previa empadronamiento — Ajuntament de Barcelona', 'https://w10.bcn.cat/APPS/irscAplacioBCN/', 'web', 'Web oficial para pedir cita en las Oficinas de Atención Ciudadana (OAC).', 1),
('22222222-0002-0002-0002-000000000002', 'Formulario autorización empadronamiento (BCN)', 'https://www.barcelona.cat/ca/tramits/padro-municipal-d-habitants/alta-al-padro-municipal-d-habitants', 'web', 'Trámite oficial de alta en el padrón y formulario de autorización.', 2),
('22222222-0002-0002-0002-000000000002', 'OAC Eixample — Oficina de Atención Ciudadana', 'https://www.barcelona.cat/es/ayuntamiento/oac', 'web', 'Información de todas las oficinas OAC de Barcelona con horarios y direcciones.', 3),

-- Recursos — Paso 3: Situación migratoria
('22222222-0003-0003-0003-000000000003', 'SAIER — Servicio de Atención a Inmigrantes', 'https://www.barcelona.cat/ca/ajuntament/serveis/saier', 'web', 'Servicio gratuito de asesoramiento jurídico a inmigrantes del Ayuntamiento de Barcelona.', 1),
('22222222-0003-0003-0003-000000000003', 'Extranjería — Gobierno de España', 'https://extranjeros.inclusion.gob.es/', 'web', 'Portal oficial del gobierno para trámites de extranjería y visados.', 2),

-- Recursos — Paso 4: NIE / TIE
('22222222-0004-0004-0004-000000000004', 'Cita previa extranjería (Gobierno de España)', 'https://sede.administracionespublicas.gob.es/icpplus/', 'web', 'Sistema oficial para solicitar cita previa para NIE y TIE.', 1),
('22222222-0004-0004-0004-000000000004', 'Modelo 790 — Tasa extranjería', 'https://sede.agenciatributaria.gob.es/Sede/procedimientoini/G322.shtml', 'web', 'Formulario oficial para pagar la tasa del NIE/TIE (código 012).', 2),
('22222222-0004-0004-0004-000000000004', 'MiCitaPrevia — Alertas de citas disponibles', 'https://www.micita.es/', 'web', 'Servicio de alertas para cuando haya citas disponibles en extranjería.', 3),

-- Recursos — Paso 5: Cuenta bancaria
('22222222-0005-0005-0005-000000000005', 'Revolut — Cuenta gratuita', 'https://www.revolut.com/es-ES/', 'web', 'Neobanco europeo, apertura online en minutos con pasaporte. Ideal para empezar.', 1),
('22222222-0005-0005-0005-000000000005', 'Wise — Transferencias internacionales', 'https://wise.com/es/', 'web', 'La opción más económica para enviar dinero entre Brasil y España.', 2),
('22222222-0005-0005-0005-000000000005', 'CaixaBank — Cuenta online', 'https://www.caixabank.es/particular/cuentas/cuenta-online.html', 'web', 'El banco más presente en Cataluña, con muchas oficinas en Barcelona.', 3)
ON CONFLICT DO NOTHING;
