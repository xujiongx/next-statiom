"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, ZoomIn, ZoomOut, Info, Play, Pause, Settings, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { lungMeridianAcupoints, lungMeridianPath, modelConfig, type Acupoint3D } from './const';

// Three.js 组件（优化版本）
const ThreeScene = ({
    selectedAcupoint,
    onAcupointClick,
    showMeridianPath,
    showLabels,
    animationSpeed,
    modelOpacity,
    cameraPosition
}: {
    selectedAcupoint: Acupoint3D | null;
    onAcupointClick: (acupoint: Acupoint3D) => void;
    showMeridianPath: boolean;
    showLabels: boolean;
    animationSpeed: number;
    modelOpacity: number;
    cameraPosition: { x: number; y: number; z: number };
}) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<any>(null);
    const rendererRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);
    const acupointMeshesRef = useRef<any[]>([]);
    const meridianLineRef = useRef<any>(null);
    const bodyMeshRef = useRef<any>(null);
    const animationIdRef = useRef<number>(0);
    const controlsRef = useRef<any>(null);
    const isInitializedRef = useRef(false);

    // 检测移动设备
    const isMobile = useMemo(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 768 || 'ontouchstart' in window;
    }, []);

    // 初始化场景（只执行一次）
    useEffect(() => {
        if (typeof window === 'undefined' || isInitializedRef.current) return;

        // 动态导入Three.js
        import('three').then((THREE) => {
            if (!mountRef.current || isInitializedRef.current) return;

            isInitializedRef.current = true;

            // 场景设置
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf8fafc);
            sceneRef.current = scene;

            // 相机设置（移动端优化）
            const camera = new THREE.PerspectiveCamera(
                isMobile ? 60 : modelConfig.camera.fov,
                mountRef.current.clientWidth / mountRef.current.clientHeight,
                modelConfig.camera.near,
                modelConfig.camera.far
            );
            camera.position.set(
                isMobile ? 0 : cameraPosition.x,
                isMobile ? 1 : cameraPosition.y,
                isMobile ? 6 : cameraPosition.z
            );
            cameraRef.current = camera;

            // 渲染器设置（移动端优化）
            const renderer = new THREE.WebGLRenderer({ 
                antialias: !isMobile, // 移动端关闭抗锯齿以提升性能
                alpha: true,
                powerPreference: isMobile ? 'low-power' : 'high-performance'
            });
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
            renderer.shadowMap.enabled = !isMobile; // 移动端关闭阴影
            if (!isMobile) {
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                renderer.toneMapping = THREE.ACESFilmicToneMapping;
                renderer.toneMappingExposure = 1.2;
            }
            mountRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // 光照设置（移动端简化）
            const ambientLight = new THREE.AmbientLight(0xffffff, isMobile ? 0.6 : 0.4);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, isMobile ? 0.6 : 0.8);
            directionalLight.position.set(5, 10, 5);
            if (!isMobile) {
                directionalLight.castShadow = true;
                directionalLight.shadow.mapSize.width = 1024;
                directionalLight.shadow.mapSize.height = 1024;
                directionalLight.shadow.camera.near = 0.5;
                directionalLight.shadow.camera.far = 50;
                directionalLight.shadow.camera.left = -10;
                directionalLight.shadow.camera.right = 10;
                directionalLight.shadow.camera.top = 10;
                directionalLight.shadow.camera.bottom = -10;
            }
            scene.add(directionalLight);

            if (!isMobile) {
                const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
                fillLight.position.set(-5, 5, -5);
                scene.add(fillLight);

                const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
                rimLight.position.set(0, 0, -10);
                scene.add(rimLight);
            }

            // 创建精细化人体模型（移动端简化）
            const createDetailedHumanBody = () => {
                const group = new THREE.Group();

                // 材质设置（移动端简化）
                const bodyMaterial = isMobile 
                    ? new THREE.MeshLambertMaterial({
                        color: new THREE.Color(0xfdbcb4),
                        transparent: true,
                        opacity: modelOpacity
                    })
                    : new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color(0xfdbcb4),
                        roughness: 0.8,
                        metalness: 0.1,
                        clearcoat: 0.1,
                        clearcoatRoughness: 0.8,
                        transparent: true,
                        opacity: modelOpacity,
                        side: THREE.DoubleSide
                    });

                // 创建头部
                const createHead = () => {
                    const headGroup = new THREE.Group();
                    
                    const headGeometry = new THREE.SphereGeometry(0.35, isMobile ? 16 : 32, isMobile ? 16 : 32);
                    headGeometry.scale(1, 1.2, 0.9);
                    const head = new THREE.Mesh(headGeometry, bodyMaterial);
                    head.position.set(0, 1.65, 0);
                    if (!isMobile) {
                        head.castShadow = true;
                        head.receiveShadow = true;
                    }
                    headGroup.add(head);

                    const neckGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.3, isMobile ? 8 : 16);
                    const neck = new THREE.Mesh(neckGeometry, bodyMaterial);
                    neck.position.set(0, 1.25, 0);
                    if (!isMobile) {
                        neck.castShadow = true;
                        neck.receiveShadow = true;
                    }
                    headGroup.add(neck);

                    return headGroup;
                };

                // 创建躯干
                const createTorso = () => {
                    const torsoGroup = new THREE.Group();

                    const chestGeometry = new THREE.CylinderGeometry(0.45, 0.35, 0.8, isMobile ? 16 : 32);
                    const chest = new THREE.Mesh(chestGeometry, bodyMaterial);
                    chest.position.set(0, 0.6, 0);
                    chest.scale.set(1, 1, 0.7);
                    if (!isMobile) {
                        chest.castShadow = true;
                        chest.receiveShadow = true;
                    }
                    torsoGroup.add(chest);

                    const waistGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.4, isMobile ? 16 : 32);
                    const waist = new THREE.Mesh(waistGeometry, bodyMaterial);
                    waist.position.set(0, -0.1, 0);
                    waist.scale.set(1, 1, 0.8);
                    if (!isMobile) {
                        waist.castShadow = true;
                        waist.receiveShadow = true;
                    }
                    torsoGroup.add(waist);

                    const pelvisGeometry = new THREE.CylinderGeometry(0.4, 0.35, 0.3, isMobile ? 16 : 32);
                    const pelvis = new THREE.Mesh(pelvisGeometry, bodyMaterial);
                    pelvis.position.set(0, -0.45, 0);
                    pelvis.scale.set(1, 1, 0.9);
                    if (!isMobile) {
                        pelvis.castShadow = true;
                        pelvis.receiveShadow = true;
                    }
                    torsoGroup.add(pelvis);

                    return torsoGroup;
                };

                // 创建手臂（简化版本）
                const createArm = (side: 'left' | 'right') => {
                    const armGroup = new THREE.Group();
                    const multiplier = side === 'left' ? -1 : 1;
                    const segments = isMobile ? 8 : 16;

                    const shoulderGeometry = new THREE.SphereGeometry(0.15, segments, segments);
                    const shoulder = new THREE.Mesh(shoulderGeometry, bodyMaterial);
                    shoulder.position.set(0.5 * multiplier, 0.8, 0);
                    if (!isMobile) {
                        shoulder.castShadow = true;
                        shoulder.receiveShadow = true;
                    }
                    armGroup.add(shoulder);

                    const upperArmGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.6, segments);
                    const upperArm = new THREE.Mesh(upperArmGeometry, bodyMaterial);
                    upperArm.position.set(0.7 * multiplier, 0.4, 0);
                    upperArm.rotation.z = Math.PI / 8 * multiplier;
                    if (!isMobile) {
                        upperArm.castShadow = true;
                        upperArm.receiveShadow = true;
                    }
                    armGroup.add(upperArm);

                    const elbowGeometry = new THREE.SphereGeometry(0.07, segments, segments);
                    const elbow = new THREE.Mesh(elbowGeometry, bodyMaterial);
                    elbow.position.set(0.9 * multiplier, 0.05, 0);
                    if (!isMobile) {
                        elbow.castShadow = true;
                        elbow.receiveShadow = true;
                    }
                    armGroup.add(elbow);

                    const forearmGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.55, segments);
                    const forearm = new THREE.Mesh(forearmGeometry, bodyMaterial);
                    forearm.position.set(1.15 * multiplier, -0.25, 0);
                    forearm.rotation.z = Math.PI / 12 * multiplier;
                    if (!isMobile) {
                        forearm.castShadow = true;
                        forearm.receiveShadow = true;
                    }
                    armGroup.add(forearm);

                    const wristGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.08, segments);
                    const wrist = new THREE.Mesh(wristGeometry, bodyMaterial);
                    wrist.position.set(1.35 * multiplier, -0.55, 0);
                    if (!isMobile) {
                        wrist.castShadow = true;
                        wrist.receiveShadow = true;
                    }
                    armGroup.add(wrist);

                    const handGeometry = new THREE.BoxGeometry(0.12, 0.18, 0.04);
                    const hand = new THREE.Mesh(handGeometry, bodyMaterial);
                    hand.position.set(1.42 * multiplier, -0.7, 0);
                    if (!isMobile) {
                        hand.castShadow = true;
                        hand.receiveShadow = true;
                    }
                    armGroup.add(hand);

                    // 移动端简化手指
                    if (!isMobile) {
                        for (let i = 0; i < 4; i++) {
                            const fingerGeometry = new THREE.CylinderGeometry(0.01, 0.015, 0.12, 8);
                            const finger = new THREE.Mesh(fingerGeometry, bodyMaterial);
                            finger.position.set(
                                1.42 * multiplier,
                                -0.82,
                                -0.03 + i * 0.02
                            );
                            finger.castShadow = true;
                            armGroup.add(finger);
                        }

                        const thumbGeometry = new THREE.CylinderGeometry(0.012, 0.018, 0.1, 8);
                        const thumb = new THREE.Mesh(thumbGeometry, bodyMaterial);
                        thumb.position.set(1.35 * multiplier, -0.75, 0.06);
                        thumb.rotation.x = Math.PI / 4;
                        thumb.rotation.z = Math.PI / 6 * multiplier;
                        thumb.castShadow = true;
                        armGroup.add(thumb);
                    }

                    return armGroup;
                };

                // 创建腿部
                const createLeg = (side: 'left' | 'right') => {
                    const legGroup = new THREE.Group();
                    const multiplier = side === 'left' ? -1 : 1;
                    const segments = isMobile ? 8 : 16;

                    const thighGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.8, segments);
                    const thigh = new THREE.Mesh(thighGeometry, bodyMaterial);
                    thigh.position.set(0.15 * multiplier, -1.0, 0);
                    if (!isMobile) {
                        thigh.castShadow = true;
                        thigh.receiveShadow = true;
                    }
                    legGroup.add(thigh);

                    const kneeGeometry = new THREE.SphereGeometry(0.1, segments, segments);
                    const knee = new THREE.Mesh(kneeGeometry, bodyMaterial);
                    knee.position.set(0.15 * multiplier, -1.45, 0);
                    if (!isMobile) {
                        knee.castShadow = true;
                        knee.receiveShadow = true;
                    }
                    legGroup.add(knee);

                    const calfGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.8, segments);
                    const calf = new THREE.Mesh(calfGeometry, bodyMaterial);
                    calf.position.set(0.15 * multiplier, -1.9, 0);
                    if (!isMobile) {
                        calf.castShadow = true;
                        calf.receiveShadow = true;
                    }
                    legGroup.add(calf);

                    const ankleGeometry = new THREE.SphereGeometry(0.07, segments, segments);
                    const ankle = new THREE.Mesh(ankleGeometry, bodyMaterial);
                    ankle.position.set(0.15 * multiplier, -2.35, 0);
                    if (!isMobile) {
                        ankle.castShadow = true;
                        ankle.receiveShadow = true;
                    }
                    legGroup.add(ankle);

                    const footGeometry = new THREE.BoxGeometry(0.12, 0.08, 0.25);
                    const foot = new THREE.Mesh(footGeometry, bodyMaterial);
                    foot.position.set(0.15 * multiplier, -2.45, 0.08);
                    if (!isMobile) {
                        foot.castShadow = true;
                        foot.receiveShadow = true;
                    }
                    legGroup.add(foot);

                    return legGroup;
                };

                // 组装身体各部分
                const head = createHead();
                const torso = createTorso();
                const leftArm = createArm('left');
                const rightArm = createArm('right');
                const leftLeg = createLeg('left');
                const rightLeg = createLeg('right');

                group.add(head);
                group.add(torso);
                group.add(leftArm);
                group.add(rightArm);
                group.add(leftLeg);
                group.add(rightLeg);

                return group;
            };

            // 添加人体模型
            const bodyModel = createDetailedHumanBody();
            scene.add(bodyModel);
            bodyMeshRef.current = bodyModel;

            // 创建穴位标记（移动端简化）
            const createAcupointMarker = (acupoint: Acupoint3D, index: number) => {
                const group = new THREE.Group();

                const acupointGeometry = new THREE.SphereGeometry(0.025, isMobile ? 8 : 16, isMobile ? 8 : 16);
                const acupointMaterial = isMobile
                    ? new THREE.MeshLambertMaterial({
                        color: new THREE.Color(0xff6b6b),
                        transparent: true,
                        opacity: 0.9
                    })
                    : new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color(0xff6b6b),
                        emissive: new THREE.Color(0x441111),
                        roughness: 0.3,
                        metalness: 0.1,
                        clearcoat: 0.8,
                        clearcoatRoughness: 0.2,
                        transparent: true,
                        opacity: 0.9
                    });

                const acupointMesh = new THREE.Mesh(acupointGeometry, acupointMaterial);
                acupointMesh.position.set(acupoint.position.x, acupoint.position.y, acupoint.position.z);
                acupointMesh.userData = { acupoint, index };
                if (!isMobile) {
                    acupointMesh.castShadow = true;
                }
                group.add(acupointMesh);

                // 移动端简化效果
                if (!isMobile) {
                    const ringGeometry = new THREE.RingGeometry(0.04, 0.06, 16);
                    const ringMaterial = new THREE.MeshBasicMaterial({
                        color: new THREE.Color(0xff9999),
                        transparent: true,
                        opacity: 0.3,
                        side: THREE.DoubleSide
                    });
                    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                    ring.position.copy(acupointMesh.position);
                    ring.lookAt(cameraRef.current.position);
                    group.add(ring);
                }

                return { group, mesh: acupointMesh };
            };

            // 添加穴位标记
            const acupointObjects: any[] = [];
            lungMeridianAcupoints.forEach((acupoint, index) => {
                const acupointObj = createAcupointMarker(acupoint, index);
                scene.add(acupointObj.group);
                acupointObjects.push(acupointObj);
            });

            acupointMeshesRef.current = acupointObjects.map(obj => obj.mesh);

            // 创建经络路径
            if (showMeridianPath) {
                const pathGeometry = new THREE.BufferGeometry();
                const pathPoints = lungMeridianPath.map(point => new THREE.Vector3(point.x, point.y, point.z));
                pathGeometry.setFromPoints(pathPoints);

                const pathMaterial = new THREE.LineBasicMaterial({
                    color: new THREE.Color(0x3b82f6),
                    transparent: true,
                    opacity: 0.8,
                    linewidth: isMobile ? 2 : 4
                });

                const meridianLine = new THREE.Line(pathGeometry, pathMaterial);
                scene.add(meridianLine);
                meridianLineRef.current = meridianLine;
            }

            // 交互事件（支持触摸）
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            let hoveredObject: any = null;

            const getEventPosition = (event: MouseEvent | TouchEvent) => {
                const rect = renderer.domElement.getBoundingClientRect();
                let clientX, clientY;
                
                if ('touches' in event) {
                    clientX = event.touches[0].clientX;
                    clientY = event.touches[0].clientY;
                } else {
                    clientX = event.clientX;
                    clientY = event.clientY;
                }
                
                return {
                    x: ((clientX - rect.left) / rect.width) * 2 - 1,
                    y: -((clientY - rect.top) / rect.height) * 2 + 1
                };
            };

            const onInteractionMove = (event: MouseEvent | TouchEvent) => {
                if (isMobile) return; // 移动端禁用悬停效果
                
                const pos = getEventPosition(event);
                mouse.x = pos.x;
                mouse.y = pos.y;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(acupointMeshesRef.current);

                if (hoveredObject) {
                    hoveredObject.material.emissive.setHex(0x441111);
                    hoveredObject.scale.set(1, 1, 1);
                    hoveredObject = null;
                    renderer.domElement.style.cursor = 'default';
                }

                if (intersects.length > 0) {
                    hoveredObject = intersects[0].object;
                    hoveredObject.material.emissive.setHex(0x884444);
                    hoveredObject.scale.set(1.2, 1.2, 1.2);
                    renderer.domElement.style.cursor = 'pointer';
                }
            };

            const onInteractionClick = (event: MouseEvent | TouchEvent) => {
                const pos = getEventPosition(event);
                mouse.x = pos.x;
                mouse.y = pos.y;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(acupointMeshesRef.current);

                if (intersects.length > 0) {
                    const clickedMesh = intersects[0].object;
                    const acupoint = clickedMesh.userData.acupoint;
                    onAcupointClick(acupoint);

                    // 高亮选中的穴位
                    acupointMeshesRef.current.forEach(mesh => {
                        mesh.material.emissive.setHex(0x441111);
                        mesh.scale.set(1, 1, 1);
                    });
                    clickedMesh.material.emissive.setHex(0xaa6644);
                    clickedMesh.scale.set(1.5, 1.5, 1.5);
                }
            };

            // 添加事件监听器
            if (!isMobile) {
                renderer.domElement.addEventListener('mousemove', onInteractionMove);
            }
            renderer.domElement.addEventListener('click', onInteractionClick);
            renderer.domElement.addEventListener('touchend', onInteractionClick);

            // 控制器
            import('three/examples/jsm/controls/OrbitControls.js').then(({ OrbitControls }) => {
                const controls = new OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.enableZoom = true;
                controls.enablePan = !isMobile; // 移动端禁用平移
                controls.maxPolarAngle = Math.PI;
                controls.minDistance = isMobile ? 2 : 1.5;
                controls.maxDistance = isMobile ? 10 : 8;
                controls.autoRotate = false;
                controls.autoRotateSpeed = 0.5;
                
                // 移动端触摸优化
                if (isMobile) {
                    controls.touches = {
                        ONE: THREE.TOUCH.ROTATE,
                        TWO: THREE.TOUCH.DOLLY_PAN
                    };
                }
                
                controlsRef.current = controls;

                // 动画循环
                const animate = () => {
                    animationIdRef.current = requestAnimationFrame(animate);
                    controls.update();

                    const time = Date.now() * 0.001 * animationSpeed;

                    // 穴位动画（移动端简化）
                    if (!isMobile) {
                        acupointObjects.forEach((obj, index) => {
                            const scale = 1 + Math.sin(time + index * 0.3) * 0.15;
                            if (obj.mesh !== hoveredObject && obj.mesh.scale.x < 1.3) {
                                obj.mesh.scale.set(scale, scale, scale);
                            }
                        });

                        // 身体轻微摆动
                        if (bodyMeshRef.current) {
                            bodyMeshRef.current.rotation.y = Math.sin(time * 0.2) * 0.02;
                            bodyMeshRef.current.position.y = Math.sin(time * 0.5) * 0.01;
                        }
                    }

                    renderer.render(scene, camera);
                };

                animate();
            });

            // 窗口大小调整
            const handleResize = () => {
                if (!mountRef.current) return;
                
                const width = mountRef.current.clientWidth;
                const height = mountRef.current.clientHeight;
                
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            };

            window.addEventListener('resize', handleResize);

            // 清理函数
            return () => {
                window.removeEventListener('resize', handleResize);
                if (!isMobile) {
                    renderer.domElement.removeEventListener('mousemove', onInteractionMove);
                }
                renderer.domElement.removeEventListener('click', onInteractionClick);
                renderer.domElement.removeEventListener('touchend', onInteractionClick);
                
                if (animationIdRef.current) {
                    cancelAnimationFrame(animationIdRef.current);
                }
                
                if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
                    mountRef.current.removeChild(renderer.domElement);
                }
                
                renderer.dispose();
                scene.clear();
                isInitializedRef.current = false;
            };
        });
    }, []); // 只在组件挂载时执行一次

    // 更新显示状态（不重新创建场景）
    useEffect(() => {
        if (!sceneRef.current) return;

        // 更新经络路径显示
        if (meridianLineRef.current) {
            meridianLineRef.current.visible = showMeridianPath;
        }

        // 更新模型透明度
        if (bodyMeshRef.current) {
            bodyMeshRef.current.traverse((child: any) => {
                if (child.material) {
                    child.material.opacity = modelOpacity;
                }
            });
        }
    }, [showMeridianPath, showLabels, modelOpacity]);

    // 更新选中穴位
    useEffect(() => {
        if (!acupointMeshesRef.current.length) return;

        acupointMeshesRef.current.forEach(mesh => {
            mesh.material.emissive.setHex(0x441111);
            mesh.scale.set(1, 1, 1);
        });

        if (selectedAcupoint) {
            const selectedMesh = acupointMeshesRef.current.find(
                mesh => mesh.userData.acupoint.code === selectedAcupoint.code
            );
            if (selectedMesh) {
                selectedMesh.material.emissive.setHex(0xaa6644);
                selectedMesh.scale.set(1.5, 1.5, 1.5);
            }
        }
    }, [selectedAcupoint]);

    return (
        <div 
            ref={mountRef} 
            className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden shadow-inner"
            style={{ 
                minHeight: isMobile ? '400px' : '600px',
                height: isMobile ? '50vh' : 'auto'
            }}
        />
    );
};

