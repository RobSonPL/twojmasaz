import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const photos = [
  {
    url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=900&q=80&auto=format&fit=crop',
    caption: 'Strefa relaksu',
    tall: true,
  },
  {
    url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=700&q=80&auto=format&fit=crop',
    caption: 'Aromaterapia',
    tall: false,
  },
  {
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=700&q=80&auto=format&fit=crop',
    caption: 'Masaż terapeutyczny',
    tall: false,
  },
  {
    url: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=900&q=80&auto=format&fit=crop',
    caption: 'Profesjonalne zabiegi',
    tall: false,
  },
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80&auto=format&fit=crop',
    caption: 'Masaż sportowy',
    tall: false,
  },
  {
    url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=700&q=80&auto=format&fit=crop',
    caption: 'Pielęgnacja twarzy',
    tall: true,
  },
];

function PhotoCard({ photo, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.55 }}
      className="cursor-pointer group relative overflow-hidden bg-gray-100"
      style={{ height: photo.tall ? '400px' : '260px' }}
      onClick={onClick}
    >
      <img
        src={photo.url}
        alt={photo.caption}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-400 flex flex-col items-center justify-center">
        <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2" />
        <span className="text-white text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
          {photo.caption}
        </span>
      </div>
    </motion.div>
  );
}

export default function GallerySection() {
  const [lightbox, setLightbox] = useState(null);

  const col1 = photos.filter((_, i) => i % 3 === 0);
  const col2 = photos.filter((_, i) => i % 3 === 1);
  const col3 = photos.filter((_, i) => i % 3 === 2);

  return (
    <section id="galeria" className="py-32 bg-white">
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
            <p className="text-gray-500 text-lg max-w-lg">
              Przestrzeń zaprojektowana z myślą o pełnym wyciszeniu — ciepłe światło, naturalne aromaty i cisza, która pozwala naprawdę odpocząć.
            </p>
          </motion.div>
        </div>

        {/* 3-column masonry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* col 1 */}
          <div className="flex flex-col gap-3">
            {col1.map((photo, i) => (
              <PhotoCard key={i} photo={photo} index={i * 3} onClick={() => setLightbox(photo)} />
            ))}
          </div>
          {/* col 2 */}
          <div className="flex flex-col gap-3 lg:mt-10">
            {col2.map((photo, i) => (
              <PhotoCard key={i} photo={photo} index={i * 3 + 1} onClick={() => setLightbox(photo)} />
            ))}
          </div>
          {/* col 3 */}
          <div className="hidden lg:flex flex-col gap-3 lg:mt-20">
            {col3.map((photo, i) => (
              <PhotoCard key={i} photo={photo} index={i * 3 + 2} onClick={() => setLightbox(photo)} />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ backgroundColor: 'rgba(10,10,10,0.95)' }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-white opacity-60 hover:opacity-100 transition-opacity"
              onClick={() => setLightbox(null)}
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.url}
                alt={lightbox.caption}
                className="max-w-full max-h-screen object-contain mx-auto"
                style={{ maxHeight: '80vh' }}
              />
              <div className="mt-4 text-center text-white text-opacity-60 text-xs tracking-widest uppercase">
                {lightbox.caption}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}