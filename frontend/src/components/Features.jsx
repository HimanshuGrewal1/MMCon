import FeatureCard from "./FeatureCard";
import { FileText, Cpu, Share2 } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <FileText size={40} />,
      title: "Auto Text Extraction",
      description: "Extracts important concepts from PDFs instantly using advanced NLP.",
    },
    {
      icon: <Cpu size={40} />,
      title: "Smart Mind Mapping",
      description: "Automatically organizes ideas in an intuitive visual structure.",
    },
    {
      icon: <Share2 size={40} />,
      title: "Easy Sharing",
      description: "Save and share mind maps instantly with friends or colleagues.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-darkbg">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Features
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
