import Icon from 'snippets/icon/icon'

function CustomModalDialog({ header, content, useRichtext = false, footer, id, type = 'modal', classClose = 'w-8 h-8 p-2', classMain = '', classContent = '', classHeader = '' }) {
  return (
    <modal-dialog data-target={id} data-type={type} data-scroll-target=".modal-dialog-inner">
      <div className={`modal-dialog-content js-content-modal-dialog relative ${classMain}`}>
        <div className={`relative ${classHeader}`}>
          {header}
          <button type="button" className={`js-close-modal-dialog absolute top-3 right-4 h-8 w-8 p-2 md:top-4 md:right-6 ${classClose}`}>
            <Icon name="icon-close" className="h-8 w-8 text-primary" />
          </button>
        </div>
        {useRichtext ? (
          <div className={`modal-dialog-inner ${classContent}`} dangerouslySetInnerHTML={{ __html: content }}></div>
        ) : (
          <div className={`modal-dialog-inner ${classContent}`}>{content}</div>
        )}
        {footer}
      </div>
    </modal-dialog>
  )
}

export default CustomModalDialog
