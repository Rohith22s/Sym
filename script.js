/* Interactive Web Audio Synthesizer (Space Drone & Warp Jump) */
        let audioCtx = null;
        let isAudioPlaying = false;
        let masterGain = null;
        let droneOsc1 = null, droneOsc2 = null, droneFilter = null;

        function initAudio() {
            if (audioCtx) return;
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();

            masterGain = audioCtx.createGain();
            masterGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            masterGain.connect(audioCtx.destination);

            // Sub low rumble drone
            droneOsc1 = audioCtx.createOscillator();
            droneOsc1.type = 'sawtooth';
            droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A

            droneFilter = audioCtx.createBiquadFilter();
            droneFilter.type = 'lowpass';
            droneFilter.frequency.setValueAtTime(140, audioCtx.currentTime);

            // Shimmering second wave
            droneOsc2 = audioCtx.createOscillator();
            droneOsc2.type = 'sine';
            droneOsc2.frequency.setValueAtTime(110.2, audioCtx.currentTime);

            const droneGain = audioCtx.createGain();
            droneGain.gain.setValueAtTime(0.3, audioCtx.currentTime);

            droneOsc1.connect(droneFilter);
            droneFilter.connect(droneGain);
            droneOsc2.connect(droneGain);
            droneGain.connect(masterGain);

            droneOsc1.start();
            droneOsc2.start();
        }

        function toggleAudio() {
            if (!audioCtx) initAudio();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            isAudioPlaying = !isAudioPlaying;
            if (isAudioPlaying) {
                masterGain.gain.setTargetAtTime(0.25, audioCtx.currentTime, 0.5);
                document.getElementById('audio-label').textContent = 'AUDIO: ON';
                document.getElementById('audio-toggle').classList.add('border-cyan-400', 'text-cyan-300');
            } else {
                masterGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.3);
                document.getElementById('audio-label').textContent = 'AUDIO: OFF';
                document.getElementById('audio-toggle').classList.remove('border-cyan-400', 'text-cyan-300');
            }
        }

        function triggerWarpSound() {
            if (!audioCtx) initAudio();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const warpOsc = audioCtx.createOscillator();
            const warpGain = audioCtx.createGain();
            warpOsc.type = 'sawtooth';

            warpOsc.frequency.setValueAtTime(80, audioCtx.currentTime);
            warpOsc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 1.6);
            warpOsc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 3.0);

            warpGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
            warpGain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.8);
            warpGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.0);

            warpOsc.connect(warpGain);
            warpGain.connect(audioCtx.destination);
            warpOsc.start();
            warpOsc.stop(audioCtx.currentTime + 3.1);
        }

        document.getElementById('audio-toggle').addEventListener('click', toggleAudio);

