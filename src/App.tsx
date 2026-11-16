import { useState } from 'react'
import './App.css'
import ColorControls from './components/ColorControls/ColorControls'
import Field from './components/Field/Field'
import type {
  CubeAttachment,
  CubeColor,
  CubeColors,
  CubeId,
  CubePosition,
  CubePositions,
} from './types/cube.types'
import { DETACHED_CUBES } from './constants/cube.constants'

const App = () => {
  const [selectedCubeId, setSelectedCubeId] = useState<CubeId | null>(null)
  const [cubeColors, setCubeColors] = useState<CubeColors>({
    'cube-1': 'red',
    'cube-2': 'blue',
  })
  const [cubePositions, setCubePositions] = useState<CubePositions>({
    'cube-1': { x: 100, y: 100 },
    'cube-2': { x: 300, y: 300 },
  })
  const [cubeAttachment, setCubeAttachment] = useState<CubeAttachment>(DETACHED_CUBES)

  const selectCube = (cubeId: CubeId) => {
    setSelectedCubeId(cubeId)
  }

  const changeColor = (color: CubeColor) => {
    if (selectedCubeId === null) {
      return
    }

    setCubeColors((prevState) => ({
      ...prevState,
      [selectedCubeId]: color,
    }))
  }

  const updateCubePosition = (
    cubeId: CubeId,
    position: CubePosition,
    attachment: CubeAttachment,
    linkedCube?: { cubeId: CubeId; position: CubePosition },
  ) => {
    setCubePositions((prevState) => ({
      ...prevState,
      [cubeId]: position,
      ...(linkedCube === undefined ? {} : { [linkedCube.cubeId]: linkedCube.position }),
    }))
    setCubeAttachment((prevState) => {
      if (prevState.stuck === attachment.stuck && prevState.side === attachment.side) {
        return prevState
      }

      return attachment
    })
  }

  return (
    <div className="app">
      <Field
        cubeColors={cubeColors}
        cubePositions={cubePositions}
        cubeAttachment={cubeAttachment}
        selectedCubeId={selectedCubeId}
        onSelectCube={selectCube}
        onUpdateCubePosition={updateCubePosition}
      >
        <ColorControls 
        selectedColor={selectedCubeId === null ? null : cubeColors[selectedCubeId]}
        onChangeColor={changeColor} />
      </Field>
    </div>
  )
}

export default App
