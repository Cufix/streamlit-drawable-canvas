import { fabric } from "fabric"
import FabricTool, { ConfigureCanvasProps } from "./fabrictool"

class PolylineTool extends FabricTool {
  isMouseDown: boolean = false
  strokeWidth: number = 10
  strokeColor: string = "#ffffff"
  currentLine: fabric.Line | null = null
  points: fabric.Point[] = []
  currentPath: fabric.Path | null = null
  _pathString: string = "M "

  configureCanvas({
    strokeWidth,
    strokeColor,
  }: ConfigureCanvasProps): () => void {
    this._canvas.isDrawingMode = false
    this._canvas.selection = false
    this._canvas.forEachObject((o) => (o.selectable = o.evented = false))

    this.strokeWidth = strokeWidth
    this.strokeColor = strokeColor
    this.points = []
    this._pathString = "M "
    this.currentPath = null
    this.currentLine = null

    this._canvas.on("mouse:down", (e: any) => this.onMouseDown(e))
    this._canvas.on("mouse:move", (e: any) => this.onMouseMove(e))
    this._canvas.on("mouse:up", (e: any) => this.onMouseUp(e))
    this._canvas.on("mouse:out", (e: any) => this.onMouseOut(e))
    this._canvas.on("mouse:dblclick", (e: any) => this.onMouseDoubleClick(e))
    return () => {
      this._canvas.off("mouse:down")
      this._canvas.off("mouse:move")
      this._canvas.off("mouse:up")
      this._canvas.off("mouse:out")
      this._canvas.off("mouse:dblclick")
    }
  }

  onMouseDown(o: any) {
    let canvas = this._canvas
    let _clicked = o.e["button"]
    
    // Right click to finish the polyline
    if (_clicked === 2) {
      // Remove the preview line if it exists
      if (this.currentLine) {
        canvas.remove(this.currentLine)
        this.currentLine = null
      }
      
      // Keep the completed path on canvas but reset for new path
      this.currentPath = null
      this._pathString = "M "
      this.points = []
      canvas.renderAll()
      return
    }

    var pointer = canvas.getPointer(o.e)

    if (this._pathString === "M ") {
      // First point
      this._pathString += `${pointer.x} ${pointer.y}`
      this.points = [new fabric.Point(pointer.x, pointer.y)]
    } else {
      // Add line to next point
      this._pathString += ` L ${pointer.x} ${pointer.y}`
      this.points.push(new fabric.Point(pointer.x, pointer.y))
    }

    // Remove current path if it exists
    if (this.currentPath) {
      canvas.remove(this.currentPath)
    }

    // Create new path
    this.currentPath = new fabric.Path(this._pathString, {
      strokeWidth: this.strokeWidth,
      stroke: this.strokeColor,
      fill: "",
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
    })

    canvas.add(this.currentPath)
    canvas.renderAll()
  }

  onMouseMove(o: any) {
    if (this.points.length === 0) return
    
    let canvas = this._canvas
    var pointer = canvas.getPointer(o.e)
    
    // Update or create the preview line
    if (this.currentLine) {
      canvas.remove(this.currentLine)
    }
    
    const lastPoint = this.points[this.points.length - 1]
    this.currentLine = new fabric.Line(
      [lastPoint.x, lastPoint.y, pointer.x, pointer.y],
      {
        strokeWidth: this.strokeWidth,
        fill: this.strokeColor,
        stroke: this.strokeColor,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5], // Make it dashed to show it's a preview
      }
    )
    canvas.add(this.currentLine)
    canvas.renderAll()
  }

  onMouseUp(o: any) {
    // Nothing special needed here
  }

  onMouseOut(o: any) {
    if (this.currentLine) {
      this._canvas.remove(this.currentLine)
      this.currentLine = null
      this._canvas.renderAll()
    }
  }

  onMouseDoubleClick(o: any) {
    // Double click to remove the last point
    if (this.points.length > 0) {
      this.points.pop()
      
      // Rebuild the path string from remaining points
      if (this.points.length > 0) {
        this._pathString = `M ${this.points[0].x} ${this.points[0].y}`
        for (let i = 1; i < this.points.length; i++) {
          this._pathString += ` L ${this.points[i].x} ${this.points[i].y}`
        }
      } else {
        this._pathString = "M "
      }

      // Remove existing path
      if (this.currentPath) {
        this._canvas.remove(this.currentPath)
      }

      // Create new path if we still have points
      if (this.points.length > 0) {
        this.currentPath = new fabric.Path(this._pathString, {
          strokeWidth: this.strokeWidth,
          stroke: this.strokeColor,
          fill: "",
          originX: "center",
          originY: "center",
          selectable: false,
          evented: false,
        })
        this._canvas.add(this.currentPath)
      }
      
      this._canvas.renderAll()
    }
  }
}

export default PolylineTool 