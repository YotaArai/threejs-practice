import * as THREE from "three";

export default class Box {
  geom: THREE.BoxBufferGeometry;
  rotationX: number;
  rotationY: number;
  rotationZ: number;

  constructor() {
    this.geom = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
  }
}