package wws.labeling.client

/**
  * Created by weil1 on 11/24/16.
  */
case class Segment(start: Int, end: Int, segmentKind: SegmentKind.Value)

object SegmentKind extends Enumeration {
  val Token, Separator = Value
}

case class Segmentation(segments: List[Segment])

case class SegmentedQuery(query: String, segmentation: Segmentation)