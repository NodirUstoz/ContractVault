/**
 * Form validation utilities for ContractVault frontend.
 */

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate an email address format.
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate password strength.
 * Requires minimum 10 characters, at least one uppercase, one lowercase, one digit.
 */
export function validatePassword(password: string): string | null {
  if (password.length < 10) {
    return "Password must be at least 10 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one digit.";
  }
  return null;
}

/**
 * Validate the login form.
 */
export function validateLoginForm(data: {
  email: string;
  password: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate the registration form.
 */
export function validateRegistrationForm(data: {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.first_name.trim()) {
    errors.first_name = "First name is required.";
  }
  if (!data.last_name.trim()) {
    errors.last_name = "Last name is required.";
  }
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  const pwError = validatePassword(data.password);
  if (pwError) {
    errors.password = pwError;
  }

  if (data.password !== data.password_confirm) {
    errors.password_confirm = "Passwords do not match.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate the contract creation form.
 */
export function validateContractForm(data: {
  title: string;
  effective_date?: string;
  expiration_date?: string;
  total_value?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = "Contract title is required.";
  } else if (data.title.length > 500) {
    errors.title = "Title must be 500 characters or fewer.";
  }

  if (data.effective_date && data.expiration_date) {
    const eff = new Date(data.effective_date);
    const exp = new Date(data.expiration_date);
    if (exp <= eff) {
      errors.expiration_date = "Expiration date must be after the effective date.";
    }
  }

  if (data.total_value) {
    const val = parseFloat(data.total_value);
    if (isNaN(val) || val < 0) {
      errors.total_value = "Total value must be a non-negative number.";
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
