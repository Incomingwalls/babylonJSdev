import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    Scene,
    ArcRotateCamera,
    Vector3,
    Vector4,
    Color3,
    HemisphericLight,
    MeshBuilder,
    Mesh,
    Light,
    Camera,
    Engine,
    StandardMaterial,
    Texture,
    SpotLight,
    ShadowGenerator,
    PointLight,
    Space,
    PolyhedronData,
    TorusBlock,
    CreatePolyhedron,
  } from "@babylonjs/core";
  
  
  function createBox(scene: Scene, px: number, py: number, pz: number, sx: number, sy: number, sz: number, rotation: boolean) {
    let box = MeshBuilder.CreateBox("box",{size: 1}, scene);
    box.position = new Vector3(px, py, pz);
    box.scaling = new Vector3(sx, sy, sz);
    //box.position.y = 3;

    if (rotation) {
      scene.registerAfterRender(function () {
        box.rotate(new Vector3(4, 6, 2), 0.02, Space.LOCAL);
      });
    }



    return box;
  }

  function createTorus(scene: Scene, px: number, py: number, pz: number) {
    const torus = MeshBuilder.CreateTorus("torus", {});
    torus.position = new Vector3(px, py, pz);
    scene.registerAfterRender(function () {
      torus.rotate(new Vector3(5, 5, 5), 0.02, Space.LOCAL);
    });
    return torus;
  }

  function createPolyhedra(scene: Scene, t: number, s: number, px: number, py: number, pz: number) {
    const polyhedra = MeshBuilder.CreatePolyhedron("shape", {type: t, size: s}, scene);
    polyhedra.position = new Vector3(px, py, pz);
    scene.registerAfterRender(function () {
      polyhedra.rotate(new Vector3( -3, 5, -3), 0.02, Space.LOCAL);
    });
    return polyhedra;
 

  }

  function createFacedBox(scene: Scene, px: number, py: number, pz: number, rotation: boolean) {
    const mat = new StandardMaterial("mat");
    const texture = new Texture("https://assets.babylonjs.com/environments/numbers.jpg");
    mat.diffuseTexture = texture;

    var columns = 6;
    var rows = 1;

    const faceUV = new Array(6);

    for (let i = 0; i < 6; i++) {
        faceUV[i] = new Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
    }

    const options = {
        faceUV: faceUV,
        wrap: true
    };

    let box = MeshBuilder.CreateBox("tiledBox", options,scene);
    box.material = mat;
    box.position = new Vector3(px, py, pz);

    if (rotation) {
      scene.registerAfterRender(function () {
        box.rotate(new Vector3(1, 10, 4), 0.02, Space.LOCAL);
      });
    }
    return box;
  }
 

  
  function createLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light;
  }

  function createSpotlight(scene: Scene, px: number, py: number, pz: number) {
    var light = new SpotLight("spotLight", new Vector3(0, 30, -10), new Vector3(0, -1, 0), Math.PI / 3, 2, scene);
    light.diffuse = new Color3(0.04, 0.88, 0.15);
    light.specular = new Color3(0.2, 0.13, 0.36);
    return light;

  }
  
  function createSphere(scene: Scene) {
    let sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      scene,
    );
    sphere.position.y = 1;
    return sphere;
  }
  
  function createGround(scene: Scene) {
    let ground = MeshBuilder.CreateGround(
      "ground",
      { width: 40, height: 40 },
      scene,
    );
    return ground;
  }
  
  function createArcRotateCamera(scene: Scene) {
    let camAlpha = -Math.PI / 2,
      camBeta = Math.PI / 2.5,
      camDist = 10,
      camTarget = new Vector3(0, 0, 0);
    let camera = new ArcRotateCamera(
      "camera1",
      camAlpha,
      camBeta,
      camDist,
      camTarget,
      scene,
    );
    camera.attachControl(true);
    return camera;
  }
  
  export default function createStartScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      box?: Mesh;
      torus?: Mesh;
      polyhedra?: Mesh;
      faceBox?: Mesh;
      light?: Light;
      spotlight?: SpotLight;
      sphere?: Mesh;
      ground?: Mesh;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    that.scene.debugLayer.show();
  
    //create box (scene, posx, posy, posz, scalex, scaley, scalez)
    that.box = createBox(that.scene, 4, 3, 3, 3, 2, 1, true);
    that.faceBox = createFacedBox(that.scene, 6, 2, 8, true)
    that.torus = createTorus(that.scene, -4, 7, 7)
    that.polyhedra = createPolyhedra(that.scene, 1, 4, 4, 10, 4)
    that.light = createLight(that.scene);
    that.spotlight = createSpotlight(that.scene, 0, 5, 0);
    that.sphere = createSphere(that.scene);
    that.ground = createGround(that.scene);
    that.camera = createArcRotateCamera(that.scene);
  
    return that;
  }
