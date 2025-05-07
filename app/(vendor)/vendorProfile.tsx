import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { 
  Store, 
  Settings, 
  Clock, 
  Bell, 
  LogOut,
  ChevronRight 
} from "lucide-react-native";
import { Separator } from "~/components/ui/separator";

export default function VendorProfileScreen() {
  return (
    <ScrollView className="h-full w-full p-4 mt-12">
      <Card className="mb-6 pt-8 rounded-3xl">
        <CardContent>
          <View className="flex-col items-center justify-center gap-2">
            <Avatar alt="avatar" className="h-20 w-20">
              <AvatarImage source={{ uri: "https://picsum.photos/200" }} />
              <AvatarFallback>
                <Text>VS</Text>
              </AvatarFallback>
            </Avatar>
            <View className="items-center gap-1">
              <Text className="text-xl font-semibold">Vendor Store</Text>
              <Text className="text-muted-foreground">
                vendor.store@example.com
              </Text>
              <Text className="text-muted-foreground">
                Calle 123 #45-67, Centro
              </Text>
            </View>
          </View>

          <Button
            className="w-full flex-row items-center mt-4 bg-yellow-400 rounded-full gap-2"
            size="lg"
          >
            <Store className="h-5 w-5" color="#000" />
            <Text className="text-black text-xl">Manage Store</Text>
          </Button>
        </CardContent>
      </Card>

      <View className="gap-4">
        <Button
          className="w-full flex-row items-center justify-between"
          variant="ghost"
        >
          <View className="flex-row items-center gap-2">
            <Settings className="h-5 w-5 mr-3" color="#000000"/>
            <Text>Store Settings</Text>
          </View>
          <ChevronRight className="h-5 w-5" color="#000000"/>
        </Button>

        <Separator />

        <Button
          className="w-full flex-row items-center justify-between"
          variant="ghost"
        >
          <View className="flex-row items-center gap-2">
            <Clock className="h-5 w-5 mr-3" color="#000000"/>
            <Text>Business Hours</Text>
          </View>
          <ChevronRight className="h-5 w-5" color="#000000"/>
        </Button>

        <Separator />

        <Button
          className="w-full flex-row items-center justify-between"
          variant="ghost"
        >
          <View className="flex-row items-center gap-2">
            <Bell className="h-5 w-5 mr-3" color="#000000"/>
            <Text>Notifications</Text>
          </View>
          <ChevronRight className="h-5 w-5" color="#000000"/>
        </Button>

        <Separator />

        <Button
          className="w-full flex-row items-center justify-between"
          variant="ghost"
        >
          <View className="flex-row items-center gap-2">
            <LogOut className="h-5 w-5 mr-3" color="rgb(239 68 68)"/>
            <Text className="text-destructive">Sign Out</Text>
          </View>
          <ChevronRight className="h-5 w-5" color="#000000"/>
        </Button>
      </View>
    </ScrollView>
  );
}