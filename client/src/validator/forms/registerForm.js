const registerFormValidation = {
  email: {
    required: {
      value: true,
      message: "Email is required!",
    },
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email is not valid!",
    },
  },
  fullName: {
    required: {
      value: true,
      message: "Full name is required!",
    },
    maxLength: {
      value: 30,
      message: "Too many characters in the full name! Must be less that 30!",
    },
    minLength: {
      value: 2,
      message: "Full name must have at least have 2 characters",
    },
  },
  username: {
    required: {
      value: true,
      message: "Username is required!",
    },
  },
  password: {
    required: {
      value: true,
      message: "Password is required!",
    },
    minLength: {
      value: 8,
      message: "Password must have at least have 8 characters",
    },
  },
}

export default registerFormValidation
