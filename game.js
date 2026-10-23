// Cozy Farm 3D - Main Game Logic
// Three.js, Farm plots, Crops, Animals, Player controllers, Decorations

class CozyFarmGame {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        // Player & entity tracking
        this.player = null; // Local player
        this.partner = null; // Remote or Player 2
        this.isLocal2P = false; // Local split/shared keyboard mode
        this.isOnline = false;

        // Inventory & Stats
        this.coins = 50;
        this.lovePoints = 10;
        this.loveLevel = 1;
        this.inventory = {
            seeds_strawberry: 5,
            seeds_carrot: 5,
            seeds_sunflower: 2,
            seeds_watermelon: 1,
            crop_strawberry: 0,
            crop_carrot: 0,
            crop_sunflower: 0,
            crop_watermelon: 0
        };

        this.selectedTool = 'water'; // 'water', 'seed_strawberry', 'seed_carrot', 'seed_sunflower', 'seed_watermelon', 'pet'
        this.selectedSeedType = 'strawberry';

        // World Objects
        this.plots = [];
        this.animals = [];
        this.decorations = [];
        this.particles = [];
        this.floatingTexts = [];

        // Input tracking
        this.keys = {};
        this.keys2 = {}; // For local player 2
        this.joystickVector = { x: 0, z: 0 };
        this.joystickActive = false;

        // Time tracking
        this.clock = new THREE.Clock();
        this.lastNetworkSync = 0;

        // Windmill blades reference for rotation
        this.windmillBlades = null;

        // Crop definitions
        this.cropConfig = {
            strawberry: { name: 'Dâu Tây', icon: '🍓', growTime: 12, value: 15, love: 5, color: 0xff3366 },
            carrot:     { name: 'Cà Rốt',  icon: '🥕', growTime: 8,  value: 10, love: 3, color: 0xff8800 },
            sunflower:  { name: 'Hướng Dương', icon: '🌻', growTime: 16, value: 25, love: 8, color: 0xffd700 },
            watermelon: { name: 'Dưa Hấu', icon: '🍉', growTime: 22, value: 40, love: 12, color: 0x2e8b57 }
        };

        // Orders list
        this.orders = [
            { id: 1, name: 'Bánh Kem Dâu', req: { crop_strawberry: 3 }, reward: { coins: 50, love: 15 }, icon: '🎂' },
            { id: 2, name: 'Bữa Trưa Ấm Áp', req: { crop_carrot: 4 }, reward: { coins: 45, love: 12 }, icon: '🍲' },
            { id: 3, name: 'Bó Hoa Hẹn Hò', req: { crop_sunflower: 2 }, reward: { coins: 60, love: 20 }, icon: '💐' }
        ];

        this.init();
    }

    init() {
        this.setupThree();
        this.setupLighting();
        this.buildIsland();
        this.createFarmPlots();
        this.createAnimals();
        this.createPlayers();
        this.setupInputs();
        this.setupNetworkHooks();
        this.updateHUD();

        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Animation loop
        this.animate();
    }

    setupThree() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xd4f0ff);
        this.scene.fog = new THREE.FogExp2(0xd4f0ff, 0.015);

        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 18, 22);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.container.appendChild(this.renderer.domElement);
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.75);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xfffaed, 0.9);
        sunLight.position.set(30, 45, 25);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 120;
        const d = 25;
        sunLight.shadow.camera.left = -d;
        sunLight.shadow.camera.right = d;
        sunLight.shadow.camera.top = d;
        sunLight.shadow.camera.bottom = -d;
        sunLight.shadow.bias = -0.0005;
        this.scene.add(sunLight);

        // Gentle warm fill light
        const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x55aa44, 0.4);
        this.scene.add(hemisphereLight);
    }

    buildIsland() {
        // Main Island Ground
        const islandGeo = new THREE.CylinderGeometry(24, 21, 5, 32);
        const islandMat = new THREE.MeshLambertMaterial({ color: 0x76c043 }); // Cozy green
        const island = new THREE.Mesh(islandGeo, islandMat);
        island.position.y = -2.5;
        island.receiveShadow = true;
        this.scene.add(island);

        // Island Cliff/Dirt Base
        const baseGeo = new THREE.CylinderGeometry(21, 15, 6, 32);
        const baseMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b }); // Earthy dirt
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = -8;
        this.scene.add(base);

        // Water pond on island
        const pondGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.2, 24);
        const pondMat = new THREE.MeshLambertMaterial({
            color: 0x5bc0eb,
            transparent: true,
            opacity: 0.85
        });
        const pond = new THREE.Mesh(pondGeo, pondMat);
        pond.position.set(-13, 0.05, -7);
        this.scene.add(pond);

        // Water lilies on pond
        for (let i = 0; i < 4; i++) {
            const lilyGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 8);
            const lilyMat = new THREE.MeshLambertMaterial({ color: 0x2e8b57 });
            const lily = new THREE.Mesh(lilyGeo, lilyMat);
            const angle = i * 1.5;
            lily.position.set(-13 + Math.cos(angle) * 2.2, 0.1, -7 + Math.sin(angle) * 2.2);
            this.scene.add(lily);

            // Tiny pink flower on lily
            const flowerGeo = new THREE.SphereGeometry(0.2, 6, 6);
            const flowerMat = new THREE.MeshLambertMaterial({ color: 0xff69b4 });
            const flower = new THREE.Mesh(flowerGeo, flowerMat);
            flower.position.set(lily.position.x, 0.2, lily.position.z);
            this.scene.add(flower);
        }

        // Cobblestone Path to House
        this.createStonePath();

        // Cozy Farmhouse
        this.createFarmhouse(-8, 0, -12);

        // Windmill
        this.createWindmill(14, 0, -11);

        // Apple & Sakura Trees
        this.createTree(-16, 0, 8, 'apple');
        this.createTree(-18, 0, 2, 'sakura');
        this.createTree(16, 0, 7, 'apple');
        this.createTree(18, 0, 1, 'sakura');
        this.createTree(12, 0, 14, 'pine');
        this.createTree(-12, 0, 15, 'pine');

        // Wooden perimeter fence
        this.createFences();

        // Cute Wild Flowers scattered around
        this.createWildFlowers();
    }

    createStonePath() {
        const pathMat = new THREE.MeshLambertMaterial({ color: 0xd8d3cd });
        const stones = [
            [-8, 0.04, -8], [-7, 0.04, -6], [-5, 0.04, -4], [-3, 0.04, -2],
            [-1, 0.04, 0], [1, 0.04, 1], [3, 0.04, 2], [6, 0.04, 0], [9, 0.04, -3], [12, 0.04, -7]
        ];
        stones.forEach(([x, y, z]) => {
            const stoneGeo = new THREE.CylinderGeometry(0.9 + Math.random() * 0.4, 1, 0.1, 7);
            const stone = new THREE.Mesh(stoneGeo, pathMat);
            stone.position.set(x, y, z);
            stone.rotation.y = Math.random() * Math.PI;
            stone.receiveShadow = true;
            this.scene.add(stone);
        });
    }

    createFarmhouse(x, y, z) {
        const houseGroup = new THREE.Group();
        houseGroup.position.set(x, y, z);

        // Body
        const bodyGeo = new THREE.BoxGeometry(6, 4.5, 5);
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0xfff0db }); // Cream white wood
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 2.25;
        body.castShadow = true;
        body.receiveShadow = true;
        houseGroup.add(body);

        // Roof
        const roofGeo = new THREE.ConeGeometry(5.2, 3, 4);
        const roofMat = new THREE.MeshLambertMaterial({ color: 0xcc4e46 }); // Terracotta red
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = 5.8;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        houseGroup.add(roof);

        // Door
        const doorGeo = new THREE.BoxGeometry(1.4, 2.4, 0.2);
        const doorMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
        const door = new THREE.Mesh(doorGeo, doorMat);
        door.position.set(0, 1.2, 2.55);
        houseGroup.add(door);

        // Chimney
        const chimneyGeo = new THREE.BoxGeometry(0.8, 2, 0.8);
        const chimneyMat = new THREE.MeshLambertMaterial({ color: 0xa0522d });
        const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
        chimney.position.set(1.8, 5.5, -0.8);
        chimney.castShadow = true;
        houseGroup.add(chimney);

        // Heart on House Door
        const heartShape = new THREE.Shape();
        heartShape.moveTo(0, 0);
        heartShape.bezierCurveTo(0, 0.3, -0.4, 0.6, -0.4, 1.0);
        heartShape.bezierCurveTo(-0.4, 1.4, 0, 1.6, 0, 1.6);
        heartShape.bezierCurveTo(0, 1.6, 0.4, 1.4, 0.4, 1.0);
        heartShape.bezierCurveTo(0.4, 0.6, 0, 0.3, 0, 0);

        const heartGeo = new THREE.ShapeGeometry(heartShape);
        const heartMat = new THREE.MeshBasicMaterial({ color: 0xff3366, side: THREE.DoubleSide });
        const heartMesh = new THREE.Mesh(heartGeo, heartMat);
        heartMesh.scale.set(0.4, 0.4, 0.4);
        heartMesh.position.set(0, 1.6, 2.68);
        houseGroup.add(heartMesh);

        this.scene.add(houseGroup);
    }

    createWindmill(x, y, z) {
        const millGroup = new THREE.Group();
        millGroup.position.set(x, y, z);

        // Tower
        const towerGeo = new THREE.CylinderGeometry(2, 3, 7, 8);
        const towerMat = new THREE.MeshLambertMaterial({ color: 0xf5eedb });
        const tower = new THREE.Mesh(towerGeo, towerMat);
        tower.position.y = 3.5;
        tower.castShadow = true;
        millGroup.add(tower);

        // Roof Cone
        const roofGeo = new THREE.ConeGeometry(2.5, 2, 8);
        const roofMat = new THREE.MeshLambertMaterial({ color: 0x4a7c59 });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = 8;
        roof.castShadow = true;
        millGroup.add(roof);

        // Blades hub
        this.windmillBlades = new THREE.Group();
        this.windmillBlades.position.set(0, 6.2, 2.1);

        for (let i = 0; i < 4; i++) {
            const bladeGeo = new THREE.BoxGeometry(0.5, 4.5, 0.08);
            const bladeMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
            const blade = new THREE.Mesh(bladeGeo, bladeMat);
            blade.position.y = 2.2;
            const arm = new THREE.Group();
            arm.rotation.z = (i * Math.PI) / 2;
            arm.add(blade);
            this.windmillBlades.add(arm);
        }

        millGroup.add(this.windmillBlades);
        this.scene.add(millGroup);
    }

    createTree(x, y, z, type = 'apple') {
        const treeGroup = new THREE.Group();
        treeGroup.position.set(x, y, z);

        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.4, 0.6, 2.5, 8);
        const trunkMat = new THREE.MeshLambertMaterial({ color: 0x6e4a2e });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.25;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        let foliageMat;
        if (type === 'sakura') {
            foliageMat = new THREE.MeshLambertMaterial({ color: 0xffb7c5 }); // Pastel pink
        } else if (type === 'pine') {
            foliageMat = new THREE.MeshLambertMaterial({ color: 0x2e6f40 });
        } else {
            foliageMat = new THREE.MeshLambertMaterial({ color: 0x4aa135 }); // Lush green
        }

        if (type === 'pine') {
            for (let i = 0; i < 3; i++) {
                const coneGeo = new THREE.ConeGeometry(2.2 - i * 0.5, 2.2, 8);
                const cone = new THREE.Mesh(coneGeo, foliageMat);
                cone.position.y = 2.8 + i * 1.3;
                cone.castShadow = true;
                treeGroup.add(cone);
            }
        } else {
            // Rounded puffy tree canopy
            const sphereGeo = new THREE.DodecahedronGeometry(2.2, 1);
            const foliage = new THREE.Mesh(sphereGeo, foliageMat);
            foliage.position.y = 3.6;
            foliage.castShadow = true;
            treeGroup.add(foliage);

            if (type === 'apple') {
                // Apples
                const appleGeo = new THREE.SphereGeometry(0.25, 6, 6);
                const appleMat = new THREE.MeshLambertMaterial({ color: 0xe63946 });
                const applePositions = [
                    [1.2, 3.6, 1.2], [-1.2, 3.8, 0.8], [0.5, 4.3, -1.2],
                    [-0.8, 3.2, -1.3], [1.3, 3.2, -0.6]
                ];
                applePositions.forEach(([ax, ay, az]) => {
                    const apple = new THREE.Mesh(appleGeo, appleMat);
                    apple.position.set(ax, ay, az);
                    treeGroup.add(apple);
                });
            }
        }

        this.scene.add(treeGroup);
    }

    createFences() {
        const fenceCount = 20;
        const radius = 22.5;
        const postMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });

        for (let i = 0; i < fenceCount; i++) {
            const angle = (i / fenceCount) * Math.PI * 2;
            // Leave opening for dock/entrance
            if (angle > 0.8 && angle < 1.4) continue;

            const postGeo = new THREE.BoxGeometry(0.3, 1.2, 0.3);
            const post = new THREE.Mesh(postGeo, postMat);
            const fx = Math.cos(angle) * radius;
            const fz = Math.sin(angle) * radius;
            post.position.set(fx, 0.6, fz);
            post.castShadow = true;
            this.scene.add(post);

            // Cross beam
            if (i > 0) {
                const prevAngle = ((i - 1) / fenceCount) * Math.PI * 2;
                const px = Math.cos(prevAngle) * radius;
                const pz = Math.sin(prevAngle) * radius;
                const dist = Math.hypot(fx - px, fz - pz);

                const beamGeo = new THREE.BoxGeometry(0.15, 0.2, dist);
                const beam = new THREE.Mesh(beamGeo, postMat);
                beam.position.set((fx + px) / 2, 0.7, (fz + pz) / 2);
                beam.lookAt(fx, 0.7, fz);
                this.scene.add(beam);
            }
        }
    }

    createWildFlowers() {
        const colors = [0xff69b4, 0xffd166, 0xffffff, 0xa0c4ff];
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 5 + Math.random() * 16;
            const x = Math.cos(angle) * dist;
            const z = Math.sin(angle) * dist;

            // Don't place on farm plot area
            if (x > -8 && x < 8 && z > -3 && z < 10) continue;

            const petalMat = new THREE.MeshLambertMaterial({
                color: colors[Math.floor(Math.random() * colors.length)]
            });
            const stemMat = new THREE.MeshLambertMaterial({ color: 0x4aa135 });

            const flower = new THREE.Group();
            flower.position.set(x, 0, z);

            const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 4);
            const stem = new THREE.Mesh(stemGeo, stemMat);
            stem.position.y = 0.2;
            flower.add(stem);

            const topGeo = new THREE.SphereGeometry(0.16, 6, 6);
            const top = new THREE.Mesh(topGeo, petalMat);
            top.position.y = 0.4;
            flower.add(top);

            this.scene.add(flower);
        }
    }

    createFarmPlots() {
        // Grid of 3x4 = 12 farmland plots in center
        const rows = 3;
        const cols = 4;
        const plotSize = 2.4;
        const spacing = 0.7;

        const startX = -((cols - 1) * (plotSize + spacing)) / 2;
        const startZ = 0;

        let index = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const px = startX + c * (plotSize + spacing);
                const pz = startZ + r * (plotSize + spacing);

                const plotObj = this.buildSinglePlot(px, 0.08, pz, index);
                this.plots.push(plotObj);
                index++;
            }
        }
    }

    buildSinglePlot(x, y, z, id) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        // Wooden frame
        const frameGeo = new THREE.BoxGeometry(2.4, 0.2, 2.4);
        const frameMat = new THREE.MeshLambertMaterial({ color: 0xa2703f });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.receiveShadow = true;
        group.add(frame);

        // Rich soil inside
        const soilGeo = new THREE.BoxGeometry(2.1, 0.22, 2.1);
        const soilMat = new THREE.MeshLambertMaterial({ color: 0x5c4033 }); // Dry soil
        const soil = new THREE.Mesh(soilGeo, soilMat);
        soil.receiveShadow = true;
        group.add(soil);

        this.scene.add(group);

        return {
            id: id,
            group: group,
            soilMesh: soil,
            position: new THREE.Vector3(x, y, z),
            isWatered: false,
            waterTimer: 0,
            crop: null // { type, stage, progress, mesh }
        };
    }

    createAnimals() {
        // Fluffy Sheep 1 & 2
        this.animals.push(this.createSheep(6, 0, 8, 'Cừu Bông Trắng'));
        this.animals.push(this.createSheep(-10, 0, 7, 'Cừu Mây Hồng', 0xffd1dc));

        // Cute Puppy
        this.animals.push(this.createPuppy(-3, 0, -4, 'Cún Con Hạnh Phúc'));
    }

    createSheep(x, y, z, name, woolColor = 0xffffff) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        // Fluffy body
        const bodyGeo = new THREE.SphereGeometry(0.9, 10, 10);
        const bodyMat = new THREE.MeshLambertMaterial({ color: woolColor });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.9;
        body.scale.set(1.2, 1, 1);
        body.castShadow = true;
        group.add(body);

        // Head
        const headGeo = new THREE.SphereGeometry(0.45, 8, 8);
        const headMat = new THREE.MeshLambertMaterial({ color: 0x222222 }); // Black face
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0.9, 1.1, 0);
        head.castShadow = true;
        group.add(head);

        // 4 Legs
        const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 6);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
        const legPositions = [
            [0.5, 0.3, 0.4], [0.5, 0.3, -0.4],
            [-0.5, 0.3, 0.4], [-0.5, 0.3, -0.4]
        ];
        legPositions.forEach(([lx, ly, lz]) => {
            const leg = new THREE.Mesh(legGeo, legMat);
            leg.position.set(lx, ly, lz);
            group.add(leg);
        });

        this.scene.add(group);

        return {
            name: name,
            group: group,
            type: 'sheep',
            targetPos: new THREE.Vector3(x, y, z),
            wanderTimer: 0,
            petCooldown: 0
        };
    }

    createPuppy(x, y, z, name) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        // Golden body
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0xdd9944 });
        const bodyGeo = new THREE.BoxGeometry(0.7, 0.6, 1.1);
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.6;
        body.castShadow = true;
        group.add(body);

        // Head
        const headGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
        const head = new THREE.Mesh(headGeo, bodyMat);
        head.position.set(0, 0.95, 0.55);
        head.castShadow = true;
        group.add(head);

        // Red collar
        const collarGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8);
        const collarMat = new THREE.MeshLambertMaterial({ color: 0xff3366 });
        const collar = new THREE.Mesh(collarGeo, collarMat);
        collar.position.set(0, 0.72, 0.4);
        group.add(collar);

        // Wagging tail
        const tailGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.5, 6);
        const tail = new THREE.Mesh(tailGeo, bodyMat);
        tail.position.set(0, 0.8, -0.6);
        tail.rotation.x = -Math.PI / 4;
        group.add(tail);

        this.scene.add(group);

        return {
            name: name,
            group: group,
            type: 'puppy',
            tailMesh: tail,
            targetPos: new THREE.Vector3(x, y, z),
            wanderTimer: 0,
            petCooldown: 0
        };
    }

    createPlayers() {
        // Player 1: Chàng (Boy) - Handsome casual outfit with dark denim and cool hairstyle
        this.player = this.buildHumanCharacter('Chàng 💙', 0);
        this.player.group.position.set(-2, 0, 9);
        this.scene.add(this.player.group);

        // Player 2 / Partner: Nàng (Girl) - Long wavy hair, cute pastel outfit with floral hair accessory
        this.partner = this.buildHumanCharacter('Nàng 💖', 1);
        this.partner.group.position.set(2, 0, 9);
        this.scene.add(this.partner.group);
    }

    buildHumanCharacter(nameLabel, gender = 0) {
        const group = new THREE.Group();

        // High quality human materials
        const skinMat = new THREE.MeshLambertMaterial({ color: gender === 0 ? 0xffdfba : 0xffe6cf }); // Natural warm skin / Fair luminous skin
        const hairMat = new THREE.MeshLambertMaterial({ color: gender === 0 ? 0x2c1d11 : 0x141416 }); // Dark espresso for boy / Chic jet-black for girl
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
        const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const lipMat = new THREE.MeshLambertMaterial({ color: gender === 0 ? 0xd07c7c : 0xec4899 });

        // Stylish clothing materials based on real photo
        const shirtMat = new THREE.MeshLambertMaterial({
            color: gender === 0 ? 0x2563eb : 0x9ca3af // Cobalt blue for boy / Stylish heather grey knit for girl
        });
        const pantsMat = new THREE.MeshLambertMaterial({
            color: gender === 0 ? 0x1e293b : 0x18181b // Navy denim for boy / High-waisted black jeans for girl
        });
        const beltMat = new THREE.MeshLambertMaterial({ color: gender === 0 ? 0x472c1b : 0x27272a });
        const silverMat = new THREE.MeshLambertMaterial({ color: 0xe4e4e7 }); // Silver jewelry / necklace
        const shoeMat = new THREE.MeshLambertMaterial({ color: gender === 0 ? 0xf8fafc : 0x18181b }); // White sneaker / Black sneaker
        const shoeAccentMat = new THREE.MeshLambertMaterial({ color: gender === 0 ? 0x2563eb : 0x9ca3af });
        const shoeSoleMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 }); // Clean white rubber sole
        const phoneMat = new THREE.MeshLambertMaterial({ color: 0x18181b }); // Black smartphone case
        const phoneScreenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 }); // Glowing blue screen

        // --- TORSO GROUP ---
        const torsoGroup = new THREE.Group();
        torsoGroup.position.y = 0.95;

        if (gender === 1) {
            // GIRL: High-waisted black jeans + exposed slim waist + grey knit crop top
            // High-waisted black jeans hips
            const hipsGeo = new THREE.BoxGeometry(0.48, 0.28, 0.32);
            const hips = new THREE.Mesh(hipsGeo, pantsMat);
            hips.position.y = 0.14;
            hips.castShadow = true;
            torsoGroup.add(hips);

            // Black Belt with small silver buckle
            const beltGeo = new THREE.BoxGeometry(0.50, 0.05, 0.34);
            const belt = new THREE.Mesh(beltGeo, beltMat);
            belt.position.y = 0.27;
            torsoGroup.add(belt);

            const buckleGeo = new THREE.BoxGeometry(0.08, 0.06, 0.35);
            const buckle = new THREE.Mesh(buckleGeo, silverMat);
            buckle.position.set(0, 0.27, 0.01);
            torsoGroup.add(buckle);

            // Exposed slim waist (skin)
            const waistGeo = new THREE.BoxGeometry(0.44, 0.10, 0.28);
            const waist = new THREE.Mesh(waistGeo, skinMat);
            waist.position.y = 0.34;
            torsoGroup.add(waist);

            // Grey knit ribbed crop top
            const chestGeo = new THREE.BoxGeometry(0.48, 0.42, 0.32);
            const chest = new THREE.Mesh(chestGeo, shirtMat);
            chest.position.y = 0.58;
            chest.castShadow = true;
            torsoGroup.add(chest);

            // V-Neck collar skin insert
            const vNeckGeo = new THREE.ConeGeometry(0.12, 0.18, 3);
            const vNeck = new THREE.Mesh(vNeckGeo, skinMat);
            vNeck.rotation.z = Math.PI;
            vNeck.position.set(0, 0.74, 0.165);
            torsoGroup.add(vNeck);

            // Delicate silver pendant necklace
            const pendantGeo = new THREE.TorusGeometry(0.035, 0.008, 6, 12);
            const pendant = new THREE.Mesh(pendantGeo, silverMat);
            pendant.position.set(0, 0.68, 0.17);
            torsoGroup.add(pendant);
        } else {
            // BOY: Classic polo shirt & jeans
            const hipsGeo = new THREE.BoxGeometry(0.54, 0.22, 0.34);
            const hips = new THREE.Mesh(hipsGeo, pantsMat);
            hips.position.y = 0.11;
            hips.castShadow = true;
            torsoGroup.add(hips);

            const beltGeo = new THREE.BoxGeometry(0.56, 0.06, 0.36);
            const belt = new THREE.Mesh(beltGeo, beltMat);
            belt.position.y = 0.22;
            torsoGroup.add(belt);

            const chestGeo = new THREE.BoxGeometry(0.62, 0.62, 0.36);
            const chest = new THREE.Mesh(chestGeo, shirtMat);
            chest.position.y = 0.52;
            chest.castShadow = true;
            torsoGroup.add(chest);

            const collarGeo = new THREE.BoxGeometry(0.24, 0.08, 0.38);
            const collar = new THREE.Mesh(collarGeo, new THREE.MeshLambertMaterial({ color: 0xffffff }));
            collar.position.set(0, 0.82, 0.02);
            torsoGroup.add(collar);
        }

        // Neck
        const neckGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.18, 8);
        const neck = new THREE.Mesh(neckGeo, skinMat);
        neck.position.y = 0.88;
        torsoGroup.add(neck);

        // --- HEAD & FACE ---
        const headGroup = new THREE.Group();
        headGroup.position.y = 1.22;

        const headGeo = new THREE.SphereGeometry(0.27, 16, 16);
        headGeo.scale(1, 1.15, 1.05);
        const head = new THREE.Mesh(headGeo, skinMat);
        head.castShadow = true;
        headGroup.add(head);

        // Eyes (Left & Right)
        [-0.095, 0.095].forEach(eyeX => {
            const scleraGeo = new THREE.PlaneGeometry(0.08, 0.05);
            const sclera = new THREE.Mesh(scleraGeo, eyeWhiteMat);
            sclera.position.set(eyeX, 0.02, 0.275);
            headGroup.add(sclera);

            const pupilGeo = new THREE.PlaneGeometry(0.045, 0.045);
            const pupil = new THREE.Mesh(pupilGeo, eyeMat);
            pupil.position.set(eyeX, 0.02, 0.28);
            headGroup.add(pupil);

            const shineGeo = new THREE.PlaneGeometry(0.015, 0.015);
            const shine = new THREE.Mesh(shineGeo, eyeWhiteMat);
            shine.position.set(eyeX + 0.012, 0.03, 0.283);
            headGroup.add(shine);

            const browGeo = new THREE.BoxGeometry(0.08, 0.018, 0.01);
            const brow = new THREE.Mesh(browGeo, hairMat);
            brow.position.set(eyeX, 0.075, 0.28);
            brow.rotation.z = (eyeX < 0 ? -1 : 1) * 0.06;
            headGroup.add(brow);
        });

        // Nose
        const noseGeo = new THREE.ConeGeometry(0.028, 0.07, 4);
        const nose = new THREE.Mesh(noseGeo, skinMat);
        nose.position.set(0, -0.02, 0.295);
        nose.rotation.x = Math.PI / 2;
        headGroup.add(nose);

        // Mouth: Radiant smile
        const mouthGeo = new THREE.BoxGeometry(gender === 1 ? 0.11 : 0.09, 0.035, 0.015);
        const mouth = new THREE.Mesh(mouthGeo, lipMat);
        mouth.position.set(0, -0.11, 0.28);
        headGroup.add(mouth);

        if (gender === 1) {
            // White teeth smile flash
            const teethGeo = new THREE.BoxGeometry(0.07, 0.015, 0.016);
            const teeth = new THREE.Mesh(teethGeo, eyeWhiteMat);
            teeth.position.set(0, -0.105, 0.282);
            headGroup.add(teeth);
        }

        // Rosy cheeks
        [-0.15, 0.15].forEach(cx => {
            const cheekGeo = new THREE.CircleGeometry(0.045, 8);
            const cheekMat = new THREE.MeshBasicMaterial({ color: 0xff88a3, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
            const cheek = new THREE.Mesh(cheekGeo, cheekMat);
            cheek.position.set(cx, -0.06, 0.27);
            headGroup.add(cheek);
        });

        // Ears with delicate silver stud earrings for girl
        [-0.28, 0.28].forEach(ex => {
            const earGeo = new THREE.SphereGeometry(0.05, 6, 6);
            earGeo.scale(0.5, 1, 0.8);
            const ear = new THREE.Mesh(earGeo, skinMat);
            ear.position.set(ex, 0, 0);
            headGroup.add(ear);

            if (gender === 1) {
                const earringGeo = new THREE.SphereGeometry(0.018, 6, 6);
                const earring = new THREE.Mesh(earringGeo, silverMat);
                earring.position.set(ex * 1.05, -0.03, 0);
                headGroup.add(earring);
            }
        });

        // --- HAIRSTYLE ---
        if (gender === 1) {
            // GIRL: Chic short Pixie Cut with micro-bangs and neat sideburns (from photo)
            // Main round pixie cap
            const pixieCapGeo = new THREE.SphereGeometry(0.295, 16, 16);
            pixieCapGeo.scale(1, 1.1, 1.06);
            const pixieCap = new THREE.Mesh(pixieCapGeo, hairMat);
            pixieCap.position.set(0, 0.06, -0.02);
            headGroup.add(pixieCap);

            // Soft micro-bangs fringe over forehead
            const bangsGeo = new THREE.BoxGeometry(0.26, 0.10, 0.12);
            const bangs = new THREE.Mesh(bangsGeo, hairMat);
            bangs.position.set(0, 0.18, 0.23);
            bangs.rotation.x = -0.15;
            headGroup.add(bangs);

            // Delicate sideburn strands framing the cheeks in front of ears
            [-0.24, 0.24].forEach(sx => {
                const sideburnGeo = new THREE.ConeGeometry(0.04, 0.16, 4);
                const sideburn = new THREE.Mesh(sideburnGeo, hairMat);
                sideburn.position.set(sx, 0.01, 0.12);
                sideburn.rotation.x = Math.PI;
                headGroup.add(sideburn);
            });

            // Clean tapered neckline taper at back
            const napeGeo = new THREE.BoxGeometry(0.24, 0.15, 0.14);
            const nape = new THREE.Mesh(napeGeo, hairMat);
            nape.position.set(0, -0.10, -0.22);
            headGroup.add(nape);
        } else {
            // BOY: Stylish undercut
            const hairCapGeo = new THREE.SphereGeometry(0.31, 14, 14, 0, Math.PI * 2, 0, Math.PI / 1.75);
            const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
            hairCap.position.set(0, 0.04, -0.01);
            headGroup.add(hairCap);

            const bangsGeo = new THREE.BoxGeometry(0.32, 0.12, 0.14);
            const bangs = new THREE.Mesh(bangsGeo, hairMat);
            bangs.position.set(0.04, 0.20, 0.22);
            bangs.rotation.z = -0.15;
            headGroup.add(bangs);
        }

        torsoGroup.add(headGroup);
        group.add(torsoGroup);

        // --- ARTICULATED ARMS (Left & Right) ---
        const leftArmPivot = new THREE.Group();
        const rightArmPivot = new THREE.Group();
        const armSpacing = gender === 0 ? 0.38 : 0.29;
        leftArmPivot.position.set(armSpacing, 1.48, 0);
        rightArmPivot.position.set(-armSpacing, 1.48, 0);

        // Long sleeve grey knit covering down to wrists
        const sleeveGeo = new THREE.CylinderGeometry(0.075, 0.072, 0.42, 8);
        const armGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.2, 8);
        const handGeo = new THREE.SphereGeometry(0.065, 8, 8);

        [leftArmPivot, rightArmPivot].forEach((pivot, index) => {
            // Long sleeve
            const sleeve = new THREE.Mesh(sleeveGeo, shirtMat);
            sleeve.position.y = -0.21;
            sleeve.castShadow = true;
            pivot.add(sleeve);

            // Forearm (just above wrist)
            const arm = new THREE.Mesh(armGeo, skinMat);
            arm.position.y = -0.42;
            arm.castShadow = true;
            pivot.add(arm);

            // Hand
            const hand = new THREE.Mesh(handGeo, skinMat);
            hand.position.y = -0.52;
            pivot.add(hand);

            // If girl and left hand: Holding smartphone! (matching photo)
            if (gender === 1 && index === 0) {
                const phoneGroup = new THREE.Group();
                phoneGroup.position.set(0.06, -0.48, 0.12);
                phoneGroup.rotation.x = -Math.PI / 4;
                phoneGroup.rotation.y = -Math.PI / 6;

                const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.02), phoneMat);
                const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.10, 0.19), phoneScreenMat);
                phoneScreen.position.z = 0.012;

                phoneGroup.add(phoneBody);
                phoneGroup.add(phoneScreen);
                pivot.add(phoneGroup);
            }

            group.add(pivot);
        });

        // --- ARTICULATED LEGS (Left & Right) ---
        const leftLegPivot = new THREE.Group();
        const rightLegPivot = new THREE.Group();
        leftLegPivot.position.set(0.14, 0.95, 0);
        rightLegPivot.position.set(-0.14, 0.95, 0);

        const legGeo = new THREE.CylinderGeometry(0.088, 0.075, 0.78, 8);
        const shoeGeo = new THREE.BoxGeometry(0.17, 0.12, 0.31);
        const shoeSoleGeo = new THREE.BoxGeometry(0.18, 0.04, 0.32);
        const shoeStripeGeo = new THREE.BoxGeometry(0.175, 0.03, 0.14);

        [leftLegPivot, rightLegPivot].forEach((pivot) => {
            // High-waisted jeans leg
            const leg = new THREE.Mesh(legGeo, pantsMat);
            leg.position.y = -0.39;
            leg.castShadow = true;
            pivot.add(leg);

            // Sneaker Body
            const shoe = new THREE.Mesh(shoeGeo, shoeMat);
            shoe.position.set(0, -0.82, 0.06);
            shoe.castShadow = true;
            pivot.add(shoe);

            // Sneaker Stripe
            const stripe = new THREE.Mesh(shoeStripeGeo, shoeAccentMat);
            stripe.position.set(0, -0.80, 0.06);
            pivot.add(stripe);

            // Sneaker Sole
            const sole = new THREE.Mesh(shoeSoleGeo, shoeSoleMat);
            sole.position.set(0, -0.89, 0.06);
            pivot.add(sole);

            group.add(pivot);
        });

        // --- FLOATING NAME BADGE ---
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.roundRect ? ctx.roundRect(10, 8, 236, 48, 14) : ctx.fillRect(10, 8, 236, 48);
        ctx.fill();
        ctx.strokeStyle = gender === 0 ? '#2563eb' : '#ec4899';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.font = 'bold 24px Quicksand, sans-serif';
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText(nameLabel, 128, 40);

        const badgeTexture = new THREE.CanvasTexture(canvas);
        const badgeMat = new THREE.SpriteMaterial({ map: badgeTexture });
        const badgeSprite = new THREE.Sprite(badgeMat);
        badgeSprite.scale.set(2.4, 0.6, 1);
        badgeSprite.position.y = 2.85;
        group.add(badgeSprite);

        return {
            group: group,
            torso: torsoGroup,
            head: headGroup,
            leftArm: leftArmPivot,
            rightArm: rightArmPivot,
            leftLeg: leftLegPivot,
            rightLeg: rightLegPivot,
            badge: badgeSprite,
            gender: gender,
            speed: 6.5,
            isMoving: false,
            targetPosition: new THREE.Vector3(),
            targetRotationY: 0
        };
    }

    setupInputs() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.keys[e.code] = true;

            // Space / E for action
            if (e.code === 'Space' || e.key.toLowerCase() === 'e') {
                this.interact(this.player);
            }

            // Key 1-5 tool shortcuts
            if (e.key === '1') this.selectTool('water');
            if (e.key === '2') this.selectTool('seed_strawberry');
            if (e.key === '3') this.selectTool('seed_carrot');
            if (e.key === '4') this.selectTool('seed_sunflower');
            if (e.key === '5') this.selectTool('seed_watermelon');

            // Quick Emote shortcut 'H' (Heart)
            if (e.key.toLowerCase() === 'h') {
                this.triggerEmote('heart', this.player);
            }

            // Local 2-Player Enter key for Player 2 interact
            if (this.isLocal2P && e.code === 'Enter') {
                this.interact(this.partner);
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.keys[e.code] = false;
        });

        // Click on 3D plots directly with mouse / tap
        this.renderer.domElement.addEventListener('pointerdown', (e) => {
            this.onCanvasClick(e);
        });

        // Setup Virtual Touch Joystick for Mobile Phones
        this.setupTouchJoystick();
    }

    setupTouchJoystick() {
        const zone = document.getElementById('mobile-joystick-zone');
        const knob = document.getElementById('joystick-knob');
        if (!zone || !knob) return;

        let activeTouchId = null;
        let centerX = 0;
        let centerY = 0;
        const maxRadius = 45; // Maximum joystick displacement

        const updateJoystick = (clientX, clientY) => {
            const dx = clientX - centerX;
            const dy = clientY - centerY;
            const dist = Math.hypot(dx, dy);
            const clampedDist = Math.min(dist, maxRadius);
            const angle = Math.atan2(dy, dx);

            const knobX = Math.cos(angle) * clampedDist;
            const knobY = Math.sin(angle) * clampedDist;

            knob.style.transform = `translate(${knobX}px, ${knobY}px)`;

            if (dist > 6) {
                this.joystickActive = true;
                this.joystickVector.x = knobX / maxRadius;
                this.joystickVector.z = knobY / maxRadius;
            } else {
                this.joystickActive = false;
                this.joystickVector.x = 0;
                this.joystickVector.z = 0;
            }
        };

        const onTouchStart = (e) => {
            e.preventDefault();
            if (activeTouchId !== null) return;
            const touch = e.changedTouches[0];
            activeTouchId = touch.identifier;

            const rect = zone.getBoundingClientRect();
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;

            updateJoystick(touch.clientX, touch.clientY);
        };

        const onTouchMove = (e) => {
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === activeTouchId) {
                    updateJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                    break;
                }
            }
        };

        const onTouchEnd = (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === activeTouchId) {
                    activeTouchId = null;
                    this.joystickActive = false;
                    this.joystickVector.x = 0;
                    this.joystickVector.z = 0;
                    knob.style.transform = `translate(0px, 0px)`;
                    break;
                }
            }
        };

        zone.addEventListener('touchstart', onTouchStart, { passive: false });
        zone.addEventListener('touchmove', onTouchMove, { passive: false });
        zone.addEventListener('touchend', onTouchEnd, { passive: false });
        zone.addEventListener('touchcancel', onTouchEnd, { passive: false });
    }

    onCanvasClick(e) {
        const mouse = new THREE.Vector2(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        // Find nearest plot
        const plotMeshes = this.plots.map(p => p.soilMesh);
        const intersects = raycaster.intersectObjects(plotMeshes);

        if (intersects.length > 0) {
            const hitMesh = intersects[0].object;
            const targetPlot = this.plots.find(p => p.soilMesh === hitMesh);
            if (targetPlot) {
                // Check if player is reasonably close
                const dist = this.player.group.position.distanceTo(targetPlot.position);
                if (dist < 8) {
                    this.performActionOnPlot(targetPlot, this.player);
                } else {
                    this.showFloatingMessage('Hãy lại gần hơn nhé! 🌾', targetPlot.position);
                }
            }
        }
    }

    selectTool(tool) {
        this.selectedTool = tool;
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
        window.soundSystem.playPop();
    }

    interact(userPlayer) {
        window.soundSystem.init();

        // 1. Check if near any farm plot
        let closestPlot = null;
        let minDist = 3.2;

        for (const plot of this.plots) {
            const d = userPlayer.group.position.distanceTo(plot.position);
            if (d < minDist) {
                minDist = d;
                closestPlot = plot;
            }
        }

        if (closestPlot) {
            this.performActionOnPlot(closestPlot, userPlayer);
            return;
        }

        // 2. Check if near any cute animal to pet
        for (const animal of this.animals) {
            const d = userPlayer.group.position.distanceTo(animal.group.position);
            if (d < 3.0) {
                this.petAnimal(animal, userPlayer);
                return;
            }
        }

        // 3. Check if near partner to high-five / cuddle
        const coupleDist = this.player.group.position.distanceTo(this.partner.group.position);
        if (coupleDist < 2.5) {
            this.triggerEmote('heart', userPlayer);
            this.addLovePoints(5);
            this.showFloatingMessage('Yêu thương +5 💖', userPlayer.group.position);
            return;
        }

        // Default: water ground if holding can
        if (this.selectedTool === 'water') {
            this.createWaterSplashes(userPlayer.group.position.clone().add(new THREE.Vector3(0, 0.5, 0)));
            window.soundSystem.playWater();
        }
    }

    performActionOnPlot(plot, userPlayer) {
        // If crop is fully grown -> Harvest!
        if (plot.crop && plot.crop.stage >= 3) {
            this.harvestCrop(plot, userPlayer);
            return;
        }

        // If holding watering can
        if (this.selectedTool === 'water') {
            this.waterPlot(plot, userPlayer);
            return;
        }

        // If holding seeds -> Plant!
        if (this.selectedTool.startsWith('seed_')) {
            const seedType = this.selectedTool.replace('seed_', '');
            this.plantCrop(plot, seedType, userPlayer);
            return;
        }
    }

    plantCrop(plot, cropType, userPlayer) {
        if (plot.crop) {
            this.showFloatingMessage('Ô đất đã có cây rồi!', plot.position);
            return;
        }

        const invKey = `seeds_${cropType}`;
        if (this.inventory[invKey] <= 0) {
            this.showFloatingMessage(`Hết hạt giống ${this.cropConfig[cropType].name} rồi! 🛒 Mua thêm ở Cửa Hàng`, plot.position);
            return;
        }

        this.inventory[invKey]--;
        this.updateHUD();

        // Create crop object
        plot.crop = {
            type: cropType,
            stage: 0,
            timer: 0,
            growTime: this.cropConfig[cropType].growTime,
            mesh: this.buildCropMesh(cropType, 0)
        };
        plot.crop.mesh.position.set(0, 0.15, 0);
        plot.group.add(plot.crop.mesh);

        window.soundSystem.playPlant();
        this.createTinyLeaves(plot.position);

        // Network sync
        if (this.isOnline) {
            window.networkManager.sendAction('PLANT', { plotId: plot.id, cropType: cropType });
        }
    }

    waterPlot(plot, userPlayer) {
        plot.isWatered = true;
        plot.waterTimer = 25; // 25 seconds of moist soil
        plot.soilMesh.material.color.setHex(0x382414); // Dark moist earth

        this.createWaterSplashes(plot.position.clone().add(new THREE.Vector3(0, 0.3, 0)));
        window.soundSystem.playWater();

        // Network sync
        if (this.isOnline) {
            window.networkManager.sendAction('WATER', { plotId: plot.id });
        }
    }

    harvestCrop(plot, userPlayer) {
        const cropType = plot.crop.type;
        const cfg = this.cropConfig[cropType];

        // Reward
        this.coins += cfg.value;
        this.addLovePoints(cfg.love);
        this.inventory[`crop_${cropType}`] = (this.inventory[`crop_${cropType}`] || 0) + 1;

        // Visual & Sound
        window.soundSystem.playPop();
        window.soundSystem.playCoin();
        this.createHarvestBurst(plot.position, cfg.color);
        this.showFloatingMessage(`+${cfg.value} 🪙 +${cfg.love} 💕`, plot.position);

        // Clean plot
        plot.group.remove(plot.crop.mesh);
        plot.crop = null;
        plot.isWatered = false;
        plot.soilMesh.material.color.setHex(0x5c4033);

        this.updateHUD();

        // Network sync
        if (this.isOnline) {
            window.networkManager.sendAction('HARVEST', { plotId: plot.id });
        }
    }

    buildCropMesh(type, stage) {
        const group = new THREE.Group();
        const cfg = this.cropConfig[type];

        if (stage === 0) {
            // Sprout
            const sproutGeo = new THREE.ConeGeometry(0.15, 0.4, 6);
            const sproutMat = new THREE.MeshLambertMaterial({ color: 0x85e35d });
            const s1 = new THREE.Mesh(sproutGeo, sproutMat);
            s1.position.set(0.1, 0.2, 0);
            s1.rotation.z = -0.2;
            const s2 = new THREE.Mesh(sproutGeo, sproutMat);
            s2.position.set(-0.1, 0.2, 0);
            s2.rotation.z = 0.2;
            group.add(s1);
            group.add(s2);
        } else if (stage === 1) {
            // Growing stem with leaves
            const stemGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.8, 6);
            const stemMat = new THREE.MeshLambertMaterial({ color: 0x4aa135 });
            const stem = new THREE.Mesh(stemGeo, stemMat);
            stem.position.y = 0.4;
            group.add(stem);

            const leafGeo = new THREE.SphereGeometry(0.25, 6, 6);
            const leafMat = new THREE.MeshLambertMaterial({ color: 0x55aa33 });
            const leaf = new THREE.Mesh(leafGeo, leafMat);
            leaf.position.set(0, 0.7, 0);
            leaf.scale.set(1.5, 0.6, 1.2);
            group.add(leaf);
        } else if (stage >= 2) {
            // Full mature crop with fruits!
            const stemGeo = new THREE.CylinderGeometry(0.1, 0.12, 1.0, 6);
            const stemMat = new THREE.MeshLambertMaterial({ color: 0x3e8e2b });
            const stem = new THREE.Mesh(stemGeo, stemMat);
            stem.position.y = 0.5;
            group.add(stem);

            if (type === 'strawberry') {
                for (let i = 0; i < 3; i++) {
                    const berryGeo = new THREE.ConeGeometry(0.25, 0.45, 8);
                    const berryMat = new THREE.MeshLambertMaterial({ color: 0xff2244 });
                    const berry = new THREE.Mesh(berryGeo, berryMat);
                    berry.rotation.x = Math.PI;
                    const ang = (i * Math.PI * 2) / 3;
                    berry.position.set(Math.cos(ang) * 0.4, 0.6, Math.sin(ang) * 0.4);
                    group.add(berry);
                }
            } else if (type === 'carrot') {
                const carrotGeo = new THREE.ConeGeometry(0.28, 0.7, 8);
                const carrotMat = new THREE.MeshLambertMaterial({ color: 0xff7b00 });
                const carrot = new THREE.Mesh(carrotGeo, carrotMat);
                carrot.position.y = 0.4;
                carrot.rotation.x = Math.PI;
                group.add(carrot);

                const greensGeo = new THREE.DodecahedronGeometry(0.35, 0);
                const greensMat = new THREE.MeshLambertMaterial({ color: 0x33aa33 });
                const greens = new THREE.Mesh(greensGeo, greensMat);
                greens.position.y = 0.85;
                group.add(greens);
            } else if (type === 'sunflower') {
                // Tall flower head
                const stem2Geo = new THREE.CylinderGeometry(0.08, 0.1, 1.6, 6);
                const stem2 = new THREE.Mesh(stem2Geo, stemMat);
                stem2.position.y = 0.8;
                group.add(stem2);

                const centerGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.15, 12);
                const centerMat = new THREE.MeshLambertMaterial({ color: 0x5c4033 });
                const center = new THREE.Mesh(centerGeo, centerMat);
                center.position.set(0, 1.6, 0.1);
                center.rotation.x = Math.PI / 4;
                group.add(center);

                const petalsGeo = new THREE.TorusGeometry(0.5, 0.18, 8, 16);
                const petalsMat = new THREE.MeshLambertMaterial({ color: 0xffd700 });
                const petals = new THREE.Mesh(petalsGeo, petalsMat);
                petals.position.copy(center.position);
                petals.rotation.copy(center.rotation);
                group.add(petals);
            } else if (type === 'watermelon') {
                const melonGeo = new THREE.SphereGeometry(0.65, 12, 12);
                const melonMat = new THREE.MeshLambertMaterial({ color: 0x2e8b57 });
                const melon = new THREE.Mesh(melonGeo, melonMat);
                melon.position.y = 0.5;
                melon.scale.set(1.2, 1, 1);
                group.add(melon);
            }
        }

        return group;
    }

    petAnimal(animal, userPlayer) {
        if (animal.petCooldown > 0) return;
        animal.petCooldown = 3;

        this.addLovePoints(3);
        window.soundSystem.playHeart();
        this.triggerEmote('heart', animal);
        this.showFloatingMessage(`${animal.name} thích bạn lắm! 🐾💕`, animal.group.position);

        if (this.isOnline) {
            window.networkManager.sendAction('PET_ANIMAL', { name: animal.name });
        }
    }

    triggerEmote(type, sourceObj) {
        window.soundSystem.playHeart();
        const pos = (sourceObj.group ? sourceObj.group.position : sourceObj.position).clone();
        pos.y += 2.5;

        for (let i = 0; i < 6; i++) {
            const heart = this.createFloatingHeart();
            heart.position.copy(pos);
            heart.position.x += (Math.random() - 0.5) * 0.8;
            heart.position.z += (Math.random() - 0.5) * 0.8;
            this.scene.add(heart);
            this.particles.push({
                mesh: heart,
                vy: 1.8 + Math.random() * 0.8,
                life: 1.8,
                maxLife: 1.8
            });
        }

        if (this.isOnline && sourceObj === this.player) {
            window.networkManager.sendAction('EMOTE', { type: type });
        }
    }

    createFloatingHeart() {
        const heartShape = new THREE.Shape();
        heartShape.moveTo(0, 0);
        heartShape.bezierCurveTo(0, 0.2, -0.25, 0.45, -0.25, 0.7);
        heartShape.bezierCurveTo(-0.25, 0.95, 0, 1.1, 0, 1.1);
        heartShape.bezierCurveTo(0, 1.1, 0.25, 0.95, 0.25, 0.7);
        heartShape.bezierCurveTo(0.25, 0.45, 0, 0.2, 0, 0);

        const heartGeo = new THREE.ShapeGeometry(heartShape);
        const heartMat = new THREE.MeshBasicMaterial({
            color: 0xff3366,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        const mesh = new THREE.Mesh(heartGeo, heartMat);
        mesh.scale.set(0.5, 0.5, 0.5);
        mesh.rotation.y = Math.PI; // Face camera roughly
        return mesh;
    }

    createWaterSplashes(pos) {
        for (let i = 0; i < 12; i++) {
            const dropGeo = new THREE.SphereGeometry(0.08, 4, 4);
            const dropMat = new THREE.MeshBasicMaterial({ color: 0x5bc0eb, transparent: true, opacity: 0.8 });
            const drop = new THREE.Mesh(dropGeo, dropMat);
            drop.position.copy(pos);

            const vx = (Math.random() - 0.5) * 2;
            const vz = (Math.random() - 0.5) * 2;
            const vy = 1.2 + Math.random() * 1.5;

            this.scene.add(drop);
            this.particles.push({
                mesh: drop,
                vx: vx,
                vy: vy,
                vz: vz,
                gravity: -7,
                life: 0.6,
                maxLife: 0.6
            });
        }
    }

    createTinyLeaves(pos) {
        for (let i = 0; i < 8; i++) {
            const leafGeo = new THREE.PlaneGeometry(0.18, 0.18);
            const leafMat = new THREE.MeshBasicMaterial({ color: 0x85e35d, side: THREE.DoubleSide });
            const leaf = new THREE.Mesh(leafGeo, leafMat);
            leaf.position.copy(pos).add(new THREE.Vector3(0, 0.4, 0));
            this.scene.add(leaf);
            this.particles.push({
                mesh: leaf,
                vx: (Math.random() - 0.5) * 1.5,
                vy: 1.5 + Math.random() * 1.0,
                vz: (Math.random() - 0.5) * 1.5,
                gravity: -4,
                life: 0.8,
                maxLife: 0.8
            });
        }
    }

    createHarvestBurst(pos, colorHex) {
        for (let i = 0; i < 18; i++) {
            const starGeo = new THREE.DodecahedronGeometry(0.12, 0);
            const starMat = new THREE.MeshBasicMaterial({ color: colorHex });
            const star = new THREE.Mesh(starGeo, starMat);
            star.position.copy(pos).add(new THREE.Vector3(0, 0.5, 0));
            this.scene.add(star);
            this.particles.push({
                mesh: star,
                vx: (Math.random() - 0.5) * 3.5,
                vy: 2.5 + Math.random() * 2.0,
                vz: (Math.random() - 0.5) * 3.5,
                gravity: -6,
                life: 1.0,
                maxLife: 1.0
            });
        }
    }

    showFloatingMessage(text, worldPos) {
        const floatEl = document.createElement('div');
        floatEl.className = 'floating-toast';
        floatEl.innerText = text;
        document.body.appendChild(floatEl);

        const updatePos = () => {
            const screenPos = worldPos.clone().project(this.camera);
            const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight;
            floatEl.style.left = `${x}px`;
            floatEl.style.top = `${y}px`;
        };
        updatePos();

        setTimeout(() => {
            floatEl.classList.add('fade-out');
            setTimeout(() => floatEl.remove(), 600);
        }, 1400);
    }

    addLovePoints(amount) {
        this.lovePoints += amount;
        const targetForNext = this.loveLevel * 50;
        if (this.lovePoints >= targetForNext) {
            this.loveLevel++;
            this.lovePoints -= targetForNext;
            this.triggerLevelUpCelebration();
        }
        this.updateHUD();
    }

    triggerLevelUpCelebration() {
        window.soundSystem.playCoin();
        window.soundSystem.playHeart();
        if (window.confetti) {
            window.confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        this.showFloatingMessage(`🎉 CẤP ĐỘ HẠNH PHÚC TĂNG: LEVEL ${this.loveLevel}! 🎉`, this.player.group.position);
    }

    updateHUD() {
        document.getElementById('coin-count').innerText = this.coins;
        document.getElementById('love-count').innerText = this.lovePoints;
        document.getElementById('love-level').innerText = this.loveLevel;

        const maxLove = this.loveLevel * 50;
        const pct = Math.min(100, Math.floor((this.lovePoints / maxLove) * 100));
        document.getElementById('love-bar-fill').style.width = `${pct}%`;

        // Seed counts
        const seeds = ['strawberry', 'carrot', 'sunflower', 'watermelon'];
        seeds.forEach(s => {
            const el = document.getElementById(`count-seed-${s}`);
            if (el) el.innerText = this.inventory[`seeds_${s}`] || 0;
            const cropEl = document.getElementById(`count-crop-${s}`);
            if (cropEl) cropEl.innerText = this.inventory[`crop_${s}`] || 0;
        });

        // Update orders list
        this.renderOrders();
    }

    renderOrders() {
        const listEl = document.getElementById('orders-list');
        if (!listEl) return;
        listEl.innerHTML = '';

        this.orders.forEach(ord => {
            const card = document.createElement('div');
            card.className = 'order-card';

            let canComplete = true;
            let reqText = '';
            for (const [key, count] of Object.entries(ord.req)) {
                const cropType = key.replace('crop_', '');
                const current = this.inventory[key] || 0;
                const cfg = this.cropConfig[cropType];
                reqText += `${cfg.icon} ${current}/${count} `;
                if (current < count) canComplete = false;
            }

            card.innerHTML = `
                <div class="order-info">
                    <strong>${ord.icon} ${ord.name}</strong>
                    <div class="order-req">${reqText}</div>
                    <div class="order-reward">+${ord.reward.coins}🪙 +${ord.reward.love}💕</div>
                </div>
                <button class="complete-btn ${canComplete ? 'active' : 'disabled'}">Giao</button>
            `;

            card.querySelector('.complete-btn').onclick = () => {
                if (canComplete) {
                    this.completeOrder(ord);
                } else {
                    window.soundSystem.playPop();
                }
            };

            listEl.appendChild(card);
        });
    }

    completeOrder(order) {
        for (const [key, count] of Object.entries(order.req)) {
            this.inventory[key] -= count;
        }
        this.coins += order.reward.coins;
        this.addLovePoints(order.reward.love);
        window.soundSystem.playCoin();
        window.soundSystem.playHeart();

        if (window.confetti) {
            window.confetti({ particleCount: 40, spread: 50 });
        }
        this.showFloatingMessage(`Đã hoàn thành ${order.name}! 🎁`, this.player.group.position);
        this.updateHUD();

        // Regenerate order after short delay
        const crops = ['strawberry', 'carrot', 'sunflower', 'watermelon'];
        const randomCrop = crops[Math.floor(Math.random() * crops.length)];
        const count = 2 + Math.floor(Math.random() * 3);
        order.name = `Giao ${this.cropConfig[randomCrop].name}`;
        order.req = {};
        order.req[`crop_${randomCrop}`] = count;
        order.reward = {
            coins: this.cropConfig[randomCrop].value * count + 15,
            love: this.cropConfig[randomCrop].love * count + 5
        };
        this.renderOrders();
    }

    buySeed(cropType, cost) {
        if (this.coins < cost) {
            this.showFloatingMessage('Không đủ vàng rồi! 🪙', this.player.group.position);
            return;
        }
        this.coins -= cost;
        this.inventory[`seeds_${cropType}`] = (this.inventory[`crop_${cropType}`] || 0) + 3;
        window.soundSystem.playCoin();
        this.showFloatingMessage(`Đã mua 3 hạt giống ${this.cropConfig[cropType].name}! 🌱`, this.player.group.position);
        this.updateHUD();
    }

    setupNetworkHooks() {
        const net = window.networkManager;

        net.on('PLAYER_MOVE', (data) => {
            if (this.partner) {
                this.partner.targetPosition.set(data.x, data.y, data.z);
                this.partner.targetRotationY = data.rotY;
                this.partner.isMoving = data.isMoving;
            }
        });

        net.on('PLANT', (data) => {
            const plot = this.plots.find(p => p.id === data.plotId);
            if (plot && !plot.crop) {
                plot.crop = {
                    type: data.cropType,
                    stage: 0,
                    timer: 0,
                    growTime: this.cropConfig[data.cropType].growTime,
                    mesh: this.buildCropMesh(data.cropType, 0)
                };
                plot.crop.mesh.position.set(0, 0.15, 0);
                plot.group.add(plot.crop.mesh);
                window.soundSystem.playPlant();
                this.createTinyLeaves(plot.position);
            }
        });

        net.on('WATER', (data) => {
            const plot = this.plots.find(p => p.id === data.plotId);
            if (plot) {
                plot.isWatered = true;
                plot.waterTimer = 25;
                plot.soilMesh.material.color.setHex(0x382414);
                this.createWaterSplashes(plot.position.clone().add(new THREE.Vector3(0, 0.3, 0)));
                window.soundSystem.playWater();
            }
        });

        net.on('HARVEST', (data) => {
            const plot = this.plots.find(p => p.id === data.plotId);
            if (plot && plot.crop) {
                const cfg = this.cropConfig[plot.crop.type];
                this.createHarvestBurst(plot.position, cfg.color);
                plot.group.remove(plot.crop.mesh);
                plot.crop = null;
                plot.isWatered = false;
                plot.soilMesh.material.color.setHex(0x5c4033);
                window.soundSystem.playPop();
            }
        });

        net.on('EMOTE', (data) => {
            this.triggerEmote(data.type, this.partner);
        });

        net.on('PET_ANIMAL', (data) => {
            const animal = this.animals.find(a => a.name === data.name);
            if (animal) {
                this.triggerEmote('heart', animal);
                window.soundSystem.playHeart();
            }
        });

        // Request full state sync when guest connects
        net.on('REQUEST_SYNC', () => {
            if (net.isHost) {
                const plotsData = this.plots.map(p => ({
                    id: p.id,
                    isWatered: p.isWatered,
                    crop: p.crop ? { type: p.crop.type, stage: p.crop.stage, timer: p.crop.timer } : null
                }));
                net.send({
                    type: 'SYNC_FULL_STATE',
                    payload: {
                        coins: this.coins,
                        lovePoints: this.lovePoints,
                        loveLevel: this.loveLevel,
                        plots: plotsData
                    }
                });
            }
        });

        net.on('SYNC_FULL_STATE', (data) => {
            this.coins = data.coins;
            this.lovePoints = data.lovePoints;
            this.loveLevel = data.loveLevel;

            data.plots.forEach(pd => {
                const plot = this.plots.find(p => p.id === pd.id);
                if (plot) {
                    plot.isWatered = pd.isWatered;
                    if (plot.isWatered) plot.soilMesh.material.color.setHex(0x382414);

                    if (plot.crop) plot.group.remove(plot.crop.mesh);
                    if (pd.crop) {
                        plot.crop = {
                            type: pd.crop.type,
                            stage: pd.crop.stage,
                            timer: pd.crop.timer,
                            growTime: this.cropConfig[pd.crop.type].growTime,
                            mesh: this.buildCropMesh(pd.crop.type, pd.crop.stage)
                        };
                        plot.crop.mesh.position.set(0, 0.15, 0);
                        plot.group.add(plot.crop.mesh);
                    } else {
                        plot.crop = null;
                    }
                }
            });

            this.updateHUD();
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = Math.min(this.clock.getDelta(), 0.1);

        // Update windmill rotation
        if (this.windmillBlades) {
            this.windmillBlades.rotation.z += delta * 0.8;
        }

        // Update player movements
        this.updatePlayerMovement(delta);

        // Update crops growth
        this.updateCrops(delta);

        // Update wandering animals
        this.updateAnimals(delta);

        // Update particles
        this.updateParticles(delta);

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    animateHumanCharacter(char, isMoving, t) {
        if (!char || !char.leftLeg) return;
        if (isMoving) {
            // Natural human stride: alternating legs
            char.leftLeg.rotation.x = Math.sin(t) * 0.68;
            char.rightLeg.rotation.x = -Math.sin(t) * 0.68;

            // Arms swing naturally opposing leg movements
            char.leftArm.rotation.x = -Math.sin(t) * 0.58;
            char.rightArm.rotation.x = Math.sin(t) * 0.58;

            // Natural torso step bobbing and subtle pelvic sway
            char.torso.position.y = 0.95 + Math.abs(Math.sin(t)) * 0.07;
            char.torso.rotation.z = Math.sin(t) * 0.035;
        } else {
            // Smooth return to relaxed upright standing posture
            char.leftLeg.rotation.x *= 0.82;
            char.rightLeg.rotation.x *= 0.82;
            char.leftArm.rotation.x *= 0.82;
            char.rightArm.rotation.x *= 0.82;
            char.torso.rotation.z *= 0.82;

            // Subtle, lifelike breathing idle motion
            char.torso.position.y = 0.95 + Math.sin(Date.now() * 0.003) * 0.02;
        }
    }

    updatePlayerMovement(delta) {
        if (!this.player) return;

        let moveX = 0;
        let moveZ = 0;

        // Check Virtual Touch Joystick (Mobile) or Keyboard WASD / Arrows (Desktop)
        if (this.joystickActive) {
            moveX = this.joystickVector.x;
            moveZ = this.joystickVector.z;
        } else {
            // Player 1 controls: WASD or Arrow Keys (if not 2P local mode)
            if (this.keys['w'] || (!this.isLocal2P && this.keys['arrowup'])) moveZ -= 1;
            if (this.keys['s'] || (!this.isLocal2P && this.keys['arrowdown'])) moveZ += 1;
            if (this.keys['a'] || (!this.isLocal2P && this.keys['arrowleft'])) moveX -= 1;
            if (this.keys['d'] || (!this.isLocal2P && this.keys['arrowright'])) moveX += 1;
        }

        const isMoving = (Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05);
        const t = Date.now() * 0.012;

        if (isMoving) {
            const moveVec = new THREE.Vector3(moveX, 0, moveZ).normalize();
            const nextPos = this.player.group.position.clone().addScaledVector(moveVec, this.player.speed * delta);

            // Keep within island boundary (radius ~22)
            if (nextPos.length() < 21.5) {
                this.player.group.position.copy(nextPos);
            }

            // Face direction of movement smoothly
            const targetAngle = Math.atan2(moveVec.x, moveVec.z);
            let diff = targetAngle - this.player.group.rotation.y;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            this.player.group.rotation.y += diff * 0.25;
        }

        // Animate human walking & breathing for Player 1
        this.animateHumanCharacter(this.player, isMoving, t);

        // Camera follow smoothly
        const targetCamX = this.player.group.position.x * 0.4;
        const targetCamZ = this.player.group.position.z * 0.4 + 22;
        this.camera.position.x += (targetCamX - this.camera.position.x) * 0.05;
        this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.05;
        this.camera.lookAt(this.player.group.position.x * 0.5, 0.5, this.player.group.position.z * 0.5);

        // If local 2-Player mode, control Partner with Arrow Keys
        if (this.isLocal2P && this.partner) {
            let p2X = 0;
            let p2Z = 0;
            if (this.keys['arrowup']) p2Z -= 1;
            if (this.keys['arrowdown']) p2Z += 1;
            if (this.keys['arrowleft']) p2X -= 1;
            if (this.keys['arrowright']) p2X += 1;

            const p2Moving = (p2X !== 0 || p2Z !== 0);
            if (p2Moving) {
                const vec2 = new THREE.Vector3(p2X, 0, p2Z).normalize();
                const nextPos2 = this.partner.group.position.clone().addScaledVector(vec2, this.partner.speed * delta);
                if (nextPos2.length() < 21.5) {
                    this.partner.group.position.copy(nextPos2);
                }
                const p2Angle = Math.atan2(vec2.x, vec2.z);
                let diff2 = p2Angle - this.partner.group.rotation.y;
                while (diff2 < -Math.PI) diff2 += Math.PI * 2;
                while (diff2 > Math.PI) diff2 -= Math.PI * 2;
                this.partner.group.rotation.y += diff2 * 0.25;
            }
            this.animateHumanCharacter(this.partner, p2Moving, t);
        } else if (this.isOnline && this.partner) {
            // Smoothly interpolate remote partner position
            this.partner.group.position.lerp(this.partner.targetPosition, 0.2);
            this.partner.group.rotation.y += (this.partner.targetRotationY - this.partner.group.rotation.y) * 0.2;
            this.animateHumanCharacter(this.partner, this.partner.isMoving, t);
        }

        // Send network position sync at 20Hz
        if (this.isOnline && Date.now() - this.lastNetworkSync > 50) {
            this.lastNetworkSync = Date.now();
            window.networkManager.sendPosition(
                this.player.group.position.x,
                this.player.group.position.y,
                this.player.group.position.z,
                this.player.group.rotation.y,
                isMoving
            );
        }

        // Close proximity romantic hearts
        if (this.partner) {
            const dist = this.player.group.position.distanceTo(this.partner.group.position);
            if (dist < 2.8 && Math.random() < 0.03) {
                const mid = this.player.group.position.clone().lerp(this.partner.group.position, 0.5);
                mid.y += 1.8;
                const heart = this.createFloatingHeart();
                heart.scale.set(0.25, 0.25, 0.25);
                heart.position.copy(mid);
                this.scene.add(heart);
                this.particles.push({
                    mesh: heart,
                    vy: 1.0,
                    life: 1.2,
                    maxLife: 1.2
                });
            }
        }
    }

    updateCrops(delta) {
        this.plots.forEach(plot => {
            // Handle water timer
            if (plot.isWatered) {
                plot.waterTimer -= delta;
                if (plot.waterTimer <= 0) {
                    plot.isWatered = false;
                    plot.soilMesh.material.color.setHex(0x5c4033);
                }
            }

            // Handle crop growth
            if (plot.crop && plot.crop.stage < 3) {
                // Growth speed is 2x if soil is watered
                const growthRate = plot.isWatered ? 2.0 : 0.8;
                plot.crop.timer += delta * growthRate;

                const stageDuration = plot.crop.growTime / 3;
                const nextStage = Math.min(3, Math.floor(plot.crop.timer / stageDuration));

                if (nextStage !== plot.crop.stage) {
                    plot.crop.stage = nextStage;
                    plot.group.remove(plot.crop.mesh);
                    plot.crop.mesh = this.buildCropMesh(plot.crop.type, nextStage);
                    plot.crop.mesh.position.set(0, 0.15, 0);
                    plot.group.add(plot.crop.mesh);

                    // Little sparkle when leveling up stage
                    this.createTinyLeaves(plot.position);
                }
            }
        });
    }

    updateAnimals(delta) {
        this.animals.forEach(animal => {
            if (animal.petCooldown > 0) animal.petCooldown -= delta;

            animal.wanderTimer -= delta;
            if (animal.wanderTimer <= 0) {
                animal.wanderTimer = 3 + Math.random() * 5;
                // Pick gentle random wander target
                const angle = Math.random() * Math.PI * 2;
                const dist = 4 + Math.random() * 12;
                animal.targetPos.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
            }

            // Move towards target
            const dir = animal.targetPos.clone().sub(animal.group.position);
            dir.y = 0;
            if (dir.length() > 0.5) {
                dir.normalize();
                animal.group.position.addScaledVector(dir, 1.2 * delta);
                animal.group.rotation.y = Math.atan2(dir.x, dir.z);

                // Bobbing walk
                animal.group.position.y = Math.abs(Math.sin(Date.now() * 0.008)) * 0.1;
            }

            // Puppy tail wag
            if (animal.tailMesh) {
                animal.tailMesh.rotation.y = Math.sin(Date.now() * 0.015) * 0.5;
            }
        });
    }

    updateParticles(delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= delta;

            if (p.vx) p.mesh.position.x += p.vx * delta;
            if (p.vy) p.mesh.position.y += p.vy * delta;
            if (p.vz) p.mesh.position.z += p.vz * delta;

            if (p.gravity) p.vy += p.gravity * delta;

            // Fade out
            if (p.mesh.material && p.mesh.material.opacity !== undefined) {
                p.mesh.material.opacity = p.life / p.maxLife;
            }

            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                this.particles.splice(i, 1);
            }
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new CozyFarmGame();
});
