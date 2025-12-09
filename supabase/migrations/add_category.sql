-- Ejecuta esto en el SQL Editor de Supabase

ALTER TABLE public.listings 
ADD COLUMN category text DEFAULT 'OTHER'
CHECK (category IN ('GPU', 'CPU', 'RAM', 'MOBO', 'OTHER'));

-- Opcional: Crear índice para búsquedas rápidas
CREATE INDEX idx_listings_category ON public.listings(category);
