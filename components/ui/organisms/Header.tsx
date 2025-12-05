import NavigationBar from "../molecules/NavigationBar";
import Logo from "../atoms/Logo";
import RightNavigation from "../molecules/RightNavigation";

export function Header() {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent py-10`}
    >
      <div className="px-[100px] flex items-center justify-between">
        <Logo />
        <NavigationBar />
        <RightNavigation />
      </div>
    </header>
  );
}
