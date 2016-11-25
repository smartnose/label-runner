package wws.tokenization

import scala.util.parsing.input.Position

trait Tokens {

  /**
    * Created by weil1 on 11/25/16.
    */
  abstract class TokenBase {
    def chars: String
  }

  case class RawToken(text: String) extends TokenBase {
    override def chars: String = text
  }

  object EOF extends TokenBase {
    override def chars = "__EOF__"
  }

  case class TokenMatch(token: TokenBase, start: Position, end: Position)

  /** A class of error tokens. Error tokens are used to communicate
    * errors detected during lexical analysis
    */
  case class ErrorToken(msg: String) extends TokenBase {
    def chars = "*** error: " + msg
  }

  object UnknownPosition extends Position {
    override def line: Int = -1

    override def column: Int = -1

    override def toString = "Unknown position"

    override def lineContents: String = "Unknown content"
  }

  object HeadPosition extends Position {
    override def line: Int = 0

    override def column: Int = 0

    override def toString(): String = "Input start"

    override def lineContents: String = "Empty content"
  }

  def errorTokenMatch(errorToken: ErrorToken): TokenMatch = {
    new TokenMatch(errorToken, UnknownPosition, UnknownPosition)
  }
}