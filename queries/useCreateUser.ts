
import { createUser, CreateUserPayload } from "@/lib/client/user";
import { useMutation } from "@tanstack/react-query";

export function useCreateUser() {
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
  });
}
