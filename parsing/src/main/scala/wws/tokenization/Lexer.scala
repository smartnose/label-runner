package wws.tokenization

import scala.annotation.tailrec
import scala.collection.{Seq}
import scala.util.parsing.combinator.ImplicitConversions
import scala.util.parsing.input.CharArrayReader.EofCh

/**
  * Created by weil1 on 11/25/16.
  */
object Lexer extends Lexical with ImplicitConversions with Tokens {
  override type Token = TokenMatch

  override def token = TokenParser

  override def errorToken(msg: String): TokenMatch = {
    errorTokenMatch(new ErrorToken(msg))
  }

  object TokenParser extends Parser[TokenMatch] {
    var end: Input = _

    def apply(input: Input): ParseResult[TokenMatch] = {
      end = input

      @tailrec
      def foldRight(in: Input, chars: Seq[Char]): Seq[Char] = {
        if (isWhitespace(in.first) || in.first == EofCh)
          chars
        else {
          end = in.rest
          foldRight(in.rest, chars :+ in.first)
        }
      }

      val chars = foldRight(input, List.empty)
      if (chars.length == 0)
        return new Failure("end of unknown word", end)

      val tokenStr = chars.mkString
      val token = new RawToken(tokenStr);
      new Success(new TokenMatch(token, input.pos, end.pos), end)
    }
  }
}
