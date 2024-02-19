import Icon from 'snippets/icon/icon'

function CustomModalDialog({ content, id, classClose = 'w-8 h-8 p-2', classMain = '', classContent = '', classWrapper = '', scrollTarget }) {
  return (
    <modal-dialog class={`modal ${classWrapper}`} data-scroll-target={scrollTarget} id={id}>
      <div class={`modal-content ${classMain} js-content-modal`}>
        <button type="button" class={`${classClose} js-close-modal`}>
          <Icon name="icon-close" viewBox="0 0 32 32" className="w-6 h-6 text-grey-600" />
        </button>
        <div class={classContent}>
          {content}
        </div>
      </div>
    </modal-dialog>
  )
}

export default CustomModalDialog
