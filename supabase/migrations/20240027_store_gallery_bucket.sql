-- Bucket dedicado para la galería de tiendas (fotos + vídeo). El
-- bucket 'companies' existente solo permite imágenes hasta 10MB y
-- se usa en todo el sitio para logos/portadas — en vez de ampliar
-- ese límite globalmente, se crea un bucket propio para esta
-- función, reutilizando el mismo patrón de políticas por carpeta
-- de usuario que ya usan avatars/companies/events/listings.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'store-gallery', 'store-gallery', true, 52428800,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
);

DROP POLICY "Public read access" ON storage.objects;
CREATE POLICY "Public read access" ON storage.objects FOR SELECT
  USING (bucket_id = ANY (ARRAY['avatars', 'companies', 'events', 'listings', 'guides', 'quizzes', 'store-gallery']));

DROP POLICY "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE
  USING (bucket_id = ANY (ARRAY['avatars', 'companies', 'events', 'listings', 'store-gallery']) AND (storage.foldername(name))[1] = (auth.uid())::text);

DROP POLICY "Users can update own files" ON storage.objects;
CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE
  USING (bucket_id = ANY (ARRAY['avatars', 'companies', 'events', 'listings', 'store-gallery']) AND (storage.foldername(name))[1] = (auth.uid())::text)
  WITH CHECK (bucket_id = ANY (ARRAY['avatars', 'companies', 'events', 'listings', 'store-gallery']) AND (storage.foldername(name))[1] = (auth.uid())::text);

DROP POLICY "Users can upload to own folder" ON storage.objects;
CREATE POLICY "Users can upload to own folder" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = ANY (ARRAY['avatars', 'companies', 'events', 'listings', 'store-gallery']) AND (storage.foldername(name))[1] = (auth.uid())::text);
