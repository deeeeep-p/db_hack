import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CaptureImage from "./CaptureImage"; // Import CaptureImage component
import axios from "axios";

const SustainableEcommercePage = () => {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [products, setProducts] = useState([
    {
      feature1: "Made from cornstarch",
      feature2: "50L high-capacity",
      feature3: "Tear-resistant durable design",
      feature4: "Biodegradable eco-friendly",
      feature5: "Extra strong material",
      id: "P2013",
      image: "plasticBag",
      price: 399,
      productName: "Compostable Trash Bags",
      similarity_score: 1.5853111743927002,
      text: "Compostable garbage bags, made from cornstarch, 50L capacity, extra strong, tear-resistant, biodegradable, sustainable waste management.",
    },
    {
      feature1: "Made from reclaimed wood",
      feature2: "Termite-resistant coating",
      feature3: "Modern aesthetic design",
      feature4: "Highly durable construction",
      feature5: "Eco-friendly natural polish",
      id: "P2004",
      image: "table",
      price: 5999,
      productName: "Sustainable Wooden Table",
      similarity_score: 1.611379623413086,
      text: "Sustainable wooden table, reclaimed wood, termite-resistant, modern style, long-lasting durability, premium natural finish, eco-conscious.",
    },
    {
      feature1: "100% recycled paper",
      feature2: "120 pages total",
      feature3: "Eco-friendly ink printing",
      feature4: "Durable stitched binding",
      feature5: "Sustainable office stationery",
      id: "P2010",
      image: "book",
      price: 349,
      productName: "Recycled Paper Notebook",
      similarity_score: 1.663378357887268,
      text: "Notebook made from 100% recycled paper, 120 pages, eco-friendly ink, durable binding, sustainable writing and sketching option.",
    },
    {
      feature1: "Natural loofah sponge",
      feature2: "Coconut fiber material",
      feature3: "Highly absorbent design",
      feature4: "Compostable zero waste",
      feature5: "Non-toxic and safe",
      id: "P2012",
      image: "loofah",
      price: 199,
      productName: "Natural Loofah Sponge",
      similarity_score: 1.7172224521636963,
      text: "Natural loofah kitchen sponge, coconut fibers, highly absorbent, compostable, non-toxic, durable, ideal for eco-friendly cleaning.",
    },
    {
      feature1: "Phosphate-free gentle formula",
      feature2: "Non-toxic biodegradable blend",
      feature3: "1L large bottle",
      feature4: "Tough stain removal",
      feature5: "Eco-friendly plastic-free packaging",
      id: "P2011",
      image: "laudnary",
      price: 699,
      productName: "Green Laundry Detergent",
      similarity_score: 1.7251290082931519,
      text: "Plant-based biodegradable detergent, phosphate-free, non-toxic, 1L bottle, gentle on skin, removes stains, eco-friendly packaging.",
    },
    {
      feature1: "Queen size premium fabric",
      feature2: "Breathable skin-friendly material",
      feature3: "Naturally dyed color",
      feature4: "Chemical-free safe texture",
      feature5: "Soft and durable",
      id: "P2008",
      image: "bedsheet",
      price: 2499,
      productName: "Organic Cotton Bedsheets",
      similarity_score: 1.729500412940979,
      text: "Organic cotton bedsheets, queen size, breathable, naturally dyed, chemical-free, soft durable fabric, sustainable sleep choice.",
    },
    {
      feature1: "1.2m standard length",
      feature2: "USB-C fast charging",
      feature3: "Durable reinforced structure",
      feature4: "Tangle-free braided cable",
      feature5: "Plant-based biodegradable material",
      id: "P2005",
      image: "cable",
      price: 799,
      productName: "Eco Charging Cable",
      similarity_score: 1.7387678623199463,
      text: "Biodegradable phone charging cable, 1.2m, USB-C fast charge, durable, tangle-free, plant-based materials, plastic-free packaging.",
    },
    {
      feature1: "6.5-inch HD+ display",
      feature2: "4500mAh long battery",
      feature3: "108MP high-resolution camera",
      feature4: "Recycled aluminum frame",
      feature5: "Energy-efficient processor",
      id: "P2006",
      image: "smartphone",
      price: 44999,
      productName: "Eco Smartphone",
      similarity_score: 1.7638345956802368,
      text: "Smartphone with 6.5-inch display, 4500mAh battery, 108MP camera, recycled aluminum body, energy-efficient processor, eco-conscious.",
    },
    {
      feature1: "15W solar panel power",
      feature2: "Weatherproof design",
      feature3: "Dusk-to-dawn auto sensor",
      feature4: "Rechargeable lithium battery",
      feature5: "Motion detection activation",
      id: "P2007",
      image: "solar",
      price: 1499,
      productName: "Solar Motion Light",
      similarity_score: 1.7955509424209595,
      text: "Solar-powered outdoor motion light, 15W, weatherproof, auto dusk-to-dawn sensor, rechargeable battery, energy-saving security lighting.",
    },
    {
      feature1: "750ml high-capacity storage",
      feature2: "BPA-free food-safe material",
      feature3: "Leakproof with secure lid",
      feature4: "Recycled plastic build",
      feature5: "Lightweight ergonomic grip",
      id: "P2003",
      image: "bottle",
      price: 499,
      productName: "Eco Water Bottle",
      similarity_score: 1.8020509481430054,
      text: "Reusable 750ml BPA-free bottle, lightweight, leakproof, made from recycled plastic, ergonomic grip, ideal for everyday hydration.",
    },
    {
      feature1: "Biodegradable bamboo handle",
      feature2: "Soft BPA-free bristles",
      feature3: "Antibacterial natural protection",
      feature4: "Eco-friendly compostable packaging",
      feature5: "Plastic-free sustainable product",
      id: "P2009",
      image: "brush",
      price: 299,
      productName: "Bamboo Toothbrush",
      similarity_score: 1.809962511062622,
      text: "Compostable bamboo toothbrush, biodegradable handle, soft BPA-free bristles, antibacterial, eco-packaging, plastic-free, zero-waste product.",
    },
    {
      feature1: "1.5-ton cooling capacity",
      feature2: "5-star energy rating",
      feature3: "Smart temperature control",
      feature4: "Eco-friendly refrigerant gas",
      feature5: "Silent operation mode",
      id: "P2002",
      image: "AC",
      price: 38999,
      productName: "Green Inverter AC",
      similarity_score: 1.8210434913635254,
      text: "Inverter AC with 1.5-ton capacity, 5-star rating, smart cooling, eco refrigerant, silent operation, efficient power consumption.",
    },
    {
      feature1: "9W low energy usage",
      feature2: "25,000-hour lifespan",
      feature3: "Warm white light output",
      feature4: "Low heat emission",
      feature5: "Recyclable eco-friendly packaging",
      id: "P2001",
      image: "ledBulb",
      price: 199,
      productName: "Eco LED Bulb",
      similarity_score: 1.8462446928024292,
      text: "Energy-efficient 9W LED bulb, lasts 25,000 hours, reduces costs, warm white glow, eco-friendly recyclable packaging, durable design.",
    },
    {
      feature1: "6 universal sockets",
      feature2: "Auto power-off feature",
      feature3: "Surge protection built-in",
      feature4: "Reduces standby power waste",
      feature5: "Energy-efficient design",
      id: "P2014",
      image: "strip",
      price: 1299,
      productName: "Smart Eco Power Strip",
      similarity_score: 1.8627631664276123,
      text: "Smart energy-saving power strip, 6 sockets, auto power-off, surge protection, reduces standby waste, efficient home device.",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [capturedImageUri, setCapturedImageUri] = useState(null); // State for captured image URI
  const [uploadResponse, setUploadResponse] = useState(null); // State for Axios response
  const [detectedObjects, setDetectedObjects] = useState([]); // State for detected objects

  const filters = ["All", "Solar", "Wind", "Hydro", "Biomass"];
  const router = useRouter();

  // Simulate fetching data from MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const mockProductsData = [
          {
            _id: "60d21b4667d0d8992e610c85",
            name: "Portable Solar Power Bank",
            price: 129.99,
            image:
              "https://tse4.mm.bing.net/th?id=OIP.qr4HLOel4qHrYqrZ-amupgHaHa&pid=Api&P=0&h=180",
            category: "Solar",
            description:
              "Charge your devices anywhere with this high-capacity solar power bank",
            rating: 4.7,
            reviews: 128,
            inStock: true,
            createdAt: "2023-06-23T18:25:43.511Z",
            updatedAt: "2023-12-15T09:15:22.471Z",
          },
          // Add other mock products here...
        ];

        // setProducts(mockProductsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle FAISS search
  const handleFaiss = async (object) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/query", {
        query: object,
      });
      console.log("FAISS response:", response.data);

      // Update the products state with the search results
      if (response.data.matches && response.data.matches.length > 0) {
        setProducts(response.data.matches); // Set the products state to the matches array
      } else {
        setProducts([]); // If no matches are found, set products to an empty array
      }
    } catch (error) {
      console.error("Error performing FAISS search:", error);
      Alert.alert("Error", "Failed to perform search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Callback function to handle the response from CaptureImage
  const handleImageUpload = (response) => {
    console.log("Response from CaptureImage:", response);
    setUploadResponse(response); // Save the response in state

    // Parse the "objects" string from the response
    if (response.objects) {
      const objectsArray = response.objects.split(","); // Split the string into an array
      setDetectedObjects(objectsArray); // Save the detected objects in state
    }
  };

  const filteredProducts =
    selectedFilter === "All"
      ? products
      : products.filter((product) => product.category === selectedFilter);

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={{
        width: "48%",
        backgroundColor: "#131d2a",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
      }}
      onPress={() => {
        console.log(item);
        router.push({
          pathname: "/(tabs)/products/productdetails",
          params: { item: JSON.stringify(item) },
        });
      }}
    >
      <View
        style={{
          height: 120,
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <Image
          source={images[`${item.image}`]}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      <Text
        style={{
          color: "white",
          fontSize: 16,
          fontWeight: "600",
          marginBottom: 4,
        }}
      >
        {item.productName || item.name}
      </Text>
      <Text
        style={{
          color: "#00b890",
          fontSize: 16,
          fontWeight: "700",
          marginBottom: 6,
        }}
      >
        ₹{item.price.toFixed(2)}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="star" size={14} color="#FFD700" />
          <Text style={{ color: "#9ca3af", marginLeft: 4, fontSize: 14 }}>
            {item.rating || "N/A"}
          </Text>
        </View>
        <Text style={{ color: "#9ca3af", fontSize: 12 }}>
          {item.reviews || "0"} reviews
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0f1a", padding: 16 }}>
      {/* Search Bar and Camera Button */}
      <View
        style={{ flexDirection: "row", marginBottom: 16, alignItems: "center" }}
      >
        <View
          style={{
            flex: 1,
            height: 50,
            backgroundColor: "#131d2a",
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            marginRight: 12,
          }}
        >
          <Feather
            name="search"
            size={20}
            color="#9ca3af"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1, color: "white", fontSize: 16 }}
          />
        </View>
        {/* Capture Image Component */}
        <CaptureImage
          setImageUri={setCapturedImageUri}
          onImageUpload={handleImageUpload} // Pass the callback function
        />
      </View>

      {/* Display Detected Objects */}
      {detectedObjects.length > 0 && (
        <TouchableOpacity
          style={{
            backgroundColor: "#131d2a",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            borderLeftWidth: 4,
            borderLeftColor: "#00b890",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 4,
            }}
          >
            Detected Objects:
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {detectedObjects.map((object, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: "#1a2230",
                  borderRadius: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  borderColor: "#00b890",
                }}
                onPress={() => handleFaiss(object)}
              >
                <Text
                  style={{ color: "#00b890", fontSize: 14, fontWeight: "500" }}
                >
                  {object}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      )}

      {/* Rest of the UI */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Informative Card */}
        {detectedObjects.length <= 0 && (
          <TouchableOpacity
            style={{
              backgroundColor: "#131d2a",
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: "#00b890",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 4,
              }}
            >
              Explore Sustainable Products
            </Text>
            <Text style={{ color: "#9ca3af", fontSize: 14 }}>
              Handpicked eco-friendly products from our founders
            </Text>
          </TouchableOpacity>
        )}

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor:
                  selectedFilter === filter ? "#00b890" : "#131d2a",
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: selectedFilter === filter ? "white" : "#9ca3af",
                  fontWeight: selectedFilter === filter ? "600" : "400",
                }}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product Grid */}
        {loading ? (
          <View style={{ alignItems: "center", padding: 40 }}>
            <ActivityIndicator size="large" color="#00b890" />
          </View>
        ) : (
          <View>
            <FlatList
              data={filteredProducts}
              renderItem={renderProductCard}
              keyExtractor={(item) => item.id || item._id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text
                  style={{ color: "white", textAlign: "center", padding: 20 }}
                >
                  No products found in this category
                </Text>
              }
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SustainableEcommercePage;
