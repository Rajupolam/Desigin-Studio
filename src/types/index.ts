export type ScreenId = 'onboarding' | 'home' | 'explore' | 'detail' | 'checkout' | 'profile';

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  designer: string;
  price: number;
  rating: number;
  reviewsCount: number;
  category: 'Furniture' | 'Lighting' | 'Ceramics' | 'Objects' | 'Textiles';
  images: string[];
  description: string;
  materials: string[];
  dimensions: string;
  leadTime: string;
  finishes: {
    id: string;
    name: string;
    colorHex: string;
    image: string;
  }[];
  isTrending?: boolean;
  isCuratorsChoice?: boolean;
  lightingTier?: 'low' | 'high' | 'rated';
  lightingSpecs?: {
    colorTemperature: string;
    lumens?: number;
    dimmable?: boolean;
    powerSource?: string;
    cri?: string;
  };
}

export interface Story {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  coverImage: string;
  slides: {
    image: string;
    caption: string;
    quote?: string;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedFinishId: string;
}

export interface HotlinkImageItem {
  id: string;
  label: string;
  category: string;
  url: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface RoomScene {
  id: string;
  name: string;
  description: string;
  backgroundImage: string;
  lightingOptions: {
    id: string;
    label: string;
    filterClass: string;
  }[];
}

export interface Moodboard {
  id: string;
  title: string;
  roomType: string;
  itemIds: string[];
  notes: string;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  product: Product;
  finishName: string;
  price: number;
  status: 'In Transit' | 'Delivered' | 'In Production';
  serialNumber: string;
  artisanSignature: string;
  harvestLocation: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  location: string;
  membershipTier: string;
  savedItemIds: string[];
  ordersCount: number;
  moodboardsCount: number;
}

