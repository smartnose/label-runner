package wws.tokenization

import scala.util.parsing.combinator.lexical.Scanners

import scala.util.parsing.input.CharArrayReader.EofCh

/**
  * Created by weil1 on 11/24/16.
  */
/**
  * Created by weil1 on 10/27/16.
  */
abstract class Lexical extends Scanners {

  def isWhitespace(ch: Char): Boolean = {
    ch <= ' ' && ch != EofCh
  }

  // see `whitespace in `Scanners`
  // TODO - generalize this to separators to include commas or any other custommized symbols
  // These symbols should be loaded dynamically from user plugin.
  def whitespace: Parser[Any] = rep[Any](whitespaceChar)

  /** A character-parser that matches a white-space character (and returns it). */
  def whitespaceChar = elem("space char", ch => isWhitespace(ch))
}