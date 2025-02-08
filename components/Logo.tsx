import { motion } from "framer-motion"

export default function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -180 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex items-center space-x-2"
    >
      <span className="text-2xl font-bold text-white">Aesh</span>
    </motion.div>
  )
}

