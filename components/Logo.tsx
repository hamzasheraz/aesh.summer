import { motion } from "framer-motion"

export default function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -180 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex items-center space-x-2"
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="url(#logo-gradient)" />
        <path d="M10 25L20 10L30 25" stroke="white" strokeWidth="2" />
        <path d="M15 20L20 15L25 20" stroke="white" strokeWidth="2" />
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-2xl font-bold text-white">Aesh</span>
    </motion.div>
  )
}

