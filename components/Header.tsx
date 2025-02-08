import Logo from "./Logo";
import Navigation from "./Navigation";
import CartIcon from "./CartIcon";

export default function Header() {
  return (
    <header className="bg-[#001F3F] py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
    <div className="container mx-auto flex justify-between items-center">
      <Logo />
      <Navigation />
      <CartIcon />
    </div>
  </header>
  
  );
}
