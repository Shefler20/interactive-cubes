import type { PointerEvent } from "react"

export const getFieldPointerPosition = (
    event: PointerEvent<HTMLDivElement>,
    fieldElement: HTMLDivElement,
  ) => {
    const fieldRect = fieldElement.getBoundingClientRect()
  
    return {
      x: event.clientX - fieldRect.left - fieldElement.clientLeft,
      y: event.clientY - fieldRect.top - fieldElement.clientTop,
    }
  }