import * as THREE from "three";
import { radians } from "../helper";

export default class Cone {
  geom: THREE.ConeGeometry;
  rotationX: number;
  rotationY: number;
  rotationZ: number;

  constructor() {
    this.geom = new THREE.ConeBufferGeometry(.3, .5, 32);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = radians(-180);
  }
}