/* High Performance Procedural Canvas Textures */
        function createSunTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            // Solar base gradients
            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, '#ff9900');
            grad.addColorStop(0.5, '#ff3300');
            grad.addColorStop(1, '#ff8800');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Sun spots and solar flares
            for (let i = 0; i < 700; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const r = Math.random() * 25 + 5;
                const flareGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
                flareGrad.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
                flareGrad.addColorStop(0.4, 'rgba(255, 120, 0, 0.4)');
                flareGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = flareGrad;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            return new THREE.CanvasTexture(canvas);
        }

        function createEarthTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');

            // Deep ocean base
            ctx.fillStyle = '#081734';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Procedural landmass continents
            ctx.fillStyle = '#1e4d2b';
            for (let i = 0; i < 40; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * (canvas.height * 0.7) + canvas.height * 0.15;
                let radius = Math.random() * 120 + 40;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();

                // irregular peninsulas
                for (let j = 0; j < 6; j++) {
                    let subX = x + (Math.random() - 0.5) * radius * 1.5;
                    let subY = y + (Math.random() - 0.5) * radius * 1.5;
                    let subR = radius * (0.3 + Math.random() * 0.4);
                    ctx.fillStyle = '#2d6a4f';
                    ctx.beginPath();
                    ctx.arc(subX, subY, subR, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Golden desert patches
            ctx.fillStyle = '#9c6644';
            for (let i = 0; i < 20; i++) {
                let x = Math.random() * canvas.width;
                let y = (Math.random() * 0.4 + 0.3) * canvas.height;
                ctx.beginPath();
                ctx.arc(x, y, Math.random() * 50 + 20, 0, Math.PI * 2);
                ctx.fill();
            }

            // Polar ice caps
            ctx.fillStyle = '#e2f1ff';
            ctx.fillRect(0, 0, canvas.width, 80);
            ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

            return new THREE.CanvasTexture(canvas);
        }

        function createCloudsTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            for (let i = 0; i < 350; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let r = Math.random() * 40 + 10;
                let cloudGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
                cloudGrad.addColorStop(0, 'rgba(255,255,255,0.7)');
                cloudGrad.addColorStop(0.5, 'rgba(255,255,255,0.3)');
                cloudGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = cloudGrad;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            return new THREE.CanvasTexture(canvas);
        }

        function createSaturnTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            // Horizontal atmospheric bands
            for (let y = 0; y < canvas.height; y++) {
                const n = Math.sin(y * 0.08) * 0.5 + 0.5;
                const r = Math.floor(210 + n * 35);
                const g = Math.floor(180 + n * 30);
                const b = Math.floor(130 + n * 20);
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(0, y, canvas.width, 1);
            }
            return new THREE.CanvasTexture(canvas);
        }

        function createSaturnRingTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');

            const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
            grad.addColorStop(0.0, 'rgba(0,0,0,0)');
            grad.addColorStop(0.15, 'rgba(200, 180, 140, 0.2)');
            grad.addColorStop(0.28, 'rgba(230, 210, 170, 0.9)');
            grad.addColorStop(0.5, 'rgba(160, 140, 110, 0.4)');
            grad.addColorStop(0.52, 'rgba(0, 0, 0, 0)'); // Cassini division
            grad.addColorStop(0.58, 'rgba(220, 200, 160, 0.85)');
            grad.addColorStop(0.85, 'rgba(180, 160, 120, 0.5)');
            grad.addColorStop(0.98, 'rgba(140, 120, 90, 0.1)');
            grad.addColorStop(1.0, 'rgba(0,0,0,0)');

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            return new THREE.CanvasTexture(canvas);
        }

