function TextInput(props) {
  const classWrap = props.classWrap ? `relative ${props.classWrap}` : 'relative'
  const className = props.className ? `peer input no-autocomplete ${props.className}` : 'peer input no-autocomplete'
  return (
    <div className={classWrap}>
      <input
        className={className}
        id={props.id}
        type={props.type}
        name={props.name}
        aria-label={props.placeholder}
        placeholder={props.placeholder}
        autocomplete={props.autocomplete}
        required={props.required}
        value={props.value}
        data-confirm={props.confirm}
        data-confirm-message={props.confirmMessage}
        onInput={props.onInput}
      />
      <label class="input-label" for={props.id}>
        {props.placeholder} {props.required && '*'}
      </label>
    </div>
  )
}

export default TextInput
