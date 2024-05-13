export const PASSWORD_MIN_LENGTH = 4
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[*\d])(?=.*?[!@#$%^&*-?]).+$/
)
export const PASSWORD_REG_ERROR =
  "비밀번호는 영문 소문자, 영문 대문자, 특수문자를 각 한개 이상 포함해야 합니다."
