// FaceWashFox Store Simulator - Character 3D Animator & GLB Model Studio
// Loads and setups authentic 3D models matching each character folder:
// 1. Phương Anh (phuong anh): Makima (Chainsaw Man)
// 2. Oanh (oanh): Roblox Girl (Chị Cả)
// 3. Uyên (uyên): Reimu Hakurei (Chị Hai)
// 4. Vy (vy): Toriel (Bé Tư)
// 5. Mai Anh (mai anh): Gawr Gura (Bé Út)

const CHARACTER_MODELS_CONFIG = {
    phuonganh: {
        id: 'phuonganh',
        name: 'Phương Anh',
        modelPath: 'models/phuong_anh.vrm?v=2.8',
        altPath: 'phuong anh/6829995141512117749.vrm?v=2.8',
        targetHeight: 1.95,
        rotationY: 0
    },
    oanh: {
        id: 'oanh',
        name: 'Oanh (Chị Cả)',
        modelPath: 'models/nhanvien.vrm?v=staff_2',
        altPath: 'nhanvien.vrm',
        targetHeight: 1.95,
        rotationY: 0,
        hairColorHex: 0xF43F5E // Signature pink tint for Chị Cả
    },
    uyen: {
        id: 'uyen',
        name: 'Uyên (Chị Hai)',
        modelPath: 'models/nhanvien.vrm?v=staff_2',
        altPath: 'nhanvien.vrm',
        targetHeight: 1.90,
        rotationY: 0,
        hairColorHex: 0x10B981 // Signature jade green tint for Chị Hai
    },
    vy: {
        id: 'vy',
        name: 'Vy (Lễ Tân)',
        modelPath: 'models/nhanvien.vrm?v=staff_2',
        altPath: 'nhanvien.vrm',
        targetHeight: 1.92,
        rotationY: 0,
        hairColorHex: 0x8B5CF6 // Signature lavender purple tint for Vy
    },
    maianh: {
        id: 'maianh',
        name: 'Mai Anh (Bé Út)',
        modelPath: 'models/nhanvien.vrm?v=staff_2',
        altPath: 'nhanvien.vrm',
        targetHeight: 1.78,
        rotationY: 0,
        hairColorHex: 0xF59E0B // Signature amber gold tint for Bé Út
    }
};

// 3D Action Props Factory (Mop, Facial Wand, Towel Stack, Action Ring)
function createCharacterActionProps(container) {
    const props = {
        mop: null,
        wand: null,
        towels: null,
        ring: null
    };

    // 1. Action Floor Ring (Pulsing glowing circle under feet during active tasks)
    const ringGeo = new THREE.RingGeometry(0.70, 0.86, 32);
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

    // 2. 3D Ultrasonic Facial Wand (Device with pulsing glowing LED tip)
    const wandGroup = new THREE.Group();
    const handleGeo = new THREE.CylinderGeometry(0.028, 0.022, 0.38, 12);
    const handleMat = new THREE.MeshLambertMaterial({ color: 0xFFF5F0 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    wandGroup.add(handle);

    const metalRingGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.04, 12);
    const metalMat = new THREE.MeshLambertMaterial({ color: 0xF25C2B });
    const metalRing = new THREE.Mesh(metalRingGeo, metalMat);
    metalRing.position.y = 0.14;
    wandGroup.add(metalRing);

    const tipGeo = new THREE.SphereGeometry(0.046, 14, 14);
    const tipMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.y = 0.22;
    wandGroup.add(tip);

    wandGroup.position.set(0.28, 0.95, 0.48);
    wandGroup.rotation.set(Math.PI / 3, 0, -Math.PI / 8);
    wandGroup.visible = false;
    container.add(wandGroup);
    props.wand = wandGroup;

    // 3. 3D Cleaning Mop (Wooden handle, clamp, clean fiber head)
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

    const headGeo = new THREE.BoxGeometry(0.38, 0.08, 0.2);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xF1F5F9 });
    const mopHead = new THREE.Mesh(headGeo, headMat);
    mopHead.position.y = 0.03;
    mopGroup.add(mopHead);

    mopGroup.position.set(0.18, 0.15, 0.45);
    mopGroup.rotation.set(-0.35, 0, 0.2);
    mopGroup.visible = false;
    container.add(mopGroup);
    props.mop = mopGroup;

    // 4. 3D Towel Stack (Folded spa towels for bed changing)
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

