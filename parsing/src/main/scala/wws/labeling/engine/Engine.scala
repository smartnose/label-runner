package wws.labeling.engine

import wws.labeling.client.{Segment, SegmentKind, Segmentation, SegmentedQuery}
import wws.tokenization.{Lexer, Tokens}

import scala.util.parsing.input.{OffsetPosition, Position}

/**
  * Created by weil1 on 11/25/16.
  */
object Engine extends Tokens {
  type Scanner = Lexer.Scanner
  type TokenMatch = Lexer.Token

  def tokenize(query: String) = {
    val scanner = new Scanner(query)
    extractTokens(scanner, List.empty[TokenMatch])
  }

  implicit def position2offset(position: Position): Int = {
    position match {
      case pos: OffsetPosition => pos.offset
      case _ => -1
    }
  }

  def touching(left: Position, right: Position) = {
    val leftOffset: Int = left
    val rightOffset: Int = right
    leftOffset + 1 == rightOffset
  }

  def segment(query: String, tokens: List[TokenMatch]): SegmentedQuery = {
    val headPosition = new OffsetPosition(query, 0)
    val foldInitial: Tuple2[List[Segment], Option[TokenMatch]] = (List.empty[Segment], None)
    val (segments, _) = tokens.foldLeft(foldInitial)((aggregate, current) => {
      val currentSegment = new Segment(current.start, current.end, SegmentKind.Token)
      val newSegments: List[Segment] = {
        aggregate match {
          case (segments, previous) => {
            segments match {
              case Nil => {
                if (!isInputHead(current.start)) {
                  val leadingSeparator = new Segment(headPosition.offset, current.start, SegmentKind.Separator)
                  leadingSeparator :: currentSegment :: Nil
                } else {
                  currentSegment :: Nil
                }
              }
              case _ => {
                previous match {
                  case Some(previousToken) => {
                    if (!touching(previousToken.end, current.start)) {
                      val separator = new Segment(previousToken.end, current.start, SegmentKind.Separator)
                      segments ++ (separator :: currentSegment :: Nil)
                    } else {
                      segments :+ currentSegment
                    }
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

  def isInputHead(pos: Position) = {
    pos.column == 0 && pos.line == 0
  }

  private def extractTokens(scanner: Scanner, tokens: List[TokenMatch]): List[TokenMatch] = {
    if (scanner.atEnd) tokens else scanner.first :: extractTokens(scanner.rest, tokens)
  }
}
