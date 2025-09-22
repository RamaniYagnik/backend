const errorMessages = {
  // ----------------- Auth / Registration ----------------- //
  REQUIRED_FIELDS: "All fields are required",
  PASSWORD_MISMATCH: "Password and confirm password do not match",
  EMAIL_EXISTS: "Email already registered",
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  LOGIN_FAILED: "Login failed",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  INVALID_REFRESH_TOKEN: "Invalid refresh token",
  EXPIRED_REFRESH_TOKEN: "Refresh token expired",
  SERVER_ERROR: "Server error",
  LOGOUT_FAILED: "Logout failed",

  // ----------------- Token / Auth Middleware ----------------- //
  TOKEN_REQUIRED: "Access token is required",
  INVALID_TOKEN: "Invalid or expired token",

  // ----------------- Category ----------------- //
  CATEGORY_REQUIRED_FIELDS: "Category name and image are required",
  CATEGORY_EXISTS: "Category already exists",
  CATEGORY_NOT_FOUND: "Category not found",

  // ----------------- Product ----------------- //
  PRODUCT_REQUIRED_FIELDS:
    "Product name, image, price, colors, and category are required",
  PRODUCT_NOT_FOUND: "Product not found",

  // ----------------- User / Sub-Admin ----------------- //
  USER_REQUIRED_FIELDS: "Name, email, and role are required",
  USER_ALREADY_EXISTS: "User already exists with this email",
  USER_UPDATE_FAILED: "Failed to update user",
  USER_DELETE_FAILED: "Failed to delete user",
  USER_NOT_FOUND_OR_DELETED: "User not found or already deleted",

  UNAUTHORIZED: "Access denied admins only",
};

const successMessages = {
  // ----------------- Auth / Registration ----------------- //
  REGISTRATION_SUCCESS: "Registration successful",
  LOGIN_SUCCESS: "Login successful",
  TOKEN_REFRESHED: "Token refreshed successfully",
  LOGOUT_SUCCESS: "Logged out successfully",

  // ----------------- Category ----------------- //
  CATEGORY_CREATED: "Category created successfully",
  CATEGORY_FETCHED: "Categories fetched successfully",
  CATEGORY_UPDATED: "Category updated successfully",
  CATEGORY_DELETED: "Category deleted successfully",
  CATEGORY_RESTORED: "Category restored successfully",

  // ----------------- Product ----------------- //
  PRODUCT_CREATED: "Product created successfully",
  PRODUCTS_FETCHED: "Products fetched successfully",
  PRODUCT_FETCHED: "Product fetched successfully",
  PRODUCT_UPDATED: "Product updated successfully",

  // ----------------- User / Sub-Admin ----------------- //
  USERS_FETCHED: "Users fetched successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",

  PASSWORD_CHANGED: "Password changed successfully",
  PASSWORD_RESET: "Password reset successfully",
};

export { errorMessages, successMessages };
