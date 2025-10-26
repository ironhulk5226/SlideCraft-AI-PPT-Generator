import React, { useState } from 'react'
import MinWhiteSlider from '../../assets/sliderStyles/Minimalist-White.jpg';
import Professional from '../../assets/sliderStyles/professional.jpg';
import ModernGrad from '../../assets/sliderStyles/modern-gradient.jpg';
import EleDark from '../../assets/sliderStyles/dark.jpg';
import CreativePastel from '../../assets/sliderStyles/pastel-ppt.jpg';
import Tech from '../../assets/sliderStyles/tech.jpg';


export const DesignStyles = [
  {
    "styleName": "Professional Blue 💼",
    "colors": {
      "primary": "#0A66C2",
      "secondary": "#1C1C1C",
      "accent": "#E8F0FE",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #0A66C2, #E8F0FE)"
    },
    "designGuide": "🧠 Create a professional corporate-style presentation with blue and white tones, modern sans-serif fonts, clean layout, and minimal icons. Use subtle gradients and geometric backgrounds for a trustworthy business feel.",
    "icon": "Briefcase",
    "bannerImage": Professional
  },
  {
    "styleName": "Minimal White ⚪",
    "colors": {
      "primary": "#1C1C1C",
      "secondary": "#AAAAAA",
      "accent": "#EDEDED",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #FFFFFF, #EDEDED)"
    },
    "designGuide": "🧠 Generate a minimalist slide deck with white backgrounds, black text, and light grey accents. Keep layouts clean, use lots of whitespace, and apply simple typography for a calm, elegant aesthetic.",
    "icon": "Square",
    "bannerImage": MinWhiteSlider
  },
  {
    "styleName": "Modern Gradient 🌈",
    "colors": {
      "primary": "#8A2BE2",
      "secondary": "#00C9FF",
      "accent": "#92FE9D",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #8A2BE2, #00C9FF, #92FE9D)"
    },
    "designGuide": "🧠 Design a modern gradient-style PPT with vibrant gradient backgrounds, glassmorphism overlays, and smooth transitions. Use modern typography and bright gradients for an innovative, tech-savvy vibe.",
    "icon": "Sparkles",
    "bannerImage": ModernGrad
  },
  {
    "styleName": "Elegant Dark 🖤",
    "colors": {
      "primary": "#0D0D0D",
      "secondary": "#1F1F1F",
      "accent": "#FFD700",
      "background": "#0D0D0D",
      "gradient": "linear-gradient(135deg, #0D0D0D, #1F1F1F)"
    },
    "designGuide": "🧠 Create a luxury-style dark presentation with black and gold accents, serif fonts, and subtle lighting effects. Keep it premium, cinematic, and elegant.",
    "icon": "Star",
    "bannerImage": EleDark
  },
  {
    "styleName": "Creative Pastel 🎨",
    "colors": {
      "primary": "#F6D6FF",
      "secondary": "#A0E7E5",
      "accent": "#B4F8C8",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #F6D6FF, #A0E7E5, #B4F8C8)"
    },
    "designGuide": "🧠 Build a creative pastel-style presentation with soft tones, rounded shapes, and hand-drawn illustrations. Ideal for design portfolios or fun workshops.",
    "icon": "Palette",
    "bannerImage": CreativePastel
  },
  {
    "styleName": "Startup Pitch 🚀",
    "colors": {
      "primary": "#0052CC",
      "secondary": "#36B37E",
      "accent": "#172B4D",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #0052CC, #36B37E)"
    },
    "designGuide": "🧠 Design a sleek startup pitch deck with blue-green tones, bold headings, clean data charts, and a clear problem-solution layout. Keep slides dynamic and investor-friendly.",
    "icon": "Rocket",
    "bannerImage": Tech
  },
];



const SliderStyle = ({selectStyle}) => {
  const [selectedStyle, setSelectedStyle] = useState(null);

  const handleStyleSelect = (styleName) => {
    setSelectedStyle(styleName);
  };

  return (
    <div className="w-full">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Choose Your Design Style</h2>
            <p className="text-slate-600">Select a stunning template that matches your presentation needs</p>
        </div>
        
        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
            {DesignStyles.map((style, index) => (
                <div 
                    key={index} 
                    onClick={() => (handleStyleSelect(style.styleName), selectStyle(style))}
                    className={`group relative bg-white rounded-xl shadow-md border-2 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        selectedStyle === style.styleName 
                            ? 'border-primary bg-primary/5 scale-105 shadow-lg' 
                            : 'border-slate-200 hover:border-primary/30'
                    }`}
                >
                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                        <img 
                            src={style.bannerImage} 
                            alt={style.styleName}
                            className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {/* Selected indicator */}
                        {selectedStyle === style.styleName && (
                            <div className="absolute top-3 right-3 bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg text-sm">
                                ✓
                            </div>
                        )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                        <h3 className={`text-base font-semibold text-slate-800 mb-3 group-hover:text-primary transition-colors duration-200 ${
                            selectedStyle === style.styleName ? 'text-primary' : ''
                        }`}>
                            {style.styleName}
                        </h3>
                        
                        {/* Color Palette */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">Colors:</span>
                            <div className="flex gap-2">
                                <div 
                                    className="w-5 h-5 rounded-full border border-white shadow-sm" 
                                    style={{ backgroundColor: style.colors.primary }}
                                ></div>
                                <div 
                                    className="w-5 h-5 rounded-full border border-white shadow-sm" 
                                    style={{ backgroundColor: style.colors.secondary }}
                                ></div>
                                <div 
                                    className="w-5 h-5 rounded-full border border-white shadow-sm" 
                                    style={{ backgroundColor: style.colors.accent }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Hover glow effect */}
                    <div className={`absolute inset-0 rounded-xl bg-primary/5 transition-opacity duration-300 pointer-events-none ${
                        selectedStyle === style.styleName ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}></div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default SliderStyle