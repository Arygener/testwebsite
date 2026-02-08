gsap.registerPlugin(ScrollTrigger);

const heroTimeline = gsap.timeline({
  defaults: { duration: 1, ease: "power3.out" },
});

heroTimeline
  .from(".hero-content > *", { opacity: 0, y: 30, stagger: 0.12 })
  .from(
    ".glass-panel",
    { opacity: 0, scale: 0.9, y: 20 },
    "-=0.4"
  );

gsap.utils.toArray("section").forEach((section) => {
  gsap.from(section, {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
    },
  });
});

const canvas = document.getElementById("workspace");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

const workspace = new THREE.Group();
scene.add(workspace);

const deskMaterial = new THREE.MeshStandardMaterial({
  color: 0x0b0f1f,
  metalness: 0.6,
  roughness: 0.4,
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x7cf7ff,
  metalness: 0.1,
  roughness: 0.1,
  transmission: 0.9,
  opacity: 0.8,
  transparent: true,
});

const accentMaterial = new THREE.MeshStandardMaterial({
  color: 0xb48cff,
  metalness: 0.8,
  roughness: 0.2,
});

const desk = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 3), deskMaterial);
desk.position.y = -1.2;
workspace.add(desk);

const monitor = new THREE.Mesh(
  new THREE.BoxGeometry(2.6, 1.6, 0.2),
  glassMaterial
);
monitor.position.set(0, 0.1, -0.6);
workspace.add(monitor);

const screen = new THREE.Mesh(
  new THREE.PlaneGeometry(2.3, 1.3),
  new THREE.MeshBasicMaterial({ color: 0x101828 })
);
screen.position.set(0, 0.1, -0.5);
workspace.add(screen);

const stand = new THREE.Mesh(
  new THREE.CylinderGeometry(0.15, 0.2, 0.7, 32),
  accentMaterial
);
stand.position.set(0, -0.6, -0.6);
workspace.add(stand);

const keyboard = new THREE.Mesh(
  new THREE.BoxGeometry(2.2, 0.1, 0.6),
  new THREE.MeshStandardMaterial({ color: 0x1f2a44 })
);
keyboard.position.set(0, -0.9, 0.1);
workspace.add(keyboard);

const tablet = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 0.05, 0.8),
  new THREE.MeshStandardMaterial({ color: 0x0f172a })
);
tablet.position.set(-1.6, -0.85, 0.3);
workspace.add(tablet);

const coffee = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.25, 0.4, 32),
  new THREE.MeshStandardMaterial({ color: 0xf9c0ff, metalness: 0.4 })
);
coffee.position.set(1.8, -0.85, 0.2);
workspace.add(coffee);

const halo = new THREE.Mesh(
  new THREE.TorusGeometry(1.6, 0.05, 16, 100),
  new THREE.MeshStandardMaterial({ color: 0x7cf7ff, emissive: 0x7cf7ff })
);
halo.rotation.x = Math.PI / 2.2;
halo.position.y = 0.2;
workspace.add(halo);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x7cf7ff, 1.2, 30);
pointLight.position.set(4, 4, 4);
scene.add(pointLight);

const rimLight = new THREE.PointLight(0xb48cff, 1, 20);
rimLight.position.set(-4, 3, 2);
scene.add(rimLight);

camera.position.set(0, 0.6, 6);
scene.add(camera);

const resizeRenderer = () => {
  const { clientWidth, clientHeight } = canvas.parentElement;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
};

resizeRenderer();
window.addEventListener("resize", resizeRenderer);

const scrollTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom+=400 top",
    scrub: 1,
  },
});

scrollTimeline
  .to(workspace.rotation, { y: Math.PI * 1.2, x: -0.25 })
  .to(workspace.position, { y: 0.3, z: -0.8 }, 0)
  .to(halo.scale, { x: 1.3, y: 1.3, z: 1.3 }, 0);

const floatTimeline = gsap.timeline({ repeat: -1, yoyo: true });
floatTimeline.to(workspace.position, { y: 0.15, duration: 3, ease: "sine.inOut" });

const animate = () => {
  halo.rotation.z += 0.003;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
