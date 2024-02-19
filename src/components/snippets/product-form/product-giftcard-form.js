import { useEffect, useState } from 'preact/hooks'
import TextInput from 'snippets/text-input/text-input'
import Textarea from 'snippets/text-input/textarea'

function ProductGiftCardForm({ state }) {
  const [senderName, setSenderName] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [confirmRecipientEmail, setConfirmRecipientEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const properties = {
      'Sender name': senderName,
      'Recipient name': recipientName,
      'Recipient email': recipientEmail,
      Message: message
    }

    state.setProperties(properties)
  }, [senderName, recipientName, recipientEmail, confirmRecipientEmail, message])

  return (
    <form id="ProductGiftCard" className="block">
      <TextInput
        classWrap="w-full mb-4"
        type="text"
        id="gift-card-sender-name"
        placeholder="Sender name"
        autocomplete={true}
        name="sender-name"
        value={senderName}
        required
        onInput={(e) => setSenderName(e.target.value)}
      />
      <TextInput
        classWrap="w-full mb-4"
        type="text"
        id="gift-card-recipient-name"
        placeholder="Recipient name"
        autocomplete={true}
        name="recipient-name"
        value={recipientName}
        required
        onInput={(e) => setRecipientName(e.target.value)}
      />
      <TextInput
        classWrap="w-full mb-4"
        type="email"
        id="gift-card-recipient-email"
        placeholder="Recipient email"
        autocomplete={true}
        name="recipient-email"
        value={recipientEmail}
        required
        onInput={(e) => setRecipientEmail(e.target.value)}
      />
      <TextInput
        classWrap="w-full mb-4"
        type="email"
        id="gift-card-confirm-recipient"
        placeholder="Confirm recipient email"
        autocomplete={true}
        name="confirm-recipient"
        value={confirmRecipientEmail}
        required
        confirm="#gift-card-recipient-email"
        confirmMessage="Email should be the same"
        onInput={(e) => setConfirmRecipientEmail(e.target.value)}
      />
      <Textarea
        classWrap="w-full mb-4"
        type="textarea"
        id="gift-card-message"
        placeholder="Message"
        autocomplete={true}
        rows="5"
        name="message"
        value={message}
        required
        onInput={(e) => setMessage(e.target.value)}
      />
    </form>
  )
}

export default ProductGiftCardForm
