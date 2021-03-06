import { vec3 } from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import { setGL } from './globals';
import ShaderProgram, { Shader } from './rendering/gl/ShaderProgram';
// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
export const controls = {
    tesselations: 5,
    'Load Scene': loadScene,
    TrickTrig: true,
};
let icosphere;
let square;
let cube;
function loadScene() {
    icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, controls.tesselations);
    icosphere.create();
    square = new Square(vec3.fromValues(0, 0, 0));
    square.create();
    cube = new Cube(vec3.fromValues(0, 0, 0));
    cube.create();
}
function main() {
    // Initial display for framerate
    const stats = Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
    // Add controls to the gui
    const gui = new DAT.GUI();
    gui.add(controls, 'tesselations', 0, 8).step(1);
    gui.add(controls, 'Load Scene');
    gui.add(controls, TrickTrig);
    // get canvas and webgl context
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        alert('WebGL 2 not supported!');
    }
    // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
    // Later, we can import `gl` from `globals.ts` to access it
    setGL(gl);
    // Initial call to load scene
    loadScene();
    const camera = new Camera(vec3.fromValues(-5, 5, 5), vec3.fromValues(0, 0, 0));
    const renderer = new OpenGLRenderer(canvas);
    renderer.setClearColor(1.0, 1.0, 1.0, 1);
    gl.enable(gl.DEPTH_TEST);
    const tricolor = new ShaderProgram([
        new Shader(gl.VERTEX_SHADER, require('./shaders/tricolor-vert.glsl')),
        new Shader(gl.FRAGMENT_SHADER, require('./shaders/tricolor-frag.glsl')),
    ]);
    // This function will be called every frame
    function tick() {
        camera.update();
        stats.begin();
        gl.viewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.clear();
        let shader = tricolor;
        renderer.render(camera, shader, [
            //icosphere,
            //square,
            cube,
        ]);
        stats.end();
        // Tell the browser to call `tick` again whenever it renders a new frame
        requestAnimationFrame(tick);
    }
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.setAspectRatio(window.innerWidth / window.innerHeight);
        camera.updateProjectionMatrix();
    }, false);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    // Start the render loop
    tick();
}
main();
//# sourceMappingURL=main.js.map