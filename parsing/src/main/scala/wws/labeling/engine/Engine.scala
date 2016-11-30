package wws.labeling.engine

import wws.labeling.client._
import wws.tokenization.Lexer

import scala.util.parsing.input.{OffsetPosition, Position}

/**
  * Created by weil1 on 11/25/16.
  */
object Engine {

  import Lexer._
  import Segments._

  def createSegmentation(query: String) = {
    val tokens = tokenize(query)
    segment(query, tokens)
  }

  def tokenize(query: String) = {
    val scanner = new Scanner(query)
    extractTokens(scanner, List.empty[TokenMatch])
  }

  implicit def Offset2ClientPosition(offset: OffsetPosition) = {
    new ClientPosition(offset.line, offset.column, offset.offset)
  }

  def segment(query: String, tokens: List[TokenMatch]): SegmentedQuery = {
    val headPosition = new OffsetPosition(query, 0)

    if(query.length == 0) {
      return new SegmentedQuery(query, new Segmentation(List.empty[Segment]))
    }

    if(tokens.length == 0) {
      val tailPosition = new OffsetPosition(query, query.length - 1)
      val segmentation = new Segmentation(new Segment(headPosition, tailPosition, Segments.Separator) :: Nil)
      return new SegmentedQuery(query, segmentation)
    }

    val foldInitial: (List[Segment], Option[TokenMatch]) = (List.empty[Segment], None)
    val (segments, _) = tokens.foldLeft(foldInitial)((aggregate, current) => {
      val currentSegment = new Segment(current.start, current.end, Token)
      val newSegments: List[Segment] = {
        aggregate match {
          case (segments, previous) => {
            segments match {
              case Nil => {
                if (!isInputHead(current.start)) {
                  val leadingSeparator = new Segment(headPosition, left(current.start), Separator)
                  leadingSeparator :: currentSegment :: Nil
                } else {
                  currentSegment :: Nil
                }
              }
              case _ => {
                previous match {
                  case Some(previousToken) => {
                    if (!touching(previousToken.end, current.start)) {
                      val separator = new Segment(right(previousToken.end), left(current.start), Separator)
                      segments ++ (separator :: currentSegment :: Nil)
                    } else {
                      segments :+ currentSegment
                    }
                  }
                  case None => {
                    throw new RuntimeException("Logical error in the lexer. The previous token can never be None if previous segments are not empty")
                  }
                }
              }
            }
          }
        }
      }
      (newSegments, Some(current))
    })
    new SegmentedQuery(query, new Segmentation(segments))
  }

  private def touching(l: OffsetPosition, r: OffsetPosition) = {
    l == left(r)
  }

  private def isInputHead(pos: OffsetPosition) = {
    pos.offset == 0
  }

  private def extractTokens(scanner: Scanner, tokens: List[TokenMatch]): List[TokenMatch] = {
    if (scanner.atEnd) tokens
    else {
      scanner.first match {
        case tm: TokenMatch =>
          extractTokens(scanner.rest, tokens :+ tm)
        case err: TokenMatchError =>
          // TODO - handle matching error more elegantly
          throw new RuntimeException("Should never have matching error for the moment")
      }
    }
  }
}
