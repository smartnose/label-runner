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

  def tokenEndingGuard = Parser { in =>
    if (in.atEnd) Success(0, in)
    else {
      val ch = in.first
      if(isWhitespace(ch) || ch == EofCh)
        Success(ch, in)
      else
        Failure("not a valid ending position for the token", in)
    }
  }

  // see `whitespace in `Scanners`
  // TODO - generalize this to separators to include commas or any other custommized symbols
  // These symbols should be loaded dynamically from user plugin.
  def whitespace: Parser[Any] = rep[Any](whitespaceChar)

  /** A character-parser that matches a white-space character (and returns it). */
  def whitespaceChar = elem("space char", ch => isWhitespace(ch))

  def number = opt(sign) ~ (floatNumber | integerNumber) ^^ {
    case s ~ n => {
      val factor = s match {
        case Some(letter) => if(letter == '-') -1 else 1
        case _ => 1
      }
      val prefix = s.getOrElse("")
      n match {
        case IntegerLit(i, v) => IntegerLit(prefix + i, v * factor)
        case FloatLit(f, v) => FloatLit(prefix + f, v * factor)
      }
    }
  }

  def integerNumber = intPart <~ tokenEndingGuard ^^ {
    case i => IntegerLit(i, i.toInt)
  }

  def floatNumber = intPart ~ fracPart ~ expPart <~ tokenEndingGuard ^^ { case i ~ f ~ e =>
      val tokenText = i + "." + f + e
      FloatLit(tokenText, tokenText.toDouble)
  } | intPart ~ fracPart ^^ {
    case i ~ f =>
      val tokenText = i + "." + f
      FloatLit(tokenText, tokenText.toDouble)
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