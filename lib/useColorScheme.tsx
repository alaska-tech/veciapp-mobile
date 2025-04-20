import { useColorScheme as useNativewindColorScheme } from 'nativewind';

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();
  return {
    colorScheme: 'light', // Forzar modo claro
    isDarkColorScheme: false, // Siempre falso
    setColorScheme: () => setColorScheme('light'), // Siempre establecer modo claro
    toggleColorScheme: () => {}, // No hacer nada al intentar cambiar
  };
}
