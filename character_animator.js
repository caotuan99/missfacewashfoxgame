// FaceWashFox Store Simulator - Character 3D Animation & Model Loader System
// Dedicated .js 3D Character Controller & Gestures for Three.js

const CHARACTER_FOLDER_CONFIG = {
    phuonganh: {
        id: 'phuonganh',
        name: 'Phương Anh',
        folder: 'phuong anh',
        primaryPath: 'phuong anh/source/ip-chainsaw-man__makima__real__sexy.glb',
        fallbackPath: 'models/phuong_anh.glb'
    },
    oanh: {
        id: 'oanh',
        name: 'Oanh',
        folder: 'oanh',
        primaryPath: 'oanh/source/ip-roblox__roblox-girl-r63__concept__tpose.glb',
        fallbackPath: 'models/oanh.glb'
    },
    uyen: {
        id: 'uyen',
        name: 'Uyên',
        folder: 'uyên',
        primaryPath: 'uyên/source/ip-touhou__reimu-hakurei__furry__sexy.glb',
        altPath: 'uyên/source/ip-touhou__reimu-hakurei__furry__sexy.glb',
        fallbackPath: 'models/uyen.glb'
    },
    vy: {
        id: 'vy',
        name: 'Vy',
        folder: 'vy',
        primaryPath: 'vy/source/ip-undertale-deltarune__toriel__real__tpose.glb',
        fallbackPath: 'models/vy.glb'
    },
    maianh: {
        id: 'maianh',
        name: 'Mai Anh',
        folder: 'mai anh',
        primaryPath: 'mai anh/source/ip-hololive-vtuber__gawr-gura__real__tpose.glb',
        fallbackPath: 'models/mai_anh.glb'
    }
};

// Robust 3D GLB Model Loader supporting custom character folders with spaces & unicode
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

// Global 3D Procedural Character Animator (Smooth Lifelike Gestures without Rigidity)
class Character3DAnimator {
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
}

window.Character3DAnimator = Character3DAnimator;
window.CHARACTER_FOLDER_CONFIG = CHARACTER_FOLDER_CONFIG;
window.loadCharacterGLBFromFolder = loadCharacterGLBFromFolder;
