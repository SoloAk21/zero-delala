import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../../services/propertyService';
import { useTranslation } from '../../hooks/useTranslation';
import { useTelegram } from '../../providers/TelegramProvider';
import { Building2, MapPin } from 'lucide-react';

interface PropertyMapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
}

const createPricePinIcon = (price: number, isSale: boolean) => {
  const formattedPrice =
    price >= 1000000 ? `${(price / 1000000).toFixed(1)}M` : `${(price / 1000).toFixed(0)}K`;

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="px-2 py-1 rounded-full text-[11px] font-extrabold shadow-lg flex items-center gap-1 border cursor-pointer ${
        isSale
          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
          : 'bg-blue-500 text-white border-blue-400'
      }">
        <span>${formattedPrice} ETB</span>
      </div>
    `,
    iconSize: [60, 24],
    iconAnchor: [30, 12]
  });
};

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  center = [9.0192, 38.7525],
  zoom = 12
}) => {
  const { isAmharic } = useTranslation();
  const { hapticImpact } = useTelegram();

  const mapProperties = properties.map((prop, idx) => {
    const lat = prop.location?.latitude || center[0] + (idx % 2 === 0 ? 0.012 : -0.01) * (idx + 1);
    const lng =
      prop.location?.longitude || center[1] + (idx % 3 === 0 ? -0.015 : 0.014) * (idx + 1);
    return { ...prop, lat, lng };
  });

  return (
    <div className="h-[65vh] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full bg-slate-900"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapProperties.map((prop) => (
          <Marker
            key={prop.id}
            position={[prop.lat, prop.lng]}
            icon={createPricePinIcon(prop.price, prop.listingType === 'FOR_SALE')}
            eventHandlers={{
              click: () => hapticImpact('light')
            }}
          >
            <Popup>
              <div className="w-48 p-1 text-slate-900 space-y-1">
                {prop.images.length > 0 ? (
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-20 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500">
                    <Building2 className="w-6 h-6" />
                  </div>
                )}
                <span className="text-[10px] font-extrabold uppercase text-emerald-600 block">
                  {prop.price.toLocaleString()} ETB
                </span>
                <p className="text-xs font-bold line-clamp-1">
                  {isAmharic && prop.titleAmharic ? prop.titleAmharic : prop.title}
                </p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {prop.location?.region || 'Addis Ababa'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
