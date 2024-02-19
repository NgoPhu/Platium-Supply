import JustValidate from 'just-validate'
import { selectAll } from 'helpers/dom'

const settings = {
  errorFieldCssClass: 'is-invalid',
  errorLabelCssClass: 'input-error',
  errorLabelStyle: {
    color: '#C3000C'
  },
  focusInvalidField: true,
  lockForm: false
}

const allRules = {
  email: {
    rule: 'email',
    errorMessage: 'Email is invalid!'
  },
  password: {
    validator: (value) => {
      if (value.length >= 5) return true
      return false
    },
    errorMessage: 'Password must be at least 5 characters'
  },
  number: {
    rule: 'number'
  },
  tel: {
    validator: (value) => {
      const regex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
      if (!value) return true
      if (regex.test(value)) return true
      return false
    },
    errorMessage: 'Phone number is invalid'
  },
  postcode: {
    validator: (value) => {
      const regex = /\^(0[289][0-9]{2})$|^([1-9][0-9]{3})$/
      if (regex.test(value) && value.length <= 4) return true
      return false
    },
    errorMessage: 'Postcode is invalid'
  }
}

const initValidate = (formEl, callback = false) => {
  const formId = `form#${formEl.id}`
  const inputs = selectAll('input:not([type=hidden]), select, textarea', formEl)
  if (inputs.length) {
    const validate = new JustValidate(typeof formEl.id === 'string' ? formId : formEl, settings)
    const newRules = inputs.map((input) => getValidateRule(input))
    newRules.forEach((rule) => rule.rules.length > 0 && validate.addField(rule.id, rule.rules))
    if (!callback) {
      validate.onSuccess((event) => {
        formEl.submit(event)
      })
    }
    return validate
  }
}

const addRuleConfirm = (rules, input) => {
  const confirmField = input.getAttribute('data-confirm')
  const confirmMessage = input.getAttribute('data-confirm-message')
  if (confirmField && confirmMessage) {
    rules.push({
      validator: (value, fields) => {
        if (fields[confirmField] && fields[confirmField].elem) {
          const confirmFieldValue = fields[confirmField].elem.value
          return value === confirmFieldValue
        }
        return true
      },
      errorMessage: confirmMessage
    })
  }
  return rules
}

const getValidateRule = (input) => {
  const inputName = input.getAttribute('aria-label') || 'Field'
  const rules = {
    id: `#${input.id}`,
    rules: []
  }
  if (input) {
    if (input.required) {
      rules.rules.push({
        rule: 'required',
        errorMessage: `${inputName} is required`
      })
    }
    if (input.type === 'email') {
      rules.rules.push(allRules.email)
    }
    if (input.type === 'password') {
      rules.rules.push(allRules.password)
    }
    if (input.type === 'number') {
      rules.rules.push(allRules.number)
    }
    if (input.type === 'tel') {
      rules.rules.push(allRules.tel)
    }
    if (input.max) {
      rules.rules.push({
        rule: 'maxLength',
        value: parseFloat(input.max)
      })
    }
    if (input.min) {
      rules.rules.push({
        rule: 'minLength',
        value: parseFloat(input.min)
      })
    }
    if (input.name === 'postcode') {
      rules.rules.push(allRules.postcode)
    }
    rules.rules = addRuleConfirm(rules.rules, input)
  }

  return rules
}

export { initValidate }
