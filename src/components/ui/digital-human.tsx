"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Slider } from './slider';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { useToast } from './use-toast';

interface DigitalHumanProps {
  className?: string;
}

interface AnimationAction {
  name: string;
  action: THREE.AnimationAction;
}

interface ModelInfo {
  name: string;
  url: string;
  scale?: number;
  position?: [number, number, number];
}

// 模型资源配置
const MODELS: ModelInfo[] = [
  {
    name: "机器人表情模型",
    url: "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb",
    scale: 0.8,
    position: [0, 0, 0]
  }
];

export function DigitalHuman({ className }: DigitalHumanProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const modelRef = useRef<THREE.Group | null>(null);
  const loaderRef = useRef<GLTFLoader | null>(null);
  const animationIdRef = useRef<number | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].name);
  const [animations, setAnimations] = useState<AnimationAction[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState<string>('');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [modelScale, setModelScale] = useState(1);
  
  const { toast } = useToast();

  // 初始化3D场景
  const initScene = useCallback(() => {
    if (!mountRef.current) return false;

    try {
      console.log('初始化3D场景...');
      
      // 创建场景
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8f8f8);  // 更亮的背景颜色
      sceneRef.current = scene;

      // 创建相机
      const camera = new THREE.PerspectiveCamera(
        75,  // 增加视野角度
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(3, 3, 5);  // 调整初始相机位置
      cameraRef.current = camera;

      // 创建渲染器
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0xf8f8f8, 1);  // 与背景颜色保持一致
      rendererRef.current = renderer;

      // 创建轨道控制
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 1, 0);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.enablePan = true;
      controls.enableRotate = true;
      controlsRef.current = controls;

      // 添加更强的光照系统
      const ambientLight = new THREE.AmbientLight(0x606060, 1.2);  // 大幅增强环境光亮度和颜色
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);  // 大幅增强主光源
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.1;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.camera.left = -10;
      directionalLight.shadow.camera.right = 10;
      directionalLight.shadow.camera.top = 10;
      directionalLight.shadow.camera.bottom = -10;
      scene.add(directionalLight);
      
      // 添加多个强光源提供全方位照明
      const pointLight1 = new THREE.PointLight(0xffffff, 1.0, 100);  // 增强第一个点光源
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);
      
      const pointLight2 = new THREE.PointLight(0xffffff, 0.8, 100);  // 增强第二个点光源
      pointLight2.position.set(-5, 3, 3);
      scene.add(pointLight2);
      
      // 添加背面光源减少阴影
      const pointLight3 = new THREE.PointLight(0xffffff, 0.6, 100);
      pointLight3.position.set(0, 5, -5);
      scene.add(pointLight3);
      
      // 添加侧面光源
      const pointLight4 = new THREE.PointLight(0xffffff, 0.5, 100);
      pointLight4.position.set(-5, 3, -3);
      scene.add(pointLight4);
      
      // 增强半球光整体亮度
      const hemisphereLight = new THREE.HemisphereLight(0xffffdd, 0x202040, 0.6);  // 增强半球光强度
      scene.add(hemisphereLight);
      
      // 添加补光灯减少深色区域
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
      fillLight.position.set(-10, 5, -5);
      scene.add(fillLight);

      // 添加地面，使用更亮的材质
      const groundGeometry = new THREE.PlaneGeometry(20, 20);
      const groundMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf8f8f8,  // 更亮的颜色
        shininess: 30,    // 添加一些光泽
        specular: 0x404040 // 添加高光反射
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // 将渲染器添加到DOM
      mountRef.current.appendChild(renderer.domElement);

      // 初始化GLTFLoader
      loaderRef.current = new GLTFLoader();
      
      console.log('3D场景初始化完成');
      return true;
    } catch (error) {
      console.error('3D场景初始化失败:', error);
      toast({
        variant: "destructive",
        title: "初始化失败",
        description: "无法初始化3D渲染环境"
      });
      return false;
    }
  }, [toast]);

  // 渲染循环
  const animate = useCallback(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    const delta = clockRef.current.getDelta();

    // 更新动画混合器
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // 更新控制器
    if (controlsRef.current) {
      controlsRef.current.update();
    }

    // 强制更新渲染器状态
    if (rendererRef.current) {
      rendererRef.current.setRenderTarget(null);
    }

    // 渲染场景
    rendererRef.current.render(sceneRef.current, cameraRef.current);

    animationIdRef.current = requestAnimationFrame(animate);
  }, []);

  // 加载3D模型
  const loadModel = useCallback(async (modelName: string) => {
    if (!loaderRef.current || !sceneRef.current) {
      console.error('GLTFLoader或场景未初始化');
      return;
    }

    const modelInfo = MODELS.find(m => m.name === modelName);
    if (!modelInfo) {
      console.error('未找到模型信息:', modelName);
      return;
    }

    setLoading(true);
    setLoadingProgress(0);
    
    try {
      console.log('开始加载模型:', modelInfo.url);

      // 清除现有动画
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
      setAnimations([]);
      setCurrentAnimation('');

      // 加载模型
      const gltf = await new Promise<GLTF>((resolve, reject) => {
        loaderRef.current!.load(
          modelInfo.url,
          (gltf) => {
            setLoadingProgress(100);
            resolve(gltf);
          },
          (progress) => {
            if (progress.lengthComputable) {
              const percentComplete = (progress.loaded / progress.total) * 100;
              setLoadingProgress(Math.round(percentComplete));
              console.log('加载进度:', Math.round(percentComplete) + '%');
            }
          },
          (error) => {
            console.error('模型加载失败:', error);
            reject(error);
          }
        );
      });

      console.log('模型加载成功，开始处理...', gltf);

      // 处理模型
      const model = gltf.scene;
      
      // 设置模型属性
      model.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).castShadow = true;
          (child as THREE.Mesh).receiveShadow = true;
        }
      });

      // 设置模型缩放（先设置缩放）
      const scale = modelInfo.scale || 0.8;
      model.scale.setScalar(scale);
      
      // 计算边界框并设置位置（只计算一次）
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // 清除现有模型
      if (modelRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current = null;
      }
      
      // 设置模型位置（底部贴地，居中）
      model.position.set(
        -center.x,    // X轴居中
        -box.min.y,   // 底部贴地
        -center.z     // Z轴居中
      );
      
      // 立即添加到场景并设置为当前模型
      sceneRef.current.add(model);
      modelRef.current = model;
      
      console.log('模型已添加到场景，尺寸:', size);
      console.log('模型位置:', model.position);
      console.log('模型缩放:', model.scale);
      
      // 立即强制渲染一帧
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        console.log('强制渲染完成');
      }
      
      // 异步调整相机位置（不阻塞显示）
      setTimeout(() => {
        if (cameraRef.current && controlsRef.current) {
          const maxDimension = Math.max(size.x, size.y, size.z);
          const distance = maxDimension * 2.5;
          
          cameraRef.current.position.set(
            distance * 0.8,
            distance * 0.6,
            distance * 1.2
          );
          
          controlsRef.current.target.set(0, size.y * 0.4, 0);
          controlsRef.current.update();
          
          console.log('相机位置已调整:', cameraRef.current.position);
        }
      }, 0); // 使用 setTimeout 0 异步执行

      // 处理动画
      if (gltf.animations && gltf.animations.length > 0) {
        console.log('发现动画:', gltf.animations.map((anim: THREE.AnimationClip) => anim.name));
        
        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;

        const animationActions: AnimationAction[] = gltf.animations.map((clip: THREE.AnimationClip) => ({
          name: clip.name,
          action: mixer.clipAction(clip)
        }));

        setAnimations(animationActions);

        // 播放第一个动画
        if (animationActions.length > 0) {
          const firstAnimation = animationActions[0];
          firstAnimation.action.play();
          setCurrentAnimation(firstAnimation.name);
          console.log('开始播放动画:', firstAnimation.name);
        }
      }

      toast({
        title: "模型加载成功",
        description: `已成功加载 ${modelName}`
      });

      console.log('模型渲染完成');
      
    } catch (error) {
      console.error('加载模型时发生错误:', error);
      toast({
        variant: "destructive",
        title: "加载失败",
        description: "无法加载选中的模型"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 切换动画
  const switchAnimation = useCallback((animationName: string) => {
    if (!mixerRef.current) return;

    const targetAnimation = animations.find(anim => anim.name === animationName);
    if (!targetAnimation) return;

    // 停止当前动画
    animations.forEach(anim => {
      anim.action.stop();
    });

    // 播放新动画
    targetAnimation.action.reset().play();
    setCurrentAnimation(animationName);

    console.log('切换到动画:', animationName);
  }, [animations]);

  // 调整动画速度
  const adjustAnimationSpeed = useCallback((speed: number) => {
    if (!mixerRef.current) return;

    animations.forEach(anim => {
      anim.action.timeScale = speed;
    });
    setAnimationSpeed(speed);
  }, [animations]);

  // 调整模型缩放
  const adjustModelScale = useCallback((scale: number) => {
    if (!modelRef.current) return;

    modelRef.current.scale.setScalar(scale);
    setModelScale(scale);
  }, []);

  // 窗口大小调整处理
  const handleResize = useCallback(() => {
    if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(width, height);
  }, []);

  // 组件初始化
  useEffect(() => {
    const initialized = initScene();
    if (initialized) {
      animate();
      
      // 1秒后开始加载模型
      setTimeout(() => {
        console.log('开始加载模型...');
        loadModel(selectedModel);
      }, 1000);
    }

    // 添加窗口大小调整监听
    window.addEventListener('resize', handleResize);

    return () => {
      // 清理资源
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      window.removeEventListener('resize', handleResize);

      // 清理DOM
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [initScene, animate, handleResize, loadModel, selectedModel]);

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* 控制面板 */}
      <Card>
        <CardHeader>
          <CardTitle>数字人控制面板</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 模型选择 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">选择模型</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="选择数字人模型" />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((model) => (
                  <SelectItem key={model.name} value={model.name}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => loadModel(selectedModel)} 
              disabled={loading}
              className="w-full"
            >
              {loading ? `加载中... ${loadingProgress}%` : '加载模型'}
            </Button>
          </div>

          {/* 动画控制 */}
          {animations.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">动画控制</label>
              <Select value={currentAnimation} onValueChange={switchAnimation}>
                <SelectTrigger>
                  <SelectValue placeholder="选择动画" />
                </SelectTrigger>
                <SelectContent>
                  {animations.map((anim) => (
                    <SelectItem key={anim.name} value={anim.name}>
                      {anim.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 动画速度控制 */}
          {animations.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                动画速度: {animationSpeed.toFixed(1)}x
              </label>
              <Slider
                value={[animationSpeed]}
                onValueChange={(values) => adjustAnimationSpeed(values[0])}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>
          )}

          {/* 模型缩放控制 */}
          {modelRef.current && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                模型缩放: {modelScale.toFixed(1)}x
              </label>
              <Slider
                value={[modelScale]}
                onValueChange={(values) => adjustModelScale(values[0])}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3D视图容器 */}
      <Card>
        <CardContent className="p-0">
          <div 
            ref={mountRef} 
            className="w-full h-96 bg-gray-100 relative rounded-lg overflow-hidden"
            style={{ minHeight: '400px' }}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white z-10">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">加载中...</div>
                  <div className="text-sm">{loadingProgress}%</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 操作提示 */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600 space-y-1">
            <p>• 鼠标左键拖拽：旋转视角</p>
            <p>• 鼠标右键拖拽：平移视角</p>
            <p>• 鼠标滚轮：缩放视图</p>
            <p>• 使用控制面板调整模型和动画参数</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}