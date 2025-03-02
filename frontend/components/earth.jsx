import React from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Interactive 3D Earth</title>
      <style>
        body { 
          margin: 0;
          overflow: hidden;
          width: 100vw;
          height: 100vh;
          background-color: #000;
          touch-action: none;
        }
        canvas { 
          display: block;
        }
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-family: Arial, sans-serif;
        }
        .info {
          position: absolute;
          bottom: 20px;
          left: 20px;
          color: white;
          font-family: Arial, sans-serif;
          font-size: 12px;
          background-color: rgba(0, 0, 0, 0.5);
          padding: 10px;
          border-radius: 5px;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="loading" id="loading">Loading Earth...</div>
      <div class="info" id="info">
        • Drag to rotate
      </div>
      
      <script>
        // Load Three.js from CDN with a callback
        function loadScript(url, callback) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = url;
          script.onload = callback;
          document.head.appendChild(script);
        }
        
        // First load Three.js, then OrbitControls, then start the app
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', function() {
          // After Three.js loads, load OrbitControls
          loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js', initApp);
        });
        
        // Main application
        function initApp() {
          // Make sure Three.js is loaded
          if (typeof THREE === 'undefined') {
            document.getElementById('loading').textContent = 'Error: Three.js not loaded';
            return;
          }
          
          // Scene setup
          const scene = new THREE.Scene();
          
          // Camera setup
          const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
          
          // Renderer setup
          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setPixelRatio(window.devicePixelRatio);
          renderer.toneMappingExposure = 1.2;
          document.body.appendChild(renderer.domElement);
          
          // India coordinates (approximate)
          // Longitude: ~78°E (78 degrees east)
          // Latitude: ~21°N (21 degrees north)
          // Convert to radians for initial rotation
          const indiaLongitude = 78 * (Math.PI/180);
          const indiaLatitude = 21 * (Math.PI/180);
          
          // Earth geometry
          const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
          
          // Earth material with custom appearance
          const earthMaterial = new THREE.MeshPhongMaterial({
            shininess: 0,
          });
          
          // Create and add Earth mesh to scene
          const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
          // Rotate Earth to show India
          earthMesh.rotation.y = -indiaLongitude; // Negative because we're rotating the earth, not the camera
          scene.add(earthMesh);
          
          // Add ambient light
          const ambientLight = new THREE.AmbientLight(0xffffff, 0);
          scene.add(ambientLight);
          
          // Add directional light (sunlight)
          const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
          sunLight.position.set(5, 3, 5);
          scene.add(sunLight);
          
          // Add a subtle blue atmospheric glow
          const glowGeometry = new THREE.SphereGeometry(1.02, 32, 32);
          const glowMaterial = new THREE.MeshPhongMaterial({
            color: 0x0033ff,
            transparent: true,
            opacity: 0.1,
            shininess: 0
          });
          
          const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
          scene.add(glowMesh);
          
          // Create very subtle cloud layer
          const cloudGeometry = new THREE.SphereGeometry(1.015, 32, 32);
          const cloudMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2
          });
          
          const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
          cloudMesh.rotation.y = -indiaLongitude; // Match earth rotation
          scene.add(cloudMesh);
          
          // Position camera to focus on India (accounting for India's latitude)
          camera.position.x = Math.cos(indiaLatitude) * 3;
          camera.position.y = Math.sin(indiaLatitude) * 3;
          camera.position.z = 0.5;
          camera.lookAt(0, 0, 0);
          
          // Add OrbitControls - with fallback if not loaded properly
          let controls;
          try {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.rotateSpeed = 0.5;
            controls.minDistance = 5;  // Minimum zoom distance
            controls.maxDistance = 10;   // Maximum zoom distance
            controls.enableZoom = false; // Disable zoom
            controls.enablePan = false;  // Disable pan
            controls.target.set(0, 0, 0);
            controls.update();
          } catch (e) {
            console.error('OrbitControls not available:', e);
            document.getElementById('info').textContent = 'Interactive controls not available';
            // We already set the camera position above
          }
          
          // Use a high-quality earth texture
          const textureLoader = new THREE.TextureLoader();
          
          // Earth textures in priority order
          const textureURLs = [
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_4k.jpg',
            'https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74117/world.topo.200407.3x5400x2700.jpg',
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'
          ];
          
          // Try loading textures in order until one works
          function tryLoadTexture(index) {
            if (index >= textureURLs.length) {
              document.getElementById('loading').textContent = 'Using basic Earth (textures failed to load)';
              setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
              }, 2000);
              return;
            }
            
            textureLoader.load(
              textureURLs[index],
              function(texture) {
                // Apply texture to Earth
                earthMaterial.map = texture;
                earthMaterial.needsUpdate = true;
                
                // Hide loading text
                document.getElementById('loading').style.display = 'none';
                
                // Try to load cloud texture
                textureLoader.load(
                  'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.jpg',
                  function(cloudTexture) {
                    cloudMaterial.map = cloudTexture;
                    cloudMaterial.opacity = 0.15; // Very subtle clouds
                    cloudMaterial.needsUpdate = true;
                  }
                );
              },
              undefined,
              function(error) {
                console.error('Error loading texture', error);
                // Try the next texture in the list
                tryLoadTexture(index + 1);
              }
            );
          }
          
          // Start trying to load textures
          tryLoadTexture(0);
          
          // Handle window resize
          window.addEventListener('resize', function() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            
            renderer.setSize(width, height);
          });
          
          // Hide instructions after 5 seconds
          setTimeout(() => {
            const info = document.getElementById('info');
            info.style.opacity = '0';
            info.style.transition = 'opacity 1s ease-out';
          }, 5000);
          
          // Animation loop
          function animate() {
            requestAnimationFrame(animate);
            
            // Rotate the Earth
            earthMesh.rotation.y += 0.001; // Adjust rotation speed here
            
            // Rotate clouds slightly differently for effect
            if (cloudMesh) {
              cloudMesh.rotation.y += 0.0012; // Slightly faster than Earth
            }
            
            // If OrbitControls is available, update it
            if (controls) {
              controls.update();
            }
            
            renderer.render(scene, camera);
          }
          
          // Start animation
          animate();
        }
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        style={styles.webview}
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("WebView error: ", nativeEvent);
        }}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading WebView...</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
  },
});
