import * as THREE from "three";
import { radians } from "../helper";

export default class Torus {
  geom: THREE.TorusBufferGeometry;
  rotationX: number;
  rotationY: number;
  rotationZ: number;

  constructor() {
    this.geom = new THREE.TorusBufferGeometry(.3, .12, 30, 200);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
  }
}