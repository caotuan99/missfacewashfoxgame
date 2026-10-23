// FaceWashFox Store Simulator - Procedural 3D Character Studio & Animator (.js 3D)
// 100% Code-Generated High-Fidelity 3D Characters matching each folder's theme:
// 1. Phương Anh (phuong anh): Makima (Chainsaw Man) - Red braid hair, white shirt, black tie & trousers
// 2. Oanh (oanh): Roblox Girl (Chị Cả) - Brown wavy hair, stylish pink/black crop-top, chic choker & skirt
// 3. Uyên (uyên): Reimu Hakurei (Chị Hai) - Huge red bow, white/red shrine maiden miko robe & ribbons
// 4. Vy (vy): Toriel (Bé Tư) - White goat fur, curved horns, drooping ears, royal purple robe with Delta Rune
// 5. Mai Anh (mai anh): Gawr Gura (Bé Út) - Blue shark hoodie, sharp teeth rim, dorsal fin & wagging shark tail

function createCharacterFaceTexture(charId) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base skin background tone
    let skinColor = '#FFF1EA';
    if (charId === 'vy') skinColor = '#FAF5FF'; // Toriel fluffy white fur
    ctx.fillStyle = skinColor;
    ctx.fillRect(0, 0, 512, 512);

    if (charId === 'phuonganh') {
        // --- MAKIMA (Chainsaw Man): Golden concentric circle eyes, calm enigmatic aura ---
        // Rosy subtle cheek blush
        ctx.fillStyle = 'rgba(251, 113, 133, 0.35)';
        ctx.beginPath(); ctx.arc(140, 310, 42, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(372, 310, 42, 0, Math.PI * 2); ctx.fill();

        // Eye whites
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.ellipse(150, 240, 50, 42, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(362, 240, 50, 42, 0, 0, Math.PI * 2); ctx.fill();

        // Makima Golden Amber Irises with Concentric Circles
        [150, 362].forEach(x => {
            // Outer golden ring
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath(); ctx.arc(x, 240, 34, 0, Math.PI * 2); ctx.fill();
            // Middle ring
            ctx.strokeStyle = '#B45309';
            ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(x, 240, 22, 0, Math.PI * 2); ctx.stroke();
            // Inner ring
            ctx.beginPath(); ctx.arc(x, 240, 12, 0, Math.PI * 2); ctx.stroke();
            // Tiny center pupil
            ctx.fillStyle = '#78350F';
            ctx.beginPath(); ctx.arc(x, 240, 5, 0, Math.PI * 2); ctx.fill();
            // Eye gleam
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath(); ctx.arc(x - 10, 228, 6, 0, Math.PI * 2); ctx.fill();
        });

        // Elegant upper eyelashes
        ctx.strokeStyle = '#451A03';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(150, 222, 52, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
        ctx.beginPath(); ctx.arc(362, 222, 52, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();

        // Slender anime eyebrows
        ctx.strokeStyle = '#DC4C3A'; // Makima reddish-orange hair color
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(110, 175); ctx.quadraticCurveTo(155, 160, 200, 175); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(402, 175); ctx.quadraticCurveTo(357, 160, 312, 175); ctx.stroke();

        // Enigmatic confident smile
        ctx.strokeStyle = '#BE123C';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(256, 345, 26, 0.2, Math.PI - 0.2); ctx.stroke();

    } else if (charId === 'oanh') {
        // --- ROBLOX GIRL (Chị Cả): Sparkling anime eyes, eyelashes, cheerful confident smile ---
        ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
        ctx.beginPath(); ctx.arc(135, 315, 45, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(377, 315, 45, 0, Math.PI * 2); ctx.fill();

        // Eye whites
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.ellipse(145, 235, 52, 52, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(367, 235, 52, 52, 0, 0, Math.PI * 2); ctx.fill();

        // Large anime dark chocolate irises
        [145, 367].forEach(x => {
            ctx.fillStyle = '#261B17';
            ctx.beginPath(); ctx.arc(x, 235, 40, 0, Math.PI * 2); ctx.fill();
            // Violet-pink reflection
            ctx.fillStyle = '#EC4899';
            ctx.beginPath(); ctx.arc(x, 250, 22, 0, Math.PI); ctx.fill();
            // Sparkle highlights
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath(); ctx.arc(x - 12, 220, 14, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + 14, 245, 7, 0, Math.PI * 2); ctx.fill();
        });

        // Winged cute eyeliner & lashes
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(145, 218, 54, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
        ctx.beginPath(); ctx.arc(367, 218, 54, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
        // Lashes flick
        ctx.beginPath(); ctx.moveTo(90, 215); ctx.lineTo(75, 205); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(422, 215); ctx.lineTo(437, 205); ctx.stroke();

        // Cheerful smiling lips
        ctx.fillStyle = '#E11D48';
        ctx.beginPath(); ctx.arc(256, 345, 34, 0.15, Math.PI - 0.15); ctx.fill();

    } else if (charId === 'uyen') {
        // --- REIMU HAKUREI (Chị Hai): Ruby red eyes, miko elegance, gentle smile ---
        ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.beginPath(); ctx.arc(140, 310, 40, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(372, 310, 40, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.ellipse(145, 235, 48, 48, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(367, 235, 48, 48, 0, 0, Math.PI * 2); ctx.fill();

        // Ruby crimson irises
        [145, 367].forEach(x => {
            ctx.fillStyle = '#991B1B';
            ctx.beginPath(); ctx.arc(x, 235, 36, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#EF4444';
            ctx.beginPath(); ctx.arc(x, 246, 20, 0, Math.PI); ctx.fill();
            // Star highlight
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath(); ctx.arc(x - 10, 222, 12, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + 10, 242, 6, 0, Math.PI * 2); ctx.fill();
        });

        // Gentle miko eyeliner
        ctx.strokeStyle = '#18181B';
        ctx.lineWidth = 7;
        ctx.beginPath(); ctx.arc(145, 220, 50, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
        ctx.beginPath(); ctx.arc(367, 220, 50, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();

        // Soft gentle mouth
        ctx.strokeStyle = '#BE123C';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(256, 342, 24, 0.2, Math.PI - 0.2); ctx.stroke();

    } else if (charId === 'vy') {
        // --- TORIEL (Bé Tư): Fluffy goat muzzle, gentle hazel eyes, warm comforting smile ---
        // Soft pink cheek blush on white fur
        ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
        ctx.beginPath(); ctx.arc(130, 310, 46, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(382, 310, 46, 0, Math.PI * 2); ctx.fill();

        // Gentle warm brown goat eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.ellipse(145, 235, 42, 36, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(367, 235, 42, 36, 0, 0, Math.PI * 2); ctx.fill();

        [145, 367].forEach(x => {
            ctx.fillStyle = '#78350F';
            ctx.beginPath(); ctx.arc(x, 235, 26, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#D97706';
            ctx.beginPath(); ctx.arc(x, 242, 14, 0, Math.PI); ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath(); ctx.arc(x - 8, 225, 9, 0, Math.PI * 2); ctx.fill();
        });

        // Toriel adorable black goat snout & nose
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.moveTo(235, 305); ctx.lineTo(277, 305); ctx.lineTo(256, 325);
        ctx.closePath(); ctx.fill();

        // Goat mouth cleft
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(256, 325); ctx.lineTo(256, 345); ctx.stroke();
        ctx.beginPath(); ctx.arc(242, 348, 16, 0, Math.PI * 0.85); ctx.stroke();
        ctx.beginPath(); ctx.arc(270, 348, 16, Math.PI * 0.15, Math.PI); ctx.stroke();

    } else if (charId === 'maianh') {
        // --- GAWR GURA (Bé Út): Bright ocean eyes, tiny sharp shark fang, cute baby smile ---
        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.beginPath(); ctx.arc(130, 320, 46, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(382, 320, 46, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.ellipse(145, 235, 52, 52, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(367, 235, 52, 52, 0, 0, Math.PI * 2); ctx.fill();

        // Deep ocean blue irises
        [145, 367].forEach(x => {
            ctx.fillStyle = '#0369A1';
            ctx.beginPath(); ctx.arc(x, 235, 40, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#38BDF8';
            ctx.beginPath(); ctx.arc(x, 248, 24, 0, Math.PI); ctx.fill();
            // Anime sparkles
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath(); ctx.arc(x - 12, 218, 14, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + 14, 244, 7, 0, Math.PI * 2); ctx.fill();
        });

        ctx.strokeStyle = '#0C4A6E';
        ctx.lineWidth = 7;
        ctx.beginPath(); ctx.arc(145, 218, 54, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
        ctx.beginPath(); ctx.arc(367, 218, 54, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();

        // Gura's smiling mouth with cute shark fang
        ctx.fillStyle = '#E11D48';
        ctx.beginPath(); ctx.arc(256, 350, 32, 0.1, Math.PI - 0.1); ctx.fill();
        // Little sharp white shark tooth at the side
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(270, 352); ctx.lineTo(282, 352); ctx.lineTo(276, 368);
        ctx.closePath(); ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
}

// 3D Procedural Action Props Factory (Cleaning Mop, Ultrasonic Facial Wand, Fresh Towels, Pulsing Aura Ring)
function createCharacterActionProps(container) {
    const props = {
        mop: null,
        wand: null,
        towels: null,
        ring: null
    };

    // 1. Action Floor Ring (Pulsing glowing ring beneath character's feet)
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

    // 2. 3D Ultrasonic Facial Wand with glowing LED tip
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

    // 3. 3D Floor Mop for cleaning poop accidents
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

    // 4. 3D Towel Stack for changing bedsheets
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

// =========================================================================
// 3D PROCEDURAL CHARACTER BUILDER (.js 3D)
// Fully rigged, articulated characters with lifelike limbs, hair & outfits
// =========================================================================
function build3DCharacterMesh(charId) {
    const charRoot = new THREE.Group();
    charRoot.name = 'char_model_' + charId;

    const limbs = {
        root: charRoot,
        pelvis: null,
        torso: null,
        head: null,
        leftArm: null,
        rightArm: null,
        leftLeg: null,
        rightLeg: null,
        hairBraid: null,
        tail: null,
        ears: null,
        ribbons: null
    };

    // Shared / Base materials
    const skinMat = new THREE.MeshLambertMaterial({
        color: charId === 'vy' ? 0xFAF5FF : 0xFFEDE4,
        roughness: 0.6
    });

    const faceTexture = createCharacterFaceTexture(charId);
    const faceMat = new THREE.MeshLambertMaterial({
        map: faceTexture,
        roughness: 0.5
    });

    // 1. Pelvis / Hips (Root pivot)
    const pelvis = new THREE.Group();
    pelvis.position.y = 0.95;
    charRoot.add(pelvis);
    limbs.pelvis = pelvis;

    // 2. Torso (Bends / Breaths)
    const torso = new THREE.Group();
    torso.position.y = 0;
    pelvis.add(torso);
    limbs.torso = torso;

    // 3. Legs & Feet
    const createLeg = (isLeft) => {
        const legPivot = new THREE.Group();
        legPivot.position.set(isLeft ? -0.18 : 0.18, 0, 0);

        let pantsColor = 0x1E1E24; // Default black pants
        if (charId === 'oanh') pantsColor = 0xFFEDE4; // Bare legs for Roblox girl
        if (charId === 'uyen') pantsColor = 0xFFFFFF; // Tabi white socks
        if (charId === 'vy') pantsColor = 0xFAF5FF; // White fur
        if (charId === 'maianh') pantsColor = 0xFFEDE4; // Bare legs

        const legGeo = new THREE.CylinderGeometry(0.09, 0.075, 0.85, 10);
        const legMesh = new THREE.Mesh(legGeo, new THREE.MeshLambertMaterial({ color: pantsColor }));
        legMesh.position.y = -0.42;
        legMesh.castShadow = true;
        legPivot.add(legMesh);

        // Shoes
        let shoeColor = 0x09090B;
        if (charId === 'oanh') shoeColor = 0xEC4899; // Pink sneakers
        if (charId === 'uyen') shoeColor = 0xDC2626; // Red zori sandals
        if (charId === 'vy') shoeColor = 0x6D28D9;   // Purple robe bottom
        if (charId === 'maianh') shoeColor = 0x0284C7; // Blue shark shoes

        const footGeo = new THREE.BoxGeometry(0.14, 0.1, 0.26);
        const footMesh = new THREE.Mesh(footGeo, new THREE.MeshLambertMaterial({ color: shoeColor }));
        footMesh.position.set(0, -0.88, 0.05);
        footMesh.castShadow = true;
        legPivot.add(footMesh);

        return legPivot;
    };

    const leftLeg = createLeg(true);
    const rightLeg = createLeg(false);
    pelvis.add(leftLeg);
    pelvis.add(rightLeg);
    limbs.leftLeg = leftLeg;
    limbs.rightLeg = rightLeg;

    // 4. Arms & Hands
    const createArm = (isLeft) => {
        const armPivot = new THREE.Group();
        armPivot.position.set(isLeft ? -0.36 : 0.36, 0.48, 0);

        let sleeveColor = 0xFFFFFF;
        if (charId === 'oanh') sleeveColor = 0xFFEDE4; // Sleeveless
        if (charId === 'uyen') sleeveColor = 0xFFFFFF; // White Miko detached sleeve
        if (charId === 'vy') sleeveColor = 0x6D28D9;   // Purple robe
        if (charId === 'maianh') sleeveColor = 0x0284C7; // Blue shark hoodie

        const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.55, 10);
        const armMesh = new THREE.Mesh(armGeo, new THREE.MeshLambertMaterial({ color: sleeveColor }));
        armMesh.position.y = -0.26;
        armMesh.castShadow = true;
        armPivot.add(armMesh);

        // Hand
        const handGeo = new THREE.SphereGeometry(0.065, 8, 8);
        const handMesh = new THREE.Mesh(handGeo, skinMat);
        handMesh.position.y = -0.56;
        armPivot.add(handMesh);

        return armPivot;
    };

    const leftArm = createArm(true);
    const rightArm = createArm(false);
    torso.add(leftArm);
    torso.add(rightArm);
    limbs.leftArm = leftArm;
    limbs.rightArm = rightArm;

    // 5. Head & Face
    const head = new THREE.Group();
    head.position.y = 0.62;
    torso.add(head);
    limbs.head = head;

    // Head base sphere
    const headGeo = new THREE.SphereGeometry(0.28, 18, 18);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.y = 0.18;
    headMesh.castShadow = true;
    head.add(headMesh);

    // Front Face Plate with high-res Canvas Texture
    const facePlateGeo = new THREE.PlaneGeometry(0.48, 0.48);
    const facePlate = new THREE.Mesh(facePlateGeo, faceMat);
    facePlate.position.set(0, 0.18, 0.22);
    head.add(facePlate);

    // =========================================================================
    // CHARACTER SPECIFIC OUTFITS, HAIRSTYLES, ACCESSORIES & SILHOUETTES
    // =========================================================================

    if (charId === 'phuonganh') {
        // --- 1. PHƯƠNG ANH (MAKIMA - Chainsaw Man) ---
        // Crisp white office blouse
        const shirtGeo = new THREE.CylinderGeometry(0.22, 0.20, 0.55, 12);
        const shirtMesh = new THREE.Mesh(shirtGeo, new THREE.MeshLambertMaterial({ color: 0xFFFFFF }));
        shirtMesh.position.y = 0.25;
        shirtMesh.castShadow = true;
        torso.add(shirtMesh);

        // Black necktie
        const tieGeo = new THREE.BoxGeometry(0.08, 0.38, 0.04);
        const tieMesh = new THREE.Mesh(tieGeo, new THREE.MeshLambertMaterial({ color: 0x18181B }));
        tieMesh.position.set(0, 0.22, 0.21);
        torso.add(tieMesh);

        // Black business trousers top
        const pantsTopGeo = new THREE.CylinderGeometry(0.21, 0.23, 0.25, 12);
        const pantsTopMesh = new THREE.Mesh(pantsTopGeo, new THREE.MeshLambertMaterial({ color: 0x1E1E24 }));
        pantsTopMesh.position.y = -0.05;
        pelvis.add(pantsTopMesh);

        // Makima Red Hair (Bangs + Side Strands + Long Braid on Back)
        const hairMat = new THREE.MeshLambertMaterial({ color: 0xDC4C3A });
        const hairTopGeo = new THREE.SphereGeometry(0.30, 16, 14);
        const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
        hairTop.position.set(0, 0.22, -0.04);
        head.add(hairTop);

        // Side hair strands framing face
        [-0.22, 0.22].forEach(x => {
            const sideGeo = new THREE.CylinderGeometry(0.05, 0.02, 0.45, 8);
            const sideStrand = new THREE.Mesh(sideGeo, hairMat);
            sideStrand.position.set(x, 0.10, 0.15);
            head.add(sideStrand);
        });

        // Makima's Iconic Long Woven Braid on Back
        const braidGroup = new THREE.Group();
        braidGroup.position.set(0, 0.15, -0.28);
        for (let i = 0; i < 6; i++) {
            const segGeo = new THREE.SphereGeometry(0.07 - i * 0.006, 8, 8);
            const seg = new THREE.Mesh(segGeo, hairMat);
            seg.position.y = -i * 0.11;
            braidGroup.add(seg);
        }
        head.add(braidGroup);
        limbs.hairBraid = braidGroup;

    } else if (charId === 'oanh') {
        // --- 2. OANH (ROBLOX GIRL - Chị Cả) ---
        // Stylish cropped tank top (Hot Pink & Black)
        const topGeo = new THREE.CylinderGeometry(0.23, 0.20, 0.38, 12);
        const topMesh = new THREE.Mesh(topGeo, new THREE.MeshLambertMaterial({ color: 0xF43F5E }));
        topMesh.position.y = 0.30;
        topMesh.castShadow = true;
        torso.add(topMesh);

        // Black Choker Necklace
        const chokerGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 12);
        const choker = new THREE.Mesh(chokerGeo, new THREE.MeshLambertMaterial({ color: 0x0F172A }));
        choker.position.y = 0.52;
        torso.add(choker);

        // Trendy Black Pleated Skirt
        const skirtGeo = new THREE.CylinderGeometry(0.19, 0.34, 0.32, 14);
        const skirtMesh = new THREE.Mesh(skirtGeo, new THREE.MeshLambertMaterial({ color: 0x18181B }));
        skirtMesh.position.y = -0.08;
        pelvis.add(skirtMesh);

        // Voluminous Chocolate Brown Roblox Hair
        const rHairMat = new THREE.MeshLambertMaterial({ color: 0x4A2E1B });
        const rHairTop = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 14), rHairMat);
        rHairTop.position.set(0, 0.22, -0.02);
        head.add(rHairTop);

        // Bouncy twin waves falling over shoulders
        [-0.24, 0.24].forEach(x => {
            const waveGeo = new THREE.CylinderGeometry(0.07, 0.04, 0.55, 8);
            const wave = new THREE.Mesh(waveGeo, rHairMat);
            wave.position.set(x, 0.05, 0.05);
            wave.rotation.z = x > 0 ? -0.15 : 0.15;
            head.add(wave);
        });

    } else if (charId === 'uyen') {
        // --- 3. UYÊN (REIMU HAKUREI - Chị Hai) ---
        // White Miko Kimono Vest
        const mikoVestGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.52, 12);
        const mikoVest = new THREE.Mesh(mikoVestGeo, new THREE.MeshLambertMaterial({ color: 0xFFFFFF }));
        mikoVest.position.y = 0.26;
        torso.add(mikoVest);

        // Red Neck Ribbon & Red Obi Waist Sash
        const obiGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.14, 12);
        const obiMesh = new THREE.Mesh(obiGeo, new THREE.MeshLambertMaterial({ color: 0xDC2626 }));
        obiMesh.position.y = 0.05;
        pelvis.add(obiMesh);

        // Pleated Red Shrine Maiden Skirt (Hakama)
        const hakamaGeo = new THREE.CylinderGeometry(0.24, 0.46, 0.62, 14);
        const hakamaMesh = new THREE.Mesh(hakamaGeo, new THREE.MeshLambertMaterial({ color: 0xDC2626 }));
        hakamaMesh.position.y = -0.28;
        hakamaMesh.castShadow = true;
        pelvis.add(hakamaMesh);

        // Dark Charcoal Hair
        const reimuHairMat = new THREE.MeshLambertMaterial({ color: 0x1E1E1E });
        const rHairMesh = new THREE.Mesh(new THREE.SphereGeometry(0.31, 16, 14), reimuHairMat);
        rHairMesh.position.set(0, 0.22, -0.03);
        head.add(rHairMesh);

        // Reimu's Iconic HUGE Red Hair Bow (Nơ đỏ khổng lồ)
        const bowGroup = new THREE.Group();
        bowGroup.position.set(0, 0.48, -0.08);

        const bowCenter = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), new THREE.MeshLambertMaterial({ color: 0xDC2626 }));
        bowGroup.add(bowCenter);

        [-0.22, 0.22].forEach(x => {
            const wingGeo = new THREE.ConeGeometry(0.18, 0.38, 6);
            const wing = new THREE.Mesh(wingGeo, new THREE.MeshLambertMaterial({ color: 0xDC2626 }));
            wing.rotation.z = x > 0 ? -Math.PI / 2.3 : Math.PI / 2.3;
            wing.position.set(x, 0, 0);
            bowGroup.add(wing);
        });
        head.add(bowGroup);

        // White silk hanging ribbons that sway with motion
        const ribbonGroup = new THREE.Group();
        ribbonGroup.position.set(0, 0.38, -0.05);
        [-0.25, 0.25].forEach(x => {
            const ribGeo = new THREE.BoxGeometry(0.07, 0.58, 0.02);
            const rib = new THREE.Mesh(ribGeo, new THREE.MeshLambertMaterial({ color: 0xFFFFFF }));
            rib.position.set(x, -0.25, 0.12);
            ribbonGroup.add(rib);
        });
        head.add(ribbonGroup);
        limbs.ribbons = ribbonGroup;

    } else if (charId === 'vy') {
        // --- 4. VY (TORIEL - Bé Tư) ---
        // Royal Purple Robe flowing to floor
        const robeGeo = new THREE.CylinderGeometry(0.26, 0.52, 1.15, 14);
        const robeMesh = new THREE.Mesh(robeGeo, new THREE.MeshLambertMaterial({ color: 0x6D28D9 }));
        robeMesh.position.y = 0.05;
        robeMesh.castShadow = true;
        pelvis.add(robeMesh);

        // Toriel's Delta Rune Chest Symbol (Embossed white emblem)
        const runeGeo = new THREE.PlaneGeometry(0.24, 0.22);
        const runeCanvas = document.createElement('canvas');
        runeCanvas.width = 256; runeCanvas.height = 256;
        const rCtx = runeCanvas.getContext('2d');
        rCtx.fillStyle = '#FFFFFF';
        // Delta Rune Winged Circle
        rCtx.beginPath(); rCtx.arc(128, 85, 26, 0, Math.PI * 2); rCtx.fill();
        rCtx.beginPath(); rCtx.ellipse(90, 85, 30, 10, -0.3, 0, Math.PI * 2); rCtx.fill();
        rCtx.beginPath(); rCtx.ellipse(166, 85, 30, 10, 0.3, 0, Math.PI * 2); rCtx.fill();
        // 3 Triangles below
        const drawTri = (cx, cy) => {
            rCtx.beginPath(); rCtx.moveTo(cx, cy - 14); rCtx.lineTo(cx - 14, cy + 14); rCtx.lineTo(cx + 14, cy + 14); rCtx.closePath(); rCtx.fill();
        };
        drawTri(96, 160); drawTri(160, 160);
        // Inverted bottom triangle
        rCtx.beginPath(); rCtx.moveTo(128, 205); rCtx.lineTo(114, 175); rCtx.lineTo(142, 175); rCtx.closePath(); rCtx.fill();

        const runeTex = new THREE.CanvasTexture(runeCanvas);
        const runeMesh = new THREE.Mesh(runeGeo, new THREE.MeshBasicMaterial({ map: runeTex, transparent: true }));
        runeMesh.position.set(0, 0.28, 0.25);
        torso.add(runeMesh);

        // Elegant Cream Goat Horns
        const hornMat = new THREE.MeshLambertMaterial({ color: 0xFEF08A });
        [-0.18, 0.18].forEach(x => {
            const hornGeo = new THREE.ConeGeometry(0.065, 0.26, 8);
            const horn = new THREE.Mesh(hornGeo, hornMat);
            horn.position.set(x, 0.44, -0.06);
            horn.rotation.z = x > 0 ? -0.4 : 0.4;
            head.add(horn);
        });

        // Soft Fluffy Goat Ears drooping down
        const earsGroup = new THREE.Group();
        earsGroup.position.set(0, 0.25, -0.05);
        [-0.28, 0.28].forEach(x => {
            const earGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.36, 8);
            const ear = new THREE.Mesh(earGeo, new THREE.MeshLambertMaterial({ color: 0xFAF5FF }));
            ear.position.set(x, -0.10, 0);
            ear.rotation.z = x > 0 ? -0.35 : 0.35;
            earsGroup.add(ear);
        });
        head.add(earsGroup);
        limbs.ears = earsGroup;

    } else if (charId === 'maianh') {
        // --- 5. MAI ANH (GAWR GURA - Bé Út) ---
        // Oversized Marine Blue Shark Hoodie
        const hoodieGeo = new THREE.CylinderGeometry(0.26, 0.28, 0.55, 12);
        const hoodieMesh = new THREE.Mesh(hoodieGeo, new THREE.MeshLambertMaterial({ color: 0x0284C7 }));
        hoodieMesh.position.y = 0.24;
        hoodieMesh.castShadow = true;
        torso.add(hoodieMesh);

        // Light Blue Belly Panel
        const bellyGeo = new THREE.PlaneGeometry(0.24, 0.38);
        const bellyMesh = new THREE.Mesh(bellyGeo, new THREE.MeshLambertMaterial({ color: 0xBAE6FD }));
        bellyMesh.position.set(0, 0.22, 0.27);
        torso.add(bellyMesh);

        // Shark Hood Covering Head
        const hoodGeo = new THREE.SphereGeometry(0.34, 16, 14);
        const hoodMesh = new THREE.Mesh(hoodGeo, new THREE.MeshLambertMaterial({ color: 0x0284C7 }));
        hoodMesh.position.set(0, 0.22, -0.02);
        head.add(hoodMesh);

        // Shark Fin on Top of Hood
        const finGeo = new THREE.ConeGeometry(0.12, 0.28, 4);
        const fin = new THREE.Mesh(finGeo, new THREE.MeshLambertMaterial({ color: 0x0284C7 }));
        fin.position.set(0, 0.58, -0.06);
        fin.rotation.x = -0.3;
        head.add(fin);

        // White Sharp Shark Teeth Rim around face opening
        const teethMat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        for (let i = -3; i <= 3; i++) {
            const toothGeo = new THREE.ConeGeometry(0.028, 0.05, 4);
            const tooth = new THREE.Mesh(toothGeo, teethMat);
            tooth.position.set(i * 0.065, 0.36, 0.26);
            tooth.rotation.x = Math.PI;
            head.add(tooth);
        }

        // Gawr Gura's Iconic Big Wagging Shark Tail on Back!
        const tailGroup = new THREE.Group();
        tailGroup.position.set(0, 0.02, -0.26);

        const tailGeo = new THREE.ConeGeometry(0.16, 0.65, 8);
        const tailMesh = new THREE.Mesh(tailGeo, new THREE.MeshLambertMaterial({ color: 0x0284C7 }));
        tailMesh.rotation.x = -Math.PI / 2.3;
        tailMesh.position.set(0, 0.08, -0.28);
        tailGroup.add(tailMesh);

        // Shark Fin Tail End
        const tailFinGeo = new THREE.BoxGeometry(0.04, 0.32, 0.24);
        const tailFin = new THREE.Mesh(tailFinGeo, new THREE.MeshLambertMaterial({ color: 0x0284C7 }));
        tailFin.position.set(0, 0.16, -0.58);
        tailFin.rotation.x = -0.4;
        tailGroup.add(tailFin);

        pelvis.add(tailGroup);
        limbs.tail = tailGroup;
    }

    // Attach rigged limb references to the model
    charRoot.limbs = limbs;
    charRoot.actionProps = createCharacterActionProps(charRoot);

    return charRoot;
}

// =========================================================================
// 3D PROCEDURAL CHARACTER ANIMATOR (Lifelike Gestures & Smooth Walking)
// =========================================================================
class Character3DAnimator {
    constructor(isPlayer = false) {
        this.isPlayer = isPlayer;
        this.time = Math.random() * 20;
        this.stridePhase = Math.random() * Math.PI * 2;
        this.currentTiltX = 0;
        this.currentTiltZ = 0;
    }

    initProps(container) {
        // Handled automatically inside build3DCharacterMesh
    }

    animate(container, model, delta, isMoving, speed, state, isSpeaking) {
        if (!container && !model) return;
        this.time += delta;

        const charMesh = (model && model.limbs) ? model : (container && container.children ? container.children.find(c => c.limbs) : null);
        const limbs = charMesh ? charMesh.limbs : null;
        const props = charMesh ? charMesh.actionProps : null;
        const target = container || model;

        if (isMoving) {
            // --- LOCOMOTION / WALKING / RUNNING ---
            const cadence = Math.max(7.5, speed * 1.65);
            this.stridePhase += delta * cadence;

            // Feet step bounce & weight shifting
            const bounce = Math.abs(Math.sin(this.stridePhase)) * 0.075;
            target.position.y = bounce;

            // Forward lean
            const targetTiltX = Math.min(0.20, speed * 0.045);
            this.currentTiltX += (targetTiltX - this.currentTiltX) * 0.2;
            target.rotation.x = this.currentTiltX;

            // Hip sway
            const sway = Math.sin(this.stridePhase) * 0.06;
            this.currentTiltZ += (sway - this.currentTiltZ) * 0.25;
            target.rotation.z = this.currentTiltZ;

            // Natural limb pendulum swing
            if (limbs) {
                if (limbs.leftLeg) limbs.leftLeg.rotation.x = Math.sin(this.stridePhase) * 0.55;
                if (limbs.rightLeg) limbs.rightLeg.rotation.x = -Math.sin(this.stridePhase) * 0.55;
                if (limbs.leftArm) limbs.leftArm.rotation.x = -Math.sin(this.stridePhase) * 0.45;
                if (limbs.rightArm) limbs.rightArm.rotation.x = Math.sin(this.stridePhase) * 0.45;

                // Gura's cute shark tail wagging
                if (limbs.tail) {
                    limbs.tail.rotation.y = Math.sin(this.stridePhase * 1.5) * 0.45;
                }
                // Makima's braid swaying
                if (limbs.hairBraid) {
                    limbs.hairBraid.rotation.z = Math.sin(this.stridePhase) * 0.20;
                }
                // Toriel's ears bobbing
                if (limbs.ears) {
                    limbs.ears.rotation.z = Math.sin(this.stridePhase * 2) * 0.08;
                }
                // Reimu's ribbons floating
                if (limbs.ribbons) {
                    limbs.ribbons.rotation.z = Math.sin(this.time * 3) * 0.20;
                }
            }

            // Hide action tools when moving
            if (props) {
                if (props.wand) props.wand.visible = false;
                if (props.towels) props.towels.visible = false;
                if (props.mop) props.mop.visible = false;
                if (props.ring) props.ring.material.opacity = 0;
            }

        } else if (state === 'WORKING_BED') {
            // --- PERFORMING LUXURIOUS FACIAL TREATMENT ---
            const massageRock = Math.sin(this.time * 4.5) * 0.06;
            target.rotation.x = 0.18 + Math.abs(massageRock) * 0.5;
            target.rotation.z = massageRock;

            if (limbs) {
                if (limbs.leftLeg) limbs.leftLeg.rotation.x = 0;
                if (limbs.rightLeg) limbs.rightLeg.rotation.x = 0;
                if (limbs.rightArm) {
                    limbs.rightArm.rotation.x = Math.PI / 3 + Math.sin(this.time * 4.5) * 0.18;
                }
                if (limbs.leftArm) {
                    limbs.leftArm.rotation.x = Math.PI / 4 + Math.cos(this.time * 4.5) * 0.10;
                }
            }

            // Show 3D Ultrasonic Facial Wand with glowing LED & green treatment aura ring
            if (props) {
                if (props.mop) props.mop.visible = false;
                if (props.towels) props.towels.visible = false;
                if (props.wand) {
                    props.wand.visible = true;
                    props.wand.position.y = 0.95 + Math.sin(this.time * 4.5) * 0.05;
                }
                if (props.ring) {
                    props.ring.material.color.setHex(0x10B981);
                    props.ring.material.opacity = 0.65 + Math.sin(this.time * 4.0) * 0.25;
                }
            }

        } else if (state === 'CLEANING_BED') {
            // --- TIDYING & CHANGING SPA BEDSHEETS ---
            target.rotation.x = 0.24 + Math.sin(this.time * 5.0) * 0.05;

            if (limbs) {
                if (limbs.leftLeg) limbs.leftLeg.rotation.x = 0;
                if (limbs.rightLeg) limbs.rightLeg.rotation.x = 0;
                if (limbs.leftArm) limbs.leftArm.rotation.x = 0.6 + Math.sin(this.time * 5.0) * 0.15;
                if (limbs.rightArm) limbs.rightArm.rotation.x = 0.6 - Math.sin(this.time * 5.0) * 0.15;
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
            // --- CLEANING ACCIDENT WITH 3D MOP ---
            const mopSweep = Math.sin(this.time * 6.5) * 0.35;
            target.rotation.x = 0.28;
            target.rotation.z = Math.sin(this.time * 6.5) * 0.05;

            if (limbs) {
                if (limbs.leftLeg) limbs.leftLeg.rotation.x = 0;
                if (limbs.rightLeg) limbs.rightLeg.rotation.x = 0;
                if (limbs.leftArm) limbs.leftArm.rotation.x = 0.65 + mopSweep * 0.4;
                if (limbs.rightArm) limbs.rightArm.rotation.x = 0.65 - mopSweep * 0.4;
            }

            if (props) {
                if (props.wand) props.wand.visible = false;
                if (props.towels) props.towels.visible = false;
                if (props.mop) {
                    props.mop.visible = true;
                    props.mop.rotation.z = 0.2 + mopSweep * 0.8;
                }
                if (props.ring) {
                    props.ring.material.color.setHex(0xEF4444);
                    props.ring.material.opacity = 0.75 + Math.sin(this.time * 6.5) * 0.25;
                }
            }

        } else if (isSpeaking || state === 'GOSSIPING') {
            // --- TALKING / GOSSIPING (CHÉM GIÓ / NÓI XẤU) ---
            const breath = Math.sin(this.time * 3.0) * 0.02;
            target.position.y = breath;
            target.rotation.x = 0;
            target.rotation.z = Math.sin(this.time * 2.5) * 0.03;

            if (limbs) {
                if (limbs.head) {
                    limbs.head.rotation.y = Math.sin(this.time * 3.5) * 0.18;
                    limbs.head.rotation.x = Math.sin(this.time * 4.0) * 0.08;
                }
                if (limbs.leftArm) {
                    limbs.leftArm.rotation.x = 0.5 + Math.sin(this.time * 3.5) * 0.22;
                }
                if (limbs.rightArm) {
                    limbs.rightArm.rotation.x = 0.35 + Math.cos(this.time * 3.0) * 0.20;
                }
                if (limbs.tail) {
                    limbs.tail.rotation.y = Math.sin(this.time * 4.0) * 0.30;
                }
            }

            if (props) {
                if (props.mop) props.mop.visible = false;
                if (props.wand) props.wand.visible = false;
                if (props.towels) props.towels.visible = false;
                if (props.ring) props.ring.material.opacity = 0;
            }

        } else {
            // --- RELAXED IDLE BREATHING ---
            const breath = Math.sin(this.time * 2.2) * 0.018;
            const shift = Math.sin(this.time * 1.1) * 0.022;

            target.position.y = breath;
            target.rotation.x = breath * 0.4;
            target.rotation.z = shift;

            if (limbs) {
                if (limbs.leftLeg) limbs.leftLeg.rotation.x = 0;
                if (limbs.rightLeg) limbs.rightLeg.rotation.x = 0;
                if (limbs.leftArm) limbs.leftArm.rotation.x = Math.sin(this.time * 2.2) * 0.05;
                if (limbs.rightArm) limbs.rightArm.rotation.x = -Math.sin(this.time * 2.2) * 0.05;
                if (limbs.head) limbs.head.rotation.set(0, 0, 0);
                if (limbs.tail) limbs.tail.rotation.y = Math.sin(this.time * 1.5) * 0.12;
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
window.Character3DAnimator = Character3DAnimator;
window.build3DCharacterMesh = build3DCharacterMesh;
window.createCharacterActionProps = createCharacterActionProps;
