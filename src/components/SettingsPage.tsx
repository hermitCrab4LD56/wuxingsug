import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Palette, Waves, Zap, Music } from 'lucide-react';
import { useWaterRippleStore } from '../store/waterRippleStore';
import type { ColorTheme, BackgroundTheme, QualityLevel } from '../types/water-ripple';

interface SettingsPageProps {
  onClose: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onClose }) => {
  const { settings, updateSettings } = useWaterRippleStore();
  
  const handleColorThemeChange = (theme: ColorTheme) => {
    updateSettings({ colorTheme: theme });
  };
  
  const handleBackgroundThemeChange = (theme: BackgroundTheme) => {
    updateSettings({ 
      visualSettings: { 
        ...settings.visualSettings, 
        backgroundTheme: theme 
      } 
    });
  };

  const handleQualityChange = (quality: QualityLevel) => {
    updateSettings({ 
      visualSettings: { 
        ...settings.visualSettings, 
        quality: quality 
      } 
    });
  };
  
  const handleAudioToggle = () => {
    updateSettings({
      audioSettings: {
        ...settings.audioSettings,
        enabled: !settings.audioSettings.enabled
      }
    });
  };
  
  const handleBackgroundMusicToggle = () => {
    updateSettings({
      audioSettings: {
        ...settings.audioSettings,
        backgroundMusicEnabled: !settings.audioSettings.backgroundMusicEnabled
      }
    });
  };
  
  const handleMasterVolumeChange = (volume: number) => {
    updateSettings({
      audioSettings: {
        ...settings.audioSettings,
        masterVolume: volume
      }
    });
  };
  
  const handleBackgroundVolumeChange = (volume: number) => {
    updateSettings({
      audioSettings: {
        ...settings.audioSettings,
        backgroundVolume: volume
      }
    });
  };
  
  const handleEffectsVolumeChange = (volume: number) => {
    updateSettings({
      audioSettings: {
        ...settings.audioSettings,
        effectsVolume: volume
      }
    });
  };
  
  const handleRippleIntensityChange = (intensity: number) => {
    updateSettings({ rippleIntensity: intensity });
  };
  
  const handleWaveSpeedChange = (speed: number) => {
    updateSettings({ 
      visualSettings: { 
        ...settings.visualSettings, 
        waveSpeed: speed 
      } 
    });
  };
  
  const handleLightIntensityChange = (intensity: number) => {
    updateSettings({ lightIntensity: intensity });
  };
  
  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>返回</span>
          </button>
          <h1 className="text-2xl font-bold text-white">设置</h1>
          <div className="w-16"></div>
        </div>
        
        <div className="max-w-2xl mx-auto space-y-8">
          {/* 音效设置 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Volume2 className="text-blue-400" size={24} />
              <h2 className="text-xl font-semibold text-white">音效设置</h2>
            </div>
            
            {/* 音效总开关 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/80">启用音效</span>
              <button
                onClick={handleAudioToggle}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.audioSettings.enabled ? 'bg-blue-500' : 'bg-gray-600'
                } relative`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  settings.audioSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
            
            {settings.audioSettings.enabled && (
              <>
                {/* 背景音乐开关 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Music size={16} className="text-green-400" />
                    <span className="text-white/80">背景音乐</span>
                  </div>
                  <button
                    onClick={handleBackgroundMusicToggle}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.audioSettings.backgroundMusicEnabled ? 'bg-green-500' : 'bg-gray-600'
                    } relative`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      settings.audioSettings.backgroundMusicEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
                
                {/* 主音量 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">主音量</span>
                    <span className="text-white/60 text-sm">{Math.round(settings.audioSettings.masterVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.audioSettings.masterVolume}
                    onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                {/* 背景音乐音量 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">背景音乐音量</span>
                    <span className="text-white/60 text-sm">{Math.round(settings.audioSettings.backgroundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.audioSettings.backgroundVolume}
                    onChange={(e) => handleBackgroundVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                {/* 交互音效音量 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">交互音效音量</span>
                    <span className="text-white/60 text-sm">{Math.round(settings.audioSettings.effectsVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.audioSettings.effectsVolume}
                    onChange={(e) => handleEffectsVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </>
            )}
          </div>
          
          {/* 视觉效果设置 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="text-purple-400" size={24} />
              <h2 className="text-xl font-semibold text-white">视觉效果</h2>
            </div>
            
            {/* 色彩主题 */}
            <div className="mb-6">
              <h3 className="text-white/80 mb-3">色彩主题</h3>
              <div className="grid grid-cols-3 gap-3">
                {(['ocean', 'lake', 'sunset'] as ColorTheme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleColorThemeChange(theme)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.colorTheme === theme
                        ? 'border-blue-400 bg-blue-400/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <div className={`w-full h-8 rounded mb-2 ${
                      theme === 'ocean' ? 'bg-gradient-to-r from-blue-600 to-cyan-400' :
                      theme === 'lake' ? 'bg-gradient-to-r from-green-600 to-teal-400' :
                      'bg-gradient-to-r from-orange-600 to-pink-400'
                    }`}></div>
                    <span className="text-white/80 text-sm capitalize">{theme}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* 背景主题 */}
            <div className="mb-6">
              <h3 className="text-white/80 mb-3">背景主题</h3>
              <div className="grid grid-cols-2 gap-3">
                {(['stream', 'ocean', 'rain', 'forest'] as BackgroundTheme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleBackgroundThemeChange(theme)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.visualSettings.backgroundTheme === theme
                        ? 'border-green-400 bg-green-400/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <Waves className={`mx-auto mb-2 ${
                      theme === 'stream' ? 'text-blue-400' : 'text-green-400'
                    }`} size={20} />
                    <span className="text-white/80 text-sm capitalize">
                      {theme === 'stream' ? '溪流' : theme === 'ocean' ? '海洋' : theme === 'rain' ? '雨声' : '森林'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* 渲染质量 */}
            <div className="mb-6">
              <h3 className="text-white/80 mb-3">渲染质量</h3>
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as QualityLevel[]).map((quality) => (
                  <button
                    key={quality}
                    onClick={() => handleQualityChange(quality)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.visualSettings.quality === quality
                        ? 'border-yellow-400 bg-yellow-400/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <span className="text-white/80 text-sm capitalize">
                      {quality === 'low' ? '低' : quality === 'medium' ? '中' : '高'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* 效果参数 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="text-yellow-400" size={24} />
              <h2 className="text-xl font-semibold text-white">效果参数</h2>
            </div>
            
            {/* 涟漪强度 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80">涟漪强度</span>
                <span className="text-white/60 text-sm">{Math.round(settings.rippleIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={settings.rippleIntensity}
                onChange={(e) => handleRippleIntensityChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            {/* 波浪速度 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80">波浪速度</span>
                <span className="text-white/60 text-sm">{Math.round(settings.visualSettings.waveSpeed * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={settings.visualSettings.waveSpeed}
                onChange={(e) => handleWaveSpeedChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            {/* 光线强度 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80">光线强度</span>
                <span className="text-white/60 text-sm">{Math.round(settings.lightIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={settings.lightIntensity}
                onChange={(e) => handleLightIntensityChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      </div>
      

    </div>
  );
};