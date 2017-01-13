package wws.tokenization

import wws.tokenization.ExtendedTokens.{FloatLit, IntegerLit}

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

  def number = opt(sign) ~ intPart ~ opt(fracPart) ~ opt(expPart) ^^ { case s ~ i ~ f ~ e =>
    val tokenText = optString("", s) + i + optString(".", f) + optString("", e)
    f match {
      case None => IntegerLit(tokenText, tokenText.toInt)
      case _ => FloatLit(tokenText, tokenText.toDouble)
    }
  }

  def intPart = zero | intList
  def intList = nonzero ~ rep(digit) ^^ {case x ~ y => (x :: y) mkString ""}
  def fracPart = '.' ~> rep(digit) ^^ { _ mkString "" }
  def expPart = exponent ~ opt(sign) ~ rep1(digit) ^^ { case e ~ s ~ d =>
    e + optString("", s) + d.mkString("")
  }

  private def optString[A](pre: String, a: Option[A]) = a match {
    case Some(x) => pre + x.toString
    case None => ""
  }

  def zero: Parser[String] = '0' ^^^ "0"
  def nonzero = elem("nonzero digit", d => d.isDigit && d != '0')
  def exponent = elem("exponent character", d => d == 'e' || d == 'E')
  def sign = elem("sign character", d => d == '-' || d == '+')

  /** A character-parser that matches a digit (and returns it).*/
  def digit = elem("digit", _.isDigit)
}