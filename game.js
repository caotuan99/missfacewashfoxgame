// FaceWashFox Store Simulator - Main 3D Engine & Game Logic
// Three.js, Spa Store 3D, Customer AI, Spa Treatment, Inventory & Economy

// Strict Age Hierarchy: OANH > UYÊN > PHƯƠNG ANH > VY > MAI ANH
const GOSSIP_DIALOGUES = [
    // OANH (Lớn nhất - Chị Cả)
    {
        speaker: 'oanh',
        text: 'Em Uyên ơi, con bé Mai Anh nó lại để quên giẻ lau trong máy xông kìa!'
    },
    {
        speaker: 'oanh',
        text: 'Chị thấy em Phương Anh dạo này nhập kem dưỡng xịn quá, chị em mình xin test thử đi!'
    },
    {
        speaker: 'oanh',
        text: 'Con bé Vy lại bấm điện thoại lướt TikTok rồi, khéo chị méch em Phương Anh phạt trừ lương!'
    },
    {
        speaker: 'oanh',
        text: 'Uyên ơi, hồi nãy khách khen tay nghề massage của chị với em làm êm ru kìa!'
    },
    {
        speaker: 'oanh',
        text: 'Con bé Mai Anh út ít mà lanh chanh ghê, dọn giường nhanh hơn cả con bé Vy!'
    },
    {
        speaker: 'oanh',
        text: 'Chị vừa làm xong cho khách VIP, khách khen spa của em Phương Anh dịch vụ đỉnh số 1!'
    },
    {
        speaker: 'oanh',
        text: 'Mấy đứa nhỏ nghe chị dặn nè, làm mặt cho khách nhớ nhẹ tay kẻo khách đau nha!'
    },

    // UYÊN (Lớn thứ 2 - Chị Hai)
    {
        speaker: 'uyen',
        text: 'Chị Oanh ơi, chị thấy bộ móng mới của em làm hợp phong thủy tiệm spa không?'
    },
    {
        speaker: 'uyen',
        text: 'Em Phương Anh quản lý tiệm giỏi ghê, khách ra vào nườm nượp chị Oanh ha!'
    },
    {
        speaker: 'uyen',
        text: 'Chị Oanh nói đúng đó, em thấy con Vy chuyên gia trốn vào toilet chốt đơn quần áo!'
    },
    {
        speaker: 'uyen',
        text: 'Em Mai Anh ơi, đem thêm khăn sạch tiệt trùng lại giường số 2 cho chị với!'
    },
    {
        speaker: 'uyen',
        text: 'Chị Oanh coi chừng giùm em nồi xông tinh dầu xíu nha, em đi rửa tay sát khuẩn!'
    },
    {
        speaker: 'uyen',
        text: 'Con Vy với con Mai Anh nhỏ tuổi hơn lo mà học hỏi tay nghề của chị Oanh với chị nè!'
    },
    {
        speaker: 'uyen',
        text: 'Em Phương Anh ơi, tí rảnh chị em mình đặt trà sữa ăn mừng doanh thu tăng nha!'
    },

    // VY (Lớn thứ 4)
    {
        speaker: 'vy',
        text: 'Chị Oanh với chị Uyên ơi, tí hết ca làm chị em mình đi ăn ốc vỉa hè nha!'
    },
    {
        speaker: 'vy',
        text: 'Em Mai Anh ơi, ra phụ chị đón khách VIP vừa bước vào quầy lễ tân nè!'
    },
    {
        speaker: 'vy',
        text: 'Chị Phương Anh ơi, có khách khen serum trắng da của tiệm mình dùng thích mê kìa!'
    },
    {
        speaker: 'vy',
        text: 'Chị Oanh chỉ em bài bấm huyệt thái dương hôm bữa với, tay chị Oanh bấm phê dã man!'
    },
    {
        speaker: 'vy',
        text: 'Chị Uyên đánh son màu cam đào này xinh xỉu, bữa nào cho em mượn test thử nha!'
    },
    {
        speaker: 'vy',
        text: 'Em Mai Anh út đừng có lén ăn vụng xoài lắc nha, chị méch chị Phương Anh đó!'
    },

    // MAI ANH (Nhỏ nhất - Em Út)
    {
        speaker: 'maianh',
        text: 'Dạ các chị ơi, em vừa hấp xong mẻ khăn sả chanh thơm phức cho cả tiệm rồi nè!'
    },
    {
        speaker: 'maianh',
        text: 'Chị Oanh, chị Uyên ơi, tí uống trà sữa em út xin phép mời các chị một ly nha!'
    },
    {
        speaker: 'maianh',
        text: 'Chị Phương Anh ơi, em vừa lau dọn sạch bong 4 giường spa sẵn sàng đón khách rồi ạ!'
    },
    {
        speaker: 'maianh',
        text: 'Chị Vy ơi, khách quầy trước hỏi mua thêm hũ kem khóa ẩm Fox Pure Glow kìa chị!'
    },
    {
        speaker: 'maianh',
        text: 'Em út trong tiệm nên mấy việc dọn dẹp nặng nhọc các chị cứ để em lo hết cho!'
    },
    {
        speaker: 'maianh',
        text: 'Chị Oanh massage đỉnh thật sự, em đứng nhìn mà học lỏm được bao nhiêu chiêu!'
    }
];

