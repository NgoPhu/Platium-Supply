function Textarea(props) {
  const classWrap = props.classWrap ? `relative ${props.classWrap}` : 'relative'
  const className = props.className ? `peer input no-autocomplete ${props.className}` : 'peer input no-autocomplete'

  return (
    <div className={classWrap}>
      <textarea
        className={className}
        id={props.id}
        type={props.type}
        name={props.name}
        aria-label={props.placeholder}
        placeholder={props.placeholder}
        autocomplete={props.autocomplete}
        required={props.required}
        rows={props.rows}
        value={props.value}
        onInput={props.onInput}
      />
      <label class="input-label" for={props.id}>
        {props.placeholder} {props.required && '*'}
      </label>
    </div>
  )
}

export default Textarea
