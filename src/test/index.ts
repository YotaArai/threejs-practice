import * as THREE from "three";

window.addEventListener("DOMContentLoaded", () => {
  // レンダラーを作成
  const query = document.querySelector('#myCanvas') as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({
    canvas: query
  });
  // レンダラーのサイズを設定
  renderer.setSize(800, 600);
  // canvasをbodyに追加
  document.body.appendChild(renderer.domElement);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, 800 / 600, 1, 10000);
  camera.position.set(0, 0, 1000);

  // 箱を作成
  const geometry = new THREE.BoxGeometry(250, 250, 250);
  const material = new THREE.MeshStandardMaterial();
  const box = new THREE.Mesh(geometry, material);
  box.position.z = -5;
  scene.add(box);

  // 平行光源を生成
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  scene.add(light);

  let hue = 0;

  const tick = (): void => {
    requestAnimationFrame(tick);

    box.rotation.x += 0.05;
    box.rotation.y += 0.05;

    hue++;
    hue %= 360;

    material.color = new THREE.Color("hsl(" + hue + ", 100%, 50%)");

    // 描画
    renderer.render(scene, camera);
  };
  tick();

  onResize();


  window.addEventListener('resize', onResize);

  function onResize() {
    // サイズを取得
    const width = window.innerWidth;
    const height = window.innerHeight;

    // レンダラーのサイズを調整する
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // カメラのアスペクト比を正す
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  console.log("Hello Three.js");
});