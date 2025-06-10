import CircleTool from "./circle"
import FabricTool from "./fabrictool"
import FreedrawTool from "./freedraw"
import LineTool from "./line"
import PolygonTool from "./polygon"
import RectTool from "./rect"
import TransformTool from "./transform"
import PointTool from "./point"
import PolylineTool from "./polyline"

// TODO: Should make TS happy on the Map of selectedTool --> FabricTool
const tools: any = {
  circle: CircleTool,
  freedraw: FreedrawTool,
  line: LineTool,
  polygon: PolygonTool,
  polyline: PolylineTool,
  rect: RectTool,
  transform: TransformTool,
  point: PointTool
}

export { tools, FabricTool }
