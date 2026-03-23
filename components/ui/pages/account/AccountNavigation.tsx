"use client";

interface AccountNavigationProps {
  active: string;
  setActive: (section: string) => void;
}

export default function AccountNavigation({ active, setActive }: AccountNavigationProps) {
  const sections = [
    { id: "profile", label: "Profile" },
    { id: "orders", label: "Orders" },
  ];

  return (
    <nav className="sticky max-tablet:static text-[16px]">
      {sections.map((section) => (
        <div
          key={section.id}
          onClick={() => setActive(section.id)}
          className={`block py-6 transition cursor-pointer capitalize tracking-widest ${
            active === section.id
              ? "border-b border-black font-medium"
              : "border-b border-b-black/10 text-black/70 hover:text-black"
          }`}
        >
          {section.label}
        </div>
      ))}
    </nav>
  );
}
