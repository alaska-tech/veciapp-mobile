import { View, Text } from "react-native";
import useAuthAction from "~/actions/auth.action";
import { Button } from "~/components/ui/button";

export default function VendorHome() {
  const authActions = useAuthAction();
  const logOut = authActions.logOut();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>Welcome cachón 3</Text>
      <Button
        onPress={() => {
          logOut.mutateAsync({});
        }}
        
      ><Text>Log out</Text>
      </Button>
    </View>
  );
}
