package wws.labeling.client

object Segments {

  case class ClientPosition(line: Int, column: Int, offset: Int)

  /**
    * Created by weil1 on 11/24/16.
    */
  case class Segment(start: ClientPosition, end: ClientPosition, segmentKind: Int)

  case class Segmentation(segments: List[Segment])

  case class SegmentedQuery(query: String, segmentation: Segmentation)

  val Token = 0

  val Separator = 1
}