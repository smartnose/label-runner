package wws.labeling.client

import spray.json._

import scala.util.parsing.input.OffsetPosition
/**
  * Created by weil1 on 11/27/16.
  */
class LabelerJsonProtocal extends DefaultJsonProtocol {
  import Segments._
  implicit val positionFormat = jsonFormat3(ClientPosition)
  implicit val segmentFormat = jsonFormat3(Segment)
}
