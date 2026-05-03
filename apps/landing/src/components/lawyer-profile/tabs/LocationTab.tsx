import { MapPin } from 'lucide-react';
import { SurfaceCard } from '@okil-chai/ui';

export function LocationTab() {
  return (
    <SurfaceCard radius="xl" elevation="sm" padding="none" className="overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="font-heading text-xl font-semibold text-navy mb-2">Office Location</h3>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="size-4 text-gold mt-0.5 shrink-0" aria-hidden />
          <div>
            <p>247 Gulshan Avenue, Dhaka 1212, Bangladesh</p>
            <p className="text-gray-400 text-xs mt-0.5">Floor 8, Suite 802 · Open 9am–6pm</p>
          </div>
        </div>
      </div>
      <div className="relative h-80">
        <iframe
          title="Office Location Map"
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          src="https://www.openstreetmap.org/export/embed.html?bbox=90.4050%2C23.7850%2C90.4250%2C23.8000&layer=mapnik&marker=23.7925%2C90.4150"
          loading="lazy"
        />
        <div className="absolute bottom-4 right-4">
          <a
            href="https://www.openstreetmap.org/?mlat=23.7925&mlon=90.4150#map=16/23.7925/90.4150"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-navy text-white font-sans text-xs font-medium px-3.5 py-2 rounded-lg shadow-md hover:bg-navy-light transition-colors"
          >
            Get Directions
          </a>
        </div>
      </div>
    </SurfaceCard>
  );
}
