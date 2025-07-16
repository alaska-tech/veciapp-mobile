import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { Input } from '~/components/ui/input';
import { Search, MapPin, Star } from 'lucide-react-native';
import { useState, useRef } from 'react';
import FilterSheet, { FilterSheetRef } from '~/components/epic/bottomSheetFilter';
import SearchOrderSheet, { SearchOrderSheetRef } from '~/components/epic/bottomSheetSearch';

export default function AllVendorsScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorias');
  const [selectedOrder, setSelectedOrder] = useState('Cerca de mi');
  const filterSheetRef = useRef<FilterSheetRef>(null);
  const orderSheetRef = useRef<SearchOrderSheetRef>(null);

  const vendors = [
    {
      id: 1,
      name: 'Salón de Belleza Glamour',
      rating: 4.8,
      reviews: 127,
      distance: '0.5 km',
      image: 'https://picsum.photos/200',
      category: 'Belleza'
    },
    {
      id: 2,
      name: 'Barbería Clásica',
      rating: 4.6,
      reviews: 89,
      distance: '0.8 km',
      image: 'https://picsum.photos/201',
      category: 'Belleza'
    },
    {
      id: 3,
      name: 'Spa & Wellness Center',
      rating: 4.9,
      reviews: 234,
      distance: '1.2 km',
      image: 'https://picsum.photos/202',
      category: 'Belleza'
    },
    {
      id: 4,
      name: 'Costura Express',
      rating: 4.7,
      reviews: 156,
      distance: '1.5 km',
      image: 'https://picsum.photos/203',
      category: 'Confecciones'
    },
    {
      id: 5,
      name: 'Moda y Estilo',
      rating: 4.5,
      reviews: 98,
      distance: '2.0 km',
      image: 'https://picsum.photos/204',
      category: 'Confecciones'
    },
    {
      id: 6,
      name: 'Restaurante La Esquina',
      rating: 4.8,
      reviews: 167,
      distance: '2.3 km',
      image: 'https://picsum.photos/205',
      category: 'Gastronomía'
    },
    {
      id: 7,
      name: 'Café Gourmet',
      rating: 4.6,
      reviews: 112,
      distance: '2.5 km',
      image: 'https://picsum.photos/206',
      category: 'Gastronomía'
    },
    {
      id: 8,
      name: 'Salón VIP',
      rating: 4.9,
      reviews: 189,
      distance: '2.8 km',
      image: 'https://picsum.photos/207',
      category: 'Belleza'
    },
    {
      id: 9,
      name: 'Sastrería Elegante',
      rating: 4.7,
      reviews: 145,
      distance: '3.0 km',
      image: 'https://picsum.photos/208',
      category: 'Confecciones'
    },
    {
      id: 10,
      name: 'Comida Rápida Express',
      rating: 4.4,
      reviews: 78,
      distance: '3.2 km',
      image: 'https://picsum.photos/209',
      category: 'Gastronomía'
    }
  ];

  // Add filtered and sorted vendors logic
  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchText.toLowerCase()) &&
    (selectedCategory === 'Todas las categorias' || vendor.category === selectedCategory)
  );

  // Ordenar según selectedOrder
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (selectedOrder === 'Cerca de mi') {
      // Extraer el número de la distancia (ej: '0.5 km' => 0.5)
      const distA = parseFloat(a.distance);
      const distB = parseFloat(b.distance);
      return distA - distB;
    } else if (selectedOrder === 'Mejor calificado') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  // Group vendors by category
  const vendorsByCategory = sortedVendors.reduce((acc, vendor) => {
    if (!acc[vendor.category]) {
      acc[vendor.category] = [];
    }
    acc[vendor.category].push(vendor);
    return acc;
  }, {} as Record<string, typeof vendors>);

  const categories = ['Todas las categorias', 'Belleza', 'Confecciones', 'Gastronomía'];

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Veciproveedores',
        headerShown: true,
        headerTitleAlign: 'center',
        headerBackTitle: "Volver",
       }} />

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
        {/* "Buscar en" filter */}
        <TouchableOpacity onPress={() => filterSheetRef.current?.show()}>
          <View>
            <Text className="text-gray-600">Buscar en:</Text>
            <Text className="text-base font-medium">{selectedCategory} ▼</Text>
          </View>
        </TouchableOpacity>
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
        {categories.filter(c => c !== 'Todas las categorias').map((category) => (
          vendorsByCategory[category]?.length > 0 && (
            <View key={category} className="mb-6">
              <Text className="text-2xl font-bold mb-4">{category}</Text>
              {vendorsByCategory[category].map((vendor) => (
                <TouchableOpacity 
                  key={vendor.id}
                  onPress={() => console.log('Vendor pressed:', vendor.name)}
                  className="flex-row items-center mb-6 bg-white p-3 rounded-lg"
                >
                  <Image 
                    source={{ uri: vendor.image }} 
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <View className="flex-1">
                    <Text className="text-lg font-bold">{vendor.name}</Text>
                    <View className="flex-row items-center">
                      <Text className="text-sm text-gray-600">{vendor.rating}</Text>
                      <Star size={14} color="#FFD700" fill="#FFD700" className="mx-1" />
                      <Text className="text-sm text-gray-600">({vendor.reviews})</Text>
                    </View>
                    <View className="flex-row items-center">
                      <MapPin size={14} color="#ffffff" fill={'#666'} />
                      <Text className="text-sm text-gray-600 ml-1">{vendor.distance}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )
        ))}
      </ScrollView>
      <FilterSheet
        ref={filterSheetRef}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onClear={() => setSelectedCategory('Todas las categorias')}
        onApply={() => {}}
      />
      <SearchOrderSheet
        ref={orderSheetRef}
        selectedOrder={selectedOrder}
        onSelectOrder={setSelectedOrder}
        onApply={() => {}}
      />
    </View>
  );
}