export default function Model3DPage() {
    const [selectedAcupoint, setSelectedAcupoint] = useState<Acupoint3D | null>(null);
    const [showMeridianPath, setShowMeridianPath] = useState(true);
    const [showLabels, setShowLabels] = useState(true);
    const [animationSpeed, setAnimationSpeed] = useState(1);
    const [modelOpacity, setModelOpacity] = useState(0.8);
    const [isPlaying, setIsPlaying] = useState(true);
    const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 5 });
    const [autoRotate, setAutoRotate] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    // 检测移动设备
    useEffect(() => {
        const checkMobile = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleAcupointClick = useCallback((acupoint: Acupoint3D) => {
        setSelectedAcupoint(acupoint);
    }, []);

    const resetCamera = () => {
        setCameraPosition({ x: 0, y: 0, z: 5 });
    };

    const exportModel = () => {
        alert('导出功能开发中...');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            {/* 导航栏 */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/subpackages/tcm/meridian" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                返回经络总览
                            </Link>
                            <div className="h-6 w-px bg-gray-300" />
                            <h1 className="text-xl font-bold text-gray-900 flex items-center">
                                <div className="w-6 h-6 mr-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded" />
                                3D人体模型
                            </h1>
                        </div>

                        <div className="flex items-center space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={resetCamera}>
                                            <RotateCcw className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>重置视角</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <Button variant="outline" size="sm" onClick={exportModel}>
                                <Download className="w-4 h-4 mr-1" />
                                导出
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
                {/* 移动端布局 */}
                {isMobileView ? (
                    <div className="space-y-4">
                        {/* 3D视图 */}
                        <Card className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold flex items-center">
                                    <div className="w-5 h-5 mr-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded" />
                                    手太阴肺经3D模型
                                </h2>
                                <div className="flex items-center space-x-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                    >
                                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            <ThreeScene
                                selectedAcupoint={selectedAcupoint}
                                onAcupointClick={handleAcupointClick}
                                showMeridianPath={showMeridianPath}
                                showLabels={showLabels}
                                animationSpeed={isPlaying ? animationSpeed : 0}
                                modelOpacity={modelOpacity}
                                cameraPosition={cameraPosition}
                            />

                            <div className="mt-2 text-xs text-gray-600 text-center">
                                <p>触摸拖拽旋转视角，双指缩放，点击穴位查看详情</p>
                            </div>
                        </Card>

                        {/* 控制面板 */}
                        <Card className="p-4">
                            <h3 className="text-base font-semibold mb-3 flex items-center">
                                <Settings className="w-4 h-4 mr-2" />
                                显示控制
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">经络路径</label>
                                    <Switch checked={showMeridianPath} onCheckedChange={setShowMeridianPath} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">穴位标签</label>
                                    <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                                </div>
                            </div>

                            <div className="mt-3 space-y-3">
                                <div>
                                    <label className="text-sm font-medium block mb-1">模型透明度: {(modelOpacity * 100).toFixed(0)}%</label>
                                    <Slider
                                        value={[modelOpacity]}
                                        onValueChange={([value]) => setModelOpacity(value)}
                                        min={0.1}
                                        max={1}
                                        step={0.1}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium block mb-1">动画速度: {animationSpeed.toFixed(1)}x</label>
                                    <Slider
                                        value={[animationSpeed]}
                                        onValueChange={([value]) => setAnimationSpeed(value)}
                                        min={0.1}
                                        max={3}
                                        step={0.1}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* 穴位详情 */}
                        {selectedAcupoint && (
                            <Card className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-base font-semibold flex items-center">
                                        <Info className="w-4 h-4 mr-2" />
                                        穴位详情
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedAcupoint(null)}
                                    >
                                        ×
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h4 className="text-lg font-bold">{selectedAcupoint.name}</h4>
                                            <Badge variant="outline">{selectedAcupoint.code}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{selectedAcupoint.pinyin}</p>
                                    </div>

                                    <div>
                                        <h5 className="font-semibold mb-1">解剖位置</h5>
                                        <p className="text-sm text-gray-700">{selectedAcupoint.anatomicalLocation}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <h5 className="font-semibold mb-1 text-sm">针刺深度</h5>
                                            <p className="text-sm text-gray-700">{selectedAcupoint.needleDepth}</p>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold mb-1 text-sm">针刺角度</h5>
                                            <p className="text-sm text-gray-700">{selectedAcupoint.needleAngle}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="font-semibold mb-2">主要功能</h5>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedAcupoint.functions.map((func, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {func}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="font-semibold mb-2">主治病症</h5>
                                        <div className="space-y-1">
                                            {selectedAcupoint.indications.slice(0, 3).map((indication, index) => (
                                                <div key={index} className="text-sm text-gray-700 flex items-center">
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                                    {indication}
                                                </div>
                                            ))}
                                            {selectedAcupoint.indications.length > 3 && (
                                                <div className="text-xs text-gray-500">等{selectedAcupoint.indications.length}项...</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* 穴位列表 */}
                        <Card className="p-4">
                            <h3 className="text-base font-semibold mb-3 flex items-center">
                                <Info className="w-4 h-4 mr-2" />
                                手太阴肺经穴位
                            </h3>

                            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                                {lungMeridianAcupoints.map((acupoint, index) => (
                                    <div
                                        key={acupoint.code}
                                        className={`p-2 border rounded-lg cursor-pointer transition-all duration-200 ${selectedAcupoint?.code === acupoint.code
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        onClick={() => handleAcupointClick(acupoint)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center space-x-1">
                                                    <span className="font-medium text-sm truncate">{acupoint.name}</span>
                                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                                                </div>
                                                <p className="text-xs text-gray-600 truncate">{acupoint.code}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                ) : (
                    /* 桌面端布局 */
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* 左侧控制面板 */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* 显示控制 */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Settings className="w-5 h-5 mr-2" />
                                    显示控制
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">经络路径</label>
                                        <Switch checked={showMeridianPath} onCheckedChange={setShowMeridianPath} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">穴位标签</label>
                                        <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">自动旋转</label>
                                        <Switch checked={autoRotate} onCheckedChange={setAutoRotate} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">模型透明度: {(modelOpacity * 100).toFixed(0)}%</label>
                                        <Slider
                                            value={[modelOpacity]}
                                            onValueChange={([value]) => setModelOpacity(value)}
                                            min={0.1}
                                            max={1}
                                            step={0.1}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">动画速度: {animationSpeed.toFixed(1)}x</label>
                                        <Slider
                                            value={[animationSpeed]}
                                            onValueChange={([value]) => setAnimationSpeed(value)}
                                            min={0.1}
                                            max={3}
                                            step={0.1}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* 穴位列表 */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Info className="w-5 h-5 mr-2" />
                                    手太阴肺经穴位
                                </h3>

                                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {lungMeridianAcupoints.map((acupoint, index) => (
                                        <div
                                            key={acupoint.code}
                                            className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${selectedAcupoint?.code === acupoint.code
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                            onClick={() => handleAcupointClick(acupoint)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium">{acupoint.name}</span>
                                                        <Badge variant="outline" className="text-xs">{acupoint.code}</Badge>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">{acupoint.pinyin}</p>
                                                </div>
                                                <div className="w-2 h-2 bg-red-400 rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* 中间3D视图 */}
                        <div className="lg:col-span-2">
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold flex items-center">
                                        <div className="w-6 h-6 mr-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded" />
                                        手太阴肺经3D模型
                                    </h2>

                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsPlaying(!isPlaying)}
                                        >
                                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        </Button>

                                        <Button variant="outline" size="sm">
                                            <ZoomIn className="w-4 h-4" />
                                        </Button>

                                        <Button variant="outline" size="sm">
                                            <ZoomOut className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <ThreeScene
                                    selectedAcupoint={selectedAcupoint}
                                    onAcupointClick={handleAcupointClick}
                                    showMeridianPath={showMeridianPath}
                                    showLabels={showLabels}
                                    animationSpeed={isPlaying ? animationSpeed : 0}
                                    modelOpacity={modelOpacity}
                                    cameraPosition={cameraPosition}
                                />

                                <div className="mt-4 text-sm text-gray-600 text-center">
                                    <p>使用鼠标拖拽旋转视角，滚轮缩放，点击穴位查看详情</p>
                                </div>
                            </Card>
                        </div>

                        {/* 右侧详情面板 */}
                        <div className="lg:col-span-1">
                            {selectedAcupoint ? (
                                <Card className="p-6 sticky top-24">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold flex items-center">
                                            <Info className="w-5 h-5 mr-2" />
                                            穴位详情
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedAcupoint(null)}
                                        >
                                            ×
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h4 className="text-xl font-bold">{selectedAcupoint.name}</h4>
                                                <Badge variant="outline">{selectedAcupoint.code}</Badge>
                                            </div>
                                            <p className="text-sm text-gray-600">{selectedAcupoint.pinyin}</p>
                                        </div>

                                        <div>
                                            <h5 className="font-semibold mb-2">解剖位置</h5>
                                            <p className="text-sm text-gray-700">{selectedAcupoint.anatomicalLocation}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <h5 className="font-semibold mb-1">针刺深度</h5>
                                                <p className="text-sm text-gray-700">{selectedAcupoint.needleDepth}</p>
                                            </div>
                                            <div>
                                                <h5 className="font-semibold mb-1">针刺角度</h5>
                                                <p className="text-sm text-gray-700">{selectedAcupoint.needleAngle}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="font-semibold mb-2">主要功能</h5>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedAcupoint.functions.map((func, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {func}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="font-semibold mb-2">主治病症</h5>
                                            <div className="space-y-1">
                                                {selectedAcupoint.indications.map((indication, index) => (
                                                    <div key={index} className="text-sm text-gray-700 flex items-center">
                                                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                                        {indication}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedAcupoint.clinicalNotes && (
                                            <div>
                                                <h5 className="font-semibold mb-2">临床要点</h5>
                                                <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
                                                    {selectedAcupoint.clinicalNotes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ) : (
                                <Card className="p-6">
                                    <div className="text-center text-gray-500">
                                        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-50" />
                                        <p>点击3D模型中的穴位查看详细信息</p>
                                        <p className="text-sm mt-2">手太阴肺经共11个穴位</p>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}