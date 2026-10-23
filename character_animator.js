// FaceWashFox Store Simulator - Character 3D Animation & Action Effects System
// Dedicated .js 3D Character Controller, Gestures, Props & Model Loader for Three.js

const CHARACTER_FOLDER_CONFIG = {
    phuonganh: {
        id: 'phuonganh',
        name: 'Phương Anh',
        folder: 'phuong anh',
        targetHeight: 2.05,
        primaryPath: 'phuong anh/source/ip-chainsaw-man__makima__real__sexy.glb',
        fallbackPath: 'models/phuong_anh.glb'
    },
    oanh: {
        id: 'oanh',
        name: 'Oanh',
        folder: 'oanh',
        targetHeight: 2.0,
        primaryPath: 'oanh/source/ip-roblox__roblox-girl-r63__concept__tpose.glb',
        fallbackPath: 'models/oanh.glb'
    },
    uyen: {
        id: 'uyen',
        name: 'Uyên',
        folder: 'uyên',
        targetHeight: 1.95,
        primaryPath: 'uyên/source/ip-touhou__reimu-hakurei__furry__sexy.glb',
        altPath: 'uyên/source/ip-touhou__reimu-hakurei__furry__sexy.glb',
        fallbackPath: 'models/uyen.glb'
    },
    vy: {
        id: 'vy',
        name: 'Vy',
        folder: 'vy',
        targetHeight: 2.1,
        primaryPath: 'vy/source/ip-undertale-deltarune__toriel__real__tpose.glb',
        fallbackPath: 'models/vy.glb'
    },
    maianh: {
        id: 'maianh',
        name: 'Mai Anh',
        folder: 'mai anh',
        targetHeight: 1.75,
        primaryPath: 'mai anh/source/ip-hololive-vtuber__gawr-gura__real__tpose.glb',
        fallbackPath: 'models/mai_anh.glb'
    }
};

// 3D Action Props Factory (Mop, Spa Ultrasonic Wand, Fresh Towels, Action Ring)
function createCharacterActionProps(container) {
    const props = {
        mop: null,
        wand: null,
        towels: null,
        ring: null
    };

    // 1. Action Floor Halo Ring (Pulsing glowing circle under feet during active action)
    const ringGeo = new THREE.RingGeometry(0.68, 0.82, 32);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x10B981,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.025;
    container.add(ring);
    props.ring = ring;

    // 2. 3D Spa Ultrasonic Facial Wand (Device with pulsing glowing tip)
    const wandGroup = new THREE.Group();
    // Wand handle (Pearl white + Rose gold ring)
    const handleGeo = new THREE.CylinderGeometry(0.028, 0.022, 0.38, 12);
    const handleMat = new THREE.MeshLambertMaterial({ color: 0xFFF5F0 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    wandGroup.add(handle);

    const metalRingGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12);
    const metalMat = new THREE.MeshLambertMaterial({ color: 0xF25C2B });
    const metalRing = new THREE.Mesh(metalRingGeo, metalMat);
    metalRing.position.y = 0.14;
    wandGroup.add(metalRing);

    // Glowing Ultrasonic Treatment Tip
    const tipGeo = new THREE.SphereGeometry(0.042, 12, 12);
    const tipMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.y = 0.22;
    wandGroup.add(tip);

    wandGroup.position.set(0.28, 0.95, 0.52);
    wandGroup.rotation.set(Math.PI / 3, 0, -Math.PI / 8);
    wandGroup.visible = false;
    container.add(wandGroup);
    props.wand = wandGroup;

    // 3. 3D Cleaning Mop (Wooden handle, blue clamp, white clean fiber head)
    const mopGroup = new THREE.Group();
    const poleGeo = new THREE.CylinderGeometry(0.022, 0.022, 1.45, 8);
    const poleMat = new THREE.MeshLambertMaterial({ color: 0xD4A373 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 0.72;
    mopGroup.add(pole);

    const clampGeo = new THREE.BoxGeometry(0.28, 0.06, 0.1);
    const clampMat = new THREE.MeshLambertMaterial({ color: 0x3B82F6 });
    const clamp = new THREE.Mesh(clampGeo, clampMat);
    clamp.position.y = 0.06;
    mopGroup.add(clamp);

    const headGeo = new THREE.BoxGeometry(0.36, 0.08, 0.18);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xF1F5F9 });
    const mopHead = new THREE.Mesh(headGeo, headMat);
    mopHead.position.y = 0.03;
    mopGroup.add(mopHead);

    mopGroup.position.set(0.18, 0.15, 0.45);
    mopGroup.rotation.set(-0.35, 0, 0.2);
    mopGroup.visible = false;
    container.add(mopGroup);
    props.mop = mopGroup;

    // 4. 3D Towel Stack (Clean folded spa towels for bed changing)
    const towelGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const towelGeo = new THREE.BoxGeometry(0.35, 0.06, 0.25);
        const towelMat = new THREE.MeshLambertMaterial({ color: i === 1 ? 0xF25C2B : 0xFFFFFF });
        const towel = new THREE.Mesh(towelGeo, towelMat);
        towel.position.y = i * 0.07;
        towelGroup.add(towel);
    }
    towelGroup.position.set(0.22, 0.85, 0.42);
    towelGroup.visible = false;
    container.add(towelGroup);
    props.towels = towelGroup;

    return props;
}

