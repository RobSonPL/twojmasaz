import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const photos = [
  {
    url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=900&q=80&auto=format&fit=crop',
    caption: 'Strefa relaksu',
    size: 'large',
  },
  {
    url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=700&q=80&auto=format&fit=crop',
    caption: 'Aromaterapia',
    size: 'small',
  },
  {
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=700&q=80&auto=format&fit=crop',
    caption: 'Masaż terapeutyczny',
    size: 'small',
  },
  {
    url: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=900&q=80&auto=format&fit=crop',
    caption: 'Profesjonalne zabiegi',
    size: 'medium',
  },
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80&auto=format&fit=crop',
    caption: 'Masaż sportowy',
    size: 'small',
  },
  {
    url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=700&q=80&auto=format&fit=crop',
    caption: 'Pielęgnacja twarzy',
    size: 'medium',
  },
];

export default function GallerySection() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="galeria" className="section-padding bg-bone">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gold text-xs tracking-[0.4em] uppercase"
            >
              Klimat
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl lg:text-6xl mt-4 text-obsidian"
            >
              Nasze<br />studio
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-7 lg:flex lg:items-end lg:pb-4"
          >
            <p className="text-muted-foreground text-lg max-w-lg">
              Przestrzeń zaprojektowana z myślą o pełnym wyciszeniu — ciepłe światło, naturalne aromaty i cisza, która pozwala naprawdę odpocząć.
            </p>
          </motion.div>
        </div>

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.07, duration: 0.55 }}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden"
              onClick={() => setLightbox(photo)}
            >
              <div className={`relative overflow-hidden ${photo.size === 'large' ? 'aspect-[4/5]' : photo.size === 'medium' ? 'aspect-[4/3]' : 'aspect-square'}`}>
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/30 transition-all duration-400 flex items-end p-4">
                  <span className="text-bone text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    {photo.caption}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-obsidian/95 flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-bone/60 hover:text-gold transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.url}
                alt={lightbox.caption}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="mt-4 text-center text-bone/60 text-xs tracking-widest uppercase">
                {lightbox.caption}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}