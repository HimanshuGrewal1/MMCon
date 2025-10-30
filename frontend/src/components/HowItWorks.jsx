import { motion } from "framer-motion";
import { UploadCloud, Cpu, Share2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UploadCloud size={40} />,
      title: "UPLOAD PDF",
      description:
        "Upload your PDF document securely with just one click. We support files up to 20MB.",
    },
    {
      icon: <Cpu size={40} />,
      title: "PROCESS & EXTRACT",
      description:
        "Our NLP engine intelligently extracts key concepts and relationships for your mind map.",
    },
    {
      icon: <Share2 size={40} />,
      title: "VIEW & SHARE",
      description:
        "Explore the generated interactive mind map and share it instantly with others.",
    },
  ];

  return (
    <section className="py-20 bg-[#0a0a0a] text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-white mb-16">How It Works</h2>

        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-black border border-green-600 rounded-xl p-8 
                         shadow-[0_0_15px_rgba(0,255,100,0.3)] 
                         hover:shadow-[0_0_25px_rgba(0,255,100,0.6)] 
                         flex flex-col items-center justify-center text-center 
                         text-white"
            >
              <div className="text-green-400 mb-4">{step.icon}</div>
              <h3 className="text-green-500 text-lg font-extrabold uppercase tracking-wide mb-3">
                {step.title}
              </h3>
              <p className="text-gray-200 text-lg leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16"
        >
          <a
            href="/signup"
            className="px-8 py-4 bg-green-500 text-black font-bold 
                       rounded-full shadow-[0_0_15px_rgba(0,255,100,0.6)] 
                       hover:bg-green-400 hover:shadow-[0_0_25px_rgba(0,255,100,0.9)] 
                       transition"
          >
            Start Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}
