import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import {
  addProductToCart,
  fetchCartItemsByCustomerId,
  updateCart,
} from "~/actions/shoppingCart.action";
import { ShoppingCartItem } from "~/constants/models";

// Definir interfaces para mayor seguridad de tipos
export interface CartItem {
  productServiceId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
export interface ShoppingCartStore {
  customerId: string;
  shoppingCarts: Array<ShoppingCartItem>;
}
interface CartState {
  customerId: string | null;
  loading: boolean;
  error: string | null;
  cartItems: Array<ShoppingCartItem>;

  initCart: (clientId: string) => Promise<void>;
  refresh: () => void;

  // Acciones para comidas
  addCartItem: (item: ShoppingCartItem) => void;
  updateCartItemQuantity: (index: number, quantity: number) => void;
  removeCartItem: (index: number) => void;

  // Helpers
  getTotalItemsCount: () => number;
}
type MyPersist = PersistOptions<CartState>;

export const useCartStore = create<CartState>()(
  persist<CartState, [], [], MyPersist>(
    (set, get) => ({
      // Estado inicial
      cartItems: [],
      customerId: null,
      loading: false,
      error: null,

      // Inicializa el carrito
      initCart: async (clientId: string) => {
        set({ loading: true, error: null, customerId: clientId });

        try {
          const data = await fetchCartItemsByCustomerId(clientId);
          console.log("Cart data:", data);
          set({
            cartItems: data?.data?.shoppingCarts || [],
          });
        } catch (err) {
          console.log("Error cargando carrito:", err);
        } finally {
          set({ loading: false });
        }
      },
      refresh: () => {
        const { customerId, initCart } = get();
        if (customerId) {
          initCart(customerId);
        }
      },
      // Acciones para comidas
      addCartItem: (item) => {
        const { customerId } = get();
        try {
          if (!customerId) {
            throw new Error("There is not customerId");
          }
          set((state) => {
            const existingIndex = state.cartItems.findIndex(
              (ci) => ci.productServiceId === item.productServiceId
            );
            if (existingIndex !== -1) {
              // Ya existe, suma las cantidades
              const updatedItems = [...state.cartItems];
              updatedItems[existingIndex] = {
                ...updatedItems[existingIndex],
                quantity: updatedItems[existingIndex].quantity + item.quantity,
              };
              return { cartItems: updatedItems };
            } else {
              // No existe, agregar al final
              return { cartItems: [...state.cartItems, item] };
            }
          });
          addProductToCart({
            customerId,
            productServiceId: item.productServiceId,
            quantity: item.quantity,
            unitPrice: item.unitPrice || 0,
            branchId: item.branchId,
          });
        } catch (error) {
          console.error("Error adding item to cart:", error);
        }
      },

      updateCartItemQuantity: (index, quantity) =>
        set((state) => {
          const newItems = [...state.cartItems];
          if (newItems[index]) {
            newItems[index].quantity = quantity;
          }
          return { cartItems: newItems };
        }),

      removeCartItem: (index) =>
        set((state) => ({
          cartItems: state.cartItems.filter((_, i) => i !== index),
        })),

      // Helper para obtener el número total de elementos en el carrito ,
      //  @podria descartarlo pero lo dejo como referencia por si necesito operaciones mas complejas en el futuro
      getTotalItemsCount: () => {
        const { cartItems } = get();
        const foodCount = cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        return foodCount;
      },
    }),
    {
      name: "cart-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);

// Helper para extraer la cantidad total con una suscripción optimizada
export const useCartItemsCount = () =>
  useCartStore((state) => {
    const foodItems = state.cartItems;
    return foodItems.reduce((sum, item) => sum + item.quantity, 0);
  });

export const useCartItemsByBranch = () =>
  useCartStore((state) => {
    const cartItemsByBranch = state.cartItems.reduce<
      Record<string, ShoppingCartItem[]>
    >((acc, item) => {
      if (!acc[item.branchId]) acc[item.branchId] = [];
      acc[item.branchId].push(item);
      return acc;
    }, {});
    return cartItemsByBranch;
  });
