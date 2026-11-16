import type { PointerEvent } from 'react'
import './Cube.css'
import type { CubeColor, CubeId, CubePosition } from '../../types/cube.types'

type CubeProps = {
  cubeId: CubeId
  color: CubeColor
  position: CubePosition
  selected: boolean
  onPointerDown: (cubeId: CubeId, event: PointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void
  onPointerCancel: (event: PointerEvent<HTMLDivElement>) => void
}

const Cube = ({
  cubeId,
  color,
  position,
  selected,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: CubeProps) => {

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    onPointerDown(cubeId, event)
  }

  return (
    <div
      className={`cube ${cubeId} cube--${color}${selected ? ' cube--selected' : ''}`}
      style={{ left: position.x, top: position.y }}
      onPointerDown={handlePointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    />
  )
}

export default Cube
