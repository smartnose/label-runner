package wws.labeling.chunking

import scala.util.parsing.combinator.Parsers
import scala.util.parsing.input.CharArrayReader

/**
  * Created by weil1 on 1/12/17.
  * The basic lexer simply splits the input based on whitespaces.
  * On top of that, we use this parser to recognize interesting tokens
  * such as numbers
  */
object ExtendedTokenizer extends Parsers {
  import ExtendedTokens._
  override type Elem = Char

  def parse(text: String) = {
    val input  = new CharArrayReader(text.toCharArray())
    extendedToken.apply(input).get
  }

  def extendedToken = number
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
