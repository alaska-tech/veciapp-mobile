import { createContext, useContext, useEffect, useState } from "react";
import { Parameter } from "~/constants/models";
import { refreshParameters } from "~/actions/parameter.action";

interface ContextType {
  parameters: Parameter[];
  loading: boolean;
}

const ParametersContext = createContext<ContextType>({} as ContextType);

export function ParametersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [parameters, setParameters] = useState<ContextType["parameters"]>([]);
  useEffect(() => {
    async function tryrefreshParameters() {
      try {
        const parameters = await refreshParameters();
        if (!parameters) {
          return;
        }
        setParameters(parameters);
      } catch (error) {
        console.error("refreshing parameters failed:", error);
      } finally {
        setLoading(false);
      }
    }

    tryrefreshParameters();
  }, []);

  return (
    <ParametersContext.Provider value={{ parameters, loading }}>
      {children}
    </ParametersContext.Provider>
  );
}

export const useParameters = () => useContext(ParametersContext);
