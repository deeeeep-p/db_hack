import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { GLView } from "expo-gl";
import * as THREE from "three";
import ExpoTHREE from "expo-three";

export default function SustainabilityChallengeCard() {
  const glViewRef = useRef(null);

  useEffect(() => {
    if (!glViewRef.current) return;

    const setup = async () => {
      const gl = await glViewRef.current.createContextAsync();

      // Initialize Three.js renderer
      const renderer = new ExpoTHREE.Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

      // Create a scene
      const scene = new THREE.Scene();

      // Create a camera
      const camera = new THREE.PerspectiveCamera(
        75,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Add lighting
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 3, 5);
      scene.add(light);

      // Create the Earth
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const texture = new THREE.TextureLoader().load(
        "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"
      );
      const material = new THREE.MeshPhongMaterial({ map: texture });
      const earth = new THREE.Mesh(geometry, material);
      scene.add(earth);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        // Rotate the Earth
        earth.rotation.y += 0.005;

        // Render the scene
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };

      animate();
    };

    setup();
  }, []);

  return (
    <View style={styles.container}>
      <GLView
        ref={glViewRef}
        style={styles.glView}
        onContextCreate={async (gl) => {
          // Context is created, setup is handled in useEffect
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  glView: {
    width: "100%",
    height: "100%",
  },
});
