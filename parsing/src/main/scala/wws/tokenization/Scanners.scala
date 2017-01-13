package wws.tokenization

import scala.annotation.tailrec
import scala.util.parsing.combinator.Parsers
import scala.util.parsing.input.{CharArrayReader, OffsetPosition, Position, Reader}

/**
  * Created by weil1 on 10/27/16.
  */
abstract class Scanners extends Parsers with Tokens {
  type Elem = Char

  /** This token is produced by a scanner `Scanner` when scanning failed. */
  def errorToken(msg: String): ErrorToken

  /** A parser that produces a token (from a stream of characters). */
  def token: Parser[Token]

  /** A parser for white-space -- its result will be discarded. */
  def whitespace: Parser[Any]

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

  /** `Scanner` is essentially¹ a parser that produces `Token`s
    * from a stream of characters. The tokens it produces are typically
    * passed to parsers in `TokenParsers`.
    *
    * @note ¹ `Scanner` is really a `Reader` of `Token`s
    */
  class Scanner(in: Reader[Char]) extends Reader[TokenMatch] {
    /** Convenience constructor (makes a character reader out of the given string) */
    def this(in: String) = this(new CharArrayReader(in.toCharArray()))

    private val (tokenMatch, rest1, rest2) = whitespace(in) match {
      case Success(_, in1) =>
        token(in1) match {
          case Success(tok, in2) => (new TokenMatch(tok, in1.pos, left(in2.pos)), in1, in2)
          case ns: NoSuccess => (new TokenMatchError(errorToken(ns.msg)), ns.next, skip(ns.next))
        }
      case ns: NoSuccess => (new TokenMatchError(errorToken(ns.msg)), ns.next, skip(ns.next))
    }

    private def skip(in: Reader[Char]) = if (in.atEnd) in else in.rest

    override def source: java.lang.CharSequence = in.source

    override def offset: Int = in.offset

    def first = tokenMatch.asInstanceOf[TokenMatch]

    def rest = new Scanner(rest2)

    def pos = rest1.pos

    def atEnd = in.atEnd || (whitespace(in) match {
      case Success(_, in1) => in1.atEnd
      case _ => false
    })

    /**
      * retrieve all the tokens from the input sequence
      */
    def tokens: Seq[Token] = {
      extractTokens(this, List.empty)
    }

    @tailrec
    private def extractTokens(scanner: Scanner, tokens: Seq[Token]): Seq[Token] = {
      if (scanner.atEnd)
        tokens
      else
        extractTokens(scanner.rest, tokens :+ scanner.first.token)
    }
  }

}