package wws.labeling.client

import spray.json._

/**
  * Created by weil1 on 11/27/16.
  */
object LabelerJsonProtocal extends DefaultJsonProtocol {
  import Segments._
  implicit val positionFormat = jsonFormat3(ClientPosition)
  implicit val segmentFormat = jsonFormat3(Segment)
  implicit val segmentationFormat = jsonFormat1(Segmentation)
  implicit val segmentedQueryFormat = jsonFormat2(SegmentedQuery)
}
