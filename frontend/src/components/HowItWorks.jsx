import { motion } from "framer-motion";
import { UploadCloud, Cpu, Share2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UploadCloud size={40} />,
      title: "Upload PDF",
      description:
        "Upload your PDF document securely with just one click. We support files up to 20MB.",
    },
    {
      icon: <Cpu size={40} />,
      title: "Process & Extract",
      description:
        "Our NLP engine intelligently extracts key concepts and relationships for your mind map.",
    },
    {
      icon: <Share2 size={40} />,
      title: "View & Share",
      description:
        "Explore the generated interactive mind map and share it instantly with others.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">How It Works</h2>
        <p className="text-lg text-gray-600 mb-12">
          A simple 3-step process to turn PDFs into beautiful mind maps instantly.
        </p>

        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center text-center hover:shadow-2xl"
            >
              <div className="text-indigo-600 mb-4">{step.icon}</div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-indigo-500 font-bold text-xl">{index + 1}</span>
                <h3 className="text-2xl font-semibold">{step.title}</h3>
              </div>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16"
        >
          <a
            href="/signup"
            className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-500 transition"
          >
            Start Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}
