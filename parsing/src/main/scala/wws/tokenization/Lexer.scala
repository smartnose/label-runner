package wws.tokenization

import scala.annotation.tailrec
import scala.collection.Seq
import scala.util.parsing.combinator.ImplicitConversions
import scala.util.parsing.input.CharArrayReader.EofCh
import scala.util.parsing.input.{OffsetPosition, Position}

/**
  * Created by weil1 on 11/25/16.
  */
object Lexer extends Lexical with ImplicitConversions with Tokens {

  override def token = number | TokenParser

  override def errorToken(msg: String): ErrorToken = {
    new ErrorToken(msg)
  }

  private def validTokenEnding(input: Input) = isWhitespace(input.first) || input.first == EofCh

  object TokenParser extends Parser[Token] {

    def apply(input: Input): ParseResult[Token] = {
      var rest = input

      @tailrec
      def foldRight(in: Input, chars: Seq[Char]): Seq[Char] = {
        if (validTokenEnding(in))
          chars
        else {
          rest = in.rest
          foldRight(in.rest, chars :+ in.first)
        }
      }

      val chars = foldRight(input, List.empty)
      if (chars.length == 0)
        return new Failure("end of unknown word", rest)

      val tokenStr = chars.mkString
      val token = new RawToken(tokenStr);
      new Success(token, rest)
    }
  }
}
