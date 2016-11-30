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
  override type Token = TokenMatchBase

  override def token = TokenParser

  override def errorToken(msg: String): Token = {
    errorTokenMatch(new ErrorToken(msg))
  }

  def left(pos: OffsetPosition) = {
    new OffsetPosition(pos.source, pos.offset - 1)
  }

  def right(pos: OffsetPosition) = {
    new OffsetPosition(pos.source, pos.offset + 1)
  }

  implicit def position2offsetPosition(position: Position) = {
    require(position.isInstanceOf[OffsetPosition])
    position.asInstanceOf[OffsetPosition]
  }

  object TokenParser extends Parser[TokenMatch] {

    def apply(input: Input): ParseResult[TokenMatch] = {
      var rest = input

      @tailrec
      def foldRight(in: Input, chars: Seq[Char]): Seq[Char] = {
        if (isWhitespace(in.first) || in.first == EofCh)
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
      new Success(new TokenMatch(token, input.pos, left(rest.pos)), rest)
    }
  }
}
