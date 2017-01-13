package wws.tokenization

import util.parsing.input.{OffsetPosition, Position}

trait Tokens {

  /**
    * Created by weil1 on 11/25/16.
    */
  abstract class Token {
    def chars: String
  }

  case class RawToken(text: String) extends Token {
    override def chars: String = text
  }

  object EOF extends Token {
    override def chars = "__EOF__"
  }

  abstract class TokenMatchBase

  case class TokenMatchError(token: ErrorToken) extends  TokenMatchBase
  case class TokenMatch(token: Token, start: OffsetPosition, end: OffsetPosition) extends TokenMatchBase

  /** A class of error tokens. Error tokens are used to communicate
    * errors detected during lexical analysis
    */
  case class ErrorToken(msg: String) extends Token {
    def chars = "*** error: " + msg
  }

  object HeadPosition extends Position {
    override def line: Int = 0

    override def column: Int = 0

    override def toString(): String = "Input start"

    override def lineContents: String = "Empty content"
  }

  def errorTokenMatch(errorToken: ErrorToken): TokenMatchBase = {
      new TokenMatchError(errorToken)
  }
}