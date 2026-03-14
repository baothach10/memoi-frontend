export default function LeftHelpNavigation({ active, setActive }: { active: string; setActive: (s: string) => void }) {
    const items = [
        { id: "shipping", label: "Shipping & Exchanges" },
        { id: "orders", label: "Orders & Payment" },
        { id: "house", label: "The MEMOÍ House" },
        { id: "care", label: "MEMOÍ care" },
    ];

    return (
        <div className="sticky top-24 max-tablet:static space-y-2 text-sm">
            {items.map((it) => (
                <div
                    key={it.id}
                    onClick={(e) => {
                        e.preventDefault();
                        setActive(it.id);
                        const container = document.getElementById("help-section");
                        if (container) container.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        setActive(it.id);
                        const container = document.getElementById("help-section");
                        if (container) container.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`block py-3 transition cursor-pointer ${active === it.id ? "border-b border-black font-medium" : "border-b border-b-black/10 text-black/70"}`}

                >
                    {it.label}
                </div>
            ))}
        </div>
    );
}