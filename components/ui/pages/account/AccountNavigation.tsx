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
    <nav className="sticky top-24 max-tablet:static space-y-2 text-sm">
      {sections.map((section) => (
        <div
          key={section.id}
          onClick={() => setActive(section.id)}
          className={`block py-3 transition cursor-pointer uppercase tracking-widest ${
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
