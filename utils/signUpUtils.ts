export const clearCacheSignUpModal = () => {
  try {
    localStorage.removeItem("hideSignUpModal");
  } catch (error) {
    console.error("Error clearing sign-up modal cache:", error);
  }
};