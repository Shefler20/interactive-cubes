import { useRef, type PointerEvent, type ReactNode } from 'react'
import './Field.css'
import Cube from '../Cube/Cube'
import DetachButton from '../DetachButton/DetachButton'
import { CUBE_IDS, DETACHED_CUBES } from '../../constants/cube.constants'
import type {
  CubeAttachment,
  CubeColors,
  CubeId,
  CubePosition,
  CubePositions,
  DragState,
  LinkedCube,
} from '../../types/cube.types'
import { clampCubePosition } from '../../utils/clampCubePosition'
import { getFieldPointerPosition } from '../../utils/getFieldPointerPosition'
import { findDetachedCubePositions } from '../../utils/findDetachedCubePositions'
import { moveStuckCubes } from '../../utils/moveStuckCubes'
import { snapCubePosition } from '../../utils/snapCubePosition'
import { getOtherCubeId } from '../../utils/getOtherCubeId'

type FieldProps = {
  cubeColors: CubeColors
  cubePositions: CubePositions
  cubeAttachment: CubeAttachment
  selectedCubeId: CubeId | null
  onSelectCube: (cubeId: CubeId) => void
  onUpdateCubePosition: (
    cubeId: CubeId,
    position: CubePosition,
    attachment: CubeAttachment,
    linkedCube?: LinkedCube,
  ) => void
  children?: ReactNode
}

const Field = ({
  cubeColors,
  cubePositions,
  cubeAttachment,
  selectedCubeId,
  onSelectCube,
  onUpdateCubePosition,
  children,
}: FieldProps) => {
  const fieldRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)

  const handlePointerDown = (cubeId: CubeId, event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }

    const fieldElement = fieldRef.current

    if (fieldElement === null) {
      return
    }

    const pointerPosition = getFieldPointerPosition(event, fieldElement)
    const cubePosition = cubePositions[cubeId]

    dragRef.current = {
      cubeId,
      pointerId: event.pointerId,
      offsetX: pointerPosition.x - cubePosition.x,
      offsetY: pointerPosition.y - cubePosition.y,
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    onSelectCube(cubeId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragRef.current
    const fieldElement = fieldRef.current

    if (
      dragState === null ||
      fieldElement === null ||
      event.pointerId !== dragState.pointerId
    ) {
      return
    }

    const pointerPosition = getFieldPointerPosition(event, fieldElement)
    const cubeElement = event.currentTarget
    const desiredPosition = {
      x: pointerPosition.x - dragState.offsetX,
      y: pointerPosition.y - dragState.offsetY,
    }
    const otherCubeId = getOtherCubeId(dragState.cubeId)

    if (cubeAttachment.stuck) {
      const otherElement = fieldElement.querySelector<HTMLElement>(`:scope > .${otherCubeId}`)

      if (otherElement === null) {
        return
      }

      const positions = moveStuckCubes(
        desiredPosition,
        cubePositions,
        dragState.cubeId,
        {
          width: cubeElement.offsetWidth,
          height: cubeElement.offsetHeight,
        },
        {
          width: otherElement.offsetWidth,
          height: otherElement.offsetHeight,
        },
        {
          width: fieldElement.clientWidth,
          height: fieldElement.clientHeight,
        },
      )

      onUpdateCubePosition(dragState.cubeId, positions[dragState.cubeId], cubeAttachment, {
        cubeId: otherCubeId,
        position: positions[otherCubeId],
      })
      return
    }

    const clampedPosition = clampCubePosition(desiredPosition, fieldElement, cubeElement)
    const snapResult = snapCubePosition(
      clampedPosition,
      cubePositions[otherCubeId],
      dragState.cubeId,
      {
        width: cubeElement.offsetWidth,
        height: cubeElement.offsetHeight,
      },
      {
        width: fieldElement.clientWidth,
        height: fieldElement.clientHeight,
      },
    )

    onUpdateCubePosition(dragState.cubeId, snapResult.position, snapResult.attachment)
  }

  const handleDetach = () => {
    if (!cubeAttachment.stuck) {
      return
    }

    const fieldElement = fieldRef.current

    if (fieldElement === null) {
      return
    }

    const cubeElements = CUBE_IDS.map((cubeId) =>
      fieldElement.querySelector<HTMLElement>(`:scope > .${cubeId}`),
    )

    if (cubeElements.some((cubeElement) => cubeElement === null)) {
      return
    }

    const [cube1Element, cube2Element] = cubeElements as [HTMLElement, HTMLElement]
    const nextPositions = findDetachedCubePositions(
      cubePositions,
      {
        'cube-1': {
          width: cube1Element.offsetWidth,
          height: cube1Element.offsetHeight,
        },
        'cube-2': {
          width: cube2Element.offsetWidth,
          height: cube2Element.offsetHeight,
        },
      },
      {
        width: fieldElement.clientWidth,
        height: fieldElement.clientHeight,
      },
      (position, cubeId) =>
        clampCubePosition(
          position,
          fieldElement,
          cubeId === 'cube-1' ? cube1Element : cube2Element,
        ),
    )

    dragRef.current = null
    onUpdateCubePosition('cube-1', nextPositions['cube-1'], DETACHED_CUBES, {
      cubeId: 'cube-2',
      position: nextPositions['cube-2'],
    })
  }

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragRef.current

    if (dragState === null || event.pointerId !== dragState.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    dragRef.current = null
  }

  return (
    <div
      className="field"
      ref={fieldRef}
      data-cubes-stuck={cubeAttachment.stuck ? 'true' : 'false'}
      data-snap-side={cubeAttachment.side ?? undefined}
    >
      {CUBE_IDS.map((cubeId) => (
        <Cube
          key={cubeId}
          cubeId={cubeId}
          color={cubeColors[cubeId]}
          position={cubePositions[cubeId]}
          selected={selectedCubeId === cubeId}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
        />
      ))}
      <DetachButton disabled={!cubeAttachment.stuck} onDetach={handleDetach} />
      {children}
    </div>
  )
}

export default Field
