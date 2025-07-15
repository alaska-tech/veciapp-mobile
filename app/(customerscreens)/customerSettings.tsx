import React, { useState } from "react";
import {
  ScrollView,
  View,
  TextInput,
  TouchableOpacity as RNTouchableOpacity,
} from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  Bell,
  MapPin,
  Plus,
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { validatePassword } from "~/lib/validations";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import useCustomerAction from "~/actions/customer.action";

interface Direccion {
  id: string;
  direccion: string;
  tipo: string;
}

export default function CustomerSettingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");

  // Password related states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { user } = useAuth();
  const customerActions = useCustomerAction();
  const customer = customerActions.getCustomerDetails(user?.foreignPersonId);
  const { fullName = "", email = "", locations = [] } = customer.data ?? {};

  const agregarNuevaDireccion = () => {
    router.push("/newLocation");
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(false);
    router.replace("/");
  };

  const validatePasswordFields = (): boolean => {
    if (!currentPassword) {
      setPasswordErrors({
        ...passwordErrors,
        currentPassword: "La contraseña actual es requerida",
      });
      return false;
    }

    const newPasswordError = validatePassword(newPassword);
    if (newPasswordError) {
      setPasswordErrors({
        ...passwordErrors,
        newPassword: newPasswordError,
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrors({
        ...passwordErrors,
        confirmPassword: "Las contraseñas no coinciden",
      });
      return false;
    }

    return true;
  };

  const handleChangePassword = () => {
    if (validatePasswordFields()) {
      alert("Contraseña actualizada con éxito");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Ajustes de Usuario",
          headerTitleAlign: "center",
          headerShown: true,
          headerBackTitle: "Volver",
          headerBackVisible: true,
        }}
      />

      <ScrollView className="h-full w-full bg-white p-4 mb-16">
        <Card className="mb-6 rounded-3xl">
          <CardContent className="pt-6">
            <View className="flex-col items-center justify-center gap-2">
              <Avatar alt="avatar" className="h-20 w-20">
                <AvatarImage source={{ uri: "https://picsum.photos/200" }} />
                <AvatarFallback>
                  <Text>JD</Text>
                </AvatarFallback>
              </Avatar>
              <View className="items-center gap-1">
                <Text className="text-xl font-semibold">{fullName}</Text>
                <Text className="text-muted-foreground">{email}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <View className="mb-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="flex-row w-full mb-4 bg-gray-100">
              <TabsTrigger
                value="general"
                onPress={() => setActiveTab("general")}
                className="flex-1 justify-center bg-transparent rounded-lg"
                style={
                  activeTab === "general" ? { backgroundColor: "white" } : {}
                }
              >
                <Text
                  className={activeTab === "general" ? "font-semibold" : ""}
                >
                  General
                </Text>
              </TabsTrigger>
              {/* <TabsTrigger
                value="seguridad"
                onPress={() => setActiveTab("seguridad")}
                className="flex-1 justify-center bg-transparent rounded-lg"
                style={
                  activeTab === "seguridad" ? { backgroundColor: "white" } : {}
                }
              >
                <Text
                  className={activeTab === "seguridad" ? "font-semibold" : ""}
                >
                  Seguridad
                </Text>
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="general" className="w-full">
              <ScrollView className="gap-4 mb-24">
                {/* <Text>{JSON.stringify(customer.data)}</Text>  */}
                {locations.map((item, index) => (
                  <View key={index}>
                    <Text className="text-base font-medium mb-2">
                      Dirección {index + 1}
                    </Text>
                    <View className="border border-gray-200 rounded-lg p-2 mb-2">
                      <TextInput
                        value={item.address || "Desconocido"}
                        className="text-base"
                      />
                      <View className="flex-row start items-center">
                        <Text className="text-gray-500">Tipo: </Text>
                        <Text>{item.alias}</Text>
                      </View>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  className="border border-gray-200 rounded-full p-4 flex-row items-center justify-center mb-1"
                  onPress={agregarNuevaDireccion}
                >
                  <Plus size={20} color="#000" />
                  <Text className="ml-2 text-base">
                    Agregar Nueva Ubicación
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </TabsContent>

            {/*  <TabsContent value="seguridad" className="w-full">
              <View className="gap-4">
                <View className="mb-2">
                  <Text className="text-base font-medium mb-2">
                    Contraseña actual
                  </Text>
                  <View className="border border-gray-200 rounded-lg p-3 flex-row items-center relative">
                    <TextInput
                      value={currentPassword}
                      onChangeText={(text) => {
                        setCurrentPassword(text);
                        setPasswordErrors({
                          ...passwordErrors,
                          currentPassword: "",
                        });
                      }}
                      placeholder="Ingresa tu contraseña actual"
                      secureTextEntry={!isCurrentPasswordVisible}
                      className="text-base flex-1 pr-10"
                    />
                    <RNTouchableOpacity
                      className="absolute right-3 top-0 bottom-0 justify-center"
                      onPress={() =>
                        setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                      }
                    >
                      {isCurrentPasswordVisible ? (
                        <EyeOff size={20} color="#666" />
                      ) : (
                        <Eye size={20} color="#666" />
                      )}
                    </RNTouchableOpacity>
                  </View>
                  {passwordErrors.currentPassword ? (
                    <Text className="text-red-500 text-xs mt-1">
                      {passwordErrors.currentPassword}
                    </Text>
                  ) : null}
                </View>

                <View className="mb-4">
                  <Text className="text-base font-medium mb-2">
                    Nueva contraseña
                  </Text>
                  <View className="border border-gray-200 rounded-lg p-3 flex-row items-center relative">
                    <TextInput
                      value={newPassword}
                      onChangeText={(text) => {
                        setNewPassword(text);
                        setPasswordErrors({
                          ...passwordErrors,
                          newPassword: "",
                        });
                      }}
                      placeholder="Ingresa una nueva contraseña"
                      secureTextEntry={!isNewPasswordVisible}
                      className="text-base flex-1 pr-10"
                    />
                    <RNTouchableOpacity
                      className="absolute right-3 top-0 bottom-0 justify-center"
                      onPress={() =>
                        setIsNewPasswordVisible(!isNewPasswordVisible)
                      }
                    >
                      {isNewPasswordVisible ? (
                        <EyeOff size={20} color="#666" />
                      ) : (
                        <Eye size={20} color="#666" />
                      )}
                    </RNTouchableOpacity>
                  </View>
                  {passwordErrors.newPassword ? (
                    <Text className="text-red-500 text-xs mt-1">
                      {passwordErrors.newPassword}
                    </Text>
                  ) : null}
                </View>

                <View className="mb-4">
                  <Text className="text-base font-medium mb-2">
                    Confirmar contraseña
                  </Text>
                  <View className="border border-gray-200 rounded-lg p-3 flex-row items-center relative">
                    <TextInput
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        setPasswordErrors({
                          ...passwordErrors,
                          confirmPassword: "",
                        });
                      }}
                      placeholder="Confirma tu nueva contraseña"
                      secureTextEntry={!isConfirmPasswordVisible}
                      className="text-base flex-1 pr-10"
                    />
                    <RNTouchableOpacity
                      className="absolute right-3 top-0 bottom-0 justify-center"
                      onPress={() =>
                        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                      }
                    >
                      {isConfirmPasswordVisible ? (
                        <EyeOff size={20} color="#666" />
                      ) : (
                        <Eye size={20} color="#666" />
                      )}
                    </RNTouchableOpacity>
                  </View>
                  {passwordErrors.confirmPassword ? (
                    <Text className="text-red-500 text-xs mt-1">
                      {passwordErrors.confirmPassword}
                    </Text>
                  ) : null}
                </View>

                <Button
                  className="w-full bg-[#FFD100] rounded-full py-6 mb-2"
                  onPress={handleChangePassword}
                >
                  <Text className="text-black text-base font-medium">
                    Cambiar Contraseña
                  </Text>
                </Button>

                <View className="mb-4">
                  <Text className="text-base font-medium mb-2">Email</Text>
                  <View className="border border-gray-200 rounded-lg p-3 flex-row items-center justify-between">
                    <TextInput
                      defaultValue="juan.doe@example.com"
                      editable={false}
                      className="text-base flex-1"
                    />
                    <LockKeyhole size={20} color="#000" />
                  </View>
                  <Text className="text-sm text-gray-500 mt-1">
                    Para cambiar tu correo electrónico ponte en contacto con
                    Maleua
                  </Text>
                </View>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-red-500 rounded-full mt-4 py-6 mb-8">
                      <Text className="text-white text-base font-medium">
                        Solicitar dar de baja
                      </Text>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        ¿Estás seguro de solicitar dar de baja?
                      </DialogTitle>
                      <DialogDescription>
                        Esta acción es permanente y no se puede deshacer. Se
                        enviara una solicitud a Maleua para eliminar tu cuenta y
                        se eliminarán todos tus datos y configuraciones de la
                        plataforma.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" className="border-gray-200">
                          <Text>Cancelar</Text>
                        </Button>
                      </DialogClose>
                      <Button
                        className="bg-red-500"
                        onPress={handleDeleteAccount}
                      >
                        <Text className="text-white">Confirmar</Text>
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </View>
            </TabsContent> */}
          </Tabs>
        </View>
      </ScrollView>
    </>
  );
}
