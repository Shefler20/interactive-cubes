import './DetachButton.css'

type DetachButtonProps = {
  disabled: boolean
  onDetach: () => void
}

const DetachButton = ({ disabled, onDetach }: DetachButtonProps) => {
  return (
    <button type="button" className="detach-button" disabled={disabled} onClick={onDetach}>
      Разъединить
    </button>
  )
}

export default DetachButton
