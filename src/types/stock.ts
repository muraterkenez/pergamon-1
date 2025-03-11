import { z } from 'zod';

// Stok kategorileri
export const StockCategory = {
  FEED: 'feed',
  RAW_MATERIAL: 'raw_material',
  VETERINARY: 'veterinary',
  DAIRY_PRODUCT: 'dairy_product',
  EQUIPMENT: 'equipment',
} as const;

export type StockCategory = typeof StockCategory[keyof typeof StockCategory];

// Birim türleri
export const UnitType = {
  KG: 'kg',
  LITER: 'liter',
  PIECE: 'piece',
  BOX: 'box',
  PACKAGE: 'package',
} as const;

export type UnitType = typeof UnitType[keyof typeof UnitType];

// Temel stok öğesi
export interface StockItem {
  id: string;
  name: string;
  category: StockCategory;
  sku: string; // Stok Takip Numarası
  barcode?: string;
  unit: UnitType;
  quantity: number;
  minQuantity: number; // Minimum stok seviyesi
  maxQuantity: number; // Maksimum stok seviyesi
  location: string;
  price: number;
  expiryDate?: Date;
  lastUpdated: Date;
  description?: string;
}

// Yem stok öğesi
export interface FeedStockItem extends StockItem {
  category: typeof StockCategory.FEED;
  type: 'concentrate' | 'roughage' | 'mineral' | 'supplement';
  nutritionalValue?: {
    protein: number;
    energy: number;
    fiber: number;
    moisture: number;
  };
}

// Hammadde stok öğesi
export interface RawMaterialStockItem extends StockItem {
  category: typeof StockCategory.RAW_MATERIAL;
  type: 'silage' | 'hay' | 'grain' | 'additive';
  moisture?: number;
  origin?: string;
}

// Veteriner malzemesi stok öğesi
export interface VeterinaryStockItem extends StockItem {
  category: typeof StockCategory.VETERINARY;
  type: 'medicine' | 'vaccine' | 'supply' | 'equipment';
  activeIngredient?: string;
  dosageForm?: string;
  storageConditions?: string;
  prescriptionRequired: boolean;
}

// Süt ürünü stok öğesi
export interface DairyProductStockItem extends StockItem {
  category: typeof StockCategory.DAIRY_PRODUCT;
  type: 'milk' | 'cheese' | 'yogurt' | 'butter';
  fatContent?: number;
  processingDate: Date;
  batchNumber: string;
}

// Stok hareketi
export interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out';
  quantity: number;
  date: Date;
  reference: string; // Fatura/İrsaliye no
  price: number;
  description?: string;
  performedBy: string;
}

// Tedarikçi
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  categories: StockCategory[];
  paymentTerms?: string;
  rating?: number;
  notes?: string;
}

// Sipariş
export interface Order {
  id: string;
  supplierId: string;
  items: OrderItem[];
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  orderDate: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  notes?: string;
}

// Sipariş kalemi
export interface OrderItem {
  itemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity?: number;
  notes?: string;
}

// Depo
export interface Warehouse {
  id: string;
  name: string;
  type: 'feed' | 'veterinary' | 'dairy' | 'general';
  location: string;
  capacity: number;
  temperature?: number;
  humidity?: number;
  sections: WarehouseSection[];
}

// Depo bölümü
export interface WarehouseSection {
  id: string;
  name: string;
  capacity: number;
  currentUtilization: number;
  items: string[]; // Stok öğesi ID'leri
}

// Stok sayımı
export interface Inventory {
  id: string;
  date: Date;
  status: 'pending' | 'in_progress' | 'completed';
  items: InventoryItem[];
  performedBy: string;
  notes?: string;
}

// Stok sayım kalemi
export interface InventoryItem {
  itemId: string;
  expectedQuantity: number;
  actualQuantity: number;
  difference: number;
  notes?: string;
}