// Relax T-Pose: deform arm vertices from horizontal T-pose down to natural relaxed pose
function relaxArmTPose(mesh) {
    if (!mesh || !mesh.geometry || !mesh.geometry.attributes.position) return;
    const pos = mesh.geometry.attributes.position;
    const array = pos.array;
    const count = pos.count;

    const y_sh = 0.35;
    const z_sh = 0.20;
    const blendDist = 0.12;
    const angle = 1.05; // ~60 degrees downwards

    for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const y = array[idx + 1];
        const z = array[idx + 2];

        // Left arm (z > z_sh)
        if (z > z_sh && y < 0.60 && y > -0.50) {
            const dz = z - z_sh;
            const dy = y - y_sh;
            let w = Math.min(1.0, Math.max(0.0, dz / blendDist));
            w = w * w * (3.0 - 2.0 * w); // smoothstep
            const a = angle * w;
            const ca = Math.cos(a);
            const sa = Math.sin(a);
            array[idx + 1] = y_sh + (dy * ca - dz * sa);
            array[idx + 2] = z_sh + (dy * sa + dz * ca);
        }
        // Right arm (z < -z_sh)
        else if (z < -z_sh && y < 0.60 && y > -0.50) {
            const dz = z - (-z_sh);
            const dy = y - y_sh;
            let w = Math.min(1.0, Math.max(0.0, -dz / blendDist));
            w = w * w * (3.0 - 2.0 * w); // smoothstep
            const a = angle * w;
            const ca = Math.cos(a);
            const sa = Math.sin(a);
            array[idx + 1] = y_sh + (dy * ca + dz * sa);
            array[idx + 2] = -z_sh + (-dy * sa + dz * ca);
        }
    }

    pos.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
}

// Preload FaceWashFox Spa logo for staff uniform branding
let staffLogoImage = null;
if (typeof Image !== 'undefined') {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.onload = () => {
        staffLogoImage = logoImg;
        console.log('✅ [Logo] Đã nạp logo thương hiệu FaceWashFox cho áo đồng phục nhân viên!');
    };
    logoImg.src = 'logo.png';
}

function applyStaffUniformBranding(material) {
    if (!material) return;
    const processTexture = () => {
        if (!material.map || !material.map.image) return;
        const baseImg = material.map.image;
        if (!baseImg.width || !baseImg.height) return;

        if (material._hasLogoStamped) return;
        material._hasLogoStamped = true;

        const canvas = document.createElement('canvas');
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;
        const ctx = canvas.getContext('2d');

        // Draw original shirt texture
        ctx.drawImage(baseImg, 0, 0);

        if (staffLogoImage) {
            // Front chest emblem on VRoid uniform shirt UV (X: 512 center, Y: ~420)
            const logoW = Math.round(canvas.width * 0.16);
            const logoH = logoW;
            const logoX = Math.round(canvas.width * 0.50 - logoW / 2);
            const logoY = Math.round(canvas.height * 0.20);

            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 4;
            ctx.drawImage(staffLogoImage, logoX, logoY, logoW, logoH);
            ctx.restore();

            const brandedTexture = new THREE.CanvasTexture(canvas);
            brandedTexture.flipY = false;
            if (THREE.sRGBEncoding) brandedTexture.encoding = THREE.sRGBEncoding;
            brandedTexture.needsUpdate = true;

            material.map = brandedTexture;
            material.needsUpdate = true;
            console.log('✨ [Đồng phục] Đã in Logo thương hiệu lên áo nhân viên thành công!');
        }
    };

    if (staffLogoImage && staffLogoImage.complete) {
        processTexture();
    } else {
        setTimeout(processTexture, 300);
        setTimeout(processTexture, 1200);
    }
}

