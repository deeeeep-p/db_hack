import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Platform,
  Linking,
  Alert,
  Modal,
  Dimensions,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { WebView } from "react-native-webview";

// Theme colors
const COLORS = {
  background: "#0a0f1a",
  surface: "#131d2a",
  primary: "#00b890",
  secondary: "#2a9d8f",
  tertiary: "#3a7ca5",
  text: "#e0e0e0",
  gray: {
    100: "rgba(255, 255, 255, 0.08)",
    200: "rgba(255, 255, 255, 0.12)",
    300: "rgba(255, 255, 255, 0.16)",
  },
};

// Challenge Card Component
const ChallengeCard = ({ title, progress, total, icon, color }) => {
  const progressPercentage = (progress / total) * 100;

  return (
    <View className="bg-[#131d2a] rounded-2xl p-5 mb-4 border border-white/10 shadow-lg">
      <View className="flex-row items-center mb-3">
        <View
          className={`w-10 h-10 rounded-full mr-3 items-center justify-center`}
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </View>
        <Text className="text-[#e0e0e0] text-lg font-medium flex-1">
          {title}
        </Text>
        <Text className="text-[#00b890] font-bold">
          {progress}/{total}
        </Text>
      </View>

      {/* Progress bar */}
      <View className="h-3 bg-white/10 rounded-full w-full overflow-hidden mt-2">
        <View
          className="h-full rounded-full"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};

// Leaderboard User Row Component
const LeaderboardRow = ({ rank, name, avatar, carbonSaved, isCurrentUser }) => {
  return (
    <View
      className={`flex-row items-center p-4 ${
        isCurrentUser ? "bg-[#00b890]/10 rounded-xl" : ""
      }`}
    >
      <Text className="text-[#e0e0e0] font-bold text-lg w-8">{rank}</Text>
      <View className="w-10 h-10 rounded-full bg-gray-700 mr-3 items-center justify-center overflow-hidden">
        {avatar ? (
          <Image source={{ uri: avatar }} className="w-full h-full" />
        ) : (
          <Text className="text-white font-bold">{name.charAt(0)}</Text>
        )}
      </View>
      <Text className="text-[#e0e0e0] flex-1 font-medium">{name}</Text>
      <View className="flex-row items-center">
        <MaterialCommunityIcons name="leaf" size={16} color="#00b890" />
        <Text className="text-[#e0e0e0] ml-1 font-bold">{carbonSaved} kg</Text>
      </View>
    </View>
  );
};

// WhatsApp sharing function
const shareToWhatsApp = (carbonSaved, rank) => {
  const message = `Hey, I saved ${carbonSaved}kg of carbon and ranked #${rank} on EcoTracker! Join me in making a difference for our planet. 🌱`;

  // Try to use the Share API first (works on both iOS and Android)
  Share.share({
    message: message,
    title: "My Carbon Savings Achievement",
  })
    .then((result) => {
      if (result.action === Share.dismissedAction) {
        // User dismissed the share sheet
        console.log("Share dismissed");
      }
    })
    .catch((error) => {
      console.log("Error sharing:", error);

      // Fallback direct to WhatsApp if Share API fails
      try {
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `whatsapp://send?text=${encodedMessage}`;

        Linking.canOpenURL(whatsappUrl)
          .then((supported) => {
            if (supported) {
              return Linking.openURL(whatsappUrl);
            } else {
              Alert.alert(
                "WhatsApp not installed",
                "Please install WhatsApp to share your achievement"
              );
            }
          })
          .catch((err) => console.error("An error occurred", err));
      } catch (error) {
        console.error("Error opening WhatsApp:", error);
      }
    });
};

const generateThreeJsContent = (completedChallenges, totalChallenges) => {
  const gridSize = 4;
  const treesCount = completedChallenges;
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <title>EcoTracker 3D Map</title>
      <style>
          body { margin: 0; overflow: hidden; background-color: #0a0f1a; touch-action: none; }
          canvas { width: 100%; height: 100%; display: block; }
          #loadingScreen {
              position: absolute; top: 0; left: 0; width: 100%; height: 100%;
              background-color: #0a0f1a; display: flex; flex-direction: column;
              align-items: center; justify-content: center; color: #e0e0e0;
              font-family: Arial, sans-serif;
          }
          .spinner {
              width: 40px; height: 40px; border: 4px solid rgba(0, 184, 144, 0.2);
              border-radius: 50%; border-top-color: #00b890;
              animation: spin 1s linear infinite; margin-bottom: 20px;
          }
          @keyframes spin {
              0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }
          }
      </style>
  </head>
  <body>
      <div id="loadingScreen">
          <div class="spinner"></div>
          <p>Growing Your Eco-Garden...</p>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/gsap.min.js"></script>
      <script>
          const sendMessage = (message) => {
              if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify(message));
              }
          };

          const gridSize = ${gridSize};
          const completedChallenges = ${treesCount};
          const totalChallenges = ${totalChallenges};
          const tileSize = 2.0;

          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0x0a0f1a);
          const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
          camera.position.set(0, 15, 15);
          camera.lookAt(0, 0, 0);

          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setPixelRatio(window.devicePixelRatio);
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          document.body.appendChild(renderer.domElement);

          const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
          scene.add(ambientLight);
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
          directionalLight.position.set(5, 10, 5);
          directionalLight.castShadow = true;
          directionalLight.shadow.mapSize.width = 1024;
          directionalLight.shadow.mapSize.height = 1024;
          scene.add(directionalLight);
          
          // Add stars to the background
          const createStars = () => {
              const starsGeometry = new THREE.BufferGeometry();
              const starsMaterial = new THREE.PointsMaterial({
                  color: 0xffffff,
                  size: 0.5,
                  transparent: true,
                  opacity: 0.8,
                  sizeAttenuation: true
              });
              
              const starsVertices = [];
              const starColors = [];
              const color = new THREE.Color();
              
              // Create 1500 stars at random positions
              for (let i = 0; i < 1500; i++) {
                  const x = (Math.random() - 0.5) * 200;
                  const y = (Math.random() - 0.5) * 200;
                  const z = (Math.random() - 0.5) * 200;
                  
                  // Keep stars away from the center where the garden is
                  const distance = Math.sqrt(x*x + y*y + z*z);
                  if (distance < 20) continue;
                  
                  starsVertices.push(x, y, z);
                  
                  // Mix in some green stars to match the theme color #00b890
                  const starType = Math.random();
                  if (starType < 0.85) {
                      // White stars (majority)
                      color.set(0xffffff);
                  } else if (starType < 0.95) {
                      // Theme color stars (some)
                      color.set(0x00b890);
                  } else {
                      // Light blue stars (few)
                      color.set(0x87ceeb);
                  }
                  
                  // Add slight variation to star colors
                  color.r += (Math.random() - 0.5) * 0.1;
                  color.g += (Math.random() - 0.5) * 0.1;
                  color.b += (Math.random() - 0.5) * 0.1;
                  
                  starColors.push(color.r, color.g, color.b);
              }
              
              starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
              const stars = new THREE.Points(starsGeometry, starsMaterial);
              
              // Animate stars with subtle twinkling
              gsap.to(starsMaterial, {
                  opacity: 0.5,
                  duration: 1.5,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut"
              });
              
              scene.add(stars);
              
              // Add a few larger, brighter stars
              const brightStarsGeometry = new THREE.BufferGeometry();
              const brightStarsMaterial = new THREE.PointsMaterial({
                  color: 0xffffff,
                  size: 0.2,
                  transparent: true,
                  opacity: 0.9
              });
              
              const brightStarsVertices = [];
              for (let i = 0; i < 50; i++) {
                  const x = (Math.random() - 0.5) * 200;
                  const y = (Math.random() - 0.5) * 200;
                  const z = (Math.random() - 0.5) * 200;
                  
                  // Keep bright stars away from center
                  const distance = Math.sqrt(x*x + y*y + z*z);
                  if (distance < 25) continue;
                  
                  brightStarsVertices.push(x, y, z);
              }
              
              brightStarsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(brightStarsVertices, 3));
              const brightStars = new THREE.Points(brightStarsGeometry, brightStarsMaterial);
              
              // Independent twinkling for bright stars
              gsap.to(brightStarsMaterial, {
                  opacity: 1,
                  duration: 2,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut"
              });
              
              scene.add(brightStars);
          };

          const createGarden = () => {
              const gardenGeometry = new THREE.PlaneGeometry(
                  gridSize * tileSize + 4, gridSize * tileSize + 4
              );
              const gardenMaterial = new THREE.MeshStandardMaterial({
                  color: 0x1a3d2a, // Dark green for garden ground
                  roughness: 0.9, metalness: 0.0
              });
              const garden = new THREE.Mesh(gardenGeometry, gardenMaterial);
              garden.rotation.x = -Math.PI / 2;
              garden.position.y = -0.05;
              garden.receiveShadow = true;
              scene.add(garden);

              // Fence creation function
              const createFence = (position, rotation, length) => {
                  const fenceGroup = new THREE.Group();
                  const postMaterial = new THREE.MeshStandardMaterial({
                      color: 0x8B4513, roughness: 0.7, metalness: 0.2
                  });
                  const railMaterial = new THREE.MeshStandardMaterial({
                      color: 0x6b4423, roughness: 0.8, metalness: 0.1
                  });

                  // Create posts
                  const postHeight = 1.2;
                  const postSpacing = 1.5;
                  const postCount = Math.floor(length / postSpacing);
                  
                  for(let i = 0; i < postCount; i++) {
                      const post = new THREE.Mesh(
                          new THREE.CylinderGeometry(0.08, 0.08, postHeight, 8),
                          postMaterial
                      );
                      post.position.x = i * postSpacing - length/2;
                      post.position.y = postHeight/2;
                      post.castShadow = true;
                      fenceGroup.add(post);
                  }

                  // Create horizontal rails
                  const rail = new THREE.Mesh(
                      new THREE.BoxGeometry(length, 0.06, 0.06),
                      railMaterial
                  );
                  rail.position.y = postHeight - 0.2;
                  rail.castShadow = true;
                  fenceGroup.add(rail);

                  const middleRail = rail.clone();
                  middleRail.position.y = postHeight/2;
                  fenceGroup.add(middleRail);

                  const bottomRail = rail.clone();
                  bottomRail.position.y = 0.2;
                  fenceGroup.add(bottomRail);

                  fenceGroup.position.set(position.x, position.y, position.z);
                  fenceGroup.rotation.y = rotation;
                  return fenceGroup;
              };

              // Add fences around the garden
              const gardenWidth = gridSize * tileSize + 4;
              scene.add(createFence(
                  new THREE.Vector3(0, 0, -gardenWidth/2 - 0.5),
                  Math.PI, gardenWidth
              ));
              scene.add(createFence(
                  new THREE.Vector3(0, 0, gardenWidth/2 + 0.5),
                  0, gardenWidth
              ));
              scene.add(createFence(
                  new THREE.Vector3(-gardenWidth/2 - 0.5, 0, 0),
                  Math.PI/2, gardenWidth
              ));
              scene.add(createFence(
                  new THREE.Vector3(gardenWidth/2 + 0.5, 0, 0),
                  -Math.PI/2, gardenWidth
              ));
          };

          const createTiles = () => {
              for(let row = 0; row < gridSize; row++) {
                  for(let col = 0; col < gridSize; col++) {
                      const index = row * gridSize + col;
                      const isActive = index < completedChallenges;
                      if (isActive) {
                          const tile = new THREE.Mesh(
                              new THREE.CircleGeometry(tileSize * 0.5, 32),
                              new THREE.MeshStandardMaterial({
                                  color: 0x5d4037, // Brownish soil color
                                  roughness: 1.0, metalness: 0.0
                              })
                          );
                          tile.rotation.x = -Math.PI / 2;
                          tile.position.set(
                              col * tileSize - (gridSize * tileSize)/2 + tileSize/2,
                              -0.04,
                              row * tileSize - (gridSize * tileSize)/2 + tileSize/2
                          );
                          tile.receiveShadow = true;
                          tile.userData = { index: index };
                          scene.add(tile);
                      }
                  }
              }
          };

          const createPlants = () => {
              const createTree = (x, z) => {
                  const tree = new THREE.Group();
                  const trunk = new THREE.Mesh(
                      new THREE.CylinderGeometry(0.08, 0.12, 0.4, 8),
                      new THREE.MeshStandardMaterial({
                          color: 0x8B4513, roughness: 0.9
                      })
                  );
                  trunk.position.y = 0.2;
                  trunk.castShadow = true;
                  tree.add(trunk);

                  // Create foliage layers (Christmas tree shape)
                  for (let i = 0; i < 3; i++) {
                      const foliage = new THREE.Mesh(
                          new THREE.ConeGeometry(0.5 - i * 0.1, 1.0 - i * 0.2, 8),
                          new THREE.MeshStandardMaterial({
                              color: 0x2e7d32, // Lush green for foliage
                              roughness: 0.8
                          })
                      );
                      foliage.position.y = 0.5 + i * 0.5;
                      foliage.castShadow = true;
                      tree.add(foliage);
                  }
                  tree.position.set(x, 0, z);
                  return tree;
              };

              for(let i = 0; i < completedChallenges; i++) {
                  const col = i % gridSize;
                  const row = Math.floor(i / gridSize);
                  const x = col * tileSize - (gridSize * tileSize)/2 + tileSize/2;
                  const z = row * tileSize - (gridSize * tileSize)/2 + tileSize/2;
                  
                  const plant = createTree(x, z);
                  
                  gsap.to(plant.position, {
                      y: "+= 0.05", duration: 1 + Math.random(),
                      repeat: -1, yoyo: true, ease: "sine.inOut"
                  });
                  plant.userData = { index: i };
                  scene.add(plant);
              }
          };

          let isDragging = false;
          let previousMousePosition = { x: 0, y: 0 };
          let targetRotationY = 0;
          let currentRotationY = 0;

          const onMouseDown = (event) => {
              event.preventDefault();
              isDragging = true;
              previousMousePosition = {
                  x: event.clientX || (event.touches && event.touches[0].clientX),
                  y: event.clientY || (event.touches && event.touches[0].clientY)
              };
          };

          const onMouseMove = (event) => {
              if (!isDragging) return;
              const currentPosition = {
                  x: event.clientX || (event.touches && event.touches[0].clientX),
                  y: event.clientY || (event.touches && event.touches[0].clientY)
              };
              const deltaMove = {
                  x: currentPosition.x - previousMousePosition.x,
                  y: currentPosition.y - previousMousePosition.y
              };
              targetRotationY += deltaMove.x * 0.01;
              previousMousePosition = {
                  x: currentPosition.x,
                  y: currentPosition.y
              };
          };

          const onMouseUp = () => {
              isDragging = false;
          };

          window.addEventListener('mousedown', onMouseDown);
          window.addEventListener('touchstart', onMouseDown);
          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('touchmove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
          window.addEventListener('touchend', onMouseUp);

          const raycaster = new THREE.Raycaster();
          const mouse = new THREE.Vector2();
          
          const handleTap = (event) => {
              if (isDragging) return;
              const rect = renderer.domElement.getBoundingClientRect();
              const x = ((event.clientX || event.changedTouches[0].clientX) - rect.left) / rect.width * 2 - 1;
              const y = -((event.clientY || event.changedTouches[0].clientY) - rect.top) / rect.height * 2 + 1;
              mouse.x = x;
              mouse.y = y;
              raycaster.setFromCamera(mouse, camera);
              
              const tileIntersects = raycaster.intersectObjects(scene.children, true)
                  .filter(obj => obj.object.userData?.index !== undefined);
              
              if (tileIntersects.length > 0) {
                  const selectedTile = tileIntersects[0].object;
                  const treeIndex = selectedTile.userData.index;
                  sendMessage({
                      type: 'treeSelected',
                      treeIndex: treeIndex
                  });
                  
                  gsap.to(selectedTile.position, {
                      y: selectedTile.position.y + 0.3,
                      duration: 0.3,
                      ease: "power2.out",
                      onComplete: () => {
                          gsap.to(selectedTile.position, {
                              y: selectedTile.position.y - 0.3,
                              duration: 0.2,
                              ease: "bounce.out"
                          });
                      }
                  });
              }
          };

          window.addEventListener('click', handleTap);
          window.addEventListener('touchend', handleTap);

          const animate = () => {
              requestAnimationFrame(animate);
              currentRotationY += (targetRotationY - currentRotationY) * 0.1;
              scene.rotation.y = currentRotationY;
              renderer.render(scene, camera);
          };

          window.onload = () => {
              createStars();
              createGarden();
              createTiles();
              createPlants();
              animate();
              setTimeout(() => {
                  document.getElementById('loadingScreen').style.display = 'none';
                  sendMessage({ type: 'sceneLoaded' });
              }, 1500);
          };

          window.addEventListener('resize', () => {
              camera.aspect = window.innerWidth / window.innerHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(window.innerWidth, window.innerHeight);
          });
      </script>
  </body>
  </html>
  `;
};
// Rewards Tab Component
const RewardsTab = ({ challenges }) => {
  const [rewardModalVisible, setRewardModalVisible] = useState(false);
  const [selectedTree, setSelectedTree] = useState(null);
  const webViewRef = useRef(null);

  const completedChallenges = challenges.filter((c) => c.progress > 0).length;

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "treeSelected") {
        const reward = challenges[data.treeIndex];
        if (reward) setSelectedTree(reward);
        setRewardModalVisible(true);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  return (
    <View className="flex-1">
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{
          html: generateThreeJsContent(completedChallenges, challenges.length),
        }}
        style={{ flex: 1 }}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View className="flex-1 items-center justify-center bg-[#0a0f1a]">
            <Text className="text-[#00b890] animate-pulse">
              Generating Eco-World...
            </Text>
          </View>
        )}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={rewardModalVisible}
        onRequestClose={() => setRewardModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-[#131d2a] rounded-2xl p-6 w-11/12 border border-[#00b890]/30">
            {selectedTree && (
              <>
                <View className="items-center mb-4">
                  <View className="w-20 h-20 rounded-full bg-[#00b890]/10 items-center justify-center mb-3">
                    {selectedTree.icon}
                  </View>
                  <Text className="text-[#00b890] text-xl font-bold text-center">
                    {selectedTree.title}
                  </Text>
                </View>
                <Text className="text-[#e0e0e0] text-center mb-6 text-sm">
                  {selectedTree.description}
                </Text>
                <TouchableOpacity
                  className="bg-[#00b890] py-3 rounded-xl items-center"
                  onPress={() => setRewardModalVisible(false)}
                >
                  <Text className="text-white font-medium">Claim Reward</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Main Component
export default function ChallengesLeaderboard() {
  const [activeTab, setActiveTab] = useState("challenges");
  const [rewardModalVisible, setRewardModalVisible] = useState(false);
  const [selectedTree, setSelectedTree] = useState(null);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const webViewRef = useRef(null);
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Renewable Energy Projects",
      progress: 0, // This will be updated with real data
      total: 5,
      icon: (
        <MaterialCommunityIcons
          name="solar-power"
          size={24}
          color={COLORS.tertiary}
        />
      ),
      color: COLORS.tertiary,
    },
    {
      id: 2,
      title: "Daily Steps",
      progress: 7500,
      total: 10000,
      icon: <FontAwesome5 name="walking" size={20} color="#3b82f6" />,
      color: "#3b82f6",
    },
    {
      id: 3,
      title: "Public Transport Trips",
      progress: 3,
      total: 5,
      icon: (
        <MaterialCommunityIcons name="bus" size={24} color={COLORS.primary} />
      ),
      color: COLORS.primary,
    },
    {
      id: 4,
      title: "Utility Savings",
      progress: 45,
      total: 100,
      icon: (
        <MaterialCommunityIcons
          name="lightning-bolt"
          size={24}
          color="#f59e0b"
        />
      ),
      color: "#f59e0b",
    },
    {
      id: 5,
      title: "Eco-friendly Products",
      progress: 4,
      total: 10,
      icon: (
        <MaterialCommunityIcons
          name="shopping-outline"
          size={24}
          color={COLORS.secondary}
        />
      ),
      color: COLORS.secondary,
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Fetch the number of invested projects from the backend
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setRefreshing(true);

    try {
      // Fetch invested projects count
      const investedResponse = await fetch(
        "http://localhost:8000/login/getinvested"
      );
      const investedData = await investedResponse.json();
      const investedProjectsCount = investedData.investedProjectsCount;

      // Fetch steps count
      const stepsResponse = await fetch("http://localhost:8000/login/getsteps");
      const stepsData = await stepsResponse.json();
      const stepsCount = stepsData.stepsCount;

      const tripsResponse = await fetch("http://localhost:8000/login/gettrips");
      const tripsData = await tripsResponse.json();
      const tripsCount = tripsData.public_trips;

      const userResponse = await fetch(
        "http://localhost:8000/login/findallusers"
      );
      if (!userResponse.ok) {
        throw new Error(`HTTP error! Status: ${userResponse.status}`);
      }
      const userData = await userResponse.json();

      const sortedUsers = userData.users.sort((a, b) => {
        const totalA = a.carbonFootprint.electricity + a.carbonFootprint.gas;
        const totalB = b.carbonFootprint.electricity + b.carbonFootprint.gas;
        return totalB - totalA; // Sort in increasing order
      });

      setLeaderboardData(sortedUsers);

      // Update the challenges array with real data
      setChallenges((prevChallenges) =>
        prevChallenges.map((challenge) => {
          if (challenge.id === 1) {
            return { ...challenge, progress: investedProjectsCount }; // Update Renewable Energy Projects
          } else if (challenge.id === 2) {
            return { ...challenge, progress: stepsCount }; // Update Daily Steps
          } else if (challenge.id === 3) {
            return { ...challenge, progress: tripsCount };
          } else {
            return challenge;
          }
        })
      );
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle refresh
  const onRefresh = () => {
    fetchData();
  };

  useEffect(() => {
    console.log("Leaderboard Data Updated:", leaderboardData);
  }, [leaderboardData]);

  // Sample leaderboard data
  const leaderboard = [
    { id: 1, name: "Emma S.", rank: 1, carbonSaved: 342.8, avatar: null },
    { id: 2, name: "Mike T.", rank: 2, carbonSaved: 328.5, avatar: null },
    {
      id: 3,
      name: "Deep",
      rank: 3,
      carbonSaved: 314.2,
      avatar: null,
      isCurrentUser: true,
    },
    { id: 4, name: "Sarah P.", rank: 4, carbonSaved: 295.1, avatar: null },
    { id: 5, name: "John D.", rank: 5, carbonSaved: 287.3, avatar: null },
    { id: 6, name: "Lisa K.", rank: 6, carbonSaved: 271.6, avatar: null },
    { id: 7, name: "Alex M.", rank: 7, carbonSaved: 258.9, avatar: null },
    { id: 8, name: "Priya S.", rank: 8, carbonSaved: 249.5, avatar: null },
    { id: 9, name: "Thomas R.", rank: 9, carbonSaved: 232.8, avatar: null },
    { id: 10, name: "Olivia L.", rank: 10, carbonSaved: 221.4, avatar: null },
  ];

  // Sample rewards data
  const rewards = [
    {
      id: 1,
      title: "Public Transport Champion",
      description:
        "You've saved 12kg of CO2 by choosing public transport! Congrats, you get 12 credits to redeem on your electricity bill!",
      icon: "bus",
      color: COLORS.primary,
    },
    {
      id: 2,
      title: "Eco Shopper",
      description:
        "Your eco-friendly product choices have saved 8kg of CO2! Congrats, you get 8 credits to redeem on your electricity bill!",
      icon: "shopping-outline",
      color: COLORS.secondary,
    },
    {
      id: 3,
      title: "Energy Innovator",
      description:
        "Your renewable energy initiatives have saved 15kg of CO2! Congrats, you get 15 credits to redeem on your electricity bill!",
      icon: "solar-power",
      color: COLORS.tertiary,
    },
    {
      id: 4,
      title: "Utility Saver",
      description:
        "You've saved 6kg of CO2 through reduced utility usage! Congrats, you get 6 credits to redeem on your electricity bill!",
      icon: "lightning-bolt",
      color: "#f59e0b",
    },
    {
      id: 5,
      title: "Active Lifestyle",
      description:
        "Walking instead of driving has saved 10kg of CO2! Congrats, you get 10 credits to redeem on your electricity bill!",
      icon: "walk",
      color: "#3b82f6",
    },
  ];

  // Current user data (for demonstration purposes)
  const currentUser = leaderboardData.find(
    (user) => user.email === "deeppatel@outlook.com"
  );

  // Calculate rank for the current user
  const currentUserRank =
    leaderboardData.findIndex(
      (user) => user.email === "deeppatel@outlook.com"
    ) + 1;

  // Calculate number of completed challenges
  const completedChallenges = challenges.filter(
    (challenge) => challenge.progress > 0
  ).length;

  // Handle messages from WebView
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "treeSelected") {
        // Find reward for this tree
        if (data.treeIndex < rewards.length) {
          setSelectedTree(rewards[data.treeIndex]);
          setRewardModalVisible(true);
        }
      } else if (data.type === "sceneLoaded") {
        setSceneLoaded(true);
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <StatusBar barStyle="light-content" />

      <View className="px-5 py-4 mt-10">
        <Text className="text-2xl font-bold text-[#e0e0e0] mb-6">
          Impact Dashboard
        </Text>

        {/* Tab Switcher */}
        <View className="flex-row bg-[#131d2a] p-1 rounded-full mb-6 border border-white/10">
          <TouchableOpacity
            className={`flex-1 py-2.5 px-4 mr-1 rounded-full flex-row items-center justify-center ${
              activeTab === "challenges" ? "bg-[#00b890]" : ""
            }`}
            onPress={() => setActiveTab("challenges")}
          >
            <MaterialCommunityIcons
              name="trophy-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text
              className={`font-semibold text-md ${
                activeTab === "challenges" ? "text-white" : "text-white/60"
              }`}
            >
              Challenges
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2.5 px-4 rounded-full flex-row items-center justify-center ${
              activeTab === "leaderboard" ? "bg-[#00b890]" : ""
            }`}
            onPress={() => setActiveTab("leaderboard")}
          >
            <MaterialCommunityIcons
              name="podium"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text
              className={`font-semibold text-md ${
                activeTab === "leaderboard" ? "text-white" : "text-white/60"
              }`}
            >
              Leaderboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2.5 px-4 ml-1 rounded-full flex-row items-center justify-center ${
              activeTab === "rewards" ? "bg-[#00b890]" : ""
            }`}
            onPress={() => setActiveTab("rewards")}
          >
            <MaterialCommunityIcons
              name="gift-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text
              className={`font-semibold text-md ${
                activeTab === "rewards" ? "text-white" : "text-white/60"
              }`}
            >
              Rewards
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Challenges Tab Content */}
      {activeTab === "challenges" && (
        <ScrollView
          className="flex-1 px-5"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        >
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[#e0e0e0] text-lg font-semibold">
                Your Active Challenges
              </Text>
              <TouchableOpacity onPress={onRefresh}>
                <Text className="text-[#00b890]">Reload</Text>
              </TouchableOpacity>
            </View>

            {/* Challenge Summary Card */}
            <LinearGradient
              colors={["#00b890", "#00a583", "#008c73"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-5 rounded-2xl mb-6"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white/80 text-sm mb-1">This Month</Text>
                  <Text className="text-white text-2xl font-bold">
                    {(() => {
                      const userData = leaderboardData.find(
                        (user) => user.email === "deeppatel@outlook.com"
                      );
                      return userData
                        ? (
                            userData.carbonFootprint.electricity +
                            userData.carbonFootprint.gas
                          ).toFixed(1)
                        : "0";
                    })()}{" "}
                    kg
                  </Text>
                  <Text className="text-white/80 mt-1">Carbon Saved</Text>
                </View>

                <View className="h-16 w-16 bg-white/20 rounded-full items-center justify-center">
                  <MaterialCommunityIcons name="leaf" size={30} color="#fff" />
                </View>
              </View>

              <View className="mt-4 pt-4 border-t border-white/20 flex-row justify-between">
                <View>
                  <Text className="text-white/80 text-xs">Progress</Text>
                  <Text className="text-white font-semibold mt-1">62%</Text>
                </View>

                <View>
                  <Text className="text-white/80 text-xs">Target</Text>
                  <Text className="text-white font-semibold mt-1">90 kg</Text>
                </View>

                <View>
                  <Text className="text-white/80 text-xs">Badges</Text>
                  <Text className="text-white font-semibold mt-1">3</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Challenge Cards */}
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                title={challenge.title}
                progress={challenge.progress}
                total={challenge.total}
                icon={challenge.icon}
                color={challenge.color}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {/* Leaderboard Tab Content */}
      {activeTab === "leaderboard" && (
        <ScrollView className="flex-1">
          <View className="px-5 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[#e0e0e0] text-lg font-semibold">
                Top Carbon Savers
              </Text>
              <TouchableOpacity>
                <Text className="text-[#00b890]">Monthly</Text>
              </TouchableOpacity>
            </View>

            {/* Top 3 Users */}
            <View className="flex-row justify-around py-6 mb-4">
              {/* 2nd Place */}
              <View className="items-center">
                <View className="w-16 h-16 rounded-full bg-[#131d2a] border-2 border-[#C0C0C0] items-center justify-center">
                  <Text className="text-white font-bold text-lg">
                    {leaderboardData[1]?.name.charAt(0)}
                  </Text>
                </View>
                <View className="items-center mt-2 bg-[#131d2a] px-3 py-1 rounded-lg">
                  <Text className="text-[#C0C0C0] text-xs font-medium">
                    2nd Place
                  </Text>
                  <Text className="text-white font-bold">
                    {(
                      leaderboardData[1]?.carbonFootprint.electricity +
                      leaderboardData[1]?.carbonFootprint.gas
                    ).toFixed(2)}{" "}
                    kg
                  </Text>
                </View>
              </View>

              {/* 1st Place */}
              <View className="items-center">
                <View className="w-20 h-20 rounded-full bg-[#131d2a] border-2 border-[#FFD700] items-center justify-center">
                  <Text className="text-white font-bold text-xl">
                    {leaderboardData[0]?.name.charAt(0)}
                  </Text>
                </View>
                <View className="items-center mt-2 bg-[#131d2a] px-3 py-1 rounded-lg">
                  <Text className="text-[#FFD700] text-xs font-medium">
                    1st Place
                  </Text>
                  <Text className="text-white font-bold">
                    {(
                      leaderboardData[0]?.carbonFootprint.electricity +
                      leaderboardData[0]?.carbonFootprint.gas
                    ).toFixed(2)}{" "}
                    kg
                  </Text>
                </View>
              </View>

              {/* 3rd Place */}
              <View className="items-center">
                <View className="w-16 h-16 rounded-full bg-[#131d2a] border-2 border-[#CD7F32] items-center justify-center">
                  <Text className="text-white font-bold text-lg">
                    {leaderboardData[2]?.name.charAt(0)}
                  </Text>
                </View>
                <View className="items-center mt-2 bg-[#131d2a] px-3 py-1 rounded-lg">
                  <Text className="text-[#CD7F32] text-xs font-medium">
                    3rd Place
                  </Text>
                  <Text className="text-white font-bold">
                    {(
                      leaderboardData[2]?.carbonFootprint.electricity +
                      leaderboardData[2]?.carbonFootprint.gas
                    ).toFixed(2)}{" "}
                    kg
                  </Text>
                </View>
              </View>
            </View>

            {/* Leaderboard List */}
            <View className="bg-[#131d2a] rounded-2xl overflow-hidden border border-white/10">
              <View className="py-3 px-4 bg-black/20 flex-row">
                <Text className="text-white/60 font-medium w-8">#</Text>
                <Text className="text-white/60 font-medium flex-1">User</Text>
                <Text className="text-white/60 font-medium">Carbon Saved</Text>
              </View>

              {leaderboardData.map((user, index) => (
                <LeaderboardRow
                  key={user._id}
                  rank={index + 1}
                  name={user.name}
                  avatar={null} // Add avatar URL if available
                  carbonSaved={(
                    user.carbonFootprint.electricity + user.carbonFootprint.gas
                  ).toFixed(2)}
                  isCurrentUser={user.email === "deeppatel@outlook.com"} // Replace with current user email
                />
              ))}
            </View>

            {/* Your Ranking Card */}
            <View className="bg-[#131d2a] p-4 rounded-2xl mt-6 border border-white/10">
              <Text className="text-white/60 font-medium mb-3">
                Your Position
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-full bg-[#00b890]/20 mr-3 items-center justify-center">
                    <Text className="text-[#00b890] font-bold text-xl">
                      {currentUserRank}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-white font-semibold">Top 5%</Text>
                    <Text className="text-white/60 text-sm">of all users</Text>
                  </View>
                </View>
                {/* WhatsApp Share Button */}
                <TouchableOpacity
                  className="bg-[#00b890] px-4 py-2 rounded-lg flex-row items-center"
                  onPress={() =>
                    shareToWhatsApp(currentUser.carbonSaved, currentUser.rank)
                  }
                >
                  <FontAwesome5
                    name="whatsapp"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 6 }}
                  />
                  <Text className="text-white font-medium">Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Rewards Tab Content */}
      {activeTab === "rewards" && (
        <View className="flex-1">
          <View className="bg-[#131d2a] rounded-lg p-2 mx-4 border border-white/10">
            <Text className="text-[#e0e0e0] text-sm font-psemibold text-center leading-6">
              🌳 Each tree symbolizes a challenge you've conquered. Tap on a
              tree to unveil your reward and see the impact you've made!
            </Text>
          </View>

          <WebView
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{
              html: generateThreeJsContent(
                completedChallenges,
                challenges.length
              ),
            }}
            style={{ flex: 1 }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View
                className="flex-1 items-center justify-center"
                style={{ backgroundColor: COLORS.background }}
              >
                <Text className="text-[#e0e0e0]">Loading 3D Map...</Text>
              </View>
            )}
          />

          {/* Reward Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={rewardModalVisible}
            onRequestClose={() => setRewardModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-[#131d2a] rounded-2xl p-6 w-11/12 max-w-md border border-white/10">
                {selectedTree && (
                  <>
                    <View className="items-center mb-4">
                      <View
                        className={`w-16 h-16 rounded-full mb-3 items-center justify-center`}
                        style={{ backgroundColor: `${selectedTree.color}20` }}
                      >
                        <MaterialCommunityIcons
                          name={selectedTree.icon}
                          size={32}
                          color={selectedTree.color}
                        />
                      </View>
                      <Text className="text-[#e0e0e0] text-xl font-bold text-center">
                        {selectedTree.title}
                      </Text>
                    </View>

                    <Text className="text-[#e0e0e0] text-center mb-6">
                      {selectedTree.description}
                    </Text>

                    <TouchableOpacity
                      className="bg-[#00b890] px-4 py-3 rounded-lg items-center"
                      onPress={() => setRewardModalVisible(false)}
                    >
                      <Text className="text-white font-medium">Claim</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
}