// Prepare & calibrate 3D GLB Model Mesh with correct scale, facing orientation, and authentic materials
function setupCharacter3DMesh(gltf, charId) {
    const model = gltf.scene;
    const config = CHARACTER_FOLDER_CONFIG[charId] || {};
    const targetHeight = config.targetHeight || 2.0;

    // Preserve original authentic PBR materials & textures from Tripo3D (DO NOT destroy normals)
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
                child.material.side = THREE.DoubleSide;
                child.material.needsUpdate = true;
            }
        }
    });

    // 1. Calculate bounding box & uniform scale based on character height
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const scale = targetHeight / (size.y || 2.0);
    model.scale.set(scale, scale, scale);

    // 2. Exact Forward Facing Orientation:
    // Raw Tripo3D models face +X, with arms outstretched along Z.
    // Rotating around Y by -Math.PI / 2 (-90°) points +X directly to +Z (towards camera & player)!
    model.rotation.y = -Math.PI / 2;

    // 3. Ground feet at Y = 0 and center horizontally
    const scaledBox = new THREE.Box3().setFromObject(model);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    model.position.x = -scaledCenter.x;
    model.position.y = -scaledBox.min.y;
    model.position.z = -scaledCenter.z;

    return model;
}

// Robust GLB Model Loader supporting custom character folders with spaces & unicode
function loadCharacterGLBFromFolder(charConfig, onLoaded, onError) {
    if (!window.THREE || !window.THREE.GLTFLoader) {
        if (onError) onError('THREE.GLTFLoader not available');
        return;
    }

    const loader = new THREE.GLTFLoader();
    const pathsToTry = [
        encodeURI(charConfig.primaryPath),
        charConfig.primaryPath
    ];

    if (charConfig.altPath) {
        pathsToTry.push(encodeURI(charConfig.altPath));
        pathsToTry.push(charConfig.altPath);
    }

    if (charConfig.fallbackPath) {
        pathsToTry.push(charConfig.fallbackPath);
    }

    function tryNext(index) {
        if (index >= pathsToTry.length) {
            if (onError) onError(`All paths failed for ${charConfig.name}`);
            return;
        }

        const currentPath = pathsToTry[index];
        loader.load(currentPath, (gltf) => {
            console.log(`✅ [3D .js] Đã tải model ${charConfig.name} thành công từ: ${currentPath}`);
            if (onLoaded) onLoaded(gltf, charConfig);
        }, undefined, (err) => {
            console.warn(`[3D .js] Thử tải thất bại từ: ${currentPath}, đang thử đường dẫn tiếp theo...`);
            tryNext(index + 1);
        });
    }

    tryNext(0);
}

// Global 3D Procedural Character Animator (Smooth Lifelike Gestures, Action Props & Visual Feedback)
class Character3DAnimator {
    constructor(isPlayer = false) {
        this.isPlayer = isPlayer;
        this.time = Math.random() * 20;
        this.stridePhase = Math.random() * Math.PI * 2;
        this.currentTiltX = 0;
        this.currentTiltZ = 0;
        this.actionProps = null;
    }

    initProps(container) {
        if (container && !this.actionProps) {
            this.actionProps = createCharacterActionProps(container);
        }
    }

