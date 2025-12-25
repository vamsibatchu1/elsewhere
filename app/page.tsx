'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import Lottie from 'lottie-react';
import { getAllWorlds } from '@/data/worlds';
import { World } from '@/types/world';
import { useWorldState } from '@/hooks/useWorldState';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

// Helper to get icon component by name
function getIcon(iconName: string) {
  const IconComponent = (Icons as any)[iconName] as React.ComponentType<{ className?: string; size?: number }>;
  return IconComponent || Icons.Circle;
}

export default function Home() {
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [audiowaveAnimation, setAudiowaveAnimation] = useState<any>(null);
  const worlds = getAllWorlds();
  const selectedWorld = selectedWorldId 
    ? worlds.find(w => w.id === selectedWorldId) || null 
    : null;
  
  const { worldState, toggleLayer, setLayerVolume, applyPreset } = useWorldState(selectedWorld);
  const { isReady, resume } = useAudioEngine();

  // Load Lottie animation data
  useEffect(() => {
    fetch('/lottie/audiowave.json')
      .then((res) => res.json())
      .then((data) => setAudiowaveAnimation(data))
      .catch((err) => console.error('Failed to load Lottie animation:', err));
  }, []);

  // Handle Enter key to start
  useEffect(() => {
    if (!showLanding) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        // Default to Subway
        const subwayWorld = worlds.find(w => w.id === 'subway-moving-train');
        if (subwayWorld) {
          setSelectedWorldId(subwayWorld.id);
          setShowLanding(false);
          // Resume audio context on first interaction
          if (!isReady) {
            resume();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showLanding, worlds, isReady, resume]);

  // Group worlds by section
  const worldsBySection = useMemo(() => {
    const realistic = worlds.filter(w => w.section === 'realistic');
    const fictional = worlds.filter(w => w.section === 'fictional');
    return { realistic, fictional };
  }, [worlds]);

  const handleWorldSelect = (worldId: string) => {
    setSelectedWorldId(worldId);
    setShowLanding(false);
    // Resume audio context on first interaction
    if (!isReady) {
      resume();
    }
  };

  // Show landing page
  if (showLanding) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="text-center">
          {/* Elsewhere Title */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="text-9xl font-normal font-newyorker mb-5"
          >
            Elsewhere
          </motion.h1>
          
          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
            className="text-xl font-cormorant text-gray-400 mb-5"
          >
            Transport yourself to wherever to get the best work done
          </motion.p>
          
          {/* Audio Wave Animation */}
          {audiowaveAnimation && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
              className="w-64 h-64 mx-auto mb-5 -mt-[80px]"
            >
              <Lottie 
                animationData={audiowaveAnimation}
                loop={true}
                autoplay={true}
                className="w-full h-full"
              />
            </motion.div>
          )}
          
          {/* Hit Enter to Continue */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.7, ease: "easeOut" }}
            className="text-sm font-mono text-gray-500"
          >
            Hit enter to continue
          </motion.p>
        </div>
      </div>
    );
  }

  // If no world selected, show selection screen
  if (!selectedWorld) {
    return (
      <div className="flex min-h-screen w-full">
        {/* Left Navigation */}
        <aside className="w-64 bg-black p-6 flex items-center">
          <div className="w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-normal text-white font-newyorker mb-4">Elsewhere</h2>
            </div>
            
            <div className="space-y-6">
              {/* Realistic Section */}
              <div>
                <h3 className="text-xs text-gray-400 font-mono mb-3 uppercase">Realistic</h3>
                <div className="space-y-2">
                  {worldsBySection.realistic.map((world) => {
                    const Icon = getIcon(world.iconName);
                    return (
                      <Card
                        key={world.id}
                        className={cn(
                          "cursor-pointer transition-all rounded-none bg-transparent border-gray-800 border border-dashed"
                        )}
                        onClick={() => handleWorldSelect(world.id)}
                      >
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-normal flex items-center gap-2 font-mono text-white">
                            {Icon && <Icon size={16} className="text-gray-400" />}
                            {world.shortName}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Fictional Section */}
              <div>
                <h3 className="text-xs text-gray-400 font-mono mb-3 uppercase">Fictional</h3>
                <div className="space-y-2">
                  {worldsBySection.fictional.map((world) => {
                    const Icon = getIcon(world.iconName);
                    return (
                      <Card
                        key={world.id}
                        className={cn(
                          "cursor-pointer transition-all rounded-none bg-transparent border-gray-800 border border-dashed"
                        )}
                        onClick={() => handleWorldSelect(world.id)}
                      >
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-normal flex items-center gap-2 font-mono text-white">
                            {Icon && <Icon size={16} className="text-gray-400" />}
                            {world.shortName}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4">Elsewhere</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Realistic ambient environments to help you feel present and focused
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {worlds.map((world) => {
                const Icon = getIcon(world.iconName);
                return (
                  <Card
                    key={world.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleWorldSelect(world.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                        <CardTitle>{world.name}</CardTitle>
                      </div>
                      <CardDescription>{world.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {world.layers.length} sound layers
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // World selected - show three-column layout
  const SelectedIcon = getIcon(selectedWorld.iconName);

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Navigation */}
      <aside className="w-64 bg-black p-6 flex items-center">
        <div className="w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-normal text-white font-newyorker mb-4">Elsewhere</h2>
          </div>
          
          <div className="space-y-6">
            {/* Realistic Section */}
            <div>
              <h3 className="text-xs text-gray-400 font-mono mb-3 uppercase">Realistic</h3>
              <div className="space-y-2">
                {worldsBySection.realistic.map((world) => {
                  const Icon = getIcon(world.iconName);
                  const isActive = selectedWorldId === world.id;
                  return (
                    <Card
                      key={world.id}
                      className={cn(
                        "cursor-pointer transition-all rounded-none bg-transparent",
                        isActive
                          ? "border-gray-400 border"
                          : "border-gray-800 border border-dashed"
                      )}
                      onClick={() => handleWorldSelect(world.id)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-normal flex items-center gap-2 font-mono text-white">
                          {Icon && <Icon size={16} className="text-gray-400" />}
                          {world.shortName}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Fictional Section */}
            <div>
              <h3 className="text-xs text-gray-400 font-mono mb-3 uppercase">Fictional</h3>
              <div className="space-y-2">
                {worldsBySection.fictional.map((world) => {
                  const Icon = getIcon(world.iconName);
                  const isActive = selectedWorldId === world.id;
                  return (
                    <Card
                      key={world.id}
                      className={cn(
                        "cursor-pointer transition-all rounded-none bg-transparent",
                        isActive
                          ? "border-gray-400 border"
                          : "border-gray-800 border border-dashed"
                      )}
                      onClick={() => handleWorldSelect(world.id)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-normal flex items-center gap-2 font-mono text-white">
                          {Icon && <Icon size={16} className="text-gray-400" />}
                          {world.shortName}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1">
          <div className="flex h-screen">
            {/* Main Content Area - 70% */}
            <main className="flex-[0.7] p-8 overflow-y-auto bg-black text-white">
              <div className="max-w-4xl mx-auto text-center">
                <div className="mb-8">
                  <div className="mb-2">
                    <h1 className="text-4xl font-normal text-white font-newyorker">
                      {selectedWorld.name.includes('–') 
                        ? selectedWorld.name.split('–')[1].trim() 
                        : selectedWorld.name}
                    </h1>
                  </div>
                  <p className="text-gray-400 text-lg font-cormorant">{selectedWorld.description}</p>
                </div>

              </div>
            </main>

            {/* Right Sidebar - Sound Layer Controls - 30% */}
            <aside className="flex-[0.3] bg-black p-6 overflow-y-auto flex items-center">

            {worldState && (
              <div className="space-y-4 w-full">
                {selectedWorld.layers.map((layer) => {
                  const layerState = worldState.layerStates[layer.id];
                  if (!layerState) return null;

                  const isActive = layerState.enabled;
                  const LayerIcon = layer.iconName ? getIcon(layer.iconName) : null;

                  return (
                    <Card
                      key={layer.id}
                      className={cn(
                        "cursor-pointer transition-all rounded-none bg-transparent",
                        isActive 
                          ? "" 
                          : "border-gray-800 border border-dashed"
                      )}
                      onClick={() => toggleLayer(layer.id)}
                    >
                      <div className="flex items-center">
                        {/* Column 1: Icon, Header - Always visible */}
                        <div className="flex-1 p-4">
                          <CardHeader className="p-0">
                            <CardTitle className="text-sm font-normal flex items-center gap-2 font-mono text-white">
                              {LayerIcon && <LayerIcon size={16} className="text-gray-400" />}
                              {layer.name}
                            </CardTitle>
                            {!isActive && layer.description && (
                              <CardDescription className="text-xs mt-1 text-gray-400">
                                {layer.description}
                              </CardDescription>
                            )}
                          </CardHeader>
                        </div>

                        {/* Column 2: Audio Wave Animation - Only visible when active */}
                        {isActive && audiowaveAnimation && (
                          <div className="flex-shrink-0 w-20 h-20 p-2">
                            <Lottie 
                              animationData={audiowaveAnimation}
                              loop={true}
                              autoplay={true}
                              className="w-full h-full"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Volume Control - Only visible when active */}
                      {isActive && (
                        <div className="px-4 pb-4 pt-0" onClick={(e) => e.stopPropagation()}>
                          <Slider
                            value={[layerState.volume]}
                            onValueChange={(value) => {
                              setLayerVolume(layer.id, value[0]);
                            }}
                            min={0}
                            max={1}
                            step={0.01}
                            className="w-full"
                          />
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
