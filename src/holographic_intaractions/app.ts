
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Box from "./elements/box";
import Cone from "./elements/cone";
import Torus from "./elements/torus";
import { distance, map, radians, hexToRgbTreeJs } from "./helper";

//@ts-ignore
import { TweenMax, Expo } from "gsap/gsap-core";


export default class App{
  raycaster: THREE.Raycaster;
  gutter: { size: number; };
  meshes: Array<THREE.Mesh>[];
  grid: { cols: number; rows: number; };
  width: number;
  height: number;
  mouse3D: THREE.Vector2;
  geometries: (Box | Torus | Cone)[];
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  groupMesh: THREE.Object3D;
  controls: OrbitControls;
  floor: THREE.Mesh<THREE.PlaneGeometry, THREE.ShadowMaterial>;

  constructor() {
    // handles mouse coordinates mapping from 2D canvas to 3D world
    this.raycaster = new THREE.Raycaster();
  
    this.gutter = { size: 1 };
    this.meshes = [];
    this.grid = { cols: 14, rows: 6 };
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse3D = new THREE.Vector2();
    this.geometries = [
      new Box(),
      new Torus(),
      new Cone()
    ];
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.camera = new THREE.PerspectiveCamera();
    this.groupMesh = new THREE.Object3D();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.floor = new THREE.Mesh();

    this.setup();
    this.createScene();
    this.createCamera();
    this.addAmbientLight();
    this.addSpotLight();
    this.addRectLight();
    this.createGrid();
    this.addCameraControls();
    this.addFloor();
    this.animate();
    this.addPointLight(0xfff000, { x: 0, y: 10, z: -100 });
    this.addPointLight(0xfff000, { x: 100, y: 10, z: 0 });
    this.addPointLight(0x00ff00, { x: 20, y: 5, z: 20 });
  }
  
