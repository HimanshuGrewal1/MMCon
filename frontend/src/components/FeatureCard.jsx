import { motion } from "framer-motion";

export default function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-black text-green-400 rounded-xl p-6 shadow-[0_0_15px_rgba(0,255,100,0.3)] 
                 hover:shadow-[0_0_25px_rgba(0,255,100,0.6)] flex flex-col items-center 
                 justify-center text-center space-y-3 border border-green-600 
                 w-full max-w-sm"
    >
      <div className="text-4xl text-green-400 mb-2">{icon}</div>
      <h3 className="text-green-500 text-lg font-extrabold uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-white text-xl leading-relaxed">{description}</p>
    </motion.div>
  );
}
