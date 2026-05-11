"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Field from "../molecules/Field";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSizeSuggestionMutation } from "@/queries/useSizeSuggestionMutation";

function inputClass() {
  return `
    w-full border-b bg-transparent pt-4 text-sm pb-2 outline-none border-black/40 focus:border-black/60 max-mobile:text-xs max-mobile:pt-2 max-mobile:text-xs max-mobile:pb-1
  `;
}

interface SizeSuggestionOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSize: (size: string) => void;
}

// Sizing data matching SizingOverlay
const SIZING_RANGES = [
  { size: "SERENE", chest: [82, 86], waist: [64, 68], hip: [90, 94], height: [155, 162] },
  { size: "MUSE", chest: [86, 90], waist: [68, 72], hip: [94, 98], height: [160, 167] },
  { size: "LUMINOUS", chest: [90, 96], waist: [72, 78], hip: [98, 104], height: [165, 172] },
];


function measurementInputClass() {
  return `
    text-[16px] text-center underline font-regular uppercase decoration-black/40 underline-offset-4 max-mobile:text-sm
  `;
}

const PREFERENCE_LABELS = ["VERY FITTED", "FITTED", "NORMAL", "LOOSE", "VERY LOOSE"] as const;

function suggestSize(
  height: number,
  weight: number,
  chest: number,
  waist: number,
  hip: number,
  preference: number // 0 = very fitted, 1 = normal, 2 = very loose
): string {
  // Score each size based on how well the measurements fit
  let bestSize = SIZING_RANGES[1].size; // default MUSE
  let bestScore = Infinity;

  for (const range of SIZING_RANGES) {
    let score = 0;
    // Distance from midpoint of each range
    if (chest > 0) score += Math.abs(chest - (range.chest[0] + range.chest[1]) / 2);
    if (waist > 0) score += Math.abs(waist - (range.waist[0] + range.waist[1]) / 2);
    if (hip > 0) score += Math.abs(hip - (range.hip[0] + range.hip[1]) / 2);
    if (height > 0) score += Math.abs(height - (range.height[0] + range.height[1]) / 2) * 0.5;

    if (score < bestScore) {
      bestScore = score;
      bestSize = range.size;
    }
  }

  // Adjust for preference (0=very fitted, 1=fitted, 2=normal, 3=loose, 4=very loose)
  const sizeIndex = SIZING_RANGES.findIndex((r) => r.size === bestSize);
  if (preference <= 1 && sizeIndex > 0) {
    bestSize = SIZING_RANGES[sizeIndex - 1].size;
  } else if (preference >= 3 && sizeIndex < SIZING_RANGES.length - 1) {
    bestSize = SIZING_RANGES[sizeIndex + 1].size;
  }

  return bestSize;
}

// Generate picker values
const heightValues = Array.from({ length: 61 }, (_, i) => 140 + i); // 140-200
const weightValues = Array.from({ length: 81 }, (_, i) => 30 + i); // 30-110
const ageValues = Array.from({ length: 63 }, (_, i) => 18 + i); // 18-80
const measurementValues = Array.from({ length: 81 }, (_, i) => 50 + i); // 50-130

interface PickerDropdownProps {
  values: number[];
  selectedValue: number;
  unit: string;
  onSelect: (val: number) => void;
  onClose: () => void;
}

