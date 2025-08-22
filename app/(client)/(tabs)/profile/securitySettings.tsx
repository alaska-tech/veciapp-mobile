import React, { useState } from "react";
import { ScrollView, View, TextInput, TouchableOpacity as RNTouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Eye, EyeOff, LockKeyhole, MapPin } from "lucide-react-native";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "~/components/ui/dialog";
import { validatePassword } from "~/lib/validations";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import useCustomerAction from "~/actions/customer.action";

export default function SecuritySettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const customerActions = useCustomerAction();
  const customer = customerActions.getCustomerDetails(user?.foreignPersonId);
  const { fullName = "", email = "", address = '{"address":"Desconocido"}' } = customer.data ?? {};
  const parsedAddress = JSON.parse(address);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = () => {
    const newPasswordError = validatePassword(newPassword);
    if (newPasswordError) {
      setPasswordErrors({ ...passwordErrors, newPassword: newPasswordError });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrors({ ...passwordErrors, confirmPassword: "Las contraseñas no coinciden" });
      return;
    }

    alert("Contraseña actualizada con éxito");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors({ newPassword: "", confirmPassword: "" });
  };

  const handleDeleteAccount = () => {
    // Aquí iría la lógica para solicitar eliminación de cuenta
    router.replace("/");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Seguridad",
          headerTitleAlign: "center",
          headerShown: true,
          headerBackTitle: "Volver",
          headerBackVisible: true,
        }}
      />

      <ScrollView className="h-full w-full bg-white p-4">
        <Card className="mb-6 rounded-3xl">
          <CardContent className="pt-6">
            <View className="flex-col items-center justify-center gap-2">
              <Avatar alt="avatar" className="h-20 w-20">
                <AvatarImage source={{ uri: "https://picsum.photos/200" }} />
                <AvatarFallback>
                  <Text>US</Text>
                </AvatarFallback>
              </Avatar>
              <View className="items-center gap-1 mt-2">
                <Text className="text-xl font-semibold">{fullName}</Text>
                <Text className="text-muted-foreground">{email}</Text>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <MapPin size={14} color="#ef4444" />
                  <Text className="text-muted-foreground">{parsedAddress?.address || ""}</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        <View className="gap-4">
          <View className="mb-4">
            <Text className="text-base font-medium mb-2">Nueva contraseña</Text>
            <View className="border border-gray-200 rounded-lg p-3 flex-row items-center relative">
              <TextInput
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setPasswordErrors({ ...passwordErrors, newPassword: "" });
                }}
                placeholder="Ingresa una nueva contraseña"
                secureTextEntry={!isNewPasswordVisible}
                className="text-base flex-1 pr-10"
              />
              <RNTouchableOpacity
                className="absolute right-3 top-0 bottom-0 justify-center"
                onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
              >
                {isNewPasswordVisible ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </RNTouchableOpacity>
            </View>
            {passwordErrors.newPassword ? (
              <Text className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</Text>
            ) : null}
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2">Confirmar contraseña</Text>
            <View className="border border-gray-200 rounded-lg p-3 flex-row items-center relative">
              <TextInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setPasswordErrors({ ...passwordErrors, confirmPassword: "" });
                }}
                placeholder="Confirma tu nueva contraseña"
                secureTextEntry={!isConfirmPasswordVisible}
                className="text-base flex-1 pr-10"
              />
              <RNTouchableOpacity
                className="absolute right-3 top-0 bottom-0 justify-center"
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              >
                {isConfirmPasswordVisible ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </RNTouchableOpacity>
            </View>
            {passwordErrors.confirmPassword ? (
              <Text className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</Text>
            ) : null}
          </View>

          <Button className="w-full bg-[#FFD100] rounded-full py-6 mb-2" onPress={handleChangePassword}>
            <Text className="text-black text-base font-medium">Cambiar Contraseña</Text>
          </Button>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2">Email</Text>
            <View className="border border-gray-200 rounded-lg p-3 flex-row items-center justify-between">
              <TextInput value={email} editable={false} className="text-base flex-1" />
              <LockKeyhole size={20} color="#000" />
            </View>
            <Text className="text-sm text-gray-500 mt-1">
              Para cambiar tu correo electrónico ponte en contacto con Maleua
            </Text>
          </View>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-red-500 rounded-full mt-4 py-6 mb-8">
                <Text className="text-white text-base font-medium">Eliminar cuenta</Text>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Estás seguro de eliminar tu cuenta?</DialogTitle>
                <DialogDescription>
                  Esta acción es permanente y no se puede deshacer. Se eliminarán todos tus datos y configuraciones de la plataforma.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="border-gray-200 rounded-full">
                    <Text>Cancelar</Text>
                  </Button>
                </DialogClose>
                <Button className="bg-red-500 rounded-full" onPress={handleDeleteAccount}>
                  <Text className="text-white">Confirmar</Text>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </View>
      </ScrollView>
    </>
  );
} 