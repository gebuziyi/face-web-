const VALID_EMAIL_PATTERN = new RegExp(/^[-a-zA-Z0-9_.]{1,}@[a-zA-Z0-9]{2,}[.]{1}[a-zA-Z]{2,}$/)
const VALID_MOBILE_PATTERN = new RegExp(/^[1]{1}[0-9]{10}$/)
const VALID_PASSWORD_PATTERN = new RegExp(/^[a-zA-Z0-9]{6,18}$/)
const VALID_COUNTRY_NUM_PATTERN = new RegExp(/^[0-9]{1,4}$/)
const VALID_USERNAME_PATTERN = new RegExp(/^[_a-zA-Z0-9]{6,18}$/)
const VALID_NICKNAME_PATTERN = new RegExp(/^[^]{1,20}$/)
// 2个大写字母
const VALID_COUNTRY_CODE_PATTERN = new RegExp(/^[A-Z]{2}$/)
// 3个大写字母
const VALID_COUNTRY_CODE_ISO_PATTERN = new RegExp(/^[A-Z]{3}$/)

export const requireNonNull = function (field) {
  if (field !== null && typeof field !== 'undefined' && field.toString().trim() !== '') {
    return field
  } else {
    return null
  }
}

export const isNotEmptyStr = (str) => {
  return str !== null && typeof str !== 'undefined' && str.toString().trim() !== ''
}

export const isEmailValid = (email) => {
  if (!isNotEmptyStr(email)) {
    return false
  }

  return VALID_EMAIL_PATTERN.test(email)
}

export const isMobileValid = (mobile) => {
  if (!isNotEmptyStr(mobile)) {
    return false
  }

  return VALID_MOBILE_PATTERN.test(mobile)
}

export const isPasswordValid = (password) => {
  if (!isNotEmptyStr(password)) {
    return false;
  }
  return VALID_PASSWORD_PATTERN.test(password);
}

export const isCountryNumValid = (countryNum) => {
  if (!isNotEmptyStr(countryNum)) {
    return false;
  }
  return VALID_COUNTRY_NUM_PATTERN.test(countryNum);
}

export const isUsernameValid = (username) => {
  if (!isNotEmptyStr(username)) {
    return false;
  }
  return VALID_USERNAME_PATTERN.test(username);
}

export const isNicknameValid = (nickname) => {
  if (!isNotEmptyStr(nickname)) {
    return false;
  }
  return VALID_NICKNAME_PATTERN.test(nickname);
}

export const isCountryCodeValid = (code) => {
  if (!isNotEmptyStr(code)) {
    return false;
  }
  return VALID_COUNTRY_CODE_PATTERN.test(code);
}

export const isCountryCodeIsoValid = (codeIso) => {
  if (!isNotEmptyStr(codeIso)) {
    return false;
  }
  return VALID_COUNTRY_CODE_ISO_PATTERN.test(codeIso);
}
