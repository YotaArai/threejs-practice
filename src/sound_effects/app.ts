import * as THREE from "three";

let modal: HTMLElement;
let modalButton: HTMLElement;

let windowWidth;
let windowHeight;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let sphereVertices;
let points: THREE.Points;
let pointsGeometry: THREE.BufferGeometry;
let pointsMaterial;
let pointPositions;

let audioContext: AudioContext;
let audioSource;
let audioBufferSource: AudioBufferSourceNode;
let audioAnalyser: AnalyserNode;
let audioCount: Uint8Array;

window.addEventListener("load", () => {
  initDom();
  initThree();
  initAudio().then(data => {
    modalButton.classList.remove("is-Hidden");
    modalButton.addEventListener(
      "click",
      () => {
        onClickModalButton(data);
      },
      false
    );
    modalButton.addEventListener(
      "touchstart",
      () => {
        onClickModalButton(data);
      },
      false
    );
  });
});

const initDom = () => {
  modal = document.getElementById("modal") as HTMLElement;
  modalButton = document.getElementById("modal_button") as HTMLElement;
};

const initThree = () => {
  // ウィンドウサイズを変数へ格納
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  // scene の初期設定
  scene = new THREE.Scene();

  // camera の初期設定
  camera = new THREE.PerspectiveCamera(
    45,
    windowWidth / windowHeight,
    0.1,
    1000
  );
  camera.position.z = 45;

  // renderer の初期設定
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  // デバイスピクセル比に合わせる
  renderer.setPixelRatio(window.devicePixelRatio);
  // 背景のグラデーションはCSSに任せるので、Canvasの背景は透明にする
  renderer.setClearColor(0x000000, 0.0);
  // Canvasのサイズをウィンドウサイズに合わせる
  renderer.setSize(windowWidth, windowHeight);
  // body直下にCanvasを配置
  document.body.appendChild(renderer.domElement);

  // 球体の頂点情報を取得
  const sphereGeometry = new THREE.SphereGeometry(10, 24, 24);
  sphereVertices = sphereGeometry.attributes.position.array;

  // // 球体の頂点を格納する配列の用意
  // pointPositions = new Float32Array(sphereVertices.length);

  // // vertexPosition = { x: ???, y: ???, z: ??? } なので...
  // // x, y, z の値を順番に pointPositions に格納する
  // let a = 0;
  // for (let i = 0; i < sphereVertices.length; i++) {
  //   let vertexPosition = sphereVertices[i];
  //   pointPositions[a] = vertexPosition[0];
  //   pointPositions[a + 1] = vertexPosition.y;
  //   pointPositions[a + 2] = vertexPosition.z;
  //   a += 3;
  // }

  // geometry の用意
  pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(sphereVertices, 3)
  );

  // material の用意
  const vertexShader = document.getElementById("vertexShader") as HTMLElement;
  const fragmentShader = document.getElementById("fragmentShader") as HTMLElement;
  pointsMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader.textContent as string,
    fragmentShader: fragmentShader.textContent as string
  });
  pointsMaterial.transparent = true;
  pointsMaterial.depthTest = false;

  // geometry と material を合わせて3Dオブジェクトを生成する
  points = new THREE.Points(pointsGeometry, pointsMaterial);
  scene.add(points);

  // 1度レンダリングする
  renderer.render(scene, camera);
};

const initAudio = () =>
  new Promise(resolve => {
    // AudioContext の生成
    // @ts-ignore
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // 取得する音声データ
    audioSource = "/sound_effects/bgm1.wav";
    // 音声データの入力機能
    audioBufferSource = audioContext.createBufferSource();
    // 音声データの波形取得機能
    audioAnalyser = audioContext.createAnalyser();

    let request = new XMLHttpRequest();
    request.open("GET", audioSource, true);
    request.responseType = "arraybuffer";
    // 取得した音声データをデコードし、
    // デコードされた音声データをこの後の処理に渡す
    request.onload = () => {
      audioContext.decodeAudioData(request.response, buffer => resolve(buffer));
    };
    request.send();
  });

const setAudio = (buffer: any) => {
  // 描画の更新をスムーズにするかどうかを決める
  audioAnalyser.smoothingTimeConstant = 1.0;

  // fftサイズを指定する
  audioAnalyser.fftSize = 2048;

  // 渡ってきた音声データを音源として設定する
  audioBufferSource.buffer = buffer;

  // 音源がループするように設定する
  audioBufferSource.loop = true;

  // 時間領域の波形データを格納する配列を生成
  audioCount = new Uint8Array(audioAnalyser.frequencyBinCount);

  // 音源を波形取得機能に接続
  audioBufferSource.connect(audioAnalyser);

  // 波形取得機能を出力機能に接続
  audioAnalyser.connect(audioContext.destination);

  // 音源の再生を開始する
  audioBufferSource.start(0);
};

const playAudio = () => {
  // 時間領域の波形データを格納する
  audioAnalyser.getByteTimeDomainData(audioCount);

  // この関数実行タイミングでの波形データの最大値を取得
  let number = audioCount.reduce((a, b) => Math.max(a, b));

  // 0 〜 255 の値が入るので、 0 〜 1 になるように調整
  number = number / 255;

  // 取得した値を2乗(大きい値はより大きく、小さい値はより小さく)して
  // 0.5 以上になるよう調整する
  points.scale.x = Math.pow(number, 2) + 0.5;
  points.scale.y = Math.pow(number, 2) + 0.5;
  points.scale.z = Math.pow(number, 2) + 0.5;

  // y軸を基準に回転させる
  points.rotation.y += 0.0025;

  // レンダリングする
  renderer.render(scene, camera);

  // この関数をブラウザにとって最適なフレームレートで繰り返す
  requestAnimationFrame(playAudio);
};

const onClickModalButton = (buffer: any) => {
  modal.classList.add("is-Hidden");
  setAudio(buffer);
  playAudio();
};