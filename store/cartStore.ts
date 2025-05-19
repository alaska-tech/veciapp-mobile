import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

// Definir interfaces para mayor seguridad de tipos
export interface CartItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  salonItems: CartItem[];
  
  // Acciones para comidas
  addCartItem: (item: CartItem) => void;
  updateCartItemQuantity: (index: number, quantity: number) => void;
  removeCartItem: (index: number) => void;
  
  // Acciones para servicios de salón
  addSalonItem: (item: CartItem) => void;
  updateSalonItemQuantity: (index: number, quantity: number) => void;
  removeSalonItem: (index: number) => void;
  
  // Helpers
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  // Estado inicial
  cartItems: [
    {
      name: "Arroz con Coco Tradicional (Porción)",
      price: 15000,
      image: "https://picsum.photos/200",
      quantity: 1,
    },
    {
      name: "Tostadas de Pescado Frito",
      price: 22000,
      image: "https://picsum.photos/200",
      quantity: 1,
    },
    {
      name: "Ensalada de Frutas",
      price: 18000,
      image: "https://picsum.photos/200",
      quantity: 1,
    },
  ],
  
  salonItems: [
    {
      name: "Corte y Peinado Profesional",
      price: 45000,
      image: "https://picsum.photos/200",
      quantity: 1,
    },
  ],
  
  // Acciones para comidas
  addCartItem: (item) => set((state) => ({
    cartItems: [...state.cartItems, item]
  })),
  
  updateCartItemQuantity: (index, quantity) => set((state) => {
    const newItems = [...state.cartItems];
    if (newItems[index]) {
      newItems[index].quantity = quantity;
    }
    return { cartItems: newItems };
  }),
  
  removeCartItem: (index) => set((state) => ({
    cartItems: state.cartItems.filter((_, i) => i !== index)
  })),
  
  // Acciones para servicios de salón
  addSalonItem: (item) => set((state) => ({
    salonItems: [...state.salonItems, item]
  })),
  
  updateSalonItemQuantity: (index, quantity) => set((state) => {
    const newItems = [...state.salonItems];
    if (newItems[index]) {
      newItems[index].quantity = quantity;
    }
    return { salonItems: newItems };
  }),
  
  removeSalonItem: (index) => set((state) => ({
    salonItems: state.salonItems.filter((_, i) => i !== index)
  })),
  
  // Helper para obtener el número total de elementos en el carrito
  getTotalItemsCount: () => {
    const { cartItems, salonItems } = get();
    const foodCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const salonCount = salonItems.reduce((sum, item) => sum + item.quantity, 0);
    return foodCount + salonCount;
  }
}));

// Helper para extraer la cantidad total con una suscripción optimizada
export const useCartItemsCount = () => useCartStore(
  (state) => {
    // Este patrón fuerza una re-renderización cuando cambia la cantidad total
    const foodItems = state.cartItems;
    const salonItems = state.salonItems;
    
    return foodItems.reduce((sum, item) => sum + item.quantity, 0) +
           salonItems.reduce((sum, item) => sum + item.quantity, 0);
  }
); 