export const validateEmail = (email: string): string | null => {
  if (!email) return "El correo electrónico es requerido";
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "El correo electrónico no es válido";
  }
  
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "La contraseña es requerida";
  
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres";
  }
  
  // Aquí agregar validaciones adicionales
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
    return "La contraseña debe contener mayúsculas, minúsculas y números";
  }
  
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return "El nombre es requerido";
  
  if (name.length < 3) {
    return "El nombre debe tener al menos 3 caracteres";
  }
  
  return null;
};