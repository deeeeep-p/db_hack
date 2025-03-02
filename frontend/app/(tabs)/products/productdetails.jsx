// app/product/[id].js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const ProductDetailsPage = () => {
  const images = {
    bedsheet: require("../../../assets/images/bedsheet.jpeg"),
    ledBulb: require("../../../assets/images/ledBulb.jpg"),
    solarPanel: require("../../../assets/images/solar.jpg"),
    AC: require("../../../assets/images/AC.jpg"),
    bottle: require("../../../assets/images/bottle.jpeg"),
    table: require("../../../assets/images/table.jpg"),
    smartphone: require("../../../assets/images/smartphone.jpeg"),
    solar: require("../../../assets/images/solar.jpg"),
    bedsheet: require("../../../assets/images/bedsheet.jpeg"),
    brush: require("../../../assets/images/brush.jpeg"),
    book: require("../../../assets/images/book.jpeg"),
    laudnary: require("../../../assets/images/laudnary.jpeg"),
    loofah: require("../../../assets/images/loofah.jpg"),
    plasticBag: require("../../../assets/images/plasticBag.jpeg"),
    strip: require("../../../assets/images/strip.jpg"),
    cable: require("../../../assets/images/cable.jpg"),
    fan: require("../../../assets/images/fan.jpg"),
    chair: require("../../../assets/images/chair.jpg"),
    // etc...
  };
  const router = useRouter();
  const { item } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!item) return;

    try {
      // Parse the item object
      const parsedItem = JSON.parse(item);
      setProduct(parsedItem);
    } catch (err) {
      setError("Invalid product data");
    } finally {
      setLoading(false);
    }
  }, [item]);

  const handleAddToCart = () => {
    // This would handle adding to cart logic
    console.log(`Added ${quantity} of product ${product.id} to cart`);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0a0f1a]">
        <ActivityIndicator size="large" color="#00b890" />
        <Text className="text-[#9ca3af] mt-4 text-base">
          Loading product details...
        </Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a0f1a",
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Product not found!</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0a0f1a] p-6">
        <Feather name="alert-circle" size={48} color="#ff6b6b" />
        <Text className="text-[#ff6b6b] mt-4 text-base text-center">
          {error}
        </Text>
        <TouchableOpacity
          className="mt-6 py-2.5 px-5 bg-[#131d2a] rounded-lg"
          onPress={() => {
            setLoading(true);
            setError(null);
            // Retry fetching
          }}
        >
          <Text className="text-[#00b890] text-base font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0a0f1a]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <TouchableOpacity
          className="absolute top-4 left-4 z-10 bg-black/50 rounded-full w-10 h-10 justify-center items-center"
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        {/* Product Image */}
        <View className="w-full h-[300px]">
          <Image
            source={images[product.image]}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View className="bg-[#0a0f1a] rounded-t-[24px] mt-[-20px] px-4 pt-5 pb-8">
          <Text className="text-white text-2xl font-bold mb-2">
            {product.productName}
          </Text>

          <Text className="text-[#00b890] text-2xl font-bold mb-4">
            ₹{product.price.toFixed(2)}
          </Text>

          <Text className="text-[#e0e0e0] text-base leading-6 mb-6">
            {product.text}
          </Text>

          {/* Features */}
          <Text className="text-white text-lg font-semibold mb-3">
            Key Features
          </Text>
          {[
            product.feature1,
            product.feature2,
            product.feature3,
            product.feature4,
            product.feature5,
          ].map((feature, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Feather
                name="check-circle"
                size={16}
                color="#00b890"
                style={{ marginRight: 8 }}
              />
              <Text className="text-[#e0e0e0] text-base">{feature}</Text>
            </View>
          ))}

          {/* Quantity Selector */}
          <View className="mt-6 mb-4">
            <Text className="text-white text-base font-medium mb-2">
              Quantity
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="w-8 h-8 bg-[#131d2a] rounded-full justify-center items-center"
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <Feather name="minus" size={16} color="white" />
              </TouchableOpacity>
              <Text className="text-white text-lg font-medium mx-4">
                {quantity}
              </Text>
              <TouchableOpacity
                className="w-8 h-8 bg-[#131d2a] rounded-full justify-center items-center"
                onPress={() => setQuantity(quantity + 1)}
              >
                <Feather name="plus" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center bg-[#00b890] py-3 px-4 rounded-xl mt-4"
            onPress={handleAddToCart}
          >
            <Feather
              name="shopping-cart"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white text-lg font-semibold">
              Pledge Money
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetailsPage;
