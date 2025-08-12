import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import {
  addProductToCart,
  deleteItemFromCart,
  fetchCartItemsByCustomerId,
  updateProductQuatityInCart,
} from "~/actions/shoppingCart.action";
import { ShoppingCartItem } from "~/constants/models";

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
  updateCartItemQuantity: (
    productServiceId: string,
    quantity: number,
    price: number
  ) => void;
  removeCartItem: (productServiceId: string) => void;

  // Helpers
  getTotalItemsCount: () => number;
}
type MyPersist = PersistOptions<CartState>;

export const useCartStore = create<CartState>()(
  persist<CartState, [], [], MyPersist>(
    (set, get) => ({
      cartItems: [],
      customerId: null,
      loading: false,
      error: null,

      initCart: async (clientId: string) => {
        set({ loading: true, error: null, customerId: clientId });

        try {
          const data = await fetchCartItemsByCustomerId(clientId);
          const sortedShoppingCarts =
            data?.data?.shoppingCarts.sort((a, b) =>
              (a.updatedAt ?? "").localeCompare(b.updatedAt ?? "")
            ) || [];
          set({
            cartItems: sortedShoppingCarts,
          });
        } catch (err) {
          console.error("Error cargando carrito:", err);
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
      addCartItem: async (item) => {
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
          await addProductToCart({
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

      updateCartItemQuantity: async (productServiceId, quantity, price) => {
        const { cartItems } = get();
        try {
          if (quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
          }
          if (!productServiceId) {
            throw new Error("ProductServiceId is required");
          }

          set(() => {
            const newItems = [...cartItems];
            const index = newItems.findIndex(
              (item) => item.productServiceId === productServiceId
            );
            if (newItems[index]) {
              newItems[index].quantity = quantity;
            }
            return { cartItems: newItems };
          });
          const item = cartItems.find(
            (item) => item.productServiceId === productServiceId
          );
          if (!item) {
            throw new Error("Item not found in cart");
          }
          await updateProductQuatityInCart(item.id!, {
            productServiceId,
            quantity,
            price: price,
          });
        } catch (error) {
          console.error("Error updating item quantity in cart:", error);
        }
      },
      removeCartItem: async (productServiceId: string) => {
        const { cartItems } = get();
        try {
          if (!productServiceId) {
            throw new Error("ProductServiceId is required");
          }
          const index = cartItems.findIndex(
            (item) => item.productServiceId === productServiceId
          );
          const cartEntry = cartItems.find(
            (item) => item.productServiceId === productServiceId
          );
          if (!cartEntry?.id) {
            throw new Error("Item not found in cart");
          }
          set((state) => ({
            cartItems: state.cartItems.filter((_, i) => i !== index),
          }));
          await deleteItemFromCart(cartEntry?.id);
        } catch (error) {
          console.error("Error removing item from cart:", error);
        }
      },

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
