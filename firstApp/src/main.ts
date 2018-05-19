// three.js
import * as THREE from 'three';
import dat from 'dat.gui/build/dat.gui.js';

class Level {
    private width = window.innerWidth;
    private height = window.innerHeight;
    private camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    private spotLight = new THREE.SpotLight(0xffffff);
    private renderer = new THREE.WebGLRenderer();
    private scene = new THREE.Scene();
    private plane: THREE.Mesh;
    private cube: THREE.Mesh;
    private sphere: THREE.Mesh;
    private step = 0;
    private controls = {
        rotationSpeed: 0.02,
        bouncingSpeed: 0.03
    };

    elementCreate = () => {
        // PlaneMesh
        const planeGeometry = new THREE.PlaneGeometry(60, 20);
        const planeMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.receiveShadow = true;
        this.plane.rotation.x = -0.5 * Math.PI;
        this.plane.position.set(15, 0, 0);

        // CubeMesh
        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        const cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0xff0000
        });
        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cube.castShadow = true;
        this.cube.position.set(-4, 3, 0);

        // SphereMesh
        const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        const sphereMaterial = new THREE.MeshLambertMaterial({
            color: 0x7777ff
        });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.castShadow = true;
        this.sphere.position.set(20, 4, 2);

        this.scene.add(this.plane);
        this.scene.add(this.cube);
        this.scene.add(this.sphere);
    }

    renderScene = () => {
        const { cube, controls, sphere, renderScene, scene, renderer, camera } = this;
        // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;
        // bounce the sphere up and down
        this.step += controls.bouncingSpeed;
        
        sphere.position.x = 20 + (10 * (Math.cos(this.step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(this.step)));
        // render using requestAnimationFrame
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    init = () => {
        const {
            controls,
            width,
            height,
            renderer,
            camera,
            renderScene,
            spotLight,
            scene,
            elementCreate
        } = this;
        
        const gui = new dat.gui.GUI;
        gui.add(controls, 'rotationSpeed', 0, 0.5);
        gui.add(controls, 'bouncingSpeed', 0, 0.5);

        // レンダラーのサイズを設定
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0xEEEEEE));
        renderer.shadowMap.enabled = true;
        elementCreate();

        // Camera Setting
        camera.position.set(-30, 40, 30);
        camera.lookAt(scene.position);

        // Light Setting
        spotLight.position.set(-20, 30, -5);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // canvasをbodyに追加
        document.body.appendChild(renderer.domElement);

        renderScene();

        console.log('Hello Three.js');
    };

    onResize = () => {
        const {
            camera,
            renderer
        } = this;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

const level = new Level();
window.addEventListener('DOMContentLoaded', level.init);
window.addEventListener('resize', level.onResize, false);