  setup() {
    window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });
    
    // we call this to simulate the initial position of the mouse cursor
    this.onMouseMove({ clientX: 0, clientY: 0 });

    window.addEventListener('resize', this.onResize.bind(this));
  }
  
  onMouseMove({ clientX, clientY}: {clientX: number, clientY: number }) {
    this.mouse3D.x = (clientX / this.width) * 2 - 1;
    this.mouse3D.y = -(clientY / this.height) * 2 + 1;
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  createScene() {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);


    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(this.renderer.domElement);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1);

    // set the distance our camera will have from the grid
    this.camera.position.set(0, 65, 0);

    // we rotate our camera so we can get a view from the top
    this.camera.rotation.x = -1.57;

    this.scene.add(this.camera);
  }

  getRandomGeometry() {
    return this.geometries[Math.floor(Math.random() * Math.floor(this.geometries.length))];
  }

  getMesh(geometry: any, material: any) {
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  createGrid() {
    // create a basic 3D object to be used as a container for our grid elements so we can move all of them together
    this.groupMesh = new THREE.Object3D();

    const meshParams = {
      color: '#ff00ff',
      metalness: .58,
      emissive: '#000000',
      roughness: .18,
    };

    // we create our material outside the loop to keep it more performant
    const material = new THREE.MeshPhysicalMaterial(meshParams);

    for (let row = 0; row < this.grid.rows; row++) {
      this.meshes[row] = [];

      for (let col = 0; col < this.grid.cols; col++) {
        const geometry = this.getRandomGeometry();
        const mesh = this.getMesh(geometry.geom, material);

        mesh.position.set(col + (col * this.gutter.size), 0, row + (row * this.gutter.size));
        mesh.rotation.x = geometry.rotationX;
        mesh.rotation.y = geometry.rotationY;
        mesh.rotation.z = geometry.rotationZ;

        // store the initial rotation values of each element so we can animate back
        const initialRotation = {
          x: mesh.rotation.x,
          y: mesh.rotation.y,
          z: mesh.rotation.z,
        };

        Object.defineProperty(mesh, 'initialRotation',{
          value: initialRotation,
          writable: false, 
          enumerable: true,
          configurable: false
        });

        this.groupMesh.add(mesh);

        // store the element inside our array so we can get back when need to animate
        this.meshes[row][col] = mesh;
      }
    }

    //center on the X and Z our group mesh containing all the grid elements
    const centerX = ((this.grid.cols - 1) + ((this.grid.cols - 1) * this.gutter.size)) * .5;
    const centerZ = ((this.grid.rows - 1) + ((this.grid.rows - 1) * this.gutter.size)) * .5;
    this.groupMesh.position.set(-centerX, 0, -centerZ);

    this.scene.add(this.groupMesh);
  }

  addAmbientLight() {
    const obj = { color: '#2900af' };
    const light = new THREE.AmbientLight(obj.color, 1);

    this.scene.add(light);

    // const gui = this.gui.addFolder('Ambient Light');

    // gui.addColor(obj, 'color').onChange((color: string) => {
    //   light.color = hexToRgbTreeJs(color);
    // });
  }

  addSpotLight() {
    const obj = { color: '#e000ff' };
    const light = new THREE.SpotLight(obj.color, 1, 1000);

    light.position.set(0, 27, 0);
    light.castShadow = true;

    this.scene.add(light);

    // const gui = this.gui.addFolder('Spot Light');

    // gui.addColor(obj, 'color').onChange((color) => {
    //   light.color = hexToRgbTreeJs(color);
    // });
  }

  addRectLight() {
    const obj = { color: '#0077ff' };
    const rectLight = new THREE.RectAreaLight(obj.color, 1, 2000, 2000);

    rectLight.position.set(5, 50, 50);
    rectLight.lookAt(0, 0, 0);

    this.scene.add(rectLight);

    // const gui = this.gui.addFolder('Rect Light');

    // gui.addColor(obj, 'color').onChange((color) => {
    //   rectLight.color = hexToRgbTreeJs(color);
    // });
  }

  addPointLight(color: number, position: { x: number, y: number, z: number }) {
    const pointLight = new THREE.PointLight(color, 1, 1000, 1);
    pointLight.position.set(position.x, position.y, position.z);

    this.scene.add(pointLight);
  }

  addCameraControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  addFloor() {
    const geometry = new THREE.PlaneGeometry(2000, 2000);
    const material = new THREE.ShadowMaterial({ opacity: .3 });

    this.floor = new THREE.Mesh(geometry, material);
    this.floor.position.y = 0;
    this.floor.rotateX(- Math.PI / 2);
    this.floor.receiveShadow = true;

    this.scene.add(this.floor);
  }

  draw() {
    this.raycaster.setFromCamera(this.mouse3D, this.camera);

    const intersects = this.raycaster.intersectObjects([this.floor]);

    if (intersects.length) {
      const { x, z } = intersects[0].point;

      for (let row = 0; row < this.grid.rows; row++) {
        for (let col = 0; col < this.grid.cols; col++) {

          const mesh = this.meshes[row][col];

          const mouseDistance = distance(x, z,
            mesh.position.x + this.groupMesh.position.x,
            mesh.position.z + this.groupMesh.position.z);

          const y = map(mouseDistance, 6, 0, 0, 10);
          TweenMax.to(mesh.position, .2, { y: y < 1 ? 1 : y });

          const scaleFactor = mesh.position.y / 2.5;
          const scale = scaleFactor < 1 ? 1 : scaleFactor;

          TweenMax.to(mesh.scale, .4, {
            ease: Expo.easeOut,
            x: scale,
            y: scale,
            z: scale,
          });

          
          TweenMax.to(mesh.rotation, .5, {
            ease: Expo.easeOut,
            // @ts-ignore
            x: map(mesh.position.y, -1, 1, radians(45), mesh.initialRotation.x + 10),
            // @ts-ignore
            z: map(mesh.position.y, -1, 1, radians(-90), mesh.initialRotation.z + 10),
            // @ts-ignore
            y: map(mesh.position.y, -1, 1, radians(90), mesh.initialRotation.y + 10),
          });
        }
      }
    }
  }

  animate() {
    this.controls.update();

    this.draw();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate.bind(this));
  }
}