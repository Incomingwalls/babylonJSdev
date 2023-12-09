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
    box.receiveShadows = true;
    box.position.x = px;



    return box;
  }

  function createTorus(scene: Scene, px: number, py: number, pz: number) {
    const torus = MeshBuilder.CreateTorus("torus", {});
    torus.position = new Vector3(px, py, pz);
    scene.registerAfterRender(function () {
      torus.rotate(new Vector3(5, 5, 5), 0.02, Space.LOCAL);
      
    });
    torus.receiveShadows = true;
    torus.position.x = px;
    return torus;
  }




  function createPolyhedra(scene: Scene, t: number, s: number, px: number, py: number, pz: number) {
    const polyhedra = MeshBuilder.CreatePolyhedron("shape", {type: t, size: s}, scene);
    polyhedra.position = new Vector3(px, py, pz);
    scene.registerAfterRender(function () {
      polyhedra.rotate(new Vector3( -3, 5, -3), 0.02, Space.LOCAL);
    });

    polyhedra.receiveShadows = true;
    polyhedra.position.x = px;
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
 
  function createAnyLight(scene: Scene, index: number, px: number, py: number, pz: number, colX: number, colY: number, colZ: number, mesh: Mesh) {
    // only spotlight, point and directional can cast shadows in BabylonJS
    switch (index) {
      case 1: //hemispheric light
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(px, py, pz), scene);
        hemiLight.intensity = 0.1;
        return hemiLight;
        break;
      case 2: //spot light
        const spotLight = new SpotLight("spotLight", new Vector3(px, py, pz), new Vector3(0, -1, 0), Math.PI / 3, 10, scene);
        spotLight.diffuse = new Color3(colX, colY, colZ); //0.39, 0.44, 0.91
        let shadowGenerator = new ShadowGenerator(1024, spotLight);
        shadowGenerator.addShadowCaster(mesh);
        shadowGenerator.useExponentialShadowMap = true;
        return spotLight;
        break;
      case 3: //point light
        const pointLight = new PointLight("pointLight", new Vector3(px, py, pz), scene);
        pointLight.diffuse = new Color3(colX, colY, colZ); //0.39, 0.44, 0.91
        shadowGenerator = new ShadowGenerator(1024, pointLight);
        shadowGenerator.addShadowCaster(mesh);
        shadowGenerator.useExponentialShadowMap = true;
        return pointLight;
        break;
    }
  }
  
  function createLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light;
  }

  function createSpotlight(scene: Scene, px: number, py: number, pz: number) {
    //Light direction is directly down from a position one unit up, slow decay
	var light = new SpotLight("spotLight", new Vector3(-1, 10, 1), new Vector3(4, -6, -3), Math.PI / 2, 10, scene);
	light.diffuse = new Color3(1, 0, 0);
	light.specular = new Color3(1, 0, 0);
  

	
	//Light direction is directly down from a position one unit up, fast decay
	var light1 = new SpotLight("spotLight1", new Vector3(-1, 10, -1), new Vector3(4, -6, 3), Math.PI / 2, 10, scene);
	light1.diffuse = new Color3(1, 1, 0);
	light1.specular = new Color3(1, 1, 0);

    //Light direction is directly down from a position one unit up, fast decay
	var light1 = new SpotLight("spotLight2", new Vector3(1, 10, -.5), new Vector3(-4, -6, 3), Math.PI / 2, 10, scene);
	light1.diffuse = new Color3(0, 0, 1);
	light1.specular = new Color3(0, 0, 1);
    return light;

  }
  
  
  function createSphere(scene: Scene) {
    let sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      scene,
    );
    sphere.receiveShadows = true;
    sphere.position.y = 1;
    return sphere;
  }
  
  function createGround(scene: Scene) {
    let ground = MeshBuilder.CreateGround(
      "ground",
      { width: 60, height: 60 },
      scene,
    );
    ground.receiveShadows = true
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
