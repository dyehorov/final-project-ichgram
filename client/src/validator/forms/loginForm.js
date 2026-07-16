const loginFormValidation = {
  login: {
    required: {
      value: true,
      message: "Username/email is required!",
    },
  },
  password: {
    required: {
      value: true,
      message: "Password is required!",
    },
  },
}

export default loginFormValidation