const canvas = document.getElementById('webgl-canvas');
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            powerPreference: "high-performance",
            alpha: false
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x020208, 0.0018);

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 4000);
        camera.position.set(0, 10, 80);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x222638, 1.2);
        scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xffffff, 3.5, 3000);
        sunLight.position.set(-350, 40, -450);
        scene.add(sunLight);

        // --- 1. Multi-layered Deep Space Stars ---
        const starCount = 6000;
        const starGeo = new THREE.BufferGeometry();
        const starPos = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);

        const colorOptions = [
            new THREE.Color(0xffffff),
            new THREE.Color(0x9cd3ff),
            new THREE.Color(0xffeedd),
            new THREE.Color(0x00f0ff),
            new THREE.Color(0xbd00ff)
        ];

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            starPos[i3] = (Math.random() - 0.5) * 3000;
            starPos[i3 + 1] = (Math.random() - 0.5) * 2000;
            starPos[i3 + 2] = (Math.random() - 0.5) * 3500;

            const c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            starColors[i3] = c.r;
            starColors[i3 + 1] = c.g;
            starColors[i3 + 2] = c.b;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

        const starMat = new THREE.PointsMaterial({
            size: 1.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.85
        });
        const starField = new THREE.Points(starGeo, starMat);
        scene.add(starField);

        // --- 2. Warp Streak Particle System ---
        const warpCount = 1800;
        const warpGeo = new THREE.BufferGeometry();
        const warpPositions = new Float32Array(warpCount * 3);
        const warpOrigZ = new Float32Array(warpCount);

        for (let i = 0; i < warpCount; i++) {
            warpPositions[i * 3] = (Math.random() - 0.5) * 60;
            warpPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
            const z = -2000 + Math.random() * 400;
            warpPositions[i * 3 + 2] = z;
            warpOrigZ[i] = z;
        }
        warpGeo.setAttribute('position', new THREE.BufferAttribute(warpPositions, 3));

        const warpMat = new THREE.PointsMaterial({
            color: 0x00f0ff,
            size: 2.2,
            transparent: true,
            opacity: 0.15
        });
        const warpSystem = new THREE.Points(warpGeo, warpMat);
        scene.add(warpSystem);

        // --- 3. THE SUN (SECTION 1/2) ---
        const sunGroup = new THREE.Group();
        sunGroup.position.set(-350, 40, -450);

        const sunGeo = new THREE.SphereGeometry(75, 64, 64);
        const sunMat = new THREE.MeshBasicMaterial({
            map: createSunTexture(),
            color: 0xffddaa
        });
        const sunMesh = new THREE.Mesh(sunGeo, sunMat);
        sunGroup.add(sunMesh);

        // Outer solar coronal glow
        const glowGeo = new THREE.SphereGeometry(88, 32, 32);
        const glowMat = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.8);
                    gl_FragColor = vec4(1.0, 0.45, 0.05, 1.0) * intensity * 1.8;
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });
        const sunGlow = new THREE.Mesh(glowGeo, glowMat);
        sunGroup.add(sunGlow);
        scene.add(sunGroup);

        // --- 4. TERRA - EARTH (SECTION 3) ---
        const earthGroup = new THREE.Group();
        earthGroup.position.set(220, -10, -950);

        const earthGeo = new THREE.SphereGeometry(38, 64, 64);
        const earthMat = new THREE.MeshStandardMaterial({
            map: createEarthTexture(),
            roughness: 0.7,
            metalness: 0.1
        });
        const earthMesh = new THREE.Mesh(earthGeo, earthMat);
        earthGroup.add(earthMesh);

        // Earth atmospheric clouds layer
        const cloudsGeo = new THREE.SphereGeometry(38.8, 48, 48);
        const cloudsMat = new THREE.MeshStandardMaterial({
            map: createCloudsTexture(),
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending
        });
        const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
        earthGroup.add(cloudsMesh);

        // Earth Atmospheric Blue Rim Shader
        const atmosGeo = new THREE.SphereGeometry(41, 32, 32);
        const atmosMat = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    gl_FragColor = vec4(0.15, 0.65, 1.0, 1.0) * intensity * 1.6;
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });
        const earthAtmos = new THREE.Mesh(atmosGeo, atmosMat);
        earthGroup.add(earthAtmos);
        scene.add(earthGroup);

        // --- 5. SATURN & RINGS (SECTION 4) ---
        const saturnGroup = new THREE.Group();
        saturnGroup.position.set(-280, 25, -1550);
        saturnGroup.rotation.z = THREE.MathUtils.degToRad(26.7);
        saturnGroup.rotation.x = THREE.MathUtils.degToRad(12.0);

        const saturnGeo = new THREE.SphereGeometry(45, 64, 64);
        const saturnMat = new THREE.MeshStandardMaterial({
            map: createSaturnTexture(),
            roughness: 0.8
        });
        const saturnMesh = new THREE.Mesh(saturnGeo, saturnMat);
        saturnGroup.add(saturnMesh);

        // Ring geometry
        const ringGeo = new THREE.RingGeometry(60, 115, 128);
        // Correct UV mapping for radial ring
        const pos = ringGeo.attributes.position;
        const uvs = ringGeo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const radius = Math.sqrt(x * x + y * y);
            const u = (radius - 60) / (115 - 60);
            uvs.setXY(i, u, 0.5);
        }
        ringGeo.uvsNeedUpdate = true;

        const ringMat = new THREE.MeshBasicMaterial({
            map: createSaturnRingTexture(),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.95
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        saturnGroup.add(ringMesh);
        scene.add(saturnGroup);

        // Floating Asteroid Belt particles near Saturn
        const debrisCount = 450;
        const debrisGeo = new THREE.BufferGeometry();
        const debrisPos = new Float32Array(debrisCount * 3);
        for (let i = 0; i < debrisCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 65 + Math.random() * 50;
            debrisPos[i * 3] = saturnGroup.position.x + Math.cos(angle) * dist;
            debrisPos[i * 3 + 1] = saturnGroup.position.y + (Math.random() - 0.5) * 8;
            debrisPos[i * 3 + 2] = saturnGroup.position.z + Math.sin(angle) * dist;
        }
        debrisGeo.setAttribute('position', new THREE.BufferAttribute(debrisPos, 3));
        const debrisMat = new THREE.PointsMaterial({
            color: 0xd4c4a8,
            size: 1.4,
            transparent: true,
            opacity: 0.8
        });
        const debrisField = new THREE.Points(debrisGeo, debrisMat);
        scene.add(debrisField);

        // --- 6. WARP SINGULARITY (SECTION 5) ---
        const warpCoreGroup = new THREE.Group();
        warpCoreGroup.position.set(0, 0, -2100);

        const ringGlowGeo = new THREE.TorusGeometry(32, 1.2, 16, 100);
        const ringGlowMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true
        });
        const warpTorus = new THREE.Mesh(ringGlowGeo, ringGlowMat);
        warpCoreGroup.add(warpTorus);

        const warpTorus2 = new THREE.Mesh(
            new THREE.TorusGeometry(22, 0.8, 16, 80),
            new THREE.MeshBasicMaterial({ color: 0xbd00ff, wireframe: true })
        );
        warpCoreGroup.add(warpTorus2);
        scene.add(warpCoreGroup);