    animate(container, model, delta, isMoving, speed, state, isSpeaking) {
        if (!container && !model) return;
        this.time += delta;
        const target = container || model;

        // Initialize action props if not ready
        if (container && !this.actionProps) {
            this.initProps(container);
        }

        const props = this.actionProps;

        // 1. Locomotion vs Stationary Actions
        if (isMoving) {
            // Hide all action props while walking
            if (props) {
                if (props.mop) props.mop.visible = false;
                if (props.wand) props.wand.visible = false;
                if (props.towels) props.towels.visible = false;
                if (props.ring) props.ring.material.opacity = 0;
            }

            // Locomotion: Dynamic Stride, Forward Lean & Hip Sway
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

            // Running stretch
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

                // Action ring: Warm yellow gossip halo
                if (props) {
                    if (props.mop) props.mop.visible = false;
                    if (props.wand) props.wand.visible = false;
                    if (props.towels) props.towels.visible = false;
                    if (props.ring) {
                        props.ring.material.color.setHex(0xFACC15);
                        props.ring.material.opacity = 0.5 + Math.sin(this.time * 5.0) * 0.25;
                    }
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

                // Show 3D Ultrasonic Facial Wand with glowing tip & green treatment ring
                if (props) {
                    if (props.mop) props.mop.visible = false;
                    if (props.towels) props.towels.visible = false;
                    if (props.wand) {
                        props.wand.visible = true;
                        props.wand.position.y = 0.95 + Math.sin(this.time * 4.5) * 0.05;
                        props.wand.rotation.x = Math.PI / 3 + Math.sin(this.time * 4.5) * 0.15;
                    }
                    if (props.ring) {
                        props.ring.material.color.setHex(0x10B981);
                        props.ring.material.opacity = 0.65 + Math.sin(this.time * 4.0) * 0.25;
                    }
                }
            } else if (state === 'CLEANING_BED') {
                // Changing bedsheets & tidying: rhythmic smoothing motions
                const cleanLean = 0.22;
                const tuck = Math.sin(this.time * 5.0) * 0.045;
                const tuckRoll = Math.sin(this.time * 5.0) * 0.05;

                target.position.y = Math.abs(tuck);
                target.rotation.x = cleanLean + tuck * 0.6;
                target.rotation.z = tuckRoll;

                // Show fresh towels stack & orange bed-tidying ring
                if (props) {
                    if (props.mop) props.mop.visible = false;
                    if (props.wand) props.wand.visible = false;
                    if (props.towels) {
                        props.towels.visible = true;
                        props.towels.position.y = 0.85 + Math.sin(this.time * 5.0) * 0.04;
                    }
                    if (props.ring) {
                        props.ring.material.color.setHex(0xF25C2B);
                        props.ring.material.opacity = 0.6 + Math.sin(this.time * 5.0) * 0.2;
                    }
                }
            } else if (state === 'CLEANING_POOP') {
                // Mopping floor: deep scrub lean and sweeping rotation
                const mopLean = 0.25;
                const mopSweep = Math.sin(this.time * 6.5) * 0.35;
                const mopThrust = Math.sin(this.time * 6.5) * 0.06;

                target.position.y = Math.abs(mopThrust);
                target.rotation.x = mopLean + mopThrust;
                target.rotation.z = Math.sin(this.time * 6.5) * 0.045;

                // Show 3D Mop sweeping vigorously & red-orange scrub ring
                if (props) {
                    if (props.wand) props.wand.visible = false;
                    if (props.towels) props.towels.visible = false;
                    if (props.mop) {
                        props.mop.visible = true;
                        props.mop.rotation.z = 0.2 + mopSweep * 0.8;
                        props.mop.position.x = 0.18 + Math.sin(this.time * 6.5) * 0.15;
                    }
                    if (props.ring) {
                        props.ring.material.color.setHex(0xEF4444);
                        props.ring.material.opacity = 0.75 + Math.sin(this.time * 6.5) * 0.25;
                    }
                }
            } else {
                // Idle breathing & relaxed weight balance
                const breath = Math.sin(this.time * 2.2) * 0.018;
                const shift = Math.sin(this.time * 1.1) * 0.022;

                target.position.y = breath;
                target.rotation.x = this.currentTiltX + breath * 0.4;
                target.rotation.z = this.currentTiltZ + shift;

                if (model) {
                    model.scale.y = 1 - Math.sin(this.time * 2.2) * 0.01;
                }

                // Hide all action props and ring in pure idle
                if (props) {
                    if (props.mop) props.mop.visible = false;
                    if (props.wand) props.wand.visible = false;
                    if (props.towels) props.towels.visible = false;
                    if (props.ring) props.ring.material.opacity = 0;
                }
            }
        }
    }
}

window.Character3DAnimator = Character3DAnimator;
window.CHARACTER_FOLDER_CONFIG = CHARACTER_FOLDER_CONFIG;
window.setupCharacter3DMesh = setupCharacter3DMesh;
window.loadCharacterGLBFromFolder = loadCharacterGLBFromFolder;
window.createCharacterActionProps = createCharacterActionProps;