function PickerDropdown({ values, selectedValue, unit, onSelect, onClose }: PickerDropdownProps) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: "center" });
    }
  }, []);

  useEffect(() => {
    if (!dropdownRef.current) return;
    gsap.fromTo(dropdownRef.current,
      { autoAlpha: 0, scale: 0.96 },
      { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power2.out" }
    );
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-5 bg-transparent" onClick={onClose} />
      <div
        ref={dropdownRef}
        className="absolute top-full left-0 right-0 z-10 bg-[#FFFEFA] border border-neutral-300 shadow-lg max-h-[200px] overflow-y-auto opacity-0"
      >
        {values.map((val) => (
          <button
            ref={val === selectedValue ? selectedRef : undefined}
            key={val}
            onClick={() => {
              onSelect(val);
              onClose();
            }}
            className={`w-full py-2.5 text-center text-sm transition hover:bg-neutral-50 cursor-pointer max-mobile:text-xs ${val === selectedValue ? "font-regular text-black" : "font-light text-black/70"
              }`}
          >
            {val} {unit}
          </button>
        ))}
      </div>
    </>
  );
}

export default function SizeSuggestionOverlay({
  isOpen,
  onClose,
  onAddSize,
}: SizeSuggestionOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [age, setAge] = useState(0);

  // Step 2 fields
  const [chest, setChest] = useState(0);
  const [waist, setWaist] = useState(0);
  const [hip, setHip] = useState(0);
  const [preference, setPreference] = useState(2); // 0=very fitted, 1=fitted, 2=normal, 3=loose, 4=very loose

  // Validation
  const [errors, setErrors] = useState<{ height?: boolean; weight?: boolean; chest?: boolean; waist?: boolean; hip?: boolean }>({});

  // Active picker
  const [activePicker, setActivePicker] = useState<string | null>(null);

  // Result
  const [suggestedSize, setSuggestedSize] = useState("");
  const [reasoning, setReasoning] = useState("");

  const sizeSuggestionMutation = useSizeSuggestionMutation();
  const isLoading = sizeSuggestionMutation.isPending;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset when closed
      setStep(1);
      setErrors({});
      setActivePicker(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleStep1Continue = () => {
    const newErrors: { height?: boolean; weight?: boolean } = {};
    if (height === 0) newErrors.height = true;
    if (weight === 0) newErrors.weight = true;
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };

  const handleStep2Continue = async () => {
    const newErrors: typeof errors = {};
    if (chest === 0) newErrors.chest = true;
    if (waist === 0) newErrors.waist = true;
    if (hip === 0) newErrors.hip = true;
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(3);
      
      sizeSuggestionMutation.mutate({
        height,
        weight,
        age,
        chest,
        waist,
        hip,
        preference,
        sizingRanges: SIZING_RANGES,
      }, {
        onSuccess: (data) => {
          setSuggestedSize(data.suggestedSize);
          setReasoning(data.reasoning);
        },
        onError: (error) => {
          console.error("Error fetching size suggestion:", error);
          // Fallback to local logic if AI fails
          const result = suggestSize(height, weight, chest, waist, hip, preference);
          setSuggestedSize(result);
        }
      });
    }
  };

  const handleEdit = () => {
    setStep(1);
  };

  const handleDelete = () => {
    setHeight(0);
    setWeight(0);
    setAge(0);
    setChest(0);
    setWaist(0);
    setHip(0);
    setPreference(2);
    setSuggestedSize("");
    setReasoning("");
    setStep(1);
  };

  const handleAddSize = () => {
    onAddSize(suggestedSize);
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-100 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Overlay Panel */}
      <div
        className={`fixed top-0 right-0 h-dvh w-4/10 bg-[#fffefa] z-101 transform transition-transform duration-300 ease-in-out max-tablet:w-full max-tablet:shadow-transparent ${isOpen ? "translate-x-0 pointer-events-auto shadow-2xl" : "translate-x-[105%] pointer-events-none"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6">
            {step > 1 && step < 3 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="cursor-pointer w-10 h-10 flex items-center justify-center transition-all duration-300 active:duration-0 active:bg-black/20"
                aria-label="Go back"
              >
                <div className="w-4.5 h-auto max-mobile:w-4">
                  <ArrowLeft width="100%" height="100%" color="rgba(0, 0, 0, 0.6)" />
                </div>
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 cursor-pointer transition-all duration-300 active:duration-0 w-10 h-10 flex items-center justify-center active:bg-black/20"
              aria-label="Close size suggestion"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 5L5 15M5 5l10 10" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto flex flex-col justify-center px-23 max-mobile:px-5">
            {/* ========== STEP 1: Basic Information ========== */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div className="text-center gap-9 items-center flex flex-col max-mobile:gap-8">
                  <h2 className="text-xl uppercase font-regular max-mobile:text-[16px]">Size Suggestion</h2>
                  <p className="text-xs uppercase text-black/40 max-mobile:text-[10px]">Basic Information</p>
                </div>
                <div className="flex flex-col gap-8 max-mobile:gap-5">
                  {/* HEIGHT */}
                  <div className="relative">
                    <Field
                      label="HEIGHT"
                      error={errors.height ? { message: "This field is required" } : undefined}
                      suffix={<span className={`${measurementInputClass()}`}>CM</span>}
                    >
                      <button
                        onClick={() => { setErrors((e) => ({ ...e, height: undefined })); setActivePicker(activePicker === "height" ? null : "height"); }}
                        className={`text-center cursor-pointer text-black/60 ${inputClass()}`}
                      >
                        {height || 0} CM
                      </button>
                    </Field>
                    {activePicker === "height" && (
                      <PickerDropdown
                        values={heightValues}
                        selectedValue={height}
                        unit="CM"
                        onSelect={setHeight}
                        onClose={() => setActivePicker(null)}
                      />
                    )}
                  </div>

                  {/* WEIGHT */}
                  <div className="relative">
                    <Field
                      label="WEIGHT"
                      error={errors.weight ? { message: "This field is required" } : undefined}
                      suffix={<span className={`${measurementInputClass()}`}>KG</span>}
                    >
                      <button
                        onClick={() => { setErrors((e) => ({ ...e, weight: undefined })); setActivePicker(activePicker === "weight" ? null : "weight"); }}
                        className={`cursor-pointer text-center text-black/60 ${inputClass()}`}
                      >
                        {weight || 0} KG
                      </button>
                    </Field>
                    {activePicker === "weight" && (
                      <PickerDropdown
                        values={weightValues}
                        selectedValue={weight}
                        unit="KG"
                        onSelect={setWeight}
                        onClose={() => setActivePicker(null)}
                      />
                    )}
                  </div>

                  {/* AGE */}
                  <div className="relative">
                    <Field
                      label="AGE"
                      labelSuffix={<span className="text-sm text-black/40">(Optional)</span>}
                    >
                      <p className="text-xs text-black mt-1">
                        Age influences the distribution of your weight. Knowing your age enables us to recommend the correct size for you.
                      </p>
                      <button
                        onClick={() => setActivePicker(activePicker === "age" ? null : "age")}
                        className={`text-center cursor-pointer text-black/60 ${inputClass()}`}
                      >
                        {age || 0} YEARS
                      </button>
                    </Field>
                    {activePicker === "age" && (
                      <PickerDropdown
                        values={ageValues}
                        selectedValue={age}
                        unit="YEARS"
                        onSelect={setAge}
                        onClose={() => setActivePicker(null)}
                      />
                    )}
                  </div>

                  {/* Continue button */}
                  <div className="flex flex-col items-center gap-4 mt-4">
                    <button
                      onClick={handleStep1Continue}
                      className="w-full border border-black/20 py-4 cursor-pointer leading-none text-sm font-regular hover:bg-black hover:text-white transition-all duration-200 max-mobile:text-xs max-mobile:py-3"
                    >
                      Continue
                    </button>
                    <p className="text-xs text-black/60 text-center">
                      By clicking Continue, you agree to the processing of your personal data, allowing us to recommend the size that suits you best. For more information, consult our{" "}
                      <Link href="/privacy-policy" className="underline decoration-black/40 underline-offset-4">
                        Privacy & Policy
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ========== STEP 2: Body Measurements ========== */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div className="text-center gap-9 items-center flex flex-col max-mobile:gap-8">
                  <h2 className="text-xl uppercase font-regular max-mobile:text-[16px]">Size Suggestion</h2>
                  <p className="text-xs uppercase text-black/40 max-mobile:text-[10px]">Body Measurements</p>
                </div>
                <div className="flex flex-col gap-8 max-mobile:gap-5">

                  {/* CHEST */}
                  <div className="relative">
                    <Field
                      label="CHEST"
                      error={errors.chest ? { message: "This field is required" } : undefined}
                      suffix={<span className={`${measurementInputClass()}`}>CM</span>}
                    >
                      <button
                        onClick={() => { setErrors((e) => ({ ...e, chest: undefined })); setActivePicker(activePicker === "chest" ? null : "chest"); }}
                        className={`text-center cursor-pointer text-black/60 ${inputClass()}`}
                      >
                        {chest || 0} CM
                      </button>
                    </Field>
                    {activePicker === "chest" && (
                      <PickerDropdown
                        values={measurementValues}
                        selectedValue={chest}
                        unit="CM"
                        onSelect={setChest}
                        onClose={() => setActivePicker(null)}
                      />
                    )}
                  </div>

                  {/* WAIST */}
                  <div className="relative">
                    <Field
                      label="WAIST"
                      error={errors.waist ? { message: "This field is required" } : undefined}
                      suffix={<span className={`${measurementInputClass()}`}>CM</span>}
                    >
                      <button
                        onClick={() => { setErrors((e) => ({ ...e, waist: undefined })); setActivePicker(activePicker === "waist" ? null : "waist"); }}
                        className={`text-center cursor-pointer text-black/60 ${inputClass()}`}
                      >
                        {waist || 0} CM
                      </button>
                    </Field>
                    {activePicker === "waist" && (
                      <PickerDropdown
                        values={measurementValues}
                        selectedValue={waist}
                        unit="CM"
                        onSelect={setWaist}
                        onClose={() => setActivePicker(null)}
                      />
                    )}
                  </div>

                  {/* HIPS */}
                  <div className="relative">
                    <Field
                      label="HIPS"
                      error={errors.hip ? { message: "This field is required" } : undefined}
                      suffix={<span className={`${measurementInputClass()}`}>CM</span>}
                    >
                      <button
                        onClick={() => { setErrors((e) => ({ ...e, hip: undefined })); setActivePicker(activePicker === "hip" ? null : "hip"); }}
                        className={`text-center cursor-pointer text-black/60 ${inputClass()}`}
                      >
                        {hip || 0} CM
                      </button>
                    </Field>
                    {activePicker === "hip" && (
                      <PickerDropdown
                        values={measurementValues}
                        selectedValue={hip}
                        unit="CM"
                        onSelect={setHip}
                        onClose={() => setActivePicker(null)}
                      />
                    )}
                  </div>


                  {/* CLOTHING USAGE PREFERENCE */}
                  <div className="w-full flex flex-col items-center mt-4 gap-3">
                    <div className="flex flex-col items-center gap-5 w-full">
                      <p className="text-xs text-black/40 font-regular uppercase">
                        Clothing Usage Preference
                      </p>

                      <div className="flex flex-col items-center w-full">
                        <p className="text-sm font-regular uppercase h-5 mb-5">
                          {PREFERENCE_LABELS[preference]}
                        </p>

                        <div className="relative w-full h-5 flex items-center group">
                          {/* Central Line */}
                          <div className="absolute left-0 right-0 h-px bg-black/20" />

                          {/* Ticks at 5 positions */}
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="absolute w-px h-2 bg-black/40"
                              style={{ left: `${i * 25}%` }}
                            />
                          ))}

                          {/* Moving Dot (Thumb) */}
                          <div
                            className="absolute w-2.5 h-2.5 bg-black rounded-full transition-all duration-300 ease-out z-0"
                            style={{
                              left: `${preference * 25}%`,
                              transform: `translateX(-50%)`
                            }}
                          />

                          {/* Native Hidden Range for Interaction */}
                          <input
                            type="range"
                            min={0}
                            max={4}
                            step={1}
                            value={preference}
                            onChange={(e) => setPreference(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                        </div>
                      </div>

                    </div>
                    {/* Labels for 3 positions */}
                    <div className="relative left-0 w-full flex justify-between text-xs text-black/60 font-regular uppercase">
                      <div>Very Fitted</div>
                      <div className="absolute left-1/2 -translate-x-1/2">Normal</div>
                      <div>Very Loose</div>
                    </div>
                  </div>

                  {/* Continue button */}
                  <div className="flex flex-col items-center gap-4 mt-4">
                    <button
                      onClick={handleStep2Continue}
                      className="w-full border border-black/20 py-4 leading-none text-sm font-regular cursor-pointer hover:bg-black hover:text-white transition-all duration-200 max-mobile:text-xs max-mobile:py-3"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========== STEP 3: Result ========== */}
            {step === 3 && (
              <div className="relative flex flex-col gap-4 items-center text-center min-h-[400px] justify-center">
                {isLoading ? (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#fffefa]">
                    <div className="w-12 h-12 border-2 border-black/10 border-t-black rounded-full animate-spin mb-4" />
                    <p className="text-sm uppercase text-black/60 animate-pulse font-regular max-mobile:text-xs">
                      Calculating your ideal fit
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-8 items-center text-center">
                      <div className="flex flex-col gap-9 items-center text-center">
                        <h2 className="text-xl uppercase font-regular max-mobile:text-[16px]">
                          We Suggest Size {suggestedSize}
                        </h2>

                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-black/60 leading-normal max-mobile:text-xs">
                            {reasoning || "To be certain this is your ideal fit, you can always contact our team for personal guidance."}
                          </p>
                          <button className="text-sm underline cursor-pointer decoration-black/40 underline-offset-4 max-mobile:text-xs">Contact us</button>
                        </div>

                      </div>
                      <div className="flex flex-col text-xs text-black/60 font-regular uppercase max-mobile:text-[10px] gap-1">
                        <p>{height} CM / {weight} KG</p>
                        <p>{chest > 0 ? `${chest} CM` : "–"} / {waist > 0 ? `${waist} CM` : "–"} / {hip > 0 ? `${hip} CM` : "–"}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6 w-full">
                      <div className="flex flex-col gap-3 w-full">
                        <button
                          onClick={handleEdit}
                          className="w-full border border-black/20 py-4 cursor-pointer leading-none text-sm font-regular hover:bg-black hover:text-white transition-all duration-200 max-mobile:text-xs max-mobile:py-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={handleAddSize}
                          className="w-full bg-black text-white py-4 cursor-pointer leading-none text-sm font-regular max-mobile:text-xs max-mobile:py-3"
                        >
                          Add size {suggestedSize}
                        </button>
                      </div>
                      <button
                        onClick={handleDelete}
                        className="text-sm underline decoration-black/40 cursor-pointer underline-offset-4 max-mobile:text-xs"
                      >
                        Delete details
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