gsap.registerPlugin(ScrollTrigger);

        // Flight coordinates along the journey
        const cameraWaypoints = [
            { x: 0,    y: 10,  z: 80,    targetX: 0,    targetY: 0,   targetZ: -100 },  // 0: Launch
            { x: -180, y: 35,  z: -320,  targetX: -350, targetY: 40,  targetZ: -450 },  // 1: Sun
            { x: 120,  y: 0,   z: -840,  targetX: 220,  targetY: -10, targetZ: -950 },  // 2: Earth
            { x: -140, y: 45,  z: -1420, targetX: -280, targetY: 25,  targetZ: -1550 }, // 3: Saturn
            { x: 0,    y: 0,   z: -1980, targetX: 0,    targetY: 0,   targetZ: -2300 }   // 4: Warp Gate
        ];

        let cameraLookAt = new THREE.Vector3(0, 0, -100);
        let currentTargetLook = new THREE.Vector3(0, 0, -100);
        let mouseX = 0, mouseY = 0;
        let isFreeCamActive = false;

        // Smooth mouse gyro parallax
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 12;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 12;
        });

        // Toggle Look Mode
        const freeCamBtn = document.getElementById('camera-free-toggle');
        freeCamBtn.addEventListener('click', () => {
            isFreeCamActive = !isFreeCamActive;
            freeCamBtn.children[1].textContent = isFreeCamActive ? "LOOK MODE: FREE" : "LOOK MODE: GYRO";
            freeCamBtn.children[0].className = isFreeCamActive ? "w-2 h-2 rounded-full bg-cyan-400 animate-pulse" : "w-2 h-2 rounded-full bg-emerald-400";
        });

        // Connect GSAP ScrollTrigger to camera timeline
        const flightTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5,
                onUpdate: (self) => {
                    const prog = self.progress; // 0.0 to 1.0
                    updateTelemetryOnScroll(prog);
                }
            }
        });

        // Interpolate camera through waypoints across 4 intervals
        for (let i = 0; i < cameraWaypoints.length - 1; i++) {
            const current = cameraWaypoints[i];
            const next = cameraWaypoints[i + 1];

            flightTimeline.to(camera.position, {
                x: next.x,
                y: next.y,
                z: next.z,
                ease: "power1.inOut",
                duration: 1
            }, i);

            flightTimeline.to(currentTargetLook, {
                x: next.targetX,
                y: next.targetY,
                z: next.targetZ,
                ease: "power1.inOut",
                duration: 1
            }, i);
        }

        function updateTelemetryOnScroll(progress) {
            // Speed telemetry calculation
            const speed = (0.18 + progress * 8.42).toFixed(2);
            document.getElementById('hud-speed').textContent = `${speed} c`;

            // Active dot navigation indicator
            const sectionIndex = Math.min(Math.floor(progress * 5), 4);
            document.querySelectorAll('.nav-dot').forEach((dot, idx) => {
                if (idx === sectionIndex) {
                    dot.className = "nav-dot w-3 h-3 rounded-full bg-cyan-400 scale-125 shadow-[0_0_10px_#00f0ff] transition-all";
                } else {
                    dot.className = "nav-dot w-3 h-3 rounded-full bg-slate-700 transition-all hover:scale-125";
                }
            });

            // Warp system streaks visibility increases toward section 5
            if (progress > 0.7) {
                warpMat.opacity = (progress - 0.7) * 3.0;
            } else {
                warpMat.opacity = 0.05;
            }

            // Update Galatic Coordinates display
            const raH = Math.floor(18 + progress * 4);
            const decDeg = Math.floor(38 - progress * 24);
            document.getElementById('hud-coordinates').textContent = `RA ${raH}h 36m | DEC +${decDeg}° 12′`;
        }

        function jumpToSection(index) {
            const targetElem = document.getElementById(`sec-${index}`);
            if (targetElem) {
                targetElem.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Warp Button Burst Effect
        let isHyperdriveBoosting = false;
        const warpBtn = document.getElementById('warp-btn');
        warpBtn.addEventListener('click', () => {
            if (isHyperdriveBoosting) return;
            isHyperdriveBoosting = true;
            triggerWarpSound();

            warpBtn.innerHTML = `WARP CONVERGENCE ACTIVE...`;
            warpBtn.classList.add('animate-pulse');

            gsap.to(camera.position, {
                z: "-=350",
                duration: 2.2,
                ease: "power3.in",
                onComplete: () => {
                    gsap.to(camera.position, {
                        z: -1980,
                        duration: 1.5,
                        ease: "power2.out",
                        onComplete: () => {
                            isHyperdriveBoosting = false;
                            warpBtn.innerHTML = `⚡ ENGAGE HYPERDRIVE`;
                            warpBtn.classList.remove('animate-pulse');
                        }
                    });
                }
            });

            gsap.to(warpMat, {
                size: 6.0,
                opacity: 1.0,
                duration: 1.2,
                yoyo: true,
                repeat: 1
            });
        });

// System Clock HUD
        function updateClock() {
            const now = new Date();
            const y = now.getUTCFullYear();
            const m = String(now.getUTCMonth() + 1).padStart(2, '0');
            const d = String(now.getUTCDate()).padStart(2, '0');
            const hh = String(now.getUTCHours()).padStart(2, '0');
            const mm = String(now.getUTCMinutes()).padStart(2, '0');
            const ss = String(now.getUTCSeconds()).padStart(2, '0');
            document.getElementById('hud-clock').textContent = `${y}.${m}.${d} // ${hh}:${mm}:${ss} UTC`;
        }
        setInterval(updateClock, 1000);
        updateClock();

        // Responsive Resize Listener
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Animation Loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();

            // Rotate Celestial Bodies
            sunMesh.rotation.y += 0.002;
            sunGlow.rotation.y += 0.001;

            earthMesh.rotation.y += 0.0035;
            cloudsMesh.rotation.y += 0.0045; // Clouds drift slightly faster

            saturnMesh.rotation.y += 0.005;
            ringMesh.rotation.z += 0.001;
            debrisField.rotation.y += 0.0015;

            warpTorus.rotation.x = elapsedTime * 0.8;
            warpTorus.rotation.y = elapsedTime * 0.6;
            warpTorus2.rotation.z = -elapsedTime * 1.2;

            // Twinkle and drift stars
            starField.rotation.y = elapsedTime * 0.0003;

            // Animate warp particles forward
            const warpPosAttr = warpGeo.attributes.position;
            const positions = warpPosAttr.array;
            const warpSpeedMultiplier = isHyperdriveBoosting ? 90 : 8;

            for (let i = 0; i < warpCount; i++) {
                positions[i * 3 + 2] += warpSpeedMultiplier;
                if (positions[i * 3 + 2] > camera.position.z + 50) {
                    positions[i * 3 + 2] = camera.position.z - 600 - Math.random() * 400;
                }
            }
            warpPosAttr.needsUpdate = true;

            // Camera orientation smoothing
            if (isFreeCamActive) {
                cameraLookAt.x += (currentTargetLook.x + mouseX * 6.0 - cameraLookAt.x) * 0.05;
                cameraLookAt.y += (currentTargetLook.y - mouseY * 6.0 - cameraLookAt.y) * 0.05;
                cameraLookAt.z += (currentTargetLook.z - cameraLookAt.z) * 0.05;
            } else {
                cameraLookAt.x += (currentTargetLook.x + mouseX * 1.5 - cameraLookAt.x) * 0.05;
                cameraLookAt.y += (currentTargetLook.y - mouseY * 1.5 - cameraLookAt.y) * 0.05;
                cameraLookAt.z += (currentTargetLook.z - cameraLookAt.z) * 0.05;
            }
            camera.lookAt(cameraLookAt);

            renderer.render(scene, camera);
        }

        // Initialize on load
        window.onload = function() {
            animate();
            // Trigger initial scroll update
            ScrollTrigger.refresh();
        };

        // =====================================================
// TECHFEST' 26 COUNTDOWN TIMER
// Target: October 17, 2026
// =====================================================

function updateCountdown() {

    // October 17, 2026 - 11:59:59 PM
    const targetDate = new Date("2026-10-17T23:59:59");

    const now = new Date();

    const difference = targetDate - now;

    const countdownElement = document.getElementById("countdown");

    if (!countdownElement) return;

    // If countdown is finished
    if (difference <= 0) {

        countdownElement.innerHTML = "EVENT STARTED";

        return;
    }

    // Calculate time
    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );


    // Add leading zero
    const d = String(days).padStart(2, "0");
    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");


    countdownElement.innerHTML =
        `${d}D : ${h}H : ${m}M : ${s}S`;
}


// Update immediately
updateCountdown();

// Update every second
setInterval(updateCountdown, 1000);
