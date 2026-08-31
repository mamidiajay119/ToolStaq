import {
  PenTool, Code, Video, Headphones, Palette, Microscope, Bot, Zap,
  BarChart, MessageSquare, DollarSign, Megaphone, Users, GraduationCap,
  Scale, Wallet, Stethoscope, Languages, Image, MessageCircle, Shield,
  Database, Presentation, Share2, AudioWaveform, User, Search, Plane,
  LayoutGrid, Box, Globe, FileText, Camera, Table, Music, Heart,
  Cpu, Layers, Sparkles, Server, Terminal, Lock, Key, Brush, Eye
} from 'lucide-react';

interface CategoryIconProps {
  category: string;
  size?: number;
  className?: string;
}

export default function CategoryIcon({ category, size = 24, className = '' }: CategoryIconProps) {
  const cat = category || '';

  // Specific matches
  switch (cat) {
    case 'AI 3D Design': return <Box size={size} className={className} />;
    case 'AI Academic Research': return <GraduationCap size={size} className={className} />;
    case 'AI Analytics': return <BarChart size={size} className={className} />;
    case 'AI App & Web Builder':
    case 'AI App Builder':
    case 'AI Website Builder':
    case 'No-Code Platform': return <Layers size={size} className={className} />;
    case 'AI Audio':
    case 'AI Music Generation': return <Music size={size} className={className} />;
    case 'AI Voice & Audio':
    case 'AI Voice': return <AudioWaveform size={size} className={className} />;
    case 'AI Automation':
    case 'AI Workflow Automation':
    case 'AI Workload Automation': return <Bot size={size} className={className} />;
    case 'AI Browser Sidebars': return <Globe size={size} className={className} />;
    case 'AI Chat':
    case 'AI Chatbot':
    case 'AI Chatbots & Virtual Assistants':
    case 'AI Companion':
    case 'AI Roleplay & Companions': return <MessageCircle size={size} className={className} />;
    case 'AI Coding':
    case 'AI Coding Assistant':
    case 'AI Developer Tools':
    case 'Open-Source LLM': return <Code size={size} className={className} />;
    case 'AI Developer API':
    case 'Developer API': return <Terminal size={size} className={className} />;
    case 'AI Developer Platform':
    case 'Developer Platform':
    case 'Enterprise AI Platform':
    case 'Foundation Model':
    case 'Multi-Model Platform': return <Cpu size={size} className={className} />;
    case 'AI Content Creation':
    case 'AI Copywriting & Marketing':
    case 'AI Creative & Story Writing':
    case 'AI SEO & Blog Writing':
    case 'AI Writing':
    case 'AI Text Humanizer': return <PenTool size={size} className={className} />;
    case 'AI Creative Tools':
    case 'AI Design':
    case 'AI Design Tool':
    case 'AI UI Generator': return <Palette size={size} className={className} />;
    case 'AI Customer Support': return <MessageSquare size={size} className={className} />;
    case 'AI Cybersecurity':
    case 'AI Security':
    case 'AI Governance': return <Shield size={size} className={className} />;
    case 'AI Data Extraction':
    case 'Web Scraping Tool': return <Database size={size} className={className} />;
    case 'AI Document Intelligence':
    case 'AI Meeting Notes': return <FileText size={size} className={className} />;
    case 'AI Education':
    case 'AI Education & Tutoring': return <GraduationCap size={size} className={className} />;
    case 'AI Email & Inbox': return <Sparkles size={size} className={className} />;
    case 'AI Enterprise Search':
    case 'AI Search': return <Search size={size} className={className} />;
    case 'AI Finance':
    case 'AI Finance & Accounting': return <Wallet size={size} className={className} />;
    case 'AI Fitness & Health':
    case 'AI Mental Health & Wellness':
    case 'AI Life Coaching': return <Heart size={size} className={className} />;
    case 'AI Headshots & Avatars':
    case 'AI Avatar': return <User size={size} className={className} />;
    case 'AI Healthcare':
    case 'AI Healthcare & Medical': return <Stethoscope size={size} className={className} />;
    case 'AI Image':
    case 'AI Image Generation':
    case 'AI Photo Editing':
    case 'AI Photo Culling & Retouching': return <Image size={size} className={className} />;
    case 'AI Infrastructure':
    case 'AI Vector Databases':
    case 'On-Device AI': return <Server size={size} className={className} />;
    case 'AI Legal':
    case 'AI Legal & Compliance': return <Scale size={size} className={className} />;
    case 'AI Marketing':
    case 'AI Sales':
    case 'AI Sales & SDRs': return <Megaphone size={size} className={className} />;
    case 'AI Observability & Evaluation': return <Eye size={size} className={className} />;
    case 'AI Presentation':
    case 'AI Presentations & Slides': return <Presentation size={size} className={className} />;
    case 'AI Productivity':
    case 'AI Operations':
    case 'AI Product Management':
    case 'AI Reasoning Model': return <Zap size={size} className={className} />;
    case 'AI Research':
    case 'AI Research Tools': return <Microscope size={size} className={className} />;
    case 'AI Social Media': return <Share2 size={size} className={className} />;
    case 'AI Spreadsheets & Data': return <Table size={size} className={className} />;
    case 'AI Translation': return <Languages size={size} className={className} />;
    case 'AI Video':
    case 'AI Video Editing':
    case 'AI Video Generation':
    case 'AI Storyboarding & Comics': return <Video size={size} className={className} />;
    default: return <LayoutGrid size={size} className={className} />;
  }
}
