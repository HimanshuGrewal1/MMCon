import { motion } from "framer-motion";

export default function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl flex flex-col items-center text-center"
    >
      <div className="text-indigo-600 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
