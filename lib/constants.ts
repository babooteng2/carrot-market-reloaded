export const PASSWORD_MIN_LENGTH = 4
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[*\d])(?=.*?[!@#$%^&*-?]).+$/
)
export const PASSWORD_REG_ERROR =
  "비밀번호는 영문 소문자, 영문 대문자, 특수문자를 각 한개 이상 포함해야 합니다."

export const GITHUB_ACCESS_BASE_URL = "https://github.com/login/oauth/authorize"
export const GITHUB_ACCESS_TOKEN_URL =
  "https://github.com/login/oauth/access_token"
export const GITHUB_AUTH_USER_URL = "https://api.github.com/user"
export const GITHUB_AUTH_EMAIL_URL = "https://api.github.com/user/emails"

export const CACHED_HOME_PRODUCTS = "cached-home-products"
export const CACHED_PRODUCT_DETAIL = "cached-product-detail-"
export const CACHED_LIFE_POSTS = "cached-life-posts"
export const CACHED_LIFE_DETAIL = "cached-life-detail-"
export const CACHED_LIFE_COMMENTS = "cached-life-comments"
export const CACHED_LIKE_STATUS = "cached-like-status-"
export const CACHED_TITLE = "cached-title-"
