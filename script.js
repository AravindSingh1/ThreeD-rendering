import * as THREE from 'three';

import { OrbitControls } from '/OrbitControls.js';
import { GLTFLoader } from '/GLTFLoader.js';

const selectedFileEl = document.getElementById("getFile");
const renderBtn = document.getElementById("renderBtn");
const div = document.getElementById("model");


renderBtn.addEventListener("click", render3D);
document.onkeydown = function (ev) {
    if (ev.code == "Enter") {
        render3D();
    }
}

function render3D() {
    console.log(selectedFileEl.files[0]);
    div.innerHTML = '';
    init();
}


let scene, camera, renderer;

let hlight, light, light2, light3, light4, directionalLight;


function init() {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
    camera.position.set(-5, 2, -5);

    scene = new THREE.Scene();
    const color = new THREE.Color("skyblue");
    scene.background = color;

    hlight = new THREE.AmbientLight(0x404040, 100);
    scene.add(hlight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 20);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);


    // light = new THREE.PointLight(0xc4c4c4, 10);
    // light.position.set(0, 300, 500);
    // light.intensity = 1000;
    // scene.add(light);

    // light2 = new THREE.PointLight(0xc4c4c4, 10);
    // light2.position.set(500, 100, 0);
    // scene.add(light2);

    // light3 = new THREE.PointLight(0xc4c4c4, 10);
    // light3.position.set(0, 100, -500);
    // scene.add(light3);

    // light4 = new THREE.PointLight(0xc4c4c4, 10);
    // light4.position.set(-500, 300, 0);
    // scene.add(light4);



    const loader = new GLTFLoader();
    const fileSrc = URL.createObjectURL(selectedFileEl.files[0]);
    loader.load(fileSrc, async function (gltf) {
        console.log("loading....");
        const model = gltf.scene;
        // model.scale.set(0.01, 0.01, 0.01);

        // Size setting 


        var boundingBox = new THREE.Box3().setFromObject(model);
        console.log(boundingBox);

        var size = new THREE.Vector3();
        boundingBox.getSize(size);
        console.log(boundingBox.getSize(size));
        var maxSize = new THREE.Vector3(5, 5, 5);

        if (size.x > maxSize.x || size.y > maxSize.y || size.z > maxSize.z) {
            var scaleFactor = Math.min(maxSize.x / size.x, maxSize.y / size.y, maxSize.z / size.z);
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }



        await renderer.compileAsync(model, camera, scene);
        scene.add(model);
        render();
    });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;

    div.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.minDistance = 1;
    controls.maxDistance = 90;
    controls.target.set(0, 0, 0);
    controls.update();

}

function render() {

    renderer.render(scene, camera);

}
