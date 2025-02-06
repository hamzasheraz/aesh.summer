import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;    // Assuming each category has an id (change type if needed)
  name: string;  // The name of the category
  // Add other properties if there are any, e.g., description, image, etc.
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const res = await fetch("/api/product-type");
        const { data } = await res.json();
        const categories = data.map((category:Category) => category.name);
        setProductCategories(categories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product categories:", error);
        setLoading(false);
      }
    };

    fetchProductCategories();
  }, []);

  return (
    <nav className="relative">
      <div className="hidden lg:flex space-x-1">
        <NavLink href="/">Home</NavLink>
        <div className="relative group">
          <button
            className="text-white hover:text-blue-300 transition flex items-center px-3 py-2 rounded-md group-hover:bg-blue-600"
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
          >
            Products <ChevronDown className="ml-1 w-4 h-4" />
          </button>
          <AnimatePresence>
            {isProductsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                {loading ? (
                  <div className="px-4 py-2 text-sm text-gray-700">Loading...</div>
                ) : (
                  productCategories.map((category,idx) => (
                    <Link
                      key={idx}
                      href={`/category/${category}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition duration-200"
                    >
                      {category}
                    </Link>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </div>
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full right-0 w-48 bg-white rounded-md shadow-lg py-2 z-10 lg:hidden"
          >
            <MobileNavLink href="/">Home</MobileNavLink>
            <div className="relative">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition duration-200 flex items-center justify-between"
                onClick={() => setIsProductsOpen(!isProductsOpen)}
              >
                Products <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <AnimatePresence>
                {isProductsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pl-4"
                  >
                    {loading ? (
                      <div className="px-4 py-2 text-sm text-gray-700">Loading...</div>
                    ) : (
                      productCategories.map((category) => (
                        <MobileNavLink
                          key={category}
                          href={`/category/${category.toLowerCase()}`}
                        >
                          {category}
                        </MobileNavLink>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <MobileNavLink href="/about">About</MobileNavLink>
            <MobileNavLink href="/contact">Contact</MobileNavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-white hover:text-blue-300 transition px-3 py-2 rounded-md hover:bg-blue-600"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition duration-200"
    >
      {children}
    </Link>
  );
}
