import './ColorControls.css'
import { COLOR_OPTIONS } from '../../constants/cube.constants'
import type { CubeColor } from '../../types/cube.types'

type ColorControlsProps = {
  selectedColor: CubeColor | null
  onChangeColor: (color: CubeColor) => void
}

const ColorControls = ({ onChangeColor, selectedColor }: ColorControlsProps) => {

  return (
    <div className="color-controls">
      <h2 className="color-controls__title">Выбери цвет</h2>
      <div className="color-controls__buttons">
        {COLOR_OPTIONS.map((option) => {
          const isSelected = selectedColor === option.color

          return (
            <button
              key={option.color}
              type="button"
              className={
                isSelected ? 'color-button color-button--selected' : 'color-button'
              }
              style={{ backgroundColor: option.color }}
              aria-label={option.label}
              aria-pressed={isSelected}
              onClick={() => onChangeColor(option.color)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ColorControls