// 3D Procedural Character Animator (Smooth Lifelike Gestures without Rigidity)
if (typeof window.Character3DAnimator === 'undefined') {
    window.Character3DAnimator = class Character3DAnimator {
        constructor(isPlayer = false) {
            this.isPlayer = isPlayer;
            this.time = Math.random() * 20;
            this.stridePhase = Math.random() * Math.PI * 2;
            this.currentTiltX = 0;
            this.currentTiltZ = 0;
            this.currentTurnBank = 0;
        }

        animate(container, model, delta, isMoving, speed, state, isSpeaking) {
            if (!container && !model) return;
            this.time += delta;
            const target = container || model;

            if (isMoving) {
                // Locomotion: Dynamic Stride, Lean & Hip Sway
                const cadence = Math.max(7.5, speed * 1.6);
                this.stridePhase += delta * cadence;

                // Feet step bounce
                const bounce = Math.abs(Math.sin(this.stridePhase)) * 0.085;
                target.position.y = bounce;

                // Forward momentum tilt
                const targetTiltX = Math.min(0.20, speed * 0.045);
                this.currentTiltX += (targetTiltX - this.currentTiltX) * 0.2;
                target.rotation.x = this.currentTiltX;

                // Alternating hip sway
                const sway = Math.sin(this.stridePhase) * 0.055;
                this.currentTiltZ += (sway - this.currentTiltZ) * 0.25;
                target.rotation.z = this.currentTiltZ;

                // Subtle running stretch
                if (model) {
                    model.scale.y = 1 + Math.sin(this.stridePhase * 2) * 0.02;
                }
            } else {
                // Smoothly ease back from locomotion tilt
                this.currentTiltX += (0 - this.currentTiltX) * 0.15;
                this.currentTiltZ += (0 - this.currentTiltZ) * 0.15;

                if (state === 'GOSSIPING' || isSpeaking) {
                    // Lively conversational gestures: Nodding, tilting, giggling bounce
                    const nod = Math.sin(this.time * 4.5) * 0.065;
                    const headTilt = Math.sin(this.time * 2.8) * 0.055;
                    const laughBounce = Math.max(0, Math.sin(this.time * 6.0)) * 0.045;

                    target.position.y = laughBounce;
                    target.rotation.x = this.currentTiltX + nod;
                    target.rotation.z = this.currentTiltZ + headTilt;

                    if (model) {
                        model.scale.y = 1 + Math.sin(this.time * 4.5) * 0.015;
                    }
                } else if (state === 'WORKING_AT_BED') {
                    // Facial & Massage Service: Leaning over bed with rhythmic hand pressing cadence
                    const workLean = 0.26;
                    const massageCadence = Math.sin(this.time * 4.5) * 0.035;
                    const massageRock = Math.sin(this.time * 4.5) * 0.04;

                    target.position.y = Math.abs(massageCadence);
                    target.rotation.x = workLean + massageCadence * 0.5;
                    target.rotation.z = massageRock;

                    if (model) {
                        model.scale.y = 1 + Math.sin(this.time * 4.5) * 0.02;
                    }
                } else if (state === 'CLEANING_BED') {
                    // Changing bedsheets & tidying: rhythmic smoothing motions
                    const cleanLean = 0.22;
                    const tuck = Math.sin(this.time * 5.0) * 0.045;
                    const tuckRoll = Math.sin(this.time * 5.0) * 0.05;

                    target.position.y = Math.abs(tuck);
                    target.rotation.x = cleanLean + tuck * 0.6;
                    target.rotation.z = tuckRoll;
                } else if (state === 'CLEANING_POOP') {
                    // Mopping floor: deep scrub lean and sweeping rotation
                    const mopLean = 0.24;
                    const mopSweep = Math.sin(this.time * 6.0) * 0.32;
                    const mopThrust = Math.sin(this.time * 6.0) * 0.06;

                    target.position.y = Math.abs(mopThrust);
                    target.rotation.x = mopLean + mopThrust;
                    target.rotation.y = (target.baseModelRotY || 0) + mopSweep;
                    target.rotation.z = Math.sin(this.time * 6.0) * 0.045;
                } else {
                    // Idle breathing & relaxed weight balance
                    const breath = Math.sin(this.time * 2.2) * 0.018;
                    const shift = Math.sin(this.time * 1.1) * 0.022;

                    target.position.y = breath;
                    target.rotation.x = this.currentTiltX + breath * 0.4;
                    target.rotation.z = this.currentTiltZ + shift;
                    target.rotation.y = (target.baseModelRotY || 0);

                    if (model) {
                        model.scale.y = 1 - Math.sin(this.time * 2.2) * 0.01;
                    }
                }
            }
        }
    };
}

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

        // 4 Dedicated In-World Staff Members: Uyên, Oanh, Vy, Mai Anh
        this.staffMembers = [];
        this.gossipTimer = 3.5;
        this.poopMesses = [];

        // Legacy Staff Flags for compatibility
        this.hiredStaff = {
            receptionist: true,
            technician: true
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
        this.createStaffMembers();
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

    createWoodParquetTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#C29B72';
        ctx.fillRect(0, 0, 512, 512);

        const plankW = 64;
        const plankH = 16;
        for (let y = 0; y < 512; y += plankH) {
            for (let x = 0; x < 512; x += plankW) {
                const offset = (Math.floor(y / plankH) % 2) * (plankW / 2);
                const px = (x + offset) % 512;
                const shade = ((px * 13 + y * 7) % 25) - 12;
                ctx.fillStyle = `rgb(${194 + shade}, ${155 + shade}, ${114 + Math.floor(shade * 0.8)})`;
                ctx.fillRect(px, y, plankW - 1, plankH - 1);
                ctx.strokeStyle = 'rgba(60, 40, 20, 0.12)';
                ctx.lineWidth = 1;
                ctx.strokeRect(px, y, plankW - 1, plankH - 1);
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(10, 8);
        return tex;
    }

    createPrivacyPartition(x, y, z, parent) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const frameMat = new THREE.MeshLambertMaterial({ color: 0x5D4037 });
        const slatMat = new THREE.MeshLambertMaterial({ color: 0x8D6E63 });

        // Outer Frame
        const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.08, 0.08), frameMat);
        frameBottom.position.y = 0.04;
        group.add(frameBottom);

        const frameTop = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.08, 0.08), frameMat);
        frameTop.position.y = 2.2;
        group.add(frameTop);

        // Vertical Slats (Louver wood design)
        for (let i = 0; i < 9; i++) {
            const slat = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.1, 0.06), slatMat);
            slat.position.set(-1.0 + i * 0.25, 1.12, 0);
            slat.rotation.y = Math.PI / 6;
            group.add(slat);
        }

        parent.add(group);
    }

    createAromaDiffuser(x, y, z, parent) {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        // Small wooden stand
        const stand = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.25, 0.8, 12),
            new THREE.MeshLambertMaterial({ color: 0x4A3728 })
        );
        stand.position.y = 0.4;
        group.add(stand);

        // Ceramic diffuser base
        const diffuser = new THREE.Mesh(
            new THREE.ConeGeometry(0.16, 0.35, 12),
            new THREE.MeshLambertMaterial({ color: 0xFFFAF0, emissive: 0xF25C2B, emissiveIntensity: 0.2 })
        );
        diffuser.position.y = 0.95;
        group.add(diffuser);

        parent.add(group);
    }

    createNeonSign(x, y, z, text, parent) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFB703';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#F25C2B';
        ctx.shadowBlur = 15;
        ctx.fillText(text, 512, 70);

        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 0.75), mat);
        mesh.position.set(x, y, z);
        parent.add(mesh);
    }

    buildStore3D() {
        const storeGroup = new THREE.Group();

        // 1. Floor: Luxury Herringbone Wood Parquet Flooring
        const floorGeo = new THREE.BoxGeometry(20, 0.4, 16);
        const floorTex = this.createWoodParquetTexture();
        const floorMat = new THREE.MeshLambertMaterial({ map: floorTex });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.y = -0.2;
        floor.receiveShadow = true;
        storeGroup.add(floor);

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

        // Luxury Spa Wall Neon Art
        this.createNeonSign(0, 2.3, -7.78, '✨ Stay Glowing • FaceWashFox Luxury Spa ✨', storeGroup);

        // 4. Reception Desk (Quầy Lễ Tân)
        this.createReceptionDesk(-4.5, 0, 3, storeGroup);

        // 5. Treatment Beds Zone: EXACTLY 4 Luxury Spa Beds (2 columns x 2 rows)
        this.createTreatmentBed(2.5, 0, -3.2, 1, storeGroup);
        this.createTreatmentBed(2.5, 0, 1.8, 2, storeGroup);
        this.createTreatmentBed(6.8, 0, -3.2, 3, storeGroup);
        this.createTreatmentBed(6.8, 0, 1.8, 4, storeGroup);

        // Wooden Privacy Partitions between beds
        this.createPrivacyPartition(2.5, 0, -0.7, storeGroup);
        this.createPrivacyPartition(6.8, 0, -0.7, storeGroup);

        // Aromatherapy Diffusers with relaxing vibe
        this.createAromaDiffuser(0.5, 0, -3.2, storeGroup);
        this.createAromaDiffuser(0.5, 0, 1.8, storeGroup);

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

        // Underbed warm LED glow
        const glowGeo = new THREE.PlaneGeometry(2.6, 1.4);
        const glowMat = new THREE.MeshBasicMaterial({ color: 0xFFB703, transparent: true, opacity: 0.18 });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.rotation.x = -Math.PI / 2;
        glow.position.y = 0.02;
        bedGroup.add(glow);

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
            servingStaff: null,
            cleaningStaff: null,
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

    createStaffMembers() {
        // Hierarchy: OANH > UYÊN > (PHƯƠNG ANH) > VY > MAI ANH
        this.staffMembers = [
            {
                id: 'oanh',
                name: 'Oanh',
                role: 'technician',
                badgeName: 'Oanh',
                outfitColor: 0xF43F5E, // Rose Pink
                hairColor: 0x18181B,   // Sleek Black
                homePos: new THREE.Vector3(-1.8, 0, -3.5),
                pos: new THREE.Vector3(-1.8, 0, -3.5),
                state: 'IDLE',
                targetPos: new THREE.Vector3(-1.8, 0, -3.5),
                currentAction: 'Đang rảnh',
                speechText: '',
                speechTimer: 0,
                workTimer: 0
            },
            {
                id: 'uyen',
                name: 'Uyên',
                role: 'technician',
                badgeName: 'Uyên',
                outfitColor: 0x10B981, // Mint Emerald
                hairColor: 0x3E2723,   // Dark Brunette
                homePos: new THREE.Vector3(-2.8, 0, -3.2),
                pos: new THREE.Vector3(-2.8, 0, -3.2),
                state: 'IDLE',
                targetPos: new THREE.Vector3(-2.8, 0, -3.2),
                currentAction: 'Đang rảnh',
                speechText: '',
                speechTimer: 0,
                workTimer: 0
            },
            {
                id: 'vy',
                name: 'Vy',
                role: 'receptionist',
                badgeName: 'Vy',
                outfitColor: 0x8B5CF6, // Lavender Violet
                hairColor: 0x78350F,   // Chestnut Brown
                homePos: new THREE.Vector3(-4.5, 0, 1.8),
                pos: new THREE.Vector3(-4.5, 0, 1.8),
                state: 'IDLE',
                targetPos: new THREE.Vector3(-4.5, 0, 1.8),
                currentAction: 'Trực quầy lễ tân',
                speechText: '',
                speechTimer: 0,
                workTimer: 0
            },
            {
                id: 'maianh',
                name: 'Mai Anh',
                role: 'technician',
                badgeName: 'Mai Anh',
                outfitColor: 0xF59E0B, // Golden Amber
                hairColor: 0x0F172A,   // Dark Navy
                homePos: new THREE.Vector3(-2.2, 0, -4.2),
                pos: new THREE.Vector3(-2.2, 0, -4.2),
                state: 'IDLE',
                targetPos: new THREE.Vector3(-2.2, 0, -4.2),
                currentAction: 'Đang rảnh',
                speechText: '',
                speechTimer: 0,
                workTimer: 0
            }
        ];

        this.staffMembers.forEach(staff => {
            const group = new THREE.Group();
            group.position.copy(staff.pos);

            // Container for smooth procedural 3D animation transforms
            const modelContainer = new THREE.Group();
            group.add(modelContainer);
            staff.modelContainer = modelContainer;
            staff.animator = new Character3DAnimator(false);

            // Auto-load authentic GLB 3D Character Model from folder
            if (window.loadGLBCharacter) {
                window.loadGLBCharacter(staff.id, (readyModel) => {
                    if (staff.placeholder) {
                        modelContainer.remove(staff.placeholder);
                        staff.placeholder = null;
                    }
                    modelContainer.add(readyModel);
                    staff.customModel = readyModel;
                    if (staff.animator && staff.animator.initProps) {
                        staff.animator.initProps(modelContainer);
                    }
                });
            }

            // 3D Overhead Billboard Canvas: Clean Name (without titles), Status & Dynamic Speech Bubble
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 200;
            const tex = new THREE.CanvasTexture(canvas);
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
            sprite.scale.set(3.2, 1.25, 1);
            sprite.position.set(0, 2.5, 0);
            group.add(sprite);

            staff.group = group;
            staff.armLeft = armLeft;
            staff.armRight = armRight;
            staff.badgeCanvas = canvas;
            staff.badgeTex = tex;
            staff.badgeSprite = sprite;

            staff.updateBadge = function() {
                const ctx = this.badgeCanvas.getContext('2d');
                ctx.clearRect(0, 0, 512, 200);

                // Speech Bubble when speaking
                if (this.speechText && this.speechTimer > 0) {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.strokeStyle = '#F25C2B';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.roundRect ? ctx.roundRect(16, 10, 480, 80, 16) : ctx.fillRect(16, 10, 480, 80);
                    ctx.fill();
                    ctx.stroke();

                    // Pointer down
                    ctx.beginPath();
                    ctx.moveTo(240, 90);
                    ctx.lineTo(256, 104);
                    ctx.lineTo(272, 90);
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#1E293B';
                    ctx.font = 'bold 21px "Plus Jakarta Sans", sans-serif';
                    ctx.textAlign = 'center';
                    const displayTxt = this.speechText.length > 34 ? this.speechText.substring(0, 32) + '...' : this.speechText;
                    ctx.fillText(displayTxt, 256, 54);
                }

                // Clean Name Pill (Pure character name: Oanh, Uyên, Vy, Mai Anh)
                const pillY = 110;
                ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
                ctx.beginPath();
                ctx.roundRect ? ctx.roundRect(84, pillY, 344, 76, 20) : ctx.fillRect(84, pillY, 344, 76);
                ctx.fill();
                ctx.strokeStyle = staff.outfitColor ? '#' + staff.outfitColor.toString(16).padStart(6, '0') : '#F25C2B';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                ctx.fillStyle = '#FFFFFF';
                ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(this.badgeName, 256, pillY + 36);

                ctx.fillStyle = '#94A3B8';
                ctx.font = '600 19px "Plus Jakarta Sans", sans-serif';
                ctx.fillText(this.currentAction, 256, pillY + 64);

                this.badgeTex.needsUpdate = true;
            };

            staff.speak = (text, duration = 5.5) => {
                staff.speechText = text;
                staff.speechTimer = duration;
                staff.updateBadge();

                // Show Large High-Contrast Mobile Dialogue Subtitle
                const avatarMap = {
                    oanh: { avatar: '🌸', role: 'Chị Cả (Kỹ thuật viên)', color: '#F43F5E' },
                    uyen: { avatar: '🌿', role: 'Chị Hai (Kỹ thuật viên)', color: '#10B981' },
                    vy: { avatar: '💜', role: 'Lễ Tân Spa', color: '#8B5CF6' },
                    maianh: { avatar: '🦈', role: 'Bé Út (Kỹ thuật viên)', color: '#F59E0B' }
                };
                const meta = avatarMap[staff.id] || { avatar: '💬', role: 'Nhân viên', color: '#F25C2B' };
                this.showDialogueSubtitle(staff.badgeName, meta.role, text, meta.avatar, meta.color, duration);
            };

            staff.updateBadge();
            this.scene.add(group);
        });
    }

    createPoopMess(pos) {
        const group = new THREE.Group();
        group.position.copy(pos);

        // Multi-layer 3D swirl
        const poopMat = new THREE.MeshLambertMaterial({ color: 0x5D3A1A });

        const b1 = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.12, 8, 16), poopMat);
        b1.rotation.x = Math.PI / 2;
        b1.position.y = 0.1;
        group.add(b1);

        const b2 = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.09, 8, 16), poopMat);
        b2.rotation.x = Math.PI / 2;
        b2.position.y = 0.22;
        group.add(b2);

        const b3 = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.16, 8), poopMat);
        b3.position.y = 0.35;
        group.add(b3);

        // Stink Billboard
        const canvas = document.createElement('canvas');
        canvas.width = 380;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(120, 53, 15, 0.95)';
        ctx.roundRect ? ctx.roundRect(10, 10, 360, 100, 20) : ctx.fillRect(10, 10, 360, 100);
        ctx.fill();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#FEF3C7';
        ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💩 Bãi ỉa bốc mùi! [E] Dọn', 190, 68);

        const tex = new THREE.CanvasTexture(canvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
        sprite.scale.set(2.4, 0.8, 1);
        sprite.position.set(0, 1.3, 0);
        group.add(sprite);

        this.scene.add(group);

        const poopObj = {
            group: group,
            pos: pos.clone(),
            assignedStaff: null,
            stinkTimer: 0
        };

        this.poopMesses.push(poopObj);
    }

    cleanPoopMess(poopObj) {
        if (!poopObj) return;

        window.spaAudio.playMop();
        window.spaAudio.playChime();

        const sparklePos = poopObj.pos.clone();
        sparklePos.y += 0.5;
        this.spawnSpaParticles(sparklePos, 'poop_clean');
        this.spawnSpaParticles(sparklePos, 'splash');
        this.spawnSpaParticles(sparklePos, 'sparkle');
        this.spawnSpaParticles(sparklePos, 'foam');

        this.scene.remove(poopObj.group);
        const idx = this.poopMesses.indexOf(poopObj);
        if (idx !== -1) {
            this.poopMesses.splice(idx, 1);
        }

        this.money += 50000;
        this.updateHUD();
        this.showToast('✨ Sàn nhà đã được lau sạch bong kin kít! +50.000đ Phí vệ sinh 🧼');
    }

    updatePoopMesses(delta) {
        if (!this.poopMesses || this.poopMesses.length === 0) return;

        this.poopMesses.forEach(p => {
            p.stinkTimer = (p.stinkTimer || 0) + delta;
            if (p.stinkTimer > 0.4) {
                p.stinkTimer = 0;
                const puffPos = p.pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.3, (Math.random() - 0.5) * 0.4));
                this.spawnSpaParticles(puffPos, 'mask');
            }
        });
    }

    showDramaAlert(icon, text, duration = 4500) {
        const alertEl = document.getElementById('drama-alert');
        const iconEl = document.getElementById('drama-alert-icon');
        const textEl = document.getElementById('drama-alert-text');
        if (!alertEl) return;
        if (iconEl) iconEl.innerText = icon;
        if (textEl) textEl.innerText = text;
        alertEl.style.display = 'flex';
        clearTimeout(this.dramaAlertTimeout);
        this.dramaAlertTimeout = setTimeout(() => {
            alertEl.style.display = 'none';
        }, duration);
    }

    // High-Contrast Large Mobile Subtitle Box (Readable on any phone screen)
    showDialogueSubtitle(speakerName, speakerRole, text, avatarEmoji = '💬', colorHex = '#F25C2B', duration = 5.5) {
        const box = document.getElementById('dialogue-box');
        const nameEl = document.getElementById('dialogue-speaker-name');
        const roleEl = document.getElementById('dialogue-speaker-role');
        const textEl = document.getElementById('dialogue-text');
        const avatarEl = document.getElementById('dialogue-avatar');
        const wrapperEl = document.getElementById('dialogue-avatar-wrapper');

        if (!box || !nameEl || !textEl) return;

        nameEl.innerText = speakerName;
        if (roleEl) roleEl.innerText = speakerRole || '';
        textEl.innerText = `"${text}"`;
        if (avatarEl) avatarEl.innerText = avatarEmoji || '💬';
        if (wrapperEl) wrapperEl.style.borderColor = colorHex;
        box.style.borderColor = colorHex;
        box.style.boxShadow = `0 16px 45px rgba(0, 0, 0, 0.65), 0 0 25px ${colorHex}55`;

        box.style.display = 'flex';
        clearTimeout(this.dialogueTimeout);
        this.dialogueTimeout = setTimeout(() => {
            box.style.display = 'none';
        }, duration * 1000);
    }



    createPlayer() {
        const group = new THREE.Group();
        group.position.set(0, 0, 5);

        // Inner model container for animations & rotation offset
        const modelContainer = new THREE.Group();
        group.add(modelContainer);

        // Floating Name Badge: "Phương Anh" (No job prefix)
        const badgeCanvas = document.createElement('canvas');
        badgeCanvas.width = 300;
        badgeCanvas.height = 70;
        const bCtx = badgeCanvas.getContext('2d');
        bCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        bCtx.roundRect ? bCtx.roundRect(10, 8, 280, 54, 16) : bCtx.fillRect(10, 8, 280, 54);
        bCtx.fill();
        bCtx.strokeStyle = '#F25C2B';
        bCtx.lineWidth = 3.5;
        bCtx.stroke();
        bCtx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
        bCtx.fillStyle = '#1A1A1A';
        bCtx.textAlign = 'center';
        bCtx.fillText('Phương Anh', 150, 44);

        const bTexture = new THREE.CanvasTexture(badgeCanvas);
        const bSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: bTexture }));
        bSprite.scale.set(2.6, 0.62, 1);
        bSprite.position.y = 2.45;
        group.add(bSprite);

        // Auto-load authentic Makima GLB 3D Character Model from folder
        if (window.loadGLBCharacter) {
            window.loadGLBCharacter('phuonganh', (readyModel) => {
                if (this.playerPlaceholder) {
                    modelContainer.remove(this.playerPlaceholder);
                    this.playerPlaceholder = null;
                }
                modelContainer.add(readyModel);
                this.playerModel = readyModel;
                if (this.playerAnimator && this.playerAnimator.initProps) {
                    this.playerAnimator.initProps(modelContainer);
                }
            });
        }

        this.playerAnimator = new Character3DAnimator(true);
        this.player = {
            group: group,
            modelContainer: modelContainer,
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

    // 3D In-World Spa Particle & Action Effects System (Bubbly foam, sonic rings, soothing steam, sparkling serum, bio-light)
    spawnSpaParticles(pos, type) {
        if (!pos) return;

        // Specialized shockwave/ripple ring effect for sonic & splash
        if (type === 'sonic' || type === 'splash') {
            const ringGeo = new THREE.RingGeometry(0.08, 0.16, 24);
            const ringMat = new THREE.MeshBasicMaterial({
                color: type === 'sonic' ? 0x38BDF8 : 0x0EA5E9,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = -Math.PI / 2;
            ring.position.set(pos.x, pos.y + 0.05, pos.z);
            ring.velocity = new THREE.Vector3(0, 0.15, 0);
            ring.expandRate = 1.4;
            ring.life = 1.0;
            ring.maxLife = 0.65;
            this.scene.add(ring);
            this.particles.push(ring);
        }

        const count = type === 'foam' ? 14 : (type === 'sparkle' || type === 'biolight' ? 12 : 8);
        for (let i = 0; i < count; i++) {
            let geo;
            let mat;

            if (type === 'foam') {
                geo = new THREE.SphereGeometry(0.045 + Math.random() * 0.045, 8, 8);
                mat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.92 });
            } else if (type === 'steam') {
                geo = new THREE.SphereGeometry(0.06 + Math.random() * 0.07, 6, 6);
                mat = new THREE.MeshLambertMaterial({ color: 0xBAE6FD, transparent: true, opacity: 0.55 });
            } else if (type === 'sparkle' || type === 'sonic') {
                geo = new THREE.DodecahedronGeometry(0.048, 0);
                mat = new THREE.MeshLambertMaterial({ color: 0xFDE047, emissive: 0xF59E0B, emissiveIntensity: 0.75 });
            } else if (type === 'biolight') {
                const colors = [0x38BDF8, 0x818CF8, 0xF472B6, 0x4ADE80];
                const col = colors[Math.floor(Math.random() * colors.length)];
                geo = new THREE.DodecahedronGeometry(0.05, 0);
                mat = new THREE.MeshLambertMaterial({ color: col, emissive: col, emissiveIntensity: 0.85 });
            } else if (type === 'mask') {
                geo = new THREE.SphereGeometry(0.04 + Math.random() * 0.04, 6, 6);
                mat = new THREE.MeshLambertMaterial({ color: 0x84CC16, transparent: true, opacity: 0.85 });
            } else if (type === 'poop_clean') {
                // Sparkling clean burst when cleaning poop
                geo = new THREE.DodecahedronGeometry(0.055, 0);
                mat = new THREE.MeshLambertMaterial({ color: 0x38BDF8, emissive: 0x67E8F9, emissiveIntensity: 0.8 });
            } else {
                geo = new THREE.SphereGeometry(0.04 + Math.random() * 0.035, 8, 8);
                mat = new THREE.MeshLambertMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.85 });
            }

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(
                pos.x + (Math.random() - 0.5) * 0.5,
                pos.y + (Math.random() - 0.5) * 0.25,
                pos.z + (Math.random() - 0.5) * 0.5
            );
            mesh.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.45,
                0.55 + Math.random() * 0.75,
                (Math.random() - 0.5) * 0.45
            );
            mesh.life = 1.0;
            mesh.maxLife = 0.65 + Math.random() * 0.55;

            this.scene.add(mesh);
            this.particles.push(mesh);
        }
    }

    updateParticles(delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.position.addScaledVector(p.velocity, delta);
            p.life -= delta / p.maxLife;

            // Expand rings
            if (p.expandRate) {
                p.scale.x += p.expandRate * delta;
                p.scale.y += p.expandRate * delta;
            }

            if (p.material && p.material.opacity !== undefined) {
                p.material.opacity = Math.max(0, p.life * (p.expandRate ? 0.9 : 1.0));
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

        // 2. Poop Mess: Mop and clean floor
        if (target.type === 'poop') {
            this.cleanPoopMess(target.poop);
            return;
        }

        // 3. Spa Bed: Clean dirty bed OR Start/Advance step
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

        // 4. Retail Shelf: Restock cosmetic items
        if (target.type === 'retail') {
            this.restockShelves();
            return;
        }

        // 5. Storage Cabinet: Take towels or check stock
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
        if (!customer) return;

        // Hide bottom HUD
        const hud = document.getElementById('treatment-hud');
        if (hud) hud.style.display = 'none';

        if (this.activeTreatmentBed === targetBed) {
            this.activeTreatmentBed = null;
        }

        // 3 Post-treatment Outcomes: Poop on Floor (~20%), Angry Scold (~25%), Happy Customer (~55%)
        const rand = Math.random();
        if (rand < 0.20) {
            this.triggerCustomerPoopEvent(customer, targetBed);
        } else if (rand < 0.45) {
            this.triggerCustomerScoldEvent(customer, targetBed);
        } else {
            this.triggerCustomerHappyEvent(customer, targetBed);
        }
    }

    triggerCustomerPoopEvent(customer, bed) {
        if (!customer) return;

        window.spaAudio.playFart();

        // Big Dramatic Alert
        this.showDramaAlert('🚨', 'BÁO ĐỘNG: KHÁCH ĐI ỈA ĐÙN RA SÀN SPA! HÔI QUÁ! 💩', 5000);
        this.showToast(`🤢 ${customer.name}: "Ui da cái bụng tao... Hết chịu nổi rồi... PHỤT...!!!"`, 'poop');
        this.showDialogueSubtitle(customer.name, 'Khách hàng (Đau bụng)', 'Ui da cái bụng tao... Hết chịu nổi rồi... PHỤT...!!! 💩', '🤢', '#F59E0B', 6.0);

        // Spawn 3D Poop Mesh on floor
        const poopPos = bed.position.clone().add(new THREE.Vector3(-0.6, 0, 1.2));
        this.createPoopMess(poopPos);

        // Customer sprints out in utter humiliation
        customer.state = 'LEAVING';
        customer.group.rotation.set(0, 0, 0);
        customer.targetPos.set(0, 0, 16);
        customer.speedMultiplier = 2.4; // Running in sheer panic
        this.showToast(`🏃💨 ${customer.name}: "Trời đất ơi quê chết mất!! Chạy nhanh kẻo người ta thấy!!"`, 'poop');

        // Customer drops partial bill in rush
        const fee = Math.floor((customer.price || 199000) * 0.5);
        this.money += fee;
        this.totalCustomersServed++;
        this.updateHUD();

        // Bed marked dirty
        bed.state = 'DIRTY';
        bed.assignedCustomer = null;
        bed.servingStaff = null;
        bed.updateBadge();
    }

    triggerCustomerScoldEvent(customer, bed) {
        if (!customer) return;

        window.spaAudio.playAngry();

        const complaints = [
            'Làm ăn như hạch! Nặn mụn đau như bóp chết người ta vậy trời?!',
            'Tay nhân viên nồng nặc mùi mắm tôm thế này mà đòi làm spa cao cấp à?!',
            'Mặt tao đang yên lành vô đây làm xong sưng vù! Tao cho 1 sao tẩy chay!',
            'Chủ Phương Anh đâu ra đây! Đổi đứa khác làm chứ con bé này vụng về quá!'
        ];
        const complaint = complaints[Math.floor(Math.random() * complaints.length)];

        this.showDramaAlert('🤬', `KHÁCH CHỬI BỚI: "${complaint}"`, 5000);
        this.showToast(`😡 ${customer.name}: "${complaint}"`, 'drama');
        this.showDialogueSubtitle(customer.name, 'Khách hàng chửi bới 💢', complaint, '🤬', '#EF4444', 6.0);

        // Rating drops
        this.rating = Math.max(3.5, this.rating - 0.2);

        // Nearby staff reacts in distress according to age hierarchy
        const staff = this.staffMembers.find(s => s.assignedTarget === bed || s.state === 'IDLE');
        if (staff) {
            let scoldReact = 'Hu hu khách gì mà dữ như bà chằn lửa vậy trời! 😭';
            if (staff.id === 'oanh') {
                scoldReact = 'Quý khách bớt giận, để chị Oanh kiểm tra và chăm sóc lại cho mình ngay ạ!';
            } else if (staff.id === 'uyen') {
                scoldReact = 'Khách gì dữ như bà chằn lửa vậy chị Oanh, làm em hết hồn chim én luôn!';
            } else if (staff.id === 'vy') {
                scoldReact = 'Hu hu khách mắng to quá làm em đứng quầy run hết cả tay chị Phương Anh ơi!';
            } else if (staff.id === 'maianh') {
                scoldReact = 'Em sợ quá các chị ơi, may mà có chị Oanh với chị Phương Anh đứng ra giải quyết!';
            }
            staff.speak(scoldReact, 4.5);
        }

        // Customer leaves angrily without tip
        this.money += customer.price || 199000;
        this.totalCustomersServed++;
        this.updateHUD();

        customer.state = 'LEAVING';
        customer.group.rotation.set(0, 0, 0);
        customer.targetPos.set(0, 0, 16);

        bed.state = 'DIRTY';
        bed.assignedCustomer = null;
        bed.servingStaff = null;
        bed.updateBadge();
    }

    triggerCustomerHappyEvent(customer, bed) {
        if (!customer) return;

        const fee = customer.price || 199000;
        const tip = customer.tip || 35000;
        this.money += fee + tip;
        this.totalCustomersServed++;
        this.rating = Math.min(5.0, (this.rating * 9 + 5.0) / 10);

        window.spaAudio.playCash();
        if (window.confetti) window.confetti({ particleCount: 70, spread: 70 });

        this.showToast(`✨ ${customer.name}: "Da mặt căng bóng thích quá! Cảm ơn spa Phương Anh nha! ⭐⭐⭐⭐⭐" (+${(fee + tip).toLocaleString()}đ)`);
        this.showDialogueSubtitle(customer.name, 'Khách hàng hài lòng ⭐⭐⭐⭐⭐', 'Da mặt căng bóng thích quá! Cảm ơn spa Phương Anh nha! 💖', '🥰', '#10B981', 5.5);

        customer.state = 'LEAVING';
        customer.group.rotation.set(0, 0, 0);
        customer.targetPos.set(0, 0, 16);

        bed.state = 'DIRTY';
        bed.assignedCustomer = null;
        bed.servingStaff = null;
        bed.updateBadge();
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
        if (this.customers.length >= 7) return;

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

        const names = ['Chị Linh', 'Anh Hoàng', 'Bảo Ngọc', 'Minh Anh', 'Khánh Vy', 'Quỳnh Trang', 'Thu Hà', 'Đức Huy', 'Cô Mai', 'Chị Yến'];
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
            speedMultiplier: 1.0,
            state: 'ENTERING', // 'ENTERING', 'WAITING_AT_DESK', 'WALKING_TO_BED', 'ON_BED', 'LEAVING'
            targetPos: this.receptionZone.customerWaitPos.clone(),
            assignedBed: null,
            waitTimer: 45
        };

        this.customers.push(npc);
    }

    updateCustomers(delta) {
        for (let i = this.customers.length - 1; i >= 0; i--) {
            const c = this.customers[i];
            const dist = c.group.position.distanceTo(c.targetPos);

            if (dist > 0.3) {
                const dir = c.targetPos.clone().sub(c.group.position).normalize();
                const speed = 2.2 * (c.speedMultiplier || 1.0);
                c.group.position.addScaledVector(dir, speed * delta);
                c.group.rotation.y = Math.atan2(dir.x, dir.z);

                // Walking bobbing
                const bobFreq = c.speedMultiplier > 1.5 ? 0.025 : 0.01;
                c.group.position.y = Math.abs(Math.sin(Date.now() * bobFreq)) * 0.09;
            } else {
                c.group.position.y = 0;

                // State transition upon reaching destination
                if (c.state === 'ENTERING') {
                    c.state = 'WAITING_AT_DESK';
                    window.spaAudio.playBell();
                    this.showToast(`${c.name} đến quầy: Chọn gói "${c.packageName}"`);

                    // Vy or automatic receptionist check-in
                    const vy = this.staffMembers ? this.staffMembers.find(s => s.id === 'vy') : null;
                    if (vy) {
                        setTimeout(() => {
                            if (c.state === 'WAITING_AT_DESK') {
                                this.assignCustomerToBed(c);
                            }
                        }, 1000);
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

    updateStaff(delta) {
        if (!this.staffMembers || this.staffMembers.length === 0) return;

        // 1. Tick staff speech timers
        this.staffMembers.forEach(staff => {
            if (staff.speechTimer > 0) {
                staff.speechTimer -= delta;
                if (staff.speechTimer <= 0) {
                    staff.speechText = '';
                    staff.updateBadge();
                }
            }
        });

        // 2. Priority: Clean Poop Mess 💩 (Respecting Age Hierarchy)
        if (this.poopMesses && this.poopMesses.length > 0) {
            const unassignedPoop = this.poopMesses.find(p => !p.assignedStaff);
            if (unassignedPoop) {
                const freeStaff = this.staffMembers.find(s => s.state === 'IDLE' || s.state === 'GOSSIPING');
                if (freeStaff) {
                    unassignedPoop.assignedStaff = freeStaff;
                    freeStaff.state = 'CLEANING_POOP';
                    freeStaff.targetPos = unassignedPoop.pos.clone().add(new THREE.Vector3(0.5, 0, 0.4));
                    freeStaff.currentAction = 'Dọn bãi ỉa 💩🧹';
                    freeStaff.workTimer = 3.2;
                    freeStaff.assignedTarget = unassignedPoop;

                    let poopCry = 'Trời ơi ai vô ý thức vậy nè! Hôi quá!';
                    if (freeStaff.id === 'oanh') {
                        poopCry = 'Trời đất ơi! Khách nào vô ý thức vậy nè! Mấy đứa tránh ra để chị Oanh dọn cho sạch!';
                    } else if (freeStaff.id === 'uyen') {
                        poopCry = 'Kinh quá chị Oanh ơi! Khách làm bãi to tướng giữa sàn, để em phụ chị một tay!';
                    } else if (freeStaff.id === 'vy') {
                        poopCry = 'Eo ôi hôi chết mất! Em đứng quầy ngửi mà muốn xỉu, may có chị Oanh với chị Uyên!';
                    } else if (freeStaff.id === 'maianh') {
                        poopCry = 'Các chị để em! Em út để em xách cây lau sàn ra dọn sạch bong kin kít liền ạ!';
                    }
                    freeStaff.speak(poopCry, 4.2);
                    freeStaff.updateBadge();
                }
            }
        }

        // 3. Priority: Clean Dirty Beds
        const dirtyBed = this.beds.find(b => b.state === 'DIRTY' && !b.cleaningStaff);
        if (dirtyBed) {
            const freeStaff = this.staffMembers.find(s => (s.state === 'IDLE' || s.state === 'GOSSIPING') && s.role === 'technician');
            if (freeStaff) {
                dirtyBed.cleaningStaff = freeStaff;
                freeStaff.state = 'CLEANING_BED';
                freeStaff.targetPos = dirtyBed.staffWorkPos.clone();
                freeStaff.currentAction = `Dọn giường #${dirtyBed.id} 🧹`;
                freeStaff.workTimer = 2.0;
                freeStaff.assignedTarget = dirtyBed;
                freeStaff.updateBadge();
            }
        }

        // 4. Priority: Treat Customers at Beds
        const waitingBed = this.beds.find(b => (b.state === 'OCCUPIED_WAITING' || b.state === 'IN_SERVICE') && !b.servingStaff);
        if (waitingBed) {
            const freeStaff = this.staffMembers.find(s => (s.state === 'IDLE' || s.state === 'GOSSIPING') && s.role === 'technician');
            if (freeStaff) {
                waitingBed.servingStaff = freeStaff;
                freeStaff.state = 'WORKING_AT_BED';
                freeStaff.targetPos = waitingBed.staffWorkPos.clone();
                freeStaff.currentAction = `Làm đẹp giường #${waitingBed.id} ✨`;
                freeStaff.workTimer = 1.3;
                freeStaff.assignedTarget = waitingBed;
                freeStaff.updateBadge();
            }
        }

        // 5. Idle Staff: Gather & Gossip ("tụm 3 tụm 4 vào nói xấu nhau")
        // Strictly obeys Age Hierarchy: OANH > UYÊN > PHƯƠNG ANH > VY > MAI ANH
        const idleStaff = this.staffMembers.filter(s => s.state === 'IDLE' || s.state === 'GOSSIPING');
        const gossipSpot = new THREE.Vector3(-2.2, 0, -3.2);

        if (idleStaff.length >= 2) {
            idleStaff.forEach((staff, idx) => {
                const angle = (idx / idleStaff.length) * Math.PI * 2;
                const targetX = gossipSpot.x + Math.cos(angle) * 1.1;
                const targetZ = gossipSpot.z + Math.sin(angle) * 1.1;
                staff.targetPos.set(targetX, 0, targetZ);
                staff.state = 'GOSSIPING';
                staff.currentAction = 'Đang buôn dưa lê... 🤫';
            });

            this.gossipTimer = (this.gossipTimer || 3.5) - delta;
            if (this.gossipTimer <= 0) {
                this.gossipTimer = 3.8 + Math.random() * 2.0;
                const speaker = idleStaff[Math.floor(Math.random() * idleStaff.length)];
                const speakerLines = GOSSIP_DIALOGUES.filter(d => d.speaker === speaker.id);
                const gossipLine = (speakerLines.length > 0)
                    ? speakerLines[Math.floor(Math.random() * speakerLines.length)]
                    : GOSSIP_DIALOGUES[Math.floor(Math.random() * GOSSIP_DIALOGUES.length)];

                speaker.speak(gossipLine.text, 4.2);
                window.spaAudio.playGossip();
                this.showToast(`🤫 [${speaker.name} buôn chuyện]: "${gossipLine.text}"`, 'gossip');
            }
        } else if (idleStaff.length === 1) {
            const loneStaff = idleStaff[0];
            loneStaff.state = 'IDLE';
            loneStaff.targetPos.copy(loneStaff.homePos);
            loneStaff.currentAction = 'Đang trực spa';
        }

        // 6. Movement & 3D Procedural Animation Updates for all staff
        this.staffMembers.forEach(staff => {
            const dist = staff.group.position.distanceTo(staff.targetPos);
            const isMoving = dist > 0.25;

            if (isMoving) {
                const dir = staff.targetPos.clone().sub(staff.group.position).normalize();
                staff.group.position.addScaledVector(dir, 2.4 * delta);
                staff.group.rotation.y = Math.atan2(dir.x, dir.z);
            } else {
                if (staff.state === 'GOSSIPING') {
                    const faceDir = gossipSpot.clone().sub(staff.group.position);
                    staff.group.rotation.y = Math.atan2(faceDir.x, faceDir.z);
                } else if (staff.state === 'WORKING_AT_BED') {
                    const bed = staff.assignedTarget;
                    if (!bed || (bed.state !== 'OCCUPIED_WAITING' && bed.state !== 'IN_SERVICE') || !bed.assignedCustomer) {
                        staff.state = 'IDLE';
                        staff.assignedTarget = null;
                        if (bed) bed.servingStaff = null;
                        staff.currentAction = 'Đang rảnh';
                        staff.updateBadge();
                        return;
                    }

                    staff.group.rotation.y = -Math.PI / 2;

                    // Advance treatment progress
                    staff.workTimer -= delta;
                    if (staff.workTimer <= 0) {
                        staff.workTimer = 1.3;
                        this.advanceTreatmentStep(bed);
                    }
                } else if (staff.state === 'CLEANING_BED') {
                    const bed = staff.assignedTarget;
                    staff.workTimer -= delta;

                    if (staff.workTimer <= 0) {
                        if (bed) {
                            bed.state = 'EMPTY_CLEAN';
                            bed.cleaningStaff = null;
                            bed.updateBadge();
                        }
                        window.spaAudio.playPop();

                        let bedDone = 'Đã thay khăn sạch tiệt trùng!';
                        if (staff.id === 'oanh') bedDone = `Thay khăn sạch cho Giường #${bed ? bed.id : ''} xong rồi, em Phương Anh đón khách mới nha!`;
                        else if (staff.id === 'uyen') bedDone = `Giường #${bed ? bed.id : ''} tinh tươm rồi, chị Oanh ơi dắt khách mới vô đi chị!`;
                        else if (staff.id === 'vy') bedDone = `Em chuẩn bị giường gối #${bed ? bed.id : ''} sẵn sàng rồi các chị ơi!`;
                        else if (staff.id === 'maianh') bedDone = `Dạ em út vừa thay ga mới cho Giường #${bed ? bed.id : ''} thơm nức mũi luôn rồi ạ!`;

                        staff.speak(bedDone, 4.0);
                        staff.state = 'IDLE';
                        staff.assignedTarget = null;
                        staff.currentAction = 'Đang rảnh';
                        staff.updateBadge();
                    }
                } else if (staff.state === 'CLEANING_POOP') {
                    const poop = staff.assignedTarget;
                    staff.workTimer -= delta;

                    if (Math.random() < 0.08) window.spaAudio.playMop();

                    if (staff.workTimer <= 0) {
                        this.cleanPoopMess(poop);

                        let doneMsg = 'Lau sạch rồi!';
                        if (staff.id === 'oanh') doneMsg = 'Xong rồi! Sàn nhà lại thơm tho mùi sả chanh, mấy đứa cứ yên tâm làm việc nha!';
                        else if (staff.id === 'uyen') doneMsg = 'Hú hồn em lau sạch bong rồi chị Oanh ơi! Thơm phức trở lại rồi!';
                        else if (staff.id === 'vy') doneMsg = 'Cảm ơn các chị nha, sàn sạch rồi em tiếp tục đón khách đây ạ!';
                        else if (staff.id === 'maianh') doneMsg = 'Dạ em lau sạch kin kít bóng loáng rồi các chị ơi, không còn tí mùi nào luôn ạ!';

                        staff.speak(doneMsg, 4.0);
                        staff.state = 'IDLE';
                        staff.assignedTarget = null;
                        staff.currentAction = 'Đang rảnh';
                        staff.updateBadge();
                    }
                }
            }

            // Continuous smooth 3D procedural animator update
            const isSpeaking = staff.speechTimer > 0;
            if (staff.animator) {
                staff.animator.animate(
                    staff.modelContainer,
                    staff.customModel,
                    delta,
                    isMoving,
                    2.4,
                    staff.state,
                    isSpeaking
                );
            }
        });
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
        }

        // Apply smooth 3D procedural animator to Player (Walking tilt, bounce, sway & idle breathing)
        if (this.playerAnimator && this.player) {
            let playerAction = 'IDLE';
            if (this.activeTreatmentBed) playerAction = 'WORKING_AT_BED';
            this.playerAnimator.animate(
                this.player.modelContainer,
                this.playerModel,
                delta,
                isMoving,
                this.player.speed,
                playerAction,
                false
            );
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

        // Check Poop Messes on floor
        if (!foundTarget && this.poopMesses && this.poopMesses.length > 0) {
            for (const poop of this.poopMesses) {
                if (pPos.distanceTo(poop.pos) < 2.2) {
                    foundTarget = { type: 'poop', poop: poop, label: 'Lau dọn bãi ỉa 💩🧹 [E]' };
                    break;
                }
            }
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

    showToast(text, type = 'normal') {
        const el = document.createElement('div');
        el.className = 'floating-toast' + (type !== 'normal' ? ' ' + type : '');
        el.innerText = text;
        document.body.appendChild(el);

        const screenPos = this.player.group.position.clone();
        screenPos.y += 2.2;
        screenPos.project(this.camera);

        const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight;
        el.style.left = `${Math.max(20, Math.min(window.innerWidth - 120, x))}px`;
        el.style.top = `${Math.max(80, Math.min(window.innerHeight - 80, y))}px`;

        setTimeout(() => el.remove(), 2200);
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

        // Update staff status tags in phone
        if (this.staffMembers) {
            this.staffMembers.forEach(s => {
                const el = document.getElementById(`staff-status-${s.id}`);
                if (el) {
                    let label = '🟢 Đang trực ca';
                    if (s.state === 'GOSSIPING') label = '🤫 Đang buôn dưa lê';
                    else if (s.state === 'CLEANING_POOP') label = '💩 Đang dọn bãi ỉa';
                    else if (s.state === 'WORKING_AT_BED') label = `✨ Làm giường #${s.assignedTarget ? s.assignedTarget.id : ''}`;
                    else if (s.state === 'CLEANING_BED') label = `🧹 Dọn giường #${s.assignedTarget ? s.assignedTarget.id : ''}`;
                    el.innerText = label;
                }
            });
        }

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
                this.gameTimeHours = 8;
                this.day++;
                this.showToast(`🎉 KẾT THÚC NGÀY! BẮT ĐẦU NGÀY KINH DOANH THỨ ${this.day}`);
            }
        }

        // Spawn Customer AI periodically
        this.customerSpawnTimer -= delta;
        if (this.customerSpawnTimer <= 0) {
            this.customerSpawnTimer = 6 + Math.random() * 6;
            this.spawnCustomerNPC();
        }

        this.updatePlayerMovement(delta);
        this.updateCustomers(delta);
        this.updateStaff(delta);
        this.updatePoopMesses(delta);
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
