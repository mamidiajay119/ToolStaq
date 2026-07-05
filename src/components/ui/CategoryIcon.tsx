import {
  PenTool, Code, Video, Headphones, Palette, Microscope, Bot, Zap,
  BarChart, MessageSquare, DollarSign, Megaphone, Users, GraduationCap,
  Scale, Wallet, Stethoscope, Languages, Image, MessageCircle, Shield,
  Database, Presentation, Share2, AudioWaveform, User, Search, Plane,
  LayoutGrid
} from 'lucide-react';

interface CategoryIconProps {
  category: string;
  size?: number;
  className?: string;
}

export default function CategoryIcon({ category, size = 24, className = '' }: CategoryIconProps) {
  switch (category) {
    case 'AI Writing': return <PenTool size={size} className={className} />;
    case 'AI Coding': return <Code size={size} className={className} />;
    case 'AI Video': return <Video size={size} className={className} />;
    case 'AI Audio': return <Headphones size={size} className={className} />;
    case 'AI Design': return <Palette size={size} className={className} />;
    case 'AI Research': return <Microscope size={size} className={className} />;
    case 'AI Automation': return <Bot size={size} className={className} />;
    case 'AI Productivity': return <Zap size={size} className={className} />;
    case 'AI Analytics': return <BarChart size={size} className={className} />;
    case 'AI Customer Support': return <MessageSquare size={size} className={className} />;
    case 'AI Sales': return <DollarSign size={size} className={className} />;
    case 'AI Marketing': return <Megaphone size={size} className={className} />;
    case 'AI HR': return <Users size={size} className={className} />;
    case 'AI Education': return <GraduationCap size={size} className={className} />;
    case 'AI Legal': return <Scale size={size} className={className} />;
    case 'AI Finance': return <Wallet size={size} className={className} />;
    case 'AI Healthcare': return <Stethoscope size={size} className={className} />;
    case 'AI Translation': return <Languages size={size} className={className} />;
    case 'AI Image': return <Image size={size} className={className} />;
    case 'AI Chat': return <MessageCircle size={size} className={className} />;
    case 'AI Security': return <Shield size={size} className={className} />;
    case 'AI Data Extraction': return <Database size={size} className={className} />;
    case 'AI Presentation': return <Presentation size={size} className={className} />;
    case 'AI Social Media': return <Share2 size={size} className={className} />;
    case 'AI Voice': return <AudioWaveform size={size} className={className} />;
    case 'AI Avatar': return <User size={size} className={className} />;
    case 'AI Search': return <Search size={size} className={className} />;
    case 'AI Travel': return <Plane size={size} className={className} />;
    default: return <LayoutGrid size={size} className={className} />;
  }
}