// Setup authentic GLB Character Model Mesh (scale, orientation, materials, bones/relax arms)
function setupGLBCharacterScene(gltf, charId) {
    const model = gltf.scene;
    const config = CHARACTER_MODELS_CONFIG[charId] || {};
    const targetHeight = config.targetHeight || 2.0;

    const bones = {};
    let hasBones = false;

    // Preserve authentic textures, collect bones, imprint logo onto uniform, or relax T-pose arms
    model.traverse((child) => {
        if (child.isBone) {
            bones[child.name] = child;
            hasBones = true;
        }
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.frustumCulled = false;
            if (child.material) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach(mat => {
                    mat.side = THREE.DoubleSide;
                    mat.needsUpdate = true;
                    const matName = (mat.name || '').toLowerCase();

                    // Imprint FaceWashFox Logo onto Uniform Tops / Clothes for staff members
                    if (charId !== 'phuonganh' && (matName.includes('tops') || matName.includes('cloth') || matName.includes('onepiece'))) {
                        applyStaffUniformBranding(mat);
                    }

                    // Signature hair color accents for each staff sister
                    if (charId !== 'phuonganh' && config.hairColorHex && (matName.includes('hair') || matName.includes('hairback'))) {
                        mat.color = new THREE.Color(config.hairColorHex);
                        mat.needsUpdate = true;
                    }
                });
            }
        }
    });

    if (!hasBones) {
        model.traverse((child) => {
            if (child.isMesh) relaxArmTPose(child);
        });
    }

    model.bones = bones;
    model.hasBones = hasBones;

    if (hasBones) {
        // Humanoid SkinnedMesh (VRM)
        const scale = targetHeight / 1.22;
        model.scale.set(scale, scale, scale);
        model.rotation.y = config.rotationY || 0;
        model.position.set(0, 0, 0);
        if (bones.J_Bip_C_Hips) {
            model.hipsOriginY = bones.J_Bip_C_Hips.position.y;
        }
    } else {
        // Uniform Scale based on target height for static models
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const currentHeight = size.y || 2.0;
        const scale = targetHeight / currentHeight;
        model.scale.set(scale, scale, scale);

        // Apply facing rotation
        const rotY = (typeof config.rotationY !== 'undefined') ? config.rotationY : -Math.PI / 2;
        model.rotation.y = rotY;

        // Ground feet at Y = 0 and center horizontally
        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
        model.position.x = -scaledCenter.x;
        model.position.y = -scaledBox.min.y;
        model.position.z = -scaledCenter.z;
    }

    return model;
}

// Asynchronously load GLB model from project files without manual upload
function loadGLBCharacter(charId, onLoaded, onError) {
    if (!window.THREE || !window.THREE.GLTFLoader) {
        if (onError) onError('GLTFLoader not available');
        return;
    }

    const config = CHARACTER_MODELS_CONFIG[charId];
    if (!config) {
        if (onError) onError('No config for ' + charId);
        return;
    }

    const loader = new THREE.GLTFLoader();
    const paths = [
        config.modelPath,
        encodeURI(config.altPath),
        config.altPath
    ];

    function tryLoad(index) {
        if (index >= paths.length) {
            if (onError) onError('All paths failed for ' + charId);
            return;
        }

        const path = paths[index];
        loader.load(path, (gltf) => {
            console.log(`✅ [GLB 3D] Đã nạp thành công nhân vật ${config.name} từ: ${path}`);
            const readyModel = setupGLBCharacterScene(gltf, charId);
            if (onLoaded) onLoaded(readyModel);
        }, undefined, (err) => {
            console.warn(`[GLB 3D] Không nạp được từ: ${path}, thử đường dẫn tiếp theo...`);
            tryLoad(index + 1);
        });
    }

    tryLoad(0);
}

// 3D Procedural Character Animator (Smooth Lifelike Gestures, Action Props & Locomotion)
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
        const bones = (model && model.bones && model.hasBones) ? model.bones : null;

        if (container && !this.actionProps) {
            this.initProps(container);
        }
        const props = this.actionProps;

        if (isMoving) {
            // Natural walking stride cadence
            const cadence = Math.max(7.5, speed * 1.65);
            this.stridePhase += delta * cadence;

            // Feet step bounce
            const bounce = Math.abs(Math.sin(this.stridePhase)) * 0.08;
            target.position.y = bounce;

            // Forward momentum lean
            const targetTiltX = Math.min(0.20, speed * 0.045);
            this.currentTiltX += (targetTiltX - this.currentTiltX) * 0.2;
            target.rotation.x = this.currentTiltX;

            // Hip sway
            const sway = Math.sin(this.stridePhase) * 0.055;
            this.currentTiltZ += (sway - this.currentTiltZ) * 0.25;
            target.rotation.z = this.currentTiltZ;

            // Real Skeletal Leg & Arm articulation
            if (bones) {
                if (bones.J_Bip_L_UpperLeg && bones.J_Bip_R_UpperLeg) {
                    bones.J_Bip_L_UpperLeg.rotation.x = Math.sin(this.stridePhase) * 0.45;
                    bones.J_Bip_R_UpperLeg.rotation.x = -Math.sin(this.stridePhase) * 0.45;
                }
                if (bones.J_Bip_L_LowerLeg && bones.J_Bip_R_LowerLeg) {
                    const leftKneeBend = Math.max(0, -Math.sin(this.stridePhase)) * 0.85;
                    const rightKneeBend = Math.max(0, Math.sin(this.stridePhase)) * 0.85;
                    bones.J_Bip_L_LowerLeg.rotation.x = -leftKneeBend;
                    bones.J_Bip_R_LowerLeg.rotation.x = -rightKneeBend;
                }
                if (bones.J_Bip_L_Foot && bones.J_Bip_R_Foot) {
                    bones.J_Bip_L_Foot.rotation.x = Math.sin(this.stridePhase) * 0.15;
                    bones.J_Bip_R_Foot.rotation.x = -Math.sin(this.stridePhase) * 0.15;
                }
                if (bones.J_Bip_L_UpperArm && bones.J_Bip_R_UpperArm) {
                    const armSwing = Math.sin(this.stridePhase) * 0.38;
                    bones.J_Bip_L_UpperArm.rotation.set(-armSwing, 0.05, -1.32);
                    bones.J_Bip_R_UpperArm.rotation.set(armSwing, -0.05, 1.32);
                }
                if (bones.J_Bip_L_LowerArm && bones.J_Bip_R_LowerArm) {
                    bones.J_Bip_L_LowerArm.rotation.set(0, 0, -0.15);
                    bones.J_Bip_R_LowerArm.rotation.set(0, 0, 0.15);
                }
            }

            // Hide action tools when moving
            if (props) {
                if (props.wand) props.wand.visible = false;
                if (props.towels) props.towels.visible = false;
                if (props.mop) props.mop.visible = false;
                if (props.ring) props.ring.material.opacity = 0;
            }

        } else if (state === 'WORKING_BED' || state === 'WORKING_AT_BED') {
            // Performing Facial Treatment over bed
            const massageRock = Math.sin(this.time * 4.5) * 0.05;
            target.position.y = 0;
            target.rotation.x = 0.16 + Math.abs(massageRock);
            target.rotation.z = massageRock;

            if (bones) {
                if (bones.J_Bip_L_UpperLeg && bones.J_Bip_R_UpperLeg) {
                    bones.J_Bip_L_UpperLeg.rotation.set(0, 0, 0);
                    bones.J_Bip_R_UpperLeg.rotation.set(0, 0, 0);
                }
                if (bones.J_Bip_L_LowerLeg && bones.J_Bip_R_LowerLeg) {
                    bones.J_Bip_L_LowerLeg.rotation.set(0, 0, 0);
                    bones.J_Bip_R_LowerLeg.rotation.set(0, 0, 0);
                }
                if (bones.J_Bip_C_Spine) {
                    bones.J_Bip_C_Spine.rotation.x = 0.16 + Math.sin(this.time * 4.0) * 0.03;
                }
                if (bones.J_Bip_L_UpperArm && bones.J_Bip_L_LowerArm) {
                    bones.J_Bip_L_UpperArm.rotation.set(-0.15, 0.05, -1.25);
                    bones.J_Bip_L_LowerArm.rotation.set(0, 0, -0.25);
                }
                if (bones.J_Bip_R_UpperArm && bones.J_Bip_R_LowerArm) {
                    const treatMotion = Math.sin(this.time * 4.5) * 0.12;
                    bones.J_Bip_R_UpperArm.rotation.set(-0.35 + treatMotion, 1.30, 0.45);
                    bones.J_Bip_R_LowerArm.rotation.set(0, 0.40, 0.20);
                }
            }

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
            // Changing bedsheets and smoothing towels
            target.position.y = 0;
            target.rotation.x = 0.22 + Math.sin(this.time * 5.0) * 0.04;
            target.rotation.z = Math.sin(this.time * 5.0) * 0.04;

            if (bones) {
                if (bones.J_Bip_L_UpperLeg && bones.J_Bip_R_UpperLeg) {
                    bones.J_Bip_L_UpperLeg.rotation.set(0, 0, 0);
                    bones.J_Bip_R_UpperLeg.rotation.set(0, 0, 0);
                }
                if (bones.J_Bip_L_LowerLeg && bones.J_Bip_R_LowerLeg) {
                    bones.J_Bip_L_LowerLeg.rotation.set(0, 0, 0);
                    bones.J_Bip_R_LowerLeg.rotation.set(0, 0, 0);
                }
                if (bones.J_Bip_L_UpperArm && bones.J_Bip_R_UpperArm) {
                    bones.J_Bip_L_UpperArm.rotation.set(-0.30, -0.4, -1.0);
                    bones.J_Bip_R_UpperArm.rotation.set(-0.30, 0.4, 1.0);
                }
            }

            if (props) {
                if (props.mop) props.mop.visible = false;
                if (props.wand) props.wand.visible = false;
                if (props.towels) {
                    props.towels.visible = true;
                    props.towels.position.y = 0.85 + Math.sin(this.time * 5.0) * 0.04;
                }
                if (props.ring) {
                    props.ring.material.color.setHex(0xF25C2B);
                    props.ring.material.opacity = 0.60 + Math.sin(this.time * 5.0) * 0.20;
                }
            }

        } else if (state === 'CLEANING_POOP') {
            // Sweeping floor vigorously with 3D Mop
            const mopSweep = Math.sin(this.time * 6.5) * 0.35;
            target.position.y = Math.abs(Math.sin(this.time * 6.5)) * 0.04;
            target.rotation.x = 0.26;
            target.rotation.z = Math.sin(this.time * 6.5) * 0.05;

            if (bones) {
                if (bones.J_Bip_C_Spine) {
                    bones.J_Bip_C_Spine.rotation.x = 0.28;
                }
                if (bones.J_Bip_L_LowerLeg && bones.J_Bip_R_LowerLeg) {
                    bones.J_Bip_L_LowerLeg.rotation.x = -0.22;
                    bones.J_Bip_R_LowerLeg.rotation.x = -0.22;
                }
                const sweep = Math.sin(this.time * 6.5) * 0.22;
                if (bones.J_Bip_L_UpperArm && bones.J_Bip_R_UpperArm) {
                    bones.J_Bip_L_UpperArm.rotation.set(-0.40 + sweep, -0.65, -0.95);
                    bones.J_Bip_R_UpperArm.rotation.set(-0.40 - sweep, 0.65, 0.95);
                }
                if (bones.J_Bip_L_LowerArm && bones.J_Bip_R_LowerArm) {
                    bones.J_Bip_L_LowerArm.rotation.set(0, -0.30, -0.20);
                    bones.J_Bip_R_LowerArm.rotation.set(0, 0.30, 0.20);
                }
            }

            if (props) {
                if (props.wand) props.wand.visible = false;
                if (props.towels) props.towels.visible = false;
                if (props.mop) {
                    props.mop.visible = true;
                    props.mop.rotation.z = 0.2 + mopSweep * 0.8;
                    props.mop.position.x = 0.18 + Math.sin(this.time * 6.5) * 0.12;
                }
                if (props.ring) {
                    props.ring.material.color.setHex(0xEF4444);
                    props.ring.material.opacity = 0.75 + Math.sin(this.time * 6.5) * 0.25;
                }
            }

        } else if (isSpeaking || state === 'GOSSIPING') {
            // Chém gió / Nói chuyện
            const breath = Math.sin(this.time * 3.0) * 0.018;
            target.position.y = breath;
            target.rotation.x = 0;
            target.rotation.z = Math.sin(this.time * 2.5) * 0.035;

            if (bones) {
                if (bones.J_Bip_L_UpperArm && bones.J_Bip_R_UpperArm) {
                    bones.J_Bip_L_UpperArm.rotation.set(Math.sin(this.time * 3.0) * 0.08, 0.04, -1.30);
                    bones.J_Bip_R_UpperArm.rotation.set(-Math.sin(this.time * 3.0) * 0.08, -0.04, 1.30);
                }
            }

            if (props) {
                if (props.mop) props.mop.visible = false;
                if (props.wand) props.wand.visible = false;
                if (props.towels) props.towels.visible = false;
                if (props.ring) props.ring.material.opacity = 0;
            }

        } else {
            // Relaxed idle breathing
            const breath = Math.sin(this.time * 2.2) * 0.016;
            const shift = Math.sin(this.time * 1.1) * 0.018;
            target.position.y = breath;
            target.rotation.x = breath * 0.3;
            target.rotation.z = shift;

            if (bones) {
                if (bones.J_Bip_L_UpperLeg && bones.J_Bip_R_UpperLeg) {
                    bones.J_Bip_L_UpperLeg.rotation.set(0, 0, 0);
                    bones.J_Bip_R_UpperLeg.rotation.set(0, 0, 0);
                }
                if (bones.J_Bip_L_LowerLeg && bones.J_Bip_R_LowerLeg) {
                    bones.J_Bip_L_LowerLeg.rotation.set(0, 0, 0);
                    bones.J_Bip_R_LowerLeg.rotation.set(0, 0, 0);
                }
                if (bones.J_Bip_L_UpperArm && bones.J_Bip_R_UpperArm) {
                    const breathe = Math.sin(this.time * 2.0) * 0.02;
                    bones.J_Bip_L_UpperArm.rotation.set(breathe, 0.04, -1.34);
                    bones.J_Bip_R_UpperArm.rotation.set(-breathe, -0.04, 1.34);
                }
                if (bones.J_Bip_L_LowerArm && bones.J_Bip_R_LowerArm) {
                    bones.J_Bip_L_LowerArm.rotation.set(0, 0, -0.12);
                    bones.J_Bip_R_LowerArm.rotation.set(0, 0, 0.12);
                }
                if (bones.J_Bip_C_Spine) {
                    bones.J_Bip_C_Spine.rotation.x = Math.sin(this.time * 2.0) * 0.02;
                    bones.J_Bip_C_Spine.rotation.y = 0;
                }
                if (bones.J_Bip_C_Head) {
                    bones.J_Bip_C_Head.rotation.x = Math.sin(this.time * 2.0) * 0.015;
                }
                if (bones.J_Bip_C_Hips && model.hipsOriginY) {
                    bones.J_Bip_C_Hips.position.y = model.hipsOriginY;
                }
            }

            if (props) {
                if (props.mop) props.mop.visible = false;
                if (props.wand) props.wand.visible = false;
                if (props.towels) props.towels.visible = false;
                if (props.ring) props.ring.material.opacity = 0;
            }
        }
    }
}

// Global Exports
window.CHARACTER_MODELS_CONFIG = CHARACTER_MODELS_CONFIG;
window.createCharacterActionProps = createCharacterActionProps;
window.setupGLBCharacterScene = setupGLBCharacterScene;
window.loadGLBCharacter = loadGLBCharacter;
window.Character3DAnimator = Character3DAnimator;
