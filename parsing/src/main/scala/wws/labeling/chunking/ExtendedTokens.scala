package wws.labeling.chunking

import wws.tokenization.Lexer.Token

/**
  * Created by weil1 on 1/12/17.
  */
object ExtendedTokens {
  case class IntegerLit(text: String, value: Int) extends Token
  case class FloatLit(text: String, value: Double) extends Token
}
