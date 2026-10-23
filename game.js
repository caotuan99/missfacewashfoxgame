// FaceWashFox Store Simulator - Main 3D Engine & Game Logic
// Three.js, Spa Store 3D, Customer AI, Spa Treatment, Inventory & Economy

class FaceWashFoxSimulator {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        // Player & Camera
        this.player = null;
        this.keys = {};
        this.joystickVector = { x: 0, z: 0 };
        this.joystickActive = false;

        // Game Economy & Progress
        this.money = 2500000; // 2.500.000đ initial capital
        this.rating = 4.8;
        this.totalCustomersServed = 0;
        this.day = 1;
        this.gameTimeHours = 8;
        this.gameTimeMinutes = 30;

        // Inventory: Storage & Retail Shelves
        this.storage = {
            cleanser: 12,
            toner: 8,
            serum: 6,
            cream: 6,
            mask: 5,
            cleanTowels: 20
        };
        this.shelfStock = {
            cleanser: 6,
            toner: 4,
            serum: 3,
            cream: 3,
            mask: 3
        };

        // Staff & Automation
        this.hiredStaff = {
            receptionist: false,
            technician: false
        };

        // Spa Beds & World Stations
        this.beds = [];
        this.receptionZone = null;
        this.retailZone = null;
        this.storageZone = null;

        // Customer NPCs
        this.customers = [];
        this.customerSpawnTimer = 3;

        // Treatment state
        this.activeTreatmentBed = null;
        this.particles = [];

        // 3 Detailed Spa Service Packages with In-world interactive steps
        this.spaPackages = {
            foambasic: {
                id: 'foambasic',
                name: 'Rửa Mặt Bọt Cáo 🦊',
                price: 99000,
                tip: 20000,
                steps: [
                    { name: 'Bọt Tơ Tằm Cáo Mịn', icon: '🧼', particle: 'foam' },
                    { name: 'Rung Siêu Âm Sonic', icon: '🫧', particle: 'sonic' },
                    { name: 'Đắp Khăn Nóng Ấm', icon: '🧖‍♀️', particle: 'steam' },
                    { name: 'Khóa Ẩm Toner Cáo', icon: '💧', particle: 'splash' }
                ]
            },
            foxglow: {
                id: 'foxglow',
                name: 'Fox Glow Căng Bóng ✨',
                price: 199000,
                tip: 35000,
                steps: [
                    { name: 'Tẩy Trang Bọt Mịn', icon: '🧼', particle: 'foam' },
                    { name: 'Xông Hơi & Hút Dầu Thừa', icon: '💨', particle: 'steam' },
                    { name: 'Điện Di Serum Vitamin C', icon: '🌟', particle: 'sparkle' },
                    { name: 'Massage Nâng Cơ Mặt', icon: '💆‍♀️', particle: 'foam' },
                    { name: 'Kem Khóa Ẩm Sinh Học', icon: '🌸', particle: 'splash' }
                ]
            },
            vipdetox: {
                id: 'vipdetox',
                name: 'VIP Detox Đất Sét Hoàng Gia 👑',
                price: 349000,
                tip: 50000,
                steps: [
                    { name: 'Sủi Bọt Oxy Thải Chì', icon: '🫧', particle: 'foam' },
                    { name: 'Mặt Nạ Đất Sét Núi Lửa', icon: '🌿', particle: 'mask' },
                    { name: 'Chiếu Ánh Sáng Bio-Light', icon: '🌈', particle: 'biolight' },
                    { name: 'Massage Cổ Vai Gáy', icon: '💆‍♂️', particle: 'sparkle' },
                    { name: 'Xịt Khoáng Fox Pure Glow', icon: '💧', particle: 'splash' }
                ]
            }
        };

        // Clock & Frame timing
        this.clock = new THREE.Clock();
        this.interactionTarget = null;

        this.init();
    }

    init() {
        this.setupThree();
        this.setupLighting();
        this.buildStore3D();
        this.createPlayer();
        this.setupInputs();
        this.updateHUD();

        window.addEventListener('resize', () => this.onWindowResize());
        this.animate();

        // Start BGM on first interaction
        const startAudio = () => {
            window.spaAudio.startBGM();
            window.removeEventListener('click', startAudio);
            window.removeEventListener('keydown', startAudio);
            window.removeEventListener('touchstart', startAudio);
        };
        window.addEventListener('click', startAudio);
        window.addEventListener('keydown', startAudio);
        window.addEventListener('touchstart', startAudio);
    }

    setupThree() {
        this.scene = new THREE.Scene();
        // Comfortable, cozy dark-slate exterior evening vibe - NO Glare!
        this.scene.background = new THREE.Color(0x23272E);
        this.scene.fog = new THREE.FogExp2(0x23272E, 0.015);

        const isPortrait = window.innerHeight > window.innerWidth;
        const initialFov = isPortrait ? 68 : 50;
        this.camera = new THREE.PerspectiveCamera(initialFov, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, isPortrait ? 18 : 14, isPortrait ? 20 : 18);
        this.camera.lookAt(0, 1, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.container.appendChild(this.renderer.domElement);
    }

    setupLighting() {
        // Soothing warm golden ambient light for relaxing luxury spa
        const ambientLight = new THREE.AmbientLight(0xFFE8D4, 0.78);
        this.scene.add(ambientLight);

        // Warm directional sunlight coming through store front glass
        const sunLight = new THREE.DirectionalLight(0xFFF0DE, 0.85);
        sunLight.position.set(12, 22, 18);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 60;
        const d = 16;
        sunLight.shadow.camera.left = -d;
        sunLight.shadow.camera.right = d;
        sunLight.shadow.camera.top = d;
        sunLight.shadow.camera.bottom = -d;
        sunLight.shadow.bias = -0.0004;
        this.scene.add(sunLight);

        // Interior warm recessed downlights
        const downlight1 = new THREE.PointLight(0xFFDFBF, 0.65, 14);
        downlight1.position.set(-4, 5, 2);
        this.scene.add(downlight1);

        const downlight2 = new THREE.PointLight(0xFFDFBF, 0.65, 14);
        downlight2.position.set(4, 5, 2);
        this.scene.add(downlight2);
    }

    buildStore3D() {
        const storeGroup = new THREE.Group();

        // 1. Floor: Warm Scandinavian Oak Wood Flooring (Warm, Cozy, Luxury, Easy on the eyes)
        const floorGeo = new THREE.BoxGeometry(20, 0.4, 16);
        const floorMat = new THREE.MeshLambertMaterial({ color: 0xBA9875 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.y = -0.2;
        floor.receiveShadow = true;
        storeGroup.add(floor);

        // Subtle warm wood plank seam grid
        const gridHelper = new THREE.GridHelper(20, 20, 0x96785C, 0xA88A6E);
        gridHelper.position.y = 0.01;
        storeGroup.add(gridHelper);

        // Sidewalk outside front store: Comfortable evening pavement
        const sidewalkGeo = new THREE.BoxGeometry(24, 0.35, 6);
        const sidewalkMat = new THREE.MeshLambertMaterial({ color: 0x2C333D });
        const sidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
        sidewalk.position.set(0, -0.22, 11);
        sidewalk.receiveShadow = true;
        storeGroup.add(sidewalk);

        // 2. Walls (Back wall, Left wall, Right wall, Front glass)
        // Soft warm cream linen walls
        const wallMat = new THREE.MeshLambertMaterial({ color: 0xF4EFE6 });
        const accentWoodMat = new THREE.MeshLambertMaterial({ color: 0x8C5E3C }); // Warm cedar/walnut wood

        // Back Wall
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(20, 5.5, 0.4), wallMat);
        backWall.position.set(0, 2.75, -8);
        backWall.receiveShadow = true;
        storeGroup.add(backWall);

        // Left Wall
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.5, 16), wallMat);
        leftWall.position.set(-10, 2.75, 0);
        leftWall.receiveShadow = true;
        storeGroup.add(leftWall);

        // Right Wall
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.5, 16), wallMat);
        rightWall.position.set(10, 2.75, 0);
        rightWall.receiveShadow = true;
        storeGroup.add(rightWall);

        // Front Glass Wall with Doorway
        const glassMat = new THREE.MeshLambertMaterial({
            color: 0xBAE6FD,
            transparent: true,
            opacity: 0.35
        });
        const frontGlassLeft = new THREE.Mesh(new THREE.BoxGeometry(7, 5, 0.2), glassMat);
        frontGlassLeft.position.set(-6.5, 2.5, 8);
        storeGroup.add(frontGlassLeft);

        const frontGlassRight = new THREE.Mesh(new THREE.BoxGeometry(7, 5, 0.2), glassMat);
        frontGlassRight.position.set(6.5, 2.5, 8);
        storeGroup.add(frontGlassRight);

        // 3. Logo Sign on Back Wall (FaceWashFox)
        this.createBrandLogoSign(0, 4.0, -7.78, storeGroup);

        // 4. Reception Desk (Quầy Lễ Tân)
        this.createReceptionDesk(-4.5, 0, 3, storeGroup);

        // 5. Treatment Beds Zone (Khu Giường Spa)
        this.createTreatmentBed(3.5, 0, -3.5, 1, storeGroup);
        this.createTreatmentBed(3.5, 0, 2.5, 2, storeGroup);

        // 6. Retail Display Shelves (Khu Kệ Bán Hàng)
        this.createRetailShelves(-9.6, 0, -3, storeGroup);

        // 7. Storage Cabinet & Laundry (Khu Kho & Khăn)
        this.createStorageStation(-8, 0, -7.5, storeGroup);

        // 8. Waiting Lounge Sofa & Plants (Khu Ghế Chờ)
        this.createWaitingLounge(4.5, 0, 6, storeGroup);

        this.scene.add(storeGroup);
    }

    createBrandLogoSign(x, y, z, parent) {
        const signGroup = new THREE.Group();
        signGroup.position.set(x, y, z);

        // Elegant wood backing panel
        const panelGeo = new THREE.BoxGeometry(7, 2.2, 0.1);
        const panelMat = new THREE.MeshLambertMaterial({ color: 0xFFFAF7 });
        const panel = new THREE.Mesh(panelGeo, panelMat);
        signGroup.add(panel);

        // Logo Texture from logo.png
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('logo.png', (texture) => {
            const logoGeo = new THREE.PlaneGeometry(1.6, 1.6);
            const logoMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
            const logoMesh = new THREE.Mesh(logoGeo, logoMat);
            logoMesh.position.set(-1.8, 0, 0.06);
            signGroup.add(logoMesh);
        });

        // Glowing 3D Brand Typography "face wash fox"
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1A1A1A';
        ctx.font = '800 52px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('face wash fox', 10, 70);
        ctx.fillStyle = '#F25C2B';
        ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('SKINCARE & SPA STORE', 12, 120);

        const textTexture = new THREE.CanvasTexture(canvas);
        const textMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(3.6, 1.1),
            new THREE.MeshBasicMaterial({ map: textTexture, transparent: true })
        );
        textMesh.position.set(1.0, 0, 0.06);
        signGroup.add(textMesh);

        parent.add(signGroup);
    }

    createReceptionDesk(x, y, z, parent) {
        const deskGroup = new THREE.Group();
        deskGroup.position.set(x, y, z);

        // Main counter (Curved modern reception desk)
        const counterGeo = new THREE.BoxGeometry(4.2, 1.2, 1.2);
        const counterMat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const counter = new THREE.Mesh(counterGeo, counterMat);
        counter.position.y = 0.6;
        counter.castShadow = true;
        counter.receiveShadow = true;
        deskGroup.add(counter);

        // Countertop (Oak/Warm wood trim)
        const topGeo = new THREE.BoxGeometry(4.4, 0.08, 1.35);
        const topMat = new THREE.MeshLambertMaterial({ color: 0xF25C2B }); // Signature Fox Orange trim
        const top = new THREE.Mesh(topGeo, topMat);
        top.position.y = 1.24;
        deskGroup.add(top);

        // POS Computer Terminal
        const screenGeo = new THREE.BoxGeometry(0.8, 0.5, 0.05);
        const screenMat = new THREE.MeshLambertMaterial({ color: 0x1E293B });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(0.5, 1.55, 0);
        screen.rotation.x = -0.15;
        deskGroup.add(screen);

        const standGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.3, 8);
        const stand = new THREE.Mesh(standGeo, screenMat);
        stand.position.set(0.5, 1.35, 0);
        deskGroup.add(stand);

        // Reception Service Bell (Ding!)
        const bellGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const bellMat = new THREE.MeshLambertMaterial({ color: 0xFFB703 });
        const bell = new THREE.Mesh(bellGeo, bellMat);
        bell.position.set(-1.0, 1.32, 0.2);
        deskGroup.add(bell);

        parent.add(deskGroup);

        this.receptionZone = {
            position: new THREE.Vector3(x, y, z),
            customerWaitPos: new THREE.Vector3(x, 0, z + 1.8),
            staffPos: new THREE.Vector3(x, 0, z - 1.2)
        };
    }

    createTreatmentBed(x, y, z, bedId, parent) {
        const bedGroup = new THREE.Group();
        bedGroup.position.set(x, y, z);

        // Bed Base & Frame
        const frameGeo = new THREE.BoxGeometry(2.4, 0.6, 1.2);
        const frameMat = new THREE.MeshLambertMaterial({ color: 0xE2E8F0 });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.y = 0.3;
        frame.castShadow = true;
        bedGroup.add(frame);

        // Soft Mattress & Cover (White with warm orange accent blanket)
        const mattressGeo = new THREE.BoxGeometry(2.3, 0.25, 1.15);
        const mattressMat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const mattress = new THREE.Mesh(mattressGeo, mattressMat);
        mattress.position.y = 0.72;
        bedGroup.add(mattress);

        // Pillow
        const pillowGeo = new THREE.BoxGeometry(0.4, 0.12, 0.8);
        const pillowMat = new THREE.MeshLambertMaterial({ color: 0xFFEBE5 });
        const pillow = new THREE.Mesh(pillowGeo, pillowMat);
        pillow.position.set(-0.85, 0.86, 0);
        bedGroup.add(pillow);

        // Fox Spa Orange Blanket
        const blanketGeo = new THREE.BoxGeometry(1.2, 0.04, 1.16);
        const blanketMat = new THREE.MeshLambertMaterial({ color: 0xF25C2B });
        const blanket = new THREE.Mesh(blanketGeo, blanketMat);
        blanket.position.set(0.45, 0.86, 0);
        bedGroup.add(blanket);

        // Professional Facial Steamer & Ultrasonic Device beside bed
        const trolleyGeo = new THREE.BoxGeometry(0.6, 0.8, 0.8);
        const trolleyMat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const trolley = new THREE.Mesh(trolleyGeo, trolleyMat);
        trolley.position.set(-0.6, 0.4, -1.2);
        trolley.castShadow = true;
        bedGroup.add(trolley);

        // Steamer arm
        const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.9, 6);
        const armMat = new THREE.MeshLambertMaterial({ color: 0x94A3B8 });
        const steamerArm = new THREE.Mesh(armGeo, armMat);
        steamerArm.position.set(-0.6, 1.2, -1.2);
        steamerArm.rotation.z = Math.PI / 4;
        bedGroup.add(steamerArm);

        // Floating Status Billboard directly over bed in 3D world
        const statusCanvas = document.createElement('canvas');
        statusCanvas.width = 512;
        statusCanvas.height = 150;
        const statusTex = new THREE.CanvasTexture(statusCanvas);
        const statusSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: statusTex }));
        statusSprite.scale.set(3.4, 1.0, 1);
        statusSprite.position.set(0, 2.65, 0);
        bedGroup.add(statusSprite);

        parent.add(bedGroup);

        const bedObj = {
            id: bedId,
            group: bedGroup,
            position: new THREE.Vector3(x, y, z),
            customerLiePos: new THREE.Vector3(x, 0.9, z),
            staffWorkPos: new THREE.Vector3(x, 0, z + 1.2),
            state: 'EMPTY_CLEAN', // 'EMPTY_CLEAN', 'OCCUPIED_WAITING', 'IN_SERVICE', 'DIRTY'
            assignedCustomer: null,
            statusCanvas: statusCanvas,
            statusTex: statusTex,
            statusSprite: statusSprite,
            updateBadge: function() {
                const ctx = this.statusCanvas.getContext('2d');
                ctx.clearRect(0, 0, 512, 150);
                const c = this.assignedCustomer;

                if (this.state === 'EMPTY_CLEAN') {
                    ctx.fillStyle = 'rgba(16, 185, 129, 0.92)';
                    ctx.roundRect ? ctx.roundRect(24, 25, 464, 100, 24) : ctx.fillRect(24, 25, 464, 100);
                    ctx.fill();
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(`Giường #${this.id}: Sẵn sàng ✨`, 256, 88);
                } else if (this.state === 'OCCUPIED_WAITING') {
                    ctx.fillStyle = 'rgba(242, 92, 43, 0.95)';
                    ctx.roundRect ? ctx.roundRect(16, 15, 480, 120, 24) : ctx.fillRect(16, 15, 480, 120);
                    ctx.fill();

                    const cName = c ? c.name : 'Khách';
                    const pName = c ? c.packageName : 'Dịch vụ';
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${cName} • ${pName}`, 256, 60);

                    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
                    ctx.fillStyle = '#FFEBE5';
                    ctx.fillText(`Nhấn [E] để bắt đầu làm đẹp ✨`, 256, 104);
                } else if (this.state === 'IN_SERVICE') {
                    ctx.fillStyle = 'rgba(24, 29, 36, 0.95)';
                    ctx.roundRect ? ctx.roundRect(16, 10, 480, 130, 24) : ctx.fillRect(16, 10, 480, 130);
                    ctx.fill();
                    ctx.strokeStyle = '#F25C2B';
                    ctx.lineWidth = 4;
                    ctx.stroke();

                    const stepIdx = c ? c.currentStepIndex : 0;
                    const totalSteps = (c && c.packageData && c.packageData.steps) ? c.packageData.steps.length : 4;
                    const currentStep = (c && c.packageData && c.packageData.steps[stepIdx]) ? c.packageData.steps[stepIdx] : { name: 'Chăm sóc da', icon: '✨' };
                    const progress = c ? (c.stepProgress || 0) : 0;

                    // Line 1: Header
                    ctx.fillStyle = '#FFB703';
                    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
                    ctx.textAlign = 'left';
                    ctx.fillText(`${c ? c.name : 'Khách'} - ${c ? c.packageName : ''}`, 36, 40);

                    // Line 2: Step title
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = 'bold 25px "Plus Jakarta Sans", sans-serif';
                    ctx.fillText(`Đang làm: Bước ${stepIdx + 1}/${totalSteps} - ${currentStep.name} ${currentStep.icon}`, 36, 76);

                    // Line 3: Live In-world Progress Bar
                    const barX = 36;
                    const barY = 96;
                    const barW = 440;
                    const barH = 22;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
                    ctx.roundRect ? ctx.roundRect(barX, barY, barW, barH, 11) : ctx.fillRect(barX, barY, barW, barH);
                    ctx.fill();

                    const fillW = Math.max(14, (barW * progress) / 100);
                    ctx.fillStyle = '#F25C2B';
                    ctx.roundRect ? ctx.roundRect(barX, barY, fillW, barH, 11) : ctx.fillRect(barX, barY, fillW, barH);
                    ctx.fill();
                } else if (this.state === 'DIRTY') {
                    ctx.fillStyle = 'rgba(225, 29, 72, 0.95)';
                    ctx.roundRect ? ctx.roundRect(24, 25, 464, 100, 24) : ctx.fillRect(24, 25, 464, 100);
                    ctx.fill();
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(`Giường #${this.id}: Cần dọn dẹp & thay khăn [E] 🧹`, 256, 88);
                }

                this.statusTex.needsUpdate = true;
            }
        };

        bedObj.updateBadge();
        this.beds.push(bedObj);
    }

    createRetailShelves(x, y, z, parent) {
        const shelfGroup = new THREE.Group();
        shelfGroup.position.set(x, y, z);

        // High luxury wooden wall shelf
        const frameGeo = new THREE.BoxGeometry(0.8, 3.5, 4.5);
        const frameMat = new THREE.MeshLambertMaterial({ color: 0x3E2723 }); // Dark Walnut Wood
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.y = 1.75;
        shelfGroup.add(frame);

        // 3 glass shelves with LED backlight
        for (let i = 0; i < 3; i++) {
            const levelGeo = new THREE.BoxGeometry(0.85, 0.05, 4.3);
            const levelMat = new THREE.MeshLambertMaterial({ color: 0xFFF0EB });
            const level = new THREE.Mesh(levelGeo, levelMat);
            level.position.y = 0.8 + i * 0.9;
            shelfGroup.add(level);

            // Display bottles (Cleansers, Toners, Serums)
            const colors = [0xF25C2B, 0x38BDF8, 0xFACC15, 0xF472B6];
            for (let b = 0; b < 6; b++) {
                const bottleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8);
                const bottleMat = new THREE.MeshLambertMaterial({ color: colors[b % colors.length] });
                const bottle = new THREE.Mesh(bottleGeo, bottleMat);
                bottle.position.set(0.1, 0.8 + i * 0.9 + 0.2, -1.8 + b * 0.65);
                shelfGroup.add(bottle);
            }
        }

        parent.add(shelfGroup);
        this.retailZone = { position: new THREE.Vector3(x + 1.2, 0, z) };
    }

    createStorageStation(x, y, z, parent) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        // Storage cabinet for clean towels & product boxes
        const cabinetGeo = new THREE.BoxGeometry(3, 2.2, 0.8);
        const cabinetMat = new THREE.MeshLambertMaterial({ color: 0xF1F5F9 });
        const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
        cabinet.position.y = 1.1;
        cabinet.castShadow = true;
        group.add(cabinet);

        // Laundry hamper basket (Khăn bẩn)
        const hamperGeo = new THREE.CylinderGeometry(0.4, 0.3, 0.8, 12);
        const hamperMat = new THREE.MeshLambertMaterial({ color: 0x94A3B8 });
        const hamper = new THREE.Mesh(hamperGeo, hamperMat);
        hamper.position.set(2.0, 0.4, 0);
        group.add(hamper);

        parent.add(group);
        this.storageZone = { position: new THREE.Vector3(x + 0.5, 0, z + 1.2) };
    }

    createWaitingLounge(x, y, z, parent) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        // Nordic style cream fabric sofa
        const sofaBase = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 0.5, 1.2),
            new THREE.MeshLambertMaterial({ color: 0xEDE8E1 })
        );
        sofaBase.position.y = 0.25;
        group.add(sofaBase);

        const sofaBack = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 0.8, 0.3),
            new THREE.MeshLambertMaterial({ color: 0xEDE8E1 })
        );
        sofaBack.position.set(0, 0.7, 0.5);
        group.add(sofaBack);

        // Indoor potted plant (Monstera / Ficus)
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.2, 0.6, 12),
            new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
        );
        pot.position.set(-2.0, 0.3, 0);
        group.add(pot);

        const plant = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.5, 1),
            new THREE.MeshLambertMaterial({ color: 0x22C55E })
        );
        plant.position.set(-2.0, 0.8, 0);
        group.add(plant);

        parent.add(group);
    }

    createPlayer() {
        const group = new THREE.Group();
        group.position.set(0, 0, 5);

        // Player Model: FaceWashFox Spa Specialist Uniform (White Polo & Apron)
        const skinMat = new THREE.MeshLambertMaterial({ color: 0xFFDFC4 });
        const uniformMat = new THREE.MeshLambertMaterial({ color: 0xF25C2B }); // Signature Fox Orange Uniform
        const pantsMat = new THREE.MeshLambertMaterial({ color: 0x1E293B });
        const hairMat = new THREE.MeshLambertMaterial({ color: 0x18181B });

        // Torso
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.35), uniformMat);
        torso.position.y = 1.35;
        torso.castShadow = true;
        group.add(torso);

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), skinMat);
        head.position.y = 1.95;
        head.castShadow = true;
        group.add(head);

        // Hair
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.8), hairMat);
        hair.position.y = 2.0;
        group.add(hair);

        // Arms
        this.playerLeftArm = new THREE.Group();
        this.playerLeftArm.position.set(0.35, 1.6, 0);
        const lArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.5, 8), uniformMat);
        lArmMesh.position.y = -0.25;
        this.playerLeftArm.add(lArmMesh);
        group.add(this.playerLeftArm);

        this.playerRightArm = new THREE.Group();
        this.playerRightArm.position.set(-0.35, 1.6, 0);
        const rArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.5, 8), uniformMat);
        rArmMesh.position.y = -0.25;
        this.playerRightArm.add(rArmMesh);
        group.add(this.playerRightArm);

        // Legs
        this.playerLeftLeg = new THREE.Group();
        this.playerLeftLeg.position.set(0.15, 1.0, 0);
        const lLegMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.8, 8), pantsMat);
        lLegMesh.position.y = -0.4;
        this.playerLeftLeg.add(lLegMesh);
        group.add(this.playerLeftLeg);

        this.playerRightLeg = new THREE.Group();
        this.playerRightLeg.position.set(-0.15, 1.0, 0);
        const rLegMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.8, 8), pantsMat);
        rLegMesh.position.y = -0.4;
        this.playerRightLeg.add(rLegMesh);
        group.add(this.playerRightLeg);

        // Floating Name Badge: "Chủ Spa FaceWashFox 🦊"
        const badgeCanvas = document.createElement('canvas');
        badgeCanvas.width = 256;
        badgeCanvas.height = 64;
        const bCtx = badgeCanvas.getContext('2d');
        bCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        bCtx.roundRect ? bCtx.roundRect(10, 8, 236, 48, 14) : bCtx.fillRect(10, 8, 236, 48);
        bCtx.fill();
        bCtx.strokeStyle = '#F25C2B';
        bCtx.lineWidth = 4;
        bCtx.stroke();
        bCtx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        bCtx.fillStyle = '#1A1A1A';
        bCtx.textAlign = 'center';
        bCtx.fillText('Chủ Spa 🦊', 128, 40);

        const bTexture = new THREE.CanvasTexture(badgeCanvas);
        const bSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: bTexture }));
        bSprite.scale.set(2.4, 0.6, 1);
        bSprite.position.y = 2.6;
        group.add(bSprite);

        this.player = {
            group: group,
            torso: torso,
            speed: 5.5
        };

        this.scene.add(group);
    }

    setupInputs() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.keys[e.code] = true;

            // E or Space: Interact
            if (e.code === 'KeyE' || e.code === 'Space') {
                this.interact();
            }

            // Tab: Open Management Phone
            if (e.code === 'Tab') {
                e.preventDefault();
                this.toggleManagementPhone();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.keys[e.code] = false;
        });

        // Setup Virtual Joystick for Mobile
        this.setupTouchJoystick();
    }

    setupTouchJoystick() {
        const zone = document.getElementById('mobile-joystick-zone');
        const knob = document.getElementById('joystick-knob');
        if (!zone || !knob) return;

        let activeId = null;
        let cX = 0;
        let cY = 0;
        const maxR = 45;

        const updateKnob = (clientX, clientY) => {
            const dx = clientX - cX;
            const dy = clientY - cY;
            const dist = Math.hypot(dx, dy);
            const clamped = Math.min(dist, maxR);
            const ang = Math.atan2(dy, dx);

            const kX = Math.cos(ang) * clamped;
            const kY = Math.sin(ang) * clamped;
            knob.style.transform = `translate(${kX}px, ${kY}px)`;

            if (dist > 6) {
                this.joystickActive = true;
                this.joystickVector.x = kX / maxR;
                this.joystickVector.z = kY / maxR;
            } else {
                this.joystickActive = false;
                this.joystickVector.x = 0;
                this.joystickVector.z = 0;
            }
        };

        zone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (activeId !== null) return;
            const touch = e.changedTouches[0];
            activeId = touch.identifier;
            const r = zone.getBoundingClientRect();
            cX = r.left + r.width / 2;
            cY = r.top + r.height / 2;
            updateKnob(touch.clientX, touch.clientY);
        }, { passive: false });

        zone.addEventListener('touchmove', (e) => {
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === activeId) {
                    updateKnob(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                    break;
                }
            }
        }, { passive: false });

        const endTouch = (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === activeId) {
                    activeId = null;
                    this.joystickActive = false;
                    this.joystickVector = { x: 0, z: 0 };
                    knob.style.transform = 'translate(0px, 0px)';
                    break;
                }
            }
        };

        zone.addEventListener('touchend', endTouch);
        zone.addEventListener('touchcancel', endTouch);

        // Mobile Buttons
        const actionBtn = document.getElementById('mobile-btn-action');
        if (actionBtn) {
            actionBtn.onclick = () => this.interact();
        }
        const phoneBtn = document.getElementById('mobile-btn-phone');
        if (phoneBtn) {
            phoneBtn.onclick = () => this.toggleManagementPhone();
        }
    }

    // 3D In-World Spa Particle System (Bubbly foam, soothing steam, sparkling serum, bio-light)
    spawnSpaParticles(pos, type) {
        const count = 10;
        for (let i = 0; i < count; i++) {
            let geo;
            let mat;

            if (type === 'foam') {
                geo = new THREE.SphereGeometry(0.045 + Math.random() * 0.04, 8, 8);
                mat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.9 });
            } else if (type === 'steam') {
                geo = new THREE.SphereGeometry(0.06 + Math.random() * 0.06, 6, 6);
                mat = new THREE.MeshLambertMaterial({ color: 0xE0F2FE, transparent: true, opacity: 0.6 });
            } else if (type === 'sparkle' || type === 'sonic') {
                geo = new THREE.DodecahedronGeometry(0.045, 0);
                mat = new THREE.MeshLambertMaterial({ color: 0xFACC15, emissive: 0xF59E0B, emissiveIntensity: 0.6 });
            } else if (type === 'biolight') {
                geo = new THREE.DodecahedronGeometry(0.05, 0);
                mat = new THREE.MeshLambertMaterial({ color: 0x38BDF8, emissive: 0x0284C7, emissiveIntensity: 0.7 });
            } else if (type === 'mask') {
                geo = new THREE.SphereGeometry(0.04 + Math.random() * 0.04, 6, 6);
                mat = new THREE.MeshLambertMaterial({ color: 0x65A30D, transparent: true, opacity: 0.85 });
            } else {
                geo = new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 8, 8);
                mat = new THREE.MeshLambertMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.85 });
            }

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(
                pos.x + (Math.random() - 0.5) * 0.45,
                pos.y + (Math.random() - 0.5) * 0.2,
                pos.z + (Math.random() - 0.5) * 0.45
            );
            mesh.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.35,
                0.55 + Math.random() * 0.65,
                (Math.random() - 0.5) * 0.35
            );
            mesh.life = 1.0;
            mesh.maxLife = 0.7 + Math.random() * 0.5;

            this.scene.add(mesh);
            this.particles.push(mesh);
        }
    }

    updateParticles(delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.position.addScaledVector(p.velocity, delta);
            p.life -= delta / p.maxLife;

            if (p.material && p.material.opacity !== undefined) {
                p.material.opacity = Math.max(0, p.life);
            }

            if (p.life <= 0) {
                this.scene.remove(p);
                if (p.geometry) p.geometry.dispose();
                if (p.material) p.material.dispose();
                this.particles.splice(i, 1);
            }
        }
    }

    interact() {
        window.spaAudio.init();

        if (!this.interactionTarget) {
            this.showToast('Không có vật thể tương tác nào gần đây!');
            return;
        }

        const target = this.interactionTarget;

        // 1. Reception Desk: Check-in waiting customer
        if (target.type === 'reception') {
            const waitingCustomer = this.customers.find(c => c.state === 'WAITING_AT_DESK');
            if (waitingCustomer) {
                this.assignCustomerToBed(waitingCustomer);
            } else {
                window.spaAudio.playBell();
                this.showToast('Quầy Lễ Tân: Đang đợi khách tiếp theo bước vào...');
            }
            return;
        }

        // 2. Spa Bed: Clean dirty bed OR Start/Advance step
        if (target.type === 'bed') {
            const bed = target.bed;
            if (bed.state === 'DIRTY') {
                bed.state = 'EMPTY_CLEAN';
                bed.updateBadge();
                window.spaAudio.playPop();
                this.showToast(`Đã thay khăn sạch tiệt trùng cho Giường #${bed.id} ✨`);
            } else if (bed.state === 'OCCUPIED_WAITING' || bed.state === 'IN_SERVICE') {
                this.advanceTreatmentStep(bed);
            } else if (bed.state === 'EMPTY_CLEAN') {
                this.showToast(`Giường #${bed.id} đang sạch sẽ, sẵn sàng đón khách.`);
            }
            return;
        }

        // 3. Retail Shelf: Restock cosmetic items
        if (target.type === 'retail') {
            this.restockShelves();
            return;
        }

        // 4. Storage Cabinet: Take towels or check stock
        if (target.type === 'storage') {
            this.toggleManagementPhone('supplier');
            return;
        }
    }

    assignCustomerToBed(customer) {
        const cleanBed = this.beds.find(b => b.state === 'EMPTY_CLEAN');
        if (!cleanBed) {
            this.showToast('Tất cả giường đều đang bận hoặc cần vệ sinh!');
            window.spaAudio.playPop();
            return;
        }

        customer.assignedBed = cleanBed;
        cleanBed.assignedCustomer = customer;
        cleanBed.state = 'OCCUPIED_WAITING';
        cleanBed.updateBadge();

        customer.targetPos.copy(cleanBed.customerLiePos);
        customer.state = 'WALKING_TO_BED';

        window.spaAudio.playBell();
        this.showToast(`Đã hướng dẫn ${customer.name} vào Giường #${cleanBed.id} ("${customer.packageName}")`);
    }

    advanceTreatmentStep(bed) {
        if (!bed || !bed.assignedCustomer) return;
        const c = bed.assignedCustomer;
        if (!c.packageData) return;

        if (bed.state === 'OCCUPIED_WAITING') {
            bed.state = 'IN_SERVICE';
            this.activeTreatmentBed = bed;
            window.spaAudio.playWater();
        }

        const steps = c.packageData.steps;
        const currentStep = steps[c.currentStepIndex];

        // Advance progress (+25% per action click/press)
        c.stepProgress = (c.stepProgress || 0) + 25;

        // Spawn 3D Particles at bed customer face position
        const facePos = bed.customerLiePos.clone();
        facePos.x -= 0.65;
        facePos.y += 0.35;
        this.spawnSpaParticles(facePos, currentStep.particle);

        // ASMR Sound effect according to current step
        if (currentStep.particle === 'foam') window.spaAudio.playFoam();
        else if (currentStep.particle === 'steam') window.spaAudio.playSteam();
        else if (currentStep.particle === 'sonic' || currentStep.particle === 'sparkle' || currentStep.particle === 'biolight') window.spaAudio.playChime();
        else if (currentStep.particle === 'splash') window.spaAudio.playWater();
        else window.spaAudio.playPop();

        // Check if current step reached 100%
        if (c.stepProgress >= 100) {
            c.currentStepIndex++;
            c.stepProgress = 0;

            if (c.currentStepIndex < steps.length) {
                const nextStep = steps[c.currentStepIndex];
                window.spaAudio.playChime();
                this.showToast(`Hoàn tất bước! Tiếp theo: ${nextStep.icon} ${nextStep.name}`);
            } else {
                // All steps completed!
                this.finishTreatmentService(bed);
                return;
            }
        }

        // Update in-world 3D badge and bottom HUD
        bed.updateBadge();
        this.updateTreatmentHUD(bed);
    }

    updateTreatmentHUD(bed) {
        const hud = document.getElementById('treatment-hud');
        if (!hud) return;

        if (!bed || bed.state !== 'IN_SERVICE' || !bed.assignedCustomer) {
            hud.style.display = 'none';
            return;
        }

        const c = bed.assignedCustomer;
        const steps = c.packageData.steps;
        const step = steps[c.currentStepIndex];

        hud.style.display = 'flex';
        const clientEl = document.getElementById('treatment-hud-client');
        const pkgEl = document.getElementById('treatment-hud-pkg');
        const titleEl = document.getElementById('treatment-hud-step-title');
        const fillEl = document.getElementById('treatment-hud-progress-fill');

        if (clientEl) clientEl.innerText = `Khách: ${c.name}`;
        if (pkgEl) pkgEl.innerText = `${c.packageName}`;
        if (titleEl) titleEl.innerText = `Bước ${c.currentStepIndex + 1}/${steps.length}: ${step.icon} ${step.name}`;
        if (fillEl) fillEl.style.width = `${c.stepProgress}%`;
    }

    finishTreatmentService(bed) {
        const targetBed = bed || this.activeTreatmentBed;
        if (!targetBed) return;

        const customer = targetBed.assignedCustomer;
        const fee = customer ? customer.price : 199000;
        const tip = customer ? customer.tip : 35000;

        // Earn Revenue
        this.money += fee + tip;
        this.totalCustomersServed++;
        this.rating = Math.min(5.0, (this.rating * 9 + 5.0) / 10);

        window.spaAudio.playCash();
        if (window.confetti) window.confetti({ particleCount: 70, spread: 70 });

        this.showToast(`✨ Xong liệu trình "${customer ? customer.packageName : 'Spa'}"! +${(fee + tip).toLocaleString()}đ (kèm Tip) ⭐⭐⭐⭐⭐`);

        // Hide bottom HUD
        const hud = document.getElementById('treatment-hud');
        if (hud) hud.style.display = 'none';

        // Customer stands up and leaves happily
        if (customer) {
            customer.state = 'LEAVING';
            customer.group.rotation.set(0, 0, 0); // Stand upright!
            customer.targetPos.set(0, 0, 14); // Exit door
        }

        // Bed becomes dirty -> Needs cleaning!
        targetBed.state = 'DIRTY';
        targetBed.assignedCustomer = null;
        targetBed.updateBadge();
        if (this.activeTreatmentBed === targetBed) {
            this.activeTreatmentBed = null;
        }

        this.updateHUD();
    }

    restockShelves() {
        // Move stock from storage to shelf
        let restocked = false;
        for (const item of ['cleanser', 'toner', 'serum', 'cream', 'mask']) {
            if (this.storage[item] > 0 && this.shelfStock[item] < 8) {
                const add = Math.min(this.storage[item], 4);
                this.storage[item] -= add;
                this.shelfStock[item] += add;
                restocked = true;
            }
        }

        if (restocked) {
            window.spaAudio.playPop();
            this.showToast('Đã bổ sung đầy đủ sản phẩm FaceWashFox lên kệ trưng bày! 🧴✨');
        } else {
            this.showToast('Kho hàng đã hết! Hãy mở Điện Thoại để đặt thêm từ nhà cung cấp.');
        }
        this.updateHUD();
    }

    buySupplierItem(item, cost, qty) {
        if (this.money < cost) {
            this.showToast('Tài khoản không đủ tiền thanh toán!');
            return;
        }
        this.money -= cost;
        this.storage[item] = (this.storage[item] || 0) + qty;
        window.spaAudio.playCash();
        this.showToast(`Đã nhập +${qty} ${item} vào kho!`);
        this.updateHUD();
    }

    hireStaff(role, cost) {
        if (this.hiredStaff[role]) return;
        if (this.money < cost) {
            this.showToast('Không đủ tiền thuê nhân sự!');
            return;
        }
        this.money -= cost;
        this.hiredStaff[role] = true;
        window.spaAudio.playCash();
        this.showToast(`Đã tuyển ${role === 'receptionist' ? 'Lễ Tân Chuyên Nghiệp' : 'Kỹ Thuật Viên Spa'}!`);
        this.updateHUD();
    }

    toggleManagementPhone(defaultTab = 'overview') {
        const modal = document.getElementById('phone-modal');
        const isHidden = modal.style.display === 'none' || !modal.style.display;
        modal.style.display = isHidden ? 'flex' : 'none';

        if (isHidden) {
            window.spaAudio.playPop();
            this.switchPhoneTab(defaultTab);
        }
    }

    switchPhoneTab(tabName) {
        document.querySelectorAll('.phone-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('.phone-tab-page').forEach(page => {
            page.style.display = (page.id === `page-${tabName}`) ? 'block' : 'none';
        });
    }

    spawnCustomerNPC() {
        if (this.customers.length >= 4) return;

        const customerGroup = new THREE.Group();
        customerGroup.position.set((Math.random() - 0.5) * 4, 0, 14); // Spawns outside on sidewalk

        const clothesColors = [0x3B82F6, 0xEC4899, 0x10B981, 0x8B5CF6, 0xF59E0B];
        const color = clothesColors[Math.floor(Math.random() * clothesColors.length)];

        // NPC Chibi Body
        const bodyMat = new THREE.MeshLambertMaterial({ color: color });
        const skinMat = new THREE.MeshLambertMaterial({ color: 0xFFDFC4 });

        const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.3), bodyMat);
        body.position.y = 1.0;
        body.castShadow = true;
        customerGroup.add(body);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), skinMat);
        head.position.y = 1.6;
        head.castShadow = true;
        customerGroup.add(head);

        this.scene.add(customerGroup);

        const names = ['Chị Linh', 'Anh Hoàng', 'Bảo Ngọc', 'Minh Anh', 'Khánh Vy', 'Quỳnh Trang', 'Thu Hà', 'Đức Huy'];
        const pkgKeys = Object.keys(this.spaPackages);
        const selectedKey = pkgKeys[Math.floor(Math.random() * pkgKeys.length)];
        const selectedPkg = this.spaPackages[selectedKey];

        const npc = {
            group: customerGroup,
            name: names[Math.floor(Math.random() * names.length)],
            pkgKey: selectedKey,
            packageName: selectedPkg.name,
            packageData: selectedPkg,
            price: selectedPkg.price,
            tip: selectedPkg.tip,
            currentStepIndex: 0,
            stepProgress: 0,
            state: 'ENTERING', // 'ENTERING', 'WAITING_AT_DESK', 'WALKING_TO_BED', 'ON_BED', 'LEAVING'
            targetPos: this.receptionZone.customerWaitPos.clone(),
            assignedBed: null,
            waitTimer: 45
        };

        this.customers.push(npc);
    }

    updateCustomers(delta) {
        // Technician staff automation: advances steps every 1.3s if bed is active
        if (this.hiredStaff.technician) {
            this.technicianTimer = (this.technicianTimer || 0) + delta;
            if (this.technicianTimer >= 1.3) {
                this.technicianTimer = 0;
                for (const bed of this.beds) {
                    if (bed.state === 'OCCUPIED_WAITING' || bed.state === 'IN_SERVICE') {
                        this.advanceTreatmentStep(bed);
                        break;
                    }
                }
            }
        }

        for (let i = this.customers.length - 1; i >= 0; i--) {
            const c = this.customers[i];
            const dist = c.group.position.distanceTo(c.targetPos);

            if (dist > 0.3) {
                const dir = c.targetPos.clone().sub(c.group.position).normalize();
                c.group.position.addScaledVector(dir, 2.2 * delta);
                c.group.rotation.y = Math.atan2(dir.x, dir.z);

                // Walking bobbing
                c.group.position.y = Math.abs(Math.sin(Date.now() * 0.01)) * 0.08;
            } else {
                c.group.position.y = 0;

                // State transition upon reaching destination
                if (c.state === 'ENTERING') {
                    c.state = 'WAITING_AT_DESK';
                    window.spaAudio.playBell();
                    this.showToast(`${c.name} đến quầy: Chọn gói "${c.packageName}"`);

                    // If receptionist hired: auto assign to clean bed!
                    if (this.hiredStaff.receptionist) {
                        setTimeout(() => this.assignCustomerToBed(c), 1200);
                    }
                } else if (c.state === 'WALKING_TO_BED') {
                    c.state = 'ON_BED';
                    // Lie down on bed comfortably
                    c.group.position.copy(c.assignedBed.customerLiePos);
                    c.group.rotation.set(0, 0, Math.PI / 2); // Lying down
                    if (c.assignedBed) {
                        c.assignedBed.updateBadge();
                    }
                } else if (c.state === 'LEAVING') {
                    // Remove from scene
                    this.scene.remove(c.group);
                    this.customers.splice(i, 1);
                }
            }
        }
    }

    updatePlayerMovement(delta) {
        if (!this.player) return;

        let moveX = 0;
        let moveZ = 0;

        if (this.joystickActive) {
            moveX = this.joystickVector.x;
            moveZ = this.joystickVector.z;
        } else {
            if (this.keys['w'] || this.keys['arrowup']) moveZ -= 1;
            if (this.keys['s'] || this.keys['arrowdown']) moveZ += 1;
            if (this.keys['a'] || this.keys['arrowleft']) moveX -= 1;
            if (this.keys['d'] || this.keys['arrowright']) moveX += 1;
        }

        const isMoving = (Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05);
        const t = Date.now() * 0.012;

        if (isMoving) {
            const moveVec = new THREE.Vector3(moveX, 0, moveZ).normalize();
            const nextPos = this.player.group.position.clone().addScaledVector(moveVec, this.player.speed * delta);

            // Store boundary collision (Room: x: -9 to 9, z: -7 to 7)
            if (nextPos.x > -9.2 && nextPos.x < 9.2 && nextPos.z > -7.2 && nextPos.z < 8.5) {
                this.player.group.position.copy(nextPos);
            }

            const targetAngle = Math.atan2(moveVec.x, moveVec.z);
            let diff = targetAngle - this.player.group.rotation.y;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            this.player.group.rotation.y += diff * 0.25;

            // Limbs walk animation
            this.playerLeftLeg.rotation.x = Math.sin(t) * 0.65;
            this.playerRightLeg.rotation.x = -Math.sin(t) * 0.65;
            this.playerLeftArm.rotation.x = -Math.sin(t) * 0.55;
            this.playerRightArm.rotation.x = -Math.sin(t) * 0.55;
            this.player.torso.position.y = 1.35 + Math.abs(Math.sin(t)) * 0.06;
        } else {
            this.playerLeftLeg.rotation.x *= 0.8;
            this.playerRightLeg.rotation.x *= 0.8;
            this.playerLeftArm.rotation.x *= 0.8;
            this.playerRightArm.rotation.x *= 0.8;
            this.player.torso.position.y = 1.35 + Math.sin(Date.now() * 0.003) * 0.02;
        }

        // Camera follow smoothly behind player inside the store (Responsive for mobile portrait)
        const isPortrait = window.innerHeight > window.innerWidth;
        const targetCamX = this.player.group.position.x * 0.35;
        const targetCamZ = this.player.group.position.z * 0.35 + (isPortrait ? 16 : 13);
        const targetCamY = isPortrait ? 17 : 14;

        this.camera.position.x += (targetCamX - this.camera.position.x) * 0.06;
        this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.06;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 0.06;
        this.camera.lookAt(this.player.group.position.x * 0.4, 1.2, this.player.group.position.z * 0.4);

        // Check nearest interactive target
        this.checkInteractionProximity();
    }

    checkInteractionProximity() {
        const pPos = this.player.group.position;
        const promptEl = document.getElementById('interaction-prompt');
        const promptText = document.getElementById('interaction-text');

        let foundTarget = null;

        // Check Reception Desk
        if (pPos.distanceTo(this.receptionZone.position) < 2.8) {
            foundTarget = { type: 'reception', label: 'Quầy Lễ Tân (Đón khách / Xem hóa đơn)' };
        }

        // Check Beds
        for (const bed of this.beds) {
            if (pPos.distanceTo(bed.position) < 2.5) {
                let action = 'Giường Spa';
                const c = bed.assignedCustomer;
                if (bed.state === 'DIRTY') {
                    action = 'Dọn dẹp & thay khăn mới [E]';
                } else if (bed.state === 'OCCUPIED_WAITING') {
                    action = `Bắt đầu: ${c ? c.packageName : 'Làm đẹp'} [E]`;
                } else if (bed.state === 'IN_SERVICE') {
                    const step = (c && c.packageData && c.packageData.steps[c.currentStepIndex]) ? c.packageData.steps[c.currentStepIndex] : null;
                    action = `Thao tác: ${step ? (step.name + ' ' + step.icon) : 'Tiếp tục'} [E]`;
                } else {
                    action = `Giường #${bed.id} sẵn sàng ✨`;
                }
                foundTarget = { type: 'bed', bed: bed, label: action };
                this.updateTreatmentHUD(bed);
                break;
            }
        }

        // Hide HUD if not near an in-service bed
        if (!foundTarget || foundTarget.type !== 'bed' || foundTarget.bed.state !== 'IN_SERVICE') {
            const hud = document.getElementById('treatment-hud');
            if (hud) hud.style.display = 'none';
        }

        // Check Retail Shelves
        if (!foundTarget && pPos.distanceTo(this.retailZone.position) < 2.8) {
            foundTarget = { type: 'retail', label: 'Kệ Skincare (Bổ sung sản phẩm lên kệ)' };
        }

        // Check Storage Cabinet
        if (!foundTarget && pPos.distanceTo(this.storageZone.position) < 2.8) {
            foundTarget = { type: 'storage', label: 'Kho Hàng & Khăn Sạch (Đặt thêm vật tư)' };
        }

        this.interactionTarget = foundTarget;

        if (foundTarget) {
            promptEl.style.display = 'flex';
            promptText.innerText = foundTarget.label;
        } else {
            promptEl.style.display = 'none';
        }
    }

    showToast(text) {
        const el = document.createElement('div');
        el.className = 'floating-toast';
        el.innerText = text;
        document.body.appendChild(el);

        const screenPos = this.player.group.position.clone();
        screenPos.y += 2.2;
        screenPos.project(this.camera);

        const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;

        setTimeout(() => el.remove(), 1500);
    }

    updateHUD() {
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val;
        };

        setVal('money-count', `${this.money.toLocaleString()}đ`);
        setVal('rating-score', `⭐ ${this.rating.toFixed(1)}`);
        setVal('served-count', this.totalCustomersServed);

        // In-game Clock
        const hrs = String(this.gameTimeHours).padStart(2, '0');
        const mins = String(this.gameTimeMinutes).padStart(2, '0');
        setVal('time-display', `Ngày ${this.day} • ${hrs}:${mins}`);

        // Phone App Reports
        setVal('phone-money', `${this.money.toLocaleString()}đ`);
        setVal('phone-rating', `⭐ ${this.rating.toFixed(1)}`);
        setVal('phone-served', `${this.totalCustomersServed} khách`);

        // Update inventory numbers
        for (const k of ['cleanser', 'toner', 'serum', 'cream', 'mask']) {
            const el = document.getElementById(`stock-${k}`);
            if (el) el.innerText = `Kho: ${this.storage[k]} | Kệ: ${this.shelfStock[k]}`;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = Math.min(this.clock.getDelta(), 0.1);

        // Update In-game clock (1 second real time = 2 minutes in game)
        this.gameTimeMinutes += Math.floor(delta * 2);
        if (this.gameTimeMinutes >= 60) {
            this.gameTimeMinutes = 0;
            this.gameTimeHours++;
            if (this.gameTimeHours >= 21) {
                // End of day at 21:00 -> Start new day
                this.gameTimeHours = 8;
                this.day++;
                this.showToast(`🎉 KẾT THÚC NGÀY! BẮT ĐẦU NGÀY KINH DOANH THỨ ${this.day}`);
            }
        }

        // Spawn Customer AI periodically
        this.customerSpawnTimer -= delta;
        if (this.customerSpawnTimer <= 0) {
            this.customerSpawnTimer = 7 + Math.random() * 8;
            this.spawnCustomerNPC();
        }

        this.updatePlayerMovement(delta);
        this.updateCustomers(delta);
        this.updateParticles(delta);
        this.updateHUD();

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Robust auto-start for all browsers
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        window.game = new FaceWashFoxSimulator();
    });
} else {
    window.game = new FaceWashFoxSimulator();
}
