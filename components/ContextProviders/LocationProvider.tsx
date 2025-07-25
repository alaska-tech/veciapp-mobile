import { createContext, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";

export interface LocationData {
  latitude: number;
  longitude: number;
}

interface ContextType {
  location: LocationData | null;
  tryGetCurrentLocation: () => void;
  error: string | null;
  isLoading: boolean;
}

const LocationContext = createContext<ContextType>({} as ContextType);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<ContextType["location"]>(null);

  async function getCurrentLocation() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      console.log("Current location:", latitude, longitude);
      setLocation({
        latitude,
        longitude,
      });
    } catch (error) {
      setErrorMsg("Error getting location");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        isLoading,
        tryGetCurrentLocation: getCurrentLocation,
        error: errorMsg,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
