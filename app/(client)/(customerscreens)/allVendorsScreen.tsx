import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Search, MapPin, Star } from "lucide-react-native";
import { useState, useRef } from "react";
import FilterSheet, {
  FilterSheetRef,
} from "~/components/epic/bottomSheetFilter";
import SearchOrderSheet, {
  SearchOrderSheetRef,
} from "~/components/epic/bottomSheetSearch";
import { Branch } from "~/constants/models";

export default function AllVendorsScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("Cerca de mi");
  const orderSheetRef = useRef<SearchOrderSheetRef>(null);
  const router = useRouter();
  const vendors = [
    {
      id: "625a5ccc-86af-4ff1-ac24-4154565e371b",
      vendorId: "56c0f0ba-35aa-4103-84f8-61079a4b4b24",
      name: "Salon de belleza ",
      location: {
        type: "Point",
        coordinates: [-74.190294, 11.225966],
      },
      distance: 0,
      address: "Consolata Mz C Lt 9",
      country: "Colombia",
      city: "Santa Marta",
      rank: 0,
      isActive: false,
      state: "created",
      stateHistory: [
        {
          state: "created",
          reason: "Tienda del Veci-proveedor creada por primera vez",
          changedAt: "2025-07-30T20:11:19.526Z",
        },
      ],
      businessType: "company",
      operatingHours: {
        friday: ["08:00", "18:00"],
        monday: ["02:20", "22:20"],
        sunday: null,
        tuesday: ["08:00", "18:00"],
        saturday: ["08:00", "15:00"],
        thursday: ["08:00", "18:00"],
        wednesday: ["08:00", "18:00"],
      },
      logo: null,
      managerName: "Farit Majul",
      managerPhone: "57 3008992753",
      images: [],
      isPickupAvailable: false,
      isDeliveryAvailable: true,
      availablePaymentMethods: [
        "Llaves",
        "Efectivo",
        "Nequi",
        "Transfiya",
        "Daviplata",
      ],
      description: "asdasdasd",
      createdAt: "2025-07-30T20:11:19.562Z",
      updatedAt: "2025-07-30T20:11:19.562Z",
    },
    {
      id: "9d1919c6-1976-4ab4-bd71-aa62ba3dae2f",
      vendorId: "516a7cff-3ee5-4bca-a98e-b02adc3e6e31",
      name: "Julian Angulo",
      location: {
        type: "Point",
        coordinates: [-74.190294, 11.225966],
      },
      distance: 0,
      address: "Jardines Mz F Lote 12 Etapa 1",
      country: "Colombia",
      city: "Santa Marta",
      rank: 0,
      isActive: false,
      state: "created",
      stateHistory: [
        {
          state: "created",
          reason: "Tienda del Veci-proveedor creada por primera vez",
          changedAt: "2025-07-28T21:05:44.083Z",
        },
      ],
      businessType: "company",
      operatingHours: {
        friday: null,
        monday: null,
        sunday: null,
        tuesday: null,
        saturday: null,
        thursday: null,
        wednesday: null,
      },
      logo: null,
      managerName: "asdf",
      managerPhone: "57 3012229800",
      images: [],
      isPickupAvailable: false,
      isDeliveryAvailable: true,
      availablePaymentMethods: ["Efectivo"],
      description: "dfsgsdaf",
      createdAt: "2025-07-28T21:05:44.119Z",
      updatedAt: "2025-07-28T21:05:44.119Z",
    },
    {
      id: "8c7d3856-6c83-4b58-a82e-5c5452c67d27",
      vendorId: "20e83106-1f14-4311-8a71-392e68e92e61",
      name: "ropa",
      location: {
        type: "Point",
        coordinates: [-74.190294, 11.225966],
      },
      distance: 0,
      address: "Plaza España 789",
      country: "Colombia",
      city: "Santa Marta",
      rank: 0,
      isActive: false,
      state: "created",
      stateHistory: [
        {
          state: "created",
          reason: "Tienda del Veci-proveedor creada por primera vez",
          changedAt: "2025-07-24T19:56:15.917Z",
        },
      ],
      businessType: "individual",
      operatingHours: {
        friday: null,
        monday: ["12:00", "20:00"],
        sunday: null,
        tuesday: null,
        saturday: null,
        thursday: null,
        wednesday: null,
      },
      logo: "https://res.cloudinary.com/gijumi/image/upload/v1753387021/branches/logos/dpxvq5hiubfxhsldfmi7.jpg",
      managerName: "elder",
      managerPhone: "57 32178052870",
      images: [],
      isPickupAvailable: true,
      isDeliveryAvailable: true,
      availablePaymentMethods: ["Efectivo", "Nequi", "Daviplata"],
      description: "tienda de ropa",
      createdAt: "2025-07-24T19:56:15.953Z",
      updatedAt: "2025-07-24T20:48:44.678Z",
    },
    {
      id: "6d34260c-31cb-42a6-80b3-d42ed8a5a9d0",
      vendorId: "bf0bdc6f-8cc1-4431-a62a-d971bcd8df8a",
      name: "Dani Store",
      location: {
        type: "Point",
        coordinates: [-74.194793701, 11.235485427],
      },
      distance: 0,
      address: "la consolata mz c lt 9",
      country: "Colombia",
      city: "Santa Marta",
      rank: 0,
      isActive: false,
      state: "created",
      stateHistory: [
        {
          state: "created",
          reason: "Tienda del Veci-proveedor creada por primera vez",
          changedAt: "2025-07-23T22:28:35.681Z",
        },
      ],
      businessType: "individual",
      operatingHours: {
        friday: null,
        monday: ["21:00", "23:50"],
        sunday: null,
        tuesday: null,
        saturday: null,
        thursday: null,
        wednesday: null,
      },
      logo: "https://res.cloudinary.com/gijumi/image/upload/v1753384975/branches/logos/e6jocoyfyxbohhodzqzq.webp",
      managerName: "Danilsa Palmieri",
      managerPhone: "57 30065435441",
      images: [],
      isPickupAvailable: true,
      isDeliveryAvailable: true,
      availablePaymentMethods: [
        "Nequi",
        "Efectivo",
        "Llaves",
        "Daviplata",
        "Transfiya",
      ],
      description:
        "asdfasdfasdfasdf asdf asdf asdf sadfasdfasdfasdfa sdfasdf asdfasdfas asdf asdf asdf as dfasdf asdf sd",
      createdAt: "2025-07-23T22:28:35.715Z",
      updatedAt: "2025-07-24T19:22:56.697Z",
    },
    {
      id: "5a9ed98e-a439-4f8c-8ae5-b2b535b94102",
      vendorId: "56c0f0ba-35aa-4103-84f8-61079a4b4b24",
      name: "Delicias Domingo",
      location: {
        type: "Point",
        coordinates: [-74.190294, 11.225966],
      },
      distance: 0,
      address: "Consolata Mz C Lt 9",
      country: "Colombia",
      city: "Santa Marta",
      rank: 0,
      isActive: false,
      state: "created",
      stateHistory: [
        {
          state: "created",
          reason: "Tienda del Veci-proveedor creada por primera vez",
          changedAt: "2025-07-23T14:45:15.069Z",
        },
      ],
      businessType: "individual",
      operatingHours: {
        friday: null,
        monday: ["02:30", "07:30"],
        sunday: null,
        tuesday: null,
        saturday: null,
        thursday: null,
        wednesday: null,
      },
      logo: "https://res.cloudinary.com/gijumi/image/upload/v1753385010/branches/logos/vah1ugx5ltsyu482cspr.jpg",
      managerName: "Farit Majul",
      managerPhone: "57 3008992753",
      images: [],
      isPickupAvailable: true,
      isDeliveryAvailable: true,
      availablePaymentMethods: [
        "Nequi",
        "Transfiya",
        "Efectivo",
        "Llaves",
        "Daviplata",
      ],
      description: "Las mejores comidas rapidas de cartagena",
      createdAt: "2025-07-23T14:45:15.104Z",
      updatedAt: "2025-07-24T19:23:31.253Z",
    },
    {
      id: "b426594b-3103-4135-960f-4514738f67a5",
      vendorId: "99f646c1-f73e-4695-b9f3-ce020b2ed536",
      name: "Mc Chuzz",
      location: {
        type: "Point",
        coordinates: [-74.194906354, 11.241015323],
      },
      distance: 0,
      address: "Restaurante de comida rapida",
      country: "Colombia",
      city: "Santa Marta",
      rank: 0,
      isActive: false,
      state: "created",
      stateHistory: [
        {
          state: "created",
          reason: "Tienda del Veci-proveedor creada por primera vez",
          changedAt: "2025-07-22T18:21:23.704Z",
        },
      ],
      businessType: "individual",
      operatingHours: {
        friday: null,
        monday: ["12:00", "19:00"],
        sunday: null,
        tuesday: ["12:00", "19:00"],
        saturday: null,
        thursday: null,
        wednesday: ["12:00", "19:00"],
      },
      logo: "https://res.cloudinary.com/gijumi/image/upload/v1753208662/branches/logos/hdlg3foggvufwseavfnc.png",
      managerName: "Jose Doe",
      managerPhone: "57 3423335674",
      images: [
        "https://res.cloudinary.com/gijumi/image/upload/v1753208680/branches/images/cqbfsfuc65hvs3w50bxt.jpg",
        "https://res.cloudinary.com/gijumi/image/upload/v1753208702/branches/images/lv50jjsw2shbd3eu9wmp.png",
      ],
      isPickupAvailable: true,
      isDeliveryAvailable: false,
      availablePaymentMethods: ["Efectivo", "Nequi"],
      description: "Hamburguesas y pizza",
      createdAt: "2025-07-22T18:21:23.737Z",
      updatedAt: "2025-07-22T18:25:03.737Z",
    },
    {
      id: "a67b3876-0691-43e8-962c-48b080ab4bf4",
      vendorId: "08f6ec09-0db8-4e7a-a0f3-209f16f4ee20",
      name: "CONFECCIONES MARIA",
      location: {
        type: "Point",
        coordinates: [-74.190294, 11.225966],
      },
      distance: 0,
      address: "Conjunto brisas del jardín apto 541 torre 6",
      country: "Colombia",
      city: "Santa Marta",
      rank: 0,
      isActive: false,
      state: "created",
      stateHistory: [
        {
          state: "created",
          reason: "Tienda del Veci-proveedor creada por primera vez",
          changedAt: "2025-07-17T23:10:46.897Z",
        },
      ],
      businessType: "individual",
      operatingHours: {
        friday: null,
        monday: ["07:00", "14:00"],
        sunday: null,
        tuesday: ["07:00", "14:00"],
        saturday: null,
        thursday: null,
        wednesday: null,
      },
      logo: "https://res.cloudinary.com/gijumi/image/upload/v1752793882/branches/logos/azvtsy8tuqitbfzqhudi.png",
      managerName: "Maria V.",
      managerPhone: "57 3202125012",
      images: [],
      isPickupAvailable: true,
      isDeliveryAvailable: true,
      availablePaymentMethods: ["Efectivo"],
      description: "SERVICIO DE CONFECCIONES",
      createdAt: "2025-07-17T23:10:46.931Z",
      updatedAt: "2025-07-17T23:11:23.161Z",
    },
    {
      id: "3f4786bb-7a42-494c-8a36-c09baa1caf62",
      vendorId: "08f6ec09-0db8-4e7a-a0f3-209f16f4ee20",
      name: "EL SOTANO",
      location: {
        type: "Point",
        coordinates: [-74.190294, 11.225966],
      },
      distance: 0,
      address: "Barrio juan 23 calle 25 No.44c-80",
      country: "Colombia",
      city: "Santa Marta",
      rank: 0,
      isActive: false,
      state: "created",
      stateHistory: [
        {
          state: "created",
          reason: "Tienda del Veci-proveedor creada por primera vez",
          changedAt: "2025-07-17T23:04:23.605Z",
        },
      ],
      businessType: "individual",
      operatingHours: {
        friday: null,
        monday: ["08:00", "20:00"],
        sunday: null,
        tuesday: ["08:00", "20:00"],
        saturday: null,
        thursday: ["08:00", "20:00"],
        wednesday: ["08:00", "20:00"],
      },
      logo: "https://res.cloudinary.com/gijumi/image/upload/v1752793558/branches/logos/x7cbrocfsqotqo8eckjf.png",
      managerName: "Javier F.",
      managerPhone: "57 3102535025",
      images: [],
      isPickupAvailable: true,
      isDeliveryAvailable: false,
      availablePaymentMethods: [
        "Efectivo",
        "Nequi",
        "Daviplata",
        "Transfiya",
        "Llaves",
      ],
      description: "Servicio de peluqueria",
      createdAt: "2025-07-17T23:04:23.640Z",
      updatedAt: "2025-07-17T23:05:59.412Z",
    },
    {
      id: "5abea25a-ddaa-4a7d-abcc-61b3f43b4a7a",
      vendorId: "08f6ec09-0db8-4e7a-a0f3-209f16f4ee20",
      name: "Creinna",
      location: {
        type: "Point",
        coordinates: [-74.190294, 11.225966],
      },
      distance: 0,
      address: "Carrera 91a #39i- 82 La carolina",
      country: "Colombia",
      city: "Santa Marta",
      rank: 0,
      isActive: false,
      state: "created",
      stateHistory: [
        {
          state: "created",
          reason: "Tienda del Veci-proveedor creada por primera vez",
          changedAt: "2025-07-17T15:45:15.755Z",
        },
      ],
      businessType: "individual",
      operatingHours: {
        friday: ["07:00", "13:00"],
        monday: ["08:00", "16:30"],
        sunday: null,
        tuesday: ["09:00", "15:00"],
        saturday: null,
        thursday: ["09:00", "16:00"],
        wednesday: ["08:00", "16:00"],
      },
      logo: "https://res.cloudinary.com/gijumi/image/upload/v1752767329/branches/logos/izjdwhsh52ju0wo91s4r.png",
      managerName: "Adriana A.",
      managerPhone: "57 3218237939",
      images: [],
      isPickupAvailable: true,
      isDeliveryAvailable: true,
      availablePaymentMethods: [
        "Nequi",
        "Daviplata",
        "Efectivo",
        "Transfiya",
        "Llaves",
      ],
      description: "Servicio diseño grafico",
      createdAt: "2025-07-17T15:45:15.791Z",
      updatedAt: "2025-07-17T23:07:33.655Z",
    },
  ];

  const VendorRow = ({ vendor }: { vendor: Branch }) => (
    <TouchableOpacity
      key={vendor.id}
      onPress={() =>
        router.push({
          pathname: "/(client)/(customerscreens)/branch/[id]",
          params: { id: vendor.id },
        })
      }
      className="flex-row items-center mb-6 bg-white p-3 rounded-lg"
    >
      <Image
        source={{ uri: vendor.logo }}
        className="w-16 h-16 rounded-full mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-bold">{vendor.name}</Text>
        {vendor.rank ? (
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600">{vendor.rank}</Text>
            <Star size={14} color="#FFD700" fill="#FFD700" className="mx-1" />
          </View>
        ) : (
          <></>
        )}
        {vendor.distance ? (
          <View className="flex-row items-center">
            <MapPin size={14} color="#ffffff" fill={"#666"} />
            <Text className="text-sm text-gray-600 ml-1">
              {vendor.distance}
            </Text>
          </View>
        ) : (
          <></>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      {/* Search Bar */}
      <View className="p-4">
        <View className="flex-row items-center rounded-lg relative">
          <Input
            placeholder="Buscar proveedor..."
            className="flex-1 py-3 text-base pl-12 rounded-full border border-gray-400"
            value={searchText}
            onChangeText={setSearchText}
          />
          {!searchText && (
            <View className="absolute left-3 top-3">
              <Search size={20} color="#666" />
            </View>
          )}
        </View>
      </View>

      {/* Filters Section */}
      <View className="flex-row justify-between items-center p-4">
        {/* "Ordenar por" filter */}
        <TouchableOpacity onPress={() => orderSheetRef.current?.show()}>
          <View>
            <Text className="text-gray-600">Ordenar por:</Text>
            <Text className="text-base font-medium">{selectedOrder} ▼</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Vendor List Section */}
      <ScrollView className="flex-1 p-4">
        {vendors.map((vendor) => {
          return <VendorRow vendor={vendor as unknown as Branch} />;
        })}
      </ScrollView>
      <SearchOrderSheet
        ref={orderSheetRef}
        selectedOrder={selectedOrder}
        onSelectOrder={setSelectedOrder}
        onApply={() => {}}
      />
    </View>
  );
}
