"use client";

export default function DeleteAccountSection() {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete your account? This action is permanent.")) {
      console.log("Deleting account...");
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-regular uppercase tracking-tight">DELETE YOUR ACCOUNT</h2>
        <p className="text-sm text-black/60 leading-relaxed font-light">
          Account deletion is permanent. You will lose access to your account and will no longer be able to track past purchases, returns, or exchanges online.
        </p>
      </div>

      <button
        onClick={handleDelete}
        className="
          w-full border border-black py-4 text-[10px] uppercase tracking-[0.2em] font-regular
          transition-all duration-300 ease-in-out
          bg-[#fffefa] text-black
          hover:bg-black hover:text-[#fffefa]
        "
      >
        Delete account
      </button>

      <p className="text-[10px] text-black/60 leading-relaxed font-light mt-10">
        At MEMOÍ, your privacy is our priority. We are committed to protecting your data and handling your information with the utmost integrity and security. Learn how we secure your data in our <a href="#" className="underline decoration-black/20 hover:decoration-black transition-colors">Privacy Policy</a>
      </p>
    </div>
  );
}
