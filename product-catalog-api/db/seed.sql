INSERT INTO categories (name) VALUES
  ('Electronics')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (title, price, category_id, description, image_url) VALUES
  ('Everyday Backpack', 109.95, 1, 'A durable, everyday-use backpack.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'),
  ('2TB External Drive', 64.00, 1, 'Portable external storage.', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80'),
  ('1TB Internal SSD', 109.00, 1, 'Fast internal solid-state storage.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'),
  ('4TB Gaming Drive', 114.00, 1, 'High-capacity gaming storage.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'),
  ('Slim Laptop', 606.99, 1, 'A lightweight, slim laptop.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80'),
  ('49" Curved Monitor', 999.99, 1, 'An ultra-wide curved monitor.', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80');
