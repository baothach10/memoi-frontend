export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  phoneZone: string;
  dob: string;
  marketing: boolean;
};

export async function createUser(payload: CreateUserPayload) {
  const res = await fetch("/api/users/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Failed to create user");
  }

  return res.json();
}
