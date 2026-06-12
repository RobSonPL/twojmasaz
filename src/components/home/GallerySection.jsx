import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const photos = [
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=85&auto=format&fit=crop',
    caption: 'Masaż relaksacyjny',
    span: 'row-span-2',
  },
  {
    url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=700&q=85&auto=format&fit=crop',
    caption: 'Aromaterapia',
    span: '',
  },
  {
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=700&q=85&auto=format&fit=crop',
    caption: 'Masaż terapeutyczny',
    span: '',
  },
  {
    url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=900&q=85&auto=format&fit=crop',
    caption: 'Strefa relaksu',
    span: '',
  },
  {
    url: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=900&q=85&auto=format&fit=crop',
    caption: 'Profesjonalne zabiegi',
    span: 'row-span-2',
  },
  {
    url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=700&q=85&auto=format&fit=crop',
    caption: 'Pielęgnacja twarzy',
    span: '',
  },
];

function PhotoCard({ photo, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      onClick={onClick}
      className={`cursor-pointer group relative overflow-hidden bg-muted ${photo.span}`}
    >
      <img
        src={photo.url}
        alt={photo.caption}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        style={{ minHeight: '220px' }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-400 flex flex-col items-center justify-center gap-2">
        <ZoomIn
          size={26}
          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <span className="text-white text-xs tracking-[0.25em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
          {photo.caption}
        </span>
      </div>
      {/* Bottom label always visible */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-0 pointer-events-none" />
    </motion.div>
  );
}

export default function GallerySection() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="galeria" className="py-28 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gold text-xs tracking-[0.4em] uppercase"
            >
              Klimat &amp; przestrzeń
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="font-display text-4xl lg:text-6xl mt-3 text-foreground leading-tight"
            >
              Zajrzyj<br />do nas
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="text-muted-foreground text-lg max-w-sm lg:pb-2"
          >
            Ciepłe światło, naturalne aromaty i cisza — przestrzeń stworzona z myślą o głębokim relaksie.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 auto-rows-[220px] gap-3">
          {photos.map((photo, i) => (
            <PhotoCard key={i} photo={photo} index={i} onClick={() => setLightbox(photo)} />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10"
            style={{ backgroundColor: 'rgba(5,5,5,0.96)' }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-white/60 transition-all"
              onClick={() => setLightbox(null)}
            >
              <X size={18} />
            </button>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.url}
                alt={lightbox.caption}
                className="w-full object-contain mx-auto"
                style={{ maxHeight: '82vh' }}
              />
              <p className="mt-4 text-center text-white/40 text-xs tracking-[0.3em] uppercase">
                {lightbox